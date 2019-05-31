import React from 'react';
import PropTypes from 'prop-types';

import Submenu from './Submenu';

const getActive = (active, code) => isActive(active, code) ? 'active' : '';
const isActive = (active, code) => `${active[0]}` === code;
const getVisibility = (visible) => visible ? undefined : {display: 'none' };

export default function Menu({code, name, active, submenus, selectEntry, visible, toggleVisibility}) {
    const mapSubmenu = (submenu, submenuIndex) =>
        <Submenu
            key={submenuIndex}
            code={`${code}_${submenuIndex}`}
            selectEntry={selectEntry}
            indicators={submenu.indicators}
            name={submenu.name}
            active={active}
            visible={submenu.visible}
            toggleVisibility={toggleVisibility}
        />;

    const handleClick = () => toggleVisibility(code);
    return (
        <li className="level1">
            <span className={`level1 ${getActive(active, code)}`} onClick={handleClick}>{name}</span>
            <ul className="level1" style={getVisibility(visible, isActive(active, code))}>
                {submenus.map(mapSubmenu)}
            </ul>
        </li>
    );
}

Menu.propTypes = {
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    active: PropTypes.arrayOf(PropTypes.number).isRequired,
    submenus: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        indicators: PropTypes.arrayOf(PropTypes.object)
    })).isRequired,
    selectEntry: PropTypes.func.isRequired,
    visible: PropTypes.bool,
    toggleVisibility: PropTypes.func.isRequired
};
