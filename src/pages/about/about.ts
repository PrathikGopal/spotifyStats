import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { RestProvider } from '../../providers/rest/rest';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  code: any;
  constructor(public navCtrl: NavController, public browser: InAppBrowser, public restProvider: RestProvider) {
    // this.restProvider.spotifyLogin().then(success => {
    //   this.code = success;
    //   this.restProvider.getAccessToken(this.code);
    // });
  }

  getTopArtists() {
    this.restProvider.getTopArtists()
    .then((data: any) => {
      alert("Your top artists:\n" + JSON.stringify(data));
    })
  }

  getTopTracks() {
    this.restProvider.getTopTracks()
    .then((data: any) => {
      alert("Your top tracks:\n" + JSON.stringify(data));
    })
  }
}
