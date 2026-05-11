<template>
  <div class="barbers-page">
    <div class="barbers-shell">
      <header class="barbers-nav">
        <button class="barbers-back" type="button" @click="goBack">
          <span class="barbers-back__icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M15 18 9 12l6-6" />
            </svg>
          </span>

          <span>Podešavanja</span>
        </button>

        <div class="barbers-status">
          <span></span>
          Owner / Admin
        </div>
      </header>

      <section class="barbers-hero">
        <div class="barbers-hero__icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>

        <div class="barbers-hero__copy">
          <span>Tim</span>
          <h1>Frizeri lokala</h1>
          <p>
            Dodaj, izmeni ili deaktiviraj frizere koji se prikazuju korisnicima za zakazivanje.
          </p>
        </div>
      </section>

      <section class="barbers-card">
        <div class="barbers-card__top">
          <div>
            <span class="barbers-card__eyebrow">Aktivni frizeri</span>
            <h2>{{ activeBarbers.length }} u timu</h2>
          </div>

          <button class="barbers-add" type="button" @click="openCreateSheet">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            Dodaj
          </button>
        </div>

        <div v-if="loading" class="barbers-state">
          <div class="barbers-loader"></div>
          <p>Učitavam frizere...</p>
        </div>

        <div v-else-if="error" class="barbers-alert barbers-alert--error">
          <strong>Greška</strong>
          <p>{{ error }}</p>
          <button type="button" @click="fetchBarbers">Pokušaj ponovo</button>
        </div>

        <div v-else>
          <div v-if="activeBarbers.length === 0" class="barbers-empty">
            <div class="barbers-empty__icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
            </div>

            <strong>Nema aktivnih frizera</strong>
            <p>Dodaj prvog frizera koji će se prikazivati korisnicima.</p>
          </div>

          <div v-else class="barbers-list">
            <article
              v-for="barber in activeBarbers"
              :key="barber.id"
              class="barber-item"
            >
              <div class="barber-item__main">
                <div class="barber-item__avatar">
                  {{ barberInitials(barber.name) }}
                </div>

                <div class="barber-item__copy">
                  <div class="barber-item__title">
                    <h3>{{ barber.name }}</h3>
                    <span v-if="barber.user_id">Nalog povezan</span>
                    <span v-else>Nema nalog</span>
                  </div>

                  <p>{{ barber.specialty || "Specijalnost nije uneta" }}</p>

                  <div class="barber-item__meta">
                    <span>{{ barber.phone || "Bez telefona" }}</span>
                    <span>{{ barber.email || "Bez emaila" }}</span>
                  </div>
                </div>
              </div>

              <div class="barber-item__actions">
                <button type="button" @click="openEditSheet(barber)">
                  Izmeni
                </button>

                <button
                  class="barber-item__danger"
                  type="button"
                  @click="openDeleteConfirm(barber)"
                >
                  Deaktiviraj
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="barbers-card barbers-card--inactive">
        <div class="barbers-card__top">
          <div>
            <span class="barbers-card__eyebrow">Neaktivni frizeri</span>
            <h2>{{ inactiveBarbers.length }} sakriveno</h2>
          </div>
        </div>

        <div v-if="!loading && inactiveBarbers.length === 0" class="barbers-muted">
          Nema neaktivnih frizera.
        </div>

        <div v-else-if="!loading" class="barbers-list">
          <article
            v-for="barber in inactiveBarbers"
            :key="barber.id"
            class="barber-item barber-item--inactive"
          >
            <div class="barber-item__main">
              <div class="barber-item__avatar">
                {{ barberInitials(barber.name) }}
              </div>

              <div class="barber-item__copy">
                <div class="barber-item__title">
                  <h3>{{ barber.name }}</h3>
                  <span>Neaktivan</span>
                </div>

                <p>{{ barber.specialty || "Specijalnost nije uneta" }}</p>

                <div class="barber-item__meta">
                  <span>{{ barber.phone || "Bez telefona" }}</span>
                  <span>{{ barber.email || "Bez emaila" }}</span>
                </div>
              </div>
            </div>

            <div class="barber-item__actions">
              <button type="button" @click="openEditSheet(barber)">
                Izmeni
              </button>

              <button
                class="barber-item__activate"
                type="button"
                @click="activateBarber(barber)"
              >
                Aktiviraj
              </button>
            </div>
          </article>
        </div>
      </section>

      <p v-if="successMessage" class="barbers-success">
        {{ successMessage }}
      </p>
    </div>

    <Teleport to="body">
      <Transition name="barbers-sheet">
        <div v-if="showSheet" class="barbers-sheet" @click="closeSheet">
          <div class="barbers-sheet__panel" @click.stop>
            <div class="barbers-sheet__handle"></div>

            <header class="barbers-sheet__head">
              <div>
                <span>{{ editingBarber ? "Izmena frizera" : "Novi frizer" }}</span>
                <h2>{{ editingBarber ? "Uredi frizera" : "Dodaj frizera" }}</h2>
                <p>
                  Frizer može da postoji u lokalu i bez passkey naloga. Nalog ćemo povezati kasnije.
                </p>
              </div>

              <button
                class="barbers-sheet__close"
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

            <div class="barbers-form">
              <label class="barbers-field">
                <span>Ime frizera</span>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="Npr. Pera Perić"
                />
              </label>

              <label class="barbers-field">
                <span>Telefon</span>
                <input
                  v-model="form.phone"
                  type="text"
                  placeholder="Npr. 0601234567"
                />
              </label>

              <label class="barbers-field">
                <span>Email</span>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="Npr. pera@lokal.rs"
                />
              </label>

              <label class="barbers-field">
                <span>Specijalnost</span>
                <input
                  v-model="form.specialty"
                  type="text"
                  placeholder="Npr. Fade · Brada · Styling"
                />
              </label>

              <div v-if="sheetError" class="barbers-alert barbers-alert--error">
                <strong>Greška</strong>
                <p>{{ sheetError }}</p>
              </div>

              <button
                class="barbers-save"
                type="button"
                :disabled="saving"
                @click="saveBarber"
              >
                <span v-if="saving" class="barbers-save__loader"></span>
                <span>{{ saving ? "Čuvam..." : "Sačuvaj frizera" }}</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <Transition name="barbers-confirm">
        <div v-if="barberToDelete" class="barbers-confirm" @click="closeDeleteConfirm">
          <div class="barbers-confirm__panel" @click.stop>
            <div class="barbers-confirm__icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
              </svg>
            </div>

            <h2>Deaktivirati frizera?</h2>
            <p>
              Frizer neće biti obrisan iz baze, već sakriven iz aktivnog tima i zakazivanja.
            </p>

            <strong>{{ barberToDelete.name }}</strong>

            <div class="barbers-confirm__actions">
              <button type="button" @click="closeDeleteConfirm">
                Odustani
              </button>

              <button
                class="barbers-confirm__danger"
                type="button"
                :disabled="deleting"
                @click="deleteBarber"
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

type Barber = {
  id: number;
  tenant_id: number;
  user_id: number | null;
  name: string;
  phone: string | null;
  email: string | null;
  specialty: string | null;
  is_active: boolean | number;
  created_at?: string;
  updated_at?: string;
};

type BarberForm = {
  name: string;
  phone: string;
  email: string;
  specialty: string;
};

const route = useRoute();
const router = useRouter();

const tenantSlug = computed(() => String(route.params.tenantSlug || ""));

const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);

const showSheet = ref(false);

const barbers = ref<Barber[]>([]);
const editingBarber = ref<Barber | null>(null);
const barberToDelete = ref<Barber | null>(null);

const error = ref<string | null>(null);
const sheetError = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const form = ref<BarberForm>({
  name: "",
  phone: "",
  email: "",
  specialty: "",
});

const activeBarbers = computed(() =>
  barbers.value.filter((barber) => Boolean(barber.is_active))
);

const inactiveBarbers = computed(() =>
  barbers.value.filter((barber) => !Boolean(barber.is_active))
);

function goBack() {
  router.push({
    name: "Settings",
    params: {
      tenantSlug: tenantSlug.value,
    },
  });
}

function barberInitials(name: string) {
  const parts = name.trim().split(" ").filter(Boolean);

  if (parts.length === 0) return "F";

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

async function fetchBarbers() {
  if (!tenantSlug.value) return;

  loading.value = true;
  error.value = null;
  successMessage.value = null;

  try {
    const res = await fetch(`/api/tenants/${tenantSlug.value}/admin/barbers?includeInactive=true`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      error.value = data?.message || "Nije moguće učitati frizere.";
      return;
    }

    barbers.value = data.barbers || [];
  } catch (err: any) {
    error.value = err?.message || "Došlo je do greške pri učitavanju frizera.";
  } finally {
    loading.value = false;
  }
}

function openCreateSheet() {
  editingBarber.value = null;

  form.value = {
    name: "",
    phone: "",
    email: "",
    specialty: "",
  };

  sheetError.value = null;
  successMessage.value = null;
  showSheet.value = true;
  document.body.style.overflow = "hidden";
}

function openEditSheet(barber: Barber) {
  editingBarber.value = barber;

  form.value = {
    name: barber.name || "",
    phone: barber.phone || "",
    email: barber.email || "",
    specialty: barber.specialty || "",
  };

  sheetError.value = null;
  successMessage.value = null;
  showSheet.value = true;
  document.body.style.overflow = "hidden";
}

function closeSheet() {
  if (saving.value) return;

  showSheet.value = false;
  editingBarber.value = null;
  sheetError.value = null;
  document.body.style.overflow = "";
}

async function saveBarber() {
  if (saving.value) return;

  sheetError.value = null;
  successMessage.value = null;

  const name = form.value.name.trim();
  const phone = form.value.phone.trim();
  const email = form.value.email.trim();
  const specialty = form.value.specialty.trim();

  if (!name) {
    sheetError.value = "Ime frizera je obavezno.";
    return;
  }

  saving.value = true;

  try {
    const isEdit = Boolean(editingBarber.value);
    const url = isEdit
      ? `/api/tenants/${tenantSlug.value}/admin/barbers/${editingBarber.value?.id}`
      : `/api/tenants/${tenantSlug.value}/admin/barbers`;

    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name,
        phone: phone || null,
        email: email || null,
        specialty: specialty || null,
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      sheetError.value = data?.message || "Nije moguće sačuvati frizera.";
      return;
    }

    successMessage.value = data?.message || "Frizer je uspešno sačuvan.";

    closeSheet();
    await fetchBarbers();
  } catch (err: any) {
    sheetError.value = err?.message || "Došlo je do greške pri čuvanju frizera.";
  } finally {
    saving.value = false;
  }
}

function openDeleteConfirm(barber: Barber) {
  barberToDelete.value = barber;
  successMessage.value = null;
  document.body.style.overflow = "hidden";
}

function closeDeleteConfirm() {
  if (deleting.value) return;

  barberToDelete.value = null;
  document.body.style.overflow = "";
}

async function deleteBarber() {
  if (!barberToDelete.value || deleting.value) return;

  deleting.value = true;
  error.value = null;
  successMessage.value = null;

  try {
    const res = await fetch(`/api/tenants/${tenantSlug.value}/admin/barbers/${barberToDelete.value.id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      error.value = data?.message || "Nije moguće deaktivirati frizera.";
      return;
    }

    successMessage.value = data?.message || "Frizer je deaktiviran.";

    closeDeleteConfirm();
    await fetchBarbers();
  } catch (err: any) {
    error.value = err?.message || "Došlo je do greške pri deaktiviranju frizera.";
  } finally {
    deleting.value = false;
  }
}

async function activateBarber(barber: Barber) {
  successMessage.value = null;
  error.value = null;

  try {
    const res = await fetch(`/api/tenants/${tenantSlug.value}/admin/barbers/${barber.id}/activate`, {
      method: "PATCH",
      credentials: "include",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      error.value = data?.message || "Nije moguće aktivirati frizera.";
      return;
    }

    successMessage.value = data?.message || "Frizer je aktiviran.";

    await fetchBarbers();
  } catch (err: any) {
    error.value = err?.message || "Došlo je do greške pri aktiviranju frizera.";
  }
}

onMounted(() => {
  fetchBarbers();
});

onBeforeUnmount(() => {
  document.body.style.overflow = "";
});
</script>

<style scoped lang="scss">
.barbers-page,
.barbers-page * {
  box-sizing: border-box;
}

.barbers-page {
  min-height: 100dvh;
  padding: 14px;
  color: #102438;
  background:
    radial-gradient(circle at 50% -12%, rgba(134, 173, 210, 0.18) 0%, transparent 34%),
    linear-gradient(180deg, #f8fafc 0%, #eef3f7 100%);
  font-family: Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif;
}

.barbers-shell {
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  padding-bottom: 28px;
}

.barbers-nav {
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.barbers-back {
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

.barbers-back__icon {
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

.barbers-status {
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

.barbers-hero {
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

.barbers-hero__icon {
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

.barbers-hero__copy {
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

.barbers-card {
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

.barbers-card--inactive {
  opacity: 0.94;
}

.barbers-card__top {
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

.barbers-card__eyebrow {
  display: block;
  color: rgba(16, 36, 56, 0.42);
  font-size: 10px;
  line-height: 1;
  font-weight: 850;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.barbers-add {
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

.barbers-list {
  margin-top: 16px;
  display: grid;
  gap: 10px;
}

.barber-item {
  padding: 13px;
  border-radius: 24px;
  background:
    radial-gradient(circle at 100% 0%, rgba(134, 173, 210, 0.12) 0%, transparent 36%),
    linear-gradient(180deg, #ffffff 0%, #f3f7fa 100%);
  box-shadow:
    inset 0 0 0 1px rgba(64, 93, 122, 0.055),
    inset 0 1px 0 rgba(255, 255, 255, 0.92);
}

.barber-item--inactive {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.76) 0%, rgba(238, 243, 247, 0.82) 100%);
  filter: grayscale(0.16);
}

.barber-item__main {
  display: flex;
  gap: 12px;
}

.barber-item__avatar {
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  color: #ffffff;
  background: linear-gradient(180deg, #171d25 0%, #111821 100%);
  font-size: 14px;
  line-height: 1;
  font-weight: 900;
  letter-spacing: -0.07em;
  box-shadow:
    0 8px 16px rgba(17, 26, 38, 0.13),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.barber-item__copy {
  min-width: 0;
  flex: 1;

  p {
    margin: 6px 0 0;
    color: rgba(16, 36, 56, 0.48);
    font-size: 12px;
    line-height: 1.35;
    font-weight: 650;
    letter-spacing: -0.025em;
  }
}

.barber-item__title {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;

  h3 {
    margin: 1px 0 0;
    color: #102438;
    font-size: 17px;
    line-height: 1.08;
    font-weight: 850;
    letter-spacing: -0.055em;
  }

  span {
    flex: 0 0 auto;
    height: 24px;
    padding: 0 8px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    color: #405d7a;
    background: #eef5fb;
    font-size: 10px;
    line-height: 1;
    font-weight: 850;
    letter-spacing: -0.025em;
    box-shadow:
      inset 0 0 0 1px rgba(64, 93, 122, 0.055),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }
}

.barber-item__meta {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 7px;

  span {
    max-width: 100%;
    min-height: 28px;
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
    overflow-wrap: anywhere;
    box-shadow:
      inset 0 0 0 1px rgba(64, 93, 122, 0.055),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }
}

.barber-item__actions {
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

  .barber-item__danger {
    color: #b54d4d;
    background: #fff2f2;
  }

  .barber-item__activate {
    color: #ffffff;
    background: linear-gradient(180deg, #405d7a 0%, #2f465f 100%);
    box-shadow:
      0 8px 16px rgba(47, 70, 95, 0.14),
      inset 0 1px 0 rgba(255, 255, 255, 0.14);
  }
}

.barbers-state {
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

.barbers-loader,
.barbers-save__loader {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  border: 2px solid rgba(64, 93, 122, 0.18);
  border-top-color: #405d7a;
  animation: barbers-spin 0.8s linear infinite;
}

.barbers-empty {
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

.barbers-empty__icon {
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

.barbers-muted {
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

.barbers-alert {
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

.barbers-alert--error {
  color: #b54d4d;
  background: #fff7f7;
  box-shadow:
    inset 0 0 0 1px rgba(181, 77, 77, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.92);
}

.barbers-success {
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

.barbers-sheet,
.barbers-confirm {
  position: fixed;
  inset: 0;
  z-index: 80;
  padding: 12px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(11, 16, 24, 0.34);
}

.barbers-sheet__panel,
.barbers-confirm__panel {
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

.barbers-sheet__handle {
  width: 42px;
  height: 5px;
  margin: 2px auto 14px;
  border-radius: 999px;
  background: rgba(16, 36, 56, 0.16);
}

.barbers-sheet__head {
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

.barbers-sheet__close {
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

.barbers-form {
  margin-top: 18px;
  display: grid;
  gap: 11px;
}

.barbers-field {
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
    height: 52px;
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

.barbers-save {
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

.barbers-save__loader {
  width: 18px;
  height: 18px;
  border-color: rgba(255, 255, 255, 0.26);
  border-top-color: #ffffff;
}

.barbers-confirm {
  align-items: center;
}

.barbers-confirm__panel {
  padding: 18px;
  text-align: center;
}

.barbers-confirm__icon {
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

.barbers-confirm__panel {
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

.barbers-confirm__actions {
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

  .barbers-confirm__danger {
    color: #ffffff;
    background: linear-gradient(180deg, #b54d4d 0%, #963c3c 100%);
    box-shadow:
      0 8px 16px rgba(181, 77, 77, 0.16),
      inset 0 1px 0 rgba(255, 255, 255, 0.14);
  }
}

.barbers-sheet-enter-active,
.barbers-sheet-leave-active,
.barbers-confirm-enter-active,
.barbers-confirm-leave-active {
  transition: opacity 0.24s ease;
}

.barbers-sheet-enter-from,
.barbers-sheet-leave-to,
.barbers-confirm-enter-from,
.barbers-confirm-leave-to {
  opacity: 0;
}

.barbers-sheet-enter-active .barbers-sheet__panel,
.barbers-sheet-leave-active .barbers-sheet__panel {
  transition:
    transform 0.34s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.24s ease;
}

.barbers-sheet-enter-from .barbers-sheet__panel,
.barbers-sheet-leave-to .barbers-sheet__panel {
  transform: translateY(22px) scale(0.985);
  opacity: 0;
}

.barbers-confirm-enter-active .barbers-confirm__panel,
.barbers-confirm-leave-active .barbers-confirm__panel {
  transition:
    transform 0.24s ease,
    opacity 0.2s ease;
}

.barbers-confirm-enter-from .barbers-confirm__panel,
.barbers-confirm-leave-to .barbers-confirm__panel {
  transform: scale(0.96);
  opacity: 0;
}

@keyframes barbers-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>