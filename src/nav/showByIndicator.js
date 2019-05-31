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
