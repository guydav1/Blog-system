import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  loggedUser$;
  constructor(private authService: AuthService) {
    this.loggedUser$ = this.authService.userObservable;
   }

  ngOnInit(): void {
  }


  logout(){
    this.authService.logout();
  }
}
