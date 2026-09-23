import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  RefreshCw, 
  Layers, 
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';
import { useFilters } from '../context/FilterContext';
import { getExportCsvUrl, reseedDatabase } from '../services/api';

export default function Header({ activeTab, onToggleFilterBar, isFilterBarOpen, onRefreshData }) {
  const { activeCount, resetFilters } = useFilters();
  const [isReseeding, setIsReseeding] = useState(false);
  const [reseedSuccess, setReseedSuccess] = useState(false);

  const handleReseed = async () => {
    try {
      setIsReseeding(true);
      await reseedDatabase();
      setReseedSuccess(true);
      setTimeout(() => setReseedSuccess(false), 3000);
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error('Reseed failed:', err);
    } finally {
      setIsReseeding(false);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Titles */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  E-Commerce Sales & Customer Analytics
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                  Live Data
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Interactive business intelligence & executive analytics dashboard
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Filter Toggle Button */}
            <button
              onClick={onToggleFilterBar}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isFilterBarOpen
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-indigo-600 text-white rounded-full text-[10px] font-bold">
                  {activeCount}
                </span>
              )}
            </button>

            {/* Export CSV */}
            <a
              href={getExportCsvUrl()}
              download="ecommerce_data.csv"
              className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
              title="Download full dataset CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </a>

            {/* Reseed / Refresh Button */}
            <button
              onClick={handleReseed}
              disabled={isReseeding}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors disabled:opacity-50 shadow-2xs"
              title="Reseed & refresh dataset"
            >
              {reseedSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Refreshed!</span>
                </>
              ) : (
                <>
                  <RefreshCw className={`w-3.5 h-3.5 ${isReseeding ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">{isReseeding ? 'Updating...' : 'Sync Data'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
