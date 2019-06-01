import React, {Component} from 'react';
import {connect} from 'react-redux';

import Menu from './Menu';
import {mapCode} from "../util/queries";

class Nav extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ul className="questionsindicators">{this.props.indicators.map(this.mapMenu.bind(this))}</ul>
        )
    }

    mapMenu(menuEntry, menuIndex) {
        return (
            <Menu
                key={menuIndex}
                code={menuEntry.code}
                submenus={menuEntry.children}
                name={menuEntry.name}
                active={mapCode(this.props.activeIndicator)}
                visible={menuEntry.visible ?? false}
            />
        )
    }
}

const mapStateToProps = (state) => ({
    indicators: state.indicators,
    activeIndicator: state.activeIndicator
});

export default connect(mapStateToProps)(Nav);
