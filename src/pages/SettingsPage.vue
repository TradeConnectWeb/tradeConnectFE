<template>
  <q-page class="q-pa-md settings-page">
    <q-card>
      <q-card-section>
        <div class="text-h6">Account Settings</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit="saveSettings" class="q-gutter-md">
          <q-input v-model="settings.phone" label="Phone Number" filled />
          <q-input v-model="settings.email" label="Email" type="email" filled />

          <q-select
            v-model="settings.zone"
            label="Your Zone"
            :options="zones"
            filled
            emit-value
            map-options
          />

          <q-select
            v-model="settings.payment"
            label="Preferred Payment"
            :options="paymentMethods"
            filled
            emit-value
            map-options
          />

          <q-toggle
            v-model="settings.notifications"
            label="Enable Notifications"
            left-label
            color="primary"
          />

          <q-btn
            label="Save Settings"
            type="submit"
            color="primary"
            icon="save"
            class="full-width"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const zones = [
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

const paymentMethods = [
  { label: 'Cash on Meet-up', value: 'cash' },
  { label: 'GCash', value: 'gcash' },
]

const settings = ref({
  phone: '',
  email: '',
  zone: '',
  payment: '',
  notifications: true,
})

function saveSettings() {
  $q.notify({
    type: 'positive',
    message: 'Settings saved successfully!',
  })
}
</script>

<style scoped>
.settings-page {
  font-family: 'Open Sans', sans-serif;
}
</style>
