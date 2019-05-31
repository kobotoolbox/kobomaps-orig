import React from "react";
import PropTypes from 'prop-types';
import {getDisplay} from "../util/queries";

const getActive = (isActive) => isActive ? 'active' : '';

export default function MenuEntry({level, name, isActive, isVisible, listSubmenus, clickHandler}) {
    let levelName = `level${level}`;
    return (
        <li className={levelName}>
            <span className={`${levelName} ${getActive(isActive)}`} onClick={clickHandler}>{name}</span>
            <ul className={levelName} style={getDisplay(isVisible)}>
                {listSubmenus()}
            </ul>
        </li>
    );
}

MenuEntry.propTypes = {
    level: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    isVisible: PropTypes.bool.isRequired,
    listSubmenus: PropTypes.func.isRequired,
    clickHandler: PropTypes.func.isRequired
};
