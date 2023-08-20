import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
	history: createWebHistory(),
	routes: [
{ path: "/dataScreen", name: "dataScreen", component: () => import("@/views/dataScreen/index.vue"), meta: { title: '数据大屏' } },

		{
			path: "/dataScreen",
			name: "dataScreen",
			component: () => import("@/views/dataScreen/index.vue"),
			meta: {
				title: "数据大屏"
			}
		},
		{
			path: "/",
			name: "home",
			component: () => import("@/views/HomeView.vue")
		},
		{
			path: "/about",
			name: "about",
			component: () => import("@/views/AboutView.vue")
		}
	]
});

export default router;
