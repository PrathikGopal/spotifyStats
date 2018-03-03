import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Base64 } from '@ionic-native/base64';

@Injectable()
export class RestProvider {
  apiUrl = "https://api.spotify.com/v1";
  accessToken: string;
  refreshToken: string;
  client_id = '4fbbbc24ce04402db628408c8fe642af';
  client_secret = '13ce8764df824250add89867741acb13';

  constructor(public http: HttpClient, public base64: Base64) {
    console.log('Hello RestProvider Provider');
  }

  getTop(accessToken) {
    return new Promise(resolve => {
      alert("Access Token: " + accessToken);
      let headers = new HttpHeaders().set('Authorization', 'Bearer ' + accessToken).set('Accept', 'application/json');
      //headers.append('Accept', 'application/json');

      alert(JSON.stringify(headers));

      this.http.get(this.apiUrl+"/browse/new-releases", {
        headers: headers
      })
      .subscribe(data => {
        alert("Success");
        alert(data);
        resolve(data);
      }, (err) => {
        alert(JSON.stringify(err));
        console.log(err);
      });
    });
  }

  getAccessToken(accessCode) {
    return new Promise(resolve => {
      alert("Access Code: " + accessCode);
      let tokenUrl = 'https://accounts.spotify.com/api/token';
      let headers = new HttpHeaders().set('Authorization', 'Basic '+btoa(this.client_id+':'+this.client_secret)).set('Content-Type', 'application/x-www-form-urlencoded');
      let body = 'grant_type=authorization_code&redirect_uri=http://localhost/callback&code='+accessCode;
      this.http.post(tokenUrl, body,
      {
        headers: headers
      }).subscribe(data => {
        alert("Success");
        alert(JSON.stringify(data));
      }, (err) => {
        alert("Failure.");
        alert(JSON.stringify(err));
      });
    });
  }
}
