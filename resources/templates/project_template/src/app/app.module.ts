import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {AppRoutes} from './app.routing';
import {RouterModule} from '@angular/router';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFireModule} from 'angularfire2';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {environment} from '../environments/environment';
import {TranslateModule, TranslateLoader, MissingTranslationHandler, MissingTranslationHandlerParams} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {CoreModule} from './@core/core.module';
import {ModulesModule} from './modules/modules.module';
import {SharedModule} from './shared/shared.module';
import {CookieLawModule} from 'angular2-cookie-law';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

/**
 * handle strings with missing translation value and return the default string.
 *
 */
export class MyMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    return params.key;
  }
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(AppRoutes),
    CoreModule,
    ModulesModule,
    SharedModule,
    HttpClientModule,
    /**
     * Modules for translation
     *
     */
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: MyMissingTranslationHandler
      }
    }),
    /**
     * include Firebase modules just if you need it, set environment.isFirebase = true
     *
     */
    ...environment.isFirebase ? [
      AngularFireModule.initializeApp(environment['firebaseConfig']),
      AngularFirestoreModule,
      AngularFireAuthModule
    ] : [],
    CookieLawModule,
  ],
  providers: [
    CookieService,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}

