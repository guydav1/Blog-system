import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { Post, PostService } from './../../../../services/post.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-post-form',
	templateUrl: './post-form.component.html',
	styleUrls: ['./post-form.component.css'],
})
export class PostFormComponent implements OnInit {
	@Input() postData: Partial<Post> | undefined | Post;
	@Output() formData: EventEmitter<Post> = new EventEmitter();
	imageURL: string | undefined;

	constructor(private postService: PostService, private toastr: ToastrService) {}

	ngOnInit(): void {
		this.imageURL = this.postData?.imageURL;
	}

	tagsParser(v: string) {
		return [
			...new Set(
				v
					.split(',')
					.map(tag => tag.trim())
					.filter(tag => tag !== '')
			),
		];
	}

	onUploadPicture(event: any) {
		const file = event.target.files[0] as File;
		if (!file) {
			return;
		}

		const form = new FormData();
		form.append('image', file, file.name);

		this.postService.uploadImage(form).subscribe(
			res => {
				this.imageURL = res;
			},
			err => {
				console.log(err);
				this.toastr.error('Upload Failed, Please try again.');
			}
		);
	}

	onDeletePicture() {
		this.imageURL = undefined;
	}

	onSubmit(f: NgForm) {
		if(f.valid)
		{
			const form = { ...f.value };
			form.imageURL = this.imageURL;
			form.tags = this.tagsParser(form.tags.toString());
			this.formData.emit(form);
		}
	}
}
