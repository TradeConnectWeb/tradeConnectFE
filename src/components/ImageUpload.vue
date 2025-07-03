<template>
  <div class="image-upload">
    <q-uploader
      v-model="files"
      multiple
      accept="image/*"
      :max-files="maxFiles"
      :max-file-size="maxFileSize"
      @added="handleFilesAdded"
      @removed="handleFilesRemoved"
      style="width: 100%"
    >
      <template v-slot:header="scope">
        <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
          <q-btn
            v-if="scope.queuedFiles.length > 0"
            icon="clear_all"
            dense
            flat
            round
            color="negative"
            @click="scope.removeQueuedFiles"
          />

          <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />

          <div class="col">
            <div class="q-uploader__title">Upload Images</div>
            <div class="q-uploader__subtitle">
              {{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }}
            </div>
          </div>
        </div>
      </template>

      <template v-slot:list="scope">
        <div
          class="q-uploader__file flex items-center"
          v-for="file in scope.files"
          :key="file.name"
        >
          <q-img :src="file.__img.src" spinner-color="white" style="height: 50px; width: 50px" />
          <div class="q-uploader__file--content">
            <div class="q-uploader__file--title">{{ file.name }}</div>
            <q-linear-progress :value="scope.uploadProgress[file.name]" />
          </div>
          <q-btn
            class="q-uploader__file--remove"
            dense
            flat
            icon="cancel"
            @click="scope.removeFile(file)"
          />
        </div>
      </template>
    </q-uploader>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  maxFiles: {
    type: Number,
    default: 3,
  },
  maxFileSize: {
    type: Number,
    default: 5 * 1024 * 1024,
  },
})

const emit = defineEmits(['update:modelValue', 'files-added', 'files-removed'])

const files = ref(props.modelValue)

watch(files, (newVal) => {
  emit('update:modelValue', newVal)
})

const handleFilesAdded = (newFiles) => {
  emit('files-added', newFiles)
}

const handleFilesRemoved = (removedFiles) => {
  emit('files-removed', removedFiles)
}
</script>

<style scoped>
.image-upload {
  width: 100%;
}

.q-uploader__file {
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 8px;
  background-color: #f5f5f5;
}

.q-uploader__file--content {
  flex-grow: 1;
  padding: 0 8px;
}

.q-uploader__file--title {
  font-size: 14px;
  margin-bottom: 4px;
}
</style>
