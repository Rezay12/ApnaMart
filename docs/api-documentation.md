# ApnaMart REST API Documentation

Base URL: `/api/v1`

---

## 1. Authentication & Profile
- `POST /api/v1/auth/register` (Public) - Register customer or shopkeeper.
- `POST /api/v1/auth/login` (Public) - Login with email and password, returns JWT token.
- `GET /api/v1/auth/me` (Authenticated) - Returns current user details.
- `PUT /api/v1/users/profile` (Authenticated) - Updates full name and phone number.

## 2. Public Store Discovery & Catalog
- `GET /api/v1/stores` (Public) - List approved and active stores. Optional query parameter `?query=...`
- `GET /api/v1/stores/{storeId}` (Public) - Detailed profile of a store.
- `GET /api/v1/stores/{storeId}/products` (Public) - Products of a store with filters `categoryId`, `minPrice`, `maxPrice`, `query`.
- `GET /api/v1/stores/{storeId}/pickup-slots` (Public) - Available upcoming pickup slots for a store.
- `GET /api/v1/categories` (Public) - List all active product categories.
- `GET /api/v1/products/{productId}` (Public) - Single product details.

## 3. Customer Cart & Orders
- `GET /api/v1/cart` (ROLE_CUSTOMER) - Current shopping cart with items and total.
- `POST /api/v1/cart/items` (ROLE_CUSTOMER) - Add item to cart with single-store conflict flag.
- `PATCH /api/v1/cart/items/{itemId}` (ROLE_CUSTOMER) - Update quantity.
- `DELETE /api/v1/cart/items/{itemId}` (ROLE_CUSTOMER) - Remove single item from cart.
- `DELETE /api/v1/cart` (ROLE_CUSTOMER) - Empty cart.
- `POST /api/v1/orders/preview` (ROLE_CUSTOMER) - Live order preview and pricing calculation.
- `POST /api/v1/orders` (ROLE_CUSTOMER) - Place transactional pre-order, reserve stock and slot.
- `GET /api/v1/orders/my` (ROLE_CUSTOMER) - Current customer's order history.
- `GET /api/v1/orders/{orderId}` (Authenticated) - Specific order breakdown and items.
- `PATCH /api/v1/orders/{orderId}/cancel` (ROLE_CUSTOMER) - Cancel pending/accepted order and restore stock.
- `GET /api/v1/customer/dashboard` (ROLE_CUSTOMER) - Customer metrics and recent orders.

## 4. Shopkeeper Operations
- `GET /api/v1/shopkeeper/store` (ROLE_SHOPKEEPER) - Get shopkeeper's store profile.
- `POST /api/v1/shopkeeper/store` (ROLE_SHOPKEEPER) - Register initial store profile.
- `PUT /api/v1/shopkeeper/store` (ROLE_SHOPKEEPER) - Update store profile and operating hours.
- `GET /api/v1/shopkeeper/products` (ROLE_SHOPKEEPER) - List store's catalog.
- `POST /api/v1/shopkeeper/products` (ROLE_SHOPKEEPER) - Add product.
- `PUT /api/v1/shopkeeper/products/{productId}` (ROLE_SHOPKEEPER) - Update pricing and inventory.
- `DELETE /api/v1/shopkeeper/products/{productId}` (ROLE_SHOPKEEPER) - Soft delete product.
- `GET /api/v1/shopkeeper/orders` (ROLE_SHOPKEEPER) - Incoming store orders.
- `PATCH /api/v1/shopkeeper/orders/{orderId}/status` (ROLE_SHOPKEEPER) - Update status (ACCEPTED, REJECTED, READY_FOR_PICKUP, COMPLETED).
- `GET /api/v1/shopkeeper/pickup-slots` (ROLE_SHOPKEEPER) - List store pickup slots.
- `POST /api/v1/shopkeeper/pickup-slots` (ROLE_SHOPKEEPER) - Create pickup slot with capacity.
- `GET /api/v1/shopkeeper/dashboard` (ROLE_SHOPKEEPER) - Store sales and pending orders.

## 5. Administrator Operations
- `GET /api/v1/admin/dashboard` (ROLE_ADMIN) - Platform statistics, revenue, and daily orders chart.
- `GET /api/v1/admin/stores` (ROLE_ADMIN) - List stores (filterable by approval status).
- `PATCH /api/v1/admin/stores/{storeId}/approval` (ROLE_ADMIN) - Approve or reject store.
- `PATCH /api/v1/admin/stores/{storeId}/status` (ROLE_ADMIN) - Activate or deactivate store.
- `GET /api/v1/admin/users` (ROLE_ADMIN) - List system users.
- `PATCH /api/v1/admin/users/{userId}/status` (ROLE_ADMIN) - Suspend or activate user.
- `GET /api/v1/admin/categories` (ROLE_ADMIN) - List categories.
- `POST /api/v1/admin/categories` (ROLE_ADMIN) - Create category.
- `GET /api/v1/admin/orders` (ROLE_ADMIN) - Platform-wide order audit.
