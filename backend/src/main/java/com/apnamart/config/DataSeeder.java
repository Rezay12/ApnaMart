package com.apnamart.config;

import com.apnamart.entity.*;
import com.apnamart.enums.*;
import com.apnamart.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StoreRepository storeRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PickupSlotRepository pickupSlotRepository;
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final PasswordEncoder passwordEncoder;
    private final javax.sql.DataSource dataSource;
    private final CouponRepository couponRepository;

    public DataSeeder(UserRepository userRepository,
                      StoreRepository storeRepository,
                      CategoryRepository categoryRepository,
                      ProductRepository productRepository,
                      PickupSlotRepository pickupSlotRepository,
                      CartRepository cartRepository,
                      OrderRepository orderRepository,
                      PasswordEncoder passwordEncoder,
                      javax.sql.DataSource dataSource,
                      CouponRepository couponRepository) {
        this.userRepository = userRepository;
        this.storeRepository = storeRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.pickupSlotRepository = pickupSlotRepository;
        this.cartRepository = cartRepository;
        this.orderRepository = orderRepository;
        this.passwordEncoder = passwordEncoder;
        this.dataSource = dataSource;
        this.couponRepository = couponRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (productRepository.count() < 50 && dataSource != null) {
            try {
                org.springframework.jdbc.datasource.init.ResourceDatabasePopulator populator =
                        new org.springframework.jdbc.datasource.init.ResourceDatabasePopulator(
                                new org.springframework.core.io.ClassPathResource("seed_full_market_catalog.sql"));
                populator.setContinueOnError(true);
                populator.execute(dataSource);
                System.out.println(">>> AUTOMATICALLY POPULATED EXPANDED INDIAN MARKET CATALOG!");
            } catch (Exception ex) {
                System.out.println(">>> Error running seed SQL: " + ex.getMessage());
            }
        }

        if (couponRepository.count() == 0) {
            seedCoupons();
        }

        if (userRepository.count() > 0) {
            return; // Base users already seeded
        }

        System.out.println(">>> SEEDING APNAMART DEMO DATA...");

        // 1. Seed Users
        User admin = new User("admin@apnamart.com", passwordEncoder.encode("Admin@123"), "Admin System", "9876543210", Role.ROLE_ADMIN);
        User shopkeeper1 = new User("vikram@apnamart.com", passwordEncoder.encode("Shop@123"), "Vikram Singh", "9826011111", Role.ROLE_SHOPKEEPER);
        User shopkeeper2 = new User("freshmart@apnamart.com", passwordEncoder.encode("Shop@123"), "Rajesh Gupta", "9826022222", Role.ROLE_SHOPKEEPER);
        User shopkeeper3 = new User("citydept@apnamart.com", passwordEncoder.encode("Shop@123"), "Sunil Verma", "9826033333", Role.ROLE_SHOPKEEPER);
        User shopkeeper4 = new User("greenmart@apnamart.com", passwordEncoder.encode("Shop@123"), "Suresh Kumar", "9826044444", Role.ROLE_SHOPKEEPER);

        User customer1 = new User("rahul@apnamart.com", passwordEncoder.encode("Customer@123"), "Rahul Sharma", "9826055555", Role.ROLE_CUSTOMER);
        User customer2 = new User("priya@apnamart.com", passwordEncoder.encode("Customer@123"), "Priya Patel", "9826066666", Role.ROLE_CUSTOMER);

        userRepository.saveAll(List.of(admin, shopkeeper1, shopkeeper2, shopkeeper3, shopkeeper4, customer1, customer2));

        // Create initial empty carts for customers
        cartRepository.save(new Cart(customer1));
        cartRepository.save(new Cart(customer2));

        // 2. Seed Categories
        Category catVeg = new Category("Fruits & Vegetables", "Fresh farm vegetables and seasonal fruits", "bi-apple");
        Category catDairy = new Category("Dairy & Eggs", "Milk, butter, paneer, and farm fresh eggs", "bi-cup-straw");
        Category catSnacks = new Category("Snacks & Beverages", "Biscuits, chips, soft drinks, and juices", "bi-cup-hot");
        Category catHousehold = new Category("Household", "Cleaning essentials, detergents, and paper goods", "bi-house-door");
        Category catPersonal = new Category("Personal Care", "Soaps, shampoos, toothpaste, and skincare", "bi-shield-check");
        Category catGrains = new Category("Grains & Pulses", "Rice, atta, pulses, and whole spices", "bi-basket");

        categoryRepository.saveAll(List.of(catVeg, catDairy, catSnacks, catHousehold, catPersonal, catGrains));

        // 3. Seed Stores
        Store store1 = new Store();
        store1.setOwner(shopkeeper1);
        store1.setStoreName("Sharma Kirana Store");
        store1.setDescription("Your local kirana store for all daily needs. Fresh products, best quality and great prices.");
        store1.setAddress("Shop 12, Main Market");
        store1.setLocality("MG Road");
        store1.setCity("Indore");
        store1.setState("Madhya Pradesh");
        store1.setPostalCode("452001");
        store1.setPhoneNumber("9826011111");
        store1.setImageUrl("https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80");
        store1.setOpeningTime(LocalTime.of(8, 0));
        store1.setClosingTime(LocalTime.of(21, 30));
        store1.setApprovalStatus(StoreApprovalStatus.APPROVED);
        store1.setActive(true);
        store1.setRating(4.5);
        store1.setReviewCount(124);
        store1.setDistanceKm(1.2);

        Store store2 = new Store();
        store2.setOwner(shopkeeper2);
        store2.setStoreName("Fresh Mart");
        store2.setDescription("Premium fruits, imported vegetables, organic grains and dairy.");
        store2.setAddress("45 Saket Nagar");
        store2.setLocality("Saket");
        store2.setCity("Indore");
        store2.setState("Madhya Pradesh");
        store2.setPostalCode("452018");
        store2.setPhoneNumber("9826022222");
        store2.setImageUrl("https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80");
        store2.setOpeningTime(LocalTime.of(7, 30));
        store2.setClosingTime(LocalTime.of(22, 0));
        store2.setApprovalStatus(StoreApprovalStatus.APPROVED);
        store2.setActive(true);
        store2.setRating(4.8);
        store2.setReviewCount(89);
        store2.setDistanceKm(1.8);

        Store store3 = new Store();
        store3.setOwner(shopkeeper3);
        store3.setStoreName("City Department Store");
        store3.setDescription("Supermarket with packaged groceries, household cleaners, cosmetics, and snacks.");
        store3.setAddress("Plot 8, Vijay Nagar Square");
        store3.setLocality("Vijay Nagar");
        store3.setCity("Indore");
        store3.setState("Madhya Pradesh");
        store3.setPostalCode("452010");
        store3.setPhoneNumber("9826033333");
        store3.setImageUrl("https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800&auto=format&fit=crop&q=80");
        store3.setOpeningTime(LocalTime.of(9, 0));
        store3.setClosingTime(LocalTime.of(22, 30));
        store3.setApprovalStatus(StoreApprovalStatus.APPROVED);
        store3.setActive(true);
        store3.setRating(4.2);
        store3.setReviewCount(210);
        store3.setDistanceKm(2.4);

        Store store4 = new Store();
        store4.setOwner(shopkeeper4);
        store4.setStoreName("Green Mart");
        store4.setDescription("Organic groceries, freshly milled grains, and cold pressed oils.");
        store4.setAddress("102 Palasia Point");
        store4.setLocality("Old Palasia");
        store4.setCity("Indore");
        store4.setState("Madhya Pradesh");
        store4.setPostalCode("452001");
        store4.setPhoneNumber("9826044444");
        store4.setImageUrl("https://images.unsplash.com/photo-1506484381205-f7945653044d?w=800&auto=format&fit=crop&q=80");
        store4.setOpeningTime(LocalTime.of(9, 0));
        store4.setClosingTime(LocalTime.of(20, 0));
        store4.setApprovalStatus(StoreApprovalStatus.PENDING); // Pending admin review
        store4.setActive(true);
        store4.setRating(4.0);
        store4.setReviewCount(15);
        store4.setDistanceKm(3.1);

        storeRepository.saveAll(List.of(store1, store2, store3, store4));

        // 4. Seed Products for Sharma Kirana Store (Matching Screen 2 Mockup)
        List<Product> products = new ArrayList<>();

        Product p1 = new Product();
        p1.setStore(store1); p1.setCategory(catVeg); p1.setProductName("Fresh Tomatoes");
        p1.setDescription("Local ripe red tomatoes, juicy and fresh");
        p1.setPrice(BigDecimal.valueOf(40.00)); p1.setAvailableQuantity(50); p1.setUnit("kg");
        p1.setImageUrl("https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80");
        products.add(p1);

        Product p2 = new Product();
        p2.setStore(store1); p2.setCategory(catVeg); p2.setProductName("Onions");
        p2.setDescription("Crisp Nashik onions, staple kitchen ingredient");
        p2.setPrice(BigDecimal.valueOf(35.00)); p2.setAvailableQuantity(60); p2.setUnit("kg");
        p2.setImageUrl("https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=80");
        products.add(p2);

        Product p3 = new Product();
        p3.setStore(store1); p3.setCategory(catVeg); p3.setProductName("Potatoes");
        p3.setDescription("Fresh brown potatoes, ideal for cooking and curries");
        p3.setPrice(BigDecimal.valueOf(30.00)); p3.setAvailableQuantity(80); p3.setUnit("kg");
        p3.setImageUrl("https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=80");
        products.add(p3);

        Product p4 = new Product();
        p4.setStore(store1); p4.setCategory(catDairy); p4.setProductName("Pasteurized Milk (1L)");
        p4.setDescription("Fresh toned homogenized milk in pouch");
        p4.setPrice(BigDecimal.valueOf(52.00)); p4.setAvailableQuantity(35); p4.setUnit("litre");
        p4.setImageUrl("https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80");
        products.add(p4);

        Product p5 = new Product();
        p5.setStore(store1); p5.setCategory(catSnacks); p5.setProductName("Whole Wheat Bread");
        p5.setDescription("Freshly baked brown whole wheat loaf");
        p5.setPrice(BigDecimal.valueOf(45.00)); p5.setAvailableQuantity(25); p5.setUnit("pack");
        p5.setImageUrl("https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80");
        products.add(p5);

        Product p6 = new Product();
        p6.setStore(store1); p6.setCategory(catDairy); p6.setProductName("Farm Eggs (12 pcs)");
        p6.setDescription("Farm fresh washed white table eggs pack of 12");
        p6.setPrice(BigDecimal.valueOf(85.00)); p6.setAvailableQuantity(40); p6.setUnit("pack");
        p6.setImageUrl("https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500&auto=format&fit=crop&q=80");
        products.add(p6);

        Product p7 = new Product();
        p7.setStore(store1); p7.setCategory(catGrains); p7.setProductName("Aashirvaad Shudh Chakki Atta (5kg)");
        p7.setDescription("100% whole wheat flour, naturally rich in dietary fibre");
        p7.setPrice(BigDecimal.valueOf(245.00)); p7.setAvailableQuantity(20); p7.setUnit("pack");
        p7.setImageUrl("https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=80");
        products.add(p7);

        Product p8 = new Product();
        p8.setStore(store1); p8.setCategory(catGrains); p8.setProductName("Daawat Rozana Basmati Rice (1kg)");
        p8.setDescription("Aromatic long grain basmati rice");
        p8.setPrice(BigDecimal.valueOf(110.00)); p8.setAvailableQuantity(30); p8.setUnit("kg");
        p8.setImageUrl("https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80");
        products.add(p8);

        Product p9 = new Product();
        p9.setStore(store1); p9.setCategory(catHousehold); p9.setProductName("Vim Dishwash Gel (500ml)");
        p9.setDescription("Lemon fragrance grease cutting liquid");
        p9.setPrice(BigDecimal.valueOf(99.00)); p9.setAvailableQuantity(20); p9.setUnit("pack");
        p9.setImageUrl("https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&auto=format&fit=crop&q=80");
        products.add(p9);

        Product p10 = new Product();
        p10.setStore(store1); p10.setCategory(catPersonal); p10.setProductName("Dettol Original Soap (3x125g)");
        p10.setDescription("Antibacterial germ protection soap pack of 3");
        p10.setPrice(BigDecimal.valueOf(140.00)); p10.setAvailableQuantity(15); p10.setUnit("pack");
        p10.setImageUrl("https://images.unsplash.com/photo-1607006314393-810a62eb3511?w=500&auto=format&fit=crop&q=80");
        products.add(p10);

        productRepository.saveAll(products);

        // 5. Seed Pickup Slots (Today + Next 4 Days matching Screen 4)
        LocalDate today = LocalDate.now();
        List<PickupSlot> slots = new ArrayList<>();

        for (int dayOffset = 0; dayOffset <= 4; dayOffset++) {
            LocalDate date = today.plusDays(dayOffset);

            PickupSlot s1 = new PickupSlot();
            s1.setStore(store1); s1.setPickupDate(date);
            s1.setStartTime(LocalTime.of(9, 0)); s1.setEndTime(LocalTime.of(10, 0));
            s1.setCapacity(10); s1.setReservedCount(3); s1.setActive(true);
            slots.add(s1);

            PickupSlot s2 = new PickupSlot();
            s2.setStore(store1); s2.setPickupDate(date);
            s2.setStartTime(LocalTime.of(10, 0)); s2.setEndTime(LocalTime.of(11, 0));
            s2.setCapacity(10); s2.setReservedCount(5); s2.setActive(true);
            slots.add(s2);

            PickupSlot s3 = new PickupSlot();
            s3.setStore(store1); s3.setPickupDate(date);
            s3.setStartTime(LocalTime.of(11, 0)); s3.setEndTime(LocalTime.of(12, 0));
            s3.setCapacity(10); s3.setReservedCount(4); s3.setActive(true);
            slots.add(s3);

            PickupSlot s4 = new PickupSlot();
            s4.setStore(store1); s4.setPickupDate(date);
            s4.setStartTime(LocalTime.of(12, 0)); s4.setEndTime(LocalTime.of(13, 0));
            s4.setCapacity(10); s4.setReservedCount(6); s4.setActive(true);
            slots.add(s4);

            PickupSlot s5 = new PickupSlot();
            s5.setStore(store1); s5.setPickupDate(date);
            s5.setStartTime(LocalTime.of(13, 0)); s5.setEndTime(LocalTime.of(14, 0));
            s5.setCapacity(10); s5.setReservedCount(5); s5.setActive(true);
            slots.add(s5);

            PickupSlot s6 = new PickupSlot();
            s6.setStore(store1); s6.setPickupDate(date);
            s6.setStartTime(LocalTime.of(14, 0)); s6.setEndTime(LocalTime.of(15, 0));
            s6.setCapacity(10); s6.setReservedCount(2); s6.setActive(true);
            slots.add(s6);
        }
        pickupSlotRepository.saveAll(slots);

        // 6. Seed Existing Orders for Rahul Sharma matching Screen 6 & Vikram Singh Screen 7
        PickupSlot bookedSlot = slots.get(1); // 10:00 - 11:00 AM

        Order o1 = new Order();
        o1.setOrderNumber("AM202504260123");
        o1.setCustomer(customer1);
        o1.setStore(store1);
        o1.setPickupSlot(bookedSlot);
        o1.setSubtotal(BigDecimal.valueOf(145.00));
        o1.setTotalAmount(BigDecimal.valueOf(145.00));
        o1.setPaymentMethod(PaymentMethod.CASH_ON_PICKUP);
        o1.setPaymentStatus(PaymentStatus.PENDING);
        o1.setOrderStatus(OrderStatus.PENDING);
        o1.setCustomerNote("Please pack ripe tomatoes separately.");

        OrderItem oi1 = new OrderItem(o1, p1, p1.getProductName(), p1.getPrice(), 2, BigDecimal.valueOf(80.00));
        OrderItem oi2 = new OrderItem(o1, p2, p2.getProductName(), p2.getPrice(), 1, BigDecimal.valueOf(35.00));
        OrderItem oi3 = new OrderItem(o1, p3, p3.getProductName(), p3.getPrice(), 1, BigDecimal.valueOf(30.00));
        o1.setItems(List.of(oi1, oi2, oi3));

        Order o2 = new Order();
        o2.setOrderNumber("AM202504250098");
        o2.setCustomer(customer1);
        o2.setStore(store1);
        o2.setPickupSlot(bookedSlot);
        o2.setSubtotal(BigDecimal.valueOf(320.00));
        o2.setTotalAmount(BigDecimal.valueOf(320.00));
        o2.setPaymentMethod(PaymentMethod.PAY_AT_STORE);
        o2.setPaymentStatus(PaymentStatus.PAID);
        o2.setOrderStatus(OrderStatus.COMPLETED);

        OrderItem oi4 = new OrderItem(o2, p7, p7.getProductName(), p7.getPrice(), 1, BigDecimal.valueOf(245.00));
        OrderItem oi5 = new OrderItem(o2, p6, p6.getProductName(), p6.getPrice(), 1, BigDecimal.valueOf(75.00));
        o2.setItems(List.of(oi4, oi5));

        Order o3 = new Order();
        o3.setOrderNumber("AM202504240067");
        o3.setCustomer(customer1);
        o3.setStore(store1);
        o3.setPickupSlot(bookedSlot);
        o3.setSubtotal(BigDecimal.valueOf(275.00));
        o3.setTotalAmount(BigDecimal.valueOf(275.00));
        o3.setPaymentMethod(PaymentMethod.CASH_ON_PICKUP);
        o3.setPaymentStatus(PaymentStatus.PAID);
        o3.setOrderStatus(OrderStatus.COMPLETED);

        OrderItem oi6 = new OrderItem(o3, p8, p8.getProductName(), p8.getPrice(), 2, BigDecimal.valueOf(220.00));
        OrderItem oi7 = new OrderItem(o3, p4, p4.getProductName(), p4.getPrice(), 1, BigDecimal.valueOf(55.00));
        o3.setItems(List.of(oi6, oi7));

        Order o4 = new Order();
        o4.setOrderNumber("AM202504250120");
        o4.setCustomer(customer2);
        o4.setStore(store1);
        o4.setPickupSlot(bookedSlot);
        o4.setSubtotal(BigDecimal.valueOf(320.00));
        o4.setTotalAmount(BigDecimal.valueOf(320.00));
        o4.setPaymentMethod(PaymentMethod.CASH_ON_PICKUP);
        o4.setPaymentStatus(PaymentStatus.PENDING);
        o4.setOrderStatus(OrderStatus.ACCEPTED);

        OrderItem oi8 = new OrderItem(o4, p7, p7.getProductName(), p7.getPrice(), 1, BigDecimal.valueOf(245.00));
        OrderItem oi9 = new OrderItem(o4, p5, p5.getProductName(), p5.getPrice(), 1, BigDecimal.valueOf(45.00));
        OrderItem oi10 = new OrderItem(o4, p2, p2.getProductName(), p2.getPrice(), 1, BigDecimal.valueOf(30.00));
        o4.setItems(List.of(oi8, oi9, oi10));

        Order o5 = new Order();
        o5.setOrderNumber("AM202504240087");
        o5.setCustomer(customer2);
        o5.setStore(store1);
        o5.setPickupSlot(bookedSlot);
        o5.setSubtotal(BigDecimal.valueOf(210.00));
        o5.setTotalAmount(BigDecimal.valueOf(210.00));
        o5.setPaymentMethod(PaymentMethod.CASH_ON_PICKUP);
        o5.setPaymentStatus(PaymentStatus.PENDING);
        o5.setOrderStatus(OrderStatus.READY_FOR_PICKUP);

        OrderItem oi11 = new OrderItem(o5, p6, p6.getProductName(), p6.getPrice(), 1, BigDecimal.valueOf(85.00));
        OrderItem oi12 = new OrderItem(o5, p4, p4.getProductName(), p4.getPrice(), 2, BigDecimal.valueOf(104.00));
        OrderItem oi13 = new OrderItem(o5, p3, p3.getProductName(), p3.getPrice(), 1, BigDecimal.valueOf(21.00));
        o5.setItems(List.of(oi11, oi12, oi13));

        orderRepository.saveAll(List.of(o1, o2, o3, o4, o5));

        System.out.println(">>> SEEDING APNAMART COMPLETE!");
        System.out.println(">>> DEMO ACCOUNTS READY:");
        System.out.println("    Admin:      admin@apnamart.com / Admin@123");
        System.out.println("    Shopkeeper: vikram@apnamart.com / Shop@123  (Sharma Kirana Store)");
        System.out.println("    Customer:   rahul@apnamart.com / Customer@123 (Rahul Sharma)");
    }

    private void seedCoupons() {
        System.out.println(">>> SEEDING APNAMART DISCOUNT COUPONS & LIMITED-TIME OFFERS...");
        LocalDateTime now = LocalDateTime.now();

        Store sharmaStore = storeRepository.findById(1L).orElse(null);
        Store freshMart = storeRepository.findById(2L).orElse(null);

        List<Coupon> coupons = new ArrayList<>();

        // 1. Welcome Flat 50
        coupons.add(new Coupon(
                "WELCOME50",
                "Flat ₹50 OFF on First Pre-Order",
                "Valid on all orders above ₹199 across all neighbourhood stores. Zero queue pickup!",
                DiscountType.FLAT,
                BigDecimal.valueOf(50.00),
                BigDecimal.valueOf(199.00),
                null,
                now.minusDays(5),
                now.plusDays(90),
                500,
                null,
                "🎉 NEW USER"
        ));

        // 2. Limited Time 48-Hour Flash Deal
        coupons.add(new Coupon(
                "FLASH30",
                "⚡ 30% OFF Limited-Time Flash Deal",
                "Instant 30% discount up to ₹150 on essential groceries and dairy. Expiring soon!",
                DiscountType.PERCENTAGE,
                BigDecimal.valueOf(30.00),
                BigDecimal.valueOf(299.00),
                BigDecimal.valueOf(150.00),
                now.minusHours(4),
                now.plusHours(44),
                250,
                null,
                "⚡ 48H FLASH SALE"
        ));

        // 3. Store Exclusive: Sharma Kirana
        coupons.add(new Coupon(
                "KIRANA20",
                "20% OFF at Sharma Kirana Store",
                "Get 20% discount up to ₹100 on all daily grocery pre-orders at Sharma Kirana.",
                DiscountType.PERCENTAGE,
                BigDecimal.valueOf(20.00),
                BigDecimal.valueOf(250.00),
                BigDecimal.valueOf(100.00),
                now.minusDays(3),
                now.plusDays(30),
                200,
                sharmaStore,
                "⭐ STORE EXCLUSIVE"
        ));

        // 4. Store Exclusive: Fresh Mart
        coupons.add(new Coupon(
                "FRESH75",
                "Flat ₹75 OFF at Fresh Mart",
                "Exclusive savings on farm-fresh fruits, imported vegetables, and organic grains above ₹399.",
                DiscountType.FLAT,
                BigDecimal.valueOf(75.00),
                BigDecimal.valueOf(399.00),
                null,
                now.minusDays(2),
                now.plusDays(20),
                150,
                freshMart,
                "🥬 FARM FRESH"
        ));

        // 5. Festive Mega Saver
        coupons.add(new Coupon(
                "FESTIVE100",
                "Festive Mega Saver ₹100 OFF",
                "Enjoy flat ₹100 discount on monthly family grocery pre-orders above ₹799.",
                DiscountType.FLAT,
                BigDecimal.valueOf(100.00),
                BigDecimal.valueOf(799.00),
                null,
                now.minusDays(1),
                now.plusDays(60),
                1000,
                null,
                "🪔 FESTIVE SAVER"
        ));

        // 6. Limited Time 24-Hour Deal
        coupons.add(new Coupon(
                "RUSH15",
                "15% OFF Limited Time Kirana Rush",
                "Save 15% up to ₹80 on quick pre-orders above ₹200. Beat the evening crowd!",
                DiscountType.PERCENTAGE,
                BigDecimal.valueOf(15.00),
                BigDecimal.valueOf(200.00),
                BigDecimal.valueOf(80.00),
                now.minusHours(2),
                now.plusHours(22),
                300,
                null,
                "⏳ 24H DEAL"
        ));

        couponRepository.saveAll(coupons);
        System.out.println(">>> SEEDED " + coupons.size() + " DISCOUNT COUPONS AND PROMO CODES!");
    }
}
