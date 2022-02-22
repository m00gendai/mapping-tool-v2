import { convertRepCoordinates, calcDegToDec } from "/coordinateConversions.js"

import LatLon, { Dms } from 'https://cdn.jsdelivr.net/npm/geodesy@2/latlon-ellipsoidal-vincenty.js'


// Q U E R Y   A I R P O R T   L O C I S

    export function placeLoci(){
        const lociField = document.getElementById("mapLoci").value
        if(lociField == ""){
            return // does nothing if input field is empty
        }
        const newAirports = airports.map(data => {return [
            data.codeId, 
            data.geoLat.charAt(data.geoLat.length-1) == "N" ? data.geoLat.substring(0, data.geoLat.length-1) : `-${data.geoLat.substring(0, data.geoLat.length-1)}`,  
            data.geoLong.charAt(data.geoLong.length-1) == "E" ? data.geoLong.substring(0, data.geoLong.length-1) : `-${data.geoLong.substring(0, data.geoLong.length-1)}`,
            data.txtName]}) 
        const newAirportCodes = newAirports.map(code => {return code[0]}) // makes a one dimensional array just with airport codes
        if (!lociField.includes(" ")) { // checks if a single airport is searched
            if(!newAirportCodes.includes(lociField.toUpperCase())){ // checks if the single airport is in the airport code array
                alert(`Airport ${lociField.toUpperCase()} not found`) // if yes, alert and return
                return
            }
            for(const airport of newAirports){ // for every airport data array in the multi dimensional airport data array...
                if(lociField.toUpperCase() == airport[0]){ //... check if the single airport equals the airport code of the airport data array
                    return [airport[1], airport[2], `${airport[0]}<br>${airport[3]}`]
                  //  addMarker(airport[2], airport[1], `${airport[0]}<br>${airport[3]}`) // if yes, place a marker
                }
            }
        } else { // checks if  multiple airports are searched, separated by space
            let multiLocis = []
            const multiPorts = lociField.toUpperCase().split(" ") // splits the input separated by space and makes an array
            multiPorts.forEach(multiPort => { // for every searched loci...
                for(const airport of newAirports){ // ...and for every airport array of the multi dimensional airport data array...
                    if(multiPort.toUpperCase() == airport[0].toUpperCase()){ // if the searched loci equals the airport code of the airport data array...
                        multiLocis.push([airport[1], airport[2], `${airport[0]}<br>${airport[3]}`])
                        //addMarker(airport[2], airport[1], `${airport[0]}<br>${airport[3]}`) // ... place a marker for each airport
                    } 
                }
            })
            const unknownAirports = multiPorts.filter(airport => { return newAirportCodes.indexOf(airport) == -1; }) // filters the searched locis array for items not present in the airport codes array...
            if(unknownAirports.length > 0){
                alert(`Airports ${unknownAirports.join(" ")} not found`) //... and alerts each one
            }
            return multiLocis
        }
    }
    
// Q U E R Y   P L A C E S

    export function placePlace(){
        let query
        let multiPlaces = []
        let unknownPlaces = []
        const placeField = document.getElementById("mapPlace").value;
        if(placeField == ""){
            return
        }
        const centerOfSwitzerland = new google.maps.LatLng(46.8011, 8.2265);
        const map = new google.maps.Map(
        document.getElementById('map'), {center: centerOfSwitzerland, zoom: 15});
        if(!placeField.includes(",")){
            query = [placeField]
        } else {
            query = placeField.split(",")
        }
        query.forEach(search => {
            let request = {
                query: search,
                fields: ['name', 'geometry'],
                locationBias: {lat: 46.8011, lng: 8.2265}
            }
            let service = new google.maps.places.PlacesService(map);
            service.findPlaceFromQuery(request, function(results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    for(const result of results){
                        multiPlaces.push([result.geometry.location.lat(),result.geometry.location.lng(), result.name])
                    }
                } else {
                    unknownPlaces.push([result.name])
                }
            })
        })
        if(unknownPlaces.length > 0){
            alert(`Places ${unknownPlaces.join(" ")} not found`)
        }
        return multiPlaces
    }
            
// Q U E R Y   N A V A I D   I D E N T S

    export function placeNavaid(){
        const navaidField = document.getElementById("mapNavaid").value;
        if(navaidField == ""){
            return
        }
        const newNavaids = navaids.map(data => {return [
            data.codeId, 
            data.geoLat.charAt(data.geoLat.length-1) == "N" ? data.geoLat.substring(0, data.geoLat.length-1) : `-${data.geoLat.substring(0, data.geoLat.length-1)}`,  
            data.geoLong.charAt(data.geoLong.length-1) == "E" ? data.geoLong.substring(0, data.geoLong.length-1) : `-${data.geoLong.substring(0, data.geoLong.length-1)}`,
            data.txtName ? data.txtName : "",
            data.codeType ? data.codeType : "DME or TACAN"]})
        const newNavaidCodes = newNavaids.map(code => {return code[0]})
        if (!navaidField.includes(" ")) {
            let sameIdent = []
            if(!newNavaidCodes.includes(navaidField.toUpperCase())){
                alert(`Navaid ${navaidField.toUpperCase()} not found`)
                return
            }
            for(const navaid of newNavaids){
                if(navaidField.toUpperCase() == navaid[0]){
                    sameIdent.push([navaid[1], navaid[2], `${navaid[0]} ${navaid[4]}<br>${navaid[3]}`])
                }
            }
            return sameIdent
        } else {
            let multiNavs = []
            const multiAids = navaidField.toUpperCase().split(" ")
            multiAids.forEach(multiAid => {
                for(const navaid of newNavaids){
                    if(multiAid.toUpperCase() == navaid[0].toUpperCase()){
                        multiNavs.push([navaid[1], navaid[2], `${navaid[0]} ${navaid[4]}<br>${navaid[3]}`])
                    }
                }
            })
            const unknownNavaids = multiAids.filter(navaid => { return newNavaidCodes.indexOf(navaid) == -1 })
            if(unknownNavaids.length > 0){
                alert(`Navaids ${unknownNavaids.join(" ")} not found`)
            }
            return multiNavs
        }
    }
    
// Q U E R Y   R E P O R T I N G   P O I N T   C O D E S

    export function placeRep(){
        const repField = document.getElementById("mapRep").value;
        if(repField == ""){
            return
        }
        const newReps = waypoints.map(data => {return [
            data.codeId, 
            data.geoLat.charAt(data.geoLat.length-1) == "N" ? data.geoLat.substring(0, data.geoLat.length-1) : `-${data.geoLat.substring(0, data.geoLat.length-1)}`,  
            data.geoLong.charAt(data.geoLong.length-1) == "E" ? data.geoLong.substring(0, data.geoLong.length-1) : `-${data.geoLong.substring(0, data.geoLong.length-1)}`,
            data.txtName]})
        const newRepCodes = newReps.map(code => {return code[0]})
        if (!repField.includes(" ")) {
            if(!newRepCodes.includes(repField.toUpperCase())){
                alert(`Reporting Point ${repField.toUpperCase()} not found`)
                return
            }
            for(const rep of newReps){
                if(repField.toUpperCase() == rep[0]){
                    return [rep[1], rep[2], rep[0]]
                    // addMarker(convertedRepCoordinates[0], convertedRepCoordinates[1], rep[0])
                }
            }
        } else {
            let multiWays = []
            const multiReps = repField.toUpperCase().split(" ")
            multiReps.forEach(multiRep => {
                for(const rep of newReps){
                    if(multiRep.toUpperCase() == rep[0].toUpperCase()){
                        multiWays.push([rep[1], rep[2], rep[0]])
                        // addMarker(convertedRepCoordinates[0], convertedRepCoordinates[1], rep[0])
                    }
                }
            })
            const unknownReps = multiReps.filter(rep => { return newRepCodes.indexOf(rep) == -1 })
            if(unknownReps.length > 0){ 
                alert(`Reporting Points ${unknownReps.join(" ")} not found`)
            }
            return multiWays
        }
    }
    
// Q U E R Y   C O O R D I N A T E S

    export function placeCoords(){
        const coordinatesValue = document.getElementById("mapCoords").value
        if(coordinatesValue == ""){
            return
        }
        const coordsArray = coordinatesValue.split(/\s+/g) // s+ is one or more whitespace characters
        let zeroZeroCoords = [] // initialises normalized array of string coordinates (normalized to 6 and 7 characters)
        coordsArray.forEach(coordinate => {
            if(coordinate.match("([0-9]{4}[a-zA-Z]{1}[0-9]{5}[a-zA-Z]{1})")){ // checks for deg min coords only, format 4715N00725E
                const coordinateNortSouth = `${coordinate.substring(0,4)}00${coordinate.substring(4,5).toUpperCase()}`
                const coordinateEastWest = `${coordinate.substring(5,10)}00${coordinate.substring(10).toUpperCase()}`
                zeroZeroCoords.push([coordinateNortSouth, coordinateEastWest])
            } else if(coordinate.match("([0-9]{6}[a-zA-Z]{1}[0-9]{7}[a-zA-Z]{1})")){ // checks for deg min coords only, format 471501N0072502E
                const coordinateNortSouth = `${coordinate.substring(0,6)}${coordinate.substring(6,7).toUpperCase()}`
                const coordinateEastWest = `${coordinate.substring(7,14)}${coordinate.substring(14).toUpperCase()}`
                zeroZeroCoords.push([coordinateNortSouth, coordinateEastWest])
            }
        })
        let decimalArray = []
        zeroZeroCoords.forEach(coordinate => {
            const nsdeg = coordinate[0].substring(0,2)
            const nsmin = coordinate[0].substring(2,4)
            const nssec = coordinate[0].substring(4,6)
            const ewdeg = coordinate[1].substring(0,3)
            const ewmin = coordinate[1].substring(3,5)
            const ewsec = coordinate[1].substring(5,7)
            const nsSel = coordinate[0].substring(6)
            const ewSel = coordinate[1].substring(7)
            decimalArray.push(calcDegToDec(nsdeg, nsmin, nssec, ewdeg, ewmin, ewsec, nsSel, ewSel))
        })
        let returnCoordinates = []
        decimalArray.forEach((decimalCoordinate, index) => {
            returnCoordinates.push([decimalCoordinate[0], decimalCoordinate[1], `Decimal: ${decimalCoordinate[0]} ${decimalCoordinate[1]}<br> WGS84: ${zeroZeroCoords[index].join(" ")}`])
            // addMarker(decimalCoordinate[0], decimalCoordinate[1], `Decimal: ${decimalCoordinate[0]} ${decimalCoordinate[1]}<br> WGS84: ${zeroZeroCoords[index].join(" ")}`)
        })
        return returnCoordinates
    }

    // Q U E R Y   B E A R I N G   D I S T A N C E   F R O M   P L A C E
    
    export function placeBrgDist(){ //TODO: Find a way to convert 360° azimuth to 180/-180 bearing
        const BrgDistValue = document.getElementById("mapBrgDist").value
        if(BrgDistValue == ""){
            return
        }
        const mappedNavaidsLatLng = navaids.map(data => {return [
            data.codeId, 
            data.geoLat.charAt(data.geoLat.length-1) == "N" ? data.geoLat.substring(0, data.geoLat.length-1) : `-${data.geoLat.substring(0, data.geoLat.length-1)}`,  
            data.geoLong.charAt(data.geoLong.length-1) == "E" ? data.geoLong.substring(0, data.geoLong.length-1) : `-${data.geoLong.substring(0, data.geoLong.length-1)}`,
            data.txtName]})
        const mappedWaypointsLatLng = waypoints.map(data => {return [
            data.codeId, 
            data.geoLat.charAt(data.geoLat.length-1) == "N" ? data.geoLat.substring(0, data.geoLat.length-1) : `-${data.geoLat.substring(0, data.geoLat.length-1)}`,  
            data.geoLong.charAt(data.geoLong.length-1) == "E" ? data.geoLong.substring(0, data.geoLong.length-1) : `-${data.geoLong.substring(0, data.geoLong.length-1)}`,
            data.txtName]})
        const brgDistArray = BrgDistValue.split(/\s+/g) // s+ is one or more whitespace characters
        let newMarkerArray = []
        brgDistArray.forEach(brgDist => {
            if(brgDist.match(/\b([a-zA-Z]){3}[0-9]{3}[0-9]{3}\b/g)){ 
                const navaid = brgDist.substring(0,3).toUpperCase()
                const bearing = parseInt(brgDist.substring(3,6))
                const distanceNM = parseInt(brgDist.substring(6,9))
                const distanceM = (distanceNM*1.852)*1000
                for(const mappedNavaid of mappedNavaidsLatLng){
                    if(mappedNavaid[0] == navaid){
                        const p1 = new LatLon(mappedNavaid[1], mappedNavaid[2])
                        const p2 = p1.destinationPoint(distanceM, bearing)
                        newMarkerArray.push([`${navaid}${brgDist.substring(3,6)}${brgDist.substring(6,9)}`, p2._lat, p2._lon])
                    }
                }
            }
            if(brgDist.match(/\b([a-zA-Z]){5}[0-9]{3}[0-9]{3}\b/g)){ 
                const waypoint = brgDist.substring(0,5).toUpperCase()
                const bearing = parseInt(brgDist.substring(5,8))
                const distanceNM = parseInt(brgDist.substring(8,11))
                const distanceM = (distanceNM*1.852)*1000
                for(const mappedWaypoint of mappedWaypointsLatLng){
                    if(mappedWaypoint[0] == waypoint){
                        const p1 = new LatLon(mappedWaypoint[1], mappedWaypoint[2])
                        const p2 = p1.destinationPoint(distanceM, bearing)
                        newMarkerArray.push([`${waypoint}${brgDist.substring(5,8)}${brgDist.substring(8,11)}`, p2._lat, p2._lon])
                    }
                }
            }
        })
        return newMarkerArray
    }
