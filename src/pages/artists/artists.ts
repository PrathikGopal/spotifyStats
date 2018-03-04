import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { RestProvider } from '../../providers/rest/rest';

@Component({
  selector: 'page-artists',
  templateUrl: 'artists.html',
})
export class ArtistsPage {
  artists: any;
  code: string;
  time_span = "short_term";

  constructor(public navCtrl: NavController, public browser: InAppBrowser, public restProvider: RestProvider) {
    this.restProvider.spotifyLogin().then(success => {
      this.code = success;
      this.restProvider.getAccessToken(this.code).then( win => {
        this.getTopArtists();
      });
    });
    //this.getTopArtists();
  }


  getTopArtists() {
    this.restProvider.getTopArtists(this.time_span)
    .then((data: any) => {
      this.artists = data.items;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ArtistsPage');
  }
}
