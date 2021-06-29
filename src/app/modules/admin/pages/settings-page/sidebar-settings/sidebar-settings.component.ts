import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { take, finalize } from 'rxjs/operators';
import { Config, ConfigService } from 'src/app/services/config.service';

@Component({
	selector: 'app-sidebar-settings',
	templateUrl: './sidebar-settings.component.html',
	styleUrls: ['./sidebar-settings.component.css'],
})
export class SidebarSettingsComponent implements OnInit {
	sideBar = {
		imageUrl: '' as string,
		about: '' as string,
	};
	edited = false;
	isPictureLoaded = true;
	errorMessage = '';
	$config: Observable<Config>;

	constructor(private configService: ConfigService, private toastr: ToastrService) {
		this.$config = configService.configObservable;
	}

	ngOnInit(): void {
		this.configService.configObservable.pipe(take(1)).subscribe(config => {
			if (config.sideBar) {
				this.sideBar = config.sideBar;
			}
		});
	}

	onUploadPicture(event: any) {
		const file: File = event.target.files[0] as File;
		if (!file) {
			return;
		}
		this.errorMessage = '';
		this.isPictureLoaded = false;
		const form = new FormData();

		form.append('image', file, file.name);

		this.configService
			.uploadImage(form, 'sidebar')
			.pipe(finalize(() => (this.isPictureLoaded = true)))
			.subscribe(
				res => {
					this.toastr.success('Profile Picture Added');
					this.sideBar.imageUrl = res.sideBar.imageUrl;
				},
				err => {
					this.errorMessage = err.error.message;
					this.toastr.error('Upload Failed!');
				}
			);
	}

	deleteSidebarPicture() {
		this.isPictureLoaded = false;
		this.configService
			.deleteImage('sidebar')
			.pipe(finalize(() => (this.isPictureLoaded = true)))
			.subscribe(
				res => {
					this.toastr.success('Sidebar Picture Deleted');
					this.sideBar.imageUrl = '';
				},
				err => {
					this.errorMessage = err.error.message;
					this.toastr.error('Delete Failed!');
				}
			);
	}

	handleSideBarSave() {
		this.configService.updateSideBar(this.sideBar.about).subscribe(
			res => {
				this.toastr.success('Sidebar Edited successfuly');
			},
			err => {
				console.log(err);
				this.toastr.error('Sidebar Edit Failed, Please try again');
			}
		);
	}
}
