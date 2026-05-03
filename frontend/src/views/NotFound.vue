# `NotFound.vue`

```vue
<template>
  <div class="nf-page">
    <div class="nf-glow nf-glow--one"></div>
    <div class="nf-glow nf-glow--two"></div>

    <div class="nf-card">
      <span class="nf-kicker">404</span>
      <h1>Salon nije pronađen</h1>
      <p>
        Link koji ste otvorili ne vodi ka aktivnom salonu ili je adresa pogrešna.
      </p>

      <div class="nf-actions">
        <button class="nf-btn nf-btn--primary" @click="goHome">
          Nazad na početnu
        </button>
      </div>

      <div class="nf-meta">
        <span>Proverite adresu salona</span>
        <span>npr. /daca-frizer</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function goHome() {
  router.push('/daca-frizer');
}
</script>

<style scoped lang="scss">
.nf-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    radial-gradient(circle at top right, rgba(64,93,122,.18), transparent 45%),
    linear-gradient(180deg,#f7f9fc 0%, #eef3f8 100%);
  position: relative;
  overflow: hidden;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
}

.nf-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: .55;
}

.nf-glow--one {
  width: 260px;
  height: 260px;
  background: rgba(64,93,122,.18);
  top: -60px;
  right: -40px;
}

.nf-glow--two {
  width: 220px;
  height: 220px;
  background: rgba(47,70,95,.12);
  bottom: -40px;
  left: -30px;
}

.nf-card {
  width: min(100%, 460px);
  background: rgba(255,255,255,.82);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(90,110,135,.12);
  border-radius: 34px;
  padding: 34px 28px 26px;
  box-shadow:
    0 18px 50px rgba(28,40,60,.08),
    inset 0 1px 0 rgba(255,255,255,.75);
  text-align: center;
}

.nf-kicker {
  display: inline-flex;
  padding: 8px 14px;
  border-radius: 999px;
  background: linear-gradient(180deg,#405d7a,#2f465f);
  color: white;
  font-weight: 700;
  letter-spacing: .08em;
  font-size: .82rem;
}

h1 {
  margin: 18px 0 10px;
  font-size: clamp(2rem,7vw,2.7rem);
  line-height: 1.05;
  color: #152230;
}

p {
  margin: 0;
  color: #556579;
  line-height: 1.6;
  font-size: 1rem;
}

.nf-actions {
  margin-top: 26px;
}

.nf-btn {
  width: 100%;
  border: 0;
  border-radius: 18px;
  padding: 15px 18px;
  font-weight: 700;
  cursor: pointer;
  transition: transform .22s ease, box-shadow .22s ease;
}

.nf-btn:hover {
  transform: translateY(-1px);
}

.nf-btn--primary {
  color: #fff;
  background: linear-gradient(180deg,#405d7a,#2f465f);
  box-shadow: 0 10px 24px rgba(47,70,95,.22);
}

.nf-meta {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #708095;
  font-size: .92rem;
}
</style>
```
