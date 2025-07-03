<template>
  <q-page class="messages-page q-pa-md">
    <div v-if="!selectedProductId" class="conversations-list">
      <h2 class="text-h5 text-weight-bold q-mb-md">Your Conversations</h2>

      <q-list bordered separator>
        <q-item
          v-for="conversation in conversations"
          :key="conversation.id"
          clickable
          @click="openConversation(conversation.productId)"
          class="q-my-sm"
        >
          <q-item-section avatar>
            <q-avatar>
              <img :src="getProductImage(conversation.productId)" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-weight-bold">
              {{ getProductTitle(conversation.productId) }}
            </q-item-label>
            <q-item-label caption>
              {{ getLastMessage(conversation.messages) }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-badge v-if="hasUnreadMessages(conversation)" color="primary" rounded />
            <div class="text-caption text-grey-6">
              {{ formatTime(conversation.messages[conversation.messages.length - 1].time) }}
            </div>
          </q-item-section>
        </q-item>
      </q-list>

      <div v-if="conversations.length === 0" class="text-center q-pa-lg text-grey-6">
        <q-icon name="forum" size="lg" class="q-mb-sm" />
        <div>No conversations yet</div>
        <div class="text-caption">Start a chat from a product page</div>
      </div>
    </div>

    <div v-else class="chat-container">
      <div class="chat-header q-mb-md">
        <q-btn
          flat
          round
          dense
          icon="arrow_back"
          class="q-mr-sm"
          @click="selectedProductId = null"
        />

        <div class="row items-center">
          <q-avatar size="md" class="q-mr-sm">
            <img :src="getProductImage(selectedProductId)" />
          </q-avatar>
          <div>
            <div class="text-weight-bold">{{ getProductTitle(selectedProductId) }}</div>
            <div class="text-caption">
              <q-badge v-if="isOnline" color="positive" rounded />
              <q-badge v-else color="grey" rounded />
              {{ isOnline ? 'Online' : 'Offline' }}
            </div>
          </div>
        </div>

        <q-space />

        <div>
          <q-btn flat round dense icon="more_vert">
            <q-menu>
              <q-list style="min-width: 150px">
                <q-item clickable v-close-popup @click="clearChat">
                  <q-item-section avatar>
                    <q-icon name="delete" />
                  </q-item-section>
                  <q-item-section>Clear chat</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="reportUser">
                  <q-item-section avatar>
                    <q-icon name="flag" />
                  </q-item-section>
                  <q-item-section>Report user</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>

      <div class="chat-messages q-pa-sm" ref="messagesContainer">
        <div
          v-for="(message, index) in currentMessages"
          :key="index"
          :class="['message-bubble', message.from === 'buyer' ? 'sent' : 'received']"
        >
          <div class="message-content">{{ message.text }}</div>
          <div class="message-time">{{ message.time }}</div>
        </div>
      </div>

      <div class="chat-input q-pt-md">
        <q-input
          v-model="newMessage"
          outlined
          rounded
          placeholder="Type your message..."
          @keyup.enter="sendMessage"
        >
          <template v-slot:after>
            <q-btn
              round
              dense
              flat
              icon="send"
              color="primary"
              @click="sendMessage"
              :disable="!newMessage.trim()"
            />
          </template>
        </q-input>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const products = [
  {
    id: 1,
    title: 'Wireless Headphones with Noise Cancellation',
    image: 'https://placehold.co/300x300?text=Headphones',
  },
  {
    id: 2,
    title: 'Genuine Leather Jacket (Medium)',
    image: 'https://placehold.co/300x300?text=Jacket',
  },
  {
    id: 3,
    title: 'Modern Coffee Table',
    image: 'https://placehold.co/300x300?text=Table',
  },
  {
    id: 4,
    title: 'Smartphone with Free Case',
    image: 'https://placehold.co/300x300?text=Phone',
  },
]

const conversationsData = ref([
  {
    id: 'conv-1',
    productId: 1,
    buyerId: 45,
    sellerId: 9,
    messages: [
      { from: 'buyer', text: 'Hi! Available pa ba to?', time: '10:00 AM' },
      { from: 'seller', text: 'Oo, available pa!', time: '10:01 AM' },
      { from: 'buyer', text: 'Pwede ba tawaran?', time: '10:02 AM' },
    ],
  },
  {
    id: 'conv-2',
    productId: 2,
    buyerId: 45,
    sellerId: 12,
    messages: [
      { from: 'buyer', text: 'Interested ako dito', time: '9:30 AM' },
      { from: 'seller', text: 'Sure, pwede ko ibenta ng ₱500', time: '9:32 AM' },
    ],
  },
])

const selectedProductId = ref(null)
const newMessage = ref('')
const isOnline = ref(true)
const messagesContainer = ref(null)

onMounted(() => {
  if (route.query.productId) {
    const productId = parseInt(route.query.productId)
    openConversation(productId)
  }
})

const conversations = computed(() => {
  return conversationsData.value.map((conv) => ({
    ...conv,
    hasUnread: hasUnreadMessages(conv),
  }))
})

const currentMessages = computed(() => {
  if (!selectedProductId.value) return []
  const conversation = conversationsData.value.find(
    (conv) => conv.productId === selectedProductId.value,
  )
  return conversation ? conversation.messages : []
})

function openConversation(productId) {
  selectedProductId.value = productId

  const exists = conversationsData.value.some((conv) => conv.productId === productId)
  if (!exists) {
    conversationsData.value.push({
      id: `conv-${conversationsData.value.length + 1}`,
      productId: productId,
      buyerId: 45,
      sellerId: 9,
      messages: [],
    })
  }

  nextTick(() => {
    scrollToBottom()
  })
}

function sendMessage() {
  if (!newMessage.value.trim() || !selectedProductId.value) return

  const conversation = conversationsData.value.find(
    (conv) => conv.productId === selectedProductId.value,
  )

  if (conversation) {
    conversation.messages.push({
      from: 'buyer',
      text: newMessage.value.trim(),
      time: formatTime(new Date()),
    })

    newMessage.value = ''

    setTimeout(
      () => {
        const replies = [
          'Yes, available pa!',
          'Pwede po tawaran.',
          'Sure, when can you pick it up?',
          'Sorry, sold out na po.',
        ]
        const randomReply = replies[Math.floor(Math.random() * replies.length)]

        conversation.messages.push({
          from: 'seller',
          text: randomReply,
          time: formatTime(new Date()),
        })

        scrollToBottom()
      },
      1000 + Math.random() * 2000,
    )
  }

  scrollToBottom()
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

function clearChat() {
  if (!selectedProductId.value) return

  const conversation = conversationsData.value.find(
    (conv) => conv.productId === selectedProductId.value,
  )

  if (conversation) {
    $q.dialog({
      title: 'Clear Conversation',
      message: 'Are you sure you want to clear this chat?',
      cancel: true,
      persistent: true,
    }).onOk(() => {
      conversation.messages = []
    })
  }
}

function reportUser() {
  $q.dialog({
    title: 'Report User',
    message: 'Please select a reason for reporting this user',
    options: {
      type: 'radio',
      model: 'spam',
      items: [
        { label: 'Spam', value: 'spam' },
        { label: 'Inappropriate Content', value: 'inappropriate' },
        { label: 'Scam/Fraud', value: 'scam' },
        { label: 'Other', value: 'other' },
      ],
    },
    cancel: true,
  }).onOk((reason) => {
    $q.notify({
      message: 'User reported successfully',
      color: 'positive',
    })
  })
}

function getProductTitle(productId) {
  const product = products.find((p) => p.id === productId)
  return product ? product.title : 'Product'
}

function getProductImage(productId) {
  const product = products.find((p) => p.id === productId)
  return product ? product.image : 'https://placehold.co/40'
}

function getLastMessage(messages) {
  return messages.length > 0 ? messages[messages.length - 1].text : 'No messages yet'
}

function hasUnreadMessages(conversation) {
  return false
}

function formatTime(date) {
  if (typeof date === 'string') return date

  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}
</script>

<style lang="scss" scoped>
.messages-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
}

.conversations-list {
  flex: 1;
  overflow-y: auto;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 16px;
}

.message-bubble {
  max-width: 70%;
  margin-bottom: 12px;
  padding: 8px 12px;
  border-radius: 18px;
  position: relative;

  .message-content {
    word-wrap: break-word;
  }

  .message-time {
    font-size: 0.7rem;
    opacity: 0.7;
    text-align: right;
    margin-top: 4px;
  }

  &.sent {
    background: var(--q-primary);
    color: white;
    margin-left: auto;
    border-bottom-right-radius: 4px;
  }

  &.received {
    background: #f1f1f1;
    color: black;
    margin-right: auto;
    border-bottom-left-radius: 4px;
  }
}

.chat-input {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  padding: 8px;
  background: white;
}

@media (max-width: 600px) {
  .messages-page {
    height: calc(100vh - 100px);
  }

  .message-bubble {
    max-width: 80%;
  }
}
@import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');
</style>
