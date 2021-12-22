export default [
  {
    path: '/biaya-ekspedisi',
    name: 'cod-biaya-ekspedisi',
    component: () => import('@/views/pages/ekspedisi/biaya/Index.vue'),
    meta: {
      resource: 'Dashboard',
      action: 'read',
    },
  },
  {
    path: '/biaya-ekspedisi/tambah',
    name: 'cod-biaya-ekspedisi-tambah',
    component: () => import('../../../views/pages/ekspedisi/biaya/TambahExpedisi'),
    meta: {
      navActiveLink: 'cod-biaya-ekspedisi',
      type: 'add',
      resource: 'Dashboard',
      action: 'read',
    },
  },
  {
    path: '/biaya-ekspedisi/daerah-tanpa-akses',
    name: 'cod-biaya-ekspedisi-daerah-tanpa-akses',
    component: () => import('@/views/pages/ekspedisi/biaya/DaerahTanpaAksesCOD/index.vue'),
    meta: {
      navActiveLink: 'cod-biaya-ekspedisi',
      type: 'add',
      resource: 'Dashboard',
      action: 'read',
    },
  },
  {
    path: '/biaya-ekspedisi/daerah-tanpa-akses/upload',
    name: 'cod-biaya-ekspedisi-daerah-tanpa-akses-upload',
    component: () => import('@/views/pages/ekspedisi/biaya/UploadDokumen/index.vue'),
    meta: {
      navActiveLink: 'cod-biaya-ekspedisi',
      type: 'add',
      resource: 'Dashboard',
      action: 'read',
    },
  },
  {
    path: '/biaya-ekspedisi/:id/edit',
    name: 'cod-biaya-ekspedisi-edit',
    component: () => import('../../../views/pages/ekspedisi/biaya/AturEkspedisi'),
    meta: {
      navActiveLink: 'cod-biaya-ekspedisi',
      type: 'edit',
      resource: 'Dashboard',
      action: 'read',
    },
  },
  {
    path: '/performa-ekspedisi',
    name: 'cod-performa-ekspedisi',
    component: () => import('@/views/pages/ekspedisi/performa/Index.vue'),
    meta: {
      resource: 'Dashboard',
      action: 'read',
    },
  },
]
