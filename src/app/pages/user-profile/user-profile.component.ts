import { ActivatedRoute } from '@angular/router';
import { User, UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-user',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
	user: User | undefined;
	comments: any | undefined;
	isLoaded = false;

	constructor(public userService: UserService, private route: ActivatedRoute) {}

	ngOnInit(): void {
		this.route.params.subscribe(({ username }) => {
			if (username) {
				this.userService.getUserByUsername(username).subscribe(
					user => {
						this.user = user;

						this.isLoaded = true;
					},
					err => (this.isLoaded = true)
				);
				this.userService.getUserComments(username).subscribe(
					comments => {
						this.comments = comments;
					},
					err => {
						console.log(err);
					}
				);
			}
		});
	}
}
