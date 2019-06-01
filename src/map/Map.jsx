import React from 'react';
import { compose, withProps } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";
import {buildPolygons} from "./buildPolygons";
import buildLabels from "./buildLabels";

export default compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyCumzV-izHlMmcyzsJuRkOwY4aWjkW2DPY&sensor=false",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `100%` }}/>,
        mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap
)(function (props) {

        return <GoogleMap options={props.options}>
            {buildPolygons(props.data)}
            {buildLabels(props.data)}
        </GoogleMap>;
    }
);
