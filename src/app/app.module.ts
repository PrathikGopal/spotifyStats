import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

// Pages
import { AboutPage } from '../pages/about/about';
import { ArtistsPage } from '../pages/artists/artists';
import { ArtistDetailPage } from '../pages/artist-detail/artist-detail';
import { TracksPage } from '../pages/tracks/tracks';
import { TrackDetailPage } from '../pages/track-detail/track-detail';
import { GenresPage } from '../pages/genres/genres';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { PopoverPage } from '../pages/popover/popover';

// Plugins and providers
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Base64 } from '@ionic-native/base64';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { RestProvider } from '../providers/rest/rest';
import { AppVersion } from '@ionic-native/app-version';
import { IonicImageLoader } from 'ionic-image-loader';


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    TabsPage,
    ArtistsPage,
    ArtistDetailPage,
    TracksPage,
    TrackDetailPage,
    GenresPage,
    LoginPage,
    PopoverPage,
    ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    IonicImageLoader.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    TabsPage,
    ArtistsPage,
    ArtistDetailPage,
    TracksPage,
    TrackDetailPage,
    GenresPage,
    LoginPage,
    PopoverPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    InAppBrowser,
    Base64,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RestProvider,
    AppVersion
  ]
})
export class AppModule {}
