import {informationChart} from '.';

export default function createChart(title, data, highLightName, id, unit, min, spread) {

    //now loop through the data and build the rest of the URL
    let names = '';
    let blues = '';
    let reds = '';
    const nameDelim = '|';
    const numberDelim = ',';
    let count = 0;

    for (let areaName in data) {
        const areaAmount = data[areaName];
        if (!(areaAmount === ' ' || isNaN(areaAmount))) { // patches issue where zones with no data kill the overlay
            count++;
            if (count > 1) //if we're doing this more than once
            {
                blues += numberDelim;
                reds += numberDelim;
            }
            //handle the special case of the named area being the area who's data we're looping over
            if (areaName.toUpperCase() === highLightName.toUpperCase()) {
                blues += '0';
                reds += areaAmount;
            } else {
                blues += areaAmount;
                reds += '0';
            }
            //for whatever reason the data names and the data values are in reverse order
            areaName = encodeURIComponent(areaName).replace(/ /g, '+');

            names = nameDelim + areaName + names;
        } else { // patches issue where zones with no data show data from last indicator
            data[areaName] = ' ';
        }
    }
    //setup the height
    const kmapInfochartHeight = (count * (parseInt(informationChart.barHeight) + parseInt(informationChart.barHeightMargin))) + Math.round(parseInt(informationChart.axisLabelStylesFont) * 1.7);
    let kmapInfochart_temp = informationChart.url.replace('<HEIGHT>', kmapInfochartHeight);


    //setup the range
    let kmapInfoChartRange = '0,100,0,100';
    if (unit !== '%' || (unit === '%' && min < 0)) {
        kmapInfoChartRange = min + ',' + (min + spread) + ',' + min + ',' + (min + spread);
    }

    kmapInfochart_temp = kmapInfochart_temp.replace('<RANGE>', kmapInfoChartRange);

    //setup the range labels
    let kampInfoChartRangeLabels = '0|25|50|75|100';
    if (unit !== '%' || (unit === '%' && min < 0)) {
        kampInfoChartRangeLabels = min + '|' +
            (min + (spread * .25)) + '|' +
            (min + (spread * .5)) + '|' +
            (min + (spread * .75)) + '|' +
            (min + spread);
        //toFixed(Math.log(10)/Math.log((1.0/minMagnitude)))
    }

    kmapInfochart_temp = kmapInfochart_temp.replace('<RANGE_LABELS>', kampInfoChartRangeLabels);

    let chartStr = '<div id="' + id + '" class="infowindow"><p class="bubbleheader">' + title
        + '</p><img src="' + kmapInfochart_temp; //This is the base of the Google Chart API graph (without the data part). Needs to be defined in the container file.

    //now put all of that together
    chartStr += names + '&chd=t:' + blues + nameDelim + reds + '" height="' + kmapInfochartHeight + '" width="' + informationChart.width + '" /></div>';
    return chartStr;

}
