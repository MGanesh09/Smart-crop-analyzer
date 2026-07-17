import React, { useState, useEffect, useRef } from 'react';
import { Compass, RotateCcw, MapPin, Loader2 } from 'lucide-react';

const InteractiveMap = ({ boundary = [], onChange, center, height = '350px' }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const polygonInstance = useRef(null);
  const markersRef = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [points, setPoints] = useState(boundary);

  // Sync internal points with boundary prop
  useEffect(() => {
    if (JSON.stringify(boundary) !== JSON.stringify(points)) {
      setPoints(boundary);
    }
  }, [boundary]);

  // Update map viewport when center prop changes dynamically
  useEffect(() => {
    if (!mapInstance.current || !mapLoaded) return;
    const isGoogle = !!window.google && !mapInstance.current.setView;
    if (center && center.lat && center.lng) {
      if (isGoogle) {
        mapInstance.current.panTo(center);
      } else {
        mapInstance.current.setView([center.lat, center.lng], 18);
      }
    }
  }, [center, mapLoaded]);

  // Load Map dynamically in browser
  useEffect(() => {
    const initMap = async () => {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

      if (apiKey && apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY') {
        // Load Real Google Maps
        if (!window.google) {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
          script.async = true;
          script.defer = true;
          script.onload = () => setupGoogleMap();
          document.head.appendChild(script);
        } else {
          setupGoogleMap();
        }
      } else {
        // Load Real Leaflet Map (Free Satellite Imagery)
        if (!window.L) {
          // CSS
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
          // JS
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = () => setupLeafletMap();
          document.head.appendChild(script);
        } else {
          setupLeafletMap();
        }
      }
    };

    initMap();

    return () => {
      // Cleanup leaflet map instance on unmount
      if (mapInstance.current && mapInstance.current.remove) {
        mapInstance.current.remove();
      }
    };
  }, []);

  // Update polygon/markers when points change (for Leaflet)
  useEffect(() => {
    if (!mapLoaded || !mapInstance.current) return;
    
    const isGoogle = !!window.google && !mapInstance.current.setView;
    if (isGoogle) {
      updateGooglePolygon();
    } else {
      updateLeafletPolygon();
    }
  }, [points, mapLoaded]);

  // Google Maps setup
  const setupGoogleMap = () => {
    if (!mapRef.current) return;
    const initialCenter = points.length > 0 ? points[0] : (center || { lat: 20.5937, lng: 78.9629 });
    
    const map = new window.google.maps.Map(mapRef.current, {
      center: initialCenter,
      zoom: 16,
      mapTypeId: 'satellite',
      disableDefaultUI: true,
      zoomControl: true,
    });
    
    mapInstance.current = map;

    // Add click handler to add points
    map.addListener('click', (e) => {
      const newPt = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setPoints((prev) => {
        const next = [...prev, newPt];
        if (onChange) onChange(next);
        return next;
      });
    });

    setMapLoaded(true);
  };

  const updateGooglePolygon = () => {
    const google = window.google;
    if (!mapInstance.current) return;

    if (polygonInstance.current) {
      polygonInstance.current.setMap(null);
    }

    // Draw path
    polygonInstance.current = new google.maps.Polygon({
      paths: points,
      strokeColor: '#34d399',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#34d399',
      fillOpacity: 0.15,
      map: mapInstance.current,
    });
  };

  // Leaflet Maps setup (Standard Satellite fallback)
  const setupLeafletMap = () => {
    if (!mapRef.current || mapInstance.current) return;
    
    const initialCenter = points.length > 0 
      ? [points[0].lat, points[0].lng] 
      : (center ? [center.lat, center.lng] : [20.5937, 78.9629]);
    
    // Initialize map
    const L = window.L;
    const map = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: false
    }).setView(center, 15);
    
    mapInstance.current = map;

    // Load Google Maps Hybrid Tile Layer (Real Google Maps Satellite + Names + Villages + Borders!)
    L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      maxZoom: 20,
    }).addTo(map);

    // Force Leaflet to recalculate size in dynamic overlays/modals
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    // Map click handler
    map.on('click', (e) => {
      const newPt = { lat: e.latlng.lat, lng: e.latlng.lng };
      setPoints((prev) => {
        const next = [...prev, newPt];
        if (onChange) onChange(next);
        return next;
      });
    });

    setMapLoaded(true);
  };

  const updateLeafletPolygon = () => {
    const L = window.L;
    const map = mapInstance.current;
    if (!map) return;

    // Clear old layers
    if (polygonInstance.current) {
      map.removeLayer(polygonInstance.current);
    }
    markersRef.current.forEach((marker) => map.removeLayer(marker));
    markersRef.current = [];

    const latLngs = points.map((p) => [p.lat, p.lng]);

    // Draw polygon
    if (latLngs.length > 1) {
      polygonInstance.current = L.polygon(latLngs, {
        color: '#34d399',
        fillColor: '#34d399',
        fillOpacity: 0.15,
        weight: 2,
      }).addTo(map);
    }

    // Add markers
    points.forEach((pt, idx) => {
      // Custom div icon for numbers
      const icon = L.divIcon({
        className: 'custom-map-marker',
        html: `<div class="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 border border-white text-white font-mono font-bold text-[9px]">${idx + 1}</div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const marker = L.marker([pt.lat, pt.lng], { icon, draggable: true }).addTo(map);
      
      // Update coordinates on dragend
      marker.on('dragend', (e) => {
        const newLatLng = e.target.getLatLng();
        setPoints((prev) => {
          const next = [...prev];
          next[idx] = { lat: newLatLng.lat, lng: newLatLng.lng };
          if (onChange) onChange(next);
          return next;
        });
      });

      markersRef.current.push(marker);
    });
  };

  const clearBoundary = (e) => {
    e.stopPropagation();
    setPoints([]);
    if (onChange) onChange([]);
  };

  // Estimate farm size using Shoelace formula
  const calculateEstimatedAcres = () => {
    if (points.length < 3) return 0;
    let area = 0;
    const factor = 111300; // rough meter scale factor per degree lat
    
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];
      
      const x1 = p1.lng * factor * Math.cos(p1.lat * (Math.PI / 180));
      const y1 = p1.lat * factor;
      const x2 = p2.lng * factor * Math.cos(p2.lat * (Math.PI / 180));
      const y2 = p2.lat * factor;
      
      area += (x1 * y2) - (x2 * y1);
    }
    
    const sqm = Math.abs(area / 2);
    const acres = sqm * 0.000247105;
    return acres.toFixed(1);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Satellite GIS Mapping Quad</span>
        <button
          type="button"
          onClick={clearBoundary}
          className="flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 px-3 py-1.5 text-xs font-bold transition"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Clear Boundary
        </button>
      </div>

      <div
        style={{ height }}
        className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-slate-950 shadow-inner"
      >
        {/* Loading overlay */}
        {!mapLoaded && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/90 gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">Initializing GPS layers...</span>
          </div>
        )}

        {/* Map Mount Point */}
        <div ref={mapRef} className="w-full h-full z-10" />

        {/* HUD Info Box */}
        {mapLoaded && (
          <div className="absolute bottom-3 left-3 z-20 bg-slate-900/90 border border-white/10 rounded-xl p-3 pointer-events-none font-mono text-[9px] text-slate-400 space-y-1 shadow-2xl">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
              <span className="font-bold text-emerald-400">TELEMETRY LOCK</span>
            </div>
            <div>EST. AREA: <span className="text-white font-semibold">{calculateEstimatedAcres()} Acres</span></div>
            <div>NODES: <span className="text-white font-semibold">{points.length} coordinates</span></div>
          </div>
        )}
      </div>
      <p className="text-[10px] text-slate-500 italic pl-1">
        * Click anywhere on the map to define boundary coordinates. Drag the numbered points to modify boundaries.
      </p>
    </div>
  );
};

export default InteractiveMap;
