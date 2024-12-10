export type Coordinate<T = string> = {
  id: string;
  row: number;
  col: number;
  value: T;
}

export type CoordinatePair = {
  c1: Coordinate,
  c2: Coordinate,
}

export function getCoordStringRaw(row: number, col: number) {
  return `${row}-${col}`;
}

export function getCoordString<T>(coord: Coordinate<T>) {
  return `${coord.row}-${coord.col}`;
}

export class Grid<T extends string | number = string> {
  public readonly rowCount: number;
  public readonly colCount: number;
  public readonly coords: Coordinate<T>[] = [];
  public readonly coordsById: Record<string, Coordinate<T>> = {};
  public readonly coordsByValue: Record<string | number, Coordinate<T>[]> = {};

  constructor(public lines: string[], mapper: (v: string) => T = (v: string) => v as T) {
    this.rowCount = lines.length;
    this.colCount = lines[0].length;
    for(let row = 0; row < this.rowCount; row++) {
      for(let col = 0; col < this.colCount; col++) {
        const coord: Coordinate<T> = {col, row, value: mapper(this.lines[row][col]), id: getCoordStringRaw(row, col)};
        this.coords.push(coord);
        this.coordsById[coord.id] = coord;
        this.coordsByValue[coord.value] = (this.coordsByValue[coord.value] ?? []).concat([coord]);
      }
    }
  }

  getCoord(row: number, col: number) {
    return this.coordsById[getCoordStringRaw(row, col)] ?? undefined;
  }

  getCoordsByValue(value: T) {
    return this.coordsByValue[value];
  }

  getNeighbors(coord: Coordinate<T>, allowDiagonals: boolean, valueToMatch?: T) {
    const row = coord.row;
    const col = coord.col;
    const n = this.getCoord(row + 1, col);
    const ne = this.getCoord(row + 1, col + 1);
    const e = this.getCoord(row, col + 1);
    const se = this.getCoord(row - 1, col + 1);
    const s = this.getCoord(row - 1, col);
    const sw = this.getCoord(row - 1, col - 1);
    const w = this.getCoord(row, col - 1);
    const nw = this.getCoord(row + 1, col - 1);
    const neighbors = [n, e, s, w, ...(allowDiagonals ? [ne, se, sw, nw] : [])];
    return neighbors.filter(c => (c !== undefined && valueToMatch) ? c.value === valueToMatch : c !== undefined);
  }
}

export type GridDetails = {
  coords: Coordinate[];
  rows: number;
  cols: number;
}