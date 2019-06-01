import React from 'react';
import {areaManager} from "../globals/geographicAreas";
import calculateMinSpread from "../util/calculateMinSpread";
import getAreaInfoWindowChart from "./getAreaInfoWindowChart";
import Area from "./Area";


export function buildPolygons(data) {
    const areaValues = data.data ?? {};
    const {min, spread} = calculateMinSpread(areaValues);

    return Object.keys(areaManager.areas).map(function (areaName, idx) {
        const points = areaManager.areas[areaName].points;
        const value = areaValues[areaName];
        const infoWindowContent = getAreaInfoWindowChart(areaName, min, spread, data.title, areaValues, data.code, data.unit);

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
