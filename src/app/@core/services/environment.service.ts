import { inject, Injectable } from '@angular/core';
import { CanActivateFn } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  private environment: 'production' | 'development' | 'testing' = 'production';
  private isDebug: boolean = false;

  constructor() {
    localStorage.getItem('');
  }

  public isProd(): boolean {
    return this.environment === 'production';
  }

  public isDevelopment(): boolean {
    return this.environment === 'development';
  }

  public isTesting(): boolean {
    return this.environment === 'testing';
  }

  public getEnvironment() {
    return this.environment;
  }

  public setEnvironment(mode: 'production' | 'development' | 'testing') {
    this.environment = mode;
  }

  public isDebugMode(): boolean {
    if (this.isDebug) {
      return true;
    }
    this.isDebug = localStorage.getItem('is_debug') === 'true';
    return this.isDebug;
  }

  public openDebug() {
    this.isDebug = true;
    localStorage.setItem('is_debug', 'true');
  }

  public closeDebug() {
    this.isDebug = false;
    localStorage.removeItem('is_debug');
  }
}

export const checkEnvGuard: CanActivateFn = (n, state) => {
  const envService: EnvironmentService = inject(EnvironmentService);
  if (/\bdebug=true\b/.test(state.url)) {
    envService.openDebug();
  } else if (/\bdebug=false\b/.test(state.url)) {
    envService.closeDebug();
  }

  return true;
};
