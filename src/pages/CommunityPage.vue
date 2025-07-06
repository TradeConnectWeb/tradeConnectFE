<template>
  <q-page class="q-pa-md community-page">
    <!-- Start a Discussion -->
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

    <!-- Post List -->
    <div v-if="posts.length">
      <q-card v-for="post in posts" :key="post._id" class="q-mb-md" flat bordered>
        <q-card-section>
          <div class="row justify-between items-center">
            <div class="text-weight-bold">@{{ post.username }}</div>
            <div class="text-caption text-grey">
              {{ formatDate(post.createdAt) }}
            </div>
          </div>
          <div class="q-mt-sm">{{ post.content }}</div>
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <q-btn dense flat icon="thumb_up" :label="post.likes" @click="likePost(post._id)" />
          <q-btn
            dense
            flat
            icon="chat_bubble_outline"
            :label="post.comments?.length || 0"
            @click="openComments(post)"
          />
        </q-card-actions>
      </q-card>
    </div>
    <div v-else class="text-grey text-center q-mt-lg">
      No posts yet. Be the first to share something!
    </div>

    <!-- Comments Dialog -->
    <q-dialog v-model="commentDialog">
      <q-card style="width: 100%; max-width: 600px">
        <q-card-section>
          <div class="text-h6 text-primary">Post by @{{ selectedPost?.username }}</div>
          <div class="q-mt-sm">{{ selectedPost?.content }}</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="text-subtitle2 text-weight-medium q-mb-sm">Comments</div>
          <div v-for="(comment, index) in selectedPost?.comments" :key="index" class="q-mb-sm">
            <div class="text-caption text-grey-7">@{{ comment.username }}:</div>
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
import { ref, nextTick } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const API_URL = process.env.api_host
const token = localStorage.getItem('authToken') // assumed to be set on login

const posts = ref([])
const newPost = ref({ content: '' })
const commentDialog = ref(false)
const selectedPost = ref(null)
const newComment = ref('')

const fetchPosts = async () => {
  try {
    const res = await fetch(`${API_URL}/posts`)
    const data = await res.json()
    posts.value = data.posts.reverse()
  } catch (err) {
    console.error(err)
    $q.notify({ message: 'Failed to fetch posts', type: 'negative' })
  }
}

const submitPost = async () => {
  if (!newPost.value.content.trim()) return

  try {
    const res = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ content: newPost.value.content }),
    })

    const data = await res.json()
    posts.value.unshift(data.post)
    newPost.value.content = ''
    $q.notify({ message: 'Post added!', type: 'positive', icon: 'check' })
  } catch (err) {
    console.error(err)
    $q.notify({ message: 'Failed to add post', type: 'negative' })
  }
}

const likePost = async (postId) => {
  try {
    const res = await fetch(`${API_URL}/posts/${postId}/like`, {
      method: 'POST',
      headers: { Authorization: token },
    })
    const updatedPost = await res.json()

    const index = posts.value.findIndex((p) => p._id === updatedPost._id)
    if (index !== -1) posts.value[index] = updatedPost

    if (selectedPost.value && selectedPost.value._id === updatedPost._id) {
      selectedPost.value = { ...updatedPost }
    }
  } catch (err) {
    console.error(err)
    $q.notify({ message: 'Failed to like post', type: 'negative' })
  }
}

const openComments = (post) => {
  selectedPost.value = { ...post }
  commentDialog.value = true
}

const addComment = async () => {
  if (!newComment.value.trim()) return

  try {
    const res = await fetch(`${API_URL}/posts/${selectedPost.value._id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ content: newComment.value }),
    })

    const data = await res.json()

    // Push only once to the source of truth: posts[]
    const index = posts.value.findIndex((p) => p._id === selectedPost.value._id)
    if (index !== -1) {
      posts.value[index].comments.push(data.comment)
      selectedPost.value = { ...posts.value[index] } // refresh dialog from source
    }

    newComment.value = ''

    await nextTick(() => {
      const dialog = document.querySelector('.q-dialog__inner')
      if (dialog) dialog.scrollTop = dialog.scrollHeight
    })
  } catch (err) {
    console.error(err)
    $q.notify({ message: 'Failed to add comment', type: 'negative' })
  }
}

const formatDate = (date) => new Date(date).toLocaleString()

fetchPosts()
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
