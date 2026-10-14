// src/components/graphics/LampBack.jsx
import React from 'react';

export default function LampBack({ x = 0, y = 0, activeTerminal = null, onTerminalClick }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Staffa metallica per la Messa a Terra (sporge sulla destra) */}
      <rect x="70" y="70" width="40" height="30" rx="5" fill="#95a5a6" stroke="#7f8c8d" strokeWidth="2" />
      <text x="100" y="115" fill="#7f8c8d" fontSize="10" fontWeight="bold">PE</text>

      {/* Corpo in ceramica del portalampada */}
      <circle cx="60" cy="60" r="50" fill="#ecf0f1" stroke="#bdc3c7" strokeWidth="4" />
      <circle cx="60" cy="60" r="30" fill="#e0e6ed" stroke="#bdc3c7" strokeWidth="1" />

      {/* --- MORSETTO L (Fase / Ritorno Lampada) - CENTRO ALTO --- */}
      <g transform="translate(60, 35)" style={{ cursor: 'pointer' }} onClick={() => onTerminalClick && onTerminalClick('L')}>
        <rect x="-14" y="-14" width="28" height="28" rx="4" fill="#d35400" stroke="#e67e22" strokeWidth="2" />
        <circle cx="0" cy="0" r="8" fill="#7f8c8d" stroke="#2c3e50" strokeWidth="1.5" />
        <line x1="-5" y1="0" x2="5" y2="0" stroke="#2c3e50" strokeWidth="2" />
        <text x="0" y="-18" fill="#2c3e50" fontSize="12" textAnchor="middle" fontWeight="bold">L</text>
        <circle cx="0" cy="0" r="14" fill="none" stroke={activeTerminal === 'L' ? '#2ed573' : 'transparent'} strokeWidth="3" strokeDasharray="3,3" />
      </g>

      {/* --- MORSETTO N (Neutro) - BASSO SINISTRA --- */}
      <g transform="translate(30, 80)" style={{ cursor: 'pointer' }} onClick={() => onTerminalClick && onTerminalClick('N')}>
        <rect x="-14" y="-14" width="28" height="28" rx="4" fill="#d35400" stroke="#e67e22" strokeWidth="2" />
        <circle cx="0" cy="0" r="8" fill="#7f8c8d" stroke="#2c3e50" strokeWidth="1.5" />
        <line x1="-5" y1="0" x2="5" y2="0" stroke="#2c3e50" strokeWidth="2" />
        <text x="-20" y="5" fill="#2c3e50" fontSize="12" textAnchor="middle" fontWeight="bold">N</text>
        <circle cx="0" cy="0" r="14" fill="none" stroke={activeTerminal === 'N' ? '#2ed573' : 'transparent'} strokeWidth="3" strokeDasharray="3,3" />
      </g>

      {/* --- MORSETTO PE (Messa a Terra) - BASSO DESTRA SULLA STAFFA --- */}
      <g transform="translate(95, 85)" style={{ cursor: 'pointer' }} onClick={() => onTerminalClick && onTerminalClick('PE')}>
        <rect x="-14" y="-14" width="28" height="28" rx="4" fill="#f1c40f" stroke="#e67e22" strokeWidth="2" /> {/* Colore distintivo (Giallo ottone) */}
        <circle cx="0" cy="0" r="8" fill="#7f8c8d" stroke="#2c3e50" strokeWidth="1.5" />
        <line x1="-5" y1="0" x2="5" y2="0" stroke="#2c3e50" strokeWidth="2" />
        {/* Simbolo di Terra CEI inciso */}
        <line x1="0" y1="-18" x2="0" y2="-24" stroke="#2c3e50" strokeWidth="1.5" />
        <line x1="-6" y1="-24" x2="6" y2="-24" stroke="#2c3e50" strokeWidth="1.5" />
        <line x1="-4" y1="-27" x2="4" y2="-27" stroke="#2c3e50" strokeWidth="1.5" />
        <line x1="-2" y1="-30" x2="2" y2="-30" stroke="#2c3e50" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="14" fill="none" stroke={activeTerminal === 'PE' ? '#2ed573' : 'transparent'} strokeWidth="3" strokeDasharray="3,3" />
      </g>
    </g>
  );
}