import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Storage } from '@ionic/storage';

@Injectable()
export class RestProvider {
  webServiceURL = 'https://my-project-1497801619165.appspot.com';
  apiUrl = "https://api.spotify.com/v1";
  accessToken: string;
  refreshToken: string;
  expiration: any;
  timeLabel: string;

  constructor(private storage: Storage, public http: HttpClient, public iab: InAppBrowser) {
    this.timeLabel = "Past Month";
    storage.get('accessToken').then(accessToken => {
      this.accessToken = accessToken;
    });
    storage.get('refreshToken').then(refreshToken => {
      this.refreshToken = refreshToken;
    })
    storage.get('expiration').then(expiration => {
      this.expiration = expiration;
    });
  }

  /**
  * Retrieves the user's top artists for a "medium-term" time period (default)
  */
  getTopArtists() {
    let timespan: string;
    switch(this.timeLabel) { // Determine the time range to request
      case "Past Month":
        timespan = "short_term";
        break;
      case "Past 6 Months":
        timespan = "medium_term";
        break;
      case "All Time":
        timespan = "long_term";
        break;
      default:
        this.timeLabel = "Past Month";
        timespan = "short_term";
    }
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.accessToken).set('Accept', 'application/json');
      let params = new HttpParams().set('time_range', timespan).set('limit', "50");
      this.http.get(this.apiUrl+"/me/top/artists", {
        headers: headers,
        params: params
      })
      .subscribe(data => {
        resolve(data);
      }, (error) => {
        alert("Could not retrieve top Artist data");
        console.log('ERROR in rest.getTopArtists: ' + error.message);
        reject(error);
      });
    });
  }

  /**
  * Retrieve a single artist object
  * @param id Artist ID
  */
  getArtist(id: string) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.accessToken).set('Accept', 'application/json');
      this.http.get(this.apiUrl+"/artists/"+id, {
        headers: headers
      })
      .subscribe(data => {
        resolve(data);
      }, (error) => {
        alert("Could not retrieve Artist data");
        console.log('ERROR in rest.getArtist: ' + error.message);
        reject(error);
      });
    });
  }

  /**
  * Retrieve an array of Albums relating to a single Artist ID
  * @param id Artist ID
  */
 getArtistAlbums(id: string) {
   return new Promise((resolve, reject) => {
     let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.accessToken).set('Accept', 'application/json');
     this.http.get(this.apiUrl+"/artists/"+id+"/albums", {
       headers: headers
     })
     .subscribe(data => {
       resolve(data);
     }, (error) => {
       alert("Could not retrieve Album data");
       console.log('ERROR in rest.getArtistAlbums: ' + error.message);
       reject(error);
     });
   });
 }

  /**
  * Retrieves the user's top tracks for a "medium-term" time period (default)
  */
  getTopTracks() {
    let timespan: string;
    switch(this.timeLabel) { // Determine the time range to request
      case "Past Month":
        timespan = "short_term";
        break;
      case "Past 6 Months":
        timespan = "medium_term";
        break;
      case "All Time":
        timespan = "long_term";
        break;
      default:
        this.timeLabel = "Past Month";
        timespan = "short_term";
    }
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.accessToken).set('Accept', 'application/json');
      let params = new HttpParams().set('time_range', timespan).set('limit', "50");
      this.http.get(this.apiUrl+"/me/top/tracks", {
        headers: headers,
        params: params
      })
      .subscribe(data => {
        resolve(data);
      }, (error) => {
        alert("Could not retrieve top Track data");
        console.log('ERROR in rest.getTopTracks: ' + error.message);
        reject(error);
      });
    });
  }

  /**
   * Returns boolean 'true' if the access token has expired
   */
  public tokenExpired(): boolean {
    if (Date.now() > this.expiration) {
      // Token has expired
      return true;
    }
    else {
      return false;
    }
  }

  /**
   * Return the Spotify OAuth code from Spotify Account Services
   */
  public spotifyOauth(): Promise<any> {
    return new Promise((resolve, reject) => {
      let browseRef = this.iab.create(this.webServiceURL+"/oauth", "_blank", "location=no");
      let listener = browseRef.on('loadstart').subscribe((event: any) => {
        if (event.url.startsWith('https://localhost/callback')) {
          let oAuthCode = event.url.split('=')[1].split('&')[0];
          resolve(oAuthCode);
          browseRef.close();
          listener.unsubscribe();
        }
      })
    });
  }

  /**
   * Retrieve access and refresh tokens through the uTrack Web Service
   * @param oauthCode The code returned by the Spotify Authorization Service
   */
  getTokens(oauthCode: string) {
    return new Promise((resolve, reject) => {
      let body = {
        code: oauthCode,
        state: 'state'
      }
      this.http.post(this.webServiceURL+'/getTokens', body)
      .subscribe((data: any) => {
        this.storage.set('accessToken', data.access_token);
        this.accessToken = data.access_token;

        this.storage.set('refreshToken', data.refresh_token);
        this.refreshToken = data.refresh_token;

        let expiration = Date.now() + (data.expires_in * 1000);
        this.storage.set('expiration', expiration);
        this.expiration = expiration;

        resolve(data);
      }, (error) => {
        alert("Could not connect to Spotify Service");
        console.log('ERROR in rest.getTokens: ' + error.message);
        reject(error);
      });
    });
  }

  /**
   * Refresh the access token through the uTrack Web Service
   */
  requestNewToken() {
    this.accessToken = '';
    return new Promise((resolve, reject) => {
      let body = {
        refresh_token: this.refreshToken
      };
      this.http.post(this.webServiceURL+'/refreshToken', body)
      .subscribe((data: any) => {
        this.storage.set('accessToken', data.access_token);
        this.accessToken = data.access_token;
        let expiration = Date.now() + (data.expires_in * 1000);
        this.storage.set('expiration', expiration);
        this.expiration = expiration;

        resolve(data);
      }, (error) => {
        alert("Failed to refresh Spotify connection");
        console.log('ERROR in rest.requestNewToken: ' + error.message);
        reject(error);
      });
    });
  }

  /**
   * Remove all token data from storage and log out the user
   */
  logout() {
    return new Promise((resolve, reject) => {
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