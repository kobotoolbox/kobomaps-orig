import React, { Component } from 'react';

import Menu from './Menu';

export default class Nav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.buildData(props.data)
        }
    }

    buildData(data) {
        return Object.keys(data).map(function (firstLevelName) {
            return {
                name: firstLevelName,
                submenus: Object.keys(data[firstLevelName]).map(function (secondLevelName) {
                    return {
                        name: secondLevelName,
                        indicators: Object.keys(data[firstLevelName][secondLevelName]).map((indicator)=>indicator)
                    }
                })
            }
        });
    }

    render() {
        return (
            <ul>{this.state.data.map(this.mapMenu.bind(this))}</ul>
        )
    }

    mapMenu(menuEntry, menuIndex) {
        return (
            <Menu
                code={menuIndex}
                submenus={menuEntry.submenus}
                selectEntry={this.selectIndicator}
                name={menuEntry.name}
                active={[0,0,0]}
            />
        )
    }

    selectIndicator(code) {}
}
