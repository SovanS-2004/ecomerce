import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';
import { formatCurrency, formatNumber } from '../components/KPICard';

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl border border-slate-800 space-y-1.5">
        <p className="font-semibold text-slate-200 pb-1 border-b border-slate-800">{data.location}</p>
        <div className="flex items-center justify-between space-x-4">
          <span className="text-slate-400">Total Sales:</span>
          <span className="font-bold text-white">{formatCurrency(data.sales)}</span>
        </div>
        <div className="flex items-center justify-between space-x-4">
          <span className="text-slate-400">Total Profit:</span>
          <span className="font-bold text-emerald-400">{formatCurrency(data.profit)}</span>
        </div>
        <div className="flex items-center justify-between space-x-4">
          <span className="text-slate-400">Orders:</span>
          <span className="font-semibold text-indigo-300">{formatNumber(data.orders)}</span>
        </div>
        <div className="flex items-center justify-between space-x-4">
          <span className="text-slate-400">Share of Sales:</span>
          <span className="font-semibold text-slate-200">{data.share_pct}%</span>
        </div>
        <p className="text-[10px] text-indigo-200 pt-1 italic">Click bar to filter by this state</p>
      </div>
    );
  }
  return null;
}

export default function StateSalesChart({ data, onStateClick, selectedState }) {
  const displayData = data.slice(0, 10);

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={displayData}
          margin={{ top: 10, right: 10, left: 0, bottom: 25 }}
          onClick={(state) => {
            if (state && state.activePayload && state.activePayload.length && onStateClick) {
              const loc = state.activePayload[0].payload.location;
              onStateClick(loc);
            }
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis 
            dataKey="location" 
            tick={{ fontSize: 10, fill: '#64748b' }} 
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
            interval={0}
            angle={-20}
            textAnchor="end"
          />
          <YAxis 
            tick={{ fontSize: 11, fill: '#64748b' }} 
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="sales" 
            name="State Sales" 
            radius={[6, 6, 0, 0]} 
            cursor="pointer"
          >
            {displayData.map((entry, index) => {
              const isSelected = selectedState === entry.location;
              return (
                <Cell 
                  key={`state-cell-${index}`} 
                  fill="#0ea5e9"
                  opacity={selectedState && selectedState !== 'All' ? (isSelected ? 1.0 : 0.35) : 0.85} 
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
