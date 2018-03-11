import { Component } from '@angular/core';
import { ViewController, NavController, NavParams, PopoverController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-track-detail',
  templateUrl: 'track-detail.html',
})
export class TrackDetailPage {
  item: any;

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams,
    public restProvider: RestProvider, public iab: InAppBrowser, public popoverCtrl: PopoverController) {
      this.item = navParams.get('item');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  goTo() {
    this.viewCtrl.dismiss();
    this.iab.create(this.item.external_urls.spotify, "_system");
  }
}
