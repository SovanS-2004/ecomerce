import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function ChartCard({
  title,
  subtitle,
  children,
  action,
  isLoading = false,
  isEmpty = false,
  emptyMessage = 'No records match the selected filters.',
  className = '',
  minHeight = 'h-72'
}) {
  return (
    <div className={`bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div className="flex items-center space-x-2 shrink-0">{action}</div>}
      </div>

      {/* Body */}
      <div className={`pt-4 flex-1 flex flex-col justify-center ${minHeight}`}>
        {isLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-3 py-10">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-400 font-medium">Computing analytics...</p>
          </div>
        ) : isEmpty ? (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-2 py-10 text-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-slate-700">{emptyMessage}</p>
            <p className="text-[11px] text-slate-400 max-w-xs">
              Try adjusting or clearing some filters to expand your search query.
            </p>
          </div>
        ) : (
          <div className="w-full h-full">{children}</div>
        )}
      </div>
    </div>
  );
}
