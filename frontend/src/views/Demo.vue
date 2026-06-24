<template>
  <main class="demo-page">
    <!-- TOPBAR -->
    <header class="demo-topbar">
      <div class="demo-topbar__inner">
        <RouterLink class="demo-back" to="/">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18 9 12l6-6"/></svg>
          <span>Nazad</span>
        </RouterLink>

        <RouterLink class="demo-brand" to="/" aria-label="tvojred.rs početna">
          <span class="demo-brand__icon">tc</span>
          <span class="demo-brand__text">tvojred<span>.rs</span></span>
        </RouterLink>

        <RouterLink class="btn btn--primary demo-topbar__cta" :to="{ path: '/', hash: '#kontakt-cta' }">Hoću svoj salon online</RouterLink>
      </div>
    </header>

    <!-- INTRO -->
    <section class="demo-intro">
      <div class="demo-intro__inner">
        <span class="demo-eyebrow">Primeri uživo</span>
        <h1 class="demo-intro__title">Pogledaj salon na delu.</h1>
        <p class="demo-intro__sub">
          Pravi, klikabilni primeri sajtova i sistema za zakazivanje — za barber, beauty i nail salone. Otvori bilo koji i prošetaj se kroz njega kao tvoj klijent.
        </p>

        <p class="demo-note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16v-4M12 8h.01"/><circle cx="12" cy="12" r="9"/></svg>
          Svaki primer je polazna tačka — dizajn, usluge i način rada prilagođavamo tvom salonu.
        </p>
      </div>
    </section>

    <!-- STICKY FILTER BAR -->
    <div class="demo-filterbar">
      <div class="demo-filterbar__inner">
        <div class="demo-filters" role="tablist" aria-label="Filter primera">
          <button
            v-for="filter in filters"
            :key="filter.value"
            class="demo-filters__pill"
            :class="{ 'demo-filters__pill--active': activeFilter === filter.value }"
            type="button"
            role="tab"
            :aria-selected="activeFilter === filter.value"
            @click="selectFilter(filter.value)"
          >
            {{ filter.label }}
            <span class="demo-filters__count">{{ countFor(filter.value) }}</span>
          </button>
        </div>

        <span class="demo-result-count">{{ filteredDesigns.length }} {{ pluralPrimer(filteredDesigns.length) }}</span>
      </div>
    </div>

    <!-- GALLERY -->
    <section class="demo-gallery">
      <div class="demo-gallery__inner">
        <div v-if="filteredDesigns.length" class="demo-grid">
          <RouterLink
            v-for="(item, index) in filteredDesigns"
            :key="item.id"
            class="demo-card"
            :class="`demo-card--${item.category}`"
            :to="item.url"
            :style="{ '--i': index }"
          >
            <div class="demo-card__stage">
              <span class="demo-card__chip">{{ item.type }}</span>
              <span class="demo-card__live"><i></i> uživo</span>
              <img :src="item.image" :alt="`${item.title} — ${item.type}`" loading="lazy" />
            </div>

            <div class="demo-card__body">
              <span class="demo-card__vertical">{{ item.vertical }}</span>
              <h3 class="demo-card__title">{{ item.title }}</h3>
              <p class="demo-card__desc">{{ item.text }}</p>
              <span class="demo-card__cta">
                Pogledaj primer
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </div>
          </RouterLink>
        </div>

        <div v-else class="demo-empty">
          <div class="demo-empty__icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <p>Trenutno nema primera u ovoj kategoriji.</p>
          <button class="btn btn--outline" type="button" @click="selectFilter('all')">Prikaži sve primere</button>
        </div>
      </div>
    </section>

    <!-- CTA BAND -->
    <section class="demo-band">
      <div class="demo-band__inner">
        <div>
          <h2>Dopada ti se neki od primera?</h2>
          <p>Krenimo od njega — dizajn i funkcije podešavamo tvom salonu.</p>
        </div>
        <RouterLink class="btn btn--primary btn--lg btn-fullwidth" :to="{ path: '/', hash: '#kontakt-cta' }">
          Hoću svoj salon online
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </RouterLink>
      </div>
    </section>

    <!-- STICKY MOBILE CTA -->
    <RouterLink
      class="demo-sticky"
      :class="{ 'demo-sticky--hidden': !showStickyCta }"
      :to="{ path: '/', hash: '#kontakt-cta' }"
      aria-label="Hoću svoj salon online"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <span>Hoću svoj salon online</span>
    </RouterLink>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

import testHomepage from '@/assets/img/mockup-test-studio.png'
import testZakazi from '@/assets/img/mockup-test-studio-zakazivanje.png'
import modernHomepage from '@/assets/img/mockup-modern-life.png'
import modernZakazi from '@/assets/img/mockup-modern-life-zakazivanje.png'
import nailWelcome from '@/assets/img/mockup-nail.png'
import nailZakazi from '@/assets/img/mockup-nail-zakazivanje.png'
import adminPanel from '@/assets/img/mockup-admin-panel.png'
import barberBookingSlajder from '@/assets/img/barber-booking2-mockup.png'
import barberBookingMinimalistic from '@/assets/img/barber-booking1-mockup.png'
import BarberBooking from '@/assets/img/barber-booking3-mockup.png'
import Beauty from '@/assets/img/mockup-beauty.png'



type FilterValue = 'all' | 'booking' | 'website' | 'admin'

const activeFilter = ref<FilterValue>('all')

const filters: Array<{ label: string; value: FilterValue }> = [
  { label: 'Sve', value: 'all' },
  { label: 'Zakazivanje', value: 'booking' },
  { label: 'Web sajtovi', value: 'website' },
  { label: 'Admin panel', value: 'admin' },
]

const designs = [
  {
    id: 1,
    category: 'booking',
    vertical: 'Barbershop',
    type: 'Online zakazivanje',
    title: 'Barber zakazivanje 01',
    text: 'Minimalistički primer zakazivanja za muški salon — usluga, barber, datum i slobodan termin.',
    image: BarberBooking,
    url: '/barber-booking3',
  },
  {
    id: 2,
    category: 'booking',
    vertical: 'Barbershop',
    type: 'Online zakazivanje',
    title: 'Barber zakazivanje 02',
    text: 'Primer toka u kom klijent bira uslugu, frizera, datum i termin bez poziva i dopisivanja.',
    image: testZakazi,
    url: '/test-studio/zakazivanje',
  },
  {
    id: 3,
    category: 'website',
    vertical: 'Barbershop',
    type: 'Web sajt',
    title: 'Barber web sajt 01',
    text: 'Primer početne strane koja predstavlja usluge, atmosferu salona i vodi klijenta ka zakazivanju.',
    image: testHomepage,
    url: '/test-studio',
  },
  {
    id: 4,
    category: 'website',
    vertical: 'Beauty',
    type: 'Web sajt',
    title: 'Beauty web sajt 01',
    text: 'Moderan beauty salon, na visokom nivou. Sekcije su premium sa puno slika, dizajnerski orjentisano.',
    image: Beauty,
    url: '/beauty-salon',
  },
  {
    id: 5,
    category: 'booking',
    vertical: 'Barbershop',
    type: 'Online zakazivanje',
    title: 'Barber zakazivanje 03',
    text: 'Moderan primer stranice za zakazivanje, prilagođen salonima koji žele čist i ozbiljan izgled.',
    image: barberBookingMinimalistic,
    url: '/barber-booking2',
  },

  {
    id: 6,
    category: 'booking',
    vertical: 'Barbershop',
    type: 'Online zakazivanje',
    title: 'Barber zakazivanje 04',
    text: 'Primer zakazivanja sa jačim vizuelnim akcentom, preglednim izborom usluge i slobodnih termina.',
    image: barberBookingSlajder,
    url: '/barber-booking',
  },
  {
    id: 7,
    category: 'booking',
    vertical: 'Hair & beauty',
    type: 'Online zakazivanje',
    title: 'Beauty zakazivanje 01',
    text: 'Primer brzog zakazivanja za beauty salon — usluga, osoba, datum i termin u nekoliko dodira.',
    image: modernZakazi,
    url: '/modern-life/zakazivanje',
  },
  {
    id: 8,
    category: 'website',
    vertical: 'Hair & beauty',
    type: 'Web sajt',
    title: 'Beauty web sajt 02',
    text: 'Svetao koncept sajta sa uslugama, timom, galerijom radova i jasnim pozivom na zakazivanje.',
    image: modernHomepage,
    url: '/modern-life',
  },
  {
    id: 9,
    category: 'booking',
    vertical: 'Nail studio',
    type: 'Online zakazivanje',
    title: 'Nail zakazivanje 01',
    text: 'Primer zakazivanja za nail studio sa jasnim izborom usluge, termina i nail artist-a.',
    image: nailZakazi,
    url: '/nail-studio/zakazivanje',
  },
  {
    id: 10,
    category: 'website',
    vertical: 'Nail studio',
    type: 'Web sajt',
    title: 'Nail web sajt 01',
    text: 'Elegantan koncept sajta sa radovima, cenovnikom i dugmetom koje vodi ka zakazivanju.',
    image: nailWelcome,
    url: '/nail-studio',
  },
  {
    id: 11,
    category: 'admin',
    vertical: 'Upravljanje',
    type: 'Admin panel',
    title: 'Admin panel 01',
    text: 'Primer pregleda termina, zaposlenih, usluga, cena i klijenata na jednom mestu.',
    image: adminPanel,
    url: '/admin-panel',
  },
] as const

const filteredDesigns = computed(() =>
  activeFilter.value === 'all'
    ? designs
    : designs.filter((item) => item.category === activeFilter.value),
)

function countFor(value: FilterValue) {
  return value === 'all' ? designs.length : designs.filter((d) => d.category === value).length
}

function pluralPrimer(n: number) {
  return n === 1 ? 'primer' : 'primera'
}

function selectFilter(value: FilterValue) {
  activeFilter.value = value
}

// ── Sticky mobilni CTA: pojavi se posle malo skrola, sakrij iznad CTA trake ──
const showStickyCta = ref(false)

function handleStickyScroll() {
  const y = window.scrollY
  const nearBottom = y + window.innerHeight > document.documentElement.scrollHeight - 640
  showStickyCta.value = y > 480 && !nearBottom
}

onMounted(() => {
  handleStickyScroll()
  window.addEventListener('scroll', handleStickyScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleStickyScroll)
})
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

$shadow-sm: 0 1px 3px rgba(0,0,0,.07), 0 1px 2px rgba(0,0,0,.05);
$shadow-md: 0 8px 24px rgba(15,23,42,.08);
$shadow-lg: 0 20px 48px rgba(15,23,42,.14);

$transition: all .25s cubic-bezier(.4,0,.2,1);
$container: 1160px;

* { box-sizing: border-box; }

.demo-page {
  min-height: 100svh;
  background: $light;
  color: $dark;
  font-family: $font-sans;
  -webkit-font-smoothing: antialiased;
}

// ─── BUTTONS (lokalno) ───────────────────────────────────
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 20px;
  border-radius: $radius-md;
  font-size: .9rem;
  font-weight: 600;
  cursor: pointer;
  border: 1.5px solid transparent;
  text-decoration: none;
  white-space: nowrap;
  transition: $transition;

  &--primary {
    background: $primary;
    color: $white;
    border-color: $primary;
    box-shadow: 0 4px 14px rgba($primary,.32);
    &:hover { background: $primary-dark; border-color: $primary-dark; transform: translateY(-1px); box-shadow: 0 6px 20px rgba($primary,.42); }
  }

  &--outline {
    background: $white;
    color: $dark;
    border-color: $border;
    &:hover { border-color: $primary; color: $primary; background: $primary-light; }
  }

  &--lg { padding: 14px 26px; font-size: 1rem; }

  &:focus-visible { outline: 2px solid $accent; outline-offset: 2px; }
}

// ─── TOPBAR ──────────────────────────────────────────────
.demo-topbar {
  background: $light;
  border-bottom: 1px solid $border;

  &__inner {
    max-width: $container;
    margin: 0 auto;
    padding: 12px 24px;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 16px;
  }

  &__cta { justify-self: end; padding: 9px 16px; font-size: .85rem; }
}

.demo-back {
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

.demo-brand {
  justify-self: center;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-weight: 800;
  font-size: 1.05rem;
  color: $dark;
  text-decoration: none;

  &__icon {
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

  &__text span { color: $primary; }
}

// ─── INTRO ───────────────────────────────────────────────
.demo-intro {
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
  }
}

.demo-eyebrow {
  display: inline-block;
  font-size: .72rem;
  font-weight: 800;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: $primary;
}

.demo-note {
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

  svg { color: $primary; flex-shrink: 0; }
}

// ─── STICKY FILTER BAR ───────────────────────────────────
.demo-filterbar {
  position: sticky;
  top: 0;
  z-index: 30;
  background: rgba($light,.88);
  backdrop-filter: blur(14px);
  border-top: 1px solid $border;
  border-bottom: 1px solid $border;

  &__inner {
    max-width: $container;
    margin: 0 auto;
    padding: 12px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
}

.demo-filters {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar { display: none; }

  &__pill {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 14px;
    border-radius: 999px;
    border: 1px solid $border;
    background: $white;
    color: $dark-3;
    font-size: .85rem;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
    transition: $transition;

    &:hover:not(.demo-filters__pill--active) { border-color: $primary; color: $primary; }

    &--active {
      background: $primary;
      border-color: $primary;
      color: $white;
      box-shadow: 0 4px 12px rgba($primary,.3);

      .demo-filters__count { background: rgba($white,.22); color: $white; }
    }

    &:focus-visible { outline: 2px solid $accent; outline-offset: 2px; }
  }

  &__count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 999px;
    background: $light;
    color: $mid;
    font-size: .68rem;
    font-weight: 700;
  }
}

.demo-result-count {
  flex-shrink: 0;
  font-size: .8rem;
  font-weight: 600;
  color: $mid;
}

// ─── GALLERY ─────────────────────────────────────────────
.demo-gallery__inner {
  max-width: $container;
  margin: 0 auto;
  padding: 36px 24px 56px;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 22px;
}

.demo-card {
  display: flex;
  flex-direction: column;
  background: $white;
  border: 1px solid $border;
  border-radius: $radius-lg;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  box-shadow: $shadow-sm;
  transition: transform .28s cubic-bezier(.4,0,.2,1), box-shadow .28s ease, border-color .28s ease;
  animation: card-in .42s cubic-bezier(.4,0,.2,1) both;
  animation-delay: calc(var(--i, 0) * 45ms);

  &:hover {
    transform: translateY(-6px);
    box-shadow: $shadow-lg;
    border-color: rgba($primary,.4);

    .demo-card__stage img { transform: translateY(-6px) scale(1.025); }
    .demo-card__cta svg { transform: translateX(4px); }
  }

  &:focus-visible { outline: 2px solid $accent; outline-offset: 3px; }

  // ── Stage (mockup na beloj podlozi, ceo vidljiv) ──
  &__stage {
    position: relative;
    height: 264px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 46px 16px 16px;
    overflow: hidden;
    background: $white;

    img {
      position: relative;
      z-index: 1;
      width: auto;
      height: auto;
      max-width: 78%;
      max-height: 100%;
      object-fit: contain;
      filter:
        drop-shadow(0 12px 22px rgba(15,23,42,.16))
        drop-shadow(0 3px 6px rgba(15,23,42,.08));
      transition: transform .35s cubic-bezier(.4,0,.2,1);
    }
  }

  &__chip {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 2;
    padding: 5px 11px;
    border-radius: 999px;
    background: $white;
    border: 1px solid $border;
    box-shadow: $shadow-sm;
    color: $primary;
    font-size: .64rem;
    font-weight: 800;
    letter-spacing: .08em;
    text-transform: uppercase;
  }

  &--website .demo-card__chip { color: #0e7490; }
  &--admin .demo-card__chip { color: $dark-3; }

  &__live {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 9px;
    border-radius: 999px;
    background: rgba($dark,.72);
    backdrop-filter: blur(6px);
    color: $white;
    font-size: .62rem;
    font-weight: 700;
    letter-spacing: .04em;

    i {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #4ade80;
      box-shadow: 0 0 0 3px rgba(#4ade80,.3);
    }
  }

  &__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 18px 20px 20px;
  }

  &__vertical {
    font-size: .68rem;
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: $mid;
  }

  &__title {
    margin: 5px 0 0;
    font-size: 1.15rem;
    font-weight: 800;
    letter-spacing: -.02em;
    color: $dark;
  }

  &__desc {
    margin: 7px 0 0;
    font-size: .87rem;
    line-height: 1.55;
    color: $mid;
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    margin-top: 16px;
    color: $primary;
    font-size: .86rem;
    font-weight: 700;

    svg { transition: transform .25s ease; }
  }
}

@keyframes card-in {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}

// ─── EMPTY STATE ─────────────────────────────────────────
.demo-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  padding: 64px 24px;
  border: 1px dashed $border;
  border-radius: $radius-lg;
  background: $white;

  &__icon {
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: $primary-light;
    color: $primary;
  }

  p { margin: 0; color: $mid; font-size: .95rem; }
}

// ─── CTA BAND ────────────────────────────────────────────
.demo-band {
  max-width: $container;
  margin: 0 auto;
  padding: 0 24px 64px;

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

// ─── STICKY MOBILE CTA ───────────────────────────────────
.demo-sticky {
  position: fixed;
  z-index: 40;
  right: 16px;
  bottom: 16px;
  display: none;
  align-items: center;
  gap: 8px;
  padding: 13px 18px;
  border-radius: 999px;
  background: $primary;
  color: $white;
  font-size: .92rem;
  font-weight: 700;
  text-decoration: none;
  border: 1px solid rgba($white,.16);
  box-shadow: 0 10px 26px rgba($primary,.42), 0 4px 12px rgba(15,23,42,.18);
  transition: transform .3s cubic-bezier(.4,0,.2,1), opacity .3s ease;

  svg { flex-shrink: 0; }

  &--hidden {
    opacity: 0;
    transform: translateY(140%);
    pointer-events: none;
  }

  @media (max-width: 900px) {
    display: inline-flex;
  }
}

.btn-fullwidth{
  width: 100% !important;
  // text-align: center !important;
  justify-content: center !important;
}

// ─── RESPONSIVE ──────────────────────────────────────────
@media (max-width: 720px) {
  .demo-brand__text { display: none; }
  .demo-topbar__inner { grid-template-columns: 1fr auto; }
  .demo-brand { display: none; }
  .demo-result-count { display: none; }
  .demo-intro__inner { padding-top: 40px; }
}

@media (max-width: 460px) {
  .demo-grid { grid-template-columns: 1fr; }
}

// ─── REDUCED MOTION ──────────────────────────────────────
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition: none !important; animation: none !important; }
  .demo-card:hover { transform: none; }
  .demo-card:hover .demo-card__stage img { transform: none; }
}
</style>