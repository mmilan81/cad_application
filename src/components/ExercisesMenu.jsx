// src/components/ExercisesMenu.jsx
import React, { useState } from 'react';

// Sostituisci questo array con i tuoi esercizi reali
const EXERCISES = [
  {
    id: 1,
    title: "1. Punto Luce Semplice",
    description: "Realizza l'accensione di una lampada comandata da un interruttore unipolare. Collega la fase all'interruttore e il ritorno alla lampada.",
    components: ['INTERRUTTORE', 'LAMPADA']
  },
  {
    id: 2,
    title: "2. Deviata (2 Punti)",
    description: "Controlla un punto luce da due punti diversi utilizzando due deviatori. Utile per accendere la luce all'inizio e alla fine di un corridoio.",
    components: ['DEVIATORE', 'DEVIATORE', 'LAMPADA']
  },
  {
    id: 3,
    title: "3. Relè Passo-Passo",
    description: "Comanda una lampada da più punti tramite due pulsanti N.O. e un relè passo-passo. Collega i pulsanti in parallelo alla bobina del relè.",
    components: ['PULSANTE', 'PULSANTE', 'RELE', 'LAMPADA']
  }
];

export default function ExercisesMenu({ onSelectExercise }) {
  // Stato per tracciare quale esercizio è attualmente "aperto" (a tendina)
  const [expandedId, setExpandedId] = useState(null);

  // Apre/chiude la tendina cliccando sul titolo
  const toggleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null); // Se è già aperto, lo chiude
    } else {
      setExpandedId(id); // Altrimenti apre quello cliccato
    }
  };

  return (
    <div>
      <h3 style={{ marginTop: 0, color: '#34495e', fontSize: '16px' }}>📚 Esercizi</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {EXERCISES.map((ex) => (
          <div key={ex.id} style={{ border: '1px solid #bdc3c7', borderRadius: '6px', overflow: 'hidden' }}>
            
            {/* INTESTAZIONE: Titolo cliccabile */}
            <div 
              onClick={() => toggleExpand(ex.id)}
              style={{ 
                padding: '12px 10px', 
                background: expandedId === ex.id ? '#3498db' : '#f8f9fa', 
                color: expandedId === ex.id ? 'white' : '#2c3e50', 
                cursor: 'pointer', 
                fontWeight: 'bold', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                transition: 'background 0.2s'
              }}
            >
              <span style={{ fontSize: '14px' }}>{ex.title}</span>
              <span>{expandedId === ex.id ? '▲' : '▼'}</span>
            </div>
            
            {/* CORPO A TENDINA: Visibile solo se expandedId corrisponde a questo esercizio */}
            {expandedId === ex.id && (
              <div style={{ padding: '12px', background: 'white' }}>
                <p style={{ margin: '0 0 15px 0', fontSize: '13px', color: '#555', lineHeight: '1.4' }}>
                  {ex.description}
                </p>
                
                {/* TASTO ESEGUI: Inserisce i componenti nella board */}
                <button 
                  onClick={() => onSelectExercise(ex)}
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    background: '#27ae60', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px', 
                    cursor: 'pointer', 
                    fontWeight: 'bold',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  ▶️ Esegui
                </button>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}