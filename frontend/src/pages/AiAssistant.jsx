import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Bot, 
  Sprout, 
  Activity, 
  Send, 
  Camera, 
  Loader2, 
  Layers, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Droplets,
  DollarSign
} from 'lucide-react';

const AiAssistant = () => {
  const [activeTab, setActiveTab] = useState('chat'); // chat, disease, advisor, yield
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Chatbot State
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your AgriSmart AI assistant. Ask me questions about crops, soil health, fertilizer scheduling, or expected yields.' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Disease & Pest State
  const [cropType, setCropType] = useState('Tomato');
  const [diagnosticMode, setDiagnosticMode] = useState('disease'); // disease, pest
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [diagnosticResult, setDiagnosticResult] = useState(null);

  // Soil & Fertilizer State
  const [soilType, setSoilType] = useState('loamy');
  const [pH, setPh] = useState(6.5);
  const [nitrogen, setNitrogen] = useState(50);
  const [phosphorus, setPhosphorus] = useState(30);
  const [potassium, setPotassium] = useState(120);
  const [soilResult, setSoilResult] = useState(null);

  // Yield Forecast State
  const [forecastCrop, setForecastCrop] = useState('Tomato');
  const [acresSize, setAcresSize] = useState(5);
  const [forecastResult, setForecastResult] = useState(null);

  // Active Farm Mapping
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth';
  const AI_API = API_URL.replace('/auth', '/ai');
  const FARMS_API = API_URL.replace('/auth', '/farms');

  // Load registered farm nodes
  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const res = await axios.get(FARMS_API);
        if (res.data.success) {
          setFarms(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch farm list in AI dashboard:', err);
      }
    };
    fetchFarms();
  }, []);

  const handleFarmSelect = (farmId) => {
    if (!farmId) {
      setSelectedFarm(null);
      return;
    }
    const farm = farms.find(f => f._id === farmId);
    if (farm) {
      setSelectedFarm(farm);
      if (farm.soil) {
        setSoilType(farm.soil.type || 'loamy');
        setPh(farm.soil.pH || 6.5);
        setNitrogen(farm.soil.nitrogen || 50);
        setPhosphorus(farm.soil.phosphorus || 30);
        setPotassium(farm.soil.potassium || 120);
      }
      setAcresSize(farm.size || 5);
      if (farm.crops && farm.crops.length > 0) {
        setCropType(farm.crops[0].name);
        setForecastCrop(farm.crops[0].name);
      }
    }
  };

  // Handle Chat submit
  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { sender: 'user', text: chatInput };
    setMessages((prev) => [...prev, userMsg]);
    const inputPrompt = chatInput;
    setChatInput('');
    setLoading(true);

    try {
      const res = await axios.post(`${AI_API}/chat`, { message: inputPrompt });
      if (res.data.success) {
        setMessages((prev) => [...prev, { sender: 'ai', text: res.data.data.reply }]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { sender: 'ai', text: 'Sorry, I encountered an error connecting to my agronomy database.' }]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Disease & Pest Diagnose
  const handleDiagnose = async (e) => {
    e.preventDefault();
    setError('');
    setDiagnosticResult(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('cropType', cropType);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const endpoint = diagnosticMode === 'disease' ? 'disease-detect' : 'pest-detect';

    try {
      const res = await axios.post(`${AI_API}/${endpoint}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setDiagnosticResult(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Diagnosis failed. Please check files and try again.');
    } finally {
      setLoading(false);
    }
  };

  // File preview helper
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Handle Soil analysis
  const handleSoilAnalyze = async (e) => {
    e.preventDefault();
    setError('');
    setSoilResult(null);
    setLoading(true);

    try {
      const resSoil = await axios.post(`${AI_API}/soil-health`, { nitrogen, phosphorus, potassium, pH, moisture: 45 });
      const resFert = await axios.post(`${AI_API}/fertilizer`, { cropType: 'General', nitrogen, phosphorus, potassium, pH });
      
      if (resSoil.data.success && resFert.data.success) {
        setSoilResult({
          soil: resSoil.data.data,
          fertilizer: resFert.data.data
        });
      }
    } catch (err) {
      console.error(err);
      setError('Soil analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Yield calculation
  const handleForecastYield = async (e) => {
    e.preventDefault();
    setError('');
    setForecastResult(null);
    setLoading(true);

    try {
      const res = await axios.post(`${AI_API}/yield-predict`, {
        cropType: forecastCrop,
        size: parseFloat(acresSize) || 0,
        soilType
      });
      if (res.data.success) {
        setForecastResult(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Yield prediction failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-card">
      {/* Platform Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          AI Agriculture Intelligence
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Access automated yield forecasters, soil chemistry diagnostics, visual crop diagnostics, and conversational agronomy logs.
        </p>
      </div>

      {/* Active Farm Selector */}
      {farms.length > 0 && (
        <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">Select registered Farm Node</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Link diagnostic tools, NPK analysis, and yield predictors to your live farm telemetry.
              </p>
            </div>
            
            <select
              onChange={(e) => handleFarmSelect(e.target.value)}
              className="rounded-xl border border-white/10 bg-slate-950/60 py-2 px-4 text-xs font-semibold text-slate-300 outline-none hover:border-emerald-500/40 hover:text-white transition cursor-pointer w-full sm:w-64"
            >
              <option value="">-- Choose Active Node --</option>
              {farms.map((f) => (
                <option key={f._id} value={f._id}>{f.name} ({f.locationName})</option>
              ))}
            </select>
          </div>

          {selectedFarm && (
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4 pt-4 border-t border-white/5 font-mono text-[9px] text-slate-400">
              <div>FARM SIZE: <span className="text-white font-bold">{selectedFarm.size} Acres</span></div>
              <div>SOIL TYPE: <span className="text-white font-bold capitalize">{selectedFarm.soil?.type}</span></div>
              <div>PH LEVEL: <span className="text-white font-bold">{selectedFarm.soil?.pH}</span></div>
              <div>
                CROPS: <span className="text-emerald-400 font-bold">
                  {selectedFarm.crops && selectedFarm.crops.length > 0 
                    ? selectedFarm.crops.map(c => c.name).join(', ') 
                    : 'None Scheduled'}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tabs Selector Deck */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
        {[
          { id: 'chat', label: 'AI Agronomist Chat', icon: Bot },
          { id: 'disease', label: 'Diagnostic Lab', icon: Camera },
          { id: 'advisor', label: 'Soil Health & Fertilizer', icon: Activity },
          { id: 'yield', label: 'Yield Predictor', icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setError('');
              }}
              className={`flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold tracking-wide transition ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-900/40 border border-white/5 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl bg-rose-950/30 border border-rose-500/20 p-4 text-sm text-rose-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Dynamic Tab Body */}
      <div className="grid gap-6">

        {/* Tab 1: Chatbot */}
        {activeTab === 'chat' && (
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 shadow-xl backdrop-blur-md flex flex-col h-[500px]">
            {/* Chat Header */}
            <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-slate-950/40 rounded-t-3xl">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Bot className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Agronomy Advisory Bot</h3>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online</span>
              </div>
            </div>

            {/* Message Viewport */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-md rounded-2xl p-4 text-sm ${
                    msg.sender === 'user'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-950/50 border border-white/5 text-slate-300'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-950/50 border border-white/5 rounded-2xl p-4 text-sm text-slate-400 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-400" /> Agronomist is thinking...
                  </div>
                </div>
              )}
            </div>

            {/* Input Deck */}
            <form onSubmit={handleSendChat} className="p-4 border-t border-white/5 bg-slate-950/40 rounded-b-3xl flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about fertilizer ratios, crop blights, or soil properties..."
                className="flex-1 rounded-xl border border-white/10 bg-slate-900/50 py-3 px-4 text-sm text-white placeholder-slate-500 outline-none focus:border-primary-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-emerald-500 hover:bg-emerald-600 p-3 text-white transition flex items-center justify-center"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Diagnostic Lab */}
        {activeTab === 'disease' && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Input Form */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3">Analyze Crop Canopy</h3>
              
              <form onSubmit={handleDiagnose} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Diagnostic Target</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDiagnosticMode('disease')}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border transition ${
                        diagnosticMode === 'disease' 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                          : 'bg-slate-950/50 border-white/5 text-slate-500'
                      }`}
                    >
                      Disease Spotter
                    </button>
                    <button
                      type="button"
                      onClick={() => setDiagnosticMode('pest')}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border transition ${
                        diagnosticMode === 'pest' 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                          : 'bg-slate-950/50 border-white/5 text-slate-500'
                      }`}
                    >
                      Pest Identifier
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Crop Classification</label>
                  <input
                    type="text"
                    required
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    className="block w-full rounded-xl border border-white/10 bg-slate-950/50 py-3 px-4 text-sm text-white placeholder-slate-500 outline-none focus:border-primary-500"
                    placeholder="e.g. Mango, Tamarind, Tomato"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Upload Leaf/Stem Image</label>
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/10 rounded-2xl bg-slate-950/20 text-center cursor-pointer hover:border-emerald-500/30 transition relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="h-32 object-contain rounded-lg" />
                    ) : (
                      <>
                        <Camera className="h-8 w-8 text-slate-500 mb-2" />
                        <span className="text-xs text-slate-400 font-medium">Select canopy leaf photograph</span>
                        <span className="text-[9px] text-slate-500 mt-1">JPEG, PNG up to 5MB</span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-emerald-500 py-3.5 px-4 text-sm font-semibold text-white hover:brightness-105 transition shadow-lg"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Run AI Diagnostic'}
                </button>
              </form>
            </div>

            {/* Result Panel */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md flex flex-col justify-center">
              {diagnosticResult ? (
                <div className="space-y-6">
                  <div className="border-b border-white/5 pb-4">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 block font-mono">DIAGNOSTIC REPORT</span>
                    <h3 className="text-lg font-bold text-white mt-1">
                      {diagnosticMode === 'disease' ? diagnosticResult.disease : diagnosticResult.pest}
                    </h3>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5">
                      <span className="text-[9px] font-bold text-slate-500 uppercase block">Severity Rating</span>
                      <span className="text-sm font-semibold text-rose-400 block mt-1">
                        {diagnosticMode === 'disease' ? diagnosticResult.severity : diagnosticResult.threatScore}
                      </span>
                    </div>

                    <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5">
                      <span className="text-[9px] font-bold text-slate-500 uppercase block">Identified Triggers</span>
                      <span className="text-xs text-slate-300 block mt-1">
                        {diagnosticResult.cause || diagnosticResult.symptoms}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Treatment Protocols</h4>
                    <div className="p-4 rounded-xl border border-emerald-500/25 bg-emerald-500/5 space-y-2">
                      <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block">Organic Solution</span>
                      <p className="text-xs text-slate-300">{diagnosticResult.organicTreatment}</p>
                    </div>
                    <div className="p-4 rounded-xl border border-white/5 bg-slate-950/30 space-y-2">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Chemical Solution</span>
                      <p className="text-xs text-slate-300">{diagnosticResult.chemicalTreatment}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-10 text-slate-500">
                  <Sprout className="h-10 w-10 text-slate-600 mx-auto mb-2 animate-pulse" />
                  <p className="text-xs">Submit a leaf crop photo to trigger the AI Diagnostic Lab.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Soil & Fertilizer */}
        {activeTab === 'advisor' && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md">
              <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3 mb-4">Input Soil Chemistry Profile</h3>
              
              <form onSubmit={handleSoilAnalyze} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">pH Level</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={pH}
                      onChange={(e) => setPh(e.target.value)}
                      className="block w-full rounded-xl border border-white/10 bg-slate-950/50 p-3 text-sm text-white outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Nitrogen (N) mg/kg</label>
                    <input
                      type="number"
                      required
                      value={nitrogen}
                      onChange={(e) => setNitrogen(e.target.value)}
                      className="block w-full rounded-xl border border-white/10 bg-slate-950/50 p-3 text-sm text-white outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Phosphorus (P) mg/kg</label>
                    <input
                      type="number"
                      required
                      value={phosphorus}
                      onChange={(e) => setPhosphorus(e.target.value)}
                      className="block w-full rounded-xl border border-white/10 bg-slate-950/50 p-3 text-sm text-white outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Potassium (K) mg/kg</label>
                    <input
                      type="number"
                      required
                      value={potassium}
                      onChange={(e) => setPotassium(e.target.value)}
                      className="block w-full rounded-xl border border-white/10 bg-slate-950/50 p-3 text-sm text-white outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-emerald-500 py-3.5 px-4 text-sm font-semibold text-white hover:brightness-105 transition"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Analyze Soil Quality'}
                </button>
              </form>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md flex flex-col justify-center">
              {soilResult ? (
                <div className="space-y-6">
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-emerald-400 block font-mono">CHEMISTRY LAB ANALYSIS</span>
                    <div className="flex items-baseline justify-between mt-1">
                      <h3 className="text-lg font-bold text-white">Soil Rating: {soilResult.soil.qualityRating}</h3>
                      <span className="text-xs font-mono text-slate-400">Score: {soilResult.soil.score}/100</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-white/5 bg-slate-950/30 space-y-1">
                    <span className="text-[9px] text-slate-500 font-bold uppercase">Moisture Telemetry</span>
                    <p className="text-xs text-slate-300 font-medium">{soilResult.soil.moistureStatus}</p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Restoration Recommendations</h4>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/20 p-3.5 rounded-xl border border-white/5">
                      {soilResult.soil.recommendations}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-emerald-500/25 bg-emerald-500/5 space-y-2">
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block">Recommended NPK Supplement</span>
                    <div className="text-xs text-slate-300">
                      <div>Compound: <span className="text-white font-semibold">{soilResult.fertilizer.recommendedFertilizer}</span></div>
                      <div>Dosage: <span className="text-white font-semibold">{soilResult.fertilizer.dosage}</span></div>
                      <div className="mt-1 text-[11px] text-slate-400 italic">{soilResult.fertilizer.schedule}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-10 text-slate-500">
                  <Layers className="h-10 w-10 text-slate-600 mx-auto mb-2 animate-pulse" />
                  <p className="text-xs">Submit Soil NPK profiles to get nutrient prescriptions.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Yield Predictor */}
        {activeTab === 'yield' && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md">
              <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3 mb-4">Acreage Yield Calculator</h3>
              
              <form onSubmit={handleForecastYield} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Crop System</label>
                  <select
                    value={forecastCrop}
                    onChange={(e) => setForecastCrop(e.target.value)}
                    className="block w-full rounded-xl border border-white/10 bg-slate-950/50 py-3 px-4 text-sm text-white outline-none focus:border-primary-500"
                  >
                    <option value="Tomato">Tomato</option>
                    <option value="Corn">Corn</option>
                    <option value="Wheat">Wheat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Size (Acres)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={acresSize}
                    onChange={(e) => setAcresSize(e.target.value)}
                    className="block w-full rounded-xl border border-white/10 bg-slate-950/50 py-3 px-4 text-sm text-white outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Soil Quality</label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="block w-full rounded-xl border border-white/10 bg-slate-950/50 py-3 px-4 text-sm text-white outline-none focus:border-primary-500"
                  >
                    <option value="loamy">Loamy (Premium Balanced)</option>
                    <option value="clay">Clay (Dense Nutrient)</option>
                    <option value="sandy">Sandy (Free Draining)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-emerald-500 py-3.5 px-4 text-sm font-semibold text-white hover:brightness-105 transition"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Run Forecasting Math'}
                </button>
              </form>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md flex flex-col justify-center">
              {forecastResult ? (
                <div className="space-y-6">
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-emerald-400 block font-mono">FORECAST PROJECTIONS</span>
                    <h3 className="text-xl font-bold text-white mt-1">Expected Output: {forecastResult.expectedTons} Tons</h3>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                        <DollarSign className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase block">Est. Market Value</span>
                        <span className="text-sm font-bold text-white block">{forecastResult.estimatedValuation}</span>
                      </div>
                    </div>

                    <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase block">Confidence Score</span>
                        <span className="text-sm font-bold text-white block">{forecastResult.confidenceIndex}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 italic">
                    * Projections calculated using regional crop values, expected seasonal rainfall factors, and soil-type yield coefficients. Actual metrics may vary depending on active micro-climates.
                  </p>
                </div>
              ) : (
                <div className="text-center p-10 text-slate-500">
                  <TrendingUp className="h-10 w-10 text-slate-600 mx-auto mb-2 animate-pulse" />
                  <p className="text-xs">Input yield details to estimate target pricing valuations.</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AiAssistant;
