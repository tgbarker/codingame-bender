import { MapCoordinates } from './types/map_coordinates';
import { WorldMapPointType } from './types/map_point_type';
import { WorldMap } from './world_map';

/**
 * A type definition to wrap the state of Bender
 * used for state storage and loop detection
 */
type BenderState = {
  isInvertedDirection: boolean;
  isBreakerMode: boolean;
  currentHeading: WorldMapPointType;
};

export class Bender {
  private _currentPoint: MapCoordinates;
  private _currentState: BenderState;
  private _directionPriority: Array<WorldMapPointType>;
  private _visited = new Map<string, Array<BenderState>>();

   static readonly DEFAULT_DIRECTION_PRIORITY: Array<WorldMapPointType> = [
    WorldMapPointType.SOUTH,
    WorldMapPointType.EAST,
    WorldMapPointType.NORTH,
    WorldMapPointType.WEST,
  ];

  constructor(
    startPoint: MapCoordinates,
    directionPriority: Array<WorldMapPointType> = Bender.DEFAULT_DIRECTION_PRIORITY,
    invertedDirection = false,
    breakerMode = false,
    currentHeading = WorldMapPointType.SOUTH
  ) {
    this._currentPoint = startPoint;
    this._currentState = {
      isInvertedDirection: invertedDirection,
      isBreakerMode: breakerMode,
      currentHeading: currentHeading,
    };
    this._directionPriority = [...directionPriority]; // copy so can reverse
  }

  /**
   * Getter for Bender's current state
   */
  get currentState() : BenderState {
    return this._currentState;
  }

  /**
   * Change the direction priority as a bool member and also reverse the array order
   */
  public changeDirectionPriority() {
    this._currentState.isInvertedDirection =
      !this._currentState.isInvertedDirection;
    this._directionPriority.reverse();
  }

  /**
   * Swap Bender's breaker mode enabling to break through X cases
   */
  public changeBreakerMode() {
    this._currentState.isBreakerMode = !this._currentState.isBreakerMode;
  }

  /**
   * Calculate the next cell taking into account direction priority and obstacles
   * @param worldMap The map used
   * @returns The MapCoordinates of the next cell
   */
  private calculateNextCell(
    worldMap: WorldMap
  ): MapCoordinates {
    let nextCell: MapCoordinates = this.canMoveToSquare(
      worldMap,
      this._currentState.currentHeading
    );
    // can't move to next square with current heading
    if (nextCell.x === 0 && nextCell.y === 0) {
      for (let i = 0; i < this._directionPriority.length; i++) {
        nextCell = this.canMoveToSquare(worldMap, this._directionPriority[i]);
        if (nextCell.x !== 0 && nextCell.y !== 0) {
          this._currentState.currentHeading = this._directionPriority[i];
          break;
        }
      }
    }
    //console.log('calculateNextCell : %d/%d', nextCell.x, nextCell.y);
    return nextCell;
  }

  /**
   * Create a string reperesentation of a coordinate for use such as a key string in a map
   * @param coordinate The MapCoordinates type used to generate the string key
   * @returns The coordinate as a string for map searching
   */
  private generateCoordinateKey(coordinate : MapCoordinates) : string {
    return coordinate.x + '-' + coordinate.y;
  }

  /**
   * Checks the list of visited cells and state at time of passage, if duplicate, means a loop
   * @param nextCell The cell that will be checked
   * @returns A boolean stating whether the checked cell has been visited in current state or not
   */
  private isInLoop(nextCell: MapCoordinates): boolean {
    const coordinateKey = this.generateCoordinateKey(nextCell);
    if (this._visited.has(coordinateKey)) {
      let visitedStatesOfCell: Array<BenderState> = this._visited.get(
        coordinateKey
      )!;
      for (let i = 0; i < visitedStatesOfCell.length; i++) {
        let stateToCheck: BenderState = visitedStatesOfCell[i];
        if (
          stateToCheck.isInvertedDirection ===
            this._currentState.isInvertedDirection &&
          stateToCheck.isBreakerMode === this._currentState.isBreakerMode &&
          stateToCheck.currentHeading === this._currentState.currentHeading
        ) {
          return true;
        }
      }
    } else {
      this._visited.set(coordinateKey, []);
    }

    this._visited.get(coordinateKey)?.push({
      isBreakerMode: this._currentState.isBreakerMode,
      isInvertedDirection: this._currentState.isInvertedDirection,
      currentHeading: this._currentState.currentHeading,
    });

    return false;
  }

  /**
   * Determine if we are able to move to the next square
   *
   * @param worldMap The world map to analyze
   * @param direction The current heading to look at
   * @returns The MapCoordinates of the square we can move to
   */
  public canMoveToSquare(
    worldMap: WorldMap,
    direction: WorldMapPointType
  ): MapCoordinates {
    let nextCellPoint: MapCoordinates = this.shiftAxis(direction);
    if (
      (this._currentState.isBreakerMode === false &&
        (worldMap.mapMatrix[nextCellPoint.y][nextCellPoint.x] ===
          WorldMapPointType.X ||
          worldMap.mapMatrix[nextCellPoint.y][nextCellPoint.x] ===
            WorldMapPointType.OBSTACLE)) ||
      (this._currentState.isBreakerMode === true &&
        worldMap.mapMatrix[nextCellPoint.y][nextCellPoint.x] ===
          WorldMapPointType.OBSTACLE)
    ) {
      return { x: 0, y: 0 };
    } else {
      return nextCellPoint;
    }
  }

  /**
   * Shift the axis +/- according to the heading and x/y values
   * @param direction The current heading to choose the x/y axis shift
   */
  private shiftAxis(direction: WorldMapPointType): MapCoordinates {
    let pointAxisChange = WorldMap.HEADING_MAP.get(direction)!.axisShift;
    return {
      x: this._currentPoint.x + pointAxisChange.x,
      y: this._currentPoint.y + pointAxisChange.y,
    };
  }

  /**
   * Main function for executing the journey of Bender
   * @param worldMap The map structure that contains the data to traverse the map
   * @returns The string array of the directions used or Loop if loop detected
   */
  public goThroughMap(worldMap: WorldMap): Array<string> {
    let isSuicideCabinFound = false;
    let isLooping = false;
    let listOfDirections: Array<string> = [];
    let nextCell: MapCoordinates = worldMap.startPoint;

    while (isLooping == false && isSuicideCabinFound == false) {
      nextCell = this.calculateNextCell(worldMap);
      // add the direction traveled to the output array of directions
      listOfDirections.push(
        WorldMap.HEADING_MAP.get(this._currentState.currentHeading)!.fullHeading
      );

      let pointDataStr = worldMap.getSquareContents(nextCell);
      //console.debug("Contents : '%s'", pointDataStr);
      // change Breaker mode
      if (pointDataStr === WorldMapPointType.BEER) {
        //console.log('*** Breaker mode ***');
        this.changeBreakerMode();
      } else if (pointDataStr === WorldMapPointType.INVERTER) {
        this.changeDirectionPriority();
      } else if (pointDataStr === WorldMapPointType.X && this._currentState.isBreakerMode) {
        worldMap.changeSquareContents(nextCell, WorldMapPointType.SPACE);
      } else if (pointDataStr === WorldMapPointType.TELEPORT) {
        nextCell = worldMap.moveToOtherTeleportCell(nextCell);
      } else if (WorldMap.HEADING_MAP.has(pointDataStr)) {
        this._currentState.currentHeading = WorldMap.HEADING_MAP.get(pointDataStr)!.direction;
      }

      this._currentPoint = nextCell;

      // If the suicide cabin 'S' is encountered
      if (pointDataStr === WorldMapPointType.SUICIDE) {
        isSuicideCabinFound = true;
      }

      // Loop detection
      if (this.isInLoop(nextCell) === true) {
        isLooping = true;
        listOfDirections = ['LOOP'];
      }
    }
    return listOfDirections;
  }
}
