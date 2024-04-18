import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { AuthStore } from './core/store/auth.store';
import { EditComponent } from './routes/private/edit/edit.route';
import { HomeComponent } from './routes/public/home/home.route';
import { LoginComponent } from './routes/public/login/login.route';
import { PostComponent } from './routes/public/post/post.route';

const authGuardFn: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const authStore = inject(AuthStore);

  if (authStore.authToken) return true;

  authStore.previousUrl = state.url;

  router.navigate(['/login']);
  return false;

  // Mettre en local storage avec une duré moindre que celui du back et faire ça dans la Facade de login
  // localStorage.setItem('my local Storage test', 'value');
};

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'post/:id', component: PostComponent },
  { path: 'edit/:id', component: EditComponent, canActivate: [authGuardFn] },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
