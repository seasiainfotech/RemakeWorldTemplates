/// <reference path="../../app/WikitudePlugin.d.ts" />
import {Component} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {PlacePage} from '../place/place';

@Component({
    selector: 'page-wikitude',
    templateUrl: 'wikitude.html'
})
export class Wikitude {
    private navCtrl:NavController;
    private isLoaded:boolean; 
    private wikitudeHasLoaded:boolean = false;
    constructor(public platform:Platform, private nav:NavController) {
        this.navCtrl = nav;
    }

    ionViewDidLoad() {
        console.log('Wikitude.ts ionViewDidLoad');
        this.platform.ready().then(()=> {
            this.isLoaded = true;
            this.loadWikitude();    
        }); 
    }

    loadWikitude() {
        if(!this.isLoaded) {
            console.log('Not loaded');
            return;
        }
        var startupConfiguration: any = {"camera_position": "back"};
        var self = this;
        WikitudePlugin.loadARchitectWorld(
            function (success) {
                console.log("ARchitect World loaded successfully.");
                self.wikitudeHasLoaded = true;
            },
            function (fail) {
                console.log("Failed to load ARchitect World!");
            },
            "www/assets/wikitude_world/index.html",
            ["geo"],
            <JSON>startupConfiguration
        );

        WikitudePlugin.onPause = function(){
            console.log('Wikitude onPause called');
        };

        WikitudePlugin.onBackButton = function(){
            console.log('Wikitude onBackButton called');
        };

        WikitudePlugin.onResume = function(){
            console.log('Wikitude onResume called');
        };

        WikitudePlugin.onWikitudeError = function(errorMessage){
            console.log('Wikitude onWikitudeError called');
            console.log(errorMessage);
        };

        WikitudePlugin.onWikitudeOK = function(){
            console.log('Wikitude onWikitudeOK called');
        };
        
        WikitudePlugin.setOnUrlInvokeCallback(function(url){
            if(url.indexOf('openActivities') > -1){
                let dict = {
                    '%7B': '{',
                    '%7D': '}',
                    '%22': '"',
                    '%20': ' '
                };
                url = url.replace(/%7B|%7D|%22|%20/gi, match => {
                    return dict[match]; 
                });
                let params = url.split('obj=');
                console.log('stringified json');
                console.log(params[1]);
                console.log('parsing JSON');
                let place = JSON.parse(params[1]);
                console.log('parsed JSON');
                console.log(place);
                console.log('hiding wikitude');
                WikitudePlugin.close();
                console.log('Wikitude hidden');
                self.navCtrl.push(PlacePage, place);
            } else {
            }

            if (url.indexOf('captureScreen') > -1) {
                WikitudePlugin.captureScreen(
                    function (absoluteFilePath) {
                        console.log("snapshot stored at:\n" + absoluteFilePath);
                        // this an example of how to call a function in the Wikitude SDK (Ionic2 app --> Wikitude SDK)
                        WikitudePlugin.callJavaScript(
                            `scene.captureScreenSuccess("${absoluteFilePath}");`
                        );
                    },
                    function (errorMessage) {
                        WikitudePlugin.callJavaScript(
                            `scene.captureScreenFail("${errorMessage}");`
                        );
                    },
                    true, null
                );
            } else {
            }
        });
    }

    closeWikitude() {
        WikitudePlugin.close();
    }

    ionViewWillEnter() {
        console.log('Wikitude.ts ionViewWillEneter');
    }

    ionViewDidEnter() {
        this.loadWikitude();
    }

    ionViewWillLeave() {
        console.log('Wikitude.ts ionViewWillLeave');
        // console.log('hiding wikitude');
        //WikitudePlugin.hide();
    }

    ionViewDidLeave() {
        console.log('Wikitude.ts ionViewDidLeave');
    }

    ionViewWillUnload() {
        console.log('Wikitude.ts ionViewWillUnload');
    }
}