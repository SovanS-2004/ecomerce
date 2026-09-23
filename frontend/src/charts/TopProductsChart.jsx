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
      <div className="bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl border border-slate-800 space-y-1.5 max-w-xs">
        <p className="font-semibold text-slate-200 pb-1 border-b border-slate-800">{data.product}</p>
        <div className="flex items-center justify-between space-x-4">
          <span className="text-slate-400">Category:</span>
          <span className="font-medium text-slate-300">{data.category}</span>
        </div>
        <div className="flex items-center justify-between space-x-4">
          <span className="text-slate-400">Total Revenue:</span>
          <span className="font-bold text-white">{formatCurrency(data.total_revenue)}</span>
        </div>
        <div className="flex items-center justify-between space-x-4">
          <span className="text-slate-400">Units Sold:</span>
          <span className="font-bold text-indigo-300">{formatNumber(data.units_sold)}</span>
        </div>
        <div className="flex items-center justify-between space-x-4">
          <span className="text-slate-400">Net Profit:</span>
          <span className="font-bold text-emerald-400">{formatCurrency(data.total_profit)}</span>
        </div>
        <div className="flex items-center justify-between space-x-4">
          <span className="text-slate-400">Profit Margin:</span>
          <span className="font-semibold text-slate-300">{data.margin_pct}%</span>
        </div>
      </div>
    );
  }
  return null;
}

export default function TopProductsChart({ data, metric = 'total_revenue' }) {
  // Truncate long product names for YAxis
  const formattedData = [...data].slice(0, 10).map((d) => ({
    ...d,
    shortName: d.product.length > 18 ? d.product.substring(0, 18) + '...' : d.product
  })).reverse();

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={formattedData}
          margin={{ top: 10, right: 30, left: 15, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
          <XAxis 
            type="number"
            tick={{ fontSize: 10, fill: '#64748b' }} 
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
            tickFormatter={(val) => metric === 'total_revenue' ? `₹${(val / 1000).toFixed(0)}k` : val}
          />
          <YAxis 
            type="category" 
            dataKey="shortName" 
            tick={{ fontSize: 11, fill: '#334155' }} 
            tickLine={false}
            axisLine={false}
            width={120}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey={metric} 
            fill="#6366f1" 
            radius={[0, 6, 6, 0]} 
          >
            {formattedData.map((entry, index) => (
              <Cell 
                key={`prod-cell-${index}`}
                fill={index >= formattedData.length - 3 ? '#4f46e5' : '#818cf8'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
