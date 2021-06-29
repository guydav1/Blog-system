import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { Comment, CommentService } from './../../services/comment.service';

@Component({
	selector: 'app-add-comment',
	templateUrl: './add-comment.component.html',
	styleUrls: ['./add-comment.component.css'],
})
export class AddCommentComponent implements OnInit {
	@Output() newComments = new EventEmitter<Array<Comment>>();

	author = '';
	body = '';
	submitted = false;
	isLoggedIn = false;
	loggedUser$;
	private id: string | null = null;

	constructor(
		private commentService: CommentService,
		private route: ActivatedRoute,
		private toastr: ToastrService,
		private authService: AuthService
	) {
		this.loggedUser$ = this.authService.userObservable;
	}

	ngOnInit(): void {
		this.id = this.route.snapshot.paramMap.get('id');
		this.isLoggedIn = this.authService.isLoggedIn();
	}

	onSubmit(f: NgForm) {
		if (this.id && this.body && (this.author || this.isLoggedIn)) {
			this.submitted = true;
			this.commentService
				.addComment(this.id, {
					author: this.author,
					body: this.body,
				})
				.pipe(finalize(() => (this.submitted = false)))
				.subscribe(
					res => {
						f.resetForm();
						this.toastr.success('Comment Added.');
						this.newComments.emit(res);
					},
					err => this.toastr.error('Something went wrong, Please try again.')
				);
		}
	}
}
