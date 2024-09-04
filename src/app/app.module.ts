import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LogInPageComponent } from './log-in-page/log-in-page.component';
import { GroupsPageComponent } from './groups-page/groups-page.component';
import { FormsModule } from '@angular/forms';
import { Group1PageComponent } from './group1-page/group1-page.component';
import { Group2PageComponent } from './group2-page/group2-page.component';
import { Group3PageComponent } from './group3-page/group3-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LogInPageComponent,
    GroupsPageComponent,
    Group1PageComponent,
    Group2PageComponent,
    Group3PageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }