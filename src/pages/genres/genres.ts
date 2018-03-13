import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams, PopoverController, ActionSheetController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { PopoverPage } from '../popover/popover';

@Component({
  selector: 'page-genres',
  templateUrl: 'genres.html',
})
export class GenresPage {
  time_span = "Past Month";
  topGenres: [string, number][];

  constructor(public navCtrl: NavController, public navParams: NavParams, public restProvider: RestProvider,
    public loadingCtrl: LoadingController, public popoverCtrl: PopoverController, public actionCtrl: ActionSheetController) {
      this.showLoading("short_term");
  }

  /**
   * Display the Popover page to "About" and "Logout"
   * @param myEvent Event object
   */
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: myEvent
    });
  }

  /**
   * Select the time range to be used
   */
  timeSelect() {
    let action = this.actionCtrl.create({
      title: 'Select a Timespan',
      cssClass: 'time-action-sheet',
      buttons: [
        {
          text: 'Past Month',
          role: 'month',
          handler: () => {
            this.time_span = "Past Month";
            this.showLoading("short_term");
          }
        },
        {
          text: 'Past 6 Months',
          role: '6month',
          handler: () => {
            this.time_span = "Past 6 Months";
            this.showLoading("medium_term");
          }
        },
        {
          text: 'All Time',
          role: 'alltime',
          handler: () => {
            this.time_span = "All Time";
            this.showLoading("long_term");
          }
        }
      ]
    })
    action.present();
  }

  /**
   * Get the top 50 tracks in a specified time range. Renews token if necessary.
   * @param range time range of the data to be returned
   */
  getTopTracks(range: string) {
    return new Promise(resolve => {
      if (this.restProvider.tokenExpired()) {
        // alert("Token has expired, requesting a new one");
        this.restProvider.requestNewToken()
        .then(() => {
          return this.restProvider.getTopTracks(range);
        })
        .then((data: any) => {
          resolve(data.items);
        });
      }
      else {
        this.restProvider.getTopTracks(range)
        .then((data: any) => {
          resolve(data.items);
        });
      }
    });
  }

  /**
   * Get a specified Artist
   * @param id Artist ID
   */
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

  /**
   * Determine the top genres based on the Top 50 Track data
   * @param range time range of the data to be returned
   */
  getGenres(range: string) {
    // Get tracks first
    let tracks: any;
    let genreMap: Map<string, number> = new Map<string, number>();

    this.getTopTracks(range)
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

  /**
   * Display the loading popup and determine the top Genres
   * @param range time range of the data to be returned
   */
  showLoading(range: string) {
    let loading = this.loadingCtrl.create({
      content: "Loading Data..."
    });
    loading.present()
    .then(() => {
      return this.getGenres(range);
    })
    .then(() => {
      loading.dismiss();
    });
  }
}