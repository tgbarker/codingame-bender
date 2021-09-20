import { MapCoordinates } from "./map_coordinates";
import { WorldMapPointType } from "./map_point_type";

export type Heading = {
    axisShift : MapCoordinates;
    direction : WorldMapPointType;
    fullHeading : string;
  }
  