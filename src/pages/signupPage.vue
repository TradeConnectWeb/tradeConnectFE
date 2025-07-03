<template>
  <q-page class="flex flex-center bg-grey-2">
    <div class="container">
      <div class="left-section">
        <div class="logo-container">
          <div class="logo">
            <img src="logo.png" alt="TradeConnect Logo" />
          </div>
          <div class="app-title">TradeConnect</div>
          <div class="description">Trade, Buy & Sell Within Barangay Bulihan, Silang Cavite</div>
        </div>
      </div>

      <div class="right-section">
        <h2>Sign Up</h2>

        <q-form @submit.prevent="handleSignup">
          <div class="input-group">
            <q-input
              v-model="username"
              label="Username"
              lazy-rules
              :rules="[
                (val) => !!val || 'Username is required',
                (val) => val.length >= 3 || 'Username must be at least 3 characters',
              ]"
              outlined
              class="q-mb-md"
            />
          </div>

          <div class="input-group">
            <q-input
              v-model="lastname"
              label="Last Name"
              lazy-rules
              :rules="[(val) => !!val || 'Last name is required']"
              outlined
              class="q-mb-md"
            />
          </div>

          <div class="input-group">
            <q-select
              v-model="zone"
              :options="zoneOptions"
              label="Zone"
              emit-value
              map-options
              outlined
              class="q-mb-md"
            />
          </div>

          <div class="input-group">
            <q-input
              v-model="email"
              type="email"
              label="Email"
              lazy-rules
              :rules="[
                (val) => !!val || 'Email is required',
                isValidEmail || 'Please enter a valid email',
              ]"
              outlined
              class="q-mb-md"
            />
          </div>

          <div class="input-group">
            <q-file
              v-model="barangayIdImage"
              label="Upload Barangay ID as proof of residence"
              accept=".jpg,.jpeg,.png,.pdf"
              outlined
              class="q-mb-md"
              :rules="[(val) => !!val || 'Barangay ID is required']"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </div>

          <div class="input-group">
            <q-input
              v-model="password"
              :type="isPwd ? 'password' : 'text'"
              label="Password"
              lazy-rules
              :rules="[
                (val) => !!val || 'Password is required',
                (val) => val.length >= 6 || 'Password must be at least 6 characters',
              ]"
              outlined
              class="q-mb-md"
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
          </div>

          <div class="input-group">
            <q-checkbox
              v-model="isAdmin"
              label="Register as Admin (requires admin code)"
              class="q-mb-md"
            />
          </div>

          <div class="input-group" v-if="isAdmin">
            <q-input
              v-model="adminCode"
              type="password"
              label="Admin Code"
              outlined
              class="q-mb-md"
              :rules="[
                (val) => !!val || 'Admin code is required',
                (val) => val === 'admintrade123' || 'Invalid admin code',
              ]"
            />
          </div>

          <div class="terms-privacy q-mb-md">
            By signing up, you agree to our
            <a @click="showTerms = true" class="text-primary cursor-pointer">Terms and Privacy</a>
          </div>

          <q-btn
            type="submit"
            label="Sign Up"
            color="primary"
            class="full-width q-mb-md"
            :loading="loading"
          >
            <template v-slot:loading>
              <q-spinner class="on-left" />
              Creating account...
            </template>
          </q-btn>
        </q-form>

        <div class="login-link">
          Already have an account? <q-btn flat label="Login" to="/login" class="q-pa-none" />
        </div>
      </div>
    </div>

    <q-dialog v-model="showTerms">
      <q-card>
        <q-card-section>
          <div class="text-h6">Terms and Conditions</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
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

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()

const username = ref('')
const lastname = ref('')
const email = ref('')
const zone = ref('')
const barangayIdImage = ref(null)
const password = ref('')
const isPwd = ref(true)
const loading = ref(false)
const showTerms = ref(false)
const isAdmin = ref(false)
const adminCode = ref('')

const zoneOptions = [
  { label: 'Zone 1', value: 'Zone 1' },
  { label: 'Zone 2', value: 'Zone 2' },
  { label: 'Zone 3', value: 'Zone 3' },
  { label: 'Zone 4', value: 'Zone 4' },
  { label: 'Zone 5', value: 'Zone 5' },
  { label: 'Zone 6', value: 'Zone 6' },
  { label: 'Zone 7', value: 'Zone 7' },
  { label: 'Zone 8', value: 'Zone 8' },
  { label: 'Zone 9', value: 'Zone 9' },
  { label: 'Zone 10', value: 'Zone 10' },
  { label: 'Zone 11', value: 'Zone 11' },
]

const isValidEmail = computed(() => {
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email.value)
})

function handleSignup() {
  loading.value = true

  setTimeout(() => {
    console.log('Signup data:', {
      username: username.value,
      lastname: lastname.value,
      email: email.value,
      zone: zone.value,
      barangayIdImage: barangayIdImage.value,
      password: password.value,
      isAdmin: isAdmin.value,
      adminCode: adminCode.value,
    })

    $q.notify({
      message: 'Account created successfully! (Simulated)',
      color: 'positive',
    })

    loading.value = false

    if (isAdmin.value && adminCode.value === 'admintrade123') {
      router.push('/adminpage')
    } else {
      router.push('/login')
    }
  }, 1500)
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  width: 100%;
  max-width: 900px;
  margin: 40px auto;
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

.terms-privacy {
  text-align: center;
  font-size: 14px;
  color: #777;
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
