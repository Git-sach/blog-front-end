import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './routes/public/home/home.component';
import { PostComponent } from './routes/public/post/post.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HomeComponent, PostComponent],
  template: `<!-- Réfélchir aune architecture avec du routage. il faut prévoir un espace admin
  -> Page accueil avec les postes  
  -> Page du Poste
  -> Page accueil adimin
  -> Page rédaction d'un post-->

    <!-- Ici il y aura le routeur -->

    <!-- <app-home></app-home> -->
    <!-- <app-post-view></app-post-view> -->

    <router-outlet></router-outlet>`,
  styles: ``,
})
export class RouteComponent {}
