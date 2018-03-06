import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { LoginPage } from '../login/login';

@Component({
  templateUrl: 'popover.html'
})

export class PopoverPage {
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public restProvider: RestProvider) {}

  close() {
    this.viewCtrl.dismiss();
  }

  logout() {
    this.restProvider.logout()
    .then(success => {
      return this.viewCtrl.dismiss();
    })
    .then(dismissed => {
      this.navCtrl.setRoot(LoginPage);
    })
  }
}