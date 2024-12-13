export type Coordinate<T = string> = {
  id: string;
  row: number;
  col: number;
  value: T;
}

export type CoordinatePair<T = string> = {
  c1: Coordinate<T>,
  c2: Coordinate<T>,
}

export function getAllPairs(coords: Coordinate[])
{
    const n = coords.length;
    const pairs: CoordinatePair[] = [];
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            if (i !== j) {
                pairs.push({c1: coords[i], c2: coords[j]})
            }
        }
    }
    return pairs;
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

  getCoord(row: number, col: number, allowFakeCoord: boolean = false) : Coordinate<T> | undefined {
    return this.coordsById[getCoordStringRaw(row, col)] ?? (allowFakeCoord ? {col, row, id: getCoordStringRaw(row, col), value: '' as T}: undefined);
  }

  getCoordsByValue(value: T) {
    return this.coordsByValue[value];
  }

  getNeighbors(coord: Coordinate<T>, allowDiagonals: boolean, valueToMatch?: T, allowFakeCoords: boolean = false): Coordinate<T>[] {
    const row = coord.row;
    const col = coord.col;
    const n = this.getCoord(row + 1, col, allowFakeCoords);
    const ne = this.getCoord(row + 1, col + 1, allowFakeCoords);
    const e = this.getCoord(row, col + 1, allowFakeCoords);
    const se = this.getCoord(row - 1, col + 1, allowFakeCoords);
    const s = this.getCoord(row - 1, col, allowFakeCoords);
    const sw = this.getCoord(row - 1, col - 1, allowFakeCoords);
    const w = this.getCoord(row, col - 1, allowFakeCoords);
    const nw = this.getCoord(row + 1, col - 1, allowFakeCoords);
    const neighbors = [n, e, s, w, ...(allowDiagonals ? [ne, se, sw, nw] : [])];
    return neighbors.filter(c => c != undefined).filter(c => (c !== undefined && valueToMatch) ? c.value === valueToMatch : c !== undefined);
  }
  
  isOnMap(coord: Coordinate) {
    if (coord === undefined) {
      return false;
    }
    return (coord.row >= 0 && coord.row < this.rowCount) && (coord.col >= 0 && coord.col < this.colCount);
  }
}