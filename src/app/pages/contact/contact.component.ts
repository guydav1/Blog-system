import { Config } from './../../services/config.service';
import { ConfigService } from 'src/app/services/config.service';
import { ToastrService } from 'ngx-toastr';
import { EmailService } from './../../services/email.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { finalize, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-contact',
	templateUrl: './contact.component.html',
	styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
	name = '';
	mail = '';
	text = '';
	contact$: Observable<Config['pages']['contact']>;
	submitted = false;
	constructor(
		private emailService: EmailService,
		private configService: ConfigService,
		private toastr: ToastrService
	) {
		this.contact$ = this.configService.configObservable.pipe(map(config => config.pages?.contact));
	}

	ngOnInit(): void {}

	onSubmit(f: NgForm) {
		if (this.name && this.mail && this.text) {
			this.submitted = true;
			this.emailService
				.sendEmail(this.name, this.mail, this.text)
				.pipe(finalize(() => (this.submitted = false)))
				.subscribe(
					res => {
						f.reset();
						this.toastr.success('Message Sent Successfuly');
					},
					err => {
						this.toastr.error('Something went wrong, please try again.');
					}
				);
		}
	}
}
