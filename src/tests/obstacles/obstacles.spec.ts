import test from 'ava';
import { Bender } from '../../lib/bender';
import { loadMapFile } from '../../lib/map_loader';
import { directionPriority, WorldMap } from '../../lib/world_map';

test('obstacles', (t) => {
  let mapMatrix = loadMapFile('./src/tests/obstacles/input.txt');
  let worldMap = new WorldMap(mapMatrix);
  let bender = new Bender(worldMap.startPoint, directionPriority);
  let desiredOutput = [
    'SOUTH',
    'EAST',
    'EAST',
    'EAST',
    'SOUTH',
    'EAST',
    'SOUTH',
    'SOUTH',
    'SOUTH',
  ];
  let output = bender.goThroughMap(worldMap);
  t.deepEqual(output, desiredOutput);
});
