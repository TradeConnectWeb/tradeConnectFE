<template>
  <q-page class="profile-page q-pa-md">
    <q-card class="user-info-card q-mb-md">
      <q-card-section>
        <div class="row items-center">
          <q-avatar size="80px" class="q-mr-md">
            <q-icon name="person" size="48px" />
          </q-avatar>
          <div>
            <div class="text-h6">{{ userData.username || 'User' }}</div>
            <div>{{ userData.email }}</div>
            <div>{{ userData.address }}</div>
          </div>
          <q-space />
          <q-btn flat icon="edit" @click="showEditProfile = true" label="Edit Profile" />
        </div>
      </q-card-section>
    </q-card>

    <section class="my-listings q-mb-lg">
      <div class="row items-center q-mb-sm">
        <h2 class="text-h6">My Listings</h2>
        <q-btn
          flat
          dense
          label="Add New"
          color="primary"
          icon="add"
          @click="showAddPostModal = true"
        />
      </div>
      <div v-if="myListings.length" class="row q-col-gutter-md">
        <div v-for="item in myListings" :key="item.id" class="col-12 col-sm-6 col-md-4">
          <q-card class="product-card cursor-pointer">
            <q-img :src="item.image" ratio="1" />
            <q-card-section>
              <div class="text-subtitle2 text-weight-medium ellipsis-2-lines">{{ item.title }}</div>
              <div class="text-caption">₱{{ item.price.toLocaleString() }}</div>
              <div class="q-mt-sm row justify-between">
                <q-btn dense flat icon="edit" color="primary" @click="editListing(item)" />
                <q-btn dense flat icon="delete" color="negative" @click="deleteListing(item.id)" />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div v-else>
        <p>You have no listings yet.</p>
      </div>
    </section>

    <section class="favorites q-mb-lg">
      <h2 class="text-h6 q-mb-sm">Favorites</h2>
      <div v-if="favorites.length" class="row q-col-gutter-md">
        <div v-for="item in favorites" :key="item.id" class="col-12 col-sm-6 col-md-4">
          <q-card class="product-card cursor-pointer" @click="navigateToProduct(item.id)">
            <q-img :src="item.image" ratio="1" />
            <q-card-section>
              <div class="text-subtitle2 ellipsis-2-lines">{{ item.title }}</div>
              <div class="text-caption">₱{{ item.price.toLocaleString() }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div v-else>
        <p>No favorite items yet.</p>
      </div>
    </section>

    <section class="purchase-history q-mb-lg">
      <h2 class="text-h6 q-mb-sm">Purchase History</h2>
      <div v-if="purchaseHistory.length" class="row q-col-gutter-md">
        <div v-for="item in purchaseHistory" :key="item.id" class="col-12 col-sm-6 col-md-4">
          <q-card>
            <q-img :src="item.image" ratio="1" />
            <q-card-section>
              <div class="text-subtitle2">{{ item.title }}</div>
              <div class="text-caption">₱{{ item.price.toLocaleString() }}</div>
              <div>Status: {{ item.status }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div v-else>
        <p>No purchases yet.</p>
      </div>
    </section>

    <q-dialog v-model="showEditProfile" persistent>
      <q-card style="max-width: 400px; width: 100%">
        <q-card-section>
          <div class="text-h6">Edit Profile</div>
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="saveProfile">
            <q-input v-model="userData.username" label="Username" required />
            <q-input v-model="userData.email" label="Email" type="email" required />
            <q-input v-model="userData.firstName" label="First Name" />
            <q-input v-model="userData.lastName" label="Last Name" />
            <q-input v-model="userData.phone" label="Phone" />
            <q-input v-model="userData.address" label="Address" />
            <q-select v-model="userData.zone" label="Zone" :options="zones" required />
            <div class="q-mt-md row justify-end">
              <q-btn flat label="Cancel" color="grey" @click="showEditProfile = false" />
              <q-btn label="Save" color="primary" type="submit" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showAddPostModal" persistent>
      <q-card style="max-width: 500px; width: 100%">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Create Listing</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="showAddPostModal = false" />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit.prevent="handlePostSubmit" class="q-gutter-md">
            <q-input
              filled
              v-model="postForm.description"
              placeholder="Item description *"
              type="textarea"
              lazy-rules
              :rules="[(val) => !!val || 'Description is required']"
            />

            <div>
              <div class="text-caption q-mb-sm">Categories *</div>
              <div class="row q-gutter-sm">
                <q-btn
                  v-for="category in categories"
                  :key="category.value"
                  :label="category.label"
                  :color="postForm.category === category.value ? 'primary' : 'black'"
                  @click="postForm.category = category.value"
                  outline
                  rounded
                />
              </div>
              <q-input
                v-model="postForm.category"
                filled
                style="display: none"
                lazy-rules
                :rules="[(val) => !!val || 'Category is required']"
              />
            </div>

            <q-input
              filled
              v-model="postForm.quantity"
              label="Quantity *"
              type="number"
              min="1"
              lazy-rules
              :rules="[(val) => !!val || 'Quantity is required']"
            />

            <div>
              <div class="text-caption q-mb-sm">Upload Images (Minimum 3) *</div>
              <div class="row q-gutter-sm">
                <q-uploader
                  style="width: 100%"
                  multiple
                  accept=".jpg, image/*"
                  max-files="3"
                  max-total-size="10000000"
                  @added="handleImageUpload"
                  @removed="handleImageRemove"
                  label="Drag and drop or browse files"
                />
              </div>
            </div>

            <div class="q-mt-md">
              <q-toggle
                v-model="postForm.isForSale"
                label="Sell this item"
                left-label
                color="primary"
              />

              <q-input
                v-if="postForm.isForSale"
                filled
                v-model="postForm.price"
                placeholder="Price (₱) *"
                type="number"
                min="1"
                lazy-rules
                :rules="[(val) => !!val || 'Price is required']"
                class="q-mt-sm"
              />
            </div>

            <div>
              <q-btn
                label="Post Item"
                type="submit"
                color="primary"
                class="full-width"
                icon="upload"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import axios from 'axios'

const $q = useQuasar()
const router = useRouter()

const userData = ref({
  username: 'kitkai',
  email: 'maricarcaratao11@gmail.com',
  firstName: 'kai',
  lastName: 'caratao',
  phone: '09171234567',
  address: 'bulihan',
  zone: 'zone3',
})

const editableUser = reactive({ ...userData.value })
const showEditProfile = ref(false)

async function fetchData() {
  try {
    const token = localStorage.getItem('authToken')
    const response = await axios.get(`${process.env.api_host}/users/viewer`, {
      headers: { Authorization: token },
    })
    console.log(response.data.user)
    userData.value = response.data.user
  } catch (err) {
    console.error(err)
  }
}

const saveProfile = () => {
  Object.assign(userData.value, editableUser)
  showEditProfile.value = false
  $q.notify({
    message: 'Profile updated successfully!',
    color: 'positive',
    icon: 'check_circle',
  })
}

const myListings = ref([
  {
    id: 1,
    title: 'Vintage Chair',
    price: 0,
    image: 'https://cdn.quasar.dev/img/.jpg',
  },
  {
    id: 2,
    title: 'Used Bicycle',
    price: 0,
    image: 'https://cdn.quasar.dev/img/.jpg',
  },
])

const favorites = ref([
  {
    id: 11,
    title: 'Old Camera',
    price: 0,
    image: 'https://cdn.quasar.dev/img/.jpg',
  },
])

const purchaseHistory = ref([
  {
    id: 21,
    title: 'Gaming Mouse',
    price: 0,
    image: 'https://cdn.quasar.dev/img/.jpg',
    status: 'Delivered',
  },
])

const zones = [
  { label: 'Zone 1', value: 'zone1' },
  { label: 'Zone 2', value: 'zone2' },
  { label: 'Zone 3', value: 'zone3' },
  { label: 'Zone 4', value: 'zone4' },
  { label: 'Zone 5', value: 'zone5' },
  { label: 'Zone 6', value: 'zone6' },
  { label: 'Zone 7', value: 'zone7' },
  { label: 'Zone 8', value: 'zone8' },
  { label: 'Zone 9', value: 'zone9' },
  { label: 'Zone 10', value: 'zone10' },
  { label: 'Zone 11', value: 'zone11' },
]

const navigateToProduct = (id) => {
  router.push(`/product/${id}`)
}

const showAddPostModal = ref(false)
const categories = [
  { label: 'Fashion & Apparel', value: 'fashion' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Food & Beverages', value: 'food' },
  { label: 'DIY & Hardware', value: 'diy' },
  { label: 'Health & Beauty', value: 'health' },
]

const postForm = reactive({
  description: '',
  category: '',
  quantity: 1,
  images: [],
  isForSale: false,
  price: null,
})

const handleImageUpload = (files) => {
  postForm.images.push(...files)
}

const handleImageRemove = (file) => {
  postForm.images = postForm.images.filter((f) => f !== file)
}

const handlePostSubmit = () => {
  if (!postForm.description || !postForm.category || postForm.images.length < 3) {
    $q.notify({
      type: 'negative',
      message: 'Please complete all required fields with at least 3 images.',
    })
    return
  }

  $q.notify({ type: 'positive', message: 'Listing posted!' })
  showAddPostModal.value = false

  postForm.description = ''
  postForm.category = ''
  postForm.quantity = 1
  postForm.images = []
  postForm.isForSale = false
  postForm.price = null
}

const editListing = (item) => {
  $q.notify({ message: `Edit listing for ${item.title} not implemented`, color: 'warning' })
}

const deleteListing = (id) => {
  const idx = myListings.value.findIndex((i) => i.id === id)
  if (idx !== -1) {
    myListings.value.splice(idx, 1)
    $q.notify({ message: 'Listing deleted', color: 'negative' })
  }
}

onMounted(() => {
  fetchData()
})
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
