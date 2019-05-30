export default function createMapOptions(mapDefaults) {
    return {
        zoom: mapDefaults.zoom, 	//creates the initial zoom level. This is defined in the container file as it is country-specific
        center: new google.maps.LatLng(mapDefaults.latitude, mapDefaults.longitude), //creates the coordiantes that will center the map. This is defined in the container file as it is country-specific
        streetViewControl: false,
        panControl: false,
        mapTypeControl: true,
        mapTypeControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM,
            mapTypeIds: [google.maps.MapTypeId.TERRAIN, google.maps.MapTypeId.HYBRID, 'RIMM'],
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR
        },
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        }

    };
}
