import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

interface CommentRespone {
	totalComments: number;
	comments: Array<Comment>;
}
export interface Comment {
	postId?: string;
	postTitle?: string;
	_id: string;
	author: string;
	body: string;
	date: Date;
	postedBy?: { username: string };
}

@Injectable({
	providedIn: 'root',
})
export class CommentService {
	constructor(private http: HttpClient) {}

	editComment(commentId: string, comment: Comment) {
		return this.http
			.put(environment.apiUrl + '/posts/comments/' + commentId, comment)
			.pipe(retry(1), catchError(this.errorHandler));
	}
	deleteComment(commentId: string) {
		return this.http
			.delete(environment.apiUrl + '/posts/comments/' + commentId)
			.pipe(retry(1), catchError(this.errorHandler));
	}

	getComments(pageIndex?: number, pageSize?: number, search?: string) {
		if (!search) {
			search = '';
		}
		const params = new HttpParams()
			.set('limit', '' + pageSize)
			.set('page', '' + pageIndex)
			.set('search', '' + search);
		return this.http
			.get<CommentRespone>(environment.apiUrl + '/posts/all/comments', { params })
			.pipe(retry(1), catchError(this.errorHandler));
	}

	addComment(id: string, comment: { author: string; body: string }) {
		return this.http
			.post<Array<Comment>>(`${environment.apiUrl}/posts/${id}/comments`, {
				id,
				comment,
			})
			.pipe(retry(1), catchError(this.errorHandler));
	}
	errorHandler(error: any) {
		return throwError(error);
	}
}
