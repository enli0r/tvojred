<template>
  <section class="booking-section booking-section--barbers">
    <header class="section-head-barber section-head--compact">
      <h2>Frizer</h2>

      <span class="section-count">
        {{ loading ? "Učitavanje" : `${items.length} dostupna` }}
      </span>
    </header>

    <div v-if="loading" class="barber-list barber-list--skeleton">
      <div
        v-for="index in 4"
        :key="index"
        class="barber-row barber-row--skeleton"
      >
        <div class="barber-img skeleton-block"></div>

        <div class="barber-row__content">
          <div class="skeleton-line skeleton-line-title"></div>
          <div class="skeleton-line skeleton-line-meta"></div>
          <div class="skeleton-line skeleton-line-availability"></div>
        </div>
      </div>
    </div>

    <div v-else class="barber-list">
      <button
        v-for="barber in items"
        :key="barber.id"
        type="button"
        class="barber-row"
        :class="{ active: modelValue?.id === barber.id }"
        @click="selectBarber(barber)"
      >
        <div class="barber-img">
          <img :src="getBarberImage(barber.id)" :alt="barber.name" />
        </div>

        <div class="barber-row__content">
          <span class="barber-row__radio-dot"></span>

          <div class="barber-row__top">
            <strong>{{ barber.name }}</strong>
          </div>

          <div class="barber-row__tags">
            <span>Fade</span>
            <i></i>
            <span>Beard</span>
          </div>

          <div class="barber-row__availability">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M12 8v4l2.5 1.5M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0Z"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            {{ modelValue?.id === barber.id ? "Izabrano" : "Dostupan danas" }}
          </div>
        </div>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
type Barber = {
  id: number;
  name: string;
};

defineProps<{
  modelValue?: Barber | null;
  items: Barber[];
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Barber | null): void;
  (e: "update:selectedBarber", value: Barber | null): void;
  (e: "next"): void;
}>();

function selectBarber(barber: Barber) {
  emit("update:modelValue", barber);
  emit("update:selectedBarber", barber);
  emit("next");
}

function getBarberImage(id: number) {
  const images = [
    "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80",
  ];

  return images[id % images.length];
}
</script>

<style scoped lang="scss">
@use "@/assets/scss/barbers.scss";
</style>