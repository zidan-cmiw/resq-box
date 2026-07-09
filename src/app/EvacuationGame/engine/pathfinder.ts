// ── pathfinder.ts ──────────────────────────────────────────────────
// Implementasi algoritma A* (A-Star) untuk menemukan jalur terpendek
// dari posisi NPC menuju Titik Kumpul (safe zone).

import type { TileType } from '../mapData';
import { MAP_DATA, MAP_ROWS, MAP_COLS, WALKABLE_TILES, TILE } from '../mapData';

interface Node {
  row: number;
  col: number;
  g: number; // cost from start
  h: number; // heuristic to end
  f: number; // g + h
  parent: Node | null;
}

function heuristic(a: [number, number], b: [number, number]): number {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

function getNeighbors(row: number, col: number): [number, number][] {
  return [
    [row - 1, col], [row + 1, col],
    [row, col - 1], [row, col + 1],
  ].filter(([r, c]) => r >= 0 && r < MAP_ROWS && c >= 0 && c < MAP_COLS) as [number, number][];
}

function isWalkable(row: number, col: number, gateOpen: boolean): boolean {
  // GATE tile: walkable only if gate is open
  if (!gateOpen && MAP_DATA[row][col] === TILE.GATE) {
    return false;
  }
  const tile = MAP_DATA[row][col] as TileType;
  return WALKABLE_TILES.includes(tile);
}

export function findPath(
  startRow: number,
  startCol: number,
  goalRow: number,
  goalCol: number,
  gateOpen: boolean,
): [number, number][] {
  const open: Node[] = [];
  const closed = new Set<string>();

  const startNode: Node = {
    row: startRow, col: startCol,
    g: 0,
    h: heuristic([startRow, startCol], [goalRow, goalCol]),
    f: heuristic([startRow, startCol], [goalRow, goalCol]),
    parent: null,
  };
  open.push(startNode);

  while (open.length > 0) {
    // Pick node with lowest f score
    open.sort((a, b) => a.f - b.f);
    const current = open.shift()!;
    const key = `${current.row},${current.col}`;

    if (closed.has(key)) continue;
    closed.add(key);

    // Reached goal
    if (current.row === goalRow && current.col === goalCol) {
      const path: [number, number][] = [];
      let node: Node | null = current;
      while (node) {
        path.unshift([node.row, node.col]);
        node = node.parent;
      }
      return path;
    }

    // Explore neighbors
    for (const [nr, nc] of getNeighbors(current.row, current.col)) {
      const nKey = `${nr},${nc}`;
      if (closed.has(nKey)) continue;
      if (!isWalkable(nr, nc, gateOpen)) continue;

      const g = current.g + 1;
      const h = heuristic([nr, nc], [goalRow, goalCol]);
      const neighbor: Node = { row: nr, col: nc, g, h, f: g + h, parent: current };
      open.push(neighbor);
    }
  }

  return []; // No path found (gate blocked)
}
