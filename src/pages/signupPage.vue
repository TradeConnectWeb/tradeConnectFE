<template>
  <q-page class="q-pa-md flex flex-center bg-grey-2">
    <q-card class="q-pa-lg" style="width: 100%; max-width: 600px">
      <q-card-section>
        <div class="text-h5 text-center">Create an Account</div>
      </q-card-section>

      <q-form @submit.prevent="handleRegister">
        <div class="row q-col-gutter-md">
          <div class="col-6">
            <q-input v-model="firstName" label="First Name" outlined dense required />
          </div>
          <div class="col-6">
            <q-input v-model="lastName" label="Last Name" outlined dense required />
          </div>
          <div class="col-12">
            <q-input v-model="middleName" label="Middle Name" outlined dense />
          </div>
          <div class="col-12">
            <q-input v-model="username" label="Username" outlined dense required />
          </div>
          <div class="col-12">
            <q-input v-model="email" label="Email" type="email" outlined dense />
          </div>
          <div class="col-6">
            <q-input v-model="address" label="Address" outlined dense />
          </div>
          <div class="col-6">
            <q-input v-model="zone" label="Zone" outlined dense />
          </div>
          <div class="col-12">
            <q-input
              v-model="password"
              :type="isPwd ? 'password' : 'text'"
              label="Password"
              outlined
              dense
              :rules="[
                (val) => !!val || 'Password is required',
                (val) => val.length >= 6 || 'Min 6 characters',
              ]"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  @click="isPwd = !isPwd"
                  class="cursor-pointer"
                />
              </template>
            </q-input>
          </div>

          <div class="col-12">
            <q-file
              v-model="file"
              label="Upload File"
              outlined
              dense
              accept=".jpg, .png, .jpeg, .pdf"
            />
          </div>
        </div>

        <q-btn
          type="submit"
          label="Register"
          color="primary"
          class="full-width q-mt-md"
          :loading="loading"
        >
          <template v-slot:loading>
            <q-spinner class="on-left" />
            Registering...
          </template>
        </q-btn>
      </q-form>

      <div class="q-mt-md text-center">
        Already have an account?
        <q-btn flat label="Login" @click="router.push('/login')" class="q-pa-none" />
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import axios from 'axios'
import { uploadToCloud } from '../components/cloudinaryUtility.js'

const router = useRouter()
const $q = useQuasar()

const username = ref('')
const password = ref('')
const firstName = ref('')
const lastName = ref('')
const middleName = ref('')
const email = ref('')
const address = ref('')
const zone = ref('')
const file = ref('')

const isPwd = ref(true)
const loading = ref(false)

const handleRegister = async () => {
  loading.value = true
  let fileUrl = ''

  try {
    if (file.value) {
      fileUrl = await uploadToCloud(file.value)
    }

    const payload = {
      username: username.value,
      password: password.value,
      firstName: firstName.value,
      lastName: lastName.value,
      middleName: middleName.value,
      email: email.value,
      address: address.value,
      zone: zone.value,
      file: fileUrl,
    }

    const res = await axios.post(`${process.env.api_host}/users/create`, payload)

    $q.notify({ message: res.data.message || 'Registered successfully', color: 'positive' })
    router.push('../blank/login')
  } catch (err) {
    const msg = err.response?.data?.message || 'Registration failed'
    $q.notify({ message: msg, color: 'negative' })
  } finally {
    loading.value = false
  }
}
</script>
