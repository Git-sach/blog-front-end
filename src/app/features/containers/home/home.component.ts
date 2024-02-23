import { Component } from '@angular/core';
import { LayoutComponent } from '../../../core/containers/layout/layout.component';
import { PostListComponent } from './components/post-list/post-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PostListComponent, LayoutComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
