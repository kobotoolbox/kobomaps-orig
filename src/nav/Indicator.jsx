import React from 'react';
import PropTypes from 'prop-types';
import {indicatorsToUpdateParams} from "../init";

const getActive = (active, code) => active.join('_') === code ? 'active' : '';

export default function Indicator ({code, name, selectEntry, active, metadata}) {
    const handleClick = () => {
        selectEntry(code);
    };

    indicatorsToUpdateParams[code] = metadata;

    return (
        <li className={`level3 ${getActive(active, code)}`} id={`bottom_level_${code}`}>
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
        nationalAverage: PropTypes.string,
        source: PropTypes.string,
        title: PropTypes.string,
        unit: PropTypes.string,
    }).isRequired
};
