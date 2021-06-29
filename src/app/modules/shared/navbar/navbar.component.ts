import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
	loggedUser$;
	isLoggedIn: boolean;
	constructor(private authService: AuthService) {
		this.loggedUser$ = authService.userObservable;
		this.isLoggedIn = this.authService.isLoggedIn();
	}

	ngOnInit(): void {}

	logout() {
		this.authService.logout();
		this.isLoggedIn = this.authService.isLoggedIn();
	}
}
