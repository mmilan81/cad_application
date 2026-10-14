// src/components/graphics/LampFront.jsx
import React from 'react';

export default function LampFront({ x = 0, y = 0, isOn = false }) {
  // Colori dinamici in base allo stato
  const bulbColor = isOn ? '#f1c40f' : '#ecf0f1'; // Giallo acceso vs Grigio spento
  const filamentColor = isOn ? '#fff200' : '#7f8c8d';
  
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Definizione dei filtri luminosi */}
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={isOn ? "15" : "0"} result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Bagliore di fondo (visibile solo se accesa) */}
      {isOn && (
        <circle cx="60" cy="45" r="45" fill="rgba(241, 196, 15, 0.4)" filter="url(#glow)" />
      )}

      {/* Base portalampada (Guscio esterno plastico/ceramico) */}
      <path d="M 35 80 L 85 80 L 90 120 L 30 120 Z" fill="#bdc3c7" stroke="#7f8c8d" strokeWidth="2" />
      
      {/* Bulbo di Vetro */}
      <circle cx="60" cy="45" r="35" fill={bulbColor} stroke="#95a5a6" strokeWidth="2" opacity="0.9" />
      
      {/* Filamento interno decorativo */}
      <path d="M 50 65 L 50 50 L 60 40 L 70 50 L 70 65" fill="none" stroke={filamentColor} strokeWidth="2" />
      
      {/* Riflesso del vetro (per dare tridimensionalità) */}
      <path d="M 40 30 A 20 20 0 0 1 70 20" fill="none" stroke="#ffffff" strokeWidth="3" opacity="0.5" strokeLinecap="round" />
    </g>
  );
}