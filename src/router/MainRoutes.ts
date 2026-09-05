const MainRoutes = {
  path: '/main',
  meta: {
    requiresAuth: true
  },
  redirect: '/main/dashboard/default',
  component: () => import('@/layouts/dashboard/DashboardLayout.vue'),
  children: [
    {
      name: 'home',
      path: '/',
      component: () => import('@/pages/PageDefault.vue')
    },
  ]
};

export default MainRoutes;
