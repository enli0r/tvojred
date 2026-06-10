<template>
  <header class="booking-navbar">
    <button class="welcome-logo" type="button" aria-label="Početna" @click="goHome">
      <span class="welcome-logo__mark">
        <svg viewBox="0 0 64 64" fill="none">
          <rect x="10" y="10" width="44" height="44" rx="16" />
          <path d="M20 42V23.5L32 35.5L44 23.5V42" />
          <path d="M24 46H40" />
        </svg>
      </span>

      <span class="welcome-logo__text">
        <strong>Fade Studio</strong>
        <small>Premium Barber</small>
      </span>
    </button>

    <button
      v-if="!isLoggedIn || !currentUser"
      class="booking-login-button"
      type="button"
      @click="openLoginSheet"
    >
      Prijava
    </button>

    <button
      v-else
      class="booking-user-button"
      type="button"
      aria-label="Otvori korisnički meni"
      @click="openAccountMenu"
    >
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0a3.75 3.75 0 0 1 7.5 0Z" />
        <path d="M4.5 20.25a7.5 7.5 0 0 1 15 0" />
      </svg>

      <span></span>
    </button>

    <Teleport to="body">
      <Transition name="menu-fade">
        <div
          v-if="anyPanelOpen"
          class="welcome-menu-backdrop"
          @click="closeTopLayer"
        ></div>
      </Transition>

      <Transition name="confirm-pop">
        <section
          v-if="confirmOpen"
          class="confirm-popup"
          role="dialog"
          aria-modal="true"
          aria-label="Potvrda akcije"
        >
          <div class="confirm-popup__icon is-danger">
            <svg v-if="confirmType === 'logout'" viewBox="0 0 24 24" fill="none">
              <path d="M15.75 9V5.75A2.75 2.75 0 0 0 13 3H6.75A2.75 2.75 0 0 0 4 5.75v12.5A2.75 2.75 0 0 0 6.75 21H13a2.75 2.75 0 0 0 2.75-2.75V15" />
              <path d="M19.5 12H9.75" />
              <path d="M16.25 8.75L19.5 12l-3.25 3.25" />
            </svg>

            <svg v-else viewBox="0 0 24 24" fill="none">
              <path d="M8 7V4.75A2.75 2.75 0 0 1 10.75 2h2.5A2.75 2.75 0 0 1 16 4.75V7" />
              <path d="M5.75 7h12.5" />
              <path d="M18.75 7l-.72 11.25A3 3 0 0 1 15.04 21H8.96a3 3 0 0 1-2.99-2.75L5.25 7" />
              <path d="M10 11v5M14 11v5" />
            </svg>
          </div>

          <div class="confirm-popup__copy">
            <span>Potvrda</span>
            <h2>{{ confirmTitle }}</h2>
            <p>{{ confirmText }}</p>
          </div>

          <div class="confirm-popup__actions">
            <button
              class="confirm-popup__secondary"
              type="button"
              @click="closeConfirmPopup"
            >
              Nazad
            </button>

            <button
              class="confirm-popup__primary is-danger"
              type="button"
              @click="confirmPopupAction"
            >
              {{ confirmPrimaryText }}
            </button>
          </div>
        </section>
      </Transition>

      <Transition name="services-sheet">
        <section
          v-if="loginSheetOpen"
          class="services-popup login-popup"
          role="dialog"
          aria-modal="true"
          aria-label="Prijava"
        >
          <div class="services-popup__handle"></div>

          <header class="services-popup__head">
            <div>
              <span>Korisnički nalog</span>
              <h2>Prijava</h2>
            </div>

            <button
              class="services-popup__close"
              type="button"
              aria-label="Zatvori"
              @click="closeLoginSheet"
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </header>

          <div class="services-popup__accent"></div>

          <p class="login-popup__intro">
            Unesi ime i telefon, pa potvrdi passkey-em. Ovo služi samo za prijavu i registraciju.
          </p>

          <div class="login-popup__body">
            <PasskeyTest
              :is-logged-in="isLoggedIn"
              :current-user="currentUser"
              :loading="false"
              @close="closeLoginSheet"
              @auth-change="handleAuthChange"
              @confirm-booking="handleAuthOnlyDone"
            />
          </div>
        </section>
      </Transition>

      <Transition name="services-sheet">
        <section
          v-if="cancelSheetOpen"
          class="services-popup cancel-popup"
          role="dialog"
          aria-modal="true"
          aria-label="Otkazivanje termina"
        >
          <div class="services-popup__handle"></div>

          <header class="services-popup__head">
            <div>
              <span>Tvoji termini</span>
              <h2>Otkaži termin</h2>
            </div>

            <button
              class="services-popup__close"
              type="button"
              aria-label="Zatvori"
              @click="closeCancelSheet"
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </header>

          <div class="services-popup__accent"></div>

          <p class="cancel-popup__intro">
            Izaberi aktivnu rezervaciju koju želiš da otkažeš.
          </p>

          <div v-if="cancelLoading" class="cancel-state">
            <div class="cancel-spinner"></div>
            <strong>Učitavam termine...</strong>
          </div>

          <div v-else-if="cancelError" class="cancel-state cancel-state--error">
            <strong>{{ cancelError }}</strong>
            <button type="button" @click="fetchMyAppointments">
              Pokušaj ponovo
            </button>
          </div>

          <div v-else-if="myAppointments.length === 0" class="cancel-state">
            <strong>Nemaš aktivnih termina</strong>
            <p>Trenutno nema rezervacija koje mogu da se otkažu.</p>
          </div>

          <div v-else class="cancel-list">
            <article
              v-for="appointment in myAppointments"
              :key="appointment.id"
              class="cancel-card"
            >
              <div class="cancel-card__date">
                <span>{{ formatDay(appointment.start_time) }}</span>
                <strong>{{ formatTime(appointment.start_time) }}</strong>
              </div>

              <div class="cancel-card__body">
                <span>Frizer</span>
                <strong>{{ appointment.barber_name }}</strong>
                <p>{{ formatFullDate(appointment.start_time) }}</p>
              </div>

              <button
                class="cancel-card__button"
                type="button"
                :disabled="cancellingId === appointment.id"
                @click="requestCancelAppointment(appointment)"
              >
                {{ cancellingId === appointment.id ? "..." : "Otkaži" }}
              </button>
            </article>
          </div>

          <p v-if="cancelSuccess" class="cancel-success">
            {{ cancelSuccess }}
          </p>
        </section>
      </Transition>

      <Transition name="menu-slide">
        <aside
          v-if="accountMenuOpen"
          class="welcome-menu account-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Korisnički meni"
        >
          <div class="welcome-menu__head">
            <div class="welcome-menu__logo">
              <span class="welcome-menu__logo-mark">
                <svg viewBox="0 0 64 64" fill="none">
                  <rect x="10" y="10" width="44" height="44" rx="16" />
                  <path d="M20 42V23.5L32 35.5L44 23.5V42" />
                  <path d="M24 46H40" />
                </svg>
              </span>

              <div>
                <strong>Test Studio</strong>
                <small>Premium Barber</small>
              </div>
            </div>

            <button
              type="button"
              class="welcome-menu__close"
              aria-label="Zatvori meni"
              @click="closeAccountMenu"
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          <section class="account-card">
            <div class="account-card__icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0a3.75 3.75 0 0 1 7.5 0Z" />
                <path d="M4.5 20.25a7.5 7.5 0 0 1 15 0" />
              </svg>
            </div>

            <div class="account-card__copy">
              <span>Prijavljen si kao</span>
              <strong>{{ currentUser?.name || "Korisnik" }}</strong>
              <p>{{ currentUser?.phone || "Telefon nije dodat" }}</p>
            </div>
          </section>

          <nav class="welcome-menu__nav account-menu__nav">
            <button type="button" @click="openCancelSheet">
              <span class="account-menu__nav-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M8 7V4.75A2.75 2.75 0 0 1 10.75 2h2.5A2.75 2.75 0 0 1 16 4.75V7" />
                  <path d="M5.75 7h12.5" />
                  <path d="M18.75 7l-.72 11.25A3 3 0 0 1 15.04 21H8.96a3 3 0 0 1-2.99-2.75L5.25 7" />
                  <path d="M10 11v5M14 11v5" />
                </svg>
              </span>

              <span class="account-menu__nav-copy">
                <strong>Otkaži termin</strong>
                <small>Pregledaj ili otkaži postojeću rezervaciju</small>
              </span>

              <svg class="account-menu__chevron" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            <button type="button" class="account-menu__logout" @click="requestLogout">
              <span class="account-menu__nav-icon account-menu__nav-icon--logout">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M15.75 9V5.75A2.75 2.75 0 0 0 13 3H6.75A2.75 2.75 0 0 0 4 5.75v12.5A2.75 2.75 0 0 0 6.75 21H13a2.75 2.75 0 0 0 2.75-2.75V15" />
                  <path d="M19.5 12H9.75" />
                  <path d="M16.25 8.75L19.5 12l-3.25 3.25" />
                </svg>
              </span>

              <span class="account-menu__nav-copy">
                <strong>Odjavi me</strong>
                <small>Odjavi se sa ovog uređaja</small>
              </span>

              <svg class="account-menu__chevron" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </nav>
        </aside>
      </Transition>
    </Teleport>
  </header>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import PasskeyTest from "@/components/PasskeyTest.vue";

type AuthUser = {
  id: number;
  name: string;
  phone: string;
};

type MyAppointment = {
  id: number;
  tenant_id: number;
  customer_id: number;
  barber_id: number;
  start_time: string;
  end_time: string;
  status: string;
  barber_name: string;
  customer_name: string;
  customer_phone: string;
};

const props = defineProps<{
  tenantId: number | null | undefined;
  isLoggedIn: boolean;
  currentUser: AuthUser | null;
}>();

const emit = defineEmits<{
  (
    e: "auth-change",
    payload: {
      isLoggedIn: boolean;
      user: AuthUser | null;
    }
  ): void;
  (e: "logout"): void;
  (e: "appointment-cancelled"): void;
}>();

const router = useRouter();
const route = useRoute();

const loginSheetOpen = ref(false);
const accountMenuOpen = ref(false);
const cancelSheetOpen = ref(false);

const confirmOpen = ref(false);
const confirmType = ref<"logout" | "cancel" | null>(null);
const confirmAppointment = ref<MyAppointment | null>(null);

const myAppointments = ref<MyAppointment[]>([]);
const cancelLoading = ref(false);
const cancelError = ref<string | null>(null);
const cancelSuccess = ref<string | null>(null);
const cancellingId = ref<number | null>(null);

const anyPanelOpen = computed(
  () =>
    loginSheetOpen.value ||
    accountMenuOpen.value ||
    cancelSheetOpen.value ||
    confirmOpen.value
);

const confirmTitle = computed(() => {
  if (confirmType.value === "logout") return "Odjava sa naloga";
  if (confirmType.value === "cancel") return "Otkazivanje termina";
  return "";
});

const confirmText = computed(() => {
  if (confirmType.value === "logout") {
    return "Da li si siguran da želiš da se odjaviš sa ovog uređaja?";
  }

  if (confirmType.value === "cancel" && confirmAppointment.value) {
    return `Da li si siguran da želiš da otkažeš termin kod ${confirmAppointment.value.barber_name} u ${formatTime(
      confirmAppointment.value.start_time
    )}?`;
  }

  return "";
});

const confirmPrimaryText = computed(() => {
  if (confirmType.value === "logout") return "Odjavi me";
  if (confirmType.value === "cancel") return "Otkaži termin";
  return "Potvrdi";
});

let scrollY = 0;

function lockPageScroll() {
  scrollY = window.scrollY;

  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
}

function unlockPageScroll() {
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";

  window.scrollTo(0, scrollY);
}

watch(anyPanelOpen, (isOpen) => {
  if (isOpen) {
    lockPageScroll();
  } else {
    unlockPageScroll();
  }
});

function goHome() {
  const tenantSlug = route.params.tenantSlug;

  if (tenantSlug) {
    router.push({
      name: "Welcome",
      params: {
        tenantSlug,
      },
    });

    return;
  }

  router.push({ name: "Welcome" });
}

function openLoginSheet() {
  accountMenuOpen.value = false;
  cancelSheetOpen.value = false;
  confirmOpen.value = false;
  loginSheetOpen.value = true;
}

function closeLoginSheet() {
  loginSheetOpen.value = false;
}

function openAccountMenu() {
  loginSheetOpen.value = false;
  cancelSheetOpen.value = false;
  confirmOpen.value = false;
  accountMenuOpen.value = true;
}

function closeAccountMenu() {
  accountMenuOpen.value = false;
}

function closeCancelSheet() {
  cancelSheetOpen.value = false;
}

function closeAllPanels() {
  loginSheetOpen.value = false;
  accountMenuOpen.value = false;
  cancelSheetOpen.value = false;
  closeConfirmPopup();
}

function closeTopLayer() {
  if (confirmOpen.value) {
    closeConfirmPopup();
    return;
  }

  closeAllPanels();
}

function handleAuthChange(payload: { isLoggedIn: boolean; user: AuthUser | null }) {
  emit("auth-change", payload);

  if (payload.isLoggedIn && payload.user) {
    closeLoginSheet();
  }
}

function handleAuthOnlyDone() {
  closeLoginSheet();
}

async function openCancelSheet() {
  accountMenuOpen.value = false;
  loginSheetOpen.value = false;
  confirmOpen.value = false;
  cancelSheetOpen.value = true;

  await fetchMyAppointments();
}

async function fetchMyAppointments() {
  if (!props.tenantId) {
    cancelError.value = "Lokal nije učitan. Pokušaj ponovo.";
    return;
  }

  cancelLoading.value = true;
  cancelError.value = null;
  cancelSuccess.value = null;

  try {
    const res = await fetch(`/api/appointments/my?tenant_id=${props.tenantId}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.message || "Ne mogu da učitam tvoje termine.");
    }

    myAppointments.value = data?.appointments || [];
  } catch (err: any) {
    cancelError.value = err?.message || "Greška pri učitavanju termina.";
    myAppointments.value = [];
  } finally {
    cancelLoading.value = false;
  }
}

function requestCancelAppointment(appointment: MyAppointment) {
  confirmType.value = "cancel";
  confirmAppointment.value = appointment;
  confirmOpen.value = true;
}

async function cancelUserAppointment(appointmentId: number) {
  if (cancellingId.value) return;

  cancellingId.value = appointmentId;
  cancelError.value = null;
  cancelSuccess.value = null;

  try {
    const res = await fetch(`/api/appointments/${appointmentId}/cancel`, {
      method: "PATCH",
      credentials: "include",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.message || "Termin nije moguće otkazati.");
    }

    cancelSuccess.value = data?.message || "Termin je uspešno otkazan.";

    myAppointments.value = myAppointments.value.filter(
      (appointment) => appointment.id !== appointmentId
    );

    emit("appointment-cancelled");
  } catch (err: any) {
    cancelError.value = err?.message || "Greška pri otkazivanju termina.";
  } finally {
    cancellingId.value = null;
  }
}

function requestLogout() {
  confirmType.value = "logout";
  confirmAppointment.value = null;
  confirmOpen.value = true;
}

function closeConfirmPopup() {
  confirmOpen.value = false;
  confirmType.value = null;
  confirmAppointment.value = null;
}

async function confirmPopupAction() {
  if (confirmType.value === "logout") {
    closeConfirmPopup();
    closeAllPanels();
    emit("logout");
    return;
  }

  if (confirmType.value === "cancel" && confirmAppointment.value) {
    const appointmentId = confirmAppointment.value.id;
    closeConfirmPopup();
    await cancelUserAppointment(appointmentId);
  }
}

function formatDay(value: string) {
  return new Intl.DateTimeFormat("sr-RS", {
    weekday: "short",
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("sr-RS", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatFullDate(value: string) {
  return new Intl.DateTimeFormat("sr-RS", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

onBeforeUnmount(() => {
  unlockPageScroll();
});
</script>

<style scoped lang="scss">
.booking-navbar,
.booking-navbar * {
  box-sizing: border-box;
}

.booking-navbar {
  position: relative;
  z-index: 1;

  min-height: 60px;
  padding: 10px 20px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 11px;

  background: #f4f6f9;

  box-shadow:
    0 8px 22px rgba(22, 34, 52, 0.055),
    0 1px 2px rgba(22, 34, 52, 0.03),
    inset 0 1px 0 rgba(255, 255, 255, 0.92),
    inset 0 0 0 1px rgba(64, 93, 122, 0.045);

  font-family: Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif;
}

.booking-navbar svg,
.welcome-menu svg,
.welcome-menu-backdrop svg,
.services-popup svg,
.confirm-popup svg {
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.welcome-logo {
  min-width: 0;
  border: 0;
  padding: 0;
  background: transparent;

  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 9px;

  appearance: none;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

.welcome-logo__mark {
  width: 40px;
  height: 40px;
  border-radius: 16px;
  flex: 0 0 40px;

  display: grid;
  place-items: center;

  color: #86add2;
  background: linear-gradient(180deg, #2a2f3a 0%, #171b24 100%);

  box-shadow:
    0 3px 8px rgba(23, 27, 36, 0.13),
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    inset 0 0 0 1px rgba(255, 255, 255, 0.06);

  svg {
    width: 25px;
    height: 25px;
    display: block;
    stroke: currentColor;
    stroke-width: 2.6;
  }
}

.welcome-logo__text {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;

  strong {
    color: #102438;
    font-size: 15px;
    line-height: 1;
    font-weight: 860;
    letter-spacing: -0.055em;
    white-space: nowrap;
  }

  small {
    margin-top: 5px;
    color: rgba(16, 36, 56, 0.58);
    font-size: 8.5px;
    line-height: 1;
    font-weight: 850;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    white-space: nowrap;
  }
}

.booking-login-button,
.booking-user-button {
  border: 0;
  appearance: none;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

.booking-login-button {
  height: 40px;
  padding: 0 16px;
  border-radius: 14px;
  flex: 0 0 auto;

  color: #ffffff;
  background:
    radial-gradient(circle at 16% 0%, rgba(255, 255, 255, 0.075), transparent 34%),
    linear-gradient(180deg, #171d25 0%, #111821 100%);

  box-shadow:
    0 9px 16px rgba(5, 8, 12, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    inset 0 0 0 1px rgba(255, 255, 255, 0.055);

  font-size: 13px;
  line-height: 1;
  font-weight: 820;
  letter-spacing: -0.035em;

  transition: transform 0.16s ease;

  &:active {
    transform: scale(0.97);
  }
}

.booking-user-button {
  position: relative;

  width: 44px;
  height: 44px;
  border-radius: 15px;
  padding: 0;
  flex: 0 0 44px;

  display: grid;
  place-items: center;

  color: #102438;
  background: #ffffff;

  box-shadow:
    inset 0 0 0 1px rgba(64, 93, 122, 0.055),
    inset 0 1px 0 rgba(255, 255, 255, 0.94);

  transition: transform 0.16s ease;

  svg {
    width: 23px;
    height: 23px;
    display: block;

    path {
      stroke: currentColor;
      stroke-width: 2.05;
    }
  }

  span {
    position: absolute;
    right: 8px;
    bottom: 8px;

    width: 8px;
    height: 8px;
    border-radius: 999px;

    background: #2f9f68;
    box-shadow:
      0 0 0 2px #ffffff,
      0 2px 5px rgba(47, 159, 104, 0.28);
  }

  &:active {
    transform: scale(0.96);
  }
}

/* WELCOME IDENTICAL SLIDE MENU */

.welcome-menu-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2147483600;
  background: rgba(11, 15, 21, 0.7);
}

.welcome-menu {
  position: fixed;
  z-index: 2147483601;
  top: 0;
  right: 0;
  width: min(100vw, 350px);
  height: 100dvh;
  padding: 22px 18px calc(22px + env(safe-area-inset-bottom));

  background:
    radial-gradient(circle at 100% 0%, rgba(134, 173, 210, 0.14) 0%, transparent 34%),
    linear-gradient(180deg, #ffffff 0%, #f5f8fb 100%);

  box-shadow:
    -22px 0 44px rgba(12, 18, 28, 0.18),
    inset 1px 0 0 rgba(64, 93, 122, 0.06);

  display: flex;
  flex-direction: column;
}

.welcome-menu__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 30px;
}

.welcome-menu__logo {
  display: flex;
  align-items: center;
  gap: 11px;

  strong {
    display: block;
    color: #102438;
    font-size: 20px;
    line-height: 1;
    font-weight: 860;
    letter-spacing: -0.06em;
  }

  small {
    display: block;
    margin-top: 6px;
    color: rgba(16, 36, 56, 0.58);
    font-size: 10px;
    line-height: 1;
    font-weight: 850;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }
}

.welcome-menu__logo-mark {
  width: 46px;
  height: 46px;
  border-radius: 17px;

  display: grid;
  place-items: center;

  color: #86add2;
  background: linear-gradient(180deg, #2a2f3a 0%, #171b24 100%);

  box-shadow:
    0 4px 10px rgba(23, 27, 36, 0.14),
    0 1px 3px rgba(23, 27, 36, 0.07),
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    inset 0 0 0 1px rgba(255, 255, 255, 0.06);

  svg {
    width: 28px;
    height: 28px;
    display: block;
    stroke: currentColor;
    stroke-width: 2.6;
  }
}

.welcome-menu__close {
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 50%;
  padding: 0;
  flex: 0 0 40px;

  display: grid;
  place-items: center;

  color: #405d7a;
  background: #f1f4f7;

  appearance: none;
  outline: none;
  -webkit-tap-highlight-color: transparent;

  svg {
    width: 20px;
    height: 20px;
    display: block;
    stroke: currentColor;
    stroke-width: 2.4;
  }

  &:active {
    transform: scale(0.98);
  }
}

.welcome-menu__nav {
  display: grid;
  gap: 9px;

  button {
    width: 100%;
    min-height: 58px;
    border: 0;
    border-radius: 18px;
    padding: 10px 12px;

    display: grid;
    grid-template-columns: 42px minmax(0, 1fr) 18px;
    align-items: center;
    gap: 11px;

    color: #102438;
    background: rgba(255, 255, 255, 0.7);

    text-align: left;

    box-shadow:
      inset 0 0 0 1px rgba(64, 93, 122, 0.055),
      inset 0 1px 0 rgba(255, 255, 255, 0.94);

    appearance: none;
    outline: none;
    -webkit-tap-highlight-color: transparent;

    transition: transform 0.16s ease;

    &:active {
      transform: scale(0.985);
    }
  }
}

.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.22s ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
}

.menu-slide-enter-active,
.menu-slide-leave-active {
  transition: transform 0.34s cubic-bezier(0.22, 1, 0.36, 1);
}

.menu-slide-enter-from,
.menu-slide-leave-to {
  transform: translateX(100%);
}

/* ACCOUNT */

.account-card {
  margin-bottom: 16px;
  padding: 14px;
  border-radius: 22px;

  display: flex;
  align-items: center;
  gap: 12px;

  background: rgba(255, 255, 255, 0.72);

  box-shadow:
    inset 0 0 0 1px rgba(64, 93, 122, 0.055),
    inset 0 1px 0 rgba(255, 255, 255, 0.94),
    0 8px 18px rgba(22, 34, 52, 0.055);
}

.account-card__icon {
  width: 48px;
  height: 48px;
  border-radius: 17px;
  flex: 0 0 48px;

  display: grid;
  place-items: center;

  color: #86add2;
  background: linear-gradient(180deg, #2a2f3a 0%, #171b24 100%);

  box-shadow:
    0 3px 8px rgba(23, 27, 36, 0.13),
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    inset 0 0 0 1px rgba(255, 255, 255, 0.06);

  svg {
    width: 24px;
    height: 24px;

    path {
      stroke-width: 1.9;
    }
  }
}

.account-card__copy {
  min-width: 0;

  span {
    display: block;
    color: #64809c;
    font-size: 9px;
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
    font-weight: 850;
    letter-spacing: -0.055em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    margin: 7px 0 0;
    color: rgba(16, 36, 56, 0.58);
    font-size: 13px;
    line-height: 1;
    font-weight: 650;
    letter-spacing: -0.025em;
  }
}

.account-menu__nav-icon {
  width: 42px;
  height: 42px;
  border-radius: 15px;

  display: grid;
  place-items: center;

  color: #4f78a3;
  background: #f9fbfd;

  box-shadow:
    inset 0 0 0 1px rgba(64, 93, 122, 0.08),
    0 1px 2px rgba(22, 34, 52, 0.035);

  svg {
    width: 21px;
    height: 21px;
    display: block;
    stroke: currentColor;
    stroke-width: 1.8;
  }
}

.account-menu__nav-icon--logout {
  color: #b54d4d;
  background: #fff7f7;
}

.account-menu__logout {
  margin-top: 4px;
}

.account-menu__nav-copy {
  min-width: 0;

  strong {
    display: block;
    color: #102438;
    font-size: 15px;
    line-height: 1;
    font-weight: 760;
    letter-spacing: -0.035em;
  }

  small {
    display: block;
    margin-top: 6px;
    color: rgba(16, 36, 56, 0.55);
    font-size: 12px;
    line-height: 1.22;
    font-weight: 620;
    letter-spacing: -0.025em;
  }
}

.account-menu__chevron {
  width: 18px;
  height: 18px;
  color: rgba(16, 36, 56, 0.4);

  path {
    stroke-width: 2.1;
  }
}

/* BOTTOM SHEET */

.services-popup {
  position: fixed;
  left: 12px;
  right: 12px;
  bottom: 12px;
  z-index: 2147483602;

  width: min(calc(100% - 24px), 520px);
  max-height: calc(100dvh - 24px);
  margin: 0 auto;
  padding: 9px 16px calc(18px + env(safe-area-inset-bottom));
  border-radius: 30px;

  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;

  color: #102438;
  background:
    radial-gradient(circle at 90% 0%, rgba(134, 173, 210, 0.13) 0%, transparent 34%),
    linear-gradient(180deg, #ffffff 0%, #f4f7fa 100%);

  box-shadow:
    0 24px 50px rgba(8, 12, 18, 0.22),
    0 8px 18px rgba(8, 12, 18, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.96),
    inset 0 0 0 1px rgba(64, 93, 122, 0.075);

  font-family: Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif;
}

.services-popup__handle {
  width: 38px;
  height: 4px;
  margin: 2px auto 16px;
  border-radius: 999px;
  background: rgba(64, 93, 122, 0.16);
}

.services-popup__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

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
    font-size: 22px;
    line-height: 1;
    font-weight: 820;
    letter-spacing: -0.055em;
  }
}

.services-popup__close {
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 50%;
  padding: 0;
  flex: 0 0 38px;

  display: grid;
  place-items: center;

  color: #405d7a;
  background: #eef3f7;

  box-shadow:
    inset 0 0 0 1px rgba(64, 93, 122, 0.065),
    inset 0 1px 0 rgba(255, 255, 255, 0.88);

  appearance: none;
  outline: none;
  -webkit-tap-highlight-color: transparent;

  svg {
    width: 18px;
    height: 18px;
  }

  &:active {
    transform: scale(0.98);
  }
}

.services-popup__accent {
  width: 34px;
  height: 3px;
  margin: 14px 0 12px;
  border-radius: 999px;
  background: linear-gradient(90deg, #405d7a 0%, #86add2 100%);
}

.login-popup__intro,
.cancel-popup__intro {
  margin: 0 0 14px;
  color: rgba(16, 36, 56, 0.56);
  font-size: 13px;
  line-height: 1.36;
  font-weight: 610;
  letter-spacing: -0.025em;
}

.login-popup__body {
  margin-top: 4px;
}

.services-sheet-enter-active,
.services-sheet-leave-active {
  transition:
    transform 0.34s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.24s ease;
}

.services-sheet-enter-from,
.services-sheet-leave-to {
  opacity: 0;
  transform: translateY(24px) scale(0.98);
}

/* CANCEL */

.cancel-state {
  min-height: 150px;
  padding: 22px 14px;
  border-radius: 22px;

  display: grid;
  place-items: center;
  text-align: center;

  background: rgba(255, 255, 255, 0.72);

  box-shadow:
    inset 0 0 0 1px rgba(64, 93, 122, 0.055),
    inset 0 1px 0 rgba(255, 255, 255, 0.94);

  strong {
    color: #102438;
    font-size: 15px;
    font-weight: 800;
    letter-spacing: -0.035em;
  }

  p {
    margin: 7px 0 0;
    color: rgba(16, 36, 56, 0.55);
    font-size: 13px;
    line-height: 1.35;
    font-weight: 600;
  }

  button {
    height: 42px;
    margin-top: 12px;
    padding: 0 16px;
    border: 0;
    border-radius: 14px;

    color: #ffffff;
    background: linear-gradient(180deg, #171d25 0%, #111821 100%);

    font-size: 13px;
    font-weight: 800;
  }
}

.cancel-state--error {
  strong {
    color: #b54d4d;
  }
}

.cancel-spinner {
  width: 28px;
  height: 28px;
  margin-bottom: 12px;
  border-radius: 999px;
  border: 3px solid rgba(64, 93, 122, 0.15);
  border-top-color: #405d7a;
  animation: cancelSpin 0.8s linear infinite;
}

.cancel-list {
  display: grid;
  gap: 10px;
}

.cancel-card {
  padding: 12px;
  border-radius: 22px;

  display: grid;
  grid-template-columns: 74px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;

  background: rgba(255, 255, 255, 0.78);

  box-shadow:
    0 8px 18px rgba(22, 34, 52, 0.055),
    inset 0 0 0 1px rgba(64, 93, 122, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.94);
}

.cancel-card__date {
  height: 58px;
  border-radius: 18px;

  display: grid;
  place-items: center;

  color: #86add2;
  background: linear-gradient(180deg, #2a2f3a 0%, #171b24 100%);

  span {
    color: rgba(255, 255, 255, 0.68);
    font-size: 9px;
    line-height: 1;
    font-weight: 850;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  strong {
    color: #ffffff;
    font-size: 17px;
    line-height: 1;
    font-weight: 860;
    letter-spacing: -0.05em;
  }
}

.cancel-card__body {
  min-width: 0;

  span {
    display: block;
    color: #64809c;
    font-size: 9px;
    line-height: 1;
    font-weight: 850;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  strong {
    display: block;
    margin-top: 6px;
    color: #102438;
    font-size: 15px;
    line-height: 1;
    font-weight: 820;
    letter-spacing: -0.04em;
  }

  p {
    margin: 6px 0 0;
    color: rgba(16, 36, 56, 0.55);
    font-size: 12px;
    line-height: 1;
    font-weight: 620;
    letter-spacing: -0.025em;
  }
}

.cancel-card__button {
  height: 38px;
  border: 0;
  border-radius: 14px;
  padding: 0 13px;

  color: #b54d4d;
  background: #fff7f7;

  font-size: 12px;
  line-height: 1;
  font-weight: 850;
  letter-spacing: -0.025em;

  box-shadow:
    inset 0 0 0 1px rgba(181, 77, 77, 0.09),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);

  &:disabled {
    opacity: 0.65;
  }
}

.cancel-success {
  margin: 12px 0 0;
  padding: 12px 14px;
  border-radius: 18px;

  color: #24714d;
  background: #f0fbf6;

  font-size: 13px;
  line-height: 1.3;
  font-weight: 720;
  letter-spacing: -0.025em;
}

/* CONFIRM */

.confirm-popup {
  position: fixed;
  left: 18px;
  right: 18px;
  top: 50%;
  z-index: 2147483603;

  max-width: 390px;
  margin: 0 auto;
  padding: 18px;
  border-radius: 28px;

  transform: translateY(-50%);

  color: #102438;
  background:
    radial-gradient(circle at 90% 0%, rgba(134, 173, 210, 0.14) 0%, transparent 34%),
    linear-gradient(180deg, #ffffff 0%, #f4f7fa 100%);

  box-shadow:
    0 28px 60px rgba(8, 12, 18, 0.26),
    0 8px 18px rgba(8, 12, 18, 0.13),
    inset 0 1px 0 rgba(255, 255, 255, 0.96),
    inset 0 0 0 1px rgba(64, 93, 122, 0.075);

  font-family: Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif;
}

.confirm-popup__icon {
  width: 58px;
  height: 58px;
  margin: 0 auto 14px;
  border-radius: 20px;

  display: grid;
  place-items: center;

  color: #405d7a;
  background: linear-gradient(180deg, #eef5fb 0%, #dbe7f1 100%);

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    inset 0 0 0 1px rgba(64, 93, 122, 0.06);

  &.is-danger {
    color: #b54d4d;
    background: linear-gradient(180deg, #fff7f7 0%, #ffecec 100%);
  }

  svg {
    width: 27px;
    height: 27px;

    path {
      stroke: currentColor;
      stroke-width: 1.95;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  }
}

.confirm-popup__copy {
  text-align: center;

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
    margin: 8px 0 0;
    color: #102438;
    font-size: 22px;
    line-height: 1.05;
    font-weight: 840;
    letter-spacing: -0.055em;
  }

  p {
    max-width: 300px;
    margin: 9px auto 0;
    color: rgba(16, 36, 56, 0.58);
    font-size: 14px;
    line-height: 1.38;
    font-weight: 610;
    letter-spacing: -0.025em;
  }
}

.confirm-popup__actions {
  margin-top: 18px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.confirm-popup__secondary,
.confirm-popup__primary {
  height: 50px;
  border: 0;
  border-radius: 17px;

  font-size: 14px;
  line-height: 1;
  font-weight: 820;
  letter-spacing: -0.035em;

  appearance: none;
  outline: none;
  -webkit-tap-highlight-color: transparent;

  transition:
    transform 0.16s ease,
    opacity 0.16s ease;

  &:active {
    transform: scale(0.975);
  }
}

.confirm-popup__secondary {
  color: #536273;
  background: #eef3f7;

  box-shadow:
    inset 0 0 0 1px rgba(64, 93, 122, 0.055),
    inset 0 1px 0 rgba(255, 255, 255, 0.88);
}

.confirm-popup__primary {
  color: #ffffff;
  background: linear-gradient(180deg, #171d25 0%, #111821 100%);

  box-shadow:
    0 8px 16px rgba(17, 26, 38, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.11);

  &.is-danger {
    background: linear-gradient(180deg, #c85a5a 0%, #a93e3e 100%);
    box-shadow:
      0 8px 16px rgba(181, 77, 77, 0.18),
      inset 0 1px 0 rgba(255, 255, 255, 0.14);
  }
}

.confirm-pop-enter-active,
.confirm-pop-leave-active {
  transition:
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.2s ease;
}

.confirm-pop-enter-from,
.confirm-pop-leave-to {
  opacity: 0;
  transform: translateY(-46%) scale(0.96);
}

@keyframes cancelSpin {
  to {
    transform: rotate(360deg);
  }
}
</style>