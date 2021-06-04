import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { map, take } from "rxjs/operators";
import { Post, PostService } from "./../../services/post.service";
import { PageEvent } from "@angular/material/paginator";
import { Config, ConfigService } from "src/app/services/config.service";

@Component({
	selector: "app-posts",
	templateUrl: "./posts.component.html",
	styleUrls: ["./posts.component.css"],
})
export class PostsComponent implements OnInit {
	@Input("posts") posts: Post[] | null = null;
	@Input("totalPosts") totalPosts: number | undefined;
	// @Input("minified") minified: boolean | null = false;
	@Input("fetchFunction") fetchFunction: Function | undefined;
	@Input("hidePageSize") hidePageSize: boolean = false;
	pageSizeOptions = [5,10,25];
	pageEvent: PageEvent | undefined;
	pageSize = 10;
	defaultImageUrl: Config["defaultImageUrl"] | undefined;


	constructor(private postService: PostService, private router: Router,private route: ActivatedRoute,private configService: ConfigService) {}

	ngOnInit(): void {
		this.configService.configObservable.pipe(take(1)).subscribe(config => this.defaultImageUrl = config.defaultImageUrl);
		if (!this.posts) {
			this.fetchPosts();
		}
	}

	fetchPosts() {
		this.postService.getPostsByPage(0, this.pageSize).subscribe(({ totalPosts, posts }) => {
			this.totalPosts = totalPosts;
			this.posts = posts;
		});
	}

	getServerData(event: PageEvent) {
		window.scroll(0, 0);
		if(!this.fetchFunction){
			this.postService.getPostsByPage(event?.pageIndex, event?.pageSize).subscribe(({ totalPosts, posts }) => {
				this.posts = posts;
				this.totalPosts = totalPosts;
			});
		}
		else { this.fetchFunction(event?.pageIndex, event?.pageSize); }
		return event;
	}
}
