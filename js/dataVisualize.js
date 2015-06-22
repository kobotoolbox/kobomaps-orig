 //this code uses jquery (http://jquery.com)
//and the jquery Address plugin (http://www.asual.com/jquery/address/)
(function ($) {
  /**
   * global variable that holds the map
   */
  var map; 
  
  /**
   *  gives us a list of names for geographicAreas
   */
  var geographicAreaNames = new Array();
  /**
   * global variable holding an array of points for each area so areaPoints["bomi"] 
   * would return an array of all the points for Bomi
   */
  var areaPoints = new Array();   
  /**
   * global variable holding the polygons for each area. areaGPolygons["bomi"] 
   * would return the polygon for Bomi
   */
  var areaGPolygons = new Array();
  /**
   * global variable holding the center point lat,lon for each area, this is 
   * where the marker will go
   */
  var areaCenterPoints = new Array(); 
  /**
   * global variable holding all the Labels for each area
   */
  var labels = new Array();
  /**
   * global variable that holds all of the info windows
   */
  var infoWindows = new Array(); 
  
  var areaNamesToNumbers = new Array();
  /**
   * global array that maps the unqiue string indicator to the parameters that would 
   * be fed into UpdateAreaAllData(title, data, nationalAverage). This way we can 
   * use indicators to call the update method to redraw the map
   */   
  var indicatorsToUpdateParams = new Array();
  
  /**
   * Sets if we should round the values or not to whole integers
   */
  var round = true;
  
//add a title to the map
  $(document).ready(function () {
      //patches issue with top navigation menu
      $('.pagetitlewrap').css('z-index', 120);
      initialize();
	  $("#kmapTitle").html(kmapTitle);
	  $("#nationalaveragelabel").html(kmapAllAdminAreas + ':');
  });

  
 //itintializes everything, both the mandatory google maps stuff, and our totally awesome json to gPolygon code
  function initialize() {
	  
	  
	  //setup drag stuff for the key
	  var dragresize = new DragResize('dragresize',
			  { allow_resize: false, minLeft: 350, minTop:40});
	  
	  
	  dragresize.isElement = function(elm)
	  {
	   if (elm.className && elm.className.indexOf('drsElement') > -1) return true;
	  };
	  dragresize.isHandle = function(elm)
	  {
	   if (elm.className && elm.className.indexOf('drsMoveHandle') > -1) return true;
	  };
	  
	  dragresize.apply(document);
	  //set the key to be 48 pixels from the bottom like it used to be. 
	  //we can't use bottom when dragging. We can only use top
	  var height = $("#topbar").height();
	  var screenHeight = $(window).height();
	  //var top = screenHeight - (height + 40); 
	  //$("#topbar").css("top", top+"px");
	  
	  
	//creates the options for defining the zoom level, map type, and center of the google map
	var myOptions = {
		zoom: kmapZoom, 	//creates the initial zoom level. This is defined in the container file as it is country-specific
		center: new google.maps.LatLng(kmapY,kmapX), //creates the coordiantes that will center the map. This is defined in the container file as it is country-specific
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
	parseJsonToGmap(kmapInstance+'/'+kmapBoundaries, kmapInstance, kmapData);


	
  };
  
  
  
  function parseCSV(csvUrl, rootFolder)
  {
      var csvs = {};
      var currentSeries;
      function parseData(name) {
          currentSeries = name;
          var data = csvs[name];
          indicatorsToUpdateParams = [];
		
          var csvData = CSVToArray(data, ",");
          var headerRow = csvData[0];
          //figure out the mapping of rows numbers to county names
          var i = 0;		
          var nationalAverageIndex = -1;
          var sourceIndex = -1;
          var linkIndex = -1;
          var unitIndex = -1;
		
          for(var col in headerRow)
          {			
              var headerColValue = stripString((headerRow[col]).toString());
              if(geographicAreaNames[headerColValue])
              {
                  areaNamesToNumbers[headerColValue] = i;
              }
              else if(headerColValue == "TOTAL")
              {
                  nationalAverageIndex = i;
              }
              else if(headerColValue == "Source")
              {
                  sourceIndex = i;
              }
              else if(headerColValue == "Source Link")
              {
                  linkIndex = i;
              }
              else if(headerColValue == "Unit")
              {
                  unitIndex = i;
              }
              i++;
          }

          //now start tacking on the HTML
          var currentTopLevelId = "";
          var currentTopLevelCounter = 0;
          var currentTopLevelName = "";
		
          var currentMidLevelId = "";
          var currentMidLevelCounter = 0;
          var currentMidLevelName = "";
		
          var currentBottomLevelId = "";
          var currentBottomLevelCounter = 0;
          var currentBottomLevelName = "";
		
          var currentSource = "";
          var currentSourceLink = "";
          var currentUnit = "";

          var $questionsIndicators = $("#questionsindicators");
          $questionsIndicators.empty();
          for(i = 1; i < csvData.length; i++)
          {
              
              var currentRow = csvData[i];
              //test for top level			
              if(currentTopLevelName != currentRow[0] && currentRow[0] != "" && currentRow[0] != undefined)
              {
                  //advance the ID and name
                  currentTopLevelCounter++;				
                  currentTopLevelId = currentTopLevelCounter.toString();
                  currentTopLevelName = currentRow[0];
				
                  //rest the mid level
                  currentMidLevelCounter = 0;
				
                  $questionsIndicators.append('<li class="level1"><span class="level1" >'+currentTopLevelName+'</span><ul id="top_level_'+currentTopLevelId+'" class="level1 "></ul></li>');
              }
              //test for mid level
              if(currentMidLevelName != currentRow[1] && currentRow[1] != "" && currentRow[1] != undefined)
              {
                  //advance the ID and name
                  currentMidLevelCounter++;
                  currentMidLevelId = currentTopLevelId + "_" + currentMidLevelCounter.toString();
                  currentMidLevelName = currentRow[1];
				
                  //reset the bottom level
                  currentBottomLevelCounter = 0;
				
                  $("#top_level_"+currentTopLevelId).append('<li class="level2" ><span class="level2">'+currentMidLevelName+'</span> <ul id="mid_level_'+currentMidLevelId+'" class="level2"></ul></li>');
				
              }
			
              //and finally handle the bottom level
              //which means making freaking huge <a> tags
			
              //first advance everything
              currentBottomLevelCounter++;
              currentBottomLevelName = currentRow[2];
              currentBottomLevelId =  currentMidLevelId + "_" + currentBottomLevelCounter.toString();
			
              if(currentBottomLevelName == "" || currentBottomLevelName == undefined)
              {
                  break;
              }
              var title = "<strong>" + htmlEncode(currentMidLevelName)+'</strong><br />  &quot;'+htmlEncode(currentBottomLevelName)+'&quot;';
			
              var bottomLevelList = '<li class="level3" id="bottom_level_'+currentBottomLevelId+'"><a href="#/?indicator='+currentBottomLevelId + '">'+currentBottomLevelName+'</a></li>';
              //now we need to make up, I mean create, the data portion of this
              var areaData = new Array();
              for( areaName in areaNamesToNumbers)
              {
                  var tempDataValue = currentRow[areaNamesToNumbers[areaName]];
                  tempDataValue = tempDataValue.replace("%", "");
                  areaData[areaName] = parseFloat(tempDataValue);
              }
			
              //if we have a national average use it
              var tempIndicatorArray = new Array();
              tempIndicatorArray["title"] = title;
              tempIndicatorArray["data"] = areaData;
              if(nationalAverageIndex != -1)
              {
                  tempIndicatorArray["nationalAverage"] = parseFloat(currentRow[nationalAverageIndex]);
              }
			
              if(sourceIndex != -1 && currentRow[sourceIndex] != "" && currentRow[sourceIndex] != undefined)
              {
                  currentSource = currentRow[sourceIndex];
              }
              tempIndicatorArray["source"] = currentSource;
			
              if(linkIndex != -1 && currentRow[linkIndex] != "" && currentRow[linkIndex] != undefined)
              {
                  currentSourceLink = currentRow[linkIndex];
              }
              tempIndicatorArray["link"] = currentSourceLink;
			
              if(unitIndex != -1 && currentRow[unitIndex] != "" && currentRow[unitIndex] != undefined)
              {
                  currentUnit = currentRow[unitIndex];
              }
              else 
              {
                  currentUnit = " ";
              }
              tempIndicatorArray["unit"] = currentUnit;

              indicatorsToUpdateParams[currentBottomLevelId] = tempIndicatorArray;

              $bottomLevelList = $(bottomLevelList);
              $bottomLevelList.find('a').click((function (currentBottomLevelId) { 
                  return function (event) {
                      event.preventDefault();
                      showByIndicator(currentBottomLevelId)
                  }
              }(currentBottomLevelId)));
              

              $("#mid_level_"+currentMidLevelId).append($bottomLevelList);
			
			
          }
		
		
		
          // Controling the click behavior of the indicator list
		
          $('span.level1').click(function (){
              level1Click($(this));
          });
		
          $('ul.level1').hide(); //This hides all ul level1 by default until they are toggled. Can also be defined in css.
		
          $('span.level2').click(function (){
              level2Click($(this));
          });
          $('ul.level2').hide(); //This hides all ul level1 by default until they are toggled. Can also be defined in css.		
		
		
          $("li span").hover(function () {
              $(this).addClass("hover");
          }, function () {
              $(this).removeClass("hover");
          });
		
		
          $('li.level3').click(function (){
              level3Click($(this));
              $('ul.level1').hide(); //This hides all ul level1 elements that are currently visible 
              $('ul.level2').hide(); //This hides all ul level2 elements that are currently visible
              $('span.level1').removeClass("active"); //This hides all ul level1 elements that are currently visible 
              $('span.level2').removeClass("active"); //This hides all ul level2 elements that are currently visible
              $(this).parent().siblings("span.level2").addClass("active"); //This shows the current parent ul level2 element
              $(this).parent().parent().parent().siblings("span.level1").addClass("active"); //This shows the current parent ul level2 element
              $(this).parent().show(); //This shows the current parent ul level2 element
              $(this).parent().parent().parent().show(); //This shows the current parent ul level1 element
          });
		
		
		
          //check if we're supposed to auto load the data for a particular indicator?
          var autoLoadIndicator = $.address.parameter("indicator");
          if( autoLoadIndicator != "")
          {
              showByIndicator(autoLoadIndicator);
          }
          //hide the temporary loading text once the indicators are visible
          $('#loadingtext').remove();
      }
    //initiates a HTTP get request for the json file
    if (typeof csvUrl === 'string') {
        $.get(rootFolder + '/' + csvUrl, function (response) {
            csvs.unique = response;
            parseData('unique');
        });
    } else {
        function changeSeries(name, $link) {
            $link.parent().parent().children().removeClass('active');
            $link.parent().addClass('active');
            parseData(name);
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
        getSheets = function (i) {
            var current = csvUrl[i];
            $.get(rootFolder + '/' + current.url, function (i, current) {
                return function (response) {
                    var currentName = current.name;
                    csvs[currentName] = response;
                    var $link = $('<a>', { href: '#'});
                    var $li = $('<li>', { 'class': 'survey-link' });
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
  
	function level1Click(level1Item, forceOn)
	{
		if(forceOn != undefined && forceOn == false)
		{
			level1Item.removeClass("active"); //highlights active span
			level1Item.siblings("ul.level1").hide(); //This shows the child ul level1 element
		}
		else if (forceOn != undefined && forceOn == true)
		{
			level1Item.addClass("active"); //highlights active span
			level1Item.siblings("ul.level1").show(); //This shows the child ul level1 element
		}
		else if(level1Item.hasClass("active"))
		{
			level1Item.removeClass("active"); //highlights active span
			level1Item.siblings("ul.level1").hide(); //This shows the child ul level1 element
		}
		else 
		{
			level1Item.addClass("active"); //highlights active span
			level1Item.siblings("ul.level1").show(); //This shows the child ul level1 element
		}
	}
  
	function level2Click(level2Item, forceOn)
	{
		if(forceOn != undefined && forceOn == false)
		{
			level2Item.removeClass("active"); //highlights active span
			level2Item.siblings("ul.level2").hide(); //This hides the child ul level1 eleme
		}
		else if(forceOn != undefined && forceOn == true)
		{
			level2Item.addClass("active"); //highlights active span
			level2Item.siblings("ul.level2").show(); //This shows the child ul level1 element
		}
		else if(level2Item.hasClass("active"))
		{
			level2Item.removeClass("active"); //highlights active span
			level2Item.siblings("ul.level2").hide(); //This hides the child ul level1 eleme
		}
		else
		{
			level2Item.addClass("active"); //highlights active span
			level2Item.siblings("ul.level2").show(); //This shows the child ul level1 element
		}
		
	}
	  
	function level3Click(level3Item)
	{
		$('li.level3').removeClass("active"); //removes highlight of any other level3 li element
		level3Item.addClass("active"); //highlights active span
	}
  
	/**
	 * Takes in an indicator string and then renders the map according to the data for that indicator
	 * If the idicator doesn't exist it'll just exit gracefully
	 */
	function showByIndicator(indicator)
	{
		if(indicatorsToUpdateParams[indicator] != undefined)
		{				
			var title = indicatorsToUpdateParams[indicator]["title"];
			var data =  indicatorsToUpdateParams[indicator]["data"];
			var nationalAverage = indicatorsToUpdateParams[indicator]["nationalAverage"]; 
			var unit = indicatorsToUpdateParams[indicator]["unit"];
			UpdateAreaAllData(title, data, nationalAverage, indicator, unit);
			
			$.address.parameter("indicator", indicator);
			
			var level1Item = $("#bottom_level_"+indicator).parents("li.level1").children("span.level1");
			var level2Item = $("#bottom_level_"+indicator).parents("li.level2").children("span.level2");
			var level3Item = $("#bottom_level_"+indicator);
		
			
			level1Click(level1Item, true); //set "forceOn" to true to force it to show, even if it is already showing
			level2Click(level2Item, true); //set "forceOn" to true to force it to show, even if it is already showing
			level3Click(level3Item);
			
			
			//update the source link and the source title
			$("#sourcetextspan").show();
			$("#sourceURL").text(indicatorsToUpdateParams[indicator]["source"]);
			$("#sourceURL").attr("title", indicatorsToUpdateParams[indicator]["source"]);
			$("#sourceURL").attr("href", indicatorsToUpdateParams[indicator]["link"]);
			
			//Show the national average and gradient divs
			$('#legend_gradient, #nationalaveragediv').show();
		}
	}

  
    
function parseJsonToGmap(jsonUrl, rootFolder, csvUrl)
 {	
	//initalizes our global county point array
	areaPoints = new Array(); 
	
	//initiates a HTTP get request for the json file
	$.getJSON(jsonUrl, function(data) {

		//loops over each entry in the json over "areas"
		for(areaIndex in data["areas"])
		{
			var areaData = data["areas"][areaIndex];
			

			//create an array entry for this county			
			areaName = areaData.area;
			areaPoints[areaName] = new Array();
			
			//creates a list of the place names we've encountered
			geographicAreaNames[areaName] = true;
			
			//now loops over every set of point in the json that defines an area.
			for(pointsSetIndex in areaData.points)
			{
				var pointsSetValue = areaData.points[pointsSetIndex];
				areaPoints[areaName][pointsSetIndex] = new Array();
				//now loop over every point in a set of points that defines an area
				for(pointsIndex in pointsSetValue)
				{
					var pointsValue = pointsSetValue[pointsIndex];
					areaPoints[areaName][pointsSetIndex][pointsIndex] = new google.maps.LatLng(pointsValue[0], pointsValue[1]);
				}
				
				
			}

			//save the center point
			areaCenterPoints[areaName] = new google.maps.LatLng(areaData.marker[0], areaData.marker[1]);
			
			var tempLabel = new Label({map: map});
			tempLabel.set('position', new google.maps.LatLng(areaData.marker[0], areaData.marker[1]));
			tempLabel.set('areaName', areaName);
			labels[areaName] = tempLabel;
		
			
		}
		
		//now loops over the array of points and creates polygons
		for (var areaName in areaPoints)
		{
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
			google.maps.event.addListener(areaGPolygons[areaName], 'mouseover', function(event) {
				 this.setOptions({fillOpacity: 0.95}); 
			});
			
			//add mouse out
			google.maps.event.addListener(areaGPolygons[areaName], 'mouseout', function(event) {
				 this.setOptions({fillOpacity: 0.75}); 
			});
		}	


		parseCSV(csvUrl, rootFolder);		
		
		
		
	});
	

 }

 
/**
* Function to be called from the HTML to specify a new opacity and/or color value for a county
* countyName - name of the county as defined in the json file
* opacityValue - number between 1.0 and 0.0
* colorValue - html color value, in the form "#RRGGBB" such as "#ff0000" which is red
*/
function formatAreaOpacityColor(name, opacityValue, colorValue)
{
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
function calculateColor(percentage, min, spread)
{
	//calculate the color
	var red = 255;
	var blue = 255 - ((percentage-min)*(1/spread)*255);
	var green = 255 - ((percentage-min)*(1/spread)*255);
	var color = "#"+decimalToHex(red,2)+decimalToHex(green,2)+decimalToHex(blue,2);
	
	return color;
}


/**
Used to update the color of an area given a percentage, min and spread
*/
function UpdateAreaPercentage(name, percentage, min, spread, unit)
{
	//calculate the color
	var color = calculateColor(percentage, min, spread);
	
	
	
	//update the polygon with this new color
	formatAreaOpacityColor(name, 0.6, color);
	
	//update the label

	labels[name].set("areaValue", addCommas(percentage)+" "+unit);
	labels[name].draw();
	

}

/**
Used to update the color and info window of an area
*/
function UpdateAreaPercentageMessage(name, percentage, min, spread, message, unit)
{
	//first update the polygon and the marker
	UpdateAreaPercentage(name, percentage, min, spread, unit);
	
	//close all other info windows if they are open
	for(var windowName in infoWindows)
	{
		infoWindows[windowName].close();
	}
	
	//now make up some info windows and click handlers and such
	var infoWindow = new google.maps.InfoWindow({content: message});
	infoWindows[name] = infoWindow;
	
	//remove any old listeners
	google.maps.event.clearListeners(areaGPolygons[name], 'click');
	// Add a listener for the click event
	google.maps.event.addListener(areaGPolygons[name], 'click', function(event) {
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
function UpdateAreaPercentageTitleData(name, percentage, min, spread, title, data, indicator, unit)
{
	var message = '<div class="chartHolder" style="height:'+kmapInfodivHeight+'px">' + createChart(title, data, name, indicator+"_by_area_chart",unit, min, spread);
		
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
function createChartByIndicators(message, indicator, name, unit)
{
	//first check if there's more than one answer to the given question
	if($("#bottom_level_"+indicator).siblings().length == 0)
	{
      //clear out the National Chart
      $("#nationalIndicatorChart").html("");
			return message;
	}
	//there is more than one answer ...as so many questions have.
	
	//get the data for those questions
	var dataForArea = new Array();
	var mainIndicatorText = $("#bottom_level_"+indicator).text(); 
	var questionText = $("#bottom_level_"+indicator).parents("li.level2").children("span.level2").text();
	//get the data for the indicator we're focused on
	
	dataForArea[mainIndicatorText] = indicatorsToUpdateParams[indicator]["data"][name];

	
	//get the rest of the data
	$.each($("#bottom_level_"+indicator).siblings(), function() {			
		var otherIndicator = $(this);
		var otherIndicatorId = otherIndicator.attr("id").substring(13);
		var indicatorText = otherIndicator.text();
		dataForArea[indicatorText] =  indicatorsToUpdateParams[otherIndicatorId]["data"][name];
	});
	
	//calculate the min and spread for the area specific graph
	var spreadMin = calculateMinSpread(dataForArea);
	var min = spreadMin["min"];
	var spread = spreadMin["spread"];
	
	//build the freaking chart this is not that much fun. I should write a JS library that does this for me.
	//that's a really good idea. I should find someone to pay me to do that. You know it's probably already been done.
	//it's been done in like every language but javasript, so I just made the below function.
	message += createChart(name + ": " + questionText, dataForArea, mainIndicatorText, indicator+"_by_indicator_area_chart", unit, min, spread);
	
	
	return message;
}


function createChart(title, data, highLightName, id, unit, min, spread)
{
	
	//now loop through the data and build the rest of the URL
	var names = "";
	var blues = "";
	var reds = "";
	var nameDelim = "|";
	var numberDelim = ",";
	var count = 0;
	for(areaName in data)
	{	    
    if (data[areaName] !== ' ' && !isNaN(data[areaName])) { // patches issue where zones with no data kill the overlay
      count++;
      if(count > 1) //if we're doing this more than once
      {
        blues += numberDelim;
        reds += numberDelim;
      }
      //handle the special case of the named area being the area who's data we're looping over
      if(areaName.toUpperCase() == highLightName.toUpperCase())
      {
        blues += "0";
        reds += data[areaName];			
      }
      else
      {			
        blues += data[areaName];
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
	if(unit != "%" || (unit == "%" && min < 0))
	{
		kmapInfoChartRange = min+","+(min+spread)+","+min+","+(min+spread);
	}
	
	var kmapInfochart_temp = kmapInfochart_temp.replace("<RANGE>", kmapInfoChartRange);
	
	//setup the range labels
	var kampInfoChartRangeLabels ="0|25|50|75|100";
	if(unit != "%" || (unit == "%" && min < 0))
	{
		kampInfoChartRangeLabels = min+"|"+
			(min+(spread*.25))+"|"+
			(min+(spread*.5))+"|"+
			(min+(spread*.75))+"|"+
			(min+spread);
		//toFixed(Math.log(10)/Math.log((1.0/minMagnitude)))
	}
	
	var kmapInfochart_temp = kmapInfochart_temp.replace("<RANGE_LABELS>", kampInfoChartRangeLabels);
	
	var chartStr = '<div id="'+id+'" class="infowindow"><p class="bubbleheader">'+title
		+'</p><img src="'+kmapInfochart_temp; //This is the base of the Google Chart API graph (without the data part). Needs to be defined in the container file.
	
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
function calculateMinSpread(data)
{
	//loop over the data to pre process it and figure out the below:
	var min = Infinity; // because we're using percentages we can assume that they'll never be above 100, so 101 is safe
	var max = -Infinity; 
	for(areaName in data)
	{
		data[areaName] = data[areaName];
		//check for min
		if(data[areaName] < min)
		{
			min = data[areaName];
		}
		//check for max
		if(data[areaName] > max)
		{
			max = data[areaName];
		}
	}
	//figure out the order of magnitude of max
	var maxMagnitude = calculateMagnitude(max);
	if (maxMagnitude < 1)
	{
		if(max < 0)
		{
			max = 0;
		}
		else
		{
			max = maxMagnitude * 10;
		}
	}
	else if(maxMagnitude == 1)
	{
		max = 10;
	}
	else if(max%maxMagnitude != 0)
	{
		max = (Math.floor(max/maxMagnitude)+1) * maxMagnitude;
	}
	
	//figure out the order of magnitude of max	
	var minMagnitude = calculateMagnitude(min);
	
	if(min == 0)
	{
		min = 0;
	}
	else if (minMagnitude < 1)
	{
		min = Math.floor(min/minMagnitude)*minMagnitude;
		min = parseFloat(min.toFixed(Math.log(10)/Math.log((1.0/minMagnitude)))); //making up for crappy float rounding errors
	}
	else if(minMagnitude == 1)
	{
		min = 0;
	}
	else if(min%minMagnitude != 0)
	{
		min = Math.floor(min/minMagnitude) * minMagnitude;
	}

	//now we decide if we want to base line off zero
	//We don't baseline off zero if the min is negative and the max is positive
	if(!(min < 0 && max > 0))
	{
		//now we want to figure out if max or min is closer to zero
		var closerToZero = min;
		if(max < 0)
		{ //max is closer
			closerToZero = max;
		}
		//now we see if the number closer to zero, is further from zero than max is from min. and if the absolute
		//value of the number involved are more than 1000
		
		if(!(Math.abs(closerToZero) > Math.abs(max-min) && Math.abs(closerToZero) > 1000))
		{
			if(max > 0)
			{
				min = 0;
			}
			else
			{
				max = 0;
			}
		}
		
	}
	
	//calculate the spread
	var spread = max - min;
	
	if(Math.abs(spread) < 1)
	{
		round = false;
	}
	else
	{
		round = true;
	}
	
	var retVal = new Array();
	retVal["min"] = min;
	retVal["spread"] = spread;
	
	return retVal;
}

/**
* Updates all data for all areas
* Data: associative array of the percentages keyed by Area names as defined in the JSON that defines areas and their bounds
* Note: All of this assumes positive numbers. 
*/
function UpdateAreaAllData(title, data, nationalAverage, indicator, unit)
{

	var minSpread = calculateMinSpread(data);
	var min = minSpread["min"];
	var spread = minSpread["spread"];
	google.maps.event.addListener(map, 'click', function () {
	    for (var windowName in infoWindows) {
	        infoWindows[windowName].close();
	    }
	});
	//loop over all our data
	for(areaName in data)
	{
    if (!isNaN(data[areaName])) {
      UpdateAreaPercentageTitleData(areaName, data[areaName], min, spread, title, data, indicator, data[areaName] === ' ' ? '' : unit); // patch: hides unit on zones without data
    } else { // patches issue where zones with no data show data from last indicator
      data[areaName] = ' ';
      }
	}
	
	//update the key
	updateKey(min, spread, title, unit);
	
	//update the national average
	if(nationalAverage != undefined)
	{
		updateNationalAverage(min, spread, nationalAverage, unit, indicator);
	}
}

function calculateMagnitude(num)
{
	num = Math.abs(num);
	//is this number equal to or greater than 1?
	if(num == 0)
		return 0;
	else if(num >= 1)
	{
		var magnitude = 0;
		for (var i = 1; i <= num; i = i * 10)
		{
			if(num - i < ((i*10)-(1*i)))
			{				
				magnitude = i;
				break;
			}
		}
		return magnitude;
	}
	else
	{ //it's a decimal value
		var magnitude = 0.1;
		for (magnitude = 0.1; (num - magnitude) < 0; magnitude = magnitude / 10)
		{
			if(magnitude < 0.00000001)
				{
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
function updateNationalAverage(min, spread, nationalAverage, unit, indicator)
{
	////////////////////////////////////////////////////////////////
	//updates the key
	////////////////////////////////////////////////////////////////
	//set the color
	var color = calculateColor(nationalAverage, min, spread);	
	$("#nationalaveragediv").css("background-color", color);
	$("#nationalaverageimg").text(addCommas(nationalAverage)+" "+htmlDecode(unit));

	////////////////////////////////////////////////////////////////
	//updates the national average chart
	////////////////////////////////////////////////////////////////
	//first check if there's more than one answer to the given question
	if($("#bottom_level_"+indicator).siblings().length == 0)
	{
      //clear out the National Chart
      $("#nationalIndicatorChart").html("");
			return;
	}
	//there is more than one answer ...as so many questions have.
	
	//get the data for those questions
	var dataForNational = new Array();
	var mainIndicatorText = $("#bottom_level_"+indicator).text(); 
	var questionText = $("#bottom_level_"+indicator).parents("li.level2").children("span.level2").text();
	//get the data for the indicator we're focused on
	
	dataForNational[mainIndicatorText] = indicatorsToUpdateParams[indicator]["nationalAverage"];
	
	//get the rest of the data
	$.each($("#bottom_level_"+indicator).siblings(), function() {			
		var otherIndicator = $(this);
		var otherIndicatorId = otherIndicator.attr("id").substring(13);
		var indicatorText = otherIndicator.text();
		dataForNational[indicatorText] =indicatorsToUpdateParams[otherIndicatorId]["nationalAverage"]; 	
	});
	
		
	//calculate the min and spread for the national graph specific
	var spreadMin = calculateMinSpread(dataForNational);
	var min = spreadMin["min"];
	var spread = spreadMin["spread"];
	var nationalChart = createChart(questionText + ' ('+kmapAllAdminAreas+')', dataForNational, mainIndicatorText, indicator+"_by_indicator_national_chart", unit, min, spread);
	$("#nationalIndicatorChart").html(nationalChart);
		
}


function updateKey(min, span, title, unit)
{
	$("#percentleft").attr("title", addCommas(min)+" "+htmlDecode(unit));
	$("#percentleft").text(addCommas(min)+" "+htmlDecode(unit));
	
	$("#percentright").attr("title", addCommas((min+span))+" "+htmlDecode(unit));
	$("#percentright").text(addCommas((min+span))+" "+htmlDecode(unit));
	
	
	$("#spanLegendText").html(title);
	
}

/**
Used to conver decimal numbers to hex
*/
function decimalToHex(d, padding) {
	d = Math.round(d);
	var hex = Number(d).toString(16);
	padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

	while (hex.length < padding) {
		hex = "0" + hex;
	}

	return hex;
}

function htmlEncode(value){
	var retVal = value;
	// the .text() method escapes everything nice and neet for us.
	return $('<div/>').text(retVal).html();
}

function htmlDecode(value){
	var retVal = value;
	// the .text() method escapes everything nice and neet for us.
	return $('<div/>').html(retVal).text();
}

//function needs to be escaped to work with Drupal where the $ character is reserved


(function(j) { 
    j(function() {
        var indicator;
		$.address.externalChange(function(event) {  
		    var newindicator = $.address.parameter("indicator");
			if(indicator !== newindicator)
			{
			    indicator = newindicator;
				showByIndicator(indicator);
			}

		});  
	});
})(jQuery);


function stripString(str) 
{
    return str.replace(/^\s+|\s+$/g, '');
};

function is_array(input)
{
	return typeof(input)=='object'&&(input instanceof Array);
}


function addCommas(nStr)
{
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