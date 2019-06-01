import React from 'react';
import {connect} from 'react-redux';
import { compose, withProps } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";
import {buildPolygons} from "./buildPolygons";
import buildLabels from "./buildLabels";
import AppState from '../../redux/AppState';

const Map = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyCumzV-izHlMmcyzsJuRkOwY4aWjkW2DPY&sensor=false",
        loadingElement: <p id="loadingtext">Please be patient while the map is loading.</p>,
        containerElement: <div id="map_canvas"/>,
        mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap
)(function (props) {

        return <GoogleMap options={props.options}>
            {buildPolygons(props.indicator)}
            {buildLabels(props.indicator)}
        </GoogleMap>;
    }
);

const mapStateToProps = (state) => ({
    indicator: state.appState === AppState.ONLINE ? state.indicators.byCode(state.activeIndicator) : {}
});

export default connect(mapStateToProps)(Map);
