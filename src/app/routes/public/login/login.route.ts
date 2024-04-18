import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LayoutComponent } from '../../../core/containers/layout/layout.component';
import { LoginContainerComponent } from './login-container.component';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <app-layout>
      <!-- <div class="button solid" (click)="onClickProvisoirButton()">Je me log</div> -->
      <app-login-container></app-login-container>
    </app-layout>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LayoutComponent, LoginContainerComponent],
})
export class LoginComponent {}
