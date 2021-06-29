import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthLayoutComponent } from '../../_layouts/auth-layout/auth-layout.component';
import { AddPostComponent } from './components/add-post/add-post.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { PostsComponent } from './components/posts/posts.component';
import { LayoutComponent } from './layout.component';
import { CommentsComponent } from './pages/comments/comments.component';
import { LoginComponent } from './pages/login/login.component';
import { AboutSettingsComponent } from './pages/settings-page/about-settings/about-settings.component';
import { ContactSettingsComponent } from './pages/settings-page/contact-settings/contact-settings.component';
import { FooterSettingsComponent } from './pages/settings-page/footer-settings/footer-settings.component';
import { GeneralSettingsComponent } from './pages/settings-page/general-settings/general-settings.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { SidebarSettingsComponent } from './pages/settings-page/sidebar-settings/sidebar-settings.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { UsersComponent } from './pages/users/users.component';

const routes: Routes = [
	{
		path: '',
		component: LayoutComponent,
		children: [
			{ path: 'settings', redirectTo: 'settings/general' },
			{
				path: 'settings',
				component: SettingsPageComponent,
				children: [
					{ path: 'footer', component: FooterSettingsComponent },
					{ path: 'general', component: GeneralSettingsComponent },
					{ path: 'sidebar', component: SidebarSettingsComponent },
					{ path: 'about-page', component: AboutSettingsComponent },
					{ path: 'contact-page', component: ContactSettingsComponent },
				],
			},
			{ path: 'posts/edit/:id', component: EditPostComponent },
			{ path: 'posts', component: PostsComponent },
			{ path: 'add-post', component: AddPostComponent },
			{ path: 'comments', component: CommentsComponent },
			{ path: 'stats', component: StatisticsComponent },
			{ path: 'users', component: UsersComponent },
			{ path: '', component: MainPageComponent },
		],
		canActivate: [AuthGuard],
	},

	{
		path: '',
		component: AuthLayoutComponent,
		children: [{ path: 'login', component: LoginComponent }],
	},
	{ path: '**', redirectTo: '' },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AdminRoutingModule {}
