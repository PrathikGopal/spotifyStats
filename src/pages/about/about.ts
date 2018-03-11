import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
  appName: any;
  packageName: any;
  versionCode: any;
  versionNumber: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private appVersion: AppVersion) {
    this.appVersion.getAppName().then(result => { this.appName = result});
    // this.appVersion.getPackageName().then(result => {this.packageName = result});
    // this.appVersion.getVersionCode().then(result => {this.versionCode = result});
    this.appVersion.getVersionNumber().then(result => {this.versionNumber = result});
  }
}
