import test from 'ava';
import { isSameMapCoordinate, MapCoordinates, WorldMap, WorldMapPointType } from './world_map';

test('initMapSuccess', (t) => {
    const worldMap : WorldMap = new WorldMap([['', WorldMapPointType.START, WorldMapPointType.TELEPORT]]);
    t.deepEqual(worldMap.startPoint, {x:1,y:0});
});

test('getSquareContents', (t) => {
    const worldMap : WorldMap = new WorldMap([['', WorldMapPointType.START, WorldMapPointType.TELEPORT]]);
    t.is(worldMap.getSquareContents({x:1,y:0}), WorldMapPointType.START.toString());
});

test('changeSquareContents', (t) => {
    const worldMap : WorldMap = new WorldMap([['', WorldMapPointType.X, WorldMapPointType.TELEPORT]]);
    const pointToChange : MapCoordinates = {x:1,y:0};
    t.is(worldMap.getSquareContents(pointToChange), WorldMapPointType.X);
    worldMap.changeSquareContents(pointToChange, WorldMapPointType.SPACE);
    t.is(worldMap.getSquareContents(pointToChange), WorldMapPointType.SPACE);
});

test('moveToOtherTeleport', (t) => {
    const worldMap : WorldMap = new WorldMap([['', WorldMapPointType.TELEPORT, WorldMapPointType.TELEPORT]]);
    const firstTeleport : MapCoordinates = {x:1,y:0};
    const secondTeleport = worldMap.moveToOtherTeleportCell(firstTeleport);
    
    t.deepEqual(isSameMapCoordinate(secondTeleport, {x:2,y:0}), true);
});


