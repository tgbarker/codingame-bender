import test from 'ava';
import { loadMapFile } from './map_loader';

test('mapLoader', (t) => {
    let mapMatrix = loadMapFile('./src/input.txt');
    t.assert(mapMatrix.length > 0);
});
