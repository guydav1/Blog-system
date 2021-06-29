import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserSettingsComponent } from './pages/user-settings/user-settings.component';
import { UserComponent } from './user.component';

const routes: Routes = [{ path: '', component: UserComponent, children: [
  {path: 'settings', component: UserSettingsComponent}
] }];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class UserRoutingModule {}
