import {connect} from 'react-redux';
import AppState from '../../redux/AppState';
import CanvasJSReact from '../../vendor/canvasjs.react';
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

import React from 'react';

function parseDataPoints(data, areaName, color) {
    return Object.keys(data).map(function (key, idx) {
        return {
            x: idx,
            label: key,
            y: data[key],
            color: areaName === key ? color : undefined
        };
    }).map(function (d) {
        if(d.color === undefined) {
            delete d.color;
        }
        return d;
    });
}

function parseDataPointsForArea(indicator, areaName, color) {
    return [].concat({label: indicator.name, x: 0, y: indicator.data[areaName], color: color},indicator.siblings.map(function (sibling, idx) {
        return {
            x: idx+1,
            label: sibling.name,
            y: sibling.data[areaName]
        };
    }));
}

const options = {
    animationEnabled: true,
    data: [{
        color: '#0000ff',
        indexLabelPlacement: 'inside',
        type: 'bar',
        dataPoints: undefined
    }]
};

function IndicatorForRegionChart({indicator, areaName}) {
    function firstOptions() {
        const dataPoints = parseDataPoints(indicator.data, areaName, '#ff0000');
        return {
            ...options,
            height: 1000,
            width: 400,
            title: {
                text: indicator.parent.name,
            },
            subtitles: [{
                text: indicator.name
            }],
            axisY: {
                valueFormatString: `### "${indicator.unit}"`,
            },
            axisX: {
                labelFontSize: 10,
                interval: 1,
                reversed: true
            },
            data: [{
                ...options['data'][0],
                dataPoints: dataPoints
            }]
        };
    }

    function secondOptions() {
        const dataPoints = parseDataPointsForArea(indicator, areaName, '#ff0000');
        return {
            ...options,
            height: 160,
            width: 400,
            title: {
                text: indicator.parent.name,
            },
            subtitles: [{
                text: areaName
            }],
            axisY: {},
            axisX: {
                labelFontSize: 10,
                interval: 1,
                reversed: true
            },
            data: [{
                ...options['data'][0],
                dataPoints: dataPoints
            }]
        };
    }

    return (
        <div style={{width: '420px', height: '400px', overflowY: 'scroll'}}>
            <CanvasJSChart options={firstOptions()}
                /* onRef={ref => this.chart = ref} */
            />
            <CanvasJSChart options={secondOptions()}
                /* onRef={ref => this.chart = ref} */
            />
            {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
        </div>
    );
}

function mapStateToProps(state) {
    return {indicator: state.appState === AppState.ONLINE ? state.indicators.byCode(state.activeIndicator) : {}};
}

export default connect(mapStateToProps)(IndicatorForRegionChart);
