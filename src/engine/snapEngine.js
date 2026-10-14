// src/engine/snapEngine.js

export const SNAP_THRESHOLD = 25; // Pixel entro cui scatta il magnete

/**
 * Trova il morsetto più vicino alla posizione del cursore
 * @param {Object} mousePos - { x, y } coordinate correnti del mouse
 * @param {Array} allTerminals - Lista di tutti i morsetti presenti sullo schermo [{ id, compId, x, y, label, accepts }]
 * @returns {Object|null} Il morsetto agganciato o null se fuori portata
 */
export function findNearestTerminal(mousePos, allTerminals) {
  let nearestTerminal = null;
  let minDistance = Infinity;

  allTerminals.forEach((terminal) => {
    // Calcolo distanza euclidea
    const dx = mousePos.x - terminal.x;
    const dy = mousePos.y - terminal.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= SNAP_THRESHOLD && distance < minDistance) {
      minDistance = distance;
      nearestTerminal = { ...terminal, distance };
    }
  });

  return nearestTerminal;
}