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
});

export default router;
