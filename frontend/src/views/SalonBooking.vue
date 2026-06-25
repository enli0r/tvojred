<script setup lang="ts">
import { ref, computed } from 'vue'

import girl11 from '@/assets/img/girl11.jpg'
import girl12 from '@/assets/img/girl12.jpg'
import girl13 from '@/assets/img/girl13.jpg'
import girl14 from '@/assets/img/girl14.jpg'
import logoS2 from '@/assets/img/logo-s2.png'

/* ───────────────────────── Tipovi ───────────────────────── */
type Period = 'am' | 'pm'

interface ServiceOption {
  id: string
  name: string
  desc: string
  duration: string
  price: string
}

interface DayOption {
  id: string
  weekday: string
  day: string
  month: string
  label: string
}

interface Barber {
  id: string
  name: string
  specialty: string
  rating: number
  avatar: string
  times: { am: string[]; pm: string[] }
  taken: string[]
}

/* ───────────────────────── Dummy podaci ───────────────────────── */
const services: ServiceOption[] = [
  { id: 'balayage', name: 'Balayage / pramenovi', desc: 'Mekani prelivi i prirodni tonovi prilagođeni tenu i dužini kose.', duration: '150 min', price: 'od 7.000 RSD' },
  { id: 'makeup', name: 'Make-up', desc: 'Profesionalna šminka za dnevne, večernje i svečane prilike.', duration: '60 min', price: 'od 4.000 RSD' },
  { id: 'airtouch', name: 'Air touch', desc: 'Premium tehnika senčenja za čist, mekan i luksuzan prelaz boje.', duration: '210 min', price: 'od 12.000 RSD' },
  { id: 'color-correction', name: 'Color korekcije', desc: 'Korekcija tona, neutralizacija neželjenih odsjaja i obnova boje.', duration: '180 min', price: 'od 9.000 RSD' },
  { id: 'mini-val', name: 'Mini val', desc: 'Volumen, tekstura i definisan oblik kose uz moderan dugotrajan rezultat.', duration: '90 min', price: 'od 4.500 RSD' },
  { id: 'feniranje', name: 'Feniranje / styling', desc: 'Pranje, feniranje i finiš za uredan salonski izgled.', duration: '45 min', price: 'od 1.800 RSD' },
]

const days: DayOption[] = [
  { id: '26', weekday: 'PET', day: '26', month: 'JUN', label: '26. jun' },
  { id: '27', weekday: 'SUB', day: '27', month: 'JUN', label: '27. jun' },
  { id: '29', weekday: 'PON', day: '29', month: 'JUN', label: '29. jun' },
  { id: '30', weekday: 'UTO', day: '30', month: 'JUN', label: '30. jun' },
  { id: '01', weekday: 'SRE', day: '01', month: 'JUL', label: '1. jul' },
  { id: '02', weekday: 'ČET', day: '02', month: 'JUL', label: '2. jul' },
  { id: '03', weekday: 'PET', day: '03', month: 'JUL', label: '3. jul' },
  { id: '04', weekday: 'SUB', day: '04', month: 'JUL', label: '4. jul' },
  { id: '06', weekday: 'PON', day: '06', month: 'JUL', label: '6. jul' },
  { id: '07', weekday: 'UTO', day: '07', month: 'JUL', label: '7. jul' },
]

const barbers: Barber[] = [
  {
    id: 'ana',
    name: 'Ana',
    specialty: 'Balayage, pramenovi i toniranje',
    rating: 4.9,
    avatar: girl11,
    times: {
      am: ['09:00', '09:30', '10:00', '10:30', '11:30'],
      pm: ['12:00', '13:00', '14:30', '15:00', '16:30', '18:00'],
    },
    taken: ['09:30', '14:30'],
  },
  {
    id: 'mila',
    name: 'Mila',
    specialty: 'Air touch i color korekcije',
    rating: 4.9,
    avatar: girl12,
    times: {
      am: ['10:00', '10:30', '11:00', '11:30'],
      pm: ['12:30', '13:00', '15:00', '16:00', '17:30', '18:30'],
    },
    taken: ['11:00', '16:00'],
  },
  {
    id: 'teodora',
    name: 'Teodora',
    specialty: 'Profesionalni make-up i styling',
    rating: 4.8,
    avatar: girl13,
    times: {
      am: ['09:30', '10:00', '10:30', '11:00'],
      pm: ['12:00', '13:30', '14:00', '15:30', '17:00', '18:00'],
    },
    taken: ['10:30', '15:30'],
  },
  {
    id: 'nina',
    name: 'Nina',
    specialty: 'Mini val, nega i završni tretmani',
    rating: 4.8,
    avatar: girl14,
    times: {
      am: ['09:00', '10:00', '11:00', '11:30'],
      pm: ['12:30', '13:00', '14:00', '16:30', '17:30'],
    },
    taken: ['12:30', '17:30'],
  },
]

/* ───────────────────────── Stanje ───────────────────────── */
const selectedServiceId = ref<string>('balayage')
const selectedDayId = ref<string>('26')
const selectedBarberId = ref<string>('mila')
const selectedTime = ref<string>('13:00')
const period = ref<Period>('pm')

const sideMenuOpen = ref<boolean>(false)
const bookingSuccess = ref<boolean>(false)

const drawerLinks = [
  { label: 'Početna', target: 'home' },
  { label: 'Usluge', target: 'usluge' },
  { label: 'Naš tim', target: 'tim' },
  { label: 'Galerija', target: 'galerija' },
  { label: 'Kontakt', target: 'kontakt' },
]

/* ───────────────────────── Computed ───────────────────────── */
const selectedDay = computed(() => days.find((d) => d.id === selectedDayId.value) ?? null)

const selectedBarber = computed(
  () => barbers.find((b) => b.id === selectedBarberId.value) ?? null,
)

const selectedService = computed(
  () => services.find((s) => s.id === selectedServiceId.value) ?? null,
)

function earliestFor(barber: Barber): string {
  const all = [...barber.times.am, ...barber.times.pm]
  return all.find((t) => !barber.taken.includes(t)) ?? all[0]
}

const periodTimes = computed<string[]>(() => {
  if (!selectedBarber.value) return []
  return period.value === 'am' ? selectedBarber.value.times.am : selectedBarber.value.times.pm
})

const summaryDate = computed(() => selectedDay.value?.label ?? '')
const canBook = computed(() => !!selectedDay.value && !!selectedBarber.value && !!selectedTime.value)

function goBack() {
  if (window.history.length > 1) {
    window.history.back()
    return
  }

  window.location.href = '/s2-vracar'
}

function toggleSideMenu(state?: boolean) {
  sideMenuOpen.value = typeof state === 'boolean' ? state : !sideMenuOpen.value
}

function goLanding(target: string) {
  sideMenuOpen.value = false
  window.location.href = `/s2-vracar#${target}`
}

function closeBookingSuccess() {
  bookingSuccess.value = false
}

/* ───────────────────────── Akcije ───────────────────────── */
function selectDay(id: string) {
  selectedDayId.value = id
}

function selectService(id: string) {
  selectedServiceId.value = id
}

function selectBarber(id: string) {
  selectedBarberId.value = id
  resetTime()
}

function resetTime() {
  const b = selectedBarber.value
  if (!b) {
    selectedTime.value = ''
    return
  }
  const first = earliestFor(b)
  selectedTime.value = first
  period.value = b.times.am.includes(first) ? 'am' : 'pm'
}

function selectTime(t: string) {
  if (selectedBarber.value?.taken.includes(t)) return
  selectedTime.value = t
}


function confirmBooking() {
  if (!canBook.value) return
  // hook za stvarno zakazivanje
  console.log('Zakazano:', {
    usluga: selectedService.value?.name,
    datum: summaryDate.value,
    majstor: selectedBarber.value?.name,
    vreme: selectedTime.value,
  })
  bookingSuccess.value = true
}
</script>

<template>
  <div class="bb-screen">
    <div class="bb-scroll">
      <div class="bb-content">
        <!-- Header -->
        <header class="bb-header">
          <button class="bb-nav-btn bb-nav-btn--back" type="button" aria-label="Nazad" @click="goBack">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <button class="bb-header-logo" type="button" aria-label="S2 Vračar početna" @click="goLanding('home')">
            <img :src="logoS2" alt="S2 Vračar" />
          </button>

          <button class="bb-nav-btn bb-nav-btn--menu" type="button" aria-label="Otvori meni" @click="toggleSideMenu(true)">
            <span></span>
            <span></span>
          </button>
        </header>

        <!-- Side menu -->
        <Teleport to="body">
          <aside class="bb-drawer" :class="{ 'is-open': sideMenuOpen }">
          <div class="bb-drawer__top">
            <button class="bb-drawer__logo" type="button" aria-label="S2 Vračar početna" @click="goLanding('home')">
              <img :src="logoS2" alt="S2 Vračar" />
            </button>

            <button class="bb-drawer__close" type="button" aria-label="Zatvori meni" @click="toggleSideMenu(false)">
              <span></span>
              <span></span>
            </button>
          </div>

          <nav class="bb-drawer__nav">
            <button v-for="(item, idx) in drawerLinks" :key="item.target" type="button" @click="goLanding(item.target)">
              <span class="bb-drawer__idx">0{{ idx + 1 }}</span>
              {{ item.label }}
            </button>
          </nav>

          <div class="bb-drawer__foot">
            <button class="bb-cta bb-drawer__cta" type="button" @click="toggleSideMenu(false)">
              Nastavi zakazivanje
            </button>

            <div class="bb-drawer__contact">
              <a href="tel:+381600000000">+381 60 000 0000</a>
              <a href="https://www.instagram.com/s2.vracar">@s2.vracar</a>
            </div>
          </div>
          </aside>
        </Teleport>

        <!-- Naslov -->
        <!-- <div class="bb-title-block">
          <span class="bb-eyebrow">Online zakazivanje</span>
          <h1 class="bb-title">Rezervacija na klik.</h1>
          <p class="bb-subtitle">S2 Vračar ti omogućava da brzo izabereš tretman, majstora i slobodan termin koji ti najviše odgovara.</p>
        </div> -->

        <div class="bb-mini-intro">
        <span>Online zakazivanje</span>
        <p>Izaberi uslugu, majstora i slobodan termin.</p>
        </div>

        <!-- Datum -->
        <div class="bb-section-head">
          <span class="bb-section-head__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" stroke-linecap="round" />
            </svg>
          </span>
          <div class="bb-section-head__text">
            <span class="bb-section-head__title">Datum</span>
            <span class="bb-section-head__sub">Dostupni termini: 14 dana</span>
          </div>
        </div>

        <div class="bb-days">
          <button
            v-for="d in days"
            :key="d.id"
            type="button"
            class="bb-day"
            :class="{ 'bb-day--active': d.id === selectedDayId }"
            @click="selectDay(d.id)"
          >
            <span class="bb-day__weekday">{{ d.weekday }}</span>
            <span class="bb-day__num">{{ d.day }}</span>
            <span class="bb-day__month">{{ d.month }}</span>
          </button>
        </div>

        <!-- Usluga (editorial, selektabilno, ispred frizera) -->
        <div class="bb-section-head">
          <span class="bb-section-head__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M3 7l4-4h6l8 8-10 10-8-8V7z" stroke-linecap="round" stroke-linejoin="round" />
              <circle cx="8.5" cy="8.5" r="1.4" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <div class="bb-section-head__text">
            <span class="bb-section-head__title">Usluga</span>
            <span class="bb-section-head__sub">Izaberi šta želiš</span>
          </div>
        </div>

        <div class="bb-services">
          <button
            v-for="s in services"
            :key="s.id"
            type="button"
            class="bb-service-item"
            :class="{ 'bb-service-item--active': s.id === selectedServiceId }"
            @click="selectService(s.id)"
          >
            <span class="bb-service-item__main">
              <span class="bb-service-item__name">{{ s.name }}</span>
              <span class="bb-service-item__desc">{{ s.desc }}</span>
            </span>
            <span class="bb-service-item__side">
              <span class="bb-service-item__dur">{{ s.duration }}</span>
              <span class="bb-service-item__price">{{ s.price }}</span>
            </span>
            <span class="bb-service-item__check">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6">
                <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </button>
        </div>

        <!-- Frizer (editorial lista, bez kartica) -->
        <div class="bb-section-head">
          <span class="bb-section-head__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="6" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12" stroke-linecap="round" />
            </svg>
          </span>
          <div class="bb-section-head__text">
            <span class="bb-section-head__title">Majstor</span>
            <span class="bb-section-head__sub">Slobodni majstori za ovaj dan</span>
          </div>
          <span class="bb-pill">{{ barbers.length }} dostupno</span>
        </div>

        <div class="bb-barbers">
          <button
            v-for="b in barbers"
            :key="b.id"
            type="button"
            class="bb-barber"
            :class="{ 'bb-barber--active': b.id === selectedBarberId }"
            @click="selectBarber(b.id)"
          >
            <img class="bb-barber__avatar" :src="b.avatar" :alt="b.name" />
            <div class="bb-barber__info">
              <span class="bb-barber__name">{{ b.name }}</span>
              <span class="bb-barber__specialty">{{ b.specialty }}</span>
              <span class="bb-barber__rating">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 7.1-1.01L12 2z"
                  />
                </svg>
                {{ b.rating.toFixed(1) }}
              </span>
            </div>
            <div class="bb-barber__slot">
              <span class="bb-barber__slot-time">{{ earliestFor(b) }}</span>
              <span class="bb-barber__slot-label">slobodno</span>
            </div>
            <span class="bb-barber__check">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6">
                <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </button>
        </div>

        <!-- Vreme (Prepodne / Popodne) -->
        <template v-if="selectedBarber">
          <div class="bb-section-head">
            <span class="bb-section-head__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <div class="bb-section-head__text">
              <span class="bb-section-head__title">Vreme</span>
              <span class="bb-section-head__sub">Izaberi slobodan termin</span>
            </div>
          </div>

          <div class="bb-toggle">
            <button
              type="button"
              class="bb-toggle__btn"
              :class="{ 'bb-toggle__btn--active': period === 'am' }"
              @click="period = 'am'"
            >
              Prepodne
            </button>
            <button
              type="button"
              class="bb-toggle__btn"
              :class="{ 'bb-toggle__btn--active': period === 'pm' }"
              @click="period = 'pm'"
            >
              Popodne
            </button>
            <span class="bb-toggle__thumb" :class="`bb-toggle__thumb--${period}`" />
          </div>

          <div class="bb-times">
            <button
              v-for="t in periodTimes"
              :key="t"
              type="button"
              class="bb-time"
              :class="{
                'bb-time--active': t === selectedTime,
                'bb-time--taken': selectedBarber.taken.includes(t),
              }"
              :disabled="selectedBarber.taken.includes(t)"
              @click="selectTime(t)"
            >
              {{ t }}
            </button>
          </div>
        </template>
      </div>
    </div>

    <!-- Donji bar (fixed za dno ekrana) -->
    <footer class="bb-footer">
      <div class="bb-footer__summary">
        <span class="bb-footer__line">{{ summaryDate }} · {{ selectedBarber?.name ?? '—' }}</span>
        <span class="bb-footer__time">{{ selectedTime || '—' }}</span>
      </div>
      <button class="bb-cta" type="button" :disabled="!canBook" @click="confirmBooking">
        Zakaži
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </footer>

    <Teleport to="body">
      <div v-if="bookingSuccess" class="bb-success" @click.self="closeBookingSuccess">
        <section class="bb-success__card">
          <button class="bb-success__close" type="button" aria-label="Zatvori potvrdu" @click="closeBookingSuccess">
            <span></span>
            <span></span>
          </button>

          <span class="bb-success__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>

          <span class="bb-success__eyebrow">S2 Vračar</span>
          <h2>Termin je zakazan.</h2>
          <p>
            {{ selectedService?.name }} · {{ summaryDate }} u {{ selectedTime }}
            <template v-if="selectedBarber"> kod {{ selectedBarber.name }}</template>.
          </p>

          <button class="bb-cta bb-success__btn" type="button" @click="closeBookingSuccess">
            U redu
          </button>
        </section>
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@500;600;700&display=swap');

/* ───────────────────────── Tokeni ───────────────────────── */
$bb-bg-bottom:     #050505; // donja zona, skoro crna
$bb-card:          #090909; // featured kartica = skoro crno
$bb-surface:       #111111;
$bb-surface-2:     #181818;
$bb-border:        rgba(255, 255, 255, 0.07);
$bb-border-strong: rgba(255, 255, 255, 0.12);
$bb-ring-gap:      #0f1219; // boja "rupe" u ringu oko avatara (= donja pozadina)
$bb-blue:          #d4af5c;
$bb-blue-hover:    #bf9442;
$bb-blue-press:    #a77d33;
$bb-text:          #f4f6f9;
$bb-text-dim:      #8b93a3;
$bb-text-mute:     #5c6577;
$bb-gold:          #e6b85d;
$bb-radius-lg:     26px;
$bb-radius-md:     18px;
$bb-radius-sm:     14px;
$bb-ease:          cubic-bezier(0.22, 1, 0.36, 1);

$bb-sans:    'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
$bb-display: 'Poppins', $bb-sans;

/* ───────────────────────── Layout ───────────────────────── */
.bb-screen {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 440px;
  height: 100%;
  min-height: 100dvh;
  margin: 0 auto;
  background: $bb-bg-bottom;
  color: $bb-text;
  font-family: $bb-sans;
  -webkit-font-smoothing: antialiased;
  overflow: hidden;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
}

.bb-scroll {
  position: relative;
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.bb-content {
  position: relative;
  z-index: 1;
  padding: 18px 20px 130px;
}

/* ───────────────────────── Header ───────────────────────── */
.bb-header {
  position: sticky;
  top: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: -18px -20px 28px;
  padding: 10px 20px 9px;
  background: #050505;
  border-bottom: 1px solid rgba(212, 175, 92, 0.10);
}

.bb-header-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  height: 34px;
  padding: 0;
  border: 0;
  background: transparent;
  line-height: 0;
  cursor: pointer;

  img {
    display: block !important;
    width: auto !important;
    height: 24px !important;
    max-height: 24px !important;
    max-width: 116px !important;
    object-fit: contain !important;
  }
}

.bb-nav-btn {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: $bb-text;
  cursor: pointer;
  transition: transform 0.12s ease, color 0.2s ease;

  svg {
    width: 25px;
    height: 25px;
  }

  &:hover {
    color: #fff;
  }

  &:active {
    transform: scale(0.94);
  }

  &--menu {
    display: flex;
    flex-direction: column;
    gap: 7px;
    align-items: flex-end;
    justify-content: center;

    span {
      display: block;
      width: 26px;
      height: 2px;
      border-radius: 999px;
      background: currentColor;
      transition: width 0.3s ease;
    }

    span:last-child {
      width: 18px;
    }

    &:hover span:last-child {
      width: 26px;
    }
  }
}

.bb-drawer {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  max-width: 440px;
  margin: 0 auto;
  padding: 18px 28px 42px;
  background: radial-gradient(130% 90% at 100% 0%, #191919 0%, #050505 58%);
  color: $bb-text;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-22px);
  transition:
    opacity 0.35s ease,
    transform 0.48s $bb-ease,
    visibility 0.48s;

  &.is-open {
    opacity: 1;
    visibility: visible;
    transform: none;
  }

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
  }

  &__logo {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    background: transparent;
    line-height: 0;
    cursor: pointer;

    img {
      width: auto !important;
      height: 34px !important;
      max-width: 160px !important;
      object-fit: contain !important;
      display: block !important;
    }
  }

  &__close {
    width: 44px;
    height: 44px;
    position: relative;
    flex: none;
    border: 0;
    background: transparent;
    cursor: pointer;

    span {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 24px;
      height: 2px;
      border-radius: 999px;
      background: $bb-text;
    }

    span:first-child {
      transform: translate(-50%, -50%) rotate(45deg);
    }

    span:last-child {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
  }

  &__nav {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: auto 0;

    button {
      display: flex;
      align-items: baseline;
      gap: 18px;
      padding: 8px 0;
      border: 0;
      background: transparent;
      color: $bb-text;
      text-align: left;
      font-family: $bb-display;
      font-size: clamp(36px, 12vw, 56px);
      font-weight: 600;
      letter-spacing: -0.02em;
      line-height: 1.04;
      cursor: pointer;
      opacity: 0;
      transform: translateY(16px);
      transition:
        opacity 0.5s ease,
        transform 0.5s $bb-ease,
        color 0.25s ease;

      &:hover {
        color: $bb-blue;
      }
    }
  }

  &__idx {
    width: 26px;
    flex: none;
    transform: translateY(-0.35em);
    color: $bb-blue;
    font-family: $bb-display;
    font-size: 15px;
    font-weight: 500;
  }

  &__foot {
    display: flex;
    flex-direction: column;
    gap: 22px;
    opacity: 0;
    transition: opacity 0.5s ease 0.42s;
  }

  &__cta {
    width: 100%;
    justify-content: center;
  }

  &__contact {
    display: flex;
    flex-direction: column;
    gap: 6px;

    a {
      color: rgba(245, 241, 232, 0.62);
      text-decoration: none;
      font-size: 15px;
    }
  }
  &.is-open &__nav button {
    opacity: 1;
    transform: none;
  }

  &.is-open &__nav button:nth-child(1) {
    transition-delay: 0.16s;
  }

  &.is-open &__nav button:nth-child(2) {
    transition-delay: 0.22s;
  }

  &.is-open &__nav button:nth-child(3) {
    transition-delay: 0.28s;
  }

  &.is-open &__nav button:nth-child(4) {
    transition-delay: 0.34s;
  }

  &.is-open &__nav button:nth-child(5) {
    transition-delay: 0.40s;
  }

  &.is-open &__foot {
    opacity: 1;
  }

}

/* ───────────────────────── Naslov ───────────────────────── */
.bb-title-block {
  margin-bottom: 34px;
  margin-top: 0;
  // width: 100%;
}

.bb-eyebrow {
  display: block;
  margin-bottom: 10px;
  color: $bb-blue;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  line-height: 1;
  text-transform: uppercase;
  text-align: left;
}

.bb-title {
  margin: 0 0 12px;
  max-width: 390px;
  font-family: $bb-display;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.08;
  color: $bb-text;
  text-align: left;
}

.bb-subtitle {
  margin: 0;
  // max-width: 300px;
  max-width: 360px;
  font-size: 14px;
  line-height: 1.45;
  color: rgba(244, 246, 249, 0.64);
  text-align: left;
  // width: 100%;
}

/* ───────────────────────── CTA dugme (Apple stil) ───────────────────────── */
.bb-cta {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 11px 22px;
  border: none;
  border-radius: 999px;
  background: $bb-blue;
  color: #080808;
  font-family: $bb-sans;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s ease, transform 0.1s ease;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: $bb-blue-hover;
  }

  &:active {
    transform: scale(0.97);
    background: $bb-blue-press;
  }

  &:disabled {
    background: rgba(212, 175, 92, 0.35);
    color: rgba(8, 8, 8, 0.55);
    cursor: not-allowed;
  }

  &--sm {
    padding: 8px 16px;
    font-size: 13px;
    gap: 6px;

    svg {
      width: 15px;
      height: 15px;
    }
  }
}

/* ───────────────────────── Section head ───────────────────────── */
.bb-section-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 14px;

  &__icon {
    display: grid;
    place-items: center;
    width: 26px;
    height: 26px;
    color: $bb-blue;
    flex-shrink: 0;

    svg {
      width: 22px;
      height: 22px;
    }
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 1px;
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-size: 18px;
    font-weight: 600;
    color: $bb-text;
  }

  &__sub {
    font-size: 13px;
    color: $bb-text-dim;
  }
}

.bb-pill {
  flex-shrink: 0;
  padding: 7px 13px;
  border-radius: 999px;
  border: 1px solid $bb-border;
  background: rgba(255, 255, 255, 0.04);
  font-size: 12px;
  font-weight: 500;
  color: $bb-text-dim;
}

/* ───────────────────────── Datumi ───────────────────────── */
.bb-days {
  display: flex;
  gap: 12px;
  margin-bottom: 30px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.bb-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  width: 70px;
  padding: 14px 0;
  border-radius: 20px;
  border: 1px solid $bb-border;
  background: $bb-surface;
  color: $bb-text;
  cursor: pointer;
  transition: border-color 0.18s ease, transform 0.1s ease;

  &__weekday {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: $bb-text-dim;
  }

  &__num {
    font-family: $bb-display;
    font-size: 24px;
    font-weight: 700;
    line-height: 1;
  }

  &__month {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: $bb-text-dim;
  }

  &:hover {
    border-color: $bb-border-strong;
  }

  &:active {
    transform: scale(0.96);
  }

  &--active {
    background: $bb-blue;
    border-color: $bb-blue;

    .bb-day__weekday,
    .bb-day__month {
      color: rgba(8, 8, 8, 0.70);
    }

    .bb-day__num {
      color: #080808;
    }

    &:hover {
      border-color: $bb-blue;
    }
  }
}

/* ───────────────────────── Usluga (editorial lista) ───────────────────────── */
.bb-services {
  margin-bottom: 58px;
  border-top: 1px solid $bb-border;
}

.bb-service-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 16px 8px 16px 16px;
  border: none;
  border-bottom: 1px solid $bb-border;
  background: none;
  text-align: left;
  font-family: $bb-sans;
  color: $bb-text;
  cursor: pointer;
  transition: background 0.25s ease;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: $bb-blue;
    transform: scaleY(0);
    transition: transform 0.3s $bb-ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.025);
  }

  &__main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  &__name {
    font-size: 15px;
    font-weight: 600;
  }

  &__desc {
    font-size: 12.5px;
    color: $bb-text-mute;
  }

  &__side {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 3px;
  }

  &__dur {
    font-size: 12px;
    color: $bb-text-mute;
  }

  &__price {
    font-size: 14px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    transition: color 0.2s ease;
  }

  &__check {
    flex-shrink: 0;
    display: grid;
    place-items: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1.5px solid $bb-border-strong;
    color: transparent;
    transition: all 0.25s $bb-ease;

    svg {
      width: 14px;
      height: 14px;
    }
  }

  &--active {
    &::before {
      transform: scaleY(1);
    }

    .bb-service-item__price {
      color: $bb-blue;
    }

    .bb-service-item__check {
      background: $bb-blue;
      border-color: $bb-blue;
      color: #080808;
    }
  }
}

/* ───────────────────────── Frizer (editorial lista, bez kartica) ───────────────────────── */
.bb-barbers {
  margin-bottom: 30px;
  border-top: 1px solid $bb-border;
}

.bb-barber {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 14px 8px 14px 16px;
  border: none;
  border-bottom: 1px solid $bb-border;
  background: none;
  text-align: left;
  font-family: $bb-sans;
  color: $bb-text;
  cursor: pointer;
  transition: background 0.25s ease;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: $bb-blue;
    transform: scaleY(0);
    transition: transform 0.3s $bb-ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.025);
  }

  &__avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    border: 1px solid $bb-border-strong;
    transition: box-shadow 0.18s ease;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 3px;
    flex: 1;
    min-width: 0;
  }

  &__name {
    font-size: 16px;
    font-weight: 600;
    color: $bb-text;
  }

  &__specialty {
    font-size: 12px;
    line-height: 1.35;
    color: $bb-text-dim;
  }

  &__rating {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 2px;
    font-size: 12px;
    font-weight: 600;
    color: $bb-text;

    svg {
      width: 13px;
      height: 13px;
      color: $bb-gold;
    }
  }

  &__slot {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
    flex-shrink: 0;
  }

  &__slot-time {
    font-size: 15px;
    font-weight: 600;
    color: $bb-text;
  }

  &__slot-label {
    font-size: 12px;
    color: $bb-text-dim;
  }

  &__check {
    display: grid;
    place-items: center;
    width: 22px;
    height: 22px;
    flex-shrink: 0;
    border-radius: 50%;
    background: $bb-blue;
    color: #080808;
    opacity: 0;
    transform: scale(0.6);
    transition: opacity 0.18s ease, transform 0.18s ease;

    svg {
      width: 13px;
      height: 13px;
    }
  }

  &--active {
    &::before {
      transform: scaleY(1);
    }

    .bb-barber__avatar {
      box-shadow: 0 0 0 2px $bb-ring-gap, 0 0 0 4px $bb-blue;
    }

    .bb-barber__check {
      opacity: 1;
      transform: scale(1);
    }
  }
}

/* ───────────────────────── Toggle Prepodne/Popodne ───────────────────────── */
.bb-toggle {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-bottom: 16px;
  padding: 4px;
  border-radius: 999px;
  border: 1px solid $bb-border;
  background: rgba(255, 255, 255, 0.03);

  &__btn {
    position: relative;
    z-index: 1;
    padding: 11px 0;
    border: none;
    background: transparent;
    color: $bb-text-dim;
    font-family: $bb-sans;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s ease;

    &--active {
      color: #080808;
    }
  }

  &__thumb {
    position: absolute;
    z-index: 0;
    top: 4px;
    bottom: 4px;
    width: calc(50% - 4px);
    border-radius: 999px;
    background: $bb-blue;
    transition: transform 0.26s $bb-ease;

    &--am {
      transform: translateX(4px);
    }

    &--pm {
      transform: translateX(calc(100% + 4px));
    }
  }
}

/* ───────────────────────── Termini ───────────────────────── */
.bb-times {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.bb-time {
  padding: 12px 0;
  border-radius: $bb-radius-sm;
  border: 1px solid $bb-border;
  background: $bb-surface;
  color: $bb-text;
  font-family: $bb-sans;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.16s ease, background 0.16s ease, transform 0.1s ease;

  &:hover {
    border-color: $bb-border-strong;
  }

  &:active {
    transform: scale(0.95);
  }

  &--active {
    background: $bb-blue;
    border-color: $bb-blue;
    color: #080808;
  }

  &--taken {
    color: $bb-text-mute;
    text-decoration: line-through;
    background: rgba(255, 255, 255, 0.02);
    cursor: not-allowed;
    opacity: 0.55;

    &:hover {
      border-color: $bb-border;
    }
  }
}


/* ───────────────────────── Success popup ───────────────────────── */
.bb-success {
  position: fixed;
  inset: 0;
  z-index: 120;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.76);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);

  &__card {
    position: relative;
    width: min(360px, 100%);
    padding: 34px 26px 26px;
    border-radius: 28px;
    border: 1px solid rgba(212, 175, 92, 0.22);
    background: linear-gradient(180deg, #161616 0%, #080808 100%);
    box-shadow: 0 30px 90px rgba(0, 0, 0, 0.62);
    color: $bb-text;
    text-align: center;
  }

  &__close {
    position: absolute;
    top: 14px;
    right: 14px;
    width: 38px;
    height: 38px;
    border: 1px solid rgba(255, 255, 255, 0.10);
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    cursor: pointer;

    span {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 18px;
      height: 2px;
      border-radius: 999px;
      background: $bb-text;
    }

    span:first-child {
      transform: translate(-50%, -50%) rotate(45deg);
    }

    span:last-child {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
  }

  &__icon {
    display: grid;
    place-items: center;
    width: 58px;
    height: 58px;
    margin: 0 auto 18px;
    border-radius: 50%;
    background: $bb-blue;
    color: #080808;
    box-shadow: 0 0 0 10px rgba(212, 175, 92, 0.12);

    svg {
      width: 28px;
      height: 28px;
    }
  }

  &__eyebrow {
    display: block;
    margin-bottom: 9px;
    color: $bb-blue;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  h2 {
    margin: 0 0 10px;
    font-family: $bb-display;
    font-size: 25px;
    line-height: 1.08;
    letter-spacing: -0.02em;
  }

  p {
    margin: 0 auto 22px;
    max-width: 280px;
    color: rgba(244, 246, 249, 0.68);
    font-size: 14px;
    line-height: 1.5;
  }

  &__btn {
    width: 100%;
    justify-content: center;
  }
}

/* ───────────────────────── Donji bar (fixed) ───────────────────────── */
.bb-footer {
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  z-index: 15;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  width: 100%;
  max-width: 440px;
  padding: 14px 20px calc(14px + env(safe-area-inset-bottom));
  border-top: 1px solid $bb-border;
  background: rgba(5, 5, 5, 0.86);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);

  &__summary {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__line {
    font-size: 13px;
    color: $bb-text-dim;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__time {
    font-size: 20px;
    font-weight: 700;
    color: $bb-text;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bb-toggle__thumb,
  .bb-cta,
  .bb-day,
  .bb-time,
  .bb-barber__check,
  .bb-service-item::before,
  .bb-barber::before,
  .bb-drawer,
  .bb-success__card {
    transition: none !important;
  }
}

.bb-mini-intro {
  margin: 18px 0 26px;

  span {
    display: block;
    margin-bottom: 7px;
    color: $bb-gold;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  p {
    margin: 0;
    color: rgba(245, 241, 232, 0.68);
    font-size: 14px;
    line-height: 1.35;
  }
}
</style>