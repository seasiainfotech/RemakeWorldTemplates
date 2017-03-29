import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {Wikitude} from "../pages/wikitude/wikitude";
import * as Factual from 'factual-api';
import {PlaceObjectPage} from "../pages/place-object/place-object";
import {PlacePage} from "../pages/place/place";
import {AboutPageTemp} from "../pages/about temp/about";
import{ResultPagePage} from "../pages/result-page/result-page"

@Component({
    template: `<ion-nav #rootNavController [root]="rootPage"></ion-nav>`
})
export class MyApp {
    rootPage:any = ResultPagePage;
    constructor(platform: Platform) {

        platform.ready().then(() => {

            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.

            //StatusBar.styleDefault();
            StatusBar.styleBlackTranslucent();
            //StatusBar.backgroundColorByHexString("#0000ff");


            WikitudePlugin._sdkKey = "yfV0P8M2IjAPhEaOdPwHkPHYXKWrkV3s91BgYBHzZ5M9TTobKAX1mPrp3FLlCmlY2so2dCp1EfnuFjDeEqVHGiFSESYLlAV6k+U7Y0OvnSUXju8iah7VlU1Ooj2sphd4KICvWNpSGUUvK86ZDCWQ3yqtUb1aeoT8DdwRK8gRF/BTYWx0ZWRfX+yxDJ0CFvtm8BJCipP7y+jyYIEK9DZLiJMauacP70qFV3uaYO4nLF6CQWtS1e5D2v8YtjZ9nGwhtHMGFMcPHrldbsxJoqX8PT5XQIfknq/muZNOOpo9dTIcewm6y0cs4wWqV6BcdJWnvhj96JKy3U67Odmt0uwmo+ZpID4spOgUUy15uJ8mORL4cazSBfghxOPOqcp6brfUkVWBH5/0mVrRxp7uxiJcOyDTuYkKmkAYmRb/RRj4FMI6dScwVvOCtzkOyaPwUuHT4vWL5p9d0vqDlda4NmJfQJ3JCaGXo1fDQnVo3peavOWalV8N84u6J/yQRTdBqW13yBxue5NdcDKiGpapJ3jCwlsk2JDkP2QRADwWUTJhfO60UbC4AcllJ/MfOo8eG5ER7OewdrTf15UzVIuyfDY6WmMbw9fr1ePfvYH7N4n7FqfgI1LQsm8/INLo+S2/XMK2TAYyjqiYvacKXiFxz0AuKBC4oZvfVT/P8aMX4fRib8c=";

            let factual_api_key = "eD8Mb1k58lYHMk06T5bnLBGLZHCjLKpRCSpiObkO";
            let factual_api_secret = "OpjfITQOveGSTZMtfjESBRXVtB04RYM8kl3CJIgr";
            let factual = new Factual(factual_api_key, factual_api_secret);

            WikitudePlugin.isDeviceSupported(
                function (success) {
                    console.log("Your platform supports AR/Wikitude. Have fun developing!!");
                },
                function (fail) {
                    console.log("Your platform failed to run AR/Wikitude: " + fail);
                },
                [WikitudePlugin.FeatureGeo] // or WikitudePlugin.Feature2DTracking
            );

            /** The Wikitude AR View creates it's own context. Communication between the main Ionic App and Wikitude SDK works
             * through the function below for the direction Ionic2 app --> Wikitude SDK
             * For calls from Wikitude SDK --> Ionic2 app see the captureScreen example in
             * WikitudeIonic2StarterApp/www/assets/3_3dModels_6_3dModelAtGeoLocation/js/3dmodelatgeolocation.js*/
            // set the function to be called, when a "communication" is indicated from the AR View

            // WikitudePlugin.setOnUrlInvokeCallback(function (url){});

            /**
             * Define the generic ok callback
             */

            WikitudePlugin.onWikitudeOK = function () {
                console.log("Things went ok.");
            }

            /**
             * Define the generic failure callback
             */
            WikitudePlugin.onWikitudeError = function () {
                console.log("Something went wrong");
            }

            // Just as an example: set the location within the Wikitude SDK, if you need this (You can get the geo coordinates by using ionic native
            // GeoLocation plugin: http://ionicframework.com/docs/v2/native/geolocation/
            //WikitudePlugin.setLocation(47, 13, 450, 1);

            /* for Android only
             WikitudePlugin.setBackButtonCallback(
             () => {
             console.log("Back button has been pressed...");
             }
             );
             */

        });
    }
}
