import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, PopoverController, ActionSheetController} from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { PopoverPage } from '../popover/popover';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-tracks',
  templateUrl: 'tracks.html',
})
export class TracksPage {
  tracks: any;
  time_span = "Past Month";

  constructor(public navCtrl: NavController, public restProvider: RestProvider,
    public popoverCtrl: PopoverController, public loadingCtrl: LoadingController,
    public alertCtrl: AlertController, public iab: InAppBrowser, public actionCtrl: ActionSheetController) {
      this.showLoading("short_term");
  }

  /**
   * Get the top 50 Tracks within a specified time range. Renews token if necessary.
   * @param range time range of the data to be returned
   */
  getTopTracks(range: string) {
    if (this.restProvider.tokenExpired()) {
      // alert("Token has expired, requesting a new one");
      this.restProvider.requestNewToken()
      .then(() => {
        return this.restProvider.getTopTracks(range);
      })
      .then((data: any) => {
        this.tracks = data.items;
      });
    }
    else {
      this.restProvider.getTopTracks(range)
      .then((data: any) => {
        this.tracks = data.items;
      });
    }
  }

  /**
   * Open a specified track's Spotify listing
   * @param track Track to be opened
   */
  openTrack(track) {
    let alert = this.alertCtrl.create({
      title: 'Open in Spotify?',
      subTitle: track.artists[0].name + " - <i>"+track.name+"</i>",
      // subTitle: '<span>Sup</span> <img height="80" width="80" src='+track.album.images[1].url+'>',
      cssClass: 'track-alert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // Do nothing
          }
        },
        {
          text: 'Open',
          role: 'open',
          handler: () => {
            this.iab.create(track.external_urls.spotify, "_system");
          }
        }
      ]
    });
    alert.present();
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
   * Display the loading popup and retrieve the top tracks
   * @param range time range of the data to be returned
   */
  showLoading(range: string) {
    let loading = this.loadingCtrl.create({
      content: "Loading Data..."
    });
    loading.present()
    .then(() => {
      return this.getTopTracks(range);
    })
    .then(() => {
      loading.dismiss();
    });
  }
}