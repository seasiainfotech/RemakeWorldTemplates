import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {IPlace} from "../place/iplace";
import {IPlaceComment} from "../place/iplace_comment";
import {IMG_SERVER_URL} from "../../providers/config";
import {PlaceInfoService} from "../../providers/place-info-service";


@Component({
    selector: 'page-about',
    templateUrl: 'about.html',
    providers: [PlaceInfoService]
})

export class AboutPage {

    public place: IPlace;

    public about : string;
    public comments : Array<IPlaceComment>;
    public imgServerUrl : string;
    public commentsCount:number;
    public commentOffset :number;
    public showInfineScroll : boolean;


    constructor(private navParams: NavParams,
                private PlaceInfoService: PlaceInfoService,
                public navCtrl: NavController)
    {
        this.place = this.navParams.data.place;
        this.about = this.navParams.data.about;
        this.commentsCount = this.navParams.data.commentsCount;
        this.comments = this.navParams.data.comments;
        this.imgServerUrl = IMG_SERVER_URL;
        this.commentOffset = this.comments.length;
        this.showInfineScroll = true;
        this.checkCommentsOffset();
    }

    ionViewDidLoad() {
    }

    ngOnInit() {

    }

    private  checkCommentsOffset(){
        if(this.commentsCount <= this.commentOffset){
            this.showInfineScroll = false;
        }
    }

    doInfinite(infiniteScroll) {

        this.PlaceInfoService.getPlaceAbout(this.place.id, this.commentOffset)
            .subscribe(result =>
                {
                    if (result.comments.length > 0) {
                        result.comments.forEach(element => {
                            this.comments.push(element);
                            this.commentOffset+=result.comments.length;
                            this.checkCommentsOffset();
                        });
                    } else {
                        this.showInfineScroll = false;
                        infiniteScroll.enable(false);
                    }
                    infiniteScroll.complete();
                }
            );
        return;

    }
}
