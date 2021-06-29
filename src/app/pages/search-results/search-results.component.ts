import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { PostService } from 'src/app/services/post.service';
import { Post } from '../../services/post.service';

@Component({
	selector: 'app-search-results',
	templateUrl: './search-results.component.html',
	styleUrls: ['./search-results.component.css'],
})
export class SearchResultsComponent implements OnInit, OnDestroy {
	posts: Post[] | null = null;
	totalPosts: number | undefined;
	routerSubscription;
	searchString = '';
	isLoaded = false;

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
		this.posts = null;
		this.isLoaded = false;
		if (this.route.snapshot.url.length >= 3 && this.route.snapshot.url[1].path === 'tags') {
			// search by tag [/search/tags/:tag]
			if (this.route.snapshot.paramMap.has('tag')) {
				const tag = this.route.snapshot.paramMap.get('tag')!;
				this.searchString = tag;
				this.postService
					.getPostsByTag(tag, page)
					.pipe(finalize(() => (this.isLoaded = true)))
					.subscribe(({ totalPosts, posts }) => {
						this.posts = posts;
						this.totalPosts = totalPosts;
					});
			}
		} else {
			// search by query [/search/:query]
			if (this.route.snapshot.paramMap.has('query')) {
				const query = this.route.snapshot.paramMap.get('query')!;
				this.searchString = query;
				this.postService
					.searchPosts(query, page)
					.pipe(finalize(() => (this.isLoaded = true)))
					.subscribe(({ totalPosts, posts }) => {
						this.posts = posts;
						this.totalPosts = totalPosts;
					});
			}
		}
	}

	handlePage(event: { pageIndex: number; pageSize: number }) {
		this.search(event.pageIndex, event.pageSize);
	}
}
