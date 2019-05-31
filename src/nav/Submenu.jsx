import React from 'react';
import PropTypes from 'prop-types';

import Indicator from './Indicator';

const getActive = (active, code) => isActive(active, code) ? 'active' : '';
const isActive = (active, code) => `${active[0]}_${active[1]}` === code;
const getVisibility = (visible) => visible ? undefined : {display: 'none' };

export default function Submenu({code, name, active, indicators, selectEntry, visible, toggleVisibility}) {
    const mapIndicator = (indicator, indicatorIndex) =>
        <Indicator
            key={indicatorIndex}
            code={`${code}_${indicatorIndex}`}
            selectEntry={selectEntry}
            name={indicator.name}
            active={active}
            metadata={indicator.metadata}
        />;

    const handleClick = () => toggleVisibility(code);
    return (
        <li className="level2">
            <span className={`level2 ${getActive(active, code)}`} onClick={handleClick}>{name}</span>
            <ul className="level2" style={getVisibility(visible, isActive(active, code))}>
                {indicators.map(mapIndicator)}
            </ul>
        </li>
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
