/// <reference path="../typings/index.d.ts" />
var ARScene = (function () {
    function ARScene() {
        this.initiallyLoadedData = false;
        this.initialized = false;
        this.isOpeningMarker = false;
        this.locationUpdateCounter = 0;
        this.updatePlacemarkDistancesEveryXLocationUpdates = 10;
        this.initialized = true;
    }
    // Maybe loading indicator should be it's own class? 
    ARScene.prototype.showLoadingIndicator = function () {
        $('#loading').show();
    };
    ARScene.prototype.hideLoadingIndicator = function () {
        $('#loading').hide();
    };
    ARScene.prototype.captureScreen = function () {
        if (this.initialized) {
            $('#capture-btn').attr('src', 'assets/buttons/ICON-TAB-CAPTURE-1.png');
            document.location.href = 'architectsdk://button?action=captureScreen';
        }
        else {
            console.log('AR Scene has not been initialized.');
        }
    };
    ARScene.prototype.captureScreenSuccess = function (path) {
        $('#capture-btn').attr('src', 'assets/buttons/ICON-TAB-CAPTURE-0.png');
        console.log('Image saved at ' + path);
    };
    ARScene.prototype.captureScreenFail = function (errorMessage) {
        $('#capture-btn').attr('src', 'assets/buttons/ICON-TAB-CAPTURE-0.png');
        alert('Unable to save image. Error: ' + errorMessage);
    };
    ARScene.prototype.updateDistanceToUserValues = function () {
        for (var i = 0; i < this.markerList.length; i++) {
            this.markerList[i].distanceToUserM = this.markerList[i].markerObject.locations[0].distanceToUser();
        }
    };
    ARScene.prototype.updateRangeValues = function () {
        var sliderVal = $('#obj-dist-range').val();
        var maxRangeMeters = Math.round(this.getMaxDistance() * (sliderVal / 1000));
        var placesInRange = this.getNumberOfVisiblePlacesInRange(maxRangeMeters);
        AR.context.scene.cullingDistance = Math.max(maxRangeMeters, 1);
        PoiRadar.setMaxDistance(Math.max(maxRangeMeters, 1));
    };
    ARScene.prototype.getNumberOfVisiblePlacesInRange = function (maxRangeMeters) {
        this.markerList.sort(this.sortByDistanceSorting);
        for (var i = 0; i < this.markerList.length; i++) {
            if (this.markerList[i].distanceToUserM > maxRangeMeters) {
                return i;
            }
        }
        return this.markerList.length;
    };
    ARScene.prototype.setIsOpeningMarker = function (isOpeningMarker) {
        this.isOpeningMarker = isOpeningMarker;
        console.log('Is Opening Marker? ', this.isOpeningMarker);
    };
    ARScene.prototype.updateStatusMessage = function (message, isWarning) {
        // Currently not using these status messages, the HTML has been commented out. 
        // Maybe we can use this some day though. 
        var themeToUse = isWarning ? 'e' : 'c';
        var iconToUse = isWarning ? 'alert' : 'info';
        $('#status-message').html(message);
        $('#popupInfoButton').buttonMarkup({
            theme: themeToUse
        });
        $('#popupInfoButton').buttonMarkup({
            icon: iconToUse
        });
    };
    ARScene.prototype.locationChanged = function (lat, lon, alt, acc) {
        // If a request to the server has not already been made then do so, otherwise update marker distances 
        if (!this.initiallyLoadedData) {
            this.requestDataFromServer(lat, lon);
            this.initiallyLoadedData = true;
        }
        else {
            if (this.locationUpdateCounter === 0) {
                this.updateDistanceToUserValues();
            }
        }
        this.locationUpdateCounter = (++this.locationUpdateCounter % this.updatePlacemarkDistancesEveryXLocationUpdates);
    };
    // called when a merker is selected in the AR scene
    ARScene.prototype.onMarkerSelected = function (marker, poiData) {
        var _this = this;
        if (this.isOpeningMarker) {
            console.log('cannot open a new page right now');
            return;
        }
        ;
        console.log('Opening a new page');
        this.setIsOpeningMarker(true);
        this.showLoadingIndicator();
        setTimeout(function () {
            _this.openActivities(true, poiData);
        }, 1500);
    };
    // Screen was clicked but no geo-object was hit
    ARScene.prototype.onScreenClick = function () {
        this.openActivities(false, {});
    };
    ARScene.prototype.getMaxDistance = function () {
        this.markerList.sort(this.sortByDistanceSortingDescending);
        var maxDistanceMeters = this.markerList[0].distanceToUserM;
        return maxDistanceMeters * 1.1;
    };
    ARScene.prototype.loadPoisFromJsonData = function (poiData) {
        // Iterate through server response and create POI markers 
        PoiRadar.show();
        $('#radarContainer').unbind('click');
        $('#radarConatainer').click(PoiRadar.clickedRadar);
        this.markerList = [];
        for (var i = 0; i < poiData.length; i++) {
            var singlePoi = {
                "id": poiData[i].id,
                "latitude": parseFloat(poiData[i].lat),
                "longitude": parseFloat(poiData[i].lng),
                "altitude": AR.CONST.UNKNOWN_ALTITUDE,
                "title": poiData[i].title,
                "address": poiData[i].address,
                "phoneNumber": poiData[i].tel,
                "source": poiData[i].type,
                "category_type": poiData[i].category_type
            };
            this.markerList.push(new Marker(singlePoi));
        }
    };
    ARScene.prototype.requestDataFromServer = function (lat, lon) {
        var _this = this;
        if (this.isRequestingData)
            return;
        this.isRequestingData = true;
        var serverURL = "https://dev1.remakeworld.com/town/map/get_places_for_ar/?lat=" + lat + "&lng=" + lon;
        var jqxhr = $.getJSON(serverURL, function (data, textStatus, jqxhr) {
            _this.loadPoisFromJsonData(data);
        }).fail(function (xhr, textStatus, errorThrown) {
            alert('Error loading Pois');
        }).always(function () {
            _this.isRequestingData = false;
            setTimeout(function () {
                _this.hideLoadingIndicator();
            }, 1500);
            $('#refresh-places-btn').prop('disabled', false);
        });
    };
    ARScene.prototype.sortByDistanceSorting = function (a, b) {
        return a.distanceToUserM - b.distanceToUserM;
    };
    ARScene.prototype.sortByDistanceSortingDescending = function (a, b) {
        return b.distanceToUserM - a.distanceToUserM;
    };
    ARScene.prototype.refreshPlaces = function () {
        this.showLoadingIndicator();
        $('#refresh-places-btn').prop('disabled', true);
        this.removePOIS();
        // assume that this.lat and this.lon are set
        this.requestDataFromServer(this.lat, this.lon);
    };
    ARScene.prototype.removePOIS = function () {
        for (var i = 0; i < this.markerList.length; i++) {
            this.markerList[i].markerObject.drawables.removeCamDrawable(1);
            this.markerList[i].markerObject.drawables.removeIndicatorDrawable(0);
            this.markerList[i].markerObject.drawables.removeRadarDrawable(0);
        }
        AR.context.destroyAll();
    };
    ARScene.prototype.setLatLon = function (lat, lon) {
        this.lat = lat;
        this.lon = lon;
    };
    ARScene.prototype.openActivities = function (fromMarker, poiData) {
        var obj;
        if (fromMarker) {
            obj = {
                fromMarker: true,
                lat: poiData.latitude,
                lng: poiData.longitude,
                address: poiData.address,
                name: poiData.title || poiData.name,
                phone: poiData.phoneNumber /* || 'No phone number found'*/,
                id: poiData.id,
                cid: 1,
                ppid: 1,
                source: poiData.source
            };
        }
        else {
            obj = {
                fromMarker: false,
                userLat: this.lat,
                userLng: this.lon,
                //userCountry: User.country,
                cid: 1,
                ppid: 1
            };
        }
        var url = "architectsdk://button?action=openActivities?obj=" + JSON.stringify(obj);
        document.location.href = url;
    };
    return ARScene;
}());
var scene = new ARScene();
AR.context.onLocationChanged = function (lat, lon, alt, accuracy) {
    scene.locationChanged(lat, lon, alt, accuracy);
    scene.setLatLon(lat, lon);
};
// AR.context.onScreenClick = scene.onScreenClick;  
//# sourceMappingURL=app.js.map