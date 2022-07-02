import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import {loginUser} from '../store/utils'
import {admin} from '../store/utils'
import axios from 'axios'
//console.log({'from router.js':loginUser()})
import NProgress from 'nprogress'
Vue.use(VueRouter)
console.log({'router.js admin':admin()})
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/message',
    name: 'msg',
    beforeEnter:(to,from,next)=>{
      if(loginUser()){
        next()
      }else{
        next('/signin')
      }
    },
    component: () => import( '../views/chat.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    beforeEnter:(to,from,next)=>{
      if(loginUser()){
        next()
      }else{
        next('/signin')
      }
    },
    component: () => import( '../views/list.vue')
  },
  {
    path: '/post',
    name: 'post',
    beforeEnter:(to,from,next)=>{
      if(loginUser()){
        next()
      }else{
        next('/signin')
      }
    },
    component: () => import( '../views/upload.vue')
  },
  {
    path: '/auth',
    name: 'auth',
    beforeEnter:(to,from,next)=>{
      if(loginUser()){
        next()
      }else{
        next('/signin')
      }
    },
    component: () => import( '../views/auth.vue')
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import( '../views/profile.vue')
  },
  {
    path: '/signup',
    name: 'signup',
    beforeEnter:(to,from,next)=>{
      if(!loginUser()){
        next()
      }else{
        next('/auth')
      }
    },
    component: () => import( '../views/signup.vue')
  },
  {
    path: '/signin',
    name: 'signin',
    beforeEnter:(to,from,next)=>{
      if(!loginUser()){
        next()
      }else{
        next('/auth')
      }
    },
    component: () => import( '../views/login.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    beforeEnter:(to,from,next)=>{
      if(!!admin().ID && !!admin().admin_id && admin().zxcvbnmlkjhgfdsapoiuytrewq=='f36POk6yJV_adQssw5c'){
        next()
      }else{
        next('/signin')
      }
    },
    component: () => import( '../views/verification.vue')
  },
  {
    path: '*',
    name: 'error',
    component: () => import( '../views/error.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeResolve((to, from, next) => {
  if (to.name) {
      NProgress.start()
  }
  next()
});


router.afterEach((to, from) => {
  NProgress.done()
});

// create a new axios instance
const instance = axios.create()

// before a request is made start the nprogress
instance.interceptors.request.use(config => {
  import('@/components/pageLoader.vue').start()
  return config
})

// before a response is returned stop nprogress
instance.interceptors.response.use(response => {
  import('@/components/pageLoader.vue').start()
  return response
})

export default router
