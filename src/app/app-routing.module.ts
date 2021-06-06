import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PostComponent } from "./components/post/post.component";
import { PostsComponent } from "./components/posts/posts.component";
import { SearchResultsComponent } from "./components/search-results/search-results.component";
import { AuthGuard } from "./guards/auth.guard";
import { AboutComponent } from "./pages/about/about.component";
import { ContactComponent } from "./pages/contact/contact.component";
import { MainPageComponent } from "./pages/main-page/main-page.component";
import { MainLayoutComponent } from "./_layouts/main-layout/main-layout.component";
import { MainSidebarLayoutComponent } from "./_layouts/main-sidebar-layout/main-sidebar-layout.component";

const routes: Routes = [
	{
		path: "admin",
		loadChildren: () => import("./admin/admin.module").then(m => m.AdminModule),
	},
	{
		path: "",
		component: MainSidebarLayoutComponent,
		children: [
			{ path: "search/tags/:tag", component: SearchResultsComponent },
			{ path: "search/:query", component: SearchResultsComponent },
			{ path: "post/:id", component: PostComponent },
			{ path: "posts", component: PostsComponent },
			{ path: "", component: MainPageComponent },
		],
	},
	{
		path: "",
		component: MainLayoutComponent,
		children: [
			{ path: "about", component: AboutComponent },
			{ path: "contact", component: ContactComponent },
			{ path: "**", redirectTo: "/" },
		],
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { anchorScrolling: "enabled" , scrollPositionRestoration: 'enabled' }, )],
	exports: [RouterModule],
})
export class AppRoutingModule {}
