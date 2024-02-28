import { Routes } from '@angular/router';
import { HomeComponent } from './features/routes/home/home.component';
import { PostViewComponent } from './features/routes/post-view/post-view.component';

export const routes: Routes = [
  { path: 'blog', component: HomeComponent },
  { path: 'post/:id', component: PostViewComponent },
  { path: '', redirectTo: '/blog', pathMatch: 'full' },
];
