import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgbDropdownModule, NgbModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FilterPipe } from '../../_pipes/filter.pipe';
import { SortPipe } from '../../_pipes/sort.pipe';
import { AdminRoutingModule } from './admin-routing.module';
import { AddPostComponent } from './components/add-post/add-post.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { PostFormComponent } from './components/post-form/post-form.component';
import { PostsComponent } from './components/posts/posts.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';
import { SocialComponent } from './components/social/social.component';
import { LayoutComponent } from './layout.component';
import { CommentsComponent } from './pages/comments/comments.component';
import { AboutSettingsComponent } from './pages/settings-page/about-settings/about-settings.component';
import { ContactSettingsComponent } from './pages/settings-page/contact-settings/contact-settings.component';
import { FooterSettingsComponent } from './pages/settings-page/footer-settings/footer-settings.component';
import { GeneralSettingsComponent } from './pages/settings-page/general-settings/general-settings.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { SidebarSettingsComponent } from './pages/settings-page/sidebar-settings/sidebar-settings.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { UsersComponent } from './pages/users/users.component';

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
		UsersComponent,
		FooterSettingsComponent,
		GeneralSettingsComponent,
		SidebarSettingsComponent,
		AboutSettingsComponent,
		ContactSettingsComponent,
		PostFormComponent,
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
		NgbDropdownModule,
	],
	providers: [],
})
export class AdminModule {}
