import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { Comment } from "src/app/services/comment.service";

@Component({
	selector: "app-comment",
	templateUrl: "./comment.component.html",
	styleUrls: ["./comment.component.css"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentComponent implements OnInit {
	@Input("data") comment?: Comment;
	@Input("index") index: number = 0;

	constructor() {}

	ngOnInit(): void {}
}
