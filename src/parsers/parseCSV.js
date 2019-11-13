import parseDataArray from './data-parser';
import CSVToArray from './csvToArray';
import $ from '../vendor/jquery';
import {getStore} from '../redux/redux-store';
import {parseDataTree} from './parseDataTree';
import {
    setIndicators,
    toggleIndicatorBranchVisibility,
    toggleIndicatorLeafVisibility
} from '../redux/actions/indicator';
import {mapCode} from '../util/queries';

export default function parseCSV(csvUrl) {
    const csvs = {};
    let currentSeries;
    const store = getStore();

    function parseData(name) {
        currentSeries = name;

        let data = parseDataArray(CSVToArray(csvs[name], ','));
        let dataTree = parseDataTree(data);

        store.dispatch(setIndicators(dataTree));
        let activeIndicator = store.getState().activeIndicator;
        if (activeIndicator) {
            const code = mapCode(activeIndicator);
            store.dispatch(toggleIndicatorBranchVisibility(`${code[0]}`));
            store.dispatch(toggleIndicatorLeafVisibility(`${code[0]}_${code[1]}`));
        }
    }

    //initiates a HTTP get request for the json file
    if (typeof csvUrl === 'string') {
        return $.get('data/' + csvUrl, function (response) {
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
            return $.get('data/' + current.url, function (i, current) {
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

        return getSheets(0);
    }
}//end parseCSV function
