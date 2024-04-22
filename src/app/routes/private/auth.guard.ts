import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthStore } from '../../core/store/auth.store';

export const authGuardFn: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const authStore = inject(AuthStore);

  if (authStore.localStorageToken) return true;

  authStore.previousUrl = state.url;
  router.navigate(['/login']);

  return false;
};
