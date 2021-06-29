import { UrlPipe } from './../../_pipes/url.pipe';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
	declarations: [NavbarComponent, FooterComponent, UrlPipe],
	imports: [CommonModule, FormsModule, RouterModule, NgbTooltipModule, NgbDropdownModule],
	exports: [NavbarComponent, FooterComponent],
})
export class SharedModule {}
