import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Layers, 
  Percent, 
  Calendar
} from 'lucide-react';
import { useFilters } from '../context/FilterContext';
import { fetchSalesTrend, fetchCategorySales, fetchDashboardSummary } from '../services/api';
import KPICard, { formatCurrency, formatNumber } from '../components/KPICard';
import ChartCard from '../components/ChartCard';
import MonthlySalesChart from '../charts/MonthlySalesChart';
import CategorySalesChart from '../charts/CategorySalesChart';
import SalesProfitComparisonChart from '../charts/SalesProfitComparisonChart';
import DataTable from '../components/DataTable';

export default function SalesAnalytics() {
  const { filters } = useFilters();
  const [loading, setLoading] = useState(true);
  const [granularity, setGranularity] = useState('monthly');
  const [trendData, setTrendData] = useState([]);
  const [catData, setCatData] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadSales() {
      setLoading(true);
      try {
        const [trend, cats, sum] = await Promise.all([
          fetchSalesTrend(filters, granularity),
          fetchCategorySales(filters),
          fetchDashboardSummary(filters),
        ]);
        if (isMounted) {
          setTrendData(trend);
          setCatData(cats);
          setSummary(sum);
        }
      } catch (err) {
        console.error('Error in sales analytics:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadSales();
    return () => { isMounted = false; };
  }, [filters, granularity]);

  const categoryTableColumns = [
    {
      key: 'category',
      label: 'Category',
      render: (row) => <span className="font-bold text-slate-900">{row.category}</span>,
    },
    {
      key: 'sales',
      label: 'Total Sales',
      render: (row) => <span className="font-semibold text-slate-800">{formatCurrency(row.sales)}</span>,
    },
    {
      key: 'profit',
      label: 'Net Profit',
      render: (row) => <span className="font-semibold text-emerald-600">{formatCurrency(row.profit)}</span>,
    },
    {
      key: 'margin_pct',
      label: 'Margin %',
      render: (row) => (
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {row.margin_pct}%
        </span>
      ),
    },
    {
      key: 'orders',
      label: 'Orders',
      render: (row) => <span>{formatNumber(row.orders)}</span>,
    },
    {
      key: 'quantity',
      label: 'Units Sold',
      render: (row) => <span>{formatNumber(row.quantity)}</span>,
    },
    {
      key: 'share_pct',
      label: 'Market Share',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${row.share_pct}%` }} />
          </div>
          <span className="font-medium text-slate-600">{row.share_pct}%</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Sales & Revenue Intelligence</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Analyze gross revenue, net margin dynamics, periodic growth rates, and category contribution.
          </p>
        </div>

        {/* Granularity Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs self-start sm:self-auto">
          <button
            onClick={() => setGranularity('monthly')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              granularity === 'monthly'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monthly View
          </button>
          <button
            onClick={() => setGranularity('daily')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              granularity === 'daily'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daily View
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Gross Revenue"
          formattedValue={formatCurrency(summary?.total_sales)}
          icon={DollarSign}
          color="indigo"
          trend={summary?.mom_sales_growth_pct}
          trendLabel="Latest MoM"
          isLoading={loading}
        />
        <KPICard
          title="Total Net Profit"
          formattedValue={formatCurrency(summary?.total_profit)}
          icon={TrendingUp}
          color="emerald"
          subtitle={`${summary?.profit_margin_pct || 0}% overall profit margin`}
          isLoading={loading}
        />
        <KPICard
          title="Total Order Count"
          formattedValue={formatNumber(summary?.total_orders)}
          icon={Layers}
          color="sky"
          subtitle={`${formatNumber(summary?.total_quantity || 0)} items sold`}
          isLoading={loading}
        />
        <KPICard
          title="Average Order Value"
          formattedValue={formatCurrency(summary?.avg_order_value)}
          icon={Percent}
          color="amber"
          subtitle="Gross sales / total orders"
          isLoading={loading}
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Revenue vs Net Profit"
          subtitle="Composed gross sales vs net profitability"
          isLoading={loading}
          isEmpty={trendData.length === 0}
        >
          <SalesProfitComparisonChart data={trendData} />
        </ChartCard>

        <ChartCard
          title="Periodic Sales Trend"
          subtitle={`Trajectory displayed in ${granularity} increments`}
          isLoading={loading}
          isEmpty={trendData.length === 0}
        >
          <MonthlySalesChart data={trendData} />
        </ChartCard>
      </div>

      {/* Category Performance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ChartCard
            title="Sales by Category"
            subtitle="Volume and revenue ranking"
            isLoading={loading}
            isEmpty={catData.length === 0}
          >
            <CategorySalesChart data={catData} />
          </ChartCard>
        </div>

        <div className="lg:col-span-2">
          <ChartCard
            title="Category Contribution & Margin Matrix"
            subtitle="Detailed metrics across all departments"
            isLoading={loading}
            isEmpty={catData.length === 0}
            minHeight="auto"
          >
            <DataTable
              columns={categoryTableColumns}
              data={catData}
              isLoading={false}
              emptyMessage="No category records available."
            />
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
