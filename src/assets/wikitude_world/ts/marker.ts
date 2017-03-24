/// <reference path="../typings/architect.d.ts" />

class Marker {
    poiData:any;
    isSelected:boolean;
    altitude:number;
    kMarker_AnimationDuration_ChangeDrawable:number = 500;
    kMarker_AnimationDuration_Resize:number = 1000;
    markerLocation:AR.GeoLocation; 
    markerDrawable_idle:AR.ImageDrawable;
    labelName:AR.Label;
    labelCityState: AR.Label;
    labelDistance: AR.Label;
    labelImgDrawable: AR.ImageDrawable;
    radarCircle: AR.ImageDrawable;
    radarDrawables: AR.ImageDrawable[];
    markerObject: AR.GeoObject;
    distanceToUserM: number; // meters
    distanceToUserF: number; // feet
    distanceToUserMi: number; // miles
    markerAsset: AR.ImageResource; 
    markerDepth: number;

    hasDeal: boolean = true;
    deal: AR.ImageDrawable;

    hasDollar: boolean = true;
    dollar: AR.ImageDrawable;

    hasHeart: boolean = true;
    heart: AR.ImageDrawable;

    hasStar: boolean = true; 
    star: AR.ImageDrawable;

    constructor(poiData:any){
        this.poiData = poiData;
        this.isSelected = false;
        this.markerLocation = new AR.GeoLocation(this.poiData.latitude, this.poiData.longitude, this.poiData.altitude);
        this._determineDistance();
        this._determineAltitude();
        this._determineDepth();
        this._determineMarkerAsset(this.poiData.source, this.poiData.category_type);        
        this._createMarker();
    }

    private _determineDistance():void {
        this.distanceToUserM = this.markerLocation.distanceToUser();
        this.distanceToUserF = this.distanceToUserM / 0.3048; 
        this.distanceToUserMi = this.distanceToUserM / 1609; 
    }

    private _randomNumber(min:number, max:number):number {
        return Math.random() * (max - min) + min;
    }

    private _determineAltitude():void {
        this.altitude = this._randomNumber(-6, 6);
    }

    private _determineDepth():void {
        let depth:number = 0;
        if(this.distanceToUserM < 501)
            depth = this._randomNumber(-1, 0);
        else if (this.distanceToUserM < 1001)
            depth = this._randomNumber(-6, -5);
        else if (this.distanceToUserM < 1610)
            depth = this._randomNumber(-9, -8);

        this.markerDepth = depth; 
    }

    private _determineMarkerAsset(source:string, category_type:string):void {
        if(source === 'google_places' || source === 'factual'){
            this.markerAsset = new AR.ImageResource('assets/markers/icon-marker-place-noclaim.png');
        } else {
            if(category_type === 'place'){
                this.markerAsset = new AR.ImageResource('assets/markers/icon-marker-place-claim.png');
            } else if (category_type === 'thing'){
                this.markerAsset = new AR.ImageResource('assets/markers/icon-marker-obj-claim.png');
            }
        }
    }

    private _createMarker():void{
        this.markerDrawable_idle = new AR.ImageDrawable(this.markerAsset, 1, {
            zOrder: 2,
            opacity: 1,
            translate: {
                x: 1,
                y: this.altitude + 0.8,
                z: this.markerDepth
            }
        });

        this.labelName = new AR.Label(this.poiData.title.trunc(14), 0.5, {
            zOrder: 1, 
            translate: {
                x: -0.45,
                y: this.altitude + 1.7,
                z: this.markerDepth
            },
            horizontalAnchor: AR.CONST.HORIZONTAL_ANCHOR.LEFT,
            style: {
                textColor: '#000000',
                fontStyle: AR.CONST.FONT_STYLE.NORMAL
            }
        });

        // this.labelCityState = new AR.Label(this.poiData.address.trunc(16), 0.4, {
        //     zOrder: 1,
        //     translate: {
        //         x: -0.45, 
        //         y: this.altitude + 1.45,
        //         z: this.markerDepth
        //     },
        //     horizontalAnchor: AR.CONST.HORIZONTAL_ANCHOR.LEFT,
        //     style: {
        //         textColor: '#000000'
        //     }
        // });

        let distanceToUserValue:string = this.distanceToUserMi < 0.5 ? `${Math.ceil(this.distanceToUserF)} ft` : `${this.distanceToUserMi.toFixed(2)} mi`;
        
        this.labelDistance = new AR.Label(`(${distanceToUserValue})`, 0.3, {
            zOrder: 1, 
            translate: {
                x: -0.45,
                y: this.altitude + 1.1,
                z: this.markerDepth
            },
            horizontalAnchor: AR.CONST.HORIZONTAL_ANCHOR.LEFT,
            style: {
                textColor: '#000000'
            }
        });

        this.labelImgDrawable = new AR.ImageDrawable(new AR.ImageResource('assets/labels/label_big.png'), 1.3, {
            zOrder: 0, 
            opacity: 1, 
            translate: {
                x: 1.1, 
                y: this.altitude + 1.45,
                z: this.markerDepth
            },
            onClick: () => {
                scene.onMarkerSelected(this, this.poiData);
            } 
        });

        this.radarCircle = new AR.ImageDrawable(new AR.ImageResource('assets/radar/radar-loc.png'), 0.3, {
            zOrder: 5,
            opacity: 0.8
        });

        this.deal = new AR.ImageDrawable(new AR.ImageResource('assets/markers/icon-label-activity-deal.png'), 0.3, {
            enabled: this.hasDeal,
            zOrder: 6,
            translate: {
                x: 1.7,
                y: this.altitude + 1.1,
                z: this.markerDepth
            }
        });
        this.dollar = new AR.ImageDrawable(new AR.ImageResource('assets/markers/icon-label-activity-dollar.png'), 0.3, {
            enabled: this.hasDollar,            
            zOrder: 7,
            translate: {
                x: 2,
                y: this.altitude + 1.1,
                z: this.markerDepth
            }
        });
        this.heart = new AR.ImageDrawable(new AR.ImageResource('assets/markers/icon-label-activity-heart.png'), 0.3, {
            enabled: this.hasHeart,
            zOrder: 8,
            translate: {
                x: 2.3,
                y: this.altitude + 1.1,
                z: this.markerDepth
            }
        });
        this.star = new AR.ImageDrawable(new AR.ImageResource('assets/markers/icon-label-activity-star.png'), 0.3, {
            enabled: this.hasStar,
            zOrder: 9,
            translate: {
                x: 2.6,
                y: this.altitude + 1.1,
                z: this.markerDepth
            }
        });        

        this.radarDrawables = [];
        this.radarDrawables.push(this.radarCircle);

        this.markerObject = new AR.GeoObject(this.markerLocation, {
            drawables: {
                radar: this.radarDrawables,
                cam: [
                    this.markerDrawable_idle,
                    this.labelName,
                   // this.labelCityState,
                    this.labelDistance,
                    this.labelImgDrawable,
                    this.deal,
                    this.dollar, 
                    this.heart, 
                    this.star
                ]
            }
        });
    }
    
}

