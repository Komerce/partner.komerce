export default [
  {
    path: '/ajukan-pickup',
    name: 'ajukan-pickup',
    component: () => import('@/views/pages/komship/pickup/refactor/AjukanPickup.vue'),
    meta: {
      name: 'ajukan-pickup',
      routeDetailBefore: 'detail-orderan-pickup-before',
      routeDetailAfter: 'history-pickup',
      resource: 'Pickup',
      action: 'manage',
      breadcrumb: [
        {
          text: 'Ajukan Pickup',
          active: true,
        },
      ],
    },
  },
  {
    path: '/history-pickup',
    name: 'history-pickup',
    component: () => import('@/views/pages/komship/pickup/HistoryPickup.vue'),
    meta: {
      name: 'history-pickup',
      routeDetailHistory: 'history-pickup-detail',
      resource: 'Pickup',
      action: 'manage',
      breadcrumb: [
        {
          text: 'History Pickup',
          active: true,
        },
      ],
    },
  },
  {
    path: '/history-pickup-detail/:order_data_id',
    name: 'history-pickup-detail',
    component: () => import('@/views/pages/komship/pickup/refactor/HistoryPickupDetail.vue'),
    meta: {
      name: 'history-pickup-detail',
      routeDetailOrderan: 'detail-orderan-pickup-after',
      resource: 'Pickup',
      action: 'manage',
      breadcrumb: [
        {
          text: 'History Pickup',
          active: true,
        },
      ],
    },
  },
  {
    path: '/detail-orderan-pickup',
    name: 'detail-orderan-pickup-before',
    component: () => import('@/views/pages/komship/pickup/refactor/AddPickupDetailsBefore.vue'),
    meta: {
      name: 'detail-orderan-pickup-before',
      resource: 'Pickup',
      routeBack: 'ajukan-pickup',
      action: 'manage',
      breadcrumb: [
        {
          text: 'Detail Orderan Pickup',
          active: true,
        },
      ],
    },
  },
  {
    path: '/detail-orderan-pickup',
    name: 'detail-orderan-pickup-after',
    component: () => import('@/views/pages/komship/pickup/refactor/AddPickupDetailsAfter'),
    meta: {
      name: 'detail-orderan-pickup-after',
      resource: 'Pickup',
      routeToProfile: 'kompship-profile',
      routeBack: 'ajukan-pickup',
      action: 'manage',
      breadcrumb: [
        {
          text: 'Detail Orderan Pickup',
          active: true,
        },
      ],
    },
  },
]
