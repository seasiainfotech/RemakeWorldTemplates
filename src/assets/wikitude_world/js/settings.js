var Settings = {
	objectDistance: 100, // default to meters 
	visibleObjects: 50,
	displayRadar: true,
	humanContributed: true,
	officialPlacesAndPOIS: false,
    poiSource: 'factual',
	cameraGenerated: true,
	preferMeters: true,
	radiusM: 1609.34,
	whiteIcons: true,
	openPanel: function() {
		$('#panel-settings').panel('open', 123);
	},
	changeObjectDistance: function(objectDistance) {
		this.objectDistance = objectDistance;
	},
	changeVisibleObjects: function(visibleObjects) {
		this.visibleObjects = visibleObjects;
	},
	changeHumanContributed: function(humanContributed) {
		this.humanContributed = humanContributed;
	},
	changePlacesAndPOIS: function(officialPlacesAndPOIS) {
		this.officialPlacesAndPOIS = officialPlacesAndPOIS;
	},
	changeCameraGenerated: function(cameraGenerated) {
		this.cameraGenerated = cameraGenerated; 
	},
	changeDisplayRadar: function(displayRadar) {
		this.displayRadar = displayRadar;
		//alert('clicked!')
		//alert(this.displayRadar);
		if(!this.displayRadar){
			PoiRadar.hide();
		} else {
			PoiRadar.show();
		}
		//console.log($('#radar-container')[0].style);
	},
    changePOISource: function(poiSource) {
        this.poiSource = poiSource ? 'google' : 'factual';
        Remake = poiSource ? GOOGLE_PLACES : FACTUAL_POI;
        if(this.poiSource === 'google'){
            $('#google-label').addClass('bold');
            $('#factual-label').removeClass('bold');
        } else {
            $('#factual-label').addClass('bold');
            $('#google-label').removeClass('bold');
        }

        console.log('POI Source: ' + Remake.SERVICE);
        World.removePOIS();
        World.requestDataFromServer(User.lat, User.lon);

    },
	changePreferredDistUnits: function(preferMeters) {
		this.preferMeters = !preferMeters;
		console.log('preferMeters', this.preferMeters);
		if(!this.preferMeters){
			$('#distance-units').html('meters');
			$('#meters-label').addClass('bold');
			$('#feet-label').removeClass('bold');
		} else {
			$('#distance-units').html('feet');
			$('#meters-label').removeClass('bold');
			$('#feet-label').addClass('bold');
		}
		World.refreshPlaces();
	},
	changeMenuTransparency: function(alphaVal) {
		console.log('alphaVal', alphaVal);
		$('.black').css('background-color', `rgba(0, 0, 0, ${alphaVal})`);
	},
	changeRadius: function(radius){
		this.radius = radius;
		console.log(this.radius);
		World.requestDataFromServer(User.lat, User.lon);
	},
	toggleIconColors: function() {
		console.log('before toggle - white icons', this.whiteIcons);
		this.whiteIcons = !this.whiteIcons;
		console.log('after-toggle - white icons', this.whiteIcons) 
		if(this.whiteIcons){
			$('#activities-btn').attr('src', 'assets/buttons/ICON-TAB-ACTIVITIES-0.png');
			$('#you-btn').attr('src', 'assets/buttons/ICON-TAB-CIRCLE-0.png');
			$('#capture-btn').attr('src', 'assets/buttons/ICON-TAB-CAPTURE-0.png');
		} else {
			$('#activities-btn').attr('src', 'assets/buttons/ICON-TAB-ACTIVITIES-1.png');
			$('#you-btn').attr('src', 'assets/buttons/ICON-TAB-YOU-1.png');
			$('#capture-btn').attr('src', 'assets/buttons/ICON-TAB-CAPTURE-1.png');
		}
		console.log('white icons?', this.whiteIcons);
	},
	milesToMeters: function(miles) {
		return miles * 1609.344;
	},
	metersToMiles: function(meters) {
		return meters * 0.000621371192;
	},
	metersToFeet: function(meters){
		return meters / 0.3048;
	},
    testURLParams: function() {
        document.location = 'architectsdk://button?action=testURLParams&test1=test1&test2=test2'; 
    }
}
