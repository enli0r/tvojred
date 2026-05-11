<template>
  <div class="services-page">
    <div class="services-shell">
      <header class="services-nav">
        <button class="services-back" type="button" @click="goBack">
          <span class="services-back__icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M15 18 9 12l6-6" />
            </svg>
          </span>

          <span>Podešavanja</span>
        </button>

        <div class="services-status">
          <span></span>
          Owner / Admin
        </div>
      </header>

      <section class="services-hero">
        <div class="services-hero__icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M8 7h12" />
            <path d="M8 12h12" />
            <path d="M8 17h12" />
            <path d="M4 7h.01" />
            <path d="M4 12h.01" />
            <path d="M4 17h.01" />
          </svg>
        </div>

        <div class="services-hero__copy">
          <span>Cenovnik</span>
          <h1>Usluge lokala</h1>
          <p>
            Dodaj, izmeni ili privremeno deaktiviraj usluge koje se prikazuju korisnicima.
          </p>
        </div>
      </section>

      <section class="services-card">
        <div class="services-card__top">
          <div>
            <span class="services-card__eyebrow">Aktivne usluge</span>
            <h2>{{ activeServices.length }} u cenovniku</h2>
          </div>

          <button class="services-add" type="button" @click="openCreateSheet">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            Dodaj
          </button>
        </div>

        <div v-if="loading" class="services-state">
          <div class="services-loader"></div>
          <p>Učitavam usluge...</p>
        </div>

        <div v-else-if="error" class="services-alert services-alert--error">
          <strong>Greška</strong>
          <p>{{ error }}</p>
          <button type="button" @click="fetchServices">Pokušaj ponovo</button>
        </div>

        <div v-else>
          <div v-if="activeServices.length === 0" class="services-empty">
            <div class="services-empty__icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
            </div>

            <strong>Nema aktivnih usluga</strong>
            <p>Dodaj prvu uslugu koja će se prikazivati u cenovniku.</p>
          </div>

          <div v-else class="services-list">
            <article
              v-for="service in activeServices"
              :key="service.id"
              class="service-item"
            >
              <div class="service-item__main">
                <div class="service-item__icon">
                  {{ serviceInitial(service.name) }}
                </div>

                <div class="service-item__copy">
                  <h3>{{ service.name }}</h3>
                  <p>{{ service.description || "Bez opisa" }}</p>

                  <div class="service-item__meta">
                    <span>{{ formatPrice(service.price) }}</span>
                    <span>{{ service.duration_minutes }} min</span>
                  </div>
                </div>
              </div>

              <div class="service-item__actions">
                <button type="button" @click="openEditSheet(service)">
                  Izmeni
                </button>

                <button
                  class="service-item__danger"
                  type="button"
                  @click="openDeleteConfirm(service)"
                >
                  Deaktiviraj
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="services-card services-card--inactive">
        <div class="services-card__top">
          <div>
            <span class="services-card__eyebrow">Neaktivne usluge</span>
            <h2>{{ inactiveServices.length }} sakriveno</h2>
          </div>
        </div>

        <div v-if="!loading && inactiveServices.length === 0" class="services-muted">
          Nema neaktivnih usluga.
        </div>

        <div v-else-if="!loading" class="services-list">
          <article
            v-for="service in inactiveServices"
            :key="service.id"
            class="service-item service-item--inactive"
          >
            <div class="service-item__main">
              <div class="service-item__icon">
                {{ serviceInitial(service.name) }}
              </div>

              <div class="service-item__copy">
                <h3>{{ service.name }}</h3>
                <p>{{ service.description || "Bez opisa" }}</p>

                <div class="service-item__meta">
                  <span>{{ formatPrice(service.price) }}</span>
                  <span>{{ service.duration_minutes }} min</span>
                </div>
              </div>
            </div>

            <div class="service-item__actions">
              <button type="button" @click="openEditSheet(service)">
                Izmeni
              </button>

              <button
                class="service-item__activate"
                type="button"
                @click="activateService(service)"
              >
                Aktiviraj
              </button>
            </div>
          </article>
        </div>
      </section>

      <p v-if="successMessage" class="services-success">
        {{ successMessage }}
      </p>
    </div>

    <Teleport to="body">
      <Transition name="services-sheet">
        <div v-if="showSheet" class="services-sheet" @click="closeSheet">
          <div class="services-sheet__panel" @click.stop>
            <div class="services-sheet__handle"></div>

            <header class="services-sheet__head">
              <div>
                <span>{{ editingService ? "Izmena usluge" : "Nova usluga" }}</span>
                <h2>{{ editingService ? "Uredi uslugu" : "Dodaj uslugu" }}</h2>
                <p>
                  Unesi naziv, cenu i trajanje usluge koja se koristi u cenovniku.
                </p>
              </div>

              <button
                class="services-sheet__close"
                type="button"
                aria-label="Zatvori"
                @click="closeSheet"
              >
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12" />
                  <path d="M18 6 6 18" />
                </svg>
              </button>
            </header>

            <div class="services-form">
              <label class="services-field">
                <span>Naziv usluge</span>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="Npr. Muško šišanje"
                />
              </label>

              <label class="services-field">
                <span>Opis</span>
                <textarea
                  v-model="form.description"
                  placeholder="Kratak opis usluge"
                ></textarea>
              </label>

              <div class="services-form__grid">
                <label class="services-field">
                  <span>Cena</span>
                  <input
                    v-model="form.price"
                    type="number"
                    min="0"
                    step="50"
                    placeholder="800"
                  />
                </label>

                <label class="services-field">
                  <span>Trajanje</span>
                  <input
                    v-model="form.duration_minutes"
                    type="number"
                    min="1"
                    step="5"
                    placeholder="30"
                  />
                </label>
              </div>

              <div v-if="sheetError" class="services-alert services-alert--error">
                <strong>Greška</strong>
                <p>{{ sheetError }}</p>
              </div>

              <button
                class="services-save"
                type="button"
                :disabled="saving"
                @click="saveService"
              >
                <span v-if="saving" class="services-save__loader"></span>
                <span>{{ saving ? "Čuvam..." : "Sačuvaj uslugu" }}</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <Transition name="services-confirm">
        <div v-if="serviceToDelete" class="services-confirm" @click="closeDeleteConfirm">
          <div class="services-confirm__panel" @click.stop>
            <div class="services-confirm__icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
              </svg>
            </div>

            <h2>Deaktivirati uslugu?</h2>
            <p>
              Usluga neće biti obrisana iz baze, već će biti sakrivena iz aktivnog cenovnika.
            </p>

            <strong>{{ serviceToDelete.name }}</strong>

            <div class="services-confirm__actions">
              <button type="button" @click="closeDeleteConfirm">
                Odustani
              </button>

              <button
                class="services-confirm__danger"
                type="button"
                :disabled="deleting"
                @click="deleteService"
              >
                {{ deleting ? "Deaktiviram..." : "Deaktiviraj" }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

type Service = {
  id: number;
  name: string;
  description: string | null;
  price: number | string;
  duration_minutes: number;
  is_active: boolean | number;
  created_at?: string;
  updated_at?: string;
};

type ServiceForm = {
  name: string;
  description: string;
  price: string;
  duration_minutes: string;
};

const route = useRoute();
const router = useRouter();

const tenantSlug = computed(() => String(route.params.tenantSlug || ""));

const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);

const showSheet = ref(false);

const services = ref<Service[]>([]);
const editingService = ref<Service | null>(null);
const serviceToDelete = ref<Service | null>(null);

const error = ref<string | null>(null);
const sheetError = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const form = ref<ServiceForm>({
  name: "",
  description: "",
  price: "",
  duration_minutes: "30",
});

const activeServices = computed(() =>
  services.value.filter((service) => Boolean(service.is_active))
);

const inactiveServices = computed(() =>
  services.value.filter((service) => !Boolean(service.is_active))
);

function goBack() {
  router.push({
    name: "Settings",
    params: {
      tenantSlug: tenantSlug.value,
    },
  });
}

function serviceInitial(name: string) {
  return name?.trim()?.[0]?.toUpperCase() || "U";
}

function formatPrice(price: number | string) {
  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return "0 RSD";
  }

  return `${numericPrice.toLocaleString("sr-RS")} RSD`;
}

async function fetchServices() {
  if (!tenantSlug.value) return;

  loading.value = true;
  error.value = null;
  successMessage.value = null;

  try {
    const res = await fetch(`/api/tenants/${tenantSlug.value}/admin/services?includeInactive=true`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      error.value = data?.message || "Nije moguće učitati usluge.";
      return;
    }

    services.value = data.services || [];
  } catch (err: any) {
    error.value = err?.message || "Došlo je do greške pri učitavanju usluga.";
  } finally {
    loading.value = false;
  }
}

function openCreateSheet() {
  editingService.value = null;

  form.value = {
    name: "",
    description: "",
    price: "",
    duration_minutes: "30",
  };

  sheetError.value = null;
  successMessage.value = null;
  showSheet.value = true;
  document.body.style.overflow = "hidden";
}

function openEditSheet(service: Service) {
  editingService.value = service;

  form.value = {
    name: service.name || "",
    description: service.description || "",
    price: String(service.price ?? ""),
    duration_minutes: String(service.duration_minutes ?? 30),
  };

  sheetError.value = null;
  successMessage.value = null;
  showSheet.value = true;
  document.body.style.overflow = "hidden";
}

function closeSheet() {
  if (saving.value) return;

  showSheet.value = false;
  editingService.value = null;
  sheetError.value = null;
  document.body.style.overflow = "";
}

async function saveService() {
  if (saving.value) return;

  sheetError.value = null;
  successMessage.value = null;

  const name = form.value.name.trim();
  const description = form.value.description.trim();
  const price = Number(form.value.price);
  const duration = Number(form.value.duration_minutes);

  if (!name) {
    sheetError.value = "Naziv usluge je obavezan.";
    return;
  }

  if (Number.isNaN(price) || price < 0) {
    sheetError.value = "Cena nije validna.";
    return;
  }

  if (Number.isNaN(duration) || duration <= 0) {
    sheetError.value = "Trajanje usluge nije validno.";
    return;
  }

  saving.value = true;

  try {
    const isEdit = Boolean(editingService.value);
    const url = isEdit
      ? `/api/tenants/${tenantSlug.value}/admin/services/${editingService.value?.id}`
      : `/api/tenants/${tenantSlug.value}/admin/services`;

    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name,
        description: description || null,
        price,
        duration_minutes: duration,
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      sheetError.value = data?.message || "Nije moguće sačuvati uslugu.";
      return;
    }

    successMessage.value = data?.message || "Usluga je uspešno sačuvana.";

    closeSheet();
    await fetchServices();
  } catch (err: any) {
    sheetError.value = err?.message || "Došlo je do greške pri čuvanju usluge.";
  } finally {
    saving.value = false;
  }
}

function openDeleteConfirm(service: Service) {
  serviceToDelete.value = service;
  successMessage.value = null;
  document.body.style.overflow = "hidden";
}

function closeDeleteConfirm() {
  if (deleting.value) return;

  serviceToDelete.value = null;
  document.body.style.overflow = "";
}

async function deleteService() {
  if (!serviceToDelete.value || deleting.value) return;

  deleting.value = true;
  error.value = null;
  successMessage.value = null;

  try {
    const res = await fetch(`/api/tenants/${tenantSlug.value}/admin/services/${serviceToDelete.value.id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      error.value = data?.message || "Nije moguće deaktivirati uslugu.";
      return;
    }

    successMessage.value = data?.message || "Usluga je deaktivirana.";

    closeDeleteConfirm();
    await fetchServices();
  } catch (err: any) {
    error.value = err?.message || "Došlo je do greške pri deaktiviranju usluge.";
  } finally {
    deleting.value = false;
  }
}

async function activateService(service: Service) {
  successMessage.value = null;
  error.value = null;

  try {
    const res = await fetch(`/api/tenants/${tenantSlug.value}/admin/services/${service.id}/activate`, {
      method: "PATCH",
      credentials: "include",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      error.value = data?.message || "Nije moguće aktivirati uslugu.";
      return;
    }

    successMessage.value = data?.message || "Usluga je aktivirana.";

    await fetchServices();
  } catch (err: any) {
    error.value = err?.message || "Došlo je do greške pri aktiviranju usluge.";
  }
}

onMounted(() => {
  fetchServices();
});

onBeforeUnmount(() => {
  document.body.style.overflow = "";
});
</script>

<style scoped lang="scss">
.services-page,
.services-page * {
  box-sizing: border-box;
}

.services-page {
  min-height: 100dvh;
  padding: 14px;
  color: #102438;
  background:
    radial-gradient(circle at 50% -12%, rgba(134, 173, 210, 0.18) 0%, transparent 34%),
    linear-gradient(180deg, #f8fafc 0%, #eef3f7 100%);
  font-family: Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif;
}

.services-shell {
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  padding-bottom: 28px;
}

.services-nav {
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.services-back {
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

.services-back__icon {
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

.services-status {
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

.services-hero {
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

.services-hero__icon {
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

.services-hero__copy {
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

.services-card {
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

.services-card--inactive {
  opacity: 0.94;
}

.services-card__top {
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

.services-card__eyebrow {
  display: block;
  color: rgba(16, 36, 56, 0.42);
  font-size: 10px;
  line-height: 1;
  font-weight: 850;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.services-add {
  height: 40px;
  padding: 0 13px;
  border: 0;
  border-radius: 15px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #ffffff;
  background: linear-gradient(180deg, #405d7a 0%, #2f465f 100%);
  font-size: 13px;
  line-height: 1;
  font-weight: 820;
  letter-spacing: -0.035em;
  box-shadow:
    0 8px 16px rgba(47, 70, 95, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.14);

  svg {
    width: 17px;
    height: 17px;
    stroke: currentColor;
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

.services-list {
  margin-top: 16px;
  display: grid;
  gap: 10px;
}

.service-item {
  padding: 13px;
  border-radius: 24px;
  background:
    radial-gradient(circle at 100% 0%, rgba(134, 173, 210, 0.12) 0%, transparent 36%),
    linear-gradient(180deg, #ffffff 0%, #f3f7fa 100%);
  box-shadow:
    inset 0 0 0 1px rgba(64, 93, 122, 0.055),
    inset 0 1px 0 rgba(255, 255, 255, 0.92);
}

.service-item--inactive {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.76) 0%, rgba(238, 243, 247, 0.82) 100%);
  filter: grayscale(0.16);
}

.service-item__main {
  display: flex;
  gap: 12px;
}

.service-item__icon {
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  border-radius: 17px;
  display: grid;
  place-items: center;
  color: #ffffff;
  background: linear-gradient(180deg, #171d25 0%, #111821 100%);
  font-size: 15px;
  line-height: 1;
  font-weight: 900;
  letter-spacing: -0.07em;
  box-shadow:
    0 8px 16px rgba(17, 26, 38, 0.13),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.service-item__copy {
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
    margin: 6px 0 0;
    color: rgba(16, 36, 56, 0.48);
    font-size: 12px;
    line-height: 1.35;
    font-weight: 650;
    letter-spacing: -0.025em;
  }
}

.service-item__meta {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 7px;

  span {
    height: 28px;
    padding: 0 10px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    color: #405d7a;
    background: #eef5fb;
    font-size: 11px;
    line-height: 1;
    font-weight: 850;
    letter-spacing: -0.025em;
    box-shadow:
      inset 0 0 0 1px rgba(64, 93, 122, 0.055),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }
}

.service-item__actions {
  margin-top: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;

  button {
    height: 42px;
    border: 0;
    border-radius: 15px;
    color: #536273;
    background: #eef3f7;
    font-size: 13px;
    line-height: 1;
    font-weight: 820;
    letter-spacing: -0.035em;
    box-shadow:
      inset 0 0 0 1px rgba(64, 93, 122, 0.055),
      inset 0 1px 0 rgba(255, 255, 255, 0.88);
  }

  .service-item__danger {
    color: #b54d4d;
    background: #fff2f2;
  }

  .service-item__activate {
    color: #ffffff;
    background: linear-gradient(180deg, #405d7a 0%, #2f465f 100%);
    box-shadow:
      0 8px 16px rgba(47, 70, 95, 0.14),
      inset 0 1px 0 rgba(255, 255, 255, 0.14);
  }
}

.services-state {
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

.services-loader,
.services-save__loader {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  border: 2px solid rgba(64, 93, 122, 0.18);
  border-top-color: #405d7a;
  animation: services-spin 0.8s linear infinite;
}

.services-empty {
  margin-top: 16px;
  padding: 18px;
  border-radius: 24px;
  display: grid;
  place-items: center;
  text-align: center;
  background: #f4f8fb;
  box-shadow:
    inset 0 0 0 1px rgba(64, 93, 122, 0.055),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);

  strong {
    margin-top: 12px;
    color: #102438;
    font-size: 17px;
    line-height: 1.1;
    font-weight: 850;
    letter-spacing: -0.055em;
  }

  p {
    margin: 7px 0 0;
    color: rgba(16, 36, 56, 0.5);
    font-size: 13px;
    line-height: 1.35;
    font-weight: 650;
    letter-spacing: -0.025em;
  }
}

.services-empty__icon {
  width: 54px;
  height: 54px;
  border-radius: 19px;
  display: grid;
  place-items: center;
  color: #86add2;
  background: linear-gradient(180deg, #2a2f3a 0%, #171b24 100%);

  svg {
    width: 25px;
    height: 25px;
    stroke: currentColor;
    stroke-width: 2.3;
    stroke-linecap: round;
  }
}

.services-muted {
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

.services-alert {
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

.services-alert--error {
  color: #b54d4d;
  background: #fff7f7;
  box-shadow:
    inset 0 0 0 1px rgba(181, 77, 77, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.92);
}

.services-success {
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

.services-sheet,
.services-confirm {
  position: fixed;
  inset: 0;
  z-index: 80;
  padding: 12px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(11, 16, 24, 0.34);
}

.services-sheet__panel,
.services-confirm__panel {
  width: 100%;
  max-width: 520px;
  max-height: calc(100dvh - 24px);
  overflow: auto;
  padding: 10px 14px 14px;
  border-radius: 32px;
  background:
    radial-gradient(circle at 100% 0%, rgba(134, 173, 210, 0.14) 0%, transparent 34%),
    linear-gradient(180deg, #ffffff 0%, #f5f8fb 100%);
  box-shadow:
    0 28px 70px rgba(8, 12, 18, 0.24),
    inset 0 1px 0 rgba(255, 255, 255, 0.96),
    inset 0 0 0 1px rgba(255, 255, 255, 0.62);
}

.services-sheet__handle {
  width: 42px;
  height: 5px;
  margin: 2px auto 14px;
  border-radius: 999px;
  background: rgba(16, 36, 56, 0.16);
}

.services-sheet__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;

  span {
    display: block;
    color: #64809c;
    font-size: 10px;
    line-height: 1;
    font-weight: 850;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  h2 {
    margin: 7px 0 0;
    color: #102438;
    font-size: 25px;
    line-height: 1;
    font-weight: 870;
    letter-spacing: -0.075em;
  }

  p {
    margin: 8px 0 0;
    color: rgba(16, 36, 56, 0.55);
    font-size: 13px;
    line-height: 1.35;
    font-weight: 620;
    letter-spacing: -0.025em;
  }
}

.services-sheet__close {
  width: 40px;
  height: 40px;
  flex: 0 0 40px;
  border: 0;
  border-radius: 15px;
  display: grid;
  place-items: center;
  color: #536273;
  background: rgba(238, 243, 247, 0.9);
  box-shadow:
    inset 0 0 0 1px rgba(64, 93, 122, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);

  svg {
    width: 20px;
    height: 20px;
    stroke: currentColor;
    stroke-width: 2.3;
    stroke-linecap: round;
  }
}

.services-form {
  margin-top: 18px;
  display: grid;
  gap: 11px;
}

.services-form__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.services-field {
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

  input,
  textarea {
    width: 100%;
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

  input {
    height: 52px;
  }

  textarea {
    min-height: 94px;
    resize: none;
    padding-top: 14px;
    line-height: 1.35;
  }
}

.services-save {
  height: 56px;
  margin-top: 4px;
  border: 0;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #ffffff;
  background: linear-gradient(180deg, #171d25 0%, #111821 100%);
  font-size: 15px;
  line-height: 1;
  font-weight: 850;
  letter-spacing: -0.045em;
  box-shadow:
    0 10px 18px rgba(17, 26, 38, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);

  &:disabled {
    opacity: 0.68;
  }
}

.services-save__loader {
  width: 18px;
  height: 18px;
  border-color: rgba(255, 255, 255, 0.26);
  border-top-color: #ffffff;
}

.services-confirm {
  align-items: center;
}

.services-confirm__panel {
  padding: 18px;
  text-align: center;
}

.services-confirm__icon {
  width: 58px;
  height: 58px;
  margin: 0 auto;
  border-radius: 20px;
  display: grid;
  place-items: center;
  color: #b54d4d;
  background: linear-gradient(180deg, #fff7f7 0%, #ffecec 100%);
  box-shadow:
    inset 0 0 0 1px rgba(181, 77, 77, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.92);

  svg {
    width: 28px;
    height: 28px;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

.services-confirm__panel {
  h2 {
    margin: 14px 0 0;
    color: #102438;
    font-size: 24px;
    line-height: 1;
    font-weight: 870;
    letter-spacing: -0.075em;
  }

  p {
    margin: 10px 0 0;
    color: rgba(16, 36, 56, 0.55);
    font-size: 13px;
    line-height: 1.4;
    font-weight: 640;
    letter-spacing: -0.025em;
  }

  strong {
    display: block;
    margin-top: 14px;
    padding: 12px;
    border-radius: 18px;
    color: #102438;
    background: #f1f5f8;
    font-size: 14px;
    font-weight: 820;
    letter-spacing: -0.035em;
  }
}

.services-confirm__actions {
  margin-top: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  button {
    height: 50px;
    border: 0;
    border-radius: 17px;
    color: #536273;
    background: #eef3f7;
    font-size: 14px;
    font-weight: 820;
    letter-spacing: -0.035em;
    box-shadow:
      inset 0 0 0 1px rgba(64, 93, 122, 0.055),
      inset 0 1px 0 rgba(255, 255, 255, 0.88);

    &:disabled {
      opacity: 0.65;
    }
  }

  .services-confirm__danger {
    color: #ffffff;
    background: linear-gradient(180deg, #b54d4d 0%, #963c3c 100%);
    box-shadow:
      0 8px 16px rgba(181, 77, 77, 0.16),
      inset 0 1px 0 rgba(255, 255, 255, 0.14);
  }
}

.services-sheet-enter-active,
.services-sheet-leave-active,
.services-confirm-enter-active,
.services-confirm-leave-active {
  transition: opacity 0.24s ease;
}

.services-sheet-enter-from,
.services-sheet-leave-to,
.services-confirm-enter-from,
.services-confirm-leave-to {
  opacity: 0;
}

.services-sheet-enter-active .services-sheet__panel,
.services-sheet-leave-active .services-sheet__panel {
  transition:
    transform 0.34s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.24s ease;
}

.services-sheet-enter-from .services-sheet__panel,
.services-sheet-leave-to .services-sheet__panel {
  transform: translateY(22px) scale(0.985);
  opacity: 0;
}

.services-confirm-enter-active .services-confirm__panel,
.services-confirm-leave-active .services-confirm__panel {
  transition:
    transform 0.24s ease,
    opacity 0.2s ease;
}

.services-confirm-enter-from .services-confirm__panel,
.services-confirm-leave-to .services-confirm__panel {
  transform: scale(0.96);
  opacity: 0;
}

@keyframes services-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>