<template>
  <q-page class="flex flex-center bg-grey-2">
    <div class="container">
      <!-- Left Section -->
      <div class="left-section">
        <div class="logo-container">
          <div class="logo">
            <img src="logo.png" alt="TradeConnect Logo" />
          </div>
          <div class="app-title">TradeConnect</div>
          <div class="description">Your Extra Could Be Someone's Essential, Start Trading!</div>
        </div>
      </div>

      <!-- Right Section -->
      <div class="right-section">
        <h2>Login to Your Account</h2>

        <q-form @submit.prevent="handleLogin">
          <q-input
            v-model="email"
            type="email"
            label="Email"
            lazy-rules
            outlined
            class="q-mb-md"
            :rules="[
              (val) => !!val || 'Email is required',
              () => isValidEmail || 'Please enter a valid email',
            ]"
          />

          <q-input
            v-model="password"
            :type="isPwd ? 'password' : 'text'"
            label="Password"
            lazy-rules
            outlined
            class="q-mb-md"
            :rules="[
              (val) => !!val || 'Password is required',
              (val) => val.length >= 6 || 'Password must be at least 6 characters',
            ]"
          >
            <template v-slot:append>
              <q-icon
                v-if="password"
                :name="isPwd ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <div class="remember-forgot q-mb-md">
            <q-checkbox v-model="rememberMe" label="Remember me" />
            <!-- <q-btn flat label="Forgot password?" class="q-pa-none" to="/forgot-password" /> -->
          </div>

          <q-btn
            type="submit"
            label="Login"
            color="primary"
            class="full-width q-mb-md"
            :loading="loading"
          >
            <template v-slot:loading>
              <q-spinner class="on-left" />
              Logging in...
            </template>
          </q-btn>
        </q-form>

        <div class="login-link">
          Don't have an account?
          <q-btn flat label="Sign Up" @click="router.push('/blank/signup')" class="q-pa-none" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const $q = useQuasar()

const email = ref('')
const password = ref('')
const isPwd = ref(true)
const rememberMe = ref(false)
const loading = ref(false)

const isValidEmail = computed(() => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email.value))

const handleLogin = async () => {
  if (!isValidEmail.value) {
    $q.notify({ message: 'Invalid email format', color: 'negative' })
    return
  }

  loading.value = true

  try {
    const response = await axios.post(`${process.env.api_host}/users/loginUser`, {
      email: email.value,
      password: password.value,
    })

    $q.notify({
      message: response.data.message || 'Login successful!',
      color: 'positive',
    })

    const token = response.data.token
    localStorage.setItem('authToken', 'bearer ' + token)
    // Redirect or change UI (optional)
    // router.push('/dashboard')
  } catch (err) {
    const msg = err.response?.data?.message || 'Login failed'
    $q.notify({ message: msg, color: 'negative' })
  } finally {
    loading.value = false
    checkAuth()
  }
}

async function checkAuth() {
  const token = localStorage.getItem('authToken')
  if (token) {
    router.push('/')
  }
}

onMounted(() => {
  checkAuth()
})
</script>

<style lang="scss" scoped>
/* Existing styles stay unchanged */
.container {
  display: flex;
  max-width: 800px;
  width: 100%;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  flex-wrap: wrap;
}

.left-section {
  flex: 1;
  min-width: 300px;
  padding: 50px 30px;
  background: linear-gradient(135deg, #4a6fa5, #166088);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.logo {
  width: 80px;
  height: 80px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
}

.logo img {
  width: 60px;
  height: 60px;
  object-fit: contain;
  animation: spinAndScale 3s linear infinite;
}

.app-title {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 10px;
}

.description {
  font-size: 16px;
  line-height: 1.5;
  max-width: 300px;
}

.right-section {
  flex: 1;
  min-width: 300px;
  padding: 60px 40px;
  color: #333;
}

.right-section h2 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
  color: #166088;
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #777;
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
  .container {
    flex-direction: column;
  }

  .left-section,
  .right-section {
    padding: 30px;
  }
}
@import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');
</style>
