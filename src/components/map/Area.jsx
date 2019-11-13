import React from 'react';
import {InfoWindow, Polygon} from 'react-google-maps';
import calculateColor from '../../util/calculateColor';
import AppState from '../../redux/AppState';
import {connect} from 'react-redux';
import {toggleInfoWindowVisibility} from '../../redux/actions/metadata';
import IndicatorForRegionChart from '../legend/IndicatorForRegionChart';
import * as PropTypes from "prop-types";

function getFillColor(appState, value, min, spread) {
    if (appState !== AppState.ONLINE) {
        return '#aaaaaa';
    }
    return calculateColor(value, min, spread);
}

const setOptionsHandler = (options) => function () {
    this.setOptions(options);
};

function Area({index, name, showInfoWindow, points, value, min, spread, position, toggleInfoWindowVisibility, closeInfoWindow, appState}) {

    return (
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
                    toggleInfoWindowVisibility(index, event.latLng);
                }}
                onMouseOver={setOptionsHandler({fillOpacity: 0.95})}
                onMouseOut={setOptionsHandler({fillOpacity: 0.6})}
            />
            {showInfoWindow(index) && <InfoWindow position={position(index)} options={{zIndex:1400}} onCloseClick={function () {
                closeInfoWindow(index);
            }}><IndicatorForRegionChart areaName={name} min={min} spread={spread}/></InfoWindow>}
        </div>
    );
}

const mapStateToProps = (state) => ({
    appState: state.appState,
    showInfoWindow: (areaIndex) => state.appState === AppState.ONLINE && !!state.infoWindowVisibilityFlags[areaIndex],
    position: (areaIndex) => state.infoWindowVisibilityFlags[areaIndex]
});

const mapDispatchToProps = (dispatch) => ({
    toggleInfoWindowVisibility: (index, position) => dispatch(toggleInfoWindowVisibility(index, position)),
    closeInfoWindow: (index) => dispatch(toggleInfoWindowVisibility(index, false))
});

export default connect(mapStateToProps, mapDispatchToProps)(Area);
