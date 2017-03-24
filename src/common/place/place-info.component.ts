import {Component, Input} from '@angular/core';
import {IAd} from "../../pages/place/iad";
import {IPlace} from "../../pages/place/iplace";

@Component({
    selector: 'place-info',
    templateUrl: 'place-info.html',

})
export class PlaceInfo {
    @Input()
    public  place: IPlace;

    @Input()
    public mobile_display_ad_small: IAd;
}