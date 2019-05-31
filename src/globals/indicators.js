/**
 * global array that maps the unqiue string indicator to the parameters that would
 * be fed into UpdateAreaAllData(title, data, nationalAverage). This way we can
 * use indicators to call the update method to redraw the map
 */
let indicators = [];

export function getIndicator(code) {
    return indicators[code];
}

export function rebuildIndicators(newIndicators) {
    indicators = [];
    newIndicators.forEach(
        (firstLevelNode, firstLevelIndex) => firstLevelNode.submenus.forEach(
            (secondLevelNode, secondLevelIndex) => secondLevelNode.indicators.forEach(
                (indicator, indicatorIndex) =>
                    indicators[`${firstLevelIndex}_${secondLevelIndex}_${indicatorIndex}`] = indicator.metadata
            )
        )
    );
}
