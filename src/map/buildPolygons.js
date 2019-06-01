import React from 'react';
import {getMap} from "../globals/map";
import {closeAllInfoWindows, openInfoWindow} from "../globals/infoWindows";
import {addArea} from "../globals/geographicAreas";
import {areaPoints, labels} from "./parseJsonToGmap";
import {Polygon} from "react-google-maps";
import calculateMinSpread from "../util/calculateMinSpread";
import calculateColor from "../util/calculateColor";

function getFillColor(value, min, spread) {
    if (value === undefined) {
        return '#aaaaaa';
    }
    return calculateColor(value, min, spread);
}

export function buildPolygons(data) {
    const areaValues = data.data ?? {};
    const {min, spread} = calculateMinSpread(areaValues);

    return Object.keys(areaPoints).map(function (areaName, idx) {
        const points = areaPoints[areaName];
        const value = areaValues[areaName];

        return <Polygon
            key={idx}
            options={{
                paths: points,
                strokeColor: '#00CC00', //sets the line color to red
                strokeOpacity: 0.8, //sets the line color opacity to 0.8
                strokeWeight: 2, //sets the width of the line to 3
                fillColor: getFillColor(value, min, spread), //sets the fill color
                fillOpacity: 0.6 //sets the opacity of the fill color
            }}
            onClick={function (event) {
                //close all other info windows if they are open
                closeAllInfoWindows();
                //set up the new info window and open it.
                openInfoWindow(areaName, event.latLng)
            }}
            onMouseOver={setOptionsHandler({fillOpacity: 0.95})}
            onMouseOut={setOptionsHandler({fillOpacity: 0.6})}
        />;
        //creates a list of the place names we've encountered

    });
}

const setOptionsHandler = (options) => function () {
    this.setOptions(options);
};
