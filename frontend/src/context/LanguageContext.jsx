import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Nav Links
    dashboard: 'Dashboard',
    farms: 'Farms Management',
    ai: 'AI Intelligence',
    market: 'Market Planning',
    reports: 'Farm Reports',
    forum: 'Community Forum',
    profile: 'User Profile',
    signOut: 'Sign Out',
    
    // Core Layout
    welcome: 'Welcome Back',
    nodeStatus: 'Node Status',
    transmitting: 'Soil nodes are transmitting active moisture telemetry logs.',
    
    // Common Actions
    addNode: 'Add Farm Node',
    locate: 'Locate',
    clearBoundary: 'Clear Boundary',
    cancel: 'Cancel',
    save: 'Save Node details',
    add: 'Add',
    
    // NPK Soil terms
    nitrogen: 'Nitrogen level (N) mg/kg',
    phosphorus: 'Phosphorus level (P) mg/kg',
    potassium: 'Potassium level (K) mg/kg',
    ph: 'Soil pH Level',
    moisture: 'Soil Moisture (%)',
    soilType: 'Soil Classification',
    farmSize: 'Farm Size (Acres)',
    farmName: 'Farm Name',
    district: 'Location Name / District',
    
    // AI Tabs
    chatTab: 'AI Agronomist Chat',
    labTab: 'Diagnostic Lab',
    soilTab: 'Soil Health & Fertilizer',
    yieldTab: 'Yield Predictor',
    
    // AI Headers
    botHeader: 'Agronomy Advisory Bot',
    botOnline: 'Online',
    chatPlaceholder: 'Ask about fertilizer ratios, crop blights, or soil properties...',
  },
  te: {
    // Nav Links
    dashboard: 'డాష్‌బోర్డ్',
    farms: 'పొలాల నిర్వహణ',
    ai: 'AI ఇంటెలిజెన్స్',
    market: 'మార్కెట్ ప్లానింగ్',
    reports: 'వ్యవసాయ నివేదికలు',
    forum: 'కమ్యూనిటీ ఫోరమ్',
    profile: 'యూజర్ ప్రొఫైల్',
    signOut: 'సైన్ అవుట్',
    
    // Core Layout
    welcome: 'తిరిగి స్వాగతం',
    nodeStatus: 'నోడ్ స్థితి',
    transmitting: 'నేల నోడ్స్ క్రియాశీల తేమ టెలిమెట్రీ లాగ్‌లను ప్రసారం చేస్తున్నాయి.',
    
    // Common Actions
    addNode: 'కొత్త పొలం నోడ్',
    locate: 'గుర్తించు',
    clearBoundary: 'సరిహద్దు తుడిచివేయి',
    cancel: 'రద్దు చేయి',
    save: 'పొలం వివరాలు సేవ్ చేయి',
    add: 'జోడించు',
    
    // NPK Soil terms
    nitrogen: 'నత్రజని స్థాయి (N) mg/kg',
    phosphorus: 'భాస్వరం స్థాయి (P) mg/kg',
    potassium: 'పొటాషియం స్థాయి (K) mg/kg',
    ph: 'నేల pH స్థాయి',
    moisture: 'నేల తేమ (%)',
    soilType: 'నేల రకం వర్గీకరణ',
    farmSize: 'పొలం పరిమాణం (ఎకరాలు)',
    farmName: 'పొలం పేరు',
    district: 'ప్రాంతం పేరు / జిల్లా',
    
    // AI Tabs
    chatTab: 'AI వ్యవసాయ చాట్',
    labTab: 'రోగనిర్ధారణ లాబ్',
    soilTab: 'నేల ఆరోగ్యం & ఎరువులు',
    yieldTab: 'దిగుబడి అంచనా',
    
    // AI Headers
    botHeader: 'వ్యవసాయ సలహా బోట్',
    botOnline: 'ఆన్‌లైన్',
    chatPlaceholder: 'ఎరువుల నిష్పత్తులు, తెగుళ్లు లేదా నేల లక్షణాల గురించి అడగండి...',
  },
  hi: {
    // Nav Links
    dashboard: 'डैशबोर्ड',
    farms: 'खेतों का प्रबंधन',
    ai: 'एआई इंटेलिजेंस',
    market: 'बाजार योजना',
    reports: 'कृषि रिपोर्ट',
    forum: 'सामुदायिक मंच',
    profile: 'उपयोगकर्ता प्रोफ़ाइल',
    signOut: 'साइन आउट',
    
    // Core Layout
    welcome: 'वापस स्वागत है',
    nodeStatus: 'नोड स्थिति',
    transmitting: 'मिट्टी के नोड्स सक्रिय नमी टेलीमेट्री लॉग प्रेषित कर रहे हैं।',
    
    // Common Actions
    addNode: 'नया खेत जोड़ें',
    locate: 'खोजें',
    clearBoundary: 'समीकरण हटाएं',
    cancel: 'रद्द करें',
    save: 'खेत विवरण सहेजें',
    add: 'जोड़ें',
    
    // NPK Soil terms
    nitrogen: 'नाइट्रोजन स्तर (N) mg/kg',
    phosphorus: 'फास्फोरस स्तर (P) mg/kg',
    potassium: 'पोटेशियम स्तर (K) mg/kg',
    ph: 'मिट्टी पीएच स्तर',
    moisture: 'मिट्टी की नमी (%)',
    soilType: 'मिट्टी का वर्गीकरण',
    farmSize: 'खेत का आकार (एकड़)',
    farmName: 'खेत का नाम',
    district: 'स्थान का नाम / जिला',
    
    // AI Tabs
    chatTab: 'एआई कृषि चैट',
    labTab: 'नैदानिक प्रयोगशाला',
    soilTab: 'मिट्टी स्वास्थ्य और उर्वरक',
    yieldTab: 'उपज भविष्यवक्ता',
    
    // AI Headers
    botHeader: 'कृषि सलाहकार बॉट',
    botOnline: 'ऑनलाइन',
    chatPlaceholder: 'उर्वरक अनुपात, फसल कीट या मिट्टी के गुणों के बारे में पूछें...',
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key) => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);
