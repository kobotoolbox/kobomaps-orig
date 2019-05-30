export let informationChart;
export default function initializeInformationChart(config) {
    informationChart = config;
    informationChart.url = 'http://chart.apis.google.com/chart?' +
        'chxs=0,676767,' + config.axisLabelStylesFont + ',2,l,676767|1,393939,' + config.axisLabelStylesFont + ',1,l,676767' +
        '&chxt=x,y' +
        '&chbh=' + config.barHeight + ',' + config.barHeightMargin + ',0' +
        '&chs=' + config.width + 'x<HEIGHT>' +
        '&cht=bhs' +
        '&chco=3E4E6E,CC0000' +
        '&chg=25,0,5,9' +
        '&chts=000000,13' +
        '&chxl=1:';
        return informationChart;
}
