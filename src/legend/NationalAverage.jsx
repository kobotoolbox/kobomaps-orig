import React from 'react';
import {getDisplay} from "../util/queries";

export default function ({color, text}) {
    return (
        <div id="nationalaveragediv" style={{backgroundColor: color, ...getDisplay(!!text)}}>
            <span id="nationalaveragelabel"/>
            <span id="nationalaverageimg">{text}</span>
        </div>
    );
}
