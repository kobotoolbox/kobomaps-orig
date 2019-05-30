import createMapOptions from './createMapOptions';

export default function createMap(config) {
    const gmap = new google.maps.Map(document.getElementById('map_canvas'), createMapOptions(config.mapDefaults));

    /*Creates the options for our custom map type*/
    const styledMapOptions = {
        name: 'Default',
        alt: 'View the map in Peacebuilding Data Project theme'
    };
    /*Adds new map and sets it to default*/
    const rimmMapType = new google.maps.StyledMapType(config.mapStyles, styledMapOptions);
    gmap.mapTypes.set('RIMM', rimmMapType);
    gmap.setMapTypeId('RIMM');
    return gmap;
}
