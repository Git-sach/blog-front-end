import { CanActivateFn, Routes } from '@angular/router';
import { of } from 'rxjs';
import { EditComponent } from './routes/private/edit/edit.route';
import { HomeComponent } from './routes/public/home/home.route';
import { PostComponent } from './routes/public/post/post.route';

const authGuardFn: CanActivateFn = () => {
  localStorage.setItem('my local Storage test', 'value');
  return of(true);
};

/**
 * -> Cette fonction sera a placer dans un fichier gard (dans shared ?)
 *
 * -> La fonction appèle une Facade auth.facade.ts ? methode isAuthenticated ou canActivate ou ..?
 *  Ou placer cette façade ? pas besoins de facade ? ou si pour gérer le local storage ?
 *
 * -> Placer dans le auth.store les identifiant login ?
 */

/**
 * -> On arrivae sur le Garde
 *  Le gard va directement regarder dans le local store si on est authentifié
 *  - Si c'est le cas on accède a la resource
 *  - Si ce n'est pas le cas on passe sur le composant de login
 *
 * -> Composant Login
 *  L'utilisateur entre les MDP et a la validation la Facade est appelé
 *  - La facade fait appèle au auth.sotre pour voire les les MDP sont ok
 *  - Si c'est ok, la Facade vien faire le local Storage ? ca a l'air comme ca sur le projet avec user.save et user.remove dans auth.sandbox et user.model
 *    (j'ai l'impression que se User est un etat en lui meme ? voir ou ce modèle est utilisé)
 *  - Et rediriger vers la page demandé a l'origine ? avec un Observable sur le isAuthentificated du sort ?
 *
 * Dans ce cas la Facade apardient au composant login
 */

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'post/:id', component: PostComponent },
  { path: 'edit/:id', component: EditComponent, canActivate: [authGuardFn] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
