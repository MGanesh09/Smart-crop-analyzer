import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  ChevronRight, 
  Loader2, 
  Info,
  Scale,
  Activity,
  CalendarDays
} from 'lucide-react';

const MarketAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [cropPrices, setCropPrices] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  
  // Profit Calculator State
  const [calcCrop, setCalcCrop] = useState('Tomato');
  const [acres, setAcres] = useState(5);
  const [seedCost, setSeedCost] = useState(4000);
  const [fertilizerCost, setFertilizerCost] = useState(6000);
  const [laborCost, setLaborCost] = useState(10000);
  const [waterCost, setWaterCost] = useState(3000);
  const [calcResult, setCalcResult] = useState(null);
  const [calculating, setCalculating] = useState(false);

  // Calendar State
  const [calendarMonth, setCalendarMonth] = useState('July 2026');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth';
  const MARKET_API = API_URL.replace('/auth', '/market');

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${MARKET_API}/prices`);
        if (res.data.success) {
          setCropPrices(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrices();
  }, []);

  // Profit Calculator Trigger
  const triggerProfitCalculator = async () => {
    try {
      setCalculating(true);
      const res = await axios.post(`${MARKET_API}/calculate-profit`, {
        cropType: calcCrop,
        size: parseFloat(acres) || 0,
        seedCost: parseFloat(seedCost) || 0,
        fertilizerCost: parseFloat(fertilizerCost) || 0,
        laborCost: parseFloat(laborCost) || 0,
        waterCost: parseFloat(waterCost) || 0
      });
      if (res.data.success) {
        setCalcResult(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCalculating(false);
    }
  };

  useEffect(() => {
    triggerProfitCalculator();
  }, [calcCrop, acres, seedCost, fertilizerCost, laborCost, waterCost]);

  // Crop Calendar Schedules Mock Data
  const calendarTasks = [
    { day: 4, crop: 'Tomato', task: 'Primary Seeding & Drip Line Check', type: 'seeding' },
    { day: 12, crop: 'Corn', task: 'High-Nitrogen Fertilization Whorl', type: 'fertilizer' },
    { day: 18, crop: 'Tomato', task: 'Fungicide Protective Spraying', type: 'spray' },
    { day: 25, crop: 'Wheat', task: 'Scythe Moisture & Soil Check', type: 'check' },
    { day: 29, crop: 'Corn', task: 'Target Harvest Window Open', type: 'harvest' }
  ];

  return (
    <div className="space-y-8 animate-card">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Market Intelligence & Planning
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Calculate expected overhead margins, track price variations, and schedule crop system calendar dates.
        </p>
      </div>

      {/* Grid: Charts & Calculator */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Left Side: Historical Chart */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-white">Market Value Trends</h3>
                <p className="text-[10px] text-slate-400">Historical daily pricing (past 6 months) & 30-day AI forecasts</p>
              </div>

              {/* Crop Selector dropdown */}
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="rounded-xl border border-white/10 bg-slate-950/50 py-2 px-3 text-xs text-white outline-none focus:border-primary-500"
              >
                <option value="Tomato">Tomato Index</option>
                <option value="Corn">Corn Index</option>
                <option value="Wheat">Wheat Index</option>
              </select>
            </div>

            {loading ? (
              <div className="h-56 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
              </div>
            ) : cropPrices && cropPrices[selectedCrop] ? (
              <div className="space-y-4">
                {/* SVG Line Chart */}
                <div className="relative w-full h-48 bg-slate-950/60 rounded-2xl border border-white/5 p-4 overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1="0" y1="10" x2="100" y2="10" stroke="#334155" strokeWidth="0.1" strokeDasharray="1 1" />
                    <line x1="0" y1="20" x2="100" y2="20" stroke="#334155" strokeWidth="0.1" strokeDasharray="1 1" />
                    <line x1="0" y1="30" x2="100" y2="30" stroke="#334155" strokeWidth="0.1" strokeDasharray="1 1" />
                    
                    {/* Price Line */}
                    <path
                      d={`M 0,${30 - (cropPrices[selectedCrop].history[0]?.price % 100) / 10} 
                          L 20,${35 - (cropPrices[selectedCrop].history[2]?.price % 100) / 10} 
                          L 40,${25 - (cropPrices[selectedCrop].history[5]?.price % 100) / 10} 
                          L 60,${28 - (cropPrices[selectedCrop].history[8]?.price % 100) / 10} 
                          L 80,${18 - (cropPrices[selectedCrop].history[11]?.price % 100) / 10} 
                          L 100,${12 - (cropPrices[selectedCrop].forecast[1]?.price % 100) / 10}`}
                      fill="none"
                      className="stroke-emerald-400 stroke-[0.8]"
                      strokeWidth="2"
                    />

                    {/* Gradient Area beneath line */}
                    <path
                      d={`M 0,40 
                          L 0,${30 - (cropPrices[selectedCrop].history[0]?.price % 100) / 10} 
                          L 20,${35 - (cropPrices[selectedCrop].history[2]?.price % 100) / 10} 
                          L 40,${25 - (cropPrices[selectedCrop].history[5]?.price % 100) / 10} 
                          L 60,${28 - (cropPrices[selectedCrop].history[8]?.price % 100) / 10} 
                          L 80,${18 - (cropPrices[selectedCrop].history[11]?.price % 100) / 10} 
                          L 100,${12 - (cropPrices[selectedCrop].forecast[1]?.price % 100) / 10}
                          L 100,40 Z`}
                      className="fill-emerald-500/5"
                    />
                  </svg>

                  {/* dynamic value hud overlay */}
                  <div className="absolute top-2 right-2 bg-slate-900/90 border border-white/10 rounded-lg p-1.5 font-mono text-[9px] text-slate-400">
                    CURRENT VALUE: <span className="text-white font-semibold">₹{cropPrices[selectedCrop].currentPrice.toLocaleString()} / Ton</span>
                  </div>
                </div>

                <div className="flex justify-between text-[10px] font-mono text-slate-500 px-2">
                  <span>-6 Months ago</span>
                  <span>Today</span>
                  <span className="text-emerald-400 font-semibold">+30 Days AI Forecast</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Failed to load price index charts.</p>
            )}
          </div>

          {/* Interactive Crop Calendar */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Active Crop Calendar</h3>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">{calendarMonth}</span>
            </div>

            <div className="space-y-3">
              {calendarTasks.map((task) => (
                <div 
                  key={task.day} 
                  className="flex items-center gap-4 bg-slate-950/30 p-3.5 rounded-xl border border-white/5 hover:border-emerald-500/20 transition group"
                >
                  <div className="flex flex-col items-center justify-center h-10 w-10 rounded-xl bg-slate-900 text-center border border-white/10 shrink-0">
                    <span className="text-[9px] uppercase font-bold text-slate-500 leading-none">July</span>
                    <span className="text-sm font-extrabold text-white leading-none mt-1">{task.day}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-semibold text-slate-200">{task.task}</h4>
                    <span className="text-[9px] uppercase font-bold text-emerald-400 font-mono">{task.crop} field</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-emerald-400 transition" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Operational Profit Calculator */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md space-y-6">
            <div className="border-b border-white/5 pb-3">
              <h3 className="text-base font-bold text-white">Profit & Overhead Planner</h3>
              <p className="text-[10px] text-slate-400">Estimate expected net profit margins based on input cost levels</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Crop System</label>
                <select
                  value={calcCrop}
                  onChange={(e) => setCalcCrop(e.target.value)}
                  className="block w-full rounded-xl border border-white/10 bg-slate-950/50 py-2.5 px-3 text-xs text-white outline-none"
                >
                  <option value="Tomato">Tomato</option>
                  <option value="Corn">Corn</option>
                  <option value="Wheat">Wheat</option>
                </select>
              </div>

              {/* Sliders for cost parameters */}
              <div className="space-y-3">
                {/* Size */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Acreage</span>
                    <span className="font-semibold text-white">{acres} ac</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={acres}
                    onChange={(e) => setAcres(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                {/* Seeds */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Seed Cost (₹/ac)</span>
                    <span className="font-semibold text-white">₹{seedCost.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="15000"
                    step="500"
                    value={seedCost}
                    onChange={(e) => setSeedCost(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                {/* Fertilizer */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Fertilizer (₹/ac)</span>
                    <span className="font-semibold text-white">₹{fertilizerCost.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="2000"
                    max="20000"
                    step="500"
                    value={fertilizerCost}
                    onChange={(e) => setFertilizerCost(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                {/* Labor */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Labor (₹/ac)</span>
                    <span className="font-semibold text-white">₹{laborCost.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="3000"
                    max="30000"
                    step="1000"
                    value={laborCost}
                    onChange={(e) => setLaborCost(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>

              {/* Calculator output HUD */}
              {calculating ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                </div>
              ) : calcResult ? (
                <div className="bg-slate-950/60 rounded-2xl p-4 border border-white/5 space-y-3 font-mono text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Est. Yield Output:</span>
                    <span className="text-white font-semibold">{calcResult.expectedYieldTons} Tons</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Gross Revenue:</span>
                    <span className="text-white font-semibold">₹{calcResult.grossRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Overhead costs:</span>
                    <span className="text-rose-400 font-semibold">-₹{calcResult.costs.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs border-t border-white/5 pt-2 text-white font-bold">
                    <span>Est. Net profit:</span>
                    <span className="text-emerald-400">₹{calcResult.netProfit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Expected ROI:</span>
                    <span className="text-emerald-400 font-semibold">{calcResult.roi}</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MarketAnalytics;
