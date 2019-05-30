import $ from '../jquery';
import calculateMinSpread from '../util/calculateMinSpread';
import {createChart} from '.';
import {indicatorsToUpdateParams} from '../init';

/**
 * Creates the URL for the chart that shows the spread over indicator for a given question for
 * both area and overal average
 *
 * message: the message string as it currently stands
 * indicator: the indicator we're looking at
 * name: the name of the current geographical area
 */
export default function createChartByIndicators(message, indicator, name, unit) {
    //first check if there's more than one answer to the given question
    if ($('#bottom_level_' + indicator).siblings().length === 0) {
        //clear out the National Chart
        $('#nationalIndicatorChart').html('');
        return message;
    }
    //there is more than one answer ...as so many questions have.

    //get the data for those questions
    const dataForArea = [];
    const mainIndicatorText = $('#bottom_level_' + indicator).text();
    const questionText = $('#bottom_level_' + indicator).parents('li.level2').children('span.level2').text();
    //get the data for the indicator we're focused on

    dataForArea[mainIndicatorText] = indicatorsToUpdateParams[indicator]['data'][name];


    //get the rest of the data
    $.each($('#bottom_level_' + indicator).siblings(), function () {
        const otherIndicator = $(this);
        const otherIndicatorId = otherIndicator.attr('id').substring(13);
        const indicatorText = otherIndicator.text();
        dataForArea[indicatorText] = indicatorsToUpdateParams[otherIndicatorId]['data'][name];
    });

    //calculate the min and spread for the area specific graph
    const spreadMin = calculateMinSpread(dataForArea);
    const min = spreadMin['min'];
    const spread = spreadMin['spread'];

    //build the freaking chart this is not that much fun. I should write a JS library that does this for me.
    //that's a really good idea. I should find someone to pay me to do that. You know it's probably already been done.
    //it's been done in like every language but javasript, so I just made the below function.
    message += createChart(name + ': ' + questionText, dataForArea, mainIndicatorText, indicator + '_by_indicator_area_chart', unit, min, spread);


    return message;
}
