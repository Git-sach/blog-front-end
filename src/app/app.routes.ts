import { Routes } from '@angular/router';
import { authGuardFn } from './routes/private/auth.guard';
import { EditComponent } from './routes/private/edit/edit.route';
import { HomeComponent } from './routes/public/home/home.route';
import { LoginComponent } from './routes/public/login/login.route';
import { PostComponent } from './routes/public/post/post.route';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'post/:id', component: PostComponent },
  { path: 'edit/:id', component: EditComponent, canActivate: [authGuardFn] },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
