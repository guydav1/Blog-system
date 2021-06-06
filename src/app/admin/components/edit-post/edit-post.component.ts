import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Post, PostService } from "src/app/services/post.service";

@Component({
	selector: "app-edit-post",
	templateUrl: "./edit-post.component.html",
	styleUrls: ["./edit-post.component.css"],
})
export class EditPostComponent implements OnInit {
	post: Partial<Post> | undefined;
	tags: string | undefined;
	submit: boolean = false;
	errorMessage: string | undefined;
	successMessage: string | undefined;

	constructor(private postService: PostService, private route: ActivatedRoute, private router: Router) {}

	ngOnInit(): void {
		if (this.route.snapshot.paramMap.get("id")) {
			this.fetchPost(this.route.snapshot.paramMap.get("id")!);
		}
	}

	fetchPost(id: string) {
		this.postService.getPost(id).subscribe(
			post => {
				this.post = post;
			},
			error => {
				console.log(error);
			}
		);
	}

	tagsParser(v: string) {
		return v
			.split(",")
			.map(tag => tag.trim())
			.filter(tag => tag !== "");
	}

	onSubmit(f: NgForm) {
		if (this.post && this.post.title && this.post.body && this.post.tags && this.post.description) {
			this.submit = true;
			this.post.tags = this.tagsParser(this.post.tags.toString());
			this.postService.updatePost(this.post!).subscribe(
				res => {
					this.successMessage = "DONE 👍..moving back to posts panel";
					setTimeout(() => {
						this.router.navigateByUrl("/admin/posts");
					}, 3000);
				},
				err => {
					console.log(err);
					this.errorMessage = "Try again 😢";
					this.submit = false;
				}
			);
		}
	}
}
