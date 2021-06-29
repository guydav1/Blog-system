import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
	loggedUser$;
	constructor(private authService: AuthService) {
		this.loggedUser$ = this.authService.userObservable;
	}

	ngOnInit(): void {}

	logout() {
		this.authService.logout();
	}
}
