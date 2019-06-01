/**
 * global array that maps the unqiue string indicator to the parameters that would
 * be fed into UpdateAreaAllData(title, data, nationalAverage). This way we can
 * use indicators to call the update method to redraw the map
 */
import createMap from "../util/createMap";

let indicators = createMap();

export function getIndicator(code) {
    return indicators.byCode(code);
}

export function getIndicatorSiblings(code) {
    return indicators.byCode(code).siblings ?? [];
}

export function setIndicators(newIndicators) {
    indicators = newIndicators;
}

export function getIndicators() {
    return indicators;
}
