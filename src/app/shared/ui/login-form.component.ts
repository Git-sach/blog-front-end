import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

/**
 * A presentational component for display a login form
 * @argument isAuthenticationFailed The authentification' statu
 */
@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="form_container">
        <form [formGroup]="loginForm" (ngSubmit)="submitLoginForm()">
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
            @if (isAuthenticationFailed) {
            <p class="error-color">Authentification erroné</p>
            }
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
        border: 1px solid var(--grey_subtle_borders_separators);
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 10px  20px 20px 20px;
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

          .error-color {
            color: var(--error_color);
          }
        }
        .footer {
          margin-left: auto;
        }
      }
    }
    `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
  fb = inject(FormBuilder);

  @Output() submitEmitter = new EventEmitter<{ userName: string; password: string }>();
  @Input() isAuthenticationFailed: boolean | null = false;

  loginForm = this.fb.group({
    userName: [''],
    password: [''],
  });

  submitLoginForm() {
    const userName = this.loginForm.get('userName')?.value ?? '';
    const password = this.loginForm.get('password')?.value ?? '';

    this.submitEmitter.emit({ userName: userName, password: password });
  }
}
