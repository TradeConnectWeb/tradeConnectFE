<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">User Verification Panel</div>
      </q-card-section>

      <q-card-section>
        <q-table title="Users" :rows="users" :columns="columns" row-key="_id" flat bordered dense>
          <template v-slot:body-cell-id="props">
            <q-td align="center">
              <q-btn
                size="sm"
                label="View ID"
                color="primary"
                @click="showID(props.row.file)"
                :disable="!props.row.file"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td align="center">
              <q-btn
                size="sm"
                :label="props.row.isVerified ? 'Unverify' : 'Verify'"
                :color="props.row.isVerified ? 'negative' : 'positive'"
                @click="toggleVerification(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="idDialog">
      <q-card style="min-width: 350px">
        <q-card-section class="q-pa-none">
          <q-img :src="selectedID" spinner-color="primary" style="max-height: 500px" />
        </q-card-section>
        <q-card-actions align="center">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Notify } from 'quasar'

const users = ref([])
const idDialog = ref(false)
const selectedID = ref('')

const showID = (fileUrl) => {
  selectedID.value = fileUrl
  idDialog.value = true
}

const columns = [
  { name: 'username', label: 'Username', field: 'username', align: 'left' },
  { name: 'firstName', label: 'First Name', field: 'firstName', align: 'left' },
  { name: 'lastName', label: 'Last Name', field: 'lastName', align: 'left' },
  { name: 'middleName', label: 'Middle Name', field: 'middleName', align: 'left' },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'address', label: 'Address', field: 'address', align: 'left' },
  {
    name: 'isVerified',
    label: 'Verified',
    field: (row) => (row.isVerified ? 'Yes' : 'No'),
    align: 'center',
  },
  { name: 'id', label: 'ID', field: 'file', align: 'center' }, // View ID column
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' },
]

const fetchUsers = async () => {
  try {
    const res = await axios.get(`${process.env.api_host}/users`)
    users.value = res.data.filter((u) => !u.isAdmin)
  } catch (err) {
    console.error(err)
    Notify.create({ message: 'Failed to fetch users', color: 'negative' })
  }
}

const toggleVerification = async (user) => {
  try {
    const updatedUser = { isVerified: !user.isVerified }

    const res = await axios.post(`${process.env.api_host}/users/verify/${user._id}`, updatedUser)

    Notify.create({
      message: `${res.data.username} has been ${res.data.isVerified ? 'verified' : 'unverified'}`,
      color: 'positive',
    })

    fetchUsers() // Refresh list
  } catch (err) {
    console.error(err)
    Notify.create({ message: 'Failed to update verification', color: 'negative' })
  }
}

onMounted(() => {
  fetchUsers()
})
</script>
