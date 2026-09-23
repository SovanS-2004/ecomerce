import sys
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def run_tests():
    print("Testing API endpoints...")
    
    endpoints = [
        "/api/filter-options",
        "/api/dashboard-summary",
        "/api/sales-trend",
        "/api/category-sales",
        "/api/top-products",
        "/api/customer-segments",
        "/api/top-customers",
        "/api/location-sales",
        "/api/payment-analysis",
        "/api/order-status",
        "/api/orders?page=1&page_size=10"
    ]
    
    for ep in endpoints:
        res = client.get(ep)
        assert res.status_code == 200, f"Failed {ep}: {res.status_code} {res.text}"
        data = res.json()
        print(f"[OK] {ep} returned 200 OK")

    # Test filtering
    print("\nTesting filtered queries...")
    res_filter = client.get("/api/dashboard-summary?category=Electronics&state=Maharashtra")
    assert res_filter.status_code == 200
    filtered_kpi = res_filter.json()
    print(f"[OK] Filtered summary: Total Sales = {filtered_kpi['total_sales']}, Total Orders = {filtered_kpi['total_orders']}")

    # Test orders search and pagination
    res_orders = client.get("/api/orders?search=iPhone&page=1&page_size=5")
    assert res_orders.status_code == 200
    orders_data = res_orders.json()
    print(f"[OK] Orders search 'iPhone': Found {orders_data['total']} items, page {orders_data['page']}/{orders_data['total_pages']}")

    print("\nALL BACKEND API TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
