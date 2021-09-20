import test from 'ava';
import { Bender } from '../../lib/bender';
import { loadMapFile } from '../../lib/map_loader';
import { WorldMap } from '../../lib/world_map';

test('simpleMoves', (t) => {
  let simpleMovesMatrix = loadMapFile('./src/tests/simple_moves/input.txt');
  let worldMap = new WorldMap(simpleMovesMatrix);
  let bender = new Bender(worldMap.startPoint);
  let desiredOutput = ['SOUTH', 'SOUTH', 'EAST', 'EAST'];
  let output = bender.goThroughMap(worldMap);
  t.deepEqual(output, desiredOutput);
});
