import React, {Component} from "react";
import Map from './Map';
import $ from "../jquery";
import {getIndicator} from "../globals/indicators";

export default class MapContainer extends Component {
    constructor(props) {
        super(props);
        let data = getIndicator($.address.parameter('indicator')) ?? {};
        this.state = {data: data};

        const _this = this;

        $.address.externalChange(function () {
            const newIndicator = $.address.parameter('indicator');
            if (_this.state.data.code !== newIndicator) {
                let indicator = getIndicator(newIndicator);
                _this.setState({
                    data: indicator
                })
            }
        })
    }
    render() {
        return (
            <Map options={this.props.options} data={this.state.data} />
        )
    }
}
