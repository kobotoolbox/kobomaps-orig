import React from 'react';
import LegendGradient from "./LegendGradient";
import calculateMinSpread from "../util/calculateMinSpread";
import NationalAverage from "./NationalAverage";
import addCommas from "../util/addCommas";
import htmlDecode from "../util/htmlDecode";
import IndicatorSource from "./IndicatorSource";
import NationalAverageChart from "./NationalAverageChart";
import {connect} from 'react-redux';
import AppState from '../redux/AppState';

function Legend({title, indicator, isOnline}) {
    let min, spread, max;
    let unit = '';
    let nationalAverage = '';

    min = spread = max = 0;

    if (isOnline) {
        ({min, spread} = calculateMinSpread(indicator.data));
        max = min + spread;
        unit = htmlDecode(indicator.unit ?? '');
        nationalAverage = addCommas(indicator.nationalAverage) + ' ' + unit;
    }

    return(
        <div id="legend">
            <div id="legendtext">
                <span id="spanLegendText">{title}</span>
            </div>
            <LegendGradient min={min} max={max} unit={unit}/>
            <NationalAverage min={min} spread={spread} average={indicator.nationalAverage} text={nationalAverage}/>
            <NationalAverageChart average={indicator.nationalAverage} unit={unit} code={indicator.code}/>
            <IndicatorSource title={indicator.source} href={indicator.link} />
            <div id="poweredby">
                <a href="http://www.kobotoolbox.org" title="KoBoToolbox.org">powered by KoboToolbox</a>
            </div>
        </div>
    )
}

const mapStateToProps = (state) =>({
    isOnline: state.appState === AppState.ONLINE,
    indicator: state.appState === AppState.ONLINE ? state.indicators.byCode(state.activeIndicator) : {},
    title: state.appState === AppState.ONLINE ? state.indicators.byCode(state.activeIndicator).name : 'Please select an indicator to display its data.'
});

export default connect(mapStateToProps)(Legend);
