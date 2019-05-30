/**
 * Takes in an indicator string and then renders the map according to the data for that indicator
 * If the indicator doesn't exist it'll just exit gracefully
 */
import toggleActive from './toggleActive';
import UpdateAreaAllData from '../chart/UpdateAreaAllData';
import $ from '../jquery';
import { indicatorsToUpdateParams } from '../init';

export default function showByIndicator(indicator) {
    const indicatorMetadata = indicatorsToUpdateParams[indicator];
    if (indicatorMetadata) {
        const title = indicatorMetadata['title'];
        const data = indicatorMetadata['data'];
        const nationalAverage = indicatorMetadata['nationalAverage'];
        const unit = indicatorMetadata['unit'];

        UpdateAreaAllData(title, data, nationalAverage, indicator, unit);

        $.address.parameter('indicator', indicator);

        const $indicator = $('#bottom_level_' + indicator);
        const level1Item = $indicator.parents('li.level1').children('span.level1');
        const level2Item = $indicator.parents('li.level2').children('span.level2');
        const level3Item = $indicator;


        toggleActive(level1Item, true); //set "forceOn" to true to force it to show, even if it is already showing
        toggleActive(level2Item, true); //set "forceOn" to true to force it to show, even if it is already showing

        $('li.level3').removeClass('active'); //removes highlight of any other level3 li element
        level3Item.addClass('active'); //highlights active span
        //update the source link and the source title
        $('#sourcetextspan').show();
        const $sourceURL = $('#sourceURL');
        $sourceURL.text(indicatorMetadata['source']);
        $sourceURL.attr('title', indicatorMetadata['source']);
        $sourceURL.attr('href', indicatorMetadata['link']);

        //Show the national average and gradient divs
        $('#legend_gradient, #nationalaveragediv').show();
    }
}
