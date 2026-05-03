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

const isPrimaryDisabled = computed(() => {
  if (props.step < 3) return !props.canContinue || props.isAutoAdvancing;
  return !props.canFinish;
});

const primaryLabel = computed(() => {
  if (props.step < 3) return "Nastavi";
  return "Potvrdi termin";
});

function handlePrimaryClick() {
  if (isPrimaryDisabled.value) return;

  if (props.step < 3) {
    emit("next");
    return;
  }

  emit("finish");
}

function handleStepClick(item: SummaryStep) {
  if (!item.isClickable) return;
  emit("go-to-step", item.step);
}
</script>

<template>
  <footer
    class="booking-bottom"
    :class="{ 'is-ready': !isPrimaryDisabled, 'is-disabled': isPrimaryDisabled }"
  >
    <div class="bottom-summary" aria-label="Pregled izabranog termina">
      <template v-for="(item, index) in summaryBlocks" :key="item.step">
        <button
          class="bottom-summary__item"
          :class="{ filled: !item.isEmpty }"
          type="button"
          :disabled="!item.isClickable"
          @click="handleStepClick(item)"
        >
          {{ item.isEmpty ? item.label : item.value }}
        </button>

        <i v-if="index < summaryBlocks.length - 1"></i>
      </template>
    </div>

    <button
      class="confirm-button"
      type="button"
      :disabled="isPrimaryDisabled"
      @click="handlePrimaryClick"
    >
      {{ primaryLabel }}
    </button>
  </footer>
</template>

<style scoped lang="scss">
@use "@/assets/scss/bottom-menu.scss";
</style>