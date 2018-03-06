import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { LoginPage } from '../login/login';

@Component({
  templateUrl: 'popover.html'
})

export class PopoverPage {
  constructor(public platform: Platform, public navCtrl: NavController, public viewCtrl: ViewController, public restProvider: RestProvider) {

  }

  close() {
    this.viewCtrl.dismiss();
  }

  logout() {
    this.restProvider.logout()
    .then(() => {
      return this.viewCtrl.dismiss();
    })
    .then(() => {
      this.navCtrl.setRoot(LoginPage);
      this.navCtrl.popToRoot();
    });
  }
}