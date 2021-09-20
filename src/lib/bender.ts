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
  currentPoint: MapCoordinates;
  currentState: BenderState;
  directionPriority: Array<WorldMapPointType>;
  visited = new Map<string, Array<BenderState>>();

   static readonly defaultDirectionPriority: Array<WorldMapPointType> = [
    WorldMapPointType.SOUTH,
    WorldMapPointType.EAST,
    WorldMapPointType.NORTH,
    WorldMapPointType.WEST,
  ];

  constructor(
    startPoint: MapCoordinates,
    directionPriority: Array<WorldMapPointType> = Bender.defaultDirectionPriority,
    invertedDirection = false,
    breakerMode = false,
    currentHeading = WorldMapPointType.SOUTH
  ) {
    this.currentPoint = startPoint;
    this.currentState = {
      isInvertedDirection: invertedDirection,
      isBreakerMode: breakerMode,
      currentHeading: currentHeading,
    };
    this.directionPriority = [...directionPriority]; // copy so can reverse
  }

  /**
   * Change the direction priority as a bool member and also reverse the array order
   */
  public changeDirectionPriority() {
    this.currentState.isInvertedDirection =
      !this.currentState.isInvertedDirection;
    this.directionPriority.reverse();
  }

  /**
   * Swap Bender's breaker mode enabling to break through X cases
   */
  public changeBreakerMode() {
    this.currentState.isBreakerMode = !this.currentState.isBreakerMode;
  }

  /**
   * Calculate the next cell taking into account direction priority and obstacles
   * @param worldMap The map used
   * @returns The MapCoordinates of the next cell
   */
  public calculateNextCell(
    worldMap: WorldMap
  ): MapCoordinates {
    let nextCell: MapCoordinates = this.canMoveToSquare(
      worldMap,
      this.currentState.currentHeading
    );
    // can't move to next square with current heading
    if (nextCell.x === 0 && nextCell.y === 0) {
      for (let i = 0; i < this.directionPriority.length; i++) {
        nextCell = this.canMoveToSquare(worldMap, this.directionPriority[i]);
        if (nextCell.x !== 0 && nextCell.y !== 0) {
          this.currentState.currentHeading = this.directionPriority[i];
          break;
        }
      }
    }
    //console.log('calculateNextCell : %d/%d', nextCell.x, nextCell.y);
    return nextCell;
  }

  /**
   * Checks the list of visited cells and state at time of passage, if duplicate, means a loop
   * @param nextCell The cell that will be checked
   * @returns A boolean stating whether the checked cell has been visited in current state or not
   */
  public isInLoop(nextCell: MapCoordinates): boolean {
    if (this.visited.has(nextCell.x + '-' + nextCell.y)) {
      let visitedStatesOfCell: Array<BenderState> = this.visited.get(
        nextCell.x + '-' + nextCell.y
      )!;
      for (let i = 0; i < visitedStatesOfCell.length; i++) {
        let stateToCheck: BenderState = visitedStatesOfCell[i];
        if (
          stateToCheck.isInvertedDirection ===
            this.currentState.isInvertedDirection &&
          stateToCheck.isBreakerMode === this.currentState.isBreakerMode &&
          stateToCheck.currentHeading === this.currentState.currentHeading
        ) {
          return true;
        }
      }
    } else {
      this.visited.set(nextCell.x + '-' + nextCell.y, []);
    }

    this.visited.get(nextCell.x + '-' + nextCell.y)?.push({
      isBreakerMode: this.currentState.isBreakerMode,
      isInvertedDirection: this.currentState.isInvertedDirection,
      currentHeading: this.currentState.currentHeading,
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
      (this.currentState.isBreakerMode === false &&
        (worldMap.pointsMatrix[nextCellPoint.y][nextCellPoint.x] ===
          WorldMapPointType.X ||
          worldMap.pointsMatrix[nextCellPoint.y][nextCellPoint.x] ===
            WorldMapPointType.OBSTACLE)) ||
      (this.currentState.isBreakerMode === true &&
        worldMap.pointsMatrix[nextCellPoint.y][nextCellPoint.x] ===
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
    let pointAxisChange = WorldMap.headingMap.get(direction)!.axisShift;
    return {
      x: this.currentPoint.x + pointAxisChange.x,
      y: this.currentPoint.y + pointAxisChange.y,
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
        WorldMap.headingMap.get(this.currentState.currentHeading)!.fullHeading
      );

      let pointDataStr = worldMap.getSquareContents(nextCell);
      //console.debug("Contents : '%s'", pointDataStr);
      // change Breaker mode
      if (pointDataStr === WorldMapPointType.BEER) {
        //console.log('*** Breaker mode ***');
        this.changeBreakerMode();
      } else if (pointDataStr === WorldMapPointType.INVERTER) {
        this.changeDirectionPriority();
      } else if (pointDataStr === WorldMapPointType.X && this.currentState.isBreakerMode) {
        worldMap.changeSquareContents(nextCell, WorldMapPointType.SPACE);
      } else if (pointDataStr === WorldMapPointType.TELEPORT) {
        nextCell = worldMap.moveToOtherTeleportCell(nextCell);
      } else if (WorldMap.headingMap.has(pointDataStr)) {
        this.currentState.currentHeading =
        WorldMap.headingMap.get(pointDataStr)!.direction;
      }

      this.currentPoint = nextCell;

      // console.log(
      //   'Heading : %s',
      //   mapPointTypeToStringMapping.get(this.currentState.currentHeading)
      // );

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
