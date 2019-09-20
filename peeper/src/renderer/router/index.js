import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login-view',
      component: require('@/components/LoginView').default
    },
    {
      path: '/main',
      name: 'main-view',
      component: require('@/components/MainView').default
    },
    {
      path: '/capture',
      name: 'capture-window',
      component: require('@/components/CaptureWindow').default
    },
    {
      path: '/video',
      name: 'video-window',
      component: require('@/components/VideoWindow').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
