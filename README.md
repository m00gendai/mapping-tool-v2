# README #

AIM Mapping Tool is an open source application developed as a supplementary tool for AIM Services Switzerland, specifically to aid in plotting VFR flight plan routes.
Although it features official Swiss federal map and Eurocontrol data, it is not an official application and thus shall not be used for navigational purposes.

## Overview ##

The AIM Mapping Tool is comprised of a toolbar to the left and a map view to the right.

### Toolbar Features ###

#### Search on Map ####
* ICAO Location Indicators (worldwide)
	* Single or multiple (space separated)
	* Case insensitive
	* Returns ICAO Location Indicator and Airport Name on map
* ICAO Waypoint/Reporting Point Indicators (worldwide)
	* Single or multiple (space separated)
	* Case insensitive
	* Returns ICAO Waypoint/Reporting Point Ident on map
* ICAO Navigation Aids (worldwide)
	* VOR, VOR/DME, DME, TACAN, VORTAC, NDB
	* Single or multiple (space separated)
	* Case insensitive
	* Returns ICAO Navigation Aid Ident, Type, Name and ISO 3166-1 alpha-2 country code on map
* Geographical locations (worldwide)
	* Via google Maps JavaScript API
	* Single or multiple (space separated)
	* Case insensitive
	* Returns location name on map
* WGS84 Coordinates
	* Format {nnnn}N|S{nnnnn}E|W or {nnnnnn}N|S{nnnnnnn}E|W
	* Single
	* Single or multiple (space separated)
	* Case insensitive
	* Agnostic to other input
	* Returns Decimal and WGS84 coordinate format on map
* Bearing/Distance from Navigation Aid or Waypoint/Reporting Point
	* Format {NAV}{BRG}{DST} or {WAYPT}{BRG}{DST}
	* Single or multiple (space separated)
	* Case insensitive
	* Agnostic to other input
	* Returns ICAO Navigation Aid or Waypoint/Reporting Point Ident, Bearing in Degrees (0-360) and Distance in Nautical Miles on map
* Query all fields at once
	* Auto detects what category input elements are and processes, queries and plots them accordingly

#### Coordinate conversion ####
* WGS84 conversion from Deg/Min/Sec to Decimal Degrees
* WGS84 conversion from Decimal Degrees to Deg/Min/Sec
* WGS84 conversion from Degrees Decimal Minutes to Deg/Min/Sec

#### Map Styles ####
* Maptiler Basic
* Maptiler Satellite Hybrid
* OpenStreetMap Base
* Maptiler swisstopo LBM Vivid
* ArcGIS ESRI National Geographic
* ArcGIS ESRI NASA Satellite

#### Plot Circle ####

#### About ####
* General Information
* Coordinate Precision
* Base Map Data Source
* Overlay Data Source
* POI Data Source
* Attributions
* Legal

### Map View Features ###

#### Top Left ####
* Zoom
* Plot Measurement Line
* Clear Measurement Line

#### Top Right ####

* Toggle Airspace Layers
	* LSAS FIR and SubFIR boundary (displayed by default)
	* LDZO TMA
	* EBBU & ELLX FIR, TMA and CTR
	* LIMM/LIRR/LIBB FIR
	* LYBA FIR, TMA and CTR

#### Bottom Left ####
* RainViewer

#### Bottom Block ####
* Clear markers
* Toggle marker popups
* Clear marker connection lines
* Hill Shading Layer
* swisstopo VFR ICAO Map 1:500000 Switzerland
* Swiss Restricted Airspaces for Drones
* Focus Switzerland Boundary Points
* Focus Europe Boundary Points
* Focus World Boundary Points

### General Features ###

#### Markers & Lines ####
* Distinct markers for queried location data type
* Drawable lines between markers

#### Current curser position coordinates in decimal and WGS84 degrees  ####

## Known limitations ##

#### Places ####
Subject to google Maps JavaScript API

#### Airspace shapes ####
* Dependent on data delivery (if and how)
* Tooltips do not display ICAO 4-letter-code of Airspace, only Airspace name (this is due to data delivery)

#### Navaid search ####
If multiple Navaids with the same Ident exist, the tool plots them all as it cannot detect from context which would be the correct one to plot

#### Waypoint search ####
* LFN Waypoints not yet covered
* There are guards in place for geographical location names with five letters. A five letter word is checked against the waypoint database and a database of known location/waypoint name hybrids. In case of a location/waypoint hybrid (example: EVIAN - Waypoint in Japan and village in France), precedence is given to the waypoint, with an alert notifying a possible location with the same name (i.e., the waypoint EVIAN in Japan gets plotted, and an alert notifies you about a location with the same name)

#### Query all #### 
Special characters like umlauts, accented vocals etc are first deburred to Latin-1 for the deconstructor function to work. This can lead to erroneous plots in edge cases.

#### General ####
* VFR Reporting Points are not supported
* Airport/VFR Reporting Point combinations are not detected
* Application is intended for fullscreen use, responsive design is not a requirement. While it is planned to be implemented, it has a very low priority.
	
## Known Bugs ##

Character encoding issues (umlauts etc - UTF-8 is not applied everyhwere)

## Planned Features ##

See [Trello](https://trello.com/b/yzfLBL7h/aim-mapping-tool)

## Setup ##

* Uses module scripts, so must be served by a webserver. A simple Python http server suffices for localhost testing.
* Uses the google Maps JavaScript API which is restricted, so you need to provide your own API key in googleAPIs.js
* Uses the maptiler API which is restricted, so you need to provide your own API key in googleAPIs.js
* Uses Font Awesome 6 Kit which is restricted, so you need to provide your own Font Awesome 6 Kit script link in index.html

### Dependencies ###

* [leaflet](https://leafletjs.com/)
	* [Rainviewer from mwasil](https://github.com/mwasil/Leaflet.Rainviewer)
	* [PolylineMeasure from ppete2](https://github.com/ppete2/Leaflet.PolylineMeasure)
* [geodesy (latlon-ellipsoidal-vincenty.js)](http://www.movable-type.co.uk/scripts/geodesy-library.html)
* [lodash](https://lodash.com/)
* [Font Awesome 6 Free](https://fontawesome.com/)
* google APIs
	* google Maps JavaScript API
	* google Places API
	* google Service Usage API
* maptiler API

### Functionality ###

Most of the code is written for readability, does not make use of classes, uses module imports/exports and is written in vanilla JavaScript.
Function flow can be a bit tricky to follow for certain operations though.

#### Search on Map ####
Originates from script.js

###### Search LOCI / PLACE / NAVAID / WAYPOINT / COORDINATE / BEARING DISTANCE #####
On `Enter` in input field or `Left Click`on button<br>
&downarrow;<br>
Event listener {query}<br>
&downarrow;<br>
render{query} &rightleftarrows; queryFunctions.js > place{query}<br>
&downarrow;<br>
addMarker

##### Search ALL #####
On `Enter` in input field or `Left Click`on button<br>
&downarrow;<br>
Event listener `mapAllContainer` &rightleftarrows; routeDeconstructor.js > routeDeconstructor &rightleftarrows; check{query}<br>
&downarrow;<br>
renderRoute<br>
&downarrow;<br>
render{query}<br>
&downarrow;<br>
addMarker

#### Coordinate Conversion ####
Originates from script.js

Event listener Deg Min Sec to Decimal &rightleftarrows; coordinateConversions.js > degMinSecToDecimal &rightleftarrows; calcDegToDec<br>
&downarrow;<br>
addMarker

Event listener Decimal to Deg Min Sec &rightleftarrows; coordinateConversions.js > decimalToDegMinSec &rightleftarrows; calcDecToDeg<br>
&downarrow;<br>
addMarker

Event listener Deg Decimal Min to Deg Min Sec &rightleftarrows; coordinateConversions.js > degDecimalToDegMinSec &rightleftarrows; calcDegToDec<br>
&downarrow;<br>
addMarker


## Data Delivery ##
Data is provided via plain JavaScript Objects in dedicated .js files files for: 

* ICAO Location Indicators
* ICAO Waypoint/Reporting Point Indicators
* ICAO Navigation Aid Indicators
* Airspace shapes

These will have to be updated on AIRAC dates. Input data is either CSV, raw text or XML. You will need to convert the input data into usable Objects. 

## Data Sources ##

### ICAO Location Indicators ###
ourairports.com

### ICAO Waypoint/Reporting Point Indicators ###
Eurocontrol European AIS Database

### ICAO Navigation Aid Indicators ###
ourairports.com

### Place names ###
google Maps JavaScript API

### Airspace shapes ###
* openAIP
* [skyguide AIM Services](https://www.skyguide.ch/services/aeronautical-information-management)

## Contribution guidelines ##

None

## Who do I talk to? ##

Repo owner
