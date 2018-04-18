import { Component } from '@angular/core';
import { IonicPage, Modal, ModalController, LoadingController, NavController, PopoverController, ActionSheetController, AlertController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { ArtistDetailPage } from '../artist-detail/artist-detail';
import { PopoverPage } from '../popover/popover';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-artists',
  templateUrl: 'artists.html',
})
export class ArtistsPage {
  artists: any;
  timeLoaded: string;
  modal: Modal;
  appVersion = '1.4.0'; // This needs to be updated per release

  constructor(public navCtrl: NavController, public restProvider: RestProvider, public popoverCtrl: PopoverController,
    public loadingCtrl: LoadingController, public modalCtrl: ModalController, public storage: Storage,
    public actionCtrl: ActionSheetController, public alertCtrl: AlertController) {

    }

  ionViewDidEnter() {
    if (this.timeLoaded !== this.restProvider.timeLabel) {
      // Time range was changed on a different page; load accordingly
      this.getTopArtists();
    }
  }

  ionViewDidLoad() {
    this.storage.get('storedVersion').then(result => {
      // Version number must be updated per release
      if (result !== this.appVersion) {
        this.showChangelog();
      }
    });
  }

  clearVersion() {
    this.storage.set('storedVersion', '');
  }

  showChangelog() {
    let alert = this.alertCtrl.create({
      title: 'What\'s New?',
      subTitle: `
      <ul>
        <li>Introducing Playlist Generation!
          <ul>
            <li>Turn your top tracks into a Spotify playlist</li>
          </ul>
        </li>
      </ul>
      `,
      cssClass: 'alert-colors changelog',
      buttons: [{
        text: 'Ok',
        role: 'confirm',
        handler: () => {
          // Version number must be updated per release
          this.storage.set('storedVersion', this.appVersion);
        }
      }]
    });
    alert.present();
  }

  /**
   * Get the top 50 Artists within a specified time range. Renews token if necessary.
   */
  getTopArtists() {
    let loading = this.loadingCtrl.create({
      content: 'Loading Artists...'
    });
    loading.present()
    .then(() => {
      if (this.restProvider.tokenExpired()) {
        this.restProvider.requestNewToken()
        .then(() => {
          return this.restProvider.getTopArtists();
        })
        .then((data: any) => {
          this.artists = data.items;
          this.timeLoaded = this.restProvider.timeLabel;
          loading.dismiss();
        }, (error) => {
          console.log('ERROR in artists.getTopArtists: ' + error.message);
          loading.dismiss();
        });
      }
      else {
        this.restProvider.getTopArtists()
        .then((data: any) => {
          this.artists = data.items;
          this.timeLoaded = this.restProvider.timeLabel;
          loading.dismiss();
        }, (error) => {
          console.log('ERROR in artists.getTopArtists: ' + error.message);
          loading.dismiss();
        });
      }
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
            this.getTopArtists();
          }
        },
        {
          text: 'Past 6 Months',
          role: '6month',
          handler: () => {
            this.restProvider.timeLabel = "Past 6 Months";
            this.getTopArtists();
          }
        },
        {
          text: 'All Time',
          role: 'alltime',
          handler: () => {
            this.restProvider.timeLabel = "All Time";
            this.getTopArtists();
          }
        }
      ]
    })
    action.present();
  }

  /**
   * Display the Popover Page to "About" and "Logout"
   * @param myEvent Event object
   */
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: myEvent
    });
  }

  /**
   * Display more information on a specific Artist
   * @param artist The Artist object to be displayed
   */
  showArtistDetail(artist) { // Modal
    this.modal = this.modalCtrl.create(ArtistDetailPage, {item: artist});
    // Send the artist to the modal
    this.modal.present();
  }
}