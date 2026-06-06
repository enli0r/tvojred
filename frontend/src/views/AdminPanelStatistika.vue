<template>
  <main class="mxp-shell">
    <section class="mxp-phone">
      <nav class="mxp-nav">
  <div class="mxp-brand">
    <div class="mxp-brand__mark">
      <img :src="stefanLogo" alt="">
    </div>

    <!-- <div>
      <strong>Stefan Studio</strong>
      <small>Barber admin</small>
    </div> -->
  </div>

  <div class="mxp-profile">
    <span class="mxp-dot">9</span>
    <img
      :src="adminPanelHero"
      alt="Profile"
    />
  </div>
</nav>

      <section class="mxp-hero">
        <div class="mxp-hero__bg"></div>

        <div class="mxp-hero__top">
          <div class="mxp-hero__title">
  <p>Barber Studio OS</p>

  <h1>
    Kontrola<br />
    salona
  </h1>

  <span>
    Termini, prihodi i tim — sve iz jednog admin panela.
  </span>
</div>

          <div class="mxp-pill">
            <span></span>
            Barber Flow
          </div>
        </div>

        <article class="mxp-chart-card">
          <div class="mxp-chart-card__head">
            <div>
              <p>Statistika prihoda</p>
              <small>Booking Revenue</small>
            </div>

            <button type="button">
              <span>↗</span>
            </button>
          </div>

          <div class="mxp-chart">
            <div
              v-for="bar in bars"
              :key="bar.month"
              class="mxp-chart__item"
            >
              <i
                :class="{ 'is-active': bar.active }"
                :style="{ height: `${bar.value}px` }"
              ></i>
              <span>{{ bar.month }}</span>
            </div>

            <b>+26%</b>
          </div>
        </article>
      </section>

      <section class="mxp-content">
        <article class="mxp-stock">
          <div class="mxp-stock__main">
            <div class="mxp-stock__left">
              <p class="mxp-stock__label">Prihod</p>

              <div class="mxp-stock__numbers">
                <div>
                  <Transition name="mxp-revenue" mode="out-in">
                    <strong :key="currentPeriod.revenue">
                      {{ currentPeriod.revenue }}
                    </strong>
                  </Transition>

                  <span>
                    RSD
                    <small>{{ currentPeriod.change }}</small>
                  </span>
                </div>
              </div>

              <div class="mxp-stock__mini">
                <Transition name="mxp-revenue" mode="out-in">
                  <strong :key="currentPeriod.appointments">
                    {{ currentPeriod.appointments }}
                  </strong>
                </Transition>
                <span>Termina</span>
              </div>
            </div>

            <div class="mxp-stock__right">
              <div class="mxp-select">
                <span
                  class="mxp-select__indicator"
                  :style="{ transform: `translateY(${selectedPeriodIndex * 36}px)` }"
                ></span>

                <button
                  v-for="period in periods"
                  :key="period.key"
                  :class="{ 'is-selected': selectedPeriod === period.key }"
                  type="button"
                  @click="selectedPeriod = period.key"
                >
                  {{ period.label }}
                </button>
              </div>

              <button class="mxp-details" type="button">Detalji</button>
            </div>
          </div>
        </article>

        <section class="mxp-agenda">
          <div class="mxp-agenda__head">
            <div>
              <span>{{ formattedSelectedDate }}</span>
              <h2>Termini</h2>
            </div>

            <div class="mxp-agenda__actions">
              <button
                class="mxp-action-btn is-add"
                type="button"
                aria-label="Dodaj termin"
                @click="openAddAppointment"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </button>

              <button
                class="mxp-action-btn"
                type="button"
                aria-label="Izaberi datum"
                @click="openDatePicker"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3.75 8.25h16.5M5.25 5.25h13.5A1.5 1.5 0 0 1 20.25 6.75v11.5a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V6.75a1.5 1.5 0 0 1 1.5-1.5Z"
                  />
                </svg>
              </button>
            </div>

            <input
              ref="dateInput"
              v-model="selectedDate"
              class="mxp-date-input"
              type="date"
            />
          </div>

          <div class="mxp-agenda__summary">
            <p>
              {{ selectedClients.length }}
              <span>zakazanih termina</span>
            </p>

            <small>{{ totalRevenue }} RSD</small>
          </div>

          <div class="mxp-agenda__list">
            <article
              v-for="client in selectedClients"
              :key="client.id"
              class="mxp-agenda-row"
            >
              <div class="mxp-agenda-row__time">
                <strong>{{ client.time }}</strong>
                <span>{{ client.duration }}</span>
              </div>

              <div class="mxp-agenda-row__client">
                <h3>{{ client.name }}</h3>
                <p>{{ client.service }}</p>
              </div>

              <strong class="mxp-agenda-row__price">
                {{ client.price }}
              </strong>
            </article>

            <article v-if="!selectedClients.length" class="mxp-empty">
              <h3>Nema zakazivanja</h3>
              <p>Za izabrani datum trenutno nema klijenata.</p>
            </article>
          </div>
        </section>

        <section class="mxp-agenda-extra">
          <section class="mxp-day-strip">
            <article>
              <strong>16</strong>
              <span>termina</span>
            </article>

            <article>
              <strong>2</strong>
              <span>slobodna</span>
            </article>

            <article>
              <strong>1</strong>
              <span>otkazano</span>
            </article>
          </section>

          <section class="mxp-insights">
            <article class="mxp-next">
              <span>Sledeći termin</span>

              <strong>{{ nextAppointment.time }}</strong>

              <div class="mxp-next__body">
                <h3>{{ nextAppointment.name }}</h3>
                <p>{{ nextAppointment.service }} · {{ nextAppointment.duration }}</p>
              </div>
            </article>

            <article class="mxp-side-note">
              <span>Najtraženije</span>
              <h3>Fade + brada</h3>
              <p>6 zakazivanja danas</p>
            </article>
          </section>

          <section class="mxp-hours">
            <div>
              <span>Radno vreme</span>
              <h3>09:00 — 20:00</h3>
            </div>

            <p>
              Pauza
              <strong>14:00 — 14:30</strong>
            </p>
          </section>
        </section>
      </section>

      <Transition name="mxp-modal-fade">
        <div v-if="isAddOpen" class="mxp-modal">
          <button
            class="mxp-modal__backdrop"
            type="button"
            aria-label="Zatvori"
            @click="closeAddAppointment"
          ></button>

          <Transition name="mxp-popup-slide" appear>
            <section class="mxp-popup">
              <header class="mxp-popup__head">
                <div>
                  <span>Novi termin</span>
                  <h2>Dodaj termin</h2>
                </div>

                <button type="button" aria-label="Zatvori" @click="closeAddAppointment">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </header>

              <section class="mxp-popup__section">
                <div class="mxp-popup__label">
                  <span>01</span>
                  <p>Dan</p>
                </div>

                <div class="mxp-popup-days">
                  <button
                    v-for="day in popupDays"
                    :key="day.value"
                    type="button"
                    :class="{ 'is-selected': newAppointment.day === day.value }"
                    @click="newAppointment.day = day.value"
                  >
                    <span>{{ day.label }}</span>
                    <strong>{{ day.date }}</strong>
                  </button>
                </div>
              </section>

              <section class="mxp-popup__section">
                <div class="mxp-popup__label">
                  <span>02</span>
                  <p>Barber</p>
                </div>

                <div class="mxp-popup-barbers">
                  <button
                    v-for="barber in barbers"
                    :key="barber.id"
                    type="button"
                    :class="{ 'is-selected': newAppointment.barber === barber.id }"
                    @click="newAppointment.barber = barber.id"
                  >
                    <img :src="barber.image" :alt="barber.name" />

                    <div>
                      <strong>{{ barber.name }}</strong>
                      <span>{{ barber.role }}</span>
                    </div>

                    <small>{{ barber.rating }}</small>
                  </button>
                </div>
              </section>

              <section class="mxp-popup__section">
                <div class="mxp-popup__label">
                  <span>03</span>
                  <p>Usluga</p>
                </div>

                <div class="mxp-popup-services">
                  <button
                    v-for="service in services"
                    :key="service.id"
                    type="button"
                    :class="{ 'is-selected': newAppointment.service === service.id }"
                    @click="newAppointment.service = service.id"
                  >
                    <div>
                      <strong>{{ service.name }}</strong>
                      <span>{{ service.duration }}</span>
                    </div>

                    <p>{{ service.price }}</p>
                  </button>
                </div>
              </section>

              <section class="mxp-popup__section">
                <div class="mxp-popup__label">
                  <span>04</span>
                  <p>Slot</p>
                </div>

                <div class="mxp-popup-slots">
                  <button
                    v-for="slot in slots"
                    :key="slot"
                    type="button"
                    :class="{ 'is-selected': newAppointment.slot === slot }"
                    @click="newAppointment.slot = slot"
                  >
                    {{ slot }}
                  </button>
                </div>
              </section>

              <section class="mxp-popup__section">
                <div class="mxp-popup__label">
                  <span>05</span>
                  <p>Klijent</p>
                </div>

                <div class="mxp-popup-form">
                  <label>
                    Ime i prezime
                    <input
                      v-model="newAppointment.clientName"
                      type="text"
                      placeholder="Marko Petrović"
                    />
                  </label>

                  <label>
                    Broj telefona
                    <input
                      v-model="newAppointment.phone"
                      type="tel"
                      placeholder="+381 60 123 4567"
                    />
                  </label>
                </div>
              </section>

              <button
                class="mxp-popup__submit"
                type="button"
                :class="{ 'is-ready': isAppointmentReady }"
                @click="saveAppointment"
              >
                Sačuvaj termin
              </button>
            </section>
          </Transition>
        </div>
      </Transition>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import stefanLogo from '@/assets/img/stefan-logo2.png';
import adminPanelHero from '@/assets/img/male-barber.jpg';

type DateInputElement = HTMLInputElement & {
  showPicker?: () => void
}

type Appointment = {
  id: number
  time: string
  duration: string
  name: string
  service: string
  price: string
}

type PeriodKey = 'today' | 'week' | 'month'

const dateInput = ref<HTMLInputElement | null>(null)
const selectedDate = ref('2026-06-12')
const selectedPeriod = ref<PeriodKey>('today')
const isAddOpen = ref(false)

const newAppointment = reactive({
  day: '2026-06-12',
  barber: 1,
  service: 1,
  slot: '12:30',
  clientName: '',
  phone: '',
})

const periods: {
  key: PeriodKey
  label: string
  revenue: string
  change: string
  appointments: string
}[] = [
  {
    key: 'today',
    label: 'Danas',
    revenue: '2,480',
    change: '+12%',
    appointments: '16',
  },
  {
    key: 'week',
    label: 'Nedelja',
    revenue: '14,850',
    change: '+18%',
    appointments: '74',
  },
  {
    key: 'month',
    label: 'Mesec',
    revenue: '62,300',
    change: '+31%',
    appointments: '286',
  },
]

const popupDays = [
  { label: 'Danas', date: '12', value: '2026-06-12' },
  { label: 'Pet', date: '13', value: '2026-06-13' },
  { label: 'Sub', date: '14', value: '2026-06-14' },
  { label: 'Ned', date: '15', value: '2026-06-15' },
  { label: 'Pon', date: '16', value: '2026-06-16' },
  { label: 'Uto', date: '17', value: '2026-06-17' },
]

const barbers = [
  {
    id: 1,
    name: 'Stefan',
    role: 'Senior barber',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=160&q=80',
  },
  {
    id: 2,
    name: 'Aleksa',
    role: 'Fade specialist',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=160&q=80',
  },
  {
    id: 3,
    name: 'Milan',
    role: 'Barber',
    rating: '4.7',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=160&q=80',
  },
]

const services = [
  { id: 1, name: 'Fade + brada', duration: '45min', price: '2.400 RSD' },
  { id: 2, name: 'Šišanje', duration: '30min', price: '1.500 RSD' },
  { id: 3, name: 'Premium tretman', duration: '60min', price: '3.200 RSD' },
]

const slots = ['09:30', '10:15', '11:00', '12:30', '13:15', '15:45', '17:30']

const bars = [
  { month: 'Dec', value: 21, active: false },
  { month: 'Jan', value: 34, active: false },
  { month: 'Feb', value: 26, active: false },
  { month: 'Mar', value: 66, active: true },
  { month: 'Apr', value: 50, active: false },
  { month: 'May', value: 28, active: false },
]

const appointments: Record<string, Appointment[]> = {
  '2026-06-12': [
    {
      id: 1,
      time: '09:30',
      duration: '45min',
      name: 'Marko Petrović',
      service: 'Fade + brada',
      price: '2.400',
    },
    {
      id: 2,
      time: '11:00',
      duration: '30min',
      name: 'Nikola Jović',
      service: 'Šišanje',
      price: '1.500',
    },
    {
      id: 3,
      time: '13:15',
      duration: '60min',
      name: 'Luka Ilić',
      service: 'Premium tretman',
      price: '3.200',
    },
    {
      id: 4,
      time: '17:30',
      duration: '45min',
      name: 'Stefan Milić',
      service: 'Brada + konture',
      price: '1.800',
    },
  ],
  '2026-06-13': [
    {
      id: 5,
      time: '10:00',
      duration: '45min',
      name: 'Vuk Stanić',
      service: 'Fade cut',
      price: '2.000',
    },
    {
      id: 6,
      time: '15:45',
      duration: '30min',
      name: 'Milan Kostić',
      service: 'Šišanje',
      price: '1.500',
    },
  ],
  '2026-06-14': [
    {
      id: 7,
      time: '12:20',
      duration: '60min',
      name: 'Aleksa Todorović',
      service: 'Komplet tretman',
      price: '3.500',
    },
  ],
}

const currentPeriod = computed(() => {
  return periods.find((period) => period.key === selectedPeriod.value) ?? periods[0]
})

const selectedPeriodIndex = computed(() => {
  return periods.findIndex((period) => period.key === selectedPeriod.value)
})

const selectedClients = computed(() => {
  return appointments[selectedDate.value] ?? []
})

const nextAppointment = computed(() => {
  return selectedClients.value[0] ?? {
    id: 0,
    time: '--:--',
    duration: '0min',
    name: 'Nema termina',
    service: 'Slobodan dan',
    price: '0',
  }
})

const formattedSelectedDate = computed(() => {
  const date = new Date(`${selectedDate.value}T12:00:00`)

  return new Intl.DateTimeFormat('sr-Latn-RS', {
    day: 'numeric',
    month: 'short',
    weekday: 'long',
  }).format(date)
})

const totalRevenue = computed(() => {
  return selectedClients.value
    .reduce((sum, client) => {
      return sum + Number(client.price.replace('.', ''))
    }, 0)
    .toLocaleString('sr-RS')
})

const isAppointmentReady = computed(() => {
  return Boolean(
    newAppointment.day &&
    newAppointment.barber &&
    newAppointment.service &&
    newAppointment.slot &&
    newAppointment.clientName.trim() &&
    newAppointment.phone.trim(),
  )
})

const openDatePicker = () => {
  const input = dateInput.value as DateInputElement | null

  if (!input) return

  if (input.showPicker) {
    input.showPicker()
    return
  }

  input.click()
}

const openAddAppointment = () => {
  isAddOpen.value = true
}

const closeAddAppointment = () => {
  isAddOpen.value = false
}

const saveAppointment = () => {
  if (!isAppointmentReady.value) return

  isAddOpen.value = false

  newAppointment.clientName = ''
  newAppointment.phone = ''
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.mxp-shell {
  width: 100%;
  min-height: 100svh;
  margin: 0;
  padding: 0;
  background: #e7ded0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

.mxp-phone {
  width: 100%;
  max-width: 430px;
  min-height: 100svh;
  position: relative;
  overflow-x: hidden;
  background: #10100f;
  color: #ffffff;
  border-radius: 0;
  padding: 16px 14px 92px;
}

.mxp-nav {
  height: 46px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 42px;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
}

.mxp-brand {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.mxp-brand__mark {
  width: 130px;
  /* height: 38px; */
  border-radius: 14px;
  
  color: #16110b;
  display: grid;
  place-items: center;
  flex: 0 0 auto;

  img{
    width: 100%;
  }
}

.mxp-brand__mark span {
  font-size: 17px;
  line-height: 1;
  font-weight: 900;
  letter-spacing: -0.06em;
}

.mxp-profile {
  width: 38px;
  height: 38px;
  justify-self: end;
  position: relative;
}

.mxp-profile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 14px;
}

.mxp-dot {
  position: absolute;
  right: -4px;
  top: -4px;
  z-index: 2;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 999px;
  background: #d6b17a;
  color: #16110b;
  display: grid;
  place-items: center;
  font-size: 8px;
  font-weight: 900;
  line-height: 1;
}

.mxp-hero {
  height: 448px;
  border-radius: 30px;
  overflow: hidden;
  position: relative;
  /* background: #b9895f; */
  /* background-image: url('@/assets/img/admin-panel-hero.png'); */
}

.mxp-hero__bg {
  position: absolute;
  inset: 0;
  /* background:
    linear-gradient(90deg, rgba(25, 18, 12, 0.15) 1px, transparent 1px) 50% 0 / 78px 100%,
    linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(0, 0, 0, 0.3)),
    linear-gradient(100deg, #c79a73 0%, #b8845d 48%, #9f704d 100%); */
  background-image: url('@/assets/img/admin-panel-hero19.png');
  background-position: center;
  background-size: cover;
  /* z-index: 2; */


}

.mxp-hero__bg::before {
  content: "";
  position: absolute;
  inset: 0;
    background: rgba(0,0,0,0.2);
    /* z-index: 2; */


}

/* .mxp-hero__bg::after { */
  /* content: "";
  position: absolute;
  left: 50%;
  top: 137px;
  width: 2px;
  height: 175px;
  transform: translateX(-50%);
  background: rgba(40, 27, 18, 0.42); */
/* } */

.mxp-hero__top {
  position: relative;
  z-index: 2;
  padding: 20px 18px 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.mxp-hero__title {
  max-width: 245px;
}

.mxp-hero__title p {
  margin: 0 0 11px;
  font-size: 8px;
  line-height: 1;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-weight: 850;
  color: rgba(214, 177, 122, 0.96);
}

.mxp-hero h1 {
  margin: 0;
  max-width: 230px;
  font-size: 42px;
  line-height: 0.92;
  letter-spacing: -0.045em;
  font-weight: 760;
  text-align: left;
  color: rgba(255, 255, 255, 0.96);
  text-wrap: balance;
  text-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
}

.mxp-hero__title span {
  display: block;
  margin-top: 13px;
  max-width: 220px;
  font-size: 11px;
  line-height: 1.35;
  font-weight: 560;
  color: rgba(255, 255, 255, 0.68);
}

.mxp-pill {
  height: 26px;
  margin-top: 2px;
  padding: 0 11px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.74);
  display: inline-flex;
  align-items: center;
  gap: 7px;
  white-space: nowrap;
  font-size: 8px;
  font-weight: 650;
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}

.mxp-pill span {
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: #fff;
}

.mxp-chart-card {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 10px;
  height: 214px;
  border-radius: 27px;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.02)),
    rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.mxp-chart-card::before {
  content: "";
  position: absolute;
  inset: 48px 0 52px;
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px) 0 0 / 52px 100%,
    repeating-linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.08) 0 1px,
      transparent 1px 29px
    );
  opacity: 0.45;
}

.mxp-chart-card::after {
  content: "";
  position: absolute;
  left: 55px;
  right: 20px;
  top: 73px;
  height: 62px;
  border-top: 3px solid #d6b17a;
  border-radius: 50% 50% 0 0;
  transform: rotate(-4deg);
  opacity: 0.95;
  filter: drop-shadow(0 0 8px rgba(214, 177, 122, 0.28));
}

.mxp-chart-card__head {
  height: 58px;
  position: relative;
  z-index: 3;
  padding: 16px 14px 0;
  display: flex;
  justify-content: space-between;
}

.mxp-chart-card__head p {
  margin: 0;
  font-size: 12px;
  font-weight: 760;
  color: #fff;
}

.mxp-chart-card__head small {
  display: block;
  margin-top: 0px;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.45);
}

.mxp-chart-card__head button {
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 999px;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.32);
  font-size: 15px;
}

.mxp-chart {
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 13px;
  height: 120px;
  z-index: 4;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  align-items: end;
  gap: 15px;
}

.mxp-chart__item {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.mxp-chart__item i {
  width: 5px;
  min-height: 12px;
  border-radius: 999px;
  display: block;
  background: #ffffff;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.32);
}

.mxp-chart__item i.is-active {
  background: #d6b17a;
  box-shadow: 0 0 18px rgba(214, 177, 122, 0.52);
}

.mxp-chart__item span {
  font-size: 10px;
  font-weight: 520;
  color: rgba(255, 255, 255, 0.45);
}

.mxp-chart b {
  position: absolute;
  left: 53.5%;
  top: 17px;
  transform: translateX(-50%);
  height: 17px;
  padding: 0 7px;
  border-radius: 999px;
  background: #d6b17a;
  color: #16110b;
  display: grid;
  place-items: center;
  font-size: 8px;
  font-weight: 950;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.26);
}

.mxp-content {
  padding: 14px 4px 0;
}

.mxp-stock {
  height: 186px;
  position: relative;
  border-radius: 24px;
  background: #131313;
  padding: 15px 12px;
  overflow: hidden;
}

.mxp-stock__main {
  height: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 104px;
  column-gap: 12px;
}

.mxp-stock__left {
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.mxp-stock__right {
  width: 104px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.mxp-stock__label {
  margin: 0;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
}

.mxp-select {
  width: 104px;
  height: 114px;
  border-radius: 17px;
  background:
    radial-gradient(circle at 20% 16%, rgba(255, 255, 255, 0.18), transparent 38%),
    linear-gradient(135deg, #d6b17a 0%, #b98a55 100%);
  overflow: hidden;
  padding: 3px;
  position: relative;
}

.mxp-select__indicator {
  position: absolute;
  left: 3px;
  top: 3px;
  width: calc(100% - 6px);
  height: 36px;
  border-radius: 13px;
  background: #111111;
  z-index: 1;
  transition:
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    border-radius 0.28s ease;
}

.mxp-select button {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 36px;
  border: 0;
  background: transparent;
  border-radius: 13px;
  color: rgba(22, 17, 11, 0.68);
  font-size: 9px;
  font-weight: 900;
  transition:
    color 0.2s ease,
    transform 0.2s ease;
}

.mxp-select button.is-selected {
  color: #ffffff;
  transform: scale(1.015);
}

.mxp-stock__numbers {
  margin-top: 24px;
  display: grid;
  gap: 7px;
  width: 100%;
  min-width: 0;
}

.mxp-stock__numbers div {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  min-width: 0;
  overflow: hidden;
}

.mxp-stock__numbers strong {
  flex: 0 0 auto;
  font-size: 24px;
  line-height: 0.95;
  letter-spacing: -0.055em;
  font-weight: 520;
  color: #ffffff;
  white-space: nowrap;
}

.mxp-stock__numbers span {
  flex: 0 0 auto;
  padding-top: 2px;
  font-size: 10px;
  line-height: 1.05;
  color: #ffffff;
  font-weight: 700;
  white-space: nowrap;
}

.mxp-stock__numbers small {
  display: block;
  margin-top: 2px;
  color: #d6b17a;
  font-size: 10px;
  font-weight: 900;
}

.mxp-stock__mini {
  margin-top: auto;
  padding-bottom: 1px;
}

.mxp-stock__mini strong {
  display: block;
  font-size: 21px;
  line-height: 0.95;
  letter-spacing: -0.05em;
  font-weight: 540;
  color: #fff;
  white-space: nowrap;
}

.mxp-stock__mini span {
  display: block;
  margin-top: 5px;
  font-size: 8.5px;
  letter-spacing: 0;
  color: rgba(255, 255, 255, 0.42);
  white-space: nowrap;
}

.mxp-revenue-enter-active,
.mxp-revenue-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.mxp-revenue-enter-from {
  opacity: 0;
  transform: translateY(7px);
}

.mxp-revenue-leave-to {
  opacity: 0;
  transform: translateY(-7px);
}

.mxp-details {
  width: 104px;
  height: 31px;
  border: 0;
  border-radius: 999px;
  background: #d6b17a;
  color: #16110b;
  font-size: 9px;
  font-weight: 900;
}

.mxp-agenda {
  margin-top: 14px;
  border-radius: 25px;
  background: #131313;
  padding: 18px 15px 14px;
  overflow: hidden;
}

.mxp-agenda__head {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
}

.mxp-agenda__head span {
  display: block;
  margin-bottom: 7px;
  font-size: 11px;
  font-weight: 760;
  letter-spacing: 0.02em;
  color: #d6b17a;
  text-transform: capitalize;
}

.mxp-agenda__head h2 {
  margin: 0;
  font-size: 28px;
  line-height: 0.94;
  letter-spacing: -0.065em;
  font-weight: 560;
  color: #ffffff;
}

.mxp-agenda__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mxp-action-btn {
  width: 42px;
  height: 42px;
  border: 0;
  border-radius: 999px;
  background: rgba(214, 177, 122, 0.12);
  color: #d6b17a;
  display: grid;
  place-items: center;
  padding: 0;
}

.mxp-action-btn.is-add {
  background: #d6b17a;
  color: #16110b;
}

.mxp-action-btn svg {
  width: 18px;
  height: 18px;
}

.mxp-date-input {
  position: absolute;
  right: 0;
  top: 0;
  width: 42px;
  height: 42px;
  opacity: 0;
  pointer-events: none;
}

.mxp-agenda__summary {
  margin-top: 17px;
  padding: 12px 0 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.075);
  border-bottom: 1px solid rgba(255, 255, 255, 0.075);
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.mxp-agenda__summary p {
  margin: 0;
  font-size: 24px;
  line-height: 0.88;
  letter-spacing: -0.055em;
  font-weight: 540;
  color: #ffffff;
}

.mxp-agenda__summary p span {
  display: block;
  margin-top: 8px;
  font-size: 10px;
  line-height: 1;
  letter-spacing: 0;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.42);
}

.mxp-agenda__summary small {
  margin-bottom: 1px;
  font-size: 12px;
  font-weight: 900;
  color: #d6b17a;
}

.mxp-agenda__list {
  display: grid;
}

.mxp-agenda-row {
  min-height: 68px;
  display: grid;
  grid-template-columns: 53px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  padding: 13px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.075);
}

.mxp-agenda-row__time strong {
  display: block;
  font-size: 15px;
  line-height: 1;
  letter-spacing: -0.035em;
  font-weight: 850;
  color: #ffffff;
}

.mxp-agenda-row__time span {
  display: block;
  margin-top: 6px;
  font-size: 9px;
  font-weight: 750;
  color: rgba(255, 255, 255, 0.36);
}

.mxp-agenda-row__client {
  min-width: 0;
}

.mxp-agenda-row__client h3 {
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 15px;
  line-height: 1.05;
  letter-spacing: -0.03em;
  font-weight: 720;
  color: #ffffff;
}

.mxp-agenda-row__client p {
  margin: 6px 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 10.5px;
  font-weight: 650;
  color: rgba(255, 255, 255, 0.42);
}

.mxp-agenda-row__price {
  font-size: 12px;
  font-weight: 900;
  color: #d6b17a;
  white-space: nowrap;
}

.mxp-empty {
  padding: 24px 0 8px;
}

.mxp-empty h3 {
  margin: 0;
  font-size: 15px;
  letter-spacing: -0.03em;
  color: #ffffff;
}

.mxp-empty p {
  margin: 7px 0 0;
  max-width: 220px;
  font-size: 10px;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.42);
}

.mxp-agenda-extra {
  margin-top: 14px;
  padding: 12px;
  border-radius: 25px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.022)),
    #131313;
  overflow: hidden;
}

.mxp-day-strip {
  min-height: 72px;
  border-radius: 20px;
  background:
    radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.18), transparent 38%),
    linear-gradient(135deg, #d6b17a 0%, #b98a55 100%);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  overflow: hidden;
}

.mxp-day-strip article {
  display: grid;
  place-items: center;
  align-content: center;
  text-align: center;
  position: relative;
}

.mxp-day-strip article + article::before {
  content: "";
  position: absolute;
  left: 0;
  top: 17px;
  bottom: 17px;
  width: 1px;
  background: rgba(22, 17, 11, 0.18);
}

.mxp-day-strip strong {
  display: block;
  font-size: 24px;
  line-height: 0.9;
  letter-spacing: -0.06em;
  font-weight: 620;
  color: #16110b;
}

.mxp-day-strip span {
  display: block;
  margin-top: 7px;
  font-size: 9px;
  font-weight: 850;
  color: rgba(22, 17, 11, 0.62);
}

.mxp-insights {
  margin-top: 10px;
  display: grid;
  grid-template-columns: minmax(0, 1.18fr) minmax(0, 0.82fr);
  gap: 10px;
}

.mxp-next {
  min-height: 124px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.055);
  padding: 14px;
}

.mxp-next > span,
.mxp-side-note span,
.mxp-hours span {
  display: block;
  font-size: 8px;
  font-weight: 850;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(214, 177, 122, 0.92);
}

.mxp-next > strong {
  display: block;
  margin-top: 20px;
  font-size: 29px;
  line-height: 0.9;
  letter-spacing: -0.07em;
  font-weight: 540;
  color: #ffffff;
}

.mxp-next__body {
  margin-top: 14px;
  min-width: 0;
}

.mxp-next__body h3,
.mxp-side-note h3,
.mxp-hours h3 {
  margin: 0;
  font-size: 15px;
  line-height: 1.03;
  letter-spacing: -0.04em;
  font-weight: 760;
  color: #ffffff;
}

.mxp-next__body p,
.mxp-side-note p {
  margin: 7px 0 0;
  font-size: 9.5px;
  font-weight: 680;
  color: rgba(255, 255, 255, 0.42);
}

.mxp-side-note {
  min-height: 124px;
  border-radius: 20px;
  background:
    radial-gradient(circle at 20% 16%, rgba(255, 255, 255, 0.18), transparent 38%),
    linear-gradient(135deg, #d6b17a 0%, #b98a55 100%);
  padding: 14px 13px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.mxp-side-note span {
  margin-bottom: auto;
  color: rgba(22, 17, 11, 0.58);
}

.mxp-side-note h3 {
  max-width: 94px;
  color: #16110b;
}

.mxp-side-note p {
  color: rgba(22, 17, 11, 0.68);
  font-weight: 850;
}

.mxp-hours {
  margin-top: 10px;
  min-height: 82px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);
  padding: 14px 15px;
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: center;
}

.mxp-hours h3 {
  margin-top: 9px;
  font-size: 19px;
  font-weight: 520;
  letter-spacing: -0.06em;
}

.mxp-hours p {
  margin: 0;
  font-size: 9px;
  line-height: 1.35;
  text-align: right;
  color: rgba(255, 255, 255, 0.42);
  font-weight: 700;
}

.mxp-hours p strong {
  display: block;
  margin-top: 4px;
  color: #ffffff;
  font-size: 11px;
  font-weight: 850;
  white-space: nowrap;
}

.mxp-modal {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.mxp-modal__backdrop {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgba(0, 0, 0, 0.58);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.mxp-modal-fade-enter-active,
.mxp-modal-fade-leave-active {
  transition: opacity 0.22s ease;
}

.mxp-modal-fade-enter-from,
.mxp-modal-fade-leave-to {
  opacity: 0;
}

.mxp-popup-slide-enter-active,
.mxp-popup-slide-leave-active {
  transition:
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.22s ease;
}

.mxp-popup-slide-enter-from,
.mxp-popup-slide-leave-to {
  opacity: 0;
  transform: translateY(24px) scale(0.98);
}

.mxp-popup {
  width: min(100%, 430px);
  max-height: calc(100svh - 38px);
  position: relative;
  z-index: 2;
  border-radius: 30px 30px 0 0;
  background:
    radial-gradient(circle at 82% 5%, rgba(214, 177, 122, 0.18), transparent 32%),
    #131313;
  padding: 24px 20px 22px;
  overflow-y: auto;
  box-shadow: 0 -18px 60px rgba(0, 0, 0, 0.42);
}

.mxp-popup__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 20px;
}

.mxp-popup__head span {
  display: block;
  margin-bottom: 7px;
  font-size: 10px;
  font-weight: 850;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  color: #d6b17a;
}

.mxp-popup__head h2 {
  margin: 0;
  font-size: 34px;
  line-height: 0.92;
  letter-spacing: -0.075em;
  font-weight: 560;
  color: #ffffff;
}

.mxp-popup__head button {
  width: 42px;
  height: 42px;
  border: 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.055);
  color: #ffffff;
  display: grid;
  place-items: center;
  padding: 0;
}

.mxp-popup__head svg {
  width: 18px;
  height: 18px;
}

.mxp-popup__section {
  padding: 16px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.075);
}

.mxp-popup__label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.mxp-popup__label span {
  font-size: 9px;
  font-weight: 900;
  color: #d6b17a;
}

.mxp-popup__label p {
  margin: 0;
  font-size: 11px;
  font-weight: 850;
  color: rgba(255, 255, 255, 0.56);
}

.mxp-popup-days,
.mxp-popup-slots {
  display: grid;
  grid-auto-flow: column;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
}

.mxp-popup-days::-webkit-scrollbar,
.mxp-popup-slots::-webkit-scrollbar {
  display: none;
}

.mxp-popup-days {
  grid-auto-columns: 67px;
}

.mxp-popup-days button {
  height: 66px;
  border: 0;
  border-radius: 19px;
  background: rgba(255, 255, 255, 0.055);
  color: #ffffff;
  padding: 0;
  display: grid;
  place-items: center;
  align-content: center;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.mxp-popup-days button span {
  font-size: 8px;
  font-weight: 850;
  color: rgba(255, 255, 255, 0.42);
}

.mxp-popup-days button strong {
  margin-top: 8px;
  font-size: 22px;
  line-height: 0.9;
  letter-spacing: -0.06em;
  font-weight: 580;
}

.mxp-popup-days button.is-selected,
.mxp-popup-slots button.is-selected {
  background: #d6b17a;
  color: #16110b;
  transform: scale(0.98);
}

.mxp-popup-days button.is-selected span {
  color: rgba(22, 17, 11, 0.62);
}

.mxp-popup-barbers {
  display: grid;
  gap: 9px;
}

.mxp-popup-barbers button {
  min-height: 82px;
  border: 0;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.055);
  color: #ffffff;
  padding: 12px;
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  text-align: left;
  transition:
    background 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.mxp-popup-barbers button.is-selected {
  background: rgba(214, 177, 122, 0.14);
  box-shadow: inset 0 0 0 1px rgba(214, 177, 122, 0.28);
  transform: scale(0.99);
}

.mxp-popup-barbers img {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 999px;
}

.mxp-popup-barbers strong {
  display: block;
  font-size: 14px;
  line-height: 1;
  letter-spacing: -0.035em;
  font-weight: 800;
}

.mxp-popup-barbers span {
  display: block;
  margin-top: 6px;
  font-size: 9px;
  font-weight: 720;
  color: rgba(255, 255, 255, 0.42);
}

.mxp-popup-barbers small {
  width: 34px;
  height: 24px;
  border-radius: 999px;
  background: rgba(214, 177, 122, 0.12);
  color: #d6b17a;
  display: grid;
  place-items: center;
  font-size: 9px;
  font-weight: 900;
}

.mxp-popup-services {
  display: grid;
  gap: 8px;
}

.mxp-popup-services button {
  min-height: 62px;
  border: 0;
  border-radius: 19px;
  background: rgba(255, 255, 255, 0.055);
  color: #ffffff;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  text-align: left;
  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.mxp-popup-services button.is-selected {
  background: rgba(214, 177, 122, 0.14);
  transform: scale(0.99);
}

.mxp-popup-services strong {
  display: block;
  font-size: 13px;
  line-height: 1.05;
  letter-spacing: -0.035em;
  font-weight: 780;
}

.mxp-popup-services span {
  display: block;
  margin-top: 6px;
  font-size: 9px;
  font-weight: 720;
  color: rgba(255, 255, 255, 0.42);
}

.mxp-popup-services p {
  margin: 0;
  flex: 0 0 auto;
  font-size: 10px;
  font-weight: 900;
  color: #d6b17a;
}

.mxp-popup-slots {
  grid-auto-columns: 72px;
}

.mxp-popup-slots button {
  height: 42px;
  border: 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.055);
  color: rgba(255, 255, 255, 0.68);
  font-size: 11px;
  font-weight: 850;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.mxp-popup-form {
  display: grid;
  gap: 10px;
}

.mxp-popup-form label {
  display: grid;
  gap: 8px;
  font-size: 10px;
  font-weight: 850;
  color: rgba(255, 255, 255, 0.54);
}

.mxp-popup-form input {
  width: 100%;
  height: 50px;
  border: 0;
  outline: 0;
  border-radius: 19px;
  background: rgba(255, 255, 255, 0.055);
  color: #ffffff;
  padding: 0 14px;
  font-size: 13px;
  font-weight: 700;
  font-family: inherit;
  transition:
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.mxp-popup-form input:focus {
  background: rgba(255, 255, 255, 0.075);
  box-shadow: inset 0 0 0 1px rgba(214, 177, 122, 0.25);
}

.mxp-popup-form input::placeholder {
  color: rgba(255, 255, 255, 0.28);
}

.mxp-popup__submit {
  width: 100%;
  height: 54px;
  border: 0;
  border-radius: 999px;
  background: rgba(214, 177, 122, 0.42);
  color: rgba(22, 17, 11, 0.65);
  font-size: 13px;
  font-weight: 950;
  margin-top: 8px;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.mxp-popup__submit.is-ready {
  background: #d6b17a;
  color: #16110b;
}

.mxp-popup__submit.is-ready:active {
  transform: scale(0.985);
}

@media (min-width: 431px) {
  .mxp-shell {
    padding: 20px 0;
  }

  .mxp-phone {
    min-height: 932px;
    border-radius: 36px;
  }

  .mxp-popup {
    border-radius: 30px;
    margin-bottom: 20px;
  }
}
</style>