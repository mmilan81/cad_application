// src/App.jsx
import React, { useState, useRef } from 'react';
import Workspace from './components/Workspace';
import ExercisesMenu from './components/ExercisesMenu';
import './App.css'; // <-- Importiamo il file CSS appena creato!

function App() {
  const [mode, setMode] = useState('DESIGN');
  const [wireColor, setWireColor] = useState('#8B4513');
  const [simResult, setSimResult] = useState(null);
  const [activeExercise, setActiveExercise] = useState(null);

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
        setActiveExercise(null);
      }
    }
  };

  const handleSelectExercise = (exercise) => {
    setActiveExercise(exercise);
    setMode('DESIGN');
    setSimResult(null);
    
    if (workspaceRef.current) {
      workspaceRef.current.clearBoard();
      
      exercise.components.forEach((compType, index) => {
        setTimeout(() => {
          if (workspaceRef.current) {
            workspaceRef.current.addDevice(compType);
          }
        }, index * 100);
      });
    }
  };

  return (
    <div className="app-container">
      
      <header className="app-header">
        <h1>⚡ CAD Didattico - Livello 1</h1>
        <button 
          onClick={handleToggleMode}
          className={`toggle-mode-btn ${mode === 'DESIGN' ? 'design' : 'simulate'}`}
        >
          {mode === 'DESIGN' ? '▶️ Passa a SIMULA' : '✏️ Torna a CABLAGGIO'}
        </button>
      </header>

      <div className="main-content">
        
        {/* BARRA SINISTRA */}
        <aside 
          className="sidebar sidebar-left" 
          style={{ opacity: mode === 'SIMULATE' ? 0.5 : 1, pointerEvents: mode === 'SIMULATE' ? 'none' : 'auto' }}
        >
          <div style={{ marginBottom: '20px' }}>
            <ExercisesMenu onSelectExercise={handleSelectExercise} />
            
            {activeExercise && (
              <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#e8f4f8', borderRadius: '8px', border: '1px solid #3498db' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#2980b9', fontSize: '14px' }}>In corso: {activeExercise.title}</h4>
                <p style={{ margin: 0, fontSize: '12px' }}>Completa il cablaggio e passa a SIMULA per testarlo!</p>
              </div>
            )}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #bdc3c7', margin: '0 0 20px 0' }} />

          <div style={{ flex: 1 }}>
            <h3 style={{ marginTop: 0, color: '#34495e', fontSize: '16px' }}>Colore Cavo</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <button className="color-btn" onClick={() => setWireColor('#8B4513')} style={{ background: '#8B4513', color: 'white', border: wireColor === '#8B4513' ? '3px solid #2c3e50' : 'none' }}>Fase (Marrone)</button>
              <button className="color-btn" onClick={() => setWireColor('#0000FF')} style={{ background: '#0000FF', color: 'white', border: wireColor === '#0000FF' ? '3px solid #2c3e50' : 'none' }}>Neutro (Blu)</button>
              <button className="color-btn" onClick={() => setWireColor('#2ed573')} style={{ background: '#2ed573', color: 'black', border: wireColor === '#2ed573' ? '3px solid #2c3e50' : 'none' }}>Terra (G/V)</button>
            </div>
          </div>

          <button onClick={handleClearCanvas} className="clear-btn">
            🗑️ Pulisci Foglio
          </button>
        </aside>

        {/* WORKSPACE CENTRALE */}
        <main 
          className="workspace-wrapper" 
          style={{ background: mode === 'DESIGN' ? '#e0e6ed' : '#2c3e50' }}
        >
          <Workspace ref={workspaceRef} currentMode={mode} wireColor={wireColor} onSimUpdate={(res) => setSimResult(res)} />

          {/* BANNER SIMULAZIONE */}
          {mode === 'SIMULATE' && simResult && (
            <div 
              className="sim-banner"
              style={{
                background: simResult.status === 'SUCCESS' ? '#2ed573' : simResult.status === 'WARNING' ? '#ffa502' : simResult.status === 'ERROR' ? '#ff4757' : '#74b9ff',
              }}
            >
              {simResult.message}
            </div>
          )}
        </main>

        {/* BARRA DESTRA - LIBRERIA */}
        <aside 
          className="sidebar sidebar-right" 
          style={{ opacity: mode === 'SIMULATE' ? 0.5 : 1, pointerEvents: mode === 'SIMULATE' ? 'none' : 'auto' }}
        >
          <h3 style={{ marginTop: 0, color: '#34495e', fontSize: '16px' }}>Libreria</h3>
          <p style={{ fontSize: '12px', color: '#7f8c8d', margin: '-10px 0 10px 0' }}>Clicca per aggiungere</p>
          
          <div className="library-grid">
            <button className="lib-btn" onClick={() => handleAddComponent('INTERRUTTORE')}>🔘 Interruttore</button>
            <button className="lib-btn" onClick={() => handleAddComponent('DEVIATORE')}>🔌 Deviatore</button>
            <button className="lib-btn" onClick={() => handleAddComponent('PULSANTE')}>🔘 Pulsante N.O.</button>
            <button className="lib-btn" onClick={() => handleAddComponent('RELE')}>⚙️ Relè</button>
            <button className="lib-btn" onClick={() => handleAddComponent('LAMPADA')}>💡 Punto Luce</button>
            <button className="lib-btn" onClick={() => handleAddComponent('MAGNETOTERMICO')}>⚡ Magnetoterm.</button>
          </div>
        </aside>

      </div>
    </div>
  );
}

export default App;