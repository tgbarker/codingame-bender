import test from 'ava';
import { Bender } from '../../lib/bender';
import { loadMapFile } from '../../lib/map_loader';
import { directionPriority, WorldMap } from '../../lib/world_map';

test('breakerMode', (t) => {
  let simpleMovesMatrix = loadMapFile('./src/tests/broken_wall/input.txt');
  let worldMap = new WorldMap(simpleMovesMatrix);
  let bender = new Bender(worldMap.startPoint, directionPriority);
  let desiredOutput = [
    'SOUTH',
    'SOUTH',
    'SOUTH',
    'SOUTH',
    'EAST',
    'EAST',
    'EAST',
    'EAST',
    'NORTH',
    'NORTH',
    'WEST',
    'WEST',
    'WEST',
    'WEST',
    'SOUTH',
    'SOUTH',
    'SOUTH',
    'SOUTH',
    'EAST',
    'EAST',
    'EAST',
    'EAST',
    'EAST',
  ];
  let output = bender.goThroughMap(worldMap);
  t.deepEqual(output, desiredOutput);
});
