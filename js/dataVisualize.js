//this code uses jquery (http://jquery.com)
//and the jquery Address plugin (http://www.asual.com/jquery/address/)
import jQuery from './jquery';
import './jquery.address-1.5';
import parseDataArray from './data-parser';
import buildNav from './nav-builder';
import CSVToArray from './csvToArray';
// import {google} from 'googleapis';

let informationChart, kmapAllAdminAreas;

(function ($) {
    /**
     * global variable that holds the map
     */
    let map;

    /**
     *  gives us a list of names for geographicAreas
     */
    const geographicAreaNames = [];
    /**
     * global variable holding an array of points for each area so areaPoints["bomi"]
     * would return an array of all the points for Bomi
     */
    let areaPoints = [];
    /**
     * global variable holding the polygons for each area. areaGPolygons["bomi"]
     * would return the polygon for Bomi
     */
    const areaGPolygons = [];
    /**
     * global variable holding all the Labels for each area
     */
    const labels = [];
    /**
     * global variable that holds all of the info windows
     */
    const infoWindows = [];

    /**
     * global array that maps the unqiue string indicator to the parameters that would
     * be fed into UpdateAreaAllData(title, data, nationalAverage). This way we can
     * use indicators to call the update method to redraw the map
     */
    let indicatorsToUpdateParams = [];

    $(function () {
        //patches issue with top navigation menu
        $('.pagetitlewrap').css('z-index', 120);
        $.getJSON('config.json', function (config) {
            informationChart = config.informationChart;

            informationChart.url = 'http://chart.apis.google.com/chart?' +
                'chxs=0,676767,' + informationChart.axisLabelStylesFont + ',2,l,676767|1,393939,' + informationChart.axisLabelStylesFont + ',1,l,676767' +
                '&chxt=x,y' +
                '&chbh=' + informationChart.barHeight + ',' + informationChart.barHeightMargin + ',0' +
                '&chs=' + informationChart.width + 'x<HEIGHT>' +
                '&cht=bhs' +
                '&chco=3E4E6E,CC0000' +
                '&chg=25,0,5,9' +
                '&chts=000000,13' +
                '&chxl=1:';

            kmapAllAdminAreas = config.allAdminAreas;

            initializeDraggables();
            map = createMap(config);
            parseJsonToGmap(config.boundariesFilename, config.dataFiles);
            $('#kmapTitle').html(config.title);
            $('#nationalaveragelabel').html(config.allAdminAreas + ':');
        });
    });


    //initializess everything, both the mandatory google maps stuff, and our totally awesome json to gPolygon code
    function createMapOptions(mapDefaults) {
        return {
            zoom: mapDefaults.zoom, 	//creates the initial zoom level. This is defined in the container file as it is country-specific
            center: new google.maps.LatLng(mapDefaults.latitude, mapDefaults.longitude), //creates the coordiantes that will center the map. This is defined in the container file as it is country-specific
            streetViewControl: false,
            panControl: false,
            mapTypeControl: true,
            mapTypeControlOptions: {
                position: google.maps.ControlPosition.RIGHT_BOTTOM,
                mapTypeIds: [google.maps.MapTypeId.TERRAIN, google.maps.MapTypeId.HYBRID, 'RIMM'],
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR
            },
            zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_CENTER
            }

        };
    }

    function createMap(config) {
        const gmap = new google.maps.Map(document.getElementById('map_canvas'), createMapOptions(config.mapDefaults));

        /*Creates the options for our custom map type*/
        const styledMapOptions = {
            name: 'Default',
            alt: 'View the map in Peacebuilding Data Project theme'
        };
        /*Adds new map and sets it to default*/
        const rimmMapType = new google.maps.StyledMapType(config.mapStyles, styledMapOptions);
        gmap.mapTypes.set('RIMM', rimmMapType);
        gmap.setMapTypeId('RIMM');
        return gmap;
    }

    function initializeDraggables() {
        // plugin uses with() construct
        // TODO replace with https://www.npmjs.com/package/draggable
        const dragResize = new DragResize('dragresize', {allow_resize: false, minLeft: 350, minTop: 40});


        dragResize.isElement = function (elm) {
            return !!(elm.className && ~elm.className.indexOf('drsElement'));
        };
        dragResize.isHandle = function (elm) {
            return !!(elm.className && ~elm.className.indexOf('drsMoveHandle'));
        };

        dragResize.apply(document);
    }

    function parseCSV(csvUrl) {
        const csvs = {};
        let currentSeries;

        function parseData(name) {
            currentSeries = name;
            indicatorsToUpdateParams = [];

            const parsedData = parseDataArray(CSVToArray(csvs[name], ','), geographicAreaNames);

            buildNav(parsedData, indicatorsToUpdateParams);

            //check if we're supposed to auto load the data for a particular indicator?
            const autoLoadIndicator = $.address.parameter('indicator');
            if (autoLoadIndicator !== '') {
                showByIndicator(autoLoadIndicator);
            }
            //hide the temporary loading text once the indicators are visible
            $('#loadingtext').remove();
        }

        //initiates a HTTP get request for the json file
        if (typeof csvUrl === 'string') {
            $.get('data/' + csvUrl, function (response) {
                csvs.unique = response;
                parseData('unique');
            });
        } else {
            const changeSeries = function (name, $link) {
                if ($link) {
                    $link.parent().parent().children().removeClass('active');
                    $link.parent().addClass('active');
                    parseData(name);
                }
                $.address.parameter('series', name);
            };

            $.address.externalChange(function () {
                const series = $.address.parameter('series');
                if (currentSeries !== series) {
                    let $link;
                    $('#tabs a').each(function (index, element) {
                        if (element.innerText === series) {
                            $link = $(element);
                            return false;
                        }
                    });

                    changeSeries(series, $link);
                }
            });
            const csvUrlLength = csvUrl.length;
            var series = $.address.parameter('series') || false;

            const getSheets = function (i) {
                const current = csvUrl[i];
                $.get('data/' + current.url, function (i, current) {
                    return function (response) {
                        const currentName = current.name;
                        csvs[currentName] = response;
                        const $link = $('<a>', {href: '#'});
                        const $li = $('<li>', {'class': 'survey-link'});
                        $li.append($link);
                        $link.click(function (event) {
                            event.preventDefault();
                            changeSeries(currentName, $link);
                        });
                        $link.text(currentName);
                        $('#tabs ul').append($li);
                        if (i === 0 || series && series === currentName) {
                            changeSeries(currentName, $link);
                        }
                    };
                }(i, current)).then(function () {
                    if (++i < csvUrlLength) {
                        getSheets(i);
                    }
                });
            };

            getSheets(0);
        }
    }//end parseCSV function

    function toggleActive(item, state) {
        'use strict';
        item.toggleClass('active', state);
        item.siblings('ul').toggle(state);
    }

    /**
     * Takes in an indicator string and then renders the map according to the data for that indicator
     * If the idicator doesn't exist it'll just exit gracefully
     */
    function showByIndicator(indicator) {
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


    function parseJsonToGmap(boundariesFilename, csvUrl) {
        //initalizes our global county point array
        areaPoints = [];

        //initiates a HTTP get request for the json file
        $.getJSON('data/' + boundariesFilename + '.txt', function (data) {

            //loops over each entry in the json over "areas"
            for (let areaIndex in data['areas']) {
                const areaData = data['areas'][areaIndex];


                //create an array entry for this county
                let areaName = areaData.area;
                areaPoints[areaName] = [];

                //creates a list of the place names we've encountered
                geographicAreaNames[areaName] = true;

                //now loops over every set of point in the json that defines an area.
                for (let pointsSetIndex in areaData.points) {
                    const pointsSetValue = areaData.points[pointsSetIndex];
                    areaPoints[areaName][pointsSetIndex] = [];
                    //now loop over every point in a set of points that defines an area
                    for (let pointsIndex in pointsSetValue) {
                        const pointsValue = pointsSetValue[pointsIndex];
                        areaPoints[areaName][pointsSetIndex][pointsIndex] = new google.maps.LatLng(pointsValue[0], pointsValue[1]);
                    }


                }

                const tempLabel = new Label({map: map});
                tempLabel.set('position', new google.maps.LatLng(areaData.marker[0], areaData.marker[1]));
                tempLabel.set('areaName', areaName);
                labels[areaName] = tempLabel;


            }

            //now loops over the array of points and creates polygons
            for (let areaName in areaPoints) {
                const points = areaPoints[areaName];
                //creates the polygon
                areaGPolygons[areaName] = new google.maps.Polygon({
                    paths: points,
                    strokeColor: '#00CC00', //sets the line color to red
                    strokeOpacity: 0.8, //sets the line color opacity to 0.8
                    strokeWeight: 2, //sets the width of the line to 3
                    fillColor: '#aaaaaa', //sets the fill color
                    fillOpacity: 0.75 //sets the opacity of the fill color
                });
                areaGPolygons[areaName].setMap(map); //places the polygon on the map

                //add mouse in
                google.maps.event.addListener(areaGPolygons[areaName], 'mouseover', function (event) {
                    this.setOptions({fillOpacity: 0.95});
                });

                //add mouse out
                google.maps.event.addListener(areaGPolygons[areaName], 'mouseout', function (event) {
                    this.setOptions({fillOpacity: 0.75});
                });
            }


            parseCSV(csvUrl);


        });


    }


    /**
     * Function to be called from the HTML to specify a new opacity and/or color value for a county
     * countyName - name of the county as defined in the json file
     * opacityValue - number between 1.0 and 0.0
     * colorValue - html color value, in the form "#RRGGBB" such as "#ff0000" which is red
     */
    function formatAreaOpacityColor(name, opacityValue, colorValue) {
        areaGPolygons[name].setOptions({
            fillColor: colorValue,
            fillOpacity: opacityValue
        });
    }

    /**
     * Given the percentage in question, the min percentage value, and the spread between
     * the min percentage and the max, this function returns back your color as a
     * string in the form "#RRGGBB"
     */
    function calculateColor(percentage, min, spread) {
        //calculate the color
        const red = 255;
        const blue = 255 - ((percentage - min) * (1 / spread) * 255);
        const green = 255 - ((percentage - min) * (1 / spread) * 255);
        const color = '#' + getHexadecimal(red) + getHexadecimal(green) + getHexadecimal(blue);

        return color;
    }


    /**
     Used to update the color of an area given a percentage, min and spread
     */
    function UpdateAreaPercentage(name, percentage, min, spread, unit) {
        //calculate the color
        const color = calculateColor(percentage, min, spread);


        //update the polygon with this new color
        formatAreaOpacityColor(name, 0.6, color);

        //update the label

        labels[name].set('areaValue', addCommas(percentage) + ' ' + unit);
        labels[name].draw();


    }

    /**
     Used to update the color and info window of an area
     */
    function UpdateAreaPercentageMessage(name, percentage, min, spread, message, unit) {
        //first update the polygon and the marker
        UpdateAreaPercentage(name, percentage, min, spread, unit);

        //close all other info windows if they are open
        for (var windowName in infoWindows) {
            infoWindows[windowName].close();
        }

        //now make up some info windows and click handlers and such
        const infoWindow = new google.maps.InfoWindow({content: message});
        infoWindows[name] = infoWindow;

        //remove any old listeners
        google.maps.event.clearListeners(areaGPolygons[name], 'click');
        // Add a listener for the click event
        google.maps.event.addListener(areaGPolygons[name], 'click', function (event) {
            //close all other info windows if they are open
            for (let windowName in infoWindows) {
                infoWindows[windowName].close();
            }
            //set up the new info window and open it.
            infoWindow.setPosition(event.latLng);
            infoWindow.open(map);
        });
    }

    /**
     * Name: Area's name as defined in the JSON that defines areas and their bounds
     * Percentage: percentage of X in the given area
     * Min: Minimum value of percentages across all areas for baselining the color scale
     * Spread: Spread from min to max of percentages across all areas for making the ceiling of the color scale
     * Title: Title of the question
     * Data: associative array of the percentages keyed by Area names as defined in the JSON that defines areas and their bounds
     */
    function UpdateAreaPercentageTitleData(name, percentage, min, spread, title, data, indicator, unit) {
        let message = '<div class="chartHolder" style="height:' + informationChart.holderHeight + 'px">' + createChart(title, data, name, indicator + '_by_area_chart', unit, min, spread);

        //create the chart by for all the indicators of the given question, assuming there's more than one
        message = createChartByIndicators(message, indicator, name, unit);

        message += '</div>';

        //now call the next method that does work
        UpdateAreaPercentageMessage(name, percentage, min, spread, message, unit);

    }


    /**
     * Creates the URL for the chart that shows the spread over indicator for a given question for
     * both area and overal average
     *
     * message: the message string as it currently stands
     * indicator: the indicator we're looking at
     * name: the name of the current geographical area
     */
    function createChartByIndicators(message, indicator, name, unit) {
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


    function createChart(title, data, highLightName, id, unit, min, spread) {

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
                }
                else {
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

    /**
     * This takes in a set of data and finds the min and max,
     * then uses super complex math to figure out the optimal min and max,
     * like round to nice managable numbers and decide if we should baseline
     * off of zero or not
     * then returns back an array with keys span and min
     */
    function calculateMinSpread(data) {
        //loop over the data to pre process it and figure out the below:
        let min = Infinity; // because we're using percentages we can assume that they'll never be above 100, so 101 is safe
        let max = -Infinity;
        for (let areaName in data) {
            data[areaName] = data[areaName];
            //check for min
            if (data[areaName] < min) {
                min = data[areaName];
            }
            //check for max
            if (data[areaName] > max) {
                max = data[areaName];
            }
        }
        // When all fields are NaN, min and max stay at Infinity,
        // which causes an infinite loop in the `calculateMagnitude` function
        // this patches the issue. todo: investigate why residual data remains on map
        if (min === Infinity) {
            min = 0;
        }
        if (max === -Infinity) {
            max = 0;
        }
        //figure out the order of magnitude of max
        const maxMagnitude = calculateMagnitude(max);
        if (maxMagnitude < 1) {
            if (max < 0) {
                max = 0;
            }
            else {
                max = maxMagnitude * 10;
            }
        }
        else if (maxMagnitude === 1) {
            max = 10;
        }
        else if (max % maxMagnitude !== 0) {
            max = (Math.floor(max / maxMagnitude) + 1) * maxMagnitude;
        }

        //figure out the order of magnitude of max
        const minMagnitude = calculateMagnitude(min);

        if (min === 0) {
            min = 0;
        }
        else if (minMagnitude < 1) {
            min = Math.floor(min / minMagnitude) * minMagnitude;
            min = parseFloat(min.toFixed(Math.log(10) / Math.log((1.0 / minMagnitude)))); //making up for crappy float rounding errors
        }
        else if (minMagnitude === 1) {
            min = 0;
        }
        else if (min % minMagnitude !== 0) {
            min = Math.floor(min / minMagnitude) * minMagnitude;
        }

        //now we decide if we want to base line off zero
        //We don't baseline off zero if the min is negative and the max is positive
        if (!(min < 0 && max > 0)) {
            //now we want to figure out if max or min is closer to zero
            let closerToZero = min;
            if (max < 0) { //max is closer
                closerToZero = max;
            }
            //now we see if the number closer to zero, is further from zero than max is from min. and if the absolute
            //value of the number involved are more than 1000

            if (!(Math.abs(closerToZero) > Math.abs(max - min) && Math.abs(closerToZero) > 1000)) {
                if (max > 0) {
                    min = 0;
                }
                else {
                    max = 0;
                }
            }

        }

        //calculate the spread
        const spread = max - min;

        return {min: min, spread: spread};
    }

    /**
     * Updates all data for all areas
     * Data: associative array of the percentages keyed by Area names as defined in the JSON that defines areas and their bounds
     * Note: All of this assumes positive numbers.
     */
    function UpdateAreaAllData(title, data, nationalAverage, indicator, unit) {

        const minSpread = calculateMinSpread(data);
        const min = minSpread['min'];
        const spread = minSpread['spread'];
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

    function calculateMagnitude(num) {
        let magnitude;
        num = Math.abs(num);

        if (num === 0 || num === Infinity)
            return 0;

        if (num >= 1) {
            magnitude = 0;
            for (let i = 1; i <= num; i = i * 10) {
                if (num - i < ((i * 10) - (1 * i))) {
                    magnitude = i;
                    break;
                }
            }
            return magnitude;
        }
        else { //it's a decimal value
            magnitude = 0.1;
            for (magnitude = 0.1; (num - magnitude) < 0; magnitude = magnitude / 10) {
                if (magnitude < 0.00000001) {
                    break;
                }
            }
            return magnitude;
        }
    }

    /**
     * This takes in the min score, the spread between the min and the max, and the national average
     * and then updates the nationalaveragediv element
     */
    function updateNationalAverage(min, spread, nationalAverage, unit, indicator) {
        ////////////////////////////////////////////////////////////////
        //updates the key
        ////////////////////////////////////////////////////////////////
        //set the color
        const color = calculateColor(nationalAverage, min, spread);
        $('#nationalaveragediv').css('background-color', color);
        $('#nationalaverageimg').text(addCommas(nationalAverage) + ' ' + htmlDecode(unit));

        ////////////////////////////////////////////////////////////////
        //updates the national average chart
        ////////////////////////////////////////////////////////////////
        //first check if there's more than one answer to the given question
        const $indicator = $('#bottom_level_' + indicator);
        const $nationalIndicatorChart = $('#nationalIndicatorChart');
        if ($indicator.siblings().length === 0) {
            //clear out the National Chart
            $nationalIndicatorChart.html('');
            return;
        }
        //there is more than one answer ...as so many questions have.

        //get the data for those questions
        const dataForNational = [];
        const mainIndicatorText = $indicator.text();
        const questionText = $indicator.parents('li.level2').children('span.level2').text();
        //get the data for the indicator we're focused on

        dataForNational[mainIndicatorText] = indicatorsToUpdateParams[indicator]['nationalAverage'];

        //get the rest of the data
        $.each($indicator.siblings(), function () {
            const otherIndicator = $(this);
            const otherIndicatorId = otherIndicator.attr('id').substring(13);
            const indicatorText = otherIndicator.text();
            dataForNational[indicatorText] = indicatorsToUpdateParams[otherIndicatorId]['nationalAverage'];
        });


        //calculate the min and spread for the national graph specific
        const spreadMin = calculateMinSpread(dataForNational);
        var min = spreadMin['min'];
        var spread = spreadMin['spread'];
        const nationalChart = createChart(questionText + ' (' + kmapAllAdminAreas + ')', dataForNational, mainIndicatorText, indicator + '_by_indicator_national_chart', unit, min, spread);
        $nationalIndicatorChart.html(nationalChart);

    }


    function updateKey(min, span, title, unit) {
        const $percentleft = $('#percentleft');
        $percentleft.attr('title', addCommas(min) + ' ' + htmlDecode(unit));
        $percentleft.text(addCommas(min) + ' ' + htmlDecode(unit));

        const $percentright = $('#percentright');
        $percentright.attr('title', addCommas((min + span)) + ' ' + htmlDecode(unit));
        $percentright.text(addCommas((min + span)) + ' ' + htmlDecode(unit));


        $('#spanLegendText').html(title);

    }

    function getHexadecimal(number) {
        number = Math.round(isNaN(number) ? 255 : number).toString(16);

        return number.length === 1 ? '0' + number : number;
    }

    function htmlDecode(value) {
        return $('<div/>').html(value).text();
    }

    //function needs to be escaped to work with Drupal where the $ character is reserved


    (function (j) {
        j(function () {
            let indicator;
            $.address.externalChange(function (event) {
                const newindicator = $.address.parameter('indicator');
                if (indicator !== newindicator) {
                    indicator = newindicator;
                    showByIndicator(indicator);
                }

            });
        });
    })(jQuery);


    function stripString(str) {
        return str.replace(/^\s+|\s+$/g, '');
    }

    function is_array(input) {
        return typeof(input) === 'object' && (input instanceof Array);
    }


    function addCommas(nStr) {
        nStr += '';
        let x = nStr.split('.');
        let x1 = x[0];
        let x2 = x.length > 1 ? '.' + x[1] : '';
        const rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }

}(jQuery));
