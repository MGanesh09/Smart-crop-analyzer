import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, 
  Download, 
  Sprout, 
  MapPin, 
  Layers, 
  Activity, 
  Loader2, 
  Calendar,
  AlertCircle
} from 'lucide-react';

const Reports = () => {
  const { user } = useAuth();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth';
  const FARMS_API = API_URL.replace('/auth', '/farms');

  useEffect(() => {
    const loadFarms = async () => {
      try {
        setLoading(true);
        const res = await axios.get(FARMS_API);
        if (res.data.success) {
          setFarms(res.data.data);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch farm data for report.');
      } finally {
        setLoading(false);
      }
    };
    loadFarms();
  }, []);

  const handlePrintPdf = () => {
    window.print();
  };

  // Date helper
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-8 animate-card print-page">
      {/* CSS Print Rules Overlay */}
      <style>{`
        @media print {
          /* Hide non-printable app navigation wrappers */
          header, aside, button, nav, .print-hide {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            margin-left: 0 !important;
          }
          body {
            background-color: white !important;
            color: black !important;
          }
          .print-border {
            border: 1px solid #e2e8f0 !important;
            background: none !important;
            box-shadow: none !important;
          }
          .print-text-dark {
            color: #0f172a !important;
          }
          .print-text-muted {
            color: #475569 !important;
          }
        }
      `}</style>

      {/* Header Info (Visible on screen and print) */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-6 print-border print:pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl print-text-dark">
            Agriculture Diagnostics Report
          </h1>
          <p className="text-sm text-slate-400 mt-1 print-text-muted">
            Platform compilation report generated on <span className="font-semibold text-slate-200 print-text-dark">{currentDate}</span>.
          </p>
        </div>
        <button
          onClick={handlePrintPdf}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-emerald-500 py-3 px-5 text-sm font-semibold text-white hover:brightness-105 active:scale-95 transition shadow-lg print-hide"
        >
          <Download className="h-5 w-5" /> Download PDF Report
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 print-hide">
          <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
        </div>
      ) : farms.length > 0 ? (
        <div className="space-y-6">
          
          {/* Summary Sheet Card */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 shadow-xl backdrop-blur-xl print-border print:p-4">
            <h3 className="text-base font-bold text-white mb-4 print-text-dark">Platform Overview</h3>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
              <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 print-border">
                <span className="text-[9px] font-bold text-slate-500 uppercase block">Registered Nodes</span>
                <span className="text-xl font-bold text-white block mt-1 print-text-dark">{farms.length}</span>
              </div>
              <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 print-border">
                <span className="text-[9px] font-bold text-slate-500 uppercase block">Total Acreage Mapped</span>
                <span className="text-xl font-bold text-white block mt-1 print-text-dark">
                  {farms.reduce((acc, curr) => acc + (curr.size || 0), 0).toFixed(1)} ac
                </span>
              </div>
              <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 print-border">
                <span className="text-[9px] font-bold text-slate-500 uppercase block">Total Scheduled Fields</span>
                <span className="text-xl font-bold text-white block mt-1 print-text-dark">
                  {farms.reduce((acc, curr) => acc + (curr.crops?.length || 0), 0)}
                </span>
              </div>
              <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 print-border">
                <span className="text-[9px] font-bold text-slate-500 uppercase block">Operator Partner</span>
                <span className="text-sm font-bold text-white block mt-2 print-text-dark truncate">{user?.name}</span>
              </div>
            </div>
          </div>

          {/* Detailed Farm Nodes Table */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 shadow-xl backdrop-blur-xl overflow-hidden print-border print:p-4">
            <h3 className="text-base font-bold text-white mb-4 print-text-dark">Farms Specification Sheet</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-2">Farm Name</th>
                    <th className="py-3 px-2">Region</th>
                    <th className="py-3 px-2">Size</th>
                    <th className="py-3 px-2">Soil Type</th>
                    <th className="py-3 px-2">NPK Profile</th>
                    <th className="py-3 px-2 text-right">pH</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs text-slate-300 print-text-dark">
                  {farms.map((farm) => (
                    <tr key={farm._id} className="hover:bg-white/5">
                      <td className="py-3.5 px-2 font-bold text-white print-text-dark">{farm.name}</td>
                      <td className="py-3.5 px-2">{farm.locationName || 'Unknown'}</td>
                      <td className="py-3.5 px-2">{farm.size} acres</td>
                      <td className="py-3.5 px-2 capitalize">{farm.soil?.type || 'loamy'}</td>
                      <td className="py-3.5 px-2 font-mono">
                        N: {farm.soil?.nitrogen} | P: {farm.soil?.phosphorus} | K: {farm.soil?.potassium}
                      </td>
                      <td className="py-3.5 px-2 text-right font-mono font-bold text-emerald-400 print-text-dark">
                        {farm.soil?.pH}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Agronomic Recommendations for print */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 shadow-xl backdrop-blur-xl print-border print:p-4">
            <h3 className="text-base font-bold text-white mb-3 print-text-dark">Agronomic Directives Summary</h3>
            <p className="text-xs text-slate-400 leading-relaxed print-text-muted">
              Oakridge sensors indicate nitrogen soil metrics require topdressing. We recommend applying organic poultry manure compost at a dosage rate of 250 kg per acre across clay and silty sectors before the upcoming rain.
            </p>
          </div>

        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-white/10 rounded-3xl bg-slate-900/10">
          <FileText className="h-12 w-12 text-slate-500 mb-2" />
          <h3 className="text-lg font-bold text-white">No active Farm Data found</h3>
          <p className="text-sm text-slate-400 max-w-sm mt-1">
            Ensure you add farm nodes and parameters in order to generate data for reports.
          </p>
        </div>
      )}
    </div>
  );
};

export default Reports;
