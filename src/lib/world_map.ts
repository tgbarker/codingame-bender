import { Heading } from "./types/heading";
import { isSameMapCoordinate, MapCoordinates } from "./types/map_coordinates";
import { WorldMapPointType } from "./types/map_point_type";

export class WorldMap {
  readonly pointsMatrix: Array<Array<string>>;
  startPoint: MapCoordinates = { x: -1, y: -1 };
  teleportPoints: Array<MapCoordinates> = [];

  static headingMap : Map<string, Heading> = new Map([
    [WorldMapPointType.SOUTH, {direction : WorldMapPointType.SOUTH, axisShift : { x: 0, y: 1 }, fullHeading : 'SOUTH'}],
    [WorldMapPointType.EAST, {direction : WorldMapPointType.EAST, axisShift : { x: 1, y: 0 }, fullHeading : 'EAST'}],
    [WorldMapPointType.NORTH, {direction : WorldMapPointType.NORTH, axisShift : { x: 0, y: -1 }, fullHeading : 'NORTH'}],
    [WorldMapPointType.WEST, {direction : WorldMapPointType.WEST, axisShift : { x: -1, y: 0 }, fullHeading : 'WEST'}],
  ]);

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
