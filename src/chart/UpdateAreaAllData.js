/**
 * Updates all data for all areas
 * Data: associative array of the percentages keyed by Area names as defined in the JSON that defines areas and their bounds
 * Note: All of this assumes positive numbers.
 */
import {infoWindows, map} from '../init';
import calculateMinSpread from '../util/calculateMinSpread';
import UpdateAreaPercentageTitleData from './UpdateAreaPercentageTitleData';
import updateKey from '../legend/updateKey';
import updateNationalAverage from '../legend/updateNationalAverage';

export default function UpdateAreaAllData(title, data, nationalAverage, indicator, unit) {

    const {min, spread} = calculateMinSpread(data);

    google.maps.event.addListener(map, 'click', function () {
        for (let windowName in infoWindows) {
            infoWindows[windowName].close();
        }
    });
    //loop over all our data
    for (let areaName in data) {
        let currentData = data[areaName];
        data[areaName] = currentData = isNaN(currentData) ? ' ' : currentData;
        UpdateAreaPercentageTitleData(areaName, currentData, min, spread, title, data, indicator, currentData === ' ' ? '' : unit); // patch: hides unit on zones without data
    }

    //update the key
    updateKey(min, spread, title, unit);

    //update the national average
    if (nationalAverage !== undefined) {
        updateNationalAverage(min, spread, nationalAverage, unit, indicator);
    }
}
