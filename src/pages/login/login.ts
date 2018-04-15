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
  //   this.restProvider.getTokens('AQDNahqAbHxtJxjmhn_zj1YDszz-ocidJ-bkT05HTkTVL1tIrrnRI7xJzTPZZbLxL_0fMJQ-MxnamrSII_EbPwL_seKrdCMifZEUq_vDuDgautXBmq6tInUWYuqsRuBHk17i_0SSfdAqo79HGoW8crN-W6AgWKsRF_prSF9SG3nEHcHu82fJ8oqsNMox-s-7-AlWSI2HVP-tB-iNgAWb')
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
