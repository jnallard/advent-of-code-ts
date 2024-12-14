export type Coordinate<T = string> = {
  id: string;
  row: number;
  col: number;
  value: T;
  isFake?: boolean;
}

export type CoordinateTransponse = {
  row: number;
  col: number;
}

export function getTranspose<T>(coordA: Coordinate<T>, coordB: Coordinate<T>): CoordinateTransponse {
  return {row: coordB.row - coordA.row, col: coordB.col - coordA.col};
}

export function areTransposesEquivalent(t1: CoordinateTransponse, t2: CoordinateTransponse) {
  return t1.row === t2.row && t1.col === t2.col;
}

export function getTransposeString(t: CoordinateTransponse) {
  return `tr${t.row}-tc${t.col}`;
}

export const N: CoordinateTransponse = {row: 1, col: 0};
export const E: CoordinateTransponse = {row: 0, col: 1};
export const S: CoordinateTransponse = {row: -1, col: 0};
export const W: CoordinateTransponse = {row: 0, col: -1};
export const NE: CoordinateTransponse = {row: 1, col: 1};
export const SE: CoordinateTransponse = {row: -1, col: 1};
export const SW: CoordinateTransponse = {row: -1, col: -1};
export const NW: CoordinateTransponse = {row: 1, col: -1};

export const Directions = [
  N, E, S, W,
]

export const DirectionsWithDiagonals = [
  N, E, S, W, NE, SE, SW, NW
]

export type CoordinatePair<T = string> = {
  c1: Coordinate<T>,
  c2: Coordinate<T>,
}

type GetNeighborsParams<T> = {
  allowDiagonals?: boolean,
  valueToMatch?: T,
  allowFakeCoords?: boolean,
  directions?: CoordinateTransponse[],
  recursive?: boolean,
  coordSoFar?: Record<string, Coordinate<T>>
};

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

  getCoord(row: number, col: number, allowFakeCoord: boolean = false) : Coordinate<T> {
    return this.coordsById[getCoordStringRaw(row, col)] ?? (allowFakeCoord ? {col, row, id: getCoordStringRaw(row, col), value: '' as T, isFake: true}: undefined);
  }

  getCoordsByValue(value: T) {
    return this.coordsByValue[value];
  }

  getNeighbors(coord: Coordinate<T>, params : GetNeighborsParams<T>): Coordinate<T>[] {
    let {allowDiagonals, valueToMatch, allowFakeCoords, directions, recursive, coordSoFar} = params;
    const row = coord.row;
    const col = coord.col;
    allowFakeCoords = allowFakeCoords ?? false;
    directions = directions ?? ((allowDiagonals) ? DirectionsWithDiagonals : Directions);
    coordSoFar = coordSoFar ?? {};
    coordSoFar[coord.id] = coord;
    let neighbors = directions.map(ct => this.getCoord(row + ct.row, col + ct.col, allowFakeCoords)).filter(c => c !== undefined);
    if (valueToMatch !== undefined) {
      neighbors = neighbors.filter(c => c.value === valueToMatch)
    }
    if (recursive) {
      const neighborsToConsider = neighbors.filter(n => coordSoFar[n.id] === undefined);
       neighborsToConsider.forEach(n => this.getNeighbors(n, {...params, coordSoFar: coordSoFar}));
      return Object.values(coordSoFar);
    }
    return neighbors;
  }
  
  isOnMap(coord: Coordinate) {
    if (coord === undefined) {
      return false;
    }
    return (coord.row >= 0 && coord.row < this.rowCount) && (coord.col >= 0 && coord.col < this.colCount);
  }

  updateCoordMap() {
    Object.keys(this.coordsByValue).forEach(val => this.coordsByValue[val] = []);
    this.coords.forEach(coord => {
      if(this.coordsByValue[coord.value] == undefined) {
        this.coordsByValue[coord.value] = [];
      }
      this.coordsByValue[coord.value].push(coord);
    });
  }

  getDisplayString(hideZero: boolean = true) {
    let output = '';
    for(let row = 0; row < this.rowCount; row++) {
      for (let col = 0; col < this.colCount; col++) {
        const coord = this.getCoord(row, col);
        const val = coord.value.toString();
        output += hideZero && val === '0' ? ' ' : val;
      }
      output += '\n';
    }
    return output;
  }

  print(hideZero: boolean = true) {
    console.log(this.getDisplayString(hideZero));
  }

  updateAll(value: T) {
    this.coords.forEach(c => c.value = value);
    this.updateCoordMap();
  }
  
  static CreateEmptyGrid<T extends string | number = string>({rows, cols, defaultValue}: {rows: number, cols: number, defaultValue: T}) {
    const rowsAsString: string[] = [];
    for (let row = 0; row < rows; row++) {
      rowsAsString[row] = Array(cols).fill('.').join('')
    }
    return new Grid<T>(rowsAsString, () => defaultValue);
  }
}