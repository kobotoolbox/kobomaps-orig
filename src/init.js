//this code uses jquery (http://jquery.com)
//and the jquery Address plugin (http://www.asual.com/jquery/address/)
import $ from './jquery';
import './jquery.address-1.5';
import {initializeInformationChart} from './chart';
import {setActiveIndicator} from './redux/actions';
import {getStore} from './redux/redux-store';
import buildAreaPointsAndLabelPositions from './map/buildAreaPointsAndLabelPositions';
import parseCSV from './parsers/parseCSV';
import buildNav from './nav/buildNav';
import buildLegendContainer from './legend/LegendContainer';
import buildMap from './map/buildMap';

export let kmapAllAdminAreas;

$(function () {
    const store = getStore();
    //patches issue with top navigation menu
    $('.pagetitlewrap').css('z-index', 120);
    $.getJSON('data/config.json', function (config) {
        initializeInformationChart(config.informationChart);



        kmapAllAdminAreas = config.allAdminAreas;

        initializeDraggables();
        buildAreaPointsAndLabelPositions(config.boundariesFilename, config.dataFiles)
            .then(function () {
                return parseCSV(config.dataFiles)
                    .then(function () {
                        buildMap(config);
                        buildNav();
                        buildLegendContainer();
                    });
            });
        $('#kmapTitle').html(config.title);
    });
    store.dispatch(setActiveIndicator($.address.parameter('indicator')));

    $.address.externalChange(function () {
        store.dispatch(setActiveIndicator($.address.parameter('indicator')))
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
