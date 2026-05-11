<template>
  <div class="working-page">
    <div class="working-shell">
      <header class="working-nav">
        <button class="working-back" type="button" @click="goBack">
          <span class="working-back__icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M15 18 9 12l6-6" />
            </svg>
          </span>

          <span>Podešavanja</span>
        </button>

        <div class="working-status">
          <span></span>
          Owner
        </div>
      </header>

      <section class="working-hero">
        <div class="working-hero__icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 6v6l4 2" />
            <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>

        <div class="working-hero__copy">
          <span>Lokal</span>
          <h1>Radno vreme</h1>
          <p>
            Podesi standardno radno vreme lokala i posebne dane kao što su praznici,
            odmori ili skraćeno radno vreme.
          </p>
        </div>
      </section>

      <section class="working-card">
        <div class="working-card__top">
          <div>
            <span class="working-card__eyebrow">Segment 1</span>
            <h2>Nedeljno radno vreme</h2>
          </div>

          <button
            class="working-save-small"
            type="button"
            :disabled="savingHours || loading"
            @click="saveWorkingHours"
          >
            {{ savingHours ? "Čuvam..." : "Sačuvaj" }}
          </button>
        </div>

        <div v-if="loading" class="working-state">
          <div class="working-loader"></div>
          <p>Učitavam radno vreme...</p>
        </div>

        <div v-else-if="error" class="working-alert working-alert--error">
          <strong>Greška</strong>
          <p>{{ error }}</p>
          <button type="button" @click="loadAll">Pokušaj ponovo</button>
        </div>

        <div v-else class="week-list">
          <article
            v-for="day in workingDays"
            :key="day.day_of_week"
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
                  @change="normalizeWeeklyDay(day)"
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
              Lokal ne radi ovog dana
            </div>
          </article>
        </div>
      </section>

      <section class="working-card">
        <div class="working-card__top">
          <div>
            <span class="working-card__eyebrow">Segment 2</span>
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
              <small>U tom slučaju nije potrebno unositi vreme.</small>
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

          <label class="note-field">
            <span>Napomena</span>
            <input
              v-model="overrideForm.note"
              type="text"
              placeholder="Npr. Praznik, odmor, skraćeno..."
            />
          </label>

          <div v-if="overrideError" class="working-alert working-alert--error">
            <strong>Greška</strong>
            <p>{{ overrideError }}</p>
          </div>

          <button
            class="working-save"
            type="button"
            :disabled="savingOverride"
            @click="saveOverride"
          >
            {{ savingOverride ? "Čuvam..." : "Potvrdi poseban dan" }}
          </button>
        </div>
      </section>

      <section class="working-card">
        <div class="working-card__top">
          <div>
            <span class="working-card__eyebrow">Segment 3</span>
            <h2>Posebni dani</h2>
          </div>

          <span class="override-count">{{ overrides.length }}</span>
        </div>

        <div v-if="overrides.length === 0" class="working-muted">
          Nema dodatih posebnih dana.
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

                <span v-if="override.note">{{ override.note }}</span>
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

      <p v-if="successMessage" class="working-success">
        {{ successMessage }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

type WorkingDay = {
  id?: number;
  tenant_id?: number;
  day_of_week: number;
  is_working: boolean;
  start_time: string | null;
  end_time: string | null;
};

type WorkingOverride = {
  id: number;
  tenant_id: number;
  start_date: string;
  end_date: string;
  is_closed: boolean | number;
  start_time: string | null;
  end_time: string | null;
  note: string | null;
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
const overrideError = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const workingDays = ref<WorkingDay[]>(createDefaultWorkingDays());
const overrides = ref<WorkingOverride[]>([]);

const currentMonth = ref(startOfMonth(new Date()));

const overrideForm = ref({
  date: toDateInputValue(new Date()),
  is_closed: true,
  start_time: "09:00",
  end_time: "17:00",
  note: "",
});

const weekdayLabels = ["Pon", "Uto", "Sre", "Čet", "Pet", "Sub", "Ned"];

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

const formattedSelectedDate = computed(() => {
  return formatDate(overrideForm.value.date);
});

function goBack() {
  router.push({
    name: "Settings",
    params: {
      tenantSlug: tenantSlug.value,
    },
  });
}

function createDefaultWorkingDays(): WorkingDay[] {
  return [
    { day_of_week: 0, is_working: false, start_time: null, end_time: null },
    { day_of_week: 1, is_working: true, start_time: "09:00", end_time: "20:00" },
    { day_of_week: 2, is_working: true, start_time: "09:00", end_time: "20:00" },
    { day_of_week: 3, is_working: true, start_time: "09:00", end_time: "20:00" },
    { day_of_week: 4, is_working: true, start_time: "09:00", end_time: "20:00" },
    { day_of_week: 5, is_working: true, start_time: "09:00", end_time: "20:00" },
    { day_of_week: 6, is_working: true, start_time: "10:00", end_time: "16:00" },
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

function normalizeWeeklyDay(day: WorkingDay) {
  if (day.is_working) {
    day.start_time = day.start_time || "09:00";
    day.end_time = day.end_time || "17:00";
    return;
  }

  day.start_time = null;
  day.end_time = null;
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

function selectCalendarDay(date: string) {
  overrideForm.value.date = date;

  const existing = overrides.value.find((override) => override.start_date.slice(0, 10) === date);

  if (existing) {
    overrideForm.value.is_closed = Boolean(existing.is_closed);
    overrideForm.value.start_time = normalizeTime(existing.start_time) || "09:00";
    overrideForm.value.end_time = normalizeTime(existing.end_time) || "17:00";
    overrideForm.value.note = existing.note || "";
    return;
  }

  overrideForm.value.is_closed = true;
  overrideForm.value.start_time = "09:00";
  overrideForm.value.end_time = "17:00";
  overrideForm.value.note = "";
}

function hasOverride(date: string) {
  return overrides.value.some((override) => override.start_date.slice(0, 10) === date);
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

async function loadAll() {
  await Promise.all([fetchWorkingHours(), fetchOverrides()]);
}

async function fetchWorkingHours() {
  if (!tenantSlug.value) return;

  loading.value = true;
  error.value = null;
  successMessage.value = null;

  try {
    const res = await fetch(`/api/tenants/${tenantSlug.value}/admin/working-hours`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      error.value = data?.message || "Nije moguće učitati radno vreme.";
      return;
    }

    const receivedDays = data?.working_hours || [];

    if (receivedDays.length === 7) {
      workingDays.value = receivedDays.map((day: any) => ({
        ...day,
        is_working: Boolean(day.is_working),
        start_time: normalizeTime(day.start_time),
        end_time: normalizeTime(day.end_time),
      }));
    } else {
      workingDays.value = createDefaultWorkingDays();
    }
  } catch (err: any) {
    error.value = err?.message || "Došlo je do greške pri učitavanju radnog vremena.";
  } finally {
    loading.value = false;
  }
}

async function fetchOverrides() {
  if (!tenantSlug.value) return;

  try {
    const res = await fetch(`/api/tenants/${tenantSlug.value}/admin/working-overrides`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      error.value = data?.message || "Nije moguće učitati posebne dane.";
      return;
    }

    overrides.value = data?.overrides || [];
  } catch (err: any) {
    error.value = err?.message || "Došlo je do greške pri učitavanju posebnih dana.";
  }
}

async function saveWorkingHours() {
  if (savingHours.value) return;

  error.value = null;
  successMessage.value = null;

  for (const day of workingDays.value) {
    if (!day.is_working) continue;

    if (!day.start_time || !day.end_time) {
      error.value = `Unesi vreme za ${dayName(day.day_of_week)}.`;
      return;
    }

    if (day.start_time >= day.end_time) {
      error.value = `Vreme za ${dayName(day.day_of_week)} nije validno.`;
      return;
    }
  }

  savingHours.value = true;

  try {
    const res = await fetch(`/api/tenants/${tenantSlug.value}/admin/working-hours`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        days: workingDays.value.map((day) => ({
          day_of_week: day.day_of_week,
          is_working: day.is_working,
          start_time: day.is_working ? apiTime(day.start_time) : null,
          end_time: day.is_working ? apiTime(day.end_time) : null,
        })),
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      error.value = data?.message || "Nije moguće sačuvati radno vreme.";
      return;
    }

    successMessage.value = data?.message || "Radno vreme je uspešno sačuvano.";

    await fetchWorkingHours();
  } catch (err: any) {
    error.value = err?.message || "Došlo je do greške pri čuvanju radnog vremena.";
  } finally {
    savingHours.value = false;
  }
}

async function saveOverride() {
  if (savingOverride.value) return;

  overrideError.value = null;
  successMessage.value = null;

  if (!overrideForm.value.date) {
    overrideError.value = "Izaberi datum.";
    return;
  }

  if (!overrideForm.value.is_closed) {
    if (!overrideForm.value.start_time || !overrideForm.value.end_time) {
      overrideError.value = "Unesi radno vreme za poseban dan.";
      return;
    }

    if (overrideForm.value.start_time >= overrideForm.value.end_time) {
      overrideError.value = "Početak mora biti pre kraja radnog vremena.";
      return;
    }
  }

  savingOverride.value = true;

  try {
    const existing = overrides.value.find(
      (override) => override.start_date.slice(0, 10) === overrideForm.value.date
    );

    if (existing) {
      await deleteOverride(existing.id, false);
    }

    const res = await fetch(`/api/tenants/${tenantSlug.value}/admin/working-overrides`, {
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
        note: overrideForm.value.note.trim() || null,
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      overrideError.value = data?.message || "Nije moguće sačuvati poseban dan.";
      return;
    }

    successMessage.value = data?.message || "Poseban dan je sačuvan.";

    overrideForm.value = {
      date: overrideForm.value.date,
      is_closed: true,
      start_time: "09:00",
      end_time: "17:00",
      note: "",
    };

    await fetchOverrides();
  } catch (err: any) {
    overrideError.value = err?.message || "Došlo je do greške pri čuvanju posebnog dana.";
  } finally {
    savingOverride.value = false;
  }
}

async function deleteOverride(id: number, showMessage = true) {
  if (deletingOverrideId.value) return;

  deletingOverrideId.value = id;
  error.value = null;
  successMessage.value = null;

  try {
    const res = await fetch(`/api/tenants/${tenantSlug.value}/admin/working-overrides/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      error.value = data?.message || "Nije moguće ukloniti poseban dan.";
      return;
    }

    if (showMessage) {
      successMessage.value = data?.message || "Poseban dan je uklonjen.";
    }

    await fetchOverrides();
  } catch (err: any) {
    error.value = err?.message || "Došlo je do greške pri brisanju posebnog dana.";
  } finally {
    deletingOverrideId.value = null;
  }
}

onMounted(() => {
  loadAll();
});
</script>

<style scoped lang="scss">
.working-page,
.working-page * {
  box-sizing: border-box;
}

.working-page {
  min-height: 100dvh;
  padding: 14px;
  color: #102438;
  background:
    radial-gradient(circle at 50% -12%, rgba(134, 173, 210, 0.18) 0%, transparent 34%),
    linear-gradient(180deg, #f8fafc 0%, #eef3f7 100%);
  font-family: Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif;
}

.working-shell {
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  padding-bottom: 28px;
}

.working-nav {
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.working-back {
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

.working-back__icon {
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

.working-status {
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

.working-hero {
  margin-top: 8px;
  padding: 18px;
  border-radius: 32px;
  display: flex;
  gap: 14px;
  align-items: flex-start;
  background:
    radial-gradient(circle at 100% 0%, rgba(134, 173, 210, 0.18) 0%, transparent 36%),
    linear-gradient(180deg, #ffffff 0%, #f5f8fb 100%);
  box-shadow:
    0 18px 38px rgba(22, 34, 52, 0.08),
    0 6px 14px rgba(22, 34, 52, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.96),
    inset 0 0 0 1px rgba(64, 93, 122, 0.065);
}

.working-hero__icon {
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
    0 1px 3px rgba(23, 27, 36, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    inset 0 0 0 1px rgba(255, 255, 255, 0.06);

  svg {
    width: 28px;
    height: 28px;
    stroke: currentColor;
    stroke-width: 2.1;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

.working-hero__copy {
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

.working-card {
  margin-top: 14px;
  padding: 16px;
  border-radius: 30px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(247, 250, 252, 0.94) 100%);
  box-shadow:
    0 12px 28px rgba(22, 34, 52, 0.07),
    inset 0 1px 0 rgba(255, 255, 255, 0.96),
    inset 0 0 0 1px rgba(64, 93, 122, 0.06);
}

.working-card__top {
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

.working-card__eyebrow {
  display: block;
  color: rgba(16, 36, 56, 0.42);
  font-size: 10px;
  line-height: 1;
  font-weight: 850;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.working-save-small,
.working-save {
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

.working-save-small {
  height: 40px;
  padding: 0 14px;
  border-radius: 15px;
  font-size: 13px;
}

.working-save {
  width: 100%;
  height: 56px;
  margin-top: 12px;
  border-radius: 20px;
  font-size: 15px;
}

.week-list {
  margin-top: 16px;
  display: grid;
  gap: 10px;
}

.week-day {
  padding: 13px;
  border-radius: 24px;
  background:
    radial-gradient(circle at 100% 0%, rgba(134, 173, 210, 0.12) 0%, transparent 36%),
    linear-gradient(180deg, #ffffff 0%, #f3f7fa 100%);
  box-shadow:
    inset 0 0 0 1px rgba(64, 93, 122, 0.055),
    inset 0 1px 0 rgba(255, 255, 255, 0.92);
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

      &:focus {
        box-shadow:
          inset 0 0 0 1px rgba(64, 93, 122, 0.22),
          0 0 0 4px rgba(134, 173, 210, 0.13),
          inset 0 1px 0 rgba(255, 255, 255, 0.92);
      }
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
  background: linear-gradient(180deg, #ffffff 0%, #f3f7fa 100%);
  box-shadow:
    inset 0 0 0 1px rgba(64, 93, 122, 0.055),
    inset 0 1px 0 rgba(255, 255, 255, 0.92);
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

.note-field {
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
    height: 50px;
    border: 0;
    border-radius: 18px;
    padding: 0 14px;
    color: #102438;
    background: #f1f5f8;
    font-size: 15px;
    font-weight: 720;
    letter-spacing: -0.035em;
    outline: none;
    box-shadow:
      inset 0 0 0 1px rgba(64, 93, 122, 0.06),
      inset 0 1px 0 rgba(255, 255, 255, 0.92);

    &::placeholder {
      color: rgba(16, 36, 56, 0.32);
    }

    &:focus {
      box-shadow:
        inset 0 0 0 1px rgba(64, 93, 122, 0.22),
        0 0 0 4px rgba(134, 173, 210, 0.13),
        inset 0 1px 0 rgba(255, 255, 255, 0.92);
    }
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
  background:
    radial-gradient(circle at 100% 0%, rgba(134, 173, 210, 0.12) 0%, transparent 36%),
    linear-gradient(180deg, #ffffff 0%, #f3f7fa 100%);
  box-shadow:
    inset 0 0 0 1px rgba(64, 93, 122, 0.055),
    inset 0 1px 0 rgba(255, 255, 255, 0.92);

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

  span {
    display: block;
    margin-top: 6px;
    color: rgba(16, 36, 56, 0.48);
    font-size: 12px;
    line-height: 1.35;
    font-weight: 650;
    letter-spacing: -0.025em;
  }
}

.working-muted {
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

.working-state {
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

.working-loader {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  border: 2px solid rgba(64, 93, 122, 0.18);
  border-top-color: #405d7a;
  animation: working-spin 0.8s linear infinite;
}

.working-alert {
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

.working-alert--error {
  color: #b54d4d;
  background: #fff7f7;
  box-shadow:
    inset 0 0 0 1px rgba(181, 77, 77, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.92);
}

.working-success {
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

@keyframes working-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>