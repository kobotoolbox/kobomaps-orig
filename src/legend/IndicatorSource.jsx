import React from 'react';
import {getVisibility} from "../util/queries";
import AppState from '../redux/AppState';
import {connect} from 'react-redux';

const isVisible = (title, link) => !!title || !!link;

function IndicatorSource({title, href, isOnline}) {
    return (
        <div id="sourcetext">
                <span id="sourcetextspan" style={getVisibility(isOnline && isVisible(title, href))}> Data Source:
                    <a id="sourceURL" href={href} title={title}>{title}</a>
                </span>
        </div>
    )
}

const mapStateToProps = (state) => ({
    isOnline: state.appState === AppState.ONLINE
});

export default connect(mapStateToProps)(IndicatorSource);
