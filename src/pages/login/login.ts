import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { TabsPage } from '../../pages/tabs/tabs';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public restProvider: RestProvider) {

  }

  // debugLogin() {
  //   this.restProvider.getTokens('')
  //   .then(() => {
  //     this.navCtrl.setRoot(TabsPage);
  //     this.navCtrl.popToRoot();
  //   });
  // }

  /**
   * Call the RestProvider's `spotifyOauth()` function and, upon success, set the root to the TabsPage
   */
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
}
