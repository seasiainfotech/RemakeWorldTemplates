import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import {MyApp} from './app.component';
import {Wikitude} from "../pages/wikitude/wikitude";
import {PlacePage} from "../pages/place/place";
import {AdService} from "../providers/ad-service";
import {TmpArPage} from "../pages/tmp-ar/tmp-ar";
import {ClaimPage} from "../pages/claim/claim";
import {AboutPage} from "../pages/about/about";
import {PlaceProgressReportPage} from "../pages/place-progress-report/place-progress-report";
import {PlaceInfo} from "../common/place/place-info.component";
import {PlaceHeader} from "../common/place/place-header.component";
import {PlaceObjectPage} from "../pages/place-object/place-object";

import {ResultPagePage} from "../pages/result-page/result-page";
import {AboutPageTemp} from "../pages/about temp/about";

import {TestPage} from "../pages/test/test";
import {PlaceMapsPage} from "../common/place/place-maps";
import {PlaceAdvrtPage} from "../common/place/place-advrt";
import {PlaceHeaderAdvrtPage} from "../common/place/place-header-advrt";


@NgModule({
    declarations: [
        MyApp,
        Wikitude,
        PlacePage,
        TmpArPage,
        ClaimPage,
        AboutPage,
        PlaceProgressReportPage,
        PlaceInfo,
        PlaceHeader,
      PlaceObjectPage,
      AboutPage,
      ResultPagePage,
      AboutPageTemp,
      PlaceMapsPage,
      PlaceAdvrtPage,
      PlaceHeaderAdvrtPage,
      TestPage
    ],
    imports: [
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        Wikitude,
        PlacePage,
        TmpArPage,
        ClaimPage,
        AboutPage,
        PlaceProgressReportPage,
      PlaceObjectPage,
      AboutPage,
      ResultPagePage,
      AboutPageTemp,
      PlaceMapsPage,
      PlaceAdvrtPage,
      PlaceHeaderAdvrtPage,
      TestPage
    ],
    providers: [
        AdService,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {
}
