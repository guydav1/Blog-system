import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
	newUser = { username: '', password: '', confirmPassword: '', email: '' };

	constructor(private authService: AuthService, private route: Router, private toastr: ToastrService) {}
	ngOnInit(): void {}

	onSubmit() {
		const user = this.newUser;
		if (!user.password || !user.confirmPassword || !user.username || !user.email) {
			return;
		}
		//check passwords
		if (user.password !== user.confirmPassword) {
			return;
		}
		const { confirmPassword, ...newUser } = user;

		this.authService.register(newUser).subscribe(
			res => {
				this.route.navigate(['/']);
			},
			err => {
				this.toastr.error('Register Failed, Please try again');
			}
		);
	}
}
