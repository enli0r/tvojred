<template>
  <div class="brv-page">
    <div class="brv-shell">
      <div class="brv-header">
        <div>
          <span class="brv-kicker">Podešavanja frizera</span>
          <h1>Radno vreme frizera</h1>
          <p>Podesi nedeljni raspored, posebne periode i smenski način rada.</p>
        </div>
      </div>

      <!-- DEFAULT WORKING HOURS -->
      <section class="brv-card brv-card-soft">
        <div class="brv-card-head">
          <div>
            <span class="brv-section-label">Osnovni raspored</span>
            <h2>Podrazumevano radno vreme</h2>
            <p>Fallback raspored po danima u nedelji, ako smene nisu aktivne.</p>
          </div>
        </div>

        <div v-if="loadingDefault" class="brv-state">Učitavanje...</div>
        <div v-else-if="defaultError" class="brv-state brv-state-error">{{ defaultError }}</div>
        <div v-else class="brv-list">
          <button
            v-for="day in workingHours"
            :key="day.id"
            type="button"
            class="brv-item"
            @click="openDefaultModal(day)"
          >
            <div class="brv-item-left">
              <span class="brv-item-title">{{ getDayName(day.day_of_week) }}</span>
              <span class="brv-item-sub" :class="{ closed: !normalizeBool(day.is_working) }">
                {{ normalizeBool(day.is_working) ? 'Radi' : 'Ne radi' }}
              </span>
            </div>

            <div class="brv-item-right">
              <span v-if="normalizeBool(day.is_working)" class="brv-item-value">
                {{ formatTime(day.start_time) }} - {{ formatTime(day.end_time) }}
              </span>
              <span v-else class="brv-item-value brv-muted">Zatvoreno</span>
              <span class="brv-chevron">›</span>
            </div>
          </button>
        </div>
      </section>

      <!-- OVERRIDES -->
      <section class="brv-card brv-card-soft">
        <div class="brv-card-head">
          <div>
            <span class="brv-section-label">Izuzeci</span>
            <h2>Posebni periodi</h2>
            <p>Jednokratne izmene za datume ili periode.</p>
          </div>

          <button type="button" class="brv-add-btn" @click="openOverrideCreateModal">
            Dodaj izmenu
          </button>
        </div>

        <div v-if="loadingOverrides" class="brv-state">Učitavanje...</div>
        <div v-else-if="overrideError" class="brv-state brv-state-error">{{ overrideError }}</div>
        <div v-else-if="overrides.length === 0" class="brv-empty">Nema dodatih izmena.</div>
        <div v-else class="brv-list">
          <button
            v-for="item in overrides"
            :key="item.id"
            type="button"
            class="brv-item"
            @click="openOverrideEditModal(item)"
          >
            <div class="brv-item-left">
              <span class="brv-item-title">
                {{ formatDate(item.start_date) }}
                <template v-if="item.start_date !== item.end_date">
                  - {{ formatDate(item.end_date) }}
                </template>
              </span>
              <span class="brv-item-sub" :class="{ closed: normalizeBool(item.is_closed) }">
                {{ normalizeBool(item.is_closed) ? 'Frizer ne radi' : 'Izmenjeno radno vreme' }}
              </span>
            </div>

            <div class="brv-item-right">
              <span v-if="!normalizeBool(item.is_closed)" class="brv-item-value">
                {{ formatTime(item.start_time) }} - {{ formatTime(item.end_time) }}
              </span>
              <span v-else class="brv-item-value brv-muted">Zatvoreno</span>

              <button
                type="button"
                class="brv-delete-btn"
                @click.stop="handleDeleteOverride(item.id)"
                :disabled="deletingOverrideId === item.id"
              >
                {{ deletingOverrideId === item.id ? 'Brisanje...' : 'Obriši' }}
              </button>

              <span class="brv-chevron">›</span>
            </div>
          </button>
        </div>
      </section>

      <!-- SHIFTS -->
      <section class="brv-card brv-shift-card">
        <div class="brv-card-head brv-card-head-shift">
          <div>
            <span class="brv-section-label brv-section-label-light">Smenski rad</span>
            <h2>Smene frizera</h2>
            <p>Smena 1 je obavezna, Smena 2 je opciona. Vreme po danima ne sme da izađe van radnog vremena lokala.</p>
          </div>

          <button type="button" class="brv-save-top-btn" @click="handleSaveShiftSetup" :disabled="savingShiftSetup">
            {{ savingShiftSetup ? 'Čuvanje...' : 'Sačuvaj smene' }}
          </button>
        </div>

        <div v-if="loadingShiftSetup" class="brv-state brv-state-light">Učitavanje smena...</div>
        <div v-else-if="shiftSetupError" class="brv-state brv-state-error">{{ shiftSetupError }}</div>
        <div v-else class="brv-shift-layout">
          <div class="brv-shift-intro">
            <div class="brv-shift-orb">2</div>
            <div>
              <strong>Dve smene bez komplikovanih pravila</strong>
              <span>Admin podešava vremena po danima, a zatim bira da li frizer radi samo prvu ili se smene menjaju svake nedelje.</span>
            </div>
          </div>

          <div class="brv-shift-grid">
            <article class="brv-shift-panel">
              <div class="brv-shift-panel-head">
                <div>
                  <span>Smena 1</span>
                  <h3>Prva smena</h3>
                </div>
                <strong>Obavezna</strong>
              </div>

              <div class="brv-shift-days">
                <div v-for="day in dayOptions" :key="`shift-1-${day.value}`" class="brv-shift-day-row">
                  <label class="brv-shift-day-check">
                    <input v-model="shiftOne[day.value].is_working" type="checkbox" />
                    <span>{{ day.labelLong }}</span>
                  </label>

                  <div class="brv-shift-time-pair" :class="{ disabled: !shiftOne[day.value].is_working }">
                    <input v-model="shiftOne[day.value].start_time" type="time" :disabled="!shiftOne[day.value].is_working" />
                    <span></span>
                    <input v-model="shiftOne[day.value].end_time" type="time" :disabled="!shiftOne[day.value].is_working" />
                  </div>
                </div>
              </div>
            </article>

            <article class="brv-shift-panel brv-shift-panel-muted">
              <div class="brv-shift-panel-head">
                <div>
                  <span>Smena 2</span>
                  <h3>Druga smena</h3>
                </div>
                <strong>Opciono</strong>
              </div>

              <div class="brv-shift-days">
                <div v-for="day in dayOptions" :key="`shift-2-${day.value}`" class="brv-shift-day-row">
                  <label class="brv-shift-day-check">
                    <input v-model="shiftTwo[day.value].is_working" type="checkbox" />
                    <span>{{ day.labelLong }}</span>
                  </label>

                  <div class="brv-shift-time-pair" :class="{ disabled: !shiftTwo[day.value].is_working }">
                    <input v-model="shiftTwo[day.value].start_time" type="time" :disabled="!shiftTwo[day.value].is_working" />
                    <span></span>
                    <input v-model="shiftTwo[day.value].end_time" type="time" :disabled="!shiftTwo[day.value].is_working" />
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div class="brv-mode-card">
            <div class="brv-mode-card-head">
              <div>
                <span class="brv-section-label">Način rada</span>
                <h3>Kako frizer koristi smene?</h3>
                <p v-if="!hasSecondShift">Smena 2 nije uneta, zato je automatski zaključano: frizer radi samo prvu smenu.</p>
                <p v-else>Izaberi da li frizer uvek radi prvu smenu ili se prva i druga smena menjaju naizmenično.</p>
              </div>
            </div>

            <div class="brv-mode-options">
              <label class="brv-mode-option" :class="{ active: shiftSettings.work_mode === 'single_shift' }">
                <input v-model="shiftSettings.work_mode" type="radio" value="single_shift" />
                <span class="brv-mode-dot"></span>
                <div>
                  <strong>Radi samo prvu smenu</strong>
                  <small>Frizer uvek koristi vremena iz Smene 1.</small>
                </div>
              </label>

              <label
                class="brv-mode-option"
                :class="{ active: shiftSettings.work_mode === 'alternating_shifts', disabled: !hasSecondShift }"
              >
                <input
                  v-model="shiftSettings.work_mode"
                  type="radio"
                  value="alternating_shifts"
                  :disabled="!hasSecondShift"
                />
                <span class="brv-mode-dot"></span>
                <div>
                  <strong>Radi naizmenično prvu i drugu smenu</strong>
                  <small>Jedna nedelja Smena 1, sledeća nedelja Smena 2.</small>
                </div>
              </label>
            </div>

            <transition name="brv-soft-reveal">
              <div v-if="shiftSettings.work_mode === 'alternating_shifts' && hasSecondShift" class="brv-rotation-box">
                <label class="brv-field brv-field-dark">
                  <span>Počinje od</span>
                  <input v-model="shiftSettings.rotation_starts_at" type="date" />
                </label>

                <p>
                  Datum označava nedelju u kojoj frizer prvi put radi <strong>Smenu 1</strong>. Sledeće nedelje automatski prelazi na <strong>Smenu 2</strong>.
                </p>
              </div>
            </transition>
          </div>
        </div>
      </section>
    </div>

    <!-- DEFAULT MODAL -->
    <transition name="brv-fade">
      <div v-if="isDefaultModalOpen" class="brv-backdrop" @click="closeDefaultModal"></div>
    </transition>

    <transition name="brv-sheet">
      <div v-if="isDefaultModalOpen" class="brv-modal">
        <div class="brv-handle"></div>

        <div class="brv-modal-head">
          <h3>{{ defaultForm.day_of_week !== null ? getDayName(defaultForm.day_of_week) : '' }}</h3>
          <button type="button" class="brv-close-btn" @click="closeDefaultModal">Zatvori</button>
        </div>

        <div class="brv-modal-body">
          <label class="brv-switch-row">
            <span>Radi ovog dana</span>
            <input v-model="defaultForm.is_working" type="checkbox" />
          </label>

          <div v-if="defaultForm.is_working" class="brv-time-grid">
            <label class="brv-field">
              <span>Početak</span>
              <input v-model="defaultForm.start_time" type="time" />
            </label>

            <label class="brv-field">
              <span>Kraj</span>
              <input v-model="defaultForm.end_time" type="time" />
            </label>
          </div>

          <div v-else class="brv-note">Frizer neće raditi ovog dana.</div>

          <button type="button" class="brv-save-btn" @click="handleSaveDefault" :disabled="savingDefault">
            {{ savingDefault ? 'Čuvanje...' : 'Sačuvaj' }}
          </button>
        </div>
      </div>
    </transition>

    <!-- OVERRIDE MODAL -->
    <transition name="brv-fade">
      <div v-if="isOverrideModalOpen" class="brv-backdrop" @click="closeOverrideModal"></div>
    </transition>

    <transition name="brv-sheet">
      <div v-if="isOverrideModalOpen" class="brv-modal">
        <div class="brv-handle"></div>

        <div class="brv-modal-head">
          <h3>{{ isEditingOverride ? 'Izmeni izmenu' : 'Dodaj izmenu' }}</h3>
          <button type="button" class="brv-close-btn" @click="closeOverrideModal">Zatvori</button>
        </div>

        <div class="brv-modal-body">
          <label class="brv-field">
            <span>Od datuma</span>
            <input v-model="overrideForm.start_date" type="date" />
          </label>

          <label class="brv-field">
            <span>Do datuma</span>
            <input v-model="overrideForm.end_date" type="date" />
          </label>

          <label class="brv-switch-row">
            <span>Frizer ne radi u ovom periodu</span>
            <input v-model="overrideForm.is_closed" type="checkbox" />
          </label>

          <div v-if="!overrideForm.is_closed" class="brv-time-grid">
            <label class="brv-field">
              <span>Početak</span>
              <input v-model="overrideForm.start_time" type="time" />
            </label>

            <label class="brv-field">
              <span>Kraj</span>
              <input v-model="overrideForm.end_time" type="time" />
            </label>
          </div>

          <div v-else class="brv-note">Frizer neće raditi u ovom periodu.</div>

          <button type="button" class="brv-save-btn" @click="handleSaveOverride" :disabled="savingOverride">
            {{ savingOverride ? 'Čuvanje...' : (isEditingOverride ? 'Sačuvaj izmene' : 'Sačuvaj') }}
          </button>
        </div>
      </div>
    </transition>

    <!-- TOASTS -->
    <transition name="brv-toast">
      <div v-if="showError" class="brv-toast-box brv-toast-error">
        {{ errorText }}
      </div>
    </transition>

    <transition name="brv-toast">
      <div v-if="showSuccess" class="brv-toast-box brv-toast-success">
        {{ successText }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

type BarberWorkingHour = {
  id: number;
  barber_id: number;
  day_of_week: number;
  is_working: number | boolean;
  start_time: string | null;
  end_time: string | null;
};

type BarberOverride = {
  id: number;
  barber_id: number;
  start_date: string;
  end_date: string;
  is_closed: number | boolean;
  start_time: string | null;
  end_time: string | null;
};

type ShiftWorkingHour = {
  id?: number;
  barber_id?: number;
  shift_number: 1 | 2;
  day_of_week: number;
  is_working: number | boolean;
  start_time: string | null;
  end_time: string | null;
};

type ShiftSettings = {
  id?: number;
  barber_id?: number;
  work_mode: 'single_shift' | 'alternating_shifts';
  rotation_starts_at: string | null;
  is_active: number | boolean;
};

type ShiftDayForm = {
  is_working: boolean;
  start_time: string;
  end_time: string;
};

const apiBase = import.meta.env.VITE_API_BASE || "/api";
const route = useRoute();
const barberId = Number(route.params.barberId || 8);

const dayOptions = [
  { value: 0, label: 'Ned', labelLong: 'Nedelja' },
  { value: 1, label: 'Pon', labelLong: 'Ponedeljak' },
  { value: 2, label: 'Uto', labelLong: 'Utorak' },
  { value: 3, label: 'Sre', labelLong: 'Sreda' },
  { value: 4, label: 'Čet', labelLong: 'Četvrtak' },
  { value: 5, label: 'Pet', labelLong: 'Petak' },
  { value: 6, label: 'Sub', labelLong: 'Subota' },
];

// DEFAULT
const workingHours = ref<BarberWorkingHour[]>([]);
const loadingDefault = ref(true);
const defaultError = ref('');
const isDefaultModalOpen = ref(false);
const savingDefault = ref(false);

const defaultForm = reactive({
  day_of_week: null as number | null,
  is_working: true,
  start_time: '09:00',
  end_time: '17:00',
});

// OVERRIDES
const overrides = ref<BarberOverride[]>([]);
const loadingOverrides = ref(true);
const overrideError = ref('');
const isOverrideModalOpen = ref(false);
const isEditingOverride = ref(false);
const editingOverrideId = ref<number | null>(null);
const savingOverride = ref(false);
const deletingOverrideId = ref<number | null>(null);

const overrideForm = reactive({
  start_date: '',
  end_date: '',
  is_closed: false,
  start_time: '09:00',
  end_time: '17:00',
});

// SHIFTS
const loadingShiftSetup = ref(true);
const savingShiftSetup = ref(false);
const shiftSetupError = ref('');

const shiftSettings = reactive({
  work_mode: 'single_shift' as 'single_shift' | 'alternating_shifts',
  rotation_starts_at: '',
  is_active: true,
});

const shiftOne = reactive<Record<number, ShiftDayForm>>(createEmptyShiftDays(1));
const shiftTwo = reactive<Record<number, ShiftDayForm>>(createEmptyShiftDays(2));

// TOASTS
const showError = ref(false);
const errorText = ref('');
const showSuccess = ref(false);
const successText = ref('');

const hasSecondShift = computed(() => {
  return dayOptions.some((day) => shiftTwo[day.value].is_working);
});

watch(hasSecondShift, (value) => {
  if (!value) {
    shiftSettings.work_mode = 'single_shift';
    shiftSettings.rotation_starts_at = '';
  }
});

function createEmptyShiftDays(shiftNumber: 1 | 2) {
  const start = shiftNumber === 1 ? '09:00' : '15:00';
  const end = shiftNumber === 1 ? '15:00' : '21:00';

  return dayOptions.reduce((acc, day) => {
    acc[day.value] = {
      is_working: shiftNumber === 1 && day.value >= 1 && day.value <= 5,
      start_time: start,
      end_time: end,
    };

    return acc;
  }, {} as Record<number, ShiftDayForm>);
}

function normalizeBool(value: number | boolean) {
  return value === true || value === 1;
}

function getDayName(day: number) {
  const days = ['Nedelja', 'Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota'];
  return days[day] ?? 'Nepoznat dan';
}

function formatTime(time: string | null) {
  if (!time) return '';
  return time.slice(0, 5);
}

function formatDate(date: string) {
  const parsed = new Date(date);
  return parsed.toLocaleDateString('sr-RS', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function showErrorToast(message: string) {
  errorText.value = message;
  showError.value = true;
}

function showSuccessToast(message: string) {
  successText.value = message;
  showSuccess.value = true;
}

watch(showError, (val) => {
  if (val) {
    setTimeout(() => {
      showError.value = false;
    }, 2500);
  }
});

watch(showSuccess, (val) => {
  if (val) {
    setTimeout(() => {
      showSuccess.value = false;
    }, 2500);
  }
});

// FETCHES
async function fetchWorkingHours() {
  loadingDefault.value = true;
  defaultError.value = '';

  try {
    const res = await fetch(`${apiBase}/barbers/${barberId}/working-hours`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    workingHours.value = await res.json();
  } catch (error) {
    console.error('Failed to fetch barber working hours:', error);
    workingHours.value = [];
    defaultError.value = 'Došlo je do greške pri učitavanju radnog vremena.';
  } finally {
    loadingDefault.value = false;
  }
}

async function fetchOverrides() {
  loadingOverrides.value = true;
  overrideError.value = '';

  try {
    const res = await fetch(`${apiBase}/barbers/${barberId}/working-overrides`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    overrides.value = await res.json();
  } catch (error) {
    console.error('Failed to fetch barber working overrides:', error);
    overrides.value = [];
    overrideError.value = 'Došlo je do greške pri učitavanju posebnih perioda.';
  } finally {
    loadingOverrides.value = false;
  }
}

async function fetchShiftSetup() {
  loadingShiftSetup.value = true;
  shiftSetupError.value = '';

  try {
    const [settingsRes, hoursRes] = await Promise.all([
      fetch(`${apiBase}/barbers/${barberId}/shift-settings`),
      fetch(`${apiBase}/barbers/${barberId}/shift-working-hours`),
    ]);

    if (!settingsRes.ok && settingsRes.status !== 404) throw new Error(`settings HTTP ${settingsRes.status}`);
    if (!hoursRes.ok && hoursRes.status !== 404) throw new Error(`hours HTTP ${hoursRes.status}`);

    if (settingsRes.ok) {
      const settings = (await settingsRes.json()) as ShiftSettings;
      shiftSettings.work_mode = settings.work_mode || 'single_shift';
      shiftSettings.rotation_starts_at = settings.rotation_starts_at || '';
      shiftSettings.is_active = normalizeBool(settings.is_active);
    }

    if (hoursRes.ok) {
      const rows = (await hoursRes.json()) as ShiftWorkingHour[];
      applyShiftRows(rows);
    }
  } catch (error) {
    console.error('Failed to fetch shift setup:', error);
    shiftSetupError.value = 'Došlo je do greške pri učitavanju smena.';
  } finally {
    loadingShiftSetup.value = false;
  }
}

function applyShiftRows(rows: ShiftWorkingHour[]) {
  rows.forEach((row) => {
    const target = row.shift_number === 1 ? shiftOne : shiftTwo;

    target[row.day_of_week] = {
      is_working: normalizeBool(row.is_working),
      start_time: row.start_time ? row.start_time.slice(0, 5) : (row.shift_number === 1 ? '09:00' : '15:00'),
      end_time: row.end_time ? row.end_time.slice(0, 5) : (row.shift_number === 1 ? '15:00' : '21:00'),
    };
  });
}

// DEFAULT MODAL
function openDefaultModal(day: BarberWorkingHour) {
  defaultForm.day_of_week = day.day_of_week;
  defaultForm.is_working = normalizeBool(day.is_working);
  defaultForm.start_time = day.start_time ? day.start_time.slice(0, 5) : '09:00';
  defaultForm.end_time = day.end_time ? day.end_time.slice(0, 5) : '17:00';
  isDefaultModalOpen.value = true;
}

function closeDefaultModal() {
  isDefaultModalOpen.value = false;
  defaultForm.day_of_week = null;
}

async function handleSaveDefault() {
  if (defaultForm.day_of_week === null) return;

  if (defaultForm.is_working) {
    if (!defaultForm.start_time || !defaultForm.end_time) {
      showErrorToast('Unesi početno i krajnje vreme');
      return;
    }

    if (defaultForm.start_time >= defaultForm.end_time) {
      showErrorToast('Početak mora biti pre kraja');
      return;
    }
  }

  try {
    savingDefault.value = true;

    const res = await fetch(
      `${apiBase}/barbers/${barberId}/working-hours/${defaultForm.day_of_week}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_working: defaultForm.is_working,
          start_time: defaultForm.is_working ? `${defaultForm.start_time}:00` : null,
          end_time: defaultForm.is_working ? `${defaultForm.end_time}:00` : null,
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);

    await fetchWorkingHours();
    closeDefaultModal();
    showSuccessToast('Radno vreme je uspešno sačuvano');
  } catch (error: any) {
    console.error(error);
    showErrorToast(error.message || 'Greška pri čuvanju');
  } finally {
    savingDefault.value = false;
  }
}

// OVERRIDE MODAL
function resetOverrideForm() {
  overrideForm.start_date = '';
  overrideForm.end_date = '';
  overrideForm.is_closed = false;
  overrideForm.start_time = '09:00';
  overrideForm.end_time = '17:00';
}

function openOverrideCreateModal() {
  isEditingOverride.value = false;
  editingOverrideId.value = null;
  resetOverrideForm();
  isOverrideModalOpen.value = true;
}

function openOverrideEditModal(item: BarberOverride) {
  isEditingOverride.value = true;
  editingOverrideId.value = item.id;
  overrideForm.start_date = item.start_date;
  overrideForm.end_date = item.end_date;
  overrideForm.is_closed = normalizeBool(item.is_closed);
  overrideForm.start_time = item.start_time ? item.start_time.slice(0, 5) : '09:00';
  overrideForm.end_time = item.end_time ? item.end_time.slice(0, 5) : '17:00';
  isOverrideModalOpen.value = true;
}

function closeOverrideModal() {
  isOverrideModalOpen.value = false;
  isEditingOverride.value = false;
  editingOverrideId.value = null;
  resetOverrideForm();
}

async function handleSaveOverride() {
  if (!overrideForm.start_date || !overrideForm.end_date) {
    showErrorToast('Unesi početni i krajnji datum');
    return;
  }

  if (overrideForm.start_date > overrideForm.end_date) {
    showErrorToast('Početni datum mora biti pre krajnjeg');
    return;
  }

  if (!overrideForm.is_closed) {
    if (!overrideForm.start_time || !overrideForm.end_time) {
      showErrorToast('Unesi početno i krajnje vreme');
      return;
    }

    if (overrideForm.start_time >= overrideForm.end_time) {
      showErrorToast('Početak mora biti pre kraja');
      return;
    }
  }

  try {
    savingOverride.value = true;

    const url = isEditingOverride.value && editingOverrideId.value
      ? `${apiBase}/barbers/${barberId}/working-overrides/${editingOverrideId.value}`
      : `${apiBase}/barbers/${barberId}/working-overrides`;

    const method = isEditingOverride.value ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        start_date: overrideForm.start_date,
        end_date: overrideForm.end_date,
        is_closed: overrideForm.is_closed,
        start_time: overrideForm.is_closed ? null : `${overrideForm.start_time}:00`,
        end_time: overrideForm.is_closed ? null : `${overrideForm.end_time}:00`,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);

    await fetchOverrides();
    closeOverrideModal();
    showSuccessToast(isEditingOverride.value ? 'Izmena je sačuvana' : 'Izmena je uspešno dodata');
  } catch (error: any) {
    console.error(error);
    showErrorToast(error.message || 'Greška pri čuvanju izmene');
  } finally {
    savingOverride.value = false;
  }
}

async function handleDeleteOverride(overrideId: number) {
  try {
    deletingOverrideId.value = overrideId;

    const res = await fetch(`${apiBase}/barbers/${barberId}/working-overrides/${overrideId}`, {
      method: 'DELETE',
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);

    await fetchOverrides();
    showSuccessToast('Izmena je uspešno obrisana');
  } catch (error: any) {
    console.error(error);
    showErrorToast(error.message || 'Greška pri brisanju izmene');
  } finally {
    deletingOverrideId.value = null;
  }
}

function validateShiftDays(shift: Record<number, ShiftDayForm>, label: string) {
  for (const day of dayOptions) {
    const item = shift[day.value];

    if (!item.is_working) continue;

    if (!item.start_time || !item.end_time) {
      showErrorToast(`${label}: unesi vreme za ${day.labelLong}`);
      return false;
    }

    if (item.start_time >= item.end_time) {
      showErrorToast(`${label}: početak mora biti pre kraja za ${day.labelLong}`);
      return false;
    }

    const tenantDay = workingHours.value.find((x) => x.day_of_week === day.value);

    if (tenantDay && normalizeBool(tenantDay.is_working) && tenantDay.start_time && tenantDay.end_time) {
      const tenantStart = tenantDay.start_time.slice(0, 5);
      const tenantEnd = tenantDay.end_time.slice(0, 5);

      if (item.start_time < tenantStart || item.end_time > tenantEnd) {
        showErrorToast(`${label}: ${day.labelLong} mora biti unutar ${tenantStart}-${tenantEnd}`);
        return false;
      }
    }
  }

  return true;
}

function buildShiftPayload(shiftNumber: 1 | 2, shift: Record<number, ShiftDayForm>) {
  return dayOptions.map((day) => ({
    shift_number: shiftNumber,
    day_of_week: day.value,
    is_working: shift[day.value].is_working,
    start_time: shift[day.value].is_working ? `${shift[day.value].start_time}:00` : null,
    end_time: shift[day.value].is_working ? `${shift[day.value].end_time}:00` : null,
  }));
}

async function handleSaveShiftSetup() {
  if (!validateShiftDays(shiftOne, 'Smena 1')) return;
  if (!validateShiftDays(shiftTwo, 'Smena 2')) return;

  if (!hasSecondShift.value) {
    shiftSettings.work_mode = 'single_shift';
    shiftSettings.rotation_starts_at = '';
  }

  if (shiftSettings.work_mode === 'alternating_shifts' && !shiftSettings.rotation_starts_at) {
    showErrorToast('Izaberi datum od kog počinje rotacija');
    return;
  }

  try {
    savingShiftSetup.value = true;

    const payload = {
      settings: {
        work_mode: shiftSettings.work_mode,
        rotation_starts_at: shiftSettings.work_mode === 'alternating_shifts'
          ? shiftSettings.rotation_starts_at
          : null,
        is_active: shiftSettings.is_active,
      },
      working_hours: [
        ...buildShiftPayload(1, shiftOne),
        ...buildShiftPayload(2, shiftTwo),
      ],
    };

    const res = await fetch(`${apiBase}/barbers/${barberId}/shift-setup`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);

    await fetchShiftSetup();
    showSuccessToast('Smene su uspešno sačuvane');
  } catch (error: any) {
    console.error(error);
    showErrorToast(error.message || 'Greška pri čuvanju smena');
  } finally {
    savingShiftSetup.value = false;
  }
}

onMounted(async () => {
  await Promise.all([
    fetchWorkingHours(),
    fetchOverrides(),
    fetchShiftSetup(),
  ]);
});
</script>

<style scoped>
.brv-page {
  min-height: 100vh;
  padding: 16px;
  color: #101521;
  background:
    radial-gradient(circle at top left, rgba(64, 93, 122, 0.12), transparent 34%),
    linear-gradient(180deg, #f7f8fa 0%, #eef1f5 100%);
}

.brv-shell {
  width: min(100%, 960px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.brv-header {
  padding: 8px 2px 4px;
}

.brv-kicker,
.brv-section-label {
  display: inline-flex;
  margin-bottom: 8px;
  color: #405d7a;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.brv-section-label-light {
  color: rgba(255, 255, 255, 0.66);
}

.brv-header h1 {
  margin: 0 0 8px;
  font-size: 30px;
  line-height: 1.03;
  letter-spacing: -0.04em;
}

.brv-header p {
  max-width: 560px;
  margin: 0;
  font-size: 14px;
  line-height: 1.55;
  color: #697386;
}

.brv-card {
  border: 1px solid rgba(17, 24, 39, 0.08);
  border-radius: 26px;
  padding: 18px;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.07);
}

.brv-card-soft {
  backdrop-filter: blur(10px);
}

.brv-card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 16px;
}

.brv-card-head h2 {
  margin: 0 0 6px;
  font-size: 20px;
  line-height: 1.08;
  letter-spacing: -0.03em;
}

.brv-card-head p {
  margin: 0;
  font-size: 14px;
  line-height: 1.45;
  color: #6b7280;
}

.brv-add-btn,
.brv-save-top-btn {
  border: none;
  height: 42px;
  padding: 0 15px;
  border-radius: 14px;
  background: #111827;
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 10px 24px rgba(17, 24, 39, 0.14);
}

.brv-save-top-btn {
  background: #ffffff;
  color: #172033;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
}

.brv-save-top-btn:disabled,
.brv-add-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.brv-state {
  font-size: 14px;
  color: #666;
  padding: 10px 0;
}

.brv-state-light {
  color: rgba(255, 255, 255, 0.76);
}

.brv-state-error {
  color: #dc2626;
}

.brv-empty {
  font-size: 14px;
  color: #8a8a8a;
}

.brv-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.brv-item {
  width: 100%;
  border: 1px solid rgba(17, 24, 39, 0.07);
  background: rgba(248, 250, 252, 0.86);
  border-radius: 18px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  text-align: left;
  cursor: pointer;
}

.brv-item-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.brv-item-title {
  font-size: 15px;
  font-weight: 800;
  color: #111827;
}

.brv-item-sub {
  font-size: 13px;
  color: #405d7a;
  font-weight: 700;
}

.brv-item-sub.closed {
  color: #8a8a8a;
}

.brv-item-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brv-item-value {
  font-size: 14px;
  color: #222;
  font-weight: 700;
}

.brv-muted {
  color: #8a8a8a;
}

.brv-delete-btn {
  border: none;
  background: transparent;
  color: #dc2626;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
}

.brv-delete-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.brv-chevron {
  font-size: 24px;
  line-height: 1;
  color: #a3a3a3;
}

.brv-shift-card {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 10% 0%, rgba(255, 255, 255, 0.16), transparent 28%),
    radial-gradient(circle at 90% 16%, rgba(64, 93, 122, 0.45), transparent 32%),
    linear-gradient(180deg, #172033 0%, #101722 100%);
  border-color: rgba(255, 255, 255, 0.1);
  color: #edf4ff;
  box-shadow: 0 24px 60px rgba(16, 23, 34, 0.22);
}

.brv-card-head-shift h2,
.brv-card-head-shift p {
  color: inherit;
}

.brv-card-head-shift p {
  color: rgba(237, 244, 255, 0.68);
}

.brv-shift-layout {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.brv-shift-intro {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.055);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.brv-shift-orb {
  width: 42px;
  height: 42px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: linear-gradient(180deg, #ffffff 0%, #d9e5f3 100%);
  color: #172033;
  font-weight: 900;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
}

.brv-shift-intro strong {
  display: block;
  margin-bottom: 3px;
  font-size: 14px;
}

.brv-shift-intro span {
  display: block;
  font-size: 13px;
  line-height: 1.45;
  color: rgba(237, 244, 255, 0.68);
}

.brv-shift-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.brv-shift-panel,
.brv-mode-card {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.075);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.brv-shift-panel-muted {
  background: rgba(255, 255, 255, 0.045);
}

.brv-shift-panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}

.brv-shift-panel-head span {
  color: rgba(237, 244, 255, 0.55);
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.brv-shift-panel-head h3 {
  margin: 4px 0 0;
  font-size: 18px;
  letter-spacing: -0.03em;
}

.brv-shift-panel-head strong {
  display: inline-flex;
  align-items: center;
  height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.78);
  font-size: 12px;
}

.brv-shift-days {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.brv-shift-day-row {
  display: grid;
  grid-template-columns: minmax(112px, 0.9fr) 1.5fr;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.055);
}

.brv-shift-day-check {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 13px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.84);
}

.brv-shift-day-check input,
.brv-mode-option input,
.brv-switch-row input {
  accent-color: #405d7a;
}

.brv-shift-time-pair {
  display: grid;
  grid-template-columns: 1fr 10px 1fr;
  align-items: center;
  gap: 8px;
}

.brv-shift-time-pair span {
  height: 1px;
  background: rgba(255, 255, 255, 0.24);
}

.brv-shift-time-pair.disabled {
  opacity: 0.35;
}

.brv-shift-time-pair input,
.brv-field-dark input {
  width: 100%;
  height: 38px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 0 8px;
  box-sizing: border-box;
  color: #edf4ff;
  background: rgba(255, 255, 255, 0.075);
  outline: none;
}

.brv-shift-time-pair input:focus,
.brv-field-dark input:focus {
  border-color: rgba(255, 255, 255, 0.28);
}

.brv-mode-card {
  background: rgba(255, 255, 255, 0.92);
  color: #111827;
}

.brv-mode-card-head h3 {
  margin: 0 0 6px;
  font-size: 20px;
  letter-spacing: -0.03em;
}

.brv-mode-card-head p {
  margin: 0;
  color: #667085;
  font-size: 14px;
  line-height: 1.45;
}

.brv-mode-options {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.brv-mode-option {
  display: grid;
  grid-template-columns: 0 22px 1fr;
  gap: 10px;
  align-items: center;
  padding: 14px;
  border: 1px solid rgba(17, 24, 39, 0.08);
  border-radius: 18px;
  background: #f7f8fa;
  cursor: pointer;
  transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
}

.brv-mode-option input {
  opacity: 0;
  pointer-events: none;
}

.brv-mode-option.active {
  border-color: rgba(64, 93, 122, 0.38);
  background: linear-gradient(180deg, #eef3f8 0%, #ffffff 100%);
  transform: translateY(-1px);
}

.brv-mode-option.disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.brv-mode-dot {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 2px solid rgba(17, 24, 39, 0.18);
}

.brv-mode-option.active .brv-mode-dot {
  border-color: #405d7a;
  box-shadow: inset 0 0 0 4px #ffffff;
  background: #405d7a;
}

.brv-mode-option strong,
.brv-mode-option small {
  display: block;
}

.brv-mode-option strong {
  margin-bottom: 3px;
  font-size: 14px;
}

.brv-mode-option small {
  color: #667085;
  font-size: 13px;
  line-height: 1.35;
}

.brv-rotation-box {
  display: grid;
  grid-template-columns: 210px 1fr;
  gap: 14px;
  align-items: center;
  margin-top: 12px;
  padding: 14px;
  border-radius: 18px;
  background: #111827;
  color: #edf4ff;
}

.brv-rotation-box p {
  margin: 0;
  color: rgba(237, 244, 255, 0.72);
  font-size: 13px;
  line-height: 1.45;
}

.brv-field-dark span {
  color: rgba(237, 244, 255, 0.62) !important;
}

.brv-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 999;
}

.brv-modal {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  width: min(100%, 540px);
  margin: 0 auto;
  background: #fff;
  border-top-left-radius: 26px;
  border-top-right-radius: 26px;
  padding: 10px 16px 20px;
  box-shadow: 0 -10px 35px rgba(0, 0, 0, 0.12);
  max-height: 90vh;
  overflow-y: auto;
}

.brv-handle {
  width: 42px;
  height: 5px;
  border-radius: 999px;
  background: #d6d6d6;
  margin: 4px auto 14px;
}

.brv-modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.brv-modal-head h3 {
  margin: 0;
  font-size: 20px;
  color: #111;
}

.brv-close-btn {
  border: none;
  background: transparent;
  font-size: 14px;
  color: #405d7a;
  font-weight: 800;
  cursor: pointer;
}

.brv-modal-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.brv-switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 15px;
  color: #111;
}

.brv-time-grid,
.brv-two-cols,
.brv-three-cols {
  display: grid;
  gap: 12px;
}

.brv-time-grid,
.brv-two-cols {
  grid-template-columns: 1fr 1fr;
}

.brv-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.brv-field span {
  font-size: 13px;
  color: #6b7280;
}

.brv-field input,
.brv-select {
  height: 44px;
  border: 1px solid #dddddd;
  border-radius: 12px;
  padding: 0 12px;
  font-size: 15px;
  outline: none;
  background: #fff;
}

.brv-field input:focus,
.brv-select:focus {
  border-color: #405d7a;
}

.brv-note {
  font-size: 14px;
  color: #666;
  background: #f7f7f7;
  border-radius: 12px;
  padding: 12px;
}

.brv-save-btn {
  border: none;
  height: 46px;
  border-radius: 14px;
  background: #111827;
  color: #fff;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
}

.brv-save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.brv-toast-box {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  padding: 12px 18px;
  border-radius: 12px;
  font-size: 14px;
  z-index: 2000;
}

.brv-toast-error {
  background: #111;
}

.brv-toast-success {
  background: #16a34a;
}

.brv-fade-enter-active,
.brv-fade-leave-active {
  transition: opacity 0.2s ease;
}

.brv-fade-enter-from,
.brv-fade-leave-to {
  opacity: 0;
}

.brv-sheet-enter-active,
.brv-sheet-leave-active {
  transition: transform 0.24s ease, opacity 0.24s ease;
}

.brv-sheet-enter-from,
.brv-sheet-leave-to {
  transform: translateY(100%);
  opacity: 0.98;
}

.brv-toast-enter-active,
.brv-toast-leave-active,
.brv-soft-reveal-enter-active,
.brv-soft-reveal-leave-active {
  transition: all 0.25s ease;
}

.brv-toast-enter-from,
.brv-toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

.brv-soft-reveal-enter-from,
.brv-soft-reveal-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 720px) {
  .brv-page {
    padding: 14px;
  }

  .brv-card-head,
  .brv-card-head-shift {
    flex-direction: column;
  }

  .brv-add-btn,
  .brv-save-top-btn {
    width: 100%;
  }

  .brv-item {
    align-items: flex-start;
    flex-direction: column;
  }

  .brv-item-right {
    width: 100%;
    justify-content: space-between;
  }

  .brv-shift-grid {
    grid-template-columns: 1fr;
  }

  .brv-shift-day-row {
    grid-template-columns: 1fr;
  }

  .brv-rotation-box,
  .brv-time-grid,
  .brv-two-cols,
  .brv-three-cols {
    grid-template-columns: 1fr;
  }
}
</style>