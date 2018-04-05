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
  timeLoaded: string;

  constructor(public navCtrl: NavController, public restProvider: RestProvider,
    public popoverCtrl: PopoverController, public loadingCtrl: LoadingController,
    public alertCtrl: AlertController, public iab: InAppBrowser, public actionCtrl: ActionSheetController) {

    }

  ionViewWillEnter() {
    if (this.timeLoaded !== this.restProvider.timeLabel) {
      // Time range was changed on a different page; load accordingly
      this.getTopTracks();
    }
  }

  /**
   * Get the top 50 Tracks within a specified time range. Renews token if necessary.
   */
  getTopTracks() {
    let loading = this.loadingCtrl.create({
      content: 'Loading Tracks...'
    });
    if (this.restProvider.tokenExpired()) {
      this.restProvider.requestNewToken()
      .then(() => {
        return loading.present();
      })
      .then(() => {
        return this.restProvider.getTopTracks();
      })
      .then((data: any) => {
        this.tracks = data.items;
        this.timeLoaded = this.restProvider.timeLabel;
        loading.dismiss();
      });
    }
    else {
      loading.present()
      .then(() => {
        return this.restProvider.getTopTracks();
      })
      .then((data: any) => {
        this.tracks = data.items;
        this.timeLoaded = this.restProvider.timeLabel;
        loading.dismiss();
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
            this.restProvider.timeLabel = "Past Month";
            this.getTopTracks();
          }
        },
        {
          text: 'Past 6 Months',
          role: '6month',
          handler: () => {
            this.restProvider.timeLabel = "Past 6 Months";
            this.getTopTracks();
          }
        },
        {
          text: 'All Time',
          role: 'alltime',
          handler: () => {
            this.restProvider.timeLabel = "All Time";
            this.getTopTracks();
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
}