
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue'), meta: { isSecured: true } },
      { path: 'product/:id', component: () => import('pages/ProductView.vue'), meta: { isSecured: true }, props: true },
      { path: 'outlets', component: () => import('pages/Outlets.vue'), meta: { isSecured: true } }
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
