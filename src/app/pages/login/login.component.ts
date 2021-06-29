import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
	username = '';
	password = '';
	constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) {}

	ngOnInit(): void {
		if (this.authService.isLoggedIn()) {
			this.router.navigate(['/']);
		}
	}

	login() {
		if (!this.username || !this.password) {
			return;
		}
		this.authService.login(this.username, this.password).subscribe(
			res => {
				this.router.navigate(['/']);
			},
			err => {
				this.username = this.password = '';
				this.toastr.error('Login Failed, Please try again');
				console.log(err);
			}
		);
	}
}
