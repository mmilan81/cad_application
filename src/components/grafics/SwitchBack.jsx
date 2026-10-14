// src/components/graphics/SwitchBack.jsx
import React from 'react';

export default function SwitchBack({ x = 0, y = 0, activeTerminal = null, onTerminalClick }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Corpo Principale in Plastica Scura */}
      <rect x="0" y="0" width="120" height="160" rx="10" fill="#2c3e50" stroke="#1a252f" strokeWidth="3" />
      <rect x="10" y="10" width="100" height="140" rx="6" fill="#34495e" />
      
      {/* Etichetta Modello Incisa */}
      <text x="60" y="28" fill="#7f8c8d" fontSize="9" textAnchor="middle" fontWeight="bold">DEV 16A - 250V~</text>

      {/* --- MORSETTO L (Comune) - ALTO CENTRO --- */}
      <g transform="translate(60, 50)" style={{ cursor: 'pointer' }} onClick={() => onTerminalClick && onTerminalClick('L')}>
        {/* Blocco Morsetto Ottone */}
        <rect x="-16" y="-16" width="32" height="32" rx="4" fill="#d35400" stroke="#e67e22" strokeWidth="2" />
        {/* Vite con intaglio a croce */}
        <circle cx="0" cy="0" r="10" fill="#7f8c8d" stroke="#2c3e50" strokeWidth="1.5" />
        <line x1="-6" y1="0" x2="6" y2="0" stroke="#2c3e50" strokeWidth="2" />
        <line x1="0" y1="-6" x2="0" y2="6" stroke="#2c3e50" strokeWidth="2" />
        {/* Etichetta Morsetto */}
        <text x="0" y="-22" fill="#ecf0f1" fontSize="12" textAnchor="middle" fontWeight="bold">L</text>
        {/* Anello Magnetico di Snap (evidenziato se attivo) */}
        <circle cx="0" cy="0" r="15" fill="none" stroke={activeTerminal === 'L' ? '#2ed573' : 'transparent'} strokeWidth="3" strokeDasharray="3,3" />
      </g>

      {/* --- MORSETTO 1 (Deviata 1) - BASSO SINISTRA --- */}
      <g transform="translate(35, 120)" style={{ cursor: 'pointer' }} onClick={() => onTerminalClick && onTerminalClick('1')}>
        <rect x="-16" y="-16" width="32" height="32" rx="4" fill="#d35400" stroke="#e67e22" strokeWidth="2" />
        <circle cx="0" cy="0" r="10" fill="#7f8c8d" stroke="#2c3e50" strokeWidth="1.5" />
        <line x1="-6" y1="0" x2="6" y2="0" stroke="#2c3e50" strokeWidth="2" />
        <line x1="0" y1="-6" x2="0" y2="6" stroke="#2c3e50" strokeWidth="2" />
        <text x="0" y="28" fill="#ecf0f1" fontSize="12" textAnchor="middle" fontWeight="bold">1</text>
        <circle cx="0" cy="0" r="15" fill="none" stroke={activeTerminal === '1' ? '#2ed573' : 'transparent'} strokeWidth="3" strokeDasharray="3,3" />
      </g>

      {/* --- MORSETTO 2 (Deviata 2) - BASSO DESTRA --- */}
      <g transform="translate(85, 120)" style={{ cursor: 'pointer' }} onClick={() => onTerminalClick && onTerminalClick('2')}>
        <rect x="-16" y="-16" width="32" height="32" rx="4" fill="#d35400" stroke="#e67e22" strokeWidth="2" />
        <circle cx="0" cy="0" r="10" fill="#7f8c8d" stroke="#2c3e50" strokeWidth="1.5" />
        <line x1="-6" y1="0" x2="6" y2="0" stroke="#2c3e50" strokeWidth="2" />
        <line x1="0" y1="-6" x2="0" y2="6" stroke="#2c3e50" strokeWidth="2" />
        <text x="0" y="28" fill="#ecf0f1" fontSize="12" textAnchor="middle" fontWeight="bold">2</text>
        <circle cx="0" cy="0" r="15" fill="none" stroke={activeTerminal === '2' ? '#2ed573' : 'transparent'} strokeWidth="3" strokeDasharray="3,3" />
      </g>
    </g>
  );
}