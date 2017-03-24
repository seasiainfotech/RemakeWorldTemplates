import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the HelloIonic page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello HelloIonicPage Page');
  }

}
