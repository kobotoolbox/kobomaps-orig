import $ from '../jquery';
import { geographicAreaNames } from '../init';

export default function parseDataArray(data) {
    data.pop();
    let labels = data.shift().slice(3);

    function htmlEncode(value){
        // the .text() method escapes everything nice and neet for us.
        return $('<div/>').text(value).html();
    }

    const parsed = {};
    const nationalAverageIndex = labels.indexOf('TOTAL');
    const sourceIndex = labels.indexOf('Source');
    const linkIndex = labels.indexOf('Source Link');
    const unitIndex = labels.indexOf('Unit');

    const exclude = ['TOTAL', 'Source', 'Source Link', 'Unit'];

    const excludeMeta = function (label) {
        return !~exclude.indexOf(label);
    };
    labels = labels.filter(excludeMeta);
    let firstLevelName, secondLevelName;
    for (let i = 0; i < data.length; i++) {
        let current, indicatorName, currentParsed;
        current = data[i];
        firstLevelName = current.shift() || firstLevelName;
        secondLevelName = current.shift() || secondLevelName;
        indicatorName = current.shift();
        currentParsed = {
            title: "<strong>" + htmlEncode(secondLevelName) + '</strong><br />  &quot;' + htmlEncode(indicatorName) + '&quot;'
        };

        if (~unitIndex) {
            currentParsed.unit = current[unitIndex] || ' ';
        }

        if (~linkIndex) {
            currentParsed.link = current[linkIndex];
        }
        if (~sourceIndex) {
            currentParsed.source = current[sourceIndex];
        }
        if (~nationalAverageIndex) {
            currentParsed.nationalAverage = current[nationalAverageIndex];
        }

        currentParsed.data = current.filter(excludeMeta).reduce(function (accumulator, current, idx) {
            const label = labels[idx];
            if (geographicAreaNames[label]) {
                accumulator[label] = +current.replace('%', '');
            }
            return accumulator;
        }, {});

        parsed[firstLevelName] = parsed[firstLevelName] || {};
        parsed[firstLevelName][secondLevelName] = parsed[firstLevelName][secondLevelName] || {};
        parsed[firstLevelName][secondLevelName][indicatorName] = currentParsed;
    }
    return parsed;
}
