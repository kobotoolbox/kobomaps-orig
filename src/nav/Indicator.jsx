import React from 'react';
import PropTypes from 'prop-types';

const getActive = (active, code) => active.join('_') === code ? 'active' : '';

export default function Indicator ({code, name, selectEntry, active}) {
    const handleClick = () => {
        selectEntry(code);
    };

    return (
        <li className={`level3 ${getActive(active, code)}`}>
            <a href={`#/?indicator=${code}`} onClick={handleClick}>{name}</a>
        </li>
    );
}

Indicator.propTypes = {
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    selectEntry: PropTypes.func.isRequired,
    active: PropTypes.arrayOf(PropTypes.number).isRequired,
    metadata: PropTypes.shape({
        data: PropTypes.objectOf(PropTypes.number),
        link: PropTypes.string,
        nationalAverage: PropTypes.number,
        source: PropTypes.string,
        title: PropTypes.string,
        unit: PropTypes.string,
    }).isRequired
};
