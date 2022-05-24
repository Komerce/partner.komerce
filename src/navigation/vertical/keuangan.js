export default [
  {
    title: 'Keuangan',
    icon: 'HardDriveIcon',
    customicon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 11.1504H7" stroke="#222222" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 11.1498V6.52985C2 4.48985 3.65 2.83984 5.69 2.83984H11.31C13.35 2.83984 15 4.10984 15 6.14984" stroke="#222222" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M17.48 12.2004C16.98 12.6804 16.74 13.4204 16.94 14.1804C17.19 15.1104 18.11 15.7004 19.07 15.7004H20V17.1504C20 19.3604 18.21 21.1504 16 21.1504H6C3.79 21.1504 2 19.3604 2 17.1504V10.1504C2 7.94039 3.79 6.15039 6 6.15039H16C18.2 6.15039 20 7.95039 20 10.1504V11.6003H18.92C18.36 11.6003 17.85 11.8204 17.48 12.2004Z" stroke="#222222" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 12.6196V14.6796C22 15.2396 21.5399 15.6996 20.9699 15.6996H19.0399C17.9599 15.6996 16.97 14.9097 16.88 13.8297C16.82 13.1997 17.0599 12.6096 17.4799 12.1996C17.8499 11.8196 18.36 11.5996 18.92 11.5996H20.9699C21.5399 11.5996 22 12.0596 22 12.6196Z" stroke="#222222" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    resource: 'Keuangan',
    action: 'manage',
    children: [
      {
        title: 'Penghasilan',
        icon: 'None',
        resource: 'Penghasilan',
        route: 'penghasilan',
        action: 'manage',
      },
      {
        title: 'Saldo',
        icon: 'None',
        resource: 'Saldo',
        route: 'saldo',
        action: 'manage',
      },
    ],
  },
]
