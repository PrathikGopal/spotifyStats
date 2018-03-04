import { Component } from '@angular/core';

import { ContactPage } from '../contact/contact';
import { ArtistsPage } from '../artists/artists';
import { TracksPage } from '../tracks/tracks';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ArtistsPage;
  tab2Root = TracksPage;
  tab3Root = ContactPage;

  constructor() {

  }
}
