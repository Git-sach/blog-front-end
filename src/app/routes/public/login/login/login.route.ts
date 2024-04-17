import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginHttpService } from '../../../../core/http/login-http.service';
import { AuthStore } from '../../../../core/store/auth.store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  template: ` <div class="button solid" (click)="onClickProvisoirButton()">Je me log</div>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  // TODO: Refacto avec l'architecture route / facade / sumb / smart

  authStore = inject(AuthStore);
  loginHttp = inject(LoginHttpService);
  router = inject(Router);

  onClickProvisoirButton() {
    this.loginHttp.login('dbadmin', 'adminn').subscribe((token) => {
      this.authStore.authToken = token;
      this.router.navigate([this.authStore.previousUrl]);
    });
  }
}
