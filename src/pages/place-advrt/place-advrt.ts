import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the PlaceAdvrt page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-place-advrt',
  templateUrl: 'place-advrt.html'
})
export class PlaceAdvrtPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello PlaceAdvrtPage Page');
  }

}
