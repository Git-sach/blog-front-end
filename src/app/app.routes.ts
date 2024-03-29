import { Routes } from '@angular/router';
import { EditPostComponent } from './routes/private/edit-post/edit-post.component';
import { HomeComponent } from './routes/public/home/home.component';
import { PostComponent } from './routes/public/post/post.route';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'post/:id', component: PostComponent },
  { path: 'post/edit/:id', component: EditPostComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
