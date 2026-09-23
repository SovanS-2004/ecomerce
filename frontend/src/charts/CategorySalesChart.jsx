import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import { formatCurrency } from '../components/KPICard';

const CATEGORY_COLORS = [
  '#4f46e5', // indigo
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ec4899', // pink
  '#8b5cf6', // violet
];

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl border border-slate-800 space-y-1.5">
        <p className="font-semibold text-slate-300 pb-1 border-b border-slate-800">{data.category}</p>
        <div className="flex items-center justify-between space-x-4">
          <span className="text-slate-400">Total Sales:</span>
          <span className="font-bold text-white">{formatCurrency(data.sales)}</span>
        </div>
        <div className="flex items-center justify-between space-x-4">
          <span className="text-slate-400">Total Profit:</span>
          <span className="font-bold text-emerald-400">{formatCurrency(data.profit)}</span>
        </div>
        <div className="flex items-center justify-between space-x-4">
          <span className="text-slate-400">Share of Sales:</span>
          <span className="font-semibold text-indigo-300">{data.share_pct}%</span>
        </div>
        <div className="flex items-center justify-between space-x-4">
          <span className="text-slate-400">Profit Margin:</span>
          <span className="font-semibold text-slate-200">{data.margin_pct}%</span>
        </div>
        <p className="text-[10px] text-indigo-200 pt-1 italic">Click bar to filter by this category</p>
      </div>
    );
  }
  return null;
}

export default function CategorySalesChart({ data, onCategoryClick, selectedCategory }) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 25 }}
          onClick={(state) => {
            if (state && state.activePayload && state.activePayload.length && onCategoryClick) {
              const cat = state.activePayload[0].payload.category;
              onCategoryClick(cat);
            }
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis 
            dataKey="category" 
            tick={{ fontSize: 10, fill: '#64748b' }} 
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
            interval={0}
            angle={-15}
            textAnchor="end"
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
            name="Sales Revenue" 
            radius={[6, 6, 0, 0]} 
            cursor="pointer"
          >
            {data.map((entry, index) => {
              const isSelected = selectedCategory === entry.category;
              const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
              return (
                <Cell 
                  key={`cell-${index}`} 
                  fill={color} 
                  opacity={selectedCategory && selectedCategory !== 'All' ? (isSelected ? 1.0 : 0.35) : 0.9} 
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
