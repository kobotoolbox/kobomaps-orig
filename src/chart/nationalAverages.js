export function getNationalAverages (indicator) {
    let currentIndicatorAverage = {indicator: indicator.name, average: indicator.nationalAverage};
    if (indicator.siblings.length === 0) {
        return [currentIndicatorAverage];
    }
    return [].concat(currentIndicatorAverage,
        indicator.siblings.map(function (sibling) {
            return {
                indicator: sibling.name,
                average: sibling.nationalAverage
            };
        })
    );
}
