import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LayoutComponent } from '../../../core/containers/layout/layout.component';
import { LoginContainerComponent } from './login-container.component';

/**
 * Routed component for the Login page
 */
@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <app-layout>
      <app-login-container></app-login-container>
    </app-layout>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LayoutComponent, LoginContainerComponent],
})
export class LoginComponent {}
