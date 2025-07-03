<template>
  <q-page class="q-pa-md">
    <h4 class="text-h4 q-mb-md">System Monitoring Dashboard</h4>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">System Overview</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-list dense>
              <q-item>
                <q-item-section>
                  <q-item-label>Total Zones</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption>11</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>Payment Methods</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-badge color="green" label="Cash, GCash" />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>Chat Enabled</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="check_circle" color="green" />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>Trade, Buy & Sell Active</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="check_circle" color="green" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-8">
        <q-card>
          <q-card-section>
            <div class="text-h6">Activity Monitoring</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-list bordered>
                  <q-item-label header>Most Active Zones</q-item-label>
                  <q-item v-for="zone in activeZones" :key="zone.name">
                    <q-item-section>
                      <q-item-label>{{ zone.name }}</q-item-label>
                      <q-item-label caption>{{ zone.activeUsers }} active users today</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>

              <div class="col-12 col-md-6">
                <q-list bordered>
                  <q-item-label header>Popular Categories</q-item-label>
                  <q-item v-for="cat in popularCategories" :key="cat.name">
                    <q-item-section>
                      <q-item-label>{{ cat.name }}</q-item-label>
                      <q-item-label caption>{{ cat.count }} transactions</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Zone Statistics</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-table :rows="zones" :columns="zoneColumns" row-key="name" flat bordered>
          <template v-slot:body-cell-users="props">
            <q-td :props="props">
              <q-badge color="blue" :label="props.row.users" />
            </q-td>
          </template>

          <template v-slot:body-cell-trades="props">
            <q-td :props="props">
              <q-linear-progress
                :value="props.row.trades / maxTrades"
                color="green"
                style="height: 20px"
              >
                <div class="absolute-full flex flex-center">
                  <q-badge color="white" text-color="green" :label="props.row.trades" />
                </div>
              </q-linear-progress>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Audit Log</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-table
          :rows="auditLogs"
          :columns="auditLogColumns"
          row-key="id"
          flat
          bordered
          :pagination="{ rowsPerPage: 10 }"
        >
          <template v-slot:body-cell-timestamp="props">
            <q-td :props="props">
              {{ formatDate(props.row.timestamp) }}
            </q-td>
          </template>

          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <q-badge :color="getActionColor(props.row.action)" :label="props.row.action" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-card>
      <q-card-section>
        <div class="text-h6">Data Sync Status</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row items-center q-gutter-sm">
          <q-icon
            name="cloud_done"
            size="lg"
            :color="syncStatus === 'synced' ? 'green' : 'orange'"
          />
          <div>
            <div class="text-subtitle1">Last Sync: {{ formatDate(lastSync) }}</div>
            <div class="text-caption">
              Status:
              <q-badge :color="syncStatus === 'synced' ? 'green' : 'orange'" :label="syncStatus" />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'AdminSettingsMonitoring',
  data() {
    return {
      activeZones: [
        { name: 'Zone 1', activeUsers: 0 },
        { name: 'Zone 2', activeUsers: 0 },
        { name: 'Zone 3', activeUsers: 0 },
      ],

      popularCategories: [
        { name: 'Electronics', count: 0 },
        { name: 'Fashion', count: 0 },
        { name: 'Home Goods', count: 0 },
      ],

      zones: [
        { name: 'Zone 1', users: 0, trades: 0 },
        { name: 'Zone 2', users: 0, trades: 0 },
        { name: 'Zone 3', users: 0, trades: 0 },
        { name: 'Zone 4', users: 0, trades: 0 },
        { name: 'Zone 5', users: 0, trades: 0 },
      ],
      zoneColumns: [
        { name: 'name', label: 'Zone', field: 'name', align: 'left' },
        { name: 'users', label: 'Total Users', field: 'users', align: 'center' },
        { name: 'trades', label: 'Trades (0 days)', field: 'trades', align: 'center' },
      ],

      auditLogs: [
        {
          id: 1,
          user: 'Admin',
          action: 'viewed',
          target: 'SellerPage.vue',
          timestamp: new Date(),
        },
      ],
      auditLogColumns: [
        { name: 'timestamp', label: 'Time', field: 'timestamp', align: 'left' },
        { name: 'user', label: 'User', field: 'user', align: 'left' },
        { name: 'action', label: 'Action', field: 'action', align: 'center' },
        { name: 'target', label: 'Target', field: 'target', align: 'left' },
      ],

      lastSync: new Date(Date.now() - 300000),
      syncStatus: 'online',
    }
  },
  computed: {
    maxTrades() {
      return Math.max(...this.zones.map((zone) => zone.trades), 1)
    },
  },
  methods: {
    formatDate(date) {
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },
    getActionColor(action) {
      const colors = {
        viewed: 'blue',
        resolved: 'green',
        exported: 'purple',
        backup: 'teal',
        reviewed: 'orange',
      }
      return colors[action] || 'grey'
    },
  },
}
</script>

<style scoped>
.q-card {
  border-radius: 8px;
}
</style>
