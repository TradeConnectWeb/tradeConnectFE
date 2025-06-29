<template>
  <q-page class="flex flex-center">
    <q-form @submit.prevent="signup">
      <q-card class="signupContainer q-ma-xl">
        <q-card-section>
          <div class="text-h6 text-center">SignUp User</div>
        </q-card-section>
        <q-card-section>
          <q-input filled v-model="username" label="Username" required />
        </q-card-section>
        <q-card-section>
          <q-select filled v-model="zone" :options="zoneOptions" label="zone" emit-value />
        </q-card-section>
        <q-card-section>
          <q-input filled v-model="email" label="Email" required />
        </q-card-section>

        <q-card-section>
          <q-input filled v-model="barangayId" label="Barangay ID" required />
        </q-card-section>
        <q-card-section>
          <q-input filled v-model="password" label="Password" required />
        </q-card-section>

        <q-card-section class="text-right">
          <q-btn label="Sign Up" type="submit" />
        </q-card-section>
      </q-card>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { Notify } from 'quasar'

const username = ref('')
const email = ref('')
const zone = ref('')
const barangayId = ref('')
const password = ref('')

const zoneOptions = [
  { label: 'Zone 1', value: 'zone1' },
  { label: 'Zone 2', value: 'zone2' },
  { label: 'Zone 3', value: 'zone3' },
  { label: 'Zone 4', value: 'zone4' },
  { label: 'Zone 5', value: 'zone5' },
  { label: 'Zone 6', value: 'zone6' },
  { label: 'Zone 7', value: 'zone7' },
  { label: 'Zone 8', value: 'zone8' },
  { label: 'Zone 9', value: 'zone9' },
  { label: 'Zone 10', value: 'zone10' },
  { label: 'Zone 11', value: 'zone11' },
]

const loadingSignUp = ref(false)

async function signup() {
  loadingSignUp.value = true
  try {
    const signupAPI = true
    console.log({
      username: username.value,
      zone: zone.value,
      email: email.value,
      barangayId: barangayId.value,
      password: password.value,
    })

    if (signupAPI) {
      Notify.create({
        message: 'Account created successfully',
        type: 'positive',
      })
    } else {
      Notify.create({
        message: 'Error creating account',
        type: 'negative',
      })
    }
  } catch (error) {
    console.error(error)
  } finally {
    loadingSignUp.value = false
    //
  }
}
</script>

<style lang="sass" scoped>
.signupContainer
  width: 400px
//
</style>
