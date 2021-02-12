import React from 'react';
import PropTypes from 'prop-types';

import Indicator from './Indicator';
import MenuEntry from './MenuEntry';
import {toggleIndicatorLeafVisibility} from '../../redux/actions/indicator';
import {connect} from 'react-redux';

const isActive = (active, code) => `${active[0]}_${active[1]}` === code;

function Submenu({code, name, active, indicators, visible, toggleVisibility}) {
    const listIndicators = () => indicators.map((indicator, indicatorIndex) =>
        <Indicator
            key={indicatorIndex}
            code={indicator.code}
            name={indicator.name}
            active={active}
        />);

    return (
        <MenuEntry
            level={2}
            name={name}
            isActive={isActive(active, code)}
            isVisible={visible}
            listSubmenus={listIndicators}
            clickHandler={() => toggleVisibility(code)}
        />
    );
}

Submenu.propTypes = {
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    active: PropTypes.arrayOf(PropTypes.number).isRequired,
    indicators: PropTypes.arrayOf(PropTypes.object).isRequired,
    visible: PropTypes.bool,
    toggleVisibility: PropTypes.func.isRequired
};

const mapStateToProps = () => ({});
const mapDispatchToProps = (dispatch) => ({
    toggleVisibility: function (code) {
        dispatch(toggleIndicatorLeafVisibility(code))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Submenu)

