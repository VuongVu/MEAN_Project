import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

import { Users } from '../../models/users';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  name: String;
  email: String;
  username: String;
  password: String;

  constructor(
    private validateService: ValidateService,
    private flashMessagesService: FlashMessagesService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onRegisterSubmit() {
    const user: Users = {
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password
    };

    // Required fields
    if (!this.validateService.validateRegister(user)) {
      this.flashMessagesService.show('Please fill in all fields.', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    // Validate email
    if (!this.validateService.validateEmail(user.email)) {
      this.flashMessagesService.show('Please use a valid email.', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    // Register user
    this.authService.registerUser(user).subscribe((data: any) => {
      if (data.success) {
        this.flashMessagesService.show('You are now registered and can log in.', {cssClass: 'alert-success', timeout: 3000});
        this.router.navigate(['/login']);
      } else {
        this.flashMessagesService.show('Something went wrong.', {cssClass: 'alert-danger', timeout: 3000});
        this.router.navigate(['/register']);
      };
    }, err => console.log(err));
  }

}
