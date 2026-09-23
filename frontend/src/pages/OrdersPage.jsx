import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Download, 
  Search, 
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';
import { useFilters } from '../context/FilterContext';
import { fetchOrders, getExportCsvUrl } from '../services/api';
import DataTable, { StatusBadge } from '../components/DataTable';
import { formatCurrency } from '../components/KPICard';

export default function OrdersPage() {
  const { filters, activeCount, resetFilters } = useFilters();
  const [loading, setLoading] = useState(true);
  const [ordersData, setOrdersData] = useState({
    items: [],
    total: 0,
    page: 1,
    page_size: 20,
    total_pages: 1,
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState('Order_Date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [search, setSearch] = useState('');

  // Reset to page 1 whenever filters or search change
  useEffect(() => {
    setPage(1);
  }, [filters, search]);

  useEffect(() => {
    let isMounted = true;
    async function loadOrders() {
      setLoading(true);
      try {
        const res = await fetchOrders({
          ...filters,
          page,
          page_size: pageSize,
          sort_by: sortBy,
          sort_order: sortOrder,
          search: search || undefined,
        });
        if (isMounted) {
          setOrdersData(res);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadOrders();
    return () => { isMounted = false; };
  }, [filters, page, pageSize, sortBy, sortOrder, search]);

  const handleSort = (columnKey) => {
    if (sortBy === columnKey) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(columnKey);
      setSortOrder('desc');
    }
  };

  const columns = [
    {
      key: 'Order_ID',
      label: 'Order ID',
      sortable: true,
      render: (r) => <span className="font-mono font-bold text-indigo-600">{r.Order_ID}</span>,
    },
    {
      key: 'Order_Date',
      label: 'Date',
      sortable: true,
      render: (r) => <span className="text-slate-600">{r.Order_Date}</span>,
    },
    {
      key: 'Customer_Name',
      label: 'Customer',
      sortable: true,
      render: (r) => (
        <div>
          <div className="font-semibold text-slate-900">{r.Customer_Name}</div>
          <div className="text-[10px] text-slate-400">{r.Gender}, {r.Age} yrs</div>
        </div>
      ),
    },
    {
      key: 'Product',
      label: 'Product',
      sortable: true,
      render: (r) => (
        <div className="max-w-xs">
          <div className="font-medium text-slate-900 truncate" title={r.Product}>{r.Product}</div>
          <div className="text-[10px] text-slate-400">{r.Category} &middot; Qty: {r.Quantity}</div>
        </div>
      ),
    },
    {
      key: 'City',
      label: 'Location',
      sortable: true,
      render: (r) => (
        <div>
          <div className="font-medium text-slate-800">{r.City}</div>
          <div className="text-[10px] text-slate-400">{r.State}</div>
        </div>
      ),
    },
    {
      key: 'Sales',
      label: 'Sales',
      sortable: true,
      render: (r) => (
        <div>
          <div className="font-bold text-slate-900">{formatCurrency(r.Sales)}</div>
          {r.Discount > 0 && (
            <div className="text-[10px] text-amber-600 font-medium">-{r.Discount}% off</div>
          )}
        </div>
      ),
    },
    {
      key: 'Profit',
      label: 'Profit',
      sortable: true,
      render: (r) => (
        <span className={`font-semibold ${r.Profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
          {formatCurrency(r.Profit)}
        </span>
      ),
    },
    {
      key: 'Payment_Method',
      label: 'Payment',
      sortable: true,
      render: (r) => <span className="text-slate-700 font-medium">{r.Payment_Method}</span>,
    },
    {
      key: 'Order_Status',
      label: 'Status',
      sortable: true,
      render: (r) => <StatusBadge status={r.Order_Status} />,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Orders Explorer & Transaction Ledger</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Browse, sort, filter, and inspect detailed transactions across the entire retail database.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <a
            href={getExportCsvUrl()}
            download="orders_export.csv"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <DataTable
          columns={columns}
          data={ordersData.items}
          total={ordersData.total}
          page={page}
          pageSize={pageSize}
          totalPages={ordersData.total_pages}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          searchQuery={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by ID, customer name, product, city, or status..."
          isLoading={loading}
          emptyMessage="No orders found matching your search and filter criteria."
        />
      </div>
    </div>
  );
}
