import { Component } from '@angular/core';
import { App, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { LoginPage } from '../login/login';
import { AboutPage } from '../about/about';

@Component({
  templateUrl: 'popover.html'
})

export class PopoverPage {
  constructor(public modalCtrl: ModalController, public navCtrl: NavController,
    public viewCtrl: ViewController, public restProvider: RestProvider, public app: App) {

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
      this.app.getRootNav().setRoot(LoginPage);
      this.app.getRootNav().popToRoot();
    });
  }

  about() { // Modal
    this.viewCtrl.dismiss() // Dismiss the popover
    .then(() => {
      // Display the modal
      let modal = this.modalCtrl.create(AboutPage);
      modal.present();
    });
  }
}