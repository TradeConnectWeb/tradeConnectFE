<template>
  <q-page class="q-pa-md">
    <!-- Profile Info -->
    <q-card class="q-mb-md">
      <q-card-section class="row items-center">
        <q-avatar size="80px" class="q-mr-md">
          <q-icon name="person" size="48px" />
        </q-avatar>
        <div>
          <div class="text-h6">{{ userData.username }}</div>
          <div>{{ userData.email }}</div>
          <div>{{ userData.address }}</div>
        </div>
        <q-space />
        <q-btn flat icon="edit" label="Edit" @click="showEditProfile = true" />
      </q-card-section>
    </q-card>

    <!-- My Products -->
    <div class="row items-center q-mb-sm">
      <h2 class="text-h6">My Products</h2>
      <q-space />
      <q-btn flat dense icon="add" label="Add New" color="primary" @click="openProductDialog()" />
    </div>

    <div v-if="products.length" class="row q-col-gutter-md q-mb-lg">
      <div v-for="product in products" :key="product._id" class="col-12 col-sm-6 col-md-4">
        <q-card>
          <q-img :src="product.file" ratio="1" />
          <q-card-section>
            <div class="text-subtitle2 ellipsis-2-lines">{{ product.name }}</div>
            <div class="text-caption">₱{{ product.price.toLocaleString() }}</div>
            <div class="q-mt-sm row justify-between">
              <q-btn dense flat icon="edit" color="primary" @click="openProductDialog(product)" />
              <q-btn
                dense
                flat
                icon="delete"
                color="negative"
                @click="deleteProduct(product._id)"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div v-else><p>No products yet.</p></div>

    <!-- Product Dialog -->
    <q-dialog v-model="showProductDialog">
      <q-card style="max-width: 500px; width: 100%">
        <q-card-section class="text-h6">
          {{ editingProduct ? 'Edit Product' : 'Add Product' }}
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="submitProduct">
            <q-input v-model="productForm.name" label="Name" required />
            <q-input
              v-model="productForm.description"
              label="Description"
              type="textarea"
              required
            />
            <q-input v-model.number="productForm.price" label="Price" type="number" required />
            <q-input
              v-model.number="productForm.quantity"
              label="Quantity"
              type="number"
              required
            />
            <q-input v-model="productForm.category" label="Category" required />
            <q-file
              filled
              bottom-slots
              label="Select Image"
              counter
              v-model="productFile"
              @change="onFileSelected"
            />
            <q-img
              v-if="productForm.file"
              :src="productForm.file"
              class="q-mt-sm"
              style="max-height: 200px; border: 1px solid #ddd"
            />
            <q-toggle v-model="productForm.isForSale" label="For Sale" />
            <q-toggle v-model="productForm.isForTrade" label="For Trade" />
            <div class="q-mt-md row justify-end">
              <q-btn flat label="Cancel" color="grey" @click="closeProductDialog" />
              <q-btn label="Save" type="submit" color="primary" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Orders for My Products -->
    <div class="row items-center q-mb-sm">
      <h2 class="text-h6">Orders for My Products</h2>
    </div>

    <div v-if="sellerOrders.length" class="row q-col-gutter-md q-mb-lg">
      <div v-for="order in sellerOrders" :key="order._id" class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-subtitle2">
              Order by: {{ order.user.username }} ({{ order.user.email }})
            </div>
            <div class="q-mt-sm">
              <div v-for="item in order.items" :key="item.product._id">
                <div>{{ item.product.name }} — Quantity: {{ item.quantity }}</div>
              </div>
            </div>
            <div class="q-mt-sm">
              <q-select
                filled
                dense
                v-model="order.status"
                :options="['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']"
                label="Status"
                @update:model-value="(val) => updateOrderStatus(order._id, val)"
              />
            </div>
            <div class="text-caption q-mt-xs">Total: ₱{{ order.total.toLocaleString() }}</div>
            <div class="text-caption">
              Ordered At: {{ new Date(order.createdAt).toLocaleString() }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div v-else><p>No orders yet for your products.</p></div>

    <!-- My Cart -->
    <div class="row items-center q-mb-sm">
      <h2 class="text-h6">My Cart</h2>
    </div>

    <div v-if="cart.length" class="row q-col-gutter-md q-mb-lg">
      <div v-for="item in cart" :key="item._id" class="col-12 col-sm-6 col-md-4">
        <q-card>
          <q-img :src="item.product?.file || 'https://via.placeholder.com/150'" ratio="1" />
          <q-card-section>
            <div class="text-subtitle2 ellipsis-2-lines">
              {{ item.product?.name || 'Unknown Product' }}
            </div>
            <div class="text-caption">
              ₱{{ item.product?.price ? item.product.price.toLocaleString() : 'N/A' }}
            </div>
            <div class="text-caption">Quantity: {{ item.quantity }}</div>
          </q-card-section>
        </q-card>
      </div>
      <!-- Place Order Button -->
      <div class="col-12 row justify-end q-mt-md">
        <q-btn color="primary" label="Place Order" @click="placeOrder" />
      </div>
    </div>
    <div v-else><p>Your cart is empty.</p></div>

    <!-- Edit Profile Dialog -->
    <q-dialog v-model="showEditProfile">
      <q-card style="max-width: 400px; width: 100%">
        <q-card-section class="text-h6">Edit Profile</q-card-section>
        <q-card-section>
          <q-form @submit.prevent="saveProfile">
            <q-input v-model="userData.username" label="Username" required />
            <q-input v-model="userData.email" label="Email" type="email" required />
            <q-input v-model="userData.address" label="Address" />
            <div class="q-mt-md row justify-end">
              <q-btn flat label="Cancel" color="grey" @click="showEditProfile = false" />
              <q-btn label="Save" color="primary" type="submit" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

import { useQuasar } from 'quasar'
import axios from 'axios'
import { uploadToCloud } from 'src/components/cloudinaryUtility'

const $q = useQuasar()
const userData = ref({ username: '', email: '', address: '' })
const products = ref([])
const cart = ref([])

const showEditProfile = ref(false)
const showProductDialog = ref(false)
const editingProduct = ref(null)
const productFile = ref(null)

import { onBeforeRouteLeave } from 'vue-router'

onBeforeRouteLeave((to, from, next) => {
  // Optional: Close dialogs or reset any modals
  showEditProfile.value = false
  showProductDialog.value = false

  // Optional: Reset forms
  editingProduct.value = null
  productFile.value = null

  next()
})

const productForm = ref({
  name: '',
  description: '',
  price: null,
  quantity: 1,
  category: '',
  file: '',
  isForSale: true,
  isForTrade: false,
})

const sellerOrders = ref([])

async function fetchSellerOrders() {
  try {
    const token = localStorage.getItem('authToken')
    const res = await axios.get(`${process.env.api_host}/orders/seller`, {
      headers: { Authorization: token },
    })
    sellerOrders.value = res.data.orders
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Failed to fetch seller orders.' })
  }
}

async function updateOrderStatus(orderId, newStatus) {
  try {
    const token = localStorage.getItem('authToken')
    await axios.put(
      `${process.env.api_host}/orders/${orderId}`,
      { status: newStatus },
      {
        headers: { Authorization: token },
      },
    )
    $q.notify({ type: 'positive', message: 'Order updated.' })
    fetchSellerOrders()
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Update failed.' })
  }
}

let isMounted = true

async function fetchUserAndProducts() {
  try {
    const token = localStorage.getItem('authToken')
    const userResponse = await axios.get(`${process.env.api_host}/users/viewer`, {
      headers: { Authorization: token },
    })
    if (!isMounted) return
    userData.value = userResponse.data.user

    const productResponse = await axios.get(`${process.env.api_host}/products`, {
      headers: { Authorization: token },
    })
    if (!isMounted) return
    products.value = productResponse.data.filter((p) => p.seller === userData.value._id)

    const cartResponse = await axios.get(`${process.env.api_host}/cart`, {
      headers: { Authorization: token },
    })
    if (!isMounted) return
    cart.value = cartResponse.data.cart
  } catch (err) {
    if (isMounted) {
      console.error(err)
    }
  }
}

async function placeOrder() {
  try {
    const token = localStorage.getItem('authToken')
    const response = await axios.post(
      `${process.env.api_host}/orders`,
      {},
      {
        headers: { Authorization: token },
      },
    )
    $q.notify({ type: 'positive', message: 'Order placed successfully!' })
    cart.value = []
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Failed to place order.' })
  }
}

function openProductDialog(product = null) {
  if (product) {
    editingProduct.value = product
    Object.assign(productForm.value, { ...product })
    productFile.value = null
  } else {
    editingProduct.value = null
    Object.assign(productForm.value, {
      name: '',
      description: '',
      price: null,
      quantity: 1,
      category: '',
      file: '',
      isForSale: true,
      isForTrade: false,
    })
    productFile.value = null
  }
  showProductDialog.value = true
}

function closeProductDialog() {
  showProductDialog.value = false
  editingProduct.value = null
  productFile.value = null
}

async function onFileSelected() {
  const file = productFile.value

  const url = await uploadToCloud(file)
  if (url) productForm.value.file = url
}

async function submitProduct() {
  try {
    const token = localStorage.getItem('authToken')

    if (productFile.value) {
      const uploadedUrl = await uploadToCloud(productFile.value)
      if (!uploadedUrl) {
        $q.notify({ type: 'negative', message: 'Image upload failed.' })
        return
      }
      productForm.value.file = uploadedUrl
    }

    const payload = { ...productForm.value, seller: userData.value._id }

    if (editingProduct.value) {
      await axios.put(`${process.env.api_host}/products/${editingProduct.value._id}`, payload, {
        headers: { Authorization: token },
      })
      $q.notify({ type: 'positive', message: 'Product updated!' })
    } else {
      await axios.post(`${process.env.api_host}/products`, payload, {
        headers: { Authorization: token },
      })
      $q.notify({ type: 'positive', message: 'Product created!' })
    }

    await fetchUserAndProducts()
    closeProductDialog()
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Failed to save product.' })
  }
}

async function deleteProduct(id) {
  try {
    const token = localStorage.getItem('authToken')
    await axios.delete(`${process.env.api_host}/products/${id}`, {
      headers: { Authorization: token },
    })
    $q.notify({ type: 'negative', message: 'Product deleted' })
    fetchUserAndProducts()
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Delete failed' })
  }
}

async function saveProfile() {
  try {
    const token = localStorage.getItem('authToken')
    const res = await axios.put(
      `${process.env.api_host}/users/update`,
      {
        username: userData.value.username,
        email: userData.value.email,
        address: userData.value.address,
      },
      {
        headers: { Authorization: token },
      },
    )
    userData.value = res.data.user
    showEditProfile.value = false
    $q.notify({ type: 'positive', message: 'Profile updated successfully!' })
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Failed to update profile.' })
  }
}

onMounted(() => {
  fetchUserAndProducts()
  fetchSellerOrders()
})

onBeforeUnmount(() => {
  isMounted = false
})
</script>

<style scoped>
.ellipsis-2-lines {
  overflow: hidden;
  display: -webkit-box;

  -webkit-box-orient: vertical;
}
</style>
