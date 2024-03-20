import { map } from 'rxjs';
import { PostsHttpService } from './posts-http.service';

/**
 * Defines the adatper function to modify the API response suitable for the app
 * @param Function adapterFn - function to be called
 */
export function Adapter(adapterFn: (value: any) => any) {
  return function (
    target: PostsHttpService,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    let originalMethod = descriptor.value;

    descriptor.value = function (...args: any) {
      return originalMethod.apply(this, args).pipe(map(adapterFn));
    };

    return descriptor;
  };
}
