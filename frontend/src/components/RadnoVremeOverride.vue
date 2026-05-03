<template>
  <div class="rvo-card">
    <div class="rvo-head">
      <div>
        <h2>Posebni periodi</h2>
        <p>Izmene radnog vremena za konkretne datume ili periode.</p>
      </div>

      <button type="button" class="rvo-add-btn" @click="openCreateModal">
        Dodaj izmenu
      </button>
    </div>

    <div v-if="loading" class="rvo-state">
      Učitavanje...
    </div>

    <div v-else-if="errorMessage" class="rvo-state rvo-state-error">
      {{ errorMessage }}
    </div>

    <div v-else-if="overrides.length === 0" class="rvo-empty">
      Nema dodatih izmena.
    </div>

    <div v-else class="rvo-list">
      <button
        v-for="item in overrides"
        :key="item.id"
        type="button"
        class="rvo-item"
        @click="openEditModal(item)"
      >
        <div class="rvo-item-left">
          <span class="rvo-dates">
            {{ formatDate(item.start_date) }}
            <template v-if="item.start_date !== item.end_date">
              - {{ formatDate(item.end_date) }}
            </template>
          </span>

          <span class="rvo-status" :class="{ closed: normalizeIsClosed(item.is_closed) }">
            {{ normalizeIsClosed(item.is_closed) ? 'Lokal ne radi' : 'Izmenjeno radno vreme' }}
          </span>
        </div>

        <div class="rvo-item-right">
          <span v-if="!normalizeIsClosed(item.is_closed)" class="rvo-time">
            {{ formatTime(item.start_time) }} - {{ formatTime(item.end_time) }}
          </span>

          <span v-else class="rvo-closed">
            Zatvoreno
          </span>

          <button
            type="button"
            class="rvo-delete-btn"
            @click.stop="handleDelete(item.id)"
            :disabled="deletingId === item.id"
          >
            {{ deletingId === item.id ? 'Brisanje...' : 'Obriši' }}
          </button>

          <span class="rvo-chevron">›</span>
        </div>
      </button>
    </div>
  </div>

  <transition name="rvo-fade">
    <div
      v-if="isModalOpen"
      class="rvo-modal-backdrop"
      @click="closeModal"
    ></div>
  </transition>

  <transition name="rvo-sheet">
    <div v-if="isModalOpen" class="rvo-modal">
      <div class="rvo-modal-handle"></div>

      <div class="rvo-modal-head">
        <h3>{{ isEditing ? 'Izmeni izmenu' : 'Dodaj izmenu' }}</h3>

        <button type="button" class="rvo-close-btn" @click="closeModal">
          Zatvori
        </button>
      </div>

      <div class="rvo-modal-body">
        <label class="rvo-field">
          <span>Od datuma</span>
          <input v-model="form.start_date" type="date" />
        </label>

        <label class="rvo-field">
          <span>Do datuma</span>
          <input v-model="form.end_date" type="date" />
        </label>

        <label class="rvo-switch-row">
          <span>Lokal ne radi u ovom periodu</span>
          <input v-model="form.is_closed" type="checkbox" />
        </label>

        <div v-if="!form.is_closed" class="rvo-time-fields">
          <label class="rvo-field">
            <span>Početak</span>
            <input v-model="form.start_time" type="time" />
          </label>

          <label class="rvo-field">
            <span>Kraj</span>
            <input v-model="form.end_time" type="time" />
          </label>
        </div>

        <div v-else class="rvo-closed-note">
          Lokal neće raditi u ovom periodu.
        </div>

        <button
          type="button"
          class="rvo-save-btn"
          @click="handleSave"
          :disabled="saving"
        >
          {{ saving ? 'Čuvanje...' : (isEditing ? 'Sačuvaj izmene' : 'Sačuvaj') }}
        </button>
      </div>
    </div>
  </transition>

  <transition name="toast">
    <div v-if="showError" class="rvo-toast rvo-toast-error">
      {{ errorText }}
    </div>
  </transition>

  <transition name="toast">
    <div v-if="showSuccess" class="rvo-toast rvo-toast-success">
      {{ successText }}
    </div>
  </transition>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';

type WorkingOverride = {
  id: number;
  tenant_id: number;
  start_date: string;
  end_date: string;
  is_closed: number | boolean;
  start_time: string | null;
  end_time: string | null;
};

const apiBase = import.meta.env.VITE_API_BASE;
const tenantId = 1;

const overrides = ref<WorkingOverride[]>([]);
const loading = ref(true);
const errorMessage = ref('');

const isModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref<number | null>(null);

const saving = ref(false);
const deletingId = ref<number | null>(null);

const showError = ref(false);
const errorText = ref('');

const showSuccess = ref(false);
const successText = ref('');

const form = reactive({
  start_date: '',
  end_date: '',
  is_closed: false,
  start_time: '09:00',
  end_time: '17:00',
});

function normalizeIsClosed(value: number | boolean) {
  return value === true || value === 1;
}

function formatTime(time: string | null) {
  if (!time) return '';
  return time.slice(0, 5);
}

function formatDate(date: string) {
  const parsedDate = new Date(date);

  const formatted = parsedDate.toLocaleDateString('sr-RS', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return formatted.replace(/\.$/, '');
}

function resetForm() {
  form.start_date = '';
  form.end_date = '';
  form.is_closed = false;
  form.start_time = '09:00';
  form.end_time = '17:00';
}

function openCreateModal() {
  isEditing.value = false;
  editingId.value = null;
  resetForm();
  isModalOpen.value = true;
}

function openEditModal(item: WorkingOverride) {
  isEditing.value = true;
  editingId.value = item.id;

  form.start_date = item.start_date;
  form.end_date = item.end_date;
  form.is_closed = normalizeIsClosed(item.is_closed);
  form.start_time = item.start_time ? item.start_time.slice(0, 5) : '09:00';
  form.end_time = item.end_time ? item.end_time.slice(0, 5) : '17:00';

  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  isEditing.value = false;
  editingId.value = null;
  resetForm();
}

async function fetchOverrides() {
  loading.value = true;
  errorMessage.value = '';

  try {
    const res = await fetch(`${apiBase}/tenants/${tenantId}/working-overrides`);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = (await res.json()) as WorkingOverride[];
    overrides.value = data;
  } catch (error) {
    console.error('Failed to fetch working overrides:', error);
    overrides.value = [];
    errorMessage.value = 'Došlo je do greške pri učitavanju posebnih perioda.';
  } finally {
    loading.value = false;
  }
}

function validateForm() {
  if (!form.start_date || !form.end_date) {
    errorText.value = 'Unesi početni i krajnji datum';
    showError.value = true;
    return false;
  }

  if (form.start_date > form.end_date) {
    errorText.value = 'Početni datum mora biti pre krajnjeg';
    showError.value = true;
    return false;
  }

  if (!form.is_closed) {
    if (!form.start_time || !form.end_time) {
      errorText.value = 'Unesi početno i krajnje vreme';
      showError.value = true;
      return false;
    }

    if (form.start_time >= form.end_time) {
      errorText.value = 'Početak mora biti pre kraja';
      showError.value = true;
      return false;
    }
  }

  return true;
}

async function handleSave() {
  if (!validateForm()) return;

  try {
    saving.value = true;

    const url = isEditing.value && editingId.value
      ? `${apiBase}/tenants/${tenantId}/working-overrides/${editingId.value}`
      : `${apiBase}/tenants/${tenantId}/working-overrides`;

    const method = isEditing.value ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        start_date: form.start_date,
        end_date: form.end_date,
        is_closed: form.is_closed,
        start_time: form.is_closed ? null : `${form.start_time}:00`,
        end_time: form.is_closed ? null : `${form.end_time}:00`,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || `HTTP ${res.status}`);
    }

    await fetchOverrides();

    successText.value = isEditing.value
      ? 'Izmena je uspešno sačuvana'
      : 'Izmena je uspešno dodata';
    showSuccess.value = true;

    closeModal();
  } catch (error: any) {
    console.error('Failed to save working override:', error);
    errorText.value = error.message || 'Greška pri čuvanju izmene';
    showError.value = true;
  } finally {
    saving.value = false;
  }
}

async function handleDelete(overrideId: number) {
  try {
    deletingId.value = overrideId;

    const res = await fetch(`${apiBase}/tenants/${tenantId}/working-overrides/${overrideId}`, {
      method: 'DELETE',
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || `HTTP ${res.status}`);
    }

    await fetchOverrides();

    successText.value = 'Izmena je uspešno obrisana';
    showSuccess.value = true;
  } catch (error: any) {
    console.error('Failed to delete working override:', error);
    errorText.value = error.message || 'Greška pri brisanju izmene';
    showError.value = true;
  } finally {
    deletingId.value = null;
  }
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

onMounted(() => {
  fetchOverrides();
});
</script>

<style scoped>
.rvo-card {
  margin-top: 16px;
  background: #ffffff;
  border: 1px solid #e7e7e7;
  border-radius: 20px;
  padding: 18px;
}

.rvo-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.rvo-head h2 {
  margin: 0 0 6px;
  font-size: 20px;
  line-height: 1.1;
  color: #111111;
}

.rvo-head p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

.rvo-add-btn {
  border: none;
  background: #111111;
  color: #ffffff;
  height: 42px;
  padding: 0 14px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.rvo-state {
  padding: 20px 0;
  font-size: 14px;
  color: #666666;
}

.rvo-state-error {
  color: #c0392b;
}

.rvo-empty {
  font-size: 14px;
  color: #8a8a8a;
  padding: 8px 0 2px;
}

.rvo-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rvo-item {
  width: 100%;
  border: 1px solid #ececec;
  background: #fafafa;
  border-radius: 16px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  text-align: left;
  cursor: pointer;
}

.rvo-item-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rvo-dates {
  font-size: 15px;
  font-weight: 600;
  color: #111111;
}

.rvo-status {
  font-size: 13px;
  color: #2563eb;
}

.rvo-status.closed {
  color: #8a8a8a;
}

.rvo-item-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rvo-time,
.rvo-closed {
  font-size: 14px;
  color: #222222;
}

.rvo-delete-btn {
  border: none;
  background: transparent;
  color: #dc2626;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.rvo-delete-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.rvo-chevron {
  font-size: 24px;
  line-height: 1;
  color: #a3a3a3;
}

.rvo-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 999;
}

.rvo-modal {
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

.rvo-modal-handle {
  width: 42px;
  height: 5px;
  border-radius: 999px;
  background: #d6d6d6;
  margin: 4px auto 14px;
}

.rvo-modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.rvo-modal-head h3 {
  margin: 0;
  font-size: 20px;
  color: #111111;
}

.rvo-close-btn {
  border: none;
  background: transparent;
  font-size: 14px;
  color: #2563eb;
  cursor: pointer;
}

.rvo-modal-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rvo-switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 15px;
  color: #111111;
}

.rvo-time-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.rvo-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rvo-field span {
  font-size: 13px;
  color: #6b7280;
}

.rvo-field input {
  height: 44px;
  border: 1px solid #dddddd;
  border-radius: 12px;
  padding: 0 12px;
  font-size: 15px;
  outline: none;
}

.rvo-field input:focus {
  border-color: #2563eb;
}

.rvo-closed-note {
  font-size: 14px;
  color: #666666;
  background: #f7f7f7;
  border-radius: 12px;
  padding: 12px;
}

.rvo-save-btn {
  border: none;
  height: 46px;
  border-radius: 14px;
  background: #111111;
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.rvo-save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.rvo-toast {
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

.rvo-toast-error {
  background: #111;
}

.rvo-toast-success {
  background: #16a34a;
}

.rvo-fade-enter-active,
.rvo-fade-leave-active {
  transition: opacity 0.2s ease;
}

.rvo-fade-enter-from,
.rvo-fade-leave-to {
  opacity: 0;
}

.rvo-sheet-enter-active,
.rvo-sheet-leave-active {
  transition: transform 0.24s ease, opacity 0.24s ease;
}

.rvo-sheet-enter-from,
.rvo-sheet-leave-to {
  transform: translateY(100%);
  opacity: 0.98;
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