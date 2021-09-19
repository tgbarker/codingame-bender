// export const WorldMapPointType = {
//   OBSTACLE: '#',
//   X: 'X',
//   START: '@',
//   SUICIDE: '$',
//   SOUTH: 'S',
//   EAST: 'E',
//   NORTH: 'N',
//   WEST: 'W',
//   BEER: 'B',
//   INVERTER: 'I',
//   TELEPORT: 'T',
//   SPACE: ' ',
// } as const;
export enum WorldMapPointType {
  OBSTACLE = '#',
  X = 'X',
  START = '@',
  SUICIDE = '$',
  SOUTH = 'S',
  EAST = 'E',
  NORTH = 'N',
  WEST = 'W',
  BEER = 'B',
  INVERTER = 'I',
  TELEPORT = 'T',
  SPACE = ' ',
}

export const directionPriority: Array<WorldMapPointType> = [
  WorldMapPointType.SOUTH,
  WorldMapPointType.EAST,
  WorldMapPointType.NORTH,
  WorldMapPointType.WEST,
];

export const mapPointTypeToStringMapping: Map<string, string> = new Map([
  [WorldMapPointType.SOUTH, 'SOUTH'],
  [WorldMapPointType.EAST, 'EAST'],
  [WorldMapPointType.NORTH, 'NORTH'],
  [WorldMapPointType.WEST, 'WEST'],
]);

export const xtraMapPointTypeToStringMapping: Map<string, WorldMapPointType> = new Map([
    [ 'S', WorldMapPointType.SOUTH],
    ['E',WorldMapPointType.EAST],
    ['N',WorldMapPointType.NORTH,],
    ['W',WorldMapPointType.WEST,],
  ]);

export const directionToPointChangeMap: Map<string, MapCoordinates> = new Map([
  [WorldMapPointType.SOUTH, { x: 0, y: 1 }],
  [WorldMapPointType.EAST, { x: 1, y: 0 }],
  [WorldMapPointType.NORTH, { x: 0, y: -1 }],
  [WorldMapPointType.WEST, { x: -1, y: 0 }],
]);

export type MapCoordinates = {
  x: number;
  y: number;
};

/**
 * Helper function to compare two MapCoordinates types
 * @param firstPoint first MapCoordinates value to compare
 * @param secondPoint second MapCoordinates value to compare
 * @returns A 'deep' compare of the two MapCoordinates value
 */
export function isSameMapCoordinate(firstPoint : MapCoordinates, secondPoint : MapCoordinates) : boolean {
    return firstPoint.x === secondPoint.x && firstPoint.y === secondPoint.y;
}

export class WorldMap {
  readonly pointsMatrix: Array<Array<string>>;
  startPoint: MapCoordinates = { x: -1, y: -1 };
  teleportPoints: Array<MapCoordinates> = [];

  constructor(pointsMap: Array<Array<string>>) {
    this.pointsMatrix = pointsMap;
    this.initMap();
  }

  /**
   * Initialize the map with the start point and the teleport points
   */
  public initMap() {
    for (let i = 0; i < this.pointsMatrix.length; i++) {
      for (let j = 0; j < this.pointsMatrix[i].length; j++) {
        if (this.pointsMatrix[i][j] == WorldMapPointType.START) {
          this.startPoint = { x: j, y: i };
        }
        if (this.pointsMatrix[i][j] == WorldMapPointType.TELEPORT) {
          this.teleportPoints.push({ x: j, y: i });
        }
      }
    }
  }

  /**
   * 
   * @param point The coordinates on the map of the encountered teleport cell
   * @returns The MapCoordinates of the other teleport cell
   */
  public moveToOtherTeleportCell(point: MapCoordinates): MapCoordinates {
    return isSameMapCoordinate(this.teleportPoints[0], point)
      ? this.teleportPoints[1]
      : this.teleportPoints[0];
  }

  /**
   * 
   * @param point The coordinates on the map to retrieve the value of its square
   * @returns The string of the value in the square for the corresponding coordinates in the map
   */
  public getSquareContents(point: MapCoordinates): string {
    //console.log('Get square : ' + point.x + '/' + point.y);
    return this.pointsMatrix[point.y][point.x];
  }

  /**
   * Change the contents of a point on the map with a new value
   * @param point The MapCoordinates of the square to change
   * @param newContents The new value of the square
   */
  public changeSquareContents(
    point: MapCoordinates,
    newContents: WorldMapPointType
  ) {
    this.pointsMatrix[point.y][point.x] = newContents;
  }
}
