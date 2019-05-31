import React from 'react';
import Interpolate from "react-interpolate-component";

export default function NationalAverageChart({chart}) {
    const nationalAverageProps = {
        with: {
            chart: chart
        },
        unsafe: true,
        component:"div",
        id:"nationalIndicatorChart"
    };

    return (
        <div>
            <Interpolate {...nationalAverageProps}>
                %(chart)s
            </Interpolate>
        </div>
    );
}
