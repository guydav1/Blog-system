import { Component, OnInit } from '@angular/core';
import { Post, PostService } from './../../services/post.service';

@Component({
	selector: 'app-posts',
	templateUrl: './posts.component.html',
	styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit {
	posts: Post[] | null = null;
	totalPosts: number | undefined;

	constructor(
		private postService: PostService,
	) {}

	ngOnInit(): void {
		this.fetchPosts(0, 10);
	}

	fetchPosts(pageIndex: number, pageSize: number) {
		this.postService.getPostsByPage(pageIndex, pageSize).subscribe(({ totalPosts, posts }) => {
			this.totalPosts = totalPosts;
			this.posts = posts;
		});
	}

	handlePage(event: { pageIndex: number; pageSize: number }) {
		this.fetchPosts(event.pageIndex, event.pageSize);
	}
}
