# ApnaMart Testing Report

## 1. Automated Backend Unit & Integration Tests (JUnit 5 + Mockito + SpringBootTest)

Execution Command:
```powershell
mvn test "-Dtest=AuthServiceTest,OrderServiceTest"
```

| Test Case | Description | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| `testAdminRegistrationForbidden` | Attempt public user registration with `ROLE_ADMIN` | Throws `BadRequestException`, blocks admin self-registration | HTTP 400 with message "Public registration cannot create Administrator accounts" | **PASSED** |
| `testCustomerRegistrationSuccess` | Customer registers with valid details | User record created, BCrypt hash stored, JWT issued | HTTP 201 with JWT token and `ROLE_CUSTOMER` | **PASSED** |
| `testCustomerLoginSuccess` | Login with seeded customer `rahul@apnamart.com` | AuthenticationManager validates password, issues JWT | HTTP 200 with JWT token | **PASSED** |
| `testEmptyCartCheckoutFails` | Customer attempts checkout with empty cart | Rejects order placement | Throws `BadRequestException`: "Your cart is empty" | **PASSED** |
| `testStatusTransitionValidation` | Shopkeeper attempts invalid transition (e.g. COMPLETED ➔ PENDING) | Rejects state transition | Throws `BadRequestException`: "Invalid status transition" | **PASSED** |
| `testPlaceAndCancelOrder` | Customer pre-orders with stock reservation, then cancels | Order status changes to `CANCELLED`, inventory restored atomically | Order placed with unique `#AM...` number, cancelled, stock restored | **PASSED** |

**Summary:** 6/6 automated backend test cases executed. **0 Failures, 0 Errors, 0 Skipped.**

---

## 2. End-to-End System Integration Tests (Browser & REST API)

| Feature / Flow | Test Scenario | Expected Outcome | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Store Browsing** | Customer opens Home Page (`/`) and clicks "Sharma Kirana Store" | Loads store banner, category list, price filters, and product grid | Store profile, rating (4.5), distance (1.2 km), and in-stock products displayed | **PASSED** |
| **Product Filtering** | Filter by category (e.g. Fruits & Vegetables) and price range | Products dynamically filter matching criteria | Only matching products shown | **PASSED** |
| **Cart Single-Store Rule** | Customer adds item from Store A, then attempts item from Store B | Prompts modal to keep current cart or clear and switch store | Conflict modal triggers, prevents mixing stores | **PASSED** |
| **Pickup Slot Selection** | Select Date (Today / Tomorrow) and Time Slot (e.g. 10:00 AM) | Shows remaining spots, highlights selected slot chip | Dynamic slot cards with live remaining capacity displayed | **PASSED** |
| **Pre-Order Placement** | Confirm pre-order with "Cash on Pickup" | Decrements stock, reserves slot capacity, clears cart, redirects to Confirmation | Unique Order Number generated (e.g. `#AM202610158485`) | **PASSED** |
| **Customer Dashboard** | View `/customer/dashboard` | Shows Total Orders, Pending, Completed, Cancelled cards, and Order table | Live metrics matching database state, action buttons active | **PASSED** |
| **Shopkeeper Orders** | Shopkeeper logs in, views `/shopkeeper/dashboard` | Shows incoming orders with status progression buttons | Accept, Reject, Mark Ready, and Mark Completed working | **PASSED** |
| **Admin Store Approval** | Admin logs in, views `/admin/dashboard` | Platform metrics, 7-day chart, Pending store approval table | Green Mart pending approval displayed with Approve/Reject actions | **PASSED** |
