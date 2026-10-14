// src/components/Workspace.jsx
import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { fabric } from 'fabric';
import { COMPONENT_TYPES } from '../data/componentsLibrary';
import { simulateCircuit } from '../engine/circuitSolver';

function createPowerSupply() {
  const powerData = {
    id: 'power_supply',
    terminals: [
      { id: 'L', label: 'L', x: -30, y: 15 },
      { id: 'N', label: 'N', x: 0, y: 15 },
      { id: 'PE', label: 'PE', x: 30, y: 15 }
    ]
  };

  const box = new fabric.Rect({ left: -40, top: -25, width: 80, height: 50, fill: '#34495e', rx: 4, ry: 4 });
  const title = new fabric.Text('230V~', { left: -18, top: -20, fontSize: 11, fill: '#f1c40f', fontWeight: 'bold' });
  const shapes = [box, title];

  powerData.terminals.forEach(term => {
    let color = '#8B4513';
    if (term.id === 'N') color = '#0000FF';
    if (term.id === 'PE') color = '#2ed573';

    const screw = new fabric.Circle({ left: term.x - 6, top: term.y - 6, radius: 6, fill: color, stroke: '#ffffff', strokeWidth: 1.5 });
    const label = new fabric.Text(term.label, { left: term.x - 4, top: term.y - 16, fontSize: 9, fill: '#ffffff', fontWeight: 'bold' });
    shapes.push(screw, label);
  });

  return new fabric.Group(shapes, {
    left: 80, top: 60, originX: 'center', originY: 'center',
    selectable: false, evented: true, componentData: powerData, isFixedSupply: true
  });
}

function createDeviceGroup(devData, x, y) {
  let shapes = [];

  if (devData.type === 'LAMPADA') {
    const body = new fabric.Circle({ left: -40, top: -40, radius: 40, fill: '#fef9e7', stroke: '#f39c12', strokeWidth: 3, name: 'lamp_body' });
    const line1 = new fabric.Line([-20, -20, 20, 20], { stroke: '#f39c12', strokeWidth: 2 });
    const line2 = new fabric.Line([-20, 20, 20, -20], { stroke: '#f39c12', strokeWidth: 2 });
    shapes.push(body, line1, line2);

  } else if (devData.type === 'MAGNETOTERMICO') {
    const body = new fabric.Rect({ left: -35, top: -50, width: 70, height: 100, fill: '#f8f9fa', stroke: '#2c3e50', strokeWidth: 3, rx: 4, ry: 4 });
    const leverBg = new fabric.Rect({ left: -15, top: -15, width: 30, height: 30, fill: '#bdc3c7', rx: 3, ry: 3 });
    const lever = new fabric.Rect({ left: -10, top: -10, width: 20, height: 20, fill: '#e74c3c', rx: 2, ry: 2, name: 'lever' });
    const title = new fabric.Text('C16', { left: -10, top: -42, fontSize: 10, fill: '#2c3e50', fontWeight: 'bold' });
    shapes.push(body, leverBg, lever, title);

  } else {
    const body = new fabric.Rect({ left: -25, top: -40, width: 50, height: 80, fill: '#ecf0f1', stroke: '#34495e', strokeWidth: 2, rx: 5, ry: 5 });
    const titleText = devData.type === 'INTERRUTTORE' ? 'INT' : 'DEV';
    const title = new fabric.Text(titleText, { left: -10, top: -36, fontSize: 9, fill: '#7f8c8d', fontWeight: 'bold' });
    const toggleBtn = new fabric.Rect({ left: -15, top: -10, width: 30, height: 30, fill: '#e74c3c', rx: 3, ry: 3, name: 'toggle_btn' });
    shapes.push(body, title, toggleBtn);
  }

  devData.terminals.forEach(term => {
    const isPE = term.id.includes('PE');
    const screw = new fabric.Circle({ left: term.x - 6, top: term.y - 6, radius: 6, fill: isPE ? '#2ed573' : '#f1c40f', stroke: isPE ? '#27ae60' : '#d35400', strokeWidth: 1 });
    shapes.push(screw);

    let labelX = term.x + 8;
    let labelY = term.y - 6;

    if (term.x === 0 && term.y < 0) { labelX = term.x - 4; labelY = term.y - 16; }
    else if (term.x === 0 && term.y > 0) { labelX = term.x - 4; labelY = term.y + 7; }
    else if (term.x < 0) { labelX = term.x - 22; labelY = term.y - 6; }

    const label = new fabric.Text(term.label, { left: labelX, top: labelY, fontSize: 10, fill: '#2c3e50', fontWeight: 'bold' });
    shapes.push(label);
  });

  return new fabric.Group(shapes, {
    left: x, top: y, originX: 'center', originY: 'center',
    hasControls: false, borderColor: '#3498db', hoverCursor: 'grab',
    componentData: devData,
    deviceState: { isOpen: true, position: '1' } 
  });
}

const Workspace = forwardRef(({ currentMode, wireColor, onSimUpdate }, ref) => {
  const canvasEl = useRef(null);
  const fabCanvas = useRef(null);
  const isDrawing = useRef(false);
  const currentLine = useRef(null);

  const colorRef = useRef(wireColor);
  useEffect(() => { colorRef.current = wireColor; }, [wireColor]);

  const modeRef = useRef(currentMode);

  const updateSim = () => {
    if (!fabCanvas.current) return;
    try {
      const res = simulateCircuit(fabCanvas.current);

      const allObjects = fabCanvas.current.getObjects();
      const groups = allObjects.filter(o => o.type === 'group');
      
      groups.forEach(g => {
        if (g.componentData && g.componentData.type === 'LAMPADA') {
          const objs = g.getObjects ? g.getObjects() : g._objects || [];
          const lampBody = objs.find(o => o.name === 'lamp_body') || objs[0];
          if (lampBody) {
            lampBody.set({ fill: res.lampOn ? '#f1c40f' : '#fef9e7' });
          }
        }
      });

      fabCanvas.current.requestRenderAll();
      if (onSimUpdate) onSimUpdate(res);
    } catch (err) {
      console.error("Errore durante la simulazione:", err);
    }
  };

  useImperativeHandle(ref, () => ({
    addDevice: (componentType) => {
      if (!fabCanvas.current) return;
      const devData = COMPONENT_TYPES[componentType];
      if (!devData) return;

      const randomOffset = Math.floor(Math.random() * 40) - 20;
      const compGroup = createDeviceGroup(devData, 400 + randomOffset, 300 + randomOffset);

      fabCanvas.current.add(compGroup);
      fabCanvas.current.renderAll();
    },
    clearBoard: () => {
      if (!fabCanvas.current) return;
      const canvas = fabCanvas.current;
      const objectsToRemove = canvas.getObjects().filter(obj => !obj.isGridLine && !obj.isFixedSupply);
      objectsToRemove.forEach(obj => canvas.remove(obj));
      canvas.discardActiveObject();
      canvas.renderAll();
    },
    runSimulation: () => {
      updateSim();
      return fabCanvas.current ? simulateCircuit(fabCanvas.current) : null;
    }
  }));

  useEffect(() => {
    modeRef.current = currentMode;
    if (!fabCanvas.current) return;
    const canvas = fabCanvas.current;

    if (currentMode === 'SIMULATE') {
      canvas.getObjects().forEach(obj => {
        obj.set({ selectable: false });
        // UX: Mostra la manina se il componente è cliccabile!
        if (obj.componentData && ['INTERRUTTORE', 'DEVIATORE', 'MAGNETOTERMICO'].includes(obj.componentData.type)) {
          obj.set({ hoverCursor: 'pointer' });
        }
      });
      updateSim();
    } else {
      canvas.getObjects().forEach(obj => {
        if (!obj.isGridLine && !obj.isFixedSupply) {
          obj.set({ selectable: true, hoverCursor: 'grab' });
        }
        if (obj.componentData && obj.componentData.type === 'LAMPADA') {
          const objs = obj.getObjects ? obj.getObjects() : obj._objects || [];
          const lampBody = objs.find(o => o.name === 'lamp_body') || objs[0];
          if (lampBody) lampBody.set({ fill: '#fef9e7' });
        }
      });
      canvas.requestRenderAll();
    }
  }, [currentMode]);

  useEffect(() => {
    if (!canvasEl.current) return;

    const canvas = new fabric.Canvas(canvasEl.current, {
      width: 800, height: 600, backgroundColor: '#ffffff',
      selection: false, preserveObjectStacking: true 
    });
    fabCanvas.current = canvas;

    for (let i = 0; i < 800; i += 20) {
      const l1 = new fabric.Line([i, 0, i, 600], { stroke: '#f0f0f0', selectable: false, evented: false });
      const l2 = new fabric.Line([0, i, 800, i], { stroke: '#f0f0f0', selectable: false, evented: false });
      l1.isGridLine = true; l2.isGridLine = true;
      canvas.add(l1, l2);
    }

    const pSupply = createPowerSupply();
    canvas.add(pSupply);

    canvas.on('mouse:down', (o) => {
      // --- LOGICA CLICK MODALITÀ SIMULA ---
      if (modeRef.current === 'SIMULATE') {
        if (o.target && o.target.type === 'group' && o.target.componentData) {
          const g = o.target;
          const type = g.componentData.type;
          const objs = g.getObjects ? g.getObjects() : g._objects || [];

          if (type === 'INTERRUTTORE' || type === 'MAGNETOTERMICO') {
            g.deviceState.isOpen = !g.deviceState.isOpen;
            const btn = objs.find(item => item.name === 'toggle_btn' || item.name === 'lever');
            if (btn) btn.set({ fill: g.deviceState.isOpen ? '#e74c3c' : '#2ed573' });

          } else if (type === 'DEVIATORE') {
            g.deviceState.position = g.deviceState.position === '1' ? '2' : '1';
            const btn = objs.find(item => item.name === 'toggle_btn');
            if (btn) btn.set({ fill: g.deviceState.position === '1' ? '#e74c3c' : '#3498db' });
          }
          
          updateSim();
        }
        return; // Interrompe il resto della funzione (niente cavi disegnati in SIMULA)
      }

      // --- LOGICA DISEGNO MODALITÀ PROGETTA ---
      const pointer = canvas.getPointer(o.e);
      let startX = pointer.x;
      let startY = pointer.y;
      
      let snapPoint = null;
      const SNAP_RADIUS_START = 20;

      const allObjects = canvas.getObjects();
      const groups = allObjects.filter(obj => obj.type === 'group');
      
      groups.forEach(group => {
        if (group.componentData) {
          group.componentData.terminals.forEach(term => {
            const absX = group.left + term.x;
            const absY = group.top + term.y;
            const dist = Math.sqrt(Math.pow(pointer.x - absX, 2) + Math.pow(pointer.y - absY, 2));
            if (dist < SNAP_RADIUS_START) {
              snapPoint = { x: absX, y: absY };
            }
          });
        }
      });

      if (!snapPoint) {
        const lines = allObjects.filter(l => l.type === 'line' && !l.isGridLine);
        for (let l of lines) {
          const dist1 = Math.sqrt(Math.pow(pointer.x - l.x1, 2) + Math.pow(pointer.y - l.y1, 2));
          const dist2 = Math.sqrt(Math.pow(pointer.x - l.x2, 2) + Math.pow(pointer.y - l.y2, 2));
          
          if (dist1 < SNAP_RADIUS_START) { snapPoint = { x: l.x1, y: l.y1 }; break; }
          if (dist2 < SNAP_RADIUS_START) { snapPoint = { x: l.x2, y: l.y2 }; break; }
        }
      }

      if (snapPoint) {
        startX = snapPoint.x;
        startY = snapPoint.y;
      }

      if (o.target && !o.target.isGridLine) {
        if (!snapPoint && o.target.type === 'group' && !o.target.isFixedSupply) {
          return;
        }
        o.target.set({ lockMovementX: true, lockMovementY: true });
      }

      canvas.discardActiveObject();

      isDrawing.current = true;
      const points = [startX, startY, startX, startY];
      const line = new fabric.Line(points, {
        strokeWidth: 5, stroke: colorRef.current, 
        selectable: true, evented: true, hasControls: false,       
        hasBorders: true, borderColor: '#e74c3c', hoverCursor: 'pointer'    
      });
      currentLine.current = line;
      canvas.add(line);
    });

    canvas.on('mouse:move', (o) => {
      if (modeRef.current === 'SIMULATE') return;
      if (!isDrawing.current || !currentLine.current) return;
      const pointer = canvas.getPointer(o.e);
      
      let snapPoint = null;
      const SNAP_RADIUS = 20;
      const allObjects = canvas.getObjects();

      const groups = allObjects.filter(obj => obj.type === 'group');
      groups.forEach(group => {
        if (group.componentData) {
          group.componentData.terminals.forEach(term => {
            const absX = group.left + term.x;
            const absY = group.top + term.y;
            const dist = Math.sqrt(Math.pow(pointer.x - absX, 2) + Math.pow(pointer.y - absY, 2));
            if (dist < SNAP_RADIUS) {
              snapPoint = { x: absX, y: absY };
            }
          });
        }
      });

      if (!snapPoint) {
        const lines = allObjects.filter(l => l.type === 'line' && l !== currentLine.current && !l.isGridLine);
        for (let l of lines) {
          if (Math.sqrt(Math.pow(pointer.x - l.x1, 2) + Math.pow(pointer.y - l.y1, 2)) < SNAP_RADIUS) {
            snapPoint = { x: l.x1, y: l.y1 }; break;
          }
          if (Math.sqrt(Math.pow(pointer.x - l.x2, 2) + Math.pow(pointer.y - l.y2, 2)) < SNAP_RADIUS) {
            snapPoint = { x: l.x2, y: l.y2 }; break;
          }
        }
      }

      let targetX = pointer.x;
      let targetY = pointer.y;

      if (snapPoint) {
        targetX = snapPoint.x;
        targetY = snapPoint.y;
      } else {
        const dx = Math.abs(pointer.x - currentLine.current.x1);
        const dy = Math.abs(pointer.y - currentLine.current.y1);
        if (dx < 20) targetX = currentLine.current.x1;
        else if (dy < 20) targetY = currentLine.current.y1;
      }

      currentLine.current.set({ x2: targetX, y2: targetY });
      canvas.renderAll();
    });

    canvas.on('mouse:up', (o) => {
      if (modeRef.current === 'SIMULATE') return;
      isDrawing.current = false;

      if (currentLine.current) {
        const dx = Math.abs(currentLine.current.x2 - currentLine.current.x1);
        const dy = Math.abs(currentLine.current.y2 - currentLine.current.y1);
        
        if (dx < 3 && dy < 3) {
          canvas.remove(currentLine.current); 
          if (o.target && !o.target.isGridLine) {
            canvas.setActiveObject(o.target);
          }
        } else {
          currentLine.current.setCoords(); 
        }
        currentLine.current = null;
      }

      canvas.getObjects().forEach(obj => {
        if (!obj.isFixedSupply) {
          obj.set({ lockMovementX: false, lockMovementY: false });
        }
      });

      canvas.renderAll();
    });

    const handleKeyDown = (e) => {
      if (modeRef.current === 'SIMULATE') return;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeObjects = canvas.getActiveObjects();
        const deletable = activeObjects.filter(obj => !obj.isFixedSupply);
        if (deletable.length > 0) {
          deletable.forEach(obj => canvas.remove(obj));
          canvas.discardActiveObject();
          canvas.requestRenderAll();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      fabCanvas.current = null;
      canvas.dispose();
    };
  }, []);

  return (
    <div style={{ border: '2px solid #bdc3c7', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <canvas ref={canvasEl} />
    </div>
  );
});

export default Workspace;