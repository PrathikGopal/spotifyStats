import { NgModule } from '@angular/core';
import { SharedModule } from '../../app/shared.module';
import { IonicPageModule } from 'ionic-angular';
import { ArtistsPage } from '../artists/artists';

@NgModule({
    declarations: [ArtistsPage],
    exports: [ArtistsPage],
    imports: [IonicPageModule.forChild(ArtistsPage), SharedModule]
})
export class ArtistsModule {}