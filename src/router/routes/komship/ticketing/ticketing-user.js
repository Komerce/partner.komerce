export default [
  {
    path: '/ticketing',
    name: 'ticketing-user',
    component: () => import('@/views/pages/komship/ticketing-user/Ticketing.vue'),
    meta: {
      name: 'ticketing-user',
      routeToDetail: 'detail-ticketing-user',
      resource: 'Produk',
      action: 'manage',
    },
  },
  {
    path: '/ticketing/detail/:ticket_id',
    name: 'detail-ticketing-user',
    component: () => import('@/views/pages/komship/detail-ticketing-user/DetailTicketing.vue'),
    meta: {
      name: 'detail-ticketing-user',
      navActiveLink: 'ticketing-user',
      resource: 'Produk',
      action: 'manage',
    },
  },
]
