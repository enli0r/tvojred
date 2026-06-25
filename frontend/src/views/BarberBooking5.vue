<template>
  <div class="concept-v2-page">
    <div class="concept-v2-page__bg">
      <div class="bg-light bg-light--one"></div>
      <div class="bg-light bg-light--two"></div>
      <div class="bg-noise"></div>
    </div>

    <div class="booking-page concept-v2-booking">
      <div class="booking-screen">
        <main class="page-content">
          <!-- HERO + QUICK BOOK -->
          <section class="booking-hero">
            <div class="booking-hero__copy">
              <span>Online zakazivanje</span>
              <h1>Zakaži svoj termin.</h1>
              <p>Izaberi uslugu, datum, frizera i slobodno vreme — bez poziva i čekanja.</p>
            </div>

            <button
              v-if="showQuickBookHero"
              type="button"
              class="quick-book-hero"
              @click="bookQuickOption"
            >
              <strong class="quick-book-hero__time">
                {{ quickBookingTime }}
              </strong>

              <span class="quick-book-hero__copy">
                <span>Najraniji slobodan termin</span>
                <strong>
                  {{ quickBookingBarberName }} · {{ quickBookingDateLabel }}
                </strong>
              </span>

              <span class="quick-book-hero__action">
                Zakaži
              </span>
            </button>
          </section>

          <div class="booking-stack">
            <!-- DATUM -->
            <section class="booking-block booking-block--calendar">
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
                    :class="{ active: selectedDate === day.iso }"
                    @click="selectDate(day.iso)"
                  >
                    <span>{{ day.weekday }}</span>
                    <strong>{{ day.day }}</strong>
                    <small>{{ day.month }}</small>
                  </button>
                </div>
              </section>
            </section>

            <!-- USLUGA -->
            <section class="booking-block booking-block--services">
              <section class="services-section">
                <header class="section-head-service section-head--compact">
                  <div class="section-head-service__main">
                    <div class="section-head-service__icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
                        <path
                          d="M3 7l4-4h6l8 8-10 10-8-8V7z"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <circle cx="8.5" cy="8.5" r="1.35" fill="currentColor" stroke="none" />
                      </svg>
                    </div>

                    <div>
                      <h2>Usluga</h2>
                      <p>Izaberi šta želiš</p>
                    </div>
                  </div>

                  <span class="section-count">
                    {{ services.length }} usluga
                  </span>
                </header>

                <div class="service-list">
                  <button
                    v-for="service in services"
                    :key="service.id"
                    type="button"
                    class="service-row"
                    :class="{ active: selectedService?.id === service.id }"
                    @click="selectService(service)"
                  >
                    <span class="service-row__accent"></span>

                    <span class="service-row__main">
                      <strong>{{ service.name }}</strong>
                      <small>{{ service.desc }}</small>
                    </span>

                    <span class="service-row__side">
                      <small>{{ service.duration }}</small>
                      <strong>{{ service.price }}</strong>
                    </span>

                    <span class="service-row__check">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path
                          d="M5 13l4 4L19 7"
                          stroke="currentColor"
                          stroke-width="2.6"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
              </section>
            </section>

            <!-- FRIZER -->
            <section
              class="booking-block booking-block--barbers"
              :class="{ 'is-muted': !selectedDate }"
            >
              <div v-if="!selectedDate" class="booking-block__lock"></div>

              <section class="booking-section booking-section--barbers">
                <header class="section-head-barber section-head--compact">
                  <div class="section-head-barber__main">
                    <div class="section-head-barber__icon" aria-hidden="true">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m7.848 8.25 1.536.887M7.848 8.25a3 3 0 1 1-5.196-3 3 3 0 0 1 5.196 3Zm1.536.887a2.165 2.165 0 0 1 1.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 1 1-5.196 3 3 3 0 0 1 5.196-3Zm1.536-.887a2.165 2.165 0 0 0 1.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863 2.077-1.199m0-3.328a4.323 4.323 0 0 1 2.068-1.379l5.325-1.628a4.5 4.5 0 0 1 2.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.33 4.33 0 0 0 10.607 12m3.736 0 7.794 4.5-.802.215a4.5 4.5 0 0 1-2.48-.043l-5.326-1.629a4.324 4.324 0 0 1-2.068-1.379M14.343 12l-2.882 1.664"
                        />
                      </svg>
                    </div>

                    <div>
                      <h2>Frizer</h2>
                      <p>Slobodni frizeri za ovaj dan</p>
                    </div>
                  </div>

                  <span class="section-count">{{ barbers.length }} dostupna</span>
                </header>

                <div class="barber-list">
                  <button
                    v-for="barber in barbers"
                    :key="barber.id"
                    type="button"
                    class="barber-row"
                    :class="{ active: selectedBarber?.id === barber.id }"
                    :disabled="!selectedDate"
                    @click="selectBarber(barber)"
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
                        <span>{{ barber.tagOne }}</span>
                        <i></i>
                        <span>{{ barber.tagTwo }}</span>
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

                        {{ selectedBarber?.id === barber.id ? "Izabrano" : "Dostupan danas" }}
                      </div>
                    </div>
                  </button>
                </div>
              </section>
            </section>

            <!-- TERMIN -->
            <section
              class="booking-block booking-block--appointments"
              :class="{ 'is-muted': !selectedDate || !selectedBarber }"
            >
              <section class="appointments-section">
                <header class="section-head-app section-head--slots">
                  <div class="slot-head-copy">
                    <div class="slot-head-row">
                      <div class="slot-head-main">
                        <div class="section-head-app__icon" aria-hidden="true">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="size-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                        </div>

                        <div class="section-text">
                          <h2>Termin</h2>
                          <p>Izaberi slobodan termin</p>
                        </div>
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
                    <div v-if="filteredItems.length === 0" class="empty-state">
                      Nema slobodnih termina.
                    </div>

                    <div v-else class="slot-grid">
                      <button
                        v-for="appointment in filteredItems"
                        :key="appointment.start_time"
                        type="button"
                        class="slot-pill"
                        :class="{
                          active: selectedAppointment?.start_time === appointment.start_time,
                        }"
                        @click="selectAppointment(appointment)"
                      >
                        <strong class="slot-pill__time">
                          {{ formatTime(appointment.start_time) }}
                        </strong>
                      </button>
                    </div>
                  </div>
                </Transition>
              </section>
            </section>
          </div>
        </main>
      </div>

      <!-- BOTTOM MENU -->
      <footer
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
            @click="bookAppointment"
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

      <!-- SUCCESS POPUP -->
      <Transition name="confirm-sheet">
        <div
          v-if="showSuccessPopup"
          class="confirm-overlay"
          role="presentation"
          @click.self="closeSuccessPopup"
        >
          <section
            class="confirm-page confirm-page--success"
            role="dialog"
            aria-modal="true"
            aria-label="Termin je uspešno zakazan"
          >
            <div class="confirm-page__handle"></div>

            <main class="confirm-content">
              <div class="success-card">
                <div class="success-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 6 9 17l-5-5"
                      stroke="currentColor"
                      stroke-width="2.4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>

                <span>Uspešno zakazano</span>
                <h2>Termin je potvrđen</h2>
                <p>
                  Tvoj termin je uspešno zakazan. Detalji rezervacije su prikazani ispod.
                </p>

                <section class="confirm-summary success-summary">
                  <div class="confirm-summary-row">
                    <span>Dan</span>
                    <strong>{{ selectedDateLong }}</strong>
                  </div>

                  <div class="confirm-summary-row">
                    <span>Usluga</span>
                    <strong>{{ selectedService?.name || "-" }}</strong>
                  </div>

                  <div class="confirm-summary-row">
                    <span>Vreme</span>
                    <strong>{{ selectedAppointmentTime || "-" }}</strong>
                  </div>

                  <div class="confirm-summary-row">
                    <span>Frizer</span>
                    <strong>{{ selectedBarber?.name || "-" }}</strong>
                  </div>

                  <div class="confirm-summary-row">
                    <span>Studio</span>
                    <strong>Fade Studio</strong>
                  </div>
                </section>

                <button class="success-close-btn" type="button" @click="closeSuccessPopup">
                  U redu
                </button>
              </div>
            </main>
          </section>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

type Period = "morning" | "afternoon";

type Service = {
  id: string;
  name: string;
  desc: string;
  duration: string;
  price: string;
};

type Barber = {
  id: number;
  name: string;
  tagOne: string;
  tagTwo: string;
  image: string;
};

type Appointment = {
  id: number;
  start_time: string;
  end_time: string;
};

const selectedDate = ref<string | null>(null);
const selectedService = ref<Service | null>(null);
const selectedBarber = ref<Barber | null>(null);
const selectedAppointment = ref<Appointment | null>(null);
const selectedPeriod = ref<Period>("morning");
const showSuccessPopup = ref(false);

const services = ref<Service[]>([
  {
    id: "cut",
    name: "Klasično šišanje",
    desc: "Makaze i mašinica, finiš na suvo",
    duration: "30 min",
    price: "800 RSD",
  },
  {
    id: "fade",
    name: "Fade šišanje",
    desc: "Precizan prelaz — skin ili taper",
    duration: "40 min",
    price: "1.000 RSD",
  },
  {
    id: "beard",
    name: "Sređivanje brade",
    desc: "Linija, mašinica i topli peškir",
    duration: "20 min",
    price: "500 RSD",
  },
  {
    id: "combo",
    name: "Šišanje + brada",
    desc: "Kompletan tretman i stajling",
    duration: "50 min",
    price: "1.200 RSD",
  },
  {
    id: "kids",
    name: "Dečije šišanje",
    desc: "Za klince do 12 godina",
    duration: "25 min",
    price: "600 RSD",
  },
  {
    id: "shave",
    name: "Klasično brijanje",
    desc: "Britva i topli peškir",
    duration: "30 min",
    price: "700 RSD",
  },
]);

selectedService.value = services.value[0];

const barbers = ref<Barber[]>([
  {
    id: 1,
    name: "Marko Petrović",
    tagOne: "Fade",
    tagTwo: "Beard",
    image:
      "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    name: "Nikola Jovanović",
    tagOne: "Classic",
    tagTwo: "Fade",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Stefan Ilić",
    tagOne: "Skin fade",
    tagTwo: "Styling",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    name: "Luka Stojanović",
    tagOne: "Kids",
    tagTwo: "Beard",
    image:
      "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=400&q=80",
  },
]);

const availableDays = computed(() => {
  return Array.from({ length: 14 }, (_, index) => {
    const date = addDays(startOfDay(new Date()), index);
    const iso = toIso(date);

    return {
      iso,
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

const quickBooking = computed(() => {
  const date = availableDays.value[1]?.iso || availableDays.value[0]?.iso;
  const barber = barbers.value[0];

  if (!date || !barber) return null;

  const start = makeDateTime(date, 9, 30);
  const end = new Date(start);
  end.setMinutes(end.getMinutes() + 30);

  return {
    date,
    barber,
    appointment: {
      id: 999,
      start_time: toLocalIsoDateTime(start),
      end_time: toLocalIsoDateTime(end),
    },
  };
});

const showQuickBookHero = computed(() => {
  return !!quickBooking.value;
});

const quickBookingDateLabel = computed(() => {
  if (!quickBooking.value) return "";

  const bookingDate = new Date(`${quickBooking.value.date}T00:00:00`);

  return new Intl.DateTimeFormat("sr-Latn-RS", {
    day: "numeric",
    month: "long",
  }).format(bookingDate);
});

const quickBookingTime = computed(() => {
  if (!quickBooking.value) return "";

  return formatTime(quickBooking.value.appointment.start_time);
});

const quickBookingBarberName = computed(() => {
  return quickBooking.value?.barber.name ?? "";
});

const availableAppointments = computed<Appointment[]>(() => {
  if (!selectedDate.value || !selectedBarber.value) return [];

  const baseSlots = [
    [9, 0],
    [9, 30],
    [10, 0],
    [10, 30],
    [11, 0],
    [11, 30],
    [12, 30],
    [13, 0],
    [14, 0],
    [14, 30],
    [15, 30],
    [16, 0],
    [17, 0],
    [17, 30],
    [18, 0],
  ];

  return baseSlots.map(([hour, minute], index) => {
    const start = makeDateTime(selectedDate.value!, hour, minute);
    const endDate = new Date(start);
    endDate.setMinutes(endDate.getMinutes() + 30);

    return {
      id: selectedBarber.value!.id * 100 + index,
      start_time: toLocalIsoDateTime(start),
      end_time: toLocalIsoDateTime(endDate),
    };
  });
});

const canShowSlots = computed(() => {
  return !!selectedDate.value && !!selectedBarber.value;
});

function getPeriod(iso: string): Period {
  const d = new Date(iso);
  const totalMinutes = d.getHours() * 60 + d.getMinutes();

  return totalMinutes < 12 * 60 ? "morning" : "afternoon";
}

const morningItems = computed(() => {
  return availableAppointments.value.filter(
    (appointment) => getPeriod(appointment.start_time) === "morning"
  );
});

const afternoonItems = computed(() => {
  return availableAppointments.value.filter(
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

const selectedDateLong = computed(() => {
  if (!selectedDate.value) return "-";

  const d = new Date(`${selectedDate.value}T00:00:00`);
  const formatted = new Intl.DateTimeFormat("sr-Latn-RS", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(d);

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
});

const selectedDateShort = computed(() => {
  if (!selectedDate.value) return "";

  const d = new Date(`${selectedDate.value}T00:00:00`);

  return new Intl.DateTimeFormat("sr-Latn-RS", {
    day: "numeric",
    month: "short",
  }).format(d);
});

const selectedAppointmentTime = computed(() => {
  if (!selectedAppointment.value?.start_time) return "";

  return formatTime(selectedAppointment.value.start_time);
});

const hasFullSummary = computed(() => {
  return (
    !!selectedDate.value &&
    !!selectedService.value &&
    !!selectedBarber.value &&
    !!selectedAppointment.value
  );
});

const isPrimaryDisabled = computed(() => {
  return !hasFullSummary.value;
});

const summaryTitle = computed(() => {
  if (!hasFullSummary.value) {
    return "Izaberi termin";
  }

  return `${selectedDateShort.value} · ${selectedBarber.value?.name}`;
});

const summaryMeta = computed(() => {
  if (!hasFullSummary.value) {
    return "Usluga, dan, frizer i vreme";
  }

  return `${selectedService.value?.name} · ${selectedAppointmentTime.value}`;
});

watch(selectedDate, () => {
  selectedBarber.value = null;
  selectedAppointment.value = null;
  selectedPeriod.value = "morning";
});

watch(selectedBarber, () => {
  selectedAppointment.value = null;
  selectedPeriod.value = "morning";
});

watch(
  availableAppointments,
  () => {
    if (
      selectedPeriod.value === "morning" &&
      morningCount.value === 0 &&
      afternoonCount.value > 0
    ) {
      selectedPeriod.value = "afternoon";
      selectedAppointment.value = null;
    } else if (
      selectedPeriod.value === "afternoon" &&
      afternoonCount.value === 0 &&
      morningCount.value > 0
    ) {
      selectedPeriod.value = "morning";
      selectedAppointment.value = null;
    }
  },
  { immediate: true }
);

function selectDate(iso: string) {
  selectedDate.value = iso;
}

function selectService(service: Service) {
  selectedService.value = service;
}

function selectBarber(barber: Barber) {
  if (!selectedDate.value) return;

  selectedBarber.value = barber;
}

function selectAppointment(appointment: Appointment) {
  selectedAppointment.value = appointment;
}

function selectPeriod(period: Period) {
  selectedPeriod.value = period;
  selectedAppointment.value = null;
}

function bookQuickOption() {
  if (!quickBooking.value) return;

  selectedDate.value = quickBooking.value.date;
  selectedBarber.value = quickBooking.value.barber;

  setTimeout(() => {
    selectedAppointment.value = quickBooking.value?.appointment ?? null;
    selectedPeriod.value = "morning";
  }, 0);
}

function bookAppointment() {
  if (isPrimaryDisabled.value) return;

  showSuccessPopup.value = true;
}

function closeSuccessPopup() {
  showSuccessPopup.value = false;
}

function formatTime(iso: string) {
  const d = new Date(iso);

  return d.toLocaleTimeString("sr-Latn-RS", {
    hour: "2-digit",
    minute: "2-digit",
  });
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

function makeDateTime(isoDate: string, hour: number, minute: number) {
  const [year, month, day] = isoDate.split("-").map(Number);

  return new Date(year, month - 1, day, hour, minute, 0, 0);
}

function toLocalIsoDateTime(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}:00`;
}
</script>

<style scoped lang="scss">
.concept-v2-page {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  background: #f4f6f9;
}

.concept-v2-page__bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.bg-light {
  position: absolute;
  width: 260px;
  height: 260px;
  border-radius: 999px;
  filter: blur(50px);
  opacity: 0.35;
}

.bg-light--one {
  top: -80px;
  right: -90px;
  background: rgba(64, 93, 122, 0.18);
}

.bg-light--two {
  left: -120px;
  bottom: 80px;
  background: rgba(134, 173, 210, 0.18);
}

.bg-noise {
  position: absolute;
  inset: 0;
  opacity: 0.25;
}

.concept-v2-booking {
  min-height: 100vh;
  color: #151821;
  background: #f4f6f9;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display",
    "Segoe UI", sans-serif;
  position: relative;
  z-index: 1;
}

.page-content {
  max-width: 520px;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 18px 16px 150px;
}

.booking-stack {
  display: flex;
  flex-direction: column;
  gap: 42px;
}

.booking-block {
  position: relative;
  transition:
    opacity 0.24s ease,
    transform 0.24s ease,
    filter 0.24s ease;
}

.booking-block.is-muted {
  opacity: 0.55;
  transform: scale(0.9);
}

.booking-block__lock {
  position: absolute;
  inset: -12px;
  z-index: 5;
  border-radius: 32px;
}

button {
  font-family: inherit;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

button:disabled {
  cursor: not-allowed;
}

.booking-hero {
  display: grid;
  gap: 18px;
  margin-bottom: 42px;
  padding-top: 10px;
}

.booking-hero__copy {
  display: grid;
  gap: 8px;

  span {
    color: #64809c;
    font-size: 10px;
    line-height: 1;
    font-weight: 900;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  h1 {
    max-width: 360px;
    margin: 0;
    color: #111827;
    font-size: 34px;
    line-height: 0.96;
    font-weight: 850;
    letter-spacing: -0.075em;
  }

  p {
    max-width: 340px;
    margin: 0;
    color: rgba(35, 45, 65, 0.52);
    font-size: 14px;
    line-height: 1.35;
    font-weight: 620;
    letter-spacing: -0.025em;
  }
}

.quick-book-hero {
  appearance: none;
  width: 100%;
  min-height: 76px;
  padding: 12px 12px 12px 16px;
  border: 0;
  border-radius: 24px;

  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;

  background:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.74),
      rgba(247, 248, 255, 0.58)
    );

  box-shadow:
    inset 0 0 0 1px rgba(124, 140, 255, 0.08),
    0 10px 24px rgba(50, 60, 110, 0.06);

  transition:
    transform 0.18s ease,
    box-shadow 0.22s ease;

  &:active {
    transform: scale(0.99);
  }
}

.quick-book-hero__time {
  font-size: 25px;
  line-height: 1;
  font-weight: 850;
  letter-spacing: -0.07em;
  color: #151827;
}

.quick-book-hero__copy {
  min-width: 0;
  display: grid;
  gap: 5px;

  span {
    font-size: 9px;
    line-height: 1;
    font-weight: 850;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: rgba(65, 71, 98, 0.42);
  }

  strong {
    font-size: 13px;
    line-height: 1;
    font-weight: 760;
    letter-spacing: -0.025em;
    color: rgba(35, 41, 61, 0.62);

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.quick-book-hero__action {
  height: 38px;
  padding: 0 13px;
  border-radius: 999px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  color: #fff;
  font-size: 12px;
  font-weight: 850;
  letter-spacing: -0.015em;

  background: rgb(90, 117, 148);

  box-shadow: 0 8px 16px rgba(48, 72, 98, 0.18);
}

.hero-calendar {
  padding-bottom: 8px;
}

.section-head-calendar,
.section-head-service,
.section-head-barber,
.section-head-app {
  h2 {
    margin: 0;
    color: #151821;
    font-size: 18px;
    line-height: 1;
    font-weight: 750;
    letter-spacing: -0.06em;
  }

  p {
    margin: 3px 0 0;
    color: rgba(45, 51, 78, 0.48);
    font-size: 13px;
    line-height: 1.25;
    font-weight: 600;
    letter-spacing: -0.015em;
  }
}

.section-head-calendar {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 16px;
}

.section-head-service,
.section-head-barber {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

.section-head--compact {
  align-items: center;
}

.section-head-service__main,
.section-head-barber__main {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
}

.section-head-calendar__icon,
.section-head-service__icon,
.section-head-barber__icon,
.section-head-app__icon {
  width: 45px;
  height: 45px;
  flex: 0 0 45px;
  border-radius: 16px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #405d7a;
  background: #f9fbfd;

  box-shadow:
    inset 0 0 0 1px rgba(64, 93, 122, 0.08),
    0 1px 2px rgba(22, 34, 52, 0.035);

  svg {
    width: 22px;
    height: 22px;
    display: block;
    stroke-width: 1.9;
  }
}

.section-count {
  min-height: 28px;
  padding: 0 11px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  color: rgba(47, 70, 95, 0.9);
  background: rgba(64, 93, 122, 0.08);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.72),
    inset 0 0 0 1px rgba(64, 93, 122, 0.06);

  font-size: 12px;
  line-height: 1;
  font-weight: 800;
  letter-spacing: -0.015em;
  white-space: nowrap;
}

.date-rail {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    display: none;
  }
}

.date-card {
  flex: 0 0 72px;
  min-height: 98px;
  border: 0;
  border-radius: 24px;
  padding: 14px 10px;
  display: grid;
  justify-items: center;
  align-content: center;
  gap: 7px;

  color: rgba(29, 34, 50, 0.74);
  background: rgba(255, 255, 255, 1);

  box-shadow:
    0 1px 4px rgba(22, 34, 52, 0.05),
    0 1px 1px rgba(22, 34, 52, 0.02),
    inset 0 1px 0 rgba(255, 255, 255, 0.94);

  border: 1px solid rgba(64, 93, 122, 0.03);

  transition:
    transform 0.2s ease,
    background 0.22s ease,
    color 0.22s ease,
    border-color 0.22s ease;

  span,
  small {
    font-size: 10px;
    font-weight: 850;
    letter-spacing: 0.08em;
    line-height: 1;
  }

  strong {
    font-size: 24px;
    line-height: 0.9;
    font-weight: 850;
    letter-spacing: -0.08em;
  }

  &:active {
    transform: scale(0.975);
  }

  &.active {
    color: #fff;
    background: linear-gradient(180deg, #405d7a 0%, #2f465f 100%);

    box-shadow:
      0 2px 6px rgba(47, 70, 95, 0.12),
      0 1px 2px rgba(47, 70, 95, 0.05),
      inset 0 1px 0 rgba(185, 205, 230, 0.06);

    border: 1px solid rgba(255, 255, 255, 0.05);
  }
}

.services-section,
.booking-section {
  position: relative;
  padding-bottom: 8px;
}

.service-list {
  border-radius: 28px;
  padding: 4px 20px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
}

.service-row {
  position: relative;
  width: 100%;
  border: 0;
  padding: 16px 34px 16px 0;
  background: transparent;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 14px;
  color: #151821;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(25, 35, 52, 0.075);
  }

  &:active {
    transform: scale(0.996);
  }
}

.service-row__accent {
  position: absolute;
  left: -20px;
  top: 14px;
  bottom: 14px;
  width: 3px;
  border-radius: 999px;
  background: linear-gradient(180deg, #405d7a 0%, #2f465f 100%);
  opacity: 0;
  transform: scaleY(0.35);
  transition:
    opacity 0.22s ease,
    transform 0.24s cubic-bezier(0.22, 1, 0.36, 1);
}

.service-row.active .service-row__accent {
  opacity: 1;
  transform: scaleY(1);
}

.service-row__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    color: #151821;
    font-size: 15px;
    line-height: 1.1;
    font-weight: 780;
    letter-spacing: -0.035em;
  }

  small {
    color: rgba(43, 54, 73, 0.46);
    font-size: 12.5px;
    line-height: 1.25;
    font-weight: 600;
    letter-spacing: -0.02em;
  }
}

.service-row__side {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;

  small {
    color: rgba(43, 54, 73, 0.42);
    font-size: 11px;
    line-height: 1;
    font-weight: 700;
    letter-spacing: -0.015em;
  }

  strong {
    color: #304257;
    font-size: 13px;
    line-height: 1;
    font-weight: 850;
    letter-spacing: -0.025em;
    font-variant-numeric: tabular-nums;
  }
}

.service-row.active .service-row__side strong {
  color: #405d7a;
}

.service-row__check {
  position: absolute;
  right: 0;
  top: 50%;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  display: grid;
  place-items: center;

  color: transparent;
  background: transparent;
  box-shadow: inset 0 0 0 1.5px rgba(64, 93, 122, 0.16);

  transform: translateY(-50%) scale(0.82);
  transition:
    color 0.22s ease,
    background 0.22s ease,
    box-shadow 0.22s ease,
    transform 0.22s ease;

  svg {
    width: 13px;
    height: 13px;
  }
}

.service-row.active .service-row__check {
  color: #fff;
  background: linear-gradient(180deg, #405d7a 0%, #2f465f 100%);
  box-shadow:
    0 0 0 2px #ffffff,
    0 0 0 4px rgba(64, 93, 122, 0.22);
  transform: translateY(-50%) scale(1);
}

.barber-list {
  border-radius: 28px;
  padding: 20px 20px 14px 20px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.barber-row {
  width: 100%;
  border: 0;
  padding: 0;
  background: transparent;
  border-radius: 18px;
  text-align: left;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  position: relative;

  transition:
    opacity 0.22s ease,
    transform 0.2s ease;

  &::before {
    content: "";
    position: absolute;
    left: -16px;
    top: -2px;
    width: 3px;
    height: 55px;
    border-radius: 999px;
    background: linear-gradient(180deg, #405d7a 0%, #2f465f 100%);
    opacity: 0;
    transform: scaleY(0.35);
    transform-origin: center;
    transition:
      opacity 0.22s ease,
      transform 0.24s cubic-bezier(0.22, 1, 0.36, 1);
  }

  &:not(:last-child) .barber-row__content {
    border-bottom: 1px solid rgba(25, 35, 52, 0.075);
  }

  &:last-child .barber-row__content {
    padding-bottom: 0;
  }

  &:active {
    opacity: 0.9;
    transform: scale(0.996);
  }

  &.active::before {
    opacity: 1;
    transform: scaleY(1);
  }
}

.barber-img {
  width: 50px;
  height: 50px;
  border-radius: 22px;
  position: relative;
  flex: 0 0 50px;

  &::after {
    content: "";
    position: absolute;
    inset: -3px;
    border-radius: 18px;
    opacity: 0;
    background: transparent;
    box-shadow:
      0 0 0 2px rgba(64, 93, 122, 0.42),
      0 8px 18px rgba(47, 70, 95, 0.14);
    transition:
      opacity 0.22s ease,
      transform 0.22s ease;
    transform: scale(0.96);
  }

  img {
    position: relative;
    z-index: 1;
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 16px;
    object-fit: cover;
    box-shadow: 0 8px 18px rgba(20, 30, 45, 0.06);
  }
}

.barber-row.active .barber-img::after {
  opacity: 1;
  transform: scale(1);
}

.barber-row__content {
  display: flex;
  flex-direction: column;
  gap: 3px;
  position: relative;
  width: 100%;
  padding-bottom: 10px;
  padding-right: 32px;
}

.barber-row__radio-dot {
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 999px;
  right: 0;
  top: 40%;
  transform: translateY(-50%) scale(0.75);

  background: transparent;
  opacity: 0;

  box-shadow:
    0 0 0 2px transparent,
    0 0 0 4px transparent;

  transition:
    opacity 0.2s ease,
    transform 0.22s ease,
    background 0.22s ease,
    box-shadow 0.22s ease;

  &::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 46%;
    width: 7px;
    height: 4px;
    border-left: 2px solid #ffffff;
    border-bottom: 2px solid #ffffff;
    opacity: 0;
    transform: translate(-50%, -50%) rotate(-45deg) scale(0.7);
    transition:
      opacity 0.18s ease,
      transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);
  }
}

.barber-row.active .barber-row__radio-dot {
  opacity: 1;
  transform: translateY(-50%) scale(1);
  background: linear-gradient(180deg, #405d7a 0%, #2f465f 100%);

  box-shadow:
    0 0 0 2px #ffffff,
    0 0 0 4px rgba(64, 93, 122, 0.34);
}

.barber-row.active .barber-row__radio-dot::after {
  opacity: 1;
  transform: translate(-50%, -50%) rotate(-45deg) scale(1);
}

.barber-row__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0;

  strong {
    font-size: 17px;
    font-weight: 780;
    letter-spacing: -0.035em;
    color: #151821;
    margin: 0;
    transition: color 0.22s ease;
  }
}

.barber-row.active .barber-row__top strong {
  color: #101720;
}

.barber-row__tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  color: rgba(43, 54, 73, 0.52);
  font-size: 13px;
  font-weight: 560;
  transition: color 0.22s ease;

  i {
    width: 4px;
    height: 4px;
    border-radius: 999px;
    background: rgba(64, 93, 122, 0.3);
    display: block;
    margin: 0;
  }
}

.barber-row.active .barber-row__tags {
  color: rgba(35, 48, 66, 0.62);

  i {
    background: rgba(64, 93, 122, 0.42);
  }
}

.barber-row__availability {
  width: max-content;
  padding: 0;
  border-radius: 0;
  margin-top: 4px;

  display: inline-flex;
  align-items: center;
  gap: 3px;

  background: transparent;
  color: rgba(43, 54, 73, 0.42);

  font-size: 12px;
  font-weight: 650;
  letter-spacing: -0.015em;

  transition:
    color 0.22s ease,
    opacity 0.22s ease;

  svg {
    width: 14px;
    height: 14px;
    stroke: currentColor;
    opacity: 0.62;
  }
}

.barber-row.active .barber-row__availability {
  background: transparent;
  color: rgba(64, 93, 122, 0.62);
  box-shadow: none;
}

.appointments-section {
  display: flex;
  flex-direction: column;
}

.section-head-app {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 5px;
  gap: 10px;
}

.slot-head-copy {
  width: 100%;
  display: grid;
  gap: 6px;

  p {
    margin: 0;
    color: rgba(45, 51, 78, 0.48);
    font-size: 13px;
    line-height: 1.25;
    font-weight: 600;
    letter-spacing: -0.015em;
  }
}

.slot-head-row {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 5px;
  margin-bottom: 0;

  .section-text {
    h2 {
      margin: 0;
      margin-bottom: 5px;
    }

    p {
      margin: 0;
    }
  }
}

.slot-head-main {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 8px;
}

.slot-toggle-mini {
  position: relative;
  width: 100%;
  height: 46px;
  padding: 5px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-radius: 99px;
  overflow: hidden;
  margin-bottom: 10px;

  background: #ffffff;
  border-color: rgba(64, 93, 122, 0.08);

  box-shadow:
    0 1px 4px rgba(22, 34, 52, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.92),
    inset 0 0 0 1px rgba(64, 93, 122, 0.09);

  &.afternoon .slot-toggle-mini__highlight {
    transform: translateX(100%);
  }
}

.slot-toggle-mini__highlight {
  position: absolute;
  inset: 6px auto 6px 6px;
  width: calc((100% - 12px) / 2);
  border-radius: 99px;

  background: linear-gradient(180deg, #eef5fb 0%, #dbe7f1 100%);

  box-shadow:
    0 1px 3px rgba(22, 34, 52, 0.045),
    inset 0 1px 0 rgba(255, 255, 255, 0.88),
    inset 0 0 0 1px rgba(64, 93, 122, 0.12);

  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

.slot-toggle-mini__item {
  position: relative;
  z-index: 2;
  border: 0;
  background: transparent;
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  font-size: 12px;
  font-weight: 840;
  letter-spacing: -0.02em;

  color: rgba(47, 70, 95, 0.52);

  span {
    min-width: 19px;
    height: 19px;
    padding: 0 6px;
    border-radius: 999px;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 10px;
    font-weight: 900;

    background: rgba(64, 93, 122, 0.07);
    color: rgba(47, 70, 95, 0.62);

    box-shadow: inset 0 0 0 1px rgba(64, 93, 122, 0.05);
  }

  &.active {
    color: #405d7a;

    span {
      background: #ffffff;
      color: #405d7a;

      box-shadow: inset 0 0 0 1px rgba(64, 93, 122, 0.1);
    }
  }
}

.slot-area {
  position: relative;
  height: 240px;
  overflow-y: auto;
  padding: 0 10px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.slot-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 5px;
}

.slot-pill {
  height: 45px;
  border-radius: 999px;

  background: white;
  color: rgba(28, 34, 50, 0.68);
  border: 1px solid rgba(0, 0, 0, 0.04);

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow:
    0 2px 6px rgba(22, 34, 52, 0.07),
    0 1px 1px rgba(22, 34, 52, 0.03),
    inset 0 1px 0 rgba(255, 255, 255, 0.96),
    inset 0 -1px 0 rgba(64, 93, 122, 0.04);

  font-size: 14px;
  font-weight: 800;
  letter-spacing: -0.035em;

  transition:
    transform 0.2s ease,
    background 0.22s ease,
    color 0.22s ease,
    border-color 0.22s ease;

  &:active {
    transform: scale(0.975);
  }

  &.active {
    background: linear-gradient(180deg, #405d7a 0%, #2f465f 100%);
    border-color: rgba(255, 255, 255, 0.05);

    .slot-pill__time {
      color: #fff;
    }

    box-shadow:
      0 2px 6px rgba(47, 70, 95, 0.12),
      0 1px 2px rgba(47, 70, 95, 0.05),
      inset 0 1px 0 rgba(185, 205, 230, 0.06);
  }
}

.slot-pill__time {
  line-height: 1;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: -0.035em;
  color: rgba(28, 34, 50, 0.68);
}

.empty-state {
  padding: 20px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.68);
  box-shadow:
    0 1px 4px rgba(22, 34, 52, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.94);
  text-align: center;
  color: rgba(45, 51, 78, 0.52);
  font-size: 13px;
  font-weight: 650;
}

.slots-fade-enter-active,
.slots-fade-leave-active {
  transition: all 0.26s ease;
}

.slots-fade-enter-from,
.slots-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.booking-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 60;

  width: 100%;
  margin: 0;
  padding: 11px 16px calc(22px + env(safe-area-inset-bottom));
  box-sizing: border-box;

  background:
    linear-gradient(
      180deg,
      rgba(250, 252, 254, 0.94) 0%,
      rgba(239, 244, 248, 0.98) 100%
    );

  border-top: 1px solid rgba(64, 93, 122, 0.085);

  box-shadow:
    0 -18px 34px rgba(22, 34, 52, 0.105),
    0 -6px 14px rgba(22, 34, 52, 0.065),
    inset 0 1px 0 rgba(255, 255, 255, 0.86);

  backdrop-filter: blur(18px) saturate(145%);
  -webkit-backdrop-filter: blur(18px) saturate(145%);

  transition:
    padding 0.34s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.34s ease,
    background 0.34s ease;
}

.booking-bottom.has-summary {
  padding-top: 11px;
  padding-bottom: calc(36px + env(safe-area-inset-bottom));

  box-shadow:
    0 -22px 40px rgba(22, 34, 52, 0.125),
    0 -8px 18px rgba(22, 34, 52, 0.075),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.booking-bottom__inner {
  width: 100%;
  max-width: 520px;
  margin: 0 auto;

  display: grid;
  grid-template-columns: minmax(0, 1fr) 120px;
  align-items: center;
  gap: 12px;
}

.booking-bottom__summary {
  min-width: 0;
  padding-left: 2px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;

  strong {
    display: block;
    min-width: 0;

    color: rgba(16, 36, 56, 0.56);
    font-size: 13px;
    line-height: 1;
    font-weight: 780;
    letter-spacing: -0.035em;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    transition:
      color 0.26s ease,
      font-weight 0.26s ease;
  }

  span {
    display: block;
    min-width: 0;

    color: rgba(16, 36, 56, 0.38);
    font-size: 11px;
    line-height: 1;
    font-weight: 680;
    letter-spacing: -0.02em;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    transition:
      color 0.26s ease,
      font-size 0.26s ease,
      font-weight 0.26s ease;
  }
}

.booking-bottom.has-summary .booking-bottom__summary {
  strong {
    color: rgba(47, 70, 95, 0.86);
    font-weight: 820;
  }

  span {
    color: #405d7a;
    font-size: 14px;
    font-weight: 870;
    letter-spacing: -0.045em;
  }
}

.confirm-button {
  width: 100%;
  height: 38px;
  border: 0;
  border-radius: 999px;
  padding: 0 14px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  color: #ffffff;

  box-shadow:
    0 6px 12px rgba(48, 72, 98, 0.18),
    0 1px 3px rgba(48, 72, 98, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.24),
    inset 0 -1px 0 rgba(0, 0, 0, 0.14);

  font-size: 13px;
  font-weight: 800;
  letter-spacing: -0.02em;

  transition:
    transform 0.18s ease,
    background 0.24s ease,
    box-shadow 0.24s ease,
    color 0.22s ease,
    opacity 0.22s ease;

  svg {
    width: 16px;
    height: 16px;
    stroke: currentColor;
    stroke-width: 1.9;
  }

  &:active:not(:disabled) {
    transform: scale(0.982);
  }

  &:disabled {
    color: rgba(255, 255, 255, 0.42);

    background:
      linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.09) 0%,
        rgba(255, 255, 255, 0) 45%
      ),
      linear-gradient(
        180deg,
        rgba(111, 135, 163, 0.38) 0%,
        rgba(80, 108, 140, 0.28) 100%
      );

    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.12),
      inset 0 -1px 0 rgba(0, 0, 0, 0.07);

    cursor: not-allowed;
  }
}

.booking-bottom.has-summary .confirm-button {
  background: rgb(90, 117, 148);
  box-shadow:
    0 8px 15px rgba(48, 72, 98, 0.21),
    0 2px 4px rgba(48, 72, 98, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.25),
    inset 0 -1px 0 rgba(0, 0, 0, 0.15);
}

.confirm-sheet-enter-active,
.confirm-sheet-leave-active {
  transition: opacity 0.22s ease;
}

.confirm-sheet-enter-from,
.confirm-sheet-leave-to {
  opacity: 0;
}

.confirm-sheet-enter-active .confirm-page,
.confirm-sheet-leave-active .confirm-page {
  transition:
    transform 0.34s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.24s ease;
}

.confirm-sheet-enter-from .confirm-page,
.confirm-sheet-leave-to .confirm-page {
  opacity: 0;
  transform: translate3d(0, 26px, 0) scale(0.98);
}

.confirm-sheet-enter-to .confirm-page,
.confirm-sheet-leave-from .confirm-page {
  opacity: 1;
  transform: translate3d(0, 0, 0) scale(1);
}

.confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 90;

  padding: 0 12px calc(12px + env(safe-area-inset-bottom));

  display: flex;
  align-items: flex-end;
  justify-content: center;

  color: #111b29;
  background: rgba(9, 13, 20, 0.46);

  overflow: hidden;
  overscroll-behavior: contain;

  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.confirm-page {
  position: relative;

  width: min(100%, 420px);
  max-height: calc(100vh - 24px);

  display: flex;
  flex-direction: column;

  overflow: hidden;

  border-radius: 30px;
  background: #ffffff;
  color: #111b29;

  font-family: Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display",
    "Segoe UI", sans-serif;

  border: 1px solid rgba(47, 70, 95, 0.06);

  box-shadow:
    0 24px 50px rgba(8, 12, 18, 0.22),
    0 8px 18px rgba(8, 12, 18, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.96),
    inset 0 0 0 1px rgba(64, 93, 122, 0.075);

  transform-origin: center bottom;
}

.confirm-page__handle {
  width: 38px;
  height: 4px;
  margin: 11px auto 16px;
  flex: 0 0 auto;

  border-radius: 999px;
  background: rgba(64, 93, 122, 0.16);
}

.confirm-content {
  flex: 1;
  min-height: 0;

  padding: 0 20px 20px;

  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;

  scrollbar-width: none;
}

.confirm-content::-webkit-scrollbar {
  display: none;
}

.success-card {
  padding: 2px 0 0;
  text-align: center;

  span {
    display: block;
    margin-top: 14px;
    color: #64809c;
    font-size: 10px;
    line-height: 1;
    font-weight: 850;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  h2 {
    margin: 8px 0 0;
    color: #102438;
    font-size: 24px;
    line-height: 1;
    font-weight: 850;
    letter-spacing: -0.06em;
  }

  p {
    max-width: 290px;
    margin: 9px auto 22px;
    color: rgba(16, 36, 56, 0.5);
    font-size: 13px;
    line-height: 1.35;
    font-weight: 620;
    letter-spacing: -0.025em;
  }
}

.success-icon {
  width: 58px;
  height: 58px;
  margin: 0 auto;
  border-radius: 22px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #ffffff;
  background: linear-gradient(180deg, #405d7a 0%, #2f465f 100%);

  box-shadow:
    0 12px 22px rgba(47, 70, 95, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.22);

  svg {
    width: 28px;
    height: 28px;
  }
}

.success-summary {
  display: grid;
  gap: 5px;
  border-radius: 18px;
  padding: 16px;
  margin-top: 0;
  margin-bottom: 18px;

  background: #f4f7fa;
}

.confirm-summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;

  padding: 5px 0;

  span {
    color: #7d8998;
    font-size: 13px;
    line-height: 1;
    font-weight: 560;
    letter-spacing: -0.015em;
  }

  strong {
    min-width: 0;
    color: #304257;
    font-size: 14px;
    line-height: 1.15;
    font-weight: 680;
    letter-spacing: -0.025em;
    text-align: right;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.success-close-btn {
  width: 100%;
  height: 44px;
  border: 0;
  border-radius: 99px;
  padding: 0 17px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  color: #ffffff;
  background: rgb(90, 117, 148);

  box-shadow:
    0 8px 15px rgba(48, 72, 98, 0.21),
    0 2px 4px rgba(48, 72, 98, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.25),
    inset 0 -1px 0 rgba(0, 0, 0, 0.15);

  font-size: 14px;
  line-height: 1;
  font-weight: 850;
  letter-spacing: -0.025em;

  transition:
    transform 0.16s ease,
    opacity 0.18s ease;

  &:active {
    transform: scale(0.975);
  }
}
</style>