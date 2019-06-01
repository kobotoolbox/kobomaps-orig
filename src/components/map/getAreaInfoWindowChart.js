/**
 * Name: Area's name as defined in the JSON that defines areas and their bounds
 * Min: Minimum value of percentages across all areas for baselining the color scale
 * Spread: Spread from min to max of percentages across all areas for making the ceiling of the color scale
 * Title: Title of the question
 * Data: associative array of the percentages keyed by Area names as defined in the JSON that defines areas and their bounds
 */
import {createChart, createChartByIndicators, informationChart} from '../../chart';

export default function getAreaInfoWindowChart(name, min, spread, title, data, indicator, unit) {
    if (indicator === undefined) {
        return '';
    }
    let message = '<div class="chartHolder" style="height:' + informationChart.holderHeight + 'px">' + createChart(title, data, name, indicator + '_by_area_chart', unit, min, spread);

    //create the chart by for all the indicators of the given question, assuming there's more than one
    message += createChartByIndicators(indicator, name, unit);

    return message + '</div>';
}
