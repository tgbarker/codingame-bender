import { Bender } from './lib/bender';
import { loadMapFile } from './lib/map_loader';
import {
  WorldMap,
} from './lib/world_map';

let mapMatrix = loadMapFile('./src/input.txt');
let worldMap = new WorldMap(mapMatrix);
let bender = new Bender(worldMap.startPoint);

let listOfDirections = bender.goThroughMap(worldMap);

// Output to console in required format
for(var i = 0; i < listOfDirections.length; i++){
  //console.log("'"+listOfDirections[i]+"',");
  console.log(listOfDirections[i]);
}