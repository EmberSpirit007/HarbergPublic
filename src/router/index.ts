import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: "/",
			name: "home",
			component: HomeView,
		},
		{
			path: "/stake",
			name: "stake",
			meta: {
				title: "Stake",
				group: "navbar",
			},
			component: () => import("../views/StakeView.vue"),
		},
		{
			path: "/graph",
			name: "graph",
			meta: {
				title: "Graph",
				group: "navbar",
			},
			component: () => import("../views/GraphView.vue"),
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
