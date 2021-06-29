import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { Post, PostService } from 'src/app/services/post.service';

@Component({
	selector: 'app-posts',
	templateUrl: './posts.component.html',
	styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit {
	@ViewChild(MatSort) sort!: MatSort;
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	searchQuery = '';
	sortValue = 'isPublished,publishDate';
	sortOrder: 'asc' | 'desc' = 'desc';
	error = false;
	deleted = false;
	loaded = false;
	posts: Post[] | undefined;
	totalPosts: number | undefined;
	pageSize = 10;
	pageIndex = 0;

	displayedColumns: string[] = ['title', 'author', 'comments', 'date', 'publishDate', 'actions'];
	dataSource!: MatTableDataSource<Post>;

	constructor(private postService: PostService, private router: Router, private toastr: ToastrService) {}

	ngOnInit(): void {
		this.fetchPosts();
	}

	page(e: PageEvent) {
		window.scroll(0, 0);
		this.pageSize = e.pageSize;
		this.pageIndex = e.pageIndex;
	}

	handleLock(post: Post) {
		post.isLocked = !post.isLocked;
		this.postService.updatePost(post._id, { isLocked: post.isLocked }).subscribe(
			res => {
				const msg: string = post.isLocked
					? `Post's Comments Locked Successfuly`
					: `Post's Comments UnLocked Successfuly`;
				this.toastr.success(msg);
			},
			err => {
				post.isLocked = !post.isLocked;
				this.toastr.error('Post Lock/Unlock Failed!');
			}
		);
	}

	handlePublish(post: Post) {
		post.isPublished = !post.isPublished;
		this.postService.updatePost(post._id, { isPublished: post.isPublished }).subscribe(
			res => {
				post.publishDate = res.publishDate;
				const msg: string = post.isPublished ? 'Post Published Successfuly' : 'Post Hided Successfuly';

				this.toastr.success(msg);
			},
			err => {
				post.isPublished = !post.isPublished;
				this.toastr.error('Post Publish/Hide Failed!');
			}
		);
	}

	handleDelete(post: Post) {
		this.postService.deletePost(post._id).subscribe(
			res => {
				this.deleted = true;
				this.fetchPosts();
				this.toastr.success('Post Deleted Successfuly');
			},
			err => {
				this.toastr.error('Post Delete Failed!');
			}
		);
	}

	handleEdit(post: Post) {
		this.router.navigateByUrl('admin/posts/edit/' + post._id);
	}

	fetchPosts() {
		this.postService
			.getAllPosts()
			.pipe(finalize(() => (this.loaded = true)))
			.subscribe(
				({ totalPosts, posts }) => {
					this.error = false;
					this.posts = posts;
					this.totalPosts = totalPosts;
					this.dataSource = new MatTableDataSource(posts);
					this.dataSource.paginator = this.paginator;
					this.dataSource.sort = this.sort;
				},
				error => {
					console.log(error);
					this.error = true;
				}
			);
	}

	handleSort(type: string) {

		if (this.sortValue === type) {
			this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
		} else {
			this.sortOrder = 'desc';
			this.sortValue = type;
		}
	}

	applySearch(event: Event) {
		this.paginator.firstPage();
	}
}
