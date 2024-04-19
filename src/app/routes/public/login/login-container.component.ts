import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { LoginFormComponent } from '../../../shared/ui/login-form.component';
import { LoginFacade } from './login.facade';

/**
 * Smart Component for login
 */
@Component({
  selector: 'app-login-container',
  standalone: true,
  imports: [ReactiveFormsModule, LoginFormComponent, AsyncPipe],
  template: `
    <app-login-form
      [isAuthenticationFailed]="isAuthenticationFailed$ | async"
      (submitEmitter)="onLoginFormSubmit($event)"></app-login-form>
  `,
  styles: `
    
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginContainerComponent {
  loginFacade = inject(LoginFacade);

  public isAuthenticationFailed$: Observable<boolean>;

  /**
   * Called when the login form is submitted.
   * Triggers the login process using the login information provided by the user.
   * Updates the authentication status to reflect the result of the login attempt.
   * @param loginInformations The login information provided by the user.
   */
  onLoginFormSubmit(loginInformations: { userName: string; password: string }) {
    this.isAuthenticationFailed$ = this.loginFacade.loginUser(loginInformations.userName, loginInformations.password);
  }
}
