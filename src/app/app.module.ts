import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatPaginatorModule } from "@angular/material/paginator";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgbModule, NgbPaginationModule, NgbToastModule } from "@ng-bootstrap/ng-bootstrap";
import { EditorModule } from "@tinymce/tinymce-angular";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AddCommentComponent } from "./components/add-comment/add-comment.component";
import { CommentComponent } from "./components/comment/comment.component";
import { PostComponent } from "./components/post/post.component";
import { PostsComponent } from "./components/posts/posts.component";
import { SearchResultsComponent } from "./components/search-results/search-results.component";
import { httpInterceptorProviders } from "./interceptors";
import { AboutComponent } from "./pages/about/about.component";
import { ContactComponent } from "./pages/contact/contact.component";
import { MainPageComponent } from "./pages/main-page/main-page.component";
import { SharedModule } from "./shared/shared.module";
import { MainLayoutComponent } from "./_layouts/main-layout/main-layout.component";
import { MainSidebarLayoutComponent } from "./_layouts/main-sidebar-layout/main-sidebar-layout.component";
import { SafePipe } from "./_pipes/safe.pipe";
import { SidebarComponent } from './components/sidebar/sidebar.component';

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
	],
	providers: [httpInterceptorProviders],
	bootstrap: [AppComponent],
})
export class AppModule {}
