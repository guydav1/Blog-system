import { catchError, retry } from "rxjs/operators";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { throwError } from "rxjs";
import { Post } from "./post.service";

interface CommentRespone {
	totalComments: number;
	comments: Array<Comment>;
}
export interface Comment {
	//'_id': '$comments._id', 'author': '$comments.author', 'body': '$comments.body', 'date': '$comments.date'

	postId?: string;
	postTitle?: string;
	_id: string;
	author: string;
	body: string;
	date: Date;
}

@Injectable({
	providedIn: "root",
})
export class CommentService {

	constructor(private http: HttpClient) {}


	editComment(commentId: string, comment: Comment) {
		return this.http
		.put(environment.apiUrl + "/posts/comments/" + commentId, comment)
		.pipe(retry(1), catchError(this.errorHandler));

	}
	deleteComment(commentId: string) {
		return this.http
			.delete(environment.apiUrl + "/posts/comments/" + commentId)
			.pipe(retry(1), catchError(this.errorHandler));
	}

	getComments(pageIndex?: number, pageSize?: number, search?: string) {
		console.log("in getComments");
		if(!search) search = "";
		let params = new HttpParams().set("limit", "" + pageSize).set("page", "" + pageIndex).set("search", "" + search);
		return this.http
			.get<CommentRespone>(environment.apiUrl + "/posts/all/comments", {params})
			.pipe(retry(1), catchError(this.errorHandler));
	}

	addComment(id: string, comment: { author: string; body: string }) {
		return this.http
			.post<Array<Comment>>(`${environment.apiUrl}/posts/${id}/comments`, {
				id: id,
				comment: comment,
			})
			.pipe(retry(1), catchError(this.errorHandler));
	}
	errorHandler(error: any) {
		return throwError(error);
	}
}
