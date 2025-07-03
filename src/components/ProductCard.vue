<template>
  <q-card class="product-card">
    <q-img :src="product.image" :ratio="1" class="product-image">
      <div class="absolute-bottom-right">
        <q-badge color="accent" class="price-badge"> ₱{{ product.price }} </q-badge>
      </div>
    </q-img>

    <q-card-section>
      <div class="text-h6">{{ product.title }}</div>
      <div class="text-caption text-grey">{{ product.category }}</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="text-caption">{{ product.description }}</div>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat round color="primary" icon="chat" @click="openChat" />
      <q-btn color="primary" label="Trade" @click="initiateTrade" />
      <q-btn v-if="product.price > 0" color="secondary" label="Buy" @click="initiatePurchase" />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['chat', 'trade', 'buy'])

const openChat = () => {
  emit('chat', props.product)
}

const initiateTrade = () => {
  emit('trade', props.product)
}

const initiatePurchase = () => {
  emit('buy', props.product)
}
</script>

<style scoped>
.product-card {
  width: 100%;
  max-width: 300px;
  margin: 10px;
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.product-image {
  border-radius: 8px 8px 0 0;
}

.price-badge {
  font-size: 1rem;
  padding: 8px;
  border-radius: 4px;
}
</style>
