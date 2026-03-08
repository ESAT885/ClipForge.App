import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import VideosView from '../views/VideosView.vue'
import VideoEditUploadView from '../views/VideoEditUploadView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
     {
      path: '/videos',
      name: 'videos',
      component: VideosView,
    },
    {
      path:"/videodetail/:id",
      name:"videodetail",
    component:VideoEditUploadView,
    }
  ],
})

export default router
