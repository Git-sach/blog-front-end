import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginHttpService } from '../../../core/http/login-http.service';
import { AuthStore } from '../../../core/store/auth.store';

@Component({
  selector: 'app-login-container',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="form_container">
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="header">
            <h1>Sign up</h1>
          </div>
          <div class="body">
            <div class="input">
              <label for="userName">Username</label>
              <input type="text" id="userName" formControlName="userName" />
            </div>
            <div class="input">
              <label for="password">Password</label>
              <input type="password" name="" id="password" formControlName="password" />
            </div>
          </div>
          <div class="footer">
            <button class="button solid">Sign in</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: `
    .container {
      height: calc(100vh - 6vh);
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .form_container form {
        width: 350px;
        height: 370px;
        // background-color:  var(--grey_subtle_background);
        border: 1px solid var(--grey_subtle_borders_separators);
        border-radius: 5px;
        // ----
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 20px 20px;
        .header {
          h1 {
            margin: 0;
          }
        }
        .body {
          display: flex;
          flex-direction: column;
          gap: 10px;
          .input {
            display: flex;
            flex-direction: column;
            width: 100%;
          }
        }
        .footer {
          margin-left: auto;
        }
      }
    }
  `,
})
export class LoginContainerComponent {
  // TODO: Refacto avec l'architecture route / facade / sumb / smart

  authStore = inject(AuthStore);
  loginHttp = inject(LoginHttpService);
  router = inject(Router);
  fb = inject(FormBuilder);

  loginForm = this.fb.group({
    userName: [''],
    password: [''],
  });

  onSubmit() {
    const userName = this.loginForm.get('userName')?.value;
    const password = this.loginForm.get('password')?.value;
    if (userName && password) {
      this.loginHttp.login(userName, password).subscribe((token) => {
        this.authStore.authToken = token;
        this.router.navigate([this.authStore.previousUrl]);
      });
    }
  }
}
