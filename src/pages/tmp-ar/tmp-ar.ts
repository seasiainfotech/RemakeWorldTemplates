import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {PlacePage} from "../place/place";
import {IPlace} from "../place/iplace";

/*
 Generated class for the TmpAr page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-tmp-ar',
    templateUrl: 'tmp-ar.html'
})
export class TmpArPage {

    public placeEx: IPlace;

    constructor(public navCtrl: NavController) {
    }

    ionViewDidLoad() {
        console.log('Hello TmpArPage Page');

        this.placeEx = {
            name: 'Edge Water Park',
            address: '322 Seward Park Ave So. Seattle, WA 98118',
            phone: '206-294-5839',
            lat: 12,
            lng: 11,
            ppid: 1,
            cid: 1,
            id:46,
            source:'remake'
        };
    }

    goToOverlay(place: IPlace) {
        this.navCtrl.push(PlacePage, place);
    }
}
