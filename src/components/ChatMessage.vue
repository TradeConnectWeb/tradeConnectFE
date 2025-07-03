<template>
  <div :class="['message', { sent: isSent, received: !isSent }]">
    <q-avatar v-if="!isSent" size="32px" class="message-avatar">
      <img :src="avatar" />
    </q-avatar>

    <div class="message-content">
      <div class="message-text">{{ message.text }}</div>
      <div v-if="message.images && message.images.length" class="message-images">
        <q-img
          v-for="(img, index) in message.images"
          :key="index"
          :src="img"
          class="message-image"
          @click="openImage(img)"
        />
      </div>
      <div class="message-time">{{ formattedTime }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { date } from 'quasar'

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
  isSent: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: String,
    default: 'https://placehold.co/40',
  },
})

const formattedTime = computed(() => {
  return date.formatDate(props.message.timestamp, 'h:mm A')
})

const emit = defineEmits(['image-click'])

const openImage = (img) => {
  emit('image-click', img)
}
</script>

<style scoped>
.message {
  display: flex;
  margin-bottom: 16px;
  max-width: 80%;
}

.sent {
  margin-left: auto;
  flex-direction: row-reverse;
}

.received {
  margin-right: auto;
}

.message-avatar {
  align-self: flex-end;
  margin: 0 8px;
}

.message-content {
  display: flex;
  flex-direction: column;
}

.message-text {
  padding: 10px 15px;
  border-radius: 18px;
  line-height: 1.4;
  word-break: break-word;
}

.sent .message-text {
  background-color: var(--primary);
  color: white;
  border-bottom-right-radius: 4px;
}

.received .message-text {
  background-color: var(--light-gray);
  color: var(--dark);
  border-bottom-left-radius: 4px;
}

.message-images {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 5px;
}

.message-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  cursor: pointer;
  object-fit: cover;
}

.message-time {
  font-size: 11px;
  color: var(--gray);
  margin-top: 4px;
  text-align: right;
}
</style>
