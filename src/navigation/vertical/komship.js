export default [
  {
    title: 'Komship',
    icon: 'BatteryIcon',
    tagVariant: 'light-warning',
    resource: 'Komship',
    action: 'read',
    children: [
      {
        title: 'Dashboard',
        icon: 'HomeIcon',
        tagVariant: 'light-warning',
        route: 'cod-dashboard',
        resource: 'Dashboard Komship Admin',
        action: 'read',
      },
      // {
      //   title: 'Dashboard Admin v11',
      //   icon: 'HomeIcon',
      //   tagVariant: 'light-warning',
      //   route: 'dashboard-admin-v11',
      //   resource: 'Dashboard Komship Admin',
      //   action: 'read',
      // },
      {
        title: 'Pencairan',
        icon: 'DownloadIcon',
        tagVariant: 'light-warning',
        route: 'cod-pencairan',
        resource: 'Pencairan',
        action: 'manage',
      },
      {
        title: 'Pendapatan',
        icon: 'CreditCardIcon',
        tagVariant: 'light-warning',
        route: 'cod-pendapatan',
        resource: 'Pendapatan',
        action: 'manage',
      },
      {
        title: 'Membership',
        icon: 'LockIcon',
        tagVariant: 'light-warning',
        resource: 'Membership Komship',
        action: 'manage',
        children: [
          {
            title: 'Perkembangan',
            icon: 'none',
            tagVariant: 'light-warning',
            route: 'membership-perkembangan',
            resource: 'Perkembangan Partner',
            action: 'manage',
          },
          {
            title: 'Data Partner',
            icon: 'none',
            tagVariant: 'light-warning',
            route: 'cod-data-partner',
            resource: 'Data Partner',
            action: 'manage',
          },
          {
            title: 'Arsip Partner',
            icon: 'none',
            tagVariant: 'light-warning',
            route: 'cod-arsip-partner',
            resource: 'Arsip Partner',
            action: 'manage',
          },
          {
            title: 'Data Layanan',
            icon: 'none',
            tagVariant: 'light-warning',
            route: 'cod-data-layanan',
            resource: 'Data Layanan',
            action: 'manage',
          },
        ],
      },
      {
        title: 'Ekspedisi',
        icon: 'TruckIcon',
        tagVariant: 'light-warning',
        resource: 'Ekspedisi',
        action: 'manage',
        children: [
          {
            title: 'Biaya Ekspedisi',
            icon: 'none',
            tagVariant: 'light-warning',
            route: 'cod-biaya-ekspedisi',
            resource: 'Biaya Ekspedisi',
            action: 'manage',
          },
          {
            title: 'Performa',
            icon: 'none',
            tagVariant: 'light-warning',
            route: 'cod-performa-ekspedisi',
            resource: 'Performa',
            action: 'manage',
          },
        ],
      },
    ],
  },
]
