<template>
  <section class="hero-calendar">
    <div class="section-head-calendar">
      <div class="section-head-calendar__icon" aria-hidden="true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.7"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3.75 8.25h16.5M5.25 5.25h13.5A1.5 1.5 0 0 1 20.25 6.75v12A1.5 1.5 0 0 1 18.75 20.25H5.25A1.5 1.5 0 0 1 3.75 18.75v-12A1.5 1.5 0 0 1 5.25 5.25Z"
          />
        </svg>
      </div>

      <div>
        <h2>Datum</h2>
        <p>Dostupni narednih 14 dana</p>
      </div>
    </div>

    <div class="date-rail" aria-label="Dostupni dani">
      <button
        v-for="day in availableDays"
        :key="day.iso"
        type="button"
        class="date-card"
        :class="{ active: modelValue === day.iso }"
        @click="selectDate(day.iso)"
      >
        <span>{{ day.weekday }}</span>
        <strong>{{ day.day }}</strong>
        <small>{{ day.month }}</small>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

type AvailableDay = {
  iso: string;
  weekday: string;
  day: string;
  month: string;
};

const props = defineProps<{
  modelValue?: string | null;
  tenantId?: number | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "change", value: string): void;
  (e: "next"): void;
}>();

const apiBase = import.meta.env.VITE_API_BASE || "/api";
const bookableDates = ref<string[]>([]);

const availableDays = computed<AvailableDay[]>(() => {
  return bookableDates.value.map((iso) => {
    const date = new Date(`${iso}T00:00:00`);

    return {
      iso,
      weekday: new Intl.DateTimeFormat("en-US", {
        weekday: "short",
      }).format(date).toUpperCase(),
      day: new Intl.DateTimeFormat("sr-Latn-RS", {
        day: "2-digit",
      }).format(date),
      month: new Intl.DateTimeFormat("en-US", {
        month: "short",
      }).format(date).toUpperCase(),
    };
  });
});

async function fetchBookableDays() {
  if (!props.tenantId) {
    bookableDates.value = [];
    return;
  }

  try {
    const res = await fetch(
      `${apiBase}/tenants/${props.tenantId}/bookable-days?days=14`
    );

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    bookableDates.value = await res.json();
  } catch (error) {
    console.error("Failed to fetch bookable days:", error);
    bookableDates.value = [];
  }
}

function selectDate(iso: string) {
  emit("update:modelValue", iso);
  emit("change", iso);
  emit("next");
}

watch(
  () => props.tenantId,
  () => {
    fetchBookableDays();
  },
  { immediate: true }
);

onMounted(fetchBookableDays);
</script>

<style scoped lang="scss">
@use "@/assets/scss/calendar.scss";
</style>