<template>
  <div class="barber-hours-page">
    <div class="barber-hours-shell">
      <header class="barber-hours-nav">
        <button class="barber-hours-back" type="button" @click="goBack">
          <span class="barber-hours-back__icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M15 18 9 12l6-6" />
            </svg>
          </span>

          <span>Podešavanja</span>
        </button>

        <div class="barber-hours-status">
          <span></span>
          {{ roleLabel }}
        </div>
      </header>

      <section class="barber-hours-hero">
        <div class="barber-hours-hero__icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>

        <div class="barber-hours-hero__copy">
          <span>Frizeri</span>
          <h1>Radno vreme frizera</h1>
          <p>
            Podesi standardno radno vreme, smenski rad i posebne dane za izabranog frizera.
          </p>
        </div>
      </section>

      <section v-if="loading" class="barber-hours-card">
        <div class="barber-hours-state">
          <div class="barber-hours-loader"></div>
          <p>Učitavam radno vreme frizera...</p>
        </div>
      </section>

      <section v-else-if="error" class="barber-hours-card">
        <div class="barber-hours-alert barber-hours-alert--error">
          <strong>Greška</strong>
          <p>{{ error }}</p>
          <button type="button" @click="fetchPageData()">Pokušaj ponovo</button>
        </div>
      </section>

      <template v-else>
        <section class="barber-hours-card">
          <div class="barber-hours-card__top">
            <div>
              <span class="barber-hours-card__eyebrow">Segment 1</span>
              <h2>Izbor frizera</h2>
            </div>
          </div>

          <div v-if="canSelectBarber" class="barber-picker">
            <button
              v-for="barber in barbers"
              :key="barber.id"
              type="button"
              class="barber-picker__item"
              :class="{ 'barber-picker__item--active': selectedBarberId === barber.id }"
              @click="selectBarber(barber.id)"
            >
              <span class="barber-picker__avatar">
                {{ barberInitials(barber.name) }}
              </span>

              <span class="barber-picker__copy">
                <strong>{{ barber.name }}</strong>
                <small>{{ barber.is_active ? "Aktivan" : "Neaktivan" }}</small>
              </span>
            </button>
          </div>

          <div v-else class="selected-barber">
            <div class="selected-barber__avatar">
              {{ selectedBarber ? barberInitials(selectedBarber.name) : "F" }}
            </div>

            <div>
              <span>Tvoj profil</span>
              <strong>{{ selectedBarber?.name || "Frizer" }}</strong>
              <p>Nemaš uvid u radno vreme drugih frizera.</p>
            </div>
          </div>
        </section>

        <section class="barber-hours-card">
          <div class="barber-hours-card__top">
            <div>
              <span class="barber-hours-card__eyebrow">Segment 2</span>
              <h2>Standardno radno vreme</h2>
            </div>

            <button
              class="barber-hours-save-small"
              type="button"
              :disabled="savingHours || !selectedBarberId"
              @click="saveWorkingHours"
            >
              {{ savingHours ? "Čuvam..." : "Sačuvaj" }}
            </button>
          </div>

          <div class="mode-card">
            <div class="mode-card__head">
              <div>
                <span>Model rada</span>
                <strong>{{ workMode === "single_shift" ? "Jedna smena" : "Dve smene" }}</strong>
              </div>
            </div>

            <div class="mode-switcher">
              <button
                type="button"
                :class="{ active: workMode === 'single_shift' }"
                @click="setWorkMode('single_shift')"
              >
                Jedna smena
              </button>

              <button
                type="button"
                :class="{ active: workMode === 'alternating_shifts' }"
                @click="setWorkMode('alternating_shifts')"
              >
                Smena 1 / Smena 2
              </button>
            </div>

            <label v-if="workMode === 'alternating_shifts'" class="rotation-field">
              <span>Početak rotacije</span>
              <input v-model="rotationStartsAt" type="date" />
            </label>
          </div>

          <div v-if="workMode === 'alternating_shifts'" class="shift-tabs">
            <button
              type="button"
              :class="{ active: visibleShift === 1 }"
              @click="visibleShift = 1"
            >
              Smena 1
            </button>

            <button
              type="button"
              :class="{ active: visibleShift === 2 }"
              @click="visibleShift = 2"
            >
              Smena 2
            </button>
          </div>

          <div class="week-list">
            <article
              v-for="day in visibleShiftDays"
              :key="`${visibleShift}-${day.day_of_week}`"
              class="week-day"
              :class="{ 'week-day--closed': !day.is_working }"
            >
              <div class="week-day__head">
                <div>
                  <span>{{ shortDayName(day.day_of_week) }}</span>
                  <h3>{{ dayName(day.day_of_week) }}</h3>
                </div>

                <label class="switch">
                  <input
                    v-model="day.is_working"
                    type="checkbox"
                    @change="normalizeShiftDay(day)"
                  />
                  <span></span>
                </label>
              </div>

              <div v-if="day.is_working" class="time-row">
                <label>
                  <span>Od</span>
                  <input v-model="day.start_time" type="time" />
                </label>

                <label>
                  <span>Do</span>
                  <input v-model="day.end_time" type="time" />
                </label>
              </div>

              <div v-else class="closed-note">
                Frizer ne radi ovog dana
              </div>
            </article>
          </div>
        </section>

        <section class="barber-hours-card">
          <div class="barber-hours-card__top">
            <div>
              <span class="barber-hours-card__eyebrow">Segment 3</span>
              <h2>Poseban dan</h2>
            </div>
          </div>

          <div class="calendar-head">
            <button type="button" @click="prevMonth">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M15 18 9 12l6-6" />
              </svg>
            </button>

            <strong>{{ monthTitle }}</strong>

            <button type="button" @click="nextMonth">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>

          <div class="calendar-weekdays">
            <span v-for="label in weekdayLabels" :key="label">
              {{ label }}
            </span>
          </div>

          <div class="calendar-grid">
            <button
              v-for="day in calendarDays"
              :key="day.key"
              type="button"
              class="calendar-day"
              :class="{
                'calendar-day--muted': !day.isCurrentMonth,
                'calendar-day--selected': overrideForm.date === day.date,
                'calendar-day--has-override': hasOverride(day.date)
              }"
              @click="selectCalendarDay(day.date)"
            >
              <span>{{ day.dayNumber }}</span>
            </button>
          </div>

          <div class="override-panel">
            <div class="override-panel__date">
              <span>Izabran datum</span>
              <strong>{{ formattedSelectedDate }}</strong>
            </div>

            <label class="check-row">
              <input v-model="overrideForm.is_closed" type="checkbox" />
              <span>
                <strong>Ovo je neradan dan</strong>
                <small>Ako je čekirano, frizer neće imati termine tog dana.</small>
              </span>
            </label>

            <div v-if="!overrideForm.is_closed" class="time-row">
              <label>
                <span>Od</span>
                <input v-model="overrideForm.start_time" type="time" />
              </label>

              <label>
                <span>Do</span>
                <input v-model="overrideForm.end_time" type="time" />
              </label>
            </div>

            <button
              class="barber-hours-save"
              type="button"
              :disabled="savingOverride || !selectedBarberId"
              @click="saveOverride"
            >
              {{ savingOverride ? "Čuvam..." : "Potvrdi poseban dan" }}
            </button>
          </div>
        </section>

        <section class="barber-hours-card">
          <div class="barber-hours-card__top">
            <div>
              <span class="barber-hours-card__eyebrow">Segment 4</span>
              <h2>Posebni dani frizera</h2>
            </div>

            <span class="override-count">{{ overrides.length }}</span>
          </div>

          <div v-if="overrides.length === 0" class="barber-hours-muted">
            Nema dodatih posebnih dana za ovog frizera.
          </div>

          <div v-else class="override-list">
            <article
              v-for="override in overrides"
              :key="override.id"
              class="override-item"
              :class="{ 'override-item--closed': Boolean(override.is_closed) }"
            >
              <div class="override-item__main">
                <div class="override-item__icon">
                  <svg v-if="Boolean(override.is_closed)" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6 6 18" />
                    <path d="M6 6l12 12" />
                  </svg>

                  <svg v-else viewBox="0 0 24 24" fill="none">
                    <path d="M12 6v6l4 2" />
                    <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>

                <div class="override-item__copy">
                  <h3>{{ formatDate(override.start_date) }}</h3>

                  <p v-if="Boolean(override.is_closed)">
                    Neradan dan
                  </p>

                  <p v-else>
                    {{ formatTime(override.start_time) }} - {{ formatTime(override.end_time) }}
                  </p>
                </div>
              </div>

              <button
                type="button"
                :disabled="deletingOverrideId === override.id"
                @click="deleteOverride(override.id)"
              >
                {{ deletingOverrideId === override.id ? "Brišem..." : "Ukloni" }}
              </button>
            </article>
          </div>
        </section>

        <p v-if="successMessage" class="barber-hours-success">
          {{ successMessage }}
        </p>
      </template>
    </div>

    <transition name="exception-sheet">
      <div
        v-if="exceptionPopup.show"
        class="exception-overlay"
        @click.self="closeExceptionPopup"
      >
        <div class="exception-card">
          <div class="exception-grabber"></div>

          <div class="exception-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
            </svg>
          </div>

          <div class="exception-copy">
            <span>{{ exceptionPopup.kicker }}</span>
            <h3>{{ exceptionPopup.title }}</h3>
            <p>{{ exceptionPopup.message }}</p>
          </div>

          <button type="button" class="exception-action" @click="closeExceptionPopup">
            Razumem
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

type StaffRole = "owner" | "admin" | "barber";

type Barber = {
  id: number;
  tenant_id: number;
  user_id: number | null;
  name: string;
  phone: string | null;
  email: string | null;
  specialty: string | null;
  is_active: boolean | number;
};

type WorkMode = "single_shift" | "alternating_shifts";

type ShiftDay = {
  day_of_week: number;
  is_working: boolean;
  start_time: string | null;
  end_time: string | null;
};

type ShiftGroup = {
  shift_number: 1 | 2;
  days: ShiftDay[];
};

type WorkingOverride = {
  id: number;
  barber_id: number;
  start_date: string;
  end_date: string;
  is_closed: boolean | number;
  start_time: string | null;
  end_time: string | null;
};

type CalendarDay = {
  key: string;
  date: string;
  dayNumber: number;
  isCurrentMonth: boolean;
};

const route = useRoute();
const router = useRouter();

const tenantSlug = computed(() => String(route.params.tenantSlug || ""));

const loading = ref(false);
const savingHours = ref(false);
const savingOverride = ref(false);
const deletingOverrideId = ref<number | null>(null);

const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const staffRole = ref<StaffRole | null>(null);
const canSelectBarber = ref(false);
const selectedBarber = ref<Barber | null>(null);
const selectedBarberId = ref<number | null>(null);
const barbers = ref<Barber[]>([]);

const workMode = ref<WorkMode>("single_shift");
const rotationStartsAt = ref<string | null>(null);
const visibleShift = ref<1 | 2>(1);

const shifts = ref<ShiftGroup[]>([
  { shift_number: 1, days: createDefaultDays() },
  { shift_number: 2, days: createDefaultDays("15:00", "20:00") },
]);

const overrides = ref<WorkingOverride[]>([]);
const currentMonth = ref(startOfMonth(new Date()));

const overrideForm = ref({
  date: toDateInputValue(new Date()),
  is_closed: true,
  start_time: "09:00",
  end_time: "17:00",
});

const exceptionPopup = ref({
  show: false,
  kicker: "Provera radnog vremena",
  title: "Nije moguće sačuvati",
  message: "",
});

const weekdayLabels = ["Pon", "Uto", "Sre", "Čet", "Pet", "Sub", "Ned"];

const roleLabel = computed(() => {
  if (staffRole.value === "owner") return "Owner";
  if (staffRole.value === "admin") return "Admin";
  if (staffRole.value === "barber") return "Barber";
  return "Panel";
});

const visibleShiftDays = computed(() => {
  const shift = shifts.value.find((item) => item.shift_number === visibleShift.value);
  return shift?.days || [];
});

const formattedSelectedDate = computed(() => formatDate(overrideForm.value.date));

const monthTitle = computed(() => {
  return currentMonth.value.toLocaleDateString("sr-RS", {
    month: "long",
    year: "numeric",
  });
});

const calendarDays = computed<CalendarDay[]>(() => {
  const year = currentMonth.value.getFullYear();
  const month = currentMonth.value.getMonth();

  const firstDay = new Date(year, month, 1);
  const firstWeekDay = mondayBasedDay(firstDay.getDay());
  const startDate = new Date(year, month, 1 - firstWeekDay);

  const days: CalendarDay[] = [];

  for (let i = 0; i < 35; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    days.push({
      key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      date: toDateInputValue(date),
      dayNumber: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
    });
  }

  return days;
});

function goBack() {
  router.push({
    name: "Settings",
    params: {
      tenantSlug: tenantSlug.value,
    },
  });
}

function openExceptionPopup(message: string, title = "Nije moguće sačuvati") {
  exceptionPopup.value = {
    show: true,
    kicker: "Provera radnog vremena",
    title,
    message,
  };
}

function closeExceptionPopup() {
  exceptionPopup.value.show = false;
}

function createDefaultDays(start = "09:00", end = "17:00"): ShiftDay[] {
  return [
    { day_of_week: 0, is_working: false, start_time: null, end_time: null },
    { day_of_week: 1, is_working: true, start_time: start, end_time: end },
    { day_of_week: 2, is_working: true, start_time: start, end_time: end },
    { day_of_week: 3, is_working: true, start_time: start, end_time: end },
    { day_of_week: 4, is_working: true, start_time: start, end_time: end },
    { day_of_week: 5, is_working: true, start_time: start, end_time: end },
    { day_of_week: 6, is_working: false, start_time: null, end_time: null },
  ];
}

function normalizeTime(value: string | null) {
  if (!value) return null;
  return value.slice(0, 5);
}

function apiTime(value: string | null) {
  if (!value) return null;
  return value.length === 5 ? `${value}:00` : value;
}

function barberInitials(name: string) {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "F";

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function dayName(day: number) {
  const names: Record<number, string> = {
    0: "Nedelja",
    1: "Ponedeljak",
    2: "Utorak",
    3: "Sreda",
    4: "Četvrtak",
    5: "Petak",
    6: "Subota",
  };

  return names[day] || "Dan";
}

function shortDayName(day: number) {
  const names: Record<number, string> = {
    0: "Ned",
    1: "Pon",
    2: "Uto",
    3: "Sre",
    4: "Čet",
    5: "Pet",
    6: "Sub",
  };

  return names[day] || "Dan";
}

function mondayBasedDay(day: number) {
  return day === 0 ? 6 : day - 1;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(value: string) {
  const dateOnly = value.slice(0, 10);
  const [year, month, day] = dateOnly.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("sr-RS", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatTime(value: string | null) {
  if (!value) return "--:--";
  return value.slice(0, 5);
}

function prevMonth() {
  currentMonth.value = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() - 1,
    1
  );
}

function nextMonth() {
  currentMonth.value = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() + 1,
    1
  );
}

function normalizeShiftDay(day: ShiftDay) {
  if (day.is_working) {
    day.start_time = day.start_time || "09:00";
    day.end_time = day.end_time || "17:00";
    return;
  }

  day.start_time = null;
  day.end_time = null;
}

function setWorkMode(mode: WorkMode) {
  workMode.value = mode;

  if (mode === "single_shift") {
    visibleShift.value = 1;
    rotationStartsAt.value = null;
  }

  if (mode === "alternating_shifts") {
    rotationStartsAt.value = rotationStartsAt.value || toDateInputValue(new Date());

    const hasShift2 = shifts.value.some((shift) => shift.shift_number === 2);

    if (!hasShift2) {
      shifts.value.push({
        shift_number: 2,
        days: createDefaultDays("15:00", "20:00"),
      });
    }
  }
}

function selectCalendarDay(date: string) {
  overrideForm.value.date = date;

  const existing = overrides.value.find((override) => override.start_date.slice(0, 10) === date);

  if (existing) {
    overrideForm.value.is_closed = Boolean(existing.is_closed);
    overrideForm.value.start_time = normalizeTime(existing.start_time) || "09:00";
    overrideForm.value.end_time = normalizeTime(existing.end_time) || "17:00";
    return;
  }

  overrideForm.value.is_closed = true;
  overrideForm.value.start_time = "09:00";
  overrideForm.value.end_time = "17:00";
}

function hasOverride(date: string) {
  return overrides.value.some((override) => override.start_date.slice(0, 10) === date);
}

async function selectBarber(barberId: number) {
  if (selectedBarberId.value === barberId) return;

  selectedBarberId.value = barberId;
  await fetchPageData(barberId);
}

function applyResponseData(data: any) {
  staffRole.value = data?.staff_role || null;
  canSelectBarber.value = Boolean(data?.can_select_barber);

  barbers.value = data?.barbers || [];
  selectedBarber.value = data?.selected_barber || null;
  selectedBarberId.value = data?.selected_barber?.id || null;

  workMode.value = data?.settings?.work_mode || "single_shift";
  rotationStartsAt.value = data?.settings?.rotation_starts_at
    ? data.settings.rotation_starts_at.slice(0, 10)
    : null;

  const incomingHours = Array.isArray(data?.working_hours) ? data.working_hours : [];

  const shift1Rows = incomingHours.filter((row: any) => Number(row.shift_number) === 1);
  const shift2Rows = incomingHours.filter((row: any) => Number(row.shift_number) === 2);

  shifts.value = [
    {
      shift_number: 1,
      days: normalizeShiftRows(shift1Rows, createDefaultDays()),
    },
    {
      shift_number: 2,
      days: normalizeShiftRows(shift2Rows, createDefaultDays("15:00", "20:00")),
    },
  ];

  overrides.value = data?.overrides || [];

  if (workMode.value === "single_shift") {
    visibleShift.value = 1;
  }
}

function normalizeShiftRows(rows: any[], fallback: ShiftDay[]) {
  if (rows.length !== 7) return fallback;

  return rows
    .sort((a, b) => Number(a.day_of_week) - Number(b.day_of_week))
    .map((row) => ({
      day_of_week: Number(row.day_of_week),
      is_working: Boolean(row.is_working),
      start_time: normalizeTime(row.start_time),
      end_time: normalizeTime(row.end_time),
    }));
}

async function fetchPageData(barberId: number | null = selectedBarberId.value) {
  if (!tenantSlug.value) return;

  loading.value = true;
  error.value = null;
  successMessage.value = null;

  try {
    const query = barberId ? `?barber_id=${barberId}` : "";

    const res = await fetch(`/api/tenants/${tenantSlug.value}/admin/barber-working-hours${query}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const message = data?.message || "Nije moguće učitati radno vreme frizera.";
      error.value = message;
      openExceptionPopup(message, "Učitavanje nije uspelo");
      return;
    }

    applyResponseData(data);
  } catch (err: any) {
    const message = err?.message || "Došlo je do greške pri učitavanju radnog vremena frizera.";
    error.value = message;
    openExceptionPopup(message, "Učitavanje nije uspelo");
  } finally {
    loading.value = false;
  }
}

async function fetchOverridesOnly() {
  if (!tenantSlug.value || !selectedBarberId.value) return;

  try {
    const res = await fetch(
      `/api/tenants/${tenantSlug.value}/admin/barber-working-overrides/${selectedBarberId.value}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const message = data?.message || "Nije moguće učitati posebne dane frizera.";
      openExceptionPopup(message, "Posebni dani nisu učitani");
      return;
    }

    overrides.value = data?.overrides || [];
  } catch (err: any) {
    const message = err?.message || "Došlo je do greške pri učitavanju posebnih dana frizera.";
    openExceptionPopup(message, "Posebni dani nisu učitani");
  }
}

async function saveWorkingHours() {
  if (savingHours.value || !selectedBarberId.value) return;

  successMessage.value = null;

  const requiredShifts = workMode.value === "single_shift"
    ? shifts.value.filter((shift) => shift.shift_number === 1)
    : shifts.value.filter((shift) => shift.shift_number === 1 || shift.shift_number === 2);

  if (workMode.value === "alternating_shifts" && !rotationStartsAt.value) {
    openExceptionPopup("Za smenski rad moraš uneti datum početka rotacije.");
    return;
  }

  for (const shift of requiredShifts) {
    for (const day of shift.days) {
      if (!day.is_working) continue;

      if (!day.start_time || !day.end_time) {
        openExceptionPopup(`Unesi vreme za ${dayName(day.day_of_week)} u smeni ${shift.shift_number}.`);
        return;
      }

      if (day.start_time >= day.end_time) {
        openExceptionPopup(`Vreme za ${dayName(day.day_of_week)} u smeni ${shift.shift_number} nije validno.`);
        return;
      }
    }
  }

  savingHours.value = true;

  try {
    const res = await fetch(
      `/api/tenants/${tenantSlug.value}/admin/barber-working-hours/${selectedBarberId.value}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          work_mode: workMode.value,
          rotation_starts_at: workMode.value === "alternating_shifts" ? rotationStartsAt.value : null,
          shifts: requiredShifts.map((shift) => ({
            shift_number: shift.shift_number,
            days: shift.days.map((day) => ({
              day_of_week: day.day_of_week,
              is_working: day.is_working,
              start_time: day.is_working ? apiTime(day.start_time) : null,
              end_time: day.is_working ? apiTime(day.end_time) : null,
            })),
          })),
        }),
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      openExceptionPopup(data?.message || "Nije moguće sačuvati radno vreme frizera.");
      return;
    }

    successMessage.value = data?.message || "Radno vreme frizera je sačuvano.";

    await fetchPageData(selectedBarberId.value);
  } catch (err: any) {
    openExceptionPopup(err?.message || "Došlo je do greške pri čuvanju radnog vremena frizera.");
  } finally {
    savingHours.value = false;
  }
}

async function saveOverride() {
  if (savingOverride.value || !selectedBarberId.value) return;

  successMessage.value = null;

  if (!overrideForm.value.date) {
    openExceptionPopup("Izaberi datum.");
    return;
  }

  if (!overrideForm.value.is_closed) {
    if (!overrideForm.value.start_time || !overrideForm.value.end_time) {
      openExceptionPopup("Unesi radno vreme za poseban dan.");
      return;
    }

    if (overrideForm.value.start_time >= overrideForm.value.end_time) {
      openExceptionPopup("Početak mora biti pre kraja radnog vremena.");
      return;
    }
  }

  savingOverride.value = true;

  try {
    const res = await fetch(
      `/api/tenants/${tenantSlug.value}/admin/barber-working-overrides/${selectedBarberId.value}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          date: overrideForm.value.date,
          is_closed: overrideForm.value.is_closed,
          start_time: overrideForm.value.is_closed ? null : apiTime(overrideForm.value.start_time),
          end_time: overrideForm.value.is_closed ? null : apiTime(overrideForm.value.end_time),
        }),
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      openExceptionPopup(data?.message || "Nije moguće sačuvati poseban dan frizera.");
      return;
    }

    successMessage.value = data?.message || "Poseban dan frizera je sačuvan.";

    overrideForm.value = {
      date: overrideForm.value.date,
      is_closed: true,
      start_time: "09:00",
      end_time: "17:00",
    };

    await fetchOverridesOnly();
  } catch (err: any) {
    openExceptionPopup(err?.message || "Došlo je do greške pri čuvanju posebnog dana.");
  } finally {
    savingOverride.value = false;
  }
}

async function deleteOverride(overrideId: number) {
  if (deletingOverrideId.value || !selectedBarberId.value) return;

  deletingOverrideId.value = overrideId;
  successMessage.value = null;

  try {
    const res = await fetch(
      `/api/tenants/${tenantSlug.value}/admin/barber-working-overrides/${selectedBarberId.value}/${overrideId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      openExceptionPopup(data?.message || "Nije moguće ukloniti poseban dan frizera.");
      return;
    }

    successMessage.value = data?.message || "Poseban dan frizera je uklonjen.";

    await fetchOverridesOnly();
  } catch (err: any) {
    openExceptionPopup(err?.message || "Došlo je do greške pri brisanju posebnog dana frizera.");
  } finally {
    deletingOverrideId.value = null;
  }
}

onMounted(() => {
  fetchPageData();
});
</script>

<style scoped lang="scss">
.barber-hours-page,
.barber-hours-page * {
  box-sizing: border-box;
}

.barber-hours-page {
  min-height: 100dvh;
  padding: 14px;
  color: #102438;
  background:
    radial-gradient(circle at 50% -12%, rgba(134, 173, 210, 0.18) 0%, transparent 34%),
    linear-gradient(180deg, #f8fafc 0%, #eef3f7 100%);
  font-family: Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif;
}

.barber-hours-shell {
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  padding-bottom: 28px;
}

.barber-hours-nav {
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.barber-hours-back {
  border: 0;
  padding: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: #536273;
  font-size: 13px;
  line-height: 1;
  font-weight: 820;
  letter-spacing: -0.035em;
  -webkit-tap-highlight-color: transparent;
}

.barber-hours-back__icon {
  width: 36px;
  height: 36px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: #405d7a;
  background: rgba(255, 255, 255, 0.74);
  box-shadow:
    0 8px 18px rgba(22, 34, 52, 0.055),
    inset 0 0 0 1px rgba(64, 93, 122, 0.07),
    inset 0 1px 0 rgba(255, 255, 255, 0.92);

  svg {
    width: 22px;
    height: 22px;
    stroke: currentColor;
    stroke-width: 2.4;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

.barber-hours-status {
  height: 32px;
  padding: 0 11px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: rgba(16, 36, 56, 0.58);
  background: rgba(255, 255, 255, 0.66);
  font-size: 10px;
  line-height: 1;
  font-weight: 850;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  box-shadow:
    inset 0 0 0 1px rgba(64, 93, 122, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);

  span {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: #86add2;
    box-shadow: 0 0 0 4px rgba(134, 173, 210, 0.15);
  }
}

.barber-hours-hero,
.barber-hours-card {
  background:
    radial-gradient(circle at 100% 0%, rgba(134, 173, 210, 0.14) 0%, transparent 38%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.94) 0%, rgba(247, 250, 252, 0.96) 100%);
  box-shadow:
    0 12px 28px rgba(22, 34, 52, 0.07),
    inset 0 1px 0 rgba(255, 255, 255, 0.96),
    inset 0 0 0 1px rgba(64, 93, 122, 0.06);
}

.barber-hours-hero {
  margin-top: 8px;
  padding: 18px;
  border-radius: 32px;
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.barber-hours-hero__icon {
  width: 52px;
  height: 56px;
  flex: 0 0 52px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  color: #86add2;
  background: linear-gradient(180deg, #2a2f3a 0%, #171b24 100%);
  box-shadow:
    0 5px 12px rgba(23, 27, 36, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);

  svg {
    width: 28px;
    height: 28px;
    stroke: currentColor;
    stroke-width: 2.1;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

.barber-hours-hero__copy {
  min-width: 0;

  span {
    display: block;
    color: #64809c;
    font-size: 10px;
    line-height: 1;
    font-weight: 850;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  h1 {
    margin: 7px 0 0;
    color: #102438;
    font-size: 31px;
    line-height: 0.98;
    font-weight: 870;
    letter-spacing: -0.08em;
  }

  p {
    margin: 11px 0 0;
    color: rgba(16, 36, 56, 0.58);
    font-size: 14px;
    line-height: 1.42;
    font-weight: 610;
    letter-spacing: -0.025em;
  }
}

.barber-hours-card {
  margin-top: 14px;
  padding: 16px;
  border-radius: 30px;
}

.barber-hours-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  h2 {
    margin: 6px 0 0;
    color: #102438;
    font-size: 20px;
    line-height: 1;
    font-weight: 850;
    letter-spacing: -0.06em;
  }
}

.barber-hours-card__eyebrow {
  display: block;
  color: rgba(16, 36, 56, 0.42);
  font-size: 10px;
  line-height: 1;
  font-weight: 850;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.barber-picker {
  margin-top: 16px;
  display: grid;
  gap: 9px;
}

.barber-picker__item,
.selected-barber,
.mode-card,
.week-day,
.override-panel,
.override-item {
  background: linear-gradient(180deg, #ffffff 0%, #f3f7fa 100%);
  box-shadow:
    inset 0 0 0 1px rgba(64, 93, 122, 0.055),
    inset 0 1px 0 rgba(255, 255, 255, 0.92);
}

.barber-picker__item {
  width: 100%;
  min-height: 68px;
  border: 0;
  border-radius: 22px;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 11px;
  text-align: left;
}

.barber-picker__item--active {
  background:
    radial-gradient(circle at 100% 0%, rgba(134, 173, 210, 0.18) 0%, transparent 38%),
    linear-gradient(180deg, #ffffff 0%, #eef5fb 100%);
  box-shadow:
    0 9px 18px rgba(47, 70, 95, 0.08),
    inset 0 0 0 1px rgba(64, 93, 122, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.94);
}

.barber-picker__avatar,
.selected-barber__avatar {
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  border-radius: 17px;
  display: grid;
  place-items: center;
  color: #ffffff;
  background: linear-gradient(180deg, #171d25 0%, #111821 100%);
  font-size: 14px;
  line-height: 1;
  font-weight: 900;
  letter-spacing: -0.07em;
}

.barber-picker__copy {
  display: grid;
  gap: 5px;

  strong {
    color: #102438;
    font-size: 15px;
    line-height: 1;
    font-weight: 850;
    letter-spacing: -0.045em;
  }

  small {
    color: rgba(16, 36, 56, 0.46);
    font-size: 12px;
    line-height: 1;
    font-weight: 720;
    letter-spacing: -0.025em;
  }
}

.selected-barber {
  margin-top: 16px;
  padding: 13px;
  border-radius: 24px;
  display: flex;
  gap: 12px;

  span {
    display: block;
    color: #64809c;
    font-size: 10px;
    line-height: 1;
    font-weight: 850;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  strong {
    display: block;
    margin-top: 6px;
    color: #102438;
    font-size: 17px;
    line-height: 1;
    font-weight: 850;
    letter-spacing: -0.055em;
  }

  p {
    margin: 7px 0 0;
    color: rgba(16, 36, 56, 0.48);
    font-size: 13px;
    line-height: 1.35;
    font-weight: 650;
    letter-spacing: -0.025em;
  }
}

.barber-hours-save-small,
.barber-hours-save {
  border: 0;
  color: #ffffff;
  background: linear-gradient(180deg, #405d7a 0%, #2f465f 100%);
  font-weight: 850;
  letter-spacing: -0.04em;
  box-shadow:
    0 8px 16px rgba(47, 70, 95, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.14);

  &:disabled {
    opacity: 0.62;
  }
}

.barber-hours-save-small {
  height: 40px;
  padding: 0 14px;
  border-radius: 15px;
  font-size: 13px;
}

.barber-hours-save {
  width: 100%;
  height: 56px;
  margin-top: 12px;
  border-radius: 20px;
  font-size: 15px;
}

.mode-card {
  margin-top: 16px;
  padding: 13px;
  border-radius: 24px;
}

.mode-card__head {
  span {
    display: block;
    color: rgba(16, 36, 56, 0.44);
    font-size: 10px;
    line-height: 1;
    font-weight: 850;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  strong {
    display: block;
    margin-top: 7px;
    color: #102438;
    font-size: 18px;
    line-height: 1;
    font-weight: 870;
    letter-spacing: -0.06em;
  }
}

.mode-switcher,
.shift-tabs {
  margin-top: 13px;
  padding: 4px;
  border-radius: 18px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  background: #eef3f7;
  box-shadow:
    inset 0 0 0 1px rgba(64, 93, 122, 0.055),
    inset 0 1px 2px rgba(22, 34, 52, 0.04);

  button {
    height: 42px;
    border: 0;
    border-radius: 14px;
    color: rgba(16, 36, 56, 0.56);
    background: transparent;
    font-size: 13px;
    font-weight: 850;
    letter-spacing: -0.04em;
  }

  button.active {
    color: #102438;
    background: #ffffff;
    box-shadow:
      0 5px 12px rgba(22, 34, 52, 0.06),
      inset 0 0 0 1px rgba(64, 93, 122, 0.055);
  }
}

.rotation-field {
  margin-top: 12px;
  display: grid;
  gap: 7px;

  span {
    padding-left: 2px;
    color: rgba(16, 36, 56, 0.54);
    font-size: 12px;
    line-height: 1;
    font-weight: 800;
    letter-spacing: -0.025em;
  }

  input {
    width: 100%;
    height: 48px;
    border: 0;
    border-radius: 17px;
    padding: 0 12px;
    color: #102438;
    background: #f1f5f8;
    font-size: 15px;
    font-weight: 760;
    outline: none;
    box-shadow:
      inset 0 0 0 1px rgba(64, 93, 122, 0.06),
      inset 0 1px 0 rgba(255, 255, 255, 0.92);
  }
}

.week-list {
  margin-top: 16px;
  display: grid;
  gap: 10px;
}

.week-day {
  padding: 13px;
  border-radius: 24px;
}

.week-day--closed {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.72) 0%, rgba(238, 243, 247, 0.82) 100%);
}

.week-day__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  span {
    display: block;
    color: #64809c;
    font-size: 10px;
    line-height: 1;
    font-weight: 850;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  h3 {
    margin: 6px 0 0;
    color: #102438;
    font-size: 17px;
    line-height: 1;
    font-weight: 850;
    letter-spacing: -0.055em;
  }
}

.switch {
  position: relative;
  width: 52px;
  height: 32px;
  flex: 0 0 52px;

  input {
    display: none;
  }

  span {
    position: absolute;
    inset: 0;
    border-radius: 999px;
    background: #dfe7ee;
    box-shadow:
      inset 0 0 0 1px rgba(64, 93, 122, 0.07),
      inset 0 1px 3px rgba(22, 34, 52, 0.08);
    transition: 0.22s ease;

    &::before {
      content: "";
      position: absolute;
      width: 26px;
      height: 26px;
      top: 3px;
      left: 3px;
      border-radius: 999px;
      background: #ffffff;
      box-shadow:
        0 4px 10px rgba(22, 34, 52, 0.14),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
      transition: 0.22s ease;
    }
  }

  input:checked + span {
    background: linear-gradient(180deg, #405d7a 0%, #2f465f 100%);

    &::before {
      transform: translateX(20px);
    }
  }
}

.time-row {
  margin-top: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;

  label {
    display: grid;
    gap: 7px;

    span {
      padding-left: 2px;
      color: rgba(16, 36, 56, 0.54);
      font-size: 12px;
      line-height: 1;
      font-weight: 800;
      letter-spacing: -0.025em;
    }

    input {
      width: 100%;
      height: 48px;
      border: 0;
      border-radius: 17px;
      padding: 0 12px;
      color: #102438;
      background: #f1f5f8;
      font-size: 15px;
      font-weight: 760;
      outline: none;
      box-shadow:
        inset 0 0 0 1px rgba(64, 93, 122, 0.06),
        inset 0 1px 0 rgba(255, 255, 255, 0.92);
    }
  }
}

.closed-note {
  margin-top: 12px;
  padding: 13px;
  border-radius: 18px;
  color: rgba(16, 36, 56, 0.48);
  background: rgba(255, 255, 255, 0.58);
  font-size: 13px;
  font-weight: 760;
  letter-spacing: -0.025em;
}

.calendar-head {
  margin-top: 16px;
  height: 48px;
  padding: 0 6px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f1f5f8;
  box-shadow:
    inset 0 0 0 1px rgba(64, 93, 122, 0.055),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);

  strong {
    color: #102438;
    font-size: 15px;
    line-height: 1;
    font-weight: 850;
    letter-spacing: -0.04em;
    text-transform: capitalize;
  }

  button {
    width: 38px;
    height: 38px;
    border: 0;
    border-radius: 15px;
    display: grid;
    place-items: center;
    color: #405d7a;
    background: #ffffff;
    box-shadow:
      0 4px 10px rgba(22, 34, 52, 0.05),
      inset 0 0 0 1px rgba(64, 93, 122, 0.055);

    svg {
      width: 20px;
      height: 20px;
      stroke: currentColor;
      stroke-width: 2.4;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  }
}

.calendar-weekdays {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;

  span {
    text-align: center;
    color: rgba(16, 36, 56, 0.38);
    font-size: 10px;
    line-height: 1;
    font-weight: 850;
    letter-spacing: -0.02em;
  }
}

.calendar-grid {
  margin-top: 8px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.calendar-day {
  position: relative;
  aspect-ratio: 1;
  border: 0;
  border-radius: 15px;
  color: #102438;
  background: #f5f8fb;
  font-size: 13px;
  line-height: 1;
  font-weight: 850;
  box-shadow:
    inset 0 0 0 1px rgba(64, 93, 122, 0.045),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);

  span {
    position: relative;
    z-index: 2;
  }

  &::after {
    content: "";
    position: absolute;
    width: 5px;
    height: 5px;
    left: 50%;
    bottom: 6px;
    border-radius: 999px;
    background: transparent;
    transform: translateX(-50%);
  }
}

.calendar-day--muted {
  color: rgba(16, 36, 56, 0.24);
  background: transparent;
  box-shadow: none;
}

.calendar-day--has-override::after {
  background: #86add2;
}

.calendar-day--selected {
  color: #ffffff;
  background: linear-gradient(180deg, #405d7a 0%, #2f465f 100%);
  box-shadow:
    0 8px 16px rgba(47, 70, 95, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.14);

  &::after {
    background: rgba(255, 255, 255, 0.78);
  }
}

.override-panel {
  margin-top: 14px;
  padding: 14px;
  border-radius: 24px;
}

.override-panel__date {
  span {
    display: block;
    color: rgba(16, 36, 56, 0.44);
    font-size: 10px;
    line-height: 1;
    font-weight: 850;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  strong {
    display: block;
    margin-top: 7px;
    color: #102438;
    font-size: 18px;
    line-height: 1.1;
    font-weight: 870;
    letter-spacing: -0.06em;
  }
}

.check-row {
  margin-top: 14px;
  padding: 12px;
  border-radius: 19px;
  display: flex;
  align-items: center;
  gap: 11px;
  background: #f1f5f8;
  box-shadow:
    inset 0 0 0 1px rgba(64, 93, 122, 0.055),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);

  input {
    width: 20px;
    height: 20px;
    accent-color: #405d7a;
  }

  strong {
    display: block;
    color: #102438;
    font-size: 14px;
    line-height: 1.1;
    font-weight: 850;
    letter-spacing: -0.04em;
  }

  small {
    display: block;
    margin-top: 4px;
    color: rgba(16, 36, 56, 0.48);
    font-size: 12px;
    line-height: 1.25;
    font-weight: 650;
    letter-spacing: -0.025em;
  }
}

.override-count {
  height: 34px;
  min-width: 34px;
  padding: 0 10px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  color: #405d7a;
  background: #eef5fb;
  font-size: 13px;
  font-weight: 900;
  box-shadow:
    inset 0 0 0 1px rgba(64, 93, 122, 0.055),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.override-list {
  margin-top: 16px;
  display: grid;
  gap: 10px;
}

.override-item {
  padding: 13px;
  border-radius: 24px;
  display: grid;
  gap: 12px;

  button {
    height: 42px;
    border: 0;
    border-radius: 15px;
    color: #b54d4d;
    background: #fff2f2;
    font-size: 13px;
    font-weight: 820;
    letter-spacing: -0.035em;
    box-shadow:
      inset 0 0 0 1px rgba(181, 77, 77, 0.055),
      inset 0 1px 0 rgba(255, 255, 255, 0.88);

    &:disabled {
      opacity: 0.6;
    }
  }
}

.override-item__main {
  display: flex;
  gap: 12px;
}

.override-item__icon {
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  border-radius: 17px;
  display: grid;
  place-items: center;
  color: #86add2;
  background: linear-gradient(180deg, #2a2f3a 0%, #171b24 100%);
  box-shadow:
    0 8px 16px rgba(17, 26, 38, 0.13),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);

  svg {
    width: 24px;
    height: 24px;
    stroke: currentColor;
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

.override-item--closed .override-item__icon {
  color: #ffb3b3;
}

.override-item__copy {
  min-width: 0;
  flex: 1;

  h3 {
    margin: 1px 0 0;
    color: #102438;
    font-size: 17px;
    line-height: 1.08;
    font-weight: 850;
    letter-spacing: -0.055em;
  }

  p {
    margin: 7px 0 0;
    color: #405d7a;
    font-size: 13px;
    line-height: 1.2;
    font-weight: 850;
    letter-spacing: -0.025em;
  }
}

.barber-hours-muted {
  margin-top: 14px;
  padding: 14px;
  border-radius: 20px;
  color: rgba(16, 36, 56, 0.48);
  background: rgba(255, 255, 255, 0.58);
  font-size: 13px;
  line-height: 1.35;
  font-weight: 700;
  letter-spacing: -0.025em;
}

.barber-hours-state {
  min-height: 180px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 12px;

  p {
    margin: 0;
    color: rgba(16, 36, 56, 0.56);
    font-size: 13px;
    font-weight: 720;
  }
}

.barber-hours-loader {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  border: 2px solid rgba(64, 93, 122, 0.18);
  border-top-color: #405d7a;
  animation: barber-hours-spin 0.8s linear infinite;
}

.barber-hours-alert {
  margin-top: 14px;
  padding: 13px 14px;
  border-radius: 20px;

  strong {
    display: block;
    font-size: 13px;
    line-height: 1;
    font-weight: 850;
  }

  p {
    margin: 7px 0 0;
    font-size: 13px;
    line-height: 1.35;
    font-weight: 620;
    letter-spacing: -0.025em;
  }

  button {
    margin-top: 12px;
    height: 38px;
    padding: 0 13px;
    border: 0;
    border-radius: 14px;
    color: #ffffff;
    background: #171d25;
    font-size: 13px;
    font-weight: 800;
  }
}

.barber-hours-alert--error {
  color: #b54d4d;
  background: #fff7f7;
  box-shadow:
    inset 0 0 0 1px rgba(181, 77, 77, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.92);
}

.barber-hours-success {
  margin: 12px 0 0;
  padding: 13px 14px;
  border-radius: 20px;
  color: #335f4b;
  background: #f2fbf6;
  font-size: 13px;
  line-height: 1.35;
  font-weight: 760;
  letter-spacing: -0.025em;
  box-shadow:
    inset 0 0 0 1px rgba(51, 95, 75, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.92);
}

.exception-overlay {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 18px 14px;
  background:
    radial-gradient(circle at 50% 100%, rgba(64, 93, 122, 0.16) 0%, transparent 36%),
    rgba(15, 23, 32, 0.34);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.exception-card {
  width: 100%;
  max-width: 520px;
  padding: 12px 16px 16px;
  border-radius: 30px;
  background:
    radial-gradient(circle at 100% 0%, rgba(134, 173, 210, 0.18) 0%, transparent 38%),
    linear-gradient(180deg, #ffffff 0%, #f5f8fb 100%);
  box-shadow:
    0 18px 44px rgba(8, 16, 26, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.96),
    inset 0 0 0 1px rgba(64, 93, 122, 0.075);
}

.exception-grabber {
  width: 44px;
  height: 5px;
  margin: 0 auto 16px;
  border-radius: 999px;
  background: rgba(16, 36, 56, 0.13);
}

.exception-icon {
  width: 54px;
  height: 54px;
  border-radius: 20px;
  display: grid;
  place-items: center;
  color: #ffb3b3;
  background: linear-gradient(180deg, #2a2f3a 0%, #171b24 100%);
  box-shadow:
    0 8px 18px rgba(17, 26, 38, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);

  svg {
    width: 28px;
    height: 28px;
    stroke: currentColor;
    stroke-width: 2.1;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

.exception-copy {
  margin-top: 14px;

  span {
    display: block;
    color: #64809c;
    font-size: 10px;
    line-height: 1;
    font-weight: 850;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  h3 {
    margin: 8px 0 0;
    color: #102438;
    font-size: 25px;
    line-height: 1;
    font-weight: 880;
    letter-spacing: -0.075em;
  }

  p {
    margin: 11px 0 0;
    color: rgba(16, 36, 56, 0.62);
    font-size: 14px;
    line-height: 1.43;
    font-weight: 650;
    letter-spacing: -0.03em;
  }
}

.exception-action {
  width: 100%;
  height: 54px;
  margin-top: 16px;
  border: 0;
  border-radius: 20px;
  color: #ffffff;
  background: linear-gradient(180deg, #405d7a 0%, #2f465f 100%);
  font-size: 15px;
  font-weight: 850;
  letter-spacing: -0.04em;
  box-shadow:
    0 8px 16px rgba(47, 70, 95, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.14);
}

.exception-sheet-enter-active,
.exception-sheet-leave-active {
  transition: opacity 0.28s ease;

  .exception-card {
    transition:
      transform 0.34s cubic-bezier(0.22, 1, 0.36, 1),
      opacity 0.28s ease;
  }
}

.exception-sheet-enter-from,
.exception-sheet-leave-to {
  opacity: 0;

  .exception-card {
    opacity: 0;
    transform: translateY(34px) scale(0.98);
  }
}

@keyframes barber-hours-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>