import calculateColor from '../util/calculateColor';
import addCommas from '../util/addCommas';
import htmlDecode from '../util/htmlDecode';
import calculateMinSpread from '../util/calculateMinSpread';
import {indicatorsToUpdateParams, kmapAllAdminAreas} from '../init';
import {createChart} from '../chart';
import $ from '../jquery';
/**
 * This takes in the min score, the spread between the min and the max, and the national average
 * and then updates the nationalaveragediv element
 */
export default function updateNationalAverage(min, spread, nationalAverage, unit, indicator) {
    ////////////////////////////////////////////////////////////////
    //updates the key
    ////////////////////////////////////////////////////////////////
    //set the color
    const color = calculateColor(nationalAverage, min, spread);
    $('#nationalaveragediv').css('background-color', color);
    $('#nationalaverageimg').text(addCommas(nationalAverage) + ' ' + htmlDecode(unit));

    ////////////////////////////////////////////////////////////////
    //updates the national average chart
    ////////////////////////////////////////////////////////////////
    //first check if there's more than one answer to the given question
    const $indicator = $('#bottom_level_' + indicator);
    const $nationalIndicatorChart = $('#nationalIndicatorChart');
    if ($indicator.siblings().length === 0) {
        //clear out the National Chart
        $nationalIndicatorChart.html('');
        return;
    }
    //there is more than one answer ...as so many questions have.

    //get the data for those questions
    const dataForNational = [];
    const mainIndicatorText = $indicator.text();
    const questionText = $indicator.parents('li.level2').children('span.level2').text();
    //get the data for the indicator we're focused on

    dataForNational[mainIndicatorText] = indicatorsToUpdateParams[indicator]['nationalAverage'];

    //get the rest of the data
    $.each($indicator.siblings(), function () {
        const otherIndicator = $(this);
        const otherIndicatorId = otherIndicator.attr('id').substring(13);
        const indicatorText = otherIndicator.text();
        dataForNational[indicatorText] = indicatorsToUpdateParams[otherIndicatorId]['nationalAverage'];
    });


    //calculate the min and spread for the national graph specific
    const spreadMin = calculateMinSpread(dataForNational);
    var min2 = spreadMin['min'];
    var spread2 = spreadMin['spread'];
    const nationalChart = createChart(questionText + ' (' + kmapAllAdminAreas + ')', dataForNational, mainIndicatorText, indicator + '_by_indicator_national_chart', unit, min2, spread2);
    $nationalIndicatorChart.html(nationalChart);

}
