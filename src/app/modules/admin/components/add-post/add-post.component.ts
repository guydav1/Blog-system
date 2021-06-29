import { Post } from './../../../../services/post.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PostService } from 'src/app/services/post.service';

@Component({
	selector: 'app-add-post',
	templateUrl: './add-post.component.html',
	styleUrls: ['./add-post.component.css'],
})
export class AddPostComponent implements OnInit {

	constructor(private postService: PostService, private router: Router, private toastr: ToastrService) {}

	ngOnInit(): void {}

	onSubmit(newPost: Post) {
		console.log(newPost);
		this.postService.addPost(newPost).subscribe(
			s => {
				this.toastr.success('Post Added Successfuly, moving back to posts panel');
				setTimeout(() => {
					this.router.navigateByUrl('/admin/posts');
				}, 1500);
			},
			error => {
				console.log(error);
				this.toastr.error('Add Failed, Please try again');
			}
		);
	}
}
