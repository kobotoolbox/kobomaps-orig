//this code uses jquery (http://jquery.com)
//and the jquery Address plugin (http://www.asual.com/jquery/address/)
import $ from './jquery';
import './jquery.address-1.5';
import ReactDOM from 'react-dom';
import {initializeInformationChart} from './chart';
import {setActiveIndicator} from './redux/actions/metadata';
import {getStore} from './redux/redux-store';
import buildAreaPointsAndLabelPositions from './parsers/buildAreaPointsAndLabelPositions';
import parseCSV from './parsers/parseCSV';
import Index from './components';
import {Provider} from 'react-redux';
import React from 'react';

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
                        ReactDOM.render(
                            <Provider store={store}>
                                <Index config={config}/>
                            </Provider>,
                            document.getElementById('main')
                        )
                    });
            });
        $('#kmapTitle').html(config.title);
    });

    $.address.externalChange(function () {
        let indicatorCode = $.address.parameter('indicator');

        if (indicatorCode !== undefined) {
            store.dispatch(setActiveIndicator(indicatorCode));
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
