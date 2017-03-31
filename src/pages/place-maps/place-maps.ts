import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the PlaceMaps page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-place-maps',
  templateUrl: 'place-maps.html'
})
export class PlaceMapsPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello PlaceMapsPage Page');
  }

}
