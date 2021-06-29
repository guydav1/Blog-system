import { AuthService } from './../../../../services/auth.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { User, UserService } from 'src/app/services/user.service';
import { Role } from '../../../../services/user.service';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit, OnDestroy {
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	newUser = { role: Role.admin, username: '', password: '', confirmPassword: '', email: '' };

	users: User[] | undefined;
	totalUsers: number | undefined;
	chosenUserId: string | undefined;
	searchQuery = '';

	error = false;
	deleted = false;
	loaded = false;
	edited = false;
	searching = false;

	pageSize = 10;
	pageIndex = 0;

	loggedUser$;

	private searchSubject = new Subject<string>();
	private subscription: Subscription | undefined;

	constructor(private userService: UserService, private authService: AuthService, private toastr: ToastrService) {
		this.loggedUser$ = this.authService.userObservable;
	}

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

	handleEdit(user: User) {
		if (localStorage.getItem('userId') !== user._id) {
			this.chosenUserId = user._id;
			this.newUser.role = user.role;
			this.newUser.username = user.username;
			this.newUser.email = user.email;
		}
	}

	handleEditSubmit() {
		if (this.newUser.password !== '' && this.newUser.password !== this.newUser.confirmPassword) {
			this.toastr.error('Failed, Password does not match');
			return;
		}
		if (!this.chosenUserId) {
			return;
		}
		this.userService.updateUser(this.chosenUserId, this.newUser).subscribe(
			res => {
				const originalUser = this.users?.find(user => user._id === this.chosenUserId);
				if (originalUser) {
					Object.assign(originalUser, res);
				}
				this.newUser = { role: Role.admin, username: '', password: '', confirmPassword: '', email: '' };
				this.chosenUserId = undefined;
				this.edited = true;
				this.toastr.success('User Updated');
			},
			err => {
				console.log(err);
				this.toastr.error('Update Failed!');
			}
		);
	}

	deleteUser(user: User) {
		if (localStorage.getItem('userId') !== user._id) {
			this.userService.deleteUser(user._id).subscribe(
				res => {
					this.deleted = true;
					if (this.users) {
						const indexUser: number = this.users.indexOf(user);
						if (indexUser !== -1) {
							this.users.splice(indexUser, 1);
						}
					}
					this.toastr.success('User Deleted');
				},
				err => {
					console.log(err);
					this.toastr.error('Delete Failed!');
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

	addUser() {
		const user = this.newUser;
		if (!user.password || !user.confirmPassword || !user.role || !user.username) {
			this.toastr.error('Failed, some fields are missing');

			return;
		}
		//check passwords
		if (user.password !== user.confirmPassword) {
			this.toastr.error('Failed, Password does not match');
			return;
		}
		const { confirmPassword, ...newUser } = user;
		this.userService.addUser(newUser).subscribe(res => {
			this.newUser = { role: Role.admin, username: '', password: '', confirmPassword: '', email: '' };
			this.fetchUsers(this.pageIndex, this.pageSize);
			this.toastr.success('User Added');
		});
	}
}
