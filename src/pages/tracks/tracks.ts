import { Component } from '@angular/core';
import { LoadingController, NavController, PopoverController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { PopoverPage } from '../popover/popover';


@Component({
  selector: 'page-tracks',
  templateUrl: 'tracks.html',
})
export class TracksPage {
  tracks: any;
  time_span = "short_term";

  constructor(public navCtrl: NavController, public restProvider: RestProvider
    , public popoverCtrl: PopoverController, public loadingCtrl: LoadingController) {
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
