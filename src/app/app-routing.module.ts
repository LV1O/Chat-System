import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogInPageComponent } from './log-in-page/log-in-page.component';
import { GroupsPageComponent } from './groups-page/groups-page.component';
import { Group1PageComponent } from './group1-page/group1-page.component';
import { Group2PageComponent } from './group2-page/group2-page.component';
import { Group3PageComponent } from './group3-page/group3-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect empty path to login
  { path: 'login', component: LogInPageComponent }, // Route for the login page
  { path: 'groups', component: GroupsPageComponent }, // Route for groups page
  { path: 'group1', component: Group1PageComponent }, // Route for group 1 page
  { path: 'group2', component: Group2PageComponent }, // Route for group 2 page
  { path: 'group3', component: Group3PageComponent }  // Route for group 3 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
