import React, { Component } from 'react';

import Menu from './Menu';

export default class Nav extends Component {
    constructor(props) {
        super(props);
        let indicator = props.indicator ? props.indicator.split('_').map((n)=> +n) : [];
        this.state = {
            data: this.buildData(props.data, indicator),
            active: indicator
        };
    }

    buildData(data, activeIndicator) {
        return Object.keys(data).map(function (firstLevelName, firstLevelIndex) {
            return {
                name: firstLevelName,
                visible: firstLevelIndex === activeIndicator[0],
                submenus: Object.keys(data[firstLevelName]).map(function (secondLevelName, secondLevelIndex) {
                    return {
                        name: secondLevelName,
                        visible: secondLevelIndex === activeIndicator[1],
                        indicators: Object.keys(data[firstLevelName][secondLevelName]).map((indicator)=>
                        ({
                            name: indicator,
                            metadata: data[firstLevelName][secondLevelName][indicator]
                        }))
                    }
                })
            }
        });
    }

    render() {
        return (
            <ul className="questionsindicators">{this.state.data.map(this.mapMenu.bind(this))}</ul>
        )
    }

    mapMenu(menuEntry, menuIndex) {
        return (
            <Menu
                key={menuIndex}
                code={menuIndex + ''}
                submenus={menuEntry.submenus}
                selectEntry={this.selectIndicator.bind(this)}
                name={menuEntry.name}
                active={this.state.active}
                visible={menuEntry.visible}
                toggleVisibility={this.toggleVisibility.bind(this)}
            />
        )
    }

    toggleVisibility(code) {
        const data = this.state.data.slice();
        const indices = code.split('_').map((n) => +n);
        let entry = data[indices[0]];

        if (typeof indices[1] !== 'undefined') {
            entry = entry.submenus[indices[1]];
        }

        entry.visible = !entry.visible;

        this.setState(()=> ({data: data}));
    }

    selectIndicator(code) {
        this.setState({active: code.split('_').map((n)=> +n )});
    }
}
