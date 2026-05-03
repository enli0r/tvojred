<template>
  <div class="step-header">
    <div class="step-header__top">
      <div class="step-header__meta">
        <div class="step-header__icon" aria-hidden="true">
          <svg
            v-if="step === 1"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.35"
            stroke="currentColor"
            class="step-header__icon-svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
            />
          </svg>

          <svg
            v-else-if="step === 2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="step-header__icon-svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m7.848 8.25 1.536.887M7.848 8.25a3 3 0 1 1-5.196-3 3 3 0 0 1 5.196 3Zm1.536.887a2.165 2.165 0 0 1 1.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 1 1-5.196 3 3 3 0 0 1 5.196-3Zm1.536-.887a2.165 2.165 0 0 0 1.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863 2.077-1.199m0-3.328a4.323 4.323 0 0 1 2.068-1.379l5.325-1.628a4.5 4.5 0 0 1 2.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.33 4.33 0 0 0 10.607 12m3.736 0 7.794 4.5-.802.215a4.5 4.5 0 0 1-2.48-.043l-5.326-1.629a4.324 4.324 0 0 1-2.068-1.379M14.343 12l-2.882 1.664"
            />
          </svg>

          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="step-header__icon-svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>

        <div class="step-header__copy">
          <span class="step-header__eyebrow">{{ eyebrow }}</span>
          <h2 class="step-header__title">{{ title }}</h2>
        </div>
      </div>

      <div class="step-header__eta" v-if="eta">
        {{ eta }}
      </div>
    </div>

    <div class="step-header__progress">
      <div class="step-header__progress-rail"></div>
      <div class="step-header__progress-fill" :style="{ width: progressWidth }"></div>

      <button
        v-for="item in steps"
        :key="item.step"
        type="button"
        class="step-header__step"
        :class="{
          'is-active': item.step === step,
          'is-done': item.step < step,
          'is-clickable': item.step <= maxUnlockedStep,
        }"
        :disabled="item.step > maxUnlockedStep"
        @click="goTo(item.step)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

type ProgressStep = {
  step: number;
  label: string;
};

const props = withDefaults(
  defineProps<{
    step: number;
    maxUnlockedStep?: number;
    eta?: string;
    eyebrow?: string;
    title?: string;
    steps?: ProgressStep[];
  }>(),
  {
    maxUnlockedStep: 1,
    eta: "1/3",
    eyebrow: "Datum",
    title: "Dostupni termini narednih 14 dana",
    steps: () => [
      { step: 1, label: "01" },
      { step: 2, label: "02" },
      { step: 3, label: "03" },
    ],
  }
);

const emit = defineEmits<{
  (e: "go-to-step", step: number): void;
}>();

const progressWidth = computed(() => {
  if (props.step <= 1) return "33.3333%";
  if (props.step === 2) return "66.6666%";
  return "100%";
});

function goTo(targetStep: number) {
  if (targetStep > props.maxUnlockedStep) return;
  emit("go-to-step", targetStep);
}
</script>

<style scoped lang="scss">
.step-header {
  display: grid;
  margin: 4px 0 30px;
}

.step-header__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin: 0 18px 6px 16px;
}

.step-header__meta {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1;
}

.step-header__icon {
  width: 52px;
  height: 52px;
  flex: 0 0 52px;
  display: grid;
  place-items: center;
  border-radius: 18px;
  color: rgba(178, 189, 255, 0.96);
  background:
    linear-gradient(
      180deg,
      rgba(124, 144, 255, 0.16) 0%,
      rgba(63, 82, 168, 0.08) 100%
    );
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    inset 0 -1px 0 rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(12px) saturate(140%);
  -webkit-backdrop-filter: blur(12px) saturate(140%);
}

.step-header__icon-svg {
  width: 22px;
  height: 22px;
}

.step-header__copy {
  display: grid;
  gap: 2px;
}

.step-header__eyebrow {
  color: rgba(232, 236, 255, 0.94);
  font-size: 15px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.03em;
}

.step-header__title {
  margin: 0;
  color: rgba(204, 213, 245, 0.56);
  font-size: 14px;
  font-weight: 500;
  line-height: 1.25;
  letter-spacing: -0.015em;
}

.step-header__eta {
  flex-shrink: 0;
  margin-top: 0;
  transform: translateY(-1px);
  color: rgba(188, 198, 238, 0.72);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1;
}

.step-header__progress {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.step-header__progress-rail,
.step-header__progress-fill {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(2px);
  height: 3px;
  border-radius: 999px;
}

.step-header__progress-rail {
  background: linear-gradient(
    90deg,
    rgba(113, 129, 201, 0.12),
    rgba(69, 79, 129, 0.12)
  );
}

.step-header__progress-fill {
  right: auto;
  width: 0;
  background: linear-gradient(
    90deg,
    rgba(151, 166, 255, 0.98),
    rgba(119, 138, 255, 0.92)
  );
  box-shadow:
    0 0 14px rgba(127, 144, 255, 0.18),
    0 0 24px rgba(90, 108, 230, 0.06);
  transition: width 220ms ease-in-out;
}

.step-header__step {
  border: 0;
  background: transparent;
  padding: 0 0 22px;
  color: rgba(165, 174, 210, 0.42);
  font-size: 17px;
  font-weight: 800;
  letter-spacing: 0.18em;
  transition:
    color 220ms ease,
    transform 220ms ease;
}

.step-header__step.is-clickable {
  cursor: pointer;
}

.step-header__step.is-done,
.step-header__step.is-active {
  color: rgba(245, 247, 255, 0.96);
}

.step-header__step.is-active {
  transform: translateY(-1px);
}

.step-header__step:disabled {
  pointer-events: none;
}

@media (max-width: 560px) {
  .step-header__icon {
    width: 48px;
    height: 48px;
    flex-basis: 48px;
    border-radius: 16px;
  }

  .step-header__icon-svg {
    width: 20px;
    height: 20px;
  }

  .step-header__eyebrow {
    font-size: 14px;
  }

  .step-header__title {
    font-size: 13px;
  }

  .step-header__eta {
    font-size: 12px;
  }

  .step-header__step {
    font-size: 16px;
    padding-bottom: 20px;
  }

  .step-header__progress-rail,
  .step-header__progress-fill {
    transform: translateY(1px);
  }
}
</style>