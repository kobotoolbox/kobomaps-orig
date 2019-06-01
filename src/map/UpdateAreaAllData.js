/**
 * Updates all data for all areas
 * Data: associative array of the percentages keyed by Area names as defined in the JSON that defines areas and their bounds
 * Note: All of this assumes positive numbers.
 */
import calculateMinSpread from '../util/calculateMinSpread';

export default function UpdateAreaAllData(title, data, nationalAverage, indicator, unit) {

    const {min, spread} = calculateMinSpread(data);

    //loop over all our data
    Object.keys(data).forEach(function (areaName) {
        let currentData = data[areaName];
        data[areaName] = currentData = isNaN(currentData) ? ' ' : currentData;
    });
}
