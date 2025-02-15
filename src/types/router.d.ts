// src/types/router.d.ts
import 'vue-router';

// Verfügbare Layout-Namen definieren
export type LayoutName = 'DefaultLayout' | 'NavbarLayout';

// Erweiterung des Vue-Router Meta-Typs
declare module 'vue-router' {
  interface RouteMeta {
    layout?: LayoutName; // Layout ist optional
  }
}
