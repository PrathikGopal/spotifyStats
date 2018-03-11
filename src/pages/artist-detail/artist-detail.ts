import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams, PopoverController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-artist-detail',
  templateUrl: 'artist-detail.html',
})
export class ArtistDetailPage {
  item: any;
  albums: any;
  singles: any;

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams,
    public restProvider: RestProvider, public iab: InAppBrowser, public popoverCtrl: PopoverController) {
    this.item = navParams.get('item');
      this.getArtistAlbums(this.item.id);
  }

  /**
   * Close this page
   */
  close() {
    this.viewCtrl.dismiss();
  }

  /**
   * Retrieve Album objects relating to a specified Artist
   * @param id Artist ID
   */
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

  /**
   * Launch the in-app browser to the artist's Spotify page
   */
  goTo() {
    this.viewCtrl.dismiss();
    this.iab.create(this.item.external_urls.spotify, "_system");
  }
}