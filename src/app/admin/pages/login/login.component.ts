import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
	password: string = "";
	username: string = "";
	message: string = "";

	constructor(private authService: AuthService, private router: Router) {}

	ngOnInit(): void {}

	onSubmit() {
		this.authService.login(this.username, this.password).subscribe(
			res => {
				this.message = "wowy";
				this.router.navigate(['/admin'])
			},
			err => {
				this.message = "owy";
			}
		);
	}
}
