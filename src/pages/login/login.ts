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
    this.restProvider.getAccessToken('AQCDDrLRZ8IPS8ap5yduCuMu8QM4nyYGwhWCbbeAWubb31oxTZSJlnCnaIz3B86FFNjqq_61GKmXEo6XYX0hQI7dBk5BGethcniwh-_NMtLPiEsAFiDRCqsj9V5qOZNuLCQTZw1ZNNa30ox24Ho9Y8d77ptCTunwHL2xH9eXi-PTmTYcvkWp17799vrc3oZmbs8oOCmkns79SSEH-dE');
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
