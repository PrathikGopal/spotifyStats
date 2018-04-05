import { Component } from '@angular/core';
import { IonicPage, Modal, ModalController, LoadingController, NavController, PopoverController, ActionSheetController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { ArtistDetailPage } from '../artist-detail/artist-detail';
import { PopoverPage } from '../popover/popover';

@IonicPage()
@Component({
  selector: 'page-artists',
  templateUrl: 'artists.html',
})
export class ArtistsPage {
  artists: any;
  timeLoaded: string;
  modal: Modal;

  constructor(public navCtrl: NavController, public restProvider: RestProvider,
    public popoverCtrl: PopoverController, public loadingCtrl: LoadingController,
    public modalCtrl: ModalController, public actionCtrl: ActionSheetController) {

    }

  ionViewWillEnter() {
    if (this.timeLoaded !== this.restProvider.timeLabel) {
      // Time range was changed on a different page; load accordingly
      this.getTopArtists();
    }
  }

  /**
   * Get the top 50 Artists within a specified time range. Renews token if necessary.
   */
  getTopArtists() {
    let loading = this.loadingCtrl.create({
      content: 'Loading Artists...'
    });
    if (this.restProvider.tokenExpired()) {
      this.restProvider.requestNewToken()
      .then(() => {
        return loading.present();
      })
      .then(() => {
        return this.restProvider.getTopArtists();
      })
      .then((data: any) => {
        this.artists = data.items;
        this.timeLoaded = this.restProvider.timeLabel;
        loading.dismiss();
      });
    }
    else {
      loading.present()
      .then(() => {
        return this.restProvider.getTopArtists();
      })
      .then((data: any) => {
        this.artists = data.items;
        this.timeLoaded = this.restProvider.timeLabel;
        loading.dismiss();
      });
    }
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