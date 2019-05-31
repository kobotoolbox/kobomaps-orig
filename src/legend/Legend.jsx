import React from 'react';
import ReactDom from 'react-dom';
import LegendGradient from "./LegendGradient";
import calculateMinSpread from "../util/calculateMinSpread";
import NationalAverage from "./NationalAverage";
import addCommas from "../util/addCommas";
import htmlDecode from "../util/htmlDecode";
import IndicatorSource from "./IndicatorSource";
import NationalAverageChart from "./NationalAverageChart";

export default function Legend({title, data}) {
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
            <NationalAverage min={min} spread={spread} average={data.nationalAverage} text={nationalAverage}/>
            <NationalAverageChart average={data.nationalAverage} unit={unit} code={data.code}/>
            <IndicatorSource title={data.source} href={data.link} />
            <div id="poweredby">
                <a href="http://www.kobotoolbox.org" title="KoBoToolbox.org">powered by KoboToolbox</a>
            </div>
        </div>
    )
}
