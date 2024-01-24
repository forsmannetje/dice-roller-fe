import { createRouter, createWebHistory } from 'vue-router'
import ParseView from '@/views/ParseView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ParseView
    }
  ]
})

export default router
