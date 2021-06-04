import { Post } from "./../../services/post.service";
import { ActivatedRoute, Event, NavigationEnd, NavigationError, NavigationStart, Router } from "@angular/router";
import { PostService } from "src/app/services/post.service";
import { Component, OnDestroy, OnInit } from "@angular/core";

@Component({
	selector: "app-search-results",
	templateUrl: "./search-results.component.html",
	styleUrls: ["./search-results.component.css"],
})
export class SearchResultsComponent implements OnInit, OnDestroy {
	posts: Post[] | null = null;
	totalPosts: number | undefined;
	routerSubscription;

	constructor(private postService: PostService, private route: ActivatedRoute, private router: Router) {
		this.routerSubscription = this.router.events.subscribe((event: Event) => {
			if (event instanceof NavigationEnd) {
				// Hide loading indicator
				this.search(0);
			}
		});
	}
	ngOnDestroy(): void {
		this.routerSubscription.unsubscribe();
	}

	ngOnInit(): void {}
	search(page: number, pageSize?: number) {
		console.log("SERACH");
		if (this.route.snapshot.url.length >= 3 && this.route.snapshot.url[1].path === "tags") {
			// search by tag [/search/tags/:tag]
			if (this.route.snapshot.paramMap.get("tag")) {
				this.postService
					.getPostsByTag(this.route.snapshot.paramMap.get("tag")!,page)
					.subscribe(({ totalPosts, posts }) => {
						this.posts = posts;
						this.totalPosts = totalPosts;
					});
			}
		} else {
			// search by query [/search/:query]
			if (this.route.snapshot.paramMap.get("query")) {
				this.postService
					.searchPosts(this.route.snapshot.paramMap.get("query")!, page)
					.subscribe(({ totalPosts, posts }) => {
						this.posts = posts;
						this.totalPosts = totalPosts;
					});
			}
		}
	}
}
