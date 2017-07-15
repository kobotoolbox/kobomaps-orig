function parseDataArray(data, areas) {
    "use strict";
    data.pop();
    var labels = data.shift().slice(3);

    function htmlEncode(value){
        // the .text() method escapes everything nice and neet for us.
        return $('<div/>').text(value).html();
    }

    var parsed = { };
    var nationalAverageIndex = labels.indexOf('TOTAL');
    var sourceIndex = labels.indexOf('Source');
    var linkIndex = labels.indexOf('Source Link');
    var unitIndex = labels.indexOf('Unit');

    var exclude = ['TOTAL', 'Source', 'Source Link', 'Unit'];

    var excludeMeta = function (label) {
        return !~exclude.indexOf(label);
    };
    labels = labels.filter(excludeMeta);

    for (var i = 1; i < data.length; i++) {
        var current = data[i],
            firstLevelName = current.shift() || firstLevelName,
            secondLevelName = current.shift() || secondLevelName,
            indicatorName = current.shift(),

            currentParsed = {
                title: "<strong>" + htmlEncode(secondLevelName)+'</strong><br />  &quot;'+htmlEncode(indicatorName)+'&quot;'
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
            var label = labels[idx];
            if (areas[label]) {
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