import React from 'react';
import Interpolate from "react-interpolate-component";
import getNationalAverageChart from "../../chart/getNationalAverageChart";
import AppState from '../../redux/AppState';
import {connect} from 'react-redux';

function NationalAverageChart({indicator, isOnline}) {
    return (
        <Interpolate unsafe={true} component="div" id="nationalIndicatorChart">
            {isOnline ? getNationalAverageChart(indicator) : ''}
        </Interpolate>
    );
}

const mapStateToProps = (state) =>({
    isOnline: state.appState === AppState.ONLINE,
    indicator: state.appState === AppState.ONLINE ? state.indicators.byCode(state.activeIndicator) : null
});

export default connect(mapStateToProps)(NationalAverageChart);
