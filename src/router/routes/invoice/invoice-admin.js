const pageName = {
  singular: 'Invoice Admin',
  plural: 'Invoice Admin',
}

export default [
  {
    path: '/invoice-admin',
    name: 'invoice-admin',
    component: () => import('@/views/pages/invoice/invoice-admin/Index.vue'),
    meta: {
      name: pageName,
      routeShow: 'invoice-admin-show',
      routeCreate: 'invoice-admin-create',
      resource: 'Invoice',
      action: 'manage',
      breadcrumb: [
        {
          text: 'Invoice',
        },
        {
          text: pageName.plural,
          active: true,
        },
      ],
    },
  },
  {
    path: '/invoice-admin/show/:id',
    name: 'invoice-admin-show',
    component: () => import('@/views/pages/invoice/invoice-admin/Form.vue'),
    meta: {
      name: pageName,
      navActiveLink: 'invoice-admin',
      resource: 'Invoice',
      action: 'manage',
      breadcrumb: [
        {
          text: 'Invoice',
        },
        {
          text: pageName.plural,
          route: 'invoice-admin',
        },
        {
          text: 'Detail',
          active: true,
        },
      ],
    },
  },
  {
    path: '/invoice-admin/create',
    name: 'invoice-admin-create',
    component: () => import('@/views/pages/invoice/invoice-admin/Form.vue'),
    meta: {
      name: pageName,
      navActiveLink: 'invoice-admin',
      resource: 'Invoice',
      action: 'manage',
      breadcrumb: [
        {
          text: 'Invoice',
        },
        {
          text: pageName.plural,
          route: 'invoice-admin',
        },
        {
          text: 'Create',
          active: true,
        },
      ],
    },
  },
]
