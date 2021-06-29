import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostComponent } from './pages/post/post.component';
import { SearchResultsComponent } from './pages/search-results/search-results.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { PostsComponent } from './pages/posts/posts.component';
import { MainLayoutComponent } from './_layouts/main-layout/main-layout.component';
import { MainSidebarLayoutComponent } from './_layouts/main-sidebar-layout/main-sidebar-layout.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

const routes: Routes = [
	{
		path: 'admin',
		loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),

	},
	{ path: 'user', loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule) },
	{
		path: '',
		component: MainSidebarLayoutComponent,
		children: [
			{ path: 'search/tags/:tag', component: SearchResultsComponent },
			{ path: 'search/:query', component: SearchResultsComponent },
			{ path: 'post/:id', component: PostComponent },
			{ path: 'posts', component: PostsComponent },
			{ path: '', component: MainPageComponent },
		],
	},
	{
		path: '',
		component: MainLayoutComponent,
		children: [
			{ path: 'about', component: AboutComponent },
			{ path: 'contact', component: ContactComponent },
			{ path: 'login', component: LoginComponent },
			{ path: 'register', component: RegisterComponent },
			{ path: 'u/:username', component: UserProfileComponent },
			{ path: '**', redirectTo: '/' },
		],
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })],
	exports: [RouterModule],
})
export class AppRoutingModule {}
