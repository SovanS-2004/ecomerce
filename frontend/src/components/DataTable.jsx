import React from 'react';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown 
} from 'lucide-react';
import { formatCurrency, formatNumber } from './KPICard';

export function StatusBadge({ status }) {
  const styles = {
    Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
    Returned: 'bg-purple-50 text-purple-700 border-purple-200',
  }[status] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${styles}`}>
      {status}
    </span>
  );
}

export function SegmentBadge({ segment }) {
  const styles = {
    'High Value': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Regular': 'bg-blue-50 text-blue-700 border-blue-200',
    'Low Value': 'bg-slate-100 text-slate-600 border-slate-200',
  }[segment] || 'bg-slate-100 text-slate-600 border-slate-200';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${styles}`}>
      {segment}
    </span>
  );
}

export default function DataTable({
  columns,
  data,
  total,
  page = 1,
  pageSize = 20,
  totalPages = 1,
  onPageChange,
  onPageSizeChange,
  sortBy,
  sortOrder,
  onSort,
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  isLoading = false,
  emptyMessage = 'No records found'
}) {
  return (
    <div className="w-full">
      {/* Search & Meta bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        {onSearchChange !== undefined && (
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
            />
          </div>
        )}

        <div className="flex items-center space-x-3 text-xs text-slate-500 self-end sm:self-auto">
          {total !== undefined && (
            <span>
              Total records: <strong className="text-slate-800">{formatNumber(total)}</strong>
            </span>
          )}
          {onPageSizeChange && (
            <div className="flex items-center space-x-1">
              <span>Show:</span>
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="bg-slate-50 border border-slate-200 rounded-md px-1.5 py-1 text-xs text-slate-800 focus:outline-hidden"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && onSort && onSort(col.key)}
                  className={`px-3.5 py-3 select-none ${col.sortable ? 'cursor-pointer hover:bg-slate-100/70 transition-colors' : ''} ${col.className || ''}`}
                >
                  <div className="flex items-center space-x-1">
                    <span>{col.label}</span>
                    {col.sortable && (
                      <span className="text-slate-400">
                        {sortBy === col.key ? (
                          sortOrder === 'asc' ? (
                            <ArrowUp className="w-3 h-3 text-indigo-600" />
                          ) : (
                            <ArrowDown className="w-3 h-3 text-indigo-600" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3 h-3 opacity-40 hover:opacity-100" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs">Loading table data...</span>
                  </div>
                </td>
              </tr>
            ) : data && data.length > 0 ? (
              data.map((row, idx) => (
                <tr key={row.id || row.Order_ID || row.customer_id || idx} className="hover:bg-slate-50/70 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className={`px-3.5 py-3 ${col.cellClassName || ''}`}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-slate-400 text-xs">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {onPageChange && totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 text-xs text-slate-500">
          <div>
            Page <strong className="text-slate-800">{page}</strong> of{' '}
            <strong className="text-slate-800">{totalPages}</strong>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1 || isLoading}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages || isLoading}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
