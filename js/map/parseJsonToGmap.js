import parseCSV from '../parsers/parseCSV';
import $ from '../jquery';
import {map, geographicAreaNames, labels, areaGPolygons} from '../init';
export default function parseJsonToGmap(boundariesFilename, csvUrl) {
    //initializes our global county point array
    let areaPoints = [];

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
