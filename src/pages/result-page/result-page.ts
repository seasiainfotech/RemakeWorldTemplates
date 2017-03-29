import {Component, OnInit} from '@angular/core';
import {Platform, NavController, ViewController, NavParams} from 'ionic-angular';
import {GoogleMap, GoogleMapsEvent, GoogleMapsLatLng, Geolocation, GoogleMapsAnimation} from 'ionic-native';
import {AdService} from "../../providers/ad-service";
import {Observable, Subscriber} from "rxjs";
import 'rxjs/add/operator/catch';

import {IAd} from "../place/iad";
import {IPlace} from "../place/iplace";
import {ClaimPage} from "../claim/claim";
import {AboutPage} from "../about/about";
import {PlaceProgressReportPage} from "../place-progress-report/place-progress-report";
import {Response} from '@angular/http';
import {PlaceInfoService} from "../../providers/place-info-service";

import {PlacePage} from "../place/place";


/*
 Generated class for the ResultPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-result-page',
  templateUrl: 'result-page.html'
})
export class ResultPagePage extends PlacePage {
  private map: GoogleMap;

  time = new Observable<string>((observer: Subscriber<string>) => {
    setInterval(() => observer.next(new Date().toString()), 1000);
  });
  showAbout: string;
  showComments: string;
  showPlaceArray: string;
  showCommentsCount: string;
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
    this.showAbout = navParams.get("about");
    this.showPlaceArray = navParams.get("place");
    this.showComments = navParams.get("comments");
    this.showCommentsCount = navParams.get("commentsCount");
  }


  ionViewDidLoad() {
    console.log('Hello ResultPagePage Page');

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
