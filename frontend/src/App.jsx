import React, { useState } from 'react';
import { FilterProvider } from './context/FilterContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import FilterBar from './components/FilterBar';

import OverviewDashboard from './pages/OverviewDashboard';
import SalesAnalytics from './pages/SalesAnalytics';
import CustomerAnalytics from './pages/CustomerAnalytics';
import ProductAnalytics from './pages/ProductAnalytics';
import LocationAnalytics from './pages/LocationAnalytics';
import OrdersPage from './pages/OrdersPage';
import DatasetPage from './pages/DatasetPage';

function DashboardApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isFilterBarOpen, setIsFilterBarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefreshData = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <OverviewDashboard key={refreshKey} onNavigateTo={setActiveTab} />;
      case 'sales':
        return <SalesAnalytics key={refreshKey} />;
      case 'customers':
        return <CustomerAnalytics key={refreshKey} />;
      case 'products':
        return <ProductAnalytics key={refreshKey} />;
      case 'locations':
        return <LocationAnalytics key={refreshKey} />;
      case 'orders':
        return <OrdersPage key={refreshKey} />;
      case 'data':
        return <DatasetPage key={refreshKey} />;
      default:
        return <OverviewDashboard key={refreshKey} onNavigateTo={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Application Header */}
      <Header
        activeTab={activeTab}
        isFilterBarOpen={isFilterBarOpen}
        onToggleFilterBar={() => setIsFilterBarOpen((prev) => !prev)}
        onRefreshData={handleRefreshData}
      />

      {/* Global Interactive Filter Slicers */}
      <FilterBar isOpen={isFilterBarOpen} />

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMobileOpen={isMobileSidebarOpen}
          setIsMobileOpen={setIsMobileSidebarOpen}
        />

        {/* Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {renderActivePage()}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>E-Commerce Sales & Customer Analytics Dashboard &copy; 2024</span>
          <span className="text-slate-400">
            Engineered with React, Vite, Tailwind CSS, Recharts & Python FastAPI
          </span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <FilterProvider>
      <DashboardApp />
    </FilterProvider>
  );
}
