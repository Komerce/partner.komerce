export default [
  {
    path: '/pendapatan',
    name: 'cod-pendapatan',
    component: () => import('@/views/pages/pendapatan/Index.vue'),
    meta: {
      resource: 'Dashboard',
      action: 'read',
    },
  },
]
