import $ from '../jquery';
import createMap from '../util/createMap';
import {getStore} from '../redux/redux-store';
import {setAreas, setInfoWindowVisibilityFlags} from '../redux/actions/metadata';
import {appStateTransition} from '../redux/actions/appState';
import actionTypes from '../redux/actions/actionTypes';

//initializes our global county point array
const areas = createMap();
const infoWindowVisibilityFlags = createMap();
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
            infoWindowVisibilityFlags[areaName] = false;
        });
        store.dispatch(appStateTransition(store.getState().appState));
        store.dispatch(setAreas(areas));
        store.dispatch(appStateTransition(store.getState().appState, actionTypes.SET_AREAS));
        store.dispatch(setInfoWindowVisibilityFlags(infoWindowVisibilityFlags));
        store.dispatch(appStateTransition(store.getState().appState, actionTypes.SET_INFO_WINDOW_VISIBILITY_FLAGS));

    });


}
