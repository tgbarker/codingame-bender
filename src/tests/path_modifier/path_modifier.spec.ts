import test from 'ava';
import { Bender } from '../../lib/bender';
import { loadMapFile } from '../../lib/map_loader';
import { WorldMap } from '../../lib/world_map';

test('pathModifier', (t) => {
  let mapMatrix = loadMapFile('./src/tests/path_modifier/input.txt');
  let worldMap = new WorldMap(mapMatrix);
  let bender = new Bender(worldMap.startPoint);
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
