import React from 'react';
import {getDisplay} from "../util/queries";
import calculateColor from "../util/calculateColor";
import {kmapAllAdminAreas} from "../init";

export default function NationalAverage({min, spread, average, text}) {

    return (
        <div id="nationalaveragediv" style={{backgroundColor: calculateColor(average, min, spread), ...getDisplay(!!average)}}>
            <span id="nationalaveragelabel">{kmapAllAdminAreas}:</span>
            <span id="nationalaverageimg">{text}</span>
        </div>
    );
}
