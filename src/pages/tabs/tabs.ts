import { Component } from '@angular/core';
import { ArtistsPage } from '../artists/artists';
import { TracksPage } from '../tracks/tracks';
import { GenresPage } from '../genres/genres';

@Component({
  selector: 'tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ArtistsPage;
  tab2Root = TracksPage;
  tab3Root = GenresPage;
  
  constructor() {

  }
}