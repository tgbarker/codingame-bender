import test from 'ava';
import { Bender } from '../../lib/bender';
import { loadMapFile } from '../../lib/map_loader';
import { WorldMap } from '../../lib/world_map';

test('breakerMode', (t) => {
  let simpleMovesMatrix = loadMapFile('./src/tests/breaker_mode/input.txt');
  let worldMap = new WorldMap(simpleMovesMatrix);
  let bender = new Bender(worldMap.startPoint);
  let desiredOutput = [
    'SOUTH',
    'SOUTH',
    'SOUTH',
    'SOUTH',
    'EAST',
    'EAST',
    'EAST',
    'EAST',
    'EAST',
    'EAST',
  ];
  let output = bender.goThroughMap(worldMap);
  t.deepEqual(output, desiredOutput);
});
