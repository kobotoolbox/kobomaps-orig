import React from 'react';
import Interpolate from "react-interpolate-component";
import getNationalAverageChart from "./getNationalAverageChart";

export default function NationalAverageChart({average, unit, code}) {
    return (
        <Interpolate unsafe={true} component="div" id="nationalIndicatorChart">
            {getNationalAverageChart(average, unit, code)}
        </Interpolate>
    );
}
