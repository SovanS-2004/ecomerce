import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  Crown, 
  Repeat, 
  Wallet, 
  Award,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { useFilters } from '../context/FilterContext';
import { 
  fetchCustomerSegments, 
  fetchTopCustomers, 
  fetchDashboardSummary 
} from '../services/api';
import KPICard, { formatCurrency, formatNumber } from '../components/KPICard';
import ChartCard from '../components/ChartCard';
import CustomerSegmentChart from '../charts/CustomerSegmentChart';
import DataTable, { SegmentBadge } from '../components/DataTable';

export default function CustomerAnalytics() {
  const { filters } = useFilters();
  const [loading, setLoading] = useState(true);
  const [segmentsData, setSegmentsData] = useState({ segments: [], new_vs_returning: {} });
  const [topCustomers, setTopCustomers] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadCustomers() {
      setLoading(true);
      try {
        const [seg, top, sum] = await Promise.all([
          fetchCustomerSegments(filters),
          fetchTopCustomers(filters, 25),
          fetchDashboardSummary(filters),
        ]);
        if (isMounted) {
          setSegmentsData(seg);
          setTopCustomers(top);
          setSummary(sum);
        }
      } catch (err) {
        console.error('Customer analytics error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadCustomers();
    return () => { isMounted = false; };
  }, [filters]);

  const customerColumns = [
    {
      key: 'customer_id',
      label: 'ID',
      render: (r) => <span className="font-mono text-slate-500 text-[11px]">{r.customer_id}</span>,
    },
    {
      key: 'customer_name',
      label: 'Customer',
      render: (r) => (
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {r.customer_name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-slate-900">{r.customer_name}</div>
            <div className="text-[10px] text-slate-400">{r.gender}, {r.city}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'state',
      label: 'Location',
      render: (r) => <span>{r.city}, {r.state}</span>,
    },
    {
      key: 'orders',
      label: 'Orders',
      render: (r) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
          {r.orders} orders
        </span>
      ),
    },
    {
      key: 'total_spending',
      label: 'Total Spending',
      render: (r) => (
        <span className="font-bold text-slate-900">{formatCurrency(r.total_spending)}</span>
      ),
    },
    {
      key: 'avg_order_value',
      label: 'Avg Order Value',
      render: (r) => (
        <span className="text-slate-600 font-medium">{formatCurrency(r.avg_order_value)}</span>
      ),
    },
    {
      key: 'segment',
      label: 'RFM Segment',
      render: (r) => <SegmentBadge segment={r.segment} />,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Customer Behavior & RFM Segmentation</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Segment analysis based on Recency, Frequency, and Monetary value to optimize retention and lifetime value.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Customers"
          formattedValue={formatNumber(summary?.total_customers)}
          icon={Users}
          color="indigo"
          subtitle="Distinct registered buyers"
          isLoading={loading}
        />
        <KPICard
          title="Avg Customer Spend"
          formattedValue={formatCurrency(summary?.avg_customer_spending)}
          icon={Wallet}
          color="emerald"
          subtitle="Average lifetime customer spend"
          isLoading={loading}
        />
        <KPICard
          title="Repeat Buyer Rate"
          formattedValue={`${segmentsData.new_vs_returning?.returning_pct || 0}%`}
          icon={Repeat}
          color="violet"
          subtitle={`${formatNumber(segmentsData.new_vs_returning?.returning_customers || 0)} returning clients`}
          isLoading={loading}
        />
        <KPICard
          title="Avg Order Value"
          formattedValue={formatCurrency(summary?.avg_order_value)}
          icon={Award}
          color="amber"
          subtitle="Revenue per transaction"
          isLoading={loading}
        />
      </div>

      {/* RFM Explanation Banner */}
      <div className="bg-gradient-to-r from-indigo-50 via-slate-50 to-indigo-50 border border-indigo-100 rounded-2xl p-5">
        <div className="flex items-start space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-xs space-y-1">
            <h4 className="font-bold text-slate-900 text-sm">RFM Segmentation Framework</h4>
            <p className="text-slate-600 leading-relaxed">
              Customers are dynamically classified into tiers:
              <span className="font-semibold text-indigo-700 ml-1">High Value</span> (top 30% monetary spend or 6+ orders), 
              <span className="font-semibold text-blue-700 ml-1">Regular</span> (consistent repeat transactions), and 
              <span className="font-semibold text-slate-700 ml-1">Low Value</span> (single entry-level transactions).
            </p>
          </div>
        </div>
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ChartCard
            title="Segment Share"
            subtitle="Customer count by RFM classification"
            isLoading={loading}
            isEmpty={segmentsData.segments.length === 0}
          >
            <CustomerSegmentChart data={segmentsData.segments} />
          </ChartCard>
        </div>

        <div className="lg:col-span-2">
          <ChartCard
            title="Segment Metrics Overview"
            subtitle="Financial metrics per customer tier"
            isLoading={loading}
            isEmpty={segmentsData.segments.length === 0}
            minHeight="auto"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {segmentsData.segments.map((seg) => (
                <div 
                  key={seg.segment} 
                  className={`p-4 rounded-xl border flex flex-col justify-between ${
                    seg.segment === 'High Value'
                      ? 'bg-indigo-50/50 border-indigo-200'
                      : seg.segment === 'Regular'
                      ? 'bg-blue-50/50 border-blue-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{seg.segment}</span>
                      <SegmentBadge segment={seg.segment} />
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900 mt-3">
                      {formatNumber(seg.customer_count)}
                      <span className="text-xs font-normal text-slate-500 ml-1">customers</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Total Revenue:</span>
                      <strong className="text-slate-800">{formatCurrency(seg.total_sales)}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Avg Spending:</span>
                      <strong className="text-slate-800">{formatCurrency(seg.avg_spending)}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Revenue Share:</span>
                      <strong className="text-indigo-600">{seg.share_pct}%</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Top Customers Leaderboard */}
      <ChartCard
        title="Top 25 Customers Leaderboard"
        subtitle="Ranked by cumulative purchase value"
        isLoading={loading}
        isEmpty={topCustomers.length === 0}
        minHeight="auto"
      >
        <DataTable
          columns={customerColumns}
          data={topCustomers}
          isLoading={false}
          emptyMessage="No customer records match the criteria."
        />
      </ChartCard>
    </div>
  );
}
