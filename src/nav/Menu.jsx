import React from 'react';
import PropTypes from 'prop-types';

import Submenu from './Submenu';

const getActive = (active, code) => `${active[0]}` === code ? 'active' : '';
export default function Menu({code, name, active, submenus, selectEntry}) {
    const mapSubmenu = (submenu, submenuIndex) =>
        <Submenu
            code={`${code}_${submenuIndex}`}
            selectEntry={selectEntry}
            indicators={submenu.indicators}
            name={submenu.name}
            active={active}
        />;

    return (
        <li className="level1">
            <span className={`level1 ${getActive(active, code)}`}>{name}</span>
            <ul className="level1">
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
        indicators: PropTypes.arrayOf(PropTypes.string)
    })).isRequired,
    selectEntry: PropTypes.func.isRequired
};
