from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class KPISummary(BaseModel):
    total_sales: float
    total_orders: int
    total_customers: int
    total_profit: float
    avg_order_value: float
    avg_customer_spending: float
    profit_margin_pct: float
    total_quantity: int
    mom_sales_growth_pct: Optional[float] = 0.0

class MonthlySalesPoint(BaseModel):
    month: str
    sales: float
    profit: float
    orders: int
    growth_pct: Optional[float] = 0.0

class CategorySalesPoint(BaseModel):
    category: str
    sales: float
    profit: float
    orders: int
    quantity: int
    margin_pct: float
    share_pct: float

class ProductPerformance(BaseModel):
    product: str
    category: str
    units_sold: int
    total_revenue: float
    total_profit: float
    margin_pct: float
    avg_price: float

class CustomerSegmentPoint(BaseModel):
    segment: str
    customer_count: int
    total_sales: float
    avg_spending: float
    order_count: int
    share_pct: float

class TopCustomer(BaseModel):
    customer_id: str
    customer_name: str
    gender: str
    city: str
    state: str
    orders: int
    total_spending: float
    avg_order_value: float
    segment: str

class LocationSalesPoint(BaseModel):
    location: str
    state: Optional[str] = None
    sales: float
    profit: float
    orders: int
    share_pct: float

class PaymentMethodPoint(BaseModel):
    method: str
    count: int
    sales: float
    percentage: float

class OrderStatusPoint(BaseModel):
    status: str
    count: int
    sales: float
    percentage: float

class OrderRecord(BaseModel):
    id: int
    Order_ID: str
    Order_Date: str
    Customer_ID: str
    Customer_Name: str
    Gender: str
    Age: int
    City: str
    State: str
    Product: str
    Category: str
    Quantity: int
    Unit_Price: float
    Discount: float
    Sales: float
    Profit: float
    Payment_Method: str
    Order_Status: str

class PaginatedOrders(BaseModel):
    items: List[OrderRecord]
    total: int
    page: int
    page_size: int
    total_pages: int

class FilterOptions(BaseModel):
    categories: List[str]
    products: List[str]
    states: List[str]
    cities: List[str]
    payment_methods: List[str]
    order_statuses: List[str]
    customer_segments: List[str]
    min_date: str
    max_date: str
