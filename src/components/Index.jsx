import React from 'react';
import Nav from './nav/Nav';
import createMapOptions from './map/createMapOptions';
import Legend from './legend/Legend';
import Map from './map/Map';

export default function Index({config}) {
    return (
        <div style={{height: '100%'}}>
            <Nav/>
            <Map options={createMapOptions(config.mapDefaults)}/>
            <Legend broaderRegionMapIsIn={config.allAdminAreas}/>
        </div>
    );
}
