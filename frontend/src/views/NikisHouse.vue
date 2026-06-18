<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import heroImage from '@/assets/img/kucica6.png'
import logo from '@/assets/img/nikis-logo.png'

/* ---------------- types & data ---------------- */
interface Cabin {
  id: string
  name: string
  tag: string
  guests: string
  amenities: string[]
  price: number
  images: string[]
}
interface Addon {
  id: string
  name: string
  desc: string
  price: number
}
interface Occasion {
  title: string
  desc: string
  img: string
}
interface Quote {
  text: string
  who: string
}

const cabins: Cabin[] = [
  {
    id: 'mesecina',
    name: 'Mesečina',
    tag: 'Za parove',
    guests: '2 gosta',
    amenities: ['Jacuzzi 40°C', 'Privatna terasa', 'Kamin'],
    price: 18000,
    images: [
      'https://nikishouse.rs/wp-content/uploads/2025/10/c0cc17c7-3683-42ab-84c4-b4534c7d9832-1-768x1024-650x650.jpg',
      'https://picsum.photos/seed/nikis-mesecina-2/1200/800',
      'https://picsum.photos/seed/nikis-mesecina-3/1200/800',
    ],
  },
  {
    id: 'hedon',
    name: 'Hedon',
    tag: 'Za društvo',
    guests: 'do 6 gostiju',
    amenities: ['Jacuzzi + bazen', 'Roštilj', 'Velika terasa'],
    price: 28000,
    images: [
      'https://nikishouse.rs/wp-content/uploads/2025/10/563520707_17902178826277809_6456928203707178651_n-1-1024x1024-650x652.jpeg',
      'https://picsum.photos/seed/nikis-hedon-2/1200/800',
      'https://picsum.photos/seed/nikis-hedon-3/1200/800',
    ],
  },
  {
    id: 'zvezda',
    name: 'Zvezda',
    tag: 'Premium',
    guests: 'do 8 gostiju',
    amenities: ['Jacuzzi + bazen', 'Sauna', 'Sala za proslave'],
    price: 42000,
    images: [
      'https://picsum.photos/seed/nikis-zvezda/1200/800',
      'https://picsum.photos/seed/nikis-zvezda-2/1200/800',
      'https://picsum.photos/seed/nikis-zvezda-3/1200/800',
    ],
  },
]
// NAPOMENA: picsum linkovi su placeholderi — zameniti pravim fotkama kućica.

const addons: Addon[] = [
  { id: 'late', name: 'Kasniji odlazak', desc: 'Boravak do 14h umesto 11h', price: 3000 },
  { id: 'deco', name: 'Dekoracija za proslavu', desc: 'Baloni, sveće, postavka po želji', price: 6000 },
  { id: 'wine', name: 'Flaša penušavog vina', desc: 'Dočekuje vas na stolu po dolasku', price: 4000 },
  { id: 'grill', name: 'Roštilj paket', desc: 'Meso, prilozi i sva oprema', price: 5000 },
]

const occasions: Occasion[] = [
  { title: 'Momačko & devojačko', desc: 'Privatno i bez ograničenja.', img: 'https://picsum.photos/seed/nikis-occ-1/900/1100' },
  { title: 'Rođendani', desc: 'Proslava u prirodi.', img: 'https://picsum.photos/seed/nikis-occ-2/900/1100' },
  { title: 'Godišnjice', desc: 'Intima za dvoje.', img: 'https://picsum.photos/seed/nikis-occ-3/900/1100' },
  { title: 'Mali skupovi', desc: 'Okupljanja u miru.', img: 'https://picsum.photos/seed/nikis-occ-4/900/1100' },
]

const quotes: Quote[] = [
  { text: 'Stigli umorni, otišli kao novi ljudi. Jacuzzi pod zvezdama pamtićemo dugo.', who: 'Marija & Stefan' },
  { text: 'Mir, privatnost i topla voda do kasno u noć. Tačno kako je opisano.', who: 'Jovana' },
  { text: 'Idealno za proslavu sa društvom. Domaćini su mislili na svaki detalj.', who: 'Nikola' },
  { text: 'Najlepši vikend u godinu dana. Vraćamo se sigurno.', who: 'Ana & Marko' },
  { text: 'Čisto, elegantno, tiho. Osećaj pravog bega iz grada.', who: 'Đorđe' },
]
const quotesLoop = computed(() => [...quotes, ...quotes])

const navItems = [
  { href: '#smestaj', label: 'Smeštaj' },
  { href: '#noc', label: 'Doživljaj' },
  { href: '#prilike', label: 'Proslave' },
  { href: '#lokacija', label: 'Lokacija' },
]

/* ---------------- hero image ---------------- */
const heroReady = ref(false)

/* ---------------- shared booking state ---------------- */
const view = ref<'home' | 'booking'>('home')

const booking = reactive({
  cabinId: 'mesecina',
  checkIn: '',
  checkOut: '',
  guests: 0,
  addons: [] as string[],
  name: '',
  phone: '',
  email: '',
  note: '',
})

const selectedCabin = computed<Cabin>(() => cabins.find((c) => c.id === booking.cabinId) ?? cabins[0])

const nights = computed<number>(() => {
  if (!booking.checkIn || !booking.checkOut) return 0
  const ms = +new Date(booking.checkOut) - +new Date(booking.checkIn)
  return Math.max(0, Math.round(ms / 86_400_000))
})

const lineItems = computed(() => {
  const items: { label: string; value: number }[] = []
  if (nights.value > 0) {
    items.push({
      label: `${rsd(selectedCabin.value.price)} × ${nights.value} ${nightWord(nights.value)}`,
      value: selectedCabin.value.price * nights.value,
    })
    addons
      .filter((a) => booking.addons.includes(a.id))
      .forEach((a) => items.push({ label: a.name, value: a.price }))
  }
  return items
})
const total = computed<number>(() => lineItems.value.reduce((s, i) => s + i.value, 0))

/* ---------------- helpers ---------------- */
const fmt = (n: number): string => new Intl.NumberFormat('sr-RS').format(n)
const rsd = (n: number): string => fmt(n) + ' din'
const nightWord = (n: number): string => (n === 1 ? 'noć' : 'noći')
const heroDate = (value: string): string => {
  if (!value) return '/'
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return '/'
  return new Intl.DateTimeFormat('sr-Latn-RS', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(Date.UTC(year, month - 1, day)))
}
const heroGuests = (value: number): string => {
  if (!value) return '/'
  if (value === 1) return '1 gost'
  if (value >= 2 && value <= 4) return `${value} gosta`
  return `${value} gostiju`
}

/* ---------------- custom hero picker ---------------- */
type HeroPicker = 'checkIn' | 'checkOut' | 'guests' | null

interface CalendarDay {
  iso: string
  label: number
  currentMonth: boolean
  disabled: boolean
  today: boolean
}

const heroPicker = ref<HeroPicker>(null)
const heroPickerRoot = ref<HTMLElement | null>(null)
const guestOptions = [1, 2, 3, 4, 5, 6]
const weekDays = ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned']

const startOfDay = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate())
const addDays = (date: Date, amount: number): Date => {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return startOfDay(next)
}
const parseIsoDate = (value: string): Date => {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}
const toIsoDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const today = startOfDay(new Date())
const calendarCursor = ref<Date>(new Date(today.getFullYear(), today.getMonth(), 1))

const calendarPickerTitle = computed<string>(() =>
  heroPicker.value === 'checkOut' ? 'Izaberite datum odlaska' : 'Izaberite datum dolaska',
)

const calendarMonthLabel = computed<string>(() => {
  const label = new Intl.DateTimeFormat('sr-Latn-RS', {
    month: 'long',
    year: 'numeric',
  }).format(calendarCursor.value)
  return label.charAt(0).toUpperCase() + label.slice(1)
})

const calendarMinDate = computed<Date>(() => {
  if (heroPicker.value === 'checkOut' && booking.checkIn) {
    return addDays(parseIsoDate(booking.checkIn), 1)
  }
  return today
})

const canGoToPreviousMonth = computed<boolean>(() => {
  const cursor = new Date(calendarCursor.value.getFullYear(), calendarCursor.value.getMonth(), 1)
  const minimum = new Date(calendarMinDate.value.getFullYear(), calendarMinDate.value.getMonth(), 1)
  return cursor > minimum
})

const calendarDays = computed<CalendarDay[]>(() => {
  const year = calendarCursor.value.getFullYear()
  const month = calendarCursor.value.getMonth()
  const firstOfMonth = new Date(year, month, 1)
  const mondayOffset = (firstOfMonth.getDay() + 6) % 7
  const gridStart = new Date(year, month, 1 - mondayOffset)
  const minimum = calendarMinDate.value.getTime()
  const todayIso = toIsoDate(today)

  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(gridStart, index)
    const iso = toIsoDate(date)
    return {
      iso,
      label: date.getDate(),
      currentMonth: date.getMonth() === month,
      disabled: date.getTime() < minimum,
      today: iso === todayIso,
    }
  })
})

const openHeroPicker = (picker: Exclude<HeroPicker, null>): void => {
  if (heroPicker.value === picker) {
    heroPicker.value = null
    return
  }

  heroPicker.value = picker

  if (picker === 'guests') return

  const currentValue = picker === 'checkIn' ? booking.checkIn : booking.checkOut
  const fallback = picker === 'checkOut' && booking.checkIn
    ? addDays(parseIsoDate(booking.checkIn), 1)
    : today
  const target = currentValue ? parseIsoDate(currentValue) : fallback
  calendarCursor.value = new Date(target.getFullYear(), target.getMonth(), 1)
}

const closeHeroPicker = (): void => {
  heroPicker.value = null
}

const shiftCalendar = (amount: number): void => {
  if (amount < 0 && !canGoToPreviousMonth.value) return
  calendarCursor.value = new Date(
    calendarCursor.value.getFullYear(),
    calendarCursor.value.getMonth() + amount,
    1,
  )
}

const selectCalendarDay = (day: CalendarDay): void => {
  if (day.disabled) return

  if (heroPicker.value === 'checkIn') {
    booking.checkIn = day.iso
    if (booking.checkOut && booking.checkOut <= day.iso) booking.checkOut = ''

    const nextDay = addDays(parseIsoDate(day.iso), 1)
    calendarCursor.value = new Date(nextDay.getFullYear(), nextDay.getMonth(), 1)
    heroPicker.value = 'checkOut'
    return
  }

  if (heroPicker.value === 'checkOut') {
    booking.checkOut = day.iso
    closeHeroPicker()
  }
}

const selectHeroGuests = (value: number): void => {
  booking.guests = value
  closeHeroPicker()
}

const isCalendarDaySelected = (iso: string): boolean =>
  iso === booking.checkIn || iso === booking.checkOut

const isCalendarDayInRange = (iso: string): boolean =>
  Boolean(booking.checkIn && booking.checkOut && iso > booking.checkIn && iso < booking.checkOut)

const onDocumentPointerDown = (event: PointerEvent): void => {
  const target = event.target as Node | null
  if (!target || heroPickerRoot.value?.contains(target)) return
  closeHeroPicker()
}
const lockScroll = (lock: boolean): void => {
  document.body.style.overflow = lock ? 'hidden' : ''
}

/* ---------------- nav / drawer ---------------- */
const isScrolled = ref(false)
const menuOpen = ref(false)
const setMenu = (open: boolean): void => {
  menuOpen.value = open
  lockScroll(open || galleryOpen.value)
}
const onScroll = (): void => {
  isScrolled.value = window.scrollY > 30
}

const goTo = (target: 'home' | 'booking', cabinId?: string): void => {
  if (cabinId) booking.cabinId = cabinId
  closeHeroPicker()
  view.value = target
  window.scrollTo({ top: 0 })
  setMenu(false)
}

/* ---------------- gallery / lightbox ---------------- */
const galleryOpen = ref(false)
const galleryCabin = ref<Cabin | null>(null)
const galleryIndex = ref(0)

const openGallery = (cabin: Cabin): void => {
  galleryCabin.value = cabin
  galleryIndex.value = 0
  galleryOpen.value = true
  lockScroll(true)
}
const closeGallery = (): void => {
  galleryOpen.value = false
  lockScroll(menuOpen.value)
}
const galleryStep = (dir: number): void => {
  if (!galleryCabin.value) return
  const len = galleryCabin.value.images.length
  galleryIndex.value = (galleryIndex.value + dir + len) % len
}

/* ---------------- booking actions ---------------- */
const setGuests = (delta: number): void => {
  const current = booking.guests || (delta > 0 ? 0 : 1)
  booking.guests = Math.min(10, Math.max(1, current + delta))
}
const toggleAddon = (id: string): void => {
  const i = booking.addons.indexOf(id)
  if (i === -1) booking.addons.push(id)
  else booking.addons.splice(i, 1)
}

/* ---------------- submit + toast ---------------- */
const toast = ref('')
let toastTimer: number | undefined
const flash = (msg: string): void => {
  toast.value = msg
  clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => (toast.value = ''), 3800)
}
const submit = (): void => {
  if (nights.value < 1) return flash('Izaberite datum dolaska i odlaska.')
  if (!booking.guests) return flash('Izaberite broj gostiju.')
  if (!booking.name || !booking.phone) return flash('Unesite ime i broj telefona.')
  flash('Zahtev je poslat. Javljamo se uskoro s potvrdom dostupnosti.')
}

/* ---------------- keyboard ---------------- */
const onKey = (e: KeyboardEvent): void => {
  if (e.key === 'Escape' && heroPicker.value) {
    closeHeroPicker()
    return
  }
  if (galleryOpen.value) {
    if (e.key === 'Escape') closeGallery()
    else if (e.key === 'ArrowRight') galleryStep(1)
    else if (e.key === 'ArrowLeft') galleryStep(-1)
  } else if (menuOpen.value && e.key === 'Escape') {
    setMenu(false)
  }
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
  document.addEventListener('pointerdown', onDocumentPointerDown)
  // fade-in sekvenca heroja nakon prvog frejma
  requestAnimationFrame(() => requestAnimationFrame(() => (heroReady.value = true)))
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
  document.removeEventListener('pointerdown', onDocumentPointerDown)
  lockScroll(false)
})

/* ---------------- reveal directive ---------------- */
const vReveal = {
  mounted(el: HTMLElement) {
    el.classList.add('nikz-reveal')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('nikz-in')
            io.unobserve(el)
          }
        })
      },
      { threshold: 0.12 },
    )
    io.observe(el)
  },
}

const year: number = new Date().getFullYear()
</script>

<template>
  <div class="nikz-shell">
    <!-- ===================== HEADER ===================== -->
    <header class="nikz-hdr" :class="{ 'nikz-hdr--solid': isScrolled || view === 'booking' }">
      <div class="nikz-wrap nikz-nav">
        <a class="nikz-logo" href="#" @click.prevent="goTo('home')" aria-label="Nikis House">
          <img
            :src="logo"
            alt="Nikis House"
          />
        </a>

        <nav class="nikz-links">
          <a v-for="n in navItems" :key="n.href" :href="n.href" @click="goTo('home')">{{ n.label }}</a>
        </nav>

        <div class="nikz-navright">
          <a class="nikz-tel" href="tel:+381652221816">065 222 18 16</a>
          <button class="nikz-btn nikz-btn--solid nikz-navcta" @click="goTo('booking')">Rezerviši</button>
          <button
            class="nikz-burger"
            :class="{ 'nikz-burger--x': menuOpen }"
            aria-label="Meni"
            :aria-expanded="menuOpen"
            @click="setMenu(!menuOpen)"
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>

    <!-- ===================== SIDE DRAWER ===================== -->
    <div class="nikz-scrim" :class="{ 'nikz-scrim--show': menuOpen }" @click="setMenu(false)"></div>
    <aside class="nikz-drawer" :class="{ 'nikz-drawer--open': menuOpen }" aria-label="Glavni meni">
      <div class="nikz-drawer__top">
        <span class="nikz-drawer__brand">Nikis&nbsp;House</span>
        <button class="nikz-drawer__close" aria-label="Zatvori" @click="setMenu(false)">
          <span></span><span></span>
        </button>
      </div>
      <nav class="nikz-drawer__nav">
        <a v-for="n in navItems" :key="n.href" :href="n.href" @click="goTo('home')">
          <span>{{ n.label }}</span><i>↗</i>
        </a>
      </nav>
      <div class="nikz-drawer__cta">
        <button class="nikz-btn nikz-btn--gold nikz-btn--lg" @click="goTo('booking')">Rezerviši termin →</button>
      </div>
      <div class="nikz-drawer__foot">
        <a href="tel:+381652221816">065 222 18 16</a>
        <a href="mailto:office@nikishouse.rs">office@nikishouse.rs</a>
        <a href="https://maps.app.goo.gl/vtqLQLXYC3cb2Mho8">Žrtava fašizma 13, Barajevo</a>
      </div>
    </aside>

    <!-- ===================== HOME ===================== -->
    <main v-show="view === 'home'">
      <!-- HERO (image background, premium) -->
      <section class="nikz-hero" :class="{ 'nikz-hero--ready': heroReady }">
        <img class="nikz-hero__poster" :src="heroImage" alt="" aria-hidden="true" />
        <div class="nikz-hero__overlay" aria-hidden="true"></div>

        <div class="nikz-hero__inner">
          <div
            ref="heroPickerRoot"
            class="nikz-hero__bar"
            role="search"
            aria-label="Provera dostupnosti"
          >
            <div class="nikz-hero__fields">
              <button
                type="button"
                class="nikz-hero__field"
                :class="{ 'nikz-hero__field--active': heroPicker === 'checkIn' }"
                :aria-expanded="heroPicker === 'checkIn'"
                @click="openHeroPicker('checkIn')"
              >
                <span class="nikz-hero__fieldTop">
                  <span class="nikz-hero__fieldLabel">
                    <svg class="nikz-hero__fieldIcon" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M7 3v3M17 3v3M4.5 9h15M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
                    </svg>
                    <span>Od</span>
                  </span>
                  <svg class="nikz-hero__chevron" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m7 9.5 5 5 5-5" />
                  </svg>
                </span>
                <span class="nikz-hero__fieldValue">{{ heroDate(booking.checkIn) }}</span>
              </button>

              <button
                type="button"
                class="nikz-hero__field"
                :class="{ 'nikz-hero__field--active': heroPicker === 'checkOut' }"
                :aria-expanded="heroPicker === 'checkOut'"
                @click="openHeroPicker('checkOut')"
              >
                <span class="nikz-hero__fieldTop">
                  <span class="nikz-hero__fieldLabel">
                    <svg class="nikz-hero__fieldIcon" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M7 3v3M17 3v3M4.5 9h15M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
                      <path d="m14.5 14.5 1.5 1.5 3-3" />
                    </svg>
                    <span>Do</span>
                  </span>
                  <svg class="nikz-hero__chevron" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m7 9.5 5 5 5-5" />
                  </svg>
                </span>
                <span class="nikz-hero__fieldValue">{{ heroDate(booking.checkOut) }}</span>
              </button>

              <button
                type="button"
                class="nikz-hero__field"
                :class="{ 'nikz-hero__field--active': heroPicker === 'guests' }"
                :aria-expanded="heroPicker === 'guests'"
                @click="openHeroPicker('guests')"
              >
                <span class="nikz-hero__fieldTop">
                  <span class="nikz-hero__fieldLabel">
                    <svg class="nikz-hero__fieldIcon" viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="9" cy="8" r="3" />
                      <circle cx="17" cy="9" r="2.3" />
                      <path d="M3.5 19c.5-3.5 2.3-5.3 5.5-5.3s5 1.8 5.5 5.3M14.2 14.5c2.8-.4 5.2 1 6.3 3.7" />
                    </svg>
                    <span>Gosti</span>
                  </span>
                  <svg class="nikz-hero__chevron" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m7 9.5 5 5 5-5" />
                  </svg>
                </span>
                <span class="nikz-hero__fieldValue">{{ heroGuests(booking.guests) }}</span>
              </button>

              <Transition name="nikz-picker">
                <div
                  v-if="heroPicker === 'checkIn' || heroPicker === 'checkOut'"
                  class="nikz-hero__picker nikz-hero__picker--calendar"
                  @click.stop
                >
                  <div class="nikz-calendar__top">
                    <div>
                      <span class="nikz-calendar__eyebrow">Termin</span>
                      <strong>{{ calendarPickerTitle }}</strong>
                    </div>
                    <button type="button" class="nikz-calendar__close" aria-label="Zatvori kalendar" @click="closeHeroPicker">
                      <span></span><span></span>
                    </button>
                  </div>

                  <div class="nikz-calendar__nav">
                    <button
                      type="button"
                      aria-label="Prethodni mesec"
                      :disabled="!canGoToPreviousMonth"
                      @click="shiftCalendar(-1)"
                    >
                      ‹
                    </button>
                    <strong>{{ calendarMonthLabel }}</strong>
                    <button type="button" aria-label="Sledeći mesec" @click="shiftCalendar(1)">›</button>
                  </div>

                  <div class="nikz-calendar__week">
                    <span v-for="dayName in weekDays" :key="dayName">{{ dayName }}</span>
                  </div>

                  <div class="nikz-calendar__grid">
                    <button
                      v-for="day in calendarDays"
                      :key="day.iso"
                      type="button"
                      :disabled="day.disabled"
                      :class="{
                        'nikz-calendar__day--outside': !day.currentMonth,
                        'nikz-calendar__day--today': day.today,
                        'nikz-calendar__day--selected': isCalendarDaySelected(day.iso),
                        'nikz-calendar__day--range': isCalendarDayInRange(day.iso),
                      }"
                      @click="selectCalendarDay(day)"
                    >
                      {{ day.label }}
                    </button>
                  </div>
                </div>
              </Transition>

              <Transition name="nikz-picker">
                <div
                  v-if="heroPicker === 'guests'"
                  class="nikz-hero__picker nikz-hero__picker--guests"
                  @click.stop
                >
                  <div class="nikz-guests__top">
                    <span>Broj gostiju</span>
                    <button type="button" aria-label="Zatvori izbor gostiju" @click="closeHeroPicker">×</button>
                  </div>
                  <button
                    v-for="guest in guestOptions"
                    :key="guest"
                    type="button"
                    class="nikz-guests__option"
                    :class="{ 'nikz-guests__option--active': booking.guests === guest }"
                    @click="selectHeroGuests(guest)"
                  >
                    <strong>{{ guest }}</strong>
                    <span>{{ guest === 1 ? 'gost' : guest < 5 ? 'gosta' : 'gostiju' }}</span>
                  </button>
                </div>
              </Transition>
            </div>

            <button class="nikz-btn nikz-btn--gold nikz-hero__go" @click="goTo('booking')">
              Proveri dostupnost →
            </button>
          </div>
        </div>
      </section>

      <!-- O NAMA -->
      <section id="o-nama" class="nikz-about">
        <div class="nikz-wrap nikz-about__grid" v-reveal>
          <div class="nikz-about__intro">
            <p class="nikz-eyebrow nikz-eyebrow--gold">O nama</p>
            <h2>Mesto gde grad ostaje iza vas.</h2>
          </div>

          <div class="nikz-about__copy">
            <p>
              Niki’s House je privatno utočište u prirodi, osmišljeno za mirne vikende,
              posebne trenutke i večeri bez žurbe. Svaka kućica spaja udobnost, privatnost
              i atmosferu zbog koje se ostaje duže nego što je planirano.
            </p>
            <button class="nikz-about__link" type="button" @click="goTo('booking')">
              Pronađi svoj termin <span>→</span>
            </button>
          </div>

          <div class="nikz-about__facts">
            <article>
              <strong>30</strong>
              <span>minuta od Beograda</span>
            </article>
            <article>
              <strong>40°C</strong>
              <span>privatni jacuzzi</span>
            </article>
            <article>
              <strong>100%</strong>
              <span>mir i privatnost</span>
            </article>
          </div>
        </div>
      </section>

      <!-- SMEŠTAJ (no prices, gallery on image) -->
      <section id="smestaj" class="nikz-sec nikz-wrap" v-reveal>
        <header class="nikz-sechead">
          <p class="nikz-eyebrow">Smeštaj</p>
          <h2>Tri utočišta, jedan osećaj.</h2>
        </header>
        <div class="nikz-stays">
          <article v-for="c in cabins" :key="c.id" class="nikz-stay">
            <button class="nikz-stay__ph" @click="openGallery(c)" :aria-label="`Galerija — ${c.name}`">
              <img :src="c.images[0]" :alt="c.name" loading="lazy" />
              <span class="nikz-stay__cap">{{ c.tag }}</span>
              <span class="nikz-stay__view"><i>⤢</i> Galerija · {{ c.images.length }}</span>
              <span class="nikz-stay__badge">{{ c.images.length }} fotografije</span>
            </button>
            <div class="nikz-stay__body">
              <h3>{{ c.name }}</h3>
              <ul class="nikz-stay__amen">
                <li>{{ c.guests }}</li>
                <li v-for="am in c.amenities" :key="am">{{ am }}</li>
              </ul>
              <button class="nikz-btn nikz-btn--ghost nikz-stay__cta" @click="goTo('booking', c.id)">
                Rezerviši
              </button>
            </div>
          </article>
        </div>
      </section>

      <!-- NOĆ (dark, stars) -->
      <section id="noc" class="nikz-night">
        <div class="nikz-night__stars" aria-hidden="true"></div>
        <div class="nikz-night__moon" aria-hidden="true"></div>
        <div class="nikz-wrap nikz-night__grid" v-reveal>
          <div class="nikz-night__copy">
            <p class="nikz-eyebrow nikz-eyebrow--gold">Noću</p>
            <h2>Mesec na vodi,<br />para u vazduhu.</h2>
            <p>
              Kada padne veče, jacuzzi zagrejan do 40°C postaje utočište u kojem vreme staje. Para
              se uzdiže, misli se stišaju, telo nalazi balans.
            </p>
            <p class="nikz-night__line">Svaki mehurić — dodir mira. Svaki zrak svetlosti — poziv da se prepustite.</p>
            <button class="nikz-btn nikz-btn--gold nikz-btn--lg" @click="goTo('booking')">Rezerviši veče →</button>
          </div>
          <div class="nikz-night__media">
            <img
              src="https://nikishouse.rs/wp-content/uploads/2025/10/563520707_17902178826277809_6456928203707178651_n-1-1024x1024-650x652.jpeg"
              alt="Jacuzzi noću"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <!-- POSEBNE PRILIKE (lookbook) -->
      <section id="prilike" class="nikz-sec nikz-wrap" v-reveal>
        <header class="nikz-sechead nikz-sechead--center">
          <p class="nikz-eyebrow">Posebne prilike</p>
          <h2>Trenuci koji se pamte.</h2>
        </header>
        <div class="nikz-occ">
          <article v-for="o in occasions" :key="o.title" class="nikz-occ__tile">
            <img :src="o.img" :alt="o.title" loading="lazy" />
            <div class="nikz-occ__veil"></div>
            <div class="nikz-occ__label">
              <h3>{{ o.title }}</h3>
              <p>{{ o.desc }}</p>
            </div>
          </article>
        </div>
      </section>

      <!-- ISKUSTVA (auto carousel) -->
      <section class="nikz-sec" v-reveal>
        <header class="nikz-sechead nikz-sechead--center nikz-wrap">
          <p class="nikz-eyebrow">Iskustva gostiju</p>
          <h2>Ono što ostane posle.</h2>
        </header>
        <div class="nikz-quotes">
          <div class="nikz-quotes__track">
            <figure v-for="(q, i) in quotesLoop" :key="i" class="nikz-quote">
              <div class="nikz-quote__stars">★★★★★</div>
              <blockquote>„{{ q.text }}”</blockquote>
              <figcaption>{{ q.who }}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <!-- LOKACIJA (less generic) -->
      <section id="lokacija" class="nikz-sec nikz-wrap nikz-loc" v-reveal>
        <div class="nikz-loc__copy">
          <p class="nikz-eyebrow">Lokacija</p>
          <h2>Blizu grada,<br />daleko od svega.</h2>
          <p class="nikz-loc__lead">
            Na 30 minuta vožnje od centra Beograda, u mirnom okruženju Barajeva.
          </p>
          <ul class="nikz-loc__meta">
            <li><span>Adresa</span> Žrtava fašizma 13, Barajevo</li>
            <li><span>Telefon</span> <a href="tel:+381652221816">065 222 18 16</a></li>
            <li><span>Mejl</span> <a href="mailto:office@nikishouse.rs">office@nikishouse.rs</a></li>
            <li><span>Prijava / odjava</span> 14:00 / 11:00</li>
          </ul>
          <button class="nikz-btn nikz-btn--solid nikz-btn--lg nikz-loc__cta" @click="goTo('booking')">Rezerviši termin →</button>
        </div>
        <div class="nikz-map">
          <iframe
            title="Mapa — Nikis House"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=%C5%BDrtava%20fa%C5%A1izma%2013%2C%20Barajevo&output=embed"
          ></iframe>
        </div>
      </section>
    </main>

    <!-- ===================== BOOKING ===================== -->
    <main v-show="view === 'booking'" class="nikz-book">
      <section class="nikz-wrap">
        <button class="nikz-back" @click="goTo('home')">← Početna</button>
        <h1 class="nikz-book__title">Rezervacija</h1>
        <p class="nikz-book__sub">Izaberite kućicu, termin i dodatke. Šaljete zahtev — potvrdu dostupnosti dobijate od nas.</p>

        <div class="nikz-book__layout">
          <form class="nikz-form" @submit.prevent>
            <div class="nikz-step">
              <div class="nikz-step__lbl"><span>1</span><h3>Izaberite kućicu</h3></div>
              <div class="nikz-picks">
                <label
                  v-for="c in cabins"
                  :key="c.id"
                  class="nikz-pick"
                  :class="{ 'nikz-pick--on': booking.cabinId === c.id }"
                  @click="booking.cabinId = c.id"
                >
                  <img :src="c.images[0]" :alt="c.name" />
                  <div class="nikz-pick__info">
                    <span class="nikz-pick__name">{{ c.name }}</span>
                    <span class="nikz-pick__meta">{{ c.guests }} · {{ c.amenities[0] }}</span>
                  </div>
                  <div class="nikz-pick__price"><b>{{ fmt(c.price) }}</b><small>din / noć</small></div>
                </label>
              </div>
            </div>

            <div class="nikz-step">
              <div class="nikz-step__lbl"><span>2</span><h3>Termin i gosti</h3></div>
              <div class="nikz-frow">
                <label class="nikz-field"><span>Dolazak</span><input type="date" v-model="booking.checkIn" /></label>
                <label class="nikz-field"><span>Odlazak</span><input type="date" :min="booking.checkIn" v-model="booking.checkOut" /></label>
              </div>
              <div class="nikz-field nikz-field--mt">
                <span>Broj gostiju</span>
                <div class="nikz-stepper">
                  <button type="button" @click="setGuests(-1)">−</button>
                  <em>{{ booking.guests || '/' }}</em>
                  <button type="button" @click="setGuests(1)">+</button>
                </div>
              </div>
            </div>

            <div class="nikz-step">
              <div class="nikz-step__lbl"><span>3</span><h3>Dodaci <i>(opciono)</i></h3></div>
              <div class="nikz-addons">
                <label
                  v-for="a in addons"
                  :key="a.id"
                  class="nikz-addon"
                  :class="{ 'nikz-addon--on': booking.addons.includes(a.id) }"
                  @click="toggleAddon(a.id)"
                >
                  <span class="nikz-addon__box">✓</span>
                  <div class="nikz-addon__info">
                    <span class="nikz-addon__name">{{ a.name }}</span>
                    <span class="nikz-addon__desc">{{ a.desc }}</span>
                  </div>
                  <span class="nikz-addon__price">+{{ fmt(a.price) }}</span>
                </label>
              </div>
            </div>

            <div class="nikz-step">
              <div class="nikz-step__lbl"><span>4</span><h3>Vaši podaci</h3></div>
              <div class="nikz-frow">
                <label class="nikz-field"><span>Ime i prezime</span><input type="text" v-model="booking.name" placeholder="Marko Marković" /></label>
                <label class="nikz-field"><span>Telefon</span><input type="tel" v-model="booking.phone" placeholder="06x xxx xxxx" /></label>
              </div>
              <label class="nikz-field nikz-field--mt"><span>Email</span><input type="email" v-model="booking.email" placeholder="vi@email.com" /></label>
              <label class="nikz-field nikz-field--mt"><span>Napomena</span><textarea v-model="booking.note" placeholder="Povod, posebne želje..."></textarea></label>
            </div>
          </form>

          <aside class="nikz-summary">
            <h3>{{ selectedCabin.name }}</h3>
            <p class="nikz-summary__cabin">{{ selectedCabin.guests }} · {{ heroGuests(booking.guests) }}</p>
            <div class="nikz-summary__rows">
              <template v-if="lineItems.length">
                <div v-for="(it, i) in lineItems" :key="i" class="nikz-summary__row">
                  <span>{{ it.label }}</span><span>{{ rsd(it.value) }}</span>
                </div>
              </template>
              <div v-else class="nikz-summary__row nikz-summary__row--muted"><span>Izaberite datume</span><span></span></div>
            </div>
            <div class="nikz-summary__total"><span>Ukupno</span><b>{{ total > 0 ? rsd(total) : '—' }}</b></div>
            <button class="nikz-btn nikz-btn--solid nikz-btn--lg nikz-summary__send" @click="submit">Pošalji zahtev</button>
            <p class="nikz-summary__note">Bez naplate u ovom koraku. Potvrđujemo dostupnost i šaljemo uputstvo za uplatu.</p>
          </aside>
        </div>
      </section>
    </main>

    <!-- ===================== GALLERY LIGHTBOX ===================== -->
    <div class="nikz-lb" :class="{ 'nikz-lb--show': galleryOpen }" @click.self="closeGallery">
      <div class="nikz-lb__head">
        <span class="nikz-lb__title">{{ galleryCabin?.name }}</span>
        <span class="nikz-lb__count" v-if="galleryCabin">{{ galleryIndex + 1 }} / {{ galleryCabin.images.length }}</span>
        <button class="nikz-lb__close" aria-label="Zatvori" @click="closeGallery"><span></span><span></span></button>
      </div>
      <div class="nikz-lb__stage">
        <button class="nikz-lb__nav" aria-label="Prethodna" @click="galleryStep(-1)">‹</button>
        <img v-if="galleryCabin" class="nikz-lb__img" :src="galleryCabin.images[galleryIndex]" :alt="galleryCabin.name" />
        <button class="nikz-lb__nav" aria-label="Sledeća" @click="galleryStep(1)">›</button>
      </div>
      <div class="nikz-lb__thumbs" v-if="galleryCabin">
        <button
          v-for="(img, i) in galleryCabin.images"
          :key="i"
          class="nikz-lb__thumb"
          :class="{ 'nikz-lb__thumb--on': i === galleryIndex }"
          @click="galleryIndex = i"
        >
          <img :src="img" :alt="`${galleryCabin.name} ${i + 1}`" />
        </button>
      </div>
    </div>

    <!-- toast -->
    <div class="nikz-toast" :class="{ 'nikz-toast--show': toast }">{{ toast }}</div>

    <!-- ===================== FOOTER ===================== -->
    <footer class="nikz-foot">
      <div class="nikz-wrap">
        <div class="nikz-foot__grid">
          <div>
            <div class="nikz-foot__logo">Nikis House</div>
            <p class="nikz-foot__tag">Oaza mira i luksuza — privatne kućice sa jacuzzijem, 30 minuta od Beograda.</p>
            <div class="nikz-foot__eu">
              <img src="https://nikishouse.rs/wp-content/uploads/2026/06/Logo-IPARD-small-300x150.png" alt="IPARD" />
              <small>Projekat realizovan uz finansijsku podršku Evropske unije.</small>
            </div>
          </div>
          <div>
            <h4>Stranice</h4>
            <a href="#" @click.prevent="goTo('home')">Početna</a>
            <a href="#" @click.prevent="goTo('booking')">Rezervacije</a>
            <a href="#smestaj" @click="goTo('home')">Smeštaj</a>
            <a href="#prilike" @click="goTo('home')">Proslave</a>
          </div>
          <div>
            <h4>Kontakt</h4>
            <a href="https://maps.app.goo.gl/vtqLQLXYC3cb2Mho8">Žrtava fašizma 13, Barajevo</a>
            <a href="tel:+381652221816">065 222 18 16</a>
            <a href="mailto:office@nikishouse.rs">office@nikishouse.rs</a>
          </div>
        </div>
        <div class="nikz-foot__bottom"><span>© {{ year }} Nikis House</span><span>Barajevo · Srbija</span></div>
      </div>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400;1,500&family=Fraunces:ital,opsz,wght@0,9..144,300..500;1,9..144,400&family=Hanken+Grotesk:wght@400;500;600;700&display=swap');

/* ---------- tokens ---------- */
$bg: #f4f6f9;
$surface: #ffffff;
$ink: #111317;
$ink-soft: #1c1f25;
$night: #0b0d12;
$night-2: #0f1116;
$gold: #c2a15a;
$gold-deep: #a9863f;
$gold-bright: #e3c987;
$text: #1a1d22;
$muted: #6c7079;
$line: #e4e7ec;
$ease: cubic-bezier(0.22, 0.61, 0.36, 1);
$shadow-sm: 0 10px 30px -18px rgba(17, 19, 23, 0.3);
$shadow: 0 26px 60px -34px rgba(17, 19, 23, 0.4);

/* ====== MOBILE-FIRST BASE ====== */
.nikz-shell {
  background: $bg;
  color: $text;
  font-family: 'Hanken Grotesk', system-ui, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  h1,
  h2,
  h3 {
    font-family: 'Fraunces', Georgia, serif;
    font-weight: 400;
    line-height: 1.08;
    letter-spacing: -0.01em;
    color: $ink;
    margin: 0;
  }
  p {
    margin: 0;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  img {
    display: block;
    max-width: 100%;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  button {
    font-family: inherit;
  }
  :focus-visible {
    outline: 2px solid $gold;
    outline-offset: 3px;
    border-radius: 4px;
  }
}

.nikz-wrap {
  width: 100%;
  margin-inline: auto;
  padding-inline: 20px;

}

.nikz-eyebrow {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: $gold-deep;
  display: inline-flex;
  align-items: center;
  gap: 0.6em;

  &::before {
    content: '';
    width: 22px;
    height: 1px;
    background: $gold-deep;
  }
  &--gold {
    color: $gold-bright;
    &::before {
      background: $gold-bright;
    }
  }
}

/* buttons */
.nikz-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0.85em 1.5em;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: transform 0.3s $ease, background 0.3s, color 0.3s, border-color 0.3s;

  &--lg {
    padding: 1em 1.8em;
  }
  &--solid {
    background: $ink;
    color: $bg;
    &:hover {
      background: $ink-soft;
      transform: translateY(-2px);
    }
  }
  &--ghost {
    background: $surface;
    border-color: $line;
    color: $ink;
    &:hover {
      border-color: $ink;
      transform: translateY(-2px);
    }
  }
  &--gold {
    background: $gold;
    color: $night;
    &:hover {
      background: $gold-bright;
      transform: translateY(-2px);
    }
  }
  &--glass {
    background: rgba(244, 246, 249, 0.06);
    border-color: rgba(244, 246, 249, 0.32);
    color: $bg;
    backdrop-filter: blur(4px);
    &:hover {
      background: rgba(244, 246, 249, 0.14);
      border-color: rgba(244, 246, 249, 0.6);
      transform: translateY(-2px);
    }
  }
}

/* ---------- header ---------- */
.nikz-hdr {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 80;
  transition: background 0.4s, border-color 0.4s, backdrop-filter 0.4s;
//   border-bottom: 1px solid red;
  background: transparent;

  &--solid {
    background: rgba(244, 246, 249, 0.9);
    backdrop-filter: blur(12px);
    border-bottom-color: $line;
  }
}
.nikz-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
    // padding: 10px 0;
    padding: 10px 20px;
    // border: 1px solid red;
}
.nikz-logo img {
  height: 36px;
  width: auto;
}
.nikz-navright {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}
.nikz-tel,
.nikz-navcta {
  display: none;
}
.nikz-links {
  display: none;
}
.nikz-burger {
  position: relative;
  z-index: 100;
  width: 42px;
  height: 42px;
  background: none;
  border: 0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;

  span {
    width: 22px;
    height: 1.8px;
    background: $bg;
    transition: transform 0.35s $ease, opacity 0.25s, background 0.3s;
  }
  &--x span:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }
  &--x span:nth-child(2) {
    opacity: 0;
  }
  &--x span:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }
  &--x span {
    background: $bg !important;
  }
}
.nikz-hdr--solid .nikz-burger span {
  background: $ink;
}

/* ---------- side drawer ---------- */
.nikz-scrim {
  position: fixed;
  inset: 0;
  z-index: 90;
  background: rgba(8, 9, 12, 0.55);
  backdrop-filter: blur(4px);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.4s, visibility 0.4s;

  &--show {
    opacity: 1;
    visibility: visible;
  }
}
.nikz-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 96;
  width: min(86vw, 380px);
  background: $night-2;
  color: $bg;
  border-left: 1px solid rgba(227, 201, 135, 0.28);
  box-shadow: -34px 0 70px -34px rgba(0, 0, 0, 0.7);
  transform: translateX(100%);
  transition: transform 0.45s $ease;
  display: flex;
  flex-direction: column;

  &--open {
    transform: none;
  }
  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22px 24px;
    border-bottom: 1px solid rgba(244, 246, 249, 0.1);
  }
  &__brand {
    font-family: 'Fraunces', serif;
    font-size: 1.2rem;
    color: $gold-bright;
    letter-spacing: 0.02em;
  }
  &__close {
    position: relative;
    width: 38px;
    height: 38px;
    background: none;
    border: 1px solid rgba(244, 246, 249, 0.18);
    border-radius: 50%;
    cursor: pointer;
    transition: border-color 0.3s;

    &:hover {
      border-color: $gold;
    }
    span {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 15px;
      height: 1.6px;
      background: $bg;

      &:nth-child(1) {
        transform: translate(-50%, -50%) rotate(45deg);
      }
      &:nth-child(2) {
        transform: translate(-50%, -50%) rotate(-45deg);
      }
    }
  }
  &__nav {
    display: flex;
    flex-direction: column;
    padding: 10px 0;
    flex: 1;

    a {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.95rem 24px;
      font-family: 'Fraunces', serif;
      font-size: 1.5rem;
      color: $bg;
      border-bottom: 1px solid rgba(244, 246, 249, 0.06);
      opacity: 0;
      transform: translateX(18px);
      transition: opacity 0.45s $ease, transform 0.45s $ease, color 0.3s;

      i {
        font-style: normal;
        color: $gold;
        opacity: 0.6;
        font-size: 1rem;
        transition: transform 0.3s $ease, opacity 0.3s;
      }
      &:hover {
        color: $gold-bright;
        i {
          opacity: 1;
          transform: translate(2px, -2px);
        }
      }
    }
  }
  &--open &__nav a {
    opacity: 1;
    transform: none;
  }
  &--open &__nav a:nth-child(1) {
    transition-delay: 0.08s;
  }
  &--open &__nav a:nth-child(2) {
    transition-delay: 0.14s;
  }
  &--open &__nav a:nth-child(3) {
    transition-delay: 0.2s;
  }
  &--open &__nav a:nth-child(4) {
    transition-delay: 0.26s;
  }
  &__cta {
    padding: 6px 24px 18px;

    .nikz-btn {
      width: 100%;
    }
  }
  &__foot {
    padding: 18px 24px 26px;
    border-top: 1px solid rgba(244, 246, 249, 0.1);
    display: grid;
    gap: 0.55rem;

    a {
      color: rgba(244, 246, 249, 0.68);
      font-size: 0.88rem;
      transition: color 0.3s;

      &:hover {
        color: $gold-bright;
      }
    }
  }
}

/* ---------- hero (image) ---------- */
.nikz-hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  text-align: left;
  background: $night;
  color: $bg;
  overflow: hidden;
  padding: 0;

  &__poster {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
    transform: scale(1.04);
    animation: nikz-kenburns 20s ease-in-out infinite alternate;
  }
  &__overlay {
    position: absolute;
    inset: 0;
    z-index: 1;
    background:
      linear-gradient(180deg, rgba(7, 8, 10, 0.42) 0%, rgba(7, 8, 10, 0.08) 40%, rgba(7, 8, 10, 0.78) 100%),
      radial-gradient(95% 75% at 16% 98%, rgba(7, 8, 10, 0.56), transparent 60%);
  }
  &__inner {
    position: absolute;
    z-index: 3;
    left: 0;
    right: 0;
    bottom: 30px;
    width: 100%;
    max-width: 1180px;
    margin-inline: auto;
    padding-inline: clamp(20px, 5vw, 36px);

    > * {
      opacity: 0;
      transform: translateY(16px);
      transition: opacity 0.7s $ease, transform 0.7s $ease;
    }
  }
  &--ready &__inner > * {
    opacity: 1;
    transform: none;
    transition-delay: 0.12s;
  }

  /* custom availability bar */
  &__bar {
    position: relative;
    width: 100%;
    max-width: 760px;
    display: flex;
    flex-direction: column;
    background: rgba(11, 13, 18, 0.72);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(227, 201, 135, 0.34);
    border-radius: 0;
    box-shadow: 0 22px 48px -30px rgba(0, 0, 0, 0.72);
  }
  &__fields {
    position: relative;
    z-index: 3;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    width: 100%;
    overflow: visible;
  }
  &__field {
    appearance: none;
    position: relative;
    min-width: 0;
    min-height: 82px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 0.7rem;
    margin: 0;
    padding: 0.8rem 0.65rem 0.85rem;
    border: 0;
    border-right: 1px solid rgba(244, 246, 249, 0.14);
    border-bottom: 1px solid rgba(244, 246, 249, 0.14);
    border-radius: 0;
    background: transparent;
    color: inherit;
    text-align: left;
    cursor: pointer;
    transition: background 0.25s ease, border-color 0.25s ease;

    &:last-of-type {
      border-right: 0;
    }
    &:hover,
    &--active {
      background: rgba(227, 201, 135, 0.08);
    }
    &--active {
      border-bottom-color: $gold-bright;
    }
  }
  &__fieldTop {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.35rem;
    width: 100%;
  }
  &__fieldLabel {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 0.38rem;

    > span {
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 0.55rem;
      line-height: 1;
      letter-spacing: 0.13em;
      text-transform: uppercase;
      color: $gold-bright;
      font-weight: 600;
      white-space: nowrap;
    }
  }
  &__fieldIcon {
    width: 17px;
    height: 17px;
    flex: 0 0 17px;
    fill: none;
    stroke: $gold-bright;
    stroke-width: 1.65;
    stroke-linecap: round;
    stroke-linejoin: round;
    opacity: 0.95;
  }
  &__chevron {
    width: 15px;
    height: 15px;
    flex: 0 0 15px;
    fill: none;
    stroke: rgba(244, 246, 249, 0.82);
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
    pointer-events: none;
    transition: transform 0.25s ease;
  }
  &__field--active &__chevron {
    transform: rotate(180deg);
  }
  &__fieldValue {
    display: block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #fff;
    font-size: clamp(0.72rem, 3vw, 0.92rem);
    font-weight: 600;
    line-height: 1.15;
    white-space: nowrap;
  }
  &__go {
    position: relative;
    z-index: 2;
    width: 100%;
    min-height: 52px;
    border-radius: 0;
    padding: 1.05em;
  }

  /* panels open upward from the top edge of the select row */
  &__picker {
    position: absolute;
    bottom: 100%;
    z-index: 12;
    overflow: hidden;
    border: 1px solid rgba(227, 201, 135, 0.45);
    border-bottom: 0;
    border-radius: 0;
    background: rgba(8, 10, 14, 0.98);
    color: $bg;
    box-shadow: 0 -24px 54px -28px rgba(0, 0, 0, 0.86);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
  }
  &__picker--calendar {
    left: 0;
    width: 100%;
    height: 360px;
    padding: 1rem;
  }
  &__picker--guests {
    right: 0;
    width: calc(100% / 3);
    height: 274px;
    display: flex;
    flex-direction: column;
  }

  @media (min-width: 720px) {
    &__poster {
      object-position: center 58%;
    }
    &__inner {
      bottom: 30px;
    }
    &__bar {
      max-width: 820px;
    }
    &__field {
      min-height: 78px;
      padding-inline: 1rem;
    }
    &__fieldIcon {
      width: 20px;
      height: 20px;
      flex-basis: 20px;
    }
    &__chevron {
      width: 17px;
      height: 17px;
      flex-basis: 17px;
    }
    &__fieldValue {
      font-size: 0.95rem;
    }
    &__picker--calendar {
      height: 372px;
      padding: 1.15rem 1.3rem;
    }
  }
}

/* picker slide-up transition */
.nikz-picker-enter-active,
.nikz-picker-leave-active {
  transition: opacity 0.28s $ease, transform 0.34s $ease;
  transform-origin: bottom;
}
.nikz-picker-enter-from,
.nikz-picker-leave-to {
  opacity: 0;
  transform: translateY(24px) scaleY(0.96);
}

/* custom calendar */
.nikz-calendar {
  &__top {
    min-height: 48px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    padding-bottom: 0.8rem;
    border-bottom: 1px solid rgba(244, 246, 249, 0.1);

    > div {
      min-width: 0;
    }
    strong {
      display: block;
      color: #fff;
      font-family: 'Fraunces', serif;
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.2;
    }
  }
  &__eyebrow {
    display: block;
    margin-bottom: 0.2rem;
    color: $gold-bright;
    font-size: 0.55rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }
  &__close {
    position: relative;
    flex: 0 0 32px;
    width: 32px;
    height: 32px;
    border: 1px solid rgba(244, 246, 249, 0.15);
    border-radius: 0;
    background: transparent;
    cursor: pointer;

    span {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 13px;
      height: 1px;
      background: rgba(244, 246, 249, 0.8);

      &:first-child {
        transform: translate(-50%, -50%) rotate(45deg);
      }
      &:last-child {
        transform: translate(-50%, -50%) rotate(-45deg);
      }
    }
  }
  &__nav {
    height: 46px;
    display: grid;
    grid-template-columns: 38px 1fr 38px;
    align-items: center;
    gap: 0.4rem;

    strong {
      text-align: center;
      color: rgba(244, 246, 249, 0.92);
      font-size: 0.82rem;
      font-weight: 600;
    }
    button {
      width: 34px;
      height: 34px;
      border: 0;
      border-radius: 0;
      background: rgba(244, 246, 249, 0.05);
      color: #fff;
      font-size: 1.35rem;
      cursor: pointer;

      &:disabled {
        opacity: 0.22;
        cursor: default;
      }
    }
  }
  &__week,
  &__grid {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }
  &__week {
    margin-bottom: 0.25rem;

    span {
      text-align: center;
      color: rgba(244, 246, 249, 0.42);
      font-size: 0.5rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
  }
  &__grid {
    gap: 2px;

    button {
      position: relative;
      min-width: 0;
      height: 32px;
      border: 0;
      border-radius: 0;
      background: transparent;
      color: rgba(244, 246, 249, 0.85);
      font-size: clamp(0.64rem, 2.7vw, 0.78rem);
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s ease, color 0.2s ease;

      &:hover:not(:disabled) {
        background: rgba(227, 201, 135, 0.14);
      }
      &:disabled {
        color: rgba(244, 246, 249, 0.16);
        cursor: default;
      }
    }
  }
  &__day--outside:not(:disabled) {
    color: rgba(244, 246, 249, 0.3) !important;
  }
  &__day--today::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 4px;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: $gold-bright;
    transform: translateX(-50%);
  }
  &__day--range {
    background: rgba(227, 201, 135, 0.09) !important;
  }
  &__day--selected {
    background: $gold !important;
    color: $night !important;
    font-weight: 700 !important;
  }
}

/* custom guest picker */
.nikz-guests {
  &__top {
    flex: 0 0 42px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.4rem;
    padding: 0 0.65rem;
    border-bottom: 1px solid rgba(244, 246, 249, 0.1);

    span {
      min-width: 0;
      overflow: hidden;
      color: $gold-bright;
      font-size: 0.52rem;
      font-weight: 600;
      letter-spacing: 0.11em;
      text-overflow: ellipsis;
      text-transform: uppercase;
      white-space: nowrap;
    }
    button {
      flex: 0 0 24px;
      width: 24px;
      height: 24px;
      border: 0;
      background: transparent;
      color: rgba(244, 246, 249, 0.72);
      font-size: 1.1rem;
      cursor: pointer;
    }
  }
  &__option {
    flex: 1;
    min-height: 0;
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0 0.65rem;
    border: 0;
    border-bottom: 1px solid rgba(244, 246, 249, 0.08);
    border-radius: 0;
    background: transparent;
    color: rgba(244, 246, 249, 0.82);
    text-align: left;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;

    &:last-child {
      border-bottom: 0;
    }
    &:hover,
    &--active {
      background: rgba(227, 201, 135, 0.12);
      color: #fff;
    }
    strong {
      min-width: 1ch;
      color: $gold-bright;
      font-family: 'Fraunces', serif;
      font-size: 1rem;
      font-weight: 400;
    }
    span {
      overflow: hidden;
      font-size: 0.64rem;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

/* ---------- about ---------- */
.nikz-about {
  position: relative;
  overflow: hidden;
  background: black;
  color: $bg;
  padding-block: clamp(4.2rem, 16vw, 8rem);
  border-top: 1px solid rgba(227, 201, 135, 0.12);

  // &::before {
  //   content: '';
  //   position: absolute;
  //   top: -180px;
  //   right: -180px;
  //   width: 420px;
  //   height: 420px;
  //   border-radius: 50%;
  //   background: radial-gradient(circle, rgba(194, 161, 90, 0.11), transparent 68%);
  //   pointer-events: none;
  // }
  &__grid {
    position: relative;
    z-index: 1;
    display: grid;
    gap: 2rem;
  }
  &__intro h2 {
    max-width: 11ch;
    margin-top: 1rem;
    color: $bg;
    font-size: clamp(2.25rem, 11vw, 4.7rem);
    font-weight: 300;
    line-height: 0.98;
  }
  &__copy {
    max-width: 45ch;

    p {
      color: rgba(244, 246, 249, 0.66);
      font-size: 0.98rem;
      line-height: 1.75;
    }
  }
  &__link {
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    margin-top: 1.6rem;
    padding: 0 0 0.5rem;
    border: 0;
    border-bottom: 1px solid rgba(227, 201, 135, 0.45);
    border-radius: 0;
    background: transparent;
    color: $gold-bright;
    font-size: 0.76rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;

    span {
      font-size: 1rem;
      transition: transform 0.25s ease;
    }
    &:hover span {
      transform: translateX(4px);
    }
  }
  &__facts {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    border-top: 1px solid rgba(244, 246, 249, 0.12);
    border-bottom: 1px solid rgba(244, 246, 249, 0.12);

    article {
      min-width: 0;
      padding: 1.2rem 0.7rem;
      border-right: 1px solid rgba(244, 246, 249, 0.12);

      &:last-child {
        border-right: 0;
      }
    }
    strong {
      display: block;
      color: $gold-bright;
      font-family: 'Fraunces', serif;
      font-size: clamp(1.15rem, 5vw, 1.8rem);
      font-weight: 400;
      line-height: 1;
    }
    span {
      display: block;
      margin-top: 0.55rem;
      color: rgba(244, 246, 249, 0.48);
      font-size: clamp(0.55rem, 2vw, 0.68rem);
      line-height: 1.35;
    }
  }

  @media (min-width: 860px) {
    &__grid {
      grid-template-columns: 1.15fr 0.85fr;
      align-items: end;
      column-gap: 5rem;
    }
    &__facts {
      grid-column: 1 / -1;
      margin-top: 1.5rem;
    }
    &__facts article {
      padding: 1.5rem 1.2rem;
    }
  }
}

@keyframes nikz-kenburns {
  to {
    transform: scale(1.12);
  }
}
@keyframes nikz-twinkle {
  from {
    opacity: 0.55;
  }
  to {
    opacity: 1;
  }
}
@keyframes nikz-drop {
  0% {
    opacity: 0;
    transform: scaleY(0);
    transform-origin: top;
  }
  40% {
    opacity: 1;
    transform: scaleY(1);
  }
  100% {
    opacity: 0;
    transform: scaleY(1);
    transform-origin: bottom;
  }
}

/* ---------- sections ---------- */
.nikz-sec {
  padding-block: clamp(3.5rem, 12vw, 7rem);
}
.nikz-sechead {
  margin-bottom: 2rem;

  h2 {
    font-size: clamp(2rem, 8vw, 3rem);
    font-weight: 300;
    margin-top: 0.9rem;
  }
  &--center {
    text-align: center;

    .nikz-eyebrow {
      justify-content: center;
    }
  }
}

/* ---------- stays ---------- */
.nikz-stays {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.2rem;
}
.nikz-stay {
  background: $surface;
  border: 1px solid $line;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.4s $ease, box-shadow 0.4s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow;
  }
  &__ph {
    position: relative;
    aspect-ratio: 3 / 2;
    overflow: hidden;
    background: $line;
    border: 0;
    padding: 0;
    cursor: pointer;
    display: block;
    width: 100%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.7s $ease;
    }
  }
  &:hover &__ph img {
    transform: scale(1.05);
  }
  &__cap {
    position: absolute;
    top: 12px;
    left: 12px;
    background: rgba(244, 246, 249, 0.92);
    backdrop-filter: blur(4px);
    font-size: 0.7rem;
    font-weight: 600;
    padding: 0.4em 0.8em;
    border-radius: 999px;
    color: $ink;
  }
  &__badge {
    position: absolute;
    bottom: 12px;
    right: 12px;
    background: rgba(11, 13, 18, 0.6);
    backdrop-filter: blur(4px);
    color: $bg;
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.03em;
    padding: 0.35em 0.7em;
    border-radius: 999px;
  }
  &__view {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.45em;
    background: rgba(11, 13, 18, 0);
    color: $bg;
    font-weight: 600;
    font-size: 0.86rem;
    letter-spacing: 0.04em;
    opacity: 0;
    transition: opacity 0.35s, background 0.35s;

    i {
      font-style: normal;
      font-size: 1.1em;
    }
  }
  &__ph:hover &__view,
  &__ph:focus-visible &__view {
    opacity: 1;
    background: rgba(11, 13, 18, 0.42);
  }
  &__body {
    padding: 1.4rem;
    display: flex;
    flex-direction: column;
    flex: 1;

    h3 {
      font-size: 1.5rem;
    }
  }
  &__amen {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin: 0.9rem 0 0;

    li {
      font-size: 0.76rem;
      color: $muted;
      border: 1px solid $line;
      padding: 0.25em 0.7em;
      border-radius: 999px;
    }
  }
  &__cta {
    margin-top: 10px;
    width: 100%;
  }
}

/* ---------- night ---------- */
.nikz-night {
  position: relative;
  background: $night;
  color: $bg;
  overflow: hidden;
  padding-block: clamp(4rem, 14vw, 7rem);

  &__stars {
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(1.4px 1.4px at 8% 18%, rgba(255, 255, 255, 0.8), transparent),
      radial-gradient(1px 1px at 22% 42%, rgba(255, 255, 255, 0.5), transparent),
      radial-gradient(1.2px 1.2px at 35% 12%, rgba(255, 255, 255, 0.7), transparent),
      radial-gradient(1px 1px at 48% 60%, rgba(255, 255, 255, 0.45), transparent),
      radial-gradient(1.5px 1.5px at 62% 28%, rgba(255, 255, 255, 0.85), transparent),
      radial-gradient(1px 1px at 74% 52%, rgba(255, 255, 255, 0.5), transparent),
      radial-gradient(1.2px 1.2px at 84% 16%, rgba(255, 255, 255, 0.7), transparent),
      radial-gradient(1px 1px at 92% 64%, rgba(255, 255, 255, 0.5), transparent),
      radial-gradient(1px 1px at 14% 74%, rgba(255, 255, 255, 0.45), transparent),
      radial-gradient(1.3px 1.3px at 56% 82%, rgba(255, 255, 255, 0.65), transparent);
    animation: nikz-twinkle 6s ease-in-out infinite alternate;
  }
  &__moon {
    position: absolute;
    top: -60px;
    right: -40px;
    width: 220px;
    height: 220px;
    border-radius: 50%;
    background: radial-gradient(circle at 40% 40%, rgba(227, 201, 135, 0.22), transparent 62%);
  }
  &__grid {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  &__copy {
    h2 {
      color: $bg;
      font-size: clamp(2rem, 8vw, 3rem);
      font-weight: 300;
      margin: 0.9rem 0 1.2rem;
    }
    p {
      color: rgba(244, 246, 249, 0.72);
      max-width: 44ch;

      & + p {
        margin-top: 0.9rem;
      }
    }
    .nikz-btn {
      margin-top: 1.8rem;
    }
  }
  &__line {
    color: rgba(244, 246, 249, 0.55) !important;
    font-style: italic;
    font-family: 'Fraunces', serif;
  }
  &__media img {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    border-radius: 14px;
    box-shadow: 0 30px 60px -30px #000;
  }
}

/* ---------- occasions ---------- */
.nikz-occ {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
.nikz-occ__tile {
  position: relative;
  aspect-ratio: 3 / 2;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.8s $ease;
  }
  &:hover img {
    transform: scale(1.06);
  }
  .nikz-occ__veil {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(11, 13, 18, 0.05) 30%, rgba(11, 13, 18, 0.78) 100%);
  }
  .nikz-occ__label {
    position: absolute;
    left: 1.4rem;
    right: 1.4rem;
    bottom: 1.3rem;
    color: $bg;

    &::before {
      content: '';
      display: block;
      width: 30px;
      height: 1px;
      background: $gold-bright;
      margin-bottom: 0.8rem;
    }
    h3 {
      color: $bg;
      font-size: 1.6rem;
      font-weight: 400;
    }
    p {
      color: rgba(244, 246, 249, 0.78);
      font-size: 0.86rem;
      margin-top: 0.25rem;
    }
  }
}

/* ---------- testimonials carousel ---------- */
.nikz-quotes {
  margin-top: 2.6rem;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);

  &__track {
    display: flex;
    gap: 1.1rem;
    width: max-content;
    padding-inline: 20px;
    animation: nikz-marquee 46s linear infinite;
  }
  &:hover &__track {
    animation-play-state: paused;
  }
}
.nikz-quote {
  flex: 0 0 auto;
  width: min(82vw, 340px);
  background: $surface;
  border: 1px solid $line;
  border-radius: 16px;
  padding: 1.8rem 1.6rem;
  margin: 0;

  &__stars {
    color: $gold;
    letter-spacing: 0.14em;
    font-size: 0.85rem;
    margin-bottom: 0.9rem;
  }
  blockquote {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 1.1rem;
    line-height: 1.5;
    color: $ink;
    margin: 0;
  }
  figcaption {
    margin-top: 1.2rem;
    font-size: 0.74rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: $muted;
  }
}
@keyframes nikz-marquee {
  to {
    transform: translateX(-50%);
  }
}

/* ---------- location ---------- */
.nikz-loc {
  display: flex;
  flex-direction: column;
  gap: 2rem;

  &__copy h2 {
    font-size: clamp(2rem, 8vw, 3rem);
    font-weight: 300;
    margin: 0.9rem 0 1.2rem;
  }
  &__lead {
    color: $muted;
    max-width: 46ch;
  }
  &__meta {
    display: grid;
    gap: 0.8rem;
    margin: 1.8rem 0 0;

    li {
      font-size: 0.92rem;
      color: $text;
    }
    span {
      font-size: 0.66rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: $gold-deep;
      font-weight: 600;
      margin-right: 0.4rem;
    }
  }
  &__cta {
    margin-top: 1.6rem;
  }
}
.nikz-map {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid $line;
  height: 300px;
  box-shadow: $shadow-sm;

  iframe {
    width: 100%;
    height: 100%;
    border: 0;
    filter: grayscale(0.3) contrast(1.03);
  }
}

/* ---------- footer ---------- */
.nikz-foot {
  background: $ink;
  color: $bg;
  padding-block: clamp(3rem, 8vw, 4.5rem);
  margin-top: clamp(3rem, 8vw, 5rem);

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  &__logo {
    font-family: 'Fraunces', serif;
    font-size: 1.6rem;
    margin-bottom: 0.7rem;
  }
  &__tag {
    color: rgba(244, 246, 249, 0.62);
    max-width: 34ch;
    font-size: 0.92rem;
  }
  h4 {
    font-family: 'Hanken Grotesk', sans-serif;
    font-size: 0.7rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: $gold-bright;
    margin-bottom: 1rem;
    font-weight: 600;
  }
  a {
    display: block;
    color: rgba(244, 246, 249, 0.78);
    padding: 0.25em 0;
    font-size: 0.92rem;
    transition: color 0.3s;

    &:hover {
      color: #fff;
    }
  }
  &__eu {
    display: flex;
    gap: 0.9rem;
    align-items: center;
    margin-top: 1.3rem;

    img {
      height: 38px;
      background: #fff;
      border-radius: 5px;
      padding: 5px;
    }
    small {
      font-size: 0.7rem;
      color: rgba(244, 246, 249, 0.5);
      max-width: 24ch;
      line-height: 1.5;
    }
  }
  &__bottom {
    border-top: 1px solid rgba(244, 246, 249, 0.14);
    margin-top: 2.4rem;
    padding-top: 1.4rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    font-size: 0.76rem;
    color: rgba(244, 246, 249, 0.5);
  }
}

/* ---------- booking ---------- */
.nikz-book {
  padding-top: 92px;
  min-height: 100vh;
}
.nikz-back {
  font-size: 0.84rem;
  color: $muted;
  font-weight: 600;
  background: none;
  border: 0;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: $ink;
  }
}
.nikz-book__title {
  font-size: clamp(2.2rem, 9vw, 3rem);
  font-weight: 300;
  margin: 1rem 0 0.5rem;
}
.nikz-book__sub {
  color: $muted;
  max-width: 50ch;
}
.nikz-book__layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 2.4rem;
  padding-bottom: 3rem;
}
.nikz-step {
  margin-bottom: 2rem;

  &__lbl {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    margin-bottom: 1.1rem;

    h3 {
      font-size: 1.25rem;
    }
    i {
      font-style: normal;
      font-size: 0.82rem;
      color: $muted;
      font-family: 'Hanken Grotesk', sans-serif;
    }
    span {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 1px solid $gold;
      color: $gold-deep;
      display: grid;
      place-content: center;
      font-size: 0.82rem;
      font-weight: 600;
      font-family: 'Fraunces', serif;
      flex: none;
    }
  }
}
.nikz-picks {
  display: grid;
  gap: 0.9rem;
}
.nikz-pick {
  display: grid;
  grid-template-columns: 84px 1fr;
  gap: 1rem;
  align-items: center;
  border: 1px solid $line;
  border-radius: 14px;
  padding: 0.8rem;
  cursor: pointer;
  background: $surface;
  transition: border-color 0.3s, box-shadow 0.3s;

  &:hover {
    border-color: $gold;
  }
  &--on {
    border-color: $ink;
    box-shadow: 0 0 0 1px $ink;
  }
  img {
    width: 84px;
    height: 84px;
    object-fit: cover;
    border-radius: 10px;
    background: $line;
  }
  &__name {
    display: block;
    font-family: 'Fraunces', serif;
    font-size: 1.2rem;
    color: $ink;
  }
  &__meta {
    display: block;
    font-size: 0.8rem;
    color: $muted;
    margin-top: 0.15rem;
  }
  &__price {
    grid-column: 1 / -1;
    display: flex;
    align-items: baseline;
    gap: 0.4rem;
    border-top: 1px solid $line;
    padding-top: 0.7rem;

    b {
      font-family: 'Fraunces', serif;
      font-size: 1.2rem;
      color: $ink;
    }
    small {
      font-size: 0.72rem;
      color: $muted;
    }
  }
}
.nikz-frow {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.9rem;
}
.nikz-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  &--mt {
    margin-top: 0.9rem;
  }
  span {
    font-size: 0.68rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: $gold-deep;
    font-weight: 600;
  }
  input,
  textarea {
    font-family: inherit;
    font-size: 1rem;
    color: $ink;
    background: $surface;
    border: 1px solid $line;
    border-radius: 10px;
    padding: 0.8em 0.9em;
    transition: border-color 0.3s;

    &:focus {
      outline: none;
      border-color: $gold;
    }
  }
  textarea {
    resize: vertical;
    min-height: 86px;
  }
}
.nikz-stepper {
  display: flex;
  align-items: center;
  border: 1px solid $line;
  border-radius: 10px;
  width: fit-content;
  overflow: hidden;
  background: $surface;

  button {
    width: 48px;
    height: 48px;
    background: $surface;
    border: 0;
    font-size: 1.3rem;
    color: $ink;
    cursor: pointer;

    &:hover {
      background: $bg;
    }
  }
  em {
    font-style: normal;
    min-width: 52px;
    text-align: center;
    font-weight: 600;
    font-size: 1.05rem;
    color: $ink;
  }
}
.nikz-addons {
  display: grid;
  gap: 0.7rem;
}
.nikz-addon {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  border: 1px solid $line;
  border-radius: 12px;
  padding: 0.9rem 1rem;
  cursor: pointer;
  background: $surface;
  transition: border-color 0.3s;

  &:hover {
    border-color: $gold;
  }
  &--on {
    border-color: $ink;
  }
  &__box {
    width: 22px;
    height: 22px;
    border: 1px solid $line;
    border-radius: 6px;
    display: grid;
    place-content: center;
    flex: none;
    color: #fff;
    font-size: 0.78rem;
    background: transparent;
    transition: 0.25s;
  }
  &--on &__box {
    background: $ink;
    border-color: $ink;
  }
  &__name {
    display: block;
    font-weight: 600;
    color: $ink;
  }
  &__desc {
    display: block;
    font-size: 0.8rem;
    color: $muted;
  }
  &__price {
    margin-left: auto;
    font-weight: 600;
    color: $ink;
    white-space: nowrap;
  }
}
.nikz-summary {
  background: $surface;
  border: 1px solid $line;
  border-radius: 18px;
  padding: 1.6rem;
  box-shadow: $shadow-sm;

  h3 {
    font-size: 1.35rem;
  }
  &__cabin {
    font-size: 0.84rem;
    color: $muted;
    margin: 0.3rem 0 1.3rem;
  }
  &__rows {
    border-bottom: 1px solid $line;
    padding-bottom: 0.6rem;
    margin-bottom: 0.6rem;
  }
  &__row {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    font-size: 0.9rem;
    padding: 0.45rem 0;

    span:first-child {
      color: $muted;
    }
  }
  &__total {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin: 0.4rem 0 1.3rem;

    span {
      font-size: 0.7rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: $gold-deep;
      font-weight: 600;
    }
    b {
      font-family: 'Fraunces', serif;
      font-size: 1.9rem;
      color: $ink;
    }
  }
  &__send {
    width: 100%;
  }
  &__note {
    font-size: 0.74rem;
    color: $muted;
    margin-top: 0.9rem;
    text-align: center;
    line-height: 1.5;
  }
}

/* ---------- gallery lightbox ---------- */
.nikz-lb {
  position: fixed;
  inset: 0;
  z-index: 120;
  background: rgba(7, 8, 10, 0.94);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 70px 16px 20px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;

  &--show {
    opacity: 1;
    visibility: visible;
  }
  &__head {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 18px 20px;
    color: $bg;
  }
  &__title {
    font-family: 'Fraunces', serif;
    font-size: 1.15rem;
  }
  &__count {
    color: rgba(244, 246, 249, 0.6);
    font-size: 0.82rem;
    letter-spacing: 0.08em;
  }
  &__close {
    position: relative;
    margin-left: auto;
    width: 40px;
    height: 40px;
    border: 1px solid rgba(244, 246, 249, 0.22);
    border-radius: 50%;
    background: none;
    cursor: pointer;
    transition: border-color 0.3s;

    &:hover {
      border-color: $gold;
    }
    span {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 16px;
      height: 1.6px;
      background: $bg;

      &:nth-child(1) {
        transform: translate(-50%, -50%) rotate(45deg);
      }
      &:nth-child(2) {
        transform: translate(-50%, -50%) rotate(-45deg);
      }
    }
  }
  &__stage {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    width: 100%;
    max-width: 1000px;
  }
  &__img {
    flex: 1;
    width: 100%;
    max-height: 70vh;
    object-fit: contain;
    border-radius: 8px;
  }
  &__nav {
    flex: none;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1px solid rgba(244, 246, 249, 0.25);
    background: rgba(244, 246, 249, 0.05);
    color: $bg;
    font-size: 1.5rem;
    line-height: 1;
    cursor: pointer;
    transition: background 0.3s, border-color 0.3s;

    &:hover {
      background: rgba(244, 246, 249, 0.16);
      border-color: $gold;
    }
  }
  &__thumbs {
    display: flex;
    gap: 0.5rem;
    margin-top: 1.1rem;
    max-width: 100%;
    overflow-x: auto;
    padding-bottom: 4px;
  }
  &__thumb {
    flex: none;
    width: 64px;
    height: 46px;
    border: 0;
    padding: 0;
    border-radius: 7px;
    overflow: hidden;
    cursor: pointer;
    opacity: 0.45;
    outline: 1px solid transparent;
    transition: opacity 0.3s, outline-color 0.3s;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    &--on {
      opacity: 1;
      outline-color: $gold;
    }
  }
}

/* ---------- toast ---------- */
.nikz-toast {
  position: fixed;
  left: 50%;
  bottom: 22px;
  transform: translateX(-50%) translateY(160%);
  background: $ink;
  color: $bg;
  padding: 0.9em 1.4em;
  border-radius: 11px;
  box-shadow: $shadow;
  z-index: 130;
  transition: transform 0.5s $ease;
  font-size: 0.88rem;
  max-width: 92vw;
  text-align: center;

  &--show {
    transform: translateX(-50%) translateY(0);
  }
}

/* ---------- reveal ---------- */
.nikz-reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s $ease, transform 0.8s $ease;

  &.nikz-in {
    opacity: 1;
    transform: none;
  }
}

/* ====== TABLET ====== */
@media (min-width: 720px) {
  .nikz-wrap {
    padding-inline: 36px;
    max-width: 1180px;
  }
  .nikz-stays,
  .nikz-occ {
    grid-template-columns: repeat(2, 1fr);
  }
  .nikz-frow {
    grid-template-columns: 1fr 1fr;
  }
  .nikz-pick {
    grid-template-columns: 96px 1fr auto;

    img {
      width: 96px;
      height: 72px;
    }
    &__price {
      grid-column: auto;
      flex-direction: column;
      align-items: flex-end;
      border-top: 0;
      padding-top: 0;
      gap: 0;
    }
  }
  .nikz-quote {
    width: 360px;
  }
  .nikz-lb__nav {
    width: 52px;
    height: 52px;
  }
  .nikz-foot__grid {
    grid-template-columns: 1.6fr 1fr 1fr;
  }
  .nikz-foot__bottom {
    flex-direction: row;
    justify-content: space-between;
  }
}

/* ====== DESKTOP ====== */
@media (min-width: 1024px) {
  .nikz-tel {
    display: inline;
    font-size: 0.86rem;
    font-weight: 600;
    color: rgba(244, 246, 249, 0.92);
    margin-right: 0.3rem;
  }
  .nikz-hdr--solid .nikz-tel {
    color: $ink;
  }
  .nikz-navcta {
    display: inline-flex;
    background: $gold;
    color: $night;
    border-color: $gold;

    &:hover {
      background: $gold-bright;
    }
  }
  .nikz-hdr--solid .nikz-navcta {
    background: $ink;
    color: $bg;
    border-color: $ink;

    &:hover {
      background: $ink-soft;
    }
  }
  .nikz-burger {
    display: none;
  }
  .nikz-links {
    display: flex;
    align-items: center;
    gap: 2rem;

    a {
      font-size: 0.86rem;
      font-weight: 500;
      color: rgba(244, 246, 249, 0.92);
      position: relative;
      padding: 0.3em 0;
      transition: color 0.3s;

      &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -3px;
        height: 1px;
        width: 0;
        background: $gold;
        transition: width 0.35s $ease;
      }
      &:hover::after {
        width: 100%;
      }
    }
  }
  .nikz-hdr--solid .nikz-links a {
    color: $text;
  }
  .nikz-nav {
    height: 76px;
  }

  .nikz-stays {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.6rem;
  }
  .nikz-occ {
    grid-template-columns: repeat(4, 1fr);

    .nikz-occ__tile {
      aspect-ratio: 3 / 4;
    }
  }

  .nikz-night__grid {
    flex-direction: row;
    align-items: center;
    gap: 4rem;
  }
  .nikz-night__copy,
  .nikz-night__media {
    flex: 1;
  }
  .nikz-night__media img {
    aspect-ratio: 4 / 5;
  }

  .nikz-loc {
    flex-direction: row;
    align-items: center;
    gap: 4rem;

    > div {
      flex: 1;
    }
  }
  .nikz-map {
    height: 460px;
  }

  .nikz-book__layout {
    flex-direction: row;
    align-items: start;
    gap: 3rem;

    .nikz-form {
      flex: 1;
    }
  }
  .nikz-summary {
    width: 360px;
    position: sticky;
    top: 100px;
  }
}

/* ====== reduced motion ====== */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation: none !important;
    transition-duration: 0.001ms !important;
  }
  .nikz-reveal {
    opacity: 1;
    transform: none;
  }
  .nikz-hero__inner > * {
    opacity: 1 !important;
    transform: none !important;
  }
  .nikz-quotes__track {
    flex-wrap: wrap;
    width: auto;
    justify-content: center;
  }
}
</style>