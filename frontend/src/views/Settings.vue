<template>
  <main class="st_page">
    <nav class="st_navbar">
      <div>
        <span>Admin</span>
        <h1>Podešavanja</h1>
      </div>

      <button type="button" class="st_nav_btn">
        Studio
      </button>
    </nav>

    <section class="st_panel_card st_panel_card_booking" :class="{ expanded: isBookingOpen }">
      <div class="st_panel_head">
        <div>
          <span>Zakazivanje</span>
          <h2>Dodaj termin</h2>
          <p>Ručno kreiranje termina za klijente koji zovu telefonom.</p>
        </div>

        <button type="button" class="st_panel_action" @click="toggleBooking">
          {{ isBookingOpen ? "Sakrij" : "Dodaj" }}
        </button>
      </div>

      <div v-if="isBookingOpen" class="st_booking_content">
        <div class="st_month_toggle">
          <button
            type="button"
            :class="{ active: selectedMonthOffset === 0 }"
            @click="selectedMonthOffset = 0"
          >
            {{ currentMonthLabel }}
          </button>

          <button
            type="button"
            :class="{ active: selectedMonthOffset === 1 }"
            @click="selectedMonthOffset = 1"
          >
            {{ nextMonthLabel }}
          </button>
        </div>

        <div class="st_calendar">
          <div class="st_weekdays">
            <span>Pon</span>
            <span>Uto</span>
            <span>Sre</span>
            <span>Čet</span>
            <span>Pet</span>
            <span>Sub</span>
            <span>Ned</span>
          </div>

          <div class="st_days_grid">
            <button
              v-for="day in visibleDays"
              :key="day.key"
              type="button"
              class="st_day"
              :class="{
                active: selectedDate === day.date,
                muted: !day.isCurrentMonth,
                disabled: !day.hasFreeSlot
              }"
              :disabled="!day.hasFreeSlot"
              @click="selectDate(day.date)"
            >
              <strong>{{ day.dayNumber }}</strong>
            </button>
          </div>
        </div>

        <div v-if="selectedDate" class="st_slots_area">
          <div class="st_slots_head">
            <div>
              <span>Izabrani dan</span>
              <strong>{{ formattedSelectedDate }}</strong>
            </div>
          </div>

          <div class="st_barber_pick">
            <span>Izaberi frizera</span>

            <div class="st_barber_grid">
              <button
                v-for="barber in barbers"
                :key="barber.id"
                type="button"
                class="st_barber"
                :class="{ active: selectedBarberId === barber.id }"
                @click="selectBarber(barber.id)"
              >
                {{ barber.name }}
              </button>
            </div>
          </div>

          <div class="st_slots_grid" :class="{ disabled: !selectedBarberId }">
            <button
              v-for="slot in selectedDaySlots"
              :key="slot.time"
              type="button"
              class="st_slot"
              :class="{
                active: selectedSlot === slot.time,
                booked: slot.status === 'booked',
                break: slot.status === 'break'
              }"
              :disabled="!selectedBarberId || slot.status !== 'free'"
              @click="selectedSlot = slot.time"
            >
              <strong>{{ slot.time }}</strong>

              <span>
                {{
                  slot.status === "free"
                    ? "Slobodno"
                    : slot.status === "booked"
                    ? "Zauzeto"
                    : "Pauza"
                }}
              </span>
            </button>
          </div>

          <button
            type="button"
            class="st_create_btn"
            :disabled="!canCreateAppointment"
            @click="createAdminAppointment"
          >
            Dodaj termin
          </button>
        </div>
      </div>
    </section>

    <section class="st_control_grid">
      <article class="st_control_card st_control_card_hours">
        <div>
          <span>Radno vreme</span>
          <strong>09:00–19:00</strong>
          <p>Raspored lokala po danima.</p>
        </div>

        <button type="button" @click="goRadnoVreme">
          Uredi
        </button>
      </article>

      <article class="st_control_card st_control_card_services">
        <div>
          <span>Usluge</span>
          <strong>4 aktivne</strong>
          <p>Cene i trajanje usluga.</p>
        </div>

        <button type="button" @click="goUsluge">
          Izmeni
        </button>
      </article>

      <article class="st_control_card st_control_card_stats">
        <div>
          <span>Statistika</span>
          <strong>24</strong>
          <p>Termina ove nedelje.</p>
        </div>

        <button type="button">
          Pregled
        </button>
      </article>

      <article class="st_control_card st_control_card_breaks" :class="{ expanded: isBreaksOpen }">
        <div class="st_breaks_top">
          <div>
            <span>Pauze</span>
            <strong>Dodavanje pauze</strong>
            <p>Izaberi dan, period i opciju ponavljanja.</p>
          </div>

          <button type="button" @click="toggleBreaks">
            {{ isBreaksOpen ? "Sakrij" : "Dodaj pauzu" }}
          </button>
        </div>

        <div v-if="isBreaksOpen" class="st_breaks_content">
          <div class="st_break_month_toggle">
            <button
              type="button"
              :class="{ active: selectedBreakMonthOffset === 0 }"
              @click="selectedBreakMonthOffset = 0"
            >
              {{ currentMonthLabel }}
            </button>

            <button
              type="button"
              :class="{ active: selectedBreakMonthOffset === 1 }"
              @click="selectedBreakMonthOffset = 1"
            >
              {{ nextMonthLabel }}
            </button>
          </div>

          <div class="st_break_calendar">
            <div class="st_break_weekdays">
              <span>Pon</span>
              <span>Uto</span>
              <span>Sre</span>
              <span>Čet</span>
              <span>Pet</span>
              <span>Sub</span>
              <span>Ned</span>
            </div>

            <div class="st_break_days_grid">
              <button
                v-for="day in breakVisibleDays"
                :key="day.key"
                type="button"
                class="st_break_day"
                :class="{
                  active: selectedBreakDate === day.date,
                  muted: !day.isCurrentMonth,
                  disabled: !day.isAvailable
                }"
                :disabled="!day.isAvailable"
                @click="selectBreakDate(day.date)"
              >
                <strong>{{ day.dayNumber }}</strong>
              </button>
            </div>
          </div>

          <div v-if="selectedBreakDate" class="st_break_form">
            <div class="st_slots_head">
              <div>
                <span>Izabrani dan</span>
                <strong>{{ formattedSelectedBreakDate }}</strong>
              </div>
            </div>

            <div class="st_break_time_grid">
              <label class="st_break_field">
                <span>Od</span>
                <input v-model="breakStartTime" type="time" />
              </label>

              <label class="st_break_field">
                <span>Do</span>
                <input v-model="breakEndTime" type="time" />
              </label>
            </div>

            <button
              type="button"
              class="st_repeat_toggle"
              :class="{ active: repeatBreakDaily }"
              @click="repeatBreakDaily = !repeatBreakDaily"
            >
              <span class="st_repeat_switch">
                <i></i>
              </span>

              <span class="st_repeat_text">
                <strong>Ponovi svaki dan</strong>
                <small>Od izabranog dana do kraja sledećeg meseca</small>
              </span>
            </button>

            <button
              type="button"
              class="st_create_btn st_break_create_btn"
              :disabled="!canCreateBreak"
              @click="createBreak"
            >
              Dodaj pauzu
            </button>
          </div>
        </div>
      </article>
    </section>

    <section class="st_section">
      <span class="st_section_label">Upravljanje</span>

      <div class="st_list">
        <button class="st_item" type="button" @click="goLokal">
          <span class="st_icon">⌂</span>

          <span class="st_text">
            <strong>Lokal</strong>
            <small>Podaci, adresa i kontakt</small>
          </span>

          <span class="st_arrow">›</span>
        </button>

        <button class="st_item" type="button" @click="goFrizeri">
          <span class="st_icon">✂</span>

          <span class="st_text">
            <strong>Frizeri</strong>
            <small>Tim, nalozi i dostupnost</small>
          </span>

          <span class="st_arrow">›</span>
        </button>

        <button class="st_item" type="button" @click="goKlijenti">
          <span class="st_icon">◉</span>

          <span class="st_text">
            <strong>Klijenti</strong>
            <small>Pregled i istorija dolazaka</small>
          </span>

          <span class="st_arrow">›</span>
        </button>

        <button class="st_item" type="button" @click="goRadnoVremeFrizera">
          <span class="st_icon">◷</span>

          <span class="st_text">
            <strong>Radno vreme barbera</strong>
            <small>Smene, periodi i pravila</small>
          </span>

          <span class="st_arrow">›</span>
        </button>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

type SlotStatus = "free" | "booked" | "break";

type Slot = {
  time: string;
  status: SlotStatus;
};

type CalendarDay = {
  key: string;
  date: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  hasFreeSlot: boolean;
  freeCount: number;
};

type BreakCalendarDay = {
  key: string;
  date: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isAvailable: boolean;
};

const isBookingOpen = ref(false);
const isBreaksOpen = ref(false);

const selectedMonthOffset = ref(0);
const selectedDate = ref("");
const selectedSlot = ref("");
const selectedBarberId = ref<number | null>(null);

const tenantSlug = computed(() => String(route.params.tenantSlug || ""));


const selectedBreakMonthOffset = ref(0);
const selectedBreakDate = ref("");
const breakStartTime = ref("12:00");
const breakEndTime = ref("12:30");
const repeatBreakDaily = ref(false);

const barbers = [
  { id: 1, name: "Dača" },
  { id: 2, name: "Marko" },
  { id: 3, name: "Nikola" },
];

const slotMap: Record<string, Slot[]> = {};

const currentMonthLabel = computed(() => getMonthLabel(0));
const nextMonthLabel = computed(() => getMonthLabel(1));

const selectedDaySlots = computed(() => {
  if (!selectedDate.value) return [];
  return slotMap[selectedDate.value] ?? buildDefaultSlots(selectedDate.value);
});

const formattedSelectedDate = computed(() => {
  if (!selectedDate.value) return "";

  return new Date(selectedDate.value).toLocaleDateString("sr-RS", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
});

const formattedSelectedBreakDate = computed(() => {
  if (!selectedBreakDate.value) return "";

  return new Date(selectedBreakDate.value).toLocaleDateString("sr-RS", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
});

const visibleDays = computed<CalendarDay[]>(() => {
  const base = new Date();
  const monthStart = new Date(
    base.getFullYear(),
    base.getMonth() + selectedMonthOffset.value,
    1
  );

  const gridStart = getMondayGridStart(monthStart);

  return Array.from({ length: 35 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);

    const iso = toIsoDate(date);
    const slots = slotMap[iso] ?? buildDefaultSlots(iso);
    const freeCount = slots.filter((slot) => slot.status === "free").length;

    return {
      key: iso,
      date: iso,
      dayNumber: date.getDate(),
      isCurrentMonth: date.getMonth() === monthStart.getMonth(),
      hasFreeSlot: freeCount > 0 && date >= stripTime(new Date()),
      freeCount,
    };
  });
});

const breakVisibleDays = computed<BreakCalendarDay[]>(() => {
  const base = new Date();
  const monthStart = new Date(
    base.getFullYear(),
    base.getMonth() + selectedBreakMonthOffset.value,
    1
  );

  const gridStart = getMondayGridStart(monthStart);
  const today = stripTime(new Date());
  const lastAllowedDate = getEndOfNextMonth();

  return Array.from({ length: 35 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);

    const iso = toIsoDate(date);

    return {
      key: iso,
      date: iso,
      dayNumber: date.getDate(),
      isCurrentMonth: date.getMonth() === monthStart.getMonth(),
      isAvailable: date >= today && date <= lastAllowedDate,
    };
  });
});

const canCreateAppointment = computed(() => {
  return Boolean(selectedDate.value && selectedSlot.value && selectedBarberId.value);
});

const canCreateBreak = computed(() => {
  return Boolean(
    selectedBreakDate.value &&
      breakStartTime.value &&
      breakEndTime.value &&
      breakStartTime.value < breakEndTime.value
  );
});

function toggleBooking() {
  isBookingOpen.value = !isBookingOpen.value;
}

function toggleBreaks() {
  isBreaksOpen.value = !isBreaksOpen.value;
}

function selectDate(date: string) {
  selectedDate.value = date;
  selectedSlot.value = "";
  selectedBarberId.value = null;
}

function selectBarber(id: number) {
  selectedBarberId.value = id;
  selectedSlot.value = "";
}

function selectBreakDate(date: string) {
  selectedBreakDate.value = date;
}

function createAdminAppointment() {
  if (!canCreateAppointment.value) return;

  console.log({
    date: selectedDate.value,
    time: selectedSlot.value,
    barberId: selectedBarberId.value,
  });
}

function createBreak() {
  if (!canCreateBreak.value) return;

  console.log({
    date: selectedBreakDate.value,
    startTime: breakStartTime.value,
    endTime: breakEndTime.value,
    repeatDaily: repeatBreakDaily.value,
  });
}

function buildDefaultSlots(date: string): Slot[] {
  const day = new Date(date).getDay();

  if (day === 0) return [];

  return [
    { time: "09:00", status: "free" },
    { time: "09:30", status: "free" },
    { time: "10:00", status: "booked" },
    { time: "10:30", status: "free" },
    { time: "11:00", status: "free" },
    { time: "11:30", status: "break" },
    { time: "12:00", status: "free" },
    { time: "12:30", status: "free" },
    { time: "13:00", status: "booked" },
    { time: "13:30", status: "free" },
    { time: "14:00", status: "free" },
    { time: "14:30", status: "free" },
  ];
}

function getMonthLabel(offset: number) {
  const date = new Date();
  date.setMonth(date.getMonth() + offset);

  return date.toLocaleDateString("sr-RS", {
    month: "long",
  });
}

function getMondayGridStart(date: Date) {
  const start = new Date(date);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  start.setDate(start.getDate() + diff);

  return stripTime(start);
}

function getEndOfNextMonth() {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth() + 2, 0);
}

function stripTime(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function goLokal() {
  router.push({
    name: "Lokal",
    params: {
      tenantSlug: tenantSlug.value,
    },
  });
}
function goFrizeri() {
  router.push({
    name: "Frizeri",
    params: {
      tenantSlug: tenantSlug.value,
    },
  });
}
const goKlijenti = () => router.push("/admin/settings/klijenti");

function goUsluge() {
  router.push({
    name: "Usluge",
    params: {
      tenantSlug: tenantSlug.value,
    },
  });
}
function goRadnoVreme() {
  router.push({
    name: "RadnoVreme",
    params: {
      tenantSlug: tenantSlug.value,
    },
  });
}

function goRadnoVremeFrizera() {
  router.push({
    name: "RadnoVremeFrizera",
    params: {
      tenantSlug: tenantSlug.value,
    },
  });
}

</script>

<style scoped lang="scss">
.st_page {
  min-height: 100dvh;
  padding: 16px 16px 48px;
  background: rgb(251, 252, 254);
  color: #102438;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif;
}

.st_page * {
  box-sizing: border-box;
}

.st_navbar {
  min-height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 18px;
  border-radius: 28px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbfd 100%);
  box-shadow:
    0 18px 34px rgba(38, 55, 78, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.96);

  span {
    display: block;
    margin-bottom: 5px;
    color: #64809c;
    font-size: 11px;
    font-weight: 850;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  h1 {
    margin: 0;
    color: #102438;
    font-size: 24px;
    line-height: 1;
    font-weight: 950;
    letter-spacing: -0.06em;
  }
}

.st_nav_btn {
  height: 38px;
  padding: 0 14px;
  border: 0;
  border-radius: 999px;
  color: #ffffff;
  background: linear-gradient(180deg, #6f87a3 0%, #506c8c 100%);
  font-size: 13px;
  font-weight: 900;
}

.st_panel_card {
  margin-top: 24px;
  border-radius: 30px;
  overflow: hidden;
}

.st_panel_card_booking {
  padding: 18px;
  background: #162332;
  box-shadow:
    0 16px 28px rgba(5, 8, 12, 0.24),
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    inset 0 -1px 0 rgba(0, 0, 0, 0.18);
}

.st_panel_head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;

  span {
    display: block;
    margin-bottom: 7px;
    color: rgba(203, 221, 239, 0.62);
    font-size: 11px;
    font-weight: 850;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  h2 {
    margin: 0;
    color: #ffffff;
    font-size: 22px;
    line-height: 1;
    font-weight: 950;
    letter-spacing: -0.06em;
  }

  p {
    max-width: 230px;
    margin: 8px 0 0;
    color: rgba(228, 238, 248, 0.58);
    font-size: 12px;
    line-height: 1.35;
    font-weight: 650;
  }
}

.st_panel_action {
  flex: 0 0 auto;
  height: 36px;
  padding: 0 14px;
  border: 0;
  border-radius: 999px;
  color: #102438;
  background: #ffffff;
  font-size: 13px;
  font-weight: 900;
}

.st_booking_content {
  margin-top: 18px;
}

.st_month_toggle {
  height: 44px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  padding: 5px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);

  button {
    border: 0;
    border-radius: 999px;
    color: rgba(228, 238, 248, 0.58);
    background: transparent;
    font-size: 13px;
    font-weight: 850;
    text-transform: capitalize;
  }

  button.active {
    color: #102438;
    background: #ffffff;
  }
}

.st_calendar,
.st_break_calendar {
  margin-top: 18px;
}

.st_weekdays,
.st_days_grid,
.st_break_weekdays,
.st_break_days_grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

.st_weekdays,
.st_break_weekdays {
  margin-bottom: 8px;

  span {
    color: rgba(228, 238, 248, 0.45);
    font-size: 11px;
    font-weight: 800;
    text-align: center;
  }
}

.st_days_grid,
.st_break_days_grid {
  gap: 6px;
}

.st_day {
  height: 43px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.14);
  color: white;
  transition:
    transform 0.14s ease,
    background 0.14s ease;
  -webkit-tap-highlight-color: transparent;

  strong {
    font-size: 14px;
    line-height: 1;
    font-weight: 900;
  }

  &:active {
    transform: scale(0.975);
  }
}

.st_day.active {
  background: #ffffff;
  color: #102438;
}

.st_day.muted {
  opacity: 0.48;
}

.st_day.disabled {
  background: transparent;
  color: rgba(228, 238, 248, 0.22);
  opacity: 1;
}

.st_break_month_toggle {
  height: 44px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 16px;

  button {
    border: 0;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.075);
    color: rgba(255, 255, 255, 0.62);
    font-size: 13px;
    font-weight: 850;
    text-transform: capitalize;
  }

  button.active {
    background: rgba(255, 255, 255, 0.18);
    color: #ffffff;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.18);
  }
}

.st_break_day {
  height: 42px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.07);
  color: rgba(255, 255, 255, 0.78);
  transition:
    transform 0.14s ease,
    background 0.14s ease;
  -webkit-tap-highlight-color: transparent;

  strong {
    font-size: 14px;
    line-height: 1;
    font-weight: 850;
  }

  &:active {
    transform: scale(0.975);
  }
}

.st_break_day.active {
  background: rgba(255, 255, 255, 0.18);
  color: #ffffff;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.22);
}

.st_break_day.muted {
  color: rgba(255, 255, 255, 0.32);
}

.st_break_day.disabled {
  background: transparent;
  color: rgba(255, 255, 255, 0.18);
  box-shadow: none;
}

.st_slots_area,
.st_break_form {
  margin-top: 22px;
}

.st_slots_head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  span {
    display: block;
    margin-bottom: 5px;
    color: rgba(203, 221, 239, 0.55);
    font-size: 11px;
    font-weight: 850;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  strong {
    color: white;
    font-size: 16px;
    font-weight: 900;
    text-transform: capitalize;
  }
}

.st_barber_pick {
  margin-top: 18px;

  > span {
    display: block;
    margin-bottom: 10px;
    color: rgba(203, 221, 239, 0.62);
    font-size: 12px;
    font-weight: 850;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
}

.st_barber_grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 9px;
}

.st_barber {
  height: 42px;
  border: 0;
  border-radius: 999px;
  color: rgba(228, 238, 248, 0.72);
  background: rgba(255, 255, 255, 0.075);
  font-size: 13px;
  font-weight: 850;
  transition:
    transform 0.14s ease,
    background 0.14s ease;
  -webkit-tap-highlight-color: transparent;

  &:active {
    transform: scale(0.975);
  }
}

.st_barber.active {
  color: #102438;
  background: #ffffff;
}

.st_slots_grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 9px;
  margin-top: 18px;
}

.st_slots_grid.disabled {
  opacity: 0.42;
}

.st_slot {
  min-height: 58px;
  padding: 10px 8px;
  border: 0;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.075);
  color: white;
  transition:
    transform 0.14s ease,
    background 0.14s ease;
  -webkit-tap-highlight-color: transparent;

  strong {
    display: block;
    font-size: 15px;
    line-height: 1;
    font-weight: 950;
  }

  span {
    display: block;
    margin-top: 6px;
    color: rgba(228, 238, 248, 0.52);
    font-size: 11px;
    font-weight: 750;
  }

  &:active {
    transform: scale(0.975);
  }
}

.st_slot.active {
  background: #ffffff;
  color: #102438;

  span {
    color: #506c8c;
  }
}

.st_slot.booked,
.st_slot.break {
  opacity: 0.38;
}

.st_break_time_grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 16px;
}

.st_break_field {
  display: grid;
  gap: 8px;

  span {
    color: rgba(203, 221, 239, 0.62);
    font-size: 11px;
    font-weight: 850;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  input {
    width: 100%;
    height: 48px;
    padding: 0 13px;
    border: 0;
    border-radius: 18px;
    color: #ffffff;
    background: rgba(255, 255, 255, 0.09);
    font: inherit;
    font-size: 14px;
    font-weight: 850;
    outline: none;
  }
}

.st_repeat_toggle {
  width: 100%;
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding: 12px;
  border: 0;
  border-radius: 22px;
  text-align: left;
  -webkit-tap-highlight-color: transparent;
  background-color: transparent;

}

.st_repeat_switch {
  width: 46px;
  height: 28px;
  display: flex;
  align-items: center;
  padding: 3px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  transition: background 0.18s ease;

  i {
    width: 22px;
    height: 22px;
    display: block;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.88);
    transition: transform 0.18s ease;
  }
}

.st_repeat_toggle.active {
  background: rgba(255, 255, 255, 0.11);

  .st_repeat_switch {
    background: rgba(255, 255, 255, 0.22);

    i {
      transform: translateX(18px);
      background: #ffffff;
    }
  }
}

.st_repeat_text {
  min-width: 0;

  strong {
    display: block;
    color: #ffffff;
    font-size: 14px;
    line-height: 1.1;
    font-weight: 900;
  }

  small {
    display: block;
    margin-top: 5px;
    color: rgba(228, 238, 248, 0.58);
    font-size: 12px;
    line-height: 1.25;
    font-weight: 650;
  }
}

.st_create_btn {
  width: 100%;
  height: 52px;
  margin-top: 18px;
  border: 0;
  border-radius: 999px;
  color: #ffffff;
  background: linear-gradient(180deg, #6f87a3 0%, #506c8c 100%);
  font-size: 15px;
  font-weight: 900;
}

.st_create_btn:disabled {
  opacity: 0.35;
}

.st_break_create_btn {
  background: #ffffff;
  color: #102438;
}

.st_control_grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 24px;
}

.st_control_card {
  min-height: 132px;
  padding: 16px;
  border-radius: 26px;
  box-shadow: 0 18px 34px rgba(38, 55, 78, 0.08);

  span {
    display: block;
    color: rgba(255, 255, 255, 0.68);
    font-size: 10px;
    font-weight: 850;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  strong {
    display: block;
    margin-top: 20px;
    color: #ffffff;
    font-size: 18px;
    line-height: 1;
    font-weight: 950;
    letter-spacing: -0.05em;
  }

  p {
    margin: 7px 0 0;
    color: rgba(255, 255, 255, 0.62);
    font-size: 12px;
    line-height: 1.25;
    font-weight: 650;
  }

  button {
    height: 34px;
    margin-top: 16px;
    padding: 0 13px;
    border: 0;
    border-radius: 999px;
    color: #102438;
    background: #ffffff;
    font-size: 12px;
    font-weight: 900;
  }
}

.st_control_card_hours {
  background: linear-gradient(145deg, #506c8c 0%, #344b64 100%);
}

.st_control_card_services {
  background: linear-gradient(145deg, #31465d 0%, #172536 100%);
}

.st_control_card_stats {
  background: linear-gradient(145deg, #715f8f 0%, #3b314f 100%);
}

.st_control_card_breaks {
  grid-column: 1 / -1;
  min-height: auto;
  background: linear-gradient(145deg, #8a4f4f 0%, #44262d 100%);
}

.st_breaks_top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.st_breaks_content {
  margin-top: 16px;
}

.st_section {
  margin-top: 24px;
}

.st_section_label {
  display: block;
  margin: 0 0 12px 4px;
  font-size: 12px;
  font-weight: 850;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #64809c;
}

.st_list {
  background: white;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 18px 34px rgba(38, 55, 78, 0.08);
}

.st_item {
  width: 100%;
  min-height: 76px;
  display: grid;
  grid-template-columns: 48px 1fr 28px;
  gap: 14px;
  align-items: center;
  padding: 14px 16px;
  border: none;
  background: transparent;
}

.st_item + .st_item {
  border-top: 1px solid rgba(80, 108, 140, 0.09);
}

.st_icon {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background: #f2f5f9;
  color: #506c8c;
  font-size: 20px;
}

.st_text strong {
  display: block;
  font-size: 16px;
  font-weight: 900;
}

.st_text small {
  display: block;
  margin-top: 5px;
  color: rgba(42, 58, 78, 0.56);
}

.st_arrow {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  justify-self: end;
  border-radius: 50%;
  background: #f2f5f9;
}
</style>c