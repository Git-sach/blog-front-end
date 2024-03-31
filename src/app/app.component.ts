import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './routes/public/home/home.route';
import { PostComponent } from './routes/public/post/post.route';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HomeComponent, PostComponent],
  template: `<router-outlet></router-outlet>`,
  styles: ``,
})
export class AppComponent {}
