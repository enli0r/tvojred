<template>
  <div class="xekoncqx">
    <div class="x5aafedq">

      <!-- ╔══════════════ EKRAN 1 · uvodna ══════════════╗ -->
      <section v-if="screen === 'intro'" class="xgcm5od9">
        <img class="xjyok6om" :src="berberUvod" alt="" />
        <div class="xilo41tl"> </div>

        <div class="xmoslvsc">
          <h1>Pronađi svoj<br />stil <em>danas</em></h1>
          <p>
            Pronađi svoj stil uz majstore kojima veruješ — šišanje, brada i nega,
            sve na jednom mestu, prilagođeno baš tebi.
          </p>

          <!-- slajder: prevuci desno za početak -->
          <div
            ref="trackEl"
            class="xhkbnqih"
            :class="{ 'xbakqqpu': dragging, 'x26h58y3': slid }"
          >
            <button
              class="x85xv42z"
              type="button"
              :style="{ transform: `translateX(${knobX}px)` }"
              aria-label="Prevuci desno ili pritisni Enter za početak"
              @pointerdown="dragStart"
              @pointermove="dragMove"
              @pointerup="dragEnd"
              @pointercancel="dragEnd"
              @keydown.enter="openBooking"
              @keydown.space.prevent="openBooking"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.6 7.8L20 19M8.6 16.2L20 5"/></svg>
            </button>

            <span class="x0okdzoo">Prevuci za početak</span>

            <span class="xwt9dl65" aria-hidden="true">
              <i>›</i><i>›</i><i>›</i>
            </span>
          </div>
        </div>
      </section>

      <!-- ╔══════════════ EKRAN 2 · zakazivanje ══════════════╗ -->
      <section v-else class="xo4lmrva">
        <div class="xohvlfyp">
          <img :src="barberSlika" alt="Pro berbernica" />

          <button class="x2labd5b xy30fk05 xki5xhwp" type="button" aria-label="Nazad" @click="backToIntro">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 5l-7 7 7 7"/></svg>
          </button>
          <button class="x2labd5b xy30fk05 x4z9hd33" type="button" aria-label="Više opcija">
            <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>
          </button>
        </div>

        <div class="xiba5n94">
          <div class="xlbllqty">

            <div class="xkdv1w8k">
              <div>
                <h2>Relja Anđelković</h2>
                <p class="x5tjgxzs">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>
                  <b>4.7</b> (116) <em>Pro berbernica</em>
                </p>
              </div>
              <button
                class="x2labd5b x710mmog"
                :class="{ 'xtao48p8': favorite }"
                type="button"
                :aria-label="favorite ? 'Ukloni iz omiljenih' : 'Dodaj u omiljene'"
                :aria-pressed="favorite"
                @click="favorite = !favorite"
              >
                <svg viewBox="0 0 24 24" :fill="favorite ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 21C7 17.5 3 14 3 9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 9 2.5c0 4.5-4 8-9 11.5z"/></svg>
              </button>
            </div>

            <!-- tabovi -->
            <div class="xuf728le" role="tablist">
              <button
                v-for="t in tabs"
                :key="t"
                class="xauigw5p"
                :class="{ 'xvjzldgt': tab === t }"
                type="button"
                role="tab"
                :aria-selected="tab === t"
                @click="tab = t"
              >
                {{ t }}
              </button>
            </div>

            <!-- TAB · Termin -->
            <template v-if="tab === 'Termin'">
              <h3 class="x7fr9l9x">{{ monthLabel }}</h3>

              <div class="xs5x8eab">
                <button
                  v-for="d in days"
                  :key="d.iso"
                  class="xx8d0e30"
                  :class="{ 'xvjzldgt': dayIso === d.iso }"
                  :disabled="d.disabled"
                  type="button"
                  @click="pickDay(d.iso)"
                >
                  <small>{{ d.weekday }}</small>
                  <span>{{ d.dayNum }}</span>
                </button>
              </div>

              <h3 class="x7fr9l9x">Usluga</h3>
              <div class="x3n7pq2v" role="radiogroup" aria-label="Izaberite uslugu">
                <button
                  v-for="service in services"
                  :key="service.id"
                  class="xk8m1d5r"
                  :class="{ 'x9vtr0qe': serviceId === service.id }"
                  type="button"
                  role="radio"
                  :aria-checked="serviceId === service.id"
                  @click="pickService(service.id)"
                >
                  <span class="xh4p8s6a">
                    <strong class="xw2c7n1l">{{ service.name }}</strong>
                    <small class="xq6j0f8b">{{ service.description }}</small>
                  </span>

                  <span class="xz5u4e9k">
                    <small class="xj1b6r3y">{{ service.duration }} min</small>
                    <strong class="xp0a9m2d">{{ formatPrice(service.price) }}</strong>
                  </span>

                  <span class="x7h2v4n8c" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>
                  </span>
                </button>
              </div>

              <h3 class="x7fr9l9x">Vreme</h3>
              <div v-if="!chosenService" class="x3y6k0p5m">
                Izaberite uslugu da biste videli dostupne termine.
              </div>
              <div v-else class="xxofnajm">
                <button
                  v-for="t in slots"
                  :key="t.time"
                  class="x7qe4u3q"
                  :class="{ 'xvjzldgt': chosenTime === t.time }"
                  :disabled="t.taken"
                  type="button"
                  @click="slotTime = t.time"
                >
                  {{ t.time }}
                </button>
              </div>

              <div class="xknsknrh" :class="{ 'xu4yl02z': !chosenTime }">
                <span class="x7rkul5x">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="4"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                  {{ chosenDay ? chosenDay.full : 'Izaberi dan' }}
                </span>
                <span class="xcmicai0">{{ chosenTime ? `${chosenTime} – ${endTime}` : '—' }}</span>
              </div>
            </template>

            <!-- TAB · O nama -->
            <template v-else-if="tab === 'O nama'">
              <p class="x7i780xb">
                Pro berbernica u centru grada — preko deset godina iskustva u klasičnom
                šišanju, fade tehnikama i brijanju britvom. Radimo isključivo po zakazivanju,
                uz premium preparate i topli peškir na kraju svakog tretmana.
              </p>
              <div class="x0wtroiz">
                <img v-for="n in 4" :key="n" :src="img('rad-' + n, 320, 320)" alt="" />
              </div>
            </template>

            <!-- TAB · Recenzije -->
            <template v-else>
              <article v-for="r in reviews" :key="r.name" class="xnayghe6">
                <img :src="img(r.name, 80, 80)" alt="" />
                <div>
                  <strong>{{ r.name }} <i>{{ '★'.repeat(r.stars) }}</i></strong>
                  <small>{{ r.text }}</small>
                </div>
              </article>
            </template>

          </div>

          <!-- CTA -->
          <div v-if="tab === 'Termin'" class="x9t0o5pu">
            <button class="xq6yc2ra" type="button" :disabled="!canBook" @click="askDetails = true">
              Zakaži termin
            </button>
          </div>
        </div>
      </section>

      <!-- ───────── podaci o gostu ───────── -->
      <div v-if="askDetails" class="x0u89eju" role="dialog" aria-modal="true" aria-label="Vaši podaci">
        <form class="xyuiod91 x6q1m9v4c" @submit.prevent="confirmBooking">
          <header class="x2p8f0r7n">
            <h3>Još samo podaci</h3>
            <p class="x5t3k8d1a">Unesite podatke za rezervaciju</p>
          </header>

          <div class="xspt33sr">
            <label for="m-name">Ime i prezime</label>
            <input id="m-name" v-model.trim="customer.name" type="text" placeholder="Marko Petrović" autocomplete="name" required />
          </div>
          <div class="xspt33sr">
            <label for="m-phone">Broj telefona</label>
            <input id="m-phone" v-model.trim="customer.phone" type="tel" placeholder="06x xxx xxxx" autocomplete="tel" required />
          </div>

          <div class="xh29nux3">
            <button class="x8cfp4lx" type="button" @click="askDetails = false">Otkaži</button>
            <button class="xxl388fl" type="submit" :disabled="!customer.name || !customer.phone">Potvrdi</button>
          </div>
        </form>
      </div>

      <!-- ───────── potvrda ───────── -->
      <div v-if="ticket" class="x0u89eju xbo2wyly" role="dialog" aria-modal="true" aria-label="Termin potvrđen">
        <div class="xyuiod91 xjltxqan">
          <span class="x3plorq9">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>
          </span>
          <h3>Vidimo se!</h3>
          <p class="xszp88ow">Termin <b>№ {{ ticket.code }}</b> je potvrđen.</p>

          <dl class="xdpowb1m">
            <div><dt>Berbernica</dt><dd>Relja Anđelković</dd></div>
            <div><dt>Gost</dt><dd>{{ ticket.name }}</dd></div>
            <div><dt>Usluga</dt><dd>{{ ticket.service }}</dd></div>
            <div><dt>Cena</dt><dd>{{ ticket.price }}</dd></div>
            <div><dt>Datum</dt><dd>{{ ticket.date }}</dd></div>
            <div><dt>Vreme</dt><dd>{{ ticket.time }}</dd></div>
          </dl>

          <button class="xxl388fl x5e11fh2" type="button" @click="resetAll">U redu</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import berberUvod from '@/assets/img/bg-intro.png'
import barberSlika from '@/assets/img/barber-intro.jpg';

/* ---------------- tipovi ---------------- */

type Screen = 'intro' | 'booking'
type Tab = 'Termin' | 'O nama' | 'Recenzije'

interface Day { iso: string; weekday: string; dayNum: number; full: string; disabled: boolean }
interface Slot { time: string; taken: boolean }
interface Service { id: string; name: string; description: string; duration: number; price: number }
interface Review { name: string; stars: number; text: string }
interface Customer { name: string; phone: string }
interface Ticket { code: string; name: string; service: string; price: string; date: string; time: string }

/* ---------------- placeholder slike (zameni svojim) ---------------- */
const img = (seed: string, w: number, h: number): string =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`

/* ---------------- dummy podaci ---------------- */

const tabs: Tab[] = ['Termin', 'O nama', 'Recenzije']

const services: Service[] = [
  {
    id: 'classic-cut',
    name: 'Klasično šišanje',
    description: 'Konsultacija, šišanje i završno stilizovanje.',
    duration: 45,
    price: 1400,
  },
  {
    id: 'fade-cut',
    name: 'Fade šišanje',
    description: 'Precizan prelaz, konture i završno stilizovanje.',
    duration: 60,
    price: 1700,
  },
  {
    id: 'cut-and-beard',
    name: 'Šišanje + brada',
    description: 'Kompletno šišanje i oblikovanje brade.',
    duration: 75,
    price: 2300,
  },
  {
    id: 'beard-detail',
    name: 'Uređivanje brade',
    description: 'Skraćivanje, precizne konture i nega brade.',
    duration: 30,
    price: 1000,
  },
  {
    id: 'premium-ritual',
    name: 'Premium ritual',
    description: 'Šišanje, brada, britva, topli peškir i nega.',
    duration: 90,
    price: 3200,
  },
]

const reviews: Review[] = [
  { name: 'Marko',  stars: 5, text: 'Najprecizniji fade koji sam ikada dobio. Termin tačan u minut.' },
  { name: 'Stefan', stars: 5, text: 'Brijanje britvom i topli peškir — ritual koji vredi svakog dinara.' },
  { name: 'Nikola', stars: 4, text: 'Sve pohvale, samo je subotom teže naći slobodan termin.' },
  { name: 'Luka',   stars: 5, text: 'Atmosfera, muzika, razgovor — i frizura naravno. Preporuka!' },
]

const WEEKDAYS = ['Ned', 'Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub'] as const
const WEEKDAYS_FULL = ['Nedelja', 'Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota'] as const
const MONTHS = ['januar', 'februar', 'mart', 'april', 'maj', 'jun', 'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'] as const

const SLOT_TIMES: readonly string[] = [
  '09:30', '10:30', '11:30', '12:30', '13:30', '15:30', '16:30', '17:30', '18:30',
]

const toIso = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

/* narednih 14 dana, nedelja neradna */
const days: Day[] = (() => {
  const out: Day[] = []
  const now = new Date()
  for (let i = 0; i < 14; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() + i)
    out.push({
      iso: toIso(d),
      weekday: WEEKDAYS[d.getDay()],
      dayNum: d.getDate(),
      full: `${WEEKDAYS_FULL[d.getDay()]}, ${d.getDate()}. ${MONTHS[d.getMonth()]}`,
      disabled: d.getDay() === 0,
    })
  }
  return out
})()

const firstOpen = days.find((d) => !d.disabled)

const monthLabel: string = (() => {
  const d = new Date()
  const m = MONTHS[d.getMonth()]
  return `${m.charAt(0).toUpperCase()}${m.slice(1)} ${d.getFullYear()}.`
})()

/* deterministička "zauzetost" */
function isTaken(iso: string, time: string): boolean {
  const str = `${iso}|${time}`
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h % 10 < 3
}

/* ---------------- stanje ---------------- */

const screen   = ref<Screen>('intro')
const tab      = ref<Tab>('Termin')
const favorite = ref(false)

const dayIso   = ref<string | null>(firstOpen?.iso ?? null)
const serviceId = ref<string | null>(null)
const slotTime = ref<string | null>(null)

const askDetails = ref(false)
const customer   = reactive<Customer>({ name: '', phone: '' })
const ticket     = ref<Ticket | null>(null)

/* ---------------- slajder "prevuci za početak" ---------------- */

const trackEl  = ref<HTMLElement | null>(null)
const knobX    = ref(0)
const dragging = ref(false)
const slid     = ref(false)

const KNOB = 58   // širina dugmeta
const PAD  = 6    // unutrašnja margina šine

function maxX(): number {
  return trackEl.value ? trackEl.value.clientWidth - KNOB - PAD * 2 : 0
}

let startPointerX = 0

function dragStart(e: PointerEvent): void {
  dragging.value = true
  startPointerX = e.clientX - knobX.value
  ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
}

function dragMove(e: PointerEvent): void {
  if (!dragging.value) return
  knobX.value = Math.min(Math.max(0, e.clientX - startPointerX), maxX())
}

function dragEnd(): void {
  if (!dragging.value) return
  dragging.value = false
  if (knobX.value >= maxX() * 0.7) {
    knobX.value = maxX()
    slid.value = true
    window.setTimeout(openBooking, 180)
  } else {
    knobX.value = 0
  }
}

function openBooking(): void {
  screen.value = 'booking'
}

function backToIntro(): void {
  screen.value = 'intro'
  slid.value = false
  knobX.value = 0
}

/* ---------------- izvedeno ---------------- */

const chosenDay = computed<Day | null>(() => days.find((d) => d.iso === dayIso.value) ?? null)

const chosenService = computed<Service | null>(() =>
  services.find((service) => service.id === serviceId.value) ?? null,
)

const slots = computed<Slot[]>(() => {
  if (!dayIso.value || !chosenService.value) return []
  return SLOT_TIMES.map((time) => ({
    time,
    taken: isTaken(`${dayIso.value}|${chosenService.value!.id}`, time),
  }))
})

const chosenTime = computed<string | null>(() => {
  const s = slots.value.find((t) => t.time === slotTime.value)
  return s && !s.taken ? s.time : null
})

/* kraj termina se računa prema trajanju izabrane usluge */
const endTime = computed<string>(() => {
  if (!chosenTime.value || !chosenService.value) return ''

  const [hours, minutes] = chosenTime.value.split(':').map(Number)
  const totalMinutes = hours * 60 + minutes + chosenService.value.duration
  const endHours = Math.floor(totalMinutes / 60) % 24
  const endMinutes = totalMinutes % 60

  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`
})

const canBook = computed<boolean>(() =>
  Boolean(chosenDay.value && chosenService.value && chosenTime.value),
)

/* ---------------- akcije ---------------- */

function pickDay(iso: string): void {
  dayIso.value = iso
  slotTime.value = null
}

function pickService(id: string): void {
  serviceId.value = id
  slotTime.value = null
}

function formatPrice(price: number): string {
  return `${new Intl.NumberFormat('sr-RS').format(price)} RSD`
}

function confirmBooking(): void {
  if (!canBook.value || !customer.name || !customer.phone) return
  askDetails.value = false
  ticket.value = {
    code: 'RA-' + String(Math.floor(1000 + Math.random() * 9000)),
    name: customer.name,
    service: chosenService.value!.name,
    price: formatPrice(chosenService.value!.price),
    date: chosenDay.value!.full,
    time: `${chosenTime.value} – ${endTime.value}`,
  }
}

function resetAll(): void {
  ticket.value = null
  customer.name = ''
  customer.phone = ''
  serviceId.value = null
  slotTime.value = null
  backToIntro()
}
</script>

<style lang="scss">
/* =============================================================
   Berber app · svetla tema — krem + narandžasta (po referenci)
   ============================================================= */

@use 'sass:color';

/* -- SCSS varijable ------------------------------------------- */
$bg:      #f1eae1;   // topli krem okvir
$paper:   #ffffff;   // beli sheet
$ink:     #221d17;
$muted:   #9a9189;
$accent:  #f06a1d;   // narandžasta sa reference
$on-acc:  #fff7f1;
$dark:    #181410;   // tamni paneli (uvodna, slajder)
$line:    rgba(34, 29, 23, .09);

$f: 'Manrope', system-ui, sans-serif;

$r-xl: 30px;
$r-lg: 20px;
$r-md: 14px;

$phone-w: 430px;

/* -- mixini ----------------------------------------------------- */
@mixin accent {
  background: $accent;
  color: $on-acc;
}

@mixin chip($r: 99px) {
  background: $paper;
  border: 1px solid $line;
  border-radius: $r;
}

@mixin icon($s: 20px) {
  svg { width: $s; height: $s; display: block; }
}

@mixin hide-scrollbar {
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
}

/* -- font --------------------------------------------------------- */
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

/* -- globalno ------------------------------------------------------ */
*,
*::before,
*::after { margin: 0; padding: 0; box-sizing: border-box; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}

body {
  background: $bg;
  color: $ink;
  font-family: $f;
  font-size: 15px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

img { display: block; max-width: 100%; }

::selection { background: $accent; color: $on-acc; }

:focus-visible { outline: 2px solid $accent; outline-offset: 2px; }

button { font: inherit; color: inherit; background: none; border: none; cursor: pointer; }

/* =============================================================
   okvir telefona
   ============================================================= */
.xekoncqx {
  min-height: 100dvh;
  display: grid;
  place-items: start center;
  background: $bg;

  @media (min-width: 560px) {
    place-items: center;
    padding: 32px 16px;
  }
}

.x5aafedq {
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
    border-radius: 40px;
    box-shadow: 0 40px 90px rgba(34, 29, 23, .25);
  }
}

/* okrugla dugmad */
.x2labd5b {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  @include chip(50%);
  @include icon(18px);

  &.xy30fk05 {
    background: rgba(24, 20, 16, .45);
    border-color: rgba(255, 255, 255, .25);
    color: #fff;
    backdrop-filter: blur(6px);
  }
}

/* =============================================================
   EKRAN 1 · uvodna
   ============================================================= */
.xgcm5od9 {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;

  .xjyok6om {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(.9) contrast(1.02);
  }

  .xilo41tl {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.4);
  }

  .xmoslvsc {
    position: relative;
    width: 100%;
    padding: 0 26px calc(34px + env(safe-area-inset-bottom));
    color: #f5efe8;

    h1 {
      font-size: clamp(34px, 9vw, 42px);
      font-weight: 800;
      line-height: 1.12;
      letter-spacing: -.01em;

      em {
        font-style: normal;
        color: $accent;
      }
    }

    p {
      margin: 14px 0 30px;
      max-width: 34ch;
      font-size: 13.5px;
      color: rgba(245, 239, 232, .72);
    }
  }
}

/* slajder "prevuci za početak" */
.xhkbnqih {
  position: relative;
  height: 70px;
  border-radius: 99px;
  background: rgba(24, 20, 16, .72);
  border: 1px solid rgba(255, 255, 255, .14);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  padding: 0 6px;
  user-select: none;
  touch-action: pan-y;

  .x85xv42z {
    position: relative;
    z-index: 2;
    width: 58px;
    height: 58px;
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 50%;
    box-shadow: 0 5px 16px rgba($accent, .10);
    transition: transform .3s cubic-bezier(.2, .9, .3, 1.1);
    touch-action: none;
    @include accent;
    @include icon(22px);
  }

  &.xbakqqpu .x85xv42z { transition: none; }

  .x0okdzoo {
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 14px;
    font-weight: 700;
    color: rgba(245, 239, 232, .85);
    pointer-events: none;
    transition: opacity .2s ease;
  }

  &.xbakqqpu .x0okdzoo,
  &.x26h58y3 .x0okdzoo { opacity: .25; }

  .xwt9dl65 {
    margin-left: auto;
    padding-right: 16px;
    display: inline-flex;
    gap: 3px;
    pointer-events: none;

    i {
      font-style: normal;
      font-size: 20px;
      font-weight: 800;
      color: rgba(245, 239, 232, .5);
      animation: chev 1.4s ease-in-out infinite;

      &:nth-child(2) { animation-delay: .15s; }
      &:nth-child(3) { animation-delay: .3s; color: $accent; }
    }
  }
}

@keyframes chev {
  0%, 100% { opacity: .35; transform: translateX(0); }
  50%      { opacity: 1;   transform: translateX(3px); }
}

/* =============================================================
   EKRAN 2 · zakazivanje
   ============================================================= */
.xo4lmrva {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  animation: rise .35s ease both;

  .xohvlfyp {
    position: relative;
    flex: 0 0 auto;

    img {
      width: 100%;
      height: 268px;
      object-fit: cover;
    }
  }

  .xki5xhwp { position: absolute; top: 16px; left: 16px; }
  .x4z9hd33 { position: absolute; top: 16px; right: 16px; }
}

@keyframes rise {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}

.xiba5n94 {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: -28px;
  position: relative;
  border-radius: $r-xl $r-xl 0 0;
  background: $paper;
  overflow: hidden;

  .xlbllqty {
    flex: 1;
    overflow-y: auto;
    padding: 24px 22px 110px;
    @include hide-scrollbar;
  }
}

.xkdv1w8k {
  display: flex;
  align-items: flex-start;
  gap: 12px;

  h2 { color: $ink; font-size: 21px; font-weight: 800; }

  .x5tjgxzs {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
    font-size: 12.5px;
    color: $muted;
    @include icon(13px);

    svg { color: #f4b400; }
    b { color: $ink; font-weight: 800; }

    em {
      font-style: normal;
      font-weight: 800;
      color: $accent;
      margin-left: 6px;
      font-size: 11px;
      letter-spacing: .03em;
      text-transform: uppercase;
    }
  }

  .x710mmog {
    margin-left: auto;
    color: $muted;
    transition: color .2s ease, transform .15s ease;

    &:active { transform: scale(.9); }

    &.xtao48p8 {
      color: #e0322c;
      border-color: rgba(224, 50, 44, .25);
      background: rgba(224, 50, 44, .07);
    }
  }
}

/* tabovi */
.xuf728le {
  display: flex;
  gap: 8px;
  margin: 18px 0 4px;

  .xauigw5p {
    flex: 1;
    padding: 11px 8px;
    border-radius: 99px;
    font-size: 13px;
    font-weight: 700;
    color: $muted;
    transition: color .2s ease, background .2s ease;
    @include chip;

    &.xvjzldgt {
      border-color: transparent;
      box-shadow: 0 4px 14px rgba($accent, .09);
      @include accent;
    }
  }
}

.x7fr9l9x {
  margin: 20px 0 12px;
  color: $ink;
  font-size: 15.5px;
  font-weight: 800;
}

/* nedeljna traka */
.xs5x8eab {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  margin: 0 -22px;
  padding: 2px 22px 4px;
  @include hide-scrollbar;

  .xx8d0e30 {
    flex: 0 0 52px;
    display: grid;
    justify-items: center;
    gap: 6px;
    padding: 10px 4px 12px;
    border-radius: 99px;
    transition: border-color .2s ease;
    @include chip;

    small {
      font-size: 10.5px;
      font-weight: 700;
      color: $muted;
    }

    span {
      width: 34px;
      height: 34px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      color: $ink;
      font-size: 14px;
      font-weight: 800;
      transition: background .2s ease, color .2s ease;
    }

    &.xvjzldgt {
      border-color: rgba($accent, .5);

      span {
        box-shadow: 0 3px 12px rgba($accent, .09);
        @include accent;
      }
    }

    &:disabled {
      opacity: .4;
      cursor: not-allowed;
    }
  }
}

/* izbor usluge */
.x3n7pq2v {
  display: grid;
  gap: 9px;
}

.xk8m1d5r {
  position: relative;
  width: 100%;
  min-height: 76px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;
  padding: 15px 16px;
  overflow: hidden;
  text-align: left;
  border: 1px solid $line;
  border-radius: $r-md;
  background: $paper;
  transition: border-color .2s ease, background .2s ease, transform .15s ease;

  &:active { transform: scale(.99); }

  &:hover:not(.x9vtr0qe) {
    border-color: rgba($accent, .28);
  }

  &.x9vtr0qe {
    padding-right: 48px;
    border-color: rgba($accent, .55);
    background: rgba($accent, .045);
    box-shadow: 0 4px 14px rgba($accent, .05);
  }
}

.xh4p8s6a {
  min-width: 0;
  display: grid;
  gap: 3px;
}

.xw2c7n1l {
  color: $ink;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.25;
}

.xq6j0f8b {
  color: $muted;
  font-size: 11.5px;
  line-height: 1.4;
}

.xz5u4e9k {
  display: grid;
  justify-items: end;
  gap: 3px;
  white-space: nowrap;
}

.xj1b6r3y {
  color: $muted;
  font-size: 10.5px;
  font-weight: 700;
}

.xp0a9m2d {
  color: $ink;
  font-size: 13px;
  font-weight: 800;
}

.x7h2v4n8c {
  position: absolute;
  top: 50%;
  right: 15px;
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: $on-acc;
  background: $accent;
  opacity: 0;
  transform: translateY(-50%) scale(.72);
  transition: opacity .2s ease, transform .2s ease;
  @include icon(13px);

  .x9vtr0qe & {
    opacity: 1;
    transform: translateY(-50%) scale(1);
  }
}

.x3y6k0p5m {
  padding: 14px 16px;
  border: 1px dashed rgba(34, 29, 23, .14);
  border-radius: $r-md;
  color: $muted;
  background: color.adjust($paper, $lightness: -1.5%);
  font-size: 12.5px;
  font-weight: 600;
  text-align: center;
}

/* termini */
.xxofnajm {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;

  .x7qe4u3q {
    padding: 11px 18px;
    border-radius: 99px;
    font-size: 13.5px;
    font-weight: 700;
    color: $ink;
    transition: border-color .2s ease;
    @include chip;

    &:hover:not(:disabled):not(.xvjzldgt) { border-color: rgba($accent, .45); }

    &.xvjzldgt {
      border-color: transparent;
      box-shadow: 0 4px 14px rgba($accent, .09);
      @include accent;
    }

    &:disabled {
      color: rgba($muted, .6);
      cursor: not-allowed;
      text-decoration: line-through;
    }
  }
}

/* izabrani datum + vreme */
.xknsknrh {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 22px;
  padding: 14px 16px;
  border-radius: $r-md;
  border: 1px solid $line;
  background: color.adjust($paper, $lightness: -2%);
  font-size: 13px;
  font-weight: 700;

  &.xu4yl02z { color: $muted; }

  .x7rkul5x {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    @include icon(16px);

    svg { color: $accent; }
  }

  .xcmicai0 { color: $muted; font-weight: 700; }
}

/* o nama */
.x7i780xb {
  margin-top: 16px;
  color: color.adjust($ink, $lightness: 18%);
  font-size: 14px;
}

.x0wtroiz {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 16px;

  img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    border-radius: $r-lg;
  }
}

/* recenzije */
.xnayghe6 {
  display: flex;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid $line;

  &:last-child { border-bottom: none; }

  img {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    object-fit: cover;
  }

  strong {
    font-size: 13.5px;
    font-weight: 800;

    i {
      font-style: normal;
      color: #f4b400;
      font-size: 11px;
      margin-left: 6px;
      letter-spacing: 2px;
    }
  }

  small {
    display: block;
    color: $muted;
    font-size: 12.5px;
    margin-top: 2px;
  }
}

/* =============================================================
   CTA
   ============================================================= */
.x9t0o5pu {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 14px 22px calc(18px + env(safe-area-inset-bottom));
  background: linear-gradient(to top, $paper 62%, transparent);

  .xq6yc2ra {
    width: 100%;
    padding: 17px;
    border-radius: 99px;
    font-size: 15.5px;
    font-weight: 800;
    box-shadow: 0 6px 18px rgba($accent, .10);
    transition: transform .15s ease, opacity .2s ease;
    @include accent;

    &:active:not(:disabled) { transform: scale(.98); }

    &:disabled {
      opacity: .4;
      cursor: not-allowed;
      box-shadow: none;
    }
  }
}

/* =============================================================
   modali
   ============================================================= */
.x0u89eju {
  position: absolute;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: end center;
  padding: 14px;
  background: rgba(20, 15, 11, .55);
  backdrop-filter: blur(4px);

  &.xbo2wyly { place-items: center; }

  .xyuiod91 {
    width: 100%;
    padding: 24px 20px;
    border-radius: $r-xl;
    background: $paper;
    animation: sheet-in .35s cubic-bezier(.2, .9, .3, 1.1) both;

    h3 { color: $ink; font-size: 18px; font-weight: 800; margin-bottom: 16px; }

    &.x6q1m9v4c {
      position: relative;
      padding: 30px 22px 22px;
      border: 1px solid rgba(34, 29, 23, .08);
      border-radius: 28px 28px 20px 20px;
      box-shadow: 0 24px 70px rgba(20, 15, 11, .22);
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        width: 58px;
        height: 3px;
        transform: translateX(-50%);
        border-radius: 0 0 99px 99px;
        background: $accent;
      }
    }

    &.xjltxqan {
      text-align: center;

      h3 { margin-bottom: 2px; }
    }
  }

  .xh29nux3 {
    display: grid;
    grid-template-columns: 1fr 1.4fr;
    gap: 10px;
    margin-top: 24px;
  }
}

@keyframes sheet-in {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
}

.x2p8f0r7n {
  margin-bottom: 20px;

  h3 {
    margin: 0 !important;
    color: $ink;
    font-size: 25px !important;
    font-weight: 800 !important;
    line-height: 1.12;
    letter-spacing: -.025em;
  }
}

.x5t3k8d1a {
  margin-top: 8px;
  color: $accent;
  font-size: 10px;
  font-weight: 800;
  line-height: 1.3;
  letter-spacing: .14em;
  text-transform: uppercase;
}

.xspt33sr {
  display: grid;
  gap: 5px;
  margin-bottom: 0;
  padding: 15px 0 7px;
  border-bottom: 1px solid rgba(34, 29, 23, .16);
  transition: border-color .2s ease;

  &:focus-within { border-color: $accent; }

  label {
    color: $muted;
    font-size: 10px;
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: .12em;
    text-transform: uppercase;
  }

  input {
    width: 100%;
    padding: 5px 0 8px;
    border: 0;
    border-radius: 0;
    outline: 0;
    background: transparent;
    color: $ink;
    caret-color: $accent;
    font: inherit;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.35;

    &::placeholder {
      color: rgba($muted, .65);
      font-weight: 500;
    }
  }
}

.x8cfp4lx {
  padding: 14px;
  border: 1px solid rgba(34, 29, 23, .12);
  border-radius: 99px;
  background: #f7f4f0;
  color: $ink;
  font-weight: 800;

  &:active { transform: scale(.98); }
}

.xxl388fl {
  padding: 14px;
  border-radius: 99px;
  font-weight: 800;
  @include accent;

  &:disabled { opacity: .4; cursor: not-allowed; }

  &.x5e11fh2 { width: 100%; margin-top: 18px; }
}

.xszp88ow {
  color: $muted;
  font-size: 13px;

  b { color: $accent; }
}

.x3plorq9 {
  width: 62px;
  height: 62px;
  margin: 0 auto 12px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  box-shadow: 0 5px 16px rgba($accent, .10);
  @include accent;
  @include icon(28px);
}

.xdpowb1m {
  margin: 18px 0 2px;
  border-top: 1px solid $line;
  text-align: left;

  div {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 2px;
    border-bottom: 1px solid $line;
    font-size: 13.5px;

    dt { color: $muted; }
    dd { font-weight: 800; }
  }
}
</style>