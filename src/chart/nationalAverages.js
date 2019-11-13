export function getNationalAverages (indicator) {
    let currentIndicatorAverage = {label: indicator.name, y: indicator.nationalAverage, color: '#ff0000'};
    if (indicator.siblings.length === 0) {
        return [currentIndicatorAverage];
    }
    return [].concat(currentIndicatorAverage,
        indicator.siblings.map(function (sibling) {
            return {
                label: sibling.name,
                y: sibling.nationalAverage
            };
        })
    );
}
