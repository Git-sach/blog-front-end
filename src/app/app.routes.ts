import { Routes } from '@angular/router';
import { HomeComponent } from './features/containers/home/home.component';
import { PostViewComponent } from './features/containers/post-view/post-view.component';

export const routes: Routes = [
  { path: 'blog', component: HomeComponent },
  { path: 'post/:id', component: PostViewComponent },
  { path: '', redirectTo: '/blog', pathMatch: 'full' },
];
