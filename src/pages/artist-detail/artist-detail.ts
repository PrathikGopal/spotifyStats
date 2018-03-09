import { Component } from '@angular/core';
import { ViewController, NavController, NavParams, PopoverController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-artist-detail',
  templateUrl: 'artist-detail.html',
})
export class ArtistDetailPage {
  item: any;
  albums: any;
  singles: any;

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams
    , public restProvider: RestProvider, public iab: InAppBrowser, public popoverCtrl: PopoverController) {
    this.item = navParams.get('item');
    this.getArtistAlbums(this.item.id);
  }

  close() {
    this.viewCtrl.dismiss();
  }

  getArtistAlbums(id: string) {
    if (this.restProvider.tokenExpired()) {
      //alert("Token has expired, requesting a new one");
      this.restProvider.requestNewToken()
      .then(() => {
        return this.restProvider.getArtistAlbums(this.item.id);
      })
      .then((albums: any) => {
        this.albums = albums.items.filter(album => album.album_type == "album");
        this.singles = albums.items.filter(album => album.album_type == "single");
      });
    }
    else {
      this.restProvider.getArtistAlbums(this.item.id)
      .then((albums: any) => {
        this.albums = albums.items.filter(album => album.album_type == "album");
        this.singles = albums.items.filter(album => album.album_type == "single");
      });
    }
  }

  goTo() {
    this.viewCtrl.dismiss();
    let browseRef = this.iab.create(this.item.external_urls.spotify, "_system");
  }
}