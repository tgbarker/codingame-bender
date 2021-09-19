import test from 'ava';
import { Bender } from '../../lib/bender';
import { loadMapFile } from '../../lib/map_loader';
import { directionPriority, WorldMap } from '../../lib/world_map';

test('pathModifier', (t) => {
  let simpleMovesMatrix = loadMapFile('./src/tests/path_modifier/input.txt');
  let worldMap = new WorldMap(simpleMovesMatrix);
  let bender = new Bender(worldMap.startPoint, directionPriority);
  let desiredOutput = [
    'SOUTH',
    'SOUTH',
    'EAST',
    'EAST',
    'EAST',
    'EAST',
    'EAST',
    'EAST',
    'NORTH',
    'NORTH',
    'NORTH',
    'NORTH',
    'NORTH',
    'NORTH',
    'WEST',
    'WEST',
    'WEST',
    'WEST',
    'SOUTH',
    'SOUTH',
  ];
  let output = bender.goThroughMap(worldMap);
  t.deepEqual(output, desiredOutput);
});
