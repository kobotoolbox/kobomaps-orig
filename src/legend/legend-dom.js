import $ from "../jquery";
import buildLegend from './Legend';

let $percentLeft;
let $percentRight;
let $legend;
let $nationalIndicatorChart;
let $sourceTextSpan;
let $sourceURL;
let $nationalAverageDiv;
let $nationalAverageImg;

$(function () {
    buildLegend();
    $percentLeft = $('#percentleft');
    $percentRight = $('#percentright');
    $legend = $('#spanLegendText');
    $nationalIndicatorChart = $('#nationalIndicatorChart');
    $sourceTextSpan = $('#sourcetextspan');
    $sourceURL = $('#sourceURL');
    $nationalAverageDiv = $('#nationalaveragediv');
    $nationalAverageImg = $('#nationalaverageimg');
});

export function clearNationalIndicatorChart() {
    $nationalIndicatorChart.html('');

}
export function setNationIndicatorChart(content) {
    $nationalIndicatorChart.html(content);

}
export function setNationalAverageColor(color) {
    $nationalAverageDiv.css('background-color', color);

}
export function setNationalAverageText(text) {
    $nationalAverageImg.text(text);

}
export function updateLeft(value) {
    $percentLeft.attr('title', value);
    $percentLeft.text(value);

}
export function updateRight(value) {
    $percentRight.attr('title', value);
    $percentRight.text(value);

}
export function updateLegend(value) {
    $legend.html(value);
}

export function updateSourceLink(source, link) {
    $sourceTextSpan.toggle(!!(source+link));
    $sourceURL.text(source);
    $sourceURL.attr('title', source);
    $sourceURL.attr('href', link);
}

export let revealNationalAverageAndGradient = () => {
    $('#legend_gradient, #nationalaveragediv').show();
    revealNationalAverageAndGradient = () => {};
};
