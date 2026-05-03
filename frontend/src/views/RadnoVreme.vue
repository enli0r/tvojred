<template>
  <div class="rv-page">
    <div class="rv-card">
      <div class="rv-head">
        <h1>Radno vreme</h1>
        <p>Podesi podrazumevano radno vreme lokala po danima.</p>
      </div>

      <div v-if="loading" class="rv-state">
        Učitavanje...
      </div>

      <div v-else-if="errorMessage" class="rv-state rv-state-error">
        {{ errorMessage }}
      </div>

      <div v-else class="rv-list">
        <button
          v-for="day in workingHours"
          :key="day.id"
          type="button"
          class="rv-item"
          @click="openEditModal(day)"
        >
          <div class="rv-item-left">
            <span class="rv-day-name">{{ getDayName(day.day_of_week) }}</span>
            <span class="rv-day-status" :class="{ closed: !normalizeIsWorking(day.is_working) }">
              {{ normalizeIsWorking(day.is_working) ? 'Radi' : 'Ne radi' }}
            </span>
          </div>

          <div class="rv-item-right">
            <span v-if="normalizeIsWorking(day.is_working)" class="rv-time">
              {{ formatTime(day.start_time) }} - {{ formatTime(day.end_time) }}
            </span>

            <span v-else class="rv-closed">
              Zatvoreno
            </span>

            <span class="rv-chevron">›</span>
          </div>
        </button>
      </div>
    </div>

    <transition name="rv-fade">
      <div
        v-if="isEditModalOpen"
        class="rv-modal-backdrop"
        @click="closeEditModal"
      ></div>
    </transition>

    <transition name="rv-sheet">
      <div v-if="isEditModalOpen" class="rv-modal">
        <div class="rv-modal-handle"></div>

        <div class="rv-modal-head">
          <h2>{{ selectedDay ? getDayName(selectedDay.day_of_week) : '' }}</h2>
          <button type="button" class="rv-close-btn" @click="closeEditModal">
            Zatvori
          </button>
        </div>

        <div v-if="editForm" class="rv-modal-body">
          <label class="rv-switch-row">
            <span>Radi ovog dana</span>
            <input v-model="editForm.is_working" type="checkbox" />
          </label>

          <div v-if="editForm.is_working" class="rv-time-fields">
            <label class="rv-field">
              <span>Početak</span>
              <input v-model="editForm.start_time" type="time" />
            </label>

            <label class="rv-field">
              <span>Kraj</span>
              <input v-model="editForm.end_time" type="time" />
            </label>
          </div>

          <div v-else class="rv-closed-note">
            Lokal neće raditi ovog dana.
          </div>

          <button type="button" class="rv-save-btn" @click="handleSave">
            Sačuvaj
          </button>
        </div>
      </div>
    </transition>

    <transition name="toast">
        <div v-if="showError" class="rv-toast rv-toast-error">
            {{ errorText }}
        </div>
        </transition>

        <transition name="toast">
        <div v-if="showSuccess" class="rv-toast rv-toast-success">
            {{ successText }}
        </div>
    </transition>

    <RadnoVremeOverride />
  </div>

</template>

<script setup lang="ts">
import { watch, onMounted, ref } from 'vue';
import RadnoVremeOverride from "@/components/RadnoVremeOverride.vue";


type WorkingHour = {
  id: number;
  tenant_id: number;
  day_of_week: number;
  is_working: number | boolean;
  start_time: string | null;
  end_time: string | null;
};

type EditForm = {
  id: number;
  day_of_week: number;
  is_working: boolean;
  start_time: string;
  end_time: string;
};

const apiBase = import.meta.env.VITE_API_BASE || "/api";

const workingHours = ref<WorkingHour[]>([]);
const loading = ref(true);
const errorMessage = ref('');

const isEditModalOpen = ref(false);
const selectedDay = ref<WorkingHour | null>(null);
const editForm = ref<EditForm | null>(null);


//Error & Success Edit
const showError = ref(false);
const errorText = ref('');

const showSuccess = ref(false);
const successText = ref('');

function normalizeIsWorking(value: number | boolean) {
  return value === true || value === 1;
}

function getDayName(day: number) {
  const days = [
    'Nedelja',
    'Ponedeljak',
    'Utorak',
    'Sreda',
    'Četvrtak',
    'Petak',
    'Subota',
  ];

  return days[day] ?? 'Nepoznat dan';
}

function formatTime(time: string | null) {
  if (!time) return '';
  return time.slice(0, 5);
}

function openEditModal(day: WorkingHour) {
  selectedDay.value = day;

  editForm.value = {
    id: day.id,
    day_of_week: day.day_of_week,
    is_working: normalizeIsWorking(day.is_working),
    start_time: day.start_time ? day.start_time.slice(0, 5) : '09:00',
    end_time: day.end_time ? day.end_time.slice(0, 5) : '17:00',
  };

  isEditModalOpen.value = true;
}

function closeEditModal() {
  isEditModalOpen.value = false;
  selectedDay.value = null;
  editForm.value = null;
}

async function handleSave() {
  if (!editForm.value) return;

  // ✅ VALIDACIJA
  if (editForm.value.is_working) {
    if (!editForm.value.start_time || !editForm.value.end_time) {
      errorText.value = 'Unesi početno i krajnje vreme';
      showError.value = true;
      return;
    }

    if (editForm.value.start_time >= editForm.value.end_time) {
      errorText.value = 'Početak mora biti pre kraja';
      showError.value = true;
      return;
    }
  }

  try {
    saving.value = true;

    const res = await fetch(
      `${apiBase}/tenants/1/working-hours/${editForm.value.day_of_week}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_working: editForm.value.is_working,
          start_time: editForm.value.is_working ? `${editForm.value.start_time}:00` : null,
          end_time: editForm.value.is_working ? `${editForm.value.end_time}:00` : null,
        }),
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    await fetchWorkingHours();
    successText.value = 'Radno vreme je uspešno sačuvano';
    showSuccess.value = true;

    closeEditModal();
  } catch (error) {
    console.error('Failed to update working hours:', error);
  } finally {
    saving.value = false;
  }
}



async function fetchWorkingHours() {
  loading.value = true;
  errorMessage.value = '';

  try {
    const res = await fetch(`${apiBase}/tenants/1/working-hours`);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = (await res.json()) as WorkingHour[];
    workingHours.value = data;
  } catch (error) {
    console.error('Failed to fetch working hours:', error);
    workingHours.value = [];
    errorMessage.value = 'Došlo je do greške pri učitavanju radnog vremena.';
  } finally {
    loading.value = false;
  }
}

const saving = ref(false);

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

onMounted(() => {
  fetchWorkingHours();
});
</script>

<style scoped>
.rv-page {
  padding: 16px;
}

.rv-card {
  background: #ffffff;
  border: 1px solid #e7e7e7;
  border-radius: 20px;
  padding: 18px;
}

.rv-head {
  margin-bottom: 16px;
}

.rv-head h1 {
  margin: 0 0 6px;
  font-size: 24px;
  line-height: 1.1;
  color: #111111;
}

.rv-head p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

.rv-state {
  padding: 20px 0;
  font-size: 14px;
  color: #666666;
}

.rv-state-error {
  color: #c0392b;
}

.rv-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rv-item {
  width: 100%;
  border: 1px solid #ececec;
  background: #fafafa;
  border-radius: 16px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  cursor: pointer;
  transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
}

.rv-item:hover {
  transform: translateY(-1px);
  border-color: #d8d8d8;
  background: #f7f7f7;
}

.rv-item-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rv-day-name {
  font-size: 16px;
  font-weight: 600;
  color: #111111;
}

.rv-day-status {
  font-size: 13px;
  color: #1f7a1f;
}

.rv-day-status.closed {
  color: #8a8a8a;
}

.rv-item-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rv-time,
.rv-closed {
  font-size: 14px;
  color: #222222;
}

.rv-chevron {
  font-size: 24px;
  line-height: 1;
  color: #a3a3a3;
}

.rv-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 999;
}

.rv-modal {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: #ffffff;
  border-top-left-radius: 22px;
  border-top-right-radius: 22px;
  padding: 10px 16px 20px;
  box-shadow: 0 -10px 35px rgba(0, 0, 0, 0.12);
}

.rv-modal-handle {
  width: 42px;
  height: 5px;
  border-radius: 999px;
  background: #d6d6d6;
  margin: 4px auto 14px;
}

.rv-modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.rv-modal-head h2 {
  margin: 0;
  font-size: 20px;
  color: #111111;
}

.rv-close-btn {
  border: none;
  background: transparent;
  font-size: 14px;
  color: #2563eb;
  cursor: pointer;
}

.rv-modal-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rv-switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 15px;
  color: #111111;
}

.rv-time-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.rv-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rv-field span {
  font-size: 13px;
  color: #6b7280;
}

.rv-field input {
  height: 44px;
  border: 1px solid #dddddd;
  border-radius: 12px;
  padding: 0 12px;
  font-size: 15px;
  outline: none;
}

.rv-field input:focus {
  border-color: #2563eb;
}

.rv-closed-note {
  font-size: 14px;
  color: #666666;
  background: #f7f7f7;
  border-radius: 12px;
  padding: 12px;
}

.rv-save-btn {
  border: none;
  height: 46px;
  border-radius: 14px;
  background: #111111;
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.rv-fade-enter-active,
.rv-fade-leave-active {
  transition: opacity 0.2s ease;
}

.rv-fade-enter-from,
.rv-fade-leave-to {
  opacity: 0;
}

.rv-sheet-enter-active,
.rv-sheet-leave-active {
  transition: transform 0.24s ease, opacity 0.24s ease;
}

.rv-sheet-enter-from,
.rv-sheet-leave-to {
  transform: translateY(100%);
  opacity: 0.98;
}

.rv-toast {
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

.rv-toast-error {
  background: #111;
}

.rv-toast-success {
  background: #16a34a;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}
</style>