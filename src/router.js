import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import NProgress from 'nprogress'
import _ from 'lodash'
import AuthLayout from '@/layouts/Auth'
import MainLayout from '@/layouts/Main'
import ErrorLayout from '@/layouts/Error'

const router = createRouter({
  base: import.meta.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'main',
      redirect: '/dashboard',
      component: MainLayout,
      meta: {
        authRequired: true,
      },
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          meta: { title: 'Dashboard' },
          component: () => import('./pages/dashboard'),
        },
        {
          path: '/orders',
          name: 'orders',
          meta: {
            title: 'Đơn hàng',
            showNav: 1,
            // icon: 'inbox',
          },
          component: () => import('./pages/dashboard'),
        },
        {
          path: '/products',
          name: 'products',
          meta: {
            title: 'Sản phẩm',
            showNav: 2,
            icon: 'file-text',
          },
          component: () => import('./pages/dashboard'),
        },
        {
          path: '/customers',
          name: 'customers',
          meta: {
            title: 'Khách hàng',
            showNav: 3,
            icon: 'users',
          },
          component: () => import('./pages/dashboard'),
        },
        {
          path: '/employees',
          name: 'employees',
          meta: {
            title: 'Nhân viên',
            showNav: 4,
            // icon: 'send',
          },
          component: () =>import('./pages/dashboard'),
        },
        // {
        //   path: '#',
        //   name: 'message',
        //   redirect: '/messages',
        //   meta: {
        //     title: 'Tin nhắn',
        //     showNav: 5,
        //     icon: 'message-square',
        //   },
        //   children: [
        //     {
        //       path: '/messages',
        //       name: 'messages',
        //       meta: {
        //         parent: 'messages',
        //         title: 'Tin nhắn đã gửi',
        //         showNav: 1,
        //         icon: 'check',
        //       },
        //       component: () => import('./pages/messages'),
        //     },
        //     {
        //       path: '/plan-messages',
        //       name: 'plan-messages',
        //       meta: {
        //         parent: 'messages',
        //         title: 'Tin nhắn dự kiến',
        //         showNav: 2,
        //         icon: 'clock',
        //       },
        //       component: () => import('./pages/plan-messages'),
        //     },
        //   ],
        // },
        // {
        //   path: '#',
        //   name: 'others',
        //   meta: {
        //     title: 'Khác',
        //     showNav: 6,
        //     icon: 'more-vertical',
        //   },
        //   children: [
        //     {
        //       path: '/downloads',
        //       name: 'downloads',
        //       meta: {
        //         parent: 'others',
        //         title: 'Tải xuống',
        //         showNav: 1,
        //         icon: 'download',
        //       },
        //       component: () => import('./pages/downloads'),
        //     },
        //     {
        //       path: '/blacklist-recipients',
        //       name: 'blacklist-recipients',
        //       meta: {
        //         parent: 'others',
        //         title: 'Chặn người nhận tin',
        //         showNav: 2,
        //         icon: 'user-x',
        //       },
        //       component: () => import('./pages/blacklist-recipients'),
        //     },
        //   ],
        // },
      ],
    },
    // {
    //   path: '/auth',
    //   name: 'auth',
    //   component: AuthLayout,
    //   meta: {
    //     authRequired: false,
    //   },
    //   children: [
    //     {
    //       path: '/auth/login',
    //       name: 'auth_login',
    //       meta: { title: 'Đăng nhập' },
    //       component: () => import('./pages/auth/login'),
    //     },
    //   ],
    // },
    // {
    //   path: '/error',
    //   name: 'error',
    //   redirect: '/error/404',
    //   component: ErrorLayout,
    //   meta: {
    //     authRequired: false,
    //   },
    //   children: [
    //     {
    //       path: '/error/404',
    //       name: 'error_404',
    //       meta: { title: 'Trang không tìm thấy' },
    //       component: () => import('./pages/error/404'),
    //     },
    //     {
    //       path: '/error/500',
    //       name: 'error_500',
    //       meta: { title: 'Lỗi hệ thống' },
    //       component: () => import('./pages/error/500'),
    //     },
    //   ],
    // },

    // Redirect to 404
    // {
    //   path: '/:pathMatch(.*)*',
    //   redirect: { name: 'error_404' },
    // },
  ],
})

// router.beforeEach((to, from, next) => {
//   if (to.path === from.path) {
//     return next()
//   }
//
//   NProgress.start()
//   setTimeout(() => {
//     NProgress.done()
//   }, 300)
//
//   if (store.getters['user/getUser'].authorized || !_.some(to.matched, 'meta.authRequired')) {
//     return next()
//   }
//
//   return next({
//     path: '/auth/login',
//     query: { redirect: to.fullPath },
//   })
// })

export default router
