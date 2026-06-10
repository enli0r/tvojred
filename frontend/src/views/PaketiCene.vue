<template>
  <main class="pricing-page">
    <!-- TOPBAR (isti kao na demo stranici) -->
    <header class="topbar">
      <div class="topbar__inner">
        <RouterLink class="topbar__back" to="/">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18 9 12l6-6"/></svg>
          <span>Nazad</span>
        </RouterLink>

        <RouterLink class="topbar__brand" to="/" aria-label="tvojred.rs početna">
          <span class="topbar__brand-icon">tc</span>
          <span class="topbar__brand-text">tvojred<span>.rs</span></span>
        </RouterLink>

        <RouterLink class="btn btn--primary topbar__cta" to="/demo">Pogledaj primere</RouterLink>
      </div>
    </header>

    <!-- INTRO -->
    <section class="pricing-intro">
      <div class="pricing-intro__inner">
        <span class="pricing-eyebrow">Cene</span>

        <h1 class="pricing-intro__title">Transparentne cene.<br/>Bez skrivenih troškova.</h1>

        <p class="pricing-intro__sub">
          Birajte plaćanje odjednom ili na 6 rata. Jednokratno plaćanje znači <strong>50% na početku izrade</strong>, a preostalih <strong>50% kada je sve završeno</strong> i pušteno u rad.
        </p>

        <p class="pricing-note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16v-4M12 8h.01"/><circle cx="12" cy="12" r="9"/></svg>
          <span><strong>Besplatno održavanje 2 meseca</strong> uz svaki paket.</span>
        </p>
      </div>
    </section>

    <!-- CENE -->
    <section class="pricing">
      <div class="pricing__container">
        <div class="pricing__header">
          <div class="pricing__toggle">
            <span :class="{ active: !installments }">Odjednom</span>
            <button class="pricing__toggle-btn" @click="installments = !installments" :class="{ active: installments }" aria-label="Promeni način plaćanja">
              <span class="pricing__toggle-circle"></span>
            </button>
            <span :class="{ active: installments }">Na 6 rata</span>
          </div>
        </div>

        <div class="pricing__cards">
          <div
            class="pricing__card"
            v-for="plan in plans"
            :key="plan.name"
            :class="{ 'pricing__card--popular': plan.popular }"
          >
            <div class="pricing__card-badge" v-if="plan.popular">Najpopularniji</div>
            <div class="pricing__card-icon">{{ plan.icon }}</div>
            <h3 class="pricing__card-name">{{ plan.name }}</h3>
            <p class="pricing__card-desc">{{ plan.desc }}</p>

            <div class="pricing__card-price" v-if="!plan.custom">
              <span class="pricing__card-currency">€</span>
              <span class="pricing__card-amount">{{ installments ? fmt((plan.price ?? 0) / 6) : fmt(plan.price ?? 0) }}</span>
              <span class="pricing__card-period">{{ installments ? '/ mes × 6' : 'jednokratno' }}</span>
            </div>
            <div class="pricing__card-price pricing__card-price--custom" v-else>
              <span class="pricing__card-amount-custom">Custom</span>
              <span class="pricing__card-period-custom">po dogovoru</span>
            </div>

            <RouterLink
              class="btn"
              :class="plan.popular ? 'btn--primary' : 'btn--outline'"
              :to="plan.custom ? '/#kontakt' : '/#demo'"
            >
              {{ plan.cta }}
            </RouterLink>

            <ul class="pricing__card-features">
              <li v-for="feature in plan.features" :key="feature" class="pricing__card-feature">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                {{ feature }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- DOMEN I HOSTING -->
    <section class="addons">
      <div class="addons__inner">
        <div class="addons__head">
          <div class="section-tag">Domen i hosting</div>
          <h2 class="section-title">Pomažemo i oko domena i hostinga</h2>
          <p class="section-sub">Domen i hosting plaćate zasebno provajderu, ali vas kroz ceo proces vodimo mi — biramo, kupujemo i podešavamo zajedno.</p>
        </div>

        <div class="addons__grid">
          <div class="addons__card">
            <div class="addons__icon">🌐</div>
            <h3>Domen</h3>
            <div class="addons__price">~1.500–2.500 <span>RSD / godišnje</span></div>
            <p>Vaša adresa na internetu (npr. vassalon.rs). Pomažemo pri izboru i kupovini.</p>
          </div>
          <div class="addons__card">
            <div class="addons__icon">🖥️</div>
            <h3>Hosting</h3>
            <div class="addons__price">~700–1.800 <span>RSD / mesečno</span></div>
            <p>Prostor na kome „živi" vaš sajt. Predlažemo proverene provajdere i sve podesimo.</p>
          </div>
        </div>

        <p class="addons__note">* Okvirne cene — zavise od provajdera i izabranog plana. Domen i hosting nisu uključeni u cenu paketa.</p>
      </div>
    </section>

    <!-- CTA BAND -->
    <section class="band">
      <div class="band__inner">
        <div>
          <h2>Niste sigurni koji paket vam treba?</h2>
          <p>Javite nam se — predložićemo rešenje po meri vašeg salona.</p>
        </div>
        <RouterLink class="btn btn--primary btn--lg" to="/#kontakt">
          Pošaljite poruku
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

interface Plan {
  icon: string
  name: string
  desc: string
  price: number | null
  custom: boolean
  cta: string
  popular: boolean
  features: string[]
}

const installments = ref(false)

const fmt = (n: number) => {
  const v = Math.round(n * 100) / 100
  return v.toLocaleString('sr-RS', { maximumFractionDigits: 2 })
}

const plans: Plan[] = [
  {
    icon: '🌱',
    name: 'Starter',
    desc: 'Osnovno digitalno prisustvo i online zakazivanje za vaš salon.',
    price: 399,
    custom: false,
    cta: 'Izaberite Starter',
    popular: false,
    features: [
      'Online zakazivanje',
      'Admin panel',
      'Usluge i cene',
      'Pregled termina',
      'Pregled klijenata i usluga',
    ],
  },
  {
    icon: '🚀',
    name: 'Pro',
    desc: 'Kompletno rešenje sa modernim sajtom i naprednim admin panelom.',
    price: 599,
    custom: false,
    cta: 'Izaberite Pro',
    popular: true,
    features: [
      'Online zakazivanje',
      'Moderan websajt',
      'Admin panel',
      'Usluge i cene',
      'Pregled termina',
      'Pregled klijenata i usluga',
      'Konfiguracija admin panela',
    ],
  },
  {
    icon: '👑',
    name: 'Enterprise',
    desc: 'Sve iz Pro paketa, plus online plaćanje i maksimalna vidljivost.',
    price: null,
    custom: true,
    cta: 'Kontaktirajte nas',
    popular: false,
    features: [
      'Online zakazivanje',
      'Moderan websajt',
      'Admin panel',
      'Usluge i cene',
      'Pregled termina',
      'Pregled klijenata i usluga',
      'Konfiguracija admin panela',
      'Bolja vidljivost na Google-u',
      'Online plaćanje',
      'SMS potvrda termina',
    ],
  },
]
</script>

<style scoped lang="scss">
@use 'sass:color';

// ─── TOKENS (isti dizajn-sistem kao početna) ─────────────
$primary:        #2563eb;
$primary-dark:   #1d4ed8;
$primary-light:  #eff6ff;
$accent:         #06b6d4;
$dark:           #0f172a;
$dark-2:         #1e293b;
$dark-3:         #334155;
$mid:            #64748b;
$light:          #f8fafc;
$white:          #ffffff;
$border:         #e2e8f0;

$font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

$radius-sm: 8px;
$radius-md: 12px;
$radius-lg: 20px;

$shadow-sm: 0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.06);
$shadow-md: 0 4px 16px rgba(0,0,0,.10);
$shadow-xl: 0 32px 80px rgba(0,0,0,.18);

$transition: all .25s cubic-bezier(.4,0,.2,1);
$container: 1200px;

* { box-sizing: border-box; }

.pricing-page {
  min-height: 100svh;
  background: $light;
  color: $dark;
  font-family: $font-sans;
  -webkit-font-smoothing: antialiased;
}

// ─── UTILITIES ───────────────────────────────────────────
.section-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: .75rem;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: $primary;
  background: $primary-light;
  border: 1px solid color.adjust($primary-light, $lightness: -6%);
  padding: 6px 14px;
  border-radius: 999px;
  margin-bottom: 20px;
}

.section-title {
  font-size: clamp(1.75rem, 3.5vw, 2.75rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -.02em;
  color: $dark;
  margin: 0 0 16px;
}

.section-sub {
  font-size: 1.05rem;
  color: $mid;
  max-width: 540px;
  line-height: 1.7;
}

// ─── BUTTONS ─────────────────────────────────────────────
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 22px;
  border-radius: $radius-md;
  font-size: .9rem;
  font-weight: 600;
  cursor: pointer;
  border: 2px solid transparent;
  text-decoration: none;
  white-space: nowrap;
  transition: $transition;

  &--primary {
    background: $primary;
    color: $white;
    border-color: $primary;
    box-shadow: 0 4px 14px rgba($primary,.35);
    &:hover { background: $primary-dark; border-color: $primary-dark; transform: translateY(-1px); box-shadow: 0 6px 20px rgba($primary,.45); }
  }

  &--outline {
    background: transparent;
    color: $dark;
    border-color: $border;
    &:hover { border-color: $primary; color: $primary; background: $primary-light; }
  }

  &--lg { padding: 14px 28px; font-size: 1rem; border-radius: $radius-md + 4px; }

  &:focus-visible { outline: 2px solid $accent; outline-offset: 2px; }
}

// ─── TOPBAR ──────────────────────────────────────────────
.topbar {
  background: $light;
  border-bottom: 1px solid $border;

  &__inner {
    max-width: 1160px;
    margin: 0 auto;
    padding: 12px 24px;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 16px;
  }

  &__cta { justify-self: end; padding: 9px 16px; font-size: .85rem; }

  &__back {
    justify-self: start;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px 8px 8px;
    border-radius: $radius-sm;
    color: $dark;
    text-decoration: none;
    font-size: .85rem;
    font-weight: 650;
    transition: $transition;

    &:hover { color: $dark; background: rgba($dark,.05); }
    &:focus-visible { outline: 2px solid $accent; outline-offset: 2px; }
  }

  &__brand {
    justify-self: center;
    display: inline-flex;
    align-items: center;
    gap: 9px;
    font-weight: 800;
    font-size: 1.05rem;
    color: $dark;
    text-decoration: none;

    &-icon {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: $primary;
      color: $white;
      border-radius: $radius-sm;
      font-size: .8rem;
      font-weight: 900;
    }

    &-text span { color: $primary; }
  }
}

// ─── INTRO (isti princip kao demo stranica) ──────────────
.pricing-intro {
  &__inner {
    max-width: $container;
    margin: 0 auto;
    padding: 56px 24px 36px;
  }

  &__title {
    margin: 16px 0 0;
    font-size: clamp(1.9rem, 4vw, 2.9rem);
    font-weight: 900;
    line-height: 1.08;
    letter-spacing: -.03em;
    color: $dark;
  }

  &__sub {
    max-width: 620px;
    margin: 16px 0 0;
    font-size: 1.05rem;
    line-height: 1.65;
    color: $mid;

    strong {
      color: $dark;
      font-weight: 700;
    }
  }
}

.pricing-eyebrow {
  display: inline-block;
  font-size: .72rem;
  font-weight: 800;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: $primary;
}

.pricing-note {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  max-width: 620px;
  margin: 22px 0 0;
  padding: 12px 16px;
  border-radius: $radius-md;
  background: $primary-light;
  border: 1px solid color.adjust($primary-light, $lightness: -6%);
  color: $dark-3;
  font-size: .85rem;
  line-height: 1.5;

  svg {
    color: $primary;
    flex-shrink: 0;
  }

  strong {
    color: $dark;
    font-weight: 700;
  }
}

// ─── PRICING ─────────────────────────────────────────────
.pricing {
  padding: 0 0 72px;

  &__container {
    max-width: $container;
    margin: 0 auto;
    padding: 0 24px;
  }

  &__header {
    margin-bottom: 40px;
  }

  &__toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    font-size: .9rem;
    font-weight: 500;
    color: $mid;

    span { transition: $transition; }
    span.active { color: $dark; font-weight: 700; }
  }

  &__toggle-btn {
    width: 52px;
    height: 28px;
    background: $border;
    border: none;
    border-radius: 999px;
    cursor: pointer;
    position: relative;
    transition: $transition;

    &.active {
      background: $primary;
      .pricing__toggle-circle { transform: translateX(24px); }
    }
  }

  &__toggle-circle {
    position: absolute;
    top: 4px;
    left: 4px;
    width: 20px;
    height: 20px;
    background: $white;
    border-radius: 50%;
    transition: $transition;
    box-shadow: $shadow-sm;
  }

  &__cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    align-items: start;
  }

  &__card {
    background: $white;
    border-radius: $radius-lg;
    padding: 36px;
    border: 2px solid $border;
    transition: $transition;
    position: relative;

    &--popular {
      border-color: $primary;
      background: $dark;
      color: $white;
      transform: scale(1.04);
      box-shadow: $shadow-xl;

      .pricing__card-name { color: $white; }
      .pricing__card-desc { color: rgba($white,.6); }
      .pricing__card-currency,
      .pricing__card-amount { color: $white; }
      .pricing__card-period { color: rgba($white,.5); }

      .pricing__card-feature {
        color: rgba($white,.75);
        svg { stroke: $accent; }
      }
    }
  }

  &__card-badge {
    position: absolute;
    top: -14px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, $primary, $accent);
    color: $white;
    font-size: .75rem;
    font-weight: 700;
    padding: 5px 16px;
    border-radius: 999px;
    white-space: nowrap;
  }

  &__card-icon { font-size: 2rem; margin-bottom: 12px; }

  &__card-name {
    font-size: 1.2rem;
    font-weight: 800;
    color: $dark;
    margin-bottom: 6px;
  }

  &__card-desc {
    font-size: .88rem;
    color: $mid;
    margin-bottom: 24px;
    line-height: 1.6;
  }

  &__card-price {
    display: flex;
    align-items: flex-start;
    gap: 4px;
    margin-bottom: 24px;
    min-height: 52px;

    &--custom {
      flex-direction: column;
      gap: 2px;
      align-items: flex-start;
    }
  }

  &__card-currency {
    font-size: .85rem;
    font-weight: 700;
    color: $mid;
    padding-top: 10px;
  }

  &__card-amount {
    font-size: 2.4rem;
    font-weight: 900;
    letter-spacing: -.04em;
    color: $dark;
  }

  &__card-period {
    font-size: .85rem;
    color: $mid;
    padding-top: 20px;
  }

  &__card-amount-custom {
    font-size: 2.4rem;
    font-weight: 900;
    letter-spacing: -.04em;
    color: $dark;
    line-height: 1.1;
  }

  &__card-period-custom {
    font-size: .85rem;
    color: $mid;
  }

  .btn {
    width: 100%;
    justify-content: center;
    margin-bottom: 28px;
  }

  &__card-features {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__card-feature {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: .88rem;
    color: $dark-3;

    svg { stroke: $primary; flex-shrink: 0; }
  }

  @media (max-width: 900px) {
    &__cards {
      grid-template-columns: 1fr;
      max-width: 440px;
      margin: 0 auto;
    }
    &__card--popular { transform: none; }
  }
}

// ─── DOMEN I HOSTING ─────────────────────────────────────
.addons {
  &__inner {
    max-width: 1000px;
    margin: 0 auto;
    padding: 8px 24px 0;
  }

  &__head {
    text-align: center;
    margin-bottom: 32px;
    .section-sub { margin: 0 auto; }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  &__card {
    background: $white;
    border: 1px solid $border;
    border-radius: $radius-lg;
    padding: 26px;
    box-shadow: $shadow-sm;
    transition: $transition;

    &:hover { border-color: $primary; box-shadow: $shadow-md; transform: translateY(-3px); }

    h3 { margin: 10px 0 0; font-size: 1.1rem; font-weight: 800; color: $dark; }
    p { margin: 12px 0 0; font-size: .88rem; color: $mid; line-height: 1.55; }
  }

  &__icon { font-size: 1.8rem; }

  &__price {
    margin-top: 12px;
    font-size: 1.5rem;
    font-weight: 900;
    letter-spacing: -.02em;
    color: $primary;

    span {
      display: block;
      margin-top: 2px;
      font-size: .76rem;
      font-weight: 600;
      letter-spacing: 0;
      color: $mid;
    }
  }

  &__note {
    max-width: 1000px;
    margin: 18px auto 0;
    font-size: .78rem;
    color: $mid;
    text-align: center;
  }

  @media (max-width: 600px) {
    &__grid { grid-template-columns: 1fr; }
  }
}

// ─── CTA BAND ────────────────────────────────────────────
.band {
  max-width: 1000px;
  margin: 0 auto;
  padding: 48px 24px 72px;

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    flex-wrap: wrap;
    padding: 26px 28px;
    border: 1px solid $border;
    border-radius: $radius-lg;
    background: linear-gradient(120deg, $white 0%, $primary-light 100%);
    box-shadow: $shadow-sm;

    > div { display: flex; flex-direction: column; gap: 4px; }
  }

  h2 {
    margin: 0;
    font-size: 1.3rem;
    font-weight: 800;
    letter-spacing: -.02em;
    color: $dark;
  }

  p { margin: 0; color: $mid; font-size: .92rem; }
}

// ─── RESPONSIVE / A11Y ───────────────────────────────────
@media (max-width: 720px) {
  .topbar__brand { display: none; }
  .topbar__inner { grid-template-columns: 1fr auto; }

  .pricing-intro__inner {
    padding-top: 40px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition: none !important; }
  .addons__card:hover { transform: none; }
}
</style>