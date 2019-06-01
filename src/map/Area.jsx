import React from 'react';
import {compose, withStateHandlers} from "recompose";
import {InfoWindow, Polygon} from "react-google-maps";
import {closeAllInfoWindows, openInfoWindow} from "../globals/infoWindows";
import Interpolate from "react-interpolate-component";
import calculateColor from "../util/calculateColor";

function getFillColor(value, min, spread) {
    if (value === undefined) {
        return '#aaaaaa';
    }
    return calculateColor(value, min, spread);
}

const setOptionsHandler = (options) => function () {
    this.setOptions(options);
};

export default compose(withStateHandlers(
    () => ({
        showInfoWindow: false,
        position: undefined
    }), {
        onToggleOpen: () => (position) => ({
            position,
            showInfoWindow: true,
        })
    }
))(({onToggleOpen, showInfoWindow, points, value, min, spread, infoWindowContent, position})=>(
    <div>
        <Polygon
            options={{
                paths: points,
                strokeColor: '#00CC00', //sets the line color to red
                strokeOpacity: 0.8, //sets the line color opacity to 0.8
                strokeWeight: 2, //sets the width of the line to 3
                fillColor: getFillColor(value, min, spread), //sets the fill color
                fillOpacity: 0.6 //sets the opacity of the fill color
            }}
            onClick={function (event) {
                onToggleOpen(event.latLng)
            }}
            onMouseOver={setOptionsHandler({fillOpacity: 0.95})}
            onMouseOut={setOptionsHandler({fillOpacity: 0.6})}
        />
        {showInfoWindow && <InfoWindow position={position}><Interpolate unsafe={true} component="div">{infoWindowContent}</Interpolate></InfoWindow>}
    </div>
))
