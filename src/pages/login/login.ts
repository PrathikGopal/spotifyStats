import { Component } from '@angular/core';
import { NavController, NavParams, Tab } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { TabsPage } from '../../pages/tabs/tabs';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public restProvider: RestProvider) {

  }

  login() {
    this.restProvider.spotifyOauth()
    .then(success => {
      return this.restProvider.getTokens(success);
    })
    .then(() => {
      this.navCtrl.setRoot(TabsPage);
      this.navCtrl.popToRoot();
    });
  }

  goToTabs() {
    this.navCtrl.setRoot(TabsPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
