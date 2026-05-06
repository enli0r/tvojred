<template>
  <div class="booking-result-inside">
    <div class="booking-result-visual" :class="`is-${status}`">
      <div v-if="status === 'loading'" class="booking-result-spinner"></div>

      <svg
        v-else-if="status === 'success'"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M20 6L9 17L4 12"
          stroke="currentColor"
          stroke-width="2.4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>

      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 8V12M12 16H12.01M21 12A9 9 0 1 1 3 12A9 9 0 0 1 21 12Z"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <div class="booking-result-copy">
      <span>{{ eyebrow }}</span>
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
    </div>

    <div class="booking-result-summary">
      <div class="booking-result-row">
        <span>Dan</span>
        <strong>{{ date }}</strong>
      </div>

      <div class="booking-result-row">
        <span>Vreme</span>
        <strong>{{ time }}</strong>
      </div>

      <div class="booking-result-row">
        <span>Frizer</span>
        <strong>{{ barberName }}</strong>
      </div>
    </div>

    <div class="booking-result-actions">
      <button
        v-if="status === 'success'"
        class="booking-result-primary"
        type="button"
        @click="emit('close')"
      >
        Gotovo
      </button>

      <template v-else-if="status === 'loading'">
        <button class="booking-result-primary is-disabled" type="button" disabled>
          Potvrđujem...
        </button>
      </template>

      <template v-else>
        <button class="booking-result-secondary" type="button" @click="emit('close')">
          Zatvori
        </button>

        <button class="booking-result-primary" type="button" @click="emit('retry')">
          Pokušaj ponovo
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

type BookingResultStatus = "loading" | "success" | "error" | "conflict";

const props = defineProps<{
  status: BookingResultStatus;
  message: string | null;
  date: string;
  time: string;
  barberName: string;
}>();

const emit = defineEmits<{
  (e: "retry"): void;
  (e: "close"): void;
}>();

const eyebrow = computed(() => {
  if (props.status === "loading") return "Potvrda termina";
  if (props.status === "success") return "Rezervacija potvrđena";
  if (props.status === "conflict") return "Termin zauzet";
  return "Greška";
});

const title = computed(() => {
  if (props.status === "loading") return "Sačekaj trenutak";
  if (props.status === "success") return "Termin je potvrđen";
  if (props.status === "conflict") return "Ovaj termin više nije slobodan";
  return "Nismo uspeli da potvrdimo termin";
});

const description = computed(() => {
  if (props.message) return props.message;

  if (props.status === "loading") {
    return "Proveravamo dostupnost i potvrđujemo rezervaciju.";
  }

  if (props.status === "success") {
    return "Tvoja rezervacija je uspešno sačuvana.";
  }

  if (props.status === "conflict") {
    return "Neko je u međuvremenu zauzeo ovaj termin. Izaberi drugi slobodan termin.";
  }

  return "Došlo je do greške. Pokušaj ponovo.";
});
</script>

<style scoped lang="scss">
.booking-result-inside {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;

}

.booking-result-visual {
  width: 76px;
  height: 76px;
  margin: 4px auto 18px;
  border-radius: 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(145deg, #eaf1f8 0%, #f7f9fb 100%);
  color: #3f6588;

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.95),
    inset 0 -1px 0 rgba(20, 34, 50, 0.06);

  svg {
    width: 34px;
    height: 34px;
  }

  &.is-success {
    background: linear-gradient(145deg, #e7f4ee 0%, #f7fbf9 100%);
    color: #1d8f61;
  }

  &.is-error,
  &.is-conflict {
    background: linear-gradient(145deg, #fff0ef 0%, #fffafa 100%);
    color: #c94b43;
  }
}

.booking-result-spinner {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  border: 3px solid rgba(63, 101, 136, 0.18);
  border-top-color: #3f6588;
  animation: bookingResultSpin 0.8s linear infinite;
}

.booking-result-copy {
  text-align: center;
  margin-bottom: 22px;

  span {
    display: block;
    margin-bottom: 8px;

    color: #7c8a9a;
    font-size: 10px;
    line-height: 1;
    font-weight: 850;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  h2 {
    margin: 0;

    color: #111b29;
    font-size: 25px;
    line-height: 1.05;
    font-weight: 850;
    letter-spacing: -0.045em;
  }

  p {
    max-width: 285px;
    margin: 8px auto 0;

    color: #748190;
    font-size: 14px;
    line-height: 1.35;
    font-weight: 560;
    letter-spacing: -0.025em;
  }
}

.booking-result-summary {
  margin: 0;
  // border-top: 1px solid rgba(17, 27, 41, 0.055);
  // border-bottom: 1px solid rgba(17, 27, 41, 0.055);
}

.booking-result-row {
  min-height: 52px;
  // padding: 0 20px;
  // border: 1px solid red;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;

  border-bottom: 1px solid rgba(17, 27, 41, 0.055);

  &:last-child {
    border-bottom: none;
  }

  span {
    color: #7b8795;
    font-size: 15px;
    line-height: 1;
    font-weight: 600;
    letter-spacing: -0.025em;
  }

  strong {
    color: #2f3d4c;
    font-size: 15px;
    line-height: 1.1;
    font-weight: 720;
    letter-spacing: -0.035em;
    text-align: right;
  }
}

.booking-result-actions {
  margin-top: auto;
  padding-top: 22px;
  display: flex;
  gap: 12px;
  width: 100%;
  // border: 1px solid red;
}

.booking-result-primary,
.booking-result-secondary {
  height: 56px;
  border: none;
  border-radius: 18px;

  font-size: 16px;
  font-weight: 780;
  letter-spacing: -0.035em;
  width: 100%;

  transition:
    transform 0.14s ease,
    opacity 0.16s ease;

  &:active {
    transform: scale(0.982);
  }
}

.booking-result-primary {
  flex: 1;
  color: #fff;
  background: linear-gradient(180deg, #111a26 0%, #0c131d 100%);

  &.is-disabled {
    opacity: 0.78;
  }
}

.booking-result-secondary {
  flex: 0 0 116px;
  color: #536273;
  background: #eef3f7;
}

@keyframes bookingResultSpin {
  to {
    transform: rotate(360deg);
  }
}
</style>