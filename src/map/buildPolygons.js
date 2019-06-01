import React from 'react';
import calculateMinSpread from "../util/calculateMinSpread";
import getAreaInfoWindowChart from "./getAreaInfoWindowChart";
import Area from "./Area";
import {getStore} from '../redux/redux-store';
import AppState from '../redux/AppState';

export function buildPolygons(data) {
    const areaValues = data.data ?? {};
    const {min, spread} = calculateMinSpread(areaValues);
    const areas = getStore().getState().areas;
    return Object.keys(areas).map(function (areaName, idx) {
        const points = areas[areaName].points;
        const value = areaValues[areaName];
        const infoWindowContent = getStore().getState().appState === AppState.ONLINE ? getAreaInfoWindowChart(areaName, min, spread, data.title, areaValues, data.code, data.unit) : '';

        return <Area
            key={idx}
            name={areaName}
            points={points}
            value={value}
            min={min}
            spread={spread}
            infoWindowContent={infoWindowContent}
        />
        //creates a list of the place names we've encountered

    });
}
