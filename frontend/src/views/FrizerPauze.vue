<template>
  <div class="bp-page">
    <div class="bp-shell">
      <div class="bp-header">
        <div>
          <h1>Pauze frizera</h1>
          <p>Dodaj i upravljaj pauzama za izabranog frizera.</p>
        </div>
      </div>

      <!-- FILTER DATE -->
      <section class="bp-card">
        <div class="bp-card-head">
          <div>
            <h2>Izabrani datum</h2>
            <p>Prikaz pauza za konkretan dan.</p>
          </div>
        </div>

        <div class="bp-date-row">
          <label class="bp-field">
            <span>Datum</span>
            <input v-model="selectedDate" type="date" @change="fetchBreaks" />
          </label>

          <button type="button" class="bp-secondary-btn" @click="setToday">
            Danas
          </button>
        </div>
      </section>

      <!-- TODAY BREAKS -->
      <section class="bp-card">
        <div class="bp-card-head">
          <div>
            <h2>Pauze danas</h2>
            <p>Lista pauza koje važe za izabrani datum.</p>
          </div>

          <button type="button" class="bp-add-btn" @click="openQuickTodayModal">
            + Dodaj danas
          </button>
        </div>

        <div v-if="loading" class="bp-state">Učitavanje...</div>
        <div v-else-if="errorMessage" class="bp-state bp-state-error">{{ errorMessage }}</div>
        <div v-else-if="todayBreaks.length === 0" class="bp-empty">
          Nema pauza za izabrani datum.
        </div>
        <div v-else class="bp-list">
          <button
            v-for="item in todayBreaks"
            :key="item.id"
            type="button"
            class="bp-item"
            @click="openEditModal(item)"
          >
            <div class="bp-item-left">
              <span class="bp-item-title">
                {{ formatTime(item.start_time) }} - {{ formatTime(item.end_time) }}
              </span>
              <span class="bp-item-sub">
                {{ buildRepeatLabel(item) }}
              </span>
            </div>

            <div class="bp-item-right">
              <button
                v-if="canEditBreak(item)"
                type="button"
                class="bp-delete-btn"
                @click.stop="handleDelete(item.id)"
                :disabled="deletingId === item.id"
              >
                {{ deletingId === item.id ? 'Brisanje...' : 'Obriši' }}
              </button>

              <span class="bp-chevron">›</span>
            </div>
          </button>
        </div>
      </section>

      <!-- ACTIVE BREAKS -->
      <section class="bp-card">
        <div class="bp-card-head">
          <div>
            <h2>Aktivne pauze</h2>
            <p>Aktivne i buduće pauze koje možeš menjati.</p>
          </div>
        </div>

        <div v-if="loading" class="bp-state">Učitavanje...</div>
        <div v-else-if="activeBreaks.length === 0" class="bp-empty">
          Nema aktivnih pauza.
        </div>
        <div v-else class="bp-list">
          <button
            v-for="item in activeBreaks"
            :key="item.id"
            type="button"
            class="bp-item"
            @click="openEditModal(item)"
          >
            <div class="bp-item-left">
              <span class="bp-item-title">
                {{ formatDate(item.break_date) }}
                <template v-if="item.repeat_until">
                  - {{ formatDate(item.repeat_until) }}
                </template>
              </span>
              <span class="bp-item-sub">
                {{ formatTime(item.start_time) }} - {{ formatTime(item.end_time) }} · {{ buildRepeatLabel(item) }}
              </span>
            </div>

            <div class="bp-item-right">
              <button
                type="button"
                class="bp-delete-btn"
                @click.stop="handleDelete(item.id)"
                :disabled="deletingId === item.id"
              >
                {{ deletingId === item.id ? 'Brisanje...' : 'Obriši' }}
              </button>

              <span class="bp-chevron">›</span>
            </div>
          </button>
        </div>
      </section>

      <!-- PAST BREAKS -->
      <section class="bp-card">
        <button type="button" class="bp-collapse-head" @click="pastExpanded = !pastExpanded">
          <div>
            <h2>Prošle pauze</h2>
            <p>Arhiva ranijih pauza bez izmene i brisanja.</p>
          </div>

          <span class="bp-collapse-icon" :class="{ open: pastExpanded }">⌄</span>
        </button>

        <transition name="bp-collapse">
          <div v-if="pastExpanded" class="bp-collapse-body">
            <div v-if="loading" class="bp-state">Učitavanje...</div>
            <div v-else-if="pastBreaks.length === 0" class="bp-empty">
              Nema prošlih pauza.
            </div>
            <div v-else class="bp-list">
              <div
                v-for="item in pastBreaks"
                :key="item.id"
                class="bp-item bp-item-static"
              >
                <div class="bp-item-left">
                  <span class="bp-item-title">
                    {{ formatDate(item.break_date) }}
                    <template v-if="item.repeat_until">
                      - {{ formatDate(item.repeat_until) }}
                    </template>
                  </span>
                  <span class="bp-item-sub">
                    {{ formatTime(item.start_time) }} - {{ formatTime(item.end_time) }} · {{ buildRepeatLabel(item) }}
                  </span>
                </div>

                <div class="bp-item-right">
                  <span class="bp-muted">Prošlo</span>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </section>
    </div>

    <!-- FLOATING BUTTON -->
    <button type="button" class="bp-fab" @click="openCreateModal">
      +
    </button>

    <!-- MODAL -->
    <transition name="bp-fade">
      <div v-if="isModalOpen" class="bp-backdrop" @click="closeModal"></div>
    </transition>

    <transition name="bp-sheet">
      <div v-if="isModalOpen" class="bp-modal">
        <div class="bp-handle"></div>

        <div class="bp-modal-head">
          <h3>{{ isEditing ? 'Izmeni pauzu' : 'Dodaj pauzu' }}</h3>
          <button type="button" class="bp-close-btn" @click="closeModal">Zatvori</button>
        </div>

        <div class="bp-modal-body">
          <label class="bp-field">
            <span>Datum</span>
            <input v-model="form.break_date" type="date" />
          </label>

          <div class="bp-two-cols">
            <label class="bp-field">
              <span>Od</span>
              <input v-model="form.start_time" type="time" />
            </label>

            <label class="bp-field">
              <span>Do</span>
              <input v-model="form.end_time" type="time" />
            </label>
          </div>

          <label class="bp-field">
            <span>Napomena</span>
            <input v-model="form.note" type="text" placeholder="Npr. pauza za ručak" />
          </label>

          <label class="bp-switch-row">
            <span>Aktivna pauza</span>
            <input v-model="form.is_active" type="checkbox" />
          </label>

          <div class="bp-repeat-box">
            <h4>Ponavljanje</h4>

            <label class="bp-radio-row">
              <input v-model="form.repeat_type" type="radio" value="none" />
              <span>Bez ponavljanja</span>
            </label>

            <label class="bp-radio-row">
              <input v-model="form.repeat_type" type="radio" value="daily" />
              <span>Ponovi pauzu svakog dana</span>
            </label>

            <label class="bp-radio-row">
              <input v-model="form.repeat_type" type="radio" value="weekly" />
              <span>Ponavljaj po danima u nedelji</span>
            </label>

            <label v-if="form.repeat_type !== 'none'" class="bp-field">
              <span>Ponavljaj do</span>
              <input v-model="form.repeat_until" type="date" />
            </label>

            <div v-if="form.repeat_type === 'weekly'" class="bp-field">
              <span>Izaberi dane</span>

              <div class="bp-days">
                <button
                  v-for="day in dayOptions"
                  :key="day.value"
                  type="button"
                  class="bp-day-chip"
                  :class="{ active: form.repeat_days.includes(day.value) }"
                  @click="toggleRepeatDay(day.value)"
                >
                  {{ day.label }}
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            class="bp-save-btn"
            @click="handleSave"
            :disabled="saving"
          >
            {{ saving ? 'Čuvanje...' : (isEditing ? 'Sačuvaj izmene' : 'Sačuvaj pauzu') }}
          </button>
        </div>
      </div>
    </transition>

    <!-- TOASTS -->
    <transition name="bp-toast">
      <div v-if="showError" class="bp-toast-box bp-toast-error">
        {{ errorText }}
      </div>
    </transition>

    <transition name="bp-toast">
      <div v-if="showSuccess" class="bp-toast-box bp-toast-success">
        {{ successText }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

type BarberBreak = {
  id: number;
  barber_id: number;
  break_date: string;
  start_time: string;
  end_time: string;
  repeat_type: 'none' | 'daily' | 'weekly';
  repeat_until: string | null;
  is_active: number | boolean;
  note: string | null;
  repeat_days: number[];
};

const apiBase = import.meta.env.VITE_API_BASE;
const route = useRoute();
const barberId = Number(route.params.barberId || 8);

const todayBreaks = ref<BarberBreak[]>([]);
const activeBreaks = ref<BarberBreak[]>([]);
const pastBreaks = ref<BarberBreak[]>([]);

const loading = ref(true);
const errorMessage = ref('');

const isModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref<number | null>(null);

const saving = ref(false);
const deletingId = ref<number | null>(null);

const pastExpanded = ref(false);

const selectedDate = ref(new Date().toISOString().slice(0, 10));

const showError = ref(false);
const errorText = ref('');
const showSuccess = ref(false);
const successText = ref('');

const dayOptions = [
  { value: 0, label: 'Ned' },
  { value: 1, label: 'Pon' },
  { value: 2, label: 'Uto' },
  { value: 3, label: 'Sre' },
  { value: 4, label: 'Čet' },
  { value: 5, label: 'Pet' },
  { value: 6, label: 'Sub' },
];

const form = reactive({
  break_date: '',
  start_time: '12:00',
  end_time: '12:30',
  repeat_type: 'none' as 'none' | 'daily' | 'weekly',
  repeat_until: '',
  is_active: true,
  note: '',
  repeat_days: [] as number[],
});

function formatTime(time: string | null) {
  if (!time) return '';
  return time.slice(0, 5);
}

function formatDate(date: string | null) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('sr-RS', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function normalizeBool(value: number | boolean) {
  return value === true || value === 1;
}

function setToday() {
  selectedDate.value = new Date().toISOString().slice(0, 10);
  fetchBreaks();
}

function resetForm() {
  form.break_date = selectedDate.value;
  form.start_time = '12:00';
  form.end_time = '12:30';
  form.repeat_type = 'none';
  form.repeat_until = '';
  form.is_active = true;
  form.note = '';
  form.repeat_days = [];
}

function openCreateModal() {
  isEditing.value = false;
  editingId.value = null;
  resetForm();
  isModalOpen.value = true;
}

function openQuickTodayModal() {
  isEditing.value = false;
  editingId.value = null;
  resetForm();
  form.break_date = selectedDate.value;
  isModalOpen.value = true;
}

function openEditModal(item: BarberBreak) {
  if (!canEditBreak(item)) return;

  isEditing.value = true;
  editingId.value = item.id;

  form.break_date = item.break_date;
  form.start_time = item.start_time.slice(0, 5);
  form.end_time = item.end_time.slice(0, 5);
  form.repeat_type = item.repeat_type;
  form.repeat_until = item.repeat_until || '';
  form.is_active = normalizeBool(item.is_active);
  form.note = item.note || '';
  form.repeat_days = Array.isArray(item.repeat_days) ? [...item.repeat_days] : [];

  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  isEditing.value = false;
  editingId.value = null;
  resetForm();
}

function toggleRepeatDay(day: number) {
  if (form.repeat_days.includes(day)) {
    form.repeat_days = form.repeat_days.filter((d) => d !== day);
    return;
  }

  form.repeat_days = [...form.repeat_days, day].sort((a, b) => a - b);
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

function buildRepeatLabel(item: BarberBreak) {
  if (item.repeat_type === 'none') {
    return `Jednokratno · ${formatDate(item.break_date)}`;
  }

  if (item.repeat_type === 'daily') {
    return `Svakog dana do ${formatDate(item.repeat_until)}`;
  }

  const days = (item.repeat_days || []).map((d) => dayOptions.find((x) => x.value === d)?.label || '?').join(', ');
  return `Svakog: ${days} · do ${formatDate(item.repeat_until)}`;
}

function canEditBreak(item: BarberBreak) {
  const today = new Date().toISOString().slice(0, 10);

  if (item.repeat_type === 'none') {
    return item.break_date >= today;
  }

  if (item.repeat_until) {
    return item.repeat_until >= today;
  }

  return true;
}

async function fetchBreaks() {
  loading.value = true;
  errorMessage.value = '';

  try {
    const res = await fetch(`${apiBase}/barbers/${barberId}/breaks?date=${selectedDate.value}`);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();

    todayBreaks.value = data.today_breaks || [];
    activeBreaks.value = data.active_breaks || [];
    pastBreaks.value = data.past_breaks || [];
  } catch (error) {
    console.error('Failed to fetch breaks:', error);
    todayBreaks.value = [];
    activeBreaks.value = [];
    pastBreaks.value = [];
    errorMessage.value = 'Došlo je do greške pri učitavanju pauza.';
  } finally {
    loading.value = false;
  }
}

async function handleSave() {
  if (!form.break_date) {
    showErrorToast('Izaberi datum');
    return;
  }

  if (!form.start_time || !form.end_time) {
    showErrorToast('Unesi početno i krajnje vreme');
    return;
  }

  if (form.start_time >= form.end_time) {
    showErrorToast('Početak mora biti pre kraja');
    return;
  }

  if (form.repeat_type !== 'none' && !form.repeat_until) {
    showErrorToast('Unesi datum do kog se pauza ponavlja');
    return;
  }

  if (form.repeat_until && form.break_date > form.repeat_until) {
    showErrorToast('Datum pauze mora biti pre datuma ponavljanja');
    return;
  }

  if (form.repeat_type === 'weekly' && form.repeat_days.length === 0) {
    showErrorToast('Izaberi bar jedan dan u nedelji');
    return;
  }

  try {
    saving.value = true;

    const url = isEditing.value && editingId.value
      ? `${apiBase}/barbers/${barberId}/breaks/${editingId.value}`
      : `${apiBase}/barbers/${barberId}/breaks`;

    const method = isEditing.value ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        break_date: form.break_date,
        start_time: `${form.start_time}:00`,
        end_time: `${form.end_time}:00`,
        repeat_type: form.repeat_type,
        repeat_until: form.repeat_type === 'none' ? null : form.repeat_until,
        is_active: form.is_active,
        note: form.note || null,
        repeat_days: form.repeat_type === 'weekly' ? form.repeat_days : [],
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || `HTTP ${res.status}`);
    }

    await fetchBreaks();
    closeModal();
    showSuccessToast(isEditing.value ? 'Pauza je sačuvana' : 'Pauza je uspešno dodata');
  } catch (error: any) {
    console.error(error);
    showErrorToast(error.message || 'Greška pri čuvanju pauze');
  } finally {
    saving.value = false;
  }
}

async function handleDelete(breakId: number) {
  try {
    deletingId.value = breakId;

    const res = await fetch(`${apiBase}/barbers/${barberId}/breaks/${breakId}`, {
      method: 'DELETE',
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || `HTTP ${res.status}`);
    }

    await fetchBreaks();
    showSuccessToast('Pauza je uspešno obrisana');
  } catch (error: any) {
    console.error(error);
    showErrorToast(error.message || 'Greška pri brisanju pauze');
  } finally {
    deletingId.value = null;
  }
}

onMounted(() => {
  resetForm();
  fetchBreaks();
});
</script>

<style scoped>
.bp-page {
  padding: 16px;
}

.bp-shell {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 92px;
}

.bp-header h1 {
  margin: 0 0 6px;
  font-size: 28px;
  line-height: 1.1;
}

.bp-header p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

.bp-card {
  background: #fff;
  border: 1px solid #e7e7e7;
  border-radius: 20px;
  padding: 18px;
}

.bp-card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.bp-card-head h2,
.bp-collapse-head h2 {
  margin: 0 0 6px;
  font-size: 20px;
  line-height: 1.1;
}

.bp-card-head p,
.bp-collapse-head p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

.bp-date-row {
  display: flex;
  gap: 12px;
  align-items: end;
}

.bp-add-btn,
.bp-secondary-btn {
  border: none;
  height: 42px;
  padding: 0 14px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.bp-add-btn {
  background: #111;
  color: #fff;
}

.bp-secondary-btn {
  background: #f1f1f1;
  color: #111;
}

.bp-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.bp-field span {
  font-size: 13px;
  color: #6b7280;
}

.bp-field input {
  height: 44px;
  border: 1px solid #dddddd;
  border-radius: 12px;
  padding: 0 12px;
  font-size: 15px;
  outline: none;
}

.bp-field input:focus {
  border-color: #2563eb;
}

.bp-state {
  font-size: 14px;
  color: #666;
}

.bp-state-error {
  color: #c0392b;
}

.bp-empty {
  font-size: 14px;
  color: #8a8a8a;
}

.bp-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bp-item {
  width: 100%;
  border: 1px solid #ececec;
  background: #fafafa;
  border-radius: 16px;
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  text-align: left;
  cursor: pointer;
}

.bp-item-static {
  cursor: default;
}

.bp-item-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bp-item-title {
  font-size: 15px;
  font-weight: 600;
  color: #111;
}

.bp-item-sub {
  font-size: 13px;
  color: #6b7280;
}

.bp-item-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bp-delete-btn {
  border: none;
  background: transparent;
  color: #dc2626;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.bp-delete-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.bp-chevron {
  font-size: 24px;
  line-height: 1;
  color: #a3a3a3;
}

.bp-muted {
  color: #8a8a8a;
  font-size: 14px;
}

.bp-collapse-head {
  width: 100%;
  border: none;
  background: transparent;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  cursor: pointer;
}

.bp-collapse-icon {
  font-size: 24px;
  color: #888;
  transition: transform 0.2s ease;
}

.bp-collapse-icon.open {
  transform: rotate(180deg);
}

.bp-collapse-body {
  margin-top: 16px;
}

.bp-fab {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 58px;
  height: 58px;
  border: none;
  border-radius: 999px;
  background: #111;
  color: #fff;
  font-size: 30px;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.18);
  z-index: 50;
}

.bp-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 999;
}

.bp-modal {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: #fff;
  border-top-left-radius: 22px;
  border-top-right-radius: 22px;
  padding: 10px 16px 20px;
  box-shadow: 0 -10px 35px rgba(0, 0, 0, 0.12);
  max-height: 92vh;
  overflow-y: auto;
}

.bp-handle {
  width: 42px;
  height: 5px;
  border-radius: 999px;
  background: #d6d6d6;
  margin: 4px auto 14px;
}

.bp-modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.bp-modal-head h3 {
  margin: 0;
  font-size: 20px;
  color: #111;
}

.bp-close-btn {
  border: none;
  background: transparent;
  font-size: 14px;
  color: #2563eb;
  cursor: pointer;
}

.bp-modal-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.bp-two-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.bp-switch-row,
.bp-radio-row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 22px;
  font-size: 15px;
  color: #111;
}

.bp-repeat-box {
  border: 1px solid #ececec;
  background: #fafafa;
  border-radius: 16px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bp-repeat-box h4 {
  margin: 0;
  font-size: 15px;
}

.bp-days {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.bp-day-chip {
  border: 1px solid #dddddd;
  background: #fff;
  height: 36px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 14px;
  cursor: pointer;
}

.bp-day-chip.active {
  border-color: #2563eb;
  background: #2563eb;
  color: #fff;
}

.bp-save-btn {
  border: none;
  height: 46px;
  border-radius: 14px;
  background: #111;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.bp-save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.bp-toast-box {
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

.bp-toast-error {
  background: #111;
}

.bp-toast-success {
  background: #16a34a;
}

.bp-fade-enter-active,
.bp-fade-leave-active {
  transition: opacity 0.2s ease;
}

.bp-fade-enter-from,
.bp-fade-leave-to {
  opacity: 0;
}

.bp-sheet-enter-active,
.bp-sheet-leave-active {
  transition: transform 0.24s ease, opacity 0.24s ease;
}

.bp-sheet-enter-from,
.bp-sheet-leave-to {
  transform: translateY(100%);
  opacity: 0.98;
}

.bp-toast-enter-active,
.bp-toast-leave-active {
  transition: all 0.25s ease;
}

.bp-toast-enter-from,
.bp-toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

.bp-collapse-enter-active,
.bp-collapse-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.bp-collapse-enter-from,
.bp-collapse-leave-to {
  opacity: 0;
  max-height: 0;
}

.bp-collapse-enter-to,
.bp-collapse-leave-from {
  opacity: 1;
  max-height: 1000px;
}

@media (max-width: 720px) {
  .bp-two-cols,
  .bp-date-row {
    grid-template-columns: 1fr;
    display: grid;
  }
}
</style>