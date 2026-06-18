<template>
  <div class="app">
    <div class="phone">

      <!-- ═════════════ gornji bar ═════════════ -->
      <header class="bar">
        <button v-if="openId !== null" class="bar__done" type="button" @click="openId = null">Gotovo</button>
        <h1 v-else class="bar__title">Termini</h1>

        <button v-if="openId === null" class="bar__add" type="button" aria-label="Novi termin" @click="sheetOpen = true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      </header>

      <!-- ═════════════ špil kartica ═════════════ -->
      <main class="wallet" :class="{ 'is-open': openId !== null }">

        <p v-if="passes.length === 0" class="wallet__empty">
          Nemaš zakazanih termina.<br />
          <button type="button" @click="sheetOpen = true">Dodaj prvi termin</button>
        </p>

        <article
          v-for="(p, i) in passes"
          :key="p.id"
          class="pass"
          :class="[`pass--${p.color}`, { 'is-front': openId === p.id, 'is-away': openId !== null && openId !== p.id }]"
          :style="passStyle(i)"
          @click="openId === null ? (openId = p.id) : null"
        >
          <!-- glava kartice, vidljiva i u špilu -->
          <div class="pass__head">
            <span class="pass__logo">✂︎ {{ p.shop }}</span>
            <span class="pass__time">{{ p.time }}</span>
          </div>

          <div class="pass__hero">
            <div>
              <small>Majstor</small>
              <strong>{{ p.barber }}</strong>
            </div>
            <img :src="img(p.slug, 110, 110)" alt="" />
          </div>

          <div class="pass__fields">
            <div><small>Datum</small><strong>{{ p.date }}</strong></div>
            <div><small>Vreme</small><strong>{{ p.time }}</strong></div>
            <div><small>Usluga</small><strong>{{ p.service }}</strong></div>
            <div><small>Cena</small><strong>{{ p.price }} RSD</strong></div>
          </div>

          <div class="pass__qrwrap">
            <div class="pass__qr" aria-hidden="true">
              <i v-for="(on, idx) in qrCells(p.code)" :key="idx" :class="{ 'is-on': on }" />
            </div>
            <small>№ {{ p.code }}</small>
          </div>
        </article>

        <!-- detalji ispod raširene kartice -->
        <div v-if="openPass" class="detail">
          <div class="detail__group">
            <div class="detail__row">
              <span>Gost</span><strong>{{ openPass.guest }}</strong>
            </div>
            <div class="detail__row">
              <span>Telefon</span><strong>{{ openPass.phone }}</strong>
            </div>
            <div class="detail__row">
              <span>Adresa</span><strong>Žarka Zrenjanina 14</strong>
            </div>
          </div>
          <button class="detail__remove" type="button" @click="removePass(openPass.id)">
            Ukloni ovaj termin
          </button>
        </div>
      </main>

      <!-- ═════════════ sheet: novi termin ═════════════ -->
      <div v-if="sheetOpen" class="dim" @click.self="closeSheet">
        <form class="sheet" role="dialog" aria-modal="true" aria-label="Novi termin" @submit.prevent="addPass">
          <i class="sheet__grab" aria-hidden="true" />
          <div class="sheet__bar">
            <button class="sheet__cancel" type="button" @click="closeSheet">Otkaži</button>
            <strong>Novi termin</strong>
            <span class="sheet__spacer" />
          </div>

          <div class="sheet__scroll">

            <p class="sec">Majstor</p>
            <div class="people">
              <button
                v-for="b in barbers"
                :key="b.id"
                class="people__chip"
                :class="{ 'is-active': barberId === b.id }"
                type="button"
                @click="pickBarber(b.id)"
              >
                <img :src="img(b.slug, 96, 96)" :alt="b.name" />
                <span>{{ b.name.split(' ')[0] }}</span>
              </button>
            </div>

            <p class="sec">Usluga</p>
            <div class="list">
              <button
                v-for="(s, i) in services"
                :key="s.id"
                class="list__row"
                :class="{ 'is-last': i === services.length - 1 }"
                type="button"
                @click="serviceId = s.id"
              >
                <span class="list__body">
                  <strong>{{ s.name }}</strong>
                  <small>{{ s.minutes }} min</small>
                </span>
                <span class="list__value">{{ formatPrice(s.price) }} RSD</span>
                <svg v-if="serviceId === s.id" class="list__check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>
              </button>
            </div>

            <p class="sec">Dan</p>
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

            <p class="sec">Vreme</p>
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
              <p v-if="slots.length === 0" class="times__hint">Izaberi majstora za dostupnost.</p>
            </div>

            <p class="sec">Podaci</p>
            <div class="list">
              <label class="list__row list__row--input">
                <span class="list__label">Ime</span>
                <input v-model.trim="guest.name" type="text" placeholder="Marko Petrović" autocomplete="name" required />
              </label>
              <label class="list__row list__row--input is-last">
                <span class="list__label">Telefon</span>
                <input v-model.trim="guest.phone" type="tel" placeholder="06x xxx xxxx" autocomplete="tel" required />
              </label>
            </div>

          </div>

          <div class="sheet__cta">
            <button class="addbtn" type="submit" :disabled="!canAdd">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="14" rx="3"/><path d="M3 10h18M7 3.5L9 6M17 3.5L15 6"/></svg>
              Dodaj u Wallet
            </button>
          </div>
        </form>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

/* ---------------- tipovi ---------------- */

type PassColor = 'graphite' | 'teal' | 'espresso' | 'plum' | 'navy'

interface Barber { id: number; slug: string; name: string }
interface Service { id: number; name: string; minutes: number; price: number }
interface Day { iso: string; weekday: string; dayNum: number; full: string; disabled: boolean }
interface Slot { time: string; taken: boolean }
interface Guest { name: string; phone: string }

interface Pass {
  id: number
  color: PassColor
  shop: string
  slug: string
  barber: string
  service: string
  date: string
  time: string
  price: string
  code: string
  guest: string
  phone: string
}

/* ---------------- placeholder slike (zameni svojim) ---------------- */
const img = (seed: string, w: number, h: number): string =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`

/* ---------------- dummy podaci ---------------- */

const barbers: Barber[] = [
  { id: 1, slug: 'nikola-w', name: 'Nikola Janković' },
  { id: 2, slug: 'luka-w',   name: 'Luka Stanić' },
  { id: 3, slug: 'vuk-w',    name: 'Vuk Đorđević' },
  { id: 4, slug: 'milos-w',  name: 'Miloš Radovanović' },
]

const services: Service[] = [
  { id: 1, name: 'Šišanje makazama',  minutes: 40, price: 1400 },
  { id: 2, name: 'Skin fade',         minutes: 45, price: 1500 },
  { id: 3, name: 'Brijanje britvom',  minutes: 35, price: 1200 },
  { id: 4, name: 'Oblikovanje brade', minutes: 30, price: 1000 },
  { id: 5, name: 'Kompletan tretman', minutes: 80, price: 2600 },
]

const COLORS: readonly PassColor[] = ['graphite', 'teal', 'espresso', 'plum', 'navy']

const WEEKDAYS = ['Ned', 'Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub'] as const
const MONTHS = ['januar', 'februar', 'mart', 'april', 'maj', 'jun', 'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'] as const

const SLOT_TIMES: readonly string[] = [
  '09:00', '09:45', '10:30', '11:15', '12:00', '14:00', '14:45', '15:30', '16:15', '17:00', '17:45', '18:30',
]

const toIso = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

const days: Day[] = (() => {
  const out: Day[] = []
  const now = new Date()
  for (let i = 0; i < 12; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() + i)
    out.push({
      iso: toIso(d),
      weekday: WEEKDAYS[d.getDay()],
      dayNum: d.getDate(),
      full: `${d.getDate()}. ${MONTHS[d.getMonth()]}`,
      disabled: d.getDay() === 0,
    })
  }
  return out
})()

const firstOpen = days.find((d) => !d.disabled)

/* hash za zauzetost i QR */
function hash(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h
}

const isTaken = (barberId: number, iso: string, time: string): boolean =>
  hash(`${barberId}|${iso}|${time}`) % 10 < 3

/* QR 21×21 sa finder kvadratima */
function qrCells(code: string): boolean[] {
  const cells: boolean[] = []
  for (let i = 0; i < 21 * 21; i++) {
    const row = Math.floor(i / 21)
    const col = i % 21
    const inFinder = (row < 7 && col < 7) || (row < 7 && col > 13) || (row > 13 && col < 7)
    if (inFinder) {
      const r = row > 13 ? row - 14 : row
      const c = col > 13 ? col - 14 : col
      cells.push(r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4))
    } else {
      cells.push(hash(`${code}|${i}`) % 5 < 2)
    }
  }
  return cells
}

/* ---------------- stanje ---------------- */

let nextId = 3

/* dva postojeća termina u špilu */
const passes = ref<Pass[]>([
  {
    id: 1, color: 'teal', shop: 'Oštrica', slug: 'vuk-w',
    barber: 'Vuk Đorđević', service: 'Brijanje britvom',
    date: days[1]?.full ?? '', time: '11:15', price: '1.200',
    code: 'OŠ482913', guest: 'Marko Petrović', phone: '064 555 014',
  },
  {
    id: 2, color: 'espresso', shop: 'Oštrica', slug: 'luka-w',
    barber: 'Luka Stanić', service: 'Skin fade',
    date: days[4]?.full ?? '', time: '17:45', price: '1.500',
    code: 'OŠ127755', guest: 'Marko Petrović', phone: '064 555 014',
  },
])

const openId    = ref<number | null>(null)
const sheetOpen = ref(false)

const barberId  = ref<number | null>(null)
const serviceId = ref<number | null>(null)
const dayIso    = ref<string | null>(firstOpen?.iso ?? null)
const slotTime  = ref<string | null>(null)
const guest     = reactive<Guest>({ name: '', phone: '' })

/* ---------------- izvedeno ---------------- */

const openPass = computed<Pass | null>(() => passes.value.find((p) => p.id === openId.value) ?? null)

const chosenBarber  = computed<Barber | null>(() => barbers.find((b) => b.id === barberId.value) ?? null)
const chosenService = computed<Service | null>(() => services.find((s) => s.id === serviceId.value) ?? null)
const chosenDay     = computed<Day | null>(() => days.find((d) => d.iso === dayIso.value) ?? null)

const slots = computed<Slot[]>(() => {
  if (barberId.value === null || dayIso.value === null) return []
  return SLOT_TIMES.map((time) => ({
    time,
    taken: isTaken(barberId.value as number, dayIso.value as string, time),
  }))
})

const chosenTime = computed<string | null>(() => {
  const s = slots.value.find((t) => t.time === slotTime.value)
  return s && !s.taken ? s.time : null
})

const canAdd = computed<boolean>(() =>
  Boolean(chosenBarber.value && chosenService.value && chosenDay.value && chosenTime.value && guest.name && guest.phone),
)

/* pozicija kartice u špilu */
function passStyle(index: number): Record<string, string> {
  return { '--i': String(index) }
}

/* ---------------- akcije ---------------- */

function pickBarber(id: number): void {
  barberId.value = id
  slotTime.value = null
}

function pickDay(iso: string): void {
  dayIso.value = iso
  slotTime.value = null
}

function addPass(): void {
  if (!canAdd.value) return
  const p: Pass = {
    id: nextId++,
    color: COLORS[passes.value.length % COLORS.length],
    shop: 'Oštrica',
    slug: chosenBarber.value!.slug,
    barber: chosenBarber.value!.name,
    service: chosenService.value!.name,
    date: chosenDay.value!.full,
    time: chosenTime.value!,
    price: formatPrice(chosenService.value!.price),
    code: 'OŠ' + String(Math.floor(100000 + Math.random() * 900000)),
    guest: guest.name,
    phone: guest.phone,
  }
  passes.value.push(p)
  closeSheet()
  /* nova kartica se odmah raširi, kao u Walletu */
  window.setTimeout(() => { openId.value = p.id }, 320)
}

function removePass(id: number): void {
  openId.value = null
  window.setTimeout(() => {
    passes.value = passes.value.filter((p) => p.id !== id)
  }, 260)
}

function closeSheet(): void {
  sheetOpen.value = false
  barberId.value = null
  serviceId.value = null
  slotTime.value = null
  guest.name = ''
  guest.phone = ''
}

function formatPrice(n: number): string {
  return n.toLocaleString('sr-Latn-RS')
}
</script>

<style lang="scss">
/* =============================================================
   Wallet · barber booking — Apple Wallet jezik, crno + pass kartice
   ============================================================= */
@use "sass:list";
@use "sass:color";

/* -- SCSS varijable ------------------------------------------- */
$bg:       #000000;                     // Wallet je čisto crn
$label:    #ffffff;
$label-2:  rgba(235, 235, 245, .6);
$label-3:  rgba(235, 235, 245, .3);
$fill:     rgba(120, 120, 128, .24);
$blue:     #0a84ff;                     // systemBlue (dark)
$red:      #ff453a;                     // systemRed (dark)
$sheet-bg: #1c1c1e;
$sep:      rgba(84, 84, 88, .65);

/* boje pass kartica — prigušene, premium */
$pass-colors: (
  "graphite": (#3a3a3c, #232325),
  "teal":     (#0e4f5c, #082e36),
  "espresso" : (#4a3528, #2b1d15),
  "plum":     (#46305c, #281a38),
  "navy":     (#243b66, #14213d),
);



$f: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'Segoe UI', sans-serif;

$pass-peek: 74px;     /* koliko kartica viri u špilu */
$phone-w: 430px;

/* -- mixini ----------------------------------------------------- */
@mixin press {
  transition: opacity .12s ease;

  &:active:not(:disabled) { opacity: .55; }
}

@mixin icon($s: 20px) {
  svg { width: $s; height: $s; display: block; }
}

@mixin hide-scrollbar {
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
}

/* -- globalno ------------------------------------------------------ */
*,
*::before,
*::after { margin: 0; padding: 0; box-sizing: border-box; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}

body {
  background: $bg;
  color: $label;
  font-family: $f;
  font-size: 17px;
  line-height: 1.32;
  -webkit-font-smoothing: antialiased;
}

img { display: block; max-width: 100%; }

::selection { background: rgba($blue, .4); }

:focus-visible { outline: 2px solid $blue; outline-offset: 2px; }

button { font: inherit; color: inherit; background: none; border: none; cursor: pointer; }

/* =============================================================
   okvir telefona
   ============================================================= */
.app {
  min-height: 100dvh;
  display: grid;
  place-items: start center;
  background: #0a0a0a;

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
    height: min(900px, calc(100dvh - 64px));
    border-radius: 44px;
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, .08),
      0 40px 90px rgba(0, 0, 0, .8);
  }
}

/* =============================================================
   gornji bar
   ============================================================= */
.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 64px;
  padding: 16px 20px 8px;

  &__title {
    font-size: 34px;
    font-weight: 700;
    letter-spacing: -.022em;
  }

  &__done {
    font-size: 17px;
    font-weight: 600;
    color: $blue;
    @include press;
  }

  &__add {
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: $fill;
    @include press;
    @include icon(17px);
  }
}

/* =============================================================
   špil
   ============================================================= */
.wallet {
  position: relative;
  flex: 1;
  margin: 8px 16px 0;
  overflow-y: auto;
  @include hide-scrollbar;

  &__empty {
    padding-top: 38vh;
    text-align: center;
    color: $label-2;
    font-size: 15px;
    line-height: 2;

    button {
      color: $blue;
      font-weight: 600;
      @include press;
    }
  }
}

/* =============================================================
   pass kartica
   ============================================================= */
.pass {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(var(--i) * #{$pass-peek});
  border-radius: 18px;
  overflow: hidden;
  cursor: pointer;
  box-shadow:
    0 -6px 18px rgba(0, 0, 0, .55),
    0 1px 0 rgba(255, 255, 255, .06) inset;
  transition:
    top .5s cubic-bezier(.25, .9, .3, 1),
    transform .5s cubic-bezier(.25, .9, .3, 1),
    opacity .35s ease;

  /* boje po varijanti */
  @each $name, $pair in $pass-colors {
    &--#{$name} {
      background:
        radial-gradient(120% 90% at 85% 0%, rgba(255, 255, 255, .1), transparent 55%),
        linear-gradient(160deg, list.nth($pair, 1), list.nth($pair, 2));
    }
  }

  /* raširena kartica */
  &.is-front {
    top: 0;
    cursor: default;
    z-index: 5;
  }

  /* ostale klize dole van ekrana */
  &.is-away {
    transform: translateY(120vh);
    opacity: 0;
    pointer-events: none;
  }

  &__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 17px 18px 15px;
    border-bottom: .5px solid rgba(255, 255, 255, .14);
  }

  &__logo {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -.01em;
  }

  &__time {
    font-size: 15px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: rgba(255, 255, 255, .8);
  }

  &__hero {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 18px;

    small {
      display: block;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: .08em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, .55);
      margin-bottom: 3px;
    }

    strong {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -.015em;
    }

    img {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      object-fit: cover;
      border: 1.5px solid rgba(255, 255, 255, .3);
    }
  }

  &__fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px 12px;
    padding: 0 18px 18px;

    small {
      display: block;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: .08em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, .55);
      margin-bottom: 2px;
    }

    strong {
      font-size: 15px;
      font-weight: 600;
      letter-spacing: -.01em;
    }
  }

  &__qrwrap {
    padding: 0 18px 18px;
    display: grid;
    justify-items: center;
    gap: 8px;

    small {
      font-size: 11px;
      color: rgba(255, 255, 255, .55);
      font-variant-numeric: tabular-nums;
    }
  }

  &__qr {
    width: 132px;
    padding: 9px;
    border-radius: 10px;
    background: #fff;
    display: grid;
    grid-template-columns: repeat(21, 1fr);
    gap: 1px;

    i {
      aspect-ratio: 1;
      background: transparent;

      &.is-on { background: #111; }
    }
  }
}

/* detalji ispod raširene kartice */
.detail {
  position: absolute;
  left: 0;
  right: 0;
  top: 460px;
  animation: fade-up .4s .25s ease both;

  &__group {
    background: $sheet-bg;
    border-radius: 12px;
    overflow: hidden;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 13px 16px;
    border-bottom: .5px solid $sep;
    font-size: 15px;

    &:last-child { border-bottom: none; }

    span { color: $label-2; }
    strong { font-weight: 600; }
  }

  &__remove {
    width: 100%;
    margin-top: 14px;
    padding: 14px;
    border-radius: 12px;
    background: $sheet-bg;
    color: $red;
    font-size: 17px;
    @include press;
  }
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* =============================================================
   sheet: novi termin
   ============================================================= */
.dim {
  position: absolute;
  inset: 0;
  z-index: 60;
  display: grid;
  align-items: end;
  background: rgba(0, 0, 0, .5);
}

.sheet {
  display: flex;
  flex-direction: column;
  max-height: 92%;
  background: $sheet-bg;
  border-radius: 16px 16px 0 0;
  animation: sheet-up .38s cubic-bezier(.2, .9, .3, 1) both;

  &__grab {
    display: block;
    width: 36px;
    height: 5px;
    margin: 8px auto 2px;
    border-radius: 99px;
    background: rgba(235, 235, 245, .25);
    flex: 0 0 auto;
  }

  &__bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px 14px;
    flex: 0 0 auto;

    strong { font-size: 17px; font-weight: 600; }
  }

  &__cancel {
    font-size: 17px;
    color: $blue;
    @include press;
  }

  &__spacer { width: 48px; }

  &__scroll {
    flex: 1;
    overflow-y: auto;
    padding: 0 16px 16px;
    @include hide-scrollbar;
  }

  &__cta {
    flex: 0 0 auto;
    padding: 12px 16px calc(16px + env(safe-area-inset-bottom));
    border-top: .5px solid $sep;
  }
}

@keyframes sheet-up {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}

.sec {
  margin: 18px 0 8px;
  padding: 0 2px;
  font-size: 13px;
  letter-spacing: .04em;
  text-transform: uppercase;
  color: $label-2;
}

/* majstori, čipovi sa avatarima */
.people {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  margin: 0 -16px;
  padding: 2px 16px;
  @include hide-scrollbar;

  &__chip {
    flex: 0 0 76px;
    display: grid;
    justify-items: center;
    gap: 7px;
    padding: 10px 4px;
    border-radius: 14px;
    background: rgba(120, 120, 128, .16);
    transition: box-shadow .15s ease, background .15s ease;
    @include press;

    img {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      object-fit: cover;
    }

    span { font-size: 12px; font-weight: 600; }

    &.is-active {
      background: rgba($blue, .22);
      box-shadow: inset 0 0 0 1.5px $blue;
    }
  }
}

/* grouped lista u sheetu */
.list {
  background: rgba(120, 120, 128, .16);
  border-radius: 12px;
  overflow: hidden;

  &__row {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    min-height: 50px;
    text-align: left;
    @include press;

    &::after {
      content: '';
      position: absolute;
      left: 16px;
      right: 0;
      bottom: 0;
      height: .5px;
      background: $sep;
    }

    &.is-last::after { display: none; }

    &--input {
      cursor: text;

      .list__label { flex: 0 0 86px; font-size: 17px; }

      input {
        flex: 1;
        border: none;
        background: none;
        font: inherit;
        color: $label;

        &::placeholder { color: $label-3; }
        &:focus { outline: none; }
      }
    }
  }

  &__body {
    flex: 1;
    min-width: 0;

    strong { display: block; font-size: 16px; font-weight: 400; }
    small { display: block; font-size: 13px; color: $label-2; }
  }

  &__value {
    font-size: 15px;
    color: $label-2;
    font-variant-numeric: tabular-nums;
  }

  &__check {
    width: 20px;
    height: 20px;
    flex: 0 0 auto;
    color: $blue;
  }
}

/* dani */
.days {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  margin: 0 -16px;
  padding: 0 16px;
  @include hide-scrollbar;

  &__chip {
    flex: 0 0 50px;
    display: grid;
    justify-items: center;
    gap: 5px;
    padding: 9px 2px 10px;
    border-radius: 10px;
    @include press;

    small {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      color: $label-2;
    }

    span {
      width: 32px;
      height: 32px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      font-size: 16px;
      font-weight: 500;
      font-variant-numeric: tabular-nums;
      transition: background .15s ease;
    }

    &.is-active span {
      background: $blue;
      font-weight: 600;
    }

    &:disabled { opacity: .3; cursor: not-allowed; }
  }
}

/* vremena */
.times {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;

  &__cell {
    padding: 11px 6px;
    text-align: center;
    border-radius: 9px;
    background: rgba(120, 120, 128, .16);
    font-size: 15px;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    transition: background .15s ease, color .15s ease, box-shadow .15s ease;
    @include press;

    &.is-active {
      background: rgba($blue, .22);
      color: $blue;
      font-weight: 600;
      box-shadow: inset 0 0 0 1.5px $blue;
    }

    &:disabled {
      color: $label-3;
      cursor: not-allowed;
      text-decoration: line-through;
    }
  }

  &__hint {
    grid-column: 1 / -1;
    padding: 12px;
    text-align: center;
    font-size: 14px;
    color: $label-2;
  }
}

/* "Dodaj u Wallet" dugme */
.addbtn {
  width: 100%;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 14px;
  background: #fff;
  color: #000;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -.01em;
  @include press;
  @include icon(20px);

  &:disabled {
    background: rgba(120, 120, 128, .24);
    color: $label-3;
    cursor: not-allowed;
    // display: none;
  }
}
</style>