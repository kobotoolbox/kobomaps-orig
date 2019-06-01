import React from 'react';
import {connect} from 'react-redux';

import Menu from './Menu';
import {mapCode} from "../util/queries";
import AppState from '../redux/AppState';

function Nav ({indicators, activeIndicator, appState}){
    const mapMenu = (menuEntry, menuIndex) => (
        <Menu
            key={menuIndex}
            code={menuEntry.code}
            submenus={menuEntry.children}
            name={menuEntry.name}
            active={appState === AppState.ONLINE ? mapCode(activeIndicator) : []}
            visible={menuEntry.visible ?? false}
        />
    );

    return (
        <ul className="questionsindicators">{indicators.map(mapMenu)}</ul>
    );
}

const mapStateToProps = (state) => ({
    indicators: state.indicators,
    activeIndicator: state.activeIndicator,
    appState: state.appState
});

export default connect(mapStateToProps)(Nav);
