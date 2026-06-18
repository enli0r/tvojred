<template>
  <div class="app">
    <div class="phone">

      <!-- ╔══════════════ EKRAN 1 · izbor berberina ══════════════╗ -->
      <section v-if="screen === 'list'" class="list">
        <header class="list__top">
          <p class="eyebrow">Mono · muški frizerski studio</p>
          <h1>Zakaži<br />svoj termin.</h1>
        </header>

        <label class="search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
          <input v-model.trim="query" type="search" placeholder="Pretraži majstore ili usluge" />
        </label>

        <div class="filters">
          <button
            v-for="f in filters"
            :key="f"
            class="filters__chip"
            :class="{ 'is-active': filter === f }"
            type="button"
            @click="filter = f"
          >
            {{ f }}
          </button>
        </div>

        <div class="cards">
          <button
            v-for="b in filteredBarbers"
            :key="b.id"
            class="bcard"
            type="button"
            @click="openBarber(b.id)"
          >
            <img class="bcard__photo" :src="img(b.slug, 220, 220)" :alt="b.name" />
            <span class="bcard__body">
              <strong>{{ b.name }}</strong>
              <small>{{ b.specialty }}</small>
              <span class="bcard__meta">
                <em>★ {{ b.rating.toFixed(1) }}</em>
                <i>·</i>
                od {{ formatPrice(b.fromPrice) }} RSD
              </span>
            </span>
            <span class="bcard__go" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>
            </span>
          </button>

          <p v-if="filteredBarbers.length === 0" class="cards__empty">
            Nema rezultata za „{{ query }}".
          </p>
        </div>
      </section>

      <!-- ╔══════════════ EKRAN 2 · zakazivanje ══════════════╗ -->
      <section v-else-if="barber" class="book">
        <header class="book__top">
          <button class="circle" type="button" aria-label="Nazad" @click="screen = 'list'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 5l-7 7 7 7"/></svg>
          </button>
          <div class="book__who">
            <strong>{{ barber.name }}</strong>
            <small>{{ barber.specialty }} · ★ {{ barber.rating.toFixed(1) }}</small>
          </div>
          <img class="book__photo" :src="img(barber.slug, 120, 120)" :alt="barber.name" />
        </header>

        <main class="screen">
          <h2 class="label">01 — Usluga</h2>
          <div class="svc" role="radiogroup" aria-label="Usluge">
            <button
              v-for="s in barber.services"
              :key="s.id"
              class="svc__row"
              :class="{ 'is-active': serviceId === s.id }"
              type="button"
              role="radio"
              :aria-checked="serviceId === s.id"
              @click="serviceId = s.id"
            >
              <i class="svc__dot" aria-hidden="true" />
              <span class="svc__name">
                {{ s.name }}
                <small>{{ s.minutes }} min</small>
              </span>
              <em class="svc__price">{{ formatPrice(s.price) }}</em>
            </button>
          </div>

          <h2 class="label">02 — Dan</h2>
          <div class="days">
            <button
              v-for="d in days"
              :key="d.iso"
              class="days__chip"
              :class="{ 'is-active': dayIso === d.iso }"
              :disabled="d.disabled"
              type="button"
              @click="pickDay(d.iso)"
            >
              <small>{{ d.weekday }}</small>
              <span>{{ d.dayNum }}</span>
            </button>
          </div>

          <h2 class="label">03 — Vreme</h2>
          <div class="times">
            <button
              v-for="t in slots"
              :key="t.time"
              class="times__cell"
              :class="{ 'is-active': chosenTime === t.time }"
              :disabled="t.taken"
              type="button"
              @click="slotTime = t.time"
            >
              {{ t.time }}
            </button>
          </div>

          <!-- pregled -->
          <div class="recap" :class="{ 'is-ready': canBook }">
            <div class="recap__row">
              <span>Usluga</span>
              <strong>{{ chosenService?.name ?? '—' }}</strong>
            </div>
            <div class="recap__row">
              <span>Termin</span>
              <strong>{{ chosenDay && chosenTime ? `${chosenDay.short} u ${chosenTime}` : '—' }}</strong>
            </div>
            <div class="recap__row recap__row--total">
              <span>Ukupno</span>
              <strong>{{ chosenService ? formatPrice(chosenService.price) : '0' }} RSD</strong>
            </div>
          </div>
        </main>

        <div class="cta">
          <button class="cta__btn" type="button" :disabled="!canBook" @click="askDetails = true">
            Zakaži — {{ chosenService ? formatPrice(chosenService.price) + ' RSD' : 'izaberi sve' }}
          </button>
        </div>
      </section>

      <!-- ───────── podaci o gostu ───────── -->
      <div v-if="askDetails" class="modal" role="dialog" aria-modal="true" aria-label="Vaši podaci">
        <form class="modal__card" @submit.prevent="confirmBooking">
          <h3>Vaši podaci</h3>

          <div class="field">
            <label for="m-name">Ime i prezime</label>
            <input id="m-name" v-model.trim="customer.name" type="text" placeholder="npr. Marko Petrović" autocomplete="name" required />
          </div>
          <div class="field">
            <label for="m-phone">Telefon</label>
            <input id="m-phone" v-model.trim="customer.phone" type="tel" placeholder="06x xxx xxxx" autocomplete="tel" required />
          </div>

          <div class="modal__actions">
            <button class="ghost" type="button" @click="askDetails = false">Nazad</button>
            <button class="solid" type="submit" :disabled="!customer.name || !customer.phone">Potvrdi</button>
          </div>
        </form>
      </div>

      <!-- ───────── potvrda ───────── -->
      <div v-if="ticket" class="modal modal--center" role="dialog" aria-modal="true" aria-label="Termin potvrđen">
        <div class="modal__card modal__card--center">
          <span class="check" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>
          </span>
          <h3>Potvrđeno.</h3>
          <p class="muted">Rezervacija <b>№ {{ ticket.code }}</b></p>

          <dl class="rows">
            <div><dt>Majstor</dt><dd>{{ ticket.barber }}</dd></div>
            <div><dt>Usluga</dt><dd>{{ ticket.service }}</dd></div>
            <div><dt>Termin</dt><dd>{{ ticket.date }} · {{ ticket.time }}</dd></div>
            <div><dt>Gost</dt><dd>{{ ticket.name }}</dd></div>
            <div><dt>Cena</dt><dd>{{ ticket.price }} RSD</dd></div>
          </dl>

          <button class="solid solid--wide" type="button" @click="resetAll">U redu</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

/* ---------------- tipovi ---------------- */

type Screen = 'list' | 'book'
type Filter = 'Sve' | 'Šišanje' | 'Brada' | 'Brijanje'

interface Service { id: number; name: string; minutes: number; price: number; tag: Exclude<Filter, 'Sve'> }

interface Barber {
  id: number
  slug: string
  name: string
  specialty: string
  rating: number
  fromPrice: number
  services: Service[]
}

interface Day { iso: string; weekday: string; dayNum: number; short: string; full: string; disabled: boolean }
interface Slot { time: string; taken: boolean }
interface Customer { name: string; phone: string }

interface Ticket {
  code: string
  barber: string
  service: string
  date: string
  time: string
  name: string
  price: string
}

/* ---------------- placeholder slike (crno-bele, zameni svojim) ---------------- */
const img = (seed: string, w: number, h: number): string =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}?grayscale`

/* ---------------- dummy podaci ---------------- */

const filters: Filter[] = ['Sve', 'Šišanje', 'Brada', 'Brijanje']

const barbers: Barber[] = [
  {
    id: 1, slug: 'nikola-mono', name: 'Nikola Janković', specialty: 'Klasično šišanje makazama',
    rating: 4.9, fromPrice: 1400,
    services: [
      { id: 1, name: 'Šišanje makazama', minutes: 40, price: 1400, tag: 'Šišanje' },
      { id: 2, name: 'Šišanje + pranje',  minutes: 50, price: 1700, tag: 'Šišanje' },
      { id: 3, name: 'Oblikovanje brade', minutes: 30, price: 1000, tag: 'Brada' },
    ],
  },
  {
    id: 2, slug: 'luka-mono', name: 'Luka Stanić', specialty: 'Fade i moderne forme',
    rating: 4.8, fromPrice: 900,
    services: [
      { id: 1, name: 'Skin fade',         minutes: 45, price: 1500, tag: 'Šišanje' },
      { id: 2, name: 'Šišanje mašinicom', minutes: 25, price: 900,  tag: 'Šišanje' },
      { id: 3, name: 'Fade + brada',      minutes: 65, price: 2200, tag: 'Brada' },
    ],
  },
  {
    id: 3, slug: 'vuk-mono', name: 'Vuk Đorđević', specialty: 'Brijanje britvom, stara škola',
    rating: 5.0, fromPrice: 1200,
    services: [
      { id: 1, name: 'Brijanje britvom',   minutes: 35, price: 1200, tag: 'Brijanje' },
      { id: 2, name: 'Topli peškir ritual', minutes: 50, price: 1600, tag: 'Brijanje' },
      { id: 3, name: 'Kontura brade',       minutes: 25, price: 900,  tag: 'Brada' },
    ],
  },
  {
    id: 4, slug: 'milos-mono', name: 'Miloš Radovanović', specialty: 'Brada i nega',
    rating: 4.7, fromPrice: 1000,
    services: [
      { id: 1, name: 'Oblikovanje brade', minutes: 30, price: 1000, tag: 'Brada' },
      { id: 2, name: 'Brada + ulje',      minutes: 40, price: 1300, tag: 'Brada' },
      { id: 3, name: 'Kompletan tretman', minutes: 80, price: 2600, tag: 'Šišanje' },
    ],
  },
]

const WEEKDAYS = ['Ned', 'Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub'] as const
const MONTHS = ['januar', 'februar', 'mart', 'april', 'maj', 'jun', 'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'] as const

const SLOT_TIMES: readonly string[] = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '15:00', '16:00', '17:00', '18:00',
]

const toIso = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

/* narednih 10 dana, nedelja neradna */
const days: Day[] = (() => {
  const out: Day[] = []
  const now = new Date()
  for (let i = 0; i < 10; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() + i)
    out.push({
      iso: toIso(d),
      weekday: WEEKDAYS[d.getDay()],
      dayNum: d.getDate(),
      short: `${WEEKDAYS[d.getDay()]} ${d.getDate()}.`,
      full: `${d.getDate()}. ${MONTHS[d.getMonth()]}`,
      disabled: d.getDay() === 0,
    })
  }
  return out
})()

const firstOpen = days.find((d) => !d.disabled)

/* deterministička "zauzetost" */
function isTaken(barberId: number, iso: string, time: string): boolean {
  const str = `${barberId}|${iso}|${time}`
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h % 10 < 3
}

/* ---------------- stanje ---------------- */

const screen      = ref<Screen>('list')
const query       = ref('')
const filter      = ref<Filter>('Sve')
const barberRefId = ref<number | null>(null)

const serviceId = ref<number | null>(null)
const dayIso    = ref<string | null>(firstOpen?.iso ?? null)
const slotTime  = ref<string | null>(null)

const askDetails = ref(false)
const customer   = reactive<Customer>({ name: '', phone: '' })
const ticket     = ref<Ticket | null>(null)

/* ---------------- izvedeno ---------------- */

const barber = computed<Barber | null>(() => barbers.find((b) => b.id === barberRefId.value) ?? null)

const filteredBarbers = computed<Barber[]>(() =>
  barbers.filter((b) => {
    const q = query.value.toLowerCase()
    const matchQ =
      !q ||
      b.name.toLowerCase().includes(q) ||
      b.specialty.toLowerCase().includes(q) ||
      b.services.some((s) => s.name.toLowerCase().includes(q))
    const matchF = filter.value === 'Sve' || b.services.some((s) => s.tag === filter.value)
    return matchQ && matchF
  }),
)

const chosenService = computed<Service | null>(
  () => barber.value?.services.find((s) => s.id === serviceId.value) ?? null,
)

const chosenDay = computed<Day | null>(() => days.find((d) => d.iso === dayIso.value) ?? null)

const slots = computed<Slot[]>(() => {
  if (!barber.value || !dayIso.value) return []
  return SLOT_TIMES.map((time) => ({
    time,
    taken: isTaken(barber.value!.id, dayIso.value!, time),
  }))
})

const chosenTime = computed<string | null>(() => {
  const s = slots.value.find((t) => t.time === slotTime.value)
  return s && !s.taken ? s.time : null
})

const canBook = computed<boolean>(() => Boolean(chosenService.value && chosenDay.value && chosenTime.value))

/* ---------------- akcije ---------------- */

function openBarber(id: number): void {
  barberRefId.value = id
  serviceId.value = null
  slotTime.value = null
  screen.value = 'book'
}

function pickDay(iso: string): void {
  dayIso.value = iso
  slotTime.value = null
}

function confirmBooking(): void {
  if (!canBook.value || !customer.name || !customer.phone) return
  askDetails.value = false
  ticket.value = {
    code: 'MO-' + String(Math.floor(1000 + Math.random() * 9000)),
    barber: barber.value!.name,
    service: chosenService.value!.name,
    date: chosenDay.value!.full,
    time: chosenTime.value!,
    name: customer.name,
    price: formatPrice(chosenService.value!.price),
  }
}

function resetAll(): void {
  ticket.value = null
  customer.name = ''
  customer.phone = ''
  serviceId.value = null
  slotTime.value = null
  screen.value = 'list'
}

function formatPrice(n: number): string {
  return n.toLocaleString('sr-Latn-RS')
}
</script>

<style lang="scss">
/* =============================================================
   MONO · muški frizerski studio — belo + crno, profesionalno
   ============================================================= */

@use 'sass:color';

/* -- SCSS varijable ------------------------------------------- */
$bg:      #fafaf7;   // beličasta pozadina
$paper:   #ffffff;
$ink:     #111110;   // crni akcenat
$muted:   #8c8c87;
$line:    rgba(17, 17, 16, .09);
$line-2:  rgba(17, 17, 16, .16);

$f: 'Schibsted Grotesk', system-ui, sans-serif;

$r-lg: 18px;
$r-md: 13px;

$phone-w: 430px;

/* -- mixini ----------------------------------------------------- */
@mixin solid-ink {
  background: $ink;
  color: $bg;
}

@mixin card($r: $r-lg) {
  background: $paper;
  border: 1px solid $line;
  border-radius: $r;
}

@mixin icon($s: 20px) {
  svg { width: $s; height: $s; display: block; }
}

@mixin micro-label {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
}

@mixin hide-scrollbar {
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
}

/* -- font --------------------------------------------------------- */
@import url('https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700;800&display=swap');

/* -- globalno ------------------------------------------------------ */
*,
*::before,
*::after { margin: 0; padding: 0; box-sizing: border-box; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}

body {
  background: color.adjust($bg, $lightness: -2%);
  color: $ink;
  font-family: $f;
  font-size: 15px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

img { display: block; max-width: 100%; }

::selection { background: $ink; color: $bg; }

:focus-visible { outline: 2px solid $ink; outline-offset: 2px; }

button { font: inherit; color: inherit; background: none; border: none; cursor: pointer; }

/* =============================================================
   okvir telefona
   ============================================================= */
.app {
  min-height: 100dvh;
  display: grid;
  place-items: start center;

  @media (min-width: 560px) {
    place-items: center;
    padding: 32px 16px;
  }
}

.phone {
  width: 100%;
  max-width: $phone-w;
  min-height: 100dvh;
  position: relative;
  display: flex;
  flex-direction: column;
  background: $bg;
  overflow: hidden;

  @media (min-width: 560px) {
    min-height: 0;
    height: min(880px, calc(100dvh - 64px));
    border: 1px solid $line;
    border-radius: 36px;
    box-shadow: 0 30px 80px rgba(17, 17, 16, .12);
  }
}

.circle {
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border-radius: 50%;
  transition: background .2s ease, color .2s ease;
  @include card(50%);
  @include icon(18px);

  &:hover { @include solid-ink; }
}

.eyebrow {
  color: $muted;
  margin-bottom: 12px;
  @include micro-label;
}

.label {
  margin: 26px 0 12px;
  color: $muted;
  @include micro-label;
}

/* =============================================================
   EKRAN 1 · lista
   ============================================================= */
.list {
  flex: 1;
  overflow-y: auto;
  padding: 30px 22px 40px;
  @include hide-scrollbar;

  &__top {
    margin-bottom: 22px;

    h1 {
      font-size: clamp(32px, 8.6vw, 40px);
      font-weight: 800;
      line-height: 1.05;
      letter-spacing: -.025em;
    }
  }
}

.search {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 52px;
  padding: 0 18px;
  @include card(99px);
  @include icon(17px);

  svg { color: $muted; flex: 0 0 auto; }

  input {
    flex: 1;
    border: none;
    background: none;
    font: inherit;
    color: $ink;

    &::placeholder { color: $muted; }
    &:focus { outline: none; }
  }

  &:focus-within { border-color: $ink; }
}

.filters {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  margin: 14px -22px 20px;
  padding: 2px 22px;
  @include hide-scrollbar;

  &__chip {
    flex: 0 0 auto;
    padding: 9px 17px;
    border-radius: 99px;
    font-size: 13px;
    font-weight: 600;
    color: $muted;
    transition: background .2s ease, color .2s ease, border-color .2s ease;
    @include card(99px);

    &:hover:not(.is-active) { border-color: $line-2; color: $ink; }

    &.is-active {
      border-color: $ink;
      @include solid-ink;
    }
  }
}

.cards {
  display: grid;
  gap: 10px;

  &__empty {
    padding: 26px;
    text-align: center;
    color: $muted;
    font-size: 13.5px;
    border: 1px dashed $line-2;
    border-radius: $r-lg;
  }
}

.bcard {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 14px;
  padding: 12px;
  text-align: left;
  transition: border-color .2s ease, transform .15s ease;
  @include card;

  &:hover { border-color: $ink; }
  &:active { transform: scale(.985); }

  &__photo {
    width: 64px;
    height: 64px;
    border-radius: $r-md;
    object-fit: cover;
  }

  &__body {
    min-width: 0;

    strong { display: block; font-size: 15.5px; font-weight: 700; letter-spacing: -.01em; }
    small { display: block; color: $muted; font-size: 12.5px; margin-top: 1px; }
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-top: 7px;
    font-size: 12px;
    font-weight: 600;

    em {
      font-style: normal;
      padding: 2px 8px;
      border-radius: 99px;
      border: 1px solid $line-2;
    }

    i { color: $muted; font-style: normal; }
  }

  &__go {
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    border: 1px solid $line-2;
    transition: background .2s ease, color .2s ease;
    @include icon(15px);
  }

  &:hover .bcard__go { @include solid-ink; }
}

/* =============================================================
   EKRAN 2 · zakazivanje
   ============================================================= */
.book {
  flex: 1;
  display: flex;
  flex-direction: column;
  animation: rise .3s ease both;
}

@keyframes rise {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}

.book__top {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 22px 14px;
  border-bottom: 1px solid $line;

  .book__who {
    min-width: 0;

    strong { display: block; font-size: 16px; font-weight: 700; letter-spacing: -.01em; }
    small { color: $muted; font-size: 12px; }
  }

  .book__photo {
    width: 44px;
    height: 44px;
    margin-left: auto;
    border-radius: 50%;
    object-fit: cover;
  }
}

.screen {
  flex: 1;
  overflow-y: auto;
  padding: 4px 22px 130px;
  @include hide-scrollbar;
}

/* usluge */
.svc {
  display: grid;
  gap: 8px;

  &__row {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 13px;
    padding: 15px 16px;
    text-align: left;
    transition: border-color .2s ease;
    @include card($r-md);

    &:hover { border-color: $line-2; }

    &.is-active {
      border-color: $ink;

      .svc__dot {
        border-color: $ink;

        &::after { transform: scale(1); }
      }
    }
  }

  &__dot {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 1.5px solid $line-2;
    display: grid;
    place-items: center;
    transition: border-color .2s ease;

    &::after {
      content: '';
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: $ink;
      transform: scale(0);
      transition: transform .18s ease;
    }
  }

  &__name {
    font-size: 14.5px;
    font-weight: 600;

    small {
      color: $muted;
      font-weight: 500;
      margin-left: 8px;
      font-size: 12px;
    }
  }

  &__price {
    font-style: normal;
    font-size: 14.5px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
}

/* dani */
.days {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  margin: 0 -22px;
  padding: 2px 22px 4px;
  @include hide-scrollbar;

  &__chip {
    flex: 0 0 56px;
    display: grid;
    justify-items: center;
    gap: 4px;
    padding: 11px 4px;
    border-radius: $r-md;
    transition: background .2s ease, color .2s ease, border-color .2s ease;
    @include card($r-md);

    small {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: .08em;
      text-transform: uppercase;
      color: $muted;
      transition: color .2s ease;
    }

    span {
      font-size: 17px;
      font-weight: 800;
      font-variant-numeric: tabular-nums;
    }

    &:hover:not(:disabled):not(.is-active) { border-color: $line-2; }

    &.is-active {
      border-color: $ink;
      @include solid-ink;

      small { color: rgba(250, 250, 247, .65); }
    }

    &:disabled {
      opacity: .35;
      cursor: not-allowed;
    }
  }
}

/* vremena */
.times {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;

  &__cell {
    padding: 13px 8px;
    text-align: center;
    border-radius: $r-md;
    font-size: 14px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    transition: background .2s ease, color .2s ease, border-color .2s ease;
    @include card($r-md);

    &:hover:not(:disabled):not(.is-active) { border-color: $line-2; }

    &.is-active {
      border-color: $ink;
      @include solid-ink;
    }

    &:disabled {
      color: rgba($muted, .55);
      cursor: not-allowed;
      text-decoration: line-through;
      background: color.adjust($bg, $lightness: -1%);
    }
  }
}

/* pregled */
.recap {
  margin-top: 26px;
  padding: 4px 18px;
  transition: border-color .25s ease;
  @include card;

  &.is-ready { border-color: $ink; }

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
    padding: 13px 0;
    border-bottom: 1px solid $line;
    font-size: 13.5px;

    &:last-child { border-bottom: none; }

    span { color: $muted; }
    strong { font-weight: 700; text-align: right; }

    &--total strong {
      font-size: 17px;
      font-weight: 800;
      font-variant-numeric: tabular-nums;
    }
  }
}

/* =============================================================
   CTA
   ============================================================= */
.cta {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 14px 22px calc(18px + env(safe-area-inset-bottom));
  background: linear-gradient(to top, $bg 62%, transparent);

  &__btn {
    width: 100%;
    padding: 17px;
    border-radius: 99px;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: .01em;
    box-shadow: 0 14px 30px rgba(17, 17, 16, .22);
    transition: transform .15s ease, opacity .2s ease;
    @include solid-ink;

    &:active:not(:disabled) { transform: scale(.98); }

    &:disabled {
      opacity: .25;
      cursor: not-allowed;
      box-shadow: none;
    }
  }
}

/* =============================================================
   modali
   ============================================================= */
.modal {
  position: absolute;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: end center;
  padding: 14px;
  background: rgba(17, 17, 16, .42);
  backdrop-filter: blur(4px);

  &--center { place-items: center; }

  &__card {
    width: 100%;
    padding: 26px 22px;
    border-radius: 26px;
    background: $paper;
    animation: sheet-in .32s cubic-bezier(.2, .9, .3, 1.1) both;

    h3 {
      font-size: 19px;
      font-weight: 800;
      letter-spacing: -.015em;
      margin-bottom: 16px;
    }

    &--center {
      text-align: center;

      h3 { margin-bottom: 2px; }
    }
  }

  &__actions {
    display: grid;
    grid-template-columns: 1fr 1.4fr;
    gap: 10px;
    margin-top: 18px;
  }
}

@keyframes sheet-in {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}

.field {
  display: grid;
  gap: 7px;
  margin-bottom: 12px;

  label {
    color: $muted;
    @include micro-label;
  }

  input {
    font: inherit;
    color: $ink;
    padding: 14px 15px;
    border-radius: $r-md;
    border: 1px solid $line-2;
    background: $bg;

    &::placeholder { color: rgba($muted, .75); }
    &:focus { outline: none; border-color: $ink; }
  }
}

.ghost {
  padding: 14px;
  border-radius: 99px;
  font-weight: 700;
  border: 1px solid $line-2;

  &:hover { border-color: $ink; }
}

.solid {
  padding: 14px;
  border-radius: 99px;
  font-weight: 700;
  @include solid-ink;

  &:disabled { opacity: .3; cursor: not-allowed; }

  &--wide { width: 100%; margin-top: 20px; }
}

.muted {
  color: $muted;
  font-size: 13px;

  b { color: $ink; font-weight: 700; }
}

.check {
  width: 60px;
  height: 60px;
  margin: 0 auto 14px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  @include solid-ink;
  @include icon(26px);
}

.rows {
  margin: 18px 0 0;
  border-top: 1px solid $line;
  text-align: left;

  div {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 11px 2px;
    border-bottom: 1px solid $line;
    font-size: 13.5px;

    dt { color: $muted; }
    dd { font-weight: 700; text-align: right; }
  }
}
</style>