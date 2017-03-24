/// <reference path="../../app/WikitudePlugin.d.ts" />
import {Component, OnInit} from '@angular/core';
import {Platform, NavController, ViewController, NavParams} from 'ionic-angular';
import {GoogleMap, GoogleMapsEvent, GoogleMapsLatLng, Geolocation, GoogleMapsAnimation} from 'ionic-native';
import {AdService} from "../../providers/ad-service";
import {Observable, Subscriber} from "rxjs";
import 'rxjs/add/operator/catch';

import {IAd} from "./iad";
import {IPlace} from "./iplace";
import {ClaimPage} from "../claim/claim";
import {AboutPage} from "../about/about";
import {PlaceProgressReportPage} from "../place-progress-report/place-progress-report";
import {Response} from '@angular/http';
import {PlaceInfoService} from "../../providers/place-info-service";




/*
 Generated class for the Place page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-place',
    templateUrl: 'place.html',
    providers: [PlaceInfoService]

})
export class PlacePage implements OnInit {

    private map: GoogleMap;

    time = new Observable<string>((observer: Subscriber<string>) => {
        setInterval(() => observer.next(new Date().toString()), 1000);
    });

    public top_mobile_ad: IAd;
    public in_stream_mobile_ad: IAd;
    public mobile_display_ad_small: IAd;
    public mobile_display_ad_large: IAd;

    public place: IPlace;
    public showAboutSpinner: boolean;
    public showAboutProgressReport: boolean;


    constructor(
        private navParams: NavParams,
        private adService: AdService,
        private PlaceInfoService: PlaceInfoService,
        public viewCtrl: ViewController,
        private platform: Platform,
        public navCtrl: NavController) {

        let place = this.navParams.data;
        this.place = place;
        this.showAboutSpinner = false;
        this.showAboutProgressReport = false;

        console.log('in activities page');

        this.platform.ready().then(() => {
            GoogleMap.isAvailable().then(() => {
                this.map = new GoogleMap('map_canvas');
                this.map.one(GoogleMapsEvent.MAP_READY).then((data: any) => {
                    Geolocation.getCurrentPosition().then(pos => {
                        let myPosition = new GoogleMapsLatLng(this.place.lat, this.place.lng);
                        this.map.animateCamera({
                            target: myPosition,
                            zoom: 10
                        });

                        this.map.addMarker({
                            'position': myPosition,
                            'animation': GoogleMapsAnimation.BOUNCE,
                            'title': 'you are here!',
                            'icon': {
                                'url': 'www/assets/wikitude_world/assets/markers/google_place_35.png'
                            }
                        });

                    });
                });
            }).catch(() => {
                console.log('GoogleMaps Native SDK is not available');
            });
        });
    }

    dismiss() {
        this.viewCtrl.dismiss();
        //this.navCtrl.pop();
    }

    ngOnInit() {
        console.log(this.place);
        this.getAds();
        WikitudePlugin.callJavaScript(
            `scene.hideLoadingIndicator();`
        );
        WikitudePlugin.callJavaScript(
            `scene.setIsOpeningMarker(${false});`
        );
    }

    getAds() {
        this.adService.getUnclaimed()
            .subscribe(
                (ads) => {
                    for (let ad of ads.banners) {
                        switch (ad.rotation_id) {
                            case
                            '33':
                                this.top_mobile_ad = {id: ad.rotation_id, description: ad.description};
                                break;
                            case
                            '35':
                                this.in_stream_mobile_ad = {id: ad.rotation_id, description: ad.description};
                                break;
                            case
                            '36':
                                this.mobile_display_ad_large = {id: ad.rotation_id, description: ad.description};
                                break;
                            case
                            '37':
                                this.mobile_display_ad_small = {id: ad.rotation_id, description: ad.description};
                                break;
                        }
                    }
                },
                (err) => {
                    this.handleError(err);
                });
    }

    private handleError(err) {
        if (err instanceof Response) {
            console.log(err.json().error || 'backend server error');
        } else {
            if (err.message) {
                console.log('backend server response error :' + err.message);
            } else {
                console.log('backend server error');
            }
        }
    }

    claimIt(){
        this.navCtrl.push(ClaimPage);
    }

    aboutIt(place: IPlace) {
        this.showAboutSpinner = true;
        this.PlaceInfoService
            .getPlaceAbout(this.place.id, 0)
            .subscribe(result => {
                    let about = result.wiki_content.text;
                    let comments = [];
                    let commentsCount = 0;
                    if (result.comments) {
                        comments = result.comments;
                    }
                    if (result.commentsCount) {
                        commentsCount = result.commentsCount;
                    }
                    this.showAboutSpinner = false;
                    this.navCtrl.push(AboutPage, {place, comments, about, commentsCount});
                },
                (err) => {
                    this.handleError(err);
                },
                () => {
                    this.showAboutProgressReport = false;
                }
            );
    }

    progressReport(place: IPlace) {
        this.showAboutProgressReport = true;
        this.PlaceInfoService
            .getPlaceProgressReport(this.place.id)
            .subscribe(progress_report => {
                    this.showAboutProgressReport = false;
                    let html = progress_report.json.html;
                    this.navCtrl.push(PlaceProgressReportPage, {place, html});
                },
                (err) => {
                    this.handleError(err);
                },
                () => {
                    this.showAboutProgressReport = false;
                }
            );

    }
}