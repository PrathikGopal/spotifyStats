import { Component } from '@angular/core';
import { Modal, ModalController, LoadingController, NavController, PopoverController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { ArtistDetailPage } from '../artist-detail/artist-detail';
import { PopoverPage } from '../popover/popover';

@Component({
  selector: 'page-artists',
  templateUrl: 'artists.html',
})
export class ArtistsPage {
  artists: any;
  time_span = "short_term";
  modal: Modal;

  constructor(public navCtrl: NavController, public restProvider: RestProvider
    , public popoverCtrl: PopoverController, public loadingCtrl: LoadingController
    , public modalCtrl: ModalController) {
    this.showLoading();
  }

  getTopArtists() {
    if (this.restProvider.tokenExpired()) {
      //alert("Token has expired, requesting a new one");
      this.restProvider.requestNewToken()
      .then(() => {
        return this.restProvider.getTopArtists(this.time_span)
      })
      .then((data: any) => {
        this.artists = data.items;
      });
    }
    else {
      this.restProvider.getTopArtists(this.time_span)
      .then((data: any) => {
        this.artists = data.items;
      });
    }
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

  showLoading() {
    let loading = this.loadingCtrl.create({
      content: "Loading Data..."
    });
    loading.present()
    .then(() => {
      return this.getTopArtists();
    })
    .then(() => {
      loading.dismiss();
    });
  }
}
