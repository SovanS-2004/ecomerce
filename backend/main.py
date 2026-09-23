from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from typing import Optional
from pathlib import Path

import analytics
import database
import seed_data
from models import (
    KPISummary,
    MonthlySalesPoint,
    CategorySalesPoint,
    ProductPerformance,
    TopCustomer,
    LocationSalesPoint,
    PaymentMethodPoint,
    OrderStatusPoint,
    PaginatedOrders,
    FilterOptions
)

app = FastAPI(
    title="E-Commerce Sales & Customer Analytics API",
    description="FastAPI analytics service for e-commerce sales, customers, products, and locations.",
    version="1.0.0"
)

# Enable CORS for React frontend (Vite default port 5173 / 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global dataset cache
DATA_CACHE = None
SEGMENTS_CACHE = {}

def get_df():
    global DATA_CACHE, SEGMENTS_CACHE
    if DATA_CACHE is None or DATA_CACHE.empty:
        database.init_db()
        df = analytics.load_data()
        if df.empty:
            print("Database empty, generating sample data...")
            seed_data.seed()
            df = analytics.load_data()
        DATA_CACHE = df
        SEGMENTS_CACHE = analytics.compute_customer_segments(df)
    return DATA_CACHE, SEGMENTS_CACHE

@app.on_event("startup")
def startup_event():
    get_df()
    print("Application started. Dataset loaded successfully.")

@app.get("/")
def root():
    return {
        "message": "E-Commerce Sales & Customer Analytics API is running",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/api/filter-options", response_model=FilterOptions)
def get_filter_options():
    df, _ = get_df()
    return analytics.get_filter_options(df)

@app.get("/api/dashboard-summary", response_model=KPISummary)
def get_dashboard_summary(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    category: Optional[str] = None,
    product: Optional[str] = None,
    state: Optional[str] = None,
    city: Optional[str] = None,
    payment_method: Optional[str] = None,
    order_status: Optional[str] = None,
    customer_segment: Optional[str] = None,
):
    df, seg_map = get_df()
    filtered = analytics.filter_dataframe(
        df, start_date, end_date, category, product, state, city,
        payment_method, order_status, customer_segment, seg_map
    )
    return analytics.calculate_kpis(filtered)

@app.get("/api/sales-trend")
def get_sales_trend(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    category: Optional[str] = None,
    product: Optional[str] = None,
    state: Optional[str] = None,
    city: Optional[str] = None,
    payment_method: Optional[str] = None,
    order_status: Optional[str] = None,
    customer_segment: Optional[str] = None,
    granularity: str = Query("monthly", pattern="^(monthly|daily)$")
):
    df, seg_map = get_df()
    filtered = analytics.filter_dataframe(
        df, start_date, end_date, category, product, state, city,
        payment_method, order_status, customer_segment, seg_map
    )
    return analytics.get_sales_trend(filtered, granularity=granularity)

@app.get("/api/category-sales")
def get_category_sales(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    category: Optional[str] = None,
    product: Optional[str] = None,
    state: Optional[str] = None,
    city: Optional[str] = None,
    payment_method: Optional[str] = None,
    order_status: Optional[str] = None,
    customer_segment: Optional[str] = None,
):
    df, seg_map = get_df()
    filtered = analytics.filter_dataframe(
        df, start_date, end_date, category, product, state, city,
        payment_method, order_status, customer_segment, seg_map
    )
    return analytics.get_category_sales(filtered)

@app.get("/api/top-products")
def get_top_products(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    category: Optional[str] = None,
    product: Optional[str] = None,
    state: Optional[str] = None,
    city: Optional[str] = None,
    payment_method: Optional[str] = None,
    order_status: Optional[str] = None,
    customer_segment: Optional[str] = None,
    limit: int = Query(10, ge=1, le=50)
):
    df, seg_map = get_df()
    filtered = analytics.filter_dataframe(
        df, start_date, end_date, category, product, state, city,
        payment_method, order_status, customer_segment, seg_map
    )
    return analytics.get_top_products(filtered, limit=limit)

@app.get("/api/customer-segments")
def get_customer_segments(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    category: Optional[str] = None,
    product: Optional[str] = None,
    state: Optional[str] = None,
    city: Optional[str] = None,
    payment_method: Optional[str] = None,
    order_status: Optional[str] = None,
    customer_segment: Optional[str] = None,
):
    df, seg_map = get_df()
    filtered = analytics.filter_dataframe(
        df, start_date, end_date, category, product, state, city,
        payment_method, order_status, customer_segment, seg_map
    )
    return analytics.get_customer_segments_analysis(filtered, seg_map)

@app.get("/api/top-customers")
def get_top_customers(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    category: Optional[str] = None,
    product: Optional[str] = None,
    state: Optional[str] = None,
    city: Optional[str] = None,
    payment_method: Optional[str] = None,
    order_status: Optional[str] = None,
    customer_segment: Optional[str] = None,
    limit: int = Query(10, ge=1, le=100)
):
    df, seg_map = get_df()
    filtered = analytics.filter_dataframe(
        df, start_date, end_date, category, product, state, city,
        payment_method, order_status, customer_segment, seg_map
    )
    return analytics.get_top_customers(filtered, seg_map, limit=limit)

@app.get("/api/location-sales")
def get_location_sales(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    category: Optional[str] = None,
    product: Optional[str] = None,
    state: Optional[str] = None,
    city: Optional[str] = None,
    payment_method: Optional[str] = None,
    order_status: Optional[str] = None,
    customer_segment: Optional[str] = None,
):
    df, seg_map = get_df()
    filtered = analytics.filter_dataframe(
        df, start_date, end_date, category, product, state, city,
        payment_method, order_status, customer_segment, seg_map
    )
    return analytics.get_location_sales(filtered)

@app.get("/api/payment-analysis")
def get_payment_analysis(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    category: Optional[str] = None,
    product: Optional[str] = None,
    state: Optional[str] = None,
    city: Optional[str] = None,
    payment_method: Optional[str] = None,
    order_status: Optional[str] = None,
    customer_segment: Optional[str] = None,
):
    df, seg_map = get_df()
    filtered = analytics.filter_dataframe(
        df, start_date, end_date, category, product, state, city,
        payment_method, order_status, customer_segment, seg_map
    )
    return analytics.get_payment_analysis(filtered)

@app.get("/api/order-status")
def get_order_status(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    category: Optional[str] = None,
    product: Optional[str] = None,
    state: Optional[str] = None,
    city: Optional[str] = None,
    payment_method: Optional[str] = None,
    order_status: Optional[str] = None,
    customer_segment: Optional[str] = None,
):
    df, seg_map = get_df()
    filtered = analytics.filter_dataframe(
        df, start_date, end_date, category, product, state, city,
        payment_method, order_status, customer_segment, seg_map
    )
    return analytics.get_order_status_analysis(filtered)

@app.get("/api/orders", response_model=PaginatedOrders)
def get_orders(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    category: Optional[str] = None,
    product: Optional[str] = None,
    state: Optional[str] = None,
    city: Optional[str] = None,
    payment_method: Optional[str] = None,
    order_status: Optional[str] = None,
    customer_segment: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: str = Query("Order_Date"),
    sort_order: str = Query("desc", pattern="^(asc|desc)$"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=5, le=100)
):
    df, seg_map = get_df()
    filtered = analytics.filter_dataframe(
        df, start_date, end_date, category, product, state, city,
        payment_method, order_status, customer_segment, seg_map
    )
    return analytics.get_paginated_orders(
        filtered, search=search, sort_by=sort_by, sort_order=sort_order,
        page=page, page_size=page_size
    )

@app.get("/api/export-csv")
def export_csv():
    csv_path = Path(__file__).resolve().parent.parent / "data" / "ecommerce_data.csv"
    if not csv_path.exists():
        raise HTTPException(status_code=404, detail="Dataset CSV not found")
    return FileResponse(
        path=str(csv_path),
        media_type="text/csv",
        filename="ecommerce_sales_customer_data.csv"
    )

@app.post("/api/reseed")
def reseed_database():
    global DATA_CACHE, SEGMENTS_CACHE
    seed_data.seed()
    DATA_CACHE = None
    SEGMENTS_CACHE = {}
    get_df()
    return {"status": "success", "message": "Database reseeded successfully"}
