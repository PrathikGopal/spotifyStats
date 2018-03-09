import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ArtistsPage } from '../artists/artists';
import { TracksPage } from '../tracks/tracks';

import { GenresPage } from '../genres/genres';
import { NavParams } from 'ionic-angular';

@Component({
  selector: 'tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ArtistsPage;
  tab2Root = TracksPage;
  tab3Root = GenresPage;
  
  constructor(private navParams: NavParams) {

  }
}
