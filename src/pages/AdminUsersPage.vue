<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h4">User Management</div>
      </div>
      <div class="col-auto">
        <q-input v-model="searchQuery" outlined dense placeholder="Search users..." clearable>
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <q-table
      :rows="users"
      :columns="columns"
      row-key="id"
      :filter="searchQuery"
      :loading="loading"
      :pagination="pagination"
    >
      <template v-slot:body-cell-avatar="props">
        <q-td :props="props">
          <q-avatar size="36px">
            <img :src="props.row.avatar" />
          </q-avatar>
        </q-td>
      </template>

      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-badge :color="props.row.active ? 'positive' : 'negative'">
            {{ props.row.active ? 'Active' : 'Inactive' }}
          </q-badge>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat round dense icon="visibility" color="info" @click="viewUser(props.row)" />
          <q-btn flat round dense icon="edit" color="primary" @click="editUser(props.row)" />
          <q-btn
            flat
            round
            dense
            icon="delete"
            color="negative"
            @click="confirmDeleteUser(props.row)"
          />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script>
const columns = [
  {
    name: 'avatar',
    label: '',
    field: 'avatar',
    align: 'center',
  },
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'email',
    label: 'Email',
    field: 'email',
    align: 'left',
    sortable: true,
  },
  {
    name: 'location',
    label: 'Location',
    field: 'location',
    align: 'left',
    sortable: true,
  },
  {
    name: 'lastActive',
    label: 'Last Active',
    field: 'lastActive',
    align: 'left',
    sortable: true,
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'center',
  },
  {
    name: 'actions',
    label: 'Actions',
    field: '',
    align: 'center',
  },
]

export default {
  name: 'AdminUsersPage',
  data() {
    return {
      searchQuery: '',
      loading: false,
      users: [],
      columns,
      pagination: {
        rowsPerPage: 10,
      },
    }
  },
  created() {
    this.loadUsers()
  },
  methods: {
    loadUsers() {
      this.loading = true
      setTimeout(() => {
        this.users = [
          {
            id: 1,
            name: 'kitkai',
            email: 'kit@example.com',
            location: 'Bulihan, Silang',
            lastActive: '2 hours ago',
            active: true,
            avatar: 'https://150?img=1',
          },
        ]
        this.loading = false
      }, 500)
    },
    viewUser(user) {
      this.$q.dialog({
        title: `User Details: ${user.name}`,
        message: `
          <div><strong>Email:</strong> ${user.email}</div>
          <div><strong>Location:</strong> ${user.location}</div>
          <div><strong>Last Active:</strong> ${user.lastActive}</div>
          <div><strong>Status:</strong> ${user.active ? 'Active' : 'Inactive'}</div>
        `,
        html: true,
      })
    },
    editUser(user) {
      this.$q.notify(`Editing user: ${user.name}`)
    },
    confirmDeleteUser(user) {
      this.$q
        .dialog({
          title: 'Confirm Delete',
          message: `Are you sure you want to delete ${user.name}?`,
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.$q.notify({
            message: `User ${user.name} deleted`,
            color: 'positive',
          })
        })
    },
  },
}
</script>
