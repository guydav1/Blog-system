import { Component, OnInit } from "@angular/core";
import { take } from "rxjs/operators";
import { Config, ConfigService } from "src/app/services/config.service";
import { Post, PostService } from "src/app/services/post.service";

@Component({
	selector: "app-main-page",
	templateUrl: "./main-page.component.html",
	styleUrls: ["./main-page.component.css"],
})
export class MainPageComponent implements OnInit {
	posts: Post[] | undefined;
	defaultImageUrl: Config["defaultImageUrl"] | undefined;

	constructor(private postService: PostService, private configService: ConfigService) {}

	ngOnInit(): void {
		this.configService.configObservable
			.pipe(take(1))
			.subscribe(config => (this.defaultImageUrl = config.defaultImageUrl));
		this.fetchPosts();
	}

	fetchPosts() {
		this.postService.getPostsByPage(0, 5).subscribe(
			({ posts }) => {
				this.posts = posts;
			},
			err => {
				console.log(err);
			}
		);
	}
}
