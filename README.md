# README #

AIM Mapping Tool is an open source application developed as a supplementary tool for AIM Services Switzerland, specifically to aid in plotting VFR flight plan routes.
Although it features official Swiss federal map and Eurocontrol data, it is not an official application and thus shall not be used for navigational purposes.

* [Overview](https://github.com/m00gendai/mapping-tool-v2#overview)
	* [Toolbar Features](https://github.com/m00gendai/mapping-tool-v2#toolbar-features)
		* [Search on Map](https://github.com/m00gendai/mapping-tool-v2#search-on-map)
		* [Coordinate Conversion](https://github.com/m00gendai/mapping-tool-v2#coordinate-conversion)
		* [Map Styles](https://github.com/m00gendai/mapping-tool-v2#map-styles)
		* [Plot Circle](https://github.com/m00gendai/mapping-tool-v2#plot-circle)
		* [About](https://github.com/m00gendai/mapping-tool-v2#about)
	* [Map View Features](https://github.com/m00gendai/mapping-tool-v2#map-view-features)
		* [Top Left](https://github.com/m00gendai/mapping-tool-v2#top-left)
		* [Top Right](https://github.com/m00gendai/mapping-tool-v2#top-right)
		* [Bottom Block](https://github.com/m00gendai/mapping-tool-v2#bottom-block)
	* [General Features](https://github.com/m00gendai/mapping-tool-v2#general-features)
		* [Markers & Lines](https://github.com/m00gendai/mapping-tool-v2#markers--lines)
		* [Current User Position Coordinates](https://github.com/m00gendai/mapping-tool-v2#current-curser-position-coordinates)
* [Known Limitations](https://github.com/m00gendai/mapping-tool-v2#known-limitations)
	* [Places](https://github.com/m00gendai/mapping-tool-v2#places)
	* [Airspace Shapes](https://github.com/m00gendai/mapping-tool-v2#airspace-shapes)
	* [Navaid Search](https://github.com/m00gendai/mapping-tool-v2#navaid-search)
	* [Waypoint Search](https://github.com/m00gendai/mapping-tool-v2#waypoint-search)
	* [Query All](https://github.com/m00gendai/mapping-tool-v2#query-all)
	* [General](https://github.com/m00gendai/mapping-tool-v2#general)
* [Known Bugs](https://github.com/m00gendai/mapping-tool-v2#known-bugs)
* [Planned Features](https://github.com/m00gendai/mapping-tool-v2#planned-features)
* [Setup](https://github.com/m00gendai/mapping-tool-v2#setup)
	* [Dependencies](https://github.com/m00gendai/mapping-tool-v2#dependencies)
	* [Functionality](https://github.com/m00gendai/mapping-tool-v2#functionality)
		* [Search on Map](https://github.com/m00gendai/mapping-tool-v2#search-on-map-1)
		* [Search ALL](https://github.com/m00gendai/mapping-tool-v2#search-all)
		* [Coordinate Conversion](https://github.com/m00gendai/mapping-tool-v2#coordinate-conversion-1)
* [Data Delivery](https://github.com/m00gendai/mapping-tool-v2#data-delivery)
* [Data Sources](https://github.com/m00gendai/mapping-tool-v2#data-sources)
	* [ICAO Location Indicators](https://github.com/m00gendai/mapping-tool-v2#icao-location-indicators)
	* [ICAO Waypoint/Reporting Point Indicators](https://github.com/m00gendai/mapping-tool-v2#icao-waypointreporting-point-indicators)
	* [LFN Waypoint/Reporting Point Indicators](https://github.com/m00gendai/mapping-tool-v2#lfn-waypointreporting-point-indicators)
	* [ICAO Navigation Aid Indicators](https://github.com/m00gendai/mapping-tool-v2#icao-navigation-aid-indicators)
	* [Place Names](https://github.com/m00gendai/mapping-tool-v2#place-names)
	* [Airspace Shapes](https://github.com/m00gendai/mapping-tool-v2#airspace-shapes-1)
* [Contribution Guidelines](https://github.com/m00gendai/mapping-tool-v2#contribution-guidelines)
* [Who do I talk to?](https://github.com/m00gendai/mapping-tool-v2#who-do-i-talk-to)

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
	* VOR, VOR/DME, DME, TACAN, VORTAC
	* Single or multiple (space separated)
	* Case insensitive
	* Returns ICAO Navigation Aid Ident, Type and Name on map
* Geographical locations (worldwide)
	* Via Mapbox Search API
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
* Zoom Controls
* Measurement Controls
	* Plot Measurement Line
	* Clear Measurement Line
* RainViewer

#### Top Right ####

* Toggle Airspace Layers

#### Bottom Block ####
* Clear markers
* Toggle marker popups
* Clear marker connection lines
* Clear all
* VFR Charts
	* swisstopo VFR ICAO Map 1:500000 Switzerland
	* French VFR OACI Map
	* DFS German VFR ICAO Chart
* Swiss Restricted Airspaces for Drones
* Focus Switzerland Boundary Points
* Focus Europe Boundary Points
* Focus World Boundary Points

### General Features ###

#### Markers & Lines ####
* Distinct markers for queried location data type
* Drawable lines between markers
	* Arrows indicating direction
	* Account for earth curvature (great circle instead of straight line)

#### Current curser position coordinates ####
* Decimal Degrees
* WGS84 Degrees Minutes Seconds

## Known limitations ##

#### Places ####
Subject to Mapbox Search API

#### Airspace shapes ####
* Depending on the provided country border coordinates, Airspaces may overlap or not follow a country border the same

#### Navaid search ####
* If multiple Navaids with the same Ident exist, the tool plots them all as it cannot detect from context which would be the correct one to plot
* EAD does not provide a report for NDBs, so NDB queries are not possible
* EAD does not provide a type annotation for DME and TACAN data, and since they are merged, it currently cannot be determined if a navaid is a DME or a TACAN

#### Waypoint search ####
* EAD does not provide a report for South/West hemisphere waypoints, which means there is no waypoint data for South America
* There are guards in place for geographical location names with five letters. A five letter word is checked against the waypoint database and a database of known location/waypoint name hybrids. In case of a location/waypoint hybrid (example: EVIAN - Waypoint in Japan and village in France), precedence is given to the waypoint, with an alert notifying a possible location with the same name (i.e., the waypoint EVIAN in Japan gets plotted, and an alert notifies you about a location with the same name)

#### Query all #### 
Special characters like umlauts, accented vocals etc are first deburred to Latin-1 for the deconstructor function to work. This can lead to erroneous plots in edge cases.

#### General ####
* VFR Reporting Points are not supported
* Airport/VFR Reporting Point combinations are not detected
* Application is intended for fullscreen use, responsive design is not a requirement. While it is planned to be implemented, it has a very low priority.
	
## Known Bugs ##

* When measuring EET between two points, adding a new marker and confirming the speed again also updates the total EET from the first to markers, but should only update total EET including the last marker

## Planned Features ##

See [Trello](https://trello.com/b/yzfLBL7h/aim-mapping-tool)

## Setup ##

* Uses module scripts, so must be served by a webserver. A simple Python http server suffices for localhost testing.
* Uses the  Mapbox Search API which is restricted, so you need to provide your own API key in keys.js
* Uses the maptiler API which is restricted, so you need to provide your own API key in keys.js
* Uses Font Awesome 6 Kit which is restricted, so you need to provide your own Font Awesome 6 Kit script link in index.html

### Dependencies ###

* [leaflet](https://leafletjs.com/)
	* [Rainviewer from mwasil](https://github.com/mwasil/Leaflet.Rainviewer)
	* [PolylineMeasure from ppete2](https://github.com/ppete2/Leaflet.PolylineMeasure)
	* [Arc from mad-gooze](https://github.com/MAD-GooZe/Leaflet.Arc)
	* [PolylineDecorator from bbecquet](https://github.com/bbecquet/Leaflet.PolylineDecorator)
	* [groupedlayercontrol from ismyrnow](https://github.com/ismyrnow/leaflet-groupedlayercontrol)
* [geodesy (latlon-ellipsoidal-vincenty.js)](http://www.movable-type.co.uk/scripts/geodesy-library.html)
* [lodash](https://lodash.com/)
* [Font Awesome 6 Free](https://fontawesome.com/)
* Mapbox Search API
* Maptiler API

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
[Here](https://github.com/m00gendai/EAD-XML-to-JSON) is a tool that converts EAD XML to JSON and merges them into a justom JavaScript Object for use in the mapping tool.

## Data Sources ##

### ICAO Location Indicators ###
Eurocontrol European AIS Database

### ICAO Waypoint/Reporting Point Indicators ###
Eurocontrol European AIS Database

### LFN Waypoint/Reporting Point Indicators ###
Eurocontrol European AIS Database

### ICAO Navigation Aid Indicators ###
Eurocontrol European AIS Database

### Place names ###
Mapbox Search API

### Airspace Shapes ###
* TMA and CTR by [openAip.net](https://openaip.net)
* LS FIR: [skyguide AIM Services](https://www.skyguide.ch/services/aeronautical-information-management)
* FIRs created myself by splicing boundary coordinates with given coordinates in AIPs
* LD and LJ VFR Reporting Points created myself based on each country's VFR charts
* LSAG/LSAZ FIR Boundary created myself from AIP coordinates
* Milano/Roma ARO Boundary created with AIP Italy and some approximation towards Croatia since no coordiantes whatsoever exists for this

## Overlays
* Swiss VFR Chart by [GeoAdmin](https://api3.geo.admin.ch/services/sdiservices.html)
* French VFR Chart by [IGN](https://geoservices.ign.fr/)
* German VFR Chart by [DFS](https://www.dfs.de/dfs_homepage/en/Services/Customer%20Relations/INSPIRE/)
* Swiss Drone Restrictions by [GeoAdmin](https://api3.geo.admin.ch/services/sdiservices.html)

## Contribution Guidelines ##

None

## Who do I talk to? ##

Repo owner
