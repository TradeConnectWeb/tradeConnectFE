<template>
  <q-page class="flex flex-center">
    <div class="container">
      <div class="left-section">
        <div class="logo-container">
          <div class="logo">
            <img src="/logo.png" alt="TradeConnect Logo" @error="handleImageError" />
          </div>
          <div class="app-title">TradeConnect</div>
          <div v-if="success" class="description">
            Help Is on the Way 💌 We've sent a gentle little reset link to your inbox. Just follow
            the steps and you'll be back in soon.
          </div>
          <div v-else class="description">
            Trade, Buy & Sell Within Barangay Bulihan, Silang Cavite
          </div>
        </div>
      </div>

      <div class="right-section">
        <h2>Forgot Password</h2>

        <q-banner v-if="error" class="error-message bg-negative text-white">
          {{ error }}
        </q-banner>

        <q-banner v-if="success" class="success-message bg-positive text-white">
          {{ success }}
        </q-banner>

        <template v-if="!success">
          <form @submit.prevent="handleResetPassword">
            <div class="input-group">
              <q-icon name="email" class="input-icon" />
              <q-input v-model="email" type="email" label="Enter your email" standout required />
            </div>

            <q-btn type="submit" color="primary" :loading="loading" class="full-width">
              {{ loading ? 'Sending...' : 'Send Email' }}
            </q-btn>
          </form>

          <div class="remembered-password">
            Remembered your password? <router-link to="/login">Back to Login</router-link>
          </div>
        </template>

        <template v-else>
          <div class="success-actions">
            <q-btn color="primary" class="full-width" @click="router.push('/login')">
              Back to Login
            </q-btn>
          </div>
        </template>
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
    const loading = ref(false)
    const error = ref('')
    const success = ref('')

    const handleImageError = (e) => {
      e.target.src = '/fallback-logo.png'
      e.target.onerror = null
    }

    const handleResetPassword = async () => {
      loading.value = true
      error.value = ''
      success.value = ''

      try {
        await api.post('/auth/forgot-password', {
          email: email.value,
        })

        success.value = 'Password reset email sent! Please check your inbox.'
      } catch (err) {
        console.error('Password reset error:', err)
        let errorMessage = 'Failed to send reset email. Please try again.'

        if (err.response) {
          switch (err.response.status) {
            case 404:
              errorMessage = 'No account found with this email'
              break
            case 429:
              errorMessage = 'Please wait before requesting another reset email'
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
      loading,
      error,
      success,
      handleResetPassword,
      handleImageError,
      router,
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
  margin-bottom: 20px;
}

.input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #777;
}

.error-message,
.success-message {
  margin-bottom: 15px;
  border-radius: 5px;
}

.remembered-password {
  text-align: center;
  margin-top: 15px;
  color: #777;
  font-size: 14px;
}

.remembered-password a {
  color: #4a6fa5;
  text-decoration: none;
}

.remembered-password a:hover {
  text-decoration: underline;
}

.success-actions {
  margin-top: 20px;
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
