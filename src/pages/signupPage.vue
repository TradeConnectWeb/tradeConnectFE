<template>
  <q-page class="flex flex-center">
    <div class="container">
      <div class="left-section">
        <div class="logo-container">
          <div class="logo">
            <img src="/logo.png" alt="TradeConnect Logo" @error="handleImageError" />
          </div>
          <div class="app-title">TradeConnect</div>
          <div class="description">Trade, Buy & Sell Within Barangay Bulihan, Silang Cavite</div>
        </div>
      </div>

      <div class="right-section">
        <h2>Sign Up</h2>

        <form @submit.prevent="handleSignup">
          <div class="input-group">
            <q-icon name="person" class="input-icon" />
            <q-input
              v-model="username"
              @update:model-value="() => (errors.username = '')"
              label="Username"
              :error="!!errors.username"
              :error-message="errors.username"
              standout
              required
            />
            <div v-if="avatarUrl" class="avatar-preview-container">
              <img
                :src="avatarUrl"
                alt="Profile Preview"
                class="avatar-preview"
                @error="handleAvatarError"
              />
            </div>
          </div>

          <div v-if="avatarUrl" class="avatar-note-container">
            <span class="avatar-note">Your unique profile picture</span>
          </div>

          <div class="input-group">
            <q-icon name="email" class="input-icon" />
            <q-input
              v-model="email"
              @update:model-value="() => (errors.email = '')"
              type="email"
              label="Email"
              :error="!!errors.email"
              :error-message="errors.email"
              standout
              required
            />
          </div>

          <div class="input-group">
            <q-icon name="location_on" class="input-icon" />
            <q-select
              v-model="zone"
              @update:model-value="() => (errors.zone = '')"
              :options="zoneOptions"
              label="Select your Zone"
              :error="!!errors.zone"
              :error-message="errors.zone"
              standout
              required
            />
          </div>

          <div class="input-group">
            <q-icon name="lock" class="input-icon" />
            <q-input
              v-model="password"
              @update:model-value="() => (errors.password = '')"
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              :error="!!errors.password"
              :error-message="errors.password"
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

          <div class="input-group">
            <q-icon name="lock" class="input-icon" />
            <q-input
              v-model="confirmPassword"
              @update:model-value="() => (errors.confirmPassword = '')"
              :type="showConfirmPassword ? 'text' : 'password'"
              label="Confirm Password"
              :error="!!errors.confirmPassword"
              :error-message="errors.confirmPassword"
              standout
              required
            >
              <template v-slot:append>
                <q-icon
                  :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showConfirmPassword = !showConfirmPassword"
                />
              </template>
            </q-input>
          </div>

          <div class="admin-checkbox">
            <q-checkbox
              v-model="isAdmin"
              label="Register as Admin (requires admin code)"
              @update:model-value="toggleAdmin"
            />
          </div>

          <div v-if="isAdmin" class="input-group">
            <q-icon name="vpn_key" class="input-icon" />
            <q-input
              v-model="adminCode"
              @update:model-value="() => (errors.adminCode = '')"
              type="password"
              label="Enter Admin Code"
              :error="!!errors.adminCode"
              :error-message="errors.adminCode"
              standout
            />
          </div>

          <div class="terms-privacy">
            By signing up, you agree to our
            <q-btn flat dense class="terms-link" @click="showModal = true">Terms and Privacy</q-btn>
          </div>

          <q-btn type="submit" color="primary" :loading="loading" class="full-width">
            {{ loading ? 'Creating account...' : 'Sign Up' }}
          </q-btn>
        </form>

        <div class="login-link">
          Already have an account? <router-link to="/login">Login</router-link>
        </div>
      </div>
    </div>

    <q-dialog v-model="showModal">
      <q-card>
        <q-card-section>
          <h3>Terms and Conditions</h3>
          <p>By signing up, you agree to the following:</p>
          <p>1. You are a resident of Barangay Bulihan, Silang, Cavite.</p>
          <p>2. You will only use this platform for legitimate trading purposes.</p>
          <p>3. You will not engage in any fraudulent activities.</p>
          <p>4. Your location data will be used for verification purposes only.</p>
          <p>5. The admin reserves the right to verify your identity and location.</p>
          <p>6. Any violation of these terms may result in account suspension.</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()
    const router = useRouter()

    const username = ref('')
    const email = ref('')
    const zone = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const isAdmin = ref(false)
    const adminCode = ref('')
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)
    const loading = ref(false)
    const showModal = ref(false)
    const avatarUrl = ref('')
    const failedAttempts = ref(0)

    const errors = ref({
      username: '',
      email: '',
      zone: '',
      password: '',
      confirmPassword: '',
      adminCode: '',
    })

    const zoneOptions = Array.from({ length: 11 }, (_, i) => `Zone ${i + 1}`)

    // Generate avatar when username changes
    watch(username, (newVal) => {
      if (newVal && newVal.length >= 2) {
        const avatarSvg = generateAvatar(newVal)
        const dataUrl = svgToDataUrl(avatarSvg)
        avatarUrl.value = dataUrl
      } else {
        avatarUrl.value = ''
      }
    })

    const getInitials = (name) => {
      if (!name) return ''
      const names = name.split(' ')
      let initials = names[0].substring(0, 1).toUpperCase()
      if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase()
      }
      return initials
    }

    const stringToColor = (string) => {
      let hash = 0
      for (let i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash)
      }
      const color = `hsl(${hash % 360}, 70%, 50%)`
      return color
    }

    const generateAvatar = (name, size = 40) => {
      const initials = getInitials(name)
      const backgroundColor = stringToColor(name)
      return `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${size}" height="${size}" fill="${backgroundColor}" rx="${size / 2}" />
          <text x="50%" y="50%" fill="#ffffff" font-family="Arial, sans-serif" font-size="${size / 2}" text-anchor="middle" dy=".35em">
            ${initials}
          </text>
        </svg>
      `
    }

    const svgToDataUrl = (svg) => {
      return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
    }

    const handleImageError = (e) => {
      e.target.src = '/fallback-logo.png'
      e.target.onerror = null
    }

    const handleAvatarError = (e) => {
      const fallbackSvg = generateAvatar(username.value || 'US')
      e.target.src = svgToDataUrl(fallbackSvg)
      e.target.onerror = null
    }

    const toggleAdmin = () => {
      if (!isAdmin.value) {
        adminCode.value = ''
        errors.value.adminCode = ''
      }
    }

    const validateForm = () => {
      errors.value = {
        username: '',
        email: '',
        zone: '',
        password: '',
        confirmPassword: '',
        adminCode: '',
      }

      let isValid = true

      if (!username.value) {
        errors.value.username = 'Username is required'
        isValid = false
      } else if (username.value.length < 3) {
        errors.value.username = 'Username must be at least 3 characters'
        isValid = false
      }

      if (!email.value) {
        errors.value.email = 'Email is required'
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        errors.value.email = 'Please enter a valid email address'
        isValid = false
      }

      if (!zone.value || !zone.value.startsWith('Zone')) {
        errors.value.zone = 'Please select your zone'
        isValid = false
      }

      if (!password.value) {
        errors.value.password = 'Password is required'
        isValid = false
      } else if (password.value.length < 6) {
        errors.value.password = 'Password must be at least 6 characters'
        isValid = false
      }

      if (!confirmPassword.value) {
        errors.value.confirmPassword = 'Please confirm your password'
        isValid = false
      } else if (password.value !== confirmPassword.value) {
        errors.value.confirmPassword = 'Passwords do not match'
        isValid = false
      }

      if (isAdmin.value && !adminCode.value) {
        errors.value.adminCode = 'Admin code is required'
        isValid = false
      } else if (isAdmin.value && adminCode.value !== 'TRADEADMIN') {
        errors.value.adminCode = 'Invalid admin code'
        isValid = false
      }

      return isValid
    }

    const handleSignup = async () => {
      if (!validateForm()) {
        return
      }

      // Check if it's an admin signup attempt
      const isAdminUser =
        email.value === 'admintradeconnecta@gmail.com' && adminCode.value === 'TRADEADMIN'

      if (email.value === 'admintradeconnecta@gmail.com' && adminCode.value !== 'TRADEADMIN') {
        $q.notify({
          type: 'negative',
          message: 'Invalid admin code',
        })
        return
      }

      loading.value = true

      try {
        const finalAvatarUrl =
          avatarUrl.value || svgToDataUrl(generateAvatar(username.value || email.value))

        const response = await api.post('/auth/signup', {
          username: username.value,
          email: email.value,
          zone: zone.value,
          password: password.value,
          role: isAdminUser ? 'admin' : 'user',
          photoURL: finalAvatarUrl,
        })

        // Store user data and token
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))

        // Redirect based on admin status
        if (isAdminUser) {
          router.push('/dashboard/admin')
        } else {
          router.push('/dashboard/user')
        }
      } catch (error) {
        console.error('Signup error:', error)
        failedAttempts.value += 1

        let errorMessage = 'Signup failed. Please try again.'
        let errorField = 'email'

        if (error.response) {
          if (error.response.status === 409) {
            errorMessage = 'This email is already registered. Please sign in.'
          } else if (error.response.status === 400) {
            errorMessage = error.response.data.message || 'Validation error'
          }
        }

        $q.notify({
          type: 'negative',
          message: errorMessage,
        })
      } finally {
        loading.value = false
      }
    }

    return {
      username,
      email,
      zone,
      password,
      confirmPassword,
      isAdmin,
      adminCode,
      showPassword,
      showConfirmPassword,
      loading,
      showModal,
      avatarUrl,
      errors,
      zoneOptions,
      handleSignup,
      handleImageError,
      handleAvatarError,
      toggleAdmin,
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

.avatar-preview-container {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar-preview {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid #4a6fa5;
  background-color: white;
  object-fit: cover;
}

.avatar-note-container {
  text-align: right;
  margin: -10px 0 15px 0;
}

.avatar-note {
  font-size: 11px;
  color: #666;
  font-style: italic;
}

.admin-checkbox {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.admin-checkbox label {
  font-size: 13px;
}

.terms-privacy {
  text-align: center;
  margin: 12px 0;
  font-size: 13px;
  color: #777;
}

.terms-link {
  color: #1a73e8;
  text-decoration: none;
  font-size: 13px;
}

.terms-link:hover {
  text-decoration: underline;
}

.login-link {
  text-align: center;
  margin-top: 15px;
  color: #777;
  font-size: 14px;
}

.login-link a {
  color: #4a6fa5;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
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

  .avatar-note {
    display: none;
  }
}
</style>
