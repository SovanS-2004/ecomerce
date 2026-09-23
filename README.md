# E-Commerce Sales & Customer Analytics Dashboard

An enterprise-grade, interactive Business Intelligence & Analytics web application designed for e-commerce performance monitoring, customer retention analysis, and executive decision-making.

> **Ideal for:** BCA / MCA Data Analytics Capstone Projects, Business Intelligence presentations, and E-commerce Portfolio demonstrations.

---

## Key Highlights & Features

1. **Executive KPI Cards**: Real-time calculation of **Total Sales (Gross Revenue)**, **Total Orders**, **Total Customers**, **Total Net Profit**, **Average Order Value (AOV)**, and **Average Customer Spending**, complete with Month-over-Month (MoM) growth indicators and net margin percentages.
2. **Sales Analytics**: Monthly and daily revenue trends, sales vs profit trajectory, revenue growth rates, and department contribution matrices.
3. **Customer RFM Segmentation**: Automated algorithmic classification into **High Value**, **Regular**, and **Low Value** customer tiers using Recency, Frequency, and Monetary parameters, alongside new vs returning customer retention ratios.
4. **Product Portfolio Analytics**: Identification of top revenue drivers, unit volume leaders, high-margin items, and underperforming catalog items needing clearance.
5. **Geographic & Regional Analytics**: State-wise and metropolitan city sales distribution, orders per region, and interactive map slicers.
6. **Payment Method & Fulfillment Analysis**: Distribution across UPI, Credit Card, Debit Card, Cash on Delivery (COD), and Net Banking; plus breakdown of Delivered, Pending, Cancelled, and Returned orders.
7. **Interactive Global Slicers**: Dynamic cross-filtering by Date Range (presets: 30D, 90D, 6M, 1Y, or custom calendar), State, City, Category, Product, Payment Method, Order Status, and Customer Segment.
8. **Orders Explorer & Transaction Ledger**: Full data table with live search, column sorting, pagination, status badges, and CSV export.
9. **Automated Seed Generator**: Generates 850+ realistic order records spanning 24 months across 150+ customers and 6 categories stored in SQLite and exported to CSV.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React.js (Vite) | Single-page responsive web client |
| **Styling** | Tailwind CSS | Modern SaaS design with custom indigo palette |
| **Data Visualization** | Recharts | Interactive Area, Bar, Donut, and Composed charts |
| **Icons** | Lucide React | Clean, scalable vector icons |
| **Backend API** | Python FastAPI | High-performance asynchronous REST endpoints |
| **Data Engine** | Pandas & NumPy | Vectorized multi-criteria filtering, group-bys & RFM |
| **Database** | SQLite 3 | Embedded relational database with index optimizations |

---

## Project Directory Structure

```
ecommerce-analytics/
│
├── frontend/                     # React + Vite + Tailwind frontend application
│   ├── src/
│   │   ├── charts/              # Recharts components
│   │   │   ├── MonthlySalesChart.jsx
│   │   │   ├── CategorySalesChart.jsx
│   │   │   ├── TopProductsChart.jsx
│   │   │   ├── StateSalesChart.jsx
│   │   │   ├── CustomerSegmentChart.jsx
│   │   │   ├── PaymentMethodChart.jsx
│   │   │   ├── OrderStatusChart.jsx
│   │   │   └── SalesProfitComparisonChart.jsx
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── KPICard.jsx
│   │   │   ├── ChartCard.jsx
│   │   │   └── DataTable.jsx
│   │   ├── context/             # Global filter state store
│   │   │   └── FilterContext.jsx
│   │   ├── pages/               # Multi-page analytics views
│   │   │   ├── OverviewDashboard.jsx
│   │   │   ├── SalesAnalytics.jsx
│   │   │   ├── CustomerAnalytics.jsx
│   │   │   ├── ProductAnalytics.jsx
│   │   │   ├── LocationAnalytics.jsx
│   │   │   ├── OrdersPage.jsx
│   │   │   └── DatasetPage.jsx
│   │   ├── services/            # REST API communication client
│   │   │   └── api.js
│   │   ├── App.jsx              # Main dashboard root container
│   │   ├── index.css            # Tailwind directives
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
├── backend/                      # Python FastAPI server & analytics engine
│   ├── main.py                  # FastAPI routes, CORS, and query parameters
│   ├── database.py              # SQLite connection & schema initialization
│   ├── models.py                # Pydantic schema validation
│   ├── analytics.py             # Pandas analytics algorithms & RFM modeling
│   ├── seed_data.py             # 850+ realistic sample orders generator
│   ├── test_api.py              # Automated endpoint test suite
│   └── requirements.txt         # Python dependencies
│
├── data/                         # Exported dataset storage
│   └── ecommerce_data.csv       # Pre-generated 850 orders dataset
│
└── README.md                    # Project documentation
```

---

## Quick Setup & Execution Guide

### Prerequisites
- **Python 3.10+** (with `pip`)
- **Node.js 18+** & **npm**

---

### Step 1: Start the Backend Server

1. Open a terminal and navigate to `backend/`:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Seed the SQLite database & generate the dataset (if not already created):
   ```bash
   python seed_data.py
   ```

4. Launch the FastAPI server with Uvicorn:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   *The backend will be live at `http://127.0.0.1:8000`.*
   *Interactive Swagger API documentation: `http://127.0.0.1:8000/docs`.*

---

### Step 2: Start the Frontend Application

1. Open a second terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   ```

2. Install npm packages:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend dashboard will be live at `http://localhost:5173`.*

---

## API Endpoints Reference

All endpoints accept optional query parameters for multi-criteria cross-filtering:
`start_date`, `end_date`, `category`, `product`, `state`, `city`, `payment_method`, `order_status`, `customer_segment`.

| Endpoint | Method | Description |
|---|---|---|
| `/api/filter-options` | `GET` | Returns distinct filter dropdown options based on dataset |
| `/api/dashboard-summary` | `GET` | Returns 6 core KPIs, MoM growth %, and net margin % |
| `/api/sales-trend` | `GET` | Monthly and daily revenue & profit trajectory |
| `/api/category-sales` | `GET` | Department sales, net profit, margins, and market shares |
| `/api/top-products` | `GET` | Best sellers by revenue, volume, profit, and low performers |
| `/api/customer-segments` | `GET` | RFM tiers and new vs returning customer retention metrics |
| `/api/top-customers` | `GET` | Top 25 customer leaderboard by cumulative spend |
| `/api/location-sales` | `GET` | State rankings and top 10 metropolitan cities |
| `/api/payment-analysis` | `GET` | Transaction share across UPI, Cards, COD, and Net Banking |
| `/api/order-status` | `GET` | Counts and percentages for Delivered, Pending, Cancelled, Returned |
| `/api/orders` | `GET` | Paginated transactions table with search and multi-column sorting |
| `/api/export-csv` | `GET` | Direct download of raw `ecommerce_data.csv` |
| `/api/reseed` | `POST` | Re-generates and resets SQLite database with fresh random seed |

---

## Relational Data Schema (`orders` table)

| Column Name | Data Type | Sample Value | Description |
|---|---|---|---|
| `Order_ID` | TEXT (PK) | `ORD-10024` | Unique transaction code |
| `Order_Date` | TEXT | `2024-03-15` | Order placement date |
| `Customer_ID` | TEXT | `CUST-0042` | Registered customer identifier |
| `Customer_Name` | TEXT | `Aarav Sharma` | Customer full name |
| `Gender` | TEXT | `Male` | Demographic identifier |
| `Age` | INTEGER | `28` | Customer age |
| `City` | TEXT | `Mumbai` | Delivery location city |
| `State` | TEXT | `Maharashtra` | Delivery location state |
| `Product` | TEXT | `Apple iPhone 15 (128GB)` | Item description |
| `Category` | TEXT | `Electronics` | Retail department |
| `Quantity` | INTEGER | `1` | Units ordered |
| `Unit_Price` | REAL | `74999.0` | Price per unit (INR ₹) |
| `Discount` | REAL | `10.0` | Discount percentage (%) |
| `Sales` | REAL | `67499.10` | Final gross line item revenue |
| `Profit` | REAL | `10799.86` | Net margin earned |
| `Payment_Method` | TEXT | `UPI` | UPI / Card / COD / Net Banking |
| `Order_Status` | TEXT | `Delivered` | Fulfillment outcome |

---

## Verification & Automated Testing

Run the automated backend test suite:
```bash
cd backend
python test_api.py
```
Expected output:
```
[OK] /api/filter-options returned 200 OK
[OK] /api/dashboard-summary returned 200 OK
[OK] /api/sales-trend returned 200 OK
[OK] /api/category-sales returned 200 OK
[OK] /api/top-products returned 200 OK
[OK] /api/customer-segments returned 200 OK
[OK] /api/top-customers returned 200 OK
[OK] /api/location-sales returned 200 OK
[OK] /api/payment-analysis returned 200 OK
[OK] /api/order-status returned 200 OK
[OK] /api/orders?page=1&page_size=10 returned 200 OK
ALL BACKEND API TESTS PASSED SUCCESSFULLY!
```

---

## License & Credits

Developed for academic demonstration and professional business intelligence modeling. Free to use and extend for personal and collegiate analytics projects.
