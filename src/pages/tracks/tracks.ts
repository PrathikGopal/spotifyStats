import { Component } from '@angular/core';
import { LoadingController, NavController, PopoverController, Modal, ModalController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { PopoverPage } from '../popover/popover';
import { TrackDetailPage } from '../track-detail/track-detail';

@Component({
  selector: 'page-tracks',
  templateUrl: 'tracks.html',
})
export class TracksPage {
  tracks: any;
  time_span = "short_term";
  modal: Modal;

  constructor(public navCtrl: NavController, public restProvider: RestProvider,
    public popoverCtrl: PopoverController, public loadingCtrl: LoadingController,
    public modalCtrl: ModalController) {
      this.showLoading();
  }

  getTopTracks() {
    if (this.restProvider.tokenExpired()) {
      // alert("Token has expired, requesting a new one");
      this.restProvider.requestNewToken()
      .then(() => {
        return this.restProvider.getTopTracks(this.time_span);
      })
      .then((data: any) => {
        this.tracks = data.items;
      });
    }
    else {
      this.restProvider.getTopTracks(this.time_span)
      .then((data: any) => {
        this.tracks = data.items;
      });
    }
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: myEvent
    });
  }

  showTrackDetail(track) {
    this.modal = this.modalCtrl.create(TrackDetailPage, {item: track});
    // Send the track to the modal
    this.modal.present();
  }

  showLoading() {
    let loading = this.loadingCtrl.create({
      content: "Loading Data..."
    });
    loading.present()
    .then(() => {
      return this.getTopTracks();
    })
    .then(() => {
      loading.dismiss();
    });
  }
}
