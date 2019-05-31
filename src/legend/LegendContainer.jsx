import React, {Component} from 'react';
import $ from '../jquery';
import {getIndicator} from "../globals/indicators";
import ReactDom from "react-dom";
import Legend from "./Legend";

class LegendContainer extends Component {
    constructor(props) {
        super(props);
        let data = getIndicator($.address.parameter('indicator')) ?? {};
        this.state = {
            data: data,
            title: props.title
        };
        const _this = this;
        $.address.externalChange(function () {
            const newIndicator = $.address.parameter('indicator');
            if (_this.state.data.code !== newIndicator) {
                let indicator = getIndicator(newIndicator);
                _this.setState({
                    data: indicator,
                    title: indicator.name
                })
            }
        })
    }
    render() {
        return (
            <Legend title={this.state.title} data={this.state.data}/>
        )
    }
}

export default function () {
    ReactDom.render(
        <LegendContainer title={'Please select an indicator to display its data.'} />,
        document.getElementById('topbar')
    );
}
