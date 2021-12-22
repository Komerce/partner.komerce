import Vue from 'vue'
import VueRouter from 'vue-router'

// Routes
import { canNavigate } from '@/libs/acl/routeProtection'
import {
  isUserLoggedIn,
  getUserData,
  getHomeRouteForLoggedInUser,
} from '@/auth/utils'
import pages from './routes/pages'
import dashboard from './routes/dashboard'
import penarikan from './routes/penarikan'
import pendapatan from './routes/pendapatan'
import membership from './routes/membership/index'
import ekspedisi from './routes/ekspedisi/index'
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
import invoice from './routes/invoice'
import assignment from './routes/assignment'
import jobRoleSetting from './routes/job-role-setting'

// komship
import dashboardKompship from './routes/komship/dashboard/index'
import produk from './routes/komship/produk/index'
import order from './routes/komship/order/index'
import pickup from './routes/komship/pickup/index'
import customer from './routes/komship/customer/index'
import settingKompship from './routes/komship/setting-kompship/index'
import keuangan from './routes/komship/keuangan/index'
import hiring from './routes/komship/hiring/index'

// Komplace
import dashboardKomplace from './routes/komplace/dashboard/index'
import monitoring from './routes/komplace/monitoring/index'
import manajemenAdmin from './routes/komplace/manajemenAdmin/index'
import pengaturanKomplace from './routes/komplace/pengaturan/index'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    ...dashboard,
    ...penarikan,
    ...pendapatan,
    ...membership,
    ...ekspedisi,
    ...pages,
    ...training,
    ...talent,
    ...partner,
    ...masterData,
    ...management,
    ...division,
    ...position,
    ...invoice,
    ...assignment,

    ...dashboardKompship,
    ...produk,
    ...order,
    ...pickup,
    ...customer,
    ...settingKompship,
    ...keuangan,
    ...hiring,

    ...dashboardKomplace,
    ...monitoring,
    ...manajemenAdmin,
    ...pengaturanKomplace,

    ...talentPool,
    ...parentProfile,
    ...wishlist,
    ...jobRoleSetting,
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})

router.beforeEach((to, _, next) => {
  const isLoggedIn = isUserLoggedIn()

  if (to.name === 'unauthenticated' || to.name === 'error-404') {
    return next()
  }

  if (!canNavigate(to) && !isLoggedIn) {
    // Redirect to login if not logged in
    return next({ name: 'auth-login' })
  }

  // Redirect if logged in
  if (
    // eslint-disable-next-line operator-linebreak
    (to.meta.redirectIfLoggedIn && isLoggedIn) ||
    (!canNavigate(to) && isLoggedIn && !to.meta.preventRedirect)
  ) {
    const userData = getUserData()
    /*
{
  "id": 2,
  "username": "admin2",
  "status": 1,
  "email": "admin2@projecteverything.web.id",
  "email_verified_at": null,
  "role_id": 1,
  "full_name": "Admin",
  "npk": "0",
  "division_id": 0,
  "division_name": "ADMIN",
  "office_id": 0,
  "office_name": "ADMIN",
  "position_id": 0,
  "position_name": "ADMIN",
  "origin_village": "ADMIN",
  "no_hp": "08123123123",
  "address": "ADMIN",
  "join_date": "1990-01-01",
  "martial_status": 0,
  "photo_profile_url": null,
  "birth_date": "2019-12-12",
  "gender": 1,
  "last_date_of_pause": "0000-00-00 00:00:00",
  "kmpoin": 0,
  "new_kmpoin": 0,
  "user_management_id": 0,
  "edumo_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8yNy4xMTIuNzguODU6ODA4MFwvdjFcL2lhbVwvbG9naW5cL2FkbWluIiwiaWF0IjoxNjMwMTI1MzQwLCJleHAiOjE2NjE2NjEzNDAsIm5iZiI6MTYzMDEyNTM0MCwianRpIjoibExaam9JVURyTGlTNTJ5byIsInN1YiI6ImViNjNhMjJkLThkZTktNGMyNy1hODU5LTNkOGRmZDlmZjBiYyIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjciLCJpZCI6ImViNjNhMjJkLThkZTktNGMyNy1hODU5LTNkOGRmZDlmZjBiYyIsInJvbGUiOiJhZG1pbiJ9.vR2Tp3D04V-hGK7CwSLE-CIkbkqk0iqFj9R8k3EVp7A",
  "nik": null,
  "pin": "",
  "is_owner": 0,
  "is_komship": 0,
  "deleted_at": null,
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYTczMGZhMWRmMWE4M2VjMTA1NTljZWVhNWYwOGZlZDg2NzQ1ZmJhODc5ZjY2NGMwMzYxYThkYTg2MTYxOGM5YjAzNmZlOGFjMWYyMmUwZWUiLCJpYXQiOjE2MzQyMDcxNTQsIm5iZiI6MTYzNDIwNzE1NCwiZXhwIjoxNjY1NzQzMTU0LCJzdWIiOiIyIiwic2NvcGVzIjpbXX0.ZvyQS3QTwO-WA7IQkld6bpSmHY5nhjTNjcuq-POvLDAG5YXlXHfNcSxpvSpUcaUHRHYejwp-xSrOHux3kBO8rU2_zzhPWxMIJ8LxeX-orD2z6ZE0dAM-KWv6cVeL2_mPVbksDLbqMjtN55AEHpqUdUu9Zq4mmnqGl7lJnDCyBBTjp7ctV2ed4fJBGiSs4SHCbQc53zpiYdX8Yiit_GbXkaUtZgfWxoO66EQbfqNbWU3R52Qj-Euj6tw0OnHweiiZgn_mxJ6lhXrk3sSX6d3IhZwCJwy2YeOgJsLIfc3lTZANNi2-diM9Kw2W3YhbvkBwWG-0WlSYbCPZ3cu3QK1QVFteO2bsj3zvP4Yzjuf-Bt02jbatiyYwR6sxMj50Y2KTcGX3IkX2DwQMHW3Jjzs5MNbyEclVvib8zZP0DFecKZi61r8MVWs6eNzflHQ3N7l2XaTPcsubk8O2GtghqmZ5PJdDn-_SiyVXgux_AKCdjDg9VYYWsBOQEjEV4BB1APmgOifoheQqams4j_QPIukj-QBaEZGhyrRGb-MwZ7Q0AMvE92crOS4qmetrZhd4huAI7khuiLBkpnBTc3f2Jg_6Yn-bET2TSisD6lydU2P3riFlD52i3rjxwiAQFWWkyT-6sGv0agvhmDQkrX4sOfVEmwlUXypN_Fl8B1fzDxDzxwY",
  "token_type": "Bearer",
  "expires_at": "2022-10-14 17:25:54",
  "role_name": "ADMIN"
}
    */
    next(
      getHomeRouteForLoggedInUser(
        // eslint-disable-next-line comma-dangle
        userData ? userData.role_name.toUpperCase() : null
        // eslint-disable-next-line comma-dangle
      )
    )
  }

  return next()
})

export default router
