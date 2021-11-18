import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public $user: Observable<any> = this.userService.getUser();
  
  public loginForm: FormGroup = new FormGroup({
    login: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });
 
  constructor(private userService: UserService) {}
  
  ngOnInit(): void {
    this.loginForm.valueChanges.subscribe( () => this.loginForm.clearValidators())
  }

  public onSubmit(): void {
    this.userService.authenticate(this.loginForm.value).subscribe( success => {
      if (!success) {
        this.loginForm.reset();
        this.loginForm.setErrors({unauthorized: true})
      }
    });
  }
 

}
