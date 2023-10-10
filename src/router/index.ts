import { onAuthStateChanged } from 'firebase/auth'
import { nextTick } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import { User } from '@/database'
import { Logger } from '@/helpers/logger'
import { auth } from '@/shared/firebase'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Auth/Login.vue'),
      meta: {
        requiresAuth: false,
        title: 'Mewbook Login'
      }
    },
    {
      path: '/logout',
      name: 'logout',
      component: () => import('@/views/Auth/Logout.vue'),
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/checkpoint',
      name: 'checkpoint',
      component: () => import('@/views/Auth/Checkpoint.vue'),
      meta: {
        requiresAuth: true,
        title: 'Mewbook Checkpoint'
      }
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/Post/Posts.vue'),
      meta: {
        requiresAuth: true,
        title: 'Mewbook',
        requiresVerification: true
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Auth/Register.vue'),
      meta: {
        requiresAuth: false,
        title: 'Mewbook Register'
      }
    },
    {
      path: '/user/:id',
      name: 'user',
      component: () => import('@/views/User/Base.vue'),
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          name: 'fuser',
          path: 'friends',
          component: () => import('@/views/User/Base.vue'),
        }
      ]
    },
    {
      path: '/post/:id',
      name: 'post',
      component: () => import('@/views/Post/Post.vue'),
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/friends',
      name: 'friends',
      component: () => import('@/views/Friend/Friends.vue'),
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/friends/request',
      name: 'frequest',
      component: () => import('@/views/Friend/FriendRequest.vue'),
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: ':id',
          name: 'frequest-view',
          component: () => import('@/views/User/User.vue'),
        }
      ]
    },
    {
      path: '/bookmarks',
      name: 'bookmarks',
      component: () => import('@/views/BookmarksMobile.vue'),
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notfound',
      component: () => import('@/views/NotFound.vue')
    }
  ]
})

export function initializeRouter() {
  router.beforeEach((to, _, next) => {
    onAuthStateChanged(auth, async (user) => {
      const userData = await User.get({ authid: user?.uid! })
      const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
      const requiresVerification = to.matched.some((record) => record.meta.requiresVerification)
      if (requiresAuth) {
        if (!user && !userData) {
          if (to.name === 'register') {
            Logger.info('User not logged in, redirecting to register')
            next({ name: 'register' })
          } else {
            Logger.info('User not logged in, redirecting to login')
            next({ name: 'login' })
          }
        } else if (requiresVerification && !user?.emailVerified && !userData?.verified) {
          Logger.info('User email not verified, redirecting to checkpoint')
          next({ name: 'checkpoint' })
        } else {
          next()
        }
      } else {
        if (user && (to.name === 'login' || to.name === 'register')) {
          next({ name: 'dashboard' })
        } else {
          next()
        }
      }
    })
  })

  router.afterEach((to) => {
    nextTick(() => {
      document.title = (to.meta.title as string) || 'Mewbook'
    })
  })
}

export default router
