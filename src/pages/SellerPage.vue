<template>
  <q-page class="seller-page q-pa-md">
    <q-card class="seller-info-card q-mb-md">
      <q-card-section>
        <div class="row items-center">
          <q-avatar size="80px" class="q-mr-md">
            <q-icon name="store" size="48px" />
          </q-avatar>
          <div>
            <div class="text-h6">{{ sellerData.storeName || 'Seller Store' }}</div>
            <div>Rating: {{ sellerData.rating.toFixed(1) }} ⭐</div>
            <div>{{ sellerData.description }}</div>
            <div>Contact: {{ sellerData.contact }}</div>
          </div>
          <q-space />
          <q-btn flat icon="edit" @click="showEditStore = true" label="Edit Store" />
        </div>
      </q-card-section>
    </q-card>

    <section class="active-listings q-mb-lg">
      <div class="row items-center q-mb-sm">
        <h2 class="text-h6">Active Listings</h2>
        <q-btn
          flat
          dense
          label="Add New"
          color="primary"
          icon="add"
          @click="showAddProductModal = true"
        />
      </div>
      <div v-if="activeListings.length" class="row q-col-gutter-md">
        <div v-for="item in activeListings" :key="item.id" class="col-12 col-sm-6 col-md-4">
          <q-card class="product-card">
            <q-img :src="item.image" ratio="1" />
            <q-card-section>
              <div class="text-subtitle2 ellipsis-2-lines">{{ item.title }}</div>
              <div>₱{{ item.price.toLocaleString() }}</div>
              <div>Views: {{ item.views }}</div>
              <div>Sales: {{ item.sales }}</div>
              <div class="q-mt-sm row justify-between">
                <q-btn dense flat icon="edit" color="primary" @click="editProduct(item)" />
                <q-btn dense flat icon="delete" color="negative" @click="deleteProduct(item.id)" />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div v-else>
        <p>You have no active listings yet.</p>
      </div>
    </section>

    <section class="orders q-mb-lg">
      <h2 class="text-h6 q-mb-sm">Orders / Request Trade</h2>
      <q-list bordered padding>
        <q-item v-for="order in orders" :key="order.id" clickable>
          <q-item-section>
            <div class="text-subtitle2">{{ order.productTitle }}</div>
            <div>Status: {{ order.status }}</div>
            <div>Buyer: {{ order.buyerName }}</div>
          </q-item-section>
          <q-item-section side>
            <q-btn dense flat color="primary" icon="chat" @click="openChat(order.buyerId)" />
          </q-item-section>
        </q-item>
      </q-list>
    </section>

    <q-dialog v-model="showAddProductModal" persistent>
      <q-card style="max-width: 500px; width: 100%">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Add New Product</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="showAddProductModal = false" />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit.prevent="submitNewProduct" class="q-gutter-md">
            <q-input
              filled
              v-model="newProduct.title"
              label="Product Title *"
              lazy-rules
              :rules="[(val) => !!val || 'Title is required']"
            />
            <q-input
              filled
              v-model="newProduct.price"
              label="Price (₱) *"
              type="number"
              min="1"
              lazy-rules
              :rules="[(val) => !!val || 'Price is required']"
            />
            <q-input
              filled
              v-model="newProduct.description"
              label="Description *"
              type="textarea"
              lazy-rules
              :rules="[(val) => !!val || 'Description is required']"
            />
            <q-uploader
              style="width: 100%"
              multiple
              accept=".jpg, image/*"
              max-files="3"
              max-total-size="10000000"
              @added="handleUploadImages"
              @removed="handleRemoveImages"
              label="Upload Images (min 3)"
            />
            <div class="q-mt-md row justify-end">
              <q-btn flat label="Cancel" color="grey" @click="showAddProductModal = false" />
              <q-btn label="Add Product" color="primary" type="submit" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const sellerData = reactive({
  storeName: 'Aling Edith',
  rating: 4.7,
  description: 'We sell quality secondhand items',
  contact: '09111111111',
})

const activeListings = ref([
  {
    id: 1,
    title: 'Used Laptop',
    price: 0,
    image: 'https://cdn.quasar.dev/img/.jpg',
    views: 0,
    sales: 0,
  },
  {
    id: 2,
    title: 'Old Sofa',
    price: 0,
    image: 'https://cdn.quasar.dev/img/.jpg',
    views: 0,
    sales: 0,
  },
])

const orders = ref([
  {
    id: 101,
    productTitle: 'Used Laptop',
    status: 'Pending',
    buyerName: 'Ana',
    buyerId: 201,
  },
  {
    id: 102,
    productTitle: 'Old Sofa',
    status: 'Pending',
    buyerName: 'Ana',
    buyerId: 202,
  },
])

const totalSales = computed(() => activeListings.value.reduce((acc, cur) => acc + cur.sales, 0))
const totalRevenue = computed(() =>
  activeListings.value.reduce((acc, cur) => acc + cur.price * cur.sales, 0),
)

const showEditStore = ref(false)

const showAddProductModal = ref(false)
const newProduct = reactive({
  title: '',
  price: null,
  description: '',
  images: [],
})

const handleUploadImages = (files) => {
  newProduct.images.push(...files)
}

const handleRemoveImages = (file) => {
  newProduct.images = newProduct.images.filter((f) => f !== file)
}

const submitNewProduct = () => {
  if (
    !newProduct.title ||
    !newProduct.price ||
    !newProduct.description ||
    newProduct.images.length < 3
  ) {
    $q.notify({
      type: 'negative',
      message: 'Please complete all required fields with at least 3 images.',
    })
    return
  }

  activeListings.value.push({
    id: activeListings.value.length + 1,
    title: newProduct.title,
    price: newProduct.price,
    image: newProduct.images[0].__img,
    views: 0,
    sales: 0,
  })
  $q.notify({ type: 'positive', message: 'Product added!' })
  showAddProductModal.value = false

  newProduct.title = ''
  newProduct.price = null
  newProduct.description = ''
  newProduct.images = []
}

const editProduct = (item) => {
  $q.notify({ message: `Edit product ${item.title} not implemented yet`, color: 'warning' })
}

const deleteProduct = (id) => {
  const idx = activeListings.value.findIndex((i) => i.id === id)
  if (idx !== -1) {
    activeListings.value.splice(idx, 1)
    $q.notify({ message: 'Product deleted', color: 'negative' })
  }
}

const openChat = (buyerId) => {
  $q.notify({ message: `Open chat with buyer ${buyerId} not implemented yet`, color: 'info' })
}
</script>

<style scoped>
.product-card {
  cursor: pointer;
}
.ellipsis-2-lines {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
@import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');
</style>
