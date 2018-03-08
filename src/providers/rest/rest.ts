import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Base64 } from '@ionic-native/base64';
import { InAppBrowser, InAppBrowserObject } from '@ionic-native/in-app-browser';
import { Storage } from '@ionic/storage';

@Injectable()
export class RestProvider {
  apiUrl = "https://api.spotify.com/v1";
  oauthCode : any;
  accessToken: string;
  refreshToken: string;
  expiration: any;
  client_id = '4fbbbc24ce04402db628408c8fe642af';
  client_secret = '13ce8764df824250add89867741acb13';

  constructor(private storage: Storage, public http: HttpClient, public base64: Base64, public iab: InAppBrowser) {
    storage.get('accessToken').then(accessToken => {
      this.accessToken = accessToken;
      //alert("Access Token Loaded " + this.accessToken);
    });
    storage.get('refreshToken').then(refreshToken => {
      this.refreshToken = refreshToken;
      //alert("RefreshToken Loaded " + this.refreshToken);
    })
    storage.get('expiration').then(expiration => {
      this.expiration = expiration;
      //alert("Expiration " + this.expiration);
    });
  }

  /*
  * Retrieves the user's top artists for a "medium-term" time period (default)
  */
  getTopArtists(timespan = "short_term") {
    return new Promise(resolve => {
      let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.accessToken).set('Accept', 'application/json');
      let params = new HttpParams().set('time_range', timespan).set('limit', "50");
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
  * Retrieve a single artist object
  */
  getArtist(id: string) {
    return new Promise(resolve => {
      let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.accessToken).set('Accept', 'application/json');
      this.http.get(this.apiUrl+"/artists/"+id, {
        headers: headers
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
  * Retrieve an array of Albums relating to a single Artist ID
  */
 getArtistAlbums(id: string) {
   return new Promise(resolve => {
     let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.accessToken).set('Accept', 'application/json');
     this.http.get(this.apiUrl+"/artists/"+id+"/albums", {
       headers: headers
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
      let params = new HttpParams().set('time_range', timespan).set('limit', "50");
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

  public tokenExpired() {
    if (Date.now() > this.expiration) {
      // Token has expired
      return true;
    }
    else {
      return false;
    }
  }

  /*
  * Refresh the access token
  */
  public requestNewToken() {
    // alert("Old Access Token " + this.accessToken);
    // alert("Old Refresh Token " + this.refreshToken);
    // alert("Old Expiration " + this.expiration);
    return new Promise(resolve => {
      let tokenUrl = 'https://accounts.spotify.com/api/token';
      let headers = new HttpHeaders().set('Authorization', 'Basic '+btoa(this.client_id+':'+this.client_secret)).set('Content-Type', 'application/x-www-form-urlencoded');
      let body = 'grant_type=refresh_token&refresh_token='+this.refreshToken;
      this.http.post(tokenUrl, body,
      {
        headers: headers
      }).subscribe((data: any) => {
        this.storage.set('accessToken', data.access_token);
        this.accessToken = data.access_token;
        //alert("Access Token Set: " + this.accessToken);

        let expiration = Date.now() + (data.expires_in * 1000);
        this.storage.set('expiration', expiration);
        this.expiration = expiration;
        //alert("Expiration Set: " + this.expiration);

        //alert("New tokens assigned and saved");
        resolve(data);
      }, (err) => {
        alert("Failed to acquire access token");
        alert(JSON.stringify(err));
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
      let fullUrl = apiURL + "?client_id="+this.client_id+"&show_dialog=true&response_type=code&redirect_uri="+redirectUri+"&scope="+scope+"&state="+state;
      let browseRef = this.iab.create(fullUrl, "_blank", "location=no");
      let listener = browseRef.on('loadstart').subscribe((event: any) => {
        if (event.url.startsWith("http://localhost/callback")) {
            let token = event.url.split('=')[1].split('&')[0];
            this.oauthCode = token;
            resolve(token);
            browseRef.close();
            listener.unsubscribe(); 
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
      })
      .subscribe((data: any) => {
        this.storage.set('accessToken', data.access_token);
        this.accessToken = data.access_token;
        //alert("Access Token Set: " + this.accessToken);

        this.storage.set('refreshToken', data.refresh_token);
        this.refreshToken = data.refresh_token;
        //alert("Refresh Token Set: " + this.refreshToken);

        let expiration = Date.now() + (data.expires_in * 1000);
        this.storage.set('expiration', expiration);
        this.expiration = expiration;
        //alert("Expiration Set: " + this.expiration);

        //alert("Initial Tokens all set");
        resolve(data);
      }, (err) => {
        alert("Failed to acquire access token");
        alert(JSON.stringify(err));
      });
    });
  }

  logout() {
    return new Promise(resolve => {
      this.storage.remove('accessToken');
      this.storage.remove('refreshToken');
      this.storage.remove('expiration');
      this.accessToken = undefined;
      this.refreshToken = undefined;
      this.expiration = undefined;
      resolve();
    });
  }
}
