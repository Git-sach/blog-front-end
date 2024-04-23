import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler } from '@angular/core';

export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any) {
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 400:
          break;

        case 401:
          //TODO: rediriger vers la login page
          console.log("Vous n'etes pas autorisé ");
          break;

        case 403:
          break;

        case 404:
          break;

        case 500:
          break;

        default:
          break;
      }
    }
  }
}
