<template>
  <q-page class="q-pa-md community-page">
    <q-card flat bordered class="q-mb-lg q-pa-md">
      <div class="text-h6 q-mb-md text-primary">Start a Discussion</div>
      <q-form @submit.prevent="submitPost" class="q-gutter-md">
        <q-input
          v-model="newPost.content"
          type="textarea"
          filled
          placeholder="Share something with the community..."
          :rules="[(val) => !!val || 'Post content is required']"
        />
        <q-btn label="Post" color="primary" type="submit" icon="send" />
      </q-form>
    </q-card>

    <div v-if="posts.length">
      <q-card v-for="post in posts" :key="post.id" class="q-mb-md" flat bordered>
        <q-card-section>
          <div class="row justify-between items-center">
            <div class="text-weight-bold">@{{ post.user }}</div>
            <div class="text-caption text-grey">{{ formatDate(post.createdAt) }}</div>
          </div>
          <div class="q-mt-sm">{{ post.content }}</div>
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <q-btn dense flat icon="thumb_up" :label="post.likes" @click="likePost(post.id)" />
          <q-btn
            dense
            flat
            icon="chat_bubble_outline"
            :label="post.comments.length"
            @click="openComments(post)"
          />
        </q-card-actions>
      </q-card>
    </div>
    <div v-else class="text-grey text-center q-mt-lg">
      No posts yet. Be the first to share something!
    </div>

    <q-dialog v-model="commentDialog">
      <q-card style="width: 100%; max-width: 600px">
        <q-card-section>
          <div class="text-h6 text-primary">Post by @{{ selectedPost?.user }}</div>
          <div class="q-mt-sm">{{ selectedPost?.content }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="text-subtitle2 text-weight-medium q-mb-sm">Comments</div>
          <div v-for="(comment, index) in selectedPost?.comments" :key="index" class="q-mb-sm">
            <div class="text-caption text-grey-7">@{{ comment.user }}:</div>
            <div>{{ comment.content }}</div>
          </div>

          <q-form @submit.prevent="addComment">
            <q-input
              v-model="newComment"
              dense
              filled
              placeholder="Add a comment..."
              :rules="[(val) => !!val || 'Comment is required']"
              class="q-mt-sm"
            />
            <q-btn
              type="submit"
              label="Comment"
              color="primary"
              icon="send"
              dense
              class="q-mt-sm"
            />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const newPost = ref({ content: '' })
const posts = ref([
  {
    id: 1,
    user: 'zone4_seller',
    content: 'Meron bang naghahanap ng DIY tools? Message niyo ako!',
    createdAt: new Date(),
    likes: 0,
    comments: [
      { user: 'zone5', content: 'Magkano po yung hammer set?' },
      { user: 'zone4', content: '100 lang, meet up lang.' },
    ],
  },
])

const commentDialog = ref(false)
const selectedPost = ref(null)
const newComment = ref('')

const submitPost = () => {
  if (!newPost.value.content) return

  posts.value.unshift({
    id: Date.now(),
    user: 'current_user',
    content: newPost.value.content,
    createdAt: new Date(),
    likes: 0,
    comments: [],
  })

  newPost.value.content = ''
  $q.notify({ message: 'Post added!', color: 'positive', icon: 'check' })
}

const likePost = (postId) => {
  const post = posts.value.find((p) => p.id === postId)
  if (post) post.likes++
}

const openComments = (post) => {
  selectedPost.value = post
  commentDialog.value = true
}

const addComment = () => {
  if (!newComment.value.trim()) return
  selectedPost.value.comments.push({
    user: 'current_user',
    content: newComment.value.trim(),
  })
  newComment.value = ''
}
const formatDate = (date) => {
  return new Date(date).toLocaleString()
}
</script>

<style scoped>
.community-page {
  font-family: 'Open Sans', sans-serif;
}

.q-card {
  border-radius: 12px;
}

.q-card:hover {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
@import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');
</style>
