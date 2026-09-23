import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  Calendar, 
  Tag, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  UserCheck,
  ChevronDown
} from 'lucide-react';
import { useFilters } from '../context/FilterContext';

export default function FilterBar({ isOpen }) {
  const { 
    filters, 
    options, 
    loadingOptions, 
    setFilter, 
    resetFilters, 
    setDatePreset,
    activeCount 
  } = useFilters();

  if (!isOpen) return null;

  return (
    <div className="bg-white border-b border-slate-200 shadow-2xs px-4 sm:px-6 lg:px-8 py-4 transition-all">
      <div className="max-w-7xl mx-auto">
        {/* Header row inside filter bar */}
        <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-slate-100 gap-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-800">
            <Filter className="w-4 h-4 text-indigo-600" />
            <span>Interactive Data Slicers</span>
            {activeCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {activeCount} active {activeCount === 1 ? 'filter' : 'filters'}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Quick Date Presets */}
            <div className="hidden sm:flex items-center space-x-1 text-xs">
              <span className="text-slate-400 text-[11px] mr-1">Period:</span>
              {['all', '30d', '90d', '6m', '1y'].map((p) => (
                <button
                  key={p}
                  onClick={() => setDatePreset(p)}
                  className="px-2 py-1 rounded-md text-[11px] font-medium text-slate-600 hover:bg-slate-100 uppercase transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Reset Button */}
            <button
              onClick={resetFilters}
              disabled={activeCount === 0}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 text-xs">
          {/* Start Date */}
          <div className="flex flex-col space-y-1">
            <label className="text-[11px] font-medium text-slate-500 flex items-center space-x-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>Start Date</span>
            </label>
            <input
              type="date"
              value={filters.start_date}
              min={options.min_date}
              max={filters.end_date || options.max_date}
              onChange={(e) => setFilter('start_date', e.target.value)}
              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col space-y-1">
            <label className="text-[11px] font-medium text-slate-500 flex items-center space-x-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>End Date</span>
            </label>
            <input
              type="date"
              value={filters.end_date}
              min={filters.start_date || options.min_date}
              max={options.max_date}
              onChange={(e) => setFilter('end_date', e.target.value)}
              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col space-y-1">
            <label className="text-[11px] font-medium text-slate-500 flex items-center space-x-1">
              <Tag className="w-3 h-3 text-slate-400" />
              <span>Category</span>
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilter('category', e.target.value)}
              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
            >
              <option value="All">All Categories</option>
              {options.categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* State */}
          <div className="flex flex-col space-y-1">
            <label className="text-[11px] font-medium text-slate-500 flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>State</span>
            </label>
            <select
              value={filters.state}
              onChange={(e) => setFilter('state', e.target.value)}
              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
            >
              <option value="All">All States</option>
              {options.states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* City */}
          <div className="flex flex-col space-y-1">
            <label className="text-[11px] font-medium text-slate-500 flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>City</span>
            </label>
            <select
              value={filters.city}
              onChange={(e) => setFilter('city', e.target.value)}
              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
            >
              <option value="All">All Cities</option>
              {options.cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Payment Method */}
          <div className="flex flex-col space-y-1">
            <label className="text-[11px] font-medium text-slate-500 flex items-center space-x-1">
              <CreditCard className="w-3 h-3 text-slate-400" />
              <span>Payment</span>
            </label>
            <select
              value={filters.payment_method}
              onChange={(e) => setFilter('payment_method', e.target.value)}
              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
            >
              <option value="All">All Methods</option>
              {options.payment_methods.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Order Status */}
          <div className="flex flex-col space-y-1">
            <label className="text-[11px] font-medium text-slate-500 flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-slate-400" />
              <span>Status</span>
            </label>
            <select
              value={filters.order_status}
              onChange={(e) => setFilter('order_status', e.target.value)}
              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
            >
              <option value="All">All Statuses</option>
              {options.order_statuses.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Customer Segment */}
          <div className="flex flex-col space-y-1">
            <label className="text-[11px] font-medium text-slate-500 flex items-center space-x-1">
              <UserCheck className="w-3 h-3 text-slate-400" />
              <span>Segment</span>
            </label>
            <select
              value={filters.customer_segment}
              onChange={(e) => setFilter('customer_segment', e.target.value)}
              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
            >
              <option value="All">All Segments</option>
              {options.customer_segments.map((seg) => (
                <option key={seg} value={seg}>{seg}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
