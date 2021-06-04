import { DragDropModule } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatPaginatorModule } from "@angular/material/paginator";
import { NgbModule, NgbToastModule } from "@ng-bootstrap/ng-bootstrap";
import { EditorModule } from "@tinymce/tinymce-angular";
import { FilterPipe } from "../_pipes/filter.pipe";
import { SortPipe } from './../_pipes/sort.pipe';
import { AdminRoutingModule } from "./admin-routing.module";
import { AddPostComponent } from "./components/add-post/add-post.component";
import { EditPostComponent } from "./components/edit-post/edit-post.component";
import { MainPageComponent } from "./components/main-page/main-page.component";
import { PostsComponent } from "./components/posts/posts.component";
import { NavbarComponent } from "./components/shared/navbar/navbar.component";
import { SidebarComponent } from "./components/shared/sidebar/sidebar.component";
import { SocialComponent } from "./components/social/social.component";
import { LayoutComponent } from "./layout.component";
import { SettingsPageComponent } from "./pages/settings-page/settings-page.component";
import { CommentsComponent } from './pages/comments/comments.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthLayoutComponent } from "../_layouts/auth-layout/auth-layout.component";
import { UsersComponent } from './pages/users/users.component';
//import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
//import {AuthInterceptor} from "../interceptors/auth.interceptor"
//import { httpInterceptorProviders } from "../interceptors";
@NgModule({
	declarations: [
		AddPostComponent,
		LayoutComponent,
		SidebarComponent,
		NavbarComponent,
		MainPageComponent,
		PostsComponent,
		EditPostComponent,
		SocialComponent,
		SettingsPageComponent,
		FilterPipe,
		SortPipe,
		CommentsComponent,
		StatisticsComponent,
		LoginComponent,
		AuthLayoutComponent,
  UsersComponent
	],
	imports: [
		CommonModule,
		AdminRoutingModule,
		FormsModule,
		NgbModule,
		NgbToastModule,
		DragDropModule,
		MatPaginatorModule,
		EditorModule,
		//HttpClientModule
	],
	providers: [
		//{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
		//httpInterceptorProviders,
	]
})
export class AdminModule {}
