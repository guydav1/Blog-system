import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Comment, CommentService } from "./../../services/comment.service";

@Component({
	selector: "app-add-comment",
	templateUrl: "./add-comment.component.html",
	styleUrls: ["./add-comment.component.css"],
	// changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddCommentComponent implements OnInit {
	@Output() newComments = new EventEmitter<Array<Comment>>(); //change array to comment array

	private id: string | null = null;
	author: string = "";
	body: string = "";
	errorMessage: string = "";
	successMessage: string = "";

	submitted: boolean = false;

	constructor(private commentService: CommentService, private route: ActivatedRoute) {}

	ngOnInit(): void {
		this.id = this.route.snapshot.paramMap.get("id");
	}

	log(t:any) {console.log(t);}

	onSubmit(f: NgForm) {
		if (this.id && this.author && this.body) {
			this.submitted = true;
			this.commentService
				.addComment(this.id, {
					author: this.author,
					body: this.body,
				})
				.subscribe(res => {
					this.submitted = false;
					f.resetForm();
					this.successMessage = "Comment added";
					this.newComments.emit(res);
				});
		} else {
			this.errorMessage = "ERROR DUMMY";
		}
	}
}
