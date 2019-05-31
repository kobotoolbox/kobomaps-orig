import React from 'react';
import {getDisplay} from "../util/queries";

const isVisible = (min, max) => !!(min+max);

export default function LegendGradient({min, max, unit}) {
    return (
        <div id="legend_gradient" style={getDisplay(isVisible(min, max))}>
            <div id="percentleft" title={min}>{min} {unit}</div>
            <div id="percentright" title={max}>{max} {unit}</div>
        </div>
    );
}
