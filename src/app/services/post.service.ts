import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Comment } from './comment.service';

export interface Post {
	_id: string;
	title: string;
	author: string;
	date: Date;
	tags: string[];
	imageURL: string;
	description: string;
	publishDate: Date;
	isLocked: boolean;
	isPublished: boolean;
	body?: string;
	comments?: Array<Comment>;
	totalComments?: number;
}

interface Tag {
	_id: string;
	count: number;
}
export interface Response {
	posts: Post[];
	totalPosts: number;
}

@Injectable({
	providedIn: 'root',
})
export class PostService {
	tags$;
	private tags: ReplaySubject<Tag[]> = new ReplaySubject(1);
	constructor(private http: HttpClient) {
		this.tags$ = this.tags.asObservable();
		this.getTags();
	}

	getPostsByPage(page: number, limit: number) {
		const params = new HttpParams().set('page', '' + page).set('limit', '' + limit);
		return this.http
			.get<Response>(environment.apiUrl + '/posts', { params })
			.pipe(retry(1), catchError(this.errorHandler));
	}

	getAllPosts() {
		return this.http.get<Response>(environment.apiUrl + '/posts/all').pipe(retry(1), catchError(this.errorHandler));
	}
	getPost(id: string) {
		return this.http.get<Post>(environment.apiUrl + '/posts/' + id).pipe(retry(1), catchError(this.errorHandler));
	}

	searchPosts(searchTerm: string, page?: number) {
		const params = new HttpParams().set('search', searchTerm);
		if (page) {
			params.set('page', '' + page);
		}
		return this.http
			.get<Response>(environment.apiUrl + '/posts', { params })
			.pipe(retry(1), catchError(this.errorHandler));
	}

	getPostsByTag(tag: string, page?: number) {
		const params = new HttpParams().set('tag', tag);
		if (page) {
			params.set('page', '' + page);
		}

		return this.http
			.get<Response>(environment.apiUrl + '/posts', { params })
			.pipe(retry(1), catchError(this.errorHandler));
	}

	addPost(post: Partial<Post>) {
		return this.http
			.post<Post>(environment.apiUrl + '/posts/add', { post })
			.pipe(retry(1), catchError(this.errorHandler));
	}

	uploadImage(image: FormData) {
	 	return this.http
	 		.post<string>(environment.apiUrl + '/posts/upload/image', image)
	 		.pipe(catchError(this.errorHandler));
	 }

	deletePost(id: string) {
		return this.http.delete(environment.apiUrl + '/posts/' + id).pipe(retry(1), catchError(this.errorHandler));
	}

	updatePost(_id: string, post: Partial<Post>) {
		return this.http
			.put<Post>(environment.apiUrl + '/posts/' + _id, { post })
			.pipe(retry(1), catchError(this.errorHandler));
	}

	getTags() {
		this.http
			.get<Tag[]>(environment.apiUrl + '/posts/all/tags')
			.pipe(retry(1), catchError(this.errorHandler))
			.subscribe(tags => {
				this.tags.next(tags);
			});
	}

	errorHandler(error: any) {
		console.log(error);
		return throwError(error);
	}
}
