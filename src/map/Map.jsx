import React from 'react';
import { compose, withProps } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Polygon } from "react-google-maps";
import {buildPolygons} from "./buildPolygons";

export default compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyCumzV-izHlMmcyzsJuRkOwY4aWjkW2DPY&sensor=false",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `100%` }}/>,
        mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap
)((props) =>
    <GoogleMap options={props.options}>
        {buildPolygons()}
    </GoogleMap>
);
