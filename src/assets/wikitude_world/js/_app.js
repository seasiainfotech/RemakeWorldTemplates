var FACTUAL_POI = (function () {
    var SERVER_URL = "https://dev3.remakeworld.com/";
    return {
        SERVICE: 'factual',
        URL: 'https://dev3.remakeworld.com/wikitude/test/php/factual.php', 
        IMAGE: {
            MARKERS: {
                    REMAKE: {
                        PLACE: "assets/markers/place_94.png",
                        THING: "assets/markers/thing_94.png",
                        PRODUCT: "assets/markers/product_94.png"
                    },
                    GOOGLE_PLACES: {
                        DEFAULT: "assets/markers/icon-marker-place-noclaim.png",
                        SMALL: "assets/markers/icon-marker-place-noclaim-far.png",
                        MEDIUM: "assets/markers/icon-marker-place-noclaim-far.png",
                        LARGE: "assets/markers/icon-marker-place-noclaim.png"
                    }
                },
            SELECTED_MARKERS: {
                REMAKE: {
                    PLACE: "assets/markers/place_94_hover.png",
                    THING: "assets/markers/thing_94_hover.png",
                    PRODUCT: "assets/markers/product_94_hover.png"
                },
                GOOGLE_PLACES: {
                    DEFAULT: "assets/markers/google_place_57_hover.png",
                    SMALL: "assets/markers/google_place_57_hover.png",
                    MEDIUM: "assets/markers/google_place_57_hover.png",
                    LARGE: "assets/markers/google_place_57_hover.png"
                }
            }
        },
        getServerURL: function(lat, lon){
            var radius = document.getElementById('range-slider').value;
            var type = 1; // remove from PHP code, unnecessary. 
            var country = 'us'; //assume US for now. need api/service to get country from lat/lon
            return `${this.URL}?lat=${lat}&long=${lon}&radius=${radius}&type=${type}`;
        },
        loadPoisFromJsonData: function(poiData){
            AR.context.destroyAll();
            // show radar & set click-listener
            PoiRadar.show();
            $('#radarContainer').unbind('click');
            $("#radarContainer").click(PoiRadar.clickedRadar);

            // empty list of visible markers
            World.markerList = [];
            World.markers = {};
            World.selected_markers = {};

            // start loading marker assets
            World.markerDrawable_directionIndicator = new AR.ImageResource("assets/indi.png");
            World.label_img =  new AR.ImageResource('assets/labels/label_huge.png');
            // loop through POI-information and create an AR.GeoObject (=Marker) per POI
            for (var currentPlaceNr = 0; currentPlaceNr < poiData.length; currentPlaceNr++) {

                // var key_markers = poiData[currentPlaceNr].type + "_" + poiData[currentPlaceNr]['category_type'];
                var key_markers = poiData[currentPlaceNr].$distance < 550 ? "large" : 
                                  poiData[currentPlaceNr].$distace < 1100 ? "medium" : "small";

                World.markers["small"] = new AR.ImageResource( Remake.IMAGE.MARKERS.GOOGLE_PLACES.SMALL );
                World.markers["medium"] = new AR.ImageResource( Remake.IMAGE.MARKERS.GOOGLE_PLACES.MEDIUM );
                World.markers["large"] = new AR.ImageResource( Remake.IMAGE.MARKERS.GOOGLE_PLACES.LARGE );
                
                World.selected_markers["small"] = new AR.ImageResource ( Remake.IMAGE.SELECTED_MARKERS.GOOGLE_PLACES.SMALL );
                World.selected_markers["medium"] = new AR.ImageResource ( Remake.IMAGE.SELECTED_MARKERS.GOOGLE_PLACES.MEDIUM );
                World.selected_markers["large"] = new AR.ImageResource ( Remake.IMAGE.SELECTED_MARKERS.GOOGLE_PLACES.LARGE );

                /*if (!World.markers[key_markers]) {
                    World.markers[key_markers] = new AR.ImageResource(
                        Remake.IMAGE.MARKERS.GOOGLE_PLACES.DEFAULT
                    );
                    World.selected_markers[key_markers] = new AR.ImageResource(
                        Remake.IMAGE.SELECTED_MARKERS.GOOGLE_PLACES.DEFAULT
                    );
                }*/

                var singlePoi = {
                    "id": poiData[currentPlaceNr].factual_id,
                    "latitude": parseFloat(poiData[currentPlaceNr].latitude),
                    "longitude": parseFloat(poiData[currentPlaceNr].longitude),
                    "altitude": AR.CONST.UNKNOWN_ALTITUDE,
                    "title": poiData[currentPlaceNr].name,
                    "address": poiData[currentPlaceNr].address,
                    "description": "(" + poiData[currentPlaceNr].$distance + " km)",
                    "key_markers": key_markers,
                    "source": 'factual'
                };

                World.markerList.push(new Marker(singlePoi));
                console.log(singlePoi.title);
            }

            // updates distance information of all placemarks
            World.updateDistanceToUserValues();

            World.updateStatusMessage(currentPlaceNr + ' places loaded via Factual');
        },
        requestDataFromServer: function(lat, lon){
            World.isRequestingData = true;
            World.updateStatusMessage('Requesting places from web-service via Factual');

            // server-url to JSON content provider
            // var serverUrl = Remake.CONFIG.POI_SERVER.URL + "?" + Remake.CONFIG.POI_SERVER.LAT + "=" + lat + "&" + Remake.CONFIG.POI_SERVER.LON + "=" + lon;
            var serverURL = this.getServerURL(lat, lon);
            console.log(serverURL);
            var radius = Settings.radiusM; 
            //var serverUrl = Remake.URL + "?lat=" + lat + "&long=" + lon + "&radius=" + radius + "&type=1";
            AR.logger.debug(serverURL);
            var jqxhr = $.getJSON(serverURL, function (data) {
                console.log('Places loaded via Factual: ');
                console.log(data);
                World.loadPoisFromJsonData(data);
            })
            .error(function (err) {
                World.updateStatusMessage("Invalid web-service response.", true);
                World.isRequestingData = false;
            })
            .complete(function () {
                World.isRequestingData = false;
                setTimeout(function(){
                    document.getElementById('loading').style = 'visibility:hidden;';
                    document.getElementById('refresh-places-btn').disabled = false;
                }, 1500);
            });
        }
    }
})();

var GOOGLE_PLACES = (function(){
    var SERVER_URL = 'https://dev1.remakeworld.com/';
    return {
        SERVICE: 'google',
        CONFIG: {
            SERVER_URL: SERVER_URL,
            AR_URL: SERVER_URL + 'wikitude/RemakeWorld/',
            POI_SERVER: {
                URL: SERVER_URL + 'town/map/get_places_for_ar/',
                LAT: 'lat',
                LON: 'lng'
            }
        },
        IMAGE: {
            MARKERS: {
                    REMAKE: {
                        PLACE: "assets/markers/place_94.png",
                        THING: "assets/markers/thing_94.png",
                        PRODUCT: "assets/markers/product_94.png"
                    },
                    GOOGLE_PLACES: {
                        DEFAULT: "assets/markers/icon-marker-place-noclaim.png",
                        SMALL: "assets/markers/icon-marker-place-noclaim-far.png",
                        MEDIUM: "assets/markers/icon-marker-place-noclaim-far.png",
                        LARGE: "assets/markers/icon-marker-place-noclaim.png"
                    }
                },
            SELECTED_MARKERS: {
                REMAKE: {
                    PLACE: "assets/markers/place_94_hover.png",
                    THING: "assets/markers/thing_94_hover.png",
                    PRODUCT: "assets/markers/product_94_hover.png"
                },
                GOOGLE_PLACES: {
                    DEFAULT: "assets/markers/google_place_57_hover.png",
                    SMALL: "assets/markers/google_place_57_hover.png",
                    MEDIUM: "assets/markers/google_place_57_hover.png",
                    LARGE: "assets/markers/google_place_57_hover.png"
                }
            }
        },
        getServerURL: function(lat, lon){
            return `${this.CONFIG.POI_SERVER.URL}?lat=${lat}&lng=${lon}`;
        },
        loadPoisFromJsonData: function(poiData){
            PoiRadar.show();
            $('#radarContainer').unbind('click');
            $("#radarContainer").click(PoiRadar.clickedRadar);

            // empty list of visible markers
            World.markerList = [];
            World.markers = {};
            World.selected_markers = {};
            // start loading marker assets
            World.markerDrawable_directionIndicator = new AR.ImageResource("assets/indi.png");
            World.label_img =  new AR.ImageResource('assets/labels/label_huge.png');

            for(var currentPlaceNr = 0; currentPlaceNr < poiData.length; currentPlaceNr++){
                console.dir(poiData[currentPlaceNr]);
                poiData[currentPlaceNr].$distance = 1;

                var key_markers = poiData[currentPlaceNr].$distance < 550 ? "large" : 
                                  poiData[currentPlaceNr].$distace < 1100 ? "medium" : "small";

                World.markers["small"] = new AR.ImageResource( Remake.IMAGE.MARKERS.GOOGLE_PLACES.SMALL );
                World.markers["medium"] = new AR.ImageResource( Remake.IMAGE.MARKERS.GOOGLE_PLACES.MEDIUM );
                World.markers["large"] = new AR.ImageResource( Remake.IMAGE.MARKERS.GOOGLE_PLACES.LARGE );
                
                World.selected_markers["small"] = new AR.ImageResource ( Remake.IMAGE.SELECTED_MARKERS.GOOGLE_PLACES.SMALL );
                World.selected_markers["medium"] = new AR.ImageResource ( Remake.IMAGE.SELECTED_MARKERS.GOOGLE_PLACES.MEDIUM );
                World.selected_markers["large"] = new AR.ImageResource ( Remake.IMAGE.SELECTED_MARKERS.GOOGLE_PLACES.LARGE );

                var singlePoi = {
                    "id": poiData[currentPlaceNr].id,
                    "latitude": parseFloat(poiData[currentPlaceNr].lat),
                    "longitude": parseFloat(poiData[currentPlaceNr].lng),
                    "altitude": AR.CONST.UNKNOWN_ALTITUDE,
                    "title": poiData[currentPlaceNr].title,
                    "address": poiData[currentPlaceNr].address,
                    "description": "(" + poiData[currentPlaceNr].$distance + " km)",
                    "key_markers": key_markers,
                    "phoneNumber": poiData[currentPlaceNr].tel,
                    "source": poiData[currentPlaceNr].type
                };

                World.markerList.push(new Marker(singlePoi));
                World.updateDistanceToUserValues();
                console.log(singlePoi.title);
            }
        },
        requestDataFromServer: function(lat, lon){
            World.isRequestingData = true;
            World.updateStatusMessage('Requesting data from Google');
            var serverURL = this.getServerURL(lat, lon);
            console.log(serverURL);
            var jqxhr = $.getJSON(serverURL, function(data){
                console.log('Places loaded via Google: ');
                console.log(data);
                World.loadPoisFromJsonData(data);
            }).error(function(err){
                console.log('Error loading POIs from Google');
                console.log(err);
            }).complete(function(){
                setTimeout(function(){
                    document.getElementById('loading').style = 'visibility:hidden';
                    document.getElementById('refresh-places-btn').disabled = false;
                }, 1500);
            });
        }
    }
})();

var GEO_NAMES = (function(){
    return {
        URL: 'http://ws.geonames.org/countryCodeJSON?',
        USERNAME: 'rJacob',
        getCountryCode: function(){
            var lat = User.lat;
            var lng = User.lon;
            var url = this.URL + `lat=${lat}&lng=${lng}&username=${this.USERNAME}`;
            console.log(url);
            var jqxhr = $.getJSON(url, function (data) {
                User.country = data.countryCode;
            })
            .error(function (err) {
                console.log('error');
                World.updateStatusMessage("Unable to recieve your country.", true);
            })
            .complete(function () {
                console.log('User', User);
            });
        }
    };
})();

// var Remake = FACTUAL_POI;
var Remake = GOOGLE_PLACES;

// implementation of AR-Experience (aka "World")
var World = {
    // you may request new data from server periodically, however: in this sample data is only requested once
    isRequestingData: false,

    // true once data was fetched
    initiallyLoadedData: false,

    initialized: false,

    // different POI-Marker assets
    markerDrawable_idle: null,
    markerDrawable_selected: null,
    markerDrawable_directionIndicator: null,
    label_img: null,

    // list of AR.GeoObjects that are currently shown in the scene / World
    markerList: [],
    markers: {},
    selected_markers: {},

    // The last selected marker
    currentMarker: null,

    locationUpdateCounter: 0,
    updatePlacemarkDistancesEveryXLocationUpdates: 10,

    init: function(){
        World.initialized = true;
        setTimeout(function(){
            World.requestLatLon();
        }, 1000);
    },

    captureScreen: function(){
        AR.logger.info("captureScreen called ...");
        console.log('captureScreen called...');

        if (World.initialized) {
            document.getElementById('capture-btn').src = 'assets/buttons/ICON-TAB-CAPTURE-1.png';
            document.location = "architectsdk://button?action=captureScreen";
        } else {
            console.log('NO DICE');
        }
    },

    captureScreenSuccess: function(path){
        document.getElementById('capture-btn').src = 'assets/buttons/ICON-TAB-CAPTURE-0.png';
        console.log('Image saved at ' + path);
        World.updateStatusMessage('Image saved!');
    },

    captureScreenFail: function(errorMessage){
        document.getElementById('capture-btn').src = 'assets/buttons/ICON-TAB-CAPTURE-0.png';
        alert('Image not saved! Error: ' + errorMessage);
        World.updateStatusMessage('Unable to save image...', true);
    },
    // called to inject new POI data
    loadPoisFromJsonData: function loadPoisFromJsonDataFn(poiData) {
        Remake.loadPoisFromJsonData(poiData)
    },

    // sets/updates distances of all makers so they are available way faster than calling (time-consuming) distanceToUser() method all the time
    updateDistanceToUserValues: function updateDistanceToUserValuesFn() {
        for (var i = 0; i < World.markerList.length; i++) {
            World.markerList[i].distanceToUser = World.markerList[i].markerObject.locations[0].distanceToUser();
        }
    },

    updateRangeValues: function(){
        var sliderVal = document.getElementById('obj-dist-range').value;
        var maxRangeMeters = Math.round(World.getMaxDistance() * (sliderVal / 1000));
        console.log('maxRangeMeters', maxRangeMeters);
        var maxRangeValue = (maxRangeMeters > 999) ? ((maxRangeMeters / 1000).toFixed(2) + " km") : (Math.round(maxRangeMeters) + " m");
        var placesInRange = World.getNumberOfVisiblePlacesInRange(maxRangeMeters);

        AR.context.scene.cullingDistance = Math.max(maxRangeMeters, 1);
        PoiRadar.setMaxDistance(Math.max(maxRangeMeters, 1));
    },

    getNumberOfVisiblePlacesInRange: function(maxRangeMeters){
        World.markerList.sort(World.sortByDistanceSorting);

        for(var i = 0; i < World.markerList.length; i++){
            if(World.markerList[i].distanceToUser > maxRangeMeters) {
                return i;
            }
        }

        return World.markerList.length;
    },

    // updates status message shon in small "i"-button aligned bottom center
    updateStatusMessage: function updateStatusMessageFn(message, isWarning) {

        var themeToUse = isWarning ? "e" : "c";
        var iconToUse = isWarning ? "alert" : "info";

        $("#status-message").html(message);
        $("#popupInfoButton").buttonMarkup({
            theme: themeToUse
        });
        $("#popupInfoButton").buttonMarkup({
            icon: iconToUse
        });
    },

    // location updates, fired every time you call architectView.setLocation() in native environment
    locationChanged: function locationChangedFn(lat, lon, alt, acc) {


        // request data if not already present
        if (!World.initiallyLoadedData) {

            World.requestDataFromServer(lat, lon);
            World.initiallyLoadedData = true;
        } else {
            if (World.locationUpdateCounter === 0) {
                // update placemark distance information frequently, you max also update distances only every 10m with some more effort
                World.updateDistanceToUserValues();
            }
        }

        // helper used to update placemark information every now and then (e.g. every 10 location upadtes fired)
        World.locationUpdateCounter = (++World.locationUpdateCounter % World.updatePlacemarkDistancesEveryXLocationUpdates);

    },

    // fired when user pressed marker in cam
    onMarkerSelected: function onMarkerSelectedFn(marker) {
        World.currentMarker = marker;

        // update panel values
        $("#poi-detail-title").html(marker.poiData.title);
        $("#poi-detail-description").html(marker.poiData.description);

        var distanceToUserValue = (marker.distanceToUser > 999) ? ((marker.distanceToUser / 1000).toFixed(
            2) + " km") : (Math.round(marker.distanceToUser) + " m");

        $("#poi-detail-distance").html(distanceToUserValue);

        // show panel
        $("#panel-poidetail").panel("open", 123);

        $(".ui-panel-dismiss").unbind("mousedown");

        $("#panel-poidetail").on("panelbeforeclose", function (event, ui) {
            World.currentMarker.setDeselected(World.currentMarker);
        });

        console.log('app.js marker selected');

        var place = {};
        place.name = marker.poiData.title;
        place.address = marker.poiData.address;
        place.phone = marker.poiData.phone;
        place.lat = marker.poiData.lat;
        place.lng = marker.poiData.lng;
        place.ppid = marker.poiData.ppid;
        place.cid = marker.poiData.cid;
        place.id = marker.poiData.id;

        var url = `architectsdk://button?action=requestLatLon&` +
                `name=${place.name}&` +
                `address=${place.address}&` +
                `phone=${place.phone}&` +
                `lat=${place.lat}&` +
                `lng=${place.lng}&` +
                `ppid=${place.ppid}&` +
                `cid=${place.cid}&` +
                `id=${place.id}`;

        document.location = url;

    },

    // screen was clicked but no geo-object was hit
    onScreenClick: function onScreenClickFn() {
        World.openActivities(false); 
    },

    distanceBetweenCoordinates(lat1, lon1, lat2, lon2){
        function degToRad(deg){
            return deg * (Math.PI / 180);
        }
        var R = 6371; // radius of earth in km
        var dLat = degToRad(lat2 - lat1);
        var dLon = degToRad(lon2 - lon1);
        var a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    },

    // returns distance in meters of placemark with maxdistance * 1.1
    getMaxDistance: function getMaxDistanceFn() {

        // sort palces by distance so the first entry is the one with the maximum distance
        World.markerList.sort(World.sortByDistanceSortingDescending);

        // use distanceToUser to get max-distance
        var maxDistanceMeters = World.markerList[0].distanceToUser;
        console.log('maxDistanceMeters',maxDistanceMeters)

        // return maximum distance times some factor >1.0 so ther is some room left and small movements of user don't cause places far away to disappear
        return maxDistanceMeters * 1.1;
    },

    // request POI data
    requestDataFromServer: function requestDataFromServerFn(lat, lon) {
        Remake.requestDataFromServer(lat, lon);
    },

    // helper to sort places by distance
    sortByDistanceSorting: function (a, b) {
        return a.distanceToUser - b.distanceToUser;
    },

    // helper to sort places by distance, descending
    sortByDistanceSortingDescending: function (a, b) {
        return b.distanceToUser - a.distanceToUser;
    },

    refreshPlaces: function refreshPlacesFn(){
        document.getElementById('loading').style = 'visibility: default;';
        document.getElementById('refresh-places-btn').disabled = true;
        determineLoadingPos();
        World.removePOIS();
        if(User.lat !== null && User.lon !== null){
            World.requestDataFromServer(User.lat, User.lon); 
        } else {
            World.requestLatLon();
            setTimeout(function(){
                World.requestDataFromServer(User.lat, User.lon);
            }, 1000);
        }
    },

    removePOIS: function(){
        for(var i = 0; i < World.markerList.length; i++){
            World.markerList[i].markerObject.drawables.removeCamDrawable(1);
            World.markerList[i].markerObject.drawables.removeIndicatorDrawable(0);
            World.markerList[i].markerObject.drawables.removeRadarDrawable(0);
        }
        AR.context.destroyAll();
    },

    requestLatLon: function(){
        console.log('Requesting User lat and lon'); 
        document.location = 'architectsdk://button?action=requestLatLon';
    },

    setLatLon: function(lat, lon){
        User.lat = lat;
        User.lon = lon;
        GEO_NAMES.getCountryCode(User.lat, User.lon);
    },

    openActivities: function(fromMarker, poiData){
        if(fromMarker){
            var obj = {
                fromMarker: true,
                lat: poiData.latitude,
                lng: poiData.longitude,
                address: poiData.address,
                name: poiData.title || poiData.name,
                phone: poiData.phoneNumber || 'No phone number found',
                id: poiData.id,
                cid: 1, // use this until remake api is integrated 
                ppid: 1,
                source: poiData.source
            };
            var url = `architectsdk://button?action=openActivities?obj=${JSON.stringify(obj)}`;
        } else {
            var obj = {
                fromMarker: false,
                userLat: User.lat,
                userLng: User.lon,
                userCountry: User.country,
                cid: 1, // use this until remake api is integrated 
                ppid: 1
            };
            var url = `architectsdk://button?action=openActivities?obj=${JSON.stringify(obj)}`; 
        }
        document.location = url;
    }
};



/* forward locationChanges to custom function */
AR.context.onLocationChanged = World.locationChanged;

/* forward clicks in empty area to World */
//AR.context.onScreenClick = World.onScreenClick;

//AR.logger.activateDebugMode();

//AR.logger.debug(window.location);

World.init();
