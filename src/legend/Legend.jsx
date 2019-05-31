import React from 'react';
import ReactDom from 'react-dom';

function Legend() {
    return(
        <div id="legend">
            <div id="legendtext">
                <span id="spanLegendText">Please select an indicator to display its data.</span>
            </div>
            <div id="legend_gradient">
                <div id="percentleft"/>
                <div id="percentright"/>
            </div>
            <div id="nationalaveragediv">
                <span id="nationalaveragelabel"/>
                <span id="nationalaverageimg" />
            </div>
            <div id="nationalIndicatorChart"/>
            <div id="sourcetext">
                <span id="sourcetextspan" style={{display: 'none'}}> Data Source:
                    <a id="sourceURL" href="" title=""></a>
                    <span id="sourceNoURL"></span>
                </span>
            </div>
            <div id="addthiswrappertop">
                <div className="addthis_toolbox addthis_default_style ">
                    <a className="addthis_button_preferred_1"></a>
                    <a className="addthis_button_preferred_2"></a>
                    <a className="addthis_button_google_plusone"></a>
                    <a className="addthis_button_preferred_3"></a>
                    <a className="addthis_button_compact"></a>
                    <a className="addthis_counter addthis_bubble_style"></a>
                </div>
            </div>
            <div id="poweredby">
                <a href="http://www.kobotoolbox.org" title="KoBoToolbox.org">powered by KoboToolbox</a>
            </div>
        </div>
    )
}

export default function () {
    ReactDom.render(
        <Legend />,
        document.getElementById('topbar')
    );
}
