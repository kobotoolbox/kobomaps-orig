import React from 'react';
import PropTypes from 'prop-types';

import Indicator from './Indicator';

const getActive = (active, code) => `${active[0]}_${active[1]}` === code ? 'active' : '';
export default function Submenu({code, name, active, indicators, selectEntry}) {
    const mapIndicator = (indicatorName, indicatorIndex) =>
        <Indicator
            code={`${code}_${indicatorIndex}`}
            selectEntry={selectEntry}
            name={indicatorName}
            active={active}
        />;

    return (
        <li className="level2">
            <span className={`level2 ${getActive(active, code)}`}>{name}</span>
            <ul className="level2">
                {indicators.map(mapIndicator)}
            </ul>
        </li>
    );
}

Submenu.propTypes = {
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    active: PropTypes.arrayOf(PropTypes.number).isRequired,
    indicators: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectEntry: PropTypes.func.isRequired
};
