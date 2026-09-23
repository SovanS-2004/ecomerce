import sqlite3
import os
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "ecommerce.db"

def get_connection():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            Order_ID TEXT UNIQUE NOT NULL,
            Order_Date TEXT NOT NULL,
            Customer_ID TEXT NOT NULL,
            Customer_Name TEXT NOT NULL,
            Gender TEXT NOT NULL,
            Age INTEGER NOT NULL,
            City TEXT NOT NULL,
            State TEXT NOT NULL,
            Product TEXT NOT NULL,
            Category TEXT NOT NULL,
            Quantity INTEGER NOT NULL,
            Unit_Price REAL NOT NULL,
            Discount REAL NOT NULL,
            Sales REAL NOT NULL,
            Profit REAL NOT NULL,
            Payment_Method TEXT NOT NULL,
            Order_Status TEXT NOT NULL
        )
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_order_date ON orders(Order_Date)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_category ON orders(Category)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_state ON orders(State)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_customer ON orders(Customer_ID)")
    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print(f"Database initialized at {DB_PATH}")
