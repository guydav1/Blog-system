import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbDropdownModule, NgbModule, NgbPaginationModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ToastNoAnimationModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddCommentComponent } from './components/add-comment/add-comment.component';
import { CommentComponent } from './components/comment/comment.component';
import { PostsListComponent } from './components/posts-list/posts-list.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { httpInterceptorProviders } from './interceptors';
import { SharedModule } from './modules/shared/shared.module';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { LoginComponent } from './pages/login/login.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { PostComponent } from './pages/post/post.component';
import { PostsComponent } from './pages/posts/posts.component';
import { RegisterComponent } from './pages/register/register.component';
import { SearchResultsComponent } from './pages/search-results/search-results.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { MainLayoutComponent } from './_layouts/main-layout/main-layout.component';
import { MainSidebarLayoutComponent } from './_layouts/main-sidebar-layout/main-sidebar-layout.component';
import { SafePipe } from './_pipes/safe.pipe';

@NgModule({
	declarations: [
		AppComponent,
		PostComponent,
		CommentComponent,
		PostsComponent,
		AddCommentComponent,
		SearchResultsComponent,
		AboutComponent,
		MainLayoutComponent,
		ContactComponent,
		MainSidebarLayoutComponent,
		MainPageComponent,
		SafePipe,
		SidebarComponent,
		PostsListComponent,
		UserProfileComponent,
		LoginComponent,
		RegisterComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		SharedModule,
		FormsModule,
		NgbModule,
		NgbToastModule,
		BrowserAnimationsModule,
		MatPaginatorModule,
		NgbPaginationModule,
		EditorModule,
		NgbDropdownModule,
		ToastNoAnimationModule.forRoot({
			positionClass: 'toast-bottom-center',
			timeOut: 5000,
			preventDuplicates: true,
			maxOpened: 1,
			autoDismiss: true,
			closeButton: false,
		}),
	],
	providers: [httpInterceptorProviders],
	bootstrap: [AppComponent],
})
export class AppModule {}
