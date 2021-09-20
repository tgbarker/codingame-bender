import test from 'ava';
import { Bender } from '../../lib/bender';
import { loadMapFile } from '../../lib/map_loader';
import { WorldMap } from '../../lib/world_map';

test('simpleMoves', (t) => {
  let simpleMovesMatrix = loadMapFile('./src/tests/priorities/input.txt');
  let worldMap = new WorldMap(simpleMovesMatrix);
  let bender = new Bender(worldMap.startPoint);
  let desiredOutput = ['SOUTH', 'SOUTH', 'EAST', 'EAST', 'EAST', 'NORTH', 'NORTH', 'NORTH', 'NORTH', 'NORTH'];
  let output = bender.goThroughMap(worldMap);
  t.deepEqual(output, desiredOutput);
});
