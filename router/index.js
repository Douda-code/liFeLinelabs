import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Client routes
import Home from '../views/Home.vue'
import AboutUs from '../views/client/AboutUs.vue'
import Scans from '../views/client/Scans.vue'
import ScanDetails from '../views/client/ScanDetails.vue'
import AIAnalysis from '../views/client/AIAnalysis.vue'
import Consultation from '../views/client/Consultation.vue'
import Emergency from '../views/client/Emergency.vue'
import Resources from '../views/client/Resources.vue'
import Contact from '../views/client/Contact.vue'
import AccountSettings from '../views/client/AccountSettings.vue'
import Notifications from '../views/client/Notifications.vue'
import MakeAppointment from '../views/client/MakeAppointment.vue'
import ActivityHistory from '../views/client/ActivityHistory.vue'
import UpgradeAccount from '../views/client/UpgradeAccount.vue'
import FindDoctors from '../views/client/FindDoctors.vue'

import Login from '../views/client/Login.vue'
import Register from '../views/client/Register.vue'

// Admin routes
import AdminLogin from '../views/admin/Login.vue'
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import AdminUsers from '../views/admin/Users.vue'
import AdminScanResults from '../views/admin/ScanResults.vue'
import AdminPhysicianConsultation from '../views/admin/PhysicianConsultation.vue'
import AdminNotificationsAnnouncements from '../views/admin/NotificationsAnnouncements.vue'
import AdminSystemSettings from '../views/admin/SystemSettings.vue'
import AdminLogsAuditTrail from '../views/admin/LogsAuditTrail.vue'
import AdminReportsAnalytics from '../views/admin/ReportsAnalytics.vue'
import AdminSupportTicketing from '../views/admin/SupportTicketing.vue'
import AdminAccountSettings from '../views/admin/AccountSettings.vue'
import AdminEmergency from '../views/admin/Emergency.vue'
import AdminAIModels from '../views/admin/AIModels.vue'
import AdminAppointments from '../views/admin/Appointments.vue'


const routes = [
  // Client routes
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: AIAnalysis,
    meta: { requiresAuth: true },
  },
  {
    path: '/scans',
    name: 'scans',
    component: Scans,
    meta: { requiresAuth: true },
  },
  {
    path: '/scans/:id',
    name: 'scan-details',
    component: ScanDetails,
    meta: { requiresAuth: true },
  },
  {
    path: '/ai-analysis',
    name: 'ai-analysis',
    component: AIAnalysis,
    meta: { requiresAuth: true },
  },
  {
    path: '/consultation',
    name: 'consultation',
    component: Consultation,
    meta: { requiresAuth: true },
  },
  {
    path: '/emergency',
    name: 'emergency',
    component: Emergency,
  },
  {
    path: '/resources',
    name: 'resources',
    component: Resources,
  },
  {
    path: '/contact',
    name: 'contact',
    component: Contact,
  },
  {
    path: '/about-us',
    name: 'about-us',
    component: AboutUs,
  },
  {
    path: '/account-settings',
    name: 'account-settings',
    component: AccountSettings,
    meta: { requiresAuth: true },
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: Notifications,
    meta: { requiresAuth: true },
  },
  {
    path: '/make-appointment',
    name: 'make-appointment',
    component: MakeAppointment,
    meta: { requiresAuth: true },
  },
  {
    path: '/activity-history',
    name: 'activity-history',
    component: ActivityHistory,
    meta: { requiresAuth: true },
  },
  {
    path: '/upgrade-account',
    name: 'UpgradeAccount',
    component: UpgradeAccount,
    meta: { requiresAuth: true },
  },
  {
    path: '/find-doctors',
    name: 'find-doctors',
    component: FindDoctors,
    meta: { requiresAuth: true },
  },

  // Admin routes
  {
    path: '/admin',
    name: 'admin-login',
    component: AdminLogin,
  },
  {
    path: '/admin/dashboard',
    name: 'admin-dashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: AdminUsers,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/scan-results',
    name: 'admin-scan-results',
    component: AdminScanResults,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/physician-consultation',
    name: 'admin-physician-consultation',
    component: AdminPhysicianConsultation,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/notifications-announcements',
    name: 'admin-notifications-announcements',
    component: AdminNotificationsAnnouncements,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/system-settings',
    name: 'admin-system-settings',
    component: AdminSystemSettings,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/logs-audit-trail',
    name: 'admin-logs-audit-trail',
    component: AdminLogsAuditTrail,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/reports-analytics',
    name: 'admin-reports-analytics',
    component: AdminReportsAnalytics,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/support-ticketing',
    name: 'admin-support-ticketing',
    component: AdminSupportTicketing,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/account-settings',
    name: 'admin-account-settings',
    component: AdminAccountSettings,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/emergency',
    name: 'admin-emergency',
    component: AdminEmergency,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/ai-models',
    name: 'admin-ai-models',
    component: AdminAIModels,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/appointments',
    name: 'appointments',
    component: AdminAppointments,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Wait for auth to initialize
  if (authStore.loading) {
    await new Promise(resolve => {
      const unwatch = authStore.$subscribe(() => {
        if (!authStore.loading) {
          unwatch()
          resolve()
        }
      })
    })
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  
  // If route requires authentication and user is not logged in
  if (requiresAuth && !authStore.isAuthenticated) {
    if (to.path.startsWith('/admin')) {
      next('/admin')
    } else {
      next('/login')
    }
  } 
  // If route requires admin role and user is not an admin
  else if (requiresAdmin && !authStore.isAdmin) {
    next('/admin')
  }
  // If user is logged in as admin and trying to access admin login page
  else if (authStore.isAuthenticated && authStore.isAdmin && to.path === '/admin') {
    next('/admin/dashboard')
  }
  // If user is logged in and trying to access login page
  else if (authStore.isAuthenticated && to.path === '/login') {
    next('/dashboard')
  }
  else {
    next()
  }
})

export default router
