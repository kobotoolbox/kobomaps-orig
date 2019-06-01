import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux'
import {getStore} from '../redux/redux-store';
import createMapOptions from './createMapOptions';
import Map from './Map';
import MapContainer from "./MapContainer";

export default function buildMap(config) {
    ReactDom.render(
        <Provider store={getStore()}>
            <Map options={createMapOptions(config.mapDefaults)}/>
        </Provider>,
        document.getElementById('map_canvas')
    )
}
