<template>
  <!-- <div class="auth-divider">
      <span></span>
      <p>Podaci za potvrdu</p>
      <span></span>
    </div> -->

  <div class="booking-auth">
    <div v-if="isLoggedIn && currentUser" class="auth-user-card">
      <div class="auth-passkey-icon">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M15.75 6.25a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
            stroke="currentColor"
            stroke-width="1.8"
          />
          <path
            d="M4.75 20.25a7.25 7.25 0 0 1 14.5 0"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
        </svg>
      </div>

      <div class="auth-user-copy">
        <strong>{{ currentUser.name || "Korisnik" }}</strong>
        <p>{{ currentUser.phone || "Telefon nije dodat" }}</p>
      </div>

      <button
        class="logout-pill"
        type="button"
        :disabled="busy || loading"
        @click="showLogoutConfirm = true"
      >
        Logout
      </button>
    </div>

    <div v-else class="auth-form">
      <!-- <div class="auth-passkey-note">
        <div class="auth-passkey-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M12 14.25C15.0376 14.25 17.5 11.7876 17.5 8.75C17.5 5.71243 15.0376 3.25 12 3.25C8.96243 3.25 6.5 5.71243 6.5 8.75C6.5 11.7876 8.96243 14.25 12 14.25Z"
              stroke="currentColor"
              stroke-width="1.8"
            />
            <path
              d="M12 14.25V20.75M12 17.5H15M12 19.75H14"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        <div class="auth-passkey-copy">
          <strong>Brza potvrda preko passkey-a</strong>
          <p>Ime i telefon su potrebni samo za kontakt oko termina.</p>
        </div>
      </div> -->

      <div class="auth-fields">
        <label class="auth-field">
          <label>Ime <span>*</span></label>
          <input
            v-model.trim="name"
            type="text"
            autocomplete="name"
            placeholder="Unesite ime"
            :disabled="busy || loading"
          />
        </label>

        <label class="auth-field">
          <label>Telefon <span>*</span></label>
          <input
            v-model.trim="phone"
            type="tel"
            autocomplete="tel"
            placeholder="Unesite telefon"
            :disabled="busy || loading"
          />
        </label>
      </div>
    </div>

    <p v-if="msg" class="auth-message">
      {{ msg }}
    </p>

    <footer class="confirm-bottom-bar">
      <!-- <button
        class="bottom-ghost-btn"
        type="button"
        :disabled="busy || loading"
        @click="$emit('close')"
      >
        Izmeni
      </button> -->

      <button
        class="bottom-primary-btn"
        type="button"
        :disabled="busy || loading"
        @click="handleConfirm"
      >
        <span>{{ primaryLabel }}</span>
      </button>

      <div class="finger-face-id">
        <div class="images">
          <img src="../assets/img/face-id2.png" alt="">
          <!-- <br> -->
           <p class="divider">/</p>
          <img src="../assets/img/fingerprint2.png" alt="">
        </div>
        
        <p>Potvrda ide preko biometrije ili passkey-a</p>
      </div>
      
    </footer>

    <Transition name="mini-pop">
      <div
        v-if="showLogoutConfirm"
        class="logout-confirm"
        @click.self="showLogoutConfirm = false"
      >
        <div class="logout-confirm__card">
          <div class="logout-confirm__icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M15.75 9V5.75C15.75 4.92157 15.0784 4.25 14.25 4.25H6.75C5.92157 4.25 5.25 4.92157 5.25 5.75V18.25C5.25 19.0784 5.92157 19.75 6.75 19.75H14.25C15.0784 19.75 15.75 19.0784 15.75 18.25V15"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
              <path
                d="M12.25 12H20.25M20.25 12L17.25 9M20.25 12L17.25 15"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>

          <span>Odjava</span>
          <strong>Želiš da se odjaviš?</strong>
          <p>Moraćeš ponovo da potvrdiš passkey za sledeći termin.</p>

          <div class="logout-confirm__actions">
            <button
              type="button"
              class="logout-confirm__cancel"
              :disabled="busy || loading"
              @click="showLogoutConfirm = false"
            >
              Ne
            </button>

            <button
              type="button"
              class="logout-confirm__danger"
              :disabled="busy || loading"
              @click="logout"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { startRegistration, startAuthentication } from "@simplewebauthn/browser";

type AuthUser = {
  id: number;
  name: string;
  phone: string;
};

const props = defineProps<{
  isLoggedIn: boolean;
  currentUser: AuthUser | null;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (
    e: "auth-change",
    payload: {
      isLoggedIn: boolean;
      user: AuthUser | null;
    }
  ): void;
  (e: "confirm-booking"): void;
}>();

const apiBase = "/api";

const name = ref("");
const phone = ref("");
const busy = ref(false);
const msg = ref<string | null>(null);
const showLogoutConfirm = ref(false);

const primaryLabel = computed(() => {
  if (props.loading || busy.value) return "Potvrđujem...";
  return "Potvrdi";
});

watch(
  () => props.currentUser,
  (user) => {
    if (!user) return;

    name.value = user.name || "";
    phone.value = user.phone || "";
  },
  { immediate: true }
);

function validateForm() {
  if (props.isLoggedIn && props.currentUser) return true;

  if (!name.value.trim()) {
    msg.value = "Unesi ime.";
    return false;
  }

  if (!phone.value.trim()) {
    msg.value = "Unesi telefon.";
    return false;
  }

  return true;
}

async function handleConfirm() {
  if (busy.value || props.loading) return;

  msg.value = null;

  if (!validateForm()) return;

  if (props.isLoggedIn && props.currentUser) {
    emit("confirm-booking");
    return;
  }

  busy.value = true;

  try {
    const loggedIn = await tryLogin();

    if (!loggedIn) {
      await register();
    }

    emit("confirm-booking");
  } catch (e: any) {
    msg.value = e?.message || "Potvrda nije uspela. Pokušaj ponovo.";
  } finally {
    busy.value = false;
  }
}

async function tryLogin() {
  const optRes = await fetch(`${apiBase}/auth/login/options`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      phone: phone.value,
    }),
  });

  if (!optRes.ok) {
    return false;
  }

  const options = await optRes.json();

  const asseResp = await startAuthentication({
    optionsJSON: options,
  });

  const verRes = await fetch(`${apiBase}/auth/login/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(asseResp),
  });

  if (!verRes.ok) {
    throw new Error(await verRes.text());
  }

  await checkAuth();

  return true;
}

async function register() {
  const optRes = await fetch(`${apiBase}/auth/register/options`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      name: name.value,
      phone: phone.value,
    }),
  });

  if (!optRes.ok) {
    throw new Error(await optRes.text());
  }

  const options = await optRes.json();

  const attResp = await startRegistration({
    optionsJSON: options,
  });

  const verRes = await fetch(`${apiBase}/auth/register/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(attResp),
  });

  if (!verRes.ok) {
    throw new Error(await verRes.text());
  }

  await checkAuth();
}

async function logout() {
  if (busy.value || props.loading) return;

  busy.value = true;
  msg.value = null;

  try {
    await fetch(`${apiBase}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    name.value = "";
    phone.value = "";
    showLogoutConfirm.value = false;

    emit("auth-change", {
      isLoggedIn: false,
      user: null,
    });
  } catch (e: any) {
    msg.value = e?.message || "Logout nije uspeo.";
  } finally {
    busy.value = false;
  }
}

async function checkAuth() {
  const res = await fetch(`${apiBase}/auth/me`, {
    credentials: "include",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.loggedIn || !data?.user) {
    emit("auth-change", {
      isLoggedIn: false,
      user: null,
    });

    return;
  }

  emit("auth-change", {
    isLoggedIn: true,
    user: data.user,
  });
}
</script>
