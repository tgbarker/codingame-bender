import test from 'ava';
import { Bender } from './bender';
import { directionPriority, WorldMap, WorldMapPointType } from './world_map';

test('changeDirection', (t) => {
  const bender: Bender = new Bender({ x: 0, y: 0 }, directionPriority);
  t.is(bender.currentState.isInvertedDirection, false);
  bender.changeDirectionPriority();
  t.is(bender.currentState.isInvertedDirection, true);
});

test('changeBreakerMode', (t) => {
  const bender: Bender = new Bender({ x: 0, y: 0 }, directionPriority);
  t.is(bender.currentState.isBreakerMode, false);
  bender.changeBreakerMode();
  t.is(bender.currentState.isBreakerMode, true);
});

test('decideWhereToMove', (t) => {
  const worldMap: WorldMap = new WorldMap([
    [WorldMapPointType.START, WorldMapPointType.X, WorldMapPointType.TELEPORT],
    [WorldMapPointType.EAST, WorldMapPointType.SPACE, WorldMapPointType.X],
  ]);
  const bender: Bender = new Bender(worldMap.startPoint, directionPriority);

  let nextCell = bender.canMoveToSquare(worldMap, bender.currentState.currentHeading);
  t.is(nextCell.x, 0);
  t.is(nextCell.y, 1);
});

test('canMoveToSquare', (t) => {
  const worldMap: WorldMap = new WorldMap([
    [WorldMapPointType.START,WorldMapPointType.SPACE,WorldMapPointType.TELEPORT,],
    [WorldMapPointType.X, WorldMapPointType.SPACE, WorldMapPointType.X],
  ]);
  const bender: Bender = new Bender(worldMap.startPoint, directionPriority);

  let nextCell = bender.canMoveToSquare(worldMap, bender.currentState.currentHeading);
  t.is(nextCell.x, 0);
  t.is(nextCell.y, 0);
});
