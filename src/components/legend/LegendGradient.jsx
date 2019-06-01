import React from 'react';
import {getDisplay} from "../../util/queries";
import AppState from '../../redux/AppState';
import {connect} from 'react-redux';

function LegendGradient({min, max, unit, isOnline}) {
    return (
        <div id="legend_gradient" style={getDisplay(isOnline)}>
            <div id="percentleft" title={min}>{min} {unit}</div>
            <div id="percentright" title={max}>{max} {unit}</div>
        </div>
    );
}

const mapStateToProps = (state) => ({
    isOnline: state.appState === AppState.ONLINE
});

export default connect(mapStateToProps)(LegendGradient);
