import React from 'react';
import PropTypes from 'prop-types';

import Submenu from './Submenu';
import MenuEntry from './MenuEntry';
import {toggleIndicatorBranchVisibility} from '../redux/actions';
import {connect} from 'react-redux';

const isActive = (active, code) => `${active[0]}` === code;

function Menu({code, name, active, submenus, visible, toggleVisibility}) {
    const listSubmenus = () => submenus.map((submenu, submenuIndex) =>
        <Submenu
            key={submenuIndex}
            code={submenu.code}
            indicators={submenu.children}
            name={submenu.name}
            active={active}
            visible={submenu.visible ?? false}
        />);

    return (
        <MenuEntry
            level={1}
            name={name}
            isActive={isActive(active, code)}
            isVisible={visible}
            listSubmenus={listSubmenus}
            clickHandler={() => toggleVisibility(code)}
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
    visible: PropTypes.bool,
    toggleVisibility: PropTypes.func.isRequired
};

const mapStateToProps = () => ({});
const mapDispatchToProps = (dispatch) => ({
    toggleVisibility: function (code) {
        dispatch(toggleIndicatorBranchVisibility(code))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu)
