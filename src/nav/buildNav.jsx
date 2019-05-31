import React from 'react';
import ReactDom from 'react-dom';

import Nav from './Nav';
import {getIndicator} from "../util/queries";

export default function buildNav(data) {
    ReactDom.render(
        <Nav data={data} indicator={getIndicator()} />,
        document.getElementById('questionsindicators')
    )
}
