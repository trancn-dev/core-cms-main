const MainRoutes = {
  path: '/main',
  meta: {
    requiresAuth: true
  },
  redirect: '/dashboard',
  component: () => import('@/layouts/dashboard/DashboardLayout.vue'),
  children: [
    {
      name: 'home',
      path: '/',
      redirect: '/dashboard'
    },
    {
      name: 'dashboard',
      path: '/dashboard',
      component: () => import('@/pages/dashboard/DashboardPage.vue')
    },
    // Videos
    {
      name: 'video-list',
      path: '/videos',
      component: () => import('@/pages/videos/VideoListPage.vue')
    },
    {
      name: 'video-create',
      path: '/videos/create',
      component: () => import('@/pages/videos/VideoFormPage.vue')
    },
    {
      name: 'video-edit',
      path: '/videos/:id/edit',
      component: () => import('@/pages/videos/VideoFormPage.vue')
    },
    {
      name: 'video-detail',
      path: '/videos/:id',
      component: () => import('@/pages/videos/VideoDetailPage.vue')
    },
    // Categories
    {
      name: 'category-list',
      path: '/categories',
      component: () => import('@/pages/categories/CategoryListPage.vue')
    },
    {
      name: 'category-create',
      path: '/categories/create',
      component: () => import('@/pages/categories/CategoryFormPage.vue')
    },
    {
      name: 'category-edit',
      path: '/categories/:id/edit',
      component: () => import('@/pages/categories/CategoryFormPage.vue')
    },
    // Tags
    {
      name: 'tag-list',
      path: '/tags',
      component: () => import('@/pages/tags/TagListPage.vue')
    },
    // Channels
    {
      name: 'channel-list',
      path: '/channels',
      component: () => import('@/pages/channels/ChannelListPage.vue')
    },
    {
      name: 'channel-create',
      path: '/channels/create',
      component: () => import('@/pages/channels/ChannelFormPage.vue')
    },
    {
      name: 'channel-edit',
      path: '/channels/:id/edit',
      component: () => import('@/pages/channels/ChannelFormPage.vue')
    },
    {
      name: 'channel-detail',
      path: '/channels/:id',
      component: () => import('@/pages/channels/ChannelDetailPage.vue')
    },
    // Users
    {
      name: 'user-list',
      path: '/users',
      component: () => import('@/pages/users/UserListPage.vue')
    },
    {
      name: 'user-create',
      path: '/users/create',
      component: () => import('@/pages/users/UserFormPage.vue')
    },
    {
      name: 'user-edit',
      path: '/users/:id/edit',
      component: () => import('@/pages/users/UserFormPage.vue')
    },
    {
      name: 'user-detail',
      path: '/users/:id',
      component: () => import('@/pages/users/UserDetailPage.vue')
    },
    // Comments
    {
      name: 'comment-list',
      path: '/comments',
      component: () => import('@/pages/comments/CommentListPage.vue')
    },
    // Reports
    {
      name: 'report-list',
      path: '/reports',
      component: () => import('@/pages/reports/ReportListPage.vue')
    },
    {
      name: 'report-detail',
      path: '/reports/:id',
      component: () => import('@/pages/reports/ReportDetailPage.vue')
    },
    // Playlists
    {
      name: 'playlist-list',
      path: '/playlists',
      component: () => import('@/pages/playlists/PlaylistListPage.vue')
    },
    {
      name: 'playlist-detail',
      path: '/playlists/:id',
      component: () => import('@/pages/playlists/PlaylistDetailPage.vue')
    },
    // Ads
    {
      name: 'ad-list',
      path: '/ads',
      component: () => import('@/pages/ads/AdListPage.vue')
    },
    {
      name: 'ad-create',
      path: '/ads/create',
      component: () => import('@/pages/ads/AdFormPage.vue')
    },
    {
      name: 'ad-edit',
      path: '/ads/:id/edit',
      component: () => import('@/pages/ads/AdFormPage.vue')
    },
    // Analytics
    {
      name: 'analytics-videos',
      path: '/analytics/videos',
      component: () => import('@/pages/analytics/VideoAnalyticsPage.vue')
    },
    // Settings
    {
      name: 'settings-general',
      path: '/settings/general',
      component: () => import('@/pages/settings/GeneralSettingsPage.vue')
    },
    {
      name: 'settings-storage',
      path: '/settings/storage',
      component: () => import('@/pages/settings/StorageSettingsPage.vue')
    },
    {
      name: 'settings-seo',
      path: '/settings/seo',
      component: () => import('@/pages/settings/SeoSettingsPage.vue')
    },
    {
      name: 'settings-email',
      path: '/settings/email',
      component: () => import('@/pages/settings/EmailSettingsPage.vue')
    },
    {
      name: 'settings-admins',
      path: '/settings/admins',
      component: () => import('@/pages/settings/AdminSettingsPage.vue')
    }
  ]
};

export default MainRoutes;
