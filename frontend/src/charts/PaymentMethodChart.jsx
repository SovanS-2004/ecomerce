import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';
import { formatCurrency, formatNumber } from '../components/KPICard';

const PAYMENT_COLORS = {
  'UPI': '#10b981',             // emerald
  'Credit Card': '#6366f1',     // indigo
  'Debit Card': '#0ea5e9',      // sky
  'Cash on Delivery': '#f59e0b',// amber
  'Net Banking': '#8b5cf6',     // violet
};

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl border border-slate-800 space-y-1.5">
        <p className="font-semibold text-slate-200 pb-1 border-b border-slate-800">{data.method}</p>
        <div className="flex items-center justify-between space-x-4">
          <span className="text-slate-400">Order Count:</span>
          <span className="font-bold text-white">{formatNumber(data.count)}</span>
        </div>
        <div className="flex items-center justify-between space-x-4">
          <span className="text-slate-400">Total Volume:</span>
          <span className="font-bold text-emerald-400">{formatCurrency(data.sales)}</span>
        </div>
        <div className="flex items-center justify-between space-x-4">
          <span className="text-slate-400">Share of Orders:</span>
          <span className="font-semibold text-indigo-300">{data.percentage}%</span>
        </div>
      </div>
    );
  }
  return null;
}

export default function PaymentMethodChart({ data, onPaymentClick, selectedMethod }) {
  return (
    <div className="w-full h-72 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            align="center" 
            iconType="circle"
            wrapperStyle={{ paddingTop: 10, fontSize: 11 }} 
          />
          <Pie
            data={data}
            dataKey="count"
            nameKey="method"
            cx="50%"
            cy="45%"
            innerRadius={55}
            outerRadius={88}
            paddingAngle={2}
            cursor="pointer"
            onClick={(entry) => {
              if (onPaymentClick) onPaymentClick(entry.method);
            }}
          >
            {data.map((entry, index) => {
              const color = PAYMENT_COLORS[entry.method] || '#64748b';
              const isSelected = selectedMethod === entry.method;
              return (
                <Cell 
                  key={`pay-cell-${index}`} 
                  fill={color} 
                  opacity={selectedMethod && selectedMethod !== 'All' ? (isSelected ? 1.0 : 0.35) : 0.9} 
                />
              );
            })}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
