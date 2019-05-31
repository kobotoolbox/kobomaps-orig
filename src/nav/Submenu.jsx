import React from 'react';
import PropTypes from 'prop-types';

import Indicator from './Indicator';
import MenuEntry from './MenuEntry';

const isActive = (active, code) => `${active[0]}_${active[1]}` === code;

export default function Submenu({code, name, active, indicators, selectEntry, visible, toggleVisibility}) {
    const listIndicators = () => indicators.map((indicator, indicatorIndex) =>
        <Indicator
            key={indicatorIndex}
            code={`${code}_${indicatorIndex}`}
            selectEntry={selectEntry}
            name={indicator.name}
            active={active}
            metadata={indicator.metadata}
        />);

    const handleClick = () => toggleVisibility(code);
    return (
        <MenuEntry
            level={2}
            name={name}
            isActive={isActive(active, code)}
            isVisible={visible}
            listSubmenus={listIndicators}
            clickHandler={handleClick}
        />
    );
}

Submenu.propTypes = {
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    active: PropTypes.arrayOf(PropTypes.number).isRequired,
    indicators: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectEntry: PropTypes.func.isRequired,
    visible: PropTypes.bool,
    toggleVisibility: PropTypes.func.isRequired
};
