import random
import datetime
import os
import pandas as pd
from pathlib import Path
from database import get_connection, init_db

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

CUSTOMERS = [
    ("Aarav Sharma", "Male", 28, "Mumbai", "Maharashtra"),
    ("Priya Patel", "Female", 32, "Ahmedabad", "Gujarat"),
    ("Rahul Verma", "Male", 24, "Bengaluru", "Karnataka"),
    ("Ananya Iyer", "Female", 29, "Chennai", "Tamil Nadu"),
    ("Rohan Mukherjee", "Male", 35, "Kolkata", "West Bengal"),
    ("Sneha Reddy", "Female", 27, "Hyderabad", "Telangana"),
    ("Vikram Singh", "Male", 41, "Jaipur", "Rajasthan"),
    ("Pooja Nair", "Female", 30, "Kochi", "Kerala"),
    ("Aditya Joshi", "Male", 33, "Pune", "Maharashtra"),
    ("Neha Gupta", "Female", 26, "New Delhi", "Delhi"),
    ("Karan Malhotra", "Male", 38, "Noida", "Uttar Pradesh"),
    ("Divya Rao", "Female", 25, "Bengaluru", "Karnataka"),
    ("Amitabh Sen", "Male", 45, "Kolkata", "West Bengal"),
    ("Kavita Mehra", "Female", 34, "Chandigarh", "Punjab"),
    ("Manish Tiwari", "Male", 29, "Lucknow", "Uttar Pradesh"),
    ("Sunita Deshmukh", "Female", 42, "Nagpur", "Maharashtra"),
    ("Arjun Kapoor", "Male", 31, "Mumbai", "Maharashtra"),
    ("Ritu Choudhury", "Female", 28, "Surat", "Gujarat"),
    ("Deepak Bhatt", "Male", 36, "Indore", "Madhya Pradesh"),
    ("Meera Nambiar", "Female", 39, "Thiruvananthapuram", "Kerala"),
    ("Gaurav Saxena", "Male", 27, "Bhopal", "Madhya Pradesh"),
    ("Shweta Mishra", "Female", 31, "Kanpur", "Uttar Pradesh"),
    ("Rajesh Pillai", "Male", 48, "Coimbatore", "Tamil Nadu"),
    ("Tanvi Kulkarni", "Female", 23, "Pune", "Maharashtra"),
    ("Siddharth Jain", "Male", 33, "Jaipur", "Rajasthan"),
    ("Ishita Roy", "Female", 30, "Kolkata", "West Bengal"),
    ("Nikhil Chauhan", "Male", 26, "Ludhiana", "Punjab"),
    ("Swati Agarwal", "Female", 35, "New Delhi", "Delhi"),
    ("Harish Hegde", "Male", 40, "Mysuru", "Karnataka"),
    ("Aarti Goswami", "Female", 29, "Ahmedabad", "Gujarat"),
    ("Varun Menon", "Male", 32, "Kochi", "Kerala"),
    ("Bhavna Shah", "Female", 37, "Mumbai", "Maharashtra"),
    ("Sameer Khan", "Male", 30, "Hyderabad", "Telangana"),
    ("Preeti Dubey", "Female", 26, "Lucknow", "Uttar Pradesh"),
    ("Abhishek Das", "Male", 34, "Kolkata", "West Bengal"),
    ("Kajal Tripathi", "Female", 28, "Varanasi", "Uttar Pradesh"),
    ("Vivek Chawla", "Male", 39, "New Delhi", "Delhi"),
    ("Monika Soni", "Female", 31, "Jaipur", "Rajasthan"),
    ("Akash Bansal", "Male", 27, "Gurugram", "Haryana"),
    ("Deepika Sundaram", "Female", 33, "Chennai", "Tamil Nadu"),
    ("Tarun Sethi", "Male", 43, "Chandigarh", "Punjab"),
    ("Pallavi Shenoy", "Female", 29, "Bengaluru", "Karnataka"),
    ("Rohit Khandelwal", "Male", 32, "Indore", "Madhya Pradesh"),
    ("Archana Pillai", "Female", 36, "Coimbatore", "Tamil Nadu"),
    ("Mohit Suri", "Male", 25, "Noida", "Uttar Pradesh"),
    ("Ankita Bose", "Female", 28, "Kolkata", "West Bengal"),
    ("Sanjay Rathore", "Male", 47, "Jaipur", "Rajasthan"),
    ("Namrata Joshi", "Female", 34, "Pune", "Maharashtra"),
    ("Ashish Pandey", "Male", 29, "Lucknow", "Uttar Pradesh"),
    ("Geeta Madhavan", "Female", 41, "Chennai", "Tamil Nadu"),
]

# Generate more customers to reach ~150 total
FIRST_NAMES_M = ["Kabir", "Dev", "Yash", "Aryan", "Pranav", "Suraj", "Chetan", "Naveen", "Kartik", "Tushar", "Harshit", "Mayank", "Girish", "Ojas", "Alok"]
FIRST_NAMES_F = ["Rhea", "Tara", "Kiara", "Isha", "Nandini", "Simran", "Payal", "Shreya", "Anushka", "Vidya", "Shruti", "Trisha", "Sanya", "Radhika", "Komal"]
LAST_NAMES = ["Bhatia", "Singhania", "Trivedi", "Mittal", "Narang", "Dutta", "Bhattacharya", "Kaur", "Subramanian", "Grewal", "Aggarwal", "Chopra", "Patil", "Desai", "Rastogi"]
CITIES_BY_STATE = {
    "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
    "Karnataka": ["Bengaluru", "Mysuru"],
    "Delhi": ["New Delhi"],
    "Tamil Nadu": ["Chennai", "Coimbatore"],
    "Telangana": ["Hyderabad"],
    "West Bengal": ["Kolkata"],
    "Gujarat": ["Ahmedabad", "Surat"],
    "Uttar Pradesh": ["Lucknow", "Noida", "Kanpur", "Varanasi"],
    "Rajasthan": ["Jaipur"],
    "Kerala": ["Kochi", "Thiruvananthapuram"],
    "Punjab": ["Chandigarh", "Ludhiana"],
    "Madhya Pradesh": ["Indore", "Bhopal"],
    "Haryana": ["Gurugram"]
}

PRODUCTS_BY_CATEGORY = {
    "Electronics": [
        {"name": "Apple iPhone 15 (128GB)", "price": 74999.0, "margin": 0.16},
        {"name": "Samsung Galaxy S24 5G", "price": 69999.0, "margin": 0.18},
        {"name": "Dell XPS 13 Core i7 Laptop", "price": 109990.0, "margin": 0.14},
        {"name": "Apple iPad Air M2", "price": 54900.0, "margin": 0.17},
        {"name": "Sony WH-1000XM5 ANC Headphones", "price": 26990.0, "margin": 0.22},
        {"name": "Logitech MX Master 3S Mouse", "price": 8995.0, "margin": 0.28},
        {"name": "OnePlus Nord CE 3 Lite 5G", "price": 18499.0, "margin": 0.20},
        {"name": "Boat Rockerz 450 Bluetooth Headset", "price": 1499.0, "margin": 0.35},
        {"name": "Mi 360 Home Security Camera 2K", "price": 2999.0, "margin": 0.30},
    ],
    "Fashion": [
        {"name": "Levi's 511 Slim Fit Denim", "price": 2899.0, "margin": 0.38},
        {"name": "Nike Air Max 270 Sneakers", "price": 8995.0, "margin": 0.32},
        {"name": "Zara Classic Linen Casual Shirt", "price": 2990.0, "margin": 0.40},
        {"name": "Puma Classic Tracksuit", "price": 3799.0, "margin": 0.36},
        {"name": "Ray-Ban Aviator Polarized Sunglasses", "price": 7490.0, "margin": 0.42},
        {"name": "Fossil Minimalist Chronograph Watch", "price": 11495.0, "margin": 0.37},
        {"name": "Allen Solly Men's Cotton Polo", "price": 1199.0, "margin": 0.44},
    ],
    "Home & Kitchen": [
        {"name": "Philips Digital Air Fryer HD9252", "price": 8499.0, "margin": 0.25},
        {"name": "Dyson V8 Absolute Cordless Vacuum", "price": 31900.0, "margin": 0.21},
        {"name": "Prestige Induction Cooktop 2000W", "price": 2899.0, "margin": 0.28},
        {"name": "Milton Thermosteel Flip Flask 1000ml", "price": 950.0, "margin": 0.33},
        {"name": "SleepyCat Memory Foam Ortho Mattress", "price": 13999.0, "margin": 0.30},
        {"name": "Kent Grand Plus RO Water Purifier", "price": 15499.0, "margin": 0.24},
    ],
    "Beauty & Personal Care": [
        {"name": "Minimalist 10% Niacinamide Serum", "price": 599.0, "margin": 0.46},
        {"name": "L'Oreal Paris Extraordinary Oil Serum", "price": 649.0, "margin": 0.42},
        {"name": "Philips All-in-One Trimmer MG7715", "price": 3295.0, "margin": 0.32},
        {"name": "Forest Essentials Soundarya Face Cream", "price": 2850.0, "margin": 0.48},
        {"name": "The Body Shop British Rose Shower Gel", "price": 795.0, "margin": 0.44},
        {"name": "Maybelline Superstay Matte Ink Lipstick", "price": 499.0, "margin": 0.45},
    ],
    "Sports & Fitness": [
        {"name": "Decathlon 20kg Cast Iron Dumbbell Set", "price": 3499.0, "margin": 0.28},
        {"name": "Boldfit Anti-Tear NBR Yoga Mat", "price": 999.0, "margin": 0.42},
        {"name": "Yonex Muscle Power 29 Badminton Racket", "price": 2390.0, "margin": 0.34},
        {"name": "Fitbit Charge 6 Advanced Fitness Tracker", "price": 14499.0, "margin": 0.22},
        {"name": "Nivia Storm Football Size 5", "price": 699.0, "margin": 0.40},
    ],
    "Books & Stationery": [
        {"name": "Atomic Habits by James Clear", "price": 499.0, "margin": 0.36},
        {"name": "The Psychology of Money by Morgan Housel", "price": 399.0, "margin": 0.38},
        {"name": "Parker Frontier Matte Black Fountain Pen", "price": 650.0, "margin": 0.46},
        {"name": "Moleskine Classic Hard Cover Ruled Journal", "price": 1799.0, "margin": 0.42},
        {"name": "Ikigai: Japanese Secret to a Long Happy Life", "price": 350.0, "margin": 0.40},
    ]
}

PAYMENT_METHODS = ["UPI", "Credit Card", "Debit Card", "Cash on Delivery", "Net Banking"]
PAYMENT_WEIGHTS = [0.42, 0.26, 0.14, 0.11, 0.07]

ORDER_STATUSES = ["Delivered", "Pending", "Cancelled", "Returned"]
ORDER_STATUS_WEIGHTS = [0.76, 0.10, 0.08, 0.06]

DISCOUNT_CHOICES = [0.0, 0.0, 5.0, 10.0, 15.0, 20.0, 25.0]

def generate_customer_pool(target_count=150):
    customers = list(CUSTOMERS)
    random.seed(42)
    current_count = len(customers)
    
    state_list = list(CITIES_BY_STATE.keys())
    while current_count < target_count:
        gender = random.choice(["Male", "Female"])
        fn = random.choice(FIRST_NAMES_M if gender == "Male" else FIRST_NAMES_F)
        ln = random.choice(LAST_NAMES)
        name = f"{fn} {ln}"
        age = random.randint(20, 58)
        state = random.choice(state_list)
        city = random.choice(CITIES_BY_STATE[state])
        customers.append((name, gender, age, city, state))
        current_count += 1

    customer_records = []
    for idx, (name, gender, age, city, state) in enumerate(customers, start=1):
        cust_id = f"CUST-{idx:04d}"
        customer_records.append({
            "Customer_ID": cust_id,
            "Customer_Name": name,
            "Gender": gender,
            "Age": age,
            "City": city,
            "State": state
        })
    return customer_records

def generate_orders(num_orders=850):
    random.seed(100)
    customer_pool = generate_customer_pool(150)
    
    # Customer frequency tiers to simulate realistic RFM behavior:
    # 15% VIP High-Value customers (make 8-15 orders)
    # 40% Regular customers (make 4-7 orders)
    # 45% Occasional/Low-Value (make 1-3 orders)
    vip_customers = customer_pool[:25]
    regular_customers = customer_pool[25:85]
    occasional_customers = customer_pool[85:]
    
    start_date = datetime.date(2023, 1, 1)
    end_date = datetime.date(2024, 12, 31)
    date_range_days = (end_date - start_date).days
    
    categories = list(PRODUCTS_BY_CATEGORY.keys())
    orders = []
    
    for i in range(1, num_orders + 1):
        order_id = f"ORD-{10000 + i}"
        
        # Pick customer based on weighted tier
        tier_choice = random.choices(["vip", "regular", "occasional"], weights=[0.45, 0.40, 0.15])[0]
        if tier_choice == "vip":
            cust = random.choice(vip_customers)
        elif tier_choice == "regular":
            cust = random.choice(regular_customers)
        else:
            cust = random.choice(occasional_customers)
            
        # Random date with seasonal surge towards festive Q4 (Oct-Dec)
        day_offset = random.randint(0, date_range_days)
        order_date = start_date + datetime.timedelta(days=day_offset)
        # Add slight Q4 festive boost
        if order_date.month in [10, 11, 12] and random.random() < 0.25:
            # bias towards recent dates or peak months
            pass

        # Pick Category and Product
        category = random.choice(categories)
        product_info = random.choice(PRODUCTS_BY_CATEGORY[category])
        product_name = product_info["name"]
        unit_price = product_info["price"]
        base_margin = product_info["margin"]
        
        # Quantity
        if unit_price > 40000:
            quantity = 1
        elif unit_price > 10000:
            quantity = random.choices([1, 2], weights=[0.85, 0.15])[0]
        elif unit_price > 2000:
            quantity = random.choices([1, 2, 3], weights=[0.65, 0.25, 0.10])[0]
        else:
            quantity = random.choices([1, 2, 3, 4], weights=[0.45, 0.35, 0.15, 0.05])[0]

        discount = random.choice(DISCOUNT_CHOICES)
        gross_amount = quantity * unit_price
        sales = round(gross_amount * (1.0 - discount / 100.0), 2)
        
        # Status & Payment
        order_status = random.choices(ORDER_STATUSES, weights=ORDER_STATUS_WEIGHTS)[0]
        payment_method = random.choices(PAYMENT_METHODS, weights=PAYMENT_WEIGHTS)[0]
        
        # Profit Calculation
        if order_status == "Cancelled":
            profit = 0.0
        elif order_status == "Returned":
            # Return handling and shipping loss
            profit = round(-0.06 * sales, 2)
        else:
            # Delivered or Pending
            effective_margin = base_margin * (1.0 - (discount / 150.0))
            profit = round(sales * effective_margin, 2)

        orders.append({
            "Order_ID": order_id,
            "Order_Date": order_date.strftime("%Y-%m-%d"),
            "Customer_ID": cust["Customer_ID"],
            "Customer_Name": cust["Customer_Name"],
            "Gender": cust["Gender"],
            "Age": cust["Age"],
            "City": cust["City"],
            "State": cust["State"],
            "Product": product_name,
            "Category": category,
            "Quantity": quantity,
            "Unit_Price": unit_price,
            "Discount": discount,
            "Sales": sales,
            "Profit": profit,
            "Payment_Method": payment_method,
            "Order_Status": order_status
        })

    # Sort chronological
    orders.sort(key=lambda x: x["Order_Date"])
    return orders

def seed():
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    
    # Check if data already exists
    cursor.execute("SELECT COUNT(*) FROM orders")
    existing = cursor.fetchone()[0]
    if existing >= 500:
        print(f"Database already contains {existing} orders. Skipping re-seed.")
        conn.close()
        return

    orders = generate_orders(850)
    cursor.execute("DELETE FROM orders")
    
    insert_sql = """
        INSERT INTO orders (
            Order_ID, Order_Date, Customer_ID, Customer_Name, Gender, Age,
            City, State, Product, Category, Quantity, Unit_Price, Discount,
            Sales, Profit, Payment_Method, Order_Status
        ) VALUES (
            :Order_ID, :Order_Date, :Customer_ID, :Customer_Name, :Gender, :Age,
            :City, :State, :Product, :Category, :Quantity, :Unit_Price, :Discount,
            :Sales, :Profit, :Payment_Method, :Order_Status
        )
    """
    cursor.executemany(insert_sql, orders)
    conn.commit()
    conn.close()
    
    # Also save to data/ecommerce_data.csv
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    csv_path = DATA_DIR / "ecommerce_data.csv"
    df = pd.DataFrame(orders)
    df.to_csv(csv_path, index=False)
    print(f"Successfully generated and stored {len(orders)} orders in SQLite and {csv_path}!")

if __name__ == "__main__":
    seed()
