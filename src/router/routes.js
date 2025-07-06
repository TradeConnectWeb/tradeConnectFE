const routes = [
  {
    path: '/blank',
    component: () => import('layouts/BlankLayout.vue'),
    children: [
      { path: 'login', component: () => import('pages/loginPage.vue') },
      { path: 'signup', component: () => import('pages/signupPage.vue') },
      { path: 'forgot-password', component: () => import('pages/ForgotPasswordPage.vue') },
    ],
  },

  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/HomePage.vue') },
      { path: 'messages', component: () => import('pages/MessagesPage.vue') },
      { path: 'profile', component: () => import('pages/ProfilePage.vue') },
      { path: 'seller', component: () => import('pages/SellerPage.vue') },
      { path: 'community', component: () => import('pages/CommunityPage.vue') },
      { path: 'settings', component: () => import('pages/SettingsPage.vue') },
      { path: 'help-center', component: () => import('pages/HelpCenterPage.vue') },
      { path: 'verification', component: () => import('pages/verificationPage.vue') },

    ],
  },

  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      { path: 'dashboard', component: () => import('pages/AdminDashboardPage.vue') },
      { path: 'users', component: () => import('pages/AdminUsersPage.vue') },
      { path: 'locations', component: () => import('pages/AdminLocationsPage.vue') },
      { path: 'reports', component: () => import('pages/AdminReportsPage.vue') },
      { path: 'settings', component: () => import('pages/AdminSettingsPage.vue') },
      { path: '', redirect: '/admin/home' },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
