import parseCSV from '../parsers/parseCSV';
import $ from '../jquery';
import {getMap} from "../globals/map";
import createMap from "../util/createMap";
import {buildPolygons} from "./buildPolygons";

//initializes our global county point array
export let areaPoints = createMap();
export const labels = createMap();
export default function parseJsonToGmap(boundariesFilename, csvUrl) {


    //initiates a HTTP get request for the json file
    return $.getJSON('data/' + boundariesFilename + '.txt', function (data) {

        //loops over each entry in the json over "areas"
        data['areas'].forEach(function (areaData) {
            //create an array entry for this county
            let areaName = areaData.area;
            areaPoints[areaName] = [];


            //now loops over every set of point in the json that defines an area.
            areaData.points.forEach(function (pointsSetValue, pointsSetIndex){
                areaPoints[areaName][pointsSetIndex] = [];
                //now loop over every point in a set of points that defines an area
                pointsSetValue.forEach(function (pointsValue, pointsIndex) {
                    areaPoints[areaName][pointsSetIndex][pointsIndex] = {lat:pointsValue[0], lng:pointsValue[1]};
                });


            });

            labels[areaName] = {lat:areaData.marker[0], lng:areaData.marker[1]};
        });

        //now loops over the array of points and creates polygons
        //buildPolygons();


        parseCSV(csvUrl);


    });


}
