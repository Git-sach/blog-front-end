import { Routes } from '@angular/router';
import { EditPostComponent } from './features/routes/private/edit-post/edit-post.component';
import { HomeComponent } from './features/routes/public/home/home.component';
import { PostViewComponent } from './features/routes/public/post-view/post-view.component';

export const routes: Routes = [
  { path: 'blog', component: HomeComponent },
  { path: 'post/:id', component: PostViewComponent },
  { path: 'post/edit/:id', component: EditPostComponent },
  { path: '', redirectTo: '/blog', pathMatch: 'full' },
];
