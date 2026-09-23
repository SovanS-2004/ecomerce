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

const STATUS_COLORS = {
  'Delivered': '#10b981', // emerald
  'Pending': '#f59e0b',   // amber
  'Cancelled': '#ef4444', // rose
  'Returned': '#a855f7',  // purple
};

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl border border-slate-800 space-y-1.5">
        <p className="font-semibold text-slate-200 pb-1 border-b border-slate-800">{data.status}</p>
        <div className="flex items-center justify-between space-x-4">
          <span className="text-slate-400">Total Orders:</span>
          <span className="font-bold text-white">{formatNumber(data.count)}</span>
        </div>
        <div className="flex items-center justify-between space-x-4">
          <span className="text-slate-400">Order Volume:</span>
          <span className="font-bold text-slate-200">{formatCurrency(data.sales)}</span>
        </div>
        <div className="flex items-center justify-between space-x-4">
          <span className="text-slate-400">Order Share:</span>
          <span className="font-semibold text-indigo-300">{data.percentage}%</span>
        </div>
      </div>
    );
  }
  return null;
}

export default function OrderStatusChart({ data, onStatusClick, selectedStatus }) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 15 }}
          onClick={(state) => {
            if (state && state.activePayload && state.activePayload.length && onStatusClick) {
              const st = state.activePayload[0].payload.status;
              onStatusClick(st);
            }
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis 
            dataKey="status" 
            tick={{ fontSize: 11, fill: '#64748b' }} 
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis 
            tick={{ fontSize: 11, fill: '#64748b' }} 
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="count" 
            name="Order Count" 
            radius={[6, 6, 0, 0]} 
            cursor="pointer"
          >
            {data.map((entry, index) => {
              const color = STATUS_COLORS[entry.status] || '#6366f1';
              const isSelected = selectedStatus === entry.status;
              return (
                <Cell 
                  key={`status-cell-${index}`} 
                  fill={color} 
                  opacity={selectedStatus && selectedStatus !== 'All' ? (isSelected ? 1.0 : 0.35) : 0.9} 
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
