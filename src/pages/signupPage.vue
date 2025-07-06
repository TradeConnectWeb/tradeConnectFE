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
          <q-input
            v-model="username"
            label="Number"
            outlined
            type="number"
            class="q-mb-md"
            :rules="[
              (val) => !!val || 'Username is required',
              (val) => val.length >= 3 || 'Minimum 3 characters',
            ]"
          />

          <q-input
            v-model="firstName"
            label="First Name"
            outlined
            class="q-mb-md"
            :rules="[(val) => !!val || 'First name is required']"
          />

          <q-input v-model="middleName" label="Middle Name" outlined class="q-mb-md" />

          <q-input
            v-model="lastname"
            label="Last Name"
            outlined
            class="q-mb-md"
            :rules="[(val) => !!val || 'Last name is required']"
          />

          <q-input
            v-model="email"
            label="Email"
            type="email"
            outlined
            class="q-mb-md"
            :rules="[(val) => !!val || 'Email is required', () => isValidEmail || 'Invalid email']"
          />

          <q-input
            v-model="address"
            label="Address"
            outlined
            class="q-mb-md"
            :rules="[(val) => !!val || 'Address is required']"
          />

          <q-select
            v-model="zone"
            :options="zoneOptions"
            label="Zone"
            outlined
            class="q-mb-md"
            :rules="[(val) => !!val || 'Zone is required']"
          />

          <q-input
            v-model="password"
            :type="isPwd ? 'password' : 'text'"
            label="Password"
            outlined
            class="q-mb-md"
            :rules="[
              (val) => !!val || 'Password is required',
              (val) => val.length >= 6 || 'Minimum 6 characters',
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <!-- <q-checkbox
            v-model="isAdmin"
            label="Register as Admin (requires admin code)"
            class="q-mb-md"
          /> -->

          <q-input
            v-if="isAdmin"
            v-model="adminCode"
            type="password"
            label="Admin Code"
            outlined
            class="q-mb-md"
            :rules="[
              (val) => !!val || 'Admin code is required',
              (val) => val === 'admintrade123' || 'Invalid code',
            ]"
          />

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
          Already have an account? <q-btn flat label="Login" to="/blank/login" class="q-pa-none" />
        </div>
      </div>
    </div>

    <q-dialog v-model="showTerms">
      <q-card>
        <q-card-section>
          <div class="text-h6">Terms and Conditions</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <p>By signing up, you agree to:</p>
          <ul>
            <li>Be a resident of Barangay Bulihan.</li>
            <li>Use the app for legitimate trade only.</li>
            <li>No fraud or misuse.</li>
            <li>Your zone/location may be verified.</li>
          </ul>
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
import axios from 'axios'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()

const username = ref('')
const password = ref('')
const firstName = ref('')
const middleName = ref('')
const lastname = ref('')
const email = ref('')
const address = ref('')
const zone = ref('')
const isAdmin = ref(false)
const adminCode = ref('')
const isPwd = ref(true)
const showTerms = ref(false)
const loading = ref(false)

const zoneOptions = Array.from({ length: 11 }, (_, i) => ({
  label: `Zone ${i + 1}`,
  value: `Zone ${i + 1}`,
}))

const isValidEmail = computed(() => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email.value))

const handleSignup = async () => {
  loading.value = true
  try {
    const payload = {
      username: username.value,
      password: password.value,
      firstName: firstName.value,
      middleName: middleName.value,
      lastName: lastname.value,
      email: email.value,
      address: address.value,
      zone: zone.value,
      isAdmin: isAdmin.value,
    }

    await axios.post(`${process.env.api_host}/users/create`, payload)

    $q.notify({
      message: 'Account created successfully!',
      color: 'positive',
    })

    router.push(isAdmin.value ? '/adminpage' : '/login')
  } catch (err) {
    $q.notify({
      message: err.response?.data?.message || 'Failed to register user.',
      color: 'negative',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* same style block from previous version (can be reused) */
</style>
