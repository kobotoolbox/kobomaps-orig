import React from 'react';
import AppState from '../../redux/AppState';
import {connect} from 'react-redux';
import {getNationalAverages} from '../../chart/nationalAverages';
import CanvasJSReact from '../../vendor/canvasjs.react';
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

function NationalAverageChart({indicator, regionMapIsIn}) {
    getNationalAverages(indicator);
    const options = {
        height: 110,
        animationEnabled: false,
        title: {
            text: indicator.parent.name + regionMapIsIn
        },
        axisX: {
            title: 'indicators',
            reversed: true
        },
        axisY: {
            title: 'average age'
        },
        data: [{
            indexLabelPlacement: 'inside',
            type: 'bar',
            dataPoints: getNationalAverages(indicator).map(function (indicator) {
                return {y: indicator.average, label: indicator.indicator};
            })
        }]
    };
    /*return (
        <div>

            <Interpolate unsafe={true} component="div" id="nationalIndicatorChart">
                {isOnline ? getNationalAverageChart(indicator) : ''}
            </Interpolate>
        </div>
    );*/

    return (
        <div style={{position: 'absolute', top: '60px'}}>
            <CanvasJSChart options={options}
                /* onRef={ref => this.chart = ref} */
            />
            {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
        </div>
    );
}
const mapStateToProps = (state) =>({
    isOnline: state.appState === AppState.ONLINE,
    indicator: state.appState === AppState.ONLINE ? state.indicators.byCode(state.activeIndicator) : null
});

export default connect(mapStateToProps)(NationalAverageChart);
