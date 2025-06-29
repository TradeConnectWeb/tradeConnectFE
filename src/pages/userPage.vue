<template>
  <q-page class="flex flex-center">
    <q-card class="userContainer"> </q-card>
    <q-card-section> </q-card-section>
    <q-input> </q-input>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const userData = ref({
  username: '',
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  address: '',
  zone: '',
})
</script>

<style lang="sass" scoped>
//
</style>
