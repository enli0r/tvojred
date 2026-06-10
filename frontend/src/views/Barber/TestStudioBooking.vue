<template>
  <div class="concept-v2-page">
    <div class="concept-v2-page__bg">
      <div class="bg-light bg-light--one"></div>
      <div class="bg-light bg-light--two"></div>
      <div class="bg-noise"></div>
    </div>

    <NavbarMenu
      :tenant-id="tenant?.id"
      :is-logged-in="isLoggedIn"
      :current-user="currentUser"
      @auth-change="handleAuthChange"
      @logout="handleLogout"
      @appointment-cancelled="fetchAppointments"
    />

    <div class="booking-page concept-v2-booking">
      <div key="booking-screen" class="booking-screen">
        <div class="page-content">
          <Navbar
            :show-quick-booking="showQuickBookHero"
            :loading-quick-booking="loadingQuickBooking"
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
        :visible="!showReviewSheet"
        :is-auto-advancing="isAutoAdvancing"
        @back="goBack"
        @next="goNext"
        @finish="openReviewSheet"
        @go-to-step="goToStep"
      />

      <Transition name="confirm-sheet">
        <div
          v-if="showReviewSheet"
          class="confirm-overlay"
          @click.self="closeReviewSheet"
          @wheel.stop
          @touchmove.stop
        >
          <section
            class="confirm-page"
            role="dialog"
            aria-modal="true"
            aria-label="Potvrda termina"
          >
            <div class="confirm-page__handle"></div>

            <main class="confirm-content">
              <template v-if="!bookingResultStatus">
                <div class="booking-summary-card">
                  <header class="confirm-popup-head">
                    <div class="confirm-popup-head__main">
                      <div class="confirm-popup-head__accent"></div>

                      <div class="confirm-popup-head__copy">
                        <span>Pregled termina</span>
                        <h2>Potvrdi termin</h2>
                        <p>Proverite detalje rezervacije.</p>
                      </div>
                    </div>

                    <button
                      class="confirm-popup-head__close"
                      type="button"
                      :disabled="bookingLoading"
                      @click="closeReviewSheet"
                      aria-label="Zatvori"
                    >
                      <svg viewBox="0 0 24 24" fill="none">
                        <path
                          d="M6 6l12 12M18 6 6 18"
                          stroke="currentColor"
                          stroke-width="2.1"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                  </header>

                  <section
                    class="confirm-summary"
                    aria-label="Pregled izabranog termina"
                  >
                    <div class="confirm-summary-row">
                      <span>Dan</span>
                      <strong>{{ selectedDateLong }}</strong>
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
                </div>

                <PasskeyTest
                  :is-logged-in="isLoggedIn"
                  :current-user="currentUser"
                  :loading="bookingLoading"
                  @close="closeReviewSheet"
                  @auth-change="handleAuthChange"
                  @confirm-booking="confirmBooking"
                />
              </template>

              <template v-else>
                <div class="booking-result-inside-popup">
                  <BookingResultSheet
                    v-if="bookingResultStatus"
                    :status="bookingResultStatus"
                    :message="bookingResultMessage"
                    :date="bookingResultDate"
                    :time="bookingResultTime"
                    :barber-name="selectedBarber?.name || '-'"
                    :variant="bookingResultVariant"
                    @close="finishBookingResult"
                    @retry="retryBooking"
                  />
                </div>
              </template>
            </main>
          </section>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import Navbar from "@/components/Navbar.vue";
import Calendar from "@/components/Calendar.vue";
import Barbers from "@/components/Barbers.vue";
import Appointments from "@/components/Appointments.vue";
import BottomMenu from "@/components/BottomMenu.vue";
import PasskeyTest from "@/components/PasskeyTest.vue";
import BookingResultSheet from "@/components/BookingResultSheet.vue";
import NavbarMenu from "@/components/NavbarMenu.vue";


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

const bookingResultVariant = ref<"default" | "slot-taken" | "daily-limit">("default");

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

function handleAuthChange(payload: AuthChangePayload) {
  isLoggedIn.value = payload.isLoggedIn;
  currentUser.value = payload.user;
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
  if (!selectedAppointment.value) return;

  showReviewSheet.value = true;

  bookingMessage.value = null;
  bookingError.value = null;
  bookingResultStatus.value = null;
  bookingResultMessage.value = null;
  bookingResultAppointment.value = null;

  await checkAuthFromHome();
}

function closeReviewSheet() {
  if (bookingLoading.value) return;

  showReviewSheet.value = false;
  bookingMessage.value = null;
  bookingError.value = null;
  closeBookingResult();
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
    bookingError.value = "Potvrdi passkey pre zakazivanja termina.";
    return;
  }

  bookingLoading.value = true;

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
    const code = data?.code;

    if (res.status === 401) {
      isLoggedIn.value = false;
      currentUser.value = null;

      closeBookingResult();
      showReviewSheet.value = true;
      bookingError.value = "Sesija je istekla. Potvrdi ponovo.";
      return;
    }

    if (res.status === 409) {
      let message = data?.message || "Termin nije moguće zakazati.";
      let variant: "default" | "slot-taken" | "daily-limit" = "default";

      if (code === "PHONE_DAILY_LIMIT_REACHED") {
        message =
          "Sa ovim brojem telefona već postoji termin za ovaj dan. Za izmenu termina kontaktiraj lokal.";
        variant = "daily-limit";
      }

      if (code === "USER_DAILY_LIMIT_REACHED") {
        message =
          "Već imaš jedan zakazan termin za ovaj dan. Za izmenu termina kontaktiraj lokal.";
        variant = "daily-limit";
      }

      if (code === "APPOINTMENT_SLOT_TAKEN") {
        message = "Termin je upravo zauzet. Izaberi drugi termin.";
        variant = "slot-taken";
      }

      if (code === "DUPLICATE_APPOINTMENT") {
        message = "Termin je već zauzet. Izaberi drugi termin.";
        variant = "slot-taken";
      }

      openBookingResult("conflict", message, bookedAppointment, variant);

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

watch(showReviewSheet, (isReviewOpen) => {
  document.body.style.overflow = isReviewOpen ? "hidden" : "";
});

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

function openBookingResult(
  status: BookingResultStatus,
  message: string | null = null,
  appointment: Appointment | null = selectedAppointment.value ?? null,
  variant: "default" | "slot-taken" | "daily-limit" = "default"
) {
  bookingResultStatus.value = status;
  bookingResultMessage.value = message;
  bookingResultAppointment.value = appointment;
  bookingResultVariant.value = variant;
  showReviewSheet.value = true;
}
function closeBookingResult() {
  bookingResultStatus.value = null;
  bookingResultMessage.value = null;
  bookingResultAppointment.value = null;
}

const router = useRouter();


function finishBookingResult() {
  if (bookingLoading.value) return;

  closeReviewSheet();

  router.push({
    name: "Welcome",
    params: {
      tenantSlug: route.params.tenantSlug,
    },
  });
}

function retryBooking() {
  closeBookingResult();
  showReviewSheet.value = true;
}

function chooseAnotherAppointment() {
  closeReviewSheet();
  selectedAppointment.value = null;
}

const bookingResultDate = computed(() => {
  const sourceDate =
    bookingResultAppointment.value?.start_time ||
    selectedAppointment.value?.start_time;

  if (!sourceDate) return selectedDateLong.value || "-";

  const d = new Date(sourceDate);

  const formatted = new Intl.DateTimeFormat("sr-Latn-RS", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(d);

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
});

const bookingResultTime = computed(() => {
  const sourceDate =
    bookingResultAppointment.value?.start_time ||
    selectedAppointment.value?.start_time;

  if (!sourceDate) return selectedAppointmentTime.value || "-";

  return new Date(sourceDate).toLocaleTimeString("sr-Latn-RS", {
    hour: "2-digit",
    minute: "2-digit",
  });
});

async function handleLogout() {
  try {
    await fetch(`${apiBase}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    isLoggedIn.value = false;
    currentUser.value = null;
  }
}
</script>