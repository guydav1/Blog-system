import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { Config, ConfigService } from 'src/app/services/config.service';

@Component({
	selector: 'app-contact-settings',
	templateUrl: './contact-settings.component.html',
	styleUrls: ['./contact-settings.component.css'],
})
export class ContactSettingsComponent implements OnInit {
	isLoading = false;
	contact$: Observable<Config['pages']['contact']>;

	constructor(private configService: ConfigService, private toastr: ToastrService) {
		this.contact$ = this.configService.configObservable.pipe(map(config => config.pages.contact));
	}

	ngOnInit(): void {
		this.configService.fetchConfig();
	}

	onSubmit(f: NgForm) {
		this.isLoading = true;
		this.configService
			.updateContact(f.value)
			.pipe(finalize(() => (this.isLoading = false)))
			.subscribe(
				res => {
					this.toastr.success('Contact Information Updated Successfuly.');
				},
				err => {
					console.log(err);
					this.toastr.error('Update Failed, Please try again.');
				}
			);
	}
}
