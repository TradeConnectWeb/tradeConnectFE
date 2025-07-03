<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Location Monitoring</div>

    <div class="row q-col-gutter-md">
      <div class="col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">Zones</div>
            <q-list separator>
              <q-item
                v-for="zone in zones"
                :key="zone.id"
                clickable
                v-ripple
                :active="selectedZone === zone.id"
                @click="selectZone(zone)"
              >
                <q-item-section>
                  <q-item-label>{{ zone.name }}</q-item-label>
                  <q-item-label caption>{{ zone.users }} active users</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-md-8">
        <q-card>
          <q-card-section>
            <div class="text-h6">Zone Monitoring: {{ selectedZoneName }}</div>
            <div
              class="map-placeholder q-mt-md"
              style="
                height: 500px;
                background: #f5f5f5;
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <div class="text-grey-6">
                Map visualization for {{ selectedZoneName }} would be here
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'AdminLocationsPage',
  data() {
    return {
      zones: [
        { id: 1, name: 'Zone 1', users: 0 },
        { id: 2, name: 'Zone 2', users: 0 },
        { id: 3, name: 'Zone 3', users: 0 },
        { id: 4, name: 'Zone 4', users: 0 },
        { id: 5, name: 'Zone 5', users: 0 },
        { id: 6, name: 'Zone 6', users: 0 },
        { id: 7, name: 'Zone 7', users: 0 },
        { id: 8, name: 'Zone 8', users: 0 },
        { id: 9, name: 'Zone 9', users: 0 },
        { id: 10, name: 'Zone 10', users: 0 },
        { id: 11, name: 'Zone 11', users: 0 },
      ],
      selectedZone: 1,
    }
  },
  computed: {
    selectedZoneName() {
      const zone = this.zones.find((z) => z.id === this.selectedZone)
      return zone ? zone.name : 'No zone selected'
    },
  },
  methods: {
    selectZone(zone) {
      this.selectedZone = zone.id
    },
  },
}
</script>
