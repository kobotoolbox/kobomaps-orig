import React from 'react';
import PropTypes from 'prop-types';

import Submenu from './Submenu';
import MenuEntry from './MenuEntry';

const isActive = (active, code) => `${active[0]}` === code;

export default function Menu({code, name, active, submenus, selectEntry, visible, toggleVisibility}) {
    const listSubmenus = () => submenus.map((submenu, submenuIndex) =>
        <Submenu
            key={submenuIndex}
            code={`${code}_${submenuIndex}`}
            selectEntry={selectEntry}
            indicators={submenu.indicators}
            name={submenu.name}
            active={active}
            visible={submenu.visible}
            toggleVisibility={toggleVisibility}
        />);

    const handleClick = () => toggleVisibility(code);
    return (
        <MenuEntry
            level={1}
            name={name}
            isActive={isActive(active, code)}
            isVisible={visible}
            listSubmenus={listSubmenus}
            clickHandler={handleClick}
        />
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
