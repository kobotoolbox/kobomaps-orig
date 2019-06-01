import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux'
import {getStore} from '../redux/redux-store';
import Nav from './Nav';

export default function buildNav() {
    ReactDom.render(
        <Provider store={getStore()}>
            <Nav />
        </Provider> ,
        document.getElementById('questionsindicators')
    )
}
