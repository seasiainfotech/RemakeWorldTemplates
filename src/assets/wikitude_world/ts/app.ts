/// <reference path="../typings/index.d.ts" />

class ARScene {

    isRequestingData:boolean;
    initiallyLoadedData:boolean = false;
    initialized:boolean = false;

    isOpeningMarker:boolean = false;

    locationUpdateCounter:number = 0;
    updatePlacemarkDistancesEveryXLocationUpdates:number = 10;

    markerList:Marker[];
    markers:any;
    selected_markers:any;
    currentMarker:Marker; 

    lat:number;
    lon:number;

    constructor() {
        this.initialized = true;
    }

    // Maybe loading indicator should be it's own class? 
    showLoadingIndicator():void {
        $('#loading').show();        
    }

    hideLoadingIndicator():void {
        $('#loading').hide();        
    }

    captureScreen():void {
        if(this.initialized){
            $('#capture-btn').attr('src', 'assets/buttons/ICON-TAB-CAPTURE-1.png')
            document.location.href = 'architectsdk://button?action=captureScreen';
        } else {
            console.log('AR Scene has not been initialized.');
        }
    }

    captureScreenSuccess(path:string):void {
        $('#capture-btn').attr('src', 'assets/buttons/ICON-TAB-CAPTURE-0.png');
        console.log('Image saved at ' + path);
    }

    captureScreenFail(errorMessage:string):void {
        $('#capture-btn').attr('src', 'assets/buttons/ICON-TAB-CAPTURE-0.png');
        alert('Unable to save image. Error: ' + errorMessage);        
    }


    updateDistanceToUserValues():void {
        for(let i = 0; i < this.markerList.length; i++){
            this.markerList[i].distanceToUserM = this.markerList[i].markerObject.locations[0].distanceToUser();
        }
    }

    updateRangeValues():void {
        let sliderVal = $('#obj-dist-range').val();
        let maxRangeMeters = Math.round(this.getMaxDistance() * (sliderVal / 1000));
        let placesInRange = this.getNumberOfVisiblePlacesInRange(maxRangeMeters);
        
        AR.context.scene.cullingDistance = Math.max(maxRangeMeters, 1);
        PoiRadar.setMaxDistance(Math.max(maxRangeMeters, 1));
    }

    getNumberOfVisiblePlacesInRange(maxRangeMeters:number):number {
        this.markerList.sort(this.sortByDistanceSorting);
        for(let i = 0; i < this.markerList.length; i++){
            if(this.markerList[i].distanceToUserM > maxRangeMeters){
                return i;
            }
        }

        return this.markerList.length;
    }

    setIsOpeningMarker(isOpeningMarker:boolean):void {
        this.isOpeningMarker = isOpeningMarker;
        console.log('Is Opening Marker? ', this.isOpeningMarker);
    }

    updateStatusMessage(message:string, isWarning:boolean):void {
        // Currently not using these status messages, the HTML has been commented out. 
        // Maybe we can use this some day though. 
        let themeToUse = isWarning ? 'e' : 'c'; 
        let iconToUse = isWarning ? 'alert' : 'info';

        $('#status-message').html(message);
        $('#popupInfoButton').buttonMarkup({
            theme: themeToUse
        });
        $('#popupInfoButton').buttonMarkup({
            icon: iconToUse
        });
    }

    locationChanged(lat:number, lon:number, alt:number, acc:number):void {

        // If a request to the server has not already been made then do so, otherwise update marker distances 

        if(!this.initiallyLoadedData) {
            this.requestDataFromServer(lat, lon);
            this.initiallyLoadedData = true;
        } else {
            if(this.locationUpdateCounter === 0) {
                this.updateDistanceToUserValues();
            }
        }
        
        this.locationUpdateCounter = (++this.locationUpdateCounter % this.updatePlacemarkDistancesEveryXLocationUpdates);

    }

    // called when a merker is selected in the AR scene
    onMarkerSelected(marker:Marker, poiData:any):void {
        if(this.isOpeningMarker){ 
            console.log('cannot open a new page right now');
            return; 
        };
        console.log('Opening a new page');
        this.setIsOpeningMarker(true);
        this.showLoadingIndicator();
        setTimeout(() => {
            this.openActivities(true, poiData);            
        }, 1500);
    }

    // Screen was clicked but no geo-object was hit
    onScreenClick():void {
        this.openActivities(false, {});
    }

    getMaxDistance():number {
        this.markerList.sort(this.sortByDistanceSortingDescending);
        let maxDistanceMeters = this.markerList[0].distanceToUserM; 

        return maxDistanceMeters * 1.1;
    }

    loadPoisFromJsonData(poiData:any):void {

        // Iterate through server response and create POI markers 

        PoiRadar.show();
        $('#radarContainer').unbind('click');
        $('#radarConatainer').click(PoiRadar.clickedRadar); 

        this.markerList = []; 

        for(let i = 0; i < poiData.length; i++){
            let singlePoi = {
                "id": poiData[i].id,
                "latitude": parseFloat(poiData[i].lat),
                "longitude": parseFloat(poiData[i].lng),
                "altitude": AR.CONST.UNKNOWN_ALTITUDE,
                "title": poiData[i].title,
                "address": poiData[i].address,
                "phoneNumber": poiData[i].tel,
                "source": poiData[i].type,
                "category_type": poiData[i].category_type
            }
            this.markerList.push(new Marker(singlePoi)); 
        }
    }

    requestDataFromServer(lat:number, lon:number){

        if(this.isRequestingData) return;

        this.isRequestingData = true;
        let serverURL = `https://dev1.remakeworld.com/town/map/get_places_for_ar/?lat=${lat}&lng=${lon}`;
        let jqxhr = $.getJSON(serverURL, (data:any, textStatus:string, jqxhr:JQueryXHR) => {
            this.loadPoisFromJsonData(data);
        }).fail((xhr, textStatus, errorThrown) => {
            alert('Error loading Pois');
        }).always(() => {
            this.isRequestingData = false;
            setTimeout(() => {
                this.hideLoadingIndicator(); 
            }, 1500);
            $('#refresh-places-btn').prop('disabled', false); 
        });
    }

    sortByDistanceSorting(a:Marker, b:Marker):number{
        return a.distanceToUserM - b.distanceToUserM; 
    }

    sortByDistanceSortingDescending(a:Marker, b:Marker):number {
        return b.distanceToUserM - a.distanceToUserM; 
    }

    refreshPlaces():void {
        this.showLoadingIndicator();
        $('#refresh-places-btn').prop('disabled', true);
        this.removePOIS();

        // assume that this.lat and this.lon are set
        this.requestDataFromServer(this.lat, this.lon);
    }

    removePOIS():void {
        for(let i = 0; i < this.markerList.length; i++){
            this.markerList[i].markerObject.drawables.removeCamDrawable(1);
            this.markerList[i].markerObject.drawables.removeIndicatorDrawable(0);
            this.markerList[i].markerObject.drawables.removeRadarDrawable(0);       
        }
        AR.context.destroyAll();
    }

    setLatLon(lat:number, lon:number):void{
        this.lat = lat;
        this.lon = lon;
    }

    openActivities(fromMarker:boolean, poiData?:any):void {
        var obj; 
        if(fromMarker) {
            obj = {
                fromMarker: true,
                lat: poiData.latitude,
                lng: poiData.longitude,
                address: poiData.address,
                name: poiData.title || poiData.name,
                phone: poiData.phoneNumber/* || 'No phone number found'*/,
                id: poiData.id,
                cid: 1, // use this until remake api is integrated 
                ppid: 1,
                source: poiData.source
            }
        } else {
            obj = {
                fromMarker: false,
                userLat: this.lat,
                userLng: this.lon,
                //userCountry: User.country,
                cid: 1, // use this until remake api is integrated 
                ppid: 1
            };
        }
        let url = `architectsdk://button?action=openActivities?obj=${JSON.stringify(obj)}`;
        document.location.href = url;
    }
}

let scene = new ARScene(); 

AR.context.onLocationChanged = function(lat:number, lon:number, alt:number, accuracy:number):void {
    scene.locationChanged(lat, lon, alt, accuracy); 
    scene.setLatLon(lat, lon);
};

// AR.context.onScreenClick = scene.onScreenClick; 