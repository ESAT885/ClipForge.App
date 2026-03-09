import { createRouter, createWebHistory } from 'vue-router'
import VideosView from '../views/VideosView.vue'
import VideoEditView from '../views/VideoEditView.vue'

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
    }
  ],
})

export default router
