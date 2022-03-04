export default [
  {
    title: 'Pengaturan',
    icon: 'SettingsIcon',
    customicon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#222222" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 12.8804V11.1204C2 10.0804 2.85 9.22043 3.9 9.22043C5.71 9.22043 6.45 7.94042 5.54 6.37042C5.02 5.47042 5.33 4.30042 6.24 3.78042L7.97 2.79042C8.76 2.32042 9.78 2.60042 10.25 3.39042L10.36 3.58042C11.26 5.15042 12.74 5.15042 13.65 3.58042L13.76 3.39042C14.23 2.60042 15.25 2.32042 16.04 2.79042L17.77 3.78042C18.68 4.30042 18.99 5.47042 18.47 6.37042C17.56 7.94042 18.3 9.22043 20.11 9.22043C21.15 9.22043 22.01 10.0704 22.01 11.1204V12.8804C22.01 13.9204 21.16 14.7804 20.11 14.7804C18.3 14.7804 17.56 16.0604 18.47 17.6304C18.99 18.5404 18.68 19.7004 17.77 20.2204L16.04 21.2104C15.25 21.6804 14.23 21.4004 13.76 20.6104L13.65 20.4204C12.75 18.8504 11.27 18.8504 10.36 20.4204L10.25 20.6104C9.78 21.4004 8.76 21.6804 7.97 21.2104L6.24 20.2204C5.33 19.7004 5.02 18.5304 5.54 17.6304C6.45 16.0604 5.71 14.7804 3.9 14.7804C2.85 14.7804 2 13.9204 2 12.8804Z" stroke="#222222" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    resource: 'Setting Komship',
    action: 'manage',
    children: [
      {
        title: 'Profile',
        icon: 'None',
        resource: 'Setting Profile',
        route: 'kompship-profile',
        action: 'manage',
      },
      {
        title: 'Akses Akun',
        icon: 'None',
        resource: 'Setting Access Account',
        route: 'kompship-akses-akun',
        action: 'manage',
      },
      {
        title: 'Alamat Pickup',
        icon: 'None',
        resource: 'Setting Pickup Address',
        route: 'kompship-pickup',
        action: 'manage',
      },
      {
        title: 'Rekening Bank',
        icon: 'None',
        resource: 'Setting Rekening Bank',
        route: 'kompship-rekening-bank',
        action: 'manage',
      },
      {
        title: 'PIN',
        icon: 'None',
        resource: 'Setting PIN',
        action: 'manage',
        route: 'kompship-pin',
      },
      {
        title: 'Ekspedisi',
        icon: 'None',
        resource: 'Setting Ekspedisi',
        route: 'kompship-ekspedisi',
        action: 'manage',
      },
    ],
  },
]
