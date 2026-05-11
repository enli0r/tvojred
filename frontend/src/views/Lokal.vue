<template>
  <div class="lokal-page">
    <div class="lokal-shell">
      <header class="lokal-nav">
        <router-link
          :to="{ name: 'Settings', params: { tenantSlug } }"
          class="lokal-back"
        >
          <span class="lokal-back__icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M15 18 9 12l6-6" />
            </svg>
          </span>

          <span>Podešavanja</span>
        </router-link>

        <div class="lokal-status">
          <span></span>
          Owner only
        </div>
      </header>

      <section class="lokal-hero">
        <div class="lokal-hero__icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M4 10.5 5.5 5h13L20 10.5" />
            <path d="M5 10.5V19h14v-8.5" />
            <path d="M9 19v-5h6v5" />
            <path d="M3.5 10.5h17" />
          </svg>
        </div>

        <div class="lokal-hero__copy">
          <span>Lokal</span>
          <h1>Podaci o lokalu</h1>
          <p>
            Osnovne informacije koje se koriste za prikaz, kontakt i administraciju lokala.
          </p>
        </div>
      </section>

      <section class="lokal-card">
        <div class="lokal-card__top">
          <div>
            <span class="lokal-card__eyebrow">Pregled</span>
            <h2>Informacije lokala</h2>
          </div>

          <button
            class="lokal-edit"
            type="button"
            :disabled="loading || !lokal"
            @click="openSheet"
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
            </svg>
            Izmeni
          </button>
        </div>

        <div v-if="loading" class="lokal-state">
          <div class="lokal-loader"></div>
          <p>Učitavam podatke lokala...</p>
        </div>

        <div v-else-if="error" class="lokal-alert lokal-alert--error">
          <strong>Greška</strong>
          <p>{{ error }}</p>
          <button type="button" @click="fetchLokal">Pokušaj ponovo</button>
        </div>

        <div v-else-if="lokal" class="lokal-info">
          <div class="lokal-main">
            <div class="lokal-logo">
              {{ initials }}
            </div>

            <div>
              <h3>{{ lokal.name }}</h3>
              <p>{{ lokal.slug }}</p>
            </div>
          </div>

          <div class="lokal-list">
            <div class="lokal-row">
              <span>Naziv lokala</span>
              <strong>{{ lokal.name }}</strong>
            </div>

            <div class="lokal-row">
              <span>URL slug</span>
              <strong>{{ lokal.slug }}</strong>
            </div>

            <div class="lokal-row">
              <span>Telefon</span>
              <strong>{{ lokal.phone }}</strong>
            </div>

            <div class="lokal-row">
              <span>Email</span>
              <strong>{{ lokal.email || "Nije unet" }}</strong>
            </div>

            <div class="lokal-row">
              <span>Adresa</span>
              <strong>{{ lokal.address || "Nije uneta" }}</strong>
            </div>
          </div>
        </div>
      </section>

      <p v-if="successMessage" class="lokal-success">
        {{ successMessage }}
      </p>
    </div>

    <Teleport to="body">
      <Transition name="lokal-sheet">
        <div v-if="showSheet" class="lokal-sheet" @click="closeSheet">
          <div class="lokal-sheet__panel" @click.stop>
            <div class="lokal-sheet__handle"></div>

            <header class="lokal-sheet__head">
              <div>
                <span>Izmena lokala</span>
                <h2>Podaci o lokalu</h2>
                <p>Sačuvaj tačne kontakt informacije za ovaj lokal.</p>
              </div>

              <button
                class="lokal-sheet__close"
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

            <div class="lokal-form">
              <label class="lokal-field">
                <span>Naziv lokala</span>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="Unesi naziv lokala"
                />
              </label>

              <label class="lokal-field lokal-field--locked">
                <span>URL slug</span>
                <input
                  v-model="form.slug"
                  type="text"
                  disabled
                />
                <small>Slug trenutno ne menjamo jer utiče na URL lokala.</small>
              </label>

              <label class="lokal-field">
                <span>Telefon</span>
                <input
                  v-model="form.phone"
                  type="text"
                  placeholder="Unesi telefon"
                />
              </label>

              <label class="lokal-field">
                <span>Email</span>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="Unesi email"
                />
              </label>

              <label class="lokal-field">
                <span>Adresa</span>
                <input
                  v-model="form.address"
                  type="text"
                  placeholder="Unesi adresu"
                />
              </label>

              <div v-if="sheetError" class="lokal-alert lokal-alert--error">
                <strong>Greška</strong>
                <p>{{ sheetError }}</p>
              </div>

              <button
                class="lokal-save"
                type="button"
                :disabled="saving"
                @click="saveChanges"
              >
                <span v-if="saving" class="lokal-save__loader"></span>
                <span>{{ saving ? "Čuvam izmene..." : "Sačuvaj izmene" }}</span>
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
import { useRoute } from "vue-router";

type LokalData = {
  id: number;
  name: string;
  slug: string;
  phone: string;
  email: string | null;
  address: string | null;
  created_at?: string;
  updated_at?: string;
};

type LokalForm = {
  name: string;
  slug: string;
  phone: string;
  email: string;
  address: string;
};

const route = useRoute();

const tenantSlug = computed(() => String(route.params.tenantSlug || ""));

const loading = ref(false);
const saving = ref(false);
const showSheet = ref(false);

const lokal = ref<LokalData | null>(null);

const error = ref<string | null>(null);
const sheetError = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const form = ref<LokalForm>({
  name: "",
  slug: "",
  phone: "",
  email: "",
  address: "",
});

const initials = computed(() => {
  const name = lokal.value?.name || "L";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
});

async function fetchLokal() {
  if (!tenantSlug.value) return;

  loading.value = true;
  error.value = null;
  successMessage.value = null;

  try {
    const res = await fetch(`/api/tenants/${tenantSlug.value}/admin/lokal`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      error.value = data?.message || "Nije moguće učitati podatke lokala.";
      return;
    }

    lokal.value = data.lokal;
  } catch (err: any) {
    error.value = err?.message || "Došlo je do greške pri učitavanju lokala.";
  } finally {
    loading.value = false;
  }
}

function openSheet() {
  if (!lokal.value) return;

  form.value = {
    name: lokal.value.name || "",
    slug: lokal.value.slug || "",
    phone: lokal.value.phone || "",
    email: lokal.value.email || "",
    address: lokal.value.address || "",
  };

  sheetError.value = null;
  successMessage.value = null;
  showSheet.value = true;
  document.body.style.overflow = "hidden";
}

function closeSheet() {
  if (saving.value) return;

  showSheet.value = false;
  document.body.style.overflow = "";
}

async function saveChanges() {
  if (saving.value) return;

  sheetError.value = null;
  successMessage.value = null;

  if (!form.value.name.trim() || !form.value.phone.trim()) {
    sheetError.value = "Naziv lokala i telefon su obavezni.";
    return;
  }

  saving.value = true;

  try {
    const res = await fetch(`/api/tenants/${tenantSlug.value}/admin/lokal`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: form.value.name.trim(),
        phone: form.value.phone.trim(),
        email: form.value.email.trim() || null,
        address: form.value.address.trim() || null,
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      sheetError.value = data?.message || "Nije moguće sačuvati izmene.";
      return;
    }

    lokal.value = data.lokal;
    successMessage.value = data?.message || "Podaci lokala su uspešno izmenjeni.";

    closeSheet();
  } catch (err: any) {
    sheetError.value = err?.message || "Došlo je do greške pri čuvanju izmena.";
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  fetchLokal();
});

onBeforeUnmount(() => {
  document.body.style.overflow = "";
});
</script>

<style scoped lang="scss">
.lokal-page,
.lokal-page * {
  box-sizing: border-box;
}

.lokal-page {
  min-height: 100dvh;
  padding: 14px;
  color: #102438;
  background:
    radial-gradient(circle at 50% -12%, rgba(134, 173, 210, 0.18) 0%, transparent 34%),
    linear-gradient(180deg, #f8fafc 0%, #eef3f7 100%);
  font-family: Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif;
}

.lokal-shell {
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  padding-bottom: 28px;
}

.lokal-nav {
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.lokal-back {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: #536273;
  text-decoration: none;
  font-size: 13px;
  line-height: 1;
  font-weight: 820;
  letter-spacing: -0.035em;
  -webkit-tap-highlight-color: transparent;
}

.lokal-back__icon {
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

.lokal-status {
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

.lokal-hero {
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

.lokal-hero__icon {
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

.lokal-hero__copy {
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

.lokal-card {
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

.lokal-card__top {
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

.lokal-card__eyebrow {
  display: block;
  color: rgba(16, 36, 56, 0.42);
  font-size: 10px;
  line-height: 1;
  font-weight: 850;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.lokal-edit {
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
  appearance: none;
  -webkit-tap-highlight-color: transparent;

  &:disabled {
    opacity: 0.45;
  }

  svg {
    width: 17px;
    height: 17px;
    stroke: currentColor;
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

.lokal-info {
  margin-top: 17px;
}

.lokal-main {
  padding: 14px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  background:
    radial-gradient(circle at 100% 0%, rgba(134, 173, 210, 0.12) 0%, transparent 38%),
    linear-gradient(180deg, #f9fbfd 0%, #edf3f8 100%);
  box-shadow:
    inset 0 0 0 1px rgba(64, 93, 122, 0.055),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);

  h3 {
    margin: 0;
    color: #102438;
    font-size: 19px;
    line-height: 1.05;
    font-weight: 870;
    letter-spacing: -0.06em;
  }

  p {
    margin: 6px 0 0;
    color: rgba(16, 36, 56, 0.5);
    font-size: 12px;
    line-height: 1;
    font-weight: 760;
    letter-spacing: -0.025em;
  }
}

.lokal-logo {
  width: 48px;
  height: 48px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  color: #ffffff;
  background: linear-gradient(180deg, #171d25 0%, #111821 100%);
  font-size: 15px;
  line-height: 1;
  font-weight: 900;
  letter-spacing: -0.07em;
  box-shadow:
    0 8px 16px rgba(17, 26, 38, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.lokal-list {
  margin-top: 12px;
  display: grid;
  gap: 8px;
}

.lokal-row {
  min-height: 54px;
  padding: 12px 13px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  background: rgba(255, 255, 255, 0.68);
  box-shadow:
    inset 0 0 0 1px rgba(64, 93, 122, 0.045),
    inset 0 1px 0 rgba(255, 255, 255, 0.88);

  span {
    color: rgba(16, 36, 56, 0.48);
    font-size: 12px;
    line-height: 1;
    font-weight: 780;
    letter-spacing: -0.025em;
  }

  strong {
    min-width: 0;
    color: #102438;
    font-size: 13px;
    line-height: 1.2;
    font-weight: 820;
    letter-spacing: -0.035em;
    text-align: right;
    overflow-wrap: anywhere;
  }
}

.lokal-state {
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

.lokal-loader,
.lokal-save__loader {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  border: 2px solid rgba(64, 93, 122, 0.18);
  border-top-color: #405d7a;
  animation: lokal-spin 0.8s linear infinite;
}

.lokal-alert {
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

.lokal-alert--error {
  color: #b54d4d;
  background: #fff7f7;
  box-shadow:
    inset 0 0 0 1px rgba(181, 77, 77, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.92);
}

.lokal-success {
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

.lokal-sheet {
  position: fixed;
  inset: 0;
  z-index: 80;
  padding: 12px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(11, 16, 24, 0.34);
}

.lokal-sheet__panel {
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

.lokal-sheet__handle {
  width: 42px;
  height: 5px;
  margin: 2px auto 14px;
  border-radius: 999px;
  background: rgba(16, 36, 56, 0.16);
}

.lokal-sheet__head {
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

.lokal-sheet__close {
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

.lokal-form {
  margin-top: 18px;
  display: grid;
  gap: 11px;
}

.lokal-field {
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
    line-height: 1;
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

    &:disabled {
      color: rgba(16, 36, 56, 0.45);
      background: #edf2f6;
      -webkit-text-fill-color: rgba(16, 36, 56, 0.45);
    }
  }

  small {
    color: rgba(16, 36, 56, 0.42);
    font-size: 11px;
    line-height: 1.3;
    font-weight: 650;
    letter-spacing: -0.025em;
  }
}

.lokal-save {
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
  appearance: none;
  -webkit-tap-highlight-color: transparent;

  &:disabled {
    opacity: 0.68;
  }
}

.lokal-save__loader {
  width: 18px;
  height: 18px;
  border-color: rgba(255, 255, 255, 0.26);
  border-top-color: #ffffff;
}

.lokal-sheet-enter-active,
.lokal-sheet-leave-active {
  transition: opacity 0.24s ease;
}

.lokal-sheet-enter-from,
.lokal-sheet-leave-to {
  opacity: 0;
}

.lokal-sheet-enter-active .lokal-sheet__panel,
.lokal-sheet-leave-active .lokal-sheet__panel {
  transition:
    transform 0.34s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.24s ease;
}

.lokal-sheet-enter-from .lokal-sheet__panel,
.lokal-sheet-leave-to .lokal-sheet__panel {
  transform: translateY(22px) scale(0.985);
  opacity: 0;
}

@keyframes lokal-spin {
  to {
    transform: rotate(360deg);
  }
}
</style> 