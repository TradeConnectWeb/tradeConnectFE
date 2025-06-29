<template>
  <q-page class="flex flex-center">
    <q-form @submit.prevent="login">
      <q-card class="loginContainer">
        <q-card-section>
          <div class="text-h6 text-center">
            Welcome {{ userData.firstName }} {{ userData.lastName }}
          </div>
        </q-card-section>
        <q-card-section>
          <q-input filled v-model="username" label="username" required />
        </q-card-section>
        <q-card-section>
          <q-input label="password" v-model="password" filled :type="isPwd ? 'password' : 'text'">
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
        </q-card-section>
        <q-card-section class="text-right">
          <q-btn type="submit" label="login" :loading="loadingLogin" />
        </q-card-section>

        <q-card-section>
          <div clicable style="cursor: pointer" @click="$router.push('/signup')">sign up</div>
        </q-card-section>
      </q-card>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'

const username = ref('')
const password = ref('')
const loadingLogin = ref(false)
const isPwd = ref(true)

const userData = ref({
  username: 'username',
  password: 'password',
  firstName: 'kai',
  lastName: 'lin',
})

const router = useRouter()

async function login() {
  loadingLogin.value = true
  try {
    const loginAPI = true // simulate login API
    console.log({
      username: username.value,
      password: password.value,
    })

    if (loginAPI) {
      Notify.create({
        message: 'login successfully',
        type: 'positive',
      })
      router.push('/') // redirect to page after login
    } else {
      Notify.create({
        message: 'login failed',
        type: 'negative',
      })
    }
  } catch (error) {
    console.error(error)
  } finally {
    loadingLogin.value = false
  }
}
</script>

<style lang="sass" scoped>
.loginContainer
  width: 500px


@media (max-width: 500px), (max-height: 500px)
  .loginContainer
    width: 300px
</style>
