import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Post, PostService } from "src/app/services/post.service";

@Component({
	selector: "app-add-post",
	templateUrl: "./add-post.component.html",
	styleUrls: ["./add-post.component.css"],
})
export class AddPostComponent implements OnInit {
	title: string | undefined;
	author?: string = "admin";
	text: string | undefined;
	tags: string[] | undefined;
	description: string | undefined;
	imageURL: string | undefined;
	publish: boolean = true;
	allowComments: boolean = true;
	submitted: boolean = false;
	errorMessage: string | undefined;
	successMessage: string | undefined;
	test: any;
	constructor(private postService: PostService, private router: Router) {}

	testi(){
		console.log(this.test)
	}

	ngOnInit(): void {}

	tagsListener(e: Event, v: string) {
		this.tags = v
			.split(",")
			.map(tag => tag.trim())
			.filter(tag => tag !== "");
	}

	onSubmit(f: NgForm) {
		if (this.title && this.text && this.tags && this.description) {
			this.submitted = true;
			this.postService
				.addPost({
					body: this.text,
					title: this.title,
					author: this.author,
					description: this.description,
					imageURL: this.imageURL,
					tags: this.tags,
					isLocked: !this.allowComments,
					isPublished: this.publish,
				})
				.subscribe(
					s => {
						this.successMessage = "DONE 👍..moving back to posts panel";
						setTimeout(() => {
							this.router.navigateByUrl("/admin/posts");
						}, 3000);
					},
					error => {
						console.log(error);
						this.errorMessage = "Try again";
						this.submitted = false;
					}
				);
		}
	}
}
