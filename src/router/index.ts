import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { authGuard } from './authGuard';

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: "/",
			name: "home",
            redirect: "/stake",
		},
		{
			path: "/stake",
			name: "stake",
			meta: {
				title: "Stake",
				group: "navbar",
                layout: 'NavbarLayout'
			},
            beforeEnter: authGuard,
			component: () => import("../views/StakeView.vue"),
		},
		{
			path: "/login",
			name: "login",
            meta: {
                layout: 'DefaultLayout'
,           },
			component: () => import("../views/LoginView.vue"),
		},
	],
	scrollBehavior(to, from, savedPosition) {
		// Überprüfen, ob der Zielort ein Hash enthält
		if (to.hash) {
			// Warten, bis die Komponente geladen ist und dann zum Ziel scrollen
			return {
				el: to.hash,
				behavior: "smooth", // Optional: für sanftes Scrollen
				top: 80,
			};
		}
		return savedPosition || { top: 0 }; // Scrollen zum Anfang der Seite, falls kein Hash vorhanden ist
	},
});

export default router;
