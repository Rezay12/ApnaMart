-- ApnaMart Comprehensive Indian Grocery & Kirana Market Seed Data
-- Market prices in INR (₹) matching current Indian retail rates

-- Insert additional verified shopkeeper users if not present
INSERT IGNORE INTO users (id, email, password_hash, full_name, phone_number, role, active, created_at, updated_at) VALUES
(8, 'patidar@apnamart.com', '$2a$10$w09ZzB4HkQeL74nJvX/z4e3yLzH.7UvKkP38uA7c030dZ19jQ80.O', 'Mahesh Patidar', '9826077111', 'ROLE_SHOPKEEPER', 1, NOW(), NOW()),
(9, 'aggarwal@apnamart.com', '$2a$10$w09ZzB4HkQeL74nJvX/z4e3yLzH.7UvKkP38uA7c030dZ19jQ80.O', 'Ramesh Aggarwal', '9826088222', 'ROLE_SHOPKEEPER', 1, NOW(), NOW());

-- Insert additional popular local stores
INSERT IGNORE INTO stores (id, owner_id, store_name, description, address, locality, city, state, postal_code, phone_number, image_url, opening_time, closing_time, approval_status, active, rating, review_count, distance_km, created_at, updated_at) VALUES
(5, 8, 'Patidar Daily Needs & Kirana', 'Wholesale and retail prices on grains, spices, oils, and seasonal vegetables.', '18 Annapurna Main Road', 'Annapurna', 'Indore', 'Madhya Pradesh', '452009', '9826077111', 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80', '07:30:00', '22:00:00', 'APPROVED', 1, 4.7, 168, 1.5, NOW(), NOW()),
(6, 9, 'Aggarwal Super Mart', 'Complete department store stocking packaged foods, personal care, cleaning items, and dairy.', '45 Sarafa Bazar', 'Rajwada', 'Indore', 'Madhya Pradesh', '452002', '9826088222', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80', '08:00:00', '22:30:00', 'APPROVED', 1, 4.6, 214, 2.1, NOW(), NOW());

-- Ensure Green Mart (Store 4) is approved for customer browsing
UPDATE stores SET approval_status = 'APPROVED' WHERE id = 4;

-- Comprehensive Indian Products for Store 1 (Sharma Kirana Store)
INSERT INTO products (store_id, category_id, product_name, description, sku, price, available_quantity, unit, image_url, active, created_at, updated_at) VALUES
-- Fruits & Vegetables
(1, 1, 'Fresh Green Chillies / Hari Mirch', 'Spicy fresh green chillies for authentic tadka', 'VEG-CHILI', 15.00, 45, '200g', 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 1, 'Fresh Ginger / Adrak', 'Aromatic Indian ginger root for tea and gravies', 'VEG-GINGER', 35.00, 30, '250g', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 1, 'Desi Garlic / Lehsun', 'Dry pungent Indian garlic pearls', 'VEG-GARLIC', 55.00, 40, '250g', 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 1, 'Fresh Cauliflower / Phool Gobhi', 'Tender white head cauliflower, farm fresh', 'VEG-CAULI', 35.00, 25, 'pc', 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 1, 'Green Capsicum / Shimla Mirch', 'Crunchy bell peppers rich in vitamin C', 'VEG-CAPS', 40.00, 30, '500g', 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 1, 'Fresh Lemon / Nimbu (4 pcs)', 'Juicy sour yellow Indian lemons', 'FRT-LEMON', 20.00, 60, 'pack', 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 1, 'Kashmiri Royal Delicious Apples', 'Crisp sweet red apples from Kashmir valley', 'FRT-APPLE', 160.00, 35, 'kg', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 1, 'Fresh Robusta Bananas (12 pcs)', 'Naturally ripened sweet yellow bananas', 'FRT-BANANA', 50.00, 40, 'dozen', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 1, 'Ruby Red Pomegranate / Anar', 'Sweet and juicy seed pearls', 'FRT-POME', 180.00, 20, 'kg', 'https://images.unsplash.com/photo-1615485290176-787889e477f7?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),

-- Dairy & Eggs
(1, 2, 'Amul Taaza Toned Milk (1L)', 'Homogenized toned milk with 3.0% fat, 8.5% SNF', 'DAIRY-AMUL-1L', 54.00, 50, 'litre', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 2, 'Amul Gold Full Cream Milk (1L)', 'Rich cream milk with 6.0% fat for tea & sweets', 'DAIRY-GOLD-1L', 66.00, 45, 'litre', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 2, 'Amul Salted Butter (500g)', 'Utterly butterly delicious pure dairy butter', 'DAIRY-BUTTER', 275.00, 25, 'pack', 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 2, 'Amul Fresh Malai Paneer (200g)', 'Soft and hygienic vacuum-packed cottage cheese', 'DAIRY-PANEER', 92.00, 30, 'pack', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 2, 'Amul Masti Dahi (400g Pouch)', 'Thick set creamy curd prepared from pasteurized milk', 'DAIRY-DAHI', 35.00, 40, 'pack', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 2, 'Amul Processed Cheese Block (200g)', 'Classic cheddar block for grating and sandwiches', 'DAIRY-CHEESE', 135.00, 20, 'pack', 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 2, 'Farm Fresh Eggs (30 Eggs Tray)', 'Graded protein-rich white table eggs wholesale tray', 'DAIRY-EGG-30', 210.00, 15, 'tray', 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),

-- Grains, Pulses & Cooking Essentials
(1, 6, 'Aashirvaad Shudh Chakki Atta (10kg)', '100% pure whole wheat flour with natural dietary fibre', 'GRN-ATTA-10', 460.00, 20, 'pack', 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 6, 'India Gate Classic Basmati Rice (1kg)', 'Aged extra long grain authentic aromatic rice', 'GRN-RICE-IG', 195.00, 30, 'kg', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 6, 'Fortune Rozana Basmati Rice (5kg)', 'Daily kitchen basmati rice for biryani and pulao', 'GRN-RICE-5', 420.00, 15, 'pack', 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 6, 'Tata Sampann Unpolished Toor Dal (1kg)', 'Protein-rich arhar dal without chemical polishing', 'GRN-TOORDAL', 175.00, 40, 'kg', 'https://images.unsplash.com/photo-1585994192700-1c5c4f2bb42c?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 6, 'Tata Sampann Moong Dal Dhuli (1kg)', 'Easy-to-digest yellow split lentils', 'GRN-MOONG', 145.00, 35, 'kg', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 6, 'Desi Chana Dal (1kg)', 'Rich protein Bengal gram lentils for dal and namkeens', 'GRN-CHANA', 98.00, 40, 'kg', 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 6, 'Kabuli Chana / Chickpeas (1kg)', 'Large size chickpeas for authentic chole bhature', 'GRN-KABULI', 155.00, 30, 'kg', 'https://images.unsplash.com/photo-1585994192700-1c5c4f2bb42c?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 6, 'Rajma Chitra Jammu (1kg)', 'Soft-cooking speckled kidney beans', 'GRN-RAJMA', 160.00, 30, 'kg', 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 6, 'Fortune Sunlite Refined Sunflower Oil (1L)', 'Light and healthy cooking oil enriched with vitamins A, D', 'OIL-SUN-1L', 135.00, 50, 'litre', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 6, 'Fortune Kachi Ghani Mustard Oil (1L)', 'Cold-pressed pungent sarson oil for authentic pickles and curries', 'OIL-MUSTARD', 150.00, 40, 'litre', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 6, 'Tata Salt Vaccum Evaporated (1kg)', 'Desh ka namak with guaranteed iodine content', 'SPICE-SALT', 28.00, 80, 'kg', 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 6, 'Madhur Pure & Hygienic Sugar (1kg)', 'Sulphur-free sparkling white crystal sugar', 'GRN-SUGAR', 48.00, 60, 'kg', 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 6, 'MDH Deggi Mirch Powder (100g)', 'Natural red color and balanced pungency for Indian curries', 'SPICE-DEGGI', 88.00, 35, 'pack', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 6, 'Everest Turmeric Powder / Haldi (200g)', 'Pure golden ground turmeric root', 'SPICE-HALDI', 68.00, 45, 'pack', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),

-- Snacks & Beverages
(1, 3, 'Maggi 2-Minute Masala Noodles (Pack of 4)', 'Classic noodles with signature tastemaker spices', 'SNK-MAGGI4', 56.00, 60, 'pack', 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 3, 'Haldiram\'s Nagpur Bhujia Sev (400g)', 'Crisp spicy moth flour crunchy noodles namkeen', 'SNK-BHUJIA', 110.00, 35, 'pack', 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 3, 'Haldiram\'s Aloo Bhujia (400g)', 'Crisp potato and mint flavored namkeen snack', 'SNK-ALOOBHU', 115.00, 30, 'pack', 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 3, 'Britannia Good Day Cashew Cookies (600g)', 'Rich butter cookies with roasted cashew nuts', 'SNK-GOODDAY', 120.00, 30, 'pack', 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 3, 'Parle-G Gold Glucose Biscuits (800g)', 'India\'s favorite tea companion biscuits', 'SNK-PARLEG', 80.00, 40, 'pack', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 3, 'Lay\'s India\'s Magic Masala Chips (50g)', 'Crispy potato ridges with spicy Indian masala', 'SNK-LAYS', 20.00, 50, 'pack', 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 3, 'Cadbury Dairy Milk Silk Chocolate (150g)', 'Smoother, creamier, and chocolatey bar', 'SNK-SILK', 175.00, 25, 'bar', 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 3, 'Tata Tea Gold Leaf & Dust (500g)', 'Rich aroma with gently rolled tea leaves', 'BEV-TATAGOLD', 310.00, 30, 'pack', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 3, 'Brooke Bond Red Label Tea (500g)', 'Strong Assam blend tea with natural flavor', 'BEV-REDLABEL', 265.00, 35, 'pack', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 3, 'Nescafe Classic 100% Pure Coffee (100g Jar)', 'Instant granulated coffee for hot and cold brew', 'BEV-NESCAFE', 340.00, 20, 'jar', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 3, 'Coca Cola Soft Drink Bottle (750ml)', 'Refreshing carbonated cola beverage', 'BEV-COKE', 40.00, 40, 'bottle', 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 3, 'Real Fruit Power Mixed Fruit Juice (1L)', 'Made from 9 delicious fruits without added preservatives', 'BEV-REALJUICE', 120.00, 25, 'pack', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),

-- Household Essentials
(1, 4, 'Surf Excel Easy Wash Detergent (1kg)', 'Power of 10 hands to remove tough stains easily', 'HSE-SURF1K', 140.00, 35, 'kg', 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 4, 'Ariel Matic Front Load Detergent (2kg)', 'Bright clean detergent with stain defense technology', 'HSE-ARIEL2K', 499.00, 15, 'pack', 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 4, 'Vim Lemon Dishwash Bar (Pack of 3 x 155g)', 'Cuts grease with real lemon juice concentration', 'HSE-VIMBAR', 55.00, 40, 'pack', 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 4, 'Harpic Power Plus Disinfectant Toilet Cleaner (1L)', '10x better stain removal with germ kill formula', 'HSE-HARPIC', 195.00, 30, 'bottle', 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 4, 'Lizol Citrus Floor Cleaner (1L)', 'Kills 99.9% germs and leaves 10x better fragrance', 'HSE-LIZOL', 215.00, 25, 'bottle', 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 4, 'Colin Glass Cleaner Spray (500ml)', 'Shine booster for mirrors, glass counters and appliances', 'HSE-COLIN', 105.00, 30, 'bottle', 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 4, 'Scotch-Brite Heavy Duty Sponge Scrub (3 pcs)', 'Long lasting green fiber pad for utensils', 'HSE-SCOTCH', 75.00, 45, 'pack', 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),

-- Personal Care
(1, 5, 'Dettol Original Bathing Soap (Pack of 4 x 125g)', 'Trusted germ protection with pine fragrance', 'PC-DETTOL4', 195.00, 30, 'pack', 'https://images.unsplash.com/photo-1607006314393-810a62eb3511?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 5, 'Dove Cream Beauty Bathing Bar (3 x 100g)', 'Enriched with 1/4th moisturizing cream', 'PC-DOVE3', 220.00, 25, 'pack', 'https://images.unsplash.com/photo-1607006314393-810a62eb3511?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 5, 'Colgate Strong Teeth Calcium Toothpaste (500g)', 'Amino Shakti formula for cavity protection', 'PC-COLGATE', 210.00, 35, 'pack', 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 5, 'Head & Shoulders Anti-Dandruff Shampoo (650ml)', 'Smooth & silky scalp formula with zinc pyrithione', 'PC-HNS', 499.00, 20, 'bottle', 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 5, 'Parachute 100% Pure Coconut Hair Oil (500ml)', 'Naturally pure expeller-pressed edible grade coconut oil', 'PC-PARACHUTE', 185.00, 40, 'bottle', 'https://images.unsplash.com/photo-1608248597359-245c38668ce0?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 5, 'Nivea Soft Light Moisturizing Cream (200ml)', 'Quick absorbing face and body cream with Jojoba oil', 'PC-NIVEA', 299.00, 20, 'jar', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW()),
(1, 5, 'Dettol First Aid Antiseptic Liquid (550ml)', 'Antibacterial disinfectant liquid for wounds and laundry', 'PC-DETTOLLIQ', 210.00, 25, 'bottle', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80', 1, NOW(), NOW());

-- Insert unique products for other stores with image remapping per product name
-- Fresh Mart (Store 2) - slightly premium pricing
INSERT INTO products (store_id, category_id, product_name, description, sku, price, available_quantity, unit, image_url, active, created_at, updated_at)
SELECT 2, category_id, product_name, description, CONCAT('FM-', sku), price * 1.02, available_quantity + 10, unit,
  CASE
    WHEN product_name LIKE '%Tomato%' THEN 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Onion%' THEN 'https://images.unsplash.com/photo-1508747703725-719777637510?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Potato%' THEN 'https://images.unsplash.com/photo-1508313880080-c4bef0730395?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Milk%' THEN 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Bread%' THEN 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Egg%' THEN 'https://images.unsplash.com/photo-1489761869773-c2c3a6d03e23?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Apple%' THEN 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Banana%' THEN 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Paneer%' THEN 'https://images.unsplash.com/photo-1631452180775-1b8cde78bb3e?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Butter%' THEN 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Tea%' THEN 'https://images.unsplash.com/photo-1517942312434-5d54e859af3f?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Coffee%' THEN 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Chocolate%' THEN 'https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Soap%' OR product_name LIKE '%Dettol%' OR product_name LIKE '%Dove%' THEN 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Shampoo%' THEN 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Toothpaste%' THEN 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Rice%' THEN 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Cola%' OR product_name LIKE '%Coke%' THEN 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Juice%' THEN 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&auto=format&fit=crop&q=80'
    ELSE image_url
  END,
  active, NOW(), NOW() FROM products WHERE store_id = 1;

-- City Department Store (Store 3) - slight discount
INSERT INTO products (store_id, category_id, product_name, description, sku, price, available_quantity, unit, image_url, active, created_at, updated_at)
SELECT 3, category_id, product_name, description, CONCAT('CDS-', sku), price * 0.98, available_quantity + 5, unit,
  CASE
    WHEN product_name LIKE '%Tomato%' THEN 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Onion%' THEN 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Potato%' THEN 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Milk%' THEN 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Bread%' THEN 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Egg%' THEN 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Apple%' THEN 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Banana%' THEN 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Tea%' THEN 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Coffee%' THEN 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Biscuit%' OR product_name LIKE '%Parle%' OR product_name LIKE '%Britannia%' THEN 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Chips%' OR product_name LIKE '%Lay%' THEN 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Chocolate%' THEN 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&auto=format&fit=crop&q=80'
    ELSE image_url
  END,
  active, NOW(), NOW() FROM products WHERE store_id = 1;

-- Green Mart (Store 4) - organic focus, same prices
INSERT INTO products (store_id, category_id, product_name, description, sku, price, available_quantity, unit, image_url, active, created_at, updated_at)
SELECT 4, category_id, product_name, CONCAT('Organic ', description), CONCAT('GM-', sku), price, available_quantity + 15, unit,
  CASE
    WHEN product_name LIKE '%Tomato%' THEN 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Onion%' THEN 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Potato%' THEN 'https://images.unsplash.com/photo-1552525634-c0d1ffa0e43c?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Milk%' THEN 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Apple%' THEN 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Banana%' THEN 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Paneer%' THEN 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Oil%' THEN 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Dal%' OR product_name LIKE '%Toor%' THEN 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&auto=format&fit=crop&q=80'
    ELSE image_url
  END,
  active, NOW(), NOW() FROM products WHERE store_id = 1;

-- Patidar Daily Needs (Store 5) - wholesale focus
INSERT INTO products (store_id, category_id, product_name, description, sku, price, available_quantity, unit, image_url, active, created_at, updated_at)
SELECT 5, category_id, product_name, description, CONCAT('PDN-', sku), price, available_quantity + 20, unit,
  CASE
    WHEN product_name LIKE '%Milk%' THEN 'https://images.unsplash.com/photo-1600718374662-0483d2b9da44?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Bread%' THEN 'https://images.unsplash.com/photo-1590137876181-2a5a7e340de2?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Egg%' THEN 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Apple%' THEN 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Rice%' THEN 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Atta%' THEN 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Oil%' THEN 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Dal%' THEN 'https://images.unsplash.com/photo-1585994192700-1c5c4f2bb42c?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Salt%' THEN 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Sugar%' THEN 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=500&auto=format&fit=crop&q=80'
    ELSE image_url
  END,
  active, NOW(), NOW() FROM products WHERE store_id = 1;

-- Aggarwal Super Mart (Store 6) - department store
INSERT INTO products (store_id, category_id, product_name, description, sku, price, available_quantity, unit, image_url, active, created_at, updated_at)
SELECT 6, category_id, product_name, description, CONCAT('ASM-', sku), price * 0.99, available_quantity + 12, unit,
  CASE
    WHEN product_name LIKE '%Soap%' OR product_name LIKE '%Dettol%' OR product_name LIKE '%Dove%' THEN 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Shampoo%' OR product_name LIKE '%Head%' THEN 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Toothpaste%' OR product_name LIKE '%Colgate%' THEN 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Cream%' OR product_name LIKE '%Nivea%' THEN 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Detergent%' OR product_name LIKE '%Surf%' OR product_name LIKE '%Ariel%' THEN 'https://images.unsplash.com/photo-1585441695325-3eb89fc28b61?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Dishwash%' OR product_name LIKE '%Vim%' THEN 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Milk%' THEN 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Butter%' THEN 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Tea%' THEN 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Biscuit%' OR product_name LIKE '%Parle%' THEN 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop&q=80'
    WHEN product_name LIKE '%Chocolate%' THEN 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&auto=format&fit=crop&q=80'
    ELSE image_url
  END,
  active, NOW(), NOW() FROM products WHERE store_id = 1;

-- Add Pickup Slots for stores 2, 3, 4, 5, 6 for Today and the next 5 days
INSERT IGNORE INTO pickup_slots (store_id, pickup_date, start_time, end_time, capacity, reserved_count, active)
SELECT s.id, CURDATE() + INTERVAL d DAY, '09:00:00', '10:00:00', 10, 1, 1
FROM stores s CROSS JOIN (SELECT 0 AS d UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) days
WHERE s.id IN (2, 3, 4, 5, 6);

INSERT IGNORE INTO pickup_slots (store_id, pickup_date, start_time, end_time, capacity, reserved_count, active)
SELECT s.id, CURDATE() + INTERVAL d DAY, '10:00:00', '11:00:00', 10, 2, 1
FROM stores s CROSS JOIN (SELECT 0 AS d UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) days
WHERE s.id IN (2, 3, 4, 5, 6);

INSERT IGNORE INTO pickup_slots (store_id, pickup_date, start_time, end_time, capacity, reserved_count, active)
SELECT s.id, CURDATE() + INTERVAL d DAY, '11:00:00', '12:00:00', 10, 0, 1
FROM stores s CROSS JOIN (SELECT 0 AS d UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) days
WHERE s.id IN (2, 3, 4, 5, 6);

INSERT IGNORE INTO pickup_slots (store_id, pickup_date, start_time, end_time, capacity, reserved_count, active)
SELECT s.id, CURDATE() + INTERVAL d DAY, '16:00:00', '17:00:00', 10, 1, 1
FROM stores s CROSS JOIN (SELECT 0 AS d UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) days
WHERE s.id IN (2, 3, 4, 5, 6);

INSERT IGNORE INTO pickup_slots (store_id, pickup_date, start_time, end_time, capacity, reserved_count, active)
SELECT s.id, CURDATE() + INTERVAL d DAY, '18:00:00', '19:00:00', 10, 3, 1
FROM stores s CROSS JOIN (SELECT 0 AS d UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) days
WHERE s.id IN (2, 3, 4, 5, 6);
