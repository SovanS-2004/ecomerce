import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Layers 
} from 'lucide-react';
import { useFilters } from '../context/FilterContext';
import { fetchLocationSales, fetchDashboardSummary } from '../services/api';
import KPICard, { formatCurrency, formatNumber } from '../components/KPICard';
import ChartCard from '../components/ChartCard';
import StateSalesChart from '../charts/StateSalesChart';
import DataTable from '../components/DataTable';

export default function LocationAnalytics() {
  const { filters, setFilter } = useFilters();
  const [loading, setLoading] = useState(true);
  const [locationData, setLocationData] = useState({ states: [], top_cities: [] });
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadLocations() {
      setLoading(true);
      try {
        const [loc, sum] = await Promise.all([
          fetchLocationSales(filters),
          fetchDashboardSummary(filters),
        ]);
        if (isMounted) {
          setLocationData(loc);
          setSummary(sum);
        }
      } catch (err) {
        console.error('Location analytics error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadLocations();
    return () => { isMounted = false; };
  }, [filters]);

  const stateColumns = [
    {
      key: 'location',
      label: 'State',
      render: (r) => (
        <span 
          onClick={() => setFilter('state', r.location === filters.state ? 'All' : r.location)}
          className="font-bold text-indigo-600 hover:underline cursor-pointer"
        >
          {r.location}
        </span>
      ),
    },
    {
      key: 'orders',
      label: 'Orders',
      render: (r) => <span>{formatNumber(r.orders)}</span>,
    },
    {
      key: 'sales',
      label: 'Total Sales',
      render: (r) => <span className="font-bold text-slate-900">{formatCurrency(r.sales)}</span>,
    },
    {
      key: 'profit',
      label: 'Net Profit',
      render: (r) => <span className="font-semibold text-emerald-600">{formatCurrency(r.profit)}</span>,
    },
    {
      key: 'share_pct',
      label: 'Share %',
      render: (r) => (
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-sky-500 h-full rounded-full" style={{ width: `${r.share_pct}%` }} />
          </div>
          <span className="font-medium text-slate-600">{r.share_pct}%</span>
        </div>
      ),
    },
  ];

  const cityColumns = [
    {
      key: 'location',
      label: 'City',
      render: (r) => (
        <div>
          <div className="font-bold text-slate-900">{r.location}</div>
          <div className="text-[10px] text-slate-400">{r.state}</div>
        </div>
      ),
    },
    {
      key: 'orders',
      label: 'Orders',
      render: (r) => <span>{formatNumber(r.orders)}</span>,
    },
    {
      key: 'sales',
      label: 'Sales Revenue',
      render: (r) => <span className="font-bold text-slate-900">{formatCurrency(r.sales)}</span>,
    },
    {
      key: 'profit',
      label: 'Profit',
      render: (r) => <span className="font-semibold text-emerald-600">{formatCurrency(r.profit)}</span>,
    },
    {
      key: 'share_pct',
      label: 'Revenue Share',
      render: (r) => <span className="font-semibold text-indigo-600">{r.share_pct}%</span>,
    },
  ];

  const topState = locationData.states[0];
  const topCity = locationData.top_cities[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Geographic & Regional Performance</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track order penetration, regional sales volumes, and market share across states and cities.
          </p>
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Active States Covered"
          formattedValue={`${locationData.states.length} States`}
          icon={MapPin}
          color="indigo"
          subtitle="Nationwide retail footprint"
          isLoading={loading}
        />
        <KPICard
          title="Top Performing State"
          formattedValue={topState?.location || 'N/A'}
          icon={TrendingUp}
          color="emerald"
          subtitle={`${formatCurrency(topState?.sales)} revenue (${topState?.share_pct || 0}% share)`}
          isLoading={loading}
        />
        <KPICard
          title="Top Metro City"
          formattedValue={topCity?.location || 'N/A'}
          icon={Building2}
          color="sky"
          subtitle={`${formatCurrency(topCity?.sales)} revenue`}
          isLoading={loading}
        />
        <KPICard
          title="Total Order Footprint"
          formattedValue={formatNumber(summary?.total_orders)}
          icon={Layers}
          color="violet"
          subtitle={`${formatCurrency(summary?.total_sales)} across all regions`}
          isLoading={loading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="State-wise Sales Revenue"
          subtitle="Volume rankings by state (click bar to filter)"
          isLoading={loading}
          isEmpty={locationData.states.length === 0}
        >
          <StateSalesChart
            data={locationData.states}
            selectedState={filters.state}
            onStateClick={(st) => setFilter('state', st === filters.state ? 'All' : st)}
          />
        </ChartCard>

        <ChartCard
          title="Top 10 Cities by Revenue"
          subtitle="Metropolitan order density and sales concentration"
          isLoading={loading}
          isEmpty={locationData.top_cities.length === 0}
          minHeight="auto"
        >
          <DataTable
            columns={cityColumns}
            data={locationData.top_cities}
            isLoading={false}
            emptyMessage="No city records available."
          />
        </ChartCard>
      </div>

      {/* Complete State Roster */}
      <ChartCard
        title="State Performance Directory"
        subtitle="Complete regional financial breakdown"
        isLoading={loading}
        isEmpty={locationData.states.length === 0}
        minHeight="auto"
      >
        <DataTable
          columns={stateColumns}
          data={locationData.states}
          isLoading={false}
          emptyMessage="No state records available."
        />
      </ChartCard>
    </div>
  );
}
