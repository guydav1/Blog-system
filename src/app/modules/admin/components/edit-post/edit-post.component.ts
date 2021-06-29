import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Post, PostService } from 'src/app/services/post.service';

@Component({
	selector: 'app-edit-post',
	templateUrl: './edit-post.component.html',
	styleUrls: ['./edit-post.component.css'],
})
export class EditPostComponent implements OnInit {
	post: Partial<Post> | undefined;
	constructor(
		private postService: PostService,
		private route: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService
	) {}

	ngOnInit(): void {
		const postId = this.route.snapshot.paramMap.get('id');
		if (postId) {
			this.fetchPost(postId);
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

	onSubmit(updatedPost: Post) {
		if (this.post?._id) {
			this.postService.updatePost(this.post._id, updatedPost).subscribe(
				res => {
					this.toastr.success('Post Edited Successfuly, moving back to posts panel');
					setTimeout(() => {
						this.router.navigateByUrl('/admin/posts');
					}, 1500);
				},
				err => {
					console.log(err);
					this.toastr.error('Edit Failed, Please try again');
				}
			);
		}
	}
}
