import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the Claim page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-claim',
  templateUrl: 'claim.html'
})
export class ClaimPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello ClaimPage Page');
  }

}
