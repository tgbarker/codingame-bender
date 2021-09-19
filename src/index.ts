import { Bender } from './lib/bender';
import { loadMapFile } from './lib/map_loader';
import {
  directionPriority,
  WorldMap,
} from './lib/world_map';

let mapMatrix = loadMapFile('./src/input.txt');
let worldMap = new WorldMap(mapMatrix);
let bender = new Bender(worldMap.startPoint, directionPriority);

let listOfDirections = bender.goThroughMap(worldMap);

// Output to console in required format
for(var i = 0; i < listOfDirections.length; i++){
  console.log(listOfDirections[i]);
}