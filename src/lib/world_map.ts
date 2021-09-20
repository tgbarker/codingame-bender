import { Heading } from "./types/heading";
import { isSameMapCoordinate, MapCoordinates } from "./types/map_coordinates";
import { WorldMapPointType } from "./types/map_point_type";

export class WorldMap {
  private readonly _mapMatrix: Array<Array<string>>;
  private _startPoint: MapCoordinates = { x: -1, y: -1 };
  private _teleportPoints: Array<MapCoordinates> = [];

  static readonly HEADING_MAP : Map<string, Heading> = new Map([
    [WorldMapPointType.SOUTH, {direction : WorldMapPointType.SOUTH, axisShift : { x: 0, y: 1 }, fullHeading : 'SOUTH'}],
    [WorldMapPointType.EAST, {direction : WorldMapPointType.EAST, axisShift : { x: 1, y: 0 }, fullHeading : 'EAST'}],
    [WorldMapPointType.NORTH, {direction : WorldMapPointType.NORTH, axisShift : { x: 0, y: -1 }, fullHeading : 'NORTH'}],
    [WorldMapPointType.WEST, {direction : WorldMapPointType.WEST, axisShift : { x: -1, y: 0 }, fullHeading : 'WEST'}],
  ]);

  constructor(pointsMap: Array<Array<string>>) {
    this._mapMatrix = pointsMap;
    this.initMap();
  }

  get startPoint() : MapCoordinates {
    return this._startPoint;
  }

  get mapMatrix() : Array<Array<string>>{
    return this._mapMatrix;
  }

  /**
   * Initialize the map with the start point and the teleport points
   */
  public initMap() {
    for (let i = 0; i < this._mapMatrix.length; i++) {
      for (let j = 0; j < this._mapMatrix[i].length; j++) {
        if (this._mapMatrix[i][j] == WorldMapPointType.START) {
          this._startPoint = { x: j, y: i };
        }
        if (this._mapMatrix[i][j] == WorldMapPointType.TELEPORT) {
          this._teleportPoints.push({ x: j, y: i });
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
    return isSameMapCoordinate(this._teleportPoints[0], point)
      ? this._teleportPoints[1]
      : this._teleportPoints[0];
  }

  /**
   * 
   * @param point The coordinates on the map to retrieve the value of its square
   * @returns The string of the value in the square for the corresponding coordinates in the map
   */
  public getSquareContents(point: MapCoordinates): string {
    //console.log('Get square : ' + point.x + '/' + point.y);
    return this._mapMatrix[point.y][point.x];
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
    this._mapMatrix[point.y][point.x] = newContents;
  }
}
