import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { RouteComponent } from './app/route.component';

bootstrapApplication(RouteComponent, appConfig).catch((err) =>
  console.error(err)
);
