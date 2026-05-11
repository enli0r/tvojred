<template>
  <main class="admin-login">
    <section class="admin-login__card">
      <div class="admin-login__logo">
        <span class="admin-login__mark">
          <svg viewBox="0 0 64 64" fill="none">
            <rect x="10" y="10" width="44" height="44" rx="16" />
            <path d="M20 42V23.5L32 35.5L44 23.5V42" />
            <path d="M24 46H40" />
          </svg>
        </span>

        <div>
          <strong>Test Studio</strong>
          <small>Admin panel</small>
        </div>
      </div>

      <header class="admin-login__head">
        <span>Siguran pristup</span>
        <h1>{{ accessDenied ? "Nemaš pristup" : "Prijava za administratore" }}</h1>
        <p>
          {{
            accessDenied
              ? "Ovaj nalog nema dozvolu za upravljanje ovim lokalom."
              : "Unesi podatke i potvrdi passkey-em. Pristup imaju samo ovlašćeni korisnici lokala."
          }}
        </p>
      </header>

      <div v-if="accessDenied" class="admin-login__denied">
        <div class="admin-login__denied-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
          </svg>
        </div>

        <div class="admin-login__denied-copy">
          <span>Odbijen pristup</span>
          <strong>Samo ovlašćeni korisnici mogu da pristupe admin panelu.</strong>
          <p v-if="currentUser">
            Prijavljen si kao {{ currentUser.name }}.
          </p>
        </div>

        <div class="admin-login__denied-actions">
          <button class="admin-login__primary" type="button" @click="logout">
            Odjavi se
          </button>

          <button class="admin-login__secondary" type="button" @click="goHome">
            Nazad na početnu
          </button>
        </div>
      </div>

      <div v-else class="admin-login__auth">
        <PasskeyTest
          :is-logged-in="isLoggedIn"
          :current-user="currentUser"
          :loading="false"
          @auth-change="handleAuthChange"
          @confirm-booking="checkAdminAccess"
          @close="checkAdminAccess"
        />
      </div>

      <p v-if="adminError && !accessDenied" class="admin-login__error">
        {{ adminError }}
      </p>

      <p v-if="checkingAdmin" class="admin-login__checking">
        Proveravam admin pristup...
      </p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import PasskeyTest from "@/components/PasskeyTest.vue";

type AuthUser = {
  id: number;
  name: string;
  phone: string;
};

const route = useRoute();
const router = useRouter();

const isLoggedIn = ref(false);
const currentUser = ref<AuthUser | null>(null);
const adminError = ref<string | null>(null);
const checkingAdmin = ref(false);
const accessDenied = ref(false);

function handleAuthChange(payload: { isLoggedIn: boolean; user: AuthUser | null }) {
  isLoggedIn.value = payload.isLoggedIn;
  currentUser.value = payload.user;
  adminError.value = null;
  accessDenied.value = false;

  if (payload.isLoggedIn && payload.user) {
    checkAdminAccess();
  }
}

async function checkAdminAccess() {
  const tenantSlug = String(route.params.tenantSlug || "");

  if (!tenantSlug) {
    adminError.value = "Nedostaje tenant slug.";
    return;
  }

  adminError.value = null;
  accessDenied.value = false;
  checkingAdmin.value = true;

  try {
    const res = await fetch(`/api/auth/admin/me?tenantSlug=${tenantSlug}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json().catch(() => null);

    if (res.status === 401) {
      isLoggedIn.value = false;
      currentUser.value = null;
      accessDenied.value = false;
      return;
    }

    if (res.status === 403) {
      isLoggedIn.value = true;
      currentUser.value = data?.user || currentUser.value;
      accessDenied.value = true;
      adminError.value = data?.message || "Nemaš pristup admin panelu za ovaj lokal.";
      return;
    }

    if (!res.ok || !data?.isAdmin) {
      adminError.value = data?.message || "Nemaš pristup admin panelu za ovaj lokal.";
      return;
    }

    isLoggedIn.value = true;
    currentUser.value = data.user || currentUser.value;

    router.push({
      name: "Settings",
      params: {
        tenantSlug,
      },
    });
  } catch (err: any) {
    adminError.value = err?.message || "Greška pri proveri admin pristupa.";
  } finally {
    checkingAdmin.value = false;
  }
}

async function logout() {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error(err);
  } finally {
    isLoggedIn.value = false;
    currentUser.value = null;
    adminError.value = null;
    accessDenied.value = false;
  }
}

function goHome() {
  const tenantSlug = String(route.params.tenantSlug || "test-studio");

  router.push({
    name: "Welcome",
    params: {
      tenantSlug,
    },
  });
}

onMounted(async () => {
  await checkAdminAccess();
});
</script>

<style scoped lang="scss">
.admin-login,
.admin-login * {
  box-sizing: border-box;
}

.admin-login {
  min-height: 100dvh;
  padding: 18px;
  display: grid;
  place-items: center;

  background:
    radial-gradient(circle at 50% 0%, rgba(134, 173, 210, 0.18) 0%, transparent 38%),
    linear-gradient(180deg, #f8fafc 0%, #eef3f7 100%);

  font-family: Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif;
}

.admin-login__card {
  width: 100%;
  max-width: 430px;
  padding: 18px;
  border-radius: 32px;

  color: #102438;
  background:
    radial-gradient(circle at 100% 0%, rgba(134, 173, 210, 0.14) 0%, transparent 34%),
    linear-gradient(180deg, #ffffff 0%, #f5f8fb 100%);

  box-shadow:
    0 24px 50px rgba(8, 12, 18, 0.12),
    0 8px 18px rgba(8, 12, 18, 0.07),
    inset 0 1px 0 rgba(255, 255, 255, 0.96),
    inset 0 0 0 1px rgba(64, 93, 122, 0.075);
}

.admin-login__logo {
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

.admin-login__mark {
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
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

.admin-login__head {
  margin-top: 28px;

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
    margin: 8px 0 0;
    color: #102438;
    font-size: 30px;
    line-height: 0.98;
    font-weight: 860;
    letter-spacing: -0.075em;
  }

  p {
    margin: 12px 0 0;
    color: rgba(16, 36, 56, 0.58);
    font-size: 14px;
    line-height: 1.45;
    font-weight: 610;
    letter-spacing: -0.025em;
  }
}

.admin-login__auth {
  margin-top: 20px;
}

.admin-login__denied {
  margin-top: 22px;
  padding: 16px;
  border-radius: 26px;

  background:
    radial-gradient(circle at 100% 0%, rgba(181, 77, 77, 0.08) 0%, transparent 34%),
    linear-gradient(180deg, #ffffff 0%, #fff7f7 100%);

  box-shadow:
    inset 0 0 0 1px rgba(181, 77, 77, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.95),
    0 10px 22px rgba(22, 34, 52, 0.055);
}

.admin-login__denied-icon {
  width: 58px;
  height: 58px;
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
    display: block;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

.admin-login__denied-copy {
  margin-top: 14px;

  span {
    display: block;
    color: #b54d4d;
    font-size: 10px;
    line-height: 1;
    font-weight: 850;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  strong {
    display: block;
    margin-top: 8px;
    color: #102438;
    font-size: 18px;
    line-height: 1.15;
    font-weight: 850;
    letter-spacing: -0.055em;
  }

  p {
    margin: 8px 0 0;
    color: rgba(16, 36, 56, 0.58);
    font-size: 13px;
    line-height: 1.35;
    font-weight: 630;
    letter-spacing: -0.025em;
  }
}

.admin-login__denied-actions {
  margin-top: 16px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.admin-login__primary,
.admin-login__secondary {
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

.admin-login__primary {
  color: #ffffff;
  background: linear-gradient(180deg, #171d25 0%, #111821 100%);

  box-shadow:
    0 8px 16px rgba(17, 26, 38, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.11);
}

.admin-login__secondary {
  color: #536273;
  background: #eef3f7;

  box-shadow:
    inset 0 0 0 1px rgba(64, 93, 122, 0.055),
    inset 0 1px 0 rgba(255, 255, 255, 0.88);
}

.admin-login__error {
  margin: 14px 0 0;
  padding: 12px 14px;
  border-radius: 18px;

  color: #b54d4d;
  background: #fff7f7;

  font-size: 13px;
  line-height: 1.35;
  font-weight: 720;
  letter-spacing: -0.025em;

  box-shadow:
    inset 0 0 0 1px rgba(39, 14, 14, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.admin-login__checking {
  margin: 14px 0 0;
  padding: 12px 14px;
  border-radius: 18px;

  color: #405d7a;
  background: #eef5fb;

  font-size: 13px;
  line-height: 1.35;
  font-weight: 720;
  letter-spacing: -0.025em;
}
</style>