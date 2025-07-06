<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-space />

        <div class="header-icons row items-center no-wrap">
          <!-- <q-btn dense flat round icon="notifications" class="q-mx-sm">
            <q-badge color="red" floating />
          </q-btn> -->

          <q-btn dense flat round class="q-mx-sm">
            <q-avatar size="32px">
              <img :src="userAvatar" />
            </q-avatar>
            <q-menu>
              <q-list style="min-width: 150px">
                <q-item clickable v-close-popup @click="goTo('/profile')">
                  <q-item-section>Profile</q-item-section>
                </q-item>
                <!-- <q-item clickable v-close-popup @click="goTo('/settings')">
                  <q-item-section>Settings</q-item-section>
                </q-item> -->
                <q-separator />
                <q-item clickable v-close-popup @click="logout">
                  <q-item-section>Logout</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

          <!-- <q-btn dense flat round icon="shopping_cart" class="q-ml-sm">
            <q-badge color="red" floating />
          </q-btn> -->
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="250"
      class="bg-primary text-white"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item class="logo-item">
            <q-item-section>
              <div class="logo-container">
                <q-avatar size="40px" class="logo">
                  <img src="/logo.png" />
                </q-avatar>
                <span class="logo-text">TradeConnect</span>
              </div>
            </q-item-section>
          </q-item>

          <q-separator color="white" class="q-my-md" />

          <q-item
            v-for="nav in navItems"
            :key="nav.title"
            clickable
            v-ripple
            :active="nav.link === $route.path"
            @click="navigateTo(nav.link)"
            class="nav-item"
          >
            <q-item-section avatar>
              <q-icon :name="nav.icon" />
            </q-item-section>

            <q-item-section>
              {{ nav.title }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const leftDrawerOpen = ref(false)
const userAvatar = ref('https://placehold.co/40')

const navItems = [
  { title: 'Home', icon: 'home', link: '/' },
  { title: 'Profile', icon: 'person', link: '/profile' },
  // { title: 'Seller', icon: 'sell', link: '/seller' },
  // { title: 'Messages', icon: 'chat', link: '/messages' },
  { title: 'Community', icon: 'groups', link: '/community' },
  { title: 'Help Center', icon: 'help', link: '/help-center' },
]

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const navigateTo = async (route) => {
  await router.push(route)
  leftDrawerOpen.value = false
  location.reload()
}

const goTo = async (path) => {
  await router.push(path)
  location.reload()
}

const logout = () => {
  localStorage.removeItem('authToken')
  router.push('/blank/login')
}

async function checkAuth() {
  const token = localStorage.getItem('authToken')
  if (!token) {
    router.push('/blank/login')
  }
}

onMounted(async () => {
  checkAuth()
})
</script>

<style scoped>
.nav-item {
  border-radius: 8px;
  margin: 4px 8px;
  transition: all 0.3s ease;
  color: white;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-item.q-item--active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: 600;
  color: white; /* Ensures text stays visible */
}

.nav-item.q-item--active .q-item__section {
  color: white; /* Ensures icon + label are visible */
}
</style>
