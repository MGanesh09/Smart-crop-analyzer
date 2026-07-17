import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  CloudSun, 
  Droplets, 
  Thermometer, 
  Sprout, 
  Layers, 
  Compass, 
  Plus, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MapPin,
  TrendingDown,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth';
  const FARMS_API = API_URL.replace('/auth', '/farms');

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await axios.get(FARMS_API);
        if (res.data.success) {
          setFarms(res.data.data);
        }
      } catch (err) {
        console.error('Error loading farms for dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Aggregate Stats
  const totalAcreage = farms.reduce((acc, curr) => acc + (curr.size || 0), 0);
  const totalCropsCount = farms.reduce((acc, curr) => acc + (curr.crops?.length || 0), 0);
  const averagePH = farms.length 
    ? (farms.reduce((acc, curr) => acc + (curr.soil?.pH || 6.5), 0) / farms.length).toFixed(1)
    : '6.5';
  
  // Crop predictions helper based on soil type
  const getCropRecommendations = (soil) => {
    const defaultRecs = {
      title: 'Configure Farm Soil Type',
      desc: 'Create or edit a farm node to select a soil type and get smart predictions.',
      crops: []
    };
    if (!soil) return defaultRecs;

    switch (soil.toLowerCase()) {
      case 'clay':
        return {
          title: 'Clay Soil Recommendations',
          desc: 'High nutrient density, retains water well. Best for heavy feeding, deep-rooted brassicas.',
          crops: [
            { name: 'Broccoli', profit: 'High', cycle: '70 days', moistureReq: 'High' },
            { name: 'Cabbage', profit: 'Medium', cycle: '85 days', moistureReq: 'High' }
          ]
        };
      case 'sandy':
        return {
          title: 'Sandy Soil Recommendations',
          desc: 'Free-draining soil that warms up quickly. Best for root vegetables and drought-resistant crops.',
          crops: [
            { name: 'Carrots', profit: 'High', cycle: '75 days', moistureReq: 'Low' },
            { name: 'Potatoes', profit: 'High', cycle: '100 days', moistureReq: 'Medium' }
          ]
        };
      case 'loamy':
        return {
          title: 'Loamy Soil Recommendations',
          desc: 'Balanced mixture of sand, clay, and silt. Optimal for almost all high-value commercial crops.',
          crops: [
            { name: 'Tomatoes', profit: 'Very High', cycle: '80 days', moistureReq: 'Medium' },
            { name: 'Sweet Corn', profit: 'High', cycle: '90 days', moistureReq: 'Medium' }
          ]
        };
      default:
        return {
          title: `${soil} Soil Recommendations`,
          desc: `Suggestions tailored for ${soil} classifications.`,
          crops: [
            { name: 'Commercial Wheat', profit: 'Medium', cycle: '110 days', moistureReq: 'Medium' },
            { name: 'Soybeans', profit: 'High', cycle: '100 days', moistureReq: 'Medium' }
          ]
        };
    }
  };

  const primarySoil = farms[0]?.soil?.type || user?.farmDetails?.soilType || '';
  const recommendations = getCropRecommendations(primarySoil);

  return (
    <div className="space-y-8 animate-card">
      
      {/* Cinematic Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 md:p-8 border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-emerald-500/10 rounded-full blur-3xl animate-glow-1 pointer-events-none"></div>
        <div className="relative z-10 max-w-xl space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 text-xs text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Live Analytics Connected
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Welcome back, {user?.name || 'Farmer'}
          </h1>
          <p className="text-sm text-slate-400">
            Telemetry reports indicate optimal climate boundaries. Soil moisture sensor nodes are active across {farms.length} registered quadrants.
          </p>
        </div>
      </div>

      {/* Overview Analytics Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Active Farms */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl shadow-lg hover:border-emerald-500/35 transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Active Nodes</span>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
              <Compass className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-white">{farms.length}</h3>
            <p className="text-[10px] text-slate-400 mt-1">Farm Management Nodes</p>
          </div>
        </div>

        {/* Total Acreage */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl shadow-lg hover:border-emerald-500/35 transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Size</span>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
              <Layers className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-white">{totalAcreage.toFixed(1)} <span className="text-xs font-normal text-slate-400">acres</span></h3>
            <p className="text-[10px] text-slate-400 mt-1">Sum of mapped boundaries</p>
          </div>
        </div>

        {/* Average pH Level */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl shadow-lg hover:border-emerald-500/35 transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Average pH</span>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
              <Activity className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-white">{averagePH}</h3>
            <p className="text-[10px] text-slate-400 mt-1">Healthy agricultural target</p>
          </div>
        </div>

        {/* Active Crops */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl shadow-lg hover:border-emerald-500/35 transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Scheduled Crops</span>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
              <Sprout className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-white">{totalCropsCount}</h3>
            <p className="text-[10px] text-slate-400 mt-1">Crops in current rotation</p>
          </div>
        </div>
      </div>

      {/* Grid: Charts & Recommendations */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Dynamic Charts Widget */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-white">Soil Chemistry Analytics</h3>
                <p className="text-[10px] text-slate-400">Telemetry metrics (N, P, K) comparison across quadrants</p>
              </div>
            </div>

            {/* Custom SVG telemetry comparison bar chart */}
            {farms.length > 0 ? (
              <div className="space-y-4">
                {farms.map((farm, idx) => (
                  <div key={farm._id} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white font-semibold">{farm.name}</span>
                      <span className="text-slate-400 font-mono">N: {farm.soil?.nitrogen || 0} | P: {farm.soil?.phosphorus || 0} | K: {farm.soil?.potassium || 0}</span>
                    </div>
                    {/* Visual Bar representation */}
                    <div className="relative h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${Math.min(100, ((farm.soil?.nitrogen || 0) + (farm.soil?.phosphorus || 0) + (farm.soil?.potassium || 0)) / 4)}%` }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000"
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-44 flex flex-col items-center justify-center text-slate-500 text-xs py-10 border border-dashed border-white/5 rounded-2xl">
                <AlertTriangle className="h-6 w-6 text-amber-500 mb-1" />
                <span>No telemetry data available. Add a farm node first.</span>
              </div>
            )}
          </div>

          {/* Predictions block */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md">
            <h3 className="text-base font-bold text-white mb-2">{recommendations.title}</h3>
            <p className="text-xs text-slate-400">{recommendations.desc}</p>
            
            {recommendations.crops.length > 0 && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {recommendations.crops.map((crop) => (
                  <div key={crop.name} className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{crop.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Cycle: {crop.cycle}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-emerald-400">{crop.profit} Profit</span>
                      <p className="text-[9px] text-slate-500">Water: {crop.moistureReq}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Quick Action and Telemetry summary */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md space-y-4">
            <h3 className="text-base font-bold text-white border-b border-white/5 pb-3">Quick Navigation</h3>
            <p className="text-xs text-slate-400">
              Manage your mapping layers or update chemical statistics of your agricultural coordinates directly.
            </p>
            <div className="space-y-2 pt-2">
              <Link
                to="/farms"
                className="flex items-center justify-between w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 py-3 px-4 text-xs font-bold text-white transition shadow-lg shadow-emerald-500/10"
              >
                Go to Farm Node Manager <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/profile"
                className="flex items-center justify-between w-full rounded-xl bg-slate-800 hover:bg-slate-700 py-3 px-4 text-xs font-bold text-white transition"
              >
                Configure Soil Defaults <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
