/**
 * Takes in an indicator string and then renders the map according to the data for that indicator
 * If the indicator doesn't exist it'll just exit gracefully
 */
import UpdateAreaAllData from './UpdateAreaAllData';
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
    }
}
