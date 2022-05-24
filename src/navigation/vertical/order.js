export default [
  {
    title: 'Orderku',
    icon: 'GiftIcon',
    customicon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.80994 2L5.18994 5.63" stroke="#222222" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M15.1899 2L18.8099 5.63" stroke="#222222" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M2 7.84961C2 5.99961 2.99 5.84961 4.22 5.84961H19.78C21.01 5.84961 22 5.99961 22 7.84961C22 9.99961 21.01 9.84961 19.78 9.84961H4.22C2.99 9.84961 2 9.99961 2 7.84961Z" stroke="#222222" stroke-width="1.5"/>
    <path d="M9.76001 14V17.55" stroke="#222222" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M14.36 14V17.55" stroke="#222222" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M3.5 10L4.91 18.64C5.23 20.58 6 22 8.86 22H14.89C18 22 18.46 20.64 18.82 18.76L20.5 10" stroke="#222222" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
    resource: 'Order',
    action: 'manage',
    children: [
      {
        title: 'Tambah Order',
        icon: 'None',
        resource: 'Tambah Order',
        route: 'add-order',
        action: 'manage',
      },
      {
        title: 'Data Order',
        icon: 'None',
        resource: 'Tambah Order',
        route: 'data-order',
        action: 'manage',
      },
    ],
  },
]
