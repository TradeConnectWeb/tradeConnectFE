<template>
  <q-input
    v-model="searchQuery"
    outlined
    dense
    placeholder="Search for items or users..."
    class="search-bar"
    @update:model-value="handleSearch"
  >
    <template v-slot:append>
      <q-icon name="search" />
    </template>
  </q-input>
</template>

<script setup>
import { ref } from 'vue'
import { debounce } from 'quasar'

const searchQuery = ref('')
const emit = defineEmits(['search'])

const handleSearch = debounce(() => {
  emit('search', searchQuery.value)
}, 500)
</script>

<style scoped>
.search-bar {
  width: 100%;
  max-width: 500px;
}

.search-bar :deep(.q-field__control) {
  border-radius: 25px;
  height: 40px;
}

.search-bar :deep(.q-field__append) {
  padding-right: 10px;
}
</style>
