import * as fs from 'fs';

/**
 * Loads a text file of a map into an Array<Array<string>>
 * 
 * @param filePath - path to the map file
 */
export function loadMapFile(filePath: string): Array<Array<string>> {
  // read input file
  const inputFile: string = fs.readFileSync(filePath, 'utf8');

  // split the string by new line
  var inputLineArray: string[] = inputFile.split(/\r?\n/);

  // analyze the first line consisting of constraints on line and column sizes
  var constraints: string[] = inputLineArray[0].split(' ');

  // supplied with number of lines and columns
  const numberOfLines: number = parseInt(constraints[0]);

  let mapMatrix: Array<Array<string>> = [];
  for (let i = 1; i <= numberOfLines; i++) {
    mapMatrix[i - 1] = inputLineArray[i].split('');
  }
  return mapMatrix;
}
