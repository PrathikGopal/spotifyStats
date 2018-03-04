import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Base64 } from '@ionic-native/base64';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Injectable()
export class RestProvider {
  apiUrl = "https://api.spotify.com/v1";
  accessToken: string;
  //accessToken = 'BQAO4WY1bp5f1iXKf4sekniLWPaZjRGGOion7nanELHOfEiPGW-2475hJijfiaYEJjO0xlOgBSHEmBTeYBqCphH5MJQw_tPNF_8T3qHE4DUS7VEFdb5mV3w7Wg2SFHkg9WrFWZ8NATxttC8jCb6xgQovjSsVPDcw';
  refreshToken: string;
  client_id = '4fbbbc24ce04402db628408c8fe642af';
  client_secret = '13ce8764df824250add89867741acb13';

  constructor(public http: HttpClient, public base64: Base64) {
    console.log('Hello RestProvider Provider');
  }

  /*
  * Retrieves the user's top artists for a "medium-term" time period (default)
  */
  getTopArtists(timespan = "short_term") {
    return new Promise(resolve => {
      let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.accessToken).set('Accept', 'application/json');
      let params = new HttpParams().set('time_range', timespan);
      this.http.get(this.apiUrl+"/me/top/artists", {
        headers: headers,
        params: params
      })
      .subscribe(data => {
        resolve(data);
      }, (err) => {
        alert(JSON.stringify(err));
        console.log(err);
      });
    });
  }

  /*
  * Retrieves the user's top tracks for a "medium-term" time period (default)
  */
  getTopTracks(timespan = "short_term") {
    return new Promise(resolve => {
      let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.accessToken).set('Accept', 'application/json');
      let params = new HttpParams().set('time_range', timespan);
      this.http.get(this.apiUrl+"/me/top/tracks", {
        headers: headers,
        params: params
      })
      .subscribe(data => {
        resolve(data);
      }, (err) => {
        alert(JSON.stringify(err));
        console.log(err);
      });
    });
  }

  /* 
  * Launches the in-app-browser to Spotify's login; returns OAuth code to be used for access token retrieval
  */ 
  public spotifyLogin(): Promise<any> {
    return new Promise((resolve, reject) => {
      // create the URL
      let apiURL = 'https://accounts.spotify.com/authorize/';
      let redirectUri = 'http://localhost/callback';
      let state = 'state';
      let scope = 'user-top-read';
      //let scope = ''
      let browser = new InAppBrowser();
      let fullUrl = apiURL + "?client_id="+this.client_id+"&response_type=code&redirect_uri="+redirectUri+"&scope="+scope+"&state="+state;
      let browseRef = browser.create(fullUrl, "_blank");
      let listener = browseRef.on('loadstart').subscribe((event: any) => {
        // Check the redirectURI
        if (event.url.startsWith("http://localhost/callback")) {
            let token = event.url.split('=')[1].split('&')[0];
            resolve(token);
            listener.unsubscribe();
            browseRef.close();
        }
      });
    });
  }

  /*
  * Uses the OAuth code from spotifyLogin to retrieve an access token from Spotify's API
  */ 
  getAccessToken(accessCode) {
    return new Promise(resolve => {
      let tokenUrl = 'https://accounts.spotify.com/api/token';
      let headers = new HttpHeaders().set('Authorization', 'Basic '+btoa(this.client_id+':'+this.client_secret)).set('Content-Type', 'application/x-www-form-urlencoded');
      let body = 'grant_type=authorization_code&redirect_uri=http://localhost/callback&code='+accessCode;
      this.http.post(tokenUrl, body,
      {
        headers: headers
      }).subscribe((data: any) => {
        this.accessToken = data.access_token;
        this.refreshToken = data.refresh_token;
        resolve(data);
      }, (err) => {
        alert("Failed to acquire access token");
        alert(JSON.stringify(err));
      });
    });
  }
}
