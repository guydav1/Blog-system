import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { Subject, Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { Comment, CommentService } from "./../../../services/comment.service";

@Component({
	selector: "app-comments",
	templateUrl: "./comments.component.html",
	styleUrls: ["./comments.component.css"],
})
export class CommentsComponent implements OnInit, OnDestroy {
	comments: Array<Comment> | undefined;
	chosenCommentEdit: Comment | undefined;
	searchQuery: string = "";

	error: boolean = false;
	deleted: boolean = false;
	loaded: boolean = false;
	searching: boolean = false;

	totalComments: number | undefined;
	pageSize = 10;
	pageIndex = 0;

	private searchSubject = new Subject<string>();
	private subscription: Subscription | undefined;
	@ViewChild(MatPaginator) paginator!: MatPaginator;

	constructor(private commentService: CommentService) {}

	ngOnInit(): void {
		this.fetchComments(this.pageIndex, this.pageSize);
		this.subscription = this.searchSubject
			.pipe(debounceTime(1000), distinctUntilChanged())
			.subscribe(_ => this.applySearch());
	}

	ngOnDestroy(): void {
		this.subscription?.unsubscribe();
	}

	fetchComments(pageIndex: number, pageSize: number, search?: string) {
		this.loaded = false;
		this.commentService.getComments(pageIndex, pageSize, search).subscribe(
			({ totalComments, comments }) => {
				this.comments = comments;
				this.totalComments = totalComments;
				this.loaded = true;
				this.error = false;
				this.searching = false;
			},
			err => {
				console.log(err.statusText);
				this.error = true;
				this.searching = false;
			}
		);
	}

	page(e: PageEvent) {
		window.scroll(0, 0);
		this.pageSize = e.pageSize;
		this.pageIndex = e.pageIndex;
		this.fetchComments(this.pageIndex, this.pageSize);
	}

	keyUp(value: string) {
		this.searchSubject.next(value);
	}

	applySearch() {
		this.searching = true;
		this.paginator?.firstPage();
		this.fetchComments(this.pageIndex, this.pageSize, this.searchQuery);
	}

	handleEdit(comment: Comment) {
		this.chosenCommentEdit = comment;
	}

	handleEditSubmit(newBody: string) {
		this.commentService
			.editComment(this.chosenCommentEdit!._id, { ...this.chosenCommentEdit!, body: newBody })
			.subscribe(
				res => {
					this.chosenCommentEdit!.body = newBody;
					this.chosenCommentEdit = undefined;
				},
				err => {}
			);
	}

	handleDelete(comment: Comment) {
		this.commentService.deleteComment(comment._id).subscribe(res => {
			this.deleted = true;
			this.fetchComments(this.pageIndex, this.pageSize);
		});
	}
}
