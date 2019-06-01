import React from 'react';
import PropTypes from 'prop-types';

const getActive = (active, code) => active.join('_') === code ? 'active' : '';

export default function Indicator ({code, name, active}) {
    return (
        <li className={`level3 ${getActive(active, code)}`}>
            <a href={`#/?indicator=${code}`}>{name}</a>
        </li>
    );
}

Indicator.propTypes = {
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    active: PropTypes.arrayOf(PropTypes.number).isRequired
};
