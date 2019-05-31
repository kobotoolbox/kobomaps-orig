//this code uses jquery (http://jquery.com)
//and the jquery Address plugin (http://www.asual.com/jquery/address/)
import $ from './jquery';
import './jquery.address-1.5';
import createMap from './map/createMap';
import parseJsonToGmap from './map/parseJsonToGmap';
import showByIndicator from './nav/showByIndicator';
import {initializeInformationChart} from './chart';

export let kmapAllAdminAreas;
/**
 * global variable that holds the map
 */
export let map;

/**
 * global variable that holds all of the info windows
 */
export const infoWindows = [];

$(function () {
    //patches issue with top navigation menu
    $('.pagetitlewrap').css('z-index', 120);
    $.getJSON('data/config.json', function (config) {
        initializeInformationChart(config.informationChart);



        kmapAllAdminAreas = config.allAdminAreas;

        initializeDraggables();
        map = createMap(config);
        parseJsonToGmap(config.boundariesFilename, config.dataFiles);
        $('#kmapTitle').html(config.title);
        $('#nationalaveragelabel').html(config.allAdminAreas + ':');
    });
    let indicator = $.address.parameter('indicator');
    $.address.externalChange(function () {
        const newIndicator = $.address.parameter('indicator');
        if (indicator !== newIndicator) {
            indicator = newIndicator;
            showByIndicator(indicator);
        }
    });
});

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
