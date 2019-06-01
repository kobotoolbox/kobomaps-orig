import React from 'react';
import {OverlayView} from "react-google-maps";
import {getStore} from '../../redux/redux-store';
import addCommas from "../../util/addCommas";

function getAreaValue(value, unit) {
    if (value === undefined) {
        return '';
    }
    return addCommas(value)+ ' ' + unit;
}

export default function buildLabels(data) {
    const areas = getStore().getState().areas;
    const areaVals = data.data ?? {};
    return Object.keys(areas).map(function (labelName, labelIndex) {
        const labelPosition = areas[labelName].labelPosition;
        return <OverlayView
            key={labelIndex}
            position={labelPosition}
            mapPaneName={OverlayView.OVERLAY_LAYER}
        >
            <div style={{position: 'absolute', display: 'block'}}>
                <div className="countylabel">
                    <div className="areaVal">{getAreaValue(areaVals[labelName], data.unit)}</div>
                    {labelName}
                </div>
            </div>
        </OverlayView>
    })
}
