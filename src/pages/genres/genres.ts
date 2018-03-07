import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams, PopoverController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { PopoverPage } from '../popover/popover';

@Component({
  selector: 'page-genres',
  templateUrl: 'genres.html',
})
export class GenresPage {
  time_span = "short_term";
  topGenres: [string, number][];

  constructor(public navCtrl: NavController, public navParams: NavParams
    , public restProvider: RestProvider, public loadingCtrl: LoadingController, public popoverCtrl: PopoverController) {
      this.showLoading();
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: myEvent
    });
  }

  getTopTracks() {
    return new Promise(resolve => {
      if (this.restProvider.tokenExpired()) {
        // alert("Token has expired, requesting a new one");
        this.restProvider.requestNewToken()
        .then(() => {
          return this.restProvider.getTopTracks(this.time_span);
        })
        .then((data: any) => {
          resolve(data.items);
        });
      }
      else {
        this.restProvider.getTopTracks(this.time_span)
        .then((data: any) => {
          resolve(data.items);
        });
      }
    });
  }

  getArtist(id) {
    // "3j4ihH7xANVDGQhcDFJby7" Landon Tewers ID
    return new Promise(resolve => {
      if (this.restProvider.tokenExpired()) {
        //alert("Token has expired, requesting a new one");
        this.restProvider.requestNewToken()
        .then(() => {
          return this.restProvider.getArtist(id);
        })
        .then((data: any) => {
          resolve(data);
        });
      }
      else {
        this.restProvider.getArtist(id)
        .then((data: any) => {
          resolve(data);
        });
      }
    })
  }

  getGenres() {
    // Get tracks first
    let tracks: any;
    let genreMap: Map<string, number> = new Map<string, number>();

    this.getTopTracks()
    .then((results) => {
      tracks = results;
    })
    .then(() => {
      //  Need to make an array of promises
      let promiseArray = [];
      for (let track of tracks) {
        let promise = this.getArtist(track.artists[0].id);
        promiseArray.push(promise);
      }
      return Promise.all(promiseArray); // Returns array of full Artist objects
    })
    .then((artists: any) => { // artists == array of Artists
      for (let artist of artists) {
        for (let genre of artist.genres) {
          if(genreMap.get(genre) == null) {
            // New genre
            genreMap.set(genre, 1);
          }
          else {
            // Genre already mapped, increment it
            let value = genreMap.get(genre); // Get original value
            genreMap.set(genre, value+1); // Increment
          }
        }
      }
      // Sort the map into an array, highest to lowest
      let mapArray = Array.from(genreMap).sort((a, b) => {
        return b["1"] - a["1"];
      });
      this.topGenres = mapArray.slice(0, 10); // Top 10 genres
    });
  }

  showLoading() {
    let loading = this.loadingCtrl.create({
      content: "Loading Data..."
    });
    loading.present()
    .then(() => {
      return this.getGenres();
    })
    .then(() => {
      loading.dismiss();
    });
  }
}
