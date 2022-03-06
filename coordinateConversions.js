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

// DEG MIN SEC to DECIMAL Handler
export function degMinSecToDecimal(nsdeg, nsmin, nssec, nsSel, ewdeg, ewmin, ewsec, ewSel){
    let inputArray = []; // initialises array for all values
    inputArray.push(nsdeg, nsmin, nssec, nsSel, ewdeg, ewmin, ewsec, ewSel) // pushes all values into the input array
    // dataValidation(inputArray)
     const calculatedToDec = calcDegToDec(nsdeg, nsmin, nssec, ewdeg, ewmin, ewsec, nsSel, ewSel) // calls the calculation function and passing in all inputs. Return value is an array of coordinates
    document.getElementById("result").innerHTML = "" // resets the result container
    // This is a bit of styling the text alignment and adding leading zeroes and stuff
    if (parseInt(nsdeg) < 10) {
        nsdeg = "0" + parseInt(nsdeg)
    } else {
        nsdeg = parseInt(nsdeg)
    }
    if (parseInt(nsmin) < 10) {
        nsmin = "0" + parseInt(nsmin)
    } else {
        nsmin = parseInt(nsmin)
    }
    if (parseInt(nssec) < 10) {
        nssec = "0" + parseInt(nssec)
    } else {
        nssec = parseInt(nssec)
    }
    if (parseFloat(ewdeg) < 10) {
        ewdeg = "00" + parseFloat(ewdeg)
    }
    if (parseFloat(ewdeg) >= 10 && parseFloat(ewdeg) < 100) {
        ewdeg = "0" + parseFloat(ewdeg)
    }
    if (parseInt(ewmin) < 10) {
        ewmin = "0" + parseInt(ewmin)
    } else {
        ewmin = parseInt(ewmin)
    }
    if (parseInt(ewsec) < 10) {
        ewsec = "0" + parseInt(ewsec)
    } else {
        ewsec = parseInt(ewsec)
    }
    //creates the result input
    document.getElementById("result").innerHTML = `${nsdeg}° ${nsmin}' ${nssec}" = ${calculatedToDec[0]}<br>${ewdeg}° ${ewmin}' ${ewsec}" = ${calculatedToDec[1]}`
    document.getElementById("result").style.padding = "2% 5% 2% 5%"
    return [calculatedToDec[0], calculatedToDec[1]]
}

// DECIMAL to DEG MIN SEC Handler
export function decimalToDegMinSec(nsdec, ewdec, ns2Sel, ew2Sel){
    const calculatedToDec = calcDecToDeg(nsdec, ewdec, ns2Sel, ew2Sel)

        if (parseInt(nsdec) < 10) {
            nsdec = "0" + parseFloat(nsdec)
        }
        if (parseInt(ewdec) < 10) {
            ewdec = "00" + parseFloat(ewdec)
        }
        if (parseInt(ewdec) < 100 && parseInt(ewdec) > 10) {
            ewdec = "0" + parseFloat(ewdec)
        }

        document.getElementById("result1").innerHTML = ""
        let br = document.createElement("br")
        document.getElementById("result1").innerHTML = "\&nbsp;" + nsdec + " = " + calculatedToDec[0];
        document.getElementById("result1").appendChild(br)
        document.getElementById("result1").innerHTML += ewdec + " = " + calculatedToDec[1];
        document.getElementById("result1").style.padding = "2% 5% 2% 5%"
        if (ns2Sel == "S") {
            nsdec = parseFloat("-" + nsdec)
        }
        if (ew2Sel == "W") {
            ewdec = parseFloat("-" + ewdec)
        }
        return [calculatedToDec[0], calculatedToDec[1]]
}

// DEG DECIMAL to DEG MIN SEC Handler
export function degDecimalToDegMinSec(nsdeg, nsmin, ewdeg, ewmin, ns3Sel, ew3Sel){
    const minns = parseInt(nsmin)
    const secns = (nsmin - minns) * 60
    const minew = parseInt(ewmin)
    const secew = (ewmin - minew) * 60
    let calculatedToDec = calcDegToDec(nsdeg, minns, secns.toFixed(0), ewdeg, minew, secew.toFixed(0), ns3Sel, ew3Sel)
    if (ns3Sel == "S") {
        nsdeg = parseFloat(`-${nsdeg}`)
    }
    if (ew3Sel == "W") {
        ewdeg = parseFloat(`-${ewdeg}`)
    }
    document.getElementById("result2").innerHTML = ""
    document.getElementById("result2").innerHTML = `${nsdeg}° ${nsmin}' = ${nsdeg}° ${minns}' ${secns.toFixed(0)}"<br>${ewdeg}° ${ewmin}' = ${ewdeg}° ${minew}' "${secew.toFixed(0)}"`
    document.getElementById("result2").style.padding = "2% 5% 2% 5%"
    return [calculatedToDec[0], calculatedToDec[1]]
}
