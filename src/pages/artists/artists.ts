import { Component } from '@angular/core';
import { LoadingController, NavController, PopoverController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { PopoverPage } from '../popover/popover';

@Component({
  selector: 'page-artists',
  templateUrl: 'artists.html',
})
export class ArtistsPage {
  artists: any;
  time_span = "short_term";

  constructor(public navCtrl: NavController, public restProvider: RestProvider
    , public popoverCtrl: PopoverController, public loadingCtrl: LoadingController) {
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
