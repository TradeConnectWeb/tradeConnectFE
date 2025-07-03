<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Dashboard Overview</div>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-md-3 col-sm-6 col-xs-12">
        <q-card>
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">Active Users</div>
                <div class="text-h5 q-mt-sm">0</div>
                <div class="text-caption text-grey"></div>
              </div>
              <div class="col-auto">
                <q-icon name="people" color="primary" size="48px" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-md-3 col-sm-6 col-xs-12">
        <q-card>
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">Total Users</div>
                <div class="text-h5 q-mt-sm"></div>
                <div class="text-caption text-grey"></div>
              </div>
              <div class="col-auto">
                <q-icon name="group_add" color="positive" size="48px" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-md-3 col-sm-6 col-xs-12">
        <q-card>
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">Best Selling</div>
                <div class="text-h5 q-mt-sm"></div>
                <div class="text-caption text-grey"></div>
              </div>
              <div class="col-auto">
                <q-icon name="shopping_bag" color="warning" size="48px" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-md-3 col-sm-6 col-xs-12">
        <q-card>
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">Best Trade</div>
                <div class="text-h5 q-mt-sm"></div>
                <div class="text-caption text-grey"></div>
              </div>
              <div class="col-auto">
                <q-icon name="swap_horiz" color="info" size="48px" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">User Activity Map</div>
        <div
          class="map-placeholder q-mt-md"
          style="
            height: 400px;
            background: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;
          "
        >
          <div class="text-grey-6">Map visualization would be here</div>
        </div>
      </q-card-section>
    </q-card>

    <div class="row q-col-gutter-md">
      <div class="col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Recent Activity</div>
            <q-list separator>
              <q-item v-for="n in 5" :key="n">
                <q-item-section avatar>
                  <q-avatar>
                    <img :src="`user${n}.png`" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>User {{ n }} completed a trade</q-item-label>
                  <q-item-label caption>2 hours ago</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Statistics</div>
            <div
              class="chart-placeholder q-mt-md"
              style="
                height: 300px;
                background: #f5f5f5;
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <div class="text-grey-6">Chart visualization would be here</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'AdminHomePage',
}
</script>
