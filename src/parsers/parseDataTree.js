import _map from "lodash/map";
import createMap from "../util/createMap";
import {mapCode} from '../util/queries';

export function parseDataTree(data) {
    const flattenedList = [];
    const byCode = createMap();

    const tree = _map(Object.keys(data), function (name, idx) {
        const base = {
            name: name,
            code: `${idx}`,
            children: _map(Object.keys(data[name]), function (name2, idx2) {
                const branch = {
                    get siblings() {
                        const _this = this;
                        return this.parent.children.filter(function (item) {
                            return item !== _this;
                        })
                    },
                    get parent() {
                        return base;
                    },
                    name: name2,
                    code: `${idx}_${idx2}`,
                    children: _map(Object.keys(data[name][name2]), function (name3, idx3) {
                        const leaf = {
                            get siblings() {
                                const _this = this;
                                return this.parent.children.filter(function (item) {
                                    return item !== _this;
                                })
                            },
                            get parent() {
                                return branch;
                            },
                            name: name3,
                            code: `${idx}_${idx2}_${idx3}`,
                            ...data[name][name2][name3]
                        };
                        flattenedList.unshift(leaf);
                        return leaf;
                    })
                };
                flattenedList.unshift(branch);
                return branch;
            })
        };
        flattenedList.unshift(base);
        return base;
    });
    flattenedList.sort(function(a, b) {
        if (a.code > b.code) {
            return 1;
        } else if (a.code < b.code) {
            return -1;
        }
        return 0;
    });

    tree.byCode = function (code) {
        let indices = mapCode(code);
        let indicator = tree[indices.shift()];

        indices.forEach(function (index) {
            indicator = indicator.children[index];
        });

        return indicator;
    };

    return tree;
}
