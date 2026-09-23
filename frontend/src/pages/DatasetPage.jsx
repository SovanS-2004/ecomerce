import React, { useState } from 'react';
import { 
  Database, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  Table, 
  Code, 
  Layers, 
  Cpu, 
  Check
} from 'lucide-react';
import { getExportCsvUrl, reseedDatabase } from '../services/api';

const SCHEMA_FIELDS = [
  { field: 'Order_ID', type: 'VARCHAR(20)', desc: 'Unique identifier for the order transaction (e.g. ORD-10001)' },
  { field: 'Order_Date', type: 'DATE (YYYY-MM-DD)', desc: 'Date when the order was placed' },
  { field: 'Customer_ID', type: 'VARCHAR(20)', desc: 'Unique identifier for the registered customer' },
  { field: 'Customer_Name', type: 'VARCHAR(100)', desc: 'Full name of the customer' },
  { field: 'Gender', type: 'VARCHAR(10)', desc: 'Customer gender demographic (Male, Female)' },
  { field: 'Age', type: 'INTEGER', desc: 'Customer age in years (demographic segmentation)' },
  { field: 'City', type: 'VARCHAR(50)', desc: 'Delivery city across top Indian metropolitan regions' },
  { field: 'State', type: 'VARCHAR(50)', desc: 'State or Union Territory' },
  { field: 'Product', type: 'VARCHAR(150)', desc: 'Specific item purchased' },
  { field: 'Category', type: 'VARCHAR(50)', desc: 'Parent retail category (Electronics, Fashion, Home, etc.)' },
  { field: 'Quantity', type: 'INTEGER', desc: 'Number of units ordered in the line item' },
  { field: 'Unit_Price', type: 'DECIMAL(10,2)', desc: 'Catalog retail price per single unit (in INR ₹)' },
  { field: 'Discount', type: 'DECIMAL(5,2)', desc: 'Promotional discount percentage applied (0% - 25%)' },
  { field: 'Sales', type: 'DECIMAL(12,2)', desc: 'Net revenue = Quantity * Unit_Price * (1 - Discount/100)' },
  { field: 'Profit', type: 'DECIMAL(12,2)', desc: 'Net profit after product margin, discounts, and return handling' },
  { field: 'Payment_Method', type: 'VARCHAR(30)', desc: 'Payment instrument (UPI, Credit Card, Debit Card, COD, Net Banking)' },
  { field: 'Order_Status', type: 'VARCHAR(20)', desc: 'Fulfillment state (Delivered, Pending, Cancelled, Returned)' },
];

export default function DatasetPage() {
  const [reseeding, setReseeding] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleReseed = async () => {
    try {
      setReseeding(true);
      await reseedDatabase();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setReseeding(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Dataset Specifications & Project Architecture</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Data dictionary, relational schema definitions, and academic project technical overview.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href={getExportCsvUrl()}
            download="ecommerce_data.csv"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </a>

          <button
            onClick={handleReseed}
            disabled={reseeding}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-2xs"
          >
            {success ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Reseeded!</span>
              </>
            ) : (
              <>
                <RefreshCw className={`w-3.5 h-3.5 ${reseeding ? 'animate-spin' : ''}`} />
                <span>{reseeding ? 'Generating...' : 'Regenerate Dataset'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Technical Architecture Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">FastAPI + Pandas Engine</h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            High-performance asynchronous Python REST API using vectorized Pandas operations for dynamic aggregation, group-bys, and multi-criteria slicing.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">SQLite Relational Database</h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Zero-config ACID compliant embedded storage storing 850+ realistic order records with indexed columns for rapid query response.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">React + Tailwind + Recharts</h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Component-driven client architecture with React state context, SVG data visualizations, responsive layout, and cross-filtering interactivity.
          </p>
        </div>
      </div>

      {/* Schema Table */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center space-x-2 pb-4 border-b border-slate-100">
          <Table className="w-4 h-4 text-slate-500" />
          <h3 className="font-bold text-slate-900 text-sm">Relational Data Dictionary (`orders` table)</h3>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Column Name</th>
                <th className="px-4 py-3">Data Type</th>
                <th className="px-4 py-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {SCHEMA_FIELDS.map((row) => (
                <tr key={row.field} className="hover:bg-slate-50/70">
                  <td className="px-4 py-2.5 font-mono font-bold text-indigo-600">{row.field}</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500 text-[11px]">{row.type}</td>
                  <td className="px-4 py-2.5 text-slate-600">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
