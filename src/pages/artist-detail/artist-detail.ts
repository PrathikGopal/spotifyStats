import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';


@Component({
  selector: 'page-artist-detail',
  templateUrl: 'artist-detail.html',
})
export class ArtistDetailPage {
  item: any;
  albums: any;
  singles: any;

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, public restProvider: RestProvider) {
    this.item = navParams.get('item');
    restProvider.getArtistAlbums(this.item.id)
    .then((albums: any) => {
      this.albums = albums.items.filter(album => album.album_type == "album");
      this.singles = albums.items.filter(album => album.album_type == "single");
    });
  }

  close() {
    this.viewCtrl.dismiss();
  }
}