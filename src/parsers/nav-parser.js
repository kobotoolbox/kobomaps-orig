export default function buildData(data, activeIndicator) {
    return Object.keys(data).map((firstLevelName, firstLevelIndex) => ({
        name: firstLevelName,
        visible: firstLevelIndex === activeIndicator[0],
        submenus: Object.keys(data[firstLevelName]).map((secondLevelName, secondLevelIndex) => ({
            name: secondLevelName,
            visible: secondLevelIndex === activeIndicator[1],
            indicators: Object.keys(data[firstLevelName][secondLevelName]).map((indicator) =>
                ({
                    name: indicator,
                    metadata: {
                        name: indicator,
                        parentName: secondLevelName,
                        ...data[firstLevelName][secondLevelName][indicator]
                    }
                }))
        }))
    }));
}
