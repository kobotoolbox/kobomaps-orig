import React from 'react';
import {getVisibility} from "../util/queries";

const isVisible = (title, link) => !!title || !!link;

export default function IndicatorSource({title, href}) {
    return (
        <div id="sourcetext">
                <span id="sourcetextspan" style={getVisibility(isVisible(title, href))}> Data Source:
                    <a id="sourceURL" href={href} title={title}>{title}</a>
                </span>
        </div>
    )
}
