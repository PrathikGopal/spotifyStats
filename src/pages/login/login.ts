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
    this.restProvider.getAccessToken('AQBi4pCFS_w8nmi61Qy5NPLgVP98rHXhuvgLx8bcXGp1NH-ZAAZvEp2_-xvp6qTWSRnwGmHpMuj-5hSufov2GJ6_W04jJnHKPuQIRaZ1d9qZyiEaF9imKsKy_izHi9F1jGOSPh69zuUnD0K0I-jKtkFy845NXZPqRRxX2_lmTKyvnvlCywM_5AWCiWCZFQFdnACKbAEtV8ZKDya4r2o');
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
