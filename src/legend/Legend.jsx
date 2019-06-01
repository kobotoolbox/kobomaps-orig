import React from 'react';
import ReactDom from 'react-dom';
import LegendGradient from "./LegendGradient";
import calculateMinSpread from "../util/calculateMinSpread";
import NationalAverage from "./NationalAverage";
import addCommas from "../util/addCommas";
import htmlDecode from "../util/htmlDecode";
import IndicatorSource from "./IndicatorSource";
import NationalAverageChart from "./NationalAverageChart";
import {connect} from 'react-redux';

function Legend({title, indicator}) {
    let min, spread, max;
    min = spread = max = 0;

    if (indicator.data) {
        ({min, spread} = calculateMinSpread(indicator.data));
        max = min + spread;
    }

    let unit = htmlDecode(indicator.unit ?? '');
    let nationalAverage = addCommas(indicator.nationalAverage) + ' ' + unit;
    if (nationalAverage === ' ') {
        nationalAverage = '';
    }


    return(
        <div id="legend">
            <div id="legendtext">
                <span id="spanLegendText">{title}</span>
            </div>
            <LegendGradient min={min} max={max} unit={unit}/>
            <NationalAverage min={min} spread={spread} average={indicator.nationalAverage} text={nationalAverage}/>
            <NationalAverageChart indicator={indicator} average={indicator.nationalAverage} unit={unit} code={indicator.code}/>
            <IndicatorSource title={indicator.source} href={indicator.link} />
            <div id="poweredby">
                <a href="http://www.kobotoolbox.org" title="KoBoToolbox.org">powered by KoboToolbox</a>
            </div>
        </div>
    )
}

const mapStateToProps = (state) =>({
    indicator: state.indicators.byCode(state.activeIndicator) ?? {}
});

export default connect(mapStateToProps)(Legend);
