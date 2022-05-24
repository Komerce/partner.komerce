export default [
  {
    title: 'Produk',
    icon: 'BriefcaseIcon',
    customicon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M22 16.7397V4.6697C22 3.4697 21.02 2.5797 19.83 2.6797H19.77C17.67 2.8597 14.48 3.9297 12.7 5.0497L12.53 5.1597C12.24 5.3397 11.76 5.3397 11.47 5.1597L11.22 5.0097C9.44 3.8997 6.26 2.8397 4.16 2.6697C2.97 2.5697 2 3.4697 2 4.6597V16.7397C2 17.6997 2.78 18.5997 3.74 18.7197L4.03 18.7597C6.2 19.0497 9.55 20.1497 11.47 21.1997L11.51 21.2197C11.78 21.3697 12.21 21.3697 12.47 21.2197C14.39 20.1597 17.75 19.0497 19.93 18.7597L20.26 18.7197C21.22 18.5997 22 17.6997 22 16.7397Z" stroke="#222222" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>  <path d="M12 5.49023V20.4902" stroke="#222222" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M7.75 8.49023H5.5" stroke="#222222" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M8.5 11.4902H5.5" stroke="#222222" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    resource: 'Produk',
    action: 'manage',
    children: [
      {
        title: 'Tambah Produk',
        icon: 'None',
        resource: 'Tambah Produk',
        route: 'add-produk',
        action: 'manage',
      },
      {
        title: 'Data Produk',
        icon: 'None',
        resource: 'Data Produk',
        route: 'data-produk',
        action: 'manage',
      },
    ],
  },
]
