import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {IPlace} from "../place/iplace";
import {PlaceInfoService} from "../../providers/place-info-service";
import {IMG_SERVER_URL} from "../../providers/config";

/*
 Generated class for the PlaceProgressReport page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-place-progress-report',
    templateUrl: 'place-progress-report.html'
})
export class PlaceProgressReportPage {

    public place: IPlace;

    public html : string;
    public imgServerUrl : string;

    constructor(private navParams: NavParams,
                public navCtrl: NavController) {

        this.place = this.navParams.data.place;
        this.html = this.navParams.data.html;
        this.imgServerUrl = IMG_SERVER_URL;
    }

    ionViewDidLoad() {
    }

    ngOnInit() {
    }

}
