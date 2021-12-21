export default [
  {
    path: '/biaya-ekspedisi',
    name: 'cod-biaya-ekspedisi',
    component: () => import('@/views/pages/ekspedisi/biaya/Index'),
    meta: {
      resource: 'Dashboard',
      action: 'read',
    },
  },
  {
    path: '/biaya-ekspedisi/tambah',
    name: 'cod-biaya-ekspedisi-tambah',
    component: () => import('../../../views/pages/ekspedisi/biaya/TambahExpedisi/index'),
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
    component: () => import('@/views/pages/ekspedisi/biaya/DaerahTanpaAksesCOD/index'),
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
    component: () => import('@/views/pages/ekspedisi/biaya/UploadDokumen/index'),
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
    component: () => import('../../../views/pages/ekspedisi/biaya/AturEkspedisi/index'),
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
    component: () => import('@/views/pages/ekspedisi/performa/Index'),
    meta: {
      resource: 'Dashboard',
      action: 'read',
    },
  },
]
