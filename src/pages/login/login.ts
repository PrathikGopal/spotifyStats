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

  debugLogin() {
    this.restProvider.getAccessToken('AQBXZ5wuCyHk5DeEjwGhmEwDsnt2RzdzPG4Y_Gul6kyutOw00dZGA7GN460xVoDT7nzOEHtK7LEJrEUEKrleTLkDgAG6xCqg03CgPW-XHo4MGKug0E-rj1SRkXiHUVzldN01fTtDuvibY6YMKgr-gZBIBpvQn3DCghCD1JJifee0oukgmLyfU7QPOphYdSkOe3Qm88CERGVAQhyV5IA');
  }

  login() {
    this.restProvider.spotifyLogin()
    .then(success => {
      return this.restProvider.getAccessToken(success)
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
