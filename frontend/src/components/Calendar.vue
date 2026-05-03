<template>
  <section class="hero-calendar">
    <div class="section-head-calendar">
      <div>
        <h2>Izaberi dan</h2>
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

const apiBase = import.meta.env.VITE_API_BASE;
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