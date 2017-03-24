/// <reference path="../typings/architect.d.ts" />

class Radar{
    constructor(){
		// console.log('An instance of Class Radar has been created.');
    }

    hide():void {
        AR.radar.enabled = false;
    }

    show():void {

        //div defined in index.html
        AR.radar.container = document.getElementById('radarContainer');

        //set the background image for the radar
        AR.radar.background = new AR.ImageResource("assets/radar/radar-forward.png");

		// set the north-indicator image for the radar (not necessary if you don't want to display a north-indicator)
		AR.radar.northIndicator.image = new AR.ImageResource("assets/radar/radar-compass.png");

		// center of north indicator and radar-points in the radar asset, usually center of radar is in the exact middle of the bakground, meaning 50% X and 50% Y axis --> 0.5 for centerX/centerY
		AR.radar.centerX = 0.5;
		AR.radar.centerY = 0.5;

		AR.radar.radius = 0.3;
		AR.radar.northIndicator.radius = 0.0;

		AR.radar.enabled = true;
	}

	updatePosition():void {
		if (AR.radar.enabled) {
			AR.radar.notifyUpdateRadarPosition();
		}
	}

	// you may define some custom action when user pressed radar, e.g. display distance, custom filtering etc.
	clickedRadar():void {
		//Settings.openPanel();
		alert('Clicked radar!');
	}

	setMaxDistance(maxDistanceMeters:number):void {
		AR.radar.maxDistance = maxDistanceMeters;
	}

}

var PoiRadar = new Radar();
