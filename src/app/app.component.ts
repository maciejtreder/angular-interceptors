import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public loginForm: FormGroup = new FormGroup({
    login: new FormControl(''),
    password: new FormControl('')
  });

  public info: Observable<any> = this.userService.getInfo();
  public secretInfo: Observable<any> = this.userService.getSecretInfo();

  constructor(private userService: UserService) {}

  public onSubmit(): void {
    this.userService.authenticate(this.loginForm.value).subscribe( _ => {
      this.info = this.userService.getInfo();
    });
  }

  public showSecret(): void {
    this.secretInfo =  this.userService.getSecretInfo();
  }

  public invalidateAuthToken(): void {
    this.userService.invalidateAuthToken();
  }
}
