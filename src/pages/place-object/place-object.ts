import { Component } from '@angular/core';
import { NavController, NavParams,ViewController,Platform } from 'ionic-angular';
import {GoogleMap, GoogleMapsEvent, GoogleMapsLatLng, Geolocation, GoogleMapsAnimation} from 'ionic-native';
import {PlaceInfoService} from "../../providers/place-info-service";
import {AdService} from "../../providers/ad-service";
import {IAd} from "../place/iad";
import {IPlace} from "../place/iplace";
import {Response} from '@angular/http';
import {PlacePage} from "../place/place";

/*
  Generated class for the PlaceObject page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-place-object',
  templateUrl: 'place-object.html'
})
export class PlaceObjectPage extends PlacePage {
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

  constructor(private navParams: NavParams,
              private adService: AdService,
              private PlaceInfoService: PlaceInfoService,
              public viewCtrl: ViewController,
              private platform: Platform,
              public navCtrl: NavController) {

    super(navParams, adService, PlaceInfoService, viewCtrl, platform, navCtrl);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
  }

  dismiss() {
    super.dismiss();
  }

  ngOnInit() {
    console.log(this.place);
    super.getAds();
    WikitudePlugin.callJavaScript(
      `scene.hideLoadingIndicator();`
    );
    WikitudePlugin.callJavaScript(
      `scene.setIsOpeningMarker(${false});`
    );
  }

}
