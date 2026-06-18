<script setup lang="ts">
import { ref, computed } from 'vue'

import maleBarber1 from '@/assets/img/male-barber1.jpg'
import maleBarber2 from '@/assets/img/male-barber2.jpg'
import maleBarber3 from '@/assets/img/male-barber3.jpg'
import maleBarber4 from '@/assets/img/male-barber4.jpg'
import logo from '@/assets/img/logo33.png'

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
  { id: 'cut',   name: 'Klasično šišanje',       desc: 'Makaze i mašinica, finiš na suvo', duration: '30 min', price: '800 RSD' },
  { id: 'fade',  name: 'Fade šišanje',           desc: 'Precizan prelaz — skin ili taper', duration: '40 min', price: '1.000 RSD' },
  { id: 'beard', name: 'Sređivanje brade',       desc: 'Linija, mašinica i topli peškir',  duration: '20 min', price: '500 RSD' },
  { id: 'combo', name: 'Šišanje + brada',        desc: 'Kompletan tretman i stajling',     duration: '50 min', price: '1.200 RSD' },
  { id: 'kids',  name: 'Dečije šišanje',         desc: 'Za klince do 12 godina',           duration: '25 min', price: '600 RSD' },
  { id: 'shave', name: 'Klasično brijanje',      desc: 'Britva i topli peškir',            duration: '30 min', price: '700 RSD' },
]

const days: DayOption[] = [
  { id: '06', weekday: 'WED', day: '06', month: 'MAY', label: '6. maj' },
  { id: '07', weekday: 'THU', day: '07', month: 'MAY', label: '7. maj' },
  { id: '08', weekday: 'FRI', day: '08', month: 'MAY', label: '8. maj' },
  { id: '11', weekday: 'MON', day: '11', month: 'MAY', label: '11. maj' },
  { id: '12', weekday: 'TUE', day: '12', month: 'MAY', label: '12. maj' },
  { id: '13', weekday: 'WED', day: '13', month: 'MAY', label: '13. maj' },
  { id: '14', weekday: 'THU', day: '14', month: 'MAY', label: '14. maj' },
  { id: '15', weekday: 'FRI', day: '15', month: 'MAY', label: '15. maj' },
  { id: '18', weekday: 'MON', day: '18', month: 'MAY', label: '18. maj' },
  { id: '19', weekday: 'TUE', day: '19', month: 'MAY', label: '19. maj' },
]

const barbers: Barber[] = [
  {
    id: 'marko',
    name: 'Marko',
    specialty: 'Specijalista za klasične i moderne frizure',
    rating: 4.9,
    avatar: maleBarber1,
    times: {
      am: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'],
      pm: ['12:00', '12:30', '13:00', '13:30', '14:30', '15:00', '16:00', '17:30', '18:00', '19:00'],
    },
    taken: ['10:00', '12:30', '16:00'],
  },
  {
    id: 'stefan',
    name: 'Stefan',
    specialty: 'Fade i moderni muški stilovi',
    rating: 4.8,
    avatar: maleBarber2,
    times: {
      am: ['10:00', '10:30', '11:00', '11:30'],
      pm: ['12:00', '13:00', '14:00', '15:30', '16:00', '17:00', '18:30'],
    },
    taken: ['11:00', '15:30'],
  },
  {
    id: 'nikola',
    name: 'Nikola',
    specialty: 'Brada i klasično brijanje',
    rating: 4.7,
    avatar: maleBarber3,
    times: {
      am: ['09:00', '09:30', '10:00', '11:00'],
      pm: ['12:30', '13:30', '14:00', '15:00', '16:30', '17:00', '18:00'],
    },
    taken: ['09:30', '14:00'],
  },
  {
    id: 'luka',
    name: 'Luka',
    specialty: 'Dečije i muško šišanje',
    rating: 4.9,
    avatar: maleBarber4,
    times: {
      am: ['09:30', '10:30', '11:00', '11:30'],
      pm: ['12:00', '12:30', '13:00', '14:00', '15:00', '16:00', '17:30'],
    },
    taken: ['12:00', '17:30'],
  },
]

/* Globalno najraniji slobodan termin (kartica na vrhu) */
const earliest = {
  time: '09:30',
  barberName: 'Marko',
  dayLabel: '6. maj',
  dayId: '06',
  barberId: 'marko',
  period: 'am' as Period,
}

/* ───────────────────────── Stanje ───────────────────────── */
const selectedServiceId = ref<string>('cut')
const selectedDayId = ref<string>('08')
const selectedBarberId = ref<string>('marko')
const selectedTime = ref<string>('13:30')
const period = ref<Period>('pm')

const showNotifs = ref<boolean>(false)
const notifications = [
  { id: 1, title: 'Termin potvrđen', body: 'Tvoj termin kod Marka je potvrđen.', time: 'pre 2h' },
  { id: 2, title: 'Podsetnik', body: 'Sutra u 13:30 imaš zakazano šišanje.', time: 'juče' },
]

/* ───────────────────────── Computed ───────────────────────── */
const selectedDay = computed(() => days.find((d) => d.id === selectedDayId.value) ?? null)

const selectedBarber = computed(
  () => barbers.find((b) => b.id === selectedBarberId.value) ?? null,
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

function bookEarliest() {
  selectedDayId.value = earliest.dayId
  selectedBarberId.value = earliest.barberId
  period.value = earliest.period
  selectedTime.value = earliest.time
}

function confirmBooking() {
  if (!canBook.value) return
  // hook za stvarno zakazivanje
  console.log('Zakazano:', {
    usluga: services.find((s) => s.id === selectedServiceId.value)?.name,
    datum: summaryDate.value,
    barber: selectedBarber.value?.name,
    vreme: selectedTime.value,
  })
}
</script>

<template>
  <div class="bb-screen">
    <div class="bb-scroll">
      <!-- Gornja tamnija zona pozadine -->
      <div class="bb-bg-top" />

      <div class="bb-content">
        <!-- Header -->
        <header class="bb-header">
          <div class="bb-brand">
            <img class="bb-brand__logo" :src="logo" alt="tvojred.rs" />
            <span class="bb-brand__name">tvojred<span class="bb-brand__tld">.rs</span></span>
          </div>

          <div class="bb-notif">
            <button
              class="bb-notif__btn"
              type="button"
              aria-label="Notifikacije"
              @click="showNotifs = !showNotifs"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a6 6 0 0 0-6 6c0 4.5-1.2 6.2-2.2 7.2A1 1 0 0 0 4.5 17h15a1 1 0 0 0 .7-1.7C19.2 14.2 18 12.5 18 8a6 6 0 0 0-6-6zm0 20a2.8 2.8 0 0 0 2.7-2h-5.4A2.8 2.8 0 0 0 12 22z" />
              </svg>
              <span v-if="notifications.length" class="bb-notif__badge">{{ notifications.length }}</span>
            </button>

            <transition name="bb-pop">
              <div v-if="showNotifs" class="bb-notif__panel">
                <div v-for="n in notifications" :key="n.id" class="bb-notif__item">
                  <span class="bb-notif__dot" />
                  <div class="bb-notif__content">
                    <span class="bb-notif__title">{{ n.title }}</span>
                    <span class="bb-notif__body">{{ n.body }}</span>
                    <span class="bb-notif__time">{{ n.time }}</span>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </header>

        <!-- Naslov -->
        <div class="bb-title-block">
          <span class="bb-eyebrow">Online zakazivanje</span>
          <h1 class="bb-title">Zakaži svoj termin.</h1>
          <p class="bb-subtitle">Izaberi uslugu, datum i vreme.</p>
        </div>

        <!-- Najraniji slobodan termin (frosted wrapper + tamna kartica) -->
        <div class="bb-featured-wrap">
          <section class="bb-featured">
            <span class="bb-featured__label">Najraniji slobodan termin</span>
            <span class="bb-featured__time">{{ earliest.time }}</span>
            <div class="bb-featured__bottom">
              <div class="bb-featured__meta">
                <span class="bb-featured__meta-row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path
                      d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  {{ earliest.barberName }}
                </span>
                <span class="bb-featured__meta-row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" stroke-linecap="round" />
                  </svg>
                  {{ earliest.dayLabel }}
                </span>
              </div>
              <button class="bb-cta bb-cta--sm" type="button" @click="bookEarliest">
                Zakaži
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </div>
          </section>
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
            <span class="bb-section-head__title">Frizer</span>
            <span class="bb-section-head__sub">Slobodni frizeri za ovaj dan</span>
          </div>
          <span class="bb-pill">{{ barbers.length }} dostupna</span>
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
  </div>
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@500;600;700&display=swap');

/* ───────────────────────── Tokeni ───────────────────────── */
$bb-bg-bottom:     #0f1219; // donja, malo svetlija zona
$bb-bg-top:        #22262e; // gornja zona — graphite gray
$bb-card:          #090b0f; // featured kartica = skoro crno (pop na graphite)
$bb-surface:       #11151f;
$bb-surface-2:     #161b27;
$bb-border:        rgba(255, 255, 255, 0.07);
$bb-border-strong: rgba(255, 255, 255, 0.12);
$bb-ring-gap:      #0f1219; // boja "rupe" u ringu oko avatara (= donja pozadina)
$bb-blue:          #406999;
$bb-blue-hover:    #3a82ff;
$bb-blue-press:    #1a5fe0;
$bb-text:          #f4f6f9;
$bb-text-dim:      #8b93a3;
$bb-text-mute:     #5c6577;
$bb-gold:          #f5b740;
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

/* Gornja zona — fotografija sa čvrstim tamnim overlayem */
.bb-bg-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 290px;
  z-index: 0;
  overflow: hidden;
  // background-color: #090d14;
  border-radius: 0 0 24px 24px;
  background: rgba(0,0,0,0.4);
  
  // border-bottom-left-radius: 50px;
  // border-bottom-right-radius: 50px;

  // &::after {
  //   content: '';
  //   position: absolute;
  //   inset: 0;
  //   background: rgba(0, 0, 0, 0.3);
  // }
}

.bb-content {
  position: relative;
  z-index: 1;
  padding: 18px 20px 130px;
}

/* ───────────────────────── Header ───────────────────────── */
.bb-header {
  position: relative;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
}

/* Brend (logo + wordmark) */
.bb-brand {
  display: flex;
  align-items: center;
  gap: 9px;

  &__logo {
    height: 30px;
    width: auto;
    display: block;
  }

  &__name {
    font-family: $bb-display;
    font-size: 19px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: $bb-text;
    line-height: 1;
  }

  &__tld {
    color: $bb-blue; // boja logoa — promeni ako logo nije plav
  }
}

/* Notifikacije */
.bb-notif {
  position: relative;

  &__btn {
    position: relative;
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    padding: 0;
    border: none;          // bez border-a
    background: none;      // bez background-a
    color: $bb-text;
    cursor: pointer;
    transition: color 0.18s ease, transform 0.1s ease;

    svg {
      width: 28px;
      height: 28px;
      fill: currentColor;  // solid
    }

    &:hover {
      color: #fff;
    }

    &:active {
      transform: scale(0.94);
    }
  }

  &__badge {
    position: absolute;
    top: -3px;
    right: -3px;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 999px;
    border: 2px solid $bb-bg-top; // boja pozadine iza zvonca, da "iseče" rupu
    background: $bb-blue;         // accent color
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    line-height: 14px;
    text-align: center;
  }

  &__panel {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    z-index: 40;
    width: 280px;
    padding: 6px;
    border-radius: 16px;
    border: 1px solid $bb-border-strong;
    background: $bb-surface-2;
    box-shadow: 0 24px 50px -22px rgba(0, 0, 0, 0.9);
  }

  &__item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 11px 12px;
    border-radius: 11px;
    transition: background 0.16s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.04);
    }

    & + & {
      margin-top: 2px;
    }
  }

  &__dot {
    flex-shrink: 0;
    width: 8px;
    height: 8px;
    margin-top: 5px;
    border-radius: 50%;
    background: $bb-blue;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__title {
    font-size: 14px;
    font-weight: 600;
    color: $bb-text;
  }

  &__body {
    font-size: 12.5px;
    line-height: 1.35;
    color: $bb-text-dim;
  }

  &__time {
    margin-top: 2px;
    font-size: 11px;
    color: $bb-text-mute;
  }
}

/* Pop tranzicija za panel */
.bb-pop-enter-active,
.bb-pop-leave-active {
  transition: opacity 0.18s ease, transform 0.18s $bb-ease;
  transform-origin: top right;
}

.bb-pop-enter-from,
.bb-pop-leave-to {
  opacity: 0;
  transform: scale(0.92) translateY(-6px);
}

/* ───────────────────────── Naslov ───────────────────────── */
.bb-title-block {
  margin-bottom: 24px;
  margin-top: 30px;
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
  font-size: 14px;
  line-height: 1.2;
  color: rgba(244, 246, 249, 0.64);
  text-align: left;
  // width: 100%;
}

/* ───────────────────────── Featured kartica ───────────────────────── */
.bb-featured-wrap {
  padding: 10px;
  margin-bottom: 30px;
  border-radius: $bb-radius-lg;
  // border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.08);
  // backdrop-filter: blur(14px);
  // -webkit-backdrop-filter: blur(14px);
  // width: 320px;
  margin: 0 auto 30px auto;
}

.bb-featured {
  display: flex;
  flex-direction: column;
  padding: 16px 18px;
  border-radius: $bb-radius-md;
  background: $bb-card;

  &__label {
    align-self: left;
    margin-bottom: 6px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.6);
  }

  &__time {
    font-family: $bb-display;
    font-size: 30px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.02em;
    color: $bb-text;
    margin-top: 5px;
  }

  &__bottom {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-top: 5px;
    gap: 12px;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  &__meta-row {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: rgba(255,255,255,0.6);

    svg {
      width: 16px;
      height: 16px;
      color: rgba(255,255,255,0.6);
    }
  }
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
  color: #fff;
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
    background: rgba(31, 111, 255, 0.35);
    color: rgba(255, 255, 255, 0.6);
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
      color: rgba(255, 255, 255, 0.85);
    }

    .bb-day__num {
      color: #fff;
    }

    &:hover {
      border-color: $bb-blue;
    }
  }
}

/* ───────────────────────── Usluga (editorial lista) ───────────────────────── */
.bb-services {
  margin-bottom: 30px;
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
      color: #fff;
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
    color: #fff;
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
      color: #fff;
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
    color: #fff;
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
  background: rgba(15, 18, 25, 0.82);
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
  .bb-barber::before {
    transition: none !important;
  }
}
</style>