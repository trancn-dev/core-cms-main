const AuthRoutes = {
  path: '/auth',
  component: () => import('@/layouts/blank/BlankLayout.vue'),
  meta: {
    requiresAuth: false
  },
  children: [
    {
      name: 'login',
      path: '/login',
      component: () => import('@/pages/auth/LoginPage.vue')
    },
    {
      name: 'forgotPassword',
      path: '/forgot-password',
      component: () => import('@/pages/auth/ForgotPasswordPage.vue')
    },
  ]
};

export default AuthRoutes;
