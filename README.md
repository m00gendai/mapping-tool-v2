# README #

This tool essentially allows you to query flight plan route data and plot it to a map.

### Features ###

1. Coordinate conversion
	* WGS84 conversion from Deg/Min/Sec to Decimal Degrees
	* WGS84 conversion from Decimal Degrees to Deg/Min/Sec
	* WGS84 conversion from Degrees Decimal Minutes to Deg/Min/Sec
2. Query and plot location data
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
3. Chart layer
	* Base Maps
		* Maptiler Basic
		* Maptiler Satellite Hybrid
		* OpenStreetMap Base
		* Maptiler swisstopo LBM Vivid
		* ArcGIS ESRI National Geographic
		* ArcGIS ESRI NASA Satellite
	* Overlays
		* Hill Shading Layer
		* swisstopo VFR ICAO Map 1:500000 Switzerland
		* Swiss Restricted Airspaces for Drones
	* Markers & Lines
		* Distinct markers for queried location data type
		* Drawable lines between markers
	* Shapes
		* FIR, TMA, CTR
		* Only for certain countries (currently Switzerland, Italy, Croatia, Serbia, Belgium)
	* Toolbars
		* Remove Markers
		* Close Marker Popups
		* Remove Lines
		* Toggle Overlays
		* Focus Switzerland Boundary Points
		* Focus Europe Boundary Points
		* Focus World Boundary Points
		* Toggle Shape Layers
		* Toggle Rainviewer

### Known limitations ###

* Places:
	* Subject to google Maps JavaScript API
* Airspace shapes:
	* Dependent on data delivery (if and how)
	* Tooltips do not display ICAO 4-letter-code of Airspace, only Airspace name (this is due to data delivery)
* Navaid search:
	* If multiple Navaids with the same Ident exist, the tool plots them all as it cannot detect from context which would be the correct one to plot
* Waypoint search:
	* LFN Waypoints not yet covered
	* There are guards in place for geographical location names with five letters. A five letter word is checked against the waypoint database and a database of known location/waypoint name hybrids. In case of a location/waypoint hybrid (example: EVIAN - Waypoint in Japan and village in France), precedence is given to the waypoint, with an alert notifying a possible location with the same name (i.e., the waypoint EVIAN in Japan gets plotted, and an alert notifies you about a location with the same name)
* General:
	* VFR Reporting Points are not supported
	* Airport/VFR Reporting Point combinations are not detected
	
### Known Bugs ###

* Character encoding issues (umlauts etc - UTF-8 is not applied everyhwere)

### Planned Features ###

See [Trello](https://trello.com/b/yzfLBL7h/aim-mapping-tool)

### Setup ###

* Uses module scripts, so must be served by a webserver. A simple Python http server suffices for localhost testing.
* Uses the google Maps JavaScript API which is restricted, so you need to provide your own API key in googleAPIs.js
* Uses the maptiler API which is restricted, so you need to provide your own API key in googleAPIs.js

Main Files:

* index.html
* styles.css
* script.js
* queryFunctions.js
* coordinateConversions.js
* routeDeconstructor.js
* googleAPIs.js

Dependencies:

* [leaflet.js](https://leafletjs.com/)
	* [Rainviewer from mwasil](https://github.com/mwasil/Leaflet.Rainviewer)
* [geodesy (latlon-ellipsoidal-vincenty.js)](http://www.movable-type.co.uk/scripts/geodesy-library.html)
* google Maps JavaScript API
* maptiler API

Additional files:
Data is provided via plain JavaScript Objects in dedicated .js files files for: 

* ICAO Location Indicators
* ICAO Waypoint/Reporting Point Indicators
* ICAO Navigation Aid Indicators
* Airspace shapes

These will have to be updated on AIRAC dates. Input data is either CSV, raw text or XML. You will need to convert the input data into usable Objects. 

### Data Sources ###

1. ICAO Location Indicators
	* ourairports.com
2. ICAO Waypoint/Reporting Point Indicators
	* Eurocontrol European AIS Database
3. ICAO Navigation Aid Indicators
	* ourairports.com
4. Place names
	* google Maps JavaScript API
5. Airspace shapes
	* openAIP
	* [skyguide AIM Services](https://www.skyguide.ch/services/aeronautical-information-management)

### Contribution guidelines ###

None

### Who do I talk to? ###

Repo owner
