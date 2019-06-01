import $ from '../jquery';
import createMap from "../util/createMap";
import {getStore} from '../redux/redux-store';
import {setAreas} from '../redux/actions';

//initializes our global county point array
const areas = createMap();

export default function buildAreaPointsAndLabelPositions(boundariesFilename) {


    const store = getStore();
    //initiates a HTTP get request for the json file
    return $.getJSON('data/' + boundariesFilename + '.txt', function (data) {

        //loops over each entry in the json over "areas"
        data['areas'].forEach(function (areaData) {
            //create an array entry for this county
            let areaName = areaData.area;
            areas[areaName] = createMap();
            areas[areaName].points = [];


            //now loops over every set of point in the json that defines an area.
            areaData.points.forEach(function (pointsSetValue, pointsSetIndex){
                areas[areaName].points[pointsSetIndex] = [];
                //now loop over every point in a set of points that defines an area
                pointsSetValue.forEach(function (pointsValue, pointsIndex) {
                    areas[areaName].points[pointsSetIndex][pointsIndex] = {lat:pointsValue[0], lng:pointsValue[1]};
                });


            });

            areas[areaName].labelPosition = {lat:areaData.marker[0], lng:areaData.marker[1]};
        });
        store.dispatch(setAreas(areas));
    });


}
