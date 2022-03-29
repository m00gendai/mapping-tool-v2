export function convertRepCoordinates(latitude, longitude){
    const nsdeg = latitude.substring(0,2)
    const nsmin = latitude.substring(2,4)
    const nssec = latitude.substring(4,6)
    const ewdeg = longitude.substring(0,3)
    const ewmin = longitude.substring(3,5)
    const ewsec = longitude.substring(5,7)
    const nsSel = latitude.substring(6)
    const ewSel = longitude.substring(7)
    return calcDegToDec(nsdeg, nsmin, nssec, ewdeg, ewmin, ewsec, nsSel, ewSel)
}

// function to convert DEG MIN SEC to DECIMAL
export function calcDegToDec(nsdeg, nsmin, nssec, ewdeg, ewmin, ewsec, nsSel, ewSel) {
    let degArray = []; // initialises coordinate array to be returned
    if(nsdeg == undefined){
        return
    }
    let nsdegToDec // initialises variable for the complete decimal value
    const nsminDiv = nsmin / 60 // gets decimal number for N or S minutes
    const nssecDiv = nssec / 3600 // gets decimal number for N or S seconds
    if (nsSel == "N") {
        nsdegToDec = parseFloat(nsdeg)+nsminDiv+nssecDiv
    } 
    if (nsSel == "S") {
        nsdegToDec = parseFloat(`-${parseFloat(nsdeg) + nsminDiv + nssecDiv}`)
    }
    let ewdegToDec // same as nsdegToDec
    const ewminDiv = ewmin / 60
    const ewsecDiv = ewsec / 3600
    if (ewSel == "E") {
        ewdegToDec = parseFloat(ewdeg) + ewminDiv + ewsecDiv
    } 
    if (ewSel == "W") {
        ewdegToDec = parseFloat(`-${parseFloat(ewdeg) + ewminDiv + ewsecDiv}`)
    }
    degArray.push(nsdegToDec.toFixed(4)); // push N or S coordinate to array with four decimal points
    degArray.push(ewdegToDec.toFixed(4)); // push E or W coordinate to array with four decimal points
    console.log(degArray)
    return degArray // returns array of coordinates
}

// function to convert DECIMAL to DEG MIN SEC
    export function calcDecToDeg(nsdec, ewdec, ns2Sel, ew2Sel) {
        let decArray = []; // initialises coordinate array to be returned
        let nsdecDiv = Math.floor(nsdec) // gets degrees by ignoring decimal points of the input value
        const nsminDiv = Math.floor((60 * (nsdec - nsdecDiv))) // gets minutes by subtracting input value by floored degrees and multiplying by 60
        const nssecDiv = Math.ceil(60 * ((60 * (nsdec - nsdecDiv)) - nsminDiv))
        /*
        Okay, to get seconds, you do:
        1. substract floored degrees from input value 
        2. multiply that by 60
        3. substract floored minutes from that
        4. and multiply THAT by 60
        5. round it up to the nearest integer
        */
        if (ns2Sel == "S") { // this again checks if its a positive (N) or negative (S) decimal
            nsdecDiv = parseInt(`-${nsdecDiv}`)
        }
        const nsdegToMinDec = `${nsdecDiv}° ${nsminDiv}' ${nssecDiv}"` // assembles the DEG MIN SEC coordinate string
        decArray.push(nsdegToMinDec) // push N or S coordinate to array
        let ewdecDiv = Math.floor(ewdec)
        const ewminDiv = Math.floor((60 * (ewdec - ewdecDiv)))
        const ewsecDiv = Math.ceil(60 * ((60 * (ewdec - ewdecDiv)) - ewminDiv))
        if (ew2Sel == "W") {
            ewdecDiv = parseInt(`-${ewdecDiv}`)
        }
        const ewdegToMinDec = `${ewdecDiv}° ${ewminDiv}' ${ewsecDiv}"`
        decArray.push(ewdegToMinDec) // push E or W coordinate to array
        return decArray // return array
    }
    
    
export function placeholderFill(){
    const unit = document.getElementById("coordinateConversion_Input_Select").value
	let placeholder
	if(document.getElementById("coordinateConversion_Input_Select").value == "decimal"){
		placeholder = "47.1234,7.1234 48.5678,8.5678"
	}
	if(document.getElementById("coordinateConversion_Input_Select").value == "degMin"){
		placeholder = "4713N00713E 4857N00757E"
	}
	if(document.getElementById("coordinateConversion_Input_Select").value == "degMinSec"){
		placeholder = "471234N0071234E 485612N0075612E"
	}
	if(document.getElementById("coordinateConversion_Input_Select").value == "swissgrid"){
		placeholder = "2600000,1200000 2500000,1100000"
	}
	document.getElementById("coordinateConversion_Input").placeholder = placeholder
}

const convertedCoordinatesMarkerArray = []

export async function convertCoordinates(){
    convertedCoordinatesMarkerArray.length = 0
    	document.getElementById("coordinateConversion_Decimal").value = ""
	document.getElementById("coordinateConversion_WGS_DegMin").value = ""
	document.getElementById("coordinateConversion_WGS_DegMinSec").value = ""
	document.getElementById("coordinateConversion_Swissgrid").value = ""
	const input = document.getElementById("coordinateConversion_Input").value
	const unit = document.getElementById("coordinateConversion_Input_Select").value
	if(unit == "degMin"){
		const getCoords = document.getElementById("coordinateConversion_Input").value.split(" ")
		for(const coord of getCoords){
			const matches = coord.match(/[0-9]{4}[nNsS][0-9]{5}[eEwW]/)
			if(!matches){
				alert("Check either Unit or format")
				return
			}
			const northSouthDeg = coord.substring(0,2)
			const northSouthMin = coord.substring(2,4)
			const northSouthSelect = coord.charAt(4).toUpperCase()
			let northSouth 
			northSouthSelect == "N" ? northSouth = `${parseFloat(northSouthDeg) + parseFloat(northSouthMin/60)}` : northSouth = `-${parseFloat(northSouthDeg) + parseFloat(northSouthMin/60)}`
			const eastWestDeg = coord.substring(5,8)
			const eastWestMin = coord.substring(8,10)
			const eastWestSelect = coord.charAt(10).toUpperCase()
			let eastWest
			eastWestSelect == "E" ? eastWest = `${parseFloat(eastWestDeg) + parseFloat(eastWestMin/60)}` : eastWest = `-${parseFloat(eastWestDeg) + parseFloat(eastWestMin/60)}`
			
			const ret = {
				northing: northSouth,
				easting: eastWest
			}
			fillFromDecimal(ret)
		}		
	}
	if(unit == "degMinSec"){
		const getCoords = document.getElementById("coordinateConversion_Input").value.split(" ")
		for(const coord of getCoords){
			const matches = coord.match(/[0-9]{6}[nNsS][0-9]{7}[eEwW]/)
			if(!matches){
				alert("Check either Unit or format")
				return
			}
			const northSouthDeg = coord.substring(0,2)
			const northSouthMin = coord.substring(2,4)
			const northSouthSec = coord.substring(4,6)
			const northSouthSelect = coord.charAt(6).toUpperCase()
			let northSouth 
			northSouthSelect == "N" ? northSouth = `${parseFloat(northSouthDeg) + parseFloat(northSouthMin/60) + parseFloat(northSouthSec/3600)}` : northSouth = `-${parseFloat(northSouthDeg) + parseFloat(northSouthMin/60) + parseFloat(northSouthSec/3600)}`
			const eastWestDeg = coord.substring(7,10)
			const eastWestMin = coord.substring(10,12)
			const eastWestSec = coord.substring(12,14)
			const eastWestSelect = coord.charAt(14).toUpperCase()
			let eastWest
			eastWestSelect == "E" ? eastWest = `${parseFloat(eastWestDeg) + parseFloat(eastWestMin/60) + parseFloat(eastWestSec/3600)}` : eastWest = `-${parseFloat(eastWestDeg) + parseFloat(eastWestMin/60) + parseFloat(eastWestSec/3600)}`
			
			const ret = {
				northing: northSouth,
				easting: eastWest
			}
			fillFromDecimal(ret)
		}		
	}
	if(unit == "decimal"){
		const getCoords = document.getElementById("coordinateConversion_Input").value.split(" ")
		const returned = []
		for(const coord of getCoords){
			const matches = coord.match(/^[-]?[0-9]{1,3}\.?[0-9]*,[-]?[0-9]{1,3}\.?[0-9]*$/)
			if(!matches){
				alert("Check either Unit or format")
				return
			}
			const getCoords = coord.split(",")
			const ret = {
				easting: getCoords[1],
				northing: getCoords[0]
			}
			returned.push(ret)
		}
		for (const ret of returned){
			fillFromDecimal(ret)
		}
	}
	if(unit == "swissgrid"){
		const getCoords = document.getElementById("coordinateConversion_Input").value.split(" ")
		const returned = []
		for(const coord of getCoords){
			const matches = coord.match(/^[0-9]{7}[.]*[0-9]*,[0-9]{7}[.]*[0-9]*$/)
			if(!matches){
				alert("Check either Unit or format")
				return
			}
			const sendCoords = coord.split(",")
			const conversion = await fetch(`https://geodesy.geo.admin.ch/reframe/lv95towgs84?easting=${sendCoords[0]}&northing=${sendCoords[1]}&format=json`).then(result => result.json())
			returned.push(conversion)
		}
		for(const ret of returned){
			await fillFromDecimal(ret)
		}
	}
}



async function fillFromDecimal(ret){
	document.getElementById("coordinateConversion_Decimal").value += `${ret.northing},${ret.easting}\n`
	document.getElementById("coordinateConversion_WGS_DegMinSec").value += toDegMinSec(ret)
	document.getElementById("coordinateConversion_WGS_DegMin").value += toDegMin(ret)
	await toSwissgrid(ret)
	convertedCoordinatesMarkerArray.push([ret.easting, ret.northing])
}

function toDegMinSec(ret){
	const northSouth = Math.abs(ret.northing)
	let northSouthDeg = parseInt(northSouth)
	let northSouthMin = parseInt((northSouth-northSouthDeg)*60)
	let northSouthSec = Math.round((((northSouth-northSouthDeg)*60)-northSouthMin)*60)
	Math.abs(northSouthDeg) < 10 ? northSouthDeg = `0${northSouthDeg}` : northSouthDeg = northSouthDeg
	northSouthMin < 10 ? northSouthMin = `0${northSouthMin}` : northSouthMin = northSouthMin
	northSouthSec < 10 ? northSouthSec = `0${northSouthSec}` : northSouthSec = northSouthSec
	let wgsNorthSouth
	ret.northing > 0.0 ? wgsNorthSouth = `${northSouthDeg}${northSouthMin}${northSouthSec}N` : wgsNorthSouth = `${northSouthDeg}${northSouthMin}${northSouthSec}S`
	const eastWest = Math.abs(ret.easting)
	let eastWestDeg = parseInt(eastWest)
	let eastWestMin = parseInt((eastWest-eastWestDeg)*60)
	let eastWestSec = Math.round((((eastWest-eastWestDeg)*60)-eastWestMin)*60)
	Math.abs(eastWestDeg) < 10 ? eastWestDeg = `00${eastWestDeg}` : eastWestDeg = eastWestDeg
	Math.abs(eastWestDeg) > 10 && Math.abs(eastWestDeg) < 100 ? eastWestDeg = `0${eastWestDeg}` : eastWestDeg = eastWestDeg
	eastWestMin < 10 ? eastWestMin = `0${eastWestMin}` : eastWestMin = eastWestMin
	eastWestSec < 10 ? eastWestSec = `0${eastWestSec}` : eastWestSec = eastWestSec
	let wgsEastWest
	ret.easting > 0.0 ? wgsEastWest = `${eastWestDeg}${eastWestMin}${eastWestSec}E` : wgsEastWest = `${eastWestDeg}${eastWestMin}${eastWestSec}W`
	return `${wgsNorthSouth}${wgsEastWest}\n`
}

function toDegMin(ret){
	const northSouth = Math.abs(ret.northing)
	let northSouthDeg = parseInt(northSouth)
	let northSouthMin = Math.round((northSouth-northSouthDeg)*60)
	Math.abs(northSouthDeg) < 10 ? northSouthDeg = `0${northSouthDeg}` : northSouthDeg = northSouthDeg
	northSouthMin < 10 ? northSouthMin = `0${northSouthMin}` : northSouthMin = northSouthMin
	let wgsNorthSouth
	ret.northing > 0.0 ? wgsNorthSouth = `${northSouthDeg}${northSouthMin}N` : wgsNorthSouth = `${northSouthDeg}${northSouthMin}S`
	const eastWest = Math.abs(ret.easting)
	let eastWestDeg = parseInt(eastWest)
	let eastWestMin = Math.round((eastWest-eastWestDeg)*60)
	Math.abs(eastWestDeg) < 10 ? eastWestDeg = `00${eastWestDeg}` : eastWestDeg = eastWestDeg
	Math.abs(eastWestDeg) > 10 && Math.abs(eastWestDeg) < 100 ? eastWestDeg = `0${eastWestDeg}` : eastWestDeg = eastWestDeg
	eastWestMin < 10 ? eastWestMin = `0${eastWestMin}` : eastWestMin = eastWestMin
	let wgsEastWest
	ret.easting > 0.0 ? wgsEastWest = `${eastWestDeg}${eastWestMin}E` : wgsEastWest = `${eastWestDeg}${eastWestMin}W`
	return `${wgsNorthSouth}${wgsEastWest}\n`
}

async function toSwissgrid(ret){
console.log(ret)
	const conversion = await fetch(`https://geodesy.geo.admin.ch/reframe/wgs84tolv95?easting=${ret.easting}&northing=${ret.northing}&format=json`).then(response => response.json())
	console.log(`${Math.round(conversion.easting)} ${Math.round(conversion.northing)}`)
	document.getElementById("coordinateConversion_Swissgrid").value += `${Math.round(conversion.easting)} ${Math.round(conversion.northing)}\n`
}

export function plotConvertedCoordinates(){
    return convertedCoordinatesMarkerArray
}

export function convertHeight(){
    const input = document.getElementById("heightConversion_Input").value
	const unit = document.getElementById("heightConversion_Input_Select").value
	if(unit == "meter"){
		fillFromMeter(parseFloat(input))
	}
	if(unit == "feet"){
		fillFromMeter(parseFloat(input)/3.2808)
	}
	if(unit == "statuteMile"){
		fillFromMeter(parseFloat(input)/0.00062137)
	}
	if(unit == "nauticalMile"){
		fillFromMeter(parseFloat(input)*1852)
	}
	if(unit == "kilometer"){
		fillFromMeter(parseFloat(input)*1000)
	}
}

function fillFromMeter(input){
	document.getElementById("heightConversion_Meter").value = input
	document.getElementById("heightConversion_Feet").value = input*3.2808
	document.getElementById("heightConversion_StatuteMile").value = input*0.00062137
	document.getElementById("heightConversion_NauticalMile").value = input/1852
	document.getElementById("heightConversion_Kilometer").value = input/1000
}

export function convertSpeed(){
    const input = document.getElementById("speedConversion_Input").value
	const unit = document.getElementById("speedConversion_Input_Select").value
	if(unit == "kmh"){
		fillFromMs(parseFloat(input)/3.6)
	}
	if(unit == "mph"){
		fillFromMs(parseFloat(input)/2.237)
	}
	if(unit == "ms"){
		fillFromMs(parseFloat(input))
	}
	if(unit == "knots"){
		fillFromMs(parseFloat(input)/1.944)
	}
	if(unit == "mach"){
		fillFromMs(parseFloat(input)*343)
	}
}

function fillFromMs(input){
	document.getElementById("speedConversion_ms").value = input
	document.getElementById("speedConversion_kmh").value = input*3.6
	document.getElementById("speedConversion_mph").value = input*2.237
	document.getElementById("speedConversion_knots").value = input*1.944
	document.getElementById("speedConversion_mach").value = input/343
}
