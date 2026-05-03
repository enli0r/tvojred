<template>
  <div class="concept-v2-page">
    <div class="concept-v2-page__bg">
      <div class="bg-light bg-light--one"></div>
      <div class="bg-light bg-light--two"></div>
      <div class="bg-noise"></div>
    </div>

    <div class="booking-page concept-v2-booking">
      <div key="booking-screen" class="booking-screen">
        <div class="page-content">
          <Navbar
            :show-quick-booking="showQuickBookHero"
            :quick-booking-time="quickBookingTime"
            :quick-booking-barber-name="quickBookingBarberName"
            :quick-booking-date-label="quickBookingDateLabel"
            @quick-book="bookQuickOption"
          />

          <div class="booking-stack">
            <section
              ref="calendarSectionRef"
              class="booking-block booking-block--calendar"
            >
              <Calendar
                v-model="selectedDate"
                :tenant-id="tenant?.id ?? null"
              />
            </section>

            <section
              ref="barberSectionRef"
              class="booking-block booking-block--barbers"
              :class="{ 'is-muted': !selectedDate }"
            >
              <div
                v-if="!selectedDate"
                class="booking-block__lock"
              ></div>

              <Barbers
                v-model="selectedBarber"
                :items="barbers"
                :loading="loadingBarbers"
                @update:selectedBarber="handleBarberChange"
              />
            </section>

            <section
              ref="appointmentSectionRef"
              class="booking-block booking-block--appointments"
              :class="{ 'is-muted': !selectedDate || !selectedBarber }"
            >
              <Appointments
                v-model="selectedAppointment"
                :items="availableAppointments"
                :loading="loadingAppointments"
                :date="selectedDate"
                :barber="selectedBarber"
              />
            </section>
          </div>
        </div>
      </div>

      <BottomMenu
        :step="uiStep"
        :can-continue="canContinue"
        :can-finish="!!selectedAppointment"
        :steps="summarySteps"
        :visible="true"
        :is-auto-advancing="isAutoAdvancing"
        @back="goBack"
        @next="goNext"
        @finish="openReviewSheet"
        @go-to-step="goToStep"
      />

      <Transition name="overlay-fade">
        <div
          v-if="showReviewSheet"
          class="sheet-overlay"
          @click="closeReviewSheet"
        ></div>
      </Transition>

      <Transition name="sheet-slide">
        <div
          v-if="showReviewSheet"
          class="review-sheet"
          @wheel.stop
          @touchmove.stop
        >
          <div class="sheet-handle"></div>

          <div class="sheet-head">
            <span>Pregled</span>
            <h2>Potvrdi termin</h2>
            <p>Proveri detalje pre konačne potvrde.</p>
          </div>

          <div class="review-list">
            <div class="review-row">
              <span>Korisnik</span>
              <strong>{{ currentUser?.name || "Nije prijavljen" }}</strong>
            </div>

            <div class="review-row">
              <span>Telefon</span>
              <strong>{{ currentUser?.phone || "-" }}</strong>
            </div>

            <div class="review-row">
              <span>Dan</span>
              <strong>{{ selectedDateLong }}</strong>
            </div>

            <div class="review-row">
              <span>Frizer</span>
              <strong>{{ selectedBarber?.name || "-" }}</strong>
            </div>

            <div class="review-row">
              <span>Vreme</span>
              <strong>{{ selectedAppointmentTime || "-" }}</strong>
            </div>
          </div>

          <div class="sheet-actions">
            <button
              class="sheet-button sheet-button-ghost"
              type="button"
              @click="closeReviewSheet"
              :disabled="bookingLoading"
            >
              Zatvori
            </button>

            <div
              v-if="isLoggedIn && currentUser"
              class="review-auth-state review-auth-state--logged"
            >
              <div>
                <span>Prijavljen si kao</span>
                <strong>{{ currentUser.name }}</strong>
              </div>

              <button
                type="button"
                class="logout-btn"
                @click="logoutFromBooking"
              >
                Logout
              </button>
            </div>

            <button
              class="sheet-button sheet-button-primary"
              type="button"
              @click="confirmBooking"
              :disabled="bookingLoading || !selectedAppointment"
            >
              {{ bookingLoading ? "Zakazujem..." : "Potvrdi" }}
            </button>
          </div>
        </div>
      </Transition>

      <Transition name="overlay-fade">
        <div
          v-if="showAuthSheet"
          class="sheet-overlay"
          @click="cancelAuthSheet"
        ></div>
      </Transition>

      <Transition name="sheet-slide">
        <div
          v-if="showAuthSheet"
          class="review-sheet auth-sheet"
          @wheel.stop
          @touchmove.stop
        >
          <div class="sheet-handle"></div>

          <div class="sheet-head">
            <span>Brza potvrda</span>
            <h2>Prijavi se za zakazivanje</h2>
            <p>
              Unesi podatke i potvrdi passkey-em. Nakon prijave termin se
              automatski zakazuje.
            </p>
          </div>

          <PasskeyTest
            @close="cancelAuthSheet"
            @auth-change="handleAuthChange"
          />
        </div>
      </Transition>

      <Transition name="overlay-fade">
        <div
          v-if="bookingResultStatus"
          class="sheet-overlay"
          @click="closeBookingResult"
        ></div>
      </Transition>

      <Transition name="sheet-slide">
        <div
          v-if="bookingResultStatus"
          class="review-sheet result-sheet"
          @wheel.stop
          @touchmove.stop
        >
          <div class="sheet-handle"></div>

          <BookingResultSheet
            :status="bookingResultStatus"
            :appointment="bookingResultAppointment"
            :barber-name="selectedBarber?.name || '-'"
            :message="bookingResultMessage"
            @finish="closeBookingResult"
            @close="closeBookingResult"
            @retry="retryBooking"
            @choose-another="chooseAnotherAppointment"
          />
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import Navbar from "@/components/Navbar.vue";
import Calendar from "@/components/Calendar.vue";
import Barbers from "@/components/Barbers.vue";
import Appointments from "@/components/Appointments.vue";
import BottomMenu from "@/components/BottomMenu.vue";
import PasskeyTest from "../components/PasskeyTest.vue";
import BookingResultSheet from "../components/BookingResultSheet.vue";

const apiBase = "/api";
const route = useRoute();

type BookingResultStatus = "loading" | "success" | "error" | "conflict" | null;

type Tenant = {
  id: number;
  name: string;
  slug: string;
};

type AuthUser = {
  id: number;
  name: string;
  phone: string;
};

type AuthChangePayload = {
  isLoggedIn: boolean;
  user: AuthUser | null;
};

type Barber = {
  id: number;
  name: string;
};

type Appointment = {
  id?: number;
  tenant_id?: number;
  customer_id?: number;
  barber_id?: number;
  barber_service_id?: number | null;
  start_time: string;
  end_time: string;
};

type QuickBooking = {
  barber: Barber;
  date: string;
  appointment: Appointment;
};

const tenantSlug = computed(() => {
  return String(route.params.tenantSlug);
});

const isAutoAdvancing = ref(false);
const showReviewSheet = ref(false);
const showAuthSheet = ref(false);
const pendingBookingAfterAuth = ref(false);
const bookingLoading = ref(false);
const bookingMessage = ref<string | null>(null);
const bookingError = ref<string | null>(null);

const calendarSectionRef = ref<HTMLElement | null>(null);
const barberSectionRef = ref<HTMLElement | null>(null);
const appointmentSectionRef = ref<HTMLElement | null>(null);

const bookingResultStatus = ref<BookingResultStatus>(null);
const bookingResultMessage = ref<string | null>(null);
const bookingResultAppointment = ref<Appointment | null>(null);

const tenant = ref<Tenant | null>(null);
const currentUser = ref<AuthUser | null>(null);
const isLoggedIn = ref(false);

const selectedDate = ref<string | null>(null);
const selectedBarber = ref<Barber | null>(null);
const selectedAppointment = ref<Appointment | null>(null);

const barbers = ref<Barber[]>([]);
const availableAppointments = ref<Appointment[]>([]);

const loadingBarbers = ref(false);
const loadingAppointments = ref(false);
const loadingQuickBooking = ref(false);

const quickBooking = ref<QuickBooking | null>(null);
const isQuickBookingSelection = ref(false);

const showQuickBookHero = computed(() => {
  return !!quickBooking.value && !loadingQuickBooking.value;
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

  return new Date(selectedAppointment.value.start_time).toLocaleTimeString(
    "sr-Latn-RS",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
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

  return new Date(quickBooking.value.appointment.start_time).toLocaleTimeString(
    "sr-Latn-RS",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
});

const quickBookingBarberName = computed(() => {
  return quickBooking.value?.barber.name ?? "";
});

const uiStep = computed(() => {
  if (selectedAppointment.value) return 3;
  if (selectedDate.value && selectedBarber.value) return 2;
  return 1;
});

const canContinue = computed(() => {
  if (uiStep.value === 1) return !!selectedDate.value && !!selectedBarber.value;
  if (uiStep.value === 2) return !!selectedAppointment.value;
  return false;
});

const summarySteps = computed(() => {
  return [
    {
      step: 1,
      label: "Dan",
      value: selectedDateShort.value || "Izaberi",
      isActive: !selectedDate.value,
      isDone: !!selectedDate.value,
      isClickable: true,
    },
    {
      step: 2,
      label: "Frizer",
      value: selectedBarber.value?.name || "Izaberi",
      isActive: !!selectedDate.value && !selectedBarber.value,
      isDone: !!selectedBarber.value,
      isClickable: !!selectedDate.value,
    },
    {
      step: 3,
      label: "Vreme",
      value: selectedAppointmentTime.value || "Izaberi",
      isActive:
        !!selectedDate.value &&
        !!selectedBarber.value &&
        !selectedAppointment.value,
      isDone: !!selectedAppointment.value,
      isClickable: !!selectedDate.value && !!selectedBarber.value,
    },
  ];
});

async function handleAuthChange(payload: AuthChangePayload) {
  isLoggedIn.value = payload.isLoggedIn;
  currentUser.value = payload.user;

  if (!payload.isLoggedIn || !payload.user) {
    return;
  }

  showAuthSheet.value = false;

  if (!pendingBookingAfterAuth.value) {
    return;
  }

  pendingBookingAfterAuth.value = false;

  await confirmBooking();
}

async function checkAuthFromHome() {
  try {
    const res = await fetch(`${apiBase}/auth/me`, {
      credentials: "include",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.loggedIn || !data?.user) {
      isLoggedIn.value = false;
      currentUser.value = null;
      return;
    }

    isLoggedIn.value = true;
    currentUser.value = data.user;
  } catch {
    isLoggedIn.value = false;
    currentUser.value = null;
  }
}

async function fetchTenant() {
  try {
    const res = await fetch(`${apiBase}/tenants/by-slug/${tenantSlug.value}`);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    tenant.value = await res.json();
  } catch (error) {
    console.error("Failed to fetch tenant:", error);
    tenant.value = null;
  }
}

async function fetchBarbers() {
  loadingBarbers.value = true;

  try {
    const res = await fetch(`${apiBase}/barbers`);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = (await res.json()) as Barber[];
    barbers.value = data;
  } catch (error) {
    console.error("Failed to fetch barbers:", error);
    barbers.value = [];
  } finally {
    loadingBarbers.value = false;
  }
}

async function fetchAvailableSlots(barberId: number, date: string) {
  if (!tenant.value) {
    return [];
  }

  const res = await fetch(
    `${apiBase}/tenants/${tenant.value.id}/barbers/${barberId}/available-slots?date=${date}`
  );

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return (await res.json()) as Appointment[];
}

async function fetchAppointments() {
  if (!tenant.value || !selectedDate.value || !selectedBarber.value) {
    availableAppointments.value = [];
    selectedAppointment.value = null;
    return;
  }

  loadingAppointments.value = true;

  try {
    availableAppointments.value = await fetchAvailableSlots(
      selectedBarber.value.id,
      selectedDate.value
    );
  } catch (error) {
    console.error("Failed to fetch available slots:", error);
    availableAppointments.value = [];
  } finally {
    loadingAppointments.value = false;
  }
}

async function findQuickBookingOption() {
  if (!tenant.value || !barbers.value.length) {
    quickBooking.value = null;
    return;
  }

  loadingQuickBooking.value = true;

  try {
    const tomorrow = startOfDay(new Date());
    tomorrow.setDate(tomorrow.getDate() + 1);

    for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
      const date = toIso(addDays(tomorrow, dayOffset));

      for (const barber of barbers.value) {
        const available = await fetchAvailableSlots(barber.id, date);

        if (available.length > 0) {
          quickBooking.value = {
            barber,
            date,
            appointment: available[0],
          };
          return;
        }
      }
    }

    quickBooking.value = null;
  } catch (error) {
    console.error("Failed to find quick booking option:", error);
    quickBooking.value = null;
  } finally {
    loadingQuickBooking.value = false;
  }
}

function handleBarberChange(barber: Barber | null) {
  const previousBarberId = selectedBarber.value?.id ?? null;
  const nextBarberId = barber?.id ?? null;
  const isSameBarber = previousBarberId === nextBarberId;

  selectedBarber.value = barber;
  selectedAppointment.value = null;

  if (!isSameBarber) {
    availableAppointments.value = [];
  }
}

async function bookQuickOption() {
  if (!quickBooking.value) return;

  isQuickBookingSelection.value = true;

  selectedDate.value = quickBooking.value.date;
  selectedBarber.value = quickBooking.value.barber;
  selectedAppointment.value = quickBooking.value.appointment;

  await fetchAppointments();

  const matched = availableAppointments.value.find((appointment) => {
    return appointment.start_time === quickBooking.value?.appointment.start_time;
  });

  selectedAppointment.value = matched ?? quickBooking.value.appointment;

  isQuickBookingSelection.value = false;

  await openReviewSheet();
}

async function openReviewSheet() {
  await checkAuthFromHome();

  if (!selectedAppointment.value) return;

  bookingMessage.value = null;
  bookingError.value = null;
  showReviewSheet.value = true;
}

function closeReviewSheet() {
  if (bookingLoading.value) return;

  showReviewSheet.value = false;
  bookingMessage.value = null;
  bookingError.value = null;
}

function openAuthSheet() {
  showAuthSheet.value = true;
}

function cancelAuthSheet() {
  if (bookingLoading.value) return;

  showAuthSheet.value = false;
  pendingBookingAfterAuth.value = false;
}

async function confirmBooking() {
  if (bookingLoading.value) return;

  bookingMessage.value = null;
  bookingError.value = null;

  if (!tenant.value || !selectedBarber.value || !selectedAppointment.value) {
    openBookingResult("error", "Nedostaju podaci za termin.");
    return;
  }

  await checkAuthFromHome();

  if (!isLoggedIn.value || !currentUser.value) {
    pendingBookingAfterAuth.value = true;
    showReviewSheet.value = false;
    openAuthSheet();
    return;
  }

  bookingLoading.value = true;
  showReviewSheet.value = false;

  const bookedAppointment = selectedAppointment.value;

  openBookingResult("loading", "Zakazujemo tvoj termin...", bookedAppointment);

  try {
    const res = await fetch(`${apiBase}/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        tenant_id: tenant.value.id,
        barber_id: selectedBarber.value.id,
        start_time: bookedAppointment.start_time,
        end_time: bookedAppointment.end_time,
      }),
    });

    const data = await res.json().catch(() => null);

    if (res.status === 401) {
      isLoggedIn.value = false;
      currentUser.value = null;
      pendingBookingAfterAuth.value = true;

      closeBookingResult();
      openAuthSheet();
      return;
    }

    if (res.status === 409) {
      openBookingResult(
        "conflict",
        data?.message || "Termin je upravo zauzet. Izaberi drugi termin.",
        bookedAppointment
      );

      await fetchAppointments();
      await findQuickBookingOption();
      return;
    }

    if (!res.ok) {
      openBookingResult(
        "error",
        data?.message || "Došlo je do greške pri zakazivanju termina.",
        bookedAppointment
      );

      await fetchAppointments();
      return;
    }

    pendingBookingAfterAuth.value = false;

    openBookingResult(
      "success",
      data?.message || "Termin je uspešno zakazan.",
      bookedAppointment
    );

    selectedAppointment.value = null;

    await fetchAppointments();
    await findQuickBookingOption();
  } catch (error: any) {
    openBookingResult(
      "error",
      error?.message || "Došlo je do greške pri zakazivanju termina.",
      bookedAppointment
    );

    await fetchAppointments();
  } finally {
    bookingLoading.value = false;
  }
}

function goToStep(targetStep: number) {
  if (targetStep === 1) return;
  if (targetStep === 2 && !selectedDate.value) return;
  if (targetStep === 3 && (!selectedDate.value || !selectedBarber.value)) return;
}

function goNext() {
  if (uiStep.value === 2 && selectedAppointment.value) {
    openReviewSheet();
  }
}

function goBack() {
  if (selectedAppointment.value) {
    selectedAppointment.value = null;
    return;
  }

  if (selectedBarber.value) {
    selectedBarber.value = null;
    availableAppointments.value = [];
    return;
  }

  if (selectedDate.value) {
    selectedDate.value = null;
    availableAppointments.value = [];
  }
}

watch(selectedDate, () => {
  if (isQuickBookingSelection.value) return;

  selectedBarber.value = null;
  selectedAppointment.value = null;
  availableAppointments.value = [];
});

watch(selectedBarber, () => {
  selectedAppointment.value = null;
  fetchAppointments();
});

watch(
  [showReviewSheet, showAuthSheet, bookingResultStatus],
  ([isReviewOpen, isAuthOpen, resultStatus]) => {
    document.body.style.overflow =
      isReviewOpen || isAuthOpen || !!resultStatus ? "hidden" : "";
  }
);

onMounted(async () => {
  await checkAuthFromHome();
  await fetchTenant();
  await fetchBarbers();
  await findQuickBookingOption();
});

onBeforeUnmount(() => {
  document.body.style.overflow = "";
});

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

async function logoutFromBooking() {
  try {
    await fetch(`${apiBase}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } finally {
    isLoggedIn.value = false;
    currentUser.value = null;
    pendingBookingAfterAuth.value = false;
  }
}

function openBookingResult(
  status: BookingResultStatus,
  message: string | null = null,
  appointment: Appointment | null = selectedAppointment.value ?? null
) {
  bookingResultStatus.value = status;
  bookingResultMessage.value = message;
  bookingResultAppointment.value = appointment;
}

function closeBookingResult() {
  bookingResultStatus.value = null;
  bookingResultMessage.value = null;
  bookingResultAppointment.value = null;
}

function retryBooking() {
  closeBookingResult();

  if (selectedAppointment.value) {
    showReviewSheet.value = true;
  }
}

function chooseAnotherAppointment() {
  closeBookingResult();
  selectedAppointment.value = null;
}
</script>