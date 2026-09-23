import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { formatCurrency } from '../components/KPICard';

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl border border-slate-800 space-y-1.5">
        <p className="font-semibold text-slate-200 pb-1 border-b border-slate-800">{label}</p>
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center justify-between space-x-4">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
              <span className="text-slate-300">{entry.name}:</span>
            </span>
            <span className="font-bold text-white">{formatCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function SalesProfitComparisonChart({ data }) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 11, fill: '#64748b' }} 
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis 
            tick={{ fontSize: 11, fill: '#64748b' }} 
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top" 
            align="right" 
            iconType="circle"
            wrapperStyle={{ paddingBottom: 12, fontSize: 12 }} 
          />
          <Bar 
            dataKey="sales" 
            name="Gross Sales" 
            fill="#818cf8" 
            radius={[4, 4, 0, 0]} 
          />
          <Line 
            type="monotone" 
            dataKey="profit" 
            name="Net Profit" 
            stroke="#10b981" 
            strokeWidth={3} 
            dot={{ r: 3, fill: '#10b981' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
