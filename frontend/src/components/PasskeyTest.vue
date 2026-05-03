<template>
  <div class="sheet-list">
    <div class="form">
      <div class="field">
        <label>Ime</label>
        <input v-model="name" type="text" placeholder="Unesite ime" />
      </div>

      <div class="field">
        <label>Telefon</label>
        <input v-model="phone" type="text" placeholder="Unesite telefon" />
      </div>

      <div class="actions">
        <button class="secondary-btn" @click="register" :disabled="loading">
          Registracija
        </button>

        <button class="primary-btn" @click="login" :disabled="loading">
          Nastavi
        </button>
      </div>

      <p v-if="msg" class="message">{{ msg }}</p>
    </div>

    <div v-if="isLoggedIn && currentUser">
      <p>Ulogovan si kao: {{ currentUser.name }}</p>
      <p>Telefon: {{ currentUser.phone }}</p>

      <button @click="logout">
        Logout
      </button>
    </div>

    <div v-else>
      <p>Nisi ulogovan.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { startRegistration, startAuthentication } from "@simplewebauthn/browser";

type AuthUser = {
  id: number;
  name: string;
  phone: string;
};

const emit = defineEmits<{
  (e: "close"): void;
  (
    e: "auth-change",
    payload: {
      isLoggedIn: boolean;
      user: AuthUser | null;
    }
  ): void;
}>();

const apiBase = "/api";

const name = ref("Milan");
const phone = ref("0601234567");
const loading = ref(false);
const msg = ref<string | null>(null);

const currentUser = ref<AuthUser | null>(null);
const isLoggedIn = ref(false);

function emitAuthChange() {
  emit("auth-change", {
    isLoggedIn: isLoggedIn.value,
    user: currentUser.value,
  });
}

async function register() {
  loading.value = true;
  msg.value = null;

  try {
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

    msg.value = "Uspešno registrovan passkey.";
    await checkAuth();
  } catch (e: any) {
    msg.value = e?.message ?? "Greška pri registraciji.";
  } finally {
    loading.value = false;
  }
}

async function login() {
  loading.value = true;
  msg.value = null;

  try {
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
      throw new Error(await optRes.text());
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

    msg.value = "Uspešno ulogovan.";
    await checkAuth();
  } catch (e: any) {
    msg.value = e?.message ?? "Greška pri prijavi.";
  } finally {
    loading.value = false;
  }
}

async function logout() {
  try {
    await fetch(`${apiBase}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } finally {
    isLoggedIn.value = false;
    currentUser.value = null;
    emitAuthChange();
  }
}

async function checkAuth() {
  try {
    const res = await fetch(`${apiBase}/auth/me`, {
      credentials: "include",
    });

    if (!res.ok) {
      isLoggedIn.value = false;
      currentUser.value = null;
      emitAuthChange();
      return;
    }

    const data = await res.json();

    isLoggedIn.value = !!data.loggedIn;
    currentUser.value = data.user ?? null;

    emitAuthChange();
  } catch {
    isLoggedIn.value = false;
    currentUser.value = null;
    emitAuthChange();
  }
}

</script>