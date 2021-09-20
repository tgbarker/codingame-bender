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
