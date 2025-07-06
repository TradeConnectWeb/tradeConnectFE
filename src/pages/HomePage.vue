<template>
  <q-page class="home-page">
    <!-- Search Bar -->
    <div class="q-pa-md">
      <q-input
        v-model="searchQuery"
        placeholder="Search products..."
        outlined
        dense
        bg-color="white"
        @keyup.enter="handleSearch"
      >
        <template v-slot:append>
          <q-icon name="search" @click="handleSearch" class="cursor-pointer" />
        </template>
      </q-input>
    </div>

    <!-- Loader -->
    <q-spinner v-if="loading" color="primary" size="40px" class="q-my-md" />

    <!-- Product Grid -->
    <div v-else class="q-pa-md">
      <div class="row items-center q-mb-md">
        <h2 class="text-h5 text-weight-bold">Products</h2>
      </div>

      <div v-if="paginatedProducts.length === 0" class="text-grey text-center">
        No products found.
      </div>

      <div class="row q-col-gutter-md">
        <div
          v-for="product in paginatedProducts"
          :key="product._id"
          class="col-6 col-sm-4 col-md-3"
        >
          <q-card class="product-card cursor-pointer" @click="confirmAddToCart(product)">
            <q-img :src="getImageUrl(product.file)" :ratio="1" class="product-image" />
            <q-card-section class="q-pa-sm">
              <div class="text-subtitle2 text-weight-medium ellipsis-2-lines">
                {{ product.name }}
              </div>
              <div class="text-h6 text-primary q-mt-xs">₱{{ product.price.toLocaleString() }}</div>
              <div class="text-caption text-grey-7 q-mt-xs">
                <q-icon name="category" size="xs" />
                {{ product.category }}
              </div>
              <div class="q-mt-sm">
                <!-- <template v-if="product.isForSale">
                  <q-btn
                    dense
                    label="Buy Now"
                    color="primary"
                    size="sm"
                    @click.stop="buyNow(product._id)"
                  />
                </template>
                <q-btn
                  v-else
                  dense
                  label="Request Trade"
                  color="secondary"
                  size="sm"
                  class="full-width"
                  @click.stop="requestTrade(product._id)"
                /> -->
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Pagination -->
      <div class="row justify-center q-mt-lg" v-if="totalPages > 1">
        <q-pagination
          v-model="currentPage"
          :max="totalPages"
          color="primary"
          max-pages="7"
          boundary-numbers
          @update:model-value="handlePageChange"
        />
      </div>
    </div>

    <!-- Add to Cart Confirmation Dialog -->
    <q-dialog v-model="showCartConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="shopping_cart" color="primary" text-color="white" />
          <span class="q-ml-sm"
            >Add <strong>{{ selectedProduct?.name }}</strong> to cart?</span
          >
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn label="Yes, Add" color="primary" @click="handleAddToCart" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Floating Add Button -->
    <q-btn
      round
      color="primary"
      icon="add"
      class="fixed-bottom-right q-ma-md floating-add-btn"
      size="lg"
      @click="showAddPostModal = true"
    />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import axios from 'axios'

const router = useRouter()
const $q = useQuasar()

const searchQuery = ref('')
const loading = ref(false)
const allProducts = ref([])
const showCartConfirm = ref(false)
const selectedProduct = ref(null)

const currentPage = ref(1)
const perPage = 8

const getProducts = async (query = '') => {
  loading.value = true
  try {
    const res = await axios.get(`${process.env.api_host}/products`, {
      params: query ? { query } : {},
    })
    allProducts.value = res.data
    currentPage.value = 1
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Failed to fetch products' })
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  getProducts(searchQuery.value.trim())
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const totalPages = computed(() => Math.ceil(allProducts.value.length / perPage))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return allProducts.value.slice(start, start + perPage)
})

const getImageUrl = (file) => {
  if (Array.isArray(file) && file.length > 0) return file[0]
  if (typeof file === 'string') return file
  return 'https://placehold.co/300x300'
}

const confirmAddToCart = (product) => {
  selectedProduct.value = product
  showCartConfirm.value = true
}

const handleAddToCart = async () => {
  showCartConfirm.value = false
  try {
    const token = localStorage.getItem('authToken')
    await axios.post(
      `${process.env.api_host}/cart`,
      {
        productId: selectedProduct.value._id,
        quantity: 1,
      },
      {
        headers: { Authorization: token },
      },
    )

    $q.notify({ type: 'positive', message: `${selectedProduct.value.name} added to cart!` })
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Failed to add to cart' })
  } finally {
    selectedProduct.value = null
  }
}

const requestTrade = (id) => {
  $q.notify({ message: `Trade requested for product ${id}`, type: 'info' })
}

const buyNow = (id) => {
  $q.notify({ message: `Proceeding to buy product ${id}`, type: 'positive' })
}

onMounted(() => getProducts())
</script>

<style scoped>
.home-page {
  padding-bottom: 80px;
}
.product-card {
  border-radius: 12px;
  transition: 0.3s ease;
}
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.product-image {
  border-radius: 12px 12px 0 0;
}
.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.floating-add-btn {
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}
.floating-add-btn:hover {
  transform: scale(1.1);
}
</style>
