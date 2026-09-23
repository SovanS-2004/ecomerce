import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Receipt, 
  Wallet,
  ArrowRight,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { useFilters } from '../context/FilterContext';
import { 
  fetchDashboardSummary, 
  fetchSalesTrend, 
  fetchCategorySales, 
  fetchTopProducts, 
  fetchCustomerSegments, 
  fetchPaymentAnalysis, 
  fetchOrderStatus, 
  fetchTopCustomers,
  fetchLocationSales
} from '../services/api';
import KPICard, { formatCurrency, formatNumber } from '../components/KPICard';
import ChartCard from '../components/ChartCard';
import MonthlySalesChart from '../charts/MonthlySalesChart';
import CategorySalesChart from '../charts/CategorySalesChart';
import TopProductsChart from '../charts/TopProductsChart';
import StateSalesChart from '../charts/StateSalesChart';
import CustomerSegmentChart from '../charts/CustomerSegmentChart';
import PaymentMethodChart from '../charts/PaymentMethodChart';
import OrderStatusChart from '../charts/OrderStatusChart';
import DataTable, { SegmentBadge } from '../components/DataTable';

export default function OverviewDashboard({ onNavigateTo }) {
  const { filters, setFilter } = useFilters();

  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState(null);
  const [salesTrend, setSalesTrend] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [locationSales, setLocationSales] = useState({ states: [], top_cities: [] });
  const [customerSegments, setCustomerSegments] = useState({ segments: [], new_vs_returning: {} });
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [
          kpiData,
          trendData,
          catData,
          prodData,
          locData,
          custSegData,
          payData,
          statusData,
          topCustData,
        ] = await Promise.all([
          fetchDashboardSummary(filters),
          fetchSalesTrend(filters, 'monthly'),
          fetchCategorySales(filters),
          fetchTopProducts(filters, 10),
          fetchLocationSales(filters),
          fetchCustomerSegments(filters),
          fetchPaymentAnalysis(filters),
          fetchOrderStatus(filters),
          fetchTopCustomers(filters, 6),
        ]);

        if (isMounted) {
          setKpis(kpiData);
          setSalesTrend(trendData);
          setCategorySales(catData);
          setTopProducts(prodData.by_revenue || []);
          setLocationSales(locData);
          setCustomerSegments(custSegData);
          setPaymentMethods(payData);
          setOrderStatus(statusData);
          setTopCustomers(topCustData);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDashboardData();
    return () => { isMounted = false; };
  }, [filters]);

  const topCustomerColumns = [
    {
      key: 'customer_name',
      label: 'Customer Name',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[11px]">
            {row.customer_name.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-slate-900">{row.customer_name}</div>
            <div className="text-[10px] text-slate-400">{row.city}, {row.state}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'orders',
      label: 'Orders',
      render: (row) => <span className="font-semibold text-slate-800">{row.orders}</span>,
    },
    {
      key: 'total_spending',
      label: 'Total Spending',
      render: (row) => (
        <span className="font-bold text-slate-900">{formatCurrency(row.total_spending)}</span>
      ),
    },
    {
      key: 'avg_order_value',
      label: 'Avg / Order',
      render: (row) => (
        <span className="text-slate-600">{formatCurrency(row.avg_order_value)}</span>
      ),
    },
    {
      key: 'segment',
      label: 'Segment',
      render: (row) => <SegmentBadge segment={row.segment} />,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 text-white shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-medium mb-2 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Interactive Business Intelligence</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Executive Performance Overview</h2>
          <p className="text-xs sm:text-sm text-indigo-200 mt-1 max-w-xl">
            Real-time analytics tracking revenue, customer lifetime value, margins, and regional demand across all active sales channels.
          </p>
        </div>
        <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1 border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-6">
          <span className="text-[11px] text-indigo-300">Net Profit Margin</span>
          <span className="text-2xl font-extrabold text-emerald-400">
            {kpis?.profit_margin_pct ?? 0}%
          </span>
          <span className="text-[10px] text-slate-400 hidden sm:inline">Overall margin efficiency</span>
        </div>
      </div>

      {/* SECTION 1: 6 KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Total Sales"
          formattedValue={formatCurrency(kpis?.total_sales)}
          icon={DollarSign}
          color="indigo"
          trend={kpis?.mom_sales_growth_pct}
          trendLabel="MoM Growth"
          isLoading={loading}
        />
        <KPICard
          title="Total Orders"
          formattedValue={formatNumber(kpis?.total_orders)}
          icon={ShoppingBag}
          color="sky"
          subtitle={`${formatNumber(kpis?.total_quantity || 0)} items sold`}
          isLoading={loading}
        />
        <KPICard
          title="Total Customers"
          formattedValue={formatNumber(kpis?.total_customers)}
          icon={Users}
          color="violet"
          subtitle="Unique active buyers"
          isLoading={loading}
        />
        <KPICard
          title="Total Profit"
          formattedValue={formatCurrency(kpis?.total_profit)}
          icon={TrendingUp}
          color="emerald"
          subtitle={`${kpis?.profit_margin_pct || 0}% net margin`}
          isLoading={loading}
        />
        <KPICard
          title="Avg Order Value"
          formattedValue={formatCurrency(kpis?.avg_order_value)}
          icon={Receipt}
          color="amber"
          subtitle="Revenue per order"
          isLoading={loading}
        />
        <KPICard
          title="Avg Customer Spend"
          formattedValue={formatCurrency(kpis?.avg_customer_spending)}
          icon={Wallet}
          color="rose"
          subtitle="Average lifetime spend"
          isLoading={loading}
        />
      </div>

      {/* SECTION 2: Monthly Sales Trend & Category-wise Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Monthly Sales & Profit Trend"
          subtitle="Revenue & net profit trajectory over time"
          isLoading={loading}
          isEmpty={salesTrend.length === 0}
        >
          <MonthlySalesChart data={salesTrend} />
        </ChartCard>

        <ChartCard
          title="Category-wise Sales Distribution"
          subtitle="Revenue & margins per category (click bar to filter)"
          isLoading={loading}
          isEmpty={categorySales.length === 0}
        >
          <CategorySalesChart
            data={categorySales}
            selectedCategory={filters.category}
            onCategoryClick={(cat) => setFilter('category', cat === filters.category ? 'All' : cat)}
          />
        </ChartCard>
      </div>

      {/* SECTION 3: Top 10 Products & Sales by State */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Top 10 Products by Revenue"
          subtitle="Highest grossing items across all categories"
          isLoading={loading}
          isEmpty={topProducts.length === 0}
        >
          <TopProductsChart data={topProducts} metric="total_revenue" />
        </ChartCard>

        <ChartCard
          title="Geographic Sales by State"
          subtitle="Top performing states (click bar to filter)"
          isLoading={loading}
          isEmpty={locationSales.states.length === 0}
        >
          <StateSalesChart
            data={locationSales.states}
            selectedState={filters.state}
            onStateClick={(st) => setFilter('state', st === filters.state ? 'All' : st)}
          />
        </ChartCard>
      </div>

      {/* SECTION 4: Customer Segmentation & Payment Method Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Customer RFM Segmentation"
          subtitle="High Value, Regular, and Low Value tiers (click to filter)"
          isLoading={loading}
          isEmpty={customerSegments.segments.length === 0}
        >
          <CustomerSegmentChart
            data={customerSegments.segments}
            selectedSegment={filters.customer_segment}
            onSegmentClick={(seg) =>
              setFilter('customer_segment', seg === filters.customer_segment ? 'All' : seg)
            }
          />
        </ChartCard>

        <ChartCard
          title="Payment Method Breakdown"
          subtitle="Transaction volume by payment instrument (click to filter)"
          isLoading={loading}
          isEmpty={paymentMethods.length === 0}
        >
          <PaymentMethodChart
            data={paymentMethods}
            selectedMethod={filters.payment_method}
            onPaymentClick={(m) =>
              setFilter('payment_method', m === filters.payment_method ? 'All' : m)
            }
          />
        </ChartCard>
      </div>

      {/* SECTION 5: New vs Returning Customers & Order Status Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New vs Returning Customers Summary Card */}
        <ChartCard
          title="Customer Retention Analysis"
          subtitle="New first-time buyers vs loyal repeat customers"
          isLoading={loading}
        >
          <div className="flex flex-col justify-center h-72 px-4 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex flex-col justify-between">
                <span className="text-xs font-semibold text-indigo-700">Returning Customers</span>
                <div className="text-3xl font-extrabold text-slate-900 mt-2">
                  {formatNumber(customerSegments.new_vs_returning?.returning_customers || 0)}
                </div>
                <div className="text-xs text-indigo-600 font-semibold mt-1">
                  {customerSegments.new_vs_returning?.returning_pct || 0}% of active base
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-600">New First-Time Buyers</span>
                <div className="text-3xl font-extrabold text-slate-900 mt-2">
                  {formatNumber(customerSegments.new_vs_returning?.new_customers || 0)}
                </div>
                <div className="text-xs text-slate-500 font-semibold mt-1">
                  {customerSegments.new_vs_returning?.new_pct || 0}% of active base
                </div>
              </div>
            </div>

            {/* Progress visualization */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-slate-600">
                <span>Returning: {customerSegments.new_vs_returning?.returning_pct || 0}%</span>
                <span>New: {customerSegments.new_vs_returning?.new_pct || 0}%</span>
              </div>
              <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex">
                <div 
                  className="bg-indigo-600 h-full rounded-l-full transition-all duration-500" 
                  style={{ width: `${customerSegments.new_vs_returning?.returning_pct || 50}%` }}
                />
                <div 
                  className="bg-sky-400 h-full rounded-r-full transition-all duration-500" 
                  style={{ width: `${customerSegments.new_vs_returning?.new_pct || 50}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 italic text-center pt-1">
                A healthy repeat customer ratio indicates strong brand loyalty and higher lifetime value.
              </p>
            </div>
          </div>
        </ChartCard>

        <ChartCard
          title="Fulfillment & Order Status"
          subtitle="Delivered, Pending, Cancelled, and Returned distribution"
          isLoading={loading}
          isEmpty={orderStatus.length === 0}
        >
          <OrderStatusChart
            data={orderStatus}
            selectedStatus={filters.order_status}
            onStatusClick={(st) =>
              setFilter('order_status', st === filters.order_status ? 'All' : st)
            }
          />
        </ChartCard>
      </div>

      {/* SECTION 6: Top Customers Table */}
      <ChartCard
        title="Top Customers by Spending"
        subtitle="Leading patrons ranked by cumulative order value"
        action={
          <button
            onClick={() => onNavigateTo('customers')}
            className="flex items-center space-x-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <span>View All Customers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        }
        isLoading={loading}
        isEmpty={topCustomers.length === 0}
        minHeight="auto"
      >
        <DataTable
          columns={topCustomerColumns}
          data={topCustomers}
          isLoading={false}
          emptyMessage="No customer records available for the selected filters."
        />
      </ChartCard>
    </div>
  );
}
