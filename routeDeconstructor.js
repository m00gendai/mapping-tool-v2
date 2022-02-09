// TODO: Refactor

export function routeDeconstructor(){
    let mappedAirports = airports.map(getAP)
    function getAP(data){
        return [data.gps_code];
    }

  
    let mappedWaypoints = waypointsICAO.map(getWP)
    function getWP(data){
        return [data.Identification];
    }
    
    let mappedNavaids = navaids.map(getNA)
    function getNA(data){
        return [data.ident];
    }

    
let rte = document.getElementById("mapAll").value.toUpperCase()

console.log("Input string: " + rte)
//spliceRte(rte) NO Idea why this is even here
let foundNavaids = checkNavaids(rte, mappedNavaids)
let foundWaypoints = checkWaypoints(rte, mappedWaypoints)
let foundLocis = checkLocis(rte, mappedAirports)
let foundOther = checkOther(rte, foundNavaids, foundWaypoints, foundLocis, mappedWaypoints)
let foundCoordinates = checkCoordinates(rte)
return [foundNavaids, foundLocis, foundWaypoints, foundOther, foundCoordinates]
//renderRoute(foundNavaids, foundLocis, foundWaypoints, foundOther, foundCoordinates, e )
}

function checkNavaids(rte, mappedNavaids){

let navaidMatch = rte.match(/\b([A-Z]){3}\b/g)
console.log("Navaid Matches: " + navaidMatch)
let navaids = []
if(navaidMatch){

for (let i = 0; i < navaidMatch.length; i++) {
    for(let j= 0; j< mappedNavaids.length;j++){
  if (navaidMatch[i] == mappedNavaids[j]) {
    navaids.push(navaidMatch[i])
  }
}
}
console.log("3 letter navaids: " + navaids) // without IFR/VFR/DCT

}
return navaids
}

function checkLocis(rte, mappedAirports){
let lociMatch = rte.match(/\b([A-Z]){4}([0-9\n]*)\b/g)
console.log("LOCI Matches: " + lociMatch)
let locis = []
if (lociMatch) {

for(let i=0;i<lociMatch.length;i++){
	for(let j=0;j<mappedAirports.length;j++){
			if (lociMatch[i].replace(/[0-9]+/, "") == mappedAirports[j]){
			locis.push(lociMatch[i].replace(/[0-9]+/, ""))
		}
	}
}

  console.log("4 letter LOCIS: " + locis)

}
  return locis
}


function checkWaypoints(rte, mappedWaypoints){
    let waypointArray = []
    mappedWaypoints.forEach(waypoint => {
        waypointArray.push(waypoint[0])
    })
    console.log(waypointArray)
let waypointMatch = rte.match(/\b([A-Z]){5}\b/g)
console.log("Waypoint Matches : " + waypointMatch)
let waypoints = []
if(waypointMatch){
    for (let i = 0; i < waypointMatch.length; i++) {
        if(waypointArray.includes(waypointMatch[i])){
            waypoints.push(waypointMatch[i])
        }
    }


}
console.log("5 letter words: " + waypoints)
return waypoints
}

function checkOther(rte, navaids, waypoints, locis, mappedWaypoints){
let otherMatch = rte.match(/\b([A-Z]){3,}\b/g)
let otherWords = []
let checkArray = []
let checkArray2 = ["VFR", "IFR", "DCT", "STAY", "VOR", "NDB", "DME", "TACAN", "VORTAC", "SID", "STAR", "ILS"]

if(navaids){
    checkArray.push(navaids)
}
if(waypoints){
    checkArray.push(waypoints)
}
if(locis){
    checkArray.push(locis)
}

if(checkArray){
    for(let i=0;i<checkArray.length;i++){
        for(let j=0;j<checkArray[i].length;j++){
            checkArray2.push(checkArray[i][j])
        }
    }
}

if(otherMatch){
for (let i = 0; i < otherMatch.length; i++) {
    if(!checkArray2.includes(otherMatch[i])) {
            otherWords.push(otherMatch[i])
	
  }

}
}

console.log("Other words: " + otherWords)
return otherWords
}


function checkCoordinates(rte){
// coord 1234N01234E
let coordSmall = rte.match(/([0-9]{4}[a-zA-Z]{1}[0-9]{5}[a-zA-Z]{1})/g)

// coord 123456N0123456E
let coordLarge = rte.match(/([0-9]{6}[a-zA-Z]{1}[0-9]{7}[a-zA-Z]{1})/g)

console.log("Coordinate 4 chars: " + coordSmall)
console.log("Coordinate 6 chars: " + coordLarge)

let coordAll = []
if(coordSmall){
for(let i=0;i<coordSmall.length;i++){
	coordAll.push(coordSmall[i])

}
    
}if(coordLarge){
for(let i=0;i<coordLarge.length;i++){
	coordAll.push(coordLarge[i])

}
}
return coordAll
}

