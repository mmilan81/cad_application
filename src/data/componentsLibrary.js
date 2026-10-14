// src/data/componentsLibrary.js
export const COMPONENT_TYPES = {
  INTERRUTTORE: {
    id: 'int_base',
    name: 'Interruttore Unipolare',
    type: 'INTERRUTTORE',
    terminals: [
      { id: 'L', label: 'L', x: 0, y: -25 },
      { id: '1', label: '1', x: 0, y: 25 }
    ]
  },
  DEVIATORE: {
    id: 'dev_base',
    name: 'Deviatore Unipolare',
    type: 'DEVIATORE',
    terminals: [
      { id: 'C', label: 'C', x: 0, y: -25 },
      { id: '1', label: '1', x: -15, y: 20 },
      { id: '2', label: '2', x: 15, y: 20 }
    ]
  },
  LAMPADA: {
    id: 'lamp_base',
    name: 'Punto Luce',
    type: 'LAMPADA',
    terminals: [
      { id: 'L', label: 'L', x: -20, y: -25 },
      { id: 'N', label: 'N', x: 20, y: -25 },
      { id: 'PE', label: 'PE', x: 0, y: 25 }
    ]
  },
  MAGNETOTERMICO: {
    id: 'mt_base',
    name: 'Magnetotermico',
    type: 'MAGNETOTERMICO',
    terminals: [
      { id: 'L_IN', label: 'L in', x: -18, y: -35 },
      { id: 'N_IN', label: 'N in', x: 18, y: -35 },
      { id: 'L_OUT', label: 'L out', x: -18, y: 35 },
      { id: 'N_OUT', label: 'N out', x: 18, y: 35 }
    ]
  }
};