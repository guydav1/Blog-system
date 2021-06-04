import { NgForm } from '@angular/forms';
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";

@Component({
	selector: "app-navbar",
	templateUrl: "./navbar.component.html",
	styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
	searchInput: string = "";

	constructor(private router: Router) {}

	ngOnInit(): void {}

	onSubmit(form: NgForm) {
		if (this.searchInput) {
			this.router.navigate(["/", "search", this.searchInput]);
			form.reset();
		}
	}
}
