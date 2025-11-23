import { Injectable } from '@angular/core';

export interface AppConfig {
  basicAuth: {
    username: string;
    password: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private config: AppConfig | null = null;

  loadConfig(): Promise<AppConfig> {
    return fetch('/config.json')
      .then((response) => response.json())
      .then((config: AppConfig) => {
        this.config = config;
        return config;
      });
  }

  getConfig(): AppConfig {
    if (!this.config) {
      throw new Error('Config not loaded. Call loadConfig() first.');
    }
    return this.config;
  }

  getBasicAuthCredentials() {
    return this.getConfig().basicAuth;
  }
}
