// src/engine/circuitSolver.js

function isNear(p1, p2, radius = 20) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y) <= radius;
}

function getAllTerminals(canvas) {
  const terminals = [];
  const groups = canvas.getObjects().filter(o => o.type === 'group');
  
  groups.forEach(group => {
    if (group.componentData && group.componentData.terminals) {
      group.componentData.terminals.forEach(term => {
        terminals.push({
          group,
          termId: term.id,
          compType: group.componentData.type,
          isFixedSupply: !!group.isFixedSupply,
          x: group.left + term.x,
          y: group.top + term.y
        });
      });
    }
  });
  return terminals;
}

function getNeighbors(current, allTerminals, wires) {
  const neighbors = [];

  // --- 1. NUOVA LOGICA: ESPLORAZIONE LINEE SPEZZATE ---
  const visitedWires = new Set();
  // Partiamo dal punto in cui si trova il terminale. color = null perché all'inizio accettiamo qualsiasi colore di cavo
  const queue = [ { pt: { x: current.x, y: current.y }, color: null } ];

  while (queue.length > 0) {
    const { pt, color } = queue.shift();

    // A. Cerca altri terminali toccati da questo punto del cavo
    allTerminals.forEach(t => {
      if (t !== current && isNear(t, pt)) {
        if (!neighbors.includes(t)) neighbors.push(t);
      }
    });

    // B. Percorri i cavi collegati a questo punto
    wires.forEach(wire => {
      if (visitedWires.has(wire)) return;

      const wStart = { x: wire.x1, y: wire.y1 };
      const wEnd = { x: wire.x2, y: wire.y2 };
      const wireColor = wire.stroke; // Colore della linea in Fabric.js

      // Se stiamo già seguendo un cavo, i segmenti successivi devono avere lo stesso colore!
      if (color !== null && color !== wireColor) return;

      // Se il cavo tocca il punto attuale, ci "saltiamo" sopra e andiamo all'estremità opposta
      if (isNear(pt, wStart)) {
        visitedWires.add(wire);
        queue.push({ pt: wEnd, color: wireColor });
      } else if (isNear(pt, wEnd)) {
        visitedWires.add(wire);
        queue.push({ pt: wStart, color: wireColor });
      }
    });
  }
  // --- FINE LOGICA CAVI ---

  // --- 2. LOGICA INTERNA DEI COMPONENTI (Rimasta invariata) ---
  const state = current.group.deviceState || { isOpen: true, position: '1', isPressed: false, relayState: false };
  const compType = current.compType;
  const termId = current.termId;

  let connectedTermIds = [];

  if (compType === 'INTERRUTTORE') {
    if (!state.isOpen) {
      if (termId === 'L') connectedTermIds = ['1'];
      if (termId === '1') connectedTermIds = ['L'];
    }
  } else if (compType === 'PULSANTE') {
    if (state.isPressed) {
      if (termId === 'L') connectedTermIds = ['1'];
      if (termId === '1') connectedTermIds = ['L'];
    }
  } else if (compType === 'DEVIATORE') {
    if (state.position === '1') {
      if (termId === 'C') connectedTermIds = ['1'];
      if (termId === '1') connectedTermIds = ['C'];
    } else if (state.position === '2') {
      if (termId === 'C') connectedTermIds = ['2'];
      if (termId === '2') connectedTermIds = ['C'];
    }
  } else if (compType === 'RELE') {
    if (state.relayState) {
      if (termId === '1') connectedTermIds = ['2'];
      if (termId === '2') connectedTermIds = ['1'];
    }
  } else if (compType === 'MAGNETOTERMICO') {
    if (!state.isOpen) {
      if (termId === 'L_IN') connectedTermIds = ['L_OUT'];
      if (termId === 'L_OUT') connectedTermIds = ['L_IN'];
      if (termId === 'N_IN') connectedTermIds = ['N_OUT'];
      if (termId === 'N_OUT') connectedTermIds = ['N_IN'];
    }
  }

  connectedTermIds.forEach(targetId => {
    const targetTerm = allTerminals.find(t => t.group === current.group && t.termId === targetId);
    if (targetTerm) neighbors.push(targetTerm);
  });

  return neighbors;
}

function getReachableTerminals(startTerminal, allTerminals, wires) {
  if (!startTerminal) return [];
  const visited = new Set([startTerminal]);
  const queue = [startTerminal];

  while (queue.length > 0) {
    const curr = queue.shift();
    const neighbors = getNeighbors(curr, allTerminals, wires);
    for (const n of neighbors) {
      if (!visited.has(n)) {
        visited.add(n);
        queue.push(n);
      }
    }
  }

  return Array.from(visited);
}

export function simulateCircuit(canvas) {
  if (!canvas) return { status: 'OFF', message: 'Canvas non pronto' };

  const objects = canvas.getObjects();
  const wires = objects.filter(o => o.type === 'line' && !o.isGridLine);
  const allTerminals = getAllTerminals(canvas);

  const pL = allTerminals.find(t => t.isFixedSupply && t.termId === 'L');
  const pN = allTerminals.find(t => t.isFixedSupply && t.termId === 'N');
  const pPE = allTerminals.find(t => t.isFixedSupply && t.termId === 'PE');

  if (!pL || !pN) {
    return { status: 'OFF', message: 'Nessuna alimentazione presente.' };
  }

  // 1. GESTIONE BOBINA RELÈ (prima di calcolare la raggiungibilità definitiva)
  // Nota: se la bobina dipende da interruttori/pulsanti, calcoliamo prima una raggiungibilità preliminare
  let reachableFromL = getReachableTerminals(pL, allTerminals, wires);
  let reachableFromN = getReachableTerminals(pN, allTerminals, wires);

  const releGroups = objects.filter(g => g.type === 'group' && g.componentData && g.componentData.type === 'RELE');
  
  releGroups.forEach(rele => {
    const a1 = allTerminals.find(t => t.group === rele && t.termId === 'A1');
    const a2 = allTerminals.find(t => t.group === rele && t.termId === 'A2');

    const bobinaAlimentata = (reachableFromL.includes(a1) && reachableFromN.includes(a2)) ||
                             (reachableFromL.includes(a2) && reachableFromN.includes(a1));

    if (bobinaAlimentata && !rele.deviceState.coilEnergized) {
      rele.deviceState.relayState = !rele.deviceState.relayState; 
      rele.deviceState.coilEnergized = true; 
    } else if (!bobinaAlimentata) {
      rele.deviceState.coilEnergized = false; 
    }
  });

  // 2. RICALCOLO DELLA RAGGIUNGIBILITÀ (ora che i contatti del relè sono aggiornati)
  reachableFromL = getReachableTerminals(pL, allTerminals, wires);
  reachableFromN = getReachableTerminals(pN, allTerminals, wires);

  // Cortocircuito diretto
  if (reachableFromL.includes(pN)) {
    return {
      status: 'ERROR',
      lampOn: false,
      message: '🚨 BOOM! Cortocircuito! Fase e Neutro sono collegati direttamente!'
    };
  }

  // 3. ANALISI LAMPADE
  const lampGroups = objects.filter(g => g.type === 'group' && g.componentData && g.componentData.type === 'LAMPADA');
  
  if (lampGroups.length === 0) {
    return { status: 'OFF', lampOn: false, message: 'Inserisci una lampada nel circuito.' };
  }

  let anyLampOn = false;
  let missingEarth = false;

  lampGroups.forEach(lampGroup => {
    const lampL = allTerminals.find(t => t.group === lampGroup && t.termId === 'L');
    const lampN = allTerminals.find(t => t.group === lampGroup && t.termId === 'N');
    const lampPE = allTerminals.find(t => t.group === lampGroup && t.termId === 'PE');

    const receivesL = lampL && reachableFromL.includes(lampL);
    const receivesN = lampN && reachableFromN.includes(lampN);

    if (receivesL && receivesN) {
      anyLampOn = true;

      const reachableFromPE = getReachableTerminals(pPE, allTerminals, wires);
      const receivesPE = lampPE && reachableFromPE.includes(lampPE);
      if (!receivesPE) {
        missingEarth = true;
      }
    }
  });

  if (anyLampOn) {
    if (missingEarth) {
      return {
        status: 'WARNING',
        lampOn: true,
        message: '💡 Lampada accesa! ⚠️ ATTENZIONE: Manca la Messa a Terra (PE)!'
      };
    }
    return {
      status: 'SUCCESS',
      lampOn: true,
      message: '💡 Perfetto! Impianto funzionante e sicuro!'
    };
  }

  return {
    status: 'OFF',
    lampOn: false,
    message: 'Circuito aperto: aziona i comandi per chiudere il circuito.'
  };
}