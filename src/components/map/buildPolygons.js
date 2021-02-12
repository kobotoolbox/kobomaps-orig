import React from 'react';
import calculateMinSpread from '../../util/calculateMinSpread';
import Area from './Area';
import {getStore} from '../../redux/redux-store';

export function buildPolygons(data) {
    const areaValues = data.data ?? {};
    const {min, spread} = calculateMinSpread(Object.keys(areaValues).map(key=> areaValues[key]));
    const areas = getStore().getState().areas;

    return Object.keys(areas).map(function (areaName, idx) {
        const points = areas[areaName].points;
        const value = areaValues[areaName];

        return <Area
            key={idx}
            index={idx}
            name={areaName}
            points={points}
            value={value}
            min={min}
            spread={spread}
        />;
        //creates a list of the place names we've encountered

    });
}
