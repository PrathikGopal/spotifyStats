import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, PopoverController, ActionSheetController, DateTime} from 'ionic-angular';
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
    loading.present()
    .then(() => {
      if (this.restProvider.tokenExpired()) {
        return this.restProvider.requestNewToken()
        .then(() => {
          return this.restProvider.getTopTracks();
        })
        .then((data: any) => {
          this.tracks = data.items;
          this.timeLoaded = this.restProvider.timeLabel;
          loading.dismiss();
        }, (error) => {
          console.log('ERROR in tracks.getTopTracks: ' + error.message);
          loading.dismiss();
        });
      }
      else {
        this.restProvider.getTopTracks()
        .then((data: any) => {
          this.tracks = data.items;
          this.timeLoaded = this.restProvider.timeLabel;
          loading.dismiss();
        }, (error) => {
          console.log('ERROR in tracks.getTopTracks: ' + error.message);
          loading.dismiss();
        });
      }
    });
  }

  /**
   * Open a specified track's Spotify listing
   * @param track Track to be opened
   */
  openTrack(track) {
    let alert = this.alertCtrl.create({
      title: 'Open in Spotify?',
      subTitle: '<b>' + track.artists[0].name + "</b><br><i>"+track.name+"</i>",
      cssClass: 'alert-colors',
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
   * Ask the user to update their Spotify permissions. Will open OAuth window if "Ok" is selected
   */
  updatePlaylistPermissions() {
    let alert = this.alertCtrl.create({
      title: 'Permissions Update',
      subTitle: 'uTrack will need permission to modify your playlists',
      cssClass: 'alert-colors',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // Do nothing
          }
        },
        {
          text: 'Ok',
          role: 'confirm',
          handler: () => {
            this.restProvider.spotifyOauth()
            .then(success => {
              return this.restProvider.getTokens(success);
            })
            .then(() => {
              this.createPlaylist();
            });
          }
        }
      ]
    });
    alert.present();
  }

  /**
   * Ask the user if they'd like to generate a playlist
   */
  createPlaylistAlert() {
    let alert = this.alertCtrl.create({
      title: 'Create Playlist?',
      subTitle: 'Turn your Top Tracks into a Spotify playlist?',
      cssClass: 'alert-colors',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // Do nothing
          }
        },
        {
          text: 'Create',
          role: 'create',
          handler: () => {
            this.createPlaylist();
          }
        }
      ]
    });
    alert.present();
  }

  /**
   * Create a playlist of the top 50 tracks, includes handling for improper client scope
   */
  createPlaylist() {
    var playlistURL = '';
    this.restProvider.getUser()
    .then((data: any) => {
      let info = {
        name: 'Top Tracks: ' + this.timeLoaded,
        description: 'Created with uTrack'
      }
      return this.restProvider.createPlaylist(data.id, info);
    }, (error) => {
      console.log('ERROR in tracks.createPlaylist: ' + error.message);
    })
    .then((data: any) => {
      // Process out the track URIs from the top tracks
      playlistURL = data.external_urls.spotify;
      let trackURIArray = [];
      for (let track of this.tracks) {
        trackURIArray.push(track.uri);
      }
      return this.restProvider.addToPlaylist(data.id, data.owner.id, trackURIArray);
    }, (error) => {
      console.log('ERROR in tracks.createPlaylist: ' + error.message);
      if(error.status === 403) {
        // Insufficient client scope; permissions need to be updated
        this.updatePlaylistPermissions();
      }
    })
    .then((data: any) => {
      // Playlist created, now open it in Spotify
      this.iab.create(playlistURL, "_system");
    }, (error) => {
      console.log('ERROR in tracks.createPlaylist: ' + error.message);
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
    });
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