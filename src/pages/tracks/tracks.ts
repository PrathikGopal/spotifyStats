import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';

@Component({
  selector: 'page-tracks',
  templateUrl: 'tracks.html',
})
export class TracksPage {
  tracks: any;
  code: string;
  time_span = "short_term";

  constructor(public navCtrl: NavController, public navParams: NavParams, public restProvider: RestProvider) {
    // this.restProvider.spotifyLogin().then(success => {
    //   this.code = success;
    //   this.restProvider.getAccessToken(this.code).then( win => {
    //     this.getTopTracks();
    //   });
    // });
    this.getTopTracks();
  }

  getTopTracks() {
    this.restProvider.getTopTracks(this.time_span)
    .then((data: any) => {
      this.tracks = data.items;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TracksPage');
  }

}
