import { UsersComponent } from "./pages/users/users.component";
import { AuthGuard } from "./../guards/auth.guard";
import { StatisticsComponent } from "./pages/statistics/statistics.component";
import { CommentsComponent } from "./pages/comments/comments.component";
import { SettingsPageComponent } from "./pages/settings-page/settings-page.component";
import { SocialComponent } from "./components/social/social.component";
import { EditPostComponent } from "./components/edit-post/edit-post.component";
import { MainPageComponent } from "./components/main-page/main-page.component";
import { AddPostComponent } from "./components/add-post/add-post.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LayoutComponent } from "./layout.component";
import { PostsComponent } from "./components/posts/posts.component";
import { AuthLayoutComponent } from "../_layouts/auth-layout/auth-layout.component";
import { LoginComponent } from "./pages/login/login.component";

const routes: Routes = [
	{
		path: "",
		component: LayoutComponent,
		children: [
			{ path: "settings", component: SettingsPageComponent },
			{ path: "posts/edit/:id", component: EditPostComponent },
			{ path: "posts", component: PostsComponent },
			{ path: "add-post", component: AddPostComponent },
			{ path: "comments", component: CommentsComponent },
			{ path: "stats", component: StatisticsComponent },
			{ path: "users", component: UsersComponent },
			{ path: "", component: MainPageComponent },
		],
		canActivate: [AuthGuard],
	},

	{
		path: "",
		component: AuthLayoutComponent,
		children: [{ path: "login", component: LoginComponent }],
	},
	{ path: "**", redirectTo: "" },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AdminRoutingModule {}
