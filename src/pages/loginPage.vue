<template>
  <q-page class="flex flex-center">
    <div class="container">
      <div class="left-section">
        <div class="logo-container">
          <div class="logo">
            <img src="/logo.png" alt="TradeConnect Logo" @error="handleImageError" />
          </div>
          <div class="app-title">TradeConnect</div>
          <div class="description">
            Welcome back to your local marketplace to Trade, Buy & Sell.
          </div>
        </div>
      </div>

      <div class="right-section">
        <h2>Login to Your Account</h2>

        <q-banner v-if="error" class="error-notice bg-negative text-white">
          <template v-slot:avatar>
            <q-icon name="warning" />
          </template>
          {{ error }}
        </q-banner>

        <form @submit.prevent="handleLogin">
          <div class="input-group">
            <q-icon name="email" class="input-icon" />
            <q-input v-model="email" label="Email" type="email" standout required />
          </div>

          <div class="input-group">
            <q-icon name="lock" class="input-icon" />
            <q-input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              standout
              required
            >
              <template v-slot:append>
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>
          </div>

          <div class="login-options">
            <q-checkbox v-model="rememberMe" label="Remember me" />
            <router-link to="/forgot-password" class="forgot-password"
              >Forgot Password?</router-link
            >
          </div>

          <q-btn type="submit" color="primary" :loading="loading" class="full-width">
            {{ loading ? 'Logging in...' : 'Login' }}
          </q-btn>
        </form>

        <div class="signup-link">
          Don't have an account? <router-link to="/signup">Sign Up</router-link>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()
    const router = useRouter()

    const email = ref('')
    const password = ref('')
    const showPassword = ref(false)
    const rememberMe = ref(false)
    const loading = ref(false)
    const error = ref('')

    const handleImageError = (e) => {
      e.target.src = '/fallback-logo.png'
      e.target.onerror = null
    }

    const handleLogin = async () => {
      loading.value = true
      error.value = ''

      try {
        const response = await api.post('/auth/login', {
          email: email.value,
          password: password.value,
          remember: rememberMe.value,
        })

        // Store user data and token
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))

        // Redirect based on role
        if (response.data.user.role === 'admin') {
          router.push('/dashboard/admin')
        } else {
          router.push('/dashboard/user')
        }
      } catch (err) {
        console.error('Login error:', err)
        let errorMessage = 'Login failed. Please try again.'

        if (err.response) {
          switch (err.response.status) {
            case 401:
              errorMessage = 'Invalid email or password'
              break
            case 404:
              errorMessage = 'No account found with this email'
              break
            case 429:
              errorMessage = 'Too many attempts. Please try again later.'
              break
            default:
              errorMessage = err.response.data.message || errorMessage
          }
        }

        error.value = errorMessage
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      password,
      showPassword,
      rememberMe,
      loading,
      error,
      handleLogin,
      handleImageError,
    }
  },
}
</script>

<style scoped>
.container {
  display: flex;
  max-width: 900px;
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
  padding: 40px 20px;
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
  margin-bottom: 15px;
}

.logo {
  width: 70px;
  height: 70px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
}

.logo img {
  width: 50px;
  height: 50px;
  object-fit: contain;
  animation: spinAndScale 3s linear infinite;
}

.app-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.description {
  font-size: 14px;
  line-height: 1.4;
  max-width: 280px;
}

.right-section {
  flex: 1;
  min-width: 300px;
  padding: 40px 30px;
  color: #333;
}

.right-section h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 22px;
  color: #166088;
}

.input-group {
  position: relative;
  margin-bottom: 15px;
}

.input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #777;
  z-index: 1;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 13px;
}

.forgot-password {
  color: #1a73e8;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.signup-link {
  text-align: center;
  margin-top: 15px;
  color: #777;
  font-size: 14px;
}

.signup-link a {
  color: #4a6fa5;
  text-decoration: none;
}

.signup-link a:hover {
  text-decoration: underline;
}

.error-notice {
  margin-bottom: 15px;
  border-radius: 5px;
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
    padding: 25px;
  }
}
</style>
