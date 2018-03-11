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
  time_span = "Past Month";
  modal: Modal;

  constructor(public navCtrl: NavController, public restProvider: RestProvider,
    public popoverCtrl: PopoverController, public loadingCtrl: LoadingController,
    public modalCtrl: ModalController, public actionCtrl: ActionSheetController) {
      this.showLoading("short_term");
  }

  getTopArtists(range: string) {
    if (this.restProvider.tokenExpired()) {
      //alert("Token has expired, requesting a new one");
      this.restProvider.requestNewToken()
      .then(() => {
        return this.restProvider.getTopArtists(range);
      })
      .then((data: any) => {
        this.artists = data.items;
      });
    }
    else {
      this.restProvider.getTopArtists(range)
      .then((data: any) => {
        this.artists = data.items;
      });
    }
  }

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

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: myEvent
    });
  }

  showArtistDetail(artist) { // Modal
    this.modal = this.modalCtrl.create(ArtistDetailPage, {item: artist});
    // Send the artist to the modal
    this.modal.present();
  }

  showLoading(range: string) {
    let loading = this.loadingCtrl.create({
      content: "Loading Data..."
    });
    loading.present()
    .then(() => {
      return this.getTopArtists(range);
    })
    .then(() => {
      loading.dismiss();
    });
  }
}
