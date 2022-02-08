# README #

This tool allows you to query flight plan route data and plot it to a map.

### Features ###

1. Coordinate conversion
	* WGS84 conversion from Deg/Min/Sec to Decimal Degrees
	* WGS84 conversion from Decimal Degrees to Deg/Min/Sec
	* WGS84 conversion from Degrees Decimal Minutes to Deg/Min/Sec
2. Query data
	* ICAO Location Indicators (worldwide)
		* Single
	  	* Multiple, space separated
	  	* Case insensitive
  * ICAO Waypoint/Reporting Point Indicators (Europe/IFPZ)
		* Single
		* Multiple, space separated
		* Case insensitive
	* ICAO Navigation Aid Indicators (VOR, VOR/DME, DME, TACAN, VORTAC, NDB)
		* Single
		* Multiple, space separated
		* Case insensitive
	* Geographical locations
	  * Worldwide
	  * Places, POIs, etc
		* Multiple, comma separated
		* Case insensitive
	* WGS84 Coordinates
		* Format {nnnn}N|S{nnnnn}E|W
		* Format {nnnnnn}N|S{nnnnnnn}E|W
		* Single
		* Multiple, space separated
		* Case insensitive
		* Agnostic to other input
	* Complete
		* Auto detects what category input elements are and processes them accordingly
3. Chart layer
	* Base Maps
		* Google Hybrid
		* Google Base
		* OpenStreetMap Base
		* OpenstreetMap Topographic
	* Points of Interest
		* Swiss Airports
	* Overlays
		* Swiss VFR ICAO Chart
		* swisstopo Color Map
		* Swiss Restricted Airspaces for Drones
	* Markers & Lines
		* Markers for queried locations
		* Markers for converted coordinates
		* Marker popups with location/coordinate details
		* Drawable lines between Markers
	* Shapes
		* FIR
		* TMA
		* CTR
		* Only for certain countries
	* Toolbars
		* Remove Markers
		* Close Marker Popups
		* Remove Lines
		* Toggle Overlays
		* Focus Switzerland Boundary Points
		* Focus Europe Boundary Points
		* Focus World Boundary Points
		* Toggle Shape Layers

### Known limitations ###

* Places:
	* Subject to google Maps JavaScript API
* Airspace shapes:
	* Dependent on data delivery (if and how)
	* Tooltips do not display ICAO 4-letter-code of Airspace, only Airspace name (this is due to data delivery)
* Navaid search:
	* If multiple Navaids with the same Ident exist, the tool plots them all as it cannot detect from context which would be the correct one to plot
	
### Known Bugs ###

* Query Input Fields try to query database when backspace is used
* Some coordinate extraction issues from Full RTE Search
* Autocomplete suggestion window doesnt scale to input width
* Character encoding issues (umlauts etc - UTF-8 is not applied everyhwere)

### Setup ###

Main Files:

* index.html
* styles.css
* script.js

Dependencies:

* leaflet.js

Additional files:
Data is delivered by JSON files for: 

* ICAO Location Indicators (worldwide)
* ICAO Waypoint/Reporting Point Indicators (Europe/IFPZ)
* ICAO Navigation Aid Indicators for
* Place names
* Airspace shapes

These files must be provided named as referred to in index.html, JSON constants as referred to in the respective Javascript functions.
Mock files are in the Downloads section.

### Data Sources ###

1. ICAO Location Indicators (worldwide)
	* ourairports.com
2. ICAO Waypoint/Reporting Point Indicators (Europe/IFPZ)
	* Eurocontrol European AIS Database
3. ICAO Navigation Aid Indicators
	* ourairports.com
4. Place names
	* opendatasoft.com
5. Base Maps
	* Google
		* Google Web Map Service
	* OpenStreetMap
        * OSM Web Map Service
6. Points of Interest
	* Swiss Airports
		 * BAZL Web Map Tile Service
	* Swiss Hospital Heliports
		 * BAZL Web Map Tile Service
7. Overlays
	* Swiss VFR ICAO Chart
		 * VBS Web Map Tile Service
	* swisstopo Color Map
		 * swisstopo Web Map Tile Service
	* Swiss Restricted Airspaces for Drones
		 * BAZL Web Map Tile Service
8. Airspace shapes
	* openAIP
	* ON-D

### Contribution guidelines ###

None

### Who do I talk to? ###

Repo owner
