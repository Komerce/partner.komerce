import Vue from 'vue'
import VueRouter from 'vue-router'

// Routes
import { canNavigate } from '@/libs/acl/routeProtection'
import { isUserLoggedIn, getUserData, getHomeRouteForLoggedInUser } from '@/auth/utils'
import pages from './routes/pages'
import dashboard from './routes/dashboard'
import training from './routes/training/index'
import talent from './routes/talent/index'
import partner from './routes/partner/index'
import masterData from './routes/master-data/index'
import management from './routes/management/index'
import division from './routes/division'
import position from './routes/position'
import talentPool from './routes/talent-pool'
import parentProfile from './routes/partner-profile'
import wishlist from './routes/wishlist'

// komship
import dashboardKompship from './routes/komship/dashboard/index'
import produk from './routes/komship/produk/index'
import order from './routes/komship/order/index'
import pickup from './routes/komship/pickup/index'
import customer from './routes/komship/customer/index'
import settingKompship from './routes/komship/setting-kompship/index'
import keuangan from './routes/komship/keuangan/index'
import hiring from './routes/komship/hiring/index'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    ...dashboard,
    ...pages,
    ...training,
    ...talent,
    ...partner,
    ...masterData,
    ...management,
    ...division,
    ...position,

    ...dashboardKompship,
    ...produk,
    ...order,
    ...pickup,
    ...customer,
    ...settingKompship,
    ...keuangan,
    ...hiring,

    ...talentPool,
    ...parentProfile,
    ...wishlist,
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})

router.beforeEach((to, _, next) => {
  const isLoggedIn = isUserLoggedIn()

  if (!canNavigate(to) && !isLoggedIn) {
    // Redirect to login if not logged in
    return next({ name: 'auth-login' })
  }

  // Redirect if logged in
  if ((to.meta.redirectIfLoggedIn && isLoggedIn) || (!canNavigate(to) && isLoggedIn && !to.meta.preventRedirect)) {
    const userData = getUserData()
    next(getHomeRouteForLoggedInUser(userData ? userData.role_name.toUpperCase() : null))
  }

  return next()
})

export default router
