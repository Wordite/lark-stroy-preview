const links = [
  {
    label: 'О компании',
    href: '/',
  },
  {
    label: 'Услуги',
    href: '/services',
    nestedLinks: [
      {
        label: 'Услуга 1',
        href: '/service-1',
      },
      {
        label: 'Услуга 2',
        href: '/service-2',
      },
    ],
  },
  {
    label: 'Проекты',
    href: '/projects',
  },
  {
    label: 'Контакты',
    href: '/contacts',
  },
]

export { links }