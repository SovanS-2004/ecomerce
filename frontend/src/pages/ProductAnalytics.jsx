import React, { useState, useEffect } from 'react';
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  Layers, 
  Flame 
} from 'lucide-react';
import { useFilters } from '../context/FilterContext';
import { fetchTopProducts, fetchCategorySales } from '../services/api';
import KPICard, { formatCurrency, formatNumber } from '../components/KPICard';
import ChartCard from '../components/ChartCard';
import TopProductsChart from '../charts/TopProductsChart';
import CategorySalesChart from '../charts/CategorySalesChart';
import DataTable from '../components/DataTable';

export default function ProductAnalytics() {
  const { filters } = useFilters();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState({
    by_revenue: [],
    by_volume: [],
    by_profit: [],
    low_performing: [],
  });
  const [categoryData, setCategoryData] = useState([]);
  const [activeMetric, setActiveMetric] = useState('revenue'); // 'revenue' | 'volume' | 'profit'

  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      setLoading(true);
      try {
        const [prod, cats] = await Promise.all([
          fetchTopProducts(filters, 15),
          fetchCategorySales(filters),
        ]);
        if (isMounted) {
          setProductData(prod);
          setCategoryData(cats);
        }
      } catch (err) {
        console.error('Product analytics error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadProducts();
    return () => { isMounted = false; };
  }, [filters]);

  const productTableColumns = [
    {
      key: 'product',
      label: 'Product Name',
      render: (r) => (
        <div>
          <div className="font-bold text-slate-900">{r.product}</div>
          <div className="text-[10px] text-slate-400">{r.category}</div>
        </div>
      ),
    },
    {
      key: 'avg_price',
      label: 'Unit Price',
      render: (r) => <span>{formatCurrency(r.avg_price)}</span>,
    },
    {
      key: 'units_sold',
      label: 'Units Sold',
      render: (r) => <span className="font-semibold text-slate-800">{formatNumber(r.units_sold)}</span>,
    },
    {
      key: 'total_revenue',
      label: 'Total Revenue',
      render: (r) => <span className="font-bold text-slate-900">{formatCurrency(r.total_revenue)}</span>,
    },
    {
      key: 'total_profit',
      label: 'Net Profit',
      render: (r) => <span className="font-semibold text-emerald-600">{formatCurrency(r.total_profit)}</span>,
    },
    {
      key: 'margin_pct',
      label: 'Profit Margin',
      render: (r) => (
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {r.margin_pct}%
        </span>
      ),
    },
  ];

  const currentProductList = 
    activeMetric === 'revenue' 
      ? productData.by_revenue 
      : activeMetric === 'volume' 
      ? productData.by_volume 
      : productData.by_profit;

  const topProduct = productData.by_revenue[0];
  const mostVolume = productData.by_volume[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Product Portfolio & Inventory Analytics</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Evaluate best sellers, revenue drivers, profit margins, and underperforming catalog items.
          </p>
        </div>

        {/* Metric Selector */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveMetric('revenue')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeMetric === 'revenue'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            By Revenue
          </button>
          <button
            onClick={() => setActiveMetric('volume')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeMetric === 'volume'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            By Units Sold
          </button>
          <button
            onClick={() => setActiveMetric('profit')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeMetric === 'profit'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            By Net Profit
          </button>
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-indigo-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Top Revenue Driver</span>
            <Flame className="w-4 h-4" />
          </div>
          <div className="text-lg font-bold text-slate-900 truncate">
            {topProduct?.product || 'N/A'}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Category: {topProduct?.category}</span>
            <strong className="text-slate-900 font-bold">{formatCurrency(topProduct?.total_revenue)}</strong>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Most Units Sold</span>
            <Layers className="w-4 h-4" />
          </div>
          <div className="text-lg font-bold text-slate-900 truncate">
            {mostVolume?.product || 'N/A'}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Volume: {formatNumber(mostVolume?.units_sold)} units</span>
            <strong className="text-emerald-700 font-bold">{formatCurrency(mostVolume?.total_revenue)}</strong>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Catalog Size</span>
            <Package className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {productData.by_revenue.length}
            <span className="text-xs font-normal text-slate-500 ml-1.5">products evaluated</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Spanning {categoryData.length} active retail categories
          </div>
        </div>
      </div>

      {/* Main Ranking Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title={`Top 10 Products (${activeMetric === 'revenue' ? 'Revenue' : activeMetric === 'volume' ? 'Units' : 'Profit'})`}
          subtitle="Ranked performance in selected perspective"
          isLoading={loading}
          isEmpty={currentProductList.length === 0}
        >
          <TopProductsChart
            data={currentProductList}
            metric={activeMetric === 'revenue' ? 'total_revenue' : activeMetric === 'volume' ? 'units_sold' : 'total_profit'}
          />
        </ChartCard>

        <ChartCard
          title="Category Distribution"
          subtitle="Department volume & margin contribution"
          isLoading={loading}
          isEmpty={categoryData.length === 0}
        >
          <CategorySalesChart data={categoryData} />
        </ChartCard>
      </div>

      {/* Complete Product Performance Table */}
      <ChartCard
        title="Complete Product Performance Roster"
        subtitle="Full metrics including pricing, units, revenue, profit, and margins"
        isLoading={loading}
        isEmpty={productData.by_revenue.length === 0}
        minHeight="auto"
      >
        <DataTable
          columns={productTableColumns}
          data={productData.by_revenue}
          isLoading={false}
          emptyMessage="No product records match the filters."
        />
      </ChartCard>

      {/* Low-Performing Products Section */}
      <ChartCard
        title="Low-Performing Catalog Items"
        subtitle="Bottom products by gross revenue (potential clearance or restock re-evaluation)"
        action={
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3 h-3 mr-1" /> Needs Attention
          </span>
        }
        isLoading={loading}
        isEmpty={productData.low_performing.length === 0}
        minHeight="auto"
      >
        <DataTable
          columns={productTableColumns}
          data={productData.low_performing.slice(0, 5)}
          isLoading={false}
          emptyMessage="No low-performing records found."
        />
      </ChartCard>
    </div>
  );
}
