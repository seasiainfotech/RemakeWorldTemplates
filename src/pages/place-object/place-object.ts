import { Component } from '@angular/core';
import { NavController, NavParams,ViewController,Platform } from 'ionic-angular';
import {GoogleMap, GoogleMapsEvent, GoogleMapsLatLng, Geolocation, GoogleMapsAnimation} from 'ionic-native';
import {PlaceInfoService} from "../../providers/place-info-service";
import {AdService} from "../../providers/ad-service";
import {IAd} from "../place/iad";
import {IPlace} from "../place/iplace";
import {Response} from '@angular/http';

/*
  Generated class for the PlaceObject page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-place-object',
  templateUrl: 'place-object.html'
})
export class PlaceObjectPage {
  private map: GoogleMap;
  showAbout:string;
  showComments:string;
  showPlaceArray:string;
  showCommentsCount:string;
  public top_mobile_ad: IAd;
  public in_stream_mobile_ad: IAd;
  public mobile_display_ad_small: IAd;
  public mobile_display_ad_large: IAd;

  public place: IPlace;
  public showAboutSpinner: boolean;
  public showAboutProgressReport: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,private adService: AdService,
              private PlaceInfoService: PlaceInfoService,public viewCtrl: ViewController,private platform: Platform,  ) {


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

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
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

}
