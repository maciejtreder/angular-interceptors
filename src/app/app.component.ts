import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
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

  public user: any = this.userService.getUser();
  public secretInfo: Observable<any> = of(null);

  constructor(private userService: UserService) {}

  public onSubmit(): void {
    this.userService.authenticate(this.loginForm.value).subscribe( _ => {
      this.user = this.userService.getUser();
      this.loginForm.reset();
    });
  }

  public showSecret(): void {
    this.secretInfo =  this.userService.getSecretInfo();
  }

  public invalidateAuthToken(): void {
    this.userService.invalidateAuthToken();
  }
}
