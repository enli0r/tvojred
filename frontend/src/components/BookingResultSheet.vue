<template>
  <div class="booking-result">
    <div
      class="booking-result__icon"
      :class="{
        'booking-result__icon--loading': status === 'loading',
        'booking-result__icon--success': status === 'success',
        'booking-result__icon--error': status === 'error' || status === 'conflict',
      }"
    >
      <span v-if="status === 'loading'" class="loader"></span>

      <svg
        v-else-if="status === 'success'"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>

      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>

    <div class="booking-result__copy">
      <span class="booking-result__kicker">
        {{ kicker }}
      </span>

      <h2>
        {{ title }}
      </h2>

      <p>
        {{ description }}
      </p>
    </div>

    <div v-if="status === 'success'" class="booking-result__summary">
      <div class="summary-row">
        <span>Frizer</span>
        <strong>{{ barberName }}</strong>
      </div>

      <div class="summary-row">
        <span>Datum</span>
        <strong>{{ formattedDate }}</strong>
      </div>

      <div class="summary-row">
        <span>Termin</span>
        <strong>{{ formattedTime }}</strong>
      </div>
    </div>

    <div class="booking-result__actions">
      <button
        v-if="status === 'success'"
        type="button"
        class="primary-btn"
        @click="$emit('finish')"
      >
        Završi
      </button>

      <template v-else-if="status === 'conflict'">
        <button type="button" class="secondary-btn" @click="$emit('chooseAnother')">
          Izaberi drugi termin
        </button>

        <button type="button" class="primary-btn" @click="$emit('retry')">
          Pokušaj ponovo
        </button>
      </template>

      <template v-else-if="status === 'error'">
        <button type="button" class="secondary-btn" @click="$emit('close')">
          Zatvori
        </button>

        <button type="button" class="primary-btn" @click="$emit('retry')">
          Pokušaj ponovo
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

type BookingStatus = "loading" | "success" | "error" | "conflict";

type Appointment = {
  id?: number;
  start_time: string;
  end_time: string;
};

const props = defineProps<{
  status: BookingStatus;
  appointment: Appointment | null;
  barberName?: string | null;
  message?: string | null;
}>();

defineEmits<{
  (e: "finish"): void;
  (e: "retry"): void;
  (e: "close"): void;
  (e: "chooseAnother"): void;
}>();

const kicker = computed(() => {
  if (props.status === "loading") return "Zakazivanje";
  if (props.status === "success") return "Uspešno";
  if (props.status === "conflict") return "Termin zauzet";
  return "Greška";
});

const title = computed(() => {
  if (props.status === "loading") return "Potvrđujemo tvoj termin";
  if (props.status === "success") return "Termin je zakazan";
  if (props.status === "conflict") return "Neko je već zauzeo ovaj termin";
  return "Zakazivanje nije uspelo";
});

const description = computed(() => {
  if (props.message) return props.message;

  if (props.status === "loading") {
    return "Sačekaj trenutak dok proverimo dostupnost i završimo rezervaciju.";
  }

  if (props.status === "success") {
    return "Tvoja rezervacija je uspešno sačuvana.";
  }

  if (props.status === "conflict") {
    return "Ovaj termin više nije dostupan. Izaberi drugi slobodan termin.";
  }

  return "Došlo je do greške. Pokušaj ponovo za nekoliko trenutaka.";
});

const barberName = computed(() => {
  return props.barberName || "Izabrani frizer";
});

const formattedDate = computed(() => {
  if (!props.appointment?.start_time) return "-";

  const date = new Date(props.appointment.start_time);

  return new Intl.DateTimeFormat("sr-Latn-RS", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(date);
});

const formattedTime = computed(() => {
  if (!props.appointment?.start_time) return "-";

  const date = new Date(props.appointment.start_time);

  return new Intl.DateTimeFormat("sr-Latn-RS", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
});
</script>

<style scoped lang="scss">
.booking-result {
  padding: 8px 2px 2px;
  text-align: center;
}

.booking-result__icon {
  width: 76px;
  height: 76px;
  margin: 8px auto 20px;
  border-radius: 26px;
  display: grid;
  place-items: center;

  svg {
    width: 34px;
    height: 34px;
  }
}

.booking-result__icon--loading {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 18px 44px rgba(0, 0, 0, 0.22);
}

.booking-result__icon--success {
  color: #dff7ea;
  background: linear-gradient(180deg, rgba(47, 125, 91, 0.95), rgba(28, 88, 64, 0.95));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.16),
    0 18px 44px rgba(31, 108, 75, 0.22);
}

.booking-result__icon--error {
  color: #ffecec;
  background: linear-gradient(180deg, rgba(150, 58, 58, 0.95), rgba(104, 35, 35, 0.95));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.14),
    0 18px 44px rgba(120, 30, 30, 0.2);
}

.loader {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: 3px solid rgba(255, 255, 255, 0.18);
  border-top-color: rgba(255, 255, 255, 0.82);
  animation: spin 0.75s linear infinite;
}

.booking-result__copy {
  max-width: 330px;
  margin: 0 auto;
}

.booking-result__kicker {
  display: inline-block;
  margin-bottom: 7px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(238, 243, 251, 0.55);
}

.booking-result__copy h2 {
  margin: 0;
  font-size: 25px;
  line-height: 1.08;
  letter-spacing: -0.04em;
  color: #eef3fb;
}

.booking-result__copy p {
  margin: 10px 0 0;
  font-size: 14px;
  line-height: 1.5;
  color: rgba(238, 243, 251, 0.62);
}

.booking-result__summary {
  margin: 22px 0 18px;
  padding: 12px;
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.025));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    inset 0 -1px 0 rgba(255, 255, 255, 0.025);
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 11px 4px;

  & + & {
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }

  span {
    font-size: 13px;
    color: rgba(238, 243, 251, 0.52);
  }

  strong {
    font-size: 14px;
    color: #eef3fb;
    text-align: right;
  }
}

.booking-result__actions {
  display: flex;
  gap: 10px;
  margin-top: 18px;
}

.primary-btn,
.secondary-btn {
  width: 100%;
  min-height: 52px;
  border: 0;
  border-radius: 18px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
}

.primary-btn {
  color: #f7fbff;
  background: linear-gradient(180deg, #405d7a, #2f465f);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.16),
    0 16px 34px rgba(28, 47, 70, 0.24);
}

.secondary-btn {
  color: rgba(238, 243, 251, 0.78);
  background: rgba(255, 255, 255, 0.055);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.07),
    inset 0 1px 0 rgba(255, 255, 255, 0.055);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>