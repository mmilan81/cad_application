// src/components/graphics/SwitchFront.jsx
import React from 'react';

export default function SwitchFront({ x = 0, y = 0, position = 'A', onToggle }) {
  const isPosA = position === 'A';

  return (
    <g transform={`translate(${x}, ${y})`} onClick={onToggle} style={{ cursor: 'pointer' }}>
      {/* Placca/Cornice Esterna */}
      <rect x="0" y="0" width="120" height="160" rx="12" fill="#ecf0f1" stroke="#bdc3c7" strokeWidth="3" filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.3))" />
      <rect x="8" y="8" width="104" height="144" rx="8" fill="#dcdde1" />

      {/* Sede del Tasto */}
      <rect x="20" y="20" width="80" height="120" rx="4" fill="#7f8c8d" />

      {/* Tasto Basculante con Effetto 3D (Simula inclinazione in alto o in basso) */}
      <rect 
        x="24" 
        y="24" 
        width="72" 
        height="112" 
        rx="3" 
        fill={isPosA ? 'url(#toggleGradA)' : 'url(#toggleGradB)'} 
        stroke="#bdc3c7" 
        strokeWidth="1"
      />

      {/* Definizioni dei gradienti per l'inclinazione 3D */}
      <defs>
        <linearGradient id="toggleGradA" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#dcdde1" />
          <stop offset="100%" stopColor="#95a5a6" />
        </linearGradient>
        <linearGradient id="toggleGradB" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#95a5a6" />
          <stop offset="30%" stopColor="#dcdde1" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>

      {/* Intaglio tattile centrale (linea decorativa tipo Vimar/BTicino) */}
      <line x1="45" y1="80" x2="75" y2="80" stroke="#b2bec3" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}