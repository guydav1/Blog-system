import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NavbarComponent } from "./navbar/navbar.component";
import { FooterComponent } from "./footer/footer.component";
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
	declarations: [NavbarComponent, FooterComponent],
	imports: [CommonModule, FormsModule, RouterModule, NgbTooltipModule],
	exports: [NavbarComponent, FooterComponent],
})
export class SharedModule {}
