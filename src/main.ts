import { WagmiPlugin } from "@wagmi/vue";
import { QueryClient, VueQueryPlugin } from "@tanstack/vue-query";
import { createApp } from "vue";
import { config } from "./wagmi";
import ClickOutSide from "@/directives/ClickOutsideDirective";
import router from "./router";

import App from "./App.vue";
import "./assets/styles/main.sass";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
const queryClient = new QueryClient();

const app = createApp(App);

app.directive("click-outside", ClickOutSide);

app.use(WagmiPlugin, { config });
app.use(VueQueryPlugin, { queryClient });
app.use(router);
app.use(Toast, {
	transition: "Vue-Toastification__fade",
	containerClassName: "harb-toast-container",
});
app.mount("#app");
