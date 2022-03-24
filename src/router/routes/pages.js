export default [
  {
    path: '/error-404',
    name: 'error-404',
    component: () => import('@/views/error/Error404.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      action: 'read',
    },
  },
  {
    path: '/unauthenticated',
    name: 'unauthenticated',
    component: () => import('@/views/error/Error401.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      action: 'read',
    },
  },
  {
    path: '/verified',
    name: 'verified',
    component: () => import('@/views/pages/authentication/EmailVerified.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      action: 'read',
    },
  },
  {
    path: '/login',
    name: 'auth-login',
    component: () => import('@/views/pages/authentication/Login.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      redirectIfLoggedIn: true,
    },
  },
  {
    path: '/partner/register',
    name: 'auth-register',
    component: () => import('@/views/pages/authentication/Register.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      redirectIfLoggedIn: true,
    },
  },
  {
    path: '/talent/register',
    name: 'talent-register',
    component: () => import('@/views/pages/talent/talent/Register.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      preventRedirect: true,
    },
  },
  {
    path: '/forgot-password',
    name: 'auth-forgot-password',
    component: () => import('@/views/pages/authentication/ForgotPassword'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      redirectIfLoggedIn: true,
    },
  },
  {
    path: '/change-password',
    name: 'auth-change-password',
    component: () => import('@/views/pages/authentication/CreatePassword.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      redirectIfLoggedIn: true,
    },
  },
  {
    path: '/reset-newpassword',
    name: 'auth-reset-passworddata',
    component: () => import('@/views/pages/authentication/ResetPassword'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      action: 'read',
    },
  },
  {
    path: '/komship-register',
    name: 'kompship-daftar',
    component: () => import('@/views/pages/authentication/RegisterKomship'),
    meta: {
      layout: 'full',
      resource: 'Auth',
    },
  },
  {
    path: '/komship-register-berhasil',
    name: 'komship-register-validate',
    component: () => import('@/views/pages/authentication/RegisterValidateKomship'),
    meta: {
      layout: 'full',
      resource: 'Auth',
    },
  },
  {
    path: '/kompack-register',
    name: 'kompack-daftar',
    component: () => import('@/views/pages/authentication/RegisterKompack'),
    meta: {
      layout: 'full',
      resource: 'Auth',
    },
  },
]
