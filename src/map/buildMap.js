import React from 'react';
import ReactDom from 'react-dom';
import createMapOptions from './createMapOptions';
import Map from './Map';
import MapContainer from "./MapContainer";

export default function buildMap(config) {
    ReactDom.render(
        <MapContainer options={createMapOptions(config.mapDefaults)}/>,
        document.getElementById('map_canvas')
    )
}
