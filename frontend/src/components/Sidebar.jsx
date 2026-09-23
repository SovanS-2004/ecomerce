import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  Package, 
  MapPin, 
  ShoppingCart, 
  Database,
  CreditCard
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, desc: 'Executive Summary' },
  { id: 'sales', label: 'Sales Analytics', icon: TrendingUp, desc: 'Revenue, Profit & Trends' },
  { id: 'customers', label: 'Customer Analytics', icon: Users, desc: 'Segments & RFM Analysis' },
  { id: 'products', label: 'Product Analytics', icon: Package, desc: 'Best Sellers & Margins' },
  { id: 'locations', label: 'Location Analytics', icon: MapPin, desc: 'State & City Breakdown' },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, desc: 'Explorer & Data Table' },
  { id: 'data', label: 'Data & Schema', icon: Database, desc: 'Dataset & Project Specs' },
];

export default function Sidebar({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen }) {
  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`fixed lg:sticky top-0 lg:top-16 z-50 lg:z-10 h-screen lg:h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-slate-100 lg:hidden flex items-center justify-between">
          <div className="font-bold text-slate-800 flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            <span>Analytics Navigation</span>
          </div>
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            ✕
          </button>
        </div>

        {/* Section title */}
        <div className="px-5 pt-5 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Analytics Views
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (setIsMobileOpen) setIsMobileOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-left transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white font-medium shadow-sm shadow-indigo-200'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 font-normal'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <div className="min-w-0">
                  <div className="text-xs font-semibold leading-tight">{item.label}</div>
                  <div className={`text-[10px] truncate ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>
                    {item.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Bottom Info Box */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-slate-100 p-3 border border-indigo-100/60">
            <div className="flex items-center space-x-2 text-indigo-700 font-semibold text-xs mb-1">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              <span>BCA Capstone Project</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              FastAPI, Pandas, SQLite & React interactive business analytics platform.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
