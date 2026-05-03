<template>
  <section class="appointments-section">
    <header class="section-head-app section-head--slots">
      <div class="slot-head-copy">
        <div class="slot-head-row">
          <div class="section-text">
            <h2>Termin</h2>
          <p>Izaberi slobodan termin</p>
          </div>
          
          <div class="slot-toggle-mini" :class="selectedPeriod">
            <div class="slot-toggle-mini__highlight"></div>

            <button
              type="button"
              class="slot-toggle-mini__item"
              :class="{ active: selectedPeriod === 'morning' }"
              @click="selectPeriod('morning')"
            >
              Prepodne
              <span>{{ morningCount }}</span>
            </button>

            <button
              type="button"
              class="slot-toggle-mini__item"
              :class="{ active: selectedPeriod === 'afternoon' }"
              @click="selectPeriod('afternoon')"
            >
              Popodne
              <span>{{ afternoonCount }}</span>
            </button>
          </div>
        </div>

      </div>
    </header>

    <Transition name="slots-fade" mode="out-in">
      <div v-if="canShowSlots" class="slot-area" :key="selectedPeriod">
        <div v-if="loading" class="slot-grid">
          <div
            v-for="index in 12"
            :key="index"
            class="slot-pill slot-pill--skeleton"
          >
            <div class="skeleton-line skeleton-line-time skeleton-line--center"></div>
          </div>
        </div>

        <template v-else>
          <div v-if="filteredItems.length === 0" class="empty-state">
            Nema slobodnih termina.
          </div>

          <div v-else class="slot-grid">
            <button
              v-for="appointment in filteredItems"
              :key="appointment.start_time"
              type="button"
              class="slot-pill"
              :class="{ active: modelValue?.start_time === appointment.start_time }"
              @click="selectAppointment(appointment)"
            >
              <strong class="slot-pill__time">
                {{ formatTime(appointment.start_time) }}
              </strong>
            </button>
          </div>
        </template>
      </div>
    </Transition>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

type Appointment = {
  id: number;
  start_time: string;
  end_time: string;
};

type Barber = {
  id: number;
  name: string;
};

type Period = "morning" | "afternoon";

const props = defineProps<{
  modelValue?: Appointment | null;
  items: Appointment[];
  loading?: boolean;
  date?: string | null;
  barber?: Barber | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Appointment | null): void;
}>();

const selectedPeriod = ref<Period>("morning");

const canShowSlots = computed(() => {
  return !!props.date && !!props.barber;
});

function getPeriod(iso: string): Period {
  const d = new Date(iso);
  const totalMinutes = d.getHours() * 60 + d.getMinutes();

  return totalMinutes < 12 * 60 ? "morning" : "afternoon";
}

const morningItems = computed(() => {
  return props.items.filter(
    (appointment) => getPeriod(appointment.start_time) === "morning"
  );
});

const afternoonItems = computed(() => {
  return props.items.filter(
    (appointment) => getPeriod(appointment.start_time) === "afternoon"
  );
});

const morningCount = computed(() => morningItems.value.length);
const afternoonCount = computed(() => afternoonItems.value.length);

const filteredItems = computed(() => {
  return selectedPeriod.value === "morning"
    ? morningItems.value
    : afternoonItems.value;
});

watch(
  () => props.items,
  () => {
    if (
      selectedPeriod.value === "morning" &&
      morningCount.value === 0 &&
      afternoonCount.value > 0
    ) {
      selectedPeriod.value = "afternoon";
      emit("update:modelValue", null);
    } else if (
      selectedPeriod.value === "afternoon" &&
      afternoonCount.value === 0 &&
      morningCount.value > 0
    ) {
      selectedPeriod.value = "morning";
      emit("update:modelValue", null);
    }
  },
  { immediate: true }
);

function formatTime(iso: string) {
  const d = new Date(iso);

  return d.toLocaleTimeString("sr-Latn-RS", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function selectAppointment(appointment: Appointment) {
  emit("update:modelValue", appointment);
}

function selectPeriod(period: Period) {
  selectedPeriod.value = period;
  emit("update:modelValue", null);
}
</script>

<style scoped lang="scss">
@use "@/assets/scss/appointments.scss";
</style>