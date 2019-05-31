import calculateMinSpread from '../util/calculateMinSpread';
import {createChart} from '.';
import {getIndicator, getIndicatorSiblings} from "../globals/indicators";
import {clearNationalIndicatorChart} from "../legend/legend-dom";
/**
 * Creates the URL for the chart that shows the spread over indicator for a given question for
 * both area and overal average
 *
 * message: the message string as it currently stands
 * indicator: the indicator we're looking at
 * name: the name of the current geographical area
 */
export default function createChartByIndicators(message, indicatorCode, name, unit) {
    let siblings = getIndicatorSiblings(indicatorCode);
    //first check if there's more than one answer to the given question
    if (siblings.length === 0) {
        //clear out the National Chart
        clearNationalIndicatorChart();
        return message;
    }
    //there is more than one answer ...as so many questions have.

    let indicator = getIndicator(indicatorCode);
    //get the data for those questions
    const dataForArea = [];
    const mainIndicatorText = indicator.name;
    const questionText = indicator.parentName;
    //get the data for the indicator we're focused on

    dataForArea[mainIndicatorText] = indicator.data[name];

    //get the rest of the data
    siblings.forEach(function (sibling) {
        dataForArea[sibling.name] = sibling.data[name];
    });

    //calculate the min and spread for the area specific graph
    const spreadMin = calculateMinSpread(dataForArea);
    const min = spreadMin['min'];
    const spread = spreadMin['spread'];

    //build the freaking chart this is not that much fun. I should write a JS library that does this for me.
    //that's a really good idea. I should find someone to pay me to do that. You know it's probably already been done.
    //it's been done in like every language but javasript, so I just made the below function.
    message += createChart(name + ': ' + questionText, dataForArea, mainIndicatorText, indicatorCode + '_by_indicator_area_chart', unit, min, spread);


    return message;
}
