# ApnaMart Database Entity-Relationship (ER) Documentation

```mermaid
erDiagram
    USERS ||--o{ STORES : "owns (as SHOPKEEPER)"
    USERS ||--o| CARTS : "has"
    USERS ||--o{ ORDERS : "places (as CUSTOMER)"
    
    STORES ||--o{ PRODUCTS : "stocks"
    STORES ||--o{ PICKUP_SLOTS : "defines"
    STORES ||--o{ ORDERS : "receives"
    
    CATEGORIES ||--o{ PRODUCTS : "classifies"
    
    CARTS ||--o{ CART_ITEMS : "contains"
    PRODUCTS ||--o{ CART_ITEMS : "referenced in"
    
    ORDERS ||--o{ ORDER_ITEMS : "contains"
    PRODUCTS ||--o{ ORDER_ITEMS : "snapshots"
    PICKUP_SLOTS ||--o{ ORDERS : "scheduled for"
    STORES ||--o{ COUPONS : "offers (store-exclusive)"
    ORDERS ||--o| COUPONS : "applies"

    USERS {
        BIGINT id PK
        VARCHAR email UK
        VARCHAR password_hash
        VARCHAR full_name
        VARCHAR phone_number
        ENUM role "CUSTOMER, SHOPKEEPER, ADMIN"
        BOOLEAN active
        DATETIME created_at
        DATETIME updated_at
    }

    STORES {
        BIGINT id PK
        BIGINT owner_id FK
        VARCHAR store_name
        TEXT description
        VARCHAR address
        VARCHAR locality
        VARCHAR city
        VARCHAR state
        VARCHAR postal_code
        VARCHAR phone_number
        TIME opening_time
        TIME closing_time
        ENUM approval_status "PENDING, APPROVED, REJECTED"
        BOOLEAN active
        DATETIME created_at
        DATETIME updated_at
    }

    CATEGORIES {
        BIGINT id PK
        VARCHAR name UK
        TEXT description
        VARCHAR icon_name
        BOOLEAN active
    }

    PRODUCTS {
        BIGINT id PK
        BIGINT store_id FK
        BIGINT category_id FK
        VARCHAR product_name
        TEXT description
        VARCHAR sku
        DECIMAL price "10,2"
        INT available_quantity
        VARCHAR unit
        VARCHAR image_url
        BOOLEAN active
        DATETIME created_at
        DATETIME updated_at
    }

    CARTS {
        BIGINT id PK
        BIGINT customer_id FK UK
        BIGINT store_id FK
        DATETIME created_at
        DATETIME updated_at
    }

    CART_ITEMS {
        BIGINT id PK
        BIGINT cart_id FK
        BIGINT product_id FK
        INT quantity
    }

    PICKUP_SLOTS {
        BIGINT id PK
        BIGINT store_id FK
        DATE pickup_date
        TIME start_time
        TIME end_time
        INT capacity
        INT reserved_count
        BOOLEAN active
    }

    COUPONS {
        BIGINT id PK
        VARCHAR code UK
        VARCHAR title
        TEXT description
        ENUM discount_type "PERCENTAGE, FLAT"
        DECIMAL discount_value "10,2"
        DECIMAL min_order_amount "10,2"
        DECIMAL max_discount_amount "10,2"
        DATETIME start_date
        DATETIME end_date
        INT max_uses
        INT times_used
        BIGINT store_id FK "nullable (null = platform-wide)"
        VARCHAR badge
        BOOLEAN active
        DATETIME created_at
        DATETIME updated_at
    }

    ORDERS {
        BIGINT id PK
        VARCHAR order_number UK
        BIGINT customer_id FK
        BIGINT store_id FK
        BIGINT pickup_slot_id FK
        VARCHAR coupon_code "nullable"
        DECIMAL discount_amount "10,2"
        DECIMAL subtotal "10,2"
        DECIMAL total_amount "10,2"
        ENUM payment_method
        ENUM payment_status
        ENUM order_status
        TEXT customer_note
        DATETIME created_at
        DATETIME updated_at
    }

    ORDER_ITEMS {
        BIGINT id PK
        BIGINT order_id FK
        BIGINT product_id FK
        VARCHAR product_name_snapshot
        DECIMAL unit_price_snapshot "10,2"
        INT quantity
        DECIMAL line_total "10,2"
    }
```
