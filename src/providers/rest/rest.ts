import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class RestProvider {
  apiUrl = "https://api.spotify.com/v1";
  constructor(public http: HttpClient) {
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
}
