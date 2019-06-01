import React, {Component} from 'react';
import $ from '../jquery';
import {getIndicator} from "../globals/indicators";
import ReactDom from "react-dom";
import Legend from "./Legend";
import { Provider } from 'react-redux'
import {getStore} from '../redux/redux-store';

const store = getStore();

export default function () {
    ReactDom.render(
        <Provider store={store}>
            <Legend title={'Please select an indicator to display its data.'} />
        </Provider>,
        document.getElementById('topbar')
    );
}
