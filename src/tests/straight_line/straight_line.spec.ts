import test from 'ava';
import { Bender } from '../../lib/bender';
import { loadMapFile } from '../../lib/map_loader';
import { directionPriority, WorldMap } from '../../lib/world_map';

test('straightLine', (t) => {
  let simpleMovesMatrix = loadMapFile('./src/tests/straight_line/input.txt');
  let worldMap = new WorldMap(simpleMovesMatrix);
  let bender = new Bender(worldMap.startPoint, directionPriority);
  let desiredOutput = ['EAST', 'EAST', 'EAST', 'EAST','SOUTH', 'SOUTH','SOUTH', 'SOUTH',];
  let output = bender.goThroughMap(worldMap);
  t.deepEqual(output, desiredOutput);
});
