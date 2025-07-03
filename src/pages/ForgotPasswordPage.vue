<template>
  <q-page class="flex flex-center bg-grey-2">
    <div class="container">
      <div class="left-section">
        <div class="logo-container">
          <div class="logo">
            <img src="logo.png" alt="TradeConnect Logo" />
          </div>
          <div class="app-title">TradeConnect</div>
          <div class="description">
            We've sent a gentle little reset link to your inbox. Just follow the steps and you'll be
            back in soon.
          </div>
        </div>
      </div>

      <div class="right-section">
        <h2>Forgot Password</h2>

        <q-form @submit.prevent="handleForgotPassword">
          <div class="input-group">
            <q-input
              v-model="email"
              type="email"
              label="Email"
              lazy-rules
              :rules="[
                (val) => !!val || 'Email is required',
                (val) => isValidEmail(val) || 'Please enter a valid email',
              ]"
              outlined
              class="q-mb-md"
            />
          </div>

          <q-btn
            type="submit"
            label="Send Email"
            color="primary"
            class="full-width q-mb-md"
            :loading="loading"
          >
            <template v-slot:loading>
              <q-spinner class="on-left" />
              Sending...
            </template>
          </q-btn>
        </q-form>

        <div class="message" :class="{ show: message }">
          {{ message }}
        </div>

        <div class="login-link">
          <p>Remembered your password?</p>
          <q-btn flat label="Back to Login" to="/login" class="q-pa-none" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()

const email = ref('')
const loading = ref(false)
const message = ref('')

function isValidEmail(val) {
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val)
}

function handleForgotPassword() {
  loading.value = true
  message.value = ''

  setTimeout(() => {
    console.log('Forgot password request for:', email.value)

    message.value = '✅ Password reset email sent! (Simulated)'
    loading.value = false

    setTimeout(() => {
      message.value = ''
    }, 5000)
  }, 1500)
}
</script>

<style lang="scss" scoped>
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
  width: 100px;
  height: 100px;
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
  color: var(--secondary);
}

.message {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: green;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.message.show {
  opacity: 1;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #777;
}

.login-link a {
  color: var(--primary);
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}

:root {
  --primary: #4a6fa5;
  --secondary: #166088;
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
