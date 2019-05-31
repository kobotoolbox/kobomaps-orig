/**
 * global array that maps the unqiue string indicator to the parameters that would
 * be fed into UpdateAreaAllData(title, data, nationalAverage). This way we can
 * use indicators to call the update method to redraw the map
 */
import {mapCode} from "../util/queries";

let indicators = Object.create(null);
let indicatorsGroupedByParent = Object.create(null);

export function getIndicator(code) {
    return indicators[code];
}

export function getIndicatorSiblings(code) {
    let parentCode = mapCode(code).slice(0, 2).join('_');
    let indicatorIndex = mapCode(code)[2];
    let siblings = indicatorsGroupedByParent[parentCode];

    if (siblings === undefined) {
        return [];
    }
    return [...siblings.slice(0, indicatorIndex), ...siblings.slice(indicatorIndex+1)];
}

export function rebuildIndicators(newIndicators) {
    indicators = Object.create(null);
    newIndicators.forEach(
        (firstLevelNode, firstLevelIndex) => firstLevelNode.submenus.forEach(
            (secondLevelNode, secondLevelIndex) =>
                indicatorsGroupedByParent[`${firstLevelIndex}_${secondLevelIndex}`] = secondLevelNode.indicators.map(
                (indicator, indicatorIndex) =>
                    indicators[`${firstLevelIndex}_${secondLevelIndex}_${indicatorIndex}`] = indicator.metadata
            )
        )
    );
}
