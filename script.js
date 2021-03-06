import { placeLoci, placeNavaid, placeRep, placeCoords, placePlace, placeBrgDist } from "/queryFunctions.js"
import { calcDecToDeg, placeholderFill, convertCoordinates, plotConvertedCoordinates, convertHeight, convertSpeed } from "/coordinateConversions.js"
import { routeDeconstructor } from "/routeDeconstructor.js"
import { tabFlags, mapTileChoices, tileLayers, drawLineOptions, rainviewerOptions, customMarkers, colorFIR, colorTMA, colorCTR, colorFIC, colorPoint, colorDroneSchutzgebiet, colorDroneSperrgebiet, colorDroneCTR} from "/configs.js"
import { Iceland, Belgium, Germany, UnitedKingdom, Netherlands, Ireland, Albania, Croatia, LD_VFR_REP, Spain, France, ItalyFIC, Italy, LJ_VFR_REP, Switzerland, SwitzerlandSub, Serbia } from "/Data/airspaces.js"

window.addEventListener('DOMContentLoaded', async (event) => {
    console.time("start onload")

    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    document.getElementById("currentYear").innerText = currentYear
    
// R E N D E R   T O O L B O X E S / T A B S
    
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
    
// S E A R C H   O N   M A P   E V E N T   F U N C T I O N S
    
    async function renderLoci(e){
        const arr = []
        if((e.key == "Enter" && e.target.type == "textarea") || (e.type == "click" && e.target.type == "submit")){
            e.preventDefault()
            const returnedLocis = placeLoci()
            if(returnedLocis == undefined){
                return
            }
            if(!Array.isArray(returnedLocis[0])){ // Multiple Locis are returned as a multidimensional Array so this simply checks if the first Item of the returned array is also an array and if not, its a single Loci
                arr.push([returnedLocis[0], returnedLocis[1], returnedLocis[2], "LOCI"])
            } else {
                returnedLocis.forEach(returnedLoci => {
                    arr.push([returnedLoci[0], returnedLoci[1], returnedLoci[2], "LOCI"])
                })
            }
        }
        return arr
    }
    
    async function renderPlace(e){
        const arr = []
        if((e.key == "Enter" && e.target.type == "textarea") || (e.type == "click" && e.target.type == "submit")){
            e.preventDefault()
            const returnedPlaces = await placePlace()
            if(returnedPlaces == undefined || returnedPlaces.length == 0){
                return
            }
            if(!Array.isArray(returnedPlaces[0])){ 
                arr.push([returnedPlaces[0], returnedPlaces[1], returnedPlaces[2], "Location"])
            } else {
                returnedPlaces.forEach(returnedPlace => {
                    arr.push([returnedPlace[0], returnedPlace[1], returnedPlace[2], "Location"])
                })
            }
        }
        return arr
    }
    
    async function renderNavaid(e){
        const arr = []
        if((e.key == "Enter" && e.target.type == "textarea") || (e.type == "click" && e.target.type == "submit")){
            e.preventDefault()
            const returnedNavaids = placeNavaid()
            if(returnedNavaids == undefined || returnedNavaids.length == 0){
                return
            }
            if(!Array.isArray(returnedNavaids[0])){ 
                arr.push([returnedNavaids[0], returnedNavaids[1], returnedNavaids[2], "NAVAID"])
            } else {
                /* This probably very inefficient algorithm checks if there is a VOR and DME with the same coordinates and if so, only displays the VOR and if not, displays the DME/TACAN
                Its not really pretty and its convoluted but "it works" */
                const vors = returnedNavaids.filter(returnedNavaid => {return !returnedNavaid[2].includes("DME or TACAN")}) // gets all VORs
                const dmes = returnedNavaids.filter(returnedNavaid => {return returnedNavaid[2].includes("DME or TACAN")}) // gets all TACANs and DMEs
                const dme2s = [] // empty array for non unique navaids
                dmes.forEach(dme => {
                    vors.forEach(vor => {
                        if(dme[0] == vor[0] && dme[1] == vor[1]){ // checks if the coordinates for each vor and dme are identical
                            dme2s.push(dme) // if so, pushes the dme that coordinate-matches with a vor to the dem2s array
                        }
                    })
                })
                if(dme2s.length != dmes.length){ // if the dme2s array is a different size than dme array, that means there is one or more unique DMEs
                    dmes.forEach(dme => {
                        if(!dme2s.includes(dme)) // so for each dme in the dme array, if it is not in the dme2s array (meaning its unique), push it to the vor array
                        vors.push(dme)
                    })
                }
                vors.forEach(vor => { // and then just plot everything
                    arr.push([vor[0], vor[1], vor[2], "NAVAID"])
                })
            }
        }
        return arr
    }
    
    async function renderRep(e){
        const arr = []
        if((e.key == "Enter" && e.target.type == "textarea") || (e.type == "click" && e.target.type == "submit")){
            e.preventDefault()
            const returnedReps = placeRep()
            if(returnedReps == undefined || returnedReps.length == 0){
                return
            }
            if(!Array.isArray(returnedReps[0])){ 
                if(returnedReps[2].match(/\b([A-Z]){5}\b/g)){
                    arr.push([returnedReps[0], returnedReps[1], returnedReps[2], "WAYPOINT"])
                }
                if(returnedReps[2].match(/\b(LS)([0-9]){3}\b/g)){
                    arr.push([returnedReps[0], returnedReps[1], returnedReps[2], "LFN"])
                }
            } else {
                returnedReps.forEach(returnedRep => {
                    if(returnedRep[2].match(/\b([A-Z]){5}\b/g)){
                    arr.push([returnedRep[0], returnedRep[1], returnedRep[2], "WAYPOINT"])
                    }
                    if(returnedRep[2].match(/\b(LS)([0-9]){3}\b/g)){
                        arr.push([returnedRep[0], returnedRep[1], returnedRep[2], "LFN"])
                    }
                })
            }
        }
        return arr
    }
    
    async function renderCoord(e){
        const arr = []
        if((e.key == "Enter" && e.target.type == "textarea") || (e.type == "click" && e.target.type == "submit")){
            e.preventDefault()
            const returnedCoords = placeCoords()
            if(returnedCoords == undefined || returnedCoords.length == 0){
                return
            }
            returnedCoords.forEach(returnedCoord => {
                arr.push([returnedCoord[0], returnedCoord[1], returnedCoord[2], "COORDINATE"])
            })
        }
        return arr
    }
    
    async function renderBrgDist(e){
        const arr = []
        if((e.key == "Enter" && e.target.type == "textarea") || (e.type == "click" && e.target.type == "submit")){
            e.preventDefault()
            const returnedBrgDists = placeBrgDist()
            if(returnedBrgDists == undefined || returnedBrgDists.length == 0){
                return
            }
            returnedBrgDists.forEach(returnedBrgDist => {
                arr.push([returnedBrgDist[1], returnedBrgDist[2], returnedBrgDist[0], "BRGDIST"])
            })
        }
        return arr
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
                document.getElementById("mapBrgDist").value = ""
                clearMarkers()
                const deconstructedRoute = routeDeconstructor()
                renderRoute(deconstructedRoute[0], deconstructedRoute[1], deconstructedRoute[2], deconstructedRoute[3], deconstructedRoute[4], deconstructedRoute[5], e)
            }
        })
        
        document.getElementById("mapLociContainer").addEventListener(queryEvent, async function(e) {
            const toRender = await renderLoci(e)
                toRender.forEach(item => {
                    addMarker(item[0], item[1], item[2], item[3])
                })
        })
        
        document.getElementById("mapPlaceContainer").addEventListener(queryEvent, async function(e) {
            const toRender = await renderPlace(e)
                toRender.forEach(item => {
                    addMarker(item[0], item[1], item[2], item[3])
                })
         })
        
        document.getElementById("mapNavaidContainer").addEventListener(queryEvent, async function(e) {
            const toRender = await renderNavaid(e)
                toRender.forEach(item => {
                    addMarker(item[0], item[1], item[2], item[3])
                })
        })
        
        document.getElementById("mapRepContainer").addEventListener(queryEvent, async function(e) {
            const toRender = await renderRep(e)
                toRender.forEach(item => {
                    addMarker(item[0], item[1], item[2], item[3])
                })
        })
        
        document.getElementById("mapCoordsContainer").addEventListener(queryEvent, async function(e) {
            const toRender = await renderCoord(e)
                toRender.forEach(item => {
                    addMarker(item[0], item[1], item[2], item[3])
                })
        })
        
        document.getElementById("mapBrgDistContainer").addEventListener(queryEvent, async function(e) {
            const toRender = await renderBrgDist(e)
                 toRender.forEach(item => {
                    addMarker(item[0], item[1], item[2], item[3])
                })
         })
    })
    
// C O O R D I N A T E   C O N V E R S I O N S   H A N D L E R S
    
document.getElementById("coordinateConversion_Input_Select").addEventListener("change", function(){
        placeholderFill()
    })
   
    document.getElementById("coordinateConversion_Input").addEventListener("keypress", function(e) {
        if(e.key == "Enter"){
            e.preventDefault()
            convertCoordinates()
        }
    })
   
    document.getElementById("coordinateConversionConvert").addEventListener("click", function(){
        convertCoordinates()
    })
   
    document.getElementById("coordinateConversionPlot").addEventListener("click", function(){
        const markers = plotConvertedCoordinates()
        for (const marker of markers){
            addMarker(marker[1], marker[0], null, "COORDINATE", null)
        }
    })
   
    document.getElementById("heightConversion").addEventListener("click", function(){
        convertHeight()
    })
   
    document.getElementById("heightConversion_Input").addEventListener("keyup", function(e) {
        if(e.key == "Enter"){
            convertHeight()
        }
    })
   
    document.getElementById("speedConversion").addEventListener("click", function(){
        convertSpeed()
    })
   
    document.getElementById("speedConversion_Input").addEventListener("keyup", function(e) {
        if(e.key == "Enter"){
            convertSpeed()
        }
    })
	
    const airportIcon = L.icon(customMarkers.airportMarker);
    const locationIcon = L.icon(customMarkers.locationMarker);
    const navaidIcon = L.icon(customMarkers.navaidMarker);
    const waypointIcon = L.icon(customMarkers.waypointMarker);
    const coordinateIcon = L.icon(customMarkers.coordinateMarker);
    const bearingDistinateIcon = L.icon(customMarkers.brgDistMarker);
    const lfnIcon = L.icon(customMarkers.lfnMarker);
    const customIcon = L.icon(customMarkers.customMarker);

     // M A P   C O N S T A N T S / I N I T I A L I S E R S

   
    // Leaflet map instance
    const map = L.map('mapid').setView([46.80, 8.22], 8) // midpoint switzerland
   
    // Variable initialisers
    let layerControl
    let tileLayer = null
    let overlay
    // Overlay toggle state initialisers
    let vfrToggleCH = false
    let vfrToggleFR = false
    let vfrToggleDE = false
    let droneSchutzToggle = false
    let droneSperrToggle = false
    let droneCTRToggle = false
    let droneToggle = false
    let droneAllToggle = false
    let toggleVFR = false
    let overlayArray = []

        //Initial map load. Switch between test map and prod map respectively on test/push
        // createLayer(map, "https://tile.openstreetmap.org/{z}/{x}/{y}.png", mapTileChoices[0].resolution, mapTileChoices[0].attribution)
        createLayer(map, mapTileChoices[0].map, mapTileChoices[0].resolution, mapTileChoices[0].attribution)

    
// L A Y E R   R E N D E R E R S

    function createLayer(map, choice, resolution, atrribution) { // this loads the map into view
        if(tileLayer != null){
            map.removeLayer(tileLayer);
        }
        if(resolution == 512){
            tileLayer = L.tileLayer((choice), {
                attribution: atrribution,
               // tileSize: 512,
              //  zoomOffset: -1
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
        if(choice == tileLayers.droneChart){
            opacity = 0.5
        }
        overlay = L.tileLayer(choice, {opacity: opacity})
        overlay.addTo(map)
        overlayArray.push(overlay)
    }

// D R O N E   A R E A   S H A P E S
    
    const droneSchutzgebiet = L.geoJSON(droneRestrictions, {style: {color: colorDroneSchutzgebiet}, filter: function(feature, layer) {
        if(feature.properties.name === "Schutzgebiete"){
            return feature.properties.name;
        }
    }}).bindTooltip(function (layer) {
            return `<strong>${layer.feature.properties.Name_EN}</strong><br><p>${layer.feature.properties.Restr_EN}</p><br><p>${layer.feature.properties.Bew_St_EN}</p>`
            },{sticky: true, className: "droneTooltip"})
    
    const droneCTR = L.geoJSON(droneRestrictions, {style: {color: colorDroneCTR}, filter: function(feature, layer) {
        if(feature.properties.name === "CTR"){
            return feature.properties.name;
        }
    }}).bindTooltip(function (layer) {
            return `<strong>${layer.feature.properties.Name_EN}</strong><br><p>${layer.feature.properties.Restr_EN}</p><br><p>${layer.feature.properties.Bew_St_EN}</p>`
            },{sticky: true, className: "droneTooltip"})
    
    const droneSperrgebiet = L.geoJSON(droneRestrictions, {style: {color: colorDroneSperrgebiet}, filter: function(feature, layer) {
        if(feature.properties.name === "Sperrgebiete"){
            return feature.properties.name;
        }
    }}).bindTooltip(function (layer) {
            return `<strong>${layer.feature.properties.Name_EN}</strong><br><p>${layer.feature.properties.Restr_EN}</p><br><p>${layer.feature.properties.Bew_St_EN}</p>`
            },{sticky: true, className: "droneTooltip"})
        
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
    
// V F R   C H A R T   O V E R L A Y S

    document.getElementById("vfrCH").addEventListener("click", function(){
        !vfrToggleCH ? createOverlay(map, tileLayers.vfrChartCH, null) : removeOverlays(tileLayers.vfrChartCH)
        !vfrToggleCH ? document.getElementById("vfrCH").style.color = "lime" : document.getElementById("vfrCH").style.color = "white"
        vfrToggleCH = !vfrToggleCH
    })
    
    document.getElementById("vfrFrance").addEventListener("click", function(){
        !vfrToggleFR ? createOverlay(map, tileLayers.vfrChartFR, null) : removeOverlays(tileLayers.vfrChartFR)
        !vfrToggleFR ? document.getElementById("vfrFrance").style.color = "lime" : document.getElementById("vfrFrance").style.color = "white"
        vfrToggleFR = !vfrToggleFR
    })
        
    document.getElementById("toggleVFR").addEventListener("click", function(){
        !toggleVFR ? document.getElementById("vfrContainer").style.display ="flex" : document.getElementById("vfrContainer").style.display ="none"
        toggleVFR = !toggleVFR
    })
    
    document.getElementById("vfrGermany").addEventListener("click", function(){
        !vfrToggleDE ? createOverlay(map, tileLayers.vfrChartDE, null) : removeOverlays(tileLayers.vfrChartDE)
        !vfrToggleDE ? document.getElementById("vfrGermany").style.color = "lime" : document.getElementById("vfrGermany").style.color = "white"
        vfrToggleDE = !vfrToggleDE
    })
    
// D R O N E   A R E A   O V E R L A Y S
    
    document.getElementById("toggleDrone").addEventListener("click", function(){
        !droneToggle ? document.getElementById("droneContainer").style.display ="flex" : document.getElementById("droneContainer").style.display ="none"
        droneToggle = !droneToggle
    })

    document.getElementById("droneSchutz").addEventListener("click", function(){
        !droneSchutzToggle ? droneSchutzgebiet.addTo(map) : map.removeLayer(droneSchutzgebiet)
        !droneSchutzToggle ? document.getElementById("droneSchutz").style.color = "lime" : document.getElementById("droneSchutz").style.color = "white"
        droneSchutzToggle = !droneSchutzToggle
    })

    document.getElementById("droneSperr").addEventListener("click", function(){
        !droneSperrToggle ? droneSperrgebiet.addTo(map) : map.removeLayer(droneSperrgebiet)
        !droneSperrToggle ? document.getElementById("droneSperr").style.color = "lime" : document.getElementById("droneSperr").style.color = "white"
        droneSperrToggle = !droneSperrToggle
    })

    document.getElementById("droneCTR").addEventListener("click", function(){
        !droneCTRToggle ? droneCTR.addTo(map) : map.removeLayer(droneCTR)
        !droneCTRToggle ? document.getElementById("droneCTR").style.color = "lime" : document.getElementById("droneCTR").style.color = "white"
        droneCTRToggle = !droneCTRToggle
    })
        
    document.getElementById("droneAll").addEventListener("click", function(){
        if(!droneAllToggle){
            if(!droneSchutzToggle){
                droneSchutzgebiet.addTo(map) 
                document.getElementById("droneSchutz").style.color = "lime"
                droneSchutzToggle = !droneSchutzToggle
            }
            if(!droneCTRToggle){
                droneCTR.addTo(map) 
                document.getElementById("droneCTR").style.color = "lime"
                droneCTRToggle = !droneCTRToggle
            }
            if(!droneSperrToggle){
                droneSperrgebiet.addTo(map) 
                document.getElementById("droneSperr").style.color = "lime"
                droneSperrToggle = !droneSperrToggle
            }
        }
        if(droneAllToggle){
                map.removeLayer(droneSchutzgebiet)
                document.getElementById("droneSchutz").style.color = "white"
                droneSchutzToggle = !droneSchutzToggle
                map.removeLayer(droneCTR) 
                document.getElementById("droneCTR").style.color = "white"
                droneCTRToggle = !droneCTRToggle
                map.removeLayer(droneSperrgebiet) 
                document.getElementById("droneSperr").style.color = "white"
                droneSperrToggle = !droneSperrToggle
        }
        droneAllToggle = !droneAllToggle
    })
    
// A I R S P A C E   S H A P E S

    const LS_FIR = L.geoJSON(Switzerland, {style: {color: colorFIR}, filter: function(feature, layer) {
        if(feature.properties.Type == "FIR"){
            return feature.properties.Type;
        }}}).bindTooltip(function (layer) {
            return `${layer.feature.properties.ICAO}<br>${layer.feature.properties.Name}` 
            },{sticky: true})
    
    const LS_SUBFIR = L.geoJSON(SwitzerlandSub, {style: {color: colorFIC}, filter: function(feature, layer) {
        if(feature.properties.Type == "BDRY"){
            return feature.properties.Type;
        }}}).bindTooltip(function (layer) {
            return `${layer.feature.properties.Name}` 
            },{sticky: true})
        
    const LI_FIC = L.geoJSON(ItalyFIC, {style: {color: colorFIC}, filter: function(feature, layer) {
        if(feature.properties.Type == "BDRY"){
            return feature.properties.Type;
        }}}).bindTooltip(function (layer) {
            return `${layer.feature.properties.Name}` 
            },{sticky: true})
    
    const LJ_VFR_REPS = L.geoJSON(LJ_VFR_REP, {style: {color: colorPoint}, pointToLayer: function(geoJsonPoint, latlng) {
        return L.marker(latlng, {icon: L.icon(customMarkers.sloveniaMarker)});
    }}).bindTooltip(function (layer) {
         return `${layer.feature.properties.Name}`  
        },{sticky: true})
    
    const LD_VFR_REPS = L.geoJSON(LD_VFR_REP, {style: {color: colorPoint}, pointToLayer: function(geoJsonPoint, latlng) {
        return L.marker(latlng, {icon: L.icon(customMarkers.croatiaMarker)});
    }}).bindTooltip(function (layer) {
        return `${layer.feature.properties.Name}` 
        },{sticky: true})
    
    const EB_FIR = L.geoJSON(Belgium, {style: {color: colorFIR}, filter: function(feature, layer) {
        if(feature.properties.Type == "FIR"){
            return feature.properties.Type;
        }}}).bindTooltip(function (layer) {
            return `${layer.feature.properties.ICAO}<br>${layer.feature.properties.Name}` 
            },{sticky: true})
    
    const EB_TMA = L.geoJSON(Belgium, {style: {color: colorTMA}, filter: function(feature, layer) {
        if(feature.properties.Type == "TMA"){
            return feature.properties.Type;
        }}}).bindTooltip(function (layer) {
            return `${layer.feature.properties.ICAO}<br>${layer.feature.properties.Name}<br>${layer.feature.properties.Lower} - ${layer.feature.properties.Upper}` 
            },{sticky: true})
    
    const EB_CTR = L.geoJSON(Belgium, {style: {color: colorCTR}, filter: function(feature, layer) {
        if(feature.properties.Type == "CTR"){
            return feature.properties.Type;
        }}}).bindTooltip(function (layer) {
        return `${layer.feature.properties.ICAO}<br>${layer.feature.properties.Name}<br>${layer.feature.properties.Lower} - ${layer.feature.properties.Upper}` 
    },{sticky: true})
        
    const LD_FIR = L.geoJSON(Croatia, {style: {color: colorFIR}, filter: function(feature, layer) {
        if(feature.properties.Type == "FIR"){
            return feature.properties.Type;
        }}}).bindTooltip(function (layer) {
            return `${layer.feature.properties.ICAO}<br>${layer.feature.properties.Name}` 
            },{sticky: true})
    
    const LD_TMA = L.geoJSON(Croatia, {style: {color: colorTMA}, filter: function(feature, layer) {
        if(feature.properties.Type == "TMA"){
            return feature.properties.Type;
        }}}).bindTooltip(function (layer) {
            return `${layer.feature.properties.ICAO}<br>${layer.feature.properties.Name}<br>${layer.feature.properties.Lower} - ${layer.feature.properties.Upper}` 
            },{sticky: true})
    
    const LD_CTR = L.geoJSON(Croatia, {style: {color: colorCTR}, filter: function(feature, layer) {
        if(feature.properties.Type == "CTR"){
            return feature.properties.Type;
        }}}).bindTooltip(function (layer) {
            return `${layer.feature.properties.ICAO}<br>${layer.feature.properties.Name}<br>${layer.feature.properties.Lower} - ${layer.feature.properties.Upper}` 
            },{sticky: true})
    
    const LY_FIR = L.geoJSON(Serbia, {style: {color: colorFIR}, filter: function(feature, layer) {
        if(feature.properties.Type == "FIR"){
            return feature.properties.Type;
        }}}).bindTooltip(function (layer) {
            return `${layer.feature.properties.ICAO}<br>${layer.feature.properties.Name}` 
            },{sticky: true})
    
    const LY_TMA = L.geoJSON(Serbia, {style: {color: colorTMA}, filter: function(feature, layer) {
       if(feature.properties.Type == "TMA"){
            return feature.properties.Type;
        }}}).bindTooltip(function (layer) {
            return `${layer.feature.properties.ICAO}<br>${layer.feature.properties.Name}<br>${layer.feature.properties.Lower} - ${layer.feature.properties.Upper}` 
            },{sticky: true})

    const ED_FIR = L.geoJSON(Germany, {style: {color: colorFIR}, filter: function(feature, layer) {
        if(feature.properties.Type == "FIR"){
            return feature.properties.Type;
        }}}).bindTooltip(function (layer) {
            return `${layer.feature.properties.ICAO}<br>${layer.feature.properties.Name}` 
            },{sticky: true})
    
    const LF_FIR = L.geoJSON(France, {style: {color: colorFIR}, filter: function(feature, layer) {
        if(feature.properties.Type == "FIR"){
            return feature.properties.Type;
        }}}).bindTooltip(function (layer) {
            return `${layer.feature.properties.ICAO}<br>${layer.feature.properties.Name}` 
            },{sticky: true})
        
    const LI_FIR = L.geoJSON(Italy, {style: {color: colorFIR}, filter: function(feature, layer) {
        if(feature.properties.Type == "FIR"){
            return feature.properties.Type;
        }}}).bindTooltip(function (layer) {
            return `${layer.feature.properties.ICAO}<br>${layer.feature.properties.Name}` 
            },{sticky: true})
        
    const LE_FIR = L.geoJSON(Spain, {style: {color: colorFIR}, filter: function(feature, layer) {
        if(feature.properties.Type == "FIR"){
            return feature.properties.Type;
        }}}).bindTooltip(function (layer) {
            return `${layer.feature.properties.ICAO}<br>${layer.feature.properties.Name}` 
            },{sticky: true})
        
    const EG_FIR = L.geoJSON(UnitedKingdom, {style: {color: colorFIR}, filter: function(feature, layer) {
        if(feature.properties.Type == "FIR"){
            return feature.properties.Type;
        }}}).bindTooltip(function (layer) {
            return `${layer.feature.properties.ICAO}<br>${layer.feature.properties.Name}` 
            },{sticky: true})
        
    const EG_CTR = L.geoJSON(UnitedKingdom, {style: {color: colorCTR}, filter: function(feature, layer) {
        if(feature.properties.Type == "CTR"){
            return feature.properties.Type;
        }}}).bindTooltip(function (layer) {
            return `${layer.feature.properties.ICAO}<br>${layer.feature.properties.Name}<br>${layer.feature.properties.Lower} - ${layer.feature.properties.Upper}` 
            },{sticky: true})
        
    const EI_FIR = L.geoJSON(Ireland, {style: {color: colorFIR}, filter: function(feature, layer) {
        if(feature.properties.Type == "FIR"){
            return feature.properties.Type;
        }}}).bindTooltip(function (layer) {
            return `${layer.feature.properties.ICAO}<br>${layer.feature.properties.Name}` 
            },{sticky: true})
        
    const BI_FIR = L.geoJSON(Iceland, {style: {color: colorFIR}, filter: function(feature, layer) {
        if(feature.properties.Type == "FIR"){
            return feature.properties.Type;
        }}}).bindTooltip(function (layer) {
            return `${layer.feature.properties.ICAO}<br>${layer.feature.properties.Name}` 
            },{sticky: true})
        
    const EH_FIR = L.geoJSON(Netherlands, {style: {color: colorFIR}, filter: function(feature, layer) {
        if(feature.properties.Type == "FIR"){
            return feature.properties.Type;
        }}}).bindTooltip(function (layer) {
            return `${layer.feature.properties.ICAO}<br>${layer.feature.properties.Name}` 
            },{sticky: true})
        
    const LA_FIR = L.geoJSON(Albania, {style: {color: colorFIR}, filter: function(feature, layer) {
        if(feature.properties.Type == "FIR"){
            return feature.properties.Type;
        }}}).bindTooltip(function (layer) {
            return `${layer.feature.properties.ICAO}<br>${layer.feature.properties.Name}` 
            },{sticky: true})
        
    const groupedOverlays = {
        "Other": {
            "LI - Italy ARO Boundary": LI_FIC,
            "LS - LSAG/LSAZ Boundary": LS_SUBFIR
        },
        "VFR REP": {
            "LD - Croatia": LD_VFR_REPS,
            "LJ - Slovenia": LJ_VFR_REPS
        },
        "CTR": {
            "EB - Belgium & Luxembourg": EB_CTR,
            "EG - United Kingdom (Channel Islands)": EG_CTR,
            "LD - Croatia": LD_CTR
        },
        "TMA": {
            "EB - Belgium & Luxembourg": EB_TMA,
            "LD - Croatia": LD_TMA,
            "LY - Serbia": LY_TMA
        },
        "FIR": {
            "BI - Iceland": BI_FIR,
            "EB - Belgium & Luxembourg": EB_FIR,
            "ED - Germany": ED_FIR,
            "EG - United Kingdom": EG_FIR,
            "EH - Netherlands": EH_FIR,
            "EI - Ireland": EI_FIR,
            "LA - Albania": LA_FIR,
            "LD - Croatia": LD_FIR,
            "LE - Spain": LE_FIR,
            "LF - France": LF_FIR,
            "LI - Italy": LI_FIR,
            "LS - Switzerland": LS_FIR,
            "LY - Serbia & Montenegro": LY_FIR
        }
    }

    L.control.groupedLayers(null, groupedOverlays /* overlays */, {groupCheckboxes: true}).addTo(map);
    
    for(const group of Object.entries(groupedOverlays)){
        const h5 = document.createElement("h5")
        h5.innerText = group[0]
        document.getElementById("defaultLayers").appendChild(h5)
        for(const items of Object.entries(group[1])){
            const checkboxContainer = document.createElement("div")
            checkboxContainer.className="optionsCheckboxContainer"
            document.getElementById("defaultLayers").appendChild(checkboxContainer)
            const checkbox = document.createElement("input")
            checkbox.type = "checkbox"
            let isChecked = JSON.parse(localStorage.getItem(`AIM_Mapping_Tool_Default_Layer_${items[0]}`))
            if(isChecked == "true"){
                checkbox.checked = true
                items[1].addTo(map)
            } else {
                if(items[0] == "LS - LSAG/LSAZ Boundary" && JSON.parse(localStorage.getItem(`AIM_Mapping_Tool_Default_Layer_${items[0]}`)) == null){
                    checkbox.checked = true
                    items[1].addTo(map)
                } else {
                    checkbox.checked = false
                }
            }
            checkbox.name = `${items[0]}`
            checkboxContainer.appendChild(checkbox)
            const label = document.createElement("label")
            label.for = `${items[0]}`
            label.innerText = `${items[0]}`
            checkboxContainer.appendChild(label)
            checkbox.addEventListener("change", function(){
                checkbox.checked ? items[1].addTo(map) : map.removeLayer(items[1])
                localStorage.setItem(`AIM_Mapping_Tool_Default_Layer_${items[0]}`, JSON.stringify(`${checkbox.checked}`))
            })
        }
    }
	
    document.getElementById("clearPopups").addEventListener("click", function(){
        let popupCount = document.querySelectorAll(".leaflet-popup-close-button")
        popupCount.forEach(popup => {
            popup.click()
        })
    })
    
    let markerArray = []; // initialises array for all the markers
    let markLatLong = [] // this is a hacky array needed for the line drawing between markers
    let polyline // initialises varaible for the line between markers
    let decorator
    let polylines = [] // initialises array for all the lines
    let decorators = []
    let latLong = []; // initialises array to hold coordinates of all clicked markers
    let markerDistanceArray = []
    let corners = []
    let total = 0
    let totalArray = []
    let measurelines = []
    let speedTimeSecondsArray = []
    
    function addMarker(ns, ew, title, type, setBounds) { // adds a marker to the map based on the coordinates passed in from the airport query or the calculation results
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
        else if(type =="CUSTOM"){
            marker = new L.marker([ns, ew], {icon: customIcon}) // create a new marker
        } 
        marker.addTo(map) // add it to the map
        marker.bindPopup(new_popup).openPopup();
        marker._popup.setContent(content)
        markerArray.push(marker) // push it to the markerArray array
        if(setBounds == undefined){
            map.setView(marker.getLatLng(), 8); // focus the map on the maker
        }
       /* for(const markerArrayElement of markerArray){
            let corner = [markerArrayElement.getLatLng().lat, markerArrayElement.getLatLng().lng] // defines a corner as the latitude/longitude of indexed marker
            corners.push(corner) // pushes that corner to the corners array
        }
        if (corners.length > 1 && setBounds == undefined) { // if there is more than one corner...
            let bounds = L.latLngBounds([corners]); // define the map boundaries within those corners...
            map.fitBounds(bounds) //... and set the zoom level to include all corners
        } */
        marker.addEventListener("dblclick", function() { //its a bit weird that the event handler for the markers has to be included in the addMarker function but whatever, it doesnt work otherwise
            drawPolyline(marker)
        })
    }
    
    function drawPolyline(marker){
        markerDistanceArray.push(marker)
            let distbetween
            let distbetweenNM
            markLatLong = []
            latLong.push([marker.getLatLng().lat, marker.getLatLng().lng]) // push latitude and longitude of clicked marker to latLong array...
            if (markerDistanceArray.length > 1) { // if there is more than one marker in latLongs...
                let i = markerDistanceArray.length // get the lengts of latLongs (how many markers)...
                markLatLong.push(markerDistanceArray[i-1], markerDistanceArray[i-2]) //...and push the last two markers to the marklatLong array
                let latlng1 = L.latLng(markLatLong[0].getLatLng());
                let latlng2 =  L.latLng(markLatLong[1].getLatLng());
                distbetween = latlng1.distanceTo(latlng2)
                distbetweenNM = (distbetween*0.000539957).toFixed(2) + " NM"
                let j= markerDistanceArray.length
                total = parseFloat((distbetween*0.000539957))
                total = total.toFixed(2)
                totalArray.push(total)
                let reducedTotal = totalArray.reduce((previousValue, currentValue) => { return (parseFloat(previousValue) + parseFloat(currentValue)).toFixed(2) } )
                distanceBar(markLatLong[1]._popup._content, distbetweenNM, markLatLong[0]._popup._content, total, reducedTotal)
                polyline = L.Polyline.Arc([markLatLong[1].getLatLng().lat, markLatLong[1].getLatLng().lng], [markLatLong[0].getLatLng().lat,markLatLong[0].getLatLng().lng],{ // drwas a line between the clicked and the last clicked marker
                    color: 'red',
                    stroke: true,
                    vertices: 200
                }).addTo(map);
               decorator = L.polylineDecorator(polyline, {
    patterns: [
        // defines a pattern of 10px-wide dashes, repeated every 20px on the line
        {offset: 50, repeat: 50, symbol: L.Symbol.arrowHead({pixelSize: 15, pathOptions: {fillOpacity: 1, weight: 0, color: "red"}})}
    ]
}).addTo(map);
                polylines.push(polyline) // adds the polyline object to the polylines array 
                decorators.push(decorator)
            } else {
                markLatLong.push(latLong[0]) // else just push the one thats there
            }
    }

    function distanceBar(dep, dist, dest, total, reducedTotal){
        const splitDep = dep.split("<br>")
        if(dep.includes("Decimal:")){
            dep = splitDep[1].substring(7,splitDep[1].length)
        } else {
            dep = splitDep[0]
        }
        const splitDest = dest.split("<br>")
        if(dest.includes("Decimal:")){
            dest = splitDest[1].substring(7,splitDest[1].length)
        } else {
            dest = splitDest[0]
        }
        let distBar = document.getElementById("mapDistanceBar")
        let distTable = document.getElementById("distTable")
        distBar.style.display = "flex"
        let row = distTable.insertRow(0)
        let fmTD = document.createElement("td")
        row.appendChild(fmTD)
        let distTD = document.createElement("td")
        row.appendChild(distTD)
        let toTD = document.createElement("td")
        row.appendChild(toTD)
        let timeTD = document.createElement("td")
        row.appendChild(timeTD)
        let totalTD = document.createElement("td")
        row.appendChild(totalTD)
        let total1TD = document.createElement("td")
        row.appendChild(total1TD) 
        fmTD.innerText = dep
        distTD.innerText = `${parseFloat(dist).toFixed(2)}NM`
        toTD.innerText = dest
        totalTD.innerText = reducedTotal + "NM"
        document.getElementById("speedInput").addEventListener("keypress", function(e){
            if(e.key == "Enter"){
                e.preventDefault()
                let acftSpeed = parseInt(document.getElementById("speedInput").value)
                if (document.getElementById("speedInput").value != ""){
                    let speedTimeSeconds = speedTimeCalc(total, parseFloat(acftSpeed))
                    speedTimeSecondsArray.push(speedTimeSeconds)
                    let speedTime = secondsToTime(speedTimeSeconds)
                    timeTD.innerText = speedTime
                    let totalSpeedTime = speedTimeSecondsArray.reduce((previousValue, currentValue) => { return parseFloat(previousValue) + parseFloat(currentValue) } )
                    let totalSpeedTimeConverted = secondsToTime(totalSpeedTime)
                    total1TD.innerText = totalSpeedTimeConverted
                } else if(document.getElementById("speedInput").value == ""){
                    timeTD.innerText = ""
                    
                }
            }
        })
        let expanded = false
        document.getElementById("expandMapDistanceBar").addEventListener("click", function(){
            if(!expanded){
                distBar.style.maxHeight = "90vh"
                distBar.style.height = "90vh"
                document.getElementById("expandMapDistanceBar").innerHTML = `<i class="fa-solid fa-chevron-up"></i>`
            }
            if(expanded){
                distBar.style.maxHeight = "8rem"
                distBar.style.height = "auto"
                document.getElementById("expandMapDistanceBar").innerHTML = `<i class="fa-solid fa-chevron-down"></i>`
            }
            expanded = !expanded
        })
    }

    function speedTimeCalc(total, acftSpeed){
        let dist = parseFloat(total)
        let speed = parseFloat(acftSpeed)
        let time = parseFloat((dist/speed).toFixed(6)) // decimal hours
        let totalSeconds = time*3600
        return totalSeconds
    }
    document.getElementById("clearMarker").addEventListener("click", function() {
        clearMarkers()
    })
    
    function secondsToTime(speedTimeSeconds){
        let hours = parseInt((speedTimeSeconds/3600))
        let minutes = parseInt(((speedTimeSeconds/3600)-hours)*60)
        let seconds = parseInt(((((speedTimeSeconds/3600)-hours)*60)-minutes)*60)
        return (`${hours}:${minutes}:${seconds}`)
    }

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
        clearLines()
    })
    
    document.getElementById("clearAll").addEventListener("click", function() {
        clearMarkers()
        clearLines()
        document.getElementById("mapLoci").value = ""
        document.getElementById("mapPlace").value = ""
        document.getElementById("mapNavaid").value = ""
        document.getElementById("mapRep").value = ""
        document.getElementById("mapCoords").value = ""
        document.getElementById("mapBrgDist").value = ""
        document.getElementById("mapAll").value = ""
    })
    
    function clearLines(){
        for (let i = 0; i < polylines.length; i++) { // checks how many lines are on the map
            polylines[i].remove(map) // removes them from the map. not sure which one is doing it exactly so better two than none
            map.removeLayer(polylines[i]);
        }
        for(let i = 0; i < decorators.length; i++) {
            map.removeLayer(decorators[i])
        }
        // these clear various arrays  so it wont display any lines all again after a new click
        polylines = []
        latLong = []
        markLatLong = []
        decorators = []
    }

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
    


    async function renderRoute(navaids, locis, waypoints, otherWords, coordAll, brgDist, e){
        let arr1, arr2, arr3, arr4, arr5, arr6
        if(navaids.length > 0){
            navaids = new Set(navaids)
            navaids = Array.from(navaids)
            navaids = navaids.toString()
            navaids = navaids.replaceAll(",", " ")
            document.getElementById("mapNavaid").value = navaids
            arr1 = await renderNavaid(e)
        }
        if(locis.length > 0){
            locis = new Set(locis)
            locis = Array.from(locis)
            locis = locis.toString()
            locis = locis.replaceAll(",", " ")
            document.getElementById("mapLoci").value = locis
            arr2 = await renderLoci(e)
        }
        if(waypoints.length > 0){
            waypoints = new Set(waypoints)
            waypoints = Array.from(waypoints)
            waypoints = waypoints.toString()
            waypoints = waypoints.replaceAll(",", " ")
            document.getElementById("mapRep").value = waypoints
            arr3 = await renderRep(e)
        }
        if(coordAll.length > 0){
            coordAll = new Set(coordAll)
            coordAll = Array.from(coordAll)
            coordAll = coordAll.toString()
            coordAll = coordAll.replaceAll(",", " ")
            document.getElementById("mapCoords").value = coordAll
            arr4 = await renderCoord(e)
        }
        if(brgDist.length > 0){
            brgDist = new Set(brgDist)
            brgDist = Array.from(brgDist)
            brgDist = brgDist.toString()
            brgDist = brgDist.replaceAll(",", " ")
            document.getElementById("mapBrgDist").value = brgDist
            arr5 = await renderBrgDist(e)
        }
        if(otherWords.length > 0){
            otherWords = new Set(otherWords)
            otherWords = Array.from(otherWords)
            otherWords = otherWords.toString()
            document.getElementById("mapPlace").value = otherWords
            arr6  = await renderPlace(e)
        }
        const arr = [arr1, arr2, arr3, arr4, arr5, arr6].filter(item => {return Array.isArray(item)})
        arr.forEach(array => {
            array.forEach(item => {
                addMarker(item[0], item[1], item[2], item[3])
            })
        })
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
	    document.getElementById("timeOfCircle").innerText = ""
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
    
    
    
    L.control.polylineMeasure(drawLineOptions).addTo(map);
    map.on('polylinemeasure:start', currentLine => {
        setTimeout(function(){
            centerPoint = L.latLng(currentLine.circleCoords[0].lat, currentLine.circleCoords[0].lng)
        }, 100)
    })
    
    const rainViewer = L.control.rainviewer(rainviewerOptions)
    rainViewer.addTo(map);
    
    
    function displayDABSdata(){
        fetch('KOSIF_20211116_02.kml')
                    .then(res => res.text())
                    .then(kmltext => {
                        // Create new kml overlay
                        const parser = new DOMParser();
                        const kml = parser.parseFromString(kmltext, 'text/xml');
                        const track = new L.KML(kml);
                        map.addLayer(track);

                        // Adjust map to show the kml
                        const bounds = track.getBounds();
                        map.fitBounds(bounds);
                    });
    }
	
    countryShapes.features.forEach(feature => {
        const country = L.geoJSON(feature, {style: {color: "#ff0000", opacity: 0, fillOpacity: 0, className: "countryShape"}}).addTo(map);
        country.addEventListener("contextmenu", function(country){
            createContextMenu(country)
        })
    })
        
    const clickEvents = ["click", "contextmenu"]
    let contextVisible = false
    clickEvents.forEach(clickEvent => {
    document.getElementById("mapid").addEventListener(clickEvent, function(e){
        if(e.target.className != "leftContextText" && e.target.className != "leftContextMenu"&& e.target.className != "leftContextList"){
            const mapContainerChildElements = document.getElementById("mapid").children
            for(const mapContainerChildElement of mapContainerChildElements){
                if(mapContainerChildElement.className == "leftContextMenu"){
                    if(contextVisible && clickEvent == "contextmenu"){
                        document.getElementById("mapid").removeChild(mapContainerChildElement)
                        contextVisible = !contextVisible
                    }
                    if(contextVisible && clickEvent == "click"){
                        document.getElementById("mapid").removeChild(mapContainerChildElement)
                    }
                    contextVisible = !contextVisible
                }
            }
        }
    })
    })
    
    map.addEventListener("contextmenu", function(e){
        createContextMenu(e)
    })
    
    function createContextMenu(source){
        const leftClickLat = source.latlng.lat
        const leftClickLng = source.latlng.lng
        const contextMenu = document.createElement("div")
        contextMenu.className = "leftContextMenu"
        contextMenu.style.top = `${source.containerPoint.y}px`
        contextMenu.style.left = `${source.containerPoint.x}px`
        document.getElementById("mapid").appendChild(contextMenu)
        const ul = document.createElement("ul")
        ul.className = "leftContextList"
        contextMenu.appendChild(ul)
        const liDropPin = document.createElement("li")
        liDropPin.className="leftContextText"
        liDropPin.innerHTML = `<i class="fa-solid fa-location-dot"></i> Drop Pin`
        ul.appendChild(liDropPin)
        liDropPin.addEventListener("click", function(){
            addMarker(leftClickLat, leftClickLng, `Custom Marker<br>${leftClickLat.toFixed(6)} ${leftClickLng.toFixed(6)}`, "CUSTOM", false)
        })
        if(source.layer){
            const liAronline = document.createElement("li")
            liAronline.className = "leftContextText"
            liAronline.innerHTML = `<i class="fa-solid fa-up-right-from-square"></i> AROnline Master Page for ${source.layer.feature.properties.ADMIN}`
            ul.appendChild(liAronline)
            liAronline.addEventListener("click", function(){
                countryAronlineLink.forEach(link => {
                    if(link.country.toUpperCase() === source.layer.feature.properties.ADMIN.toUpperCase()){
                        window.open(`https://aronline.skyguide.corp/addressing/${link.icao.toLowerCase()}`)
                    }
                })
            })
        }
    }
    
    console.timeEnd("start onload")
  
})
