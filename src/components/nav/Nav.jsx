import React from 'react';
import {connect} from 'react-redux';

import Menu from './Menu';
import {mapCode} from "../../util/queries";
import AppState from '../../redux/AppState';

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
        <div id="maplinks">
            <h3 id="kmapTitle">&nbsp;</h3>
            <p>Click on a section name to display the questions, then click on the questions to show the indicator(s).
                Click on the indicator to display its data on the map.</p>
            <div id="questionsindicators" className="questionsindicators">
                <ul className="questionsindicators">{indicators.map(mapMenu)}</ul>
            </div>
        </div>

    );
}

const mapStateToProps = (state) => ({
    indicators: state.indicators,
    activeIndicator: state.activeIndicator,
    appState: state.appState
});

export default connect(mapStateToProps)(Nav);
