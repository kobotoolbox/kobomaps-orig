import React from 'react';
import {getDisplay} from '../../util/queries';
import calculateColor from '../../util/calculateColor';
import AppState from '../../redux/AppState';
import {connect} from 'react-redux';

function NationalAverage({min, spread, average, text, isOnline, regionMapIsIn}) {
    return (
        <div id="nationalaveragediv" style={{backgroundColor: calculateColor(average, min, spread), ...getDisplay(isOnline)}}>
            <span id="nationalaveragelabel">{regionMapIsIn}:</span>
            <span id="nationalaverageimg">{text}</span>
        </div>
    );
}

const mapStateToProps = (state) => ({
    isOnline: state.appState === AppState.ONLINE
});

export default connect(mapStateToProps)(NationalAverage);
