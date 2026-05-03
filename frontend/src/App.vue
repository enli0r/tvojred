<template>
  <div class="app-shell">
    <RouterView />
    <!-- <InstallPrompt /> -->
  </div>
</template>

<script setup lang="ts">
// import InstallPrompt from "./components/InstallPrompt.vue";
</script>

<style lang="scss">
.app-shell {
  min-height: 100dvh;
  position: relative;
  overflow: hidden;
}
</style>