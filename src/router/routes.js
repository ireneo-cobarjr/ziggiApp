
const routes = [
  {
    path: '/',
    redirect: '/brand',
    component: () => import('layouts/BaseLayout.vue'),
    children: [
      {
        path: 'brand',
        component: () => import('layouts/BrandLayout.vue'),
        children: [
          { path: '', component: () => import('pages/Brand.vue'), meta: { isSecured: true } },
          { path: 'product/:id', component: () => import('pages/ProductView.vue'), meta: { isSecured: true }, props: true },
          { path: 'outlets', component: () => import('pages/Outlets.vue'), meta: { isSecured: true } }
        ]
      },
      {
        path: 'customer',
        component: () => import('layouts/CustomerLayout.vue'),
        children: [
          { path: '', component: () => import('pages/Customer.vue'), meta: { isSecured: true } }
        ]
      }
    ]
  },
  {
    path: '/Auth/login',
    component: () => import('pages/Auth/Login.vue')
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
