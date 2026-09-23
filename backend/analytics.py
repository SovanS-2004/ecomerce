import sqlite3
import pandas as pd
import numpy as np
from datetime import datetime
from database import get_connection

def load_data() -> pd.DataFrame:
    conn = get_connection()
    df = pd.read_sql_query("SELECT * FROM orders", conn)
    conn.close()
    if not df.empty:
        df["Order_Date"] = pd.to_datetime(df["Order_Date"])
        df["YearMonth"] = df["Order_Date"].dt.strftime("%Y-%m")
        df["YearWeek"] = df["Order_Date"].dt.strftime("%Y-W%W")
        df["DateStr"] = df["Order_Date"].dt.strftime("%Y-%m-%d")
    return df

def compute_customer_segments(df: pd.DataFrame) -> dict:
    """Computes RFM segment for each customer across the dataset."""
    if df.empty:
        return {}
    
    ref_date = df["Order_Date"].max()
    cust_rfm = df.groupby("Customer_ID").agg(
        last_date=("Order_Date", "max"),
        frequency=("Order_ID", "nunique"),
        monetary=("Sales", "sum")
    ).reset_index()

    cust_rfm["recency"] = (ref_date - cust_rfm["last_date"]).dt.days
    
    # Define percentiles
    m_high = cust_rfm["monetary"].quantile(0.70)
    m_low = cust_rfm["monetary"].quantile(0.30)
    
    def assign_segment(row):
        if row["monetary"] >= m_high or row["frequency"] >= 6:
            return "High Value"
        elif row["monetary"] <= m_low and row["frequency"] <= 1:
            return "Low Value"
        else:
            return "Regular"

    cust_rfm["Segment"] = cust_rfm.apply(assign_segment, axis=1)
    return dict(zip(cust_rfm["Customer_ID"], cust_rfm["Segment"]))

def filter_dataframe(
    df: pd.DataFrame,
    start_date: str = None,
    end_date: str = None,
    category: str = None,
    product: str = None,
    state: str = None,
    city: str = None,
    payment_method: str = None,
    order_status: str = None,
    customer_segment: str = None,
    customer_segments_map: dict = None
) -> pd.DataFrame:
    filtered = df.copy()
    
    if filtered.empty:
        return filtered

    if start_date:
        filtered = filtered[filtered["DateStr"] >= start_date]
    if end_date:
        filtered = filtered[filtered["DateStr"] <= end_date]
    if category and category != "All":
        filtered = filtered[filtered["Category"] == category]
    if product and product != "All":
        filtered = filtered[filtered["Product"] == product]
    if state and state != "All":
        filtered = filtered[filtered["State"] == state]
    if city and city != "All":
        filtered = filtered[filtered["City"] == city]
    if payment_method and payment_method != "All":
        filtered = filtered[filtered["Payment_Method"] == payment_method]
    if order_status and order_status != "All":
        filtered = filtered[filtered["Order_Status"] == order_status]
    if customer_segment and customer_segment != "All" and customer_segments_map:
        filtered["_segment"] = filtered["Customer_ID"].map(customer_segments_map)
        filtered = filtered[filtered["_segment"] == customer_segment]
        filtered.drop(columns=["_segment"], inplace=True)
        
    return filtered

def calculate_kpis(df: pd.DataFrame) -> dict:
    if df.empty:
        return {
            "total_sales": 0.0,
            "total_orders": 0,
            "total_customers": 0,
            "total_profit": 0.0,
            "avg_order_value": 0.0,
            "avg_customer_spending": 0.0,
            "profit_margin_pct": 0.0,
            "total_quantity": 0,
            "mom_sales_growth_pct": 0.0
        }

    total_sales = float(df["Sales"].sum())
    total_orders = int(df["Order_ID"].nunique())
    total_customers = int(df["Customer_ID"].nunique())
    total_profit = float(df["Profit"].sum())
    total_quantity = int(df["Quantity"].sum())
    
    avg_order_value = round(total_sales / total_orders, 2) if total_orders > 0 else 0.0
    avg_customer_spending = round(total_sales / total_customers, 2) if total_customers > 0 else 0.0
    profit_margin_pct = round((total_profit / total_sales * 100), 2) if total_sales > 0 else 0.0

    # Month over Month growth for the latest 2 months
    monthly = df.groupby("YearMonth")["Sales"].sum().sort_index()
    mom_growth = 0.0
    if len(monthly) >= 2:
        prev_m = monthly.iloc[-2]
        curr_m = monthly.iloc[-1]
        if prev_m > 0:
            mom_growth = round(((curr_m - prev_m) / prev_m) * 100, 2)

    return {
        "total_sales": round(total_sales, 2),
        "total_orders": total_orders,
        "total_customers": total_customers,
        "total_profit": round(total_profit, 2),
        "avg_order_value": avg_order_value,
        "avg_customer_spending": avg_customer_spending,
        "profit_margin_pct": profit_margin_pct,
        "total_quantity": total_quantity,
        "mom_sales_growth_pct": mom_growth
    }

def get_sales_trend(df: pd.DataFrame, granularity: str = "monthly") -> list:
    if df.empty:
        return []
    
    group_col = "YearMonth" if granularity == "monthly" else "DateStr"
    grouped = df.groupby(group_col).agg(
        sales=("Sales", "sum"),
        profit=("Profit", "sum"),
        orders=("Order_ID", "nunique")
    ).reset_index().sort_values(by=group_col)

    grouped["sales"] = grouped["sales"].round(2)
    grouped["profit"] = grouped["profit"].round(2)
    grouped["growth_pct"] = grouped["sales"].pct_change().fillna(0).mul(100).round(2)

    points = []
    for _, row in grouped.iterrows():
        points.append({
            "month": str(row[group_col]),
            "sales": float(row["sales"]),
            "profit": float(row["profit"]),
            "orders": int(row["orders"]),
            "growth_pct": float(row["growth_pct"])
        })
    return points

def get_category_sales(df: pd.DataFrame) -> list:
    if df.empty:
        return []
        
    total_sales = df["Sales"].sum()
    grouped = df.groupby("Category").agg(
        sales=("Sales", "sum"),
        profit=("Profit", "sum"),
        orders=("Order_ID", "nunique"),
        quantity=("Quantity", "sum")
    ).reset_index().sort_values(by="sales", ascending=False)

    results = []
    for _, row in grouped.iterrows():
        cat_sales = float(row["sales"])
        cat_profit = float(row["profit"])
        margin = round((cat_profit / cat_sales * 100), 2) if cat_sales > 0 else 0.0
        share = round((cat_sales / total_sales * 100), 2) if total_sales > 0 else 0.0
        results.append({
            "category": str(row["Category"]),
            "sales": round(cat_sales, 2),
            "profit": round(cat_profit, 2),
            "orders": int(row["orders"]),
            "quantity": int(row["quantity"]),
            "margin_pct": margin,
            "share_pct": share
        })
    return results

def get_top_products(df: pd.DataFrame, limit: int = 10) -> dict:
    if df.empty:
        return {"by_revenue": [], "by_volume": [], "by_profit": [], "low_performing": []}

    prod_grp = df.groupby(["Product", "Category"]).agg(
        units_sold=("Quantity", "sum"),
        total_revenue=("Sales", "sum"),
        total_profit=("Profit", "sum"),
        avg_price=("Unit_Price", "mean")
    ).reset_index()

    prod_grp["margin_pct"] = np.where(
        prod_grp["total_revenue"] > 0,
        (prod_grp["total_profit"] / prod_grp["total_revenue"] * 100).round(2),
        0.0
    )
    prod_grp["total_revenue"] = prod_grp["total_revenue"].round(2)
    prod_grp["total_profit"] = prod_grp["total_profit"].round(2)
    prod_grp["avg_price"] = prod_grp["avg_price"].round(2)

    def to_list(sorted_df):
        return [
            {
                "product": str(r["Product"]),
                "category": str(r["Category"]),
                "units_sold": int(r["units_sold"]),
                "total_revenue": float(r["total_revenue"]),
                "total_profit": float(r["total_profit"]),
                "margin_pct": float(r["margin_pct"]),
                "avg_price": float(r["avg_price"])
            }
            for _, r in sorted_df.head(limit).iterrows()
        ]

    by_revenue = to_list(prod_grp.sort_values(by="total_revenue", ascending=False))
    by_volume = to_list(prod_grp.sort_values(by="units_sold", ascending=False))
    by_profit = to_list(prod_grp.sort_values(by="total_profit", ascending=False))
    low_performing = to_list(prod_grp.sort_values(by="total_revenue", ascending=True))

    return {
        "by_revenue": by_revenue,
        "by_volume": by_volume,
        "by_profit": by_profit,
        "low_performing": low_performing
    }

def get_customer_segments_analysis(df: pd.DataFrame, segments_map: dict) -> dict:
    if df.empty:
        return {"segments": [], "new_vs_returning": {"new_customers": 0, "returning_customers": 0, "new_pct": 0.0, "returning_pct": 0.0}}

    df_copy = df.copy()
    df_copy["Segment"] = df_copy["Customer_ID"].map(segments_map).fillna("Regular")
    
    total_sales = df_copy["Sales"].sum()
    total_custs = df_copy["Customer_ID"].nunique()

    seg_summary = df_copy.groupby("Segment").agg(
        customer_count=("Customer_ID", "nunique"),
        total_sales=("Sales", "sum"),
        order_count=("Order_ID", "nunique")
    ).reset_index()

    order_preference = ["High Value", "Regular", "Low Value"]
    seg_summary["order"] = seg_summary["Segment"].apply(lambda x: order_preference.index(x) if x in order_preference else 99)
    seg_summary = seg_summary.sort_values("order")

    segments_list = []
    for _, row in seg_summary.iterrows():
        cnt = int(row["customer_count"])
        sales = float(row["total_sales"])
        avg_spend = round(sales / cnt, 2) if cnt > 0 else 0.0
        share = round((sales / total_sales * 100), 2) if total_sales > 0 else 0.0
        segments_list.append({
            "segment": str(row["Segment"]),
            "customer_count": cnt,
            "total_sales": round(sales, 2),
            "avg_spending": avg_spend,
            "order_count": int(row["order_count"]),
            "share_pct": share
        })

    # New vs Returning Customers analysis
    # A customer is returning if they made more than 1 order in the dataset
    cust_orders = df_copy.groupby("Customer_ID")["Order_ID"].nunique()
    returning_count = int((cust_orders > 1).sum())
    new_count = int((cust_orders == 1).sum())
    tot = returning_count + new_count
    
    new_pct = round((new_count / tot * 100), 2) if tot > 0 else 0.0
    ret_pct = round((returning_count / tot * 100), 2) if tot > 0 else 0.0

    return {
        "segments": segments_list,
        "new_vs_returning": {
            "new_customers": new_count,
            "returning_customers": returning_count,
            "new_pct": new_pct,
            "returning_pct": ret_pct
        }
    }

def get_top_customers(df: pd.DataFrame, segments_map: dict, limit: int = 10) -> list:
    if df.empty:
        return []

    grouped = df.groupby(["Customer_ID", "Customer_Name", "Gender", "City", "State"]).agg(
        orders=("Order_ID", "nunique"),
        total_spending=("Sales", "sum")
    ).reset_index().sort_values(by="total_spending", ascending=False).head(limit)

    results = []
    for _, row in grouped.iterrows():
        cid = str(row["Customer_ID"])
        tot_spend = float(row["total_spending"])
        orders = int(row["orders"])
        avg_order = round(tot_spend / orders, 2) if orders > 0 else 0.0
        results.append({
            "customer_id": cid,
            "customer_name": str(row["Customer_Name"]),
            "gender": str(row["Gender"]),
            "city": str(row["City"]),
            "state": str(row["State"]),
            "orders": orders,
            "total_spending": round(tot_spend, 2),
            "avg_order_value": avg_order,
            "segment": segments_map.get(cid, "Regular")
        })
    return results

def get_location_sales(df: pd.DataFrame) -> dict:
    if df.empty:
        return {"states": [], "top_cities": []}

    total_sales = df["Sales"].sum()

    # States
    state_grp = df.groupby("State").agg(
        sales=("Sales", "sum"),
        profit=("Profit", "sum"),
        orders=("Order_ID", "nunique")
    ).reset_index().sort_values(by="sales", ascending=False)

    states_list = []
    for _, row in state_grp.iterrows():
        s_sales = float(row["sales"])
        states_list.append({
            "location": str(row["State"]),
            "state": str(row["State"]),
            "sales": round(s_sales, 2),
            "profit": round(float(row["profit"]), 2),
            "orders": int(row["orders"]),
            "share_pct": round((s_sales / total_sales * 100), 2) if total_sales > 0 else 0.0
        })

    # Cities
    city_grp = df.groupby(["City", "State"]).agg(
        sales=("Sales", "sum"),
        profit=("Profit", "sum"),
        orders=("Order_ID", "nunique")
    ).reset_index().sort_values(by="sales", ascending=False).head(10)

    cities_list = []
    for _, row in city_grp.iterrows():
        c_sales = float(row["sales"])
        cities_list.append({
            "location": str(row["City"]),
            "state": str(row["State"]),
            "sales": round(c_sales, 2),
            "profit": round(float(row["profit"]), 2),
            "orders": int(row["orders"]),
            "share_pct": round((c_sales / total_sales * 100), 2) if total_sales > 0 else 0.0
        })

    return {
        "states": states_list,
        "top_cities": cities_list
    }

def get_payment_analysis(df: pd.DataFrame) -> list:
    if df.empty:
        return []

    total_orders = len(df)
    grouped = df.groupby("Payment_Method").agg(
        count=("Order_ID", "count"),
        sales=("Sales", "sum")
    ).reset_index().sort_values(by="sales", ascending=False)

    results = []
    for _, row in grouped.iterrows():
        cnt = int(row["count"])
        results.append({
            "method": str(row["Payment_Method"]),
            "count": cnt,
            "sales": round(float(row["sales"]), 2),
            "percentage": round((cnt / total_orders * 100), 2) if total_orders > 0 else 0.0
        })
    return results

def get_order_status_analysis(df: pd.DataFrame) -> list:
    if df.empty:
        return []

    total_orders = len(df)
    grouped = df.groupby("Order_Status").agg(
        count=("Order_ID", "count"),
        sales=("Sales", "sum")
    ).reset_index().sort_values(by="count", ascending=False)

    results = []
    for _, row in grouped.iterrows():
        cnt = int(row["count"])
        results.append({
            "status": str(row["Order_Status"]),
            "count": cnt,
            "sales": round(float(row["sales"]), 2),
            "percentage": round((cnt / total_orders * 100), 2) if total_orders > 0 else 0.0
        })
    return results

def get_paginated_orders(
    df: pd.DataFrame,
    search: str = None,
    sort_by: str = "Order_Date",
    sort_order: str = "desc",
    page: int = 1,
    page_size: int = 20
) -> dict:
    if df.empty:
        return {"items": [], "total": 0, "page": page, "page_size": page_size, "total_pages": 0}

    filtered = df.copy()
    if search:
        s = search.lower().strip()
        filtered = filtered[
            filtered["Order_ID"].str.lower().str.contains(s) |
            filtered["Customer_Name"].str.lower().str.contains(s) |
            filtered["Product"].str.lower().str.contains(s) |
            filtered["Category"].str.lower().str.contains(s) |
            filtered["City"].str.lower().str.contains(s) |
            filtered["State"].str.lower().str.contains(s) |
            filtered["Payment_Method"].str.lower().str.contains(s) |
            filtered["Order_Status"].str.lower().str.contains(s)
        ]

    total = len(filtered)
    total_pages = max(1, (total + page_size - 1) // page_size)
    page = max(1, min(page, total_pages))

    ascending = (sort_order.lower() == "asc")
    valid_sort_cols = [
        "Order_ID", "Order_Date", "Customer_Name", "City", "State",
        "Product", "Category", "Quantity", "Unit_Price", "Discount",
        "Sales", "Profit", "Payment_Method", "Order_Status"
    ]
    if sort_by in valid_sort_cols:
        filtered = filtered.sort_values(by=sort_by, ascending=ascending)

    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    sliced = filtered.iloc[start_idx:end_idx]

    items = []
    for _, row in sliced.iterrows():
        items.append({
            "id": int(row["id"]),
            "Order_ID": str(row["Order_ID"]),
            "Order_Date": str(row["DateStr"]),
            "Customer_ID": str(row["Customer_ID"]),
            "Customer_Name": str(row["Customer_Name"]),
            "Gender": str(row["Gender"]),
            "Age": int(row["Age"]),
            "City": str(row["City"]),
            "State": str(row["State"]),
            "Product": str(row["Product"]),
            "Category": str(row["Category"]),
            "Quantity": int(row["Quantity"]),
            "Unit_Price": float(row["Unit_Price"]),
            "Discount": float(row["Discount"]),
            "Sales": float(row["Sales"]),
            "Profit": float(row["Profit"]),
            "Payment_Method": str(row["Payment_Method"]),
            "Order_Status": str(row["Order_Status"])
        })

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages
    }

def get_filter_options(df: pd.DataFrame) -> dict:
    if df.empty:
        return {
            "categories": [],
            "products": [],
            "states": [],
            "cities": [],
            "payment_methods": [],
            "order_statuses": [],
            "customer_segments": ["High Value", "Regular", "Low Value"],
            "min_date": "",
            "max_date": ""
        }

    return {
        "categories": sorted(df["Category"].dropna().unique().tolist()),
        "products": sorted(df["Product"].dropna().unique().tolist()),
        "states": sorted(df["State"].dropna().unique().tolist()),
        "cities": sorted(df["City"].dropna().unique().tolist()),
        "payment_methods": sorted(df["Payment_Method"].dropna().unique().tolist()),
        "order_statuses": sorted(df["Order_Status"].dropna().unique().tolist()),
        "customer_segments": ["High Value", "Regular", "Low Value"],
        "min_date": df["DateStr"].min(),
        "max_date": df["DateStr"].max()
    }
