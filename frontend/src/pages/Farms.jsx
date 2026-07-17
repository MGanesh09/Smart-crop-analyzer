import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import InteractiveMap from '../components/InteractiveMap';
import { 
  Sprout, 
  MapPin, 
  Trash2, 
  Edit3, 
  Plus, 
  Camera, 
  Settings, 
  Check, 
  TrendingUp, 
  Loader2, 
  Calendar,
  Layers,
  Thermometer,
  AlertCircle
} from 'lucide-react';

const Farms = () => {
  const { user } = useAuth();
  
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal & form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });

  const handleLocationSearch = async () => {
    if (!locationName.trim()) return;
    
    const queryParts = locationName.split(',').map(p => p.trim()).filter(Boolean);
    
    const tryGeocode = async (queryText) => {
      // 1. Try OpenStreetMap Nominatim
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryText)}`
        );
        if (response.data && response.data.length > 0) {
          const { lat, lon } = response.data[0];
          return { lat: parseFloat(lat), lng: parseFloat(lon) };
        }
      } catch (osmErr) {
        console.warn('OSM Nominatim failed for:', queryText, osmErr);
      }

      // 2. Try Esri ArcGIS fallback
      try {
        const response = await axios.get(
          `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&singleLine=${encodeURIComponent(queryText)}&outFields=Addr_type`
        );
        if (response.data && response.data.candidates && response.data.candidates.length > 0) {
          const { x, y } = response.data.candidates[0].location;
          return { lat: y, lng: x };
        }
      } catch (esriErr) {
        console.warn('Esri Geocoding failed for:', queryText, esriErr);
      }
      
      return null;
    };

    // Run progressive search
    let coords = await tryGeocode(locationName);
    
    if (!coords && queryParts.length > 1) {
      // Strip most specific detail (e.g., specific farm name/hamlet)
      const simplifiedQuery = queryParts.slice(1).join(', ');
      coords = await tryGeocode(simplifiedQuery);
    }
    
    if (!coords && queryParts.length > 2) {
      // Fallback to state/region
      coords = await tryGeocode(queryParts[queryParts.length - 1]);
    }

    if (coords) {
      setMapCenter(coords);
    } else {
      alert('Location not found. Please try entering a broader name (e.g., district or state name).');
    }
  };
  
  // Form fields
  const [name, setName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [size, setSize] = useState(10);
  const [boundary, setBoundary] = useState([]);
  const [soilType, setSoilType] = useState('loamy');
  const [pH, setPh] = useState(6.5);
  const [nitrogen, setNitrogen] = useState(50);
  const [phosphorus, setPhosphorus] = useState(30);
  const [potassium, setPotassium] = useState(120);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  
  // Crop management sub-form state
  const [crops, setCrops] = useState([]);
  const [newCropName, setNewCropName] = useState('');
  const [newCropStatus, setNewCropStatus] = useState('planted');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth';
  const FARMS_API = API_URL.replace('/auth', '/farms');

  // Load farms from backend
  const fetchFarms = async () => {
    try {
      setLoading(true);
      const res = await axios.get(FARMS_API);
      if (res.data.success) {
        setFarms(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch farms list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const handleOpenAddModal = () => {
    setEditingFarm(null);
    setName('');
    setLocationName('');
    setSize(10);
    setBoundary([]);
    setSoilType('loamy');
    setPh(6.5);
    setNitrogen(50);
    setPhosphorus(30);
    setPotassium(120);
    setImageUrl('');
    setCrops([]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (farm) => {
    setEditingFarm(farm);
    setName(farm.name || '');
    setLocationName(farm.locationName || '');
    setSize(farm.size || 0);
    setBoundary(farm.boundary || []);
    setSoilType(farm.soil?.type || 'loamy');
    setPh(farm.soil?.pH || 6.5);
    setNitrogen(farm.soil?.nitrogen || 50);
    setPhosphorus(farm.soil?.phosphorus || 30);
    setPotassium(farm.soil?.potassium || 120);
    setImageUrl(farm.imageUrl || '');
    setCrops(farm.crops || []);
    setIsModalOpen(true);
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const res = await axios.post(`${FARMS_API}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setImageUrl(res.data.imageUrl);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  // Handle CRUD submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const farmPayload = {
      name,
      locationName,
      size: parseFloat(size) || 0,
      boundary,
      soil: {
        type: soilType,
        pH: parseFloat(pH) || 6.5,
        nitrogen: parseInt(nitrogen) || 50,
        phosphorus: parseInt(phosphorus) || 30,
        potassium: parseInt(potassium) || 120,
      },
      crops,
      imageUrl,
    };

    try {
      if (editingFarm) {
        // Edit mode
        await axios.put(`${FARMS_API}/${editingFarm._id}`, farmPayload);
      } else {
        // Create mode
        await axios.post(FARMS_API, farmPayload);
      }
      setIsModalOpen(false);
      fetchFarms();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save farm details.');
    }
  };

  // Delete farm handler
  const handleDeleteFarm = async (id) => {
    if (!window.confirm('Are you sure you want to delete this farm? This action is permanent.')) return;
    try {
      await axios.delete(`${FARMS_API}/${id}`);
      fetchFarms();
    } catch (err) {
      console.error(err);
      setError('Failed to delete farm.');
    }
  };

  // Add crop to sub-list
  const handleAddCrop = () => {
    if (!newCropName) return;
    const newCrop = {
      name: newCropName,
      status: newCropStatus,
      plantingDate: new Date(),
      expectedHarvestDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // default 90 days
    };
    setCrops([...crops, newCrop]);
    setNewCropName('');
  };

  // Remove crop from list
  const handleRemoveCrop = (idx) => {
    setCrops(crops.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-8 animate-card">
      {/* Cinematic Header Block */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Farm Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Map boundaries, schedule crop systems, and analyze real-time soil properties on your agricultural nodes.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-emerald-500 py-3 px-5 text-sm font-semibold text-white hover:brightness-105 active:scale-95 transition shadow-lg shadow-primary-500/10"
        >
          <Plus className="h-5 w-5" /> Add Farm Node
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl bg-rose-950/30 border border-rose-500/20 p-4 text-sm text-rose-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Farms List / Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
        </div>
      ) : farms.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {farms.map((farm) => (
            <div 
              key={farm._id} 
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 shadow-xl backdrop-blur-xl transition hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/5 group"
            >
              {/* Image banner */}
              <div className="relative h-40 bg-slate-950 w-full overflow-hidden">
                {farm.imageUrl ? (
                  <img src={farm.imageUrl} alt={farm.name} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900 opacity-70">
                    <Sprout className="h-12 w-12 text-slate-500" />
                  </div>
                )}
                {/* Overlay details */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-lg font-bold text-white leading-tight">{farm.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" /> {farm.locationName || 'Unknown Region'}
                  </p>
                </div>
              </div>

              {/* Specs & Soil Details */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-3 gap-2 border-b border-white/5 pb-4">
                  <div className="text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Acreage</span>
                    <p className="text-sm font-semibold text-white mt-0.5">{farm.size} ac</p>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Soil Profile</span>
                    <p className="text-sm font-semibold text-white mt-0.5 capitalize">{farm.soil?.type || 'loamy'}</p>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">pH Level</span>
                    <p className="text-sm font-semibold text-white mt-0.5">{farm.soil?.pH || 6.5}</p>
                  </div>
                </div>

                {/* Crops list preview */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Active Crops</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {farm.crops && farm.crops.length > 0 ? (
                      farm.crops.map((crop, i) => (
                        <span 
                          key={i} 
                          className="inline-flex rounded-lg bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 text-xs text-emerald-400 capitalize"
                        >
                          {crop.name} ({crop.status})
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic">No crops scheduled</span>
                    )}
                  </div>
                </div>

                {/* Soil Nutrients Hud */}
                <div className="bg-slate-950/50 rounded-xl p-3 border border-white/5 space-y-2">
                  <span className="text-[9px] uppercase tracking-widest text-slate-500 font-mono block">Nutrient Chemistry (mg/kg)</span>
                  <div className="grid grid-cols-3 gap-1 text-xs text-center">
                    <div>Nitrogen (N): <span className="font-semibold text-emerald-400">{farm.soil?.nitrogen || 0}</span></div>
                    <div>Phosp (P): <span className="font-semibold text-emerald-400">{farm.soil?.phosphorus || 0}</span></div>
                    <div>Potas (K): <span className="font-semibold text-emerald-400">{farm.soil?.potassium || 0}</span></div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="absolute top-4 right-4 flex gap-1.5 z-20">
                <button
                  onClick={() => handleOpenEditModal(farm)}
                  className="rounded-lg p-1.5 bg-slate-900/80 backdrop-blur border border-white/10 hover:border-emerald-500/30 text-slate-300 hover:text-emerald-400 transition"
                  title="Edit Farm Parameters"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteFarm(farm._id)}
                  className="rounded-lg p-1.5 bg-slate-900/80 backdrop-blur border border-white/10 hover:border-rose-500/30 text-slate-300 hover:text-rose-400 transition"
                  title="Remove Farm"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-white/10 rounded-3xl bg-slate-900/10">
          <Sprout className="h-12 w-12 text-slate-500 mb-2 animate-bounce" />
          <h3 className="text-lg font-bold text-white">No active Farm Nodes</h3>
          <p className="text-sm text-slate-400 max-w-sm mt-1">
            Map out your first farm boundary, specify soil chemistry values, and register crop fields.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300"
          >
            Add Farm Node <Plus className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Edit / Add Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 overflow-y-auto backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-slate-900 p-6 md:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold text-white border-b border-white/5 pb-4">
              {editingFarm ? 'Edit Farm Node Properties' : 'Initialize New Farm Node'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Farm Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-xl border border-white/10 bg-slate-950/50 py-3 px-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-primary-500"
                    placeholder="e.g. Oakridge Valley Field"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Location Name / District
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      className="block flex-1 rounded-xl border border-white/10 bg-slate-950/50 py-3 px-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-primary-500"
                      placeholder="e.g. Srikakulam, Andhra Pradesh"
                    />
                    <button
                      type="button"
                      onClick={handleLocationSearch}
                      className="rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 px-4 text-xs font-bold text-white transition shrink-0"
                    >
                      Locate
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Farm Size (Acres)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="block w-full rounded-xl border border-white/10 bg-slate-950/50 py-3 px-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Soil Classification
                  </label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="block w-full rounded-xl border border-white/10 bg-slate-950/50 py-3 px-4 text-sm text-white outline-none transition focus:border-primary-500"
                  >
                    <option value="clay">Clay</option>
                    <option value="sandy">Sandy</option>
                    <option value="loamy">Loamy</option>
                    <option value="silty">Silty</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Soil pH Level
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="14"
                    required
                    value={pH}
                    onChange={(e) => setPh(e.target.value)}
                    className="block w-full rounded-xl border border-white/10 bg-slate-950/50 py-3 px-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Nitrogen level (N) mg/kg
                  </label>
                  <input
                    type="number"
                    required
                    value={nitrogen}
                    onChange={(e) => setNitrogen(e.target.value)}
                    className="block w-full rounded-xl border border-white/10 bg-slate-950/50 py-3 px-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Phosphorus level (P) mg/kg
                  </label>
                  <input
                    type="number"
                    required
                    value={phosphorus}
                    onChange={(e) => setPhosphorus(e.target.value)}
                    className="block w-full rounded-xl border border-white/10 bg-slate-950/50 py-3 px-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Potassium level (K) mg/kg
                  </label>
                  <input
                    type="number"
                    required
                    value={potassium}
                    onChange={(e) => setPotassium(e.target.value)}
                    className="block w-full rounded-xl border border-white/10 bg-slate-950/50 py-3 px-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-primary-500"
                  />
                </div>
              </div>

              {/* GIS boundary mapping sub form */}
              <div className="border-t border-white/5 pt-6 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">GIS Satellite Mapping</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Click points on the map to define the corners/boundaries of your agricultural field node.
                  </p>
                </div>
                
                <InteractiveMap 
                  boundary={boundary} 
                  onChange={setBoundary} 
                  center={mapCenter}
                />
              </div>

              {/* Crop Scheduler section */}
              <div className="border-t border-white/5 pt-6 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Field Crop Systems Schedule</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Schedule crop species classes to associate with this node.
                  </p>
                </div>

                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Crop Name</label>
                    <input 
                      type="text" 
                      value={newCropName}
                      onChange={(e) => setNewCropName(e.target.value)}
                      placeholder="e.g. Heirloom Tomato" 
                      className="block w-full rounded-xl border border-white/10 bg-slate-950/50 py-2.5 px-3 text-xs text-white placeholder-slate-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Growth Phase</label>
                    <select 
                      value={newCropStatus}
                      onChange={(e) => setNewCropStatus(e.target.value)}
                      className="block rounded-xl border border-white/10 bg-slate-950/50 py-2.5 px-3 text-xs text-white outline-none"
                    >
                      <option value="planted">Planted</option>
                      <option value="growing">Growing</option>
                      <option value="harvesting">Harvesting</option>
                    </select>
                  </div>
                  <button 
                    type="button"
                    onClick={handleAddCrop}
                    className="rounded-xl bg-slate-800 hover:bg-slate-700 py-2.5 px-4 text-xs font-bold text-white transition h-10 flex items-center justify-center"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {crops.map((crop, idx) => (
                    <span 
                      key={idx}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs text-emerald-400"
                    >
                      {crop.name} ({crop.status})
                      <button 
                        type="button" 
                        onClick={() => handleRemoveCrop(idx)}
                        className="text-emerald-500 hover:text-emerald-300 font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Image upload section */}
              <div className="border-t border-white/5 pt-4 space-y-3">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Header Image Uploader
                </span>
                
                <div className="flex items-center gap-4">
                  <label className="flex items-center justify-center gap-2 rounded-xl bg-slate-850 hover:bg-slate-800 border border-white/10 py-3 px-4 text-xs font-semibold text-slate-300 cursor-pointer transition">
                    <Camera className="h-4.5 w-4.5" />
                    Choose File
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden" 
                    />
                  </label>
                  
                  {uploading && <Loader2 className="h-5 w-5 animate-spin text-primary-500" />}
                  
                  {imageUrl && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                      <Check className="h-4 w-4" /> File prepped successfully
                    </span>
                  )}
                </div>
              </div>

              {/* Form submit footer */}
              <div className="flex justify-end gap-3 border-t border-white/5 pt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-white/10 bg-slate-850 hover:bg-slate-800 py-3 px-5 text-sm font-semibold text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-primary-600 to-emerald-500 py-3 px-6 text-sm font-semibold text-white hover:brightness-105 active:scale-95 transition"
                >
                  Save Node details
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Farms;
