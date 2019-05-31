import React from 'react';
import ReactDom from 'react-dom';
import LegendGradient from "./LegendGradient";
import calculateMinSpread from "../util/calculateMinSpread";
import NationalAverage from "./NationalAverage";
import calculateColor from "../util/calculateColor";
import addCommas from "../util/addCommas";
import htmlDecode from "../util/htmlDecode";
import IndicatorSource from "./IndicatorSource";
import updateNationalAverage from "./updateNationalAverage";
import NationalAverageChart from "./NationalAverageChart";

function Legend({title, data}) {
    let min, spread, max;
    min = spread = max = 0;

    if (data.data) {
        ({min, spread} = calculateMinSpread(data.data));
        max = min + spread;
    }

    let unit = htmlDecode(data.unit ?? '');
    let nationalAverage = addCommas(data.nationalAverage) + ' ' + unit;
    if (nationalAverage === ' ') {
        nationalAverage = '';
    }


    return(
        <div id="legend">
            <div id="legendtext">
                <span id="spanLegendText">{title}</span>
            </div>
            <LegendGradient min={min} max={max} unit={unit}/>
            <NationalAverage
                color={calculateColor(data.nationalAverage, min, spread)}
                text={nationalAverage}
            />
            <NationalAverageChart chart={updateNationalAverage(nationalAverage, unit, data.code)}/>
            <IndicatorSource title={data.source ?? ''} href={data.link ?? ''} />
            <div id="poweredby">
                <a href="http://www.kobotoolbox.org" title="KoBoToolbox.org">powered by KoboToolbox</a>
            </div>
        </div>
    )
}

export default function (data) {
    ReactDom.render(
        <Legend data={data} title={data.name ?? 'Please select an indicator to display its data.'} />,
        document.getElementById('topbar')
    );
}
