import {Injectable} from '@angular/core';
import {SERVER_URL} from './config';
import {CHANNEL_ID} from './config';
import {CHANNEL_GROUP_ID} from './config';
import {IPlaceComment} from "../pages/place/iplace_comment";
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from "rxjs";


@Injectable()
export class PlaceInfoService {

    constructor(
        public http: Http
    )
    {}

    /**
     * Get place progress report data
     * @param place_id
     * @returns {Observable<R>}
     */
    public getPlaceProgressReport(placeId): Observable<any> {

        let result =  this.http.get(
            SERVER_URL+'api/api_places/place_progress_report.json?channel_id='+CHANNEL_ID
            + '&channel_group_id='+ CHANNEL_GROUP_ID
            + '&place_id='+ placeId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
        return result;
    }

    /**
     * Get Place about data
     * @param place_id
     * @returns {Observable<R>}
     */
    public getPlaceAbout(placeId, offset): Observable<any> {

        let onlyComments = 1;
        if(offset == 0){
            onlyComments =  0;
        }
        let result =  this.http.get(
            SERVER_URL+'api/api_places/about_it.json?channel_id='+CHANNEL_ID
            + '&channel_group_id='+ CHANNEL_GROUP_ID
            + '&place_id='+ placeId+'&offset='+offset+'&only_comments='+onlyComments)
            .map((res: Response) => {
                let responseData = res.json().json;
                console.log(responseData);
                let result = {'wiki_content': responseData.wiki_content, 'comments' : [], 'commentsCount': responseData.comments_count};
                if(responseData.comments.count == 0) {
                    return result;
                }
                for (let item in responseData.comments) {
                    let value = responseData.comments[item];

                    let comment:IPlaceComment = {
                        user_photo: value['User']['full_picture_address'],
                        user_name: value['User']['name'],
                        title : value['Expression']['title'],
                        description : value['Expression']['description'],
                        date : value['Expression']['date']
                    }
                    // Create the uiMessage object here, not sure what its structure is
                    result.comments.push(comment);
                }
                return result;
            })
            .catch((error: any) => {console.log(error); return error});
        return result;
    }

}
