import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogInPageComponent } from './log-in-page/log-in-page.component';
import { GroupsPageComponent } from './groups-page/groups-page.component';
import { Group1PageComponent } from './group1-page/group1-page.component';
import { Group2PageComponent } from './group2-page/group2-page.component';
import { Group3PageComponent } from './group3-page/group3-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LogInPageComponent },
  { path: 'groups', component: GroupsPageComponent },
  { path: 'group1-page', component: Group1PageComponent },
  { path: 'group2-page', component: Group2PageComponent },
  { path: 'group3-page', component: Group3PageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }