<template>
  <main class="luna-booking-page">
    <section class="luna-hero" id="top">
      <img class="luna-hero__image" :src="nailZakaziHeroImage" alt="Luna Nail Studio" />

      <div class="luna-hero__shade"></div>
      <div class="luna-hero__warm"></div>

      <header class="luna-header">
        <button class="luna-brand" type="button" aria-label="Studio Luna Nails">
          <span class="luna-brand__logo">
            <span class="luna-brand__moon">◐</span>
            <span class="luna-brand__initial">L</span>
            <span class="luna-brand__spark luna-brand__spark--one">✦</span>
            <span class="luna-brand__spark luna-brand__spark--two">✦</span>
          </span>

          <span class="luna-brand__text">
            <strong>Studio Luna Nails</strong>
            <small>Nail studio</small>
          </span>
        </button>

        <button
          class="luna-menu"
          type="button"
          :class="{ 'is-open': menuOpen }"
          aria-label="Otvori meni"
          @click="menuOpen = !menuOpen"
        >
          <span></span>
        </button>
      </header>

      <div class="luna-hero__content">
        <h1>
          Tvoj termin,<br />
          tvoj <em>trenutak.</em>
        </h1>

        <p class="luna-hero__text">
          Izaberi uslugu, stil i vreme koje ti najviše odgovara.
        </p>

        <div class="luna-hero__actions">
          <button class="luna-primary" type="button" @click="scrollToBookingCard">
            <span class="luna-primary__icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 3v3M17 3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
                <path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01" />
              </svg>
            </span>
            Kreni sa zakazivanjem
          </button>

          <button class="luna-play" type="button" aria-label="Pogledaj salon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 7.8v8.4c0 .75.82 1.22 1.47.84l7.15-4.2a.98.98 0 0 0 0-1.68l-7.15-4.2A.98.98 0 0 0 9 7.8Z" />
            </svg>
          </button>
        </div>
      </div>

      <div class="luna-hero__curve">
        <svg viewBox="0 0 1440 180" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,92 C170,0 360,70 540,78 C800,90 1020,128 1440,8 L1440,180 L0,180 Z" />
        </svg>
      </div>
    </section>

    <section class="luna-intro" id="booking">
      <div class="luna-intro__ornament">✦</div>

      <p class="luna-kicker">
        <span>✶</span>
        Zakaži svoj termin
      </p>

      <h2>Sve na jednom mestu</h2>
      <p class="luna-intro__lead">Brzo, jednostavno i bez čekanja.</p>

      <div class="luna-features">
        <article
          v-for="feature in features"
          :key="feature.title"
          class="luna-feature"
        >
          <div class="luna-feature__icon" v-html="feature.icon"></div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.text }}</p>
        </article>
      </div>

      <div class="luna-intro__bottom-curve">
        <svg viewBox="0 0 1440 180" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,92 C170,0 360,70 540,78 C800,90 1020,128 1440,8 L1440,180 L0,180 Z" />
        </svg>
      </div>
    </section>

    <section ref="bookingCard" class="luna-booking-card">
      <p>Spremna za novi izgled?</p>
      <h2>Tvoj termin čeka na tebe.</h2>

      <button type="button" @click="scrollToBookingSystem" aria-label="Zakaži termin">
        <span>♡</span>
      </button>
    </section>

    <section ref="bookingSystem" class="luna-booking-app">
      <div class="luna-booking-app__glow"></div>

      <div class="luna-booking-app__head">
        <span>ONLINE BOOKING</span>
        <h2>Napravi svoj tretman</h2>
        <p>Izaberi uslugu, oblik, boju, stil i termin bez čekanja.</p>
      </div>

      <div class="luna-booking-progress">
        <i :class="{ active: selectedService }"></i>
        <i :class="{ active: selectedLength && selectedShape && selectedColor && selectedStyle }"></i>
        <i :class="{ active: selectedArtist }"></i>
        <i :class="{ active: selectedDay && selectedSlot }"></i>
        <i :class="{ active: customer.name.trim() && customer.phone.trim() }"></i>
      </div>

      <div class="luna-booking-flow">
        <section class="luna-flow-section">
          <div class="luna-flow-title">
            <div>
              <h3>Usluga</h3>
              <p>Šta radiš danas?</p>
            </div>
          </div>

          <div class="luna-service-carousel">
            <button
              v-for="service in services"
              :key="service.id"
              type="button"
              class="luna-service-option"
              :class="{ active: selectedServiceId === service.id }"
              @click="selectService(service.id)"
            >
              <span class="luna-service-option__icon" v-html="service.icon"></span>

              <span class="luna-service-option__content">
                <strong>{{ service.name }}</strong>
                <small>{{ service.duration }} min</small>
              </span>

              <em>{{ service.price }} RSD</em>
            </button>
          </div>
        </section>

        <Transition name="luna-reveal">
          <section v-if="selectedService" class="luna-flow-section">
            <div class="luna-flow-title">
              <div>
                <h3>Dužina</h3>
                <p>Koliko želiš da nokti budu dugi?</p>
              </div>
            </div>

            <div class="luna-length-switch">
              <button
                v-for="length in lengths"
                :key="length.id"
                type="button"
                :class="{ active: selectedLengthId === length.id }"
                @click="selectedLengthId = length.id"
              >
                <strong>{{ length.name }}</strong>
                <span>{{ length.extraMinutes ? `+${length.extraMinutes}m` : 'base' }}</span>
              </button>
            </div>
          </section>
        </Transition>

        <Transition name="luna-reveal">
          <section v-if="selectedService" class="luna-flow-section">
            <div class="luna-flow-title">
              <div>
                <h3>Oblik</h3>
                <p>Izaberi siluetu nokta.</p>
              </div>
            </div>

            <div class="luna-shape-carousel">
              <button
                v-for="shape in shapes"
                :key="shape.id"
                type="button"
                class="luna-shape-option"
                :class="{ active: selectedShapeId === shape.id }"
                @click="selectedShapeId = shape.id"
              >
                <span :class="['luna-nail-preview', `luna-nail-preview--${shape.preview}`]"></span>
                <strong>{{ shape.name }}</strong>
              </button>
            </div>
          </section>
        </Transition>

        <Transition name="luna-reveal">
          <section v-if="selectedService" class="luna-flow-section">
            <div class="luna-flow-title">
              <div>
                <h3>Boja</h3>
                <p>Nijansa koja nosi ceo izgled.</p>
              </div>
            </div>

            <div class="luna-color-carousel">
              <button
                v-for="color in colors"
                :key="color.id"
                type="button"
                class="luna-color-option"
                :class="{ active: selectedColorId === color.id }"
                @click="selectedColorId = color.id"
              >
                <span :style="{ background: color.value }">
                  <i v-if="selectedColorId === color.id">✓</i>
                </span>
                <strong>{{ color.name }}</strong>
              </button>
            </div>
          </section>
        </Transition>

        <Transition name="luna-reveal">
          <section v-if="selectedService" class="luna-flow-section">
            <div class="luna-flow-title">
              <div>
                <h3>Stil</h3>
                <p>Finalni efekat tretmana.</p>
              </div>
            </div>

            <div class="luna-style-stack">
              <button
                v-for="style in styles"
                :key="style.id"
                type="button"
                class="luna-style-option"
                :class="{ active: selectedStyleId === style.id }"
                @click="selectedStyleId = style.id"
              >
                <span>{{ style.label }}</span>

                <div>
                  <strong>{{ style.name }}</strong>
                  <small>{{ style.extraMinutes ? `+${style.extraMinutes} min · +${style.price} RSD` : 'uključeno u osnovnu cenu' }}</small>
                </div>

                <i></i>
              </button>
            </div>
          </section>
        </Transition>

        <Transition name="luna-reveal">
          <section v-if="selectedService" class="luna-flow-section">
            <div class="luna-flow-title">
              <div>
                <h3>Dodaci</h3>
                <p>Dodaj samo ako želiš.</p>
              </div>
            </div>

            <div class="luna-extra-cloud">
              <button
                v-for="extra in extras"
                :key="extra.id"
                type="button"
                class="luna-extra-chip"
                :class="{ active: selectedExtraIds.includes(extra.id) }"
                @click="toggleExtra(extra.id)"
              >
                <span>{{ selectedExtraIds.includes(extra.id) ? '✓' : '+' }}</span>
                <strong>{{ extra.name }}</strong>
              </button>
            </div>
          </section>
        </Transition>

        <Transition name="luna-reveal">
          <section v-if="selectedService" class="luna-flow-section">
            <div class="luna-flow-title">
              <div>
                <h3>Nail artist</h3>
                <p>Izaberi osobu koja radi tretman.</p>
              </div>
            </div>

            <div class="luna-artist-carousel">
              <button
                v-for="artist in artists"
                :key="artist.id"
                type="button"
                class="luna-artist-option"
                :class="{ active: selectedArtistId === artist.id }"
                @click="selectedArtistId = artist.id"
              >
                <img :src="artist.image" :alt="artist.name" />
                <span>
                  <strong>{{ artist.name }}</strong>
                  <small>{{ artist.note }}</small>
                </span>
              </button>
            </div>
          </section>
        </Transition>

        <Transition name="luna-reveal">
          <section v-if="selectedService" class="luna-flow-section luna-flow-section--date">
            <div class="luna-flow-title">
              <div>
                <h3>Datum</h3>
                <p>Slobodni dani za izabrani tretman.</p>
              </div>
            </div>

            <div class="luna-day-carousel">
              <button
                v-for="day in days"
                :key="day.id"
                type="button"
                class="luna-day-option"
                :class="{ active: selectedDayId === day.id }"
                @click="selectDay(day.id)"
              >
                <small>{{ day.weekday }}</small>
                <strong>{{ day.day }}</strong>
                <span>{{ day.month }}</span>
              </button>
            </div>

            <div class="luna-time-grid">
              <button
                v-for="slot in visibleSlots"
                :key="slot.time"
                type="button"
                :disabled="!slot.available"
                :class="{ active: selectedSlot === slot.time }"
                @click="selectedSlot = slot.time"
              >
                {{ slot.time }}
              </button>
            </div>
          </section>
        </Transition>

        <Transition name="luna-reveal">
          <section v-if="selectedService" class="luna-flow-section">
            <div class="luna-flow-title">
              <div>
                <h3>Podaci</h3>
                <p>Još samo kontakt za potvrdu.</p>
              </div>
            </div>

            <div class="luna-client-form">
              <label>
                <span>Ime</span>
                <input v-model="customer.name" type="text" placeholder="Milica" />
              </label>

              <label>
                <span>Telefon</span>
                <input v-model="customer.phone" type="tel" placeholder="060 123 4567" />
              </label>

              <label>
                <span>Napomena</span>
                <textarea v-model="customer.note" rows="3" placeholder="Npr. french sa cirkonima"></textarea>
              </label>
            </div>
          </section>
        </Transition>
      </div>

      <Transition name="luna-bottom-pop">
        <aside v-if="selectedService" class="luna-booking-bottom">
          <div class="luna-booking-bottom__info">
            <span>{{ selectedService.name }}</span>
            <strong>{{ totalPrice }} RSD</strong>
            <small>{{ totalDuration }} min · {{ selectedDay?.label || 'dan' }} {{ selectedSlot ? `u ${selectedSlot}` : '' }}</small>
          </div>

          <button type="button" :disabled="!canConfirm" @click="confirmOpen = true">
            Potvrdi
          </button>
        </aside>
      </Transition>
    </section>

    <Transition name="luna-modal-fade">
      <div v-if="confirmOpen" class="luna-confirm-modal" @click.self="confirmOpen = false">
        <div class="luna-confirm-sheet">
          <button class="luna-confirm-sheet__close" type="button" @click="confirmOpen = false">×</button>

          <span class="luna-confirm-sheet__icon">✓</span>
          <p>Termin je spreman</p>
          <h3>{{ customer.name || 'Klijent' }}, tvoj zahtev je kreiran.</h3>

          <div class="luna-confirm-sheet__info">
            <span>{{ selectedService?.name }}</span>
            <strong>{{ selectedDay?.label }} u {{ selectedSlot }}</strong>
            <small>{{ totalDuration }} min · {{ totalPrice }} RSD</small>
          </div>

          <button type="button" @click="confirmOpen = false">Zatvori</button>
        </div>
      </div>
    </Transition>

    <transition name="luna-drawer-fade">
      <div
        v-if="menuOpen"
        class="luna-drawer-backdrop"
        @click.self="menuOpen = false"
      >
        <nav class="luna-drawer">
          <button class="luna-drawer__close" type="button" @click="menuOpen = false">
            ×
          </button>

          <div class="luna-drawer__brand">
            <span class="luna-drawer__logo">
              <span>◐</span>
              <strong>L</strong>
            </span>

            <div>
              <h3>Studio Luna Nails</h3>
              <p>Nail studio</p>
            </div>
          </div>

          <div class="luna-drawer__links">
            <a href="#top" @click="menuOpen = false">Početna</a>
            <a href="#booking" @click="handleMenuBooking">Zakazivanje</a>
            <a href="#top" @click="menuOpen = false">Usluge</a>
            <a href="#top" @click="menuOpen = false">Kontakt</a>
          </div>

          <button type="button" class="luna-drawer__cta" @click="scrollToBookingSystem">
            Zakaži termin
          </button>
        </nav>
      </div>
    </transition>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

import nailZakaziHeroImage from '@/assets/img/nail-zakazi-hero.png'
import nailArtistOneImage from '@/assets/img/nail-artist-1.jpg'
import nailArtistTwoImage from '@/assets/img/nail-artist-2.jpg'
import nailArtistThreeImage from '@/assets/img/nail-artist-3.jpg'

const menuOpen = ref(false)
const confirmOpen = ref(false)

const bookingCard = ref<HTMLElement | null>(null)
const bookingSystem = ref<HTMLElement | null>(null)

const selectedServiceId = ref('gel-lak')
const selectedLengthId = ref('srednji')
const selectedShapeId = ref('almond')
const selectedColorId = ref('milky')
const selectedStyleId = ref('milky')
const selectedArtistId = ref('ana')
const selectedDayId = ref('danas')
const selectedSlot = ref('12:30')
const selectedExtraIds = ref<string[]>([])

const customer = reactive({
  name: '',
  phone: '',
  note: '',
})

const features = [
  {
    title: 'Brzo zakazivanje',
    text: 'Nađi slobodan termin za par sekundi.',
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 6 9 17l-5-5"/>
      </svg>
    `,
  },
  {
    title: 'Premium kvalitet',
    text: 'Korišćeni vrhunski materijali za zdravlje noktiju.',
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.5 4h11L22 10l-10 10L2 10 6.5 4Z"/>
        <path d="M2 10h20M8 4l4 16M16 4l-4 16"/>
      </svg>
    `,
  },
  {
    title: 'Posvećeno tebi',
    text: 'Tvoj stil, tvoj trenutak, naša posvećenost.',
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z"/>
      </svg>
    `,
  },
  {
    title: 'Higijena na prvom mestu',
    text: 'Sterilni alati i čisto okruženje za tvoju sigurnost.',
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 4C11 5 5 11 4 20c9-1 15-7 16-16Z"/>
        <path d="M4 20c4-5 8-8 13-11"/>
      </svg>
    `,
  },
]

const services = [
  {
    id: 'gel-lak',
    name: 'Gel lak',
    duration: 60,
    price: 2000,
    icon: `
      <svg viewBox="0 0 32 32">
        <path d="M13 4h6l1 8h-8l1-8Z" />
        <path d="M11 12h10l2 14a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2l2-14Z" />
      </svg>
    `,
  },
  {
    id: 'ojacavanje',
    name: 'Ojačavanje',
    duration: 75,
    price: 2500,
    icon: `
      <svg viewBox="0 0 32 32">
        <path d="M16 5c4.1 0 6.8 4 6.8 10.4V28H9.2V15.4C9.2 9 11.9 5 16 5Z" />
        <path d="M12 18.5c2.2 1.1 5.8 1.1 8 0" />
      </svg>
    `,
  },
  {
    id: 'izlivanje',
    name: 'Izlivanje',
    duration: 120,
    price: 3500,
    icon: `
      <svg viewBox="0 0 32 32">
        <path d="M16 5c4.1 0 6.8 4 6.8 10.4V28H9.2V15.4C9.2 9 11.9 5 16 5Z" />
        <path d="M12.2 18c1.8-1.4 5.8-1.4 7.6 0" />
      </svg>
    `,
  },
  {
    id: 'korekcija',
    name: 'Korekcija',
    duration: 90,
    price: 2800,
    icon: `
      <svg viewBox="0 0 32 32">
        <path d="M10 18V9a2 2 0 0 1 4 0v8" />
        <path d="M14 17V6.5a2 2 0 0 1 4 0V17" />
        <path d="M18 17V8a2 2 0 0 1 4 0v10" />
        <path d="M22 19v-6a2 2 0 0 1 4 0v8c0 5-3.5 8-8.5 8H15c-3.4 0-6.4-2.4-8-6l-1-2.4a2 2 0 0 1 3.6-1.8l2 2.8" />
      </svg>
    `,
  },
]

const lengths = [
  { id: 'kratki', name: 'Kratki', extraMinutes: 0, price: 0 },
  { id: 'srednji', name: 'Srednji', extraMinutes: 10, price: 300 },
  { id: 'dugi', name: 'Dugi', extraMinutes: 20, price: 500 },
  { id: 'xl', name: 'XL', extraMinutes: 30, price: 800 },
]

const shapes = [
  { id: 'square', name: 'Square', preview: 'square' },
  { id: 'soft-square', name: 'Soft', preview: 'soft' },
  { id: 'almond', name: 'Almond', preview: 'almond' },
  { id: 'oval', name: 'Oval', preview: 'oval' },
  { id: 'coffin', name: 'Coffin', preview: 'coffin' },
  { id: 'stiletto', name: 'Stiletto', preview: 'stiletto' },
]

const colors = [
  { id: 'milky', name: 'Milky', value: 'linear-gradient(145deg, #fffaf6, #f4ddd6)' },
  { id: 'nude', name: 'Nude', value: 'linear-gradient(145deg, #e8c2b2, #b98176)' },
  { id: 'baby-pink', name: 'Baby pink', value: 'linear-gradient(145deg, #ffdce9, #f4a9c2)' },
  { id: 'rose', name: 'Rose', value: 'linear-gradient(145deg, #d98b9a, #a95065)' },
  { id: 'cherry', name: 'Cherry', value: 'linear-gradient(145deg, #9c1230, #4f0717)' },
  { id: 'pearl', name: 'Pearl', value: 'linear-gradient(145deg, #ffffff, #d8d8df)' },
  { id: 'latte', name: 'Latte', value: 'linear-gradient(145deg, #d6aa8c, #8f6048)' },
  { id: 'black', name: 'Black', value: 'linear-gradient(145deg, #3d3535, #090909)' },
]

const styles = [
  { id: 'milky', name: 'Milky', label: 'Clean', extraMinutes: 0, price: 0 },
  { id: 'french', name: 'French', label: 'Classic', extraMinutes: 15, price: 500 },
  { id: 'baby-boomer', name: 'Baby boomer', label: 'Soft fade', extraMinutes: 20, price: 600 },
  { id: 'chrome', name: 'Chrome', label: 'Glow', extraMinutes: 15, price: 500 },
  { id: 'cat-eye', name: 'Cat eye', label: 'Magnetic', extraMinutes: 15, price: 500 },
  { id: 'minimal-art', name: 'Minimal art', label: 'Details', extraMinutes: 20, price: 700 },
]

const extras = [
  { id: 'skidanje', name: 'Skidanje starog materijala', extraMinutes: 20, price: 500 },
  { id: 'cirkoni', name: 'Cirkoni', extraMinutes: 10, price: 300 },
  { id: 'rucno-crtanje', name: 'Ručno crtanje', extraMinutes: 25, price: 800 },
  { id: 'popravka', name: 'Popravka nokta', extraMinutes: 15, price: 300 },
]

const artists = [
  {
    id: 'ana',
    name: 'Ana',
    note: 'French / milky',
    image: nailArtistOneImage,
  },
  {
    id: 'milica',
    name: 'Milica',
    note: 'Nail art',
    image: nailArtistTwoImage,
  },
  {
    id: 'jovana',
    name: 'Jovana',
    note: 'Gel / korekcija',
    image: nailArtistThreeImage,
  },
]

const days = [
  { id: 'danas', weekday: 'DANAS', day: '19', month: 'MAJ', label: 'Danas' },
  { id: 'sutra', weekday: 'SUTRA', day: '20', month: 'MAJ', label: 'Sutra' },
  { id: 'cet', weekday: 'ČET', day: '21', month: 'MAJ', label: 'Četvrtak' },
  { id: 'pet', weekday: 'PET', day: '22', month: 'MAJ', label: 'Petak' },
  { id: 'sub', weekday: 'SUB', day: '23', month: 'MAJ', label: 'Subota' },
  { id: 'pon', weekday: 'PON', day: '25', month: 'MAJ', label: 'Ponedeljak' },
]

const slotsByDay: Record<string, { time: string; available: boolean }[]> = {
  danas: [
    { time: '10:00', available: false },
    { time: '11:30', available: true },
    { time: '12:30', available: true },
    { time: '15:00', available: false },
    { time: '16:30', available: true },
    { time: '18:00', available: true },
  ],
  sutra: [
    { time: '09:30', available: true },
    { time: '11:00', available: true },
    { time: '13:30', available: false },
    { time: '15:30', available: true },
    { time: '17:00', available: true },
    { time: '19:00', available: false },
  ],
  cet: [
    { time: '10:30', available: true },
    { time: '12:00', available: true },
    { time: '14:00', available: true },
    { time: '16:00', available: false },
    { time: '18:30', available: true },
  ],
  pet: [
    { time: '09:00', available: true },
    { time: '10:30', available: false },
    { time: '12:00', available: true },
    { time: '15:00', available: true },
    { time: '17:30', available: true },
  ],
  sub: [
    { time: '10:00', available: true },
    { time: '11:30', available: true },
    { time: '13:00', available: false },
    { time: '15:30', available: true },
  ],
  pon: [
    { time: '09:30', available: true },
    { time: '12:30', available: true },
    { time: '14:30', available: true },
    { time: '18:00', available: true },
  ],
}

const selectedService = computed(() => services.find((item) => item.id === selectedServiceId.value))
const selectedLength = computed(() => lengths.find((item) => item.id === selectedLengthId.value))
const selectedShape = computed(() => shapes.find((item) => item.id === selectedShapeId.value))
const selectedColor = computed(() => colors.find((item) => item.id === selectedColorId.value))
const selectedStyle = computed(() => styles.find((item) => item.id === selectedStyleId.value))
const selectedArtist = computed(() => artists.find((item) => item.id === selectedArtistId.value))
const selectedDay = computed(() => days.find((item) => item.id === selectedDayId.value))
const selectedExtras = computed(() => extras.filter((item) => selectedExtraIds.value.includes(item.id)))
const visibleSlots = computed(() => slotsByDay[selectedDayId.value] || [])

const totalDuration = computed(() => {
  return (
    (selectedService.value?.duration || 0) +
    (selectedLength.value?.extraMinutes || 0) +
    (selectedStyle.value?.extraMinutes || 0) +
    selectedExtras.value.reduce((sum, item) => sum + item.extraMinutes, 0)
  )
})

const totalPrice = computed(() => {
  return (
    (selectedService.value?.price || 0) +
    (selectedLength.value?.price || 0) +
    (selectedStyle.value?.price || 0) +
    selectedExtras.value.reduce((sum, item) => sum + item.price, 0)
  )
})

const canConfirm = computed(() => {
  return Boolean(
    selectedService.value &&
      selectedLength.value &&
      selectedShape.value &&
      selectedColor.value &&
      selectedStyle.value &&
      selectedArtist.value &&
      selectedDay.value &&
      selectedSlot.value &&
      customer.name.trim() &&
      customer.phone.trim(),
  )
})

const selectService = (id: string) => {
  selectedServiceId.value = id
}

const selectDay = (id: string) => {
  selectedDayId.value = id
  const firstAvailable = slotsByDay[id]?.find((slot) => slot.available)
  selectedSlot.value = firstAvailable?.time || ''
}

const toggleExtra = (id: string) => {
  selectedExtraIds.value = selectedExtraIds.value.includes(id)
    ? selectedExtraIds.value.filter((item) => item !== id)
    : [...selectedExtraIds.value, id]
}

const scrollToBookingCard = () => {
  bookingCard.value?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

const scrollToBookingSystem = () => {
  menuOpen.value = false

  setTimeout(() => {
    bookingSystem.value?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }, 80)
}

const handleMenuBooking = () => {
  menuOpen.value = false
  setTimeout(scrollToBookingSystem, 120)
}
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Nunito+Sans:wght@400;500;600;700;800;900&display=swap');

.luna-booking-page {
  min-height: 100svh;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  overflow-x: hidden;
  color: #fff7f2;
  background:
    radial-gradient(circle at 50% 54%, rgba(255, 232, 222, 0.08), transparent 36%),
    linear-gradient(180deg, #14171c 0%, #111419 46%, #fff0f5 46%, #fff0f5 100%);
  font-family: 'Nunito Sans', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

button,
input,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.luna-hero {
  position: relative;
  min-height: 78svh;
  overflow: hidden;
  isolation: isolate;
  background: #15110f;
}

.luna-hero__image {
  position: absolute;
  inset: 0;
  z-index: -4;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 63% center;
  transform: scale(1.01);
}

.luna-hero__shade {
  position: absolute;
  inset: 0;
  z-index: -3;
  background:
    linear-gradient(90deg, rgba(22, 17, 16, 0.83) 0%, rgba(24, 18, 17, 0.58) 48%, rgba(20, 15, 14, 0.08) 100%),
    linear-gradient(180deg, rgba(12, 10, 10, 0.32) 0%, rgba(18, 14, 13, 0.04) 45%, rgba(14, 15, 18, 0.92) 100%);
}

.luna-hero__warm {
  position: absolute;
  inset: 0;
  z-index: -2;
  background:
    radial-gradient(circle at 86% 22%, rgba(242, 185, 161, 0.24), transparent 34%),
    radial-gradient(circle at 12% 56%, rgba(255, 221, 205, 0.1), transparent 34%);
  pointer-events: none;
}

.luna-header {
  position: relative;
  z-index: 5;
  min-height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 16px 0;
}

.luna-brand {
  min-width: 0;
  border: 0;
  background: transparent;
  padding: 0;
  color: inherit;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  text-align: left;
}

.luna-brand__logo {
  position: relative;
  width: 50px;
  height: 50px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  color: #9a6a60;
}

.luna-brand__moon {
  position: absolute;
  inset: 0;
  font-size: 46px;
  line-height: 1;
  transform: rotate(-18deg);
  color: rgba(156, 107, 96, 0.82);
}

.luna-brand__initial {
  position: relative;
  z-index: 2;
  font-family: 'Brush Script MT', 'Segoe Script', cursive;
  font-size: 28px;
  line-height: 1;
  color: #8f6259;
}

.luna-brand__spark {
  position: absolute;
  z-index: 3;
  color: #d7aa9f;
  font-size: 7px;
}

.luna-brand__spark--one {
  top: 8px;
  right: 5px;
}

.luna-brand__spark--two {
  top: 19px;
  right: 0;
  font-size: 6px;
}

.luna-brand__text {
  min-width: 0;
  display: grid;
  gap: 3px;
}

.luna-brand__text strong {
  color: #b47e74;
  font-family: 'Brush Script MT', 'Segoe Script', 'Snell Roundhand', cursive;
  font-size: 28px;
  font-weight: 400;
  line-height: 0.9;
  letter-spacing: -0.055em;
}

.luna-brand__text small {
  color: #e8beb4;
  font-size: 13px;
  font-style: italic;
  line-height: 1;
}

.luna-menu {
  width: 45px;
  height: 45px;
  flex: 0 0 auto;
  border: 1px solid rgba(150, 104, 91, 0.25);
  border-radius: 50%;
  background: rgba(255, 250, 246, 0.62);
  box-shadow:
    0 10px 24px rgba(93, 62, 53, 0.07),
    inset 0 1px 0 rgba(255, 255, 255, 0.88);
  color: #6c4c45;
  display: flex;
  justify-content: center;
  align-items: center;
}

.luna-menu span {
  position: relative;
  width: 18px;
  height: 1.4px;
  border-radius: 99px;
  background: #9f6e64;
  transition: background 0.2s ease;
}

.luna-menu span::before,
.luna-menu span::after {
  content: '';
  position: absolute;
  left: 0;
  width: 18px;
  height: 1.4px;
  border-radius: 99px;
  background: #9f6e64;
  transition:
    top 0.24s ease,
    transform 0.24s ease;
}

.luna-menu span::before {
  top: -5px;
}

.luna-menu span::after {
  top: 5px;
}

.luna-menu.is-open span {
  background: transparent;
}

.luna-menu.is-open span::before {
  top: 0;
  transform: rotate(45deg);
}

.luna-menu.is-open span::after {
  top: 0;
  transform: rotate(-45deg);
}

.luna-hero__content {
  position: relative;
  z-index: 4;
  width: calc(100% - 44px);
  margin-left: 22px;
  padding: 96px 0 116px;
}

.luna-hero h1 {
  margin: 0;
  color: #fffaf6;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(51px, 15vw, 70px);
  font-weight: 400;
  line-height: 0.9;
  letter-spacing: -0.045em;
  text-shadow: 0 24px 60px rgba(0, 0, 0, 0.34);
}

.luna-hero h1 em {
  color: #efbdb2;
  font-style: italic;
  font-weight: 400;
}

.luna-hero__text {
  width: 280px;
  margin: 24px 0 0;
  color: rgba(255, 247, 242, 0.9);
  font-size: 19px;
  font-weight: 400;
  line-height: 1.52;
  letter-spacing: -0.02em;
}

.luna-hero__actions {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 40px;
}

.luna-primary {
  min-width: 0;
  height: 55px;
  border: 0;
  border-radius: 999px;
  padding: 0 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 13px;
  color: #252120;
  background: linear-gradient(135deg, #f8cfc6 0%, #efb8ad 100%);
  box-shadow:
    0 20px 44px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.42);
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  white-space: nowrap;
}

.luna-primary__icon {
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
}

.luna-primary svg,
.luna-play svg {
  width: 21px;
  height: 21px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.luna-play {
  width: 55px;
  height: 55px;
  border: 2px solid rgba(255, 248, 244, 0.88);
  border-radius: 999px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  color: #fffaf6;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(10px);
}

.luna-play svg {
  width: 25px;
  height: 25px;
}

.luna-hero__curve {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -2px;
  z-index: 3;
  height: 86px;
  color: #15181d;
}

.luna-hero__curve svg,
.luna-intro__bottom-curve svg {
  width: 100%;
  height: 100%;
  display: block;
}

.luna-hero__curve path {
  fill: currentColor;
}

.luna-intro {
  position: relative;
  padding: 0 18px 125px;
  color: #fff8f4;
  background: #15181d;
}

.luna-intro__ornament {
  display: grid;
  place-items: center;
  margin: 0 auto 14px;
  color: #eab9ae;
  font-size: 19px;
}

.luna-kicker {
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 13px;
  color: #eebfb5;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.25em;
  text-transform: uppercase;
}

.luna-kicker span {
  font-size: 18px;
}

.luna-intro h2,
.luna-booking-card h2 {
  margin: 22px 0 0;
  color: #fffaf7;
  text-align: center;
  font-family: 'Cormorant Garamond', serif;
  font-size: 43px;
  font-weight: 500;
  line-height: 0.95;
  letter-spacing: -0.04em;
}

.luna-intro__lead {
  margin: 18px auto 0;
  color: rgba(255, 248, 244, 0.76);
  text-align: center;
  font-size: 17px;
  line-height: 1.5;
}

.luna-features {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 38px 0;
  margin-top: 52px;
}

.luna-feature {
  min-height: auto;
  padding: 0 18px;
  text-align: center;
  border-right: 1px solid rgba(255, 255, 255, 0.11);
}

.luna-feature:nth-child(2),
.luna-feature:last-child {
  border-right: 0;
}

.luna-feature__icon {
  width: 52px;
  height: 52px;
  margin: 0 auto 18px;
  display: grid;
  place-items: center;
  color: #efb9ad;
}

.luna-feature__icon :deep(svg) {
  width: 48px;
  height: 48px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.45;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.luna-feature h3 {
  max-width: 120px;
  margin: 0 auto;
  color: #fff8f4;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.45;
  letter-spacing: -0.02em;
}

.luna-feature p {
  max-width: 170px;
  margin: 18px auto 0;
  color: rgba(255, 248, 244, 0.72);
  font-size: 14px;
  line-height: 1.55;
}

.luna-intro__bottom-curve {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -2px;
  z-index: 1;
  height: 92px;
  color: #fff8f4;
  transform-origin: center;
}

.luna-intro__bottom-curve path {
  fill: #fff0f5;
}

.luna-booking-card {
  z-index: 2;
  margin-top: 0;
  padding: 20px 0 54px;
  color: #1e1c1c;
  text-align: center;
  background: #fff0f5;
}

.luna-booking-card p {
  margin: 0;
  color: rgba(30, 28, 28, 0.65);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
}

.luna-booking-card h2 {
  color: #1e1c1c;
  margin-top: 24px;
}

.luna-booking-card button {
  width: 64px;
  height: 64px;
  margin-top: 32px;
  border: 0;
  border-radius: 999px;
  color: #1e1c1c;
  background: rgba(255, 255, 255, 0.38);
  font-size: 42px;
  line-height: 1;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
}

/* BOOKING */

.luna-booking-app {
  position: relative;
  padding: 34px 0 132px;
  color: #302625;
  background: #f4f6f9;
  overflow: hidden;
}

.luna-booking-app__glow {
  position: absolute;
  top: 112px;
  left: 50%;
  width: 310px;
  height: 310px;
  border-radius: 50%;
  transform: translateX(-50%);
  background: radial-gradient(circle, rgba(244, 204, 214, 0.16), transparent 62%);
  pointer-events: none;
}

.luna-booking-app__head {
  position: relative;
  z-index: 2;
  padding: 0 22px 18px;
  text-align: center;
}

.luna-booking-app__head span {
  color: rgba(63, 43, 42, 0.36);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.25em;
}

.luna-booking-app__head h2 {
  max-width: 305px;
  margin: 10px auto 0;
  color: #2d2322;
  font-family: 'Cormorant Garamond', serif;
  font-size: 40px;
  font-weight: 500;
  line-height: 0.93;
  letter-spacing: -0.045em;
}

.luna-booking-app__head p {
  max-width: 285px;
  margin: 12px auto 0;
  color: rgba(48, 38, 37, 0.56);
  font-size: 13px;
  line-height: 1.45;
}

.luna-booking-progress {
  position: relative;
  z-index: 2;
  width: 148px;
  height: 6px;
  margin: 4px auto 26px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
}

.luna-booking-progress i {
  border-radius: 99px;
  background: rgba(65, 46, 44, 0.1);
  transition: 0.25s ease;
}

.luna-booking-progress i.active {
  background: #e5b8b5;
}

.luna-booking-flow {
  position: relative;
  z-index: 2;
  display: grid;
  gap: 10px;
}

.luna-flow-section {
  min-width: 0;
  padding: 22px 0 24px;
  background: #f4f6f9;
}

.luna-flow-title {
  padding: 0 18px;
  margin-bottom: 15px;
}

.luna-flow-title h3 {
  margin: 0;
  color: #2f2726;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 22px;
  font-weight: 750;
  line-height: 1.05;
  letter-spacing: -0.04em;
}

.luna-flow-title p {
  margin: 6px 0 0;
  color: rgba(48, 38, 37, 0.5);
  font-size: 12.5px;
  line-height: 1.35;
}

.luna-service-carousel,
.luna-shape-carousel,
.luna-color-carousel,
.luna-artist-carousel,
.luna-day-carousel {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  margin-left: 18px;
  padding: 0 18px 10px 0;
  scrollbar-width: none;
  scroll-snap-type: x proximity;
  -webkit-overflow-scrolling: touch;
}

.luna-day-carousel {
  margin-bottom: 22px;
}

.luna-service-carousel::-webkit-scrollbar,
.luna-shape-carousel::-webkit-scrollbar,
.luna-color-carousel::-webkit-scrollbar,
.luna-artist-carousel::-webkit-scrollbar,
.luna-day-carousel::-webkit-scrollbar {
  display: none;
}

.luna-service-option,
.luna-shape-option,
.luna-style-option,
.luna-extra-chip,
.luna-day-option,
.luna-length-switch,
.luna-client-form input,
.luna-client-form textarea {
  box-shadow:
    0 6px 14px rgba(27, 34, 44, 0.035),
    inset 0 1px 0 rgba(255, 255, 255, 0.82);
}

.luna-service-option {
  position: relative;
  width: 152px;
  min-width: 152px;
  min-height: 148px;
  border: 0;
  border-radius: 32px;
  padding: 15px;
  display: grid;
  align-content: space-between;
  color: #332827;
  text-align: left;
  background:
    radial-gradient(circle at 82% 10%, rgba(255, 255, 255, 0.92), transparent 34%),
    linear-gradient(145deg, rgba(255, 255, 255, 0.82), rgba(250, 251, 253, 0.68));
  scroll-snap-align: start;
  transition:
    transform 0.18s ease,
    box-shadow 0.22s ease,
    background 0.22s ease;
}

.luna-service-option.active {
  transform: scale(0.975);
  color: #352927;
  background:
    radial-gradient(circle at 80% 10%, rgba(255, 255, 255, 0.8), transparent 32%),
    linear-gradient(145deg, #f7dfdd, #efc9c6);
  box-shadow:
    0 7px 16px rgba(176, 122, 122, 0.07),
    inset 0 1px 0 rgba(255, 255, 255, 0.44);
}

.luna-service-option__icon {
  width: 42px;
  height: 42px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  color: #b47e74;
  background: rgba(255, 255, 255, 0.66);
}

.luna-service-option.active .luna-service-option__icon {
  color: #936963;
  background: rgba(255, 255, 255, 0.62);
}

.luna-service-option__icon :deep(svg) {
  width: 25px;
  height: 25px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.45;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.luna-service-option__content {
  display: grid;
  gap: 4px;
  margin-top: 22px;
}

.luna-service-option strong {
  font-size: 16px;
  font-weight: 850;
  line-height: 1.1;
  letter-spacing: -0.03em;
}

.luna-service-option small,
.luna-service-option em {
  color: rgba(51, 40, 39, 0.54);
  font-size: 11px;
  font-weight: 800;
  font-style: normal;
}

.luna-service-option em {
  margin-top: 11px;
}

.luna-length-switch {
  margin: 0 18px;
  padding: 5px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
}

.luna-length-switch button {
  min-width: 0;
  min-height: 48px;
  border: 0;
  border-radius: 999px;
  padding: 0 4px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 1px;
  color: rgba(48, 38, 37, 0.56);
  background: transparent;
  transition: 0.18s ease;
}

.luna-length-switch button.active {
  transform: scale(0.975);
  color: #352927;
  background: linear-gradient(135deg, #f7dfdd, #efc9c6);
  box-shadow:
    0 6px 13px rgba(176, 122, 122, 0.07),
    inset 0 1px 0 rgba(255, 255, 255, 0.44);
}

.luna-length-switch strong {
  font-size: 11.5px;
  font-weight: 850;
}

.luna-length-switch span {
  font-size: 9px;
  font-weight: 800;
  opacity: 0.7;
}

.luna-shape-option {
  width: 82px;
  min-width: 82px;
  height: 104px;
  border: 0;
  border-radius: 30px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 9px;
  color: #3b2d2b;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.84), rgba(250, 251, 253, 0.68));
  scroll-snap-align: start;
  transition: 0.18s ease;
}

.luna-shape-option.active {
  transform: scale(0.975);
  color: #352927;
  background: linear-gradient(145deg, #f7dfdd, #efc9c6);
  box-shadow:
    0 7px 16px rgba(176, 122, 122, 0.07),
    inset 0 1px 0 rgba(255, 255, 255, 0.44);
}

.luna-shape-option strong {
  max-width: 70px;
  font-size: 10.5px;
  font-weight: 850;
  line-height: 1.05;
  text-align: center;
}

.luna-nail-preview {
  width: 21px;
  height: 42px;
  display: block;
  background: linear-gradient(180deg, #fffaf9, #e9beb6);
  box-shadow:
    inset 0 0 0 1px rgba(119, 78, 73, 0.1),
    0 4px 10px rgba(112, 74, 70, 0.045);
}

.luna-shape-option.active .luna-nail-preview {
  background: linear-gradient(180deg, #fff9f7, #f0cac2);
}

.luna-nail-preview--square {
  border-radius: 10px 10px 6px 6px;
}

.luna-nail-preview--soft {
  border-radius: 13px 13px 8px 8px;
}

.luna-nail-preview--almond {
  border-radius: 50% 50% 14px 14px;
}

.luna-nail-preview--oval {
  border-radius: 50%;
}

.luna-nail-preview--coffin {
  clip-path: polygon(20% 0, 80% 0, 100% 100%, 0 100%);
  border-radius: 7px;
}

.luna-nail-preview--stiletto {
  clip-path: polygon(50% 0, 100% 100%, 0 100%);
  border-radius: 8px;
}

.luna-color-option {
  width: 70px;
  min-width: 70px;
  border: 0;
  padding: 0;
  display: grid;
  justify-items: center;
  gap: 8px;
  color: #3b2d2b;
  background: transparent;
  scroll-snap-align: start;
}

.luna-color-option > span {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  box-shadow:
    0 6px 14px rgba(27, 34, 44, 0.04),
    inset 0 0 0 1px rgba(65, 44, 42, 0.045),
    inset 0 0 0 5px rgba(255, 255, 255, 0.76);
  transition: 0.18s ease;
}

.luna-color-option.active > span {
  transform: scale(0.975);
  box-shadow:
    0 7px 16px rgba(176, 122, 122, 0.07),
    0 0 0 4px rgba(239, 201, 198, 0.3),
    inset 0 0 0 5px rgba(255, 255, 255, 0.84);
}

.luna-color-option i {
  width: 23px;
  height: 23px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #352827;
  background: rgba(255, 255, 255, 0.86);
  font-size: 12px;
  font-style: normal;
  font-weight: 900;
}

.luna-color-option strong {
  max-width: 70px;
  font-size: 10.5px;
  font-weight: 850;
  line-height: 1.05;
  text-align: center;
}

.luna-style-stack {
  display: grid;
  gap: 10px;
  padding: 0 18px;
}

.luna-style-option {
  position: relative;
  min-height: 78px;
  border: 0;
  border-radius: 30px;
  padding: 12px 14px 12px 12px;
  display: grid;
  grid-template-columns: 62px 1fr 18px;
  align-items: center;
  gap: 12px;
  color: #342928;
  text-align: left;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.84), rgba(250, 251, 253, 0.68));
  transition: 0.18s ease;
}

.luna-style-option.active {
  transform: scale(0.975);
  color: #352927;
  background:
    radial-gradient(circle at 90% 0%, rgba(255, 255, 255, 0.42), transparent 36%),
    linear-gradient(145deg, #f7dfdd, #efc9c6);
  box-shadow:
    0 7px 16px rgba(176, 122, 122, 0.07),
    inset 0 1px 0 rgba(255, 255, 255, 0.44);
}

.luna-style-option > span {
  width: 62px;
  height: 44px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  color: #a1746f;
  background: rgba(255, 255, 255, 0.66);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.03em;
}

.luna-style-option.active > span {
  color: #8b5b54;
  background: rgba(255, 255, 255, 0.74);
}

.luna-style-option strong {
  display: block;
  font-size: 15px;
  font-weight: 850;
  letter-spacing: -0.025em;
}

.luna-style-option small {
  display: block;
  margin-top: 3px;
  color: rgba(52, 41, 40, 0.52);
  font-size: 11px;
  font-weight: 700;
}

.luna-style-option i {
  width: 17px;
  height: 17px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 2px rgba(52, 41, 40, 0.1);
}

.luna-style-option.active i {
  background: #fff9f7;
  box-shadow: inset 0 0 0 5px #fff9f7;
}

.luna-extra-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  padding: 0 18px;
}

.luna-extra-chip {
  min-height: 45px;
  border: 0;
  border-radius: 999px;
  padding: 7px 14px 7px 8px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #3a2d2b;
  background: rgba(255, 255, 255, 0.7);
  transition: 0.18s ease;
}

.luna-extra-chip.active {
  transform: scale(0.975);
  color: #352927;
  background: linear-gradient(135deg, #f7dfdd, #efc9c6);
  box-shadow:
    0 6px 14px rgba(176, 122, 122, 0.065),
    inset 0 1px 0 rgba(255, 255, 255, 0.44);
}

.luna-extra-chip span {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #a1746f;
  background: rgba(255, 255, 255, 0.76);
  font-size: 13px;
  font-weight: 900;
}

.luna-extra-chip strong {
  font-size: 12.5px;
  font-weight: 850;
}

.luna-artist-option {
  position: relative;
  width: 126px;
  min-width: 126px;
  height: 164px;
  border: 0;
  border-radius: 34px;
  padding: 0;
  overflow: hidden;
  color: #fff9f7;
  background: #c9a19a;
  box-shadow: 0 7px 16px rgba(27, 34, 44, 0.055);
  scroll-snap-align: start;
  transition: 0.18s ease;
}

.luna-artist-option.active {
  transform: scale(0.975);
  box-shadow:
    0 8px 18px rgba(176, 122, 122, 0.085),
    0 0 0 4px rgba(239, 201, 198, 0.26);
}

.luna-artist-option img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.luna-artist-option::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 28%, rgba(28, 20, 19, 0.78) 100%);
}

.luna-artist-option span {
  position: absolute;
  left: 13px;
  right: 13px;
  bottom: 13px;
  z-index: 2;
  display: grid;
  gap: 2px;
  text-align: left;
}

.luna-artist-option strong {
  font-size: 14px;
  font-weight: 850;
}

.luna-artist-option small {
  color: rgba(255, 249, 247, 0.74);
  font-size: 11px;
  font-weight: 700;
}

.luna-day-option {
  width: 70px;
  min-width: 70px;
  height: 86px;
  border: 0;
  border-radius: 26px;
  display: grid;
  place-items: center;
  color: #3a2d2b;
  padding: 10px 0;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.84), rgba(250, 251, 253, 0.68));
  scroll-snap-align: start;
  transition: 0.18s ease;
}

.luna-day-option.active {
  transform: scale(0.975);
  color: #352927;
  background: linear-gradient(145deg, #f7dfdd, #efc9c6);
  box-shadow:
    0 7px 16px rgba(176, 122, 122, 0.07),
    inset 0 1px 0 rgba(255, 255, 255, 0.44);
}

.luna-day-option small {
  color: #a1746f;
  font-size: 8px;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.luna-day-option strong {
  font-family: 'Cormorant Garamond', serif;
  font-size: 29px;
  line-height: 0.85;
}

.luna-day-option span {
  color: rgba(58, 45, 43, 0.48);
  font-size: 9px;
  font-weight: 900;
}

.luna-time-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 9px;
  padding: 10px 18px 0;
}

.luna-time-grid button {
  min-height: 45px;
  border: 0;
  border-radius: 999px;
  color: #3a2d2b;
  background: rgba(255, 255, 255, 0.72);
  box-shadow:
    0 5px 12px rgba(27, 34, 44, 0.035),
    inset 0 1px 0 rgba(255, 255, 255, 0.84);
  font-size: 13px;
  font-weight: 850;
  transition: 0.18s ease;
}

.luna-time-grid button.active {
  transform: scale(0.975);
  color: #352927;
  background: linear-gradient(135deg, #f7dfdd, #efc9c6);
  box-shadow:
    0 6px 14px rgba(176, 122, 122, 0.065),
    inset 0 1px 0 rgba(255, 255, 255, 0.44);
}

.luna-time-grid button:disabled {
  color: rgba(58, 45, 43, 0.24);
  background: rgba(255, 255, 255, 0.36);
  box-shadow: none;
  text-decoration: line-through;
  cursor: not-allowed;
}

.luna-client-form {
  display: grid;
  gap: 10px;
  padding: 0 18px;
}

.luna-client-form label {
  display: grid;
  gap: 6px;
}

.luna-client-form span {
  color: rgba(48, 38, 37, 0.54);
  font-size: 11px;
  font-weight: 850;
  padding-left: 4px;
}

.luna-client-form input,
.luna-client-form textarea {
  width: 100%;
  border: 0;
  border-radius: 24px;
  outline: none;
  padding: 15px 16px;
  color: #302625;
  background: rgba(255, 255, 255, 0.72);
  font-size: 14px;
  font-weight: 700;
  resize: none;
}

.luna-client-form input:focus,
.luna-client-form textarea:focus {
  box-shadow:
    0 6px 15px rgba(27, 34, 44, 0.04),
    0 0 0 4px rgba(239, 201, 198, 0.26),
    inset 0 1px 0 rgba(255, 255, 255, 0.84);
}

.luna-booking-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 30;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  transform: none;
//   border-radius: 30px 30px 0 0;
  padding: 15px 16px calc(15px + env(safe-area-inset-bottom));
  display: grid;
//   display: none;
  grid-template-columns: 1fr 108px;
  align-items: center;
  gap: 12px;
  color: #302625;
  background:
    radial-gradient(circle at 0% 0%, rgba(244, 204, 214, 0.2), transparent 38%),
    rgba(255, 252, 253, 0.96);
  box-shadow:
    0 -10px 30px rgba(27, 34, 44, 0.09),
    inset 0 1px 0 rgba(255, 255, 255, 0.86);
}

.luna-booking-bottom__info {
  min-width: 0;
  display: grid;
  gap: 1px;
}

.luna-booking-bottom__info span {
  color: rgba(48, 38, 37, 0.56);
  font-size: 10px;
  font-weight: 850;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.luna-booking-bottom__info strong {
  color: #302625;
  font-size: 18px;
  font-weight: 850;
  letter-spacing: -0.02em;
}

.luna-booking-bottom__info small {
  overflow: hidden;
  color: rgba(48, 38, 37, 0.56);
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.luna-booking-bottom button {
  min-height: 46px;
  border: 0;
  border-radius: 999px;
  color: #352927;
  background: linear-gradient(135deg, #f7dfdd, #efc9c6);
  box-shadow:
    0 7px 16px rgba(176, 122, 122, 0.11),
    inset 0 1px 0 rgba(255, 255, 255, 0.44);
  font-size: 11.5px;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.luna-booking-bottom button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.luna-confirm-modal {
  position: fixed;
  inset: 0;
  z-index: 70;
  display: grid;
  place-items: end center;
  padding: 14px;
  background: rgba(25, 20, 18, 0.38);
}

.luna-confirm-sheet {
  width: min(100%, 390px);
  border-radius: 31px;
  padding: 20px;
  color: #332725;
  background:
    radial-gradient(circle at 50% 0%, rgba(244, 204, 214, 0.28), transparent 34%),
    #fff9fb;
  box-shadow: 0 20px 54px rgba(25, 16, 14, 0.18);
  text-align: center;
  position: relative;
}

.luna-confirm-sheet__close {
  position: absolute;
  top: 13px;
  right: 13px;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 50%;
  color: #8f6259;
  background: rgba(180, 126, 116, 0.1);
  font-size: 23px;
}

.luna-confirm-sheet__icon {
  width: 52px;
  height: 52px;
  margin: 5px auto 13px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #352927;
  background: #f6dcd9;
  font-weight: 900;
}

.luna-confirm-sheet p {
  margin: 0;
  color: rgba(62, 48, 45, 0.56);
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.luna-confirm-sheet h3 {
  max-width: 270px;
  margin: 11px auto 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: 31px;
  line-height: 0.95;
  letter-spacing: -0.04em;
}

.luna-confirm-sheet__info {
  margin-top: 20px;
  border-radius: 22px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.64);
  display: grid;
  gap: 6px;
}

.luna-confirm-sheet__info span {
  color: #a1746f;
  font-size: 11px;
  font-weight: 900;
}

.luna-confirm-sheet__info strong {
  font-size: 16px;
}

.luna-confirm-sheet__info small {
  color: rgba(62, 48, 45, 0.58);
  font-size: 11px;
}

.luna-confirm-sheet > button:last-child {
  width: 100%;
  min-height: 50px;
  margin-top: 15px;
  border: 0;
  border-radius: 999px;
  color: #352927;
  background: #f6dcd9;
  font-size: 12px;
  font-weight: 900;
}

.luna-drawer-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  justify-content: flex-end;
  background: rgba(25, 20, 18, 0.32);
}

.luna-drawer {
  width: min(76vw, 340px);
  min-height: 100%;
  padding: 24px 20px 28px;
  display: flex;
  flex-direction: column;
  gap: 0;
  color: #3e302d;
  background:
    radial-gradient(circle at 68% 0%, rgba(232, 190, 180, 0.3), transparent 34%),
    linear-gradient(180deg, rgba(255, 250, 246, 0.96) 0%, rgba(255, 240, 245, 0.96) 100%);
  border-left: 1px solid rgba(255, 255, 255, 0.72);
  box-shadow: -18px 0 46px rgba(25, 16, 14, 0.2);
  will-change: transform;
  transform: translateZ(0);
}

.luna-drawer__close {
  align-self: flex-end;
  width: 45px;
  height: 45px;
  border: 1px solid rgba(150, 104, 91, 0.25);
  border-radius: 50%;
  color: #8f6259;
  background: rgba(255, 250, 246, 0.62);
  box-shadow:
    0 10px 24px rgba(93, 62, 53, 0.07),
    inset 0 1px 0 rgba(255, 255, 255, 0.88);
  font-size: 28px;
  line-height: 1;
}

.luna-drawer__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 18px 0 26px;
}

.luna-drawer__logo {
  position: relative;
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  color: #8f6259;
}

.luna-drawer__logo span {
  position: absolute;
  inset: 0;
  color: rgba(156, 107, 96, 0.82);
  font-size: 48px;
  line-height: 1;
  transform: rotate(-18deg);
}

.luna-drawer__logo strong {
  position: relative;
  z-index: 2;
  color: #8f6259;
  font-family: 'Brush Script MT', 'Segoe Script', cursive;
  font-size: 29px;
  font-weight: 400;
  line-height: 1;
}

.luna-drawer__brand h3 {
  margin: 0;
  color: #b47e74;
  font-family: 'Brush Script MT', 'Segoe Script', 'Snell Roundhand', cursive;
  font-size: 30px;
  font-weight: 400;
  line-height: 0.9;
  letter-spacing: -0.055em;
}

.luna-drawer__brand p {
  margin: 5px 0 0;
  color: #d7a89f;
  font-size: 13px;
  font-style: italic;
  line-height: 1;
}

.luna-drawer__links {
  display: grid;
  border-top: 1px solid rgba(150, 104, 91, 0.15);
}

.luna-drawer a {
  padding: 19px 0;
  color: #4a3935;
  text-decoration: none;
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.035em;
  border-bottom: 1px solid rgba(150, 104, 91, 0.15);
}

.luna-drawer__cta {
  height: 56px;
  margin-top: auto;
  border: 0;
  border-radius: 999px;
  color: #fff8f3;
  background: linear-gradient(135deg, #c58c80 0%, #ad756c 100%);
  box-shadow:
    0 16px 30px rgba(142, 82, 72, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.22);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.luna-reveal-enter-active,
.luna-reveal-leave-active {
  transition:
    opacity 0.28s ease,
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

.luna-reveal-enter-from,
.luna-reveal-leave-to {
  opacity: 0;
  transform: translate3d(0, 14px, 0);
}

.luna-bottom-pop-enter-active,
.luna-bottom-pop-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}

.luna-bottom-pop-enter-from,
.luna-bottom-pop-leave-to {
  opacity: 0;
  transform: translate3d(0, 18px, 0) scale(0.98);
}

.luna-modal-fade-enter-active,
.luna-modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.luna-modal-fade-enter-active .luna-confirm-sheet,
.luna-modal-fade-leave-active .luna-confirm-sheet {
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

.luna-modal-fade-enter-from,
.luna-modal-fade-leave-to {
  opacity: 0;
}

.luna-modal-fade-enter-from .luna-confirm-sheet,
.luna-modal-fade-leave-to .luna-confirm-sheet {
  transform: translate3d(0, 100%, 0);
}

.luna-drawer-fade-enter-active,
.luna-drawer-fade-leave-active {
  transition: opacity 0.22s ease;
}

.luna-drawer-fade-enter-active .luna-drawer,
.luna-drawer-fade-leave-active .luna-drawer {
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

.luna-drawer-fade-enter-from,
.luna-drawer-fade-leave-to {
  opacity: 0;
}

.luna-drawer-fade-enter-from .luna-drawer,
.luna-drawer-fade-leave-to .luna-drawer {
  transform: translate3d(100%, 0, 0);
}

</style>