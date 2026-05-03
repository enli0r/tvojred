<template>
  <main class="admin-login">
    <section class="admin-login__shell">
      <div class="admin-login__brand">
        <div class="admin-login__name">
          <span>DACA</span>
          <small>BARBER STUDIO</small>
        </div>
      </div>

      <form class="admin-login__card" @submit.prevent="login">
        <div class="admin-login__card-head">
          <span>Admin pristup</span>
          <h1>Prijava</h1>
          <p>Unesite podatke za upravljanje terminima i podešavanjima lokala.</p>
        </div>

        <div class="admin-login__inputs">
          <label class="admin-login__field">
            <span class="admin-login__field-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25" />
              </svg>
            </span>

            <input
              v-model="email"
              type="email"
              placeholder="E-mail adresa"
              autocomplete="email"
            />
          </label>

          <label class="admin-login__field">
            <span class="admin-login__field-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </span>

            <input
              v-model="password"
              type="password"
              placeholder="Lozinka"
              autocomplete="current-password"
            />
          </label>
        </div>

        <div class="admin-login__options">
          <label class="admin-login__remember">
            <input v-model="rememberMe" type="checkbox" />
            <span class="admin-login__check"></span>
            <span>Zapamti me</span>
          </label>

          <button class="admin-login__forgot" type="button">
            Zaboravljena lozinka?
          </button>
        </div>

        <button class="admin-login__submit" type="submit">
          <span class="admin-login__submit-text">
            <strong>Prijavi se</strong>
            <small>Otvori admin panel</small>
          </span>

          <span class="admin-login__submit-arrow">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </button>
      </form>

      <article class="admin-login__info">
        <span class="admin-login__info-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          </svg>
        </span>

        <div>
          <strong>Bezbedan pristup</strong>
          <small>Samo ovlašćeni korisnici mogu pristupiti admin panelu.</small>
        </div>
      </article>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref("");
const password = ref("");
const rememberMe = ref(false);

function login() {
  router.push("/admin/settings");
}
</script>

<style scoped lang="scss">
.admin-login {
  min-height: 100vh;
  color: #102438;
  overflow-x: hidden;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif;
  background:
    radial-gradient(320px 220px at 82% 4%, rgba(80, 108, 140, 0.12), transparent 70%),
    radial-gradient(280px 180px at 12% 92%, rgba(77, 134, 232, 0.06), transparent 70%),
    rgb(251, 252, 254);
}

.admin-login,
.admin-login * {
  box-sizing: border-box;
}

.admin-login svg {
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.admin-login__shell {
  width: 100%;
  max-width: 520px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 34px 16px 28px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.admin-login__brand {
  margin-bottom: 26px;
}

.admin-login__name {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.admin-login__name span {
  color: #102438;
  font-size: 27px;
  line-height: 1;
  font-weight: 400;
  letter-spacing: 0.18em;
}

.admin-login__name small {
  color: rgba(16, 36, 56, 0.62);
  font-size: 12px;
  line-height: 1;
  font-weight: 800;
  letter-spacing: 0.22em;
}

.admin-login__card {
  width: 100%;
  padding: 18px;
  border-radius: 30px;
  background: linear-gradient(145deg, #111a26 0%, #182638 48%, #0d141f 100%);
  box-shadow:
    0 16px 28px rgba(5, 8, 12, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.105),
    inset 0 -1px 0 rgba(0, 0, 0, 0.22),
    inset 0 0 0 1px rgba(255, 255, 255, 0.055);
}

.admin-login__card-head {
  padding: 6px 4px 20px;
}

.admin-login__card-head span {
  display: block;
  margin-bottom: 11px;
  color: rgba(203, 221, 239, 0.62);
  font-size: 12px;
  font-weight: 850;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.admin-login__card-head h1 {
  margin: 0;
  color: #ffffff;
  font-size: 30px;
  line-height: 1.02;
  font-weight: 950;
  letter-spacing: -0.06em;
}

.admin-login__card-head p {
  max-width: 330px;
  margin: 8px 0 0;
  color: rgba(255, 255, 255, 0.58);
  font-size: 14px;
  line-height: 1.35;
  font-weight: 650;
}

.admin-login__inputs {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.admin-login__field {
  min-height: 66px;
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  padding: 9px 14px;
  border-radius: 22px;
  background: #f2f5f9;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    0 1px 0 rgba(255, 255, 255, 0.05);
  transition:
    transform 0.14s ease,
    box-shadow 0.14s ease;
}

.admin-login__field:focus-within {
  transform: translateY(-1px);
  box-shadow:
    0 0 0 3px rgba(80, 108, 140, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.96);
}

.admin-login__field-icon {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  color: #506c8c;
  border-radius: 16px;
  background: #ffffff;
}

.admin-login__field-icon svg {
  width: 22px;
  height: 22px;
}

.admin-login__field input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #102438;
  font-size: 16px;
  line-height: 1;
  font-weight: 760;
  letter-spacing: -0.03em;
}

.admin-login__field input::placeholder {
  color: rgba(42, 58, 78, 0.46);
  font-weight: 650;
}

.admin-login__options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
  padding: 0 4px;
}

.admin-login__remember {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.admin-login__remember input {
  display: none;
}

.admin-login__remember span:last-child {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 750;
  letter-spacing: -0.03em;
}

.admin-login__check {
  width: 22px;
  height: 22px;
  flex: 0 0 auto;
  position: relative;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.admin-login__remember input:checked + .admin-login__check {
  background: linear-gradient(180deg, #6f87a3 0%, #506c8c 100%);
  box-shadow:
    0 0 0 3px rgba(80, 108, 140, 0.26),
    inset 0 1px 0 rgba(255, 255, 255, 0.22);
}

.admin-login__remember input:checked + .admin-login__check::after {
  content: "";
  position: absolute;
  left: 7px;
  top: 3px;
  width: 5px;
  height: 10px;
  border: solid #ffffff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.admin-login__forgot {
  flex: 0 0 auto;
  padding: 0;
  border: 0;
  background: transparent;
  color: rgba(255, 255, 255, 0.48);
  font: inherit;
  font-size: 13px;
  line-height: 1;
  font-weight: 750;
  letter-spacing: -0.03em;
  cursor: pointer;
}

.admin-login__submit {
  width: 100%;
  min-height: 74px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 48px;
  align-items: center;
  gap: 12px;
  margin-top: 22px;
  padding: 14px 14px 14px 20px;
  border: 0;
  border-radius: 24px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbfd 100%);
  box-shadow:
    0 12px 20px rgba(5, 8, 12, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.96);
  cursor: pointer;
  transition: transform 0.14s ease;
  -webkit-tap-highlight-color: transparent;
}

.admin-login__submit:active {
  transform: scale(0.975);
}

.admin-login__submit-text {
  min-width: 0;
  text-align: left;
}

.admin-login__submit-text strong {
  display: block;
  color: #102438;
  font-size: 18px;
  line-height: 1.08;
  font-weight: 900;
  letter-spacing: -0.04em;
}

.admin-login__submit-text small {
  display: block;
  margin-top: 5px;
  color: rgba(42, 58, 78, 0.6);
  font-size: 13px;
  line-height: 1.25;
  font-weight: 650;
}

.admin-login__submit-arrow {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: #ffffff;
  background: linear-gradient(180deg, #6f87a3 0%, #506c8c 100%);
}

.admin-login__submit-arrow svg {
  width: 22px;
  height: 22px;
}

.admin-login__info {
  margin-top: 18px;
  padding: 16px;
  border-radius: 24px;
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.88));
  border: 1px solid rgba(255, 255, 255, 0.92);
  box-shadow:
    0 20px 40px rgba(38, 55, 78, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.96);
}

.admin-login__info-icon {
  width: 50px;
  height: 50px;
  display: grid;
  place-items: center;
  color: #4d86e8;
  border-radius: 50%;
  background: #f2f5f9;
}

.admin-login__info-icon svg {
  width: 24px;
  height: 24px;
}

.admin-login__info strong {
  display: block;
  color: #102438;
  font-size: 16px;
  line-height: 1.12;
  font-weight: 900;
  letter-spacing: -0.05em;
}

.admin-login__info small {
  display: block;
  margin-top: 5px;
  color: rgba(42, 58, 78, 0.58);
  font-size: 13px;
  line-height: 1.28;
  font-weight: 650;
}
</style>
