import { Component } from '@angular/core';
import { App, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { LoginPage } from '../login/login';
import { AboutPage } from '../about/about';
import { FaqPage } from '../faq/faq';

@Component({
  templateUrl: 'popover.html'
})

export class PopoverPage {
  constructor(public modalCtrl: ModalController, public navCtrl: NavController,
    public viewCtrl: ViewController, public restProvider: RestProvider, public app: App) {

  }

  /**
   * Close this page
   */
  close() {
    this.viewCtrl.dismiss();
  }

  /**
   * Call the RestProvider's `logout()` function, then set the root to the Login page
   */
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

  /**
   * Display the FAQ page
   */
  faq() { // Modal
    this.viewCtrl.dismiss() // Dismiss the popover
    .then(() => {
      // Display the modal
      let modal = this.modalCtrl.create(FaqPage);
      modal.present();
    });
  }

  /**
   * Display the About page
   */
  about() { // Modal
    this.viewCtrl.dismiss() // Dismiss the popover
    .then(() => {
      // Display the modal
      let modal = this.modalCtrl.create(AboutPage);
      modal.present();
    });
  }
}