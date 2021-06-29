import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
	selector: 'app-user-settings',
	templateUrl: './user-settings.component.html',
	styleUrls: ['./user-settings.component.css'],
})
export class UserSettingsComponent implements OnInit {
	$loggerUser;
	updateUser: any = {};
	edited = false;
	isPictureLoaded = true;
	isCoverLoaded = true;
	errorMessage = '';
	constructor(private authService: AuthService, public userService: UserService, private toastr: ToastrService) {
		this.$loggerUser = authService.userObservable;
	}

	ngOnInit(): void {}

	onUploadCoverPicture(event: any) {
		this.errorMessage = '';
		this.isCoverLoaded = false;
		const file: File = event.target.files[0] as File;
		const form = new FormData();
		form.append('image', file, file.name);
		this.authService
			.uploadUserCover(form)
			.pipe(finalize(() => (this.isCoverLoaded = true)))
			.subscribe(
				res => {
					this.toastr.success('Cover Picture Added');
				},
				err => {
					this.errorMessage = err.error.message;
					this.toastr.error('Upload Failed!');
				}
			);
	}

	onUploadProfilePicture(event: any) {
		this.errorMessage = '';
		this.isPictureLoaded = false;
		const file: File = event.target.files[0] as File;
		const form = new FormData();
		form.append('image', file, file.name);
		this.authService
			.uploadUserAvatar(form)
			.pipe(finalize(() => (this.isPictureLoaded = true)))
			.subscribe(
				res => {
					this.toastr.success('Profile Picture Added');
				},
				err => {
					this.errorMessage = err.error.message;
					this.toastr.error('Upload Failed!');
				}
			);
	}

	deleteProfilePicture() {
		this.isPictureLoaded = false;
		this.authService.deleteUserAvatar()
		.pipe(finalize(() => (this.isPictureLoaded = true)))
		.subscribe(
			res => {
				this.toastr.success('Profile Picture Deleted');
			},
			err => {
				this.errorMessage = err.error.message;
				this.toastr.error('Delete Failed!');
			}
		);
	}
	deleteCoverPicture() {
		this.isCoverLoaded = false;
		this.authService.deleteUserCover()
		.pipe(finalize(() => (this.isCoverLoaded = true)))
		.subscribe(
			res => {
				this.toastr.success('Cover Picture Deleted');
			},
			err => {
				this.errorMessage = err.error.message;
				this.toastr.error('Delete Failed!');
			}
		);
	}

	onSubmit(form: NgForm) {
		if (!form.pristine) {
			if (
				!form.controls.password.pristine &&
				form.controls.password.value !== form.controls.confirmpassword.value
			) {
				// check if password changed and compare to the confirm , need find shorter condition
				return;
			}

			for (const control in form.controls) {
				// dynamic - but require form controls name to be as server excpected
				if (!form.controls[control].pristine) {
					// check if if the user has changed the value in the UI
					this.updateUser[control] = form.controls[control].value;
				}
			}
			this.authService.updateUserSettings(this.updateUser).subscribe(
				res => {
					// TODO: fix form reset to dynamic
					this.toastr.success('Settings Updated');
					form.controls.password.reset();
					form.controls.confirmpassword.reset();

				},
				err => {
					console.log(err);
					this.toastr.error('Update Failed!');
				}
			);
		}
	}
}
