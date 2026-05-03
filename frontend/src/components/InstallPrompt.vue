<script setup lang="ts">
import { ref, onMounted } from "vue";

const deferredPrompt = ref<any>(null);
const showInstallPrompt = ref(false);

onMounted(() => {
  window.addEventListener("beforeinstallprompt", (e: Event) => {
    e.preventDefault();
    deferredPrompt.value = e;
    showInstallPrompt.value = true;
  });
});

const installApp = async () => {
  if (!deferredPrompt.value) return;

  deferredPrompt.value.prompt();
  const { outcome } = await deferredPrompt.value.userChoice;

  if (outcome === "accepted") {
    showInstallPrompt.value = false;
  }

  deferredPrompt.value = null;
};

const closePrompt = () => {
  showInstallPrompt.value = false;
};
</script>

<template>
  <transition name="fade">
    <div v-if="showInstallPrompt" class="install-popup">
      <p>📱 Dodaj aplikaciju na početni ekran</p>
      <div class="actions">
        <button class="install-btn" @click="installApp">
          Dodaj
        </button>
        <button class="close-btn" @click="closePrompt">
          Kasnije
        </button>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.install-popup {
  position: fixed;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(20, 24, 36, 0.95);
  backdrop-filter: blur(12px);
  color: white;
  padding: 16px 20px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  z-index: 9999;
  text-align: center;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.install-btn {
  background: linear-gradient(180deg, #899dff, #6f82ff);
  border: none;
  color: white;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.close-btn {
  background: transparent;
  border: 1px solid #555;
  color: white;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>