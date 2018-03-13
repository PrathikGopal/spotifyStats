import { NgModule } from '@angular/core';
import { SharedModule } from '../../app/shared.module';
import { IonicPageModule } from 'ionic-angular';
import { ArtistDetailPage } from '../artist-detail/artist-detail';

@NgModule({
    declarations: [ArtistDetailPage],
    exports: [ArtistDetailPage],
    imports: [IonicPageModule.forChild(ArtistDetailPage), SharedModule]
})
export class ArtistDetailModule {}