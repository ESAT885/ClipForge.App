import { createRouter, createWebHistory } from 'vue-router'
import VideosView from '../views/VideosView.vue'
import VideoEditView from '../views/VideoEditView.vue'
import VideoBackgroundMonitorView from '../views/VideoBackgroundMonitorView.vue'
import LoginPageView from '../views/LoginPageView.vue'
import RegisterView from '../views/RegisterView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/',
      name: 'home',
      component: VideosView,
    },
    {
      path: "/videodetail/:id",
      name: "videodetail",
      component: VideoEditView,
    },
    {
      path: "/background-monitor",
      name: "background-monitor",
      component: VideoBackgroundMonitorView,
    },{
      path:"/login",
      name: "login",
      component: LoginPageView
    },
    {
      path:"/register",
      name: "register",
      component: RegisterView
    }
  ],
})

export default router
