import React from 'react';
import {getDisplay} from "../../util/queries";
import calculateColor from "../../util/calculateColor";
import {kmapAllAdminAreas} from "../../init";
import AppState from '../../redux/AppState';
import {connect} from 'react-redux';

function NationalAverage({min, spread, average, text, isOnline}) {
    return (
        <div id="nationalaveragediv" style={{backgroundColor: calculateColor(average, min, spread), ...getDisplay(isOnline)}}>
            <span id="nationalaveragelabel">{kmapAllAdminAreas}:</span>
            <span id="nationalaverageimg">{text}</span>
        </div>
    );
}

const mapStateToProps = (state) => ({
    isOnline: state.appState === AppState.ONLINE
});

export default connect(mapStateToProps)(NationalAverage);
