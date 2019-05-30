import React from 'react';
import PropTypes from 'prop-types';

const getActive = (active, code) => active.join('_') === code ? 'active' : '';

export default function Indicator ({code, name, selectEntry, active}) {
    const handleClick = () => {
        selectEntry(code);
    };

    return (
        <li className={`level3 ${getActive(active, code)}`} id={`bottom_level_${code}`}>
            <a href={`#/?indicator=${code}`} onClick={handleClick}>{name}</a>
        </li>
    );
}

Indicator.propTypes = {
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    handleClick: PropTypes.func.isRequired,
    active: PropTypes.arrayOf(PropTypes.number).isRequired
};
