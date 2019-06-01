import React from 'react';
import {getMap} from "../globals/map";
import {closeAllInfoWindows, openInfoWindow} from "../globals/infoWindows";
import {addArea} from "../globals/geographicAreas";
import {areaPoints, labels} from "./parseJsonToGmap";
import {InfoWindow, Polygon} from "react-google-maps";
import calculateMinSpread from "../util/calculateMinSpread";
import calculateColor from "../util/calculateColor";
import getAreaInfoWindowChart from "./getAreaInfoWindowChart";
import Area from "./Area";


export function buildPolygons(data) {
    const areaValues = data.data ?? {};
    const {min, spread} = calculateMinSpread(areaValues);

    return Object.keys(areaPoints).map(function (areaName, idx) {
        const points = areaPoints[areaName];
        const value = areaValues[areaName];
        const infoWindowContent = getAreaInfoWindowChart(areaName, min, spread, data.title, areaValues, data.code, data.unit)
        let showInfoWindow = false;

        return <Area
            key={idx}
            points={points}
            value={value}
            min={min}
            spread={spread}
            infoWindowContent={infoWindowContent}
        />
        //creates a list of the place names we've encountered

    });
}
