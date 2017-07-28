//this code uses jquery (http://jquery.com)
//and the jquery Address plugin (http://www.asual.com/jquery/address/)
var kmapTitle, kmapAllAdminAreas, kmapY, kmapX, kmapZoom, kmapData, kmapInfodivHeight, kmapInfochartWidth, kmapInfochartBarHeight, kmapInfochartBarHeightMargin, kmapInfochartchxsFont, kmapInfochart, mapStyles, boundariesFilename;

(function ($) {
    /**
     * global variable that holds the map
     */
    var map;

    /**
     *  gives us a list of names for geographicAreas
     */
    var geographicAreaNames = [];
    /**
     * global variable holding an array of points for each area so areaPoints["bomi"]
     * would return an array of all the points for Bomi
     */
    var areaPoints = [];
    /**
     * global variable holding the polygons for each area. areaGPolygons["bomi"]
     * would return the polygon for Bomi
     */
    var areaGPolygons = [];
    /**
     * global variable holding all the Labels for each area
     */
    var labels = [];
    /**
     * global variable that holds all of the info windows
     */
    var infoWindows = [];

    /**
     * global array that maps the unqiue string indicator to the parameters that would
     * be fed into UpdateAreaAllData(title, data, nationalAverage). This way we can
     * use indicators to call the update method to redraw the map
     */
    var indicatorsToUpdateParams = [];

    $(document).ready(function () {
        //patches issue with top navigation menu
        $('.pagetitlewrap').css('z-index', 120);
        $.getJSON('config.json', function (config) {
            kmapData = config.dataFiles;
            kmapInfodivHeight = config.informationChartHeight;
            kmapInfochartWidth = config.informationChartWidth;
            kmapInfochartBarHeight = config.informationChartBarHeight;
            kmapInfochartBarHeightMargin = config.informationChartBarHeightMargin;
            kmapInfochartchxsFont = config.informationChartAxisLabelStylesFont;
            kmapInfochart = 'http://chart.apis.google.com/chart?'
                + 'chxs=0,676767,' + kmapInfochartchxsFont + ',2,l,676767|1,393939,' + kmapInfochartchxsFont + ',1,l,676767'
                + '&chxt=x,y'
                + '&chbh=' + kmapInfochartBarHeight + ',' + kmapInfochartBarHeightMargin + ',0'
                + '&chs=' + kmapInfochartWidth + 'x<HEIGHT>'
                + '&cht=bhs'
                + '&chco=3E4E6E,CC0000'
                + '&chg=25,0,5,9'
                + '&chts=000000,13'
                + '&chxl=1:';

            mapStyles = config.mapStyles;


            kmapTitle = config.title;
            kmapAllAdminAreas = config.allAdminAreas;
            kmapY = config.initialLatitude;
            kmapX = config.initialLongitude;
            kmapZoom = config.initialZoom;
            boundariesFilename = config.boundariesFilename;
            
            initialize();
            $("#kmapTitle").html(kmapTitle);
            $("#nationalaveragelabel").html(kmapAllAdminAreas + ':');
        });
    });


    //initializess everything, both the mandatory google maps stuff, and our totally awesome json to gPolygon code
    function initialize() {


        //setup drag stuff for the key
        var dragResize = new DragResize('dragresize', {allow_resize: false, minLeft: 350, minTop: 40});


        dragResize.isElement = function (elm) {
            if (elm.className && elm.className.indexOf('drsElement') > -1) return true;
        };
        dragResize.isHandle = function (elm) {
            if (elm.className && elm.className.indexOf('drsMoveHandle') > -1) return true;
        };

        dragResize.apply(document);
        //set the key to be 48 pixels from the bottom like it used to be.
        //we can't use bottom when dragging. We can only use top
        var height = $("#topbar").height();
        var screenHeight = $(window).height();
        //var top = screenHeight - (height + 40);
        //$("#topbar").css("top", top+"px");


        //creates the options for defining the zoom level, map type, and center of the google map
        var myOptions = {
            zoom: kmapZoom, 	//creates the initial zoom level. This is defined in the container file as it is country-specific
            center: new google.maps.LatLng(kmapY, kmapX), //creates the coordiantes that will center the map. This is defined in the container file as it is country-specific
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

        //creates the map by looking for the "map_canvas" item in the HTML below. the map will fill in the "map_canvas" div
        map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

        /*Creates the options for our custom map type*/
        var styledMapOptions = {
            name: "Default",
            alt: "View the map in Peacebuilding Data Project theme"
        };
        /*Adds new map and sets it to default*/
        var rimmMapType = new google.maps.StyledMapType(mapStyles, styledMapOptions);
        map.mapTypes.set('RIMM', rimmMapType);
        map.setMapTypeId('RIMM');


        //Calling the boundaries and data files. The variables need to be defined in the container file as they are country-specific
        parseJsonToGmap(boundariesFilename, kmapData);


    };


    function parseCSV(csvUrl) {
        var csvs = {};
        var currentSeries;

        function parseData(name) {
            currentSeries = name;
            indicatorsToUpdateParams = [];

            var parsedData = parseDataArray(CSVToArray(csvs[name], ","), geographicAreaNames);

            buildNav(parsedData, indicatorsToUpdateParams);

            //check if we're supposed to auto load the data for a particular indicator?
            var autoLoadIndicator = $.address.parameter("indicator");
            if (autoLoadIndicator !== "") {
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
            function changeSeries(name, $link) {
                if ($link) {
                    $link.parent().parent().children().removeClass('active');
                    $link.parent().addClass('active');
                    parseData(name);
                }
                $.address.parameter('series', name);
            }

            $.address.externalChange(function () {
                var series = $.address.parameter('series');
                if (currentSeries !== series) {
                    var $link;
                    $('#tabs a').each(function (index, element) {
                        if (element.innerText === series) {
                            $link = $(element);
                            return false;
                        }
                    });

                    changeSeries(series, $link);
                }
            });
            var csvUrlLength = csvUrl.length;
            var series = $.address.parameter('series') || false;

            function getSheets(i) {
                var current = csvUrl[i];
                $.get('data/' + current.url, function (i, current) {
                    return function (response) {
                        var currentName = current.name;
                        csvs[currentName] = response;
                        var $link = $('<a>', {href: '#'});
                        var $li = $('<li>', {'class': 'survey-link'});
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
                    }
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
        "use strict";
        item.toggleClass("active", state);
        item.siblings("ul").toggle(state);
    }

    /**
     * Takes in an indicator string and then renders the map according to the data for that indicator
     * If the idicator doesn't exist it'll just exit gracefully
     */
    function showByIndicator(indicator) {
        var indicatorMetadata = indicatorsToUpdateParams[indicator];
        if (indicatorMetadata) {
            var title = indicatorMetadata["title"];
            var data = indicatorMetadata["data"];
            var nationalAverage = indicatorMetadata["nationalAverage"];
            var unit = indicatorMetadata["unit"];

            UpdateAreaAllData(title, data, nationalAverage, indicator, unit);

            $.address.parameter("indicator", indicator);

            var $indicator = $("#bottom_level_" + indicator);
            var level1Item = $indicator.parents("li.level1").children("span.level1");
            var level2Item = $indicator.parents("li.level2").children("span.level2");
            var level3Item = $indicator;


            toggleActive(level1Item, true); //set "forceOn" to true to force it to show, even if it is already showing
            toggleActive(level2Item, true); //set "forceOn" to true to force it to show, even if it is already showing

            $('li.level3').removeClass("active"); //removes highlight of any other level3 li element
            level3Item.addClass("active"); //highlights active span
            //update the source link and the source title
            $("#sourcetextspan").show();
            var $sourceURL = $("#sourceURL");
            $sourceURL.text(indicatorMetadata["source"]);
            $sourceURL.attr("title", indicatorMetadata["source"]);
            $sourceURL.attr("href", indicatorMetadata["link"]);

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
            for (areaIndex in data["areas"]) {
                var areaData = data["areas"][areaIndex];


                //create an array entry for this county
                areaName = areaData.area;
                areaPoints[areaName] = [];

                //creates a list of the place names we've encountered
                geographicAreaNames[areaName] = true;

                //now loops over every set of point in the json that defines an area.
                for (pointsSetIndex in areaData.points) {
                    var pointsSetValue = areaData.points[pointsSetIndex];
                    areaPoints[areaName][pointsSetIndex] = [];
                    //now loop over every point in a set of points that defines an area
                    for (pointsIndex in pointsSetValue) {
                        var pointsValue = pointsSetValue[pointsIndex];
                        areaPoints[areaName][pointsSetIndex][pointsIndex] = new google.maps.LatLng(pointsValue[0], pointsValue[1]);
                    }


                }

                var tempLabel = new Label({map: map});
                tempLabel.set('position', new google.maps.LatLng(areaData.marker[0], areaData.marker[1]));
                tempLabel.set('areaName', areaName);
                labels[areaName] = tempLabel;


            }

            //now loops over the array of points and creates polygons
            for (var areaName in areaPoints) {
                var points = areaPoints[areaName];
                //creates the polygon
                areaGPolygons[areaName] = new google.maps.Polygon({
                    paths: points,
                    strokeColor: "#00CC00", //sets the line color to red
                    strokeOpacity: 0.8, //sets the line color opacity to 0.8
                    strokeWeight: 2, //sets the width of the line to 3
                    fillColor: "#aaaaaa", //sets the fill color
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
        var red = 255;
        var blue = 255 - ((percentage - min) * (1 / spread) * 255);
        var green = 255 - ((percentage - min) * (1 / spread) * 255);
        var color = "#" + getHexadecimal(red) + getHexadecimal(green) + getHexadecimal(blue);

        return color;
    }


    /**
     Used to update the color of an area given a percentage, min and spread
     */
    function UpdateAreaPercentage(name, percentage, min, spread, unit) {
        //calculate the color
        var color = calculateColor(percentage, min, spread);


        //update the polygon with this new color
        formatAreaOpacityColor(name, 0.6, color);

        //update the label

        labels[name].set("areaValue", addCommas(percentage) + " " + unit);
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
        var infoWindow = new google.maps.InfoWindow({content: message});
        infoWindows[name] = infoWindow;

        //remove any old listeners
        google.maps.event.clearListeners(areaGPolygons[name], 'click');
        // Add a listener for the click event
        google.maps.event.addListener(areaGPolygons[name], 'click', function (event) {
            //close all other info windows if they are open
            for (var windowName in infoWindows) {
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
        var message = '<div class="chartHolder" style="height:' + kmapInfodivHeight + 'px">' + createChart(title, data, name, indicator + "_by_area_chart", unit, min, spread);

        //create the chart by for all the indicators of the given question, assuming there's more than one
        message = createChartByIndicators(message, indicator, name, unit);

        message += "</div>";

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
        if ($("#bottom_level_" + indicator).siblings().length === 0) {
            //clear out the National Chart
            $("#nationalIndicatorChart").html("");
            return message;
        }
        //there is more than one answer ...as so many questions have.

        //get the data for those questions
        var dataForArea = [];
        var mainIndicatorText = $("#bottom_level_" + indicator).text();
        var questionText = $("#bottom_level_" + indicator).parents("li.level2").children("span.level2").text();
        //get the data for the indicator we're focused on

        dataForArea[mainIndicatorText] = indicatorsToUpdateParams[indicator]["data"][name];


        //get the rest of the data
        $.each($("#bottom_level_" + indicator).siblings(), function () {
            var otherIndicator = $(this);
            var otherIndicatorId = otherIndicator.attr("id").substring(13);
            var indicatorText = otherIndicator.text();
            dataForArea[indicatorText] = indicatorsToUpdateParams[otherIndicatorId]["data"][name];
        });

        //calculate the min and spread for the area specific graph
        var spreadMin = calculateMinSpread(dataForArea);
        var min = spreadMin["min"];
        var spread = spreadMin["spread"];

        //build the freaking chart this is not that much fun. I should write a JS library that does this for me.
        //that's a really good idea. I should find someone to pay me to do that. You know it's probably already been done.
        //it's been done in like every language but javasript, so I just made the below function.
        message += createChart(name + ": " + questionText, dataForArea, mainIndicatorText, indicator + "_by_indicator_area_chart", unit, min, spread);


        return message;
    }


    function createChart(title, data, highLightName, id, unit, min, spread) {

        //now loop through the data and build the rest of the URL
        var names = "";
        var blues = "";
        var reds = "";
        var nameDelim = "|";
        var numberDelim = ",";
        var count = 0;

        for (areaName in data) {
            var areaAmount = data[areaName];
            if (!(areaAmount === ' ' || isNaN(areaAmount))) { // patches issue where zones with no data kill the overlay
                count++;
                if (count > 1) //if we're doing this more than once
                {
                    blues += numberDelim;
                    reds += numberDelim;
                }
                //handle the special case of the named area being the area who's data we're looping over
                if (areaName.toUpperCase() === highLightName.toUpperCase()) {
                    blues += "0";
                    reds += areaAmount;
                }
                else {
                    blues += areaAmount;
                    reds += "0";
                }
                //for whatever reason the data names and the data values are in reverse order
                areaName = encodeURIComponent(areaName).replace(/ /g, "+");

                names = nameDelim + areaName + names;
            } else { // patches issue where zones with no data show data from last indicator
                data[areaName] = ' ';
            }
        }
        //setup the height
        var kmapInfochartHeight = (count * (parseInt(kmapInfochartBarHeight) + parseInt(kmapInfochartBarHeightMargin))) + Math.round(parseInt(kmapInfochartchxsFont) * 1.7);
        var kmapInfochart_temp = kmapInfochart.replace("<HEIGHT>", kmapInfochartHeight);


        //setup the range
        var kmapInfoChartRange = "0,100,0,100";
        if (unit !== "%" || (unit === "%" && min < 0)) {
            kmapInfoChartRange = min + "," + (min + spread) + "," + min + "," + (min + spread);
        }

        kmapInfochart_temp = kmapInfochart_temp.replace("<RANGE>", kmapInfoChartRange);

        //setup the range labels
        var kampInfoChartRangeLabels = "0|25|50|75|100";
        if (unit !== "%" || (unit === "%" && min < 0)) {
            kampInfoChartRangeLabels = min + "|" +
                (min + (spread * .25)) + "|" +
                (min + (spread * .5)) + "|" +
                (min + (spread * .75)) + "|" +
                (min + spread);
            //toFixed(Math.log(10)/Math.log((1.0/minMagnitude)))
        }

        kmapInfochart_temp = kmapInfochart_temp.replace("<RANGE_LABELS>", kampInfoChartRangeLabels);

        var chartStr = '<div id="' + id + '" class="infowindow"><p class="bubbleheader">' + title
            + '</p><img src="' + kmapInfochart_temp; //This is the base of the Google Chart API graph (without the data part). Needs to be defined in the container file.

        //now put all of that together
        chartStr += names + '&chd=t:' + blues + nameDelim + reds + '" height="' + kmapInfochartHeight + '" width="' + kmapInfochartWidth + '" /></div>';
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
        var min = Infinity; // because we're using percentages we can assume that they'll never be above 100, so 101 is safe
        var max = -Infinity;
        for (areaName in data) {
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
        var maxMagnitude = calculateMagnitude(max);
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
        var minMagnitude = calculateMagnitude(min);

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
            var closerToZero = min;
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
        var spread = max - min;

        return {min: min, spread: spread};
    }

    /**
     * Updates all data for all areas
     * Data: associative array of the percentages keyed by Area names as defined in the JSON that defines areas and their bounds
     * Note: All of this assumes positive numbers.
     */
    function UpdateAreaAllData(title, data, nationalAverage, indicator, unit) {

        var minSpread = calculateMinSpread(data);
        var min = minSpread["min"];
        var spread = minSpread["spread"];
        google.maps.event.addListener(map, 'click', function () {
            for (var windowName in infoWindows) {
                infoWindows[windowName].close();
            }
        });
        //loop over all our data
        for (areaName in data) {
            var currentData = data[areaName];
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
        var magnitude;
        num = Math.abs(num);

        if (num === 0 || num === Infinity)
            return 0;

        if (num >= 1) {
            magnitude = 0;
            for (var i = 1; i <= num; i = i * 10) {
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
        var color = calculateColor(nationalAverage, min, spread);
        $("#nationalaveragediv").css("background-color", color);
        $("#nationalaverageimg").text(addCommas(nationalAverage) + " " + htmlDecode(unit));

        ////////////////////////////////////////////////////////////////
        //updates the national average chart
        ////////////////////////////////////////////////////////////////
        //first check if there's more than one answer to the given question
        var $indicator = $("#bottom_level_" + indicator);
        var $nationalIndicatorChart = $("#nationalIndicatorChart");
        if ($indicator.siblings().length === 0) {
            //clear out the National Chart
            $nationalIndicatorChart.html("");
            return;
        }
        //there is more than one answer ...as so many questions have.

        //get the data for those questions
        var dataForNational = [];
        var mainIndicatorText = $indicator.text();
        var questionText = $indicator.parents("li.level2").children("span.level2").text();
        //get the data for the indicator we're focused on

        dataForNational[mainIndicatorText] = indicatorsToUpdateParams[indicator]["nationalAverage"];

        //get the rest of the data
        $.each($indicator.siblings(), function () {
            var otherIndicator = $(this);
            var otherIndicatorId = otherIndicator.attr("id").substring(13);
            var indicatorText = otherIndicator.text();
            dataForNational[indicatorText] = indicatorsToUpdateParams[otherIndicatorId]["nationalAverage"];
        });


        //calculate the min and spread for the national graph specific
        var spreadMin = calculateMinSpread(dataForNational);
        var min = spreadMin["min"];
        var spread = spreadMin["spread"];
        var nationalChart = createChart(questionText + ' (' + kmapAllAdminAreas + ')', dataForNational, mainIndicatorText, indicator + "_by_indicator_national_chart", unit, min, spread);
        $nationalIndicatorChart.html(nationalChart);

    }


    function updateKey(min, span, title, unit) {
        var $percentleft = $("#percentleft");
        $percentleft.attr("title", addCommas(min) + " " + htmlDecode(unit));
        $percentleft.text(addCommas(min) + " " + htmlDecode(unit));

        var $percentright = $("#percentright");
        $percentright.attr("title", addCommas((min + span)) + " " + htmlDecode(unit));
        $percentright.text(addCommas((min + span)) + " " + htmlDecode(unit));


        $("#spanLegendText").html(title);

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
            var indicator;
            $.address.externalChange(function (event) {
                var newindicator = $.address.parameter("indicator");
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
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }

}(jQuery));