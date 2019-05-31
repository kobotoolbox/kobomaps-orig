export default function createMapOptions(mapDefaults) {
    return {
        zoom: mapDefaults.zoom, 	//creates the initial zoom level. This is defined in the container file as it is country-specific
        center: {lat: mapDefaults.latitude, lng: mapDefaults.longitude}, //creates the coordiantes that will center the map. This is defined in the container file as it is country-specific
        streetViewControl: false,
        panControl: false,
        mapTypeControl: true,
        mapTypeControlOptions: {
            position: 9,
            mapTypeIds: ['terrain', 'hybrid'],
            style: 1
        },
        zoomControlOptions: {
            position: 8
        }

    };
}
