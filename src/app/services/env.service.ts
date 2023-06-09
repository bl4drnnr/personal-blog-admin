import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvService {
  get getFrontProxyUrl() {
    return environment.apiUrl;
  }
}
