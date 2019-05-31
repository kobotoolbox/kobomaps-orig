import calculateColor from '../util/calculateColor';
import addCommas from '../util/addCommas';
import htmlDecode from '../util/htmlDecode';
import calculateMinSpread from '../util/calculateMinSpread';
import {kmapAllAdminAreas} from '../init';
import {createChart} from '../chart';
import {getIndicator, getIndicatorSiblings} from "../globals/indicators";
import {
    clearNationalIndicatorChart,
    setNationalAverageColor,
    setNationalAverageText,
    setNationIndicatorChart
} from "./legend-dom";

/**
 * This takes in the min score, the spread between the min and the max, and the national average
 * and then updates the nationalaveragediv element
 */
export default function updateNationalAverage(min, spread, nationalAverage, unit, indicatorCode) {
    ////////////////////////////////////////////////////////////////
    //updates the key
    ////////////////////////////////////////////////////////////////
    //set the color
    setNationalAverageColor(calculateColor(nationalAverage, min, spread));
    setNationalAverageText(addCommas(nationalAverage) + ' ' + htmlDecode(unit));

    ////////////////////////////////////////////////////////////////
    //updates the national average chart
    ////////////////////////////////////////////////////////////////
    //first check if there's more than one answer to the given question
    const siblings = getIndicatorSiblings(indicatorCode);
    if (siblings.length === 0) {
        //clear out the National Chart
        clearNationalIndicatorChart();
        return;
    }
    //there is more than one answer ...as so many questions have.

    let indicator = getIndicator(indicatorCode);

    //get the data for those questions
    const dataForNational = [];
    const mainIndicatorText = indicator.name;
    const questionText = indicator.parentName;
    //get the data for the indicator we're focused on

    dataForNational[mainIndicatorText] = indicator.nationalAverage;

    //get the rest of the data
    siblings.forEach(function (sibling) {
        dataForNational[sibling.name] = sibling.nationalAverage;
    });


    //calculate the min and spread for the national graph specific
    const spreadMin = calculateMinSpread(dataForNational);
    var min2 = spreadMin['min'];
    var spread2 = spreadMin['spread'];
    const nationalChart = createChart(questionText + ' (' + kmapAllAdminAreas + ')', dataForNational, mainIndicatorText, indicatorCode + '_by_indicator_national_chart', unit, min2, spread2);
    setNationIndicatorChart(nationalChart);

}
