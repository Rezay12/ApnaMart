import subprocess
import json

# Category mapping:
# 1 = Fruits & Vegetables
# 2 = Dairy & Eggs
# 3 = Snacks & Beverages
# 4 = Household
# 5 = Personal Care
# 6 = Grains & Pulses

# We have 6 stores, each has 66 products.
# Let's define thematic catalogs for each of the 6 stores:

# Store 1: Sharma Kirana Store (Neighborhood staple kirana)
# Store 2: Fresh Mart (Farm fresh, organic produce, exotic fruits, dairy)
# Store 3: City Department Store (Supermarket, modern snacks, confectionery, juices)
# Store 4: Green Mart (Healthy, organic, cold-pressed oils, dry fruits, wellness)
# Store 5: Patidar Daily Needs & Kirana (Traditional Malwa groceries, spices, poha, sev, dals)
# Store 6: Aggarwal Super Mart (Big bazaar, confectionery, party packs, bulk groceries)

def get_store_products(store_id):
    # Returns 66 diverse products for the given store
    if store_id == 1:
        # Sharma Kirana Store
        return [
            # Fruits & Veg (12)
            (1, "Fresh Desi Red Tomatoes", "Locally grown juicy red tomatoes for gravies.", "1 kg", 38.0, 50, "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80"),
            (1, "Nashik Red Onions (Pyaz)", "Pungent and crisp red onions for daily cooking.", "1 kg", 34.0, 60, "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=80"),
            (1, "Pahadi Jyoti Potatoes (Aloo)", "Versatile golden potatoes great for curries and snacks.", "1 kg", 28.0, 75, "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=80"),
            (1, "Fresh Green Chillies (Hari Mirch)", "Spicy pungent chillies for everyday cooking.", "100 g", 12.0, 40, "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=500&auto=format&fit=crop&q=80"),
            (1, "Desi Ginger (Adrak)", "Fragrant, spicy root for flavorful chai and cooking.", "100 g", 22.0, 35, "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80"),
            (1, "Garlic Pearls (Desi Lehsun)", "Fresh whole white garlic with robust medicinal aroma.", "250 g", 55.0, 30, "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=500&auto=format&fit=crop&q=80"),
            (1, "Fresh Phool Gobhi (Cauliflower)", "Crisp white florets harvested fresh from local mandi.", "1 pc", 32.0, 25, "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=500&auto=format&fit=crop&q=80"),
            (1, "Crisp Green Capsicum", "Sweet green bell pepper for stir fries and curries.", "500 g", 35.0, 25, "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500&auto=format&fit=crop&q=80"),
            (1, "Tender Green Peas (Matar)", "Sweet green peas freshly podded from seasonal crop.", "500 g", 45.0, 30, "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=500&auto=format&fit=crop&q=80"),
            (1, "Tender Bhindi (Lady Finger)", "Crisp, slender fresh okra ideal for dry stir fry.", "500 g", 30.0, 30, "https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?w=500&auto=format&fit=crop&q=80"),
            (1, "Fresh Bunch Coriander (Hara Dhaniya)", "Fragrant leaves for garnishing dals, gravies and salads.", "1 bunch", 15.0, 45, "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=500&auto=format&fit=crop&q=80"),
            (1, "Juicy Yellow Lemons (Nimbu)", "High-juice sour lemons packed with vitamin C.", "4 pcs", 20.0, 50, "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=500&auto=format&fit=crop&q=80"),
            # Dairy & Eggs (11)
            (2, "Amul Taaza Toned Milk", "Nutritious pasteurized toned milk with 3.0% fat.", "1 L", 54.0, 40, "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80"),
            (2, "Mother Dairy Classic Cow Milk", "Light and wholesome cow milk with essential calcium.", "500 ml", 28.0, 30, "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop&q=80"),
            (2, "Amul Butter (Pasteurized Salted)", "India's favorite creamy salted butter for toast and parathas.", "100 g", 58.0, 35, "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=80"),
            (2, "Fresh Malai Paneer Cubes", "Soft and juicy paneer made from pure dairy milk.", "200 g", 90.0, 25, "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80"),
            (2, "Fresh Farm White Eggs", "Protein-rich farm fresh eggs, clean and inspected.", "Pack of 6", 45.0, 30, "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500&auto=format&fit=crop&q=80"),
            (2, "Amul Masti Dahi Pouch", "Thick, creamy naturally fermented curd with mild acidity.", "400 g", 35.0, 25, "https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=500&auto=format&fit=crop&q=80"),
            (2, "Modern White Sandwich Bread", "Soft sliced white bread for breakfast toasts and sandwiches.", "400 g", 40.0, 20, "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80"),
            (2, "Amul Cheese Slices (10 Slices)", "Individually wrapped processed cheese slices.", "200 g", 140.0, 25, "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&auto=format&fit=crop&q=80"),
            (2, "Mother Dairy Paneer Block", "High protein fresh cottage cheese block.", "200 g", 95.0, 20, "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=80"),
            (2, "Amul Fresh Cream 25% Milk Fat", "Low fat sterilised cream for curries and desserts.", "250 ml", 65.0, 20, "https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=500&auto=format&fit=crop&q=80"),
            (2, "Britannia Milk Bread", "Sweet milk enriched sliced bread for kids breakfast.", "350 g", 45.0, 20, "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=500&auto=format&fit=crop&q=80"),
            # Snacks & Beverages (11)
            (3, "Parle-G Original Glucose Biscuits", "The timeless favorite tea-time companion for generations.", "250 g", 25.0, 60, "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop&q=80"),
            (3, "Britannia Good Day Cashew Cookies", "Rich butter cookies studded with crunchy cashew nuts.", "200 g", 45.0, 40, "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&auto=format&fit=crop&q=80"),
            (3, "Maggi 2-Minute Masala Noodles", "Classic Indian instant noodles with iconic tastemaker.", "Pack of 4", 56.0, 50, "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=80"),
            (3, "Haldiram's Aloo Bhujia", "Crisp spicy potato and gram flour sev with mint flavor.", "200 g", 52.0, 45, "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80"),
            (3, "Brooke Bond Red Label Tea", "Strong and aromatic CTC black tea blend for kadak chai.", "250 g", 125.0, 35, "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80"),
            (3, "Nescafe Classic Instant Coffee Jar", "100% pure instant coffee crafted from selected robusta beans.", "50 g", 165.0, 25, "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80"),
            (3, "Coca-Cola Original Taste Bottle", "Crisp, cold effervescent cola refreshment.", "750 ml", 40.0, 30, "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80"),
            (3, "Sunfeast Bounce Choco Creme Biscuits", "Cream-filled crunchy chocolate sandwich biscuits.", "150 g", 30.0, 40, "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&auto=format&fit=crop&q=80"),
            (3, "Cadbury 5 Star Chocolate Bar", "Chewy caramel and crunchy nougat covered in milk chocolate.", "40 g", 20.0, 50, "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&auto=format&fit=crop&q=80"),
            (3, "Frooti Fresh 'N' Juicy Mango Drink", "Delicious sweet mango juice drink made with ripe pulps.", "600 ml", 35.0, 35, "https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop&q=80"),
            (3, "Haldiram's Moong Dal Salty Snack", "Crunchy fried yellow moong lentils lightly salted.", "200 g", 48.0, 40, "https://images.unsplash.com/photo-1621996346565-e3d5d6281223?w=500&auto=format&fit=crop&q=80"),
            # Household (10)
            (4, "Surf Excel Easy Wash Detergent Powder", "Removes tough stains like grease and mud with ease.", "1 kg", 145.0, 35, "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&auto=format&fit=crop&q=80"),
            (4, "Vim Lemon Dishwash Bar", "Concentrated lime formula cuts stubborn oil and grease.", "Pack of 3", 45.0, 40, "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=500&auto=format&fit=crop&q=80"),
            (4, "Harpic Power Plus 10X Max Clean", "Thick toilet cleaner liquid that kills 99.9% germs.", "500 ml", 98.0, 30, "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=500&auto=format&fit=crop&q=80"),
            (4, "Colin Glass and Multi-Surface Cleaner", "Streak-free shine for glass, mirrors, and appliances.", "500 ml", 105.0, 25, "https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=500&auto=format&fit=crop&q=80"),
            (4, "Good Knight Gold Flash Mosquito Refill", "Advanced mosquito repellent system with flash vapors.", "45 ml", 82.0, 30, "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80"),
            (4, "Rin Detergent Bar", "Removes dirt from collars and cuffs.", "Pack of 4", 60.0, 30, "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&auto=format&fit=crop&q=80"),
            (4, "Exo Touch & Shine Round Dishwash Bar", "Antibacterial cyclozan formula kills grease bacteria.", "500 g", 52.0, 30, "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=500&auto=format&fit=crop&q=80"),
            (4, "Lizol Disinfectant Surface Cleaner Floral", "Surface cleaner suitable for tiles, marble and granite.", "500 ml", 112.0, 25, "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=500&auto=format&fit=crop&q=80"),
            (4, "Hit Anti Mosquito & Fly Spray", "Effective spray for eliminating flying pests in rooms.", "320 ml", 145.0, 20, "https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=500&auto=format&fit=crop&q=80"),
            (4, "Mangaldeep Jasmine Agarbatti", "Soothing fragrant incense sticks for evening prayers.", "Pack of 80", 50.0, 40, "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80"),
            # Personal Care (11)
            (5, "Dettol Original Bathing Soap", "Antibacterial germ protection soap with soothing pine fragrance.", "Pack of 4", 160.0, 35, "https://images.unsplash.com/photo-1607006314393-810a62eb3511?w=500&auto=format&fit=crop&q=80"),
            (5, "Colgate Strong Teeth Calcium Toothpaste", "Strengthens enamel and provides all-day cavity defense.", "200 g", 110.0, 40, "https://images.unsplash.com/photo-1559591937-e105e4619d85?w=500&auto=format&fit=crop&q=80"),
            (5, "Parachute Pure Coconut Hair Oil", "100% pure edible-grade coconut oil nourishing from root to tip.", "200 ml", 88.0, 45, "https://images.unsplash.com/photo-1608248597359-59828d5d4d3d?w=500&auto=format&fit=crop&q=80"),
            (5, "Head & Shoulders Anti-Dandruff Cool Menthol", "Menthol fresh scalp shampoo that leaves hair flake-free.", "180 ml", 185.0, 20, "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=80"),
            (5, "Lifebuoy Total Germ Protection Soap", "Silver shield formula proven to protect against 10 infection germs.", "Pack of 4", 110.0, 40, "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=500&auto=format&fit=crop&q=80"),
            (5, "Pepsodent Germi Check Toothpaste", "12 hour anti-germ protection for whole family oral hygiene.", "150 g", 85.0, 35, "https://images.unsplash.com/photo-1559591937-e105e4619d85?w=500&auto=format&fit=crop&q=80"),
            (5, "Dabur Vatika Enriched Coconut Hair Oil", "Henna, amla and methi enriched herbal hair therapy.", "150 ml", 75.0, 30, "https://images.unsplash.com/photo-1608248597359-59828d5d4d3d?w=500&auto=format&fit=crop&q=80"),
            (5, "Pond's White Beauty Face Wash", "Vitamin B3 enriched clarifying cleansing foam.", "100 g", 135.0, 25, "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80"),
            (5, "Vaseline Total Moisture Body Lotion", "Micro-droplets of petroleum jelly lock in moisture for 24h.", "200 ml", 185.0, 20, "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80"),
            (5, "Godrej No.1 Sandal & Turmeric Soap", "Enriched with natural oils and sandalwood for glowing skin.", "Pack of 5", 125.0, 30, "https://images.unsplash.com/photo-1607006314393-810a62eb3511?w=500&auto=format&fit=crop&q=80"),
            (5, "Gillette Vector Plus Razor with 2 Blades", "Pivoting head razor with twin blades for comfortable shaving.", "1 pc", 99.0, 25, "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=500&auto=format&fit=crop&q=80"),
            # Grains & Pulses (11)
            (6, "Fortune Chakki Fresh Whole Wheat Atta", "100% stone-ground whole wheat flour for fluffy rotis.", "5 kg", 225.0, 50, "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=80"),
            (6, "India Gate Rozana Basmati Rice", "Aromatic long-grain rice suited for daily dal-chawal and pulao.", "1 kg", 95.0, 45, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80"),
            (6, "Tata Sampann Unpolished Toor Dal", "Natural protein-packed pigeon pea dal with zero chemical polish.", "1 kg", 175.0, 40, "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=500&auto=format&fit=crop&q=80"),
            (6, "Tata Sampann Yellow Moong Dal", "Easy to digest, light and nutritious yellow split lentils.", "500 g", 88.0, 35, "https://images.unsplash.com/photo-1546069901-5ec6a79120b0?w=500&auto=format&fit=crop&q=80"),
            (6, "Fortune Sunlite Refined Sunflower Oil", "Light and cholesterol-free cooking oil fortified with vitamins.", "1 L", 138.0, 40, "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80"),
            (6, "Tata Salt Vacuum Evaporated Iodized", "Desh ka namak with guaranteed purity and iodine content.", "1 kg", 28.0, 70, "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=500&auto=format&fit=crop&q=80"),
            (6, "Fortune Kachi Ghani Mustard Oil", "Pure cold pressed mustard oil with traditional jhaanjh flavor.", "1 L", 155.0, 30, "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80"),
            (6, "Aashirvaad Rava / Sooji", "Roasted granular semolina for healthy upma and halwa.", "500 g", 42.0, 30, "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=80"),
            (6, "Tata Sampann Chana Dal Unpolished", "High protein unpolished Bengal gram dal.", "1 kg", 125.0, 35, "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=500&auto=format&fit=crop&q=80"),
            (6, "Everest Garam Masala Blend", "Select aromatic spice mix providing royal Mughlai fragrance.", "100 g", 85.0, 35, "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=80"),
            (6, "MDH Deggi Mirch Mild Paprika Red", "Provides brilliant natural red color without overpowering heat.", "100 g", 92.0, 35, "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=500&auto=format&fit=crop&q=80"),
        ]

    elif store_id == 2:
        # Fresh Mart (Saket) - Organic greens, exotic fruits, gourmet farm produce
        return [
            # Fruits & Veg (12)
            (1, "Organic Hybrid Vine Tomatoes", "Vine-ripened pesticide-free tomatoes with balanced sweetness.", "1 kg", 46.0, 45, "https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=500&auto=format&fit=crop&q=80"),
            (1, "Baby Red Cherry Tomatoes", "Bursting bite-sized cherry tomatoes perfect for fresh salads.", "250 g", 55.0, 30, "https://images.unsplash.com/photo-1561136594-7f68413baa99?w=500&auto=format&fit=crop&q=80"),
            (1, "Golden Baby Potatoes", "Thin-skinned tender baby potatoes ideal for roasting and dum aloo.", "500 g", 35.0, 35, "https://images.unsplash.com/photo-1508313880080-c4bef0730395?w=500&auto=format&fit=crop&q=80"),
            (1, "Crisp English Cucumber", "Seedless, crunchy greenhouse cucumbers for refreshing salads.", "500 g", 32.0, 40, "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=500&auto=format&fit=crop&q=80"),
            (1, "Fresh Broccoli Florets", "Nutrient-dense green florets rich in antioxidants and fiber.", "1 pc", 58.0, 25, "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=500&auto=format&fit=crop&q=80"),
            (1, "Button Mushrooms Box", "Plump white cultivated button mushrooms harvested daily.", "200 g", 52.0, 30, "https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=500&auto=format&fit=crop&q=80"),
            (1, "Organic Baby Spinach Leaves", "Pre-washed tender baby palak leaves bursting with iron.", "250 g", 40.0, 25, "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop&q=80"),
            (1, "Sweet American Golden Corn", "Tender sweet corn cobs ready for boiling and buttering.", "2 pcs", 38.0, 30, "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=500&auto=format&fit=crop&q=80"),
            (1, "Kashmiri Royal Gala Apples", "Crisp, naturally sweet fragrant red apples from valley orchards.", "1 kg", 165.0, 30, "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=500&auto=format&fit=crop&q=80"),
            (1, "Nagpur Mandarin Oranges", "Juicy, easy-to-peel seasonal citrus fruit rich in Vitamin C.", "1 kg", 85.0, 35, "https://images.unsplash.com/photo-1547514701-42782101795e?w=500&auto=format&fit=crop&q=80"),
            (1, "Robusta Golden Bananas", "Naturally ripened sweet bananas packed with potassium energy.", "1 Dozen", 55.0, 40, "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=80"),
            (1, "New Zealand Green Kiwis", "Zesty, nutrient-dense kiwifruit with vibrant emerald flesh.", "3 pcs", 95.0, 20, "https://images.unsplash.com/photo-1585059895524-72359e06133a?w=500&auto=format&fit=crop&q=80"),
            # Dairy & Eggs (11)
            (2, "Epigamia Natural Greek Yogurt", "High protein strained yogurt with zero preservatives.", "100 g", 48.0, 25, "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=80"),
            (2, "Milky Mist Fresh Paneer Block", "Vacuum packed soft paneer with authentic dairy texture.", "200 g", 98.0, 30, "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=80"),
            (2, "Brown Country Farm Eggs", "Free-range eggs with deep golden yolks and high omega-3.", "Pack of 10", 95.0, 25, "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&auto=format&fit=crop&q=80"),
            (2, "Gowardhan Pure Cow Ghee", "Traditional golden cow ghee with rich granular danedar texture.", "1 L", 650.0, 20, "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=80"),
            (2, "Britannia Cheddar Cheese Slices", "Melt-in-mouth creamy cheese slices for gourmet sandwiches.", "200 g", 145.0, 25, "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&auto=format&fit=crop&q=80"),
            (2, "Artisanal Multigrain Sourdough Loaf", "Naturally fermented sourdough with toasted seeds and rustic crust.", "400 g", 75.0, 15, "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=500&auto=format&fit=crop&q=80"),
            (2, "Yakult Probiotic Fermented Milk Drink", "Contains over 6.5 billion live Shirota strain bacteria.", "5x65 ml", 90.0, 30, "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop&q=80"),
            (2, "Country Delight Farm Fresh Buffalo Milk", "High cream pure unadulterated buffalo milk.", "1 L", 72.0, 25, "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80"),
            (2, "Amul Gourmet Salted Butter Tub", "Creamy spreadable tabletop butter made with pure milk fat.", "500 g", 275.0, 20, "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=80"),
            (2, "Epigamia Alphonso Mango Greek Yogurt", "Real alphonso mango layered on thick Greek curd.", "120 g", 55.0, 25, "https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=500&auto=format&fit=crop&q=80"),
            (2, "The Laughing Cow Cheese Triangles", "Creamy processed cheese portions in easy open foil.", "Pack of 8", 120.0, 20, "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&auto=format&fit=crop&q=80"),
            # Snacks & Beverages (11)
            (3, "Raw Pressery Cold Pressed Orange Juice", "100% pure cold-pressed valencia oranges with no added sugar.", "1 L", 160.0, 20, "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=80"),
            (3, "Quaker Rolled Oats Whole Grain", "Heart-healthy 100% whole grain oats rich in beta-glucan.", "1 kg", 195.0, 30, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80"),
            (3, "Twinings Pure Green Tea Bags", "Delicate, light and refreshing green tea for daily detox.", "25 Bags", 180.0, 25, "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=500&auto=format&fit=crop&q=80"),
            (3, "Pringles Sour Cream & Onion Crisps", "Delectable saddle crisps packed with creamy herb zest.", "107 g", 115.0, 35, "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80"),
            (3, "Sunfeast Dark Fantasy Choco Fills", "Decadent crisp cookies molten with molten chocolate heart.", "300 g", 130.0, 30, "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&auto=format&fit=crop&q=80"),
            (3, "Blue Tokai Easy Pour Dark Roast Coffee", "Specialty ground coffee single-serve pour over sachets.", "Pack of 5", 220.0, 20, "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80"),
            (3, "Kellogg's Muesli Fruit Magic 0% Added Sugar", "Toasted multigrain cereal with 4 dried fruits and nuts.", "500 g", 345.0, 20, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80"),
            (3, "Tropicana 100% Mixed Fruit Juice", "Pure pressed multi-fruit juice with no added coloring.", "1 L", 145.0, 25, "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=80"),
            (3, "Real Thai Rice Stick Noodles (3mm)", "Gluten free traditional rice noodles for pad thai.", "200 g", 160.0, 20, "https://images.unsplash.com/photo-1621996346565-e3d5d6281223?w=500&auto=format&fit=crop&q=80"),
            (3, "Lindt Excellence 70% Cocoa Dark Chocolate", "Intense gourmet dark chocolate bar crafted by Swiss master chocolatiers.", "100 g", 275.0, 15, "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&auto=format&fit=crop&q=80"),
            (3, "Yoga Bar Breakfast Protein Energy Bar", "Whole nuts, seeds and oats energy boost snack.", "Pack of 6", 210.0, 25, "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop&q=80"),
            # Household (10)
            (4, "Pril Lime Power Dishwash Liquid", "Active grease-dissolving concentrated formula for sparkling utensils.", "750 ml", 155.0, 25, "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&auto=format&fit=crop&q=80"),
            (4, "Godrej Ezee Liquid Detergent", "pH neutral specialized wash for woollens, silks, and delicates.", "1 L", 185.0, 20, "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=500&auto=format&fit=crop&q=80"),
            (4, "Origami Bamboo Kitchen Towel Rolls", "Absorbent 2-ply unbleached bamboo pulp kitchen rolls.", "Pack of 2", 120.0, 30, "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80"),
            (4, "Bref Toilet Power Activ Pine Gel", "Continuous hygienic clean and fresh toilet rim block.", "Pack of 2", 195.0, 20, "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=500&auto=format&fit=crop&q=80"),
            (4, "Odonil Room Air Freshener Jasmine Bloom", "Long lasting natural flower block for living areas.", "50 g", 65.0, 35, "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80"),
            (4, "Cif Power & Shine Kitchen Degreaser Spray", "Lifts 100% tough burnt grease from stove and tiles.", "500 ml", 210.0, 20, "https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=500&auto=format&fit=crop&q=80"),
            (4, "Dettol Multi-Use Disinfectant Surface Spray", "Kills flu viruses and bacteria on hard and soft surfaces.", "450 ml", 235.0, 20, "https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=500&auto=format&fit=crop&q=80"),
            (4, "Scotch-Brite Anti-Bacterial Microfiber Cloth", "Traps dust and liquid without scratching delicate counter tops.", "Pack of 3", 165.0, 25, "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=500&auto=format&fit=crop&q=80"),
            (4, "Phool Natural Bamboo Incense Cones", "Handcrafted temple flower recycled incense cones.", "Pack of 40", 165.0, 25, "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80"),
            (4, "Vanish Oxi Action Fabric Stain Remover", "Boosts stain removal for whites and coloured garments.", "400 g", 190.0, 20, "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&auto=format&fit=crop&q=80"),
            # Personal Care (11)
            (5, "Cetaphil Gentle Skin Cleanser", "Dermatologist recommended non-comedogenic soothing facial wash.", "125 ml", 325.0, 15, "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80"),
            (5, "Dove Deeply Nourishing Body Wash", "Micro-moisture formula leaving skin supple after shower.", "250 ml", 190.0, 20, "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=80"),
            (5, "Sensodyne Rapid Relief Toothpaste", "Clinically proven desensitizing formula for tooth sensitivity.", "150 g", 180.0, 25, "https://images.unsplash.com/photo-1559591937-e105e4619d85?w=500&auto=format&fit=crop&q=80"),
            (5, "Biotique Bio Kelp Protein Shampoo", "Ayurvedic blend of kelp and mint for intense hair revitalization.", "190 ml", 175.0, 25, "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=80"),
            (5, "Sebamed Cleansing Soap-Free Bar pH 5.5", "Maintains skin acid mantle barrier without drying.", "100 g", 215.0, 20, "https://images.unsplash.com/photo-1607006314393-810a62eb3511?w=500&auto=format&fit=crop&q=80"),
            (5, "Simple Kind to Skin Refreshing Facial Gel Wash", "100% soap-free face cleanser with Vitamin E and B5.", "150 ml", 285.0, 20, "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80"),
            (5, "Nivea MEN Fresh Active Deodorant Spray", "Ocean extracts 48h odor defense for active days.", "150 ml", 199.0, 25, "https://images.unsplash.com/photo-1608248597359-59828d5d4d3d?w=500&auto=format&fit=crop&q=80"),
            (5, "Himalaya Purifying Neem Face Wash", "Soap-free herbal formulation that clears impurities and pimples.", "150 ml", 160.0, 30, "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80"),
            (5, "Biotique Bio Dandelion Ageless Lightening Serum", "Pure dandelion and nutmeg oil for youthful skin glow.", "40 ml", 220.0, 15, "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80"),
            (5, "Oral-B Vitality Electric Toothbrush", "CrossAction vibrating bristles for superior plaque removal.", "1 pc", 1299.0, 10, "https://images.unsplash.com/photo-1559591937-e105e4619d85?w=500&auto=format&fit=crop&q=80"),
            (5, "Forest Essentials Soundarya Radiance Silk Soap", "Handcrafted luxury soap infused with 24k gold bhasma.", "100 g", 350.0, 15, "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=500&auto=format&fit=crop&q=80"),
            # Grains & Pulses (11)
            (6, "Organic Tattva Whole Wheat Flour", "100% certified organic stone-ground whole wheat atta.", "5 kg", 270.0, 35, "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80"),
            (6, "Kohinoor Royale Biryani Basmati", "Extra long slender grains aged for 2 years for aromatic biryani.", "1 kg", 185.0, 30, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80"),
            (6, "Borges Extra Virgin Olive Oil", "Cold extracted Spanish olive oil for salads, dips and pasta.", "500 ml", 599.0, 20, "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80"),
            (6, "24 Mantra Organic Toor Dal", "Unpolished chemical-free pigeon peas grown by certified organic farms.", "1 kg", 195.0, 25, "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=500&auto=format&fit=crop&q=80"),
            (6, "24 Mantra Organic Chana Dal", "Protein-rich unpolished organic split Bengal gram.", "1 kg", 155.0, 25, "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=500&auto=format&fit=crop&q=80"),
            (6, "Saffola Gold Pro Healthy Lifestyle Oil", "Dual seed blend of rice bran and sunflower oil with antioxidants.", "1 L", 175.0, 30, "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80"),
            (6, "Catch Pink Himalayan Rock Salt Grinder", "Pure mountain mineral salt in an adjustable tabletop grinder.", "100 g", 99.0, 30, "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=500&auto=format&fit=crop&q=80"),
            (6, "Organic Tattva Kabuli Chana", "Certified pesticide-free big chickpea legumes.", "500 g", 110.0, 25, "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=500&auto=format&fit=crop&q=80"),
            (6, "Keya Garlic Bread Seasoning", "Gourmet Italian herb mix with dehydrated garlic flakes.", "50 g", 89.0, 30, "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=80"),
            (6, "Organic Tattva Flax Seeds", "Rich source of plant-based Alpha-Linolenic Acid Omega 3.", "250 g", 75.0, 30, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80"),
            (6, "Urban Platter Organic Chia Seeds", "High dietary fiber superfood seeds for morning puddings.", "250 g", 185.0, 25, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80"),
        ]

    elif store_id == 3:
        # City Department Store (Vijay Nagar) - Packaged foods, snacks, cereals, household
        return [
            # Fruits & Veg (12)
            (1, "Fresh Desi Carrots (Gajar)", "Crunchy red Delhi carrots sweet and rich in beta-carotene.", "1 kg", 42.0, 40, "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&auto=format&fit=crop&q=80"),
            (1, "Sweet Beetroot (Chukandar)", "Earthy, firm deep-ruby beets for vibrant salads and fresh juice.", "500 g", 28.0, 30, "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=500&auto=format&fit=crop&q=80"),
            (1, "Tender Green Bottle Gourd (Lauki)", "Fresh light gourd, hydrating and easy on digestion.", "1 pc", 25.0, 35, "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=500&auto=format&fit=crop&q=80"),
            (1, "Fresh Water Tender Coconut (Nariyal)", "Electrolyte-rich sweet coconut water with tender soft malai.", "1 pc", 50.0, 30, "https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?w=500&auto=format&fit=crop&q=80"),
            (1, "Sweet Papaya Semi-Ripe", "Fresh tropical papaya rich in digestive enzymes.", "1 kg", 55.0, 25, "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=500&auto=format&fit=crop&q=80"),
            (1, "Seedless Green Grapes", "Plump, sweet and tart crisp table grapes.", "500 g", 75.0, 30, "https://images.unsplash.com/photo-1596363505729-4190a9506133?w=500&auto=format&fit=crop&q=80"),
            (1, "Granny Smith Green Apples", "Tart and tangy crisp green apples imported fresh.", "1 kg", 190.0, 20, "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500&auto=format&fit=crop&q=80"),
            (1, "Fresh Ridge Gourd (Turai)", "Soft ribbed tender gourd rich in dietary fiber.", "500 g", 30.0, 30, "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=500&auto=format&fit=crop&q=80"),
            (1, "Green Zucchini Courgettes", "Firm Italian squash delicious grilled or in pastas.", "500 g", 45.0, 25, "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=500&auto=format&fit=crop&q=80"),
            (1, "Sweet Mosambi (Sweet Lime)", "Juicy sweet citrus fruit packed with hydration.", "1 kg", 65.0, 35, "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=500&auto=format&fit=crop&q=80"),
            (1, "Red Washington Apples", "Classic sweet red apples crisp and juicy.", "1 kg", 170.0, 25, "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=80"),
            (1, "Green Raw Mango (Kaccha Aam)", "Sour unripe mangoes perfect for pickles, aam panna and chutneys.", "500 g", 40.0, 30, "https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop&q=80"),
            # Dairy & Eggs (11)
            (2, "Mother Dairy Cow Milk Pouch", "Wholesome pasteurized cow milk with natural goodness.", "1 L", 56.0, 40, "https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=500&auto=format&fit=crop&q=80"),
            (2, "Amul Spiced Buttermilk (Chaas)", "Refreshing salted masala chaas with mint, jeera and ginger.", "500 ml", 22.0, 45, "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80"),
            (2, "Amul Diced Mozzarella Cheese", "100% dairy mozzarella with perfect stretch for pizzas.", "200 g", 125.0, 25, "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=500&auto=format&fit=crop&q=80"),
            (2, "English Oven 100% Brown Bread", "Dietary fiber enriched wholesome brown loaf.", "400 g", 45.0, 25, "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80"),
            (2, "Fresh Farm Eggs Mega Tray", "Commercial bulk tray of clean graded fresh eggs.", "Pack of 30", 210.0, 15, "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500&auto=format&fit=crop&q=80"),
            (2, "Milky Mist Curd Pouch", "Pasteurized homogenized thick curd.", "400 g", 38.0, 25, "https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=500&auto=format&fit=crop&q=80"),
            (2, "Prabhat Pure White Butter (Makkhan)", "Desi style unsalted white butter for hot parathas.", "200 g", 110.0, 20, "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=80"),
            (2, "Modern Multigrain High Fiber Bread", "Enriched with soya, oats and flax seeds.", "400 g", 50.0, 20, "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=500&auto=format&fit=crop&q=80"),
            (2, "Amul Kool Kesar Badam Milk Can", "Chilled flavored milk beverage infused with saffron and almonds.", "180 ml", 35.0, 30, "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop&q=80"),
            (2, "Go Cheese Spread Plain", "Velvety smooth spreadable cheddar cheese.", "200 g", 115.0, 20, "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&auto=format&fit=crop&q=80"),
            (2, "Nutriva Brown Cage Free Eggs", "High protein country eggs rich in lutein.", "Pack of 6", 60.0, 25, "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&auto=format&fit=crop&q=80"),
            # Snacks & Beverages (11)
            (3, "Lay's American Style Cream & Onion", "Crunchy ridged potato chips flavored with rich sour cream and herbs.", "90 g", 40.0, 50, "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80"),
            (3, "Kurkure Masala Munch Crisps", "Spicy, crunchy corn and rice puffs with chatpata seasoning.", "90 g", 20.0, 60, "https://images.unsplash.com/photo-1621996346565-e3d5d6281223?w=500&auto=format&fit=crop&q=80"),
            (3, "Cadbury Dairy Milk Silk Chocolate", "Smooth, velvety milk chocolate that melts instantly on the tongue.", "150 g", 175.0, 30, "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&auto=format&fit=crop&q=80"),
            (3, "Doritos Nacho Cheese Tortilla Chips", "Bold, crunchy triangular corn nachos blasted with cheese.", "140 g", 50.0, 35, "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80"),
            (3, "Thums Up Toofani Taste Pet Bottle", "Spicy, carbonated strong cola with thunderous fizz.", "750 ml", 40.0, 40, "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80"),
            (3, "Paper Boat Aamras Mango Delight", "Real Alphonso mango pulp juice reminiscent of grandma's kitchen.", "250 ml", 35.0, 40, "https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop&q=80"),
            (3, "Ferrero Rocher Chocolate Box", "Whole hazelnut coated in hazelnut cocoa cream and wafer.", "16 pcs", 549.0, 15, "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&auto=format&fit=crop&q=80"),
            (3, "Tata Tea Gold Fine Leaf & Dust", "Gently rolled fragrant long leaves blended with fine Assam CTC.", "500 g", 310.0, 30, "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80"),
            (3, "Bru Instant Coffee Chicory Mix", "Made from fine blend of robusta beans and roasted chicory.", "100 g", 185.0, 25, "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80"),
            (3, "Sprite Lemon-Lime Sparkling Pet", "Crisp, clean citrus soda that quenches thirst instantly.", "750 ml", 40.0, 35, "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80"),
            (3, "Oreo Golden Vanilla Sandwich Biscuits", "Golden sweet sandwich biscuits with vanilla cream.", "120 g", 35.0, 35, "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop&q=80"),
            # Household (10)
            (4, "Ariel Matic Front Load Detergent Powder", "Oxi-stain fighters formulated specifically for front load washers.", "2 kg", 495.0, 20, "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&auto=format&fit=crop&q=80"),
            (4, "Comfort Fabric Conditioner Morning Fresh", "Provides all-day long-lasting fragrance and softens clothes.", "860 ml", 220.0, 25, "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=500&auto=format&fit=crop&q=80"),
            (4, "Lizol Floor Cleaner Citrus Surface Disinfectant", "Kills 99.9% illness-causing germs and leaves pleasant citrus scent.", "1 L", 215.0, 30, "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=500&auto=format&fit=crop&q=80"),
            (4, "Scotch-Brite Sponge Scrub Pack", "Non-scratch sponge combined with abrasive green scrubber pad.", "Pack of 3", 65.0, 40, "https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=500&auto=format&fit=crop&q=80"),
            (4, "Odonil Exotic Lavender Room Spray", "Aerosol fragrance mist delivering instant floral refreshment.", "220 ml", 155.0, 25, "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80"),
            (4, "Baygon Max Cockroach Killer Spray", "Targeted nozzle knocks down cockroaches and crawling insects.", "400 ml", 195.0, 20, "https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=500&auto=format&fit=crop&q=80"),
            (4, "Pril Kraft Lime Dishwash Gel", "High lather grease-cutting formula.", "425 ml", 99.0, 30, "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&auto=format&fit=crop&q=80"),
            (4, "Dettol Disinfectant Liquid Lime Fresh", "Multipurpose hygiene liquid for personal and home care.", "500 ml", 185.0, 25, "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=500&auto=format&fit=crop&q=80"),
            (4, "Scotch-Brite Kitchen Squeegee Wiper", "Streak-free rubber blade cleans kitchen sinks and slabs.", "1 pc", 125.0, 25, "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=500&auto=format&fit=crop&q=80"),
            (4, "Good Knight Flash Liquid Vaporizer Machine", "Heater machine with mosquito liquid cartridge.", "1 unit", 115.0, 30, "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80"),
            # Personal Care (11)
            (5, "Nivea Soft Light Moisturizing Cream", "Enriched with jojoba oil and Vitamin E for quick absorbing hydration.", "200 ml", 240.0, 25, "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80"),
            (5, "Dettol Skincare Liquid Handwash Refill", "Moisturizing antibacterial hand cleanser with lotus flower extracts.", "750 ml", 125.0, 35, "https://images.unsplash.com/photo-1607006314393-810a62eb3511?w=500&auto=format&fit=crop&q=80"),
            (5, "Pantene Pro-V Hair Fall Control Shampoo", "Strengthens hair from root to tip to combat breakage.", "340 ml", 290.0, 20, "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=80"),
            (5, "Gillette Mach3 Men's Razor with 2 Cartridges", "High definition nano-thin blades for irritation-free shaving.", "1 pc", 345.0, 20, "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=500&auto=format&fit=crop&q=80"),
            (5, "Oral-B Pro-Health Toothbrush Pack", "CrissCross bristles angled to remove plaque between teeth.", "Pack of 4", 175.0, 25, "https://images.unsplash.com/photo-1559591937-e105e4619d85?w=500&auto=format&fit=crop&q=80"),
            (5, "Pond's Light Moisturiser with Vitamin E", "Non-oily water-light formula for all season hydration.", "150 ml", 180.0, 25, "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80"),
            (5, "Dove Cream Beauty Bathing Bar", "Formulated with 1/4th moisturizing milk cream for soft skin.", "Pack of 3", 185.0, 30, "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=500&auto=format&fit=crop&q=80"),
            (5, "Tresemme Keratin Smooth Hair Shampoo", "Argan oil infused shampoo for silky salon-smooth hair.", "340 ml", 310.0, 20, "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=80"),
            (5, "Vaseline Lip Therapy Rosy Lips", "Locks in moisture with a soft rose tint and berry flavor.", "17 g", 145.0, 30, "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80"),
            (5, "Colgate MaxFresh Peppermint Cooling Crystals", "Breath-refreshing cooling crystals infused gel toothpaste.", "150 g", 120.0, 35, "https://images.unsplash.com/photo-1559591937-e105e4619d85?w=500&auto=format&fit=crop&q=80"),
            (5, "Garnier Men PowerWhite Double Action Face Wash", "Charcoal and clay formula clears dirt and excess pollution oil.", "100 g", 180.0, 25, "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80"),
            # Grains & Pulses (11)
            (6, "Aashirvaad Select Sharbati Atta", "Crafted from 100% MP Sharbati grains for softest golden rotis.", "5 kg", 285.0, 40, "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=80"),
            (6, "Fortune Everyday Basmati Rice", "Pulao rice with fragrant aroma and consistent long grain length.", "5 kg", 440.0, 25, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80"),
            (6, "Dhara Kachi Ghani Mustard Oil", "Traditional cold-pressed pungency imparting classic flavor.", "1 L", 162.0, 30, "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80"),
            (6, "Tata Sampann Kabuli Chana", "Large grain chickpeas ideal for Punjabi chole and Mediterranean hummus.", "1 kg", 160.0, 30, "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=500&auto=format&fit=crop&q=80"),
            (6, "Emami Healthy & Tasty Rice Bran Cooking Oil", "High in Oryzanol which maintains healthy cholesterol.", "1 L", 145.0, 30, "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80"),
            (6, "Tata Sampann Urad Dal Split Chilka", "Protein-dense black split lentils for dal makhani and vada.", "500 g", 85.0, 35, "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=500&auto=format&fit=crop&q=80"),
            (6, "Saffola Masala Oats Classic Masala", "Tasty 100% wholegrain oats with Indian vegetables and spices.", "400 g", 165.0, 25, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80"),
            (6, "Everest Turmeric Powder (Haldi)", "Golden yellow pure powdered rhizomes with natural aroma.", "200 g", 65.0, 35, "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80"),
            (6, "Everest Coriander Powder (Dhaniya)", "Finely ground aromatic green coriander seeds.", "200 g", 55.0, 35, "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=80"),
            (6, "Fortune Besan Gram Flour", "100% pure chana dal milled for crisp pakodas and laddoos.", "500 g", 58.0, 35, "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=80"),
            (6, "Daawat Super Basmati Rice", "Pearlescent extra long grains for biryani celebration.", "1 kg", 155.0, 30, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80"),
        ]

    elif store_id == 4:
        # Green Mart (Old Palasia) - Organic, hydroponics, exotic fruits, wellness, eco goods
        return [
            # Fruits & Veg (12)
            (1, "Hydroponic Cherry Tomatoes Vine", "Clean greenhouse-grown cluster cherry tomatoes rich in sweetness.", "250 g", 65.0, 25, "https://images.unsplash.com/photo-1561136594-7f68413baa99?w=500&auto=format&fit=crop&q=80"),
            (1, "Organic Crisp Romaine Lettuce", "Hydroponic pesticide-free lettuce heads for gourmet Caesar salads.", "200 g", 48.0, 25, "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80"),
            (1, "Imported Hass Avocado", "Nutrient-rich buttery avocados loaded with healthy monounsaturated fats.", "1 pc", 120.0, 20, "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500&auto=format&fit=crop&q=80"),
            (1, "Fresh Exotic Dragonfruit (Pitaya)", "Vibrant pink skin with specked sweet white pulp.", "1 pc", 85.0, 20, "https://images.unsplash.com/photo-1527325678964-54921661f888?w=500&auto=format&fit=crop&q=80"),
            (1, "Organic Pomegranate Pearls (Anar)", "Deep crimson ruby arils rich in antioxidants and iron.", "1 kg", 175.0, 25, "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=500&auto=format&fit=crop&q=80"),
            (1, "Fresh Blueberries Punnet", "Sweet and tart plump berries imported fresh for smoothies and bowls.", "125 g", 220.0, 15, "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=500&auto=format&fit=crop&q=80"),
            (1, "Sweet Strawberries Box", "Fragrant Mahabaleshwar strawberries bursting with natural berry flavor.", "200 g", 95.0, 25, "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&auto=format&fit=crop&q=80"),
            (1, "Organic Seedless Cucumbers", "Crisp skin cucumbers grown without chemical spray.", "500 g", 38.0, 30, "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=500&auto=format&fit=crop&q=80"),
            (1, "Fresh Sweet Genovese Basil", "Intensely fragrant aromatic herbs for pesto and Italian dishes.", "50 g", 35.0, 20, "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=500&auto=format&fit=crop&q=80"),
            (1, "Yellow & Red Bell Peppers Trio", "Sweet greenhouse peppers rich in carotene and crunch.", "500 g", 85.0, 20, "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500&auto=format&fit=crop&q=80"),
            (1, "Exotic Golden Kiwifruit", "Silky smooth sweet golden flesh with zero acidity.", "3 pcs", 125.0, 20, "https://images.unsplash.com/photo-1585059895524-72359e06133a?w=500&auto=format&fit=crop&q=80"),
            (1, "Fresh Lemongrass Stalks", "Citrus-scented herbal stalks for detox tea and Asian curries.", "100 g", 30.0, 25, "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=500&auto=format&fit=crop&q=80"),
            # Dairy & Eggs (11)
            (2, "Akshayakalpa Organic Cow Milk", "Certified organic whole milk from pastured cows without synthetic hormones.", "1 L", 78.0, 25, "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80"),
            (2, "Akshayakalpa Artisanal Organic Paneer", "Handcrafted traditional paneer from organic A2 cow milk.", "200 g", 135.0, 20, "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80"),
            (2, "Two Brothers Organic Cultured A2 Ghee", "Bilona method churned pure A2 Gir cow Vedic ghee.", "500 ml", 980.0, 15, "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=80"),
            (2, "Free-Range Organic Country Eggs", "Heritage-breed pastured chicken eggs with vibrant orange yolks.", "Pack of 6", 85.0, 20, "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&auto=format&fit=crop&q=80"),
            (2, "Alpro Unsweetened Almond Milk", "Dairy-free plant-based milk enriched with calcium and Vitamin B12.", "1 L", 295.0, 15, "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop&q=80"),
            (2, "Akshayakalpa Artisanal Salted Butter", "Traditional cultured organic butter made from fresh sweet cream.", "200 g", 165.0, 20, "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=80"),
            (2, "Epigamia Strawberry Greek Yogurt", "Greek yogurt with natural fruit puree rich in protein.", "120 g", 55.0, 25, "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=80"),
            (2, "Under The Mango Tree Pure Raw Honey", "Single-origin wild unprocessed forest bee honey.", "500 g", 410.0, 20, "https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=500&auto=format&fit=crop&q=80"),
            (2, "Oatly Original Oat Drink", "Creamy Swedish plant-based milk formulated for lattes and cereals.", "1 L", 345.0, 15, "https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=500&auto=format&fit=crop&q=80"),
            (2, "Artisanal Goat Cheese Feta Crumbles", "Tangy and creamy feta aged in natural brine.", "150 g", 260.0, 15, "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&auto=format&fit=crop&q=80"),
            (2, "The Baker's Dozen Country Sourdough", "48 hour naturally fermented wild yeast bread loaf.", "350 g", 85.0, 15, "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=500&auto=format&fit=crop&q=80"),
            # Snacks & Beverages (11)
            (3, "Urban Platter Premium California Almonds", "Crunchy jumbo-sized raw almonds packed with Vitamin E.", "500 g", 480.0, 25, "https://images.unsplash.com/photo-1508061252966-f72fb9b48624?w=500&auto=format&fit=crop&q=80"),
            (3, "W240 Whole Raw Cashew Nuts", "Creamy, naturally sweet gourmet cashews perfect for snaking.", "500 g", 520.0, 25, "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80"),
            (3, "Vahdam Vedic Masala Chai Loose Leaf", "Estate single-origin Assam black tea spiced with crushed cardamom and clove.", "100 g", 260.0, 20, "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80"),
            (3, "The Whole Truth Dark Chocolate Peanut Butter", "Slow roasted peanuts blended with dark cocoa and zero added refined sugar.", "350 g", 325.0, 20, "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&auto=format&fit=crop&q=80"),
            (3, "Yogabar Dark Chocolate Multigrain Bars", "Wholesome snack bar made of quinoa, oats, chia seeds and dark chocolate.", "Pack of 6", 240.0, 25, "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop&q=80"),
            (3, "Organic Medjool Premium Dates", "Soft, caramel-like rich desert dates packed with natural energy.", "500 g", 495.0, 20, "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=500&auto=format&fit=crop&q=80"),
            (3, "Roasted & Salted California Pistachios", "Gourmet naturally opened crunchy green pistachios in shell.", "250 g", 360.0, 25, "https://images.unsplash.com/photo-1508061252966-f72fb9b48624?w=500&auto=format&fit=crop&q=80"),
            (3, "Organic Green Afghan Raisins (Kishmish)", "Sun-dried seedless slender green raisins naturally sweet.", "250 g", 160.0, 30, "https://images.unsplash.com/photo-1596363505729-4190a9506133?w=500&auto=format&fit=crop&q=80"),
            (3, "Epigamia Vegan Cold Coffee Drink", "Coconut milk brewed cold brew coffee with zero dairy.", "200 ml", 90.0, 25, "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80"),
            (3, "Organic Kashmir Walnut Kernels", "Brain-boosting halved walnut kernels without bitter aftertaste.", "250 g", 390.0, 20, "https://images.unsplash.com/photo-1508061252966-f72fb9b48624?w=500&auto=format&fit=crop&q=80"),
            (3, "Raw Pressery Detox Green Juice", "Pressed celery, cucumber, kale, green apple and mint.", "250 ml", 120.0, 20, "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=80"),
            # Household (10)
            (4, "Rustic Art Bio-Laundry Liquid Concentrate", "Biodegradable, non-toxic plant-based natural laundry wash.", "1 L", 380.0, 20, "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&auto=format&fit=crop&q=80"),
            (4, "The Better Home Natural Dishwashing Gel", "Enzymatic coconut and citrus formula safe for baby utensils.", "500 ml", 249.0, 20, "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=500&auto=format&fit=crop&q=80"),
            (4, "Beco 100% Bamboo Unbleached Toilet Rolls", "Eco-friendly tree-free biodegradable 3-ply bamboo tissue.", "Pack of 4", 175.0, 25, "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80"),
            (4, "Sacred Earth Natural Herbal Floor Cleaner", "Infused with pine, eucalyptus and citronella essential oils.", "500 ml", 190.0, 25, "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=500&auto=format&fit=crop&q=80"),
            (4, "Phool Natural Citronella Mosquito Cones", "Organic flower charcoal-free mosquito repellent incense.", "Pack of 40", 175.0, 25, "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80"),
            (4, "Beco Natural Kitchen Garbage Bags", "Compostable corn starch biodegradable dustbin liners.", "Pack of 30", 160.0, 30, "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=500&auto=format&fit=crop&q=80"),
            (4, "Koparo Clean Natural All Surface Cleaner Spray", "Powered by tea tree and lime essential oils for counter shine.", "500 ml", 225.0, 20, "https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=500&auto=format&fit=crop&q=80"),
            (4, "Rustic Art Natural Dish Wash Bar", "Cold process coconut soap bar with lemon peel powder.", "150 g", 75.0, 30, "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=500&auto=format&fit=crop&q=80"),
            (4, "Pure Camphor Tablets (Bhimseni Kapur)", "Original crystalline pure burning camphor for pooja diffusers.", "100 g", 195.0, 25, "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80"),
            (4, "Beco Bamboo Cotton Buds", "Biodegradable natural bamboo ear swabs with pure organic cotton tips.", "Pack of 100", 99.0, 35, "https://images.unsplash.com/photo-1559591937-e105e4619d85?w=500&auto=format&fit=crop&q=80"),
            # Personal Care (11)
            (5, "Mamaearth Onion Hair Fall Control Shampoo", "Loaded with onion oil and plant keratin for hair strengthening.", "250 ml", 319.0, 20, "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=80"),
            (5, "Forest Essentials Pure Rosewater Facial Mist", "Distilled steam-purified Kannauj desi damascena roses.", "130 ml", 425.0, 15, "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80"),
            (5, "Rustic Art Organic Neem Basil Soap", "Cold processed antibacterial soap enriched with certified organic oils.", "100 g", 145.0, 30, "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=500&auto=format&fit=crop&q=80"),
            (5, "WOW Skin Science Apple Cider Vinegar Face Wash", "Built-in silicone face brush deeply cleanses pores.", "150 ml", 349.0, 20, "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80"),
            (5, "Biotique Bio Morning Nectar Moisturizer", "Honey, wheatgerm and seaweed skin nourishment lotion.", "190 ml", 195.0, 25, "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80"),
            (5, "Kama Ayurveda Kumkumadi Miraculous Beauty Fluid", "Ayurvedic night serum formulated with pure Kashmiri saffron.", "12 ml", 995.0, 10, "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80"),
            (5, "Bare Necessities Zero Waste Natural Deodorant", "Organic arrowroot and shea butter armpit freshener balm.", "50 g", 350.0, 15, "https://images.unsplash.com/photo-1608248597359-59828d5d4d3d?w=500&auto=format&fit=crop&q=80"),
            (5, "Soulflower Coldpressed Castor Hair Oil", "Hexane-free pure Jamaican style thick castor seed oil.", "225 ml", 280.0, 20, "https://images.unsplash.com/photo-1608248597359-59828d5d4d3d?w=500&auto=format&fit=crop&q=80"),
            (5, "Vicco Vajradanti Ayurvedic Herbal Toothpaste", "18 Ayurvedic barks and roots for gum strengthening.", "150 g", 98.0, 30, "https://images.unsplash.com/photo-1559591937-e105e4619d85?w=500&auto=format&fit=crop&q=80"),
            (5, "Khadi Natural Sandalwood & Honey Body Wash", "SLS and paraben free hydrating herbal bath cleanser.", "210 ml", 210.0, 20, "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=80"),
            (5, "The Tribe Concepts 24k Gold Collagen Scrub", "Natural crushed almond and sandalwood exfoliator.", "50 g", 450.0, 15, "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=500&auto=format&fit=crop&q=80"),
            # Grains & Pulses (11)
            (6, "Organic Tattva Royal Brown Basmati Rice", "Whole grain rice with high dietary fiber and low glycemic index.", "1 kg", 175.0, 30, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80"),
            (6, "Cold-Pressed Wood-Churned Yellow Mustard Oil", "Traditionally expeller-extracted yellow sarson oil retaining original nutrients.", "1 L", 285.0, 25, "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80"),
            (6, "Organic Raw White Quinoa Seeds", "Complete plant protein packed with all 9 essential amino acids.", "500 g", 220.0, 25, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80"),
            (6, "Himalayan Pink Rock Salt Granules", "Unrefined mineral salt hand-mined from ancient geological salt beds.", "1 kg", 95.0, 40, "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=500&auto=format&fit=crop&q=80"),
            (6, "24 Mantra Organic Multigrain Atta", "Nutritious blend of wheat, ragi, barley, soya and oats.", "5 kg", 310.0, 25, "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=80"),
            (6, "Cold Pressed Virgin Coconut Oil", "Pure unrefined virgin oil extracted from fresh coconut milk.", "500 ml", 325.0, 20, "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80"),
            (6, "24 Mantra Organic Black Wheat Flour", "Anthocyanin rich therapeutic wheat flour for health enthusiasts.", "1 kg", 120.0, 20, "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80"),
            (6, "Certified Organic Kashmiri Mongra Saffron", "Pure all-red stigmas delivering intense aroma and golden color.", "1 g", 450.0, 15, "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=80"),
            (6, "24 Mantra Organic Whole Green Moong", "Unpolished whole mung beans for protein-rich morning sprouts.", "500 g", 95.0, 30, "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=500&auto=format&fit=crop&q=80"),
            (6, "Organic Tattva Cold Pressed Sesame Oil", "Pure til oil ideal for traditional Ayurvedic cooking and seasoning.", "500 ml", 220.0, 20, "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80"),
            (6, "Urban Platter Organic Steel Cut Oats", "Unprocessed groats for slow cooked hearty morning porridge.", "1 kg", 260.0, 25, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80"),
        ]

    elif store_id == 5:
        # Patidar Daily Needs & Kirana (Annapurna) - Traditional Malwa groceries, spices, sev & staples
        return [
            # Fruits & Veg (12)
            (1, "Indori Local Potatoes (Aloo 5kg)", "Selected golden medium tubers ideal for aloo parathas and sabzis.", "5 kg", 130.0, 30, "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=80"),
            (1, "Malwa Red Onions (Pyaz 5kg)", "Sun-cured local storage onions with pungent crispness.", "5 kg", 155.0, 30, "https://images.unsplash.com/photo-1508747703725-719777637510?w=500&auto=format&fit=crop&q=80"),
            (1, "Desi G-4 Spicy Green Chillies", "Extra spicy slender Indian green chillies from regional farmers.", "250 g", 25.0, 35, "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=500&auto=format&fit=crop&q=80"),
            (1, "Indori Bharta Round Baingan", "Purple, glossy large brinjals meant for traditional baingan ka bharta.", "1 kg", 38.0, 25, "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=500&auto=format&fit=crop&q=80"),
            (1, "Fresh Malwa Ginger (Desi Adrak)", "Robust, fibrous fresh root with concentrated gingerol pungency.", "250 g", 48.0, 30, "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80"),
            (1, "Yellow Pumpkin / Kaddu", "Sweet orange-fleshed pumpkin for traditional subzis and poori meals.", "1 kg", 28.0, 20, "https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=500&auto=format&fit=crop&q=80"),
            (1, "Malwa Farm Fresh Tomatoes", "Desi sour tomatoes ideal for tangy dal tadka.", "1 kg", 35.0, 50, "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80"),
            (1, "Desi Whole Garlic Bulbs (Lehsun)", "Small pungent native garlic pods packed with medicinal sulfur.", "500 g", 95.0, 30, "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=500&auto=format&fit=crop&q=80"),
            (1, "Tender Ladyfinger (Bhindi)", "Crisp slender okra freshly plucked for everyday frying.", "500 g", 28.0, 35, "https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?w=500&auto=format&fit=crop&q=80"),
            (1, "Fresh Green Coriander (Dhaniya)", "Aromatic leafy bunch picked fresh from village farms.", "250 g", 25.0, 40, "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=500&auto=format&fit=crop&q=80"),
            (1, "Country Green Lemons (Kagzi Nimbu)", "Thin skinned high-juice lemons for refreshing shikanji.", "6 pcs", 25.0, 45, "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=500&auto=format&fit=crop&q=80"),
            (1, "Indori Methi Leaves (Fenugreek)", "Fresh bitter-sweet greens for delicious methi theplas.", "250 g", 20.0, 30, "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop&q=80"),
            # Dairy & Eggs (11)
            (2, "Sanchi Standardized Blue Milk", "Madhya Pradesh's trusted cooperative dairy milk with 4.5% fat.", "500 ml", 29.0, 40, "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80"),
            (2, "Sanchi Pure Desi Cow Ghee Tin", "Golden granular aromatic cow ghee from MP State Cooperative Dairy.", "1 L", 640.0, 25, "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=80"),
            (2, "Sanchi Fresh Dahi Matka Style", "Set curd with smooth consistency and fresh lactic flavor.", "400 g", 36.0, 30, "https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=500&auto=format&fit=crop&q=80"),
            (2, "Fresh Country Eggs Dozen", "Wholesome daily poultry eggs supplied directly from local farms.", "Pack of 12", 82.0, 30, "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500&auto=format&fit=crop&q=80"),
            (2, "Sanchi Malai Paneer Slab", "Fresh cooperative paneer rich in dairy protein.", "200 g", 90.0, 25, "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80"),
            (2, "Sanchi Chhach (Spiced Buttermilk)", "Indori jeera spiced cooling buttermilk pouch.", "200 ml", 12.0, 50, "https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=500&auto=format&fit=crop&q=80"),
            (2, "Local Bakery Fresh Pav (6 Pcs)", "Soft fluffy bakery buns baked daily for pav bhaji.", "Pack of 6", 30.0, 25, "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80"),
            (2, "Amul Butter Chiplets", "Individual restaurant style portion butter chiplets.", "100 g", 60.0, 25, "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=80"),
            (2, "Sanchi Peda / Sweet Khoya Prasad", "Traditional pure milk mawa pedas made from condensed milk.", "250 g", 125.0, 20, "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&auto=format&fit=crop&q=80"),
            (2, "Amul Processed Cheese Block", "Classic yellow cheese block for grating over sandwiches and sev.", "200 g", 130.0, 20, "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&auto=format&fit=crop&q=80"),
            (2, "White Sliced Sandwich Loaf", "Everyday morning sandwich bread from local bakery.", "350 g", 35.0, 25, "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80"),
            # Snacks & Beverages (11)
            (3, "Indore Famous Ratlami Laung Sev", "Crispy gram flour sev spiced with clove (laung) and black pepper.", "500 g", 120.0, 50, "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80"),
            (3, "Barik Nylon Sev for Indori Poha", "Super-fine golden sev essential as the topping for morning poha.", "500 g", 110.0, 45, "https://images.unsplash.com/photo-1621996346565-e3d5d6281223?w=500&auto=format&fit=crop&q=80"),
            (3, "Ujjaini Roasted Jeera Poha", "Flattened rice flakes that stay fluffy and separate when cooked.", "1 kg", 65.0, 50, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80"),
            (3, "Wagh Bakri Premium CTC Leaf Tea", "Consistent strong tea liquor with hearty taste for masala chai.", "500 g", 270.0, 35, "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80"),
            (3, "Parle Monaco Salted Crackers", "Crispy golden salted biscuits ideal with evening chai.", "200 g", 30.0, 40, "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop&q=80"),
            (3, "Indori Hing Sev (Asafoetida Flavor)", "Crisp sev infused with strong digestive hing aroma.", "400 g", 105.0, 35, "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80"),
            (3, "Haldiram's Khatta Meetha Namkeen Mix", "Sweet and sour mixture of chickpea noodles, rice flakes and sago.", "400 g", 95.0, 35, "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80"),
            (3, "Britannia Marie Gold Biscuits", "Light and crisp tea biscuits enriched with 10 essential vitamins.", "300 g", 45.0, 45, "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop&q=80"),
            (3, "Rooh Afza Herbal Sharbat Syrup", "Classic cooling rose and botanical summer refresher cordial.", "750 ml", 175.0, 25, "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=80"),
            (3, "Parle Krackjack Sweet & Salty", "The original sweet and salty biscuit that started the trend.", "200 g", 35.0, 40, "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&auto=format&fit=crop&q=80"),
            (3, "Frooti Mango Drink Pet Bottle", "Sweet mango drink made from ripe Indian Totapuri mangoes.", "1 L", 65.0, 30, "https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop&q=80"),
            # Household (10)
            (4, "Rin Advanced Detergent Bar", "Bright white cleaning bar that lifts collar and cuff stains.", "Pack of 4", 55.0, 40, "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&auto=format&fit=crop&q=80"),
            (4, "Wheel 2in1 Clean & Fresh Lemon Detergent", "Budget friendly laundry powder for daily fabric washing.", "1 kg", 72.0, 45, "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=500&auto=format&fit=crop&q=80"),
            (4, "Mangaldeep Sandalwood Agarbatti", "Pure chandan scented incense sticks for serene daily prayer.", "Pack of 120", 85.0, 35, "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80"),
            (4, "Exo Round Dishwash Bar with Anti-Bacterial", "Removes oily ghee residue from steel plates and katoris.", "Pack of 3", 42.0, 40, "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=500&auto=format&fit=crop&q=80"),
            (4, "Panchamrit Cow Dung Dhoop Batti", "Natural herbal dhoop cups for authentic evening pooja aarti.", "Pack of 12", 65.0, 30, "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80"),
            (4, "Tide Plus Extra Power Jasmine & Rose", "Removes yellowing from white clothes with bright foam action.", "1 kg", 125.0, 30, "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&auto=format&fit=crop&q=80"),
            (4, "Pooja Pure Cotton Wicks (Gol Batti)", "Pure unbleached cotton round wicks for ghee diyas.", "Pack of 100", 35.0, 50, "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80"),
            (4, "Harpic White & Shine Bleach Gel", "Thick bleach based toilet liquid that removes lime scale.", "500 ml", 102.0, 25, "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=500&auto=format&fit=crop&q=80"),
            (4, "Pure Brass Pooja Diya", "Traditional Indian brass lamp for home temple.", "1 pc", 120.0, 20, "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80"),
            (4, "Mortein PowerGard Mosquito Coil", "Classic deep smoke red mosquito coil for outdoor areas.", "Pack of 10", 38.0, 40, "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80"),
            # Personal Care (11)
            (5, "Medimix Ayurvedic 18 Herbs Soap", "Skin protection and blemish defense with time-tested herbs.", "125 g", 48.0, 40, "https://images.unsplash.com/photo-1607006314393-810a62eb3511?w=500&auto=format&fit=crop&q=80"),
            (5, "Dabur Red Ayurvedic Toothpaste", "Combines clove oil, pudina satva and tomer seeds for dental strength.", "200 g", 108.0, 35, "https://images.unsplash.com/photo-1559591937-e105e4619d85?w=500&auto=format&fit=crop&q=80"),
            (5, "Dabur Amla Hair Nourishing Oil", "Infused with pure amla fruit to fortify roots and prevent premature graying.", "180 ml", 98.0, 30, "https://images.unsplash.com/photo-1608248597359-59828d5d4d3d?w=500&auto=format&fit=crop&q=80"),
            (5, "Boroline Antiseptic Ayurvedic Cream", "Legendary boric acid and zinc oxide night cream for cracked skin.", "20 g", 42.0, 50, "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80"),
            (5, "Cinthol Original Deodorant Bathing Soap", "High TFM germ protection soap with invigorating freshness.", "Pack of 3", 130.0, 35, "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=500&auto=format&fit=crop&q=80"),
            (5, "Vicco Turmeric Skin Cream in Shaving Base", "Prevents skin irritation and razor cuts naturally.", "70 g", 110.0, 25, "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80"),
            (5, "Patanjali Dant Kanti Toothpaste", "Ayurvedic dental gel with akarkara, babool and neem.", "200 g", 95.0, 35, "https://images.unsplash.com/photo-1559591937-e105e4619d85?w=500&auto=format&fit=crop&q=80"),
            (5, "Navratna Ayurvedic Cool Hair Oil", "9 herbal ingredients provide relief from headache and stress.", "200 ml", 125.0, 30, "https://images.unsplash.com/photo-1608248597359-59828d5d4d3d?w=500&auto=format&fit=crop&q=80"),
            (5, "Bajaj Almond Drops Non-Sticky Hair Oil", "Enriched with 6x Vitamin E for light non-greasy grooming.", "190 ml", 140.0, 30, "https://images.unsplash.com/photo-1608248597359-59828d5d4d3d?w=500&auto=format&fit=crop&q=80"),
            (5, "Santoor Sandal & Turmeric Soap", "Young look therapy with natural sandalwood and turmeric extracts.", "Pack of 4", 125.0, 35, "https://images.unsplash.com/photo-1607006314393-810a62eb3511?w=500&auto=format&fit=crop&q=80"),
            (5, "Gillette 7 O'Clock Super Platinum Blades", "Sharp platinum coated double-edged safety razor blades.", "Pack of 10", 65.0, 40, "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=500&auto=format&fit=crop&q=80"),
            # Grains & Pulses (11)
            (6, "MP Sehore Sharbati Wheat Flour (Atta 10kg)", "King of wheat flour from Sehore district yields melt-in-mouth phulkas.", "10 kg", 430.0, 40, "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=80"),
            (6, "Pushp Teja Red Chilli Powder (Mirch)", "Fiery hot red chilli ground to perfection from selected dry pods.", "500 g", 145.0, 40, "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=80"),
            (6, "Pushp Pure Turmeric Powder (Haldi)", "Bright yellow, high curcumin unadulterated turmeric.", "500 g", 120.0, 40, "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80"),
            (6, "Pushp Cumin Seeds (Jeera)", "Aromatic whole jeera for tempering dal, curries and raitas.", "200 g", 95.0, 35, "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=80"),
            (6, "Malwi Desi Tuvar Dal (Unpolished)", "Farm-fresh unpolished pigeon pea dal that cooks into comforting thick sambar.", "1 kg", 168.0, 40, "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=500&auto=format&fit=crop&q=80"),
            (6, "Fortune Refined Soyabean Cooking Oil", "Indore's favorite daily cooking medium enriched with Omega 3.", "1 L", 125.0, 45, "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80"),
            (6, "Desi Chana Dal Unpolished", "Locally grown Bengal gram split dal rich in plant iron.", "1 kg", 115.0, 35, "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=500&auto=format&fit=crop&q=80"),
            (6, "Moong Mogar Yellow Split Dal", "Mung dal without husk cooks quickly into nourishing soup.", "1 kg", 140.0, 35, "https://images.unsplash.com/photo-1546069901-5ec6a79120b0?w=500&auto=format&fit=crop&q=80"),
            (6, "Indori Jeeravan Masala for Poha", "Signature 16 spice blend that turns morning poha into culinary magic.", "100 g", 50.0, 50, "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=80"),
            (6, "Suhana Shahi Garam Masala", "Aromatic finishing spice powder for paneer and dal gravies.", "100 g", 78.0, 35, "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=80"),
            (6, "Pushp Compounded Asafoetida (Hing)", "Powerful fragrant hing powder for tempering and digestive ease.", "50 g", 70.0, 40, "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=80"),
        ]

    elif store_id == 6:
        # Aggarwal Super Mart (Rajwada) - Mega retail bazaar, confectionery, party packs
        return [
            # Fruits & Veg (12)
            (1, "Kinnaur Red Delicious Apples", "Crisp mountain apples with deep red stripes and juicy bite.", "1 kg", 155.0, 35, "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=80"),
            (1, "Crisp Nashpati / Indian Green Pears", "Firm, juicy pears sweet and high in natural soluble pectin.", "1 kg", 95.0, 25, "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=80"),
            (1, "Sweet Seedless Crimson Watermelon", "Hydrating summer watermelon chilled and sweet.", "1 pc", 80.0, 25, "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=80"),
            (1, "Yelakki Sweet Bananas", "Miniature bananas prized for their distinct sweet floral aroma.", "1 kg", 75.0, 35, "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=80"),
            (1, "Fresh Tender Sweet Corn Kernels", "Ready-to-steam golden corn kernels vacuum packed.", "500 g", 55.0, 30, "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=500&auto=format&fit=crop&q=80"),
            (1, "Premium Green Capsicum Box", "Crunchy glossy bell peppers for fried rice and pasta.", "500 g", 40.0, 30, "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500&auto=format&fit=crop&q=80"),
            (1, "Nagpur Sweet Oranges (Santra)", "Rich citrus fruit packed with tangy pulp and Vitamin C.", "1 kg", 75.0, 35, "https://images.unsplash.com/photo-1547514701-42782101795e?w=500&auto=format&fit=crop&q=80"),
            (1, "Green Raw Papaya", "Firm unripe papaya ideal for Gujarati sambharo and salads.", "1 kg", 40.0, 25, "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=500&auto=format&fit=crop&q=80"),
            (1, "Fresh Button Mushrooms", "Tender white button mushrooms perfect for chili mushroom.", "200 g", 50.0, 25, "https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=500&auto=format&fit=crop&q=80"),
            (1, "Fresh Bunch Mint Leaves (Pudina)", "Vibrant mint sprigs for raita, biryani and mocktails.", "1 bunch", 15.0, 40, "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=500&auto=format&fit=crop&q=80"),
            (1, "Large Round Bharta Eggplants", "Glossy dark purple eggplants perfect for roasting.", "1 kg", 42.0, 25, "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=500&auto=format&fit=crop&q=80"),
            (1, "Fresh Cauliflower (Phool Gobhi)", "Clean compact white florets for curries and aloo gobhi.", "1 pc", 35.0, 30, "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=500&auto=format&fit=crop&q=80"),
            # Dairy & Eggs (11)
            (2, "Amul Gold Full Cream Milk Pouch", "Rich 6.0% milk fat ideal for making rich kheer, paneer and curd.", "1 L", 68.0, 40, "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80"),
            (2, "Gowardhan Processed Cheese Block", "Pure cow milk cheese block easily grateable over dosas and pasta.", "200 g", 130.0, 25, "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&auto=format&fit=crop&q=80"),
            (2, "Amul Garlic & Herbs Cheese Spread", "Zesty spreadable cheese that pairs seamlessly with crackers.", "200 g", 115.0, 25, "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=80"),
            (2, "Nutriva Vitamin Fortified Eggs", "Enriched with extra Vitamin D, B12 and Omega-3 fatty acids.", "Pack of 6", 65.0, 30, "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500&auto=format&fit=crop&q=80"),
            (2, "Mother Dairy Buffalo Milk Pouch", "Thick rich buffalo milk with high solids for homemade sweets.", "1 L", 70.0, 30, "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop&q=80"),
            (2, "Amul Pure Cow Butter Salted", "Rich golden cow milk butter for toast and baking.", "500 g", 280.0, 20, "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=80"),
            (2, "D'lecta Cream Cheese Spread", "Velvety cream cheese for cheesecakes and bagel spreads.", "150 g", 160.0, 20, "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&auto=format&fit=crop&q=80"),
            (2, "Mother Dairy Mishti Doi Pot", "Traditional Kolkata style caramelized sweetened curd.", "85 g", 35.0, 35, "https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=500&auto=format&fit=crop&q=80"),
            (2, "Britannia Whole Wheat Sandwich Bread", "Wholesome 100% whole wheat sliced loaf.", "400 g", 48.0, 25, "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80"),
            (2, "Amul Fresh Paneer Block", "Hygienically packed rich cottage cheese.", "200 g", 92.0, 30, "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80"),
            (2, "Fresh Country White Eggs Tray", "Clean poultry eggs for everyday family breakfast.", "Pack of 12", 84.0, 30, "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500&auto=format&fit=crop&q=80"),
            # Snacks & Beverages (11)
            (3, "Bikaji Bikaneri Bhujia Sev Mega Pack", "Authentic moth dal and besan bhujia prepared in traditional bikaneri style.", "1 kg", 280.0, 30, "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80"),
            (3, "Haldiram's Gulab Jamun Tin", "Soft, spongy mawa cottage cheese dumplings soaked in saffron syrup.", "1 kg", 220.0, 25, "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&auto=format&fit=crop&q=80"),
            (3, "Oreo Original Vanilla Creme Sandwich", "Iconic dark cocoa biscuits with smooth sweet creme filling.", "300 g", 85.0, 45, "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop&q=80"),
            (3, "Ferrero Nutella Hazelnut Spread", "Rich cocoa hazelnut spread beloved on toast, pancakes and crepes.", "350 g", 360.0, 20, "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&auto=format&fit=crop&q=80"),
            (3, "Real 100% Cranberry Fruit Juice", "Tart and tangy juice with zero added artificial flavor.", "1 L", 155.0, 25, "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=80"),
            (3, "Kissan Fresh Tomato Ketchup Bottle", "Rich, thick ketchup made from 100% real ripe tomatoes.", "950 g", 130.0, 30, "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80"),
            (3, "Nestle KitKat Share Bag", "Crispy wafer fingers covered in smooth milk chocolate.", "Pack of 8", 120.0, 40, "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&auto=format&fit=crop&q=80"),
            (3, "Britannia Little Hearts Biscuits", "Sugar sprinkled heart-shaped buttery sweet biscuits.", "150 g", 40.0, 40, "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&auto=format&fit=crop&q=80"),
            (3, "Haldiram's Rasgulla Tin", "Delicate spongy chenna sweet balls soaked in light sugar syrup.", "1 kg", 220.0, 25, "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&auto=format&fit=crop&q=80"),
            (3, "Hide & Seek Chocolate Chip Cookies", "Delicious crunchy cookies studded with rich chocolate chips.", "350 g", 95.0, 35, "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop&q=80"),
            (3, "Maggi Hot & Sweet Tomato Chilli Sauce", "Fiery and sweet table ketchup for pakodas and samosas.", "500 g", 115.0, 30, "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=500&auto=format&fit=crop&q=80"),
            # Household (10)
            (4, "Surf Excel Matic Top Load Liquid Detergent", "Fast dissolving liquid prevents powdery residue on washed clothes.", "2 L", 460.0, 20, "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&auto=format&fit=crop&q=80"),
            (4, "Comfort Fabric Conditioner Blue Blossom", "Infuses clothes with garden freshness and prevents static cling.", "2 L", 440.0, 20, "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=500&auto=format&fit=crop&q=80"),
            (4, "Godrej Aer Pocket Bathroom Fragrance", "Power gel air freshener keeps bathrooms fragrant up to 30 days.", "Pack of 3", 165.0, 35, "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80"),
            (4, "Hit Flying Insect Mosquito Spray", "Dual nozzle technology knocks down dangerous mosquitoes instantly.", "400 ml", 185.0, 25, "https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=500&auto=format&fit=crop&q=80"),
            (4, "Colin Multi-Surface Cleaner Trigger Spray", "Convenient trigger spray for sparkling clean tiles, glass and tables.", "500 ml", 135.0, 25, "https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=500&auto=format&fit=crop&q=80"),
            (4, "Scotch-Brite Kitchen Wiper Blade", "Heavy duty floor and counter wiper with durable rubber blade.", "1 pc", 145.0, 25, "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=500&auto=format&fit=crop&q=80"),
            (4, "Kleenex Ultra Soft Facial Tissues", "Dermatologist approved gentle 3-ply facial paper tissues.", "Pack of 100", 115.0, 30, "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80"),
            (4, "Harpic Disinfectant Bathroom Cleaner", "Removes stubborn grime and yellowish stains from floor and tiles.", "1 L", 199.0, 25, "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=500&auto=format&fit=crop&q=80"),
            (4, "Vim Lemon Dishwash Gel Family Pack", "Thick concentrated lime gel removes tough grease from 100 utensils.", "750 ml", 155.0, 30, "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&auto=format&fit=crop&q=80"),
            (4, "All Out Ultra Power+ Mosquito Liquid", "Advanced vapor formula keeps bedroom pest-free all night.", "Pack of 2", 150.0, 30, "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80"),
            # Personal Care (11)
            (5, "Pears Pure & Gentle Glycerin Bathing Soap", "Transparent amber soap retaining skin moisture with natural oils.", "Pack of 3", 195.0, 30, "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=500&auto=format&fit=crop&q=80"),
            (5, "L'Oreal Paris Total Repair 5 Restoring Shampoo", "Ceramide-cement technology combats the 5 visible signs of damaged hair.", "360 ml", 320.0, 20, "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=80"),
            (5, "Vaseline Intensive Care Cocoa Glow Lotion", "Pure cocoa butter restores dry skin to its natural healthy glow.", "400 ml", 365.0, 20, "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80"),
            (5, "Listerine Cool Mint Antiseptic Mouthwash", "Removes 99% of bad breath germs and cleans where brushing misses.", "250 ml", 155.0, 30, "https://images.unsplash.com/photo-1559591937-e105e4619d85?w=500&auto=format&fit=crop&q=80"),
            (5, "Tresemme Keratin Smooth Hair Shampoo", "Keratin and Argan oil formula provides smooth frizz-free hair.", "340 ml", 310.0, 20, "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=80"),
            (5, "Dove Pink Rosa Beauty Moisturizing Bar", "Gentle cleanser leaving face and body silky smooth.", "Pack of 3", 190.0, 30, "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=500&auto=format&fit=crop&q=80"),
            (5, "Colgate Visible White Teeth Whitening Toothpaste", "Enriched with whitening accelerators for one shade whiter teeth.", "100 g", 130.0, 30, "https://images.unsplash.com/photo-1559591937-e105e4619d85?w=500&auto=format&fit=crop&q=80"),
            (5, "Gillette Series Sensitive Shave Foam", "Aloe-enriched lubricant cushions sensitive skin from razor irritation.", "250 ml", 225.0, 20, "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=500&auto=format&fit=crop&q=80"),
            (5, "Nivea Men Dark Spot Reduction Face Wash", "Whitening formula reduces 10x dark spots on men's tough skin.", "100 g", 195.0, 25, "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80"),
            (5, "Dettol Liquid Handwash Pump Original", "Pine fragrance formula ensures proper hand hygiene before meals.", "200 ml", 99.0, 35, "https://images.unsplash.com/photo-1607006314393-810a62eb3511?w=500&auto=format&fit=crop&q=80"),
            (5, "Parachute Advansed Aloe Vera Enriched Coconut Hair Oil", "Combines aloe vera conditioning with pure coconut oil nourishment.", "250 ml", 125.0, 30, "https://images.unsplash.com/photo-1608248597359-59828d5d4d3d?w=500&auto=format&fit=crop&q=80"),
            # Grains & Pulses (11)
            (6, "Pillsbury Chakki Fresh Whole Wheat Atta", "Soft rotis that stay soft up to 6 hours with natural dietary fiber.", "5 kg", 235.0, 35, "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=80"),
            (6, "Fortune Sunlite Refined Sunflower Oil Jar", "Easy pour 5L jar with healthy PUFA fats for low absorption cooking.", "5 L", 670.0, 25, "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80"),
            (6, "Kohinoor Charminar Select Basmati Rice", "Fluffy, fragrant basmati grains suitable for biryani and fried rice.", "5 kg", 390.0, 30, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80"),
            (6, "Rajma Chitra Kashmiri Red Kidney Beans", "Creamy, buttery kidney beans that soak up flavorful gravies.", "1 kg", 170.0, 30, "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=500&auto=format&fit=crop&q=80"),
            (6, "Tata Salt Lite Low Sodium Iodized Salt", "15% less sodium formulation for maintaining healthy blood pressure.", "1 kg", 45.0, 40, "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=500&auto=format&fit=crop&q=80"),
            (6, "Gemini Refined Sunflower Oil Pouch", "Light golden cooking oil fortified with Vitamins A, D and E.", "1 L", 135.0, 35, "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80"),
            (6, "Tata Sampann Chana Dal Unpolished", "Rich in natural protein without oily polish.", "1 kg", 125.0, 30, "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=500&auto=format&fit=crop&q=80"),
            (6, "Black Masoor Dal Whole (Sabut)", "Hearty, iron-rich whole brown lentils for comforting curries.", "1 kg", 110.0, 35, "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=500&auto=format&fit=crop&q=80"),
            (6, "Keya Tellicherry Black Pepper Grinder", "Bold, pungent whole black peppercorns in easy twist grinder.", "50 g", 125.0, 30, "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=80"),
            (6, "Saffola Gold Pro Healthy Lifestyle Oil Can", "High Smoke Point heart-friendly edible oil.", "5 L", 840.0, 20, "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80"),
            (6, "Tata Sampann Green Moong Dal Whole", "Wholesome green grams perfect for overnight soaking and dal fry.", "1 kg", 145.0, 35, "https://images.unsplash.com/photo-1546069901-5ec6a79120b0?w=500&auto=format&fit=crop&q=80"),
        ]

def escape_str(s):
    return s.replace("'", "''")

def main():
    store_ids = {
        1: list(range(1, 67)),
        2: list(range(67, 133)),
        3: list(range(194, 260)),
        4: list(range(321, 387)),
        5: list(range(448, 514)),
        6: list(range(575, 641)),
    }
    
    sql_lines = []
    
    for s_id in range(1, 7):
        p_ids = store_ids[s_id]
        items = get_store_products(s_id)
        print(f"Store {s_id}: mapping {len(items)} curated products to {len(p_ids)} IDs.")
        
        for idx in range(min(len(p_ids), len(items))):
            p_id = p_ids[idx]
            cat_id, name, desc, unit, price, qty, img = items[idx]
            sku = f"STR{s_id}-CAT{cat_id}-{idx+1:03d}"
            
            sql = f"""UPDATE products SET 
                category_id = {cat_id},
                product_name = '{escape_str(name)}',
                description = '{escape_str(desc)}',
                sku = '{sku}',
                unit = '{escape_str(unit)}',
                price = {price:.2f},
                available_quantity = {qty},
                image_url = '{escape_str(img)}',
                active = 1
                WHERE id = {p_id};"""
            sql_lines.append(sql)

    output_file = "d:/SKILL LAB PROJECT/PROJECT/backend/src/main/resources/update_diverse_catalog.sql"
    with open(output_file, "w", encoding="utf-8") as f:
        f.write("\n".join(sql_lines))
    print(f"Generated {len(sql_lines)} SQL statements in {output_file}")

if __name__ == "__main__":
    main()
