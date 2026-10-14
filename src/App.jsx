// src/App.jsx
import React, { useState, useRef } from 'react';
import Workspace from './components/Workspace';

function App() {
  const [mode, setMode] = useState('DESIGN');
  const [wireColor, setWireColor] = useState('#8B4513');
  const [simResult, setSimResult] = useState(null);

  const workspaceRef = useRef(null);

  const handleToggleMode = () => {
    const nextMode = mode === 'DESIGN' ? 'SIMULATE' : 'DESIGN';
    setMode(nextMode);

    if (nextMode === 'SIMULATE') {
      if (workspaceRef.current) {
        const res = workspaceRef.current.runSimulation();
        setSimResult(res);
      }
    } else {
      setSimResult(null);
    }
  };

  const handleAddComponent = (componentType) => {
    if (mode === 'SIMULATE') return;
    if (workspaceRef.current) {
      workspaceRef.current.addDevice(componentType);
    }
  };

  const handleClearCanvas = () => {
    if (mode === 'SIMULATE') return;
    if (window.confirm('Sei sicuro di voler cancellare tutto il circuito?')) {
      if (workspaceRef.current) {
        workspaceRef.current.clearBoard();
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header style={{ padding: '15px 20px', background: '#2c3e50', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '20px' }}>⚡ CAD Didattico - Livello 1</h1>
        <button 
          onClick={handleToggleMode}
          style={{ padding: '10px 20px', fontSize: '16px', fontWeight: 'bold', background: mode === 'DESIGN' ? '#27ae60' : '#e67e22', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          {mode === 'DESIGN' ? '▶️ Passa a SIMULA' : '✏️ Torna a CABLAGGIO'}
        </button>
      </header>

      <div style={{ display: 'flex', flex: 1, padding: '20px', gap: '20px', position: 'relative' }}>
        
        {/* BARRA SINISTRA: Cavi e Pulisci */}
        <aside style={{ width: '220px', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', opacity: mode === 'SIMULATE' ? 0.5 : 1, pointerEvents: mode === 'SIMULATE' ? 'none' : 'auto' }}>
          <div>
            <h3 style={{ marginTop: 0, color: '#34495e' }}>Colore Cavo</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={() => setWireColor('#8B4513')} style={{ background: '#8B4513', color: 'white', padding: '12px', border: wireColor === '#8B4513' ? '3px solid #2c3e50' : 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Fase (Marrone)</button>
              <button onClick={() => setWireColor('#0000FF')} style={{ background: '#0000FF', color: 'white', padding: '12px', border: wireColor === '#0000FF' ? '3px solid #2c3e50' : 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Neutro (Blu)</button>
              <button onClick={() => setWireColor('#2ed573')} style={{ background: '#2ed573', color: 'black', padding: '12px', border: wireColor === '#2ed573' ? '3px solid #2c3e50' : 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Terra (Giallo/Verde)</button>
            </div>
          </div>

          <button 
            onClick={handleClearCanvas}
            style={{ padding: '12px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            🗑️ Pulisci Foglio
          </button>
        </aside>

        {/* CENTRO: Foglio da disegno */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: mode === 'DESIGN' ? '#e0e6ed' : '#2c3e50', borderRadius: '8px', transition: 'background 0.3s' }}>
          <Workspace ref={workspaceRef} currentMode={mode} wireColor={wireColor} onSimUpdate={(res) => setSimResult(res)} />

          {/* BANNER RISULTATO SIMULAZIONE */}
          {mode === 'SIMULATE' && simResult && (
            <div style={{
              marginTop: '15px', padding: '15px 25px', borderRadius: '6px', width: '90%', textAlign: 'center',
              fontWeight: 'bold', fontSize: '15px',
              background: simResult.status === 'SUCCESS' ? '#2ed573' : simResult.status === 'WARNING' ? '#ffa502' : simResult.status === 'ERROR' ? '#ff4757' : '#74b9ff',
              color: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
            }}>
              {simResult.message}
            </div>
          )}
        </main>

        {/* BARRA DESTRA: Libreria Componenti */}
        <aside style={{ width: '240px', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', opacity: mode === 'SIMULATE' ? 0.5 : 1, pointerEvents: mode === 'SIMULATE' ? 'none' : 'auto' }}>
          <h3 style={{ marginTop: 0, color: '#34495e' }}>Libreria</h3>
          <p style={{ fontSize: '13px', color: '#7f8c8d', marginTop: '-10px' }}>Clicca per aggiungere</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button 
              onClick={() => handleAddComponent('INTERRUTTORE')}
              style={{ padding: '12px 10px', background: '#ecf0f1', color: '#2c3e50', border: '2px solid #bdc3c7', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              🔘 Interruttore
            </button>

            <button 
              onClick={() => handleAddComponent('DEVIATORE')}
              style={{ padding: '12px 10px', background: '#ecf0f1', color: '#2c3e50', border: '2px solid #bdc3c7', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              🔌 Deviatore
            </button>

            <button 
              onClick={() => handleAddComponent('LAMPADA')}
              style={{ padding: '12px 10px', background: '#ecf0f1', color: '#2c3e50', border: '2px solid #bdc3c7', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              💡 Punto Luce
            </button>

            <button 
              onClick={() => handleAddComponent('MAGNETOTERMICO')}
              style={{ padding: '12px 10px', background: '#ecf0f1', color: '#2c3e50', border: '2px solid #bdc3c7', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              ⚡ Magnetotermico
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
}

export default App;