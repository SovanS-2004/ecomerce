const BASE_URL = 'http://127.0.0.1:8000';

function buildQuery(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'All') {
      query.append(key, value);
    }
  });
  const qs = query.toString();
  return qs ? `?${qs}` : '';
}

export async function fetchFilterOptions() {
  const res = await fetch(`${BASE_URL}/api/filter-options`);
  if (!res.ok) throw new Error('Failed to fetch filter options');
  return res.json();
}

export async function fetchDashboardSummary(filters) {
  const res = await fetch(`${BASE_URL}/api/dashboard-summary${buildQuery(filters)}`);
  if (!res.ok) throw new Error('Failed to fetch dashboard summary');
  return res.json();
}

export async function fetchSalesTrend(filters, granularity = 'monthly') {
  const res = await fetch(`${BASE_URL}/api/sales-trend${buildQuery({ ...filters, granularity })}`);
  if (!res.ok) throw new Error('Failed to fetch sales trend');
  return res.json();
}

export async function fetchCategorySales(filters) {
  const res = await fetch(`${BASE_URL}/api/category-sales${buildQuery(filters)}`);
  if (!res.ok) throw new Error('Failed to fetch category sales');
  return res.json();
}

export async function fetchTopProducts(filters, limit = 10) {
  const res = await fetch(`${BASE_URL}/api/top-products${buildQuery({ ...filters, limit })}`);
  if (!res.ok) throw new Error('Failed to fetch top products');
  return res.json();
}

export async function fetchCustomerSegments(filters) {
  const res = await fetch(`${BASE_URL}/api/customer-segments${buildQuery(filters)}`);
  if (!res.ok) throw new Error('Failed to fetch customer segments');
  return res.json();
}

export async function fetchTopCustomers(filters, limit = 10) {
  const res = await fetch(`${BASE_URL}/api/top-customers${buildQuery({ ...filters, limit })}`);
  if (!res.ok) throw new Error('Failed to fetch top customers');
  return res.json();
}

export async function fetchLocationSales(filters) {
  const res = await fetch(`${BASE_URL}/api/location-sales${buildQuery(filters)}`);
  if (!res.ok) throw new Error('Failed to fetch location sales');
  return res.json();
}

export async function fetchPaymentAnalysis(filters) {
  const res = await fetch(`${BASE_URL}/api/payment-analysis${buildQuery(filters)}`);
  if (!res.ok) throw new Error('Failed to fetch payment analysis');
  return res.json();
}

export async function fetchOrderStatus(filters) {
  const res = await fetch(`${BASE_URL}/api/order-status${buildQuery(filters)}`);
  if (!res.ok) throw new Error('Failed to fetch order status');
  return res.json();
}

export async function fetchOrders(params) {
  const res = await fetch(`${BASE_URL}/api/orders${buildQuery(params)}`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

export function getExportCsvUrl() {
  return `${BASE_URL}/api/export-csv`;
}

export async function reseedDatabase() {
  const res = await fetch(`${BASE_URL}/api/reseed`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to reseed database');
  return res.json();
}
