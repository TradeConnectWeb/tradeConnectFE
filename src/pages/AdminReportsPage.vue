<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Reports Management</div>

    <div class="row q-mb-md">
      <div class="col">
        <q-select
          v-model="typeFilter"
          outlined
          dense
          options-dense
          :options="typeOptions"
          label="Type"
          style="min-width: 150px"
        />
      </div>
      <div class="col">
        <q-select
          v-model="statusFilter"
          outlined
          dense
          options-dense
          :options="statusOptions"
          label="Status"
          style="min-width: 150px"
        />
      </div>
      <div class="col">
        <q-input v-model="fromDate" outlined dense label="From Date" type="date" />
      </div>
      <div class="col">
        <q-input v-model="toDate" outlined dense label="To Date" type="date" />
      </div>
      <div class="col-auto">
        <q-btn color="primary" label="Apply" @click="applyFilters" />
      </div>
      <div class="col-auto">
        <q-btn color="grey" label="Clear" @click="clearFilters" />
      </div>
      <div class="col-auto">
        <q-btn color="positive" label="Export" @click="exportReports" />
      </div>
    </div>

    <q-table
      :rows="filteredReports"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :pagination="pagination"
    >
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-badge :color="getStatusColor(props.row.status)">
            {{ props.row.status }}
          </q-badge>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat round dense icon="visibility" color="info" @click="viewReport(props.row)" />
          <q-btn
            flat
            round
            dense
            icon="check"
            color="positive"
            @click="resolveReport(props.row)"
            v-if="props.row.status === 'Pending'"
          />
          <q-btn
            flat
            round
            dense
            icon="close"
            color="negative"
            @click="rejectReport(props.row)"
            v-if="props.row.status === 'Pending'"
          />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script>
const columns = [
  {
    name: 'id',
    label: 'ID',
    field: 'id',
    align: 'left',
    sortable: true,
  },
  {
    name: 'type',
    label: 'Type',
    field: 'type',
    align: 'left',
    sortable: true,
  },
  {
    name: 'reason',
    label: 'Reason',
    field: 'reason',
    align: 'left',
    sortable: true,
  },
  {
    name: 'reporter',
    label: 'Reporter',
    field: 'reporter',
    align: 'left',
    sortable: true,
  },
  {
    name: 'reportedUser',
    label: 'Reported User',
    field: 'reportedUser',
    align: 'left',
    sortable: true,
  },
  {
    name: 'date',
    label: 'Date',
    field: 'date',
    align: 'left',
    sortable: true,
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'center',
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Actions',
    field: '',
    align: 'center',
  },
]

export default {
  name: 'AdminReportsPage',
  data() {
    return {
      reports: [],
      filteredReports: [],
      loading: false,
      columns,
      pagination: {
        rowsPerPage: 10,
      },
      typeFilter: 'all',
      statusFilter: 'all',
      fromDate: '',
      toDate: '',
      typeOptions: [
        { label: 'All Types', value: 'all' },
        { label: 'Scam', value: 'scam' },
        { label: 'Harassment', value: 'harassment' },
        { label: 'Fake Item', value: 'fake-item' },
        { label: 'Other', value: 'other' },
      ],
      statusOptions: [
        { label: 'All Statuses', value: 'all' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Resolved', value: 'Resolved' },
        { label: 'Rejected', value: 'Rejected' },
      ],
    }
  },
  created() {
    this.loadReports()
  },
  methods: {
    loadReports() {
      this.loading = true
      setTimeout(() => {
        this.reports = [
          {
            id: '1',
            type: 'Scam',
            reason: 'Fake product',
            reporter: 'User',
            reportedUser: 'User',
            date: '2023-05-15',
            status: 'Pending',
          },
          {
            id: '2',
            type: 'Harassment',
            reason: 'Inappropriate messages',
            reporter: 'Users',
            reportedUser: 'Users',
            date: '2023-05-14',
            status: 'Resolved',
          },
          {
            id: '3',
            type: 'Fake Item',
            reason: 'Item not as described',
            reporter: 'User',
            reportedUser: 'User',
            date: '2023-05-13',
            status: 'Rejected',
          },
          {
            id: '4',
            type: 'Other',
            reason: 'Suspicious behavior',
            reporter: 'Users',
            reportedUser: 'Users',
            date: '2023-05-12',
            status: 'Pending',
          },
        ]
        this.filteredReports = [...this.reports]
        this.loading = false
      }, 500)
    },
    applyFilters() {
      this.filteredReports = this.reports.filter((report) => {
        const typeMatch = this.typeFilter === 'all' || report.type.toLowerCase() === this.typeFilter
        const statusMatch = this.statusFilter === 'all' || report.status === this.statusFilter
        const dateMatch = true

        return typeMatch && statusMatch && dateMatch
      })
    },
    clearFilters() {
      this.typeFilter = 'all'
      this.statusFilter = 'all'
      this.fromDate = ''
      this.toDate = ''
      this.filteredReports = [...this.reports]
    },
    exportReports() {
      this.$q.notify({
        message: 'Reports exported successfully',
        color: 'positive',
      })
    },
    getStatusColor(status) {
      switch (status) {
        case 'Pending':
          return 'orange'
        case 'Resolved':
          return 'green'
        case 'Rejected':
          return 'red'
        default:
          return 'grey'
      }
    },
    viewReport(report) {
      this.$q.dialog({
        title: `Report Details: ${report.id}`,
        message: `
          <div><strong>Type:</strong> ${report.type}</div>
          <div><strong>Reason:</strong> ${report.reason}</div>
          <div><strong>Reporter:</strong> ${report.reporter}</div>
          <div><strong>Reported User:</strong> ${report.reportedUser}</div>
          <div><strong>Date:</strong> ${report.date}</div>
          <div><strong>Status:</strong> ${report.status}</div>
        `,
        html: true,
      })
    },
    resolveReport(report) {
      this.$q
        .dialog({
          title: 'Confirm Resolution',
          message: `Are you sure you want to mark report ${report.id} as resolved?`,
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          report.status = 'Resolved'
          this.$q.notify({
            message: `Report ${report.id} resolved`,
            color: 'positive',
          })
        })
    },
    rejectReport(report) {
      this.$q
        .dialog({
          title: 'Confirm Rejection',
          message: `Are you sure you want to reject report ${report.id}?`,
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          report.status = 'Rejected'
          this.$q.notify({
            message: `Report ${report.id} rejected`,
            color: 'positive',
          })
        })
    },
  },
}
</script>
