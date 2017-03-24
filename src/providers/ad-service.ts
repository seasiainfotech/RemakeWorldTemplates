///<reference path="../../node_modules/rxjs/add/operator/do.d.ts"/>
import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/Rx';
import {Observable} from "rxjs";
import {SERVER_URL} from './config';
import {CHANNEL_ID} from './config';
import {CHANNEL_GROUP_ID} from './config';



@Injectable()
export class AdService {

    private rotation_ids: number[] = [33,35,36,37];

    //private content_section_id: number = 59;

    private url: string;

    constructor(public http: Http) {

        this.url = SERVER_URL+"rotation_items/get_custom_get.json?channel_id=" + CHANNEL_ID
            + "&channel_group_id=" + CHANNEL_GROUP_ID
           // + "&content_section_id=" + this.content_section_id
            + "&is_api=1"
            + "&rotation_ids="+ this.rotation_ids.join(',');
    }

    public getUnclaimed(): Observable<any> {
        return this.http.get(this.url)
            .map((res: Response) => res.json())
            .catch(this.handleError);
    }

    private handleError(error:any) {
        if(!error) {
            error = 'Server response error';
        }
        return Observable.throw(error);
    }

}
