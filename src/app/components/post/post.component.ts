import { map } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Post, PostService } from "src/app/services/post.service";
import { Comment } from "src/app/services/comment.service";

@Component({
	selector: "app-post",
	templateUrl: "./post.component.html",
	styleUrls: ["./post.component.css"],
})
export class PostComponent implements OnInit {
	post?: Post;
	pageIndex: number = 1;
	pageSize: number = 10;

	constructor(private postService: PostService, private route: ActivatedRoute) {}

	ngOnInit(): void {
		const id = this.route.snapshot.paramMap.get("id");
		if (id) {
			this.fetchPost(id);
		}
	}

	fetchPost(id: string) {
		this.postService.getPost(id).subscribe(post => {
			console.log(post);
			this.post = post;
		});
	}

	updateComments(e: Array<Comment>) {
		console.log(e);
		if (this.post) {
			this.post.comments = e;
		}
	}
}
