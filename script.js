import { placeLoci, placeNavaid, placeRep, placeCoords, placePlace, placeBrgDist } from "/queryFunctions.js"
import { degMinSecToDecimal, decimalToDegMinSec, degDecimalToDegMinSec , calcDecToDeg } from "/coordinateConversions.js"
import { routeDeconstructor } from "/routeDeconstructor.js"
import { MAPS_API_KEY, MAPTILER_API_KEY } from "/googleAPIs.js"

window.onload = function(){
    const googleMapsAPIScript = document.createElement("script")
    googleMapsAPIScript.setAttribute("async", "")
    googleMapsAPIScript.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&libraries=places&`
    document.getElementsByTagName("head")[0].appendChild(googleMapsAPIScript)
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    document.getElementById("currentYear").innerText = currentYear
    
// R E N D E R   T O O L B O X E S / T A B S
    
    const tabFlags = [
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
        hover: "Plot Circle"
        },
        {
        title: `<i class="fa-solid fa-question"></i>`,
        content: "about",
        visible: false,
        hover: "About"
        },
    ]
    
    function renderTabFlags(){
        tabFlags.forEach((flag, index) => {
            const divTab = document.createElement("div")
            divTab.className = "tabTitle"
            divTab.id = `tabTitle${index}`
            divTab.innerHTML = flag.title
            document.getElementById("tabRow").appendChild(divTab)
            divTab.addEventListener("mouseover", function(){
                divTab.setAttribute("title", flag.hover)
            })
        })
    }
            
    function checkTabFlags(){
        tabFlags.forEach((flag, index) => {
            if(flag.visible){
                document.getElementById(flag.content).style.display = "block"
                document.getElementById(`tabTitle${index}`).style.background = "blue"
                document.getElementById(`tabTitle${index}`).style.color = "white"
            }
            if(!flag.visible){
                document.getElementById(flag.content).style.display = "none"
                document.getElementById(`tabTitle${index}`).style.background = "white"
                document.getElementById(`tabTitle${index}`).style.color = "blue"
            }
        })
    }
    
    function tabFlagVisibilitySetter(){
        tabFlags.forEach((flag, index) => {
            flag.visible = false
        })
    }
    
    renderTabFlags()
    checkTabFlags()
    
    const renderedTabFlags = document.querySelectorAll(".tabTitle")
    renderedTabFlags.forEach((flag, index) => {
        document.getElementById(tabFlags[index].content).style.display = "none"
        checkTabFlags()
        flag.addEventListener("click", function(){
            tabFlagVisibilitySetter()
            tabFlags[index].visible = true
            checkTabFlags()
        })
    })
    
    
    const airportIcon = L.icon({
        iconUrl: './Assets/marker_airport.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -42],
    });
    const locationIcon = L.icon({
        iconUrl: './Assets/marker_location.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -42],
    });
    const navaidIcon = L.icon({
        iconUrl: './Assets/marker_navaid.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -42],
    });
    const waypointIcon = L.icon({
        iconUrl: './Assets/marker_waypoint.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -42],
    });
    const coordinateIcon = L.icon({
        iconUrl: './Assets/marker_coordinate.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -42],
    });
    const bearingDistinateIcon = L.icon({
        iconUrl: './Assets/marker_brgdist.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -42],
    });
    const lfnIcon = L.icon({
        iconUrl: './Assets/marker_lfn.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -42],
    });
    
// S E A R C H   O N   M A P   E V E N T   F U N C T I O N S
    
    function renderLoci(e){
        if((e.key == "Enter" && e.target.type == "textarea") || (e.type == "click" && e.target.type == "submit")){
            e.preventDefault()
            const returnedLocis = placeLoci()
            if(returnedLocis == undefined){
                return
            }
            if(!Array.isArray(returnedLocis[0])){ // Multiple Locis are returned as a multidimensional Array so this simply checks if the first Item of the returned array is also an array and if not, its a single Loci
                addMarker(returnedLocis[0], returnedLocis[1], returnedLocis[2], "LOCI")
            } else {
                returnedLocis.forEach(returnedLoci => {
                    addMarker(returnedLoci[0], returnedLoci[1], returnedLoci[2], "LOCI")
                })
            }
        }
    }
    
    function renderPlace(e){ // TODO: Convert Timeout to sync
        if((e.key == "Enter" && e.target.type == "textarea") || (e.type == "click" && e.target.type == "submit")){
            e.preventDefault()
            const returnedPlaces = placePlace()
            setTimeout(function(){
                if(returnedPlaces == undefined || returnedPlaces.length == 0){
                    return
                }
                if(!Array.isArray(returnedPlaces[0])){ 
                    addMarker(returnedPlaces[0], returnedPlaces[1], returnedPlaces[2], "Location")
                } else {
                    returnedPlaces.forEach(returnedPlace => {
                        addMarker(returnedPlace[0], returnedPlace[1], returnedPlace[2], "Location")
                    })
                }
            },1000)
        }
    }
    
    function renderNavaid(e){
        if((e.key == "Enter" && e.target.type == "textarea") || (e.type == "click" && e.target.type == "submit")){
            e.preventDefault()
            const returnedNavaids = placeNavaid()
            if(returnedNavaids == undefined || returnedNavaids.length == 0){
                return
            }
            if(!Array.isArray(returnedNavaids[0])){ 
                addMarker(returnedNavaids[0], returnedNavaids[1], returnedNavaids[2], "NAVAID")
            } else {
                returnedNavaids.forEach(returnedNavaid => {
                    addMarker(returnedNavaid[0], returnedNavaid[1], returnedNavaid[2], "NAVAID")
                })
            }
        }
    }
    
    function renderRep(e){
        if((e.key == "Enter" && e.target.type == "textarea") || (e.type == "click" && e.target.type == "submit")){
            e.preventDefault()
            const returnedReps = placeRep()
            if(returnedReps == undefined || returnedReps.length == 0){
                return
            }
            if(!Array.isArray(returnedReps[0])){ 
                addMarker(returnedReps[0], returnedReps[1], returnedReps[2], "WAYPOINT")
            } else {
                returnedReps.forEach(returnedRep => {
                    addMarker(returnedRep[0], returnedRep[1], returnedRep[2], "WAYPOINT")
                })
            }
        }
    }
    
    function renderCoord(e){
        if((e.key == "Enter" && e.target.type == "textarea") || (e.type == "click" && e.target.type == "submit")){
            e.preventDefault()
            const returnedCoords = placeCoords()
            if(returnedCoords == undefined || returnedCoords.length == 0){
                return
            }
            returnedCoords.forEach(returnedCoord => {
                addMarker(returnedCoord[0], returnedCoord[1], returnedCoord[2], "COORDINATE")
            })
        }
    }
    
    function renderBrgDist(e){
        if((e.key == "Enter" && e.target.type == "textarea") || (e.type == "click" && e.target.type == "submit")){
            e.preventDefault()
            const returnedBrgDists = placeBrgDist()
            if(returnedBrgDists == undefined || returnedBrgDists.length == 0){
                return
            }
            returnedBrgDists.forEach(returnedBrgDist => {
                addMarker(returnedBrgDist[1], returnedBrgDist[2], returnedBrgDist[0], "BRGDIST")
            })
        }
    }
    
// S E A R C H   O N   M A P   E V E N T   H A N D L E R S
    
    const queryEvents = ["click", "keypress"]
    
    queryEvents.forEach(queryEvent => {
        document.getElementById("mapAllContainer").addEventListener(queryEvent, function(e) {
            if(e.key == "Enter" || (e.type == "click" && e.target.className == "queryButtons")){
                document.getElementById("mapLoci").value = ""
                document.getElementById("mapPlace").value = ""
                document.getElementById("mapNavaid").value = ""
                document.getElementById("mapRep").value = ""
                document.getElementById("mapCoords").value = ""
                clearMarkers()
                const deconstructedRoute = routeDeconstructor()
                renderRoute(deconstructedRoute[0], deconstructedRoute[1], deconstructedRoute[2], deconstructedRoute[3], deconstructedRoute[4], deconstructedRoute[5], e)
            }
        })
        
        document.getElementById("mapLociContainer").addEventListener(queryEvent, function(e) {
            renderLoci(e)
        })
        
        document.getElementById("mapPlaceContainer").addEventListener(queryEvent, function(e) {
            renderPlace(e)
        })
        
        document.getElementById("mapNavaidContainer").addEventListener(queryEvent, function(e) {
            renderNavaid(e)
        })
        
        document.getElementById("mapRepContainer").addEventListener(queryEvent, function(e) {
            renderRep(e)
        })
        
        document.getElementById("mapCoordsContainer").addEventListener(queryEvent, function(e) {
            renderCoord(e)
        })
        
        document.getElementById("mapBrgDistContainer").addEventListener(queryEvent, function(e) {
            renderBrgDist(e)
        })
    })
    
// C O O R D I N A T E   C O N V E R S I O N S   H A N D L E R S
    
    // calculating DEG MIN SEC to DECIMAL
    document.getElementById("mincalc").addEventListener("click", function() {
        const nsdeg = document.getElementById("nsmindeg").value; // gets the values
        const nsmin = document.getElementById("nsminmin").value;
        const nssec = document.getElementById("nsminsec").value;
        const ewdeg = document.getElementById("ewmindeg").value;
        const ewmin = document.getElementById("ewminmin").value;
        const ewsec = document.getElementById("ewminsec").value;
        const nsSel = document.getElementById("ns").value;
        const ewSel = document.getElementById("ew").value;
        const calculatedCoordinates = degMinSecToDecimal(nsdeg, nsmin, nssec, nsSel, ewdeg, ewmin, ewsec, ewSel)
        addMarker(calculatedCoordinates[0], calculatedCoordinates[1])
    })
    
    // calculating DECIMAL to DEG MIN SEC
    // This is more or less the same as mincalc but the other way around
    document.getElementById("deccalc").addEventListener("click", function() {
        const nsdec = document.getElementById("nsdec").value;
        const ewdec = document.getElementById("ewdec").value;
        const ns2Sel = document.getElementById("ns2").value;
        const ew2Sel = document.getElementById("ew2").value;
        const calculatedCoordinates = decimalToDegMinSec(nsdec, ewdec, ns2Sel, ew2Sel)
        addMarker(nsdec, ewdec)
    })

    // calculating DEG DECIMAL MINUTES to DEG MIN SEC
    // again more or less the same as mincalc and degcalc
    document.getElementById("mindeccalc").addEventListener("click", function() {
        const nsdeg = document.getElementById("nsmindecdeg").value;
        const nsmin = document.getElementById("nsmindecmin").value;
        const ewdeg = document.getElementById("ewmindecdeg").value;
        const ewmin = document.getElementById("ewmindecmin").value;
        const ns3Sel = document.getElementById("ns3").value;
        const ew3Sel = document.getElementById("ew3").value;
        const calculatedCoordinates = degDecimalToDegMinSec(nsdeg, nsmin, ewdeg, ewmin, ns3Sel, ew3Sel)
        addMarker(calculatedCoordinates[0], calculatedCoordinates[1])
    })

// M A P   C O N S T A N T S / I N I T I A L I S E R S
    
    // Leaflet map instance
    const map = L.map('mapid').setView([46.80, 8.22], 8) // midpoint switzerland
    // Map Tile Layers
    const googleHybrid = 'http://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}' // not used but kept for reference
    const googleMap = 'http://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}' // not used but kept for reference
    const openStandard = `https://api.maptiler.com/maps/osm-standard/{z}/{x}/{y}@2x.jpg?key=${MAPTILER_API_KEY}` // direct OSM Tile Server link for reference https://tile.openstreetmap.org/{z}/{x}/{y}.png
    const openTopo = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png' // not used but kept for reference
    const natGeo = 'https://services.arcgisonline.com/arcgis/rest/services/NatGeo_World_Map/MapServer/WMTS/tile/1.0.0/NatGeo_World_Map/{}/{}/{z}/{y}/{x}.jpg'
    const nasaEsri = 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/WMTS/tile/1.0.0/World_Imagery/{}/{}/{z}/{y}/{x}.jpg'
    const maptilerBright = `https://api.maptiler.com/maps/bright/{z}/{x}/{y}@2x.png?key=${MAPTILER_API_KEY}`
    const maptilerHybrid = `https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${MAPTILER_API_KEY}`
    const maptilerSwisstopoVivid = `https://api.maptiler.com/maps/ch-swisstopo-lbm-vivid/{z}/{x}/{y}.png?key=${MAPTILER_API_KEY}`
    // Overlay Tile Layers
    const swisstopo = "https://wmts20.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg" // not used but kept for reference
    const vfrChart = 'https://wmts20.geo.admin.ch/1.0.0/ch.vbs.milairspacechart/default/current/3857/{z}/{x}/{y}.png'
    const droneChart = 'https://wmts20.geo.admin.ch/1.0.0/ch.bazl.einschraenkungen-drohnen/default/current/3857/{z}/{x}/{y}.png'
    const airfieldChart = 'https://wmts20.geo.admin.ch/1.0.0/ch.bazl.flugplaetze-heliports/default/current/3857/{z}/{x}/{y}.png'
    const hillshades = `https://api.maptiler.com/tiles/hillshade/{z}/{x}/{y}.webp?key=${MAPTILER_API_KEY}`
    // Variable initialisers
    
    let layerControl
    let tileLayer = null
    let overlay
    // Overlay toggle state initialisers
    let topoToggle = 0
    let vfrToggle = 0
    let droneToggle = 0
    let overlayArray = []
    
// L A Y E R   R E N D E R E R S

    function createLayer(map, choice, resolution, atrribution) { // this loads the map into view
        if(tileLayer != null){
            map.removeLayer(tileLayer);
        }
        if(resolution == 512){
            tileLayer = L.tileLayer((choice), {
                attribution: atrribution,
                tileSize: 512,
                zoomOffset: -1
            })
        }
        else{
            tileLayer = L.tileLayer((choice), {
                attribution: atrribution
            })
        }
        tileLayer.addTo(map)
    }

    function createOverlay(map, choice, geojson){
        let opacity = 1
        if(choice == droneChart){
            opacity = 0.5
        }
        overlay = L.tileLayer(choice, {opacity: opacity})
        overlay.addTo(map)
        overlayArray.push(overlay)
    }

// O V E R L A Y   T O G G L E R S
   
    function removeOverlays(layer){
        if(overlayArray.length > 0){
            overlayArray.forEach(overlay => {
                if(overlay._url == layer){
                    map.removeLayer(overlay)
                }
            })
            overlayArray = overlayArray.filter(overlay => { return overlay._url != layer })
        }
    }

    document.getElementById("toggleTopo").addEventListener("click", function(){
        if(topoToggle == 0){
            createOverlay(map, hillshades, null)
            topoToggle = 1
        } else if (topoToggle == 1){
            removeOverlays(hillshades)
            topoToggle = 0
        }
    })
    
    document.getElementById("toggleVFR").addEventListener("click", function(){
        if(vfrToggle == 0){
            createOverlay(map, vfrChart, null)
            vfrToggle = 1
        } else if (vfrToggle == 1){
            removeOverlays(vfrChart)
            vfrToggle = 0
        }
    })

    document.getElementById("toggleDrone").addEventListener("click", function(){
        if(droneToggle == 0){
            createOverlay(map, droneChart, null)
            droneToggle = 1
        } else if (droneToggle == 1){
            removeOverlays(droneChart)
            droneToggle = 0
        }
    })
    
    
    const LD_FIR = L.geoJSON(Croatia, featureFIR).bindTooltip(function (layer) {
        return (layer.feature.properties.name).toString();
    })
    const LD_TMA = L.geoJSON(Croatia, featureTMA).bindTooltip(function (layer) {
        return (layer.feature.properties.name).toString();
    })
    /*const LD_CTR = L.geoJSON(Croatia, featureCTR).bindTooltip(function (layer) {
        return (layer.feature.properties.name).toString();
    })
    const ED_FIR = L.geoJSON(Germany, featureFIR).bindTooltip(function (layer) {
        return (layer.feature.properties.name).toString();
    })
    /*const ED_TMA = L.geoJSON(Germany, featureTMA).bindTooltip(function (layer) {
        return (layer.feature.properties.name).toString();
    })
    const ED_CTR = L.geoJSON(Germany, featureCTR).bindTooltip(function (layer) {
        return (layer.feature.properties.name).toString();
    })*/
    const EB_FIR = L.geoJSON(Belgium, featureFIR).bindTooltip(function (layer) {
        return (layer.feature.properties.name).toString();
    })
    const EB_TMA = L.geoJSON(Belgium, featureTMA).bindTooltip(function (layer) {
        return (layer.feature.properties.name).toString();
    })
    const EB_CTR = L.geoJSON(Belgium, featureCTR).bindTooltip(function (layer) {
        return (layer.feature.properties.name).toString();
    })
    /* const LF_FIR = L.geoJSON(France, featureFIR).bindTooltip(function (layer) {
        return (layer.feature.properties.name).toString();
    })
    const LF_TMA = L.geoJSON(France, featureTMA).bindTooltip(function (layer) {
        return (layer.feature.properties.name).toString();
    })
    const LF_CTR = L.geoJSON(France, featureCTR).bindTooltip(function (layer) {
        return (layer.feature.properties.name).toString();
    })*/
    const LI_FIR = L.geoJSON(Italy, featureFIR).bindTooltip(function (layer) {
        return (layer.feature.properties.name).toString();
    })
    /*const LI_TMA = L.geoJSON(Italy, featureTMA).bindTooltip(function (layer) {
        return (layer.feature.properties.name).toString();
    })
    const LI_CTR = L.geoJSON(Italy, featureCTR).bindTooltip(function (layer) {
        return (layer.feature.properties.name).toString();
    })
    const LE_FIR = L.geoJSON(Spain, featureFIR).bindTooltip(function (layer) {
        return (layer.feature.properties.name).toString();
    })
    /*const LE_TMA = L.geoJSON(Spain, featureTMA).bindTooltip(function (layer) {
        return (layer.feature.properties.name).toString();
    })
    const LE_CTR = L.geoJSON(Spain, featureCTR).bindTooltip(function (layer) {
        return (layer.feature.properties.name).toString();
    })*/
    const LY_FIR = L.geoJSON(Serbia, featureFIR).bindTooltip(function (layer) {
        return (layer.feature.properties.name).toString();
    })
    const LY_TMA = L.geoJSON(Serbia, featureTMA).bindTooltip(function (layer) {
        return (layer.feature.properties.name).toString();  
    })
    const LY_CTR = L.geoJSON(Serbia, featureCTR).bindTooltip(function (layer) {
        return (layer.feature.properties.name).toString();
    })
    const LS_FIR = L.geoJSON(Switzerland, featureFIR).bindTooltip(function (layer) {
        return (layer.feature.properties.name).toString();
    })
    const LS_SUBFIR = L.geoJSON(SwitzerlandSub, featureFIR).bindTooltip(function (layer) {
        return (layer.feature.properties.name).toString();
    })

    const overlays = {
        "LS FIR Switzerland": LS_FIR,
        "LSAG/LSAZ BDRY": LS_SUBFIR,
        // "LD FIR Croatia": LD_FIR,
        "LD TMA Croatia": LD_TMA, 
        // "LD CTR Croatia": LD_CTR,
        //"ED FIR Germany": ED_FIR,
        // "ED TMA Germany": ED_TMA, 
        // "ED CTR Germany": ED_CTR,
        "EB FIR Belgium": EB_FIR,
        "EB TMA Belgium": EB_TMA, 
        "EB CTR Belgium": EB_CTR,
        //"LF FIR France": LF_FIR,
        // "LF TMA France": LF_TMA, 
        // "LF CTR France": LF_CTR,
        "LI FIR Italy": LI_FIR,
        // "LI TMA Italy": LI_TMA, 
        // "LI CTR Italy": LI_CTR,
        //"LE FIR Spain": LE_FIR,
        // "LE TMA Spain": LE_TMA, 
        // "LE CTR Spain": LE_CTR,
        "LY FIR Serbia": LY_FIR,
        "LY TMA Serbia": LY_TMA, 
        "LY CTR Serbia": LY_CTR,
    };

    layerControl = L.control.layers(null, overlays)
    layerControl.addTo(map);
    LS_SUBFIR.addTo(map)

    document.getElementById("clearPopups").addEventListener("click", function(){
        let popupCount = document.querySelectorAll(".leaflet-popup-close-button")
        popupCount.forEach(popup => {
            popup.click()
        })
    })
    
    let markerArray = []; // initialises array for all the markers
    let markLatLong = [] // this is a hacky array needed for the line drawing between markers
    let polyline // initialises varaible for the line between markers
    let polylines = [] // initialises array for all the lines
    let latLong = []; // initialises array to hold coordinates of all clicked markers
    let markerDistanceArray = []
    let corners = []
    let total = 0
    let measurelines = []
    
    function addMarker(ns, ew, title, type) { // adds a marker to the map based on the coordinates passed in from the airport query or the calculation results
        let content
        if(title == undefined){
            content = "Lat: " + ns + " Long: " + ew
		} else {
            content = title
		}
        const new_popup = L.popup({"autoClose": false});
        let marker = new L.marker([ns, ew]) // create a new marker
        if(type == "LOCI"){
            marker = new L.marker([ns, ew], {icon: airportIcon}) // create a new marker
        } 
        else if(type =="Location"){
            marker = new L.marker([ns, ew], {icon: locationIcon}) // create a new marker
        } 
        else if(type =="NAVAID"){
            marker = new L.marker([ns, ew], {icon: navaidIcon}) // create a new marker
        } 
        else if(type =="WAYPOINT"){
            marker = new L.marker([ns, ew], {icon: waypointIcon}) // create a new marker
        } 
        else if(type =="COORDINATE"){
            marker = new L.marker([ns, ew], {icon: coordinateIcon}) // create a new marker
        } 
        else if(type =="BRGDIST"){
            marker = new L.marker([ns, ew], {icon: bearingDistinateIcon}) // create a new marker
        } 
        else if(type =="LFN"){
            marker = new L.marker([ns, ew], {icon: lfnIcon}) // create a new marker
        } 
        marker.addTo(map) // add it to the map
        marker.bindPopup(new_popup).openPopup();
        marker._popup.setContent(content)
        markerArray.push(marker) // push it to the markerArray array
        map.setView(marker.getLatLng(), 8); // focus the map on the maker
        for(const markerArrayElement of markerArray){
            let corner = [markerArrayElement.getLatLng().lat, markerArrayElement.getLatLng().lng] // defines a corner as the latitude/longitude of indexed marker
            corners.push(corner) // pushes that corner to the corners array
        }
        if (corners.length > 1) { // if there is more than one corner...
            let bounds = L.latLngBounds([corners]); // define the map boundaries within those corners...
            map.fitBounds(bounds) //... and set the zoom level to include all corners
        }
        marker.addEventListener("dblclick", function(e) { //its a bit weird that the event handler for the markers has to be included in the addMarker function but whatever, it doesnt work otherwise
            markerDistanceArray.push(marker)
            console.log(markerDistanceArray)
            let distbetween
            let distbetweenNM
            markLatLong = []
            latLong.push([marker.getLatLng().lat, marker.getLatLng().lng]) // push latitude and longitude of clicked marker to latLong array...
            console.log(latLong)
            if (markerDistanceArray.length > 1) { // if there is more than one marker in latLongs...
                let i = markerDistanceArray.length // get the lengts of latLongs (how many markers)...
                markLatLong.push(markerDistanceArray[i-1], markerDistanceArray[i-2]) //...and push the last two markers to the marklatLong array
                console.log(markLatLong)
                let latlng1 = L.latLng(markLatLong[0].getLatLng());
                let latlng2 =  L.latLng(markLatLong[1].getLatLng());
                distbetween = latlng1.distanceTo(latlng2)
                distbetweenNM = (distbetween*0.000539957).toFixed(2) + " NM"
                let j= markerDistanceArray.length
                total = parseFloat((distbetween*0.000539957))
                total = total.toFixed(2)
                distanceBar(markLatLong[0]._popup._content, distbetweenNM, markLatLong[1]._popup._content, total)
                polyline = L.polyline([markLatLong[0].getLatLng(), markLatLong[1].getLatLng()],{ // drwas a line between the clicked and the last clicked marker
                    color: 'red'
                }).addTo(map);
                polylines.push(polyline) // adds the polyline object to the polylines array 
            } else {
                markLatLong.push(latLong[0]) // else just push the one thats there
            }
        })
    }

    function distanceBar(dep, dist, dest, total){
        let distBar = document.getElementById("mapDistanceBar")
        let distTable = document.getElementById("distTable")
        distBar.style.display = "block"
        let fmTD = document.createElement("td")
        let distTD = document.createElement("td")
        let toTD = document.createElement("td")
        let totalTD = document.createElement("td")
        let timeTD = document.createElement("td")
        let row = distTable.insertRow(0)
        row.appendChild(fmTD)
        row.appendChild(distTD)
        row.appendChild(toTD)
        row.appendChild(totalTD)
        row.appendChild(timeTD)
        fmTD.innerText = dep.substr(0,4)
        distTD.innerText = parseFloat(dist).toFixed(2)
        toTD.innerText = dest.substr(0,4)
        totalTD.innerText = total + "NM"
        document.getElementById("speedInput").addEventListener("keypress", function(e){
            if(e.key == "Enter"){
                e.preventDefault()
                let acftSpeed = parseInt(document.getElementById("speedInput").value)
                if (document.getElementById("speedInput").value != ""){
                    timeTD.innerText = speedTimeCalc(total, parseFloat(acftSpeed))
                } else if(document.getElementById("speedInput").value == ""){
                    timeTD.innerText = ""
                }
            }
        })
    }

    function speedTimeCalc(total, acftSpeed){
        let dist = parseFloat(total)
        let speed = parseFloat(acftSpeed)
        let time = parseFloat((dist/speed).toFixed(6)) // decimal hours
        let hours
        let minutes
        let seconds
        if (time >= 1.000000){
            hours = parseInt(time)
        } else {
            hours = 0
        }
        minutes = parseInt(((time-hours)*60))
        if (minutes < 10){
        }
        seconds = parseInt(((((time-hours)*60)-minutes)*60))
        if (seconds < 10){
        }

        if(hours == 0){
            hours = "00"
        } else if(hours < 10){
            hours = "0" + hours
        }
        if(minutes == 0){
            minutes = "00"
        } else if(minutes < 10){
            minutes = "0" + minutes
        }
        if(seconds == 0){
            seconds = "00"
        } else if(seconds < 10){
            seconds = "0" + seconds
        }
        time = hours.toString() + ":" + minutes.toString() + ":" + seconds.toString()
        return time
    }
    document.getElementById("clearMarker").addEventListener("click", function() {
        clearMarkers()
    })

    function clearMarkers(){
        for (let i = 0; i < markerArray.length; i++) { // checks how many markers are on the map
            markerArray[i].remove(map) // removes them from the map. not sure which one is doing it exactly so better two than none
            map.removeLayer(markerArray[i]);
            markerDistanceArray = []
            total = 0
            document.getElementById("mapDistanceBar").style.display ="none"
            while(document.getElementById("distTable").childNodes.length > 0){ // if there are more than one autocomplete boxes generated
                document.getElementById("distTable").removeChild(document.getElementById("distTable").lastChild) //... delete the last one (so only one remains)
            }
        }
        markerArray = [] // clears marker array
        corners = [] // clears corners, so a new marker will get zoomed in
    }

    document.getElementById("clearLine").addEventListener("click", function() {
        for (let i = 0; i < polylines.length; i++) { // checks how many lines are on the map
            polylines[i].remove(map) // removes them from the map. not sure which one is doing it exactly so better two than none
            map.removeLayer(polylines[i]);
        }
        // these clear various arrays  so it wont display any lines all again after a new click
        polylines = []
        latLong = []
        latLongs = []
        markLatLong = []
    })

    document.getElementById("focusSwitzerland").addEventListener("click", function() {
        map.setView([46.80, 8.22], 8); // set map focus to switerland, midpoint coordinate switzerland
    })
    
    document.getElementById("focusEurope").addEventListener("click", function() {
        map.setView([53.0, 20.0], 4); // set map focus to europe, midpoint coordinate belarus
    })
    
    document.getElementById("focusWorld").addEventListener("click", function() {
        map.setView([40.87, 34.57], 2);
        // set map focus to world, midpoint coordinate Ukraine
    })

    const mapTileChoices = [
            {
            title: "Basic",
            image: "./Assets/maptilerBasic.jpg",
            map: maptilerBright,
            resolution: 512,
            attribution: `<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>`
            },
            {
            title: "Satellite",
            image: "./Assets/maptilerSatellite.jpg",
            map: maptilerHybrid,
            resolution: 512,
            attribution: `<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>`
            },
            {
            title: "Open Street Maps",
            image: "./Assets/maptilerOSM.jpg",
            map: openStandard,
            resolution: 512,
            attribution: `<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>`
            },
            {
            title: "swisstopo",
            image: "./Assets/maptilerSwisstopo.jpg",
            map: maptilerSwisstopoVivid,
            resolution: 512,
            attribution: `<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a> © swisstopo <a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a> <a href="https://www.swisstopo.admin.ch/en/home.html" target="_blank">&copy; swisstopo</a>`
            },
            {
            title: "National Geographic",
            image: "./Assets/natgeo.jpg",
            map: natGeo,
            resolution: 256,
            attribution: `<a href="https://services.arcgisonline.com/arcgis/rest/services/NatGeo_World_Map/MapServer" target="_blank">&copy; National Geographic, Esri, Garmin, HERE, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, increment P Corp.</a>`
            },
            {
            title: "NASA / ESRI",
            image: "./Assets/nasa.jpg",
            map: nasaEsri,
            resolution: 256,
            attribution: `<a href="https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer" target="_blank">&copy; Esri, Maxar, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community</a>`
            },
        ]


    function mapStylesContent(){
        for(let i=0;i<Object.keys(mapTileChoices).length;i++){
            let mapTileDiv = document.createElement("div")
            document.getElementById("mapChoiceTileContainerInner").appendChild(mapTileDiv)
            mapTileDiv.id = `mapTileDiv${i}`
            mapTileDiv.className = "mapTileDiv"
            mapTileDiv.style.backgroundImage = `url("${mapTileChoices[i].image}")`
            let mapTileDivInner = document.createElement("div")
            mapTileDivInner.id =  `mapTileDivInner${i}`
            mapTileDivInner.className = "mapTileDivInner"
            document.getElementById(mapTileDiv.id).appendChild(mapTileDivInner)
            mapTileDivInner.innerText = mapTileChoices[i].title
            document.getElementById(mapTileDiv.id).addEventListener("click", function(){
                createLayer(map, mapTileChoices[i].map, mapTileChoices[i].resolution, mapTileChoices[i].attribution)
            })
        }
    }

    mapStylesContent()
    createLayer(map, mapTileChoices[0].map, mapTileChoices[0].resolution, mapTileChoices[0].attribution)

    function renderRoute(navaids, locis, waypoints, otherWords, coordAll, brgDist, e){
        // console.log(navaids, locis, waypoints, otherWords, coordAll, e)
        if(navaids.length > 0){
            navaids = new Set(navaids)
            navaids = Array.from(navaids)
            navaids = navaids.toString()
            navaids = navaids.replaceAll(",", " ")
            document.getElementById("mapNavaid").value = navaids
            renderNavaid(e)
        }
        if(locis.length > 0){
            locis = new Set(locis)
            locis = Array.from(locis)
            locis = locis.toString()
            locis = locis.replaceAll(",", " ")
            document.getElementById("mapLoci").value = locis
            renderLoci(e)
        }
        if(waypoints.length > 0){
            waypoints = new Set(waypoints)
            waypoints = Array.from(waypoints)
            waypoints = waypoints.toString()
            waypoints = waypoints.replaceAll(",", " ")
            document.getElementById("mapRep").value = waypoints
            renderRep(e)
        }
        if(otherWords.length > 0){
            otherWords = new Set(otherWords)
            otherWords = Array.from(otherWords)
            otherWords = otherWords.toString()
            document.getElementById("mapPlace").value = otherWords
            renderPlace(e)
        }
        if(coordAll.length > 0){
            coordAll = new Set(coordAll)
            coordAll = Array.from(coordAll)
            coordAll = coordAll.toString()
            coordAll = coordAll.replaceAll(",", " ")
            document.getElementById("mapCoords").value = coordAll
            renderCoord(e)
        }
        if(brgDist.length > 0){
            brgDist = new Set(brgDist)
            brgDist = Array.from(brgDist)
            brgDist = brgDist.toString()
            brgDist = brgDist.replaceAll(",", " ")
            document.getElementById("mapBrgDist").value = brgDist
            renderBrgDist(e)
        }
    }
    
    let centerPoint
    let group = L.layerGroup([])
    function onMapClick(e) {
        let decimalDegrees = [e.latlng.lat.toFixed(6), e.latlng.lng.toFixed(6)]
        let wgsDegrees = calcDecToDeg(e.latlng.lat.toFixed(6) > 0 ? e.latlng.lat.toFixed(6) : Math.abs(e.latlng.lat.toFixed(6)), e.latlng.lng.toFixed(6) > 0 ? e.latlng.lng.toFixed(6) : Math.abs(e.latlng.lng.toFixed(6)), e.latlng.lat.toFixed(6) > 0 ? "N" : "S", e.latlng.lng.toFixed(6) > 0 ? "E" : "W")
        document.getElementById("cursorTooltip").innerText = `${decimalDegrees.join(", ")}\n${wgsDegrees[0]}${e.latlng.lat.toFixed(6) > 0 ? "N" : "S"}, ${wgsDegrees[1]}${e.latlng.lng.toFixed(6) > 0 ? "E" : "W"}`
        
        if(centerPoint != undefined && document.getElementById("speedForCircle").value != ""){
        let currentPoint = L.latLng(e.latlng.lat, e.latlng.lng)
        let distbetween = centerPoint.distanceTo(currentPoint)
        let distbetweenNM = (distbetween*0.000539957).toFixed(2) + " NM"
        let time = (Math.ceil((distbetween*0.000539957)/100*60))
        document.getElementById("timeOfCircle").innerText = `${time} min`
        if(time > 59){
            let hours = time/60
            let rhours = Math.floor(hours)
            let minutes = (hours - rhours)*60
            let rminutes = Math.floor(minutes)
            document.getElementById("timeOfCircle").innerText = `${rhours} h ${rminutes} min`
        }
        map.on('polylinemeasure:add', e => { 
            group.eachLayer(function(layer) {
                group.removeLayer(layer)
            })
            let circle = L.circle([centerPoint.lat, centerPoint.lng], {radius: distbetween})
            group.addLayer(circle).addTo(map);
        });
        map.on('polylinemeasure:clear', e => {
            group.eachLayer(function(layer) {
                group.removeLayer(layer)
            })
            centerPoint = null
        });
        }
    }

    map.addEventListener("mousemove", function(e){
        onMapClick(e)
    })
   
    map.addEventListener("mouseover", function(e){
        document.getElementById("cursorTooltip").style.display="block"
    })
    
    map.addEventListener("mouseout", function(e){
        document.getElementById("cursorTooltip").style.display="none"
    })
    
    const drawLineOptions = {
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
                                        // language dependend labels for point's tooltips
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
                                        // measurement units being cycled through by using the Unit Control
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
    
    L.control.polylineMeasure(drawLineOptions).addTo(map);
    map.on('polylinemeasure:start', currentLine => {
        setTimeout(function(){
            centerPoint = L.latLng(currentLine.circleCoords[0].lat, currentLine.circleCoords[0].lng)
        }, 100)
    })
    
    const rainViewer = L.control.rainviewer({ 
        position: 'topleft',
        nextButtonText: '>',
        playStopButtonText: 'Play/Stop',
        prevButtonText: '<',
        positionSliderLabelText: "Hour:",
        opacitySliderLabelText: "Opacity:",
        animationInterval: 500,
        opacity: 0.5
    })
    rainViewer.addTo(map);
 
}
