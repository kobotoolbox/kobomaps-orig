import React from 'react';
import _map from 'lodash/map';
import AppState from "../../redux/AppState";
import addCommas from "../../util/addCommas";
import {OverlayView} from "react-google-maps";

function Labels({labels}) {
    return (
        <div>
            {labels.map((label, index) =>
                <OverlayView
                    key={index}
                    position={label.position}
                    mapPaneName={OverlayView.OVERLAY_LAYER}
                >
                    <div style={{position: 'absolute', display: 'block'}}>
                        <div className="countylabel">
                            <div className="areaVal">{label.data}</div>
                            {label.name}
                        </div>
                    </div>
                </OverlayView>
            )}
        </div>
    )

}

const mapStateToProps = function (state) {
    let indicator = state.indicators.byCode(state.activeIndicator);
    return {
        labels: _map(state.areas, (area, areaName) => ({
            name: areaName,
            position: area.labelPosition,
            data: state.appState === AppState.ONLINE ? addCommas(indicator.data[areaName]) + ' ' + indicator.unit : ''
        }))
    };
};

export default connect(mapStateToProps)(Labels);
