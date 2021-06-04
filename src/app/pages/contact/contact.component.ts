import { EmailService } from "./../../services/email.service";
import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { finalize } from "rxjs/operators";

@Component({
	selector: "app-contact",
	templateUrl: "./contact.component.html",
	styleUrls: ["./contact.component.css"],
})
export class ContactComponent implements OnInit {
	name: string = "";
	mail: string = "";
	text: string = "";
	errorMessage: string = "";
	successMessage: string = "";

	submitted: boolean = false;
	constructor(private emailService: EmailService) {}

	ngOnInit(): void {}

	onSubmit(f: NgForm) {
		if (this.name && this.mail && this.text) {
			this.submitted = true;
			this.emailService
				.sendEmail(this.name, this.mail, this.text)
				.pipe(
					finalize(() => {
						this.submitted = false;
					})
				)
				.subscribe(
					res => {
						f.reset();
						this.successMessage = "Email send successfully";
					},
					err => {
						this.errorMessage = "Something went wrong, please try again.";
					}
				);
		} else {
			this.errorMessage = "All fields are required";
		}
	}
}
