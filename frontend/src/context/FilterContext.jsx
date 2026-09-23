import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchFilterOptions } from '../services/api';

const FilterContext = createContext(null);

const DEFAULT_FILTERS = {
  start_date: '',
  end_date: '',
  category: 'All',
  product: 'All',
  state: 'All',
  city: 'All',
  payment_method: 'All',
  order_status: 'All',
  customer_segment: 'All',
};

export function FilterProvider({ children }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [options, setOptions] = useState({
    categories: [],
    products: [],
    states: [],
    cities: [],
    payment_methods: [],
    order_statuses: [],
    customer_segments: [],
    min_date: '',
    max_date: '',
  });
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    async function initOptions() {
      try {
        const opts = await fetchFilterOptions();
        setOptions(opts);
      } catch (err) {
        console.error('Failed to load filter options:', err);
      } finally {
        setLoadingOptions(false);
      }
    }
    initOptions();
  }, []);

  const setFilter = (key, value) => {
    setFilters((prev) => {
      const updated = { ...prev, [key]: value };
      // If category changes, reset product if it doesn't belong or reset to All
      if (key === 'category' && value === 'All') {
        updated.product = 'All';
      }
      // If state changes, reset city if not in that state
      if (key === 'state' && value === 'All') {
        updated.city = 'All';
      }
      return updated;
    });
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const setDatePreset = (preset) => {
    if (!options.max_date) return;
    const maxDate = new Date(options.max_date);
    let startDate = new Date(maxDate);

    if (preset === 'all') {
      setFilters((prev) => ({ ...prev, start_date: '', end_date: '' }));
      return;
    } else if (preset === '30d') {
      startDate.setDate(maxDate.getDate() - 30);
    } else if (preset === '90d') {
      startDate.setDate(maxDate.getDate() - 90);
    } else if (preset === '6m') {
      startDate.setMonth(maxDate.getMonth() - 6);
    } else if (preset === '1y') {
      startDate.setFullYear(maxDate.getFullYear() - 1);
    }

    const startStr = startDate.toISOString().split('T')[0];
    const endStr = options.max_date;
    setFilters((prev) => ({ ...prev, start_date: startStr, end_date: endStr }));
  };

  // Count active non-default filters
  const activeCount = Object.entries(filters).filter(([key, val]) => {
    if (!val || val === 'All') return false;
    return true;
  }).length;

  return (
    <FilterContext.Provider
      value={{
        filters,
        options,
        loadingOptions,
        setFilter,
        resetFilters,
        setDatePreset,
        activeCount,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters must be used within a FilterProvider');
  return ctx;
}
