import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Comment } from 'src/app/services/comment.service';
import { Post, PostService } from 'src/app/services/post.service';
import { ConfigService } from './../../services/config.service';

@Component({
	selector: 'app-post',
	templateUrl: './post.component.html',
	styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
	post?: Post;
	pageIndex = 1;
	pageSize = 10;
	defaultImage$: Observable<string>;

	constructor(
		private postService: PostService,
		private route: ActivatedRoute,
		private configService: ConfigService,
		private viewportScroller: ViewportScroller
	) {
		this.defaultImage$ = this.configService.configObservable.pipe(map(config => config.defaultImageUrl));
	}

	ngOnInit(): void {
		const id = this.route.snapshot.paramMap.get('id');
		if (id) {
			this.fetchPost(id);
		}
	}

	fetchPost(id: string) {
		this.postService.getPost(id).subscribe(post => {
			this.post = post;
		});
	}

	updateComments(e: Array<Comment>) {
		if (this.post) {
			this.post.comments = e;
		}
	}

	scrollTo(anchor: string) {
		this.viewportScroller.scrollToAnchor(anchor);
	}
}
