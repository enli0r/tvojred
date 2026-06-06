<template>
  <main class="admin-shell">
    <section class="admin-phone">
      <RouterView v-slot="{ Component, route }">
        <Transition name="admin-page" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </Transition>
      </RouterView>

      <AdminBottomBar />
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AdminBottomBar from '@/components/AdminBottomBar.vue'

const route = useRoute()

const pageTitle = computed(() => {
  return String(route.meta.title || 'Admin')
})
</script>