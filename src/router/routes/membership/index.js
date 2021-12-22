export default [
  {
    path: '/data-partner',
    name: 'cod-data-partner',
    component: () => import('@/views/pages/membership/data-partner/Index.vue'),
    meta: {
      resource: 'Dashboard',
      action: 'read',
    },
  },
  {
    path: '/data-partner/:id/detail',
    name: 'cod-data-partner-detail',
    component: () => import('@/views/pages/membership/data-partner/Detail.vue'),
    meta: {
      navActiveLink: 'cod-data-partner',
      resource: 'Dashboard',
      action: 'read',
    },
  },
  {
    path: '/data-partner/:id/detail/riwayat-penarikan',
    name: 'cod-data-partner-detail-riwayat-penarikan',
    component: () => import('@/views/pages/membership/data-partner/RiwayatPenarikan.vue'),
    meta: {
      navActiveLink: 'cod-data-partner',
      resource: 'Dashboard',
      action: 'read',
    },
  },
  {
    path: '/arsip-partner',
    name: 'cod-arsip-partner',
    component: () => import('@/views/pages/membership/arsip-partner/Index.vue'),
    meta: {
      resource: 'Dashboard',
      action: 'read',
    },
  },
  {
    path: '/data-layanan',
    name: 'cod-data-layanan',
    component: () => import('@/views/pages/membership/data-layanan/Index.vue'),
    meta: {
      resource: 'Dashboard',
      action: 'read',
    },
  },
]
