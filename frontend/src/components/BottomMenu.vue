<script setup lang="ts">
import { computed } from "vue";

type SummaryStep = {
  step: number;
  label: string;
  value: string;
  isActive: boolean;
  isDone: boolean;
  isClickable: boolean;
};

const props = defineProps<{
  step: number;
  canContinue: boolean;
  canFinish: boolean;
  steps: SummaryStep[];
  visible?: boolean;
  isAutoAdvancing: boolean;
}>();

const emit = defineEmits<{
  (e: "back"): void;
  (e: "next"): void;
  (e: "finish"): void;
  (e: "go-to-step", step: number): void;
}>();

const summaryBlocks = computed(() => {
  return props.steps.slice(0, 3).map((item) => ({
    ...item,
    isEmpty: item.value === "Izaberi",
  }));
});

const hasFullSummary = computed(() => {
  return summaryBlocks.value.every((item) => !item.isEmpty);
});

const isPrimaryDisabled = computed(() => {
  return !props.canFinish || props.isAutoAdvancing;
});

const summaryTitle = computed(() => {
  if (!hasFullSummary.value) {
    return "Izaberi termin";
  }

  const [date, barber] = summaryBlocks.value;

  return `${date.value} · ${barber.value}`;
});

const summaryMeta = computed(() => {
  if (!hasFullSummary.value) {
    return "Dan, frizer i vreme";
  }

  const [, , time] = summaryBlocks.value;

  return time.value;
});

function handlePrimaryClick() {
  if (isPrimaryDisabled.value) return;

  emit("finish");
}
</script>

<template>
  <footer
    v-if="visible !== false"
    class="booking-bottom"
    :class="{
      'is-ready': !isPrimaryDisabled,
      'is-disabled': isPrimaryDisabled,
      'has-summary': hasFullSummary,
    }"
  >
    <div class="booking-bottom__inner">
      <div class="booking-bottom__summary">
        <strong>{{ summaryTitle }}</strong>
        <span>{{ summaryMeta }}</span>
      </div>

      <button
        class="confirm-button"
        type="button"
        :disabled="isPrimaryDisabled"
        @click="handlePrimaryClick"
      >
        Zakaži

        <svg viewBox="0 0 24 24" fill="none">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                />
              </svg>
      </button>
    </div>
  </footer>
</template>

<style scoped lang="scss">
@use "@/assets/scss/bottom-menu.scss";
</style>