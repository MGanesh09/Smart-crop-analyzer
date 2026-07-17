import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const HeroAnimation = () => {
  const location = useLocation();
  const [activeHero, setActiveHero] = useState(null); // 'spiderman' | 'batman' | null
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [gridOffset, setGridOffset] = useState(0);

  // Mouse Parallax Effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 35; // 35px max deviation
      const y = (e.clientY / window.innerHeight - 0.5) * 35;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Periodic Hero triggers (every 14 seconds)
  useEffect(() => {
    const triggerHero = () => {
      const heroes = ['spiderman', 'batman'];
      const selected = heroes[Math.floor(Math.random() * heroes.length)];
      setActiveHero(selected);
      setTimeout(() => setActiveHero(null), 2500);
    };

    triggerHero();
    const interval = setInterval(triggerHero, 14000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  // Slowly shift grid overlay
  useEffect(() => {
    const interval = setInterval(() => {
      setGridOffset((prev) => (prev + 0.5) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-950/20 select-none">
      {/* Styles for futuristic neon auroras and 3D wireframe grids */}
      <style>{`
        @keyframes morphAurora {
          0%, 100% {
            transform: translate(0px, 0px) scale(1) rotate(0deg);
          }
          33% {
            transform: translate(30px, -50px) scale(1.15) rotate(120deg);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9) rotate(240deg);
          }
        }

        @keyframes holoSpidey {
          0% {
            transform: translate(-150px, -50px) rotate(45deg) scale(0.8);
            opacity: 0;
            filter: hue-rotate(0deg) drop-shadow(0 0 8px #ef4444);
          }
          15% { opacity: 0.8; }
          50% {
            transform: translate(50vw, 35vh) rotate(0deg) scale(1.1);
            filter: hue-rotate(15deg) drop-shadow(0 0 15px #10b981);
          }
          85% { opacity: 0.8; }
          100% {
            transform: translate(100vw, -100px) rotate(-45deg) scale(0.8);
            opacity: 0;
            filter: hue-rotate(0deg) drop-shadow(0 0 8px #ef4444);
          }
        }

        @keyframes holoBatman {
          0% {
            transform: translate(100vw, -50px) scale(0.6) rotate(-15deg);
            opacity: 0;
            filter: drop-shadow(0 0 8px #3b82f6);
          }
          15% { opacity: 0.85; }
          85% { opacity: 0.85; }
          100% {
            transform: translate(-250px, 80vh) scale(1.3) rotate(-10deg);
            opacity: 0;
            filter: drop-shadow(0 0 18px #a855f7);
          }
        }

        .aurora-orb {
          position: absolute;
          filter: blur(120px);
          opacity: 0.25;
          mix-blend-mode: screen;
          animation: morphAurora 18s ease-in-out infinite;
        }

        .holo-spidey {
          position: absolute;
          width: 140px;
          height: 140px;
          animation: holoSpidey 2.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        .holo-batman {
          position: absolute;
          width: 180px;
          height: 100px;
          animation: holoBatman 2.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        .cyber-grid {
          position: absolute;
          inset: 0;
          background-size: 60px 60px;
          background-image: 
            linear-gradient(to right, rgba(16, 185, 129, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(16, 185, 129, 0.04) 1px, transparent 1px);
        }

        .laser-line {
          position: absolute;
          height: 1px;
          width: 100%;
          background: linear-gradient(to right, transparent, rgba(16, 185, 129, 0.2), transparent);
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
        }
      `}</style>

      {/* 1. Fluid Neon Aurora Orbs (Interactive Parallax) */}
      <div 
        className="absolute inset-0 transition-transform duration-500 ease-out"
        style={{ transform: `translate3d(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px, 0)` }}
      >
        {/* Emerald Orb */}
        <div 
          className="aurora-orb w-[450px] h-[450px] bg-emerald-500/10 rounded-full top-[10%] left-[15%]"
          style={{ animationDelay: '0s' }}
        />
        {/* Teal Orb */}
        <div 
          className="aurora-orb w-[550px] h-[550px] bg-teal-500/10 rounded-full bottom-[15%] right-[10%]"
          style={{ animationDelay: '-6s', animationDuration: '22s' }}
        />
        {/* Indigo/Purple Orb */}
        <div 
          className="aurora-orb w-[400px] h-[400px] bg-indigo-600/10 rounded-full top-[40%] right-[30%]"
          style={{ animationDelay: '-12s', animationDuration: '14s' }}
        />
      </div>

      {/* 2. Cyber-Agriculture Grid Overlay */}
      <div 
        className="cyber-grid transition-transform duration-300 ease-out"
        style={{ 
          transform: `translate3d(${mousePos.x * 0.25}px, ${mousePos.y * 0.25}px, 0)`,
          backgroundPositionY: `${gridOffset}px`
        }}
      />

      {/* Scanning Laser Line */}
      <div 
        className="laser-line"
        style={{
          top: `${gridOffset}%`,
          transition: 'top 0.05s linear'
        }}
      />

      {/* 3. Holographic periodic hero cameos */}
      <div 
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{ transform: `translate3d(${mousePos.x * 0.6}px, ${mousePos.y * 0.6}px, 0)` }}
      >
        {activeHero === 'spiderman' && (
          <div className="holo-spidey">
            {/* Hanging web line */}
            <div className="absolute top-[-1000px] left-1/2 w-[1px] h-[1000px] bg-gradient-to-b from-transparent to-emerald-400/50" />
            
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Holographic Glowing Outline of Spider-Man */}
              <circle cx="50" cy="50" r="16" fill="none" stroke="#10b981" strokeWidth="1.5" />
              <circle cx="50" cy="24" r="11" fill="none" stroke="#10b981" strokeWidth="1.5" />
              <path d="M 44,22 Q 47,19 48,24" fill="none" stroke="#10b981" strokeWidth="1.2" />
              <path d="M 56,22 Q 53,19 52,24" fill="none" stroke="#10b981" strokeWidth="1.2" />
              <path d="M 50,38 L 50,62 M 38,50 L 62,50 M 42,42 L 58,58 M 42,58 L 58,42" stroke="#10b981" strokeWidth="0.5" opacity="0.6" />
              <path d="M 50,16 L 50,0" stroke="#10b981" strokeWidth="2.5" />
              <path d="M 44,28 Q 30,10 50,5" fill="none" stroke="#10b981" strokeWidth="2" />
              <path d="M 45,64 Q 35,78 28,75" fill="none" stroke="#10b981" strokeWidth="2.5" />
              <path d="M 55,64 Q 65,82 72,85" fill="none" stroke="#10b981" strokeWidth="2.5" />
            </svg>
          </div>
        )}

        {activeHero === 'batman' && (
          <div className="holo-batman">
            <svg viewBox="0 0 200 100" className="w-full h-full">
              {/* Holographic Outline of Batman */}
              <path 
                d="M 10,40 
                   Q 40,25 100,10 
                   Q 160,25 190,40 
                   Q 165,65 140,55 
                   Q 120,85 100,60 
                   Q 80,85 60,55 
                   Q 35,65 10,40 Z" 
                fill="none" 
                stroke="#6366f1" 
                strokeWidth="1.5" 
              />
              <path d="M 94,22 L 94,11 L 97,14 L 103,14 L 106,11 L 106,22 Z" fill="none" stroke="#6366f1" strokeWidth="1.5" />
              <circle cx="100" cy="20" r="5" fill="none" stroke="#6366f1" strokeWidth="1.5" />
              <rect x="94" y="38" width="12" height="3" rx="1" fill="none" stroke="#eab308" strokeWidth="1.2" />
              <path d="M 96,41 L 92,58 M 104,41 L 108,58" stroke="#6366f1" strokeWidth="1.5" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroAnimation;
