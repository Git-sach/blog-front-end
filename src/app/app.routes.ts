import { Routes } from '@angular/router';
import { EditComponent } from './routes/private/edit/edit.route';
import { HomeComponent } from './routes/public/home/home.route';
import { PostComponent } from './routes/public/post/post.route';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'post/:id', component: PostComponent },
  { path: 'edit/:id', component: EditComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
