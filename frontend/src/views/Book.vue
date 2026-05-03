<template>
  <main class="booking-page">
    <div class="booking-shell">
      <section class="booking-hero" aria-label="Izbor datuma">
        <nav class="booking-hero__nav" aria-label="Navigacija">
          <img
            class="hero-logo"
            src="@/assets/img/logoslika.png"
            alt="Studio logo"
          />

          <button class="nav-info" type="button">
            Info
          </button>
        </nav>

        <div class="hero-intro">
          <h1>Rezervacija na klik.</h1>
          <p>Izaberi termin koji ti najviše odgovara.</p>
        </div>

        <section class="quick-card" aria-label="Najraniji slobodan termin">
          <div class="quick-card-wrap">
            <div class="quick-card__top">
              <span>Najraniji slobodan termin</span>
            </div>

            <div class="quick-card__main">
              <div>
                <strong>{{ quickSlot.time }}</strong>

                <p>
                  <span class="quick-card__meta-item">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                    {{ quickSlot.barberName }}
                  </span>

                  <span class="quick-card__meta-item">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                      />
                    </svg>
                    {{ formatDate(quickSlot.date) }}
                  </span>
                </p>
              </div>

              <button
                class="quick-card__button"
                type="button"
                @click="reserveQuickSlot"
              >
                Rezerviši

                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>
      </section>

      <div class="hero-calendar">
        <div class="section-head">
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
            :class="{ active: selectedDate === day.iso }"
            @click="selectDate(day.iso)"
          >
            <span>{{ day.weekday }}</span>
            <strong>{{ day.day }}</strong>
            <small>{{ day.month }}</small>
          </button>
        </div>
      </div>

      <section
        ref="barberSectionRef"
        class="booking-section booking-section--barbers"
        :class="{
          muted: !selectedDate,
          revealed: selectedDate,
          completed: selectedBarberId
        }"
      >
        <button
          v-if="!selectedDate"
          class="section-lock"
          type="button"
          aria-label="Prvo izaberi datum"
          @click="scrollToDates"
        ></button>

        <header class="section-head section-head--compact">
          <h2>Frizer</h2>

          <span class="section-count">
            {{ barbers.length }} dostupna
          </span>
        </header>

        <div class="barber-list">
          <button
            v-for="barber in barbers"
            :key="barber.id"
            type="button"
            class="barber-row"
            :class="{ active: selectedBarberId === barber.id }"
            @click="selectBarber(barber.id)"
          >
            <div class="barber-img">
              <img :src="barber.image" :alt="barber.name" />
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

                {{ barber.nextAvailable }}
              </div>
            </div>
          </button>
        </div>
      </section>

      <section
        ref="timeSectionRef"
        class="booking-section booking-section--slots"
        :class="{
          muted: !selectedDate || !selectedBarberId,
          revealed: selectedDate && selectedBarberId,
          completed: selectedTime
        }"
      >
        <button
          v-if="!selectedDate || !selectedBarberId"
          class="section-lock"
          type="button"
          aria-label="Prvo izaberi datum i frizera"
          @click="scrollToMissingSection"
        ></button>

        <header class="section-head section-head--slots">
          <div class="slot-head-copy">
            <div class="slot-head-row">
              <h2>Termin</h2>

              <div class="slot-toggle-mini" :class="selectedPeriod">
                <div class="slot-toggle-mini__highlight"></div>

                <button
                  type="button"
                  class="slot-toggle-mini__item"
                  :class="{ active: selectedPeriod === 'morning' }"
                  @click="selectedPeriod = 'morning'"
                >
                  Prepodne
                  <span>{{ morningSlots.length }}</span>
                </button>

                <button
                  type="button"
                  class="slot-toggle-mini__item"
                  :class="{ active: selectedPeriod === 'afternoon' }"
                  @click="selectedPeriod = 'afternoon'"
                >
                  Popodne
                  <span>{{ afternoonSlots.length }}</span>
                </button>
              </div>
            </div>

            <p>Izaberi slobodan termin</p>
          </div>
        </header>

        <div class="time-rail">
          <button
            v-for="slot in visibleSlots"
            :key="slot"
            type="button"
            class="time-chip"
            :class="{ active: selectedTime === slot }"
            @click="selectedTime = slot"
          >
            {{ slot }}
          </button>
        </div>
      </section>
    </div>

    <footer
      class="booking-bottom"
      :class="{ 'is-ready': canConfirm, 'is-disabled': !canConfirm }"
    >
      <div class="bottom-summary" aria-label="Pregled izabranog termina">
        <span :class="{ filled: selectedDateLabel }">
          {{ selectedDateLabel || "Dan" }}
        </span>

        <i></i>

        <span :class="{ filled: selectedBarber }">
          {{ selectedBarber?.name || "Frizer" }}
        </span>

        <i></i>

        <span :class="{ filled: selectedTime }">
          {{ selectedTime || "Vreme" }}
        </span>
      </div>

      <button
        class="confirm-button"
        type="button"
        :disabled="!canConfirm"
        @click="confirmBooking"
      >
        {{ canConfirm ? "Potvrdi termin" : nextActionLabel }}
      </button>
    </footer>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

type Barber = {
  id: number;
  name: string;
  image: string;
  nextAvailable: string;
};

type Period = "morning" | "afternoon";

const barberSectionRef = ref<HTMLElement | null>(null);
const timeSectionRef = ref<HTMLElement | null>(null);

const selectedDate = ref<string | null>(null);
const selectedBarberId = ref<number | null>(null);
const selectedTime = ref<string | null>(null);
const selectedPeriod = ref<Period>("morning");
const showSheet = ref(false);

const barbers: Barber[] = [
  {
    id: 1,
    name: "Pera",
    image:
      "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=300&q=80",
    nextAvailable: "Najranije 09:00",
  },
  {
    id: 2,
    name: "Mirko",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    nextAvailable: "Najranije 10:30",
  },
  {
    id: 3,
    name: "Stefan",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
    nextAvailable: "Najranije 12:00",
  },
];

const quickSlot = {
  date: toIso(addDays(startOfDay(new Date()), 1)),
  time: "09:00",
  barberName: "Pera",
  service: "Šišanje",
};

const availableDays = computed(() => {
  const today = startOfDay(new Date());

  return Array.from({ length: 14 }, (_, index) => {
    const date = addDays(today, index);

    return {
      iso: toIso(date),
      weekday: new Intl.DateTimeFormat("en-US", {
        weekday: "short",
      })
        .format(date)
        .toUpperCase(),
      day: new Intl.DateTimeFormat("sr-Latn-RS", {
        day: "2-digit",
      }).format(date),
      month: new Intl.DateTimeFormat("en-US", {
        month: "short",
      })
        .format(date)
        .toUpperCase(),
    };
  });
});

const morningSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
];

const afternoonSlots = ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

const visibleSlots = computed(() => {
  return selectedPeriod.value === "morning" ? morningSlots : afternoonSlots;
});

const selectedBarber = computed(() => {
  return barbers.find((barber) => barber.id === selectedBarberId.value) ?? null;
});

const selectedDateLabel = computed(() => {
  if (!selectedDate.value) return "";

  return formatDate(selectedDate.value);
});

const canConfirm = computed(() => {
  return !!selectedDate.value && !!selectedBarberId.value && !!selectedTime.value;
});

const nextActionLabel = computed(() => {
  if (!selectedDate.value) return "Izaberi dan";
  if (!selectedBarberId.value) return "Izaberi frizera";
  if (!selectedTime.value) return "Izaberi vreme";

  return "Potvrdi termin";
});

function selectDate(date: string) {
  selectedDate.value = date;
  selectedBarberId.value = null;
  selectedTime.value = null;
}

function selectBarber(id: number) {
  selectedBarberId.value = id;
  selectedTime.value = null;
}

function reserveQuickSlot() {
  const barber = barbers.find((item) => item.name === quickSlot.barberName);

  selectedDate.value = quickSlot.date;
  selectedBarberId.value = barber?.id ?? 1;
  selectedTime.value = quickSlot.time;
  showSheet.value = true;
}

function confirmBooking() {
  if (!canConfirm.value) return;
  showSheet.value = true;
}

function scrollToDates() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function scrollToMissingSection() {
  if (!selectedDate.value) {
    scrollToDates();
    return;
  }

  if (!selectedBarberId.value) {
    barberSectionRef.value?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

function formatDate(iso: string) {
  const date = new Date(iso);

  return new Intl.DateTimeFormat("sr-Latn-RS", {
    day: "numeric",
    month: "short",
  })
    .format(date)
    .replace(".", "");
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return startOfDay(result);
}

function toIso(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
</script>