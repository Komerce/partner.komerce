export default [
  {
    path: '/pencairan',
    name: 'cod-pencairan',
    component: () => import('@/views/pages/pencairan/Index.vue'),
    meta: {
      resource: 'Dashboard',
      action: 'read',
    },
  },
  {
    path: '/pencairan/:slug/upload-bukti-transfer',
    name: 'cod-penarikan-upload-bukti-transfer',
    component: () => import('../../views/pages/pencairan/UploadBuktiTransfer'),
    meta: {
      navActiveLink: 'cod-pencairan',
      resource: 'Dashboard',
      action: 'read',
    },
  },
  {
    path: '/pencairan/:slug',
    name: 'cod-rincian-penarikan-saldo',
    component: () => import('@/views/pages/pencairan/RincianPenarikanSaldo.vue'),
    meta: {
      navActiveLink: 'cod-pencairan',
      resource: 'Dashboard',
      action: 'read',
    },
  },
]
