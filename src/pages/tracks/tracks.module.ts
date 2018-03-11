import { NgModule } from '@angular/core';
import { SharedModule } from '../../app/shared.module';
import { IonicPageModule } from 'ionic-angular';
import { TracksPage } from '../tracks/tracks';

@NgModule({
    declarations: [TracksPage],
    exports: [TracksPage],
    imports: [IonicPageModule.forChild(TracksPage), SharedModule]
})
export class Module {}