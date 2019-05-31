import $ from '../jquery';
import React from 'react';
import ReactDom from 'react-dom';

import Nav from './Nav';

export default function buildNav(data) {
    ReactDom.render(
        <Nav data={data} indicator={$.address.parameter('indicator')} />,
        document.getElementById('questionsindicators')
    )
}
