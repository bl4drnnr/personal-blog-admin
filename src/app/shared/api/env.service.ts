import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvService {
  get getApiUrl() {
    return environment.apiUrl;
  }

  get getStaticStorageLink() {
    return environment.staticStorage;
  }

  get getBasicAuthCredentials() {
    return {
      username: environment.basicAuth.username,
      password: environment.basicAuth.password
    };
  }
}
