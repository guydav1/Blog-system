import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { Subject, Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { User, UserService } from "src/app/services/user.service";

@Component({
	selector: "app-users",
	templateUrl: "./users.component.html",
	styleUrls: ["./users.component.css"],
})
export class UsersComponent implements OnInit, OnDestroy {
	users: User[] | undefined;
	totalUsers: number | undefined;
	chosenUserEdit: User | undefined;
	searchQuery: string = "";

	error: boolean = false;
	deleted: boolean = false;
	loaded: boolean = false;
	edited: boolean = false;
	searching: boolean = false;

	pageSize: number = 10;
	pageIndex: number = 0;

	private searchSubject = new Subject<string>();
	private subscription: Subscription | undefined;
	@ViewChild(MatPaginator) paginator!: MatPaginator;

	constructor(private userService: UserService) {}

	ngOnInit(): void {
		this.fetchUsers(0, 10);
		this.subscription = this.searchSubject
			.pipe(debounceTime(1000), distinctUntilChanged())
			.subscribe(_ => this.applySearch());
	}

	ngOnDestroy(): void {
		this.subscription?.unsubscribe();
	}

	fetchUsers(pageIndex: number, pageSize: number, search?: string) {
		this.loaded = false;

		this.userService.getUsers(pageIndex, pageSize, search).subscribe(
			({ totalUsers, users }) => {
				this.users = users;
				this.totalUsers = totalUsers;
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

	// updateRole(user: User) {
	// 	this.userService.updateUser(user._id, user).subscribe(
	// 		res => {
	// 			console.log("shubi dubi");
	// 		},
	// 		err => {
	// 			console.log("yohai");
	// 		}
	// 	);
	// }

	handleEdit(user: User) {
		if(localStorage.get("userId") !== user._id)
		{
			this.chosenUserEdit = { ...user };
		}
	}

	// newRole?: string, newUsername?: string
	handleEditSubmit() {
		this.userService.updateUser(this.chosenUserEdit!._id, this.chosenUserEdit!).subscribe(
			res => {
				let originalUser = this.users?.find(user => user._id == this.chosenUserEdit!._id);
				if (originalUser) {
					Object.assign(originalUser, this.chosenUserEdit) 
					// originalUser.role = this.chosenUserEdit!.role;
					// originalUser.username = this.chosenUserEdit!.username;
				}

				this.chosenUserEdit = undefined;
				this.edited = true;
			},
			err => {
				console.log(err);
			}
		);
	}

	deleteUser(user: User) {
		if(localStorage.get("userId") !== user._id)
		{
			this.userService.deleteUser(user._id).subscribe(
				res => {
					this.deleted= true;
					let indexUser: number = this.users!.indexOf(user);
					if(indexUser !== -1){
						this.users?.splice(indexUser,1);
					}
					//this.users = this.users?.filter(user=> user._id !== this.chosenUserEdit!._id);	
						},
				err => {
					console.log(err);
				}
			);
			
		}
	}

	page(e: PageEvent) {
		window.scroll(0, 0);
		this.pageSize = e.pageSize;
		this.pageIndex = e.pageIndex;
		this.fetchUsers(this.pageIndex, this.pageSize);
	}

	keyUp(value: string) {
		this.searchSubject.next(value);
	}

	applySearch() {
		this.searching = true;
		this.paginator?.firstPage();
		this.fetchUsers(this.pageIndex, this.pageSize, this.searchQuery);
	}
}
