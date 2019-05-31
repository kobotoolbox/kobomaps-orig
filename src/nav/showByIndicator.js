/**
 * Takes in an indicator string and then renders the map according to the data for that indicator
 * If the indicator doesn't exist it'll just exit gracefully
 */
import UpdateAreaAllData from '../chart/UpdateAreaAllData';
import $ from '../jquery';
import {getIndicator} from "../globals/indicators";
import {clearInfoWindows, closeAllInfoWindows} from "../globals/infoWindows";

export default function showByIndicator(indicator) {
    const indicatorMetadata = getIndicator(indicator);
    if (indicatorMetadata) {
        const title = indicatorMetadata['title'];
        const data = indicatorMetadata['data'];
        const nationalAverage = indicatorMetadata['nationalAverage'];
        const unit = indicatorMetadata['unit'];

        closeAllInfoWindows();
        clearInfoWindows();
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
