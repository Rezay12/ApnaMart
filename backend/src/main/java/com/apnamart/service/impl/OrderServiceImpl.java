package com.apnamart.service.impl;

import com.apnamart.dto.request.OrderCreateRequest;
import com.apnamart.dto.response.*;
import com.apnamart.entity.*;
import com.apnamart.enums.OrderStatus;
import com.apnamart.enums.PaymentMethod;
import com.apnamart.enums.PaymentStatus;
import com.apnamart.enums.Role;
import com.apnamart.enums.StoreApprovalStatus;
import com.apnamart.exception.BadRequestException;
import com.apnamart.exception.InsufficientStockException;
import com.apnamart.exception.ResourceNotFoundException;
import com.apnamart.exception.UnauthorizedException;
import com.apnamart.repository.*;
import com.apnamart.service.OrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final PickupSlotRepository pickupSlotRepository;
    private final StoreRepository storeRepository;
    private final UserRepository userRepository;
    private final CouponRepository couponRepository;

    private final SecureRandom random = new SecureRandom();

    public OrderServiceImpl(OrderRepository orderRepository,
                            OrderItemRepository orderItemRepository,
                            CartRepository cartRepository,
                            CartItemRepository cartItemRepository,
                            ProductRepository productRepository,
                            PickupSlotRepository pickupSlotRepository,
                            StoreRepository storeRepository,
                            UserRepository userRepository,
                            CouponRepository couponRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.pickupSlotRepository = pickupSlotRepository;
        this.storeRepository = storeRepository;
        this.userRepository = userRepository;
        this.couponRepository = couponRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse previewOrder(String customerEmail, Long pickupSlotId) {
        return previewOrder(customerEmail, pickupSlotId, null);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse previewOrder(String customerEmail, Long pickupSlotId, String couponCode) {
        Cart cart = getCartWithValidation(customerEmail);
        PickupSlot slot = pickupSlotRepository.findById(pickupSlotId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup slot not found"));

        if (!slot.hasAvailableCapacity()) {
            throw new BadRequestException("Selected pickup slot is no longer available or at full capacity");
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItemResponse> previewItems = new ArrayList<>();

        for (CartItem item : cart.getItems()) {
            Product product = item.getProduct();
            if (!product.isActive() || product.getAvailableQuantity() < item.getQuantity()) {
                throw new InsufficientStockException("Insufficient stock for item: " + product.getProductName() +
                        ". Available: " + product.getAvailableQuantity() + ", requested: " + item.getQuantity());
            }

            BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            subtotal = subtotal.add(lineTotal);

            OrderItemResponse itemDto = new OrderItemResponse();
            itemDto.setProductId(product.getId());
            itemDto.setProductName(product.getProductName());
            itemDto.setUnitPrice(product.getPrice());
            itemDto.setQuantity(item.getQuantity());
            itemDto.setLineTotal(lineTotal);
            previewItems.add(itemDto);
        }

        BigDecimal discountAmount = BigDecimal.ZERO;
        String appliedCode = null;

        if (couponCode != null && !couponCode.trim().isEmpty()) {
            String code = couponCode.trim().toUpperCase();
            Coupon coupon = couponRepository.findByCodeIgnoreCase(code).orElse(null);
            if (coupon != null && coupon.isCurrentlyValid()) {
                boolean storeMatches = (coupon.getStore() == null || coupon.getStore().getId().equals(cart.getStore().getId()));
                boolean meetsMin = (coupon.getMinOrderAmount() == null || subtotal.compareTo(coupon.getMinOrderAmount()) >= 0);
                if (storeMatches && meetsMin) {
                    discountAmount = coupon.calculateDiscount(subtotal);
                    appliedCode = coupon.getCode();
                }
            }
        }

        BigDecimal totalAmount = subtotal.subtract(discountAmount).max(BigDecimal.ZERO);

        OrderResponse response = new OrderResponse();
        response.setStoreId(cart.getStore().getId());
        response.setStoreName(cart.getStore().getStoreName());
        response.setStoreAddress(cart.getStore().getAddress() + ", " + cart.getStore().getLocality() + ", " + cart.getStore().getCity());
        response.setPickupSlotId(slot.getId());
        response.setPickupDate(slot.getPickupDate().toString());
        response.setPickupTime(slot.getStartTime() + " - " + slot.getEndTime());
        response.setSubtotal(subtotal);
        response.setDiscountAmount(discountAmount);
        response.setCouponCode(appliedCode);
        response.setTotalAmount(totalAmount);
        response.setItems(previewItems);
        return response;
    }

    @Override
    @Transactional
    public OrderResponse placeOrder(String customerEmail, OrderCreateRequest request) {
        Cart cart = getCartWithValidation(customerEmail);
        User customer = cart.getCustomer();
        Store store = cart.getStore();

        // 1. Reserve pickup slot capacity atomically
        int slotReserved = pickupSlotRepository.reserveCapacityIfAvailable(request.getPickupSlotId());
        if (slotReserved == 0) {
            throw new BadRequestException("The selected pickup slot is fully booked. Please select another slot.");
        }

        PickupSlot slot = pickupSlotRepository.findById(request.getPickupSlotId())
                .orElseThrow(() -> new ResourceNotFoundException("Pickup slot not found"));

        // 2. Build Order and atomically decrement stock for each item
        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setCustomer(customer);
        order.setStore(store);
        order.setPickupSlot(slot);
        order.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : PaymentMethod.CASH_ON_PICKUP);
        order.setPaymentStatus(PaymentStatus.PENDING);
        order.setOrderStatus(OrderStatus.PENDING);
        order.setCustomerNote(request.getCustomerNote());

        for (CartItem item : cart.getItems()) {
            Product product = item.getProduct();
            int qty = item.getQuantity();

            // Atomic conditional stock decrement protects against concurrent checkouts
            int updated = productRepository.decrementStockIfAvailable(product.getId(), qty);
            if (updated == 0) {
                throw new InsufficientStockException("Insufficient stock for product: " + product.getProductName() +
                        ". Someone may have just purchased it.");
            }

            BigDecimal unitPrice = product.getPrice();
            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(qty));
            subtotal = subtotal.add(lineTotal);

            // Snapshot product name and unit price to preserve historical accuracy
            OrderItem orderItem = new OrderItem(
                    order,
                    product,
                    product.getProductName(),
                    unitPrice,
                    qty,
                    lineTotal
            );
            orderItems.add(orderItem);
        }

        order.setSubtotal(subtotal);

        // 2.1 Validate and apply coupon if provided
        BigDecimal discountAmount = BigDecimal.ZERO;
        if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
            String code = request.getCouponCode().trim().toUpperCase();
            Coupon coupon = couponRepository.findByCodeIgnoreCase(code)
                    .orElseThrow(() -> new BadRequestException("Invalid promo code: " + code));

            if (!coupon.isCurrentlyValid()) {
                throw new BadRequestException("Promo code " + code + " is no longer valid or has expired");
            }

            if (coupon.getStore() != null && !coupon.getStore().getId().equals(store.getId())) {
                throw new BadRequestException("Promo code " + code + " is only valid for " + coupon.getStore().getStoreName());
            }

            if (coupon.getMinOrderAmount() != null && subtotal.compareTo(coupon.getMinOrderAmount()) < 0) {
                throw new BadRequestException("Minimum order of ₹" + coupon.getMinOrderAmount() + " required to use promo code " + code);
            }

            discountAmount = coupon.calculateDiscount(subtotal);
            order.setCouponCode(coupon.getCode());
            order.setDiscountAmount(discountAmount);

            coupon.incrementTimesUsed();
            couponRepository.save(coupon);
        } else {
            order.setCouponCode(null);
            order.setDiscountAmount(BigDecimal.ZERO);
        }

        BigDecimal totalAmount = subtotal.subtract(discountAmount).max(BigDecimal.ZERO);
        order.setTotalAmount(totalAmount);
        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        // 3. Clear customer's cart
        cart.getItems().clear();
        cart.setStore(null);
        cartItemRepository.deleteByCartId(cart.getId());
        cartRepository.save(cart);

        return OrderResponse.fromEntity(savedOrder);
    }

    @Override
    public List<OrderResponse> getCustomerOrders(String customerEmail) {
        return orderRepository.findByCustomerEmailOrderByCreatedAtDesc(customerEmail).stream()
                .map(OrderResponse::fromEntity)
                .toList();
    }

    @Override
    public OrderResponse getOrderById(Long orderId, String userEmail) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Allow Customer who owns it, Store owner, or Admin
        boolean isCustomer = order.getCustomer().getId().equals(user.getId());
        boolean isShopkeeper = order.getStore().getOwner().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ROLE_ADMIN;

        if (!isCustomer && !isShopkeeper && !isAdmin) {
            throw new UnauthorizedException("You do not have permission to view this order");
        }

        return OrderResponse.fromEntity(order);
    }

    @Override
    @Transactional
    public OrderResponse cancelCustomerOrder(String customerEmail, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (!order.getCustomer().getEmail().equalsIgnoreCase(customerEmail)) {
            throw new UnauthorizedException("You can only cancel your own orders");
        }

        // Permitted only if status is PENDING or ACCEPTED
        if (order.getOrderStatus() != OrderStatus.PENDING && order.getOrderStatus() != OrderStatus.ACCEPTED) {
            throw new BadRequestException("Order cannot be cancelled at status: " + order.getOrderStatus());
        }

        order.setOrderStatus(OrderStatus.CANCELLED);

        // Restore reserved inventory and pickup capacity exactly once
        for (OrderItem item : order.getItems()) {
            if (item.getProduct() != null) {
                productRepository.restoreStock(item.getProduct().getId(), item.getQuantity());
            }
        }
        if (order.getPickupSlot() != null) {
            pickupSlotRepository.releaseCapacity(order.getPickupSlot().getId());
        }

        return OrderResponse.fromEntity(orderRepository.save(order));
    }

    @Override
    public List<OrderResponse> getShopkeeperOrders(String shopkeeperEmail, OrderStatus statusFilter) {
        User shopkeeper = userRepository.findByEmail(shopkeeperEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Shopkeeper not found"));

        Store store = storeRepository.findByOwnerId(shopkeeper.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Store not found for shopkeeper"));

        List<Order> orders = orderRepository.findByStoreIdOrderByCreatedAtDesc(store.getId());
        if (statusFilter != null) {
            orders = orders.stream().filter(o -> o.getOrderStatus() == statusFilter).toList();
        }

        return orders.stream().map(OrderResponse::fromEntity).toList();
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatusByShopkeeper(String shopkeeperEmail, Long orderId, OrderStatus nextStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        User shopkeeper = userRepository.findByEmail(shopkeeperEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Shopkeeper not found"));

        if (!order.getStore().getOwner().getId().equals(shopkeeper.getId())) {
            throw new UnauthorizedException("You are not authorized to update orders for another store");
        }

        OrderStatus currentStatus = order.getOrderStatus();
        if (!currentStatus.canTransitionTo(nextStatus)) {
            throw new BadRequestException("Invalid status transition from " + currentStatus + " to " + nextStatus);
        }

        order.setOrderStatus(nextStatus);

        // If shopkeeper rejected the order, restore inventory & slot capacity
        if (nextStatus == OrderStatus.REJECTED) {
            for (OrderItem item : order.getItems()) {
                if (item.getProduct() != null) {
                    productRepository.restoreStock(item.getProduct().getId(), item.getQuantity());
                }
            }
            if (order.getPickupSlot() != null) {
                pickupSlotRepository.releaseCapacity(order.getPickupSlot().getId());
            }
        }

        return OrderResponse.fromEntity(orderRepository.save(order));
    }

    @Override
    public CustomerDashboardStats getCustomerDashboardStats(String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        long total = orderRepository.countByCustomerId(customer.getId());
        long pending = orderRepository.countByCustomerIdAndOrderStatus(customer.getId(), OrderStatus.PENDING) +
                       orderRepository.countByCustomerIdAndOrderStatus(customer.getId(), OrderStatus.ACCEPTED) +
                       orderRepository.countByCustomerIdAndOrderStatus(customer.getId(), OrderStatus.READY_FOR_PICKUP);
        long completed = orderRepository.countByCustomerIdAndOrderStatus(customer.getId(), OrderStatus.COMPLETED);
        long cancelled = orderRepository.countByCustomerIdAndOrderStatus(customer.getId(), OrderStatus.CANCELLED) +
                         orderRepository.countByCustomerIdAndOrderStatus(customer.getId(), OrderStatus.REJECTED);

        List<OrderResponse> recent = orderRepository.findByCustomerIdOrderByCreatedAtDesc(customer.getId()).stream()
                .limit(5)
                .map(OrderResponse::fromEntity)
                .toList();

        return new CustomerDashboardStats(total, pending, completed, cancelled, recent);
    }

    @Override
    public ShopkeeperDashboardStats getShopkeeperDashboardStats(String shopkeeperEmail) {
        User shopkeeper = userRepository.findByEmail(shopkeeperEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Shopkeeper not found"));

        Store store = storeRepository.findByOwnerId(shopkeeper.getId()).orElse(null);
        if (store == null) {
            ShopkeeperDashboardStats empty = new ShopkeeperDashboardStats();
            empty.setStoreName("No store registered yet");
            empty.setTotalSales(BigDecimal.ZERO);
            empty.setRecentOrders(Collections.emptyList());
            return empty;
        }

        long totalOrders = orderRepository.countByStoreId(store.getId());
        long pendingOrders = orderRepository.countByStoreIdAndOrderStatus(store.getId(), OrderStatus.PENDING);
        BigDecimal totalSales = orderRepository.calculateStoreRevenue(store.getId());
        long totalProducts = productRepository.countByStoreIdAndActiveTrue(store.getId());

        List<OrderResponse> recent = orderRepository.findByStoreIdOrderByCreatedAtDesc(store.getId()).stream()
                .limit(5)
                .map(OrderResponse::fromEntity)
                .toList();

        ShopkeeperDashboardStats stats = new ShopkeeperDashboardStats();
        stats.setStoreName(store.getStoreName());
        stats.setApproved(store.getApprovalStatus() == StoreApprovalStatus.APPROVED);
        stats.setActive(store.isActive());
        stats.setTotalOrders(totalOrders);
        stats.setPendingOrders(pendingOrders);
        stats.setTotalSales(totalSales);
        stats.setTotalProducts(totalProducts);
        stats.setRecentOrders(recent);
        return stats;
    }

    @Override
    public AdminDashboardStats getAdminDashboardStats() {
        long totalUsers = userRepository.count();
        long totalStores = storeRepository.count();
        long totalOrders = orderRepository.count();
        BigDecimal totalRevenue = orderRepository.calculateTotalPlatformRevenue();

        List<StoreResponse> pendingStores = storeRepository.findByApprovalStatus(StoreApprovalStatus.PENDING).stream()
                .map(StoreResponse::fromEntity)
                .toList();

        // 7-day mock series for bar chart
        List<Map<String, Object>> dailyCounts = new ArrayList<>();
        LocalDate today = LocalDate.now();
        for (int i = 6; i >= 0; i--) {
            LocalDate day = today.minusDays(i);
            Map<String, Object> map = new HashMap<>();
            map.put("date", day.format(DateTimeFormatter.ofPattern("MMM dd")));
            map.put("count", 15 + (i * 3) % 17);
            dailyCounts.add(map);
        }

        AdminDashboardStats stats = new AdminDashboardStats();
        stats.setTotalUsers(totalUsers);
        stats.setTotalStores(totalStores);
        stats.setTotalOrders(totalOrders);
        stats.setTotalRevenue(totalRevenue);
        stats.setPendingApprovals(pendingStores);
        stats.setDailyOrderCounts(dailyCounts);
        return stats;
    }

    @Override
    public List<OrderResponse> getAllOrdersForAdmin() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(OrderResponse::fromEntity)
                .toList();
    }

    private Cart getCartWithValidation(String customerEmail) {
        Cart cart = cartRepository.findByCustomerEmail(customerEmail)
                .orElseThrow(() -> new BadRequestException("No cart found for this customer"));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new BadRequestException("Your cart is empty. Add items before placing an order.");
        }

        if (cart.getStore() == null) {
            throw new BadRequestException("No store associated with this cart");
        }

        return cart;
    }

    private String generateOrderNumber() {
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        int rand = 1000 + random.nextInt(9000);
        return "AM" + datePart + rand;
    }
}
