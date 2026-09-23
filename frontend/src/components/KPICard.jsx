import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
}

const COLOR_MAP = {
  indigo: {
    bg: 'bg-indigo-50',
    iconBg: 'bg-indigo-600 text-white',
    border: 'border-indigo-100',
    accentText: 'text-indigo-600',
  },
  emerald: {
    bg: 'bg-emerald-50',
    iconBg: 'bg-emerald-600 text-white',
    border: 'border-emerald-100',
    accentText: 'text-emerald-600',
  },
  violet: {
    bg: 'bg-violet-50',
    iconBg: 'bg-violet-600 text-white',
    border: 'border-violet-100',
    accentText: 'text-violet-600',
  },
  amber: {
    bg: 'bg-amber-50',
    iconBg: 'bg-amber-500 text-white',
    border: 'border-amber-100',
    accentText: 'text-amber-600',
  },
  sky: {
    bg: 'bg-sky-50',
    iconBg: 'bg-sky-600 text-white',
    border: 'border-sky-100',
    accentText: 'text-sky-600',
  },
  rose: {
    bg: 'bg-rose-50',
    iconBg: 'bg-rose-600 text-white',
    border: 'border-rose-100',
    accentText: 'text-rose-600',
  },
};

export default function KPICard({
  title,
  value,
  formattedValue,
  icon: Icon,
  color = 'indigo',
  subtitle,
  trend,
  trendLabel = 'vs last period',
  isLoading = false
}) {
  const styles = COLOR_MAP[color] || COLOR_MAP.indigo;

  return (
    <div className={`bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <div className="mt-2 flex items-baseline">
            {isLoading ? (
              <div className="h-8 w-28 bg-slate-200 animate-pulse rounded"></div>
            ) : (
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {formattedValue !== undefined ? formattedValue : value}
              </h3>
            )}
          </div>
        </div>

        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs ${styles.iconBg}`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>

      {/* Footer / Trend Indicator */}
      {(subtitle || trend !== undefined) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {trend !== undefined ? (
            <div className="flex items-center space-x-1.5">
              <span
                className={`inline-flex items-center px-1.5 py-0.5 rounded font-semibold text-[11px] ${
                  trend > 0
                    ? 'bg-emerald-50 text-emerald-700'
                    : trend < 0
                    ? 'bg-rose-50 text-rose-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {trend > 0 ? (
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                ) : trend < 0 ? (
                  <ArrowDownRight className="w-3 h-3 mr-0.5" />
                ) : (
                  <Minus className="w-3 h-3 mr-0.5" />
                )}
                {trend > 0 ? `+${trend}%` : `${trend}%`}
              </span>
              <span className="text-slate-400 text-[11px]">{trendLabel}</span>
            </div>
          ) : (
            <span className="text-slate-500 text-[11px]">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
}
