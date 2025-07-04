<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-space />

        <q-space />

        <div class="header-icons row items-center no-wrap">
          <q-btn dense flat round icon="notifications" class="q-mx-sm">
            <q-badge color="red" floating></q-badge>
          </q-btn>

          <q-btn dense flat round class="q-mx-sm">
            <q-avatar size="32px">
              <img :src="userAvatar" />
            </q-avatar>
            <q-menu>
              <q-list style="min-width: 150px">
                <q-item clickable v-close-popup>
                  <q-item-section>Profile</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section>Settings</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup @click="logout">
                  <q-item-section>Logout</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

          <q-btn dense flat round icon="shopping_cart" class="q-ml-sm">
            <q-badge color="red" floating></q-badge>
          </q-btn>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SearchBar from '../components/SearchBar.vue'

const router = useRouter()
const leftDrawerOpen = ref(false)
const userAvatar = ref('https://placehold.co/40')

const navItems = [
  { title: 'Home', icon: 'home', link: '/' },
  { title: 'Profile', icon: 'person', link: '/profile' },
  { title: 'Seller', icon: 'sell', link: '/seller' },
  { title: 'Messages', icon: 'chat', link: '/messages' },
  { title: 'Community', icon: 'groups', link: '/community' },
  { title: 'Help Center', icon: 'help', link: '/help-center' },
]

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const navigateTo = (route) => {
  router.push(route)
  leftDrawerOpen.value = false
}

const handleSearch = (query) => {
  console.log('Searching for:', query)
}

const logout = () => {
  console.log('Logging out...')
  router.push('/login')
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap');

$primary: #4a6fa5;
$secondary: #166088;
$accent: #d16644;
$light: #f8f9fa;
$dark: #343a40;
$white: #ffffff;

body,
.q-toolbar,
.q-item,
.q-btn {
  font-family: 'Open Sans', sans-serif;
}

.logo-container {
  display: flex;
  align-items: center;

  .logo {
    background-color: $white;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

    img {
      width: 20px;
      height: 20px;
      object-fit: contain;
      animation: spinAndScale 3s linear infinite;
    }
  }

  .logo-text {
    font-size: 1.25rem;
    font-weight: 600;
    margin-left: 8px;
    color: $white;
  }
}

.nav-item {
  border-radius: 8px;
  margin: 4px 8px;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba($white, 0.1);
  }

  &.q-item--active {
    background-color: rgba($white, 0.2);
    font-weight: 500;
  }

  .q-icon {
    font-size: 20px;
  }
}

.q-toolbar {
  padding: 0 16px;

  .q-toolbar__title {
    font-size: 1.25rem;
    font-weight: 600;
  }
}

.header-search {
  flex: 0 0 40%;
  max-width: 500px;
  min-width: 200px;

  :deep(.q-field__native) {
    color: $white !important;
  }

  :deep(.q-icon) {
    color: $white !important;
  }
}

.header-icons {
  margin-left: auto;

  .q-btn {
    color: $white;

    .q-badge {
      top: 4px;
      right: 4px;
    }
  }
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

@media (max-width: 768px) {
  .logo-text {
    display: none;
  }

  .header-search {
    flex: 1;
    min-width: auto;
    margin: 0 8px;
  }

  .header-icons {
    margin-left: 8px;

    .q-btn {
      margin: 0 2px !important;
    }
  }

  .q-toolbar__title {
    font-size: 1rem !important;
  }
}

@media (max-width: 480px) {
  .logo-container .logo {
    display: none;
  }

  .header-icons {
    .q-btn:not(:last-child) {
      display: none;
    }
  }
}
</style>
