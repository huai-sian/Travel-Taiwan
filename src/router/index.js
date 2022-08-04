import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import City from '../views/Search.vue'
import Detail from '../views/Detail.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/:mode/:city/:keyword?',
    name: 'Search',
    component: City
  },
  {
    path: '/:mode/:lat(\\d+\\.\\d+)/:lon(\\d+\\.\\d+)',
    name: 'Nearby',
    component: City
  },
  {
    path: '/detail/:id',
    name: 'Detail',
    component: Detail
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
