<template>
  <q-layout view="hHh Lpr lff">
    <!-- Header -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat @click="drawerLeft = !drawerLeft" round dense icon="menu" />
        <q-toolbar-title>TradeConnect Admin</q-toolbar-title>
        <q-space />

        <q-btn flat round dense icon="notifications" class="q-mx-sm">
          <q-badge color="red" floating v-if="unreadNotifications > 0">
            {{ unreadNotifications }}
          </q-badge>
          <q-menu>
            <q-list style="min-width: 350px">
              <q-item>
                <q-item-section>
                  <q-item-label class="text-weight-bold">Notifications</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    flat
                    dense
                    label="Mark all as read"
                    color="primary"
                    @click="markAllAsRead"
                  />
                </q-item-section>
              </q-item>
              <q-separator />
              <template v-if="notifications.length">
                <q-item
                  v-for="notification in notifications"
                  :key="notification.id"
                  clickable
                  v-ripple
                >
                  <q-item-section>
                    <q-item-label class="text-subtitle1">{{ notification.title }}</q-item-label>
                    <q-item-label caption>{{ notification.message }}</q-item-label>
                    <q-item-label caption class="text-grey">
                      {{ formatDate(notification.date) }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <q-item v-else>
                <q-item-section>
                  <q-item-label>No notifications</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <q-btn flat round dense>
          <q-avatar size="32px" class="gray-avatar">
            <img :src="user.avatar || '/default-avatar.png'" alt="Avatar" class="no-animation" />
          </q-avatar>
          <q-menu>
            <q-list style="min-width: 200px">
              <q-item clickable v-close-popup @click="logout">
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawerLeft" show-if-above bordered :width="260" class="bg-white">
      <div class="q-pa-md">
        <div class="logo-container q-mb-md row items-center">
          <q-avatar size="20px">
            <img src="/logo.png" />
          </q-avatar>
          <div class="q-ml-sm text-primary text-weight-bold text-h6">TradeConnect</div>
        </div>
        <q-separator />

        <q-list padding>
          <q-item
            v-for="item in menuItems"
            :key="item.title"
            clickable
            v-ripple
            :active="activeTab === item.tab"
            @click="activeTab = item.tab"
            active-class="active-menu-item"
          >
            <q-item-section avatar>
              <q-icon :name="item.icon" />
            </q-item-section>
            <q-item-section>{{ item.title }}</q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      drawerLeft: true,
      activeTab: 'dashboard',
      notifications: [
        {
          id: 1,
          title: 'New user registered',
          message: 'A new user has joined the platform.',
          date: new Date(Date.now() - 3600000),
          read: false,
        },
        {
          id: 2,
          title: 'Report submitted',
          message: 'New report about a scam.',
          date: new Date(Date.now() - 7200000),
          read: false,
        },
      ],
      user: {
        name: 'Admin User',
        avatar: '',
      },
      menuItems: [
        { title: 'Dashboard', icon: 'dashboard', tab: 'dashboard' },
        { title: 'User Management', icon: 'people', tab: 'users' },
        { title: 'Location Monitoring', icon: 'location_on', tab: 'locations' },
        { title: 'Reports', icon: 'flag', tab: 'reports' },
        { title: 'Settings', icon: 'settings', tab: 'settings' },
      ],
    }
  },
  computed: {
    unreadNotifications() {
      return this.notifications.filter((n) => !n.read).length
    },
  },
  methods: {
    logout() {
      this.$q
        .dialog({
          title: 'Confirm Logout',
          message: 'Are you sure you want to logout?',
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.$router.push('/login')
        })
    },
    markAllAsRead() {
      this.notifications.forEach((n) => (n.read = true))
      this.$q.notify({
        message: 'All notifications marked as read',
        color: 'positive',
      })
    },
    formatDate(date) {
      return new Date(date).toLocaleString()
    },
  },
  watch: {
    activeTab(newVal) {
      this.$router.push(`/admin/${newVal}`)
    },
  },
}
</script>

<style scoped>
.active-menu-item {
  color: #1976d2;
  background-color: rgba(25, 118, 210, 0.1);
  border-radius: 8px;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo-container img {
  width: 20px;
  height: 20px;
  object-fit: contain;
  animation: spinAndScale 3s linear infinite;
}

.no-animation {
  animation: none !important;
}

.gray-avatar {
  background-color: #9e9999;
}

@keyframes spinAndScale {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.1);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}

.q-toolbar__title {
  font-size: 1.25rem;
  font-weight: 600;
}
</style>
