<template>
  <q-page class="q-pa-md help-center-page">
    <q-card flat>
      <q-card-section>
        <div class="text-h5 text-weight-bold">Help Center</div>
        <div class="text-subtitle2 text-grey">Find answers and guides</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-expansion-item
          v-for="(topic, index) in helpTopics"
          :key="index"
          :label="topic.title"
          :caption="topic.subtitle"
          expand-separator
          dense
        >
          <div v-html="topic.content" class="q-pt-sm" />
        </q-expansion-item>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const helpTopics = ref([
  {
    title: 'How to Buy Items?',
    subtitle: 'Step-by-step guide for buyers',
    content: `
      <p>1. Browse listings on the home page.</p>
      <p>2. Click "Buy Now" or "Add to Cart".</p>
      <p>3. Confirm your GCash or Cash-on-Meetup option during checkout.</p>
    `,
  },
  {
    title: 'How to Sell or Post an Item?',
    subtitle: 'Guide for sellers or traders',
    content: `
      <p>1. Tap the "+" button on the bottom-right corner.</p>
      <p>2. Fill in details, upload at least 3 images.</p>
      <p>3. Choose to sell (with price) or trade (without price).</p>
    `,
  },
  {
    title: 'What is a Trade Listing?',
    subtitle: 'Learn how item trading works',
    content: `
      <p>Trade listings are items you can exchange with others instead of paying cash.</p>
      <p>Use "Request Trade" to offer your item in return.</p>
    `,
  },
  {
    title: 'Payment Options',
    subtitle: 'Supported methods in this system',
    content: `
      <p>1. Cash on Meet-up only within Zones 1-11 in Brgy. Bulihan, Silang Cavite.</p>
      <p>2. GCash direct payment (no COD, no shipping).</p>
    `,
  },
  {
    title: 'Report or Contact Support',
    subtitle: 'Reach us for concerns or abuse',
    content: `
      <p>Email us at <b>supportTradeConnect at Baranggay Bulihan, Silang Cavite</b> or send a message via the chat system to the admin account.</p>
    `,
  },
])
</script>

<style scoped>
.help-center-page {
  font-family: 'Open Sans', sans-serif;
}
</style>
