<template>
  <q-page class="home-page">
    <div class="q-pa-md">
      <q-input
        v-model="searchQuery"
        placeholder="Search products..."
        outlined
        dense
        bg-color="white"
        @keyup.enter="handleSearch(searchQuery)"
      >
        <template v-slot:append>
          <q-icon name="search" @click="handleSearch(searchQuery)" class="cursor-pointer" />
        </template>
      </q-input>
    </div>

    <q-btn
      round
      color="primary"
      icon="add"
      class="fixed-bottom-right q-ma-md floating-add-btn"
      size="lg"
      @click="showAddPostModal = true"
    />

    <q-space />

    <q-space />

    <div class="featured-products q-pa-md">
      <div class="row items-center justify-between q-mb-md">
        <h2 class="text-h5 text-weight-bold">Featured Products</h2>
        <q-btn flat dense color="primary" label="See All" @click="navigateToProducts('featured')" />
      </div>

      <div class="row q-col-gutter-md">
        <div v-for="product in featuredProducts" :key="product.id" class="col-6 col-sm-4 col-md-3">
          <q-card class="product-card cursor-pointer" @click="navigateToProduct(product.id)">
            <q-img :src="product.image" :ratio="1" class="product-image">
              <div class="absolute-top-left q-pa-xs">
                <q-btn
                  dense
                  flat
                  round
                  size="sm"
                  :color="product.isFavorite ? 'pink' : 'white'"
                  :icon="product.isFavorite ? 'favorite' : 'favorite_border'"
                  class="bg-dark"
                  @click.stop="toggleFavorite(product.id)"
                />
              </div>
              <div class="absolute-top-right q-pa-xs">
                <q-btn
                  dense
                  flat
                  round
                  size="sm"
                  icon="chat"
                  class="bg-dark"
                  @click.stop="openChat(product.id)"
                />
              </div>
            </q-img>

            <q-card-section class="q-pa-sm">
              <div class="text-subtitle2 text-weight-medium ellipsis-2-lines">
                {{ product.title }}
              </div>
              <div class="text-h6 text-primary q-mt-xs">₱{{ product.price.toLocaleString() }}</div>
              <div class="text-caption text-grey-7 q-mt-xs">
                <q-icon name="location_on" size="xs" />
                {{ product.location }}
              </div>
              <div class="q-mt-sm">
                <template v-if="product.isForSale">
                  <q-btn
                    dense
                    label="Add to Cart"
                    color="primary"
                    size="sm"
                    class="q-mr-xs"
                    @click.stop="addToCart(product.id)"
                  />
                  <q-btn
                    dense
                    label="Buy Now"
                    color="primary"
                    size="sm"
                    @click.stop="buyNow(product.id)"
                  />
                </template>
                <q-btn
                  v-else
                  dense
                  label="Request Trade"
                  color="secondary"
                  size="sm"
                  class="full-width"
                  @click.stop="requestTrade(product.id)"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <div class="recent-products q-pa-md bg-grey-2">
      <div class="row items-center justify-between q-mb-md">
        <h2 class="text-h5 text-weight-bold">Recently Added</h2>
        <q-btn flat dense color="primary" label="See All" @click="navigateToProducts('recent')" />
      </div>

      <div class="row q-col-gutter-md">
        <div v-for="product in recentProducts" :key="product.id" class="col-6 col-sm-4 col-md-3">
          <q-card class="product-card cursor-pointer" @click="navigateToProduct(product.id)">
            <q-img :src="product.image" :ratio="1" class="product-image">
              <div class="absolute-top-left q-pa-xs">
                <q-btn
                  dense
                  flat
                  round
                  size="sm"
                  :color="product.isFavorite ? 'pink' : 'white'"
                  :icon="product.isFavorite ? 'favorite' : 'favorite_border'"
                  class="bg-dark"
                  @click.stop="toggleFavorite(product.id)"
                />
              </div>
              <div class="absolute-top-right q-pa-xs">
                <q-btn
                  dense
                  flat
                  round
                  size="sm"
                  icon="chat"
                  class="bg-dark"
                  @click.stop="openChat(product.id)"
                />
              </div>
            </q-img>

            <q-card-section class="q-pa-sm">
              <div class="text-subtitle2 text-weight-medium ellipsis-2-lines">
                {{ product.title }}
              </div>
              <div class="text-h6 text-primary q-mt-xs">₱{{ product.price.toLocaleString() }}</div>
              <div class="text-caption text-grey-7 q-mt-xs">
                <q-icon name="location_on" size="xs" />
                {{ product.location }}
              </div>
              <div class="q-mt-sm">
                <template v-if="product.isForSale">
                  <q-btn
                    dense
                    label="Add to Cart"
                    color="primary"
                    size="sm"
                    class="q-mr-xs"
                    @click.stop="addToCart(product.id)"
                  />
                  <q-btn
                    dense
                    label="Buy Now"
                    color="primary"
                    size="sm"
                    @click.stop="buyNow(product.id)"
                  />
                </template>
                <q-btn
                  v-else
                  dense
                  label="Request Trade"
                  color="secondary"
                  size="sm"
                  class="full-width"
                  @click.stop="requestTrade(product.id)"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <q-dialog v-model="showAddPostModal" persistent>
      <q-card style="width: 100%; max-width: 500px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Create Listing</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="showAddPostModal = false" />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="handlePostSubmit" class="q-gutter-md">
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const searchQuery = ref('')
const $q = useQuasar()
const router = useRouter()

const showAddPostModal = ref(false)
const postForm = ref({
  title: '',
  description: '',
  category: '',
  quantity: 1,
  images: [],
  isForSale: false,
  price: null,
})

const categories = [
  { label: 'Fashion & Apparel', value: 'fashion' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Food & Beverages', value: 'food' },
  { label: 'DIY & Hardware', value: 'diy' },
  { label: 'Health & Beauty', value: 'health' },
]

const featuredProducts = ref([
  {
    id: 1,
    title: '',
    price: 0,
    image: '',
    location: '',
    isFavorite: false,
    isForSale: true,
  },
])

const originalFeatured = ref([...featuredProducts.value])
const handleSearch = () => {
  const query = searchQuery.value.trim()

  if (!query) {
    featuredProducts.value = [...originalFeatured.value]
    return
  }

  featuredProducts.value = originalFeatured.value.filter((product) =>
    product.title.toLowerCase().includes(query.toLowerCase()),
  )
}

const recentProducts = ref([
  {
    id: 5,
    title: '',
    price: 0,
    image: '',
    location: '',
    isFavorite: false,
    isForSale: true,
  },
])

const popularCategories = ref([
  { id: 'electronics', name: 'Electronics', count: 0, icon: 'devices', color: 'blue' },
  { id: 'fashion', name: 'Fashion & Apparel', count: 0, icon: 'checkroom', color: 'pink' },
  { id: 'home', name: 'Home Appliances', count: 0, icon: 'home', color: 'orange' },
  { id: 'food', name: 'Food & Beverages', count: 0, icon: 'restaurant', color: 'red' },
  { id: 'diy', name: 'DIY & Hardware', count: 0, icon: 'handyman', color: 'brown' },
  { id: 'health', name: 'Health & Beauty', count: 0, icon: 'spa', color: 'purple' },
])

const toggleFavorite = (productId) => {
  const product =
    featuredProducts.value.find((p) => p.id === productId) ||
    recentProducts.value.find((p) => p.id === productId)
  if (product) {
    product.isFavorite = !product.isFavorite
    $q.notify({
      message: product.isFavorite ? 'Added to favorites' : 'Removed from favorites',
      icon: product.isFavorite ? 'favorite' : 'favorite_border',
      color: product.isFavorite ? 'pink' : 'grey',
    })
  }
}

const openChat = (productId) => {
  $q.notify({
    message: 'Opening chat for product ' + productId,
    color: 'primary',
    icon: 'chat',
  })
}

const addToCart = (productId) => {
  $q.notify({
    message: 'Added to cart',
    color: 'positive',
    icon: 'shopping_cart',
  })
}

const buyNow = (productId) => {
  $q.notify({
    message: 'Proceeding to checkout',
    color: 'primary',
    icon: 'shopping_bag',
  })
}

const requestTrade = (productId) => {
  $q.notify({
    message: 'Trade request sent',
    color: 'secondary',
    icon: 'swap_horiz',
  })
}

const navigateToCategory = (categoryId) => {
  router.push(`/category/${categoryId}`)
}

const navigateToProduct = (productId) => {
  router.push(`/product/${productId}`)
}

const navigateToProducts = (type) => {
  router.push(`/products?filter=${type}`)
}

const handleImageUpload = (files) => {
  postForm.value.images = files
}

const handleImageRemove = (files) => {
  postForm.value.images = files
}

const handlePostSubmit = () => {
  $q.notify({
    message: 'Item posted successfully!',
    color: 'positive',
    icon: 'check_circle',
  })
  showAddPostModal.value = false

  postForm.value = {
    description: '',
    category: '',
    quantity: 1,
    images: [],
    isForSale: false,
    price: null,
  }
}
</script>

<style lang="scss" scoped>
.home-page {
  padding-bottom: 50px;
}

.categories-section {
  .categories-scroll {
    display: flex;
    overflow-x: auto;
    padding-bottom: 12px;
    gap: 12px;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .category {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    border-radius: 20px;
    background: #f5f5f5;
    color: #555;
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;

    &:hover {
      background: #e0e0e0;
    }

    &.active {
      background: var(--q-primary);
      color: white;
    }

    .q-icon {
      font-size: 18px;
    }
  }
}

.popular-categories {
  .popular-category-card {
    border-radius: 12px;
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }
}

.product-card {
  border-radius: 12px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .product-image {
    border-radius: 12px 12px 0 0;
  }

  .bg-dark {
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(2px);
    transition: all 0.2s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.5);
      transform: scale(1.1);
    }
  }
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.floating-add-btn {
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
}

@media (max-width: 600px) {
  .categories-section {
    .category {
      padding: 8px 16px;
      font-size: 13px;

      .q-icon {
        font-size: 16px;
      }
    }
  }

  .product-card {
    .text-subtitle2 {
      font-size: 13px;
    }

    .text-h6 {
      font-size: 16px;
    }
  }
}
@import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');
</style>
