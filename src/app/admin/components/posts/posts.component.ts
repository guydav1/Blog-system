import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { finalize } from "rxjs/operators";
import { Post, PostService } from "src/app/services/post.service";

@Component({
	selector: "app-posts",
	templateUrl: "./posts.component.html",
	styleUrls: ["./posts.component.css"],
})
export class PostsComponent implements OnInit {
	searchQuery: string = "";
	sortValue: string = "publishDate";
	sortOrder: "asc" | "desc" = "desc";
	error: boolean = false;
	deleted: boolean = false;
	loaded: boolean = false;
	posts: Post[] | undefined;
	totalPosts: number | undefined;
	pageSize = 10;
	pageIndex = 0;

	displayedColumns: string[] = ["title", "author", "comments", "date", "publishDate", "actions"];
	dataSource!: MatTableDataSource<Post>;
	@ViewChild(MatSort) sort!: MatSort;
	@ViewChild(MatPaginator) paginator!: MatPaginator;

	constructor(private postService: PostService, private router: Router) {}

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
		this.postService.updatePost({ _id: post._id, isLocked: post.isLocked }).subscribe(
			res => {
				console.log(res);
			},
			err => {
				post.isLocked = !post.isLocked;
			}
		);
	}

	handlePublish(post: Post) {
		post.isPublished = !post.isPublished;
		this.postService.updatePost({ _id: post._id, isPublished: post.isPublished }).subscribe(
			res => {
				post.publishDate = res.publishDate;
			},
			err => {
				post.isPublished = !post.isPublished;
			}
		);
	}

	handleDelete(post: Post) {
		this.postService.deletePost(post._id).subscribe(res => {
			this.deleted = true;
			this.fetchPosts();
		});
	}

	handleEdit(post: Post) {
		this.router.navigateByUrl("admin/posts/edit/" + post._id);
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
		if (this.sortValue == type) {
			this.sortOrder = this.sortOrder == "asc" ? "desc" : "asc";
		} else {
			this.sortOrder = "desc";
			this.sortValue = type;
		}
	}

	applySearch(event: Event) {
		this.paginator.firstPage();
	}
}
