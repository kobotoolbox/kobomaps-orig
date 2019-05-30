import parseDataArray from './data-parser';
import CSVToArray from './csvToArray';
import buildNav from '../nav/buildNav';
import showByIndicator from '../nav/showByIndicator';
import $ from '../jquery';
import { geographicAreaNames, resetIndicators } from '../init';

export default function parseCSV(csvUrl) {
    const csvs = {};
    let currentSeries;

    function parseData(name) {
        currentSeries = name;
        resetIndicators();

        const parsedData = parseDataArray(CSVToArray(csvs[name], ','));

        buildNav(parsedData);

        //check if we're supposed to auto load the data for a particular indicator?
        const autoLoadIndicator = $.address.parameter('indicator');
        if (autoLoadIndicator !== '') {
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
        const changeSeries = function (name, $link) {
            if ($link) {
                $link.parent().parent().children().removeClass('active');
                $link.parent().addClass('active');
                parseData(name);
            }
            $.address.parameter('series', name);
        };

        $.address.externalChange(function () {
            const series = $.address.parameter('series');
            if (currentSeries !== series) {
                let $link;
                $('#tabs a').each(function (index, element) {
                    if (element.innerText === series) {
                        $link = $(element);
                        return false;
                    }
                });

                changeSeries(series, $link);
            }
        });
        const csvUrlLength = csvUrl.length;
        var series = $.address.parameter('series') || false;

        const getSheets = function (i) {
            const current = csvUrl[i];
            $.get('data/' + current.url, function (i, current) {
                return function (response) {
                    const currentName = current.name;
                    csvs[currentName] = response;
                    const $link = $('<a>', {href: '#'});
                    const $li = $('<li>', {'class': 'survey-link'});
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
                };
            }(i, current)).then(function () {
                if (++i < csvUrlLength) {
                    getSheets(i);
                }
            });
        };

        getSheets(0);
    }
}//end parseCSV function
