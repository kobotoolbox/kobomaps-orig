import React from 'react';
import {InfoWindow, Polygon} from "react-google-maps";
import Interpolate from "react-interpolate-component";
import calculateColor from "../util/calculateColor";
import AppState from '../redux/AppState';
import {connect} from 'react-redux';

function getFillColor(appState, value, min, spread) {
    if (appState !== AppState.ONLINE) {
        return '#aaaaaa';
    }
    return calculateColor(value, min, spread);
}

const setOptionsHandler = (options) => function () {
    this.setOptions(options);
};

const Area = ({name, showInfoWindow, points, value, min, spread, infoWindowContent, position, toggleInfoWindowVisibility, appState})=>(
    <div>
        <Polygon
            options={{
                paths: points,
                strokeColor: '#00CC00', //sets the line color to red
                strokeOpacity: 0.8, //sets the line color opacity to 0.8
                strokeWeight: 2, //sets the width of the line to 3
                fillColor: getFillColor(appState, value, min, spread), //sets the fill color
                fillOpacity: 0.6 //sets the opacity of the fill color
            }}
            onClick={function (event) {
                toggleInfoWindowVisibility(name, event.latLng)
            }}
            onMouseOver={setOptionsHandler({fillOpacity: 0.95})}
            onMouseOut={setOptionsHandler({fillOpacity: 0.6})}
        />
        {showInfoWindow(name) && <InfoWindow position={position(name)}><Interpolate unsafe={true} component="div">{infoWindowContent}</Interpolate></InfoWindow>}
    </div>
);

const mapStateToProps = (state) => ({
    appState: state.appState,
    showInfoWindow: (windowName) => state.appState === AppState.ONLINE && !!state.infoWindowVisibilityFlags[windowName],
    position: (windowName) => state.infoWindowVisibilityFlags[windowName]
});

const mapDispatchToProps = (dispatch) => ({
    toggleInfoWindowVisibility: (name, position) => dispatch(toggleInfoWindowVisibility({name, position}))
});

export default connect(mapStateToProps, mapDispatchToProps)(Area);
