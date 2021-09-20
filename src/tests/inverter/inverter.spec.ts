import test from 'ava';
import { Bender } from '../../lib/bender';
import { loadMapFile } from '../../lib/map_loader';
import { WorldMap } from '../../lib/world_map';

test('breakerMode', (t) => {
  let mapMatrix = loadMapFile('./src/tests/inverter/input.txt');
  let worldMap = new WorldMap(mapMatrix);
  let bender = new Bender(worldMap.startPoint);
  let desiredOutput = [
    'SOUTH',
    'SOUTH',
    'SOUTH',
    'SOUTH',
    'WEST',
    'WEST',
    'WEST',
    'WEST',
    'WEST',
    'WEST',
    'WEST',
    'NORTH',
    'NORTH',
    'NORTH',
    'NORTH',
    'NORTH',
    'NORTH',
    'NORTH',
    'EAST',
    'EAST',
    'EAST',
    'EAST',
    'EAST',
    'EAST',
    'EAST',
    'SOUTH',
    'SOUTH',
  ];
  let output = bender.goThroughMap(worldMap);
  t.deepEqual(output, desiredOutput);
});
