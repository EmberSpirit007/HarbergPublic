// src/router/authGuard.ts
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export function authGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): void {
  const isAuthenticated: boolean = !!localStorage.getItem('authentificated'); // Prüft, ob Token existiert

  if (isAuthenticated) {
    next(); // Zugriff erlauben
  } else {
    next('/login'); // Weiterleitung zur Login-Seite
  }
}
