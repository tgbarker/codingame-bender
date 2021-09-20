import test from 'ava';
import { Bender } from '../../lib/bender';
import { loadMapFile } from '../../lib/map_loader';
import { WorldMap } from '../../lib/world_map';

test('straightLine', (t) => {
  let mapMatrix = loadMapFile('./src/tests/straight_line/input.txt');
  let worldMap = new WorldMap(mapMatrix);
  let bender = new Bender(worldMap.startPoint);
  let desiredOutput = ['EAST', 'EAST', 'EAST', 'EAST','SOUTH', 'SOUTH','SOUTH', 'SOUTH',];
  let output = bender.goThroughMap(worldMap);
  t.deepEqual(output, desiredOutput);
});
