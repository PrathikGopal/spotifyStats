import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { RestProvider } from '../../providers/rest/rest';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  access_token: any;
  constructor(public navCtrl: NavController, public browser: InAppBrowser, public restProvider: RestProvider) {
    this.spotifyLogin().then(success => {
      alert("Success!");
      this.access_token = success;
    }, (err) => {
      alert(err);
    });
  }

  getTop() {
    this.restProvider.getTop(this.access_token)
    .then((data: any) => {
      alert("About Page");
      alert(data);
    })
  }

  public spotifyLogin(): Promise<any> {
    return new Promise((resolve, reject) => {
      // create the URL
      let apiURL = 'https://accounts.spotify.com/authorize/';
      let clientId = '4fbbbc24ce04402db628408c8fe642af';
      let redirectUri = 'http://localhost/callback';
      let state = 'state';
      //let scope = 'user-top-read';
      let scope = ''
      let browser = new InAppBrowser();
      let fullUrl = apiURL + "?client_id="+clientId+"&response_type=code&redirect_uri="+redirectUri+"&scope="+scope+"&state="+state;
      let browseRef = browser.create(fullUrl, "_blank");
      let listener = browseRef.on('loadstart').subscribe((event: any) => {
        // Check the redirectURI
        if (event.url.startsWith("http://localhost/callback")) {
            alert(JSON.stringify(event));
            let token = event.url.split('=')[1].split('&')[0];
            resolve(token);
            listener.unsubscribe();
            browseRef.close();
        }
      });
    });
  }

}
