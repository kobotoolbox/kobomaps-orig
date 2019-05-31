import React, {Component} from 'react';

import Menu from './Menu';
import {mapCode} from "../util/queries";

export default class Nav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            active: props.indicator
        };
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
                code={`${menuIndex}`}
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
        const indices = mapCode(code);
        let entry = data[indices[0]];

        if (indices[1] !== undefined) {
            entry = entry.submenus[indices[1]];
        }

        entry.visible = !entry.visible;

        this.setState(()=> ({data: data}));
    }

    selectIndicator(code) {
        this.setState({active: mapCode(code)});
    }
}
