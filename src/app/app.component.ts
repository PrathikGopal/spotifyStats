import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RestProvider } from '../providers/rest/rest';

import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;
  //code: string;
  
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public restProvider: RestProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      // this.restProvider.spotifyLogin().then(success => {
      //   this.code = success;
      //   this.restProvider.getAccessToken(this.code);
      // });
    });
  }
}
