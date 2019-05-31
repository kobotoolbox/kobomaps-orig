import React from 'react';
import ReactDom from 'react-dom';
import createMapOptions from './createMapOptions';
import Map from './Map';

export default function buildMap(config) {
    ReactDom.render(
        <Map options={createMapOptions(config.mapDefaults)}/>,
        document.getElementById('map_canvas')
    )
}
