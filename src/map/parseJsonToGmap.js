import parseCSV from '../parsers/parseCSV';
import $ from '../jquery';
import {addArea} from "../globals/geographicAreas";
import {getMap} from "../globals/map";
import {closeAllInfoWindows, openInfoWindow} from "../globals/infoWindows";

export default function parseJsonToGmap(boundariesFilename, csvUrl) {
    //initializes our global county point array
    let areaPoints = [];
    const labels = [];

    //initiates a HTTP get request for the json file
    $.getJSON('data/' + boundariesFilename + '.txt', function (data) {

        //loops over each entry in the json over "areas"
        for (let areaIndex in data['areas']) {
            const areaData = data['areas'][areaIndex];


            //create an array entry for this county
            let areaName = areaData.area;
            areaPoints[areaName] = [];


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

            labels[areaName] = new Label(getMap(), new google.maps.LatLng(areaData.marker[0], areaData.marker[1]), areaName);


        }

        //now loops over the array of points and creates polygons
        for (let areaName in areaPoints) {
            const points = areaPoints[areaName];
            //creates the polygon
            let gPolygon = new google.maps.Polygon({
                paths: points,
                strokeColor: '#00CC00', //sets the line color to red
                strokeOpacity: 0.8, //sets the line color opacity to 0.8
                strokeWeight: 2, //sets the width of the line to 3
                fillColor: '#aaaaaa', //sets the fill color
                fillOpacity: 0.75 //sets the opacity of the fill color
            });

            gPolygon.setMap(getMap()); //places the polygon on the map

            //add mouse in
            google.maps.event.addListener(gPolygon, 'mouseover', function (event) {
                this.setOptions({fillOpacity: 0.95});
            });

            //add mouse out
            google.maps.event.addListener(gPolygon, 'mouseout', function (event) {
                this.setOptions({fillOpacity: 0.75});
            });

            google.maps.event.addListener(gPolygon, 'click', function (event) {
                //close all other info windows if they are open
                closeAllInfoWindows();
                //set up the new info window and open it.
                openInfoWindow(areaName, event.latLng)
            });
            //creates a list of the place names we've encountered
            addArea(areaName, gPolygon, labels[areaName]);
        }


        parseCSV(csvUrl);


    });


}
