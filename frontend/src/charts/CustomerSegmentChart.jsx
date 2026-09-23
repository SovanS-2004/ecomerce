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

const SEGMENT_COLORS = {
  'High Value': '#4f46e5', // indigo
  'Regular': '#06b6d4',    // cyan
  'Low Value': '#94a3b8',   // slate
};

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl border border-slate-800 space-y-1.5">
        <p className="font-semibold text-slate-200 pb-1 border-b border-slate-800">{data.segment}</p>
        <div className="flex items-center justify-between space-x-4">
          <span className="text-slate-400">Customers:</span>
          <span className="font-bold text-white">{formatNumber(data.customer_count)}</span>
        </div>
        <div className="flex items-center justify-between space-x-4">
          <span className="text-slate-400">Revenue Contribution:</span>
          <span className="font-bold text-indigo-300">{formatCurrency(data.total_sales)}</span>
        </div>
        <div className="flex items-center justify-between space-x-4">
          <span className="text-slate-400">Average Spending:</span>
          <span className="font-semibold text-emerald-400">{formatCurrency(data.avg_spending)}</span>
        </div>
        <div className="flex items-center justify-between space-x-4">
          <span className="text-slate-400">Revenue Share:</span>
          <span className="font-semibold text-slate-200">{data.share_pct}%</span>
        </div>
      </div>
    );
  }
  return null;
}

export default function CustomerSegmentChart({ data, onSegmentClick, selectedSegment }) {
  return (
    <div className="w-full h-72 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            align="center" 
            iconType="circle"
            wrapperStyle={{ paddingTop: 10, fontSize: 12 }} 
          />
          <Pie
            data={data}
            dataKey="customer_count"
            nameKey="segment"
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            cursor="pointer"
            onClick={(entry) => {
              if (onSegmentClick) onSegmentClick(entry.segment);
            }}
          >
            {data.map((entry, index) => {
              const color = SEGMENT_COLORS[entry.segment] || '#6366f1';
              const isSelected = selectedSegment === entry.segment;
              return (
                <Cell 
                  key={`seg-cell-${index}`} 
                  fill={color} 
                  opacity={selectedSegment && selectedSegment !== 'All' ? (isSelected ? 1.0 : 0.35) : 0.9} 
                />
              );
            })}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
