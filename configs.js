import { MAPTILER_API_KEY, IGN_FRANCE_API_KEY } from "/keys.js"

// T A B   F L A G S

export const tabFlags = [
    {
        title: `<i class="fa-solid fa-magnifying-glass-location"></i>`,
        content: "searchOnMap",
        visible: true,
        hover: "Search on Map"
    },
    {
        title: `<i class="fa-solid fa-calculator"></i>`,
        content: "coordinateConversion",
        visible: false,
        hover: "Coordinate Conversions"
    },
    {
        title: `<i class="fa-solid fa-map"></i>`,
        content: "baseMaps",
        visible: false,
        hover: "Map Styles"
    },
    {
        title: `<i class="fa-solid fa-compass-drafting"></i>`,
        content: "circle",
        visible: false,
        hover: "Measurements"
    },
    {
        title: `<i class="fa-solid fa-question"></i>`,
        content: "about",
        visible: false,
        hover: "About"
    },
]
    
// B A S E   M A P   L A Y E R S

const baseMaps = {
    googleHybrid: 'http://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', // not used but kept for reference
    googleMap: 'http://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', // not used but kept for reference
    openStandard: `https://api.maptiler.com/maps/openstreetmap/256/{z}/{x}/{y}.jpg?key=${MAPTILER_API_KEY}`, // direct OSM Tile Server link for reference https://tile.openstreetmap.org/{z}/{x}/{y}.png
    openTopo: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', // not used but kept for reference
    natGeo: 'https://services.arcgisonline.com/arcgis/rest/services/NatGeo_World_Map/MapServer/WMTS/tile/1.0.0/NatGeo_World_Map/{}/{}/{z}/{y}/{x}.jpg',
    nasaEsri: 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/WMTS/tile/1.0.0/World_Imagery/{}/{}/{z}/{y}/{x}.jpg',
    maptilerBright: `https://api.maptiler.com/maps/bright/256/{z}/{x}/{y}.png?key=${MAPTILER_API_KEY}`,
    maptilerHybrid: `https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}.jpg?key=${MAPTILER_API_KEY}`,
    maptilerSwisstopoVivid: `https://api.maptiler.com/maps/ch-swisstopo-lbm-vivid/256/{z}/{x}/{y}.png?key=${MAPTILER_API_KEY}`
}
    
export const mapTileChoices = [
    {
        title: "Basic",
        image: "./Assets/maptilerBasic.jpg",
        map: baseMaps.maptilerBright,
        resolution: 512,
        attribution: `<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>`
    },
    {
        title: "Satellite",
        image: "./Assets/maptilerSatellite.jpg",
        map: baseMaps.maptilerHybrid,
        resolution: 512,
        attribution: `<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>`
    },
    {
        title: "Open Street Maps",
        image: "./Assets/maptilerOSM.jpg",
        map: baseMaps.openStandard,
        resolution: 512,
        attribution: `<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>`
    },
    {
        title: "swisstopo",
        image: "./Assets/maptilerSwisstopo.jpg",
        map: baseMaps.maptilerSwisstopoVivid,
        resolution: 512,
        attribution: `<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a> © swisstopo <a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a> <a href="https://www.swisstopo.admin.ch/en/home.html" target="_blank">&copy; swisstopo</a>`
    },
    {
        title: "National Geographic",
        image: "./Assets/natgeo.jpg",
        map: baseMaps.natGeo,
        resolution: 256,
        attribution: `<a href="https://services.arcgisonline.com/arcgis/rest/services/NatGeo_World_Map/MapServer" target="_blank">&copy; National Geographic, Esri, Garmin, HERE, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, increment P Corp.</a>`
    },
    {
        title: "NASA / ESRI",
        image: "./Assets/nasa.jpg",
        map: baseMaps.nasaEsri,
        resolution: 256,
        attribution: `<a href="https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer" target="_blank">&copy; Esri, Maxar, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community</a>`
    },
]
        
// T I L E   L A Y E R S

export const tileLayers = {
    swisstopo: "https://wmts20.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg", // not used but kept for reference
    vfrChartCH: 'https://wmts20.geo.admin.ch/1.0.0/ch.vbs.milairspacechart/default/current/3857/{z}/{x}/{y}.png',
    vfrChartFR: `https://wxs.ign.fr/${IGN_FRANCE_API_KEY}/geoportail/wmts?service=WMTS&request=GetTile&version=1.0.0&tilematrixset=PM&tilematrix={z}&tilecol={x}&tilerow={y}&layer=GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-OACI&format=image/jpeg&style=normal`,
    droneChart: 'https://wmts20.geo.admin.ch/1.0.0/ch.bazl.einschraenkungen-drohnen/default/current/3857/{z}/{x}/{y}.png',
    airfieldChart: 'https://wmts20.geo.admin.ch/1.0.0/ch.bazl.flugplaetze-heliports/default/current/3857/{z}/{x}/{y}.png',
    hillshades: `https://api.maptiler.com/tiles/hillshade/{z}/{x}/{y}.webp?key=${MAPTILER_API_KEY}`
}

// P O L Y L I N E   M E A S U R E   C O N F I G

export const drawLineOptions = {
    position: 'topleft',            // Position to show the control. Values: 'topright', 'topleft', 'bottomright', 'bottomleft'
    unit: 'nauticalmiles',             // Default unit the distances are displayed in. Values: 'kilometres', 'landmiles', 'nauticalmiles'
    useSubunits: true,              // Use subunits (metres/feet) in tooltips if distances are less than 1 kilometre/landmile
    clearMeasurementsOnStop: true,  // Clear all measurements when Measure Control is switched off
    showBearings: true,            // Whether bearings are displayed within the tooltips
    bearingTextIn: 'In',            // language dependend label for inbound bearings
    bearingTextOut: 'Out',          // language dependend label for outbound bearings
    tooltipTextFinish: 'Click to <b>finish line</b><br>',
    tooltipTextDelete: 'Press SHIFT-key and click to <b>delete point</b>',
    tooltipTextMove: 'Click and drag to <b>move point</b><br>',
    tooltipTextResume: '<br>Press CTRL-key and click to <b>resume line</b>',
    tooltipTextAdd: 'Press CTRL-key and click to <b>add point</b>',

    measureControlTitleOn: 'Turn on PolylineMeasure',   // Title for the Measure Control going to be switched on
    measureControlTitleOff: 'Turn off PolylineMeasure', // Title for the Measure Control going to be switched off
    measureControlLabel: '&#8614;', // Label of the Measure Control (Unicode symbols are possible)
    measureControlClasses: [],      // Classes to apply to the Measure Control
    showClearControl: true,        // Show a control to clear all the measurements
    clearControlTitle: 'Clear Measurements', // Title text to show on the Clear Control
    clearControlLabel: '&times',    // Label of the Clear Control (Unicode symbols are possible)
    clearControlClasses: [],        // Classes to apply to Clear Control
    showUnitControl: false,         // Show a control to change the units of measurements
    unitControlUnits: ["kilometres", "landmiles", "nauticalmiles"],

    unitControlTitle: {             // Title texts to show on the Unit Control
        text: 'Change Units',
        kilometres: 'kilometres',
        landmiles: 'land miles',
        nauticalmiles: 'nautical miles'
    },
    unitControlLabel: {             // Unit symbols to show in the Unit Control and measurement labels
        metres: 'm',
        kilometres: 'km',
        feet: 'ft',
        landmiles: 'mi',
        nauticalmiles: 'nm'
    },
    unitControlClasses: [],         // Classes to apply to the Unit Control
    tempLine: {                     // Styling settings for the temporary dashed line
        color: '#00f',              // Dashed line color
        weight: 2                   // Dashed line weight
    },          
    fixedLine: {                    // Styling for the solid line
        color: '#006',              // Solid line color
        weight: 2                   // Solid line weight
    },
    startCircle: {                  // Style settings for circle marker indicating the starting point of the polyline
        color: '#000',              // Color of the border of the circle
        weight: 1,                  // Weight of the circle
        fillColor: '#0f0',          // Fill color of the circle
        fillOpacity: 1,             // Fill opacity of the circle
        radius: 3                   // Radius of the circle
    },
    intermedCircle: {               // Style settings for all circle markers between startCircle and endCircle
        color: '#000',              // Color of the border of the circle
        weight: 1,                  // Weight of the circle
        fillColor: '#ff0',          // Fill color of the circle
        fillOpacity: 1,             // Fill opacity of the circle
        radius: 3                   // Radius of the circle
    },
    currentCircle: {                // Style settings for circle marker indicating the latest point of the polyline during drawing a line
        color: '#000',              // Color of the border of the circle
        weight: 1,                  // Weight of the circle
        fillColor: '#f0f',          // Fill color of the circle
        fillOpacity: 1,             // Fill opacity of the circle
        radius: 3                   // Radius of the circle
    },
    endCircle: {                    // Style settings for circle marker indicating the last point of the polyline
        color: '#000',              // Color of the border of the circle
        weight: 1,                  // Weight of the circle
        fillColor: '#f00',          // Fill color of the circle
        fillOpacity: 1,             // Fill opacity of the circle
        radius: 3                   // Radius of the circle
    },
};

// R A I N V I E W E R   C O N F I G
    
export const rainviewerOptions = { 
    position: 'topleft',
    nextButtonText: '>',
    playStopButtonText: 'Play/Stop',
    prevButtonText: '<',
    positionSliderLabelText: "Hour:",
    opacitySliderLabelText: "Opacity:",
    animationInterval: 500,
    opacity: 0.5
}

// M A R K E R   I C O N S

export const customMarkers = {
    airportMarker: {
        iconUrl: './Assets/marker_airport.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -42],
    },
    locationMarker: {
        iconUrl: './Assets/marker_location.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -42],
    },
    navaidMarker: {
        iconUrl: './Assets/marker_navaid.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -42],
    },
    waypointMarker: {
        iconUrl: './Assets/marker_waypoint.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -42],
    },
    coordinateMarker: {
        iconUrl: './Assets/marker_coordinate.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -42],
    },
    brgDistMarker: {
        iconUrl: './Assets/marker_brgdist.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -42],
    },
    lfnMarker: {
        iconUrl: './Assets/marker_lfn.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -42],
    },
    vfrRepMarker: {
        iconUrl: './Assets/marker_vfrrep.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -42],
    }
}

export const colorFIR = "#4b0082" // indigo
export const colorTMA = "#0000ff" // blue
export const colorCTR = "#ffa500" // orange
export const colorFIC = "#000000" // black
export const colorPoint = "#000000" // black
