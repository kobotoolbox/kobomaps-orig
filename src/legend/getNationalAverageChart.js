import calculateMinSpread from '../util/calculateMinSpread';
import {kmapAllAdminAreas} from '../init';
import {createChart} from '../chart';

/**
 * This takes in the min score, the spread between the min and the max, and the national average
 * and then updates the nationalaveragediv element
 */
export default function getNationalAverageChart(nationalAverage, unit, indicatorCode, indicator) {
    ////////////////////////////////////////////////////////////////
    //updates the national average chart
    ////////////////////////////////////////////////////////////////
    //clear out the National Chart
    //first check if there's more than one answer to the given question
    const siblings = indicator.siblings;
    if (siblings.length === 0) {
        return '';
    }

    //there is more than one answer ...as so many questions have.

    //get the data for those questions
    const dataForNational = [];
    const mainIndicatorText = indicator.name;
    const questionText = indicator.parent.name;
    //get the data for the indicator we're focused on

    dataForNational[mainIndicatorText] = indicator.nationalAverage;

    //get the rest of the data
    siblings.forEach(function (sibling) {
        dataForNational[sibling.name] = sibling.nationalAverage;
    });


    //calculate the min and spread for the national graph specific
    const {min, spread} = calculateMinSpread(dataForNational);
    return createChart(questionText + ' (' + kmapAllAdminAreas + ')', dataForNational, mainIndicatorText, indicatorCode + '_by_indicator_national_chart', unit, min, spread);
}
