<template>
  <main class="tmx-shell">
    <section class="tmx-phone">
      <nav class="tmx-nav">
        <div class="mxp-brand">
          <div class="mxp-brand__mark">
            <img :src="stefanLogo" alt="">
          </div>

          <!-- <div>
            <strong>Stefan Studio</strong>
            <small>Barber admin</small>
          </div> -->
          </div>

        <button class="tmx-add-btn" type="button" aria-label="Dodaj termin" @click="isAddOpen = true">
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
      </nav>

      <section class="tmx-header">
        <div>
          <span>{{ formattedSelectedDate }}</span>
          <h1>Pregled termina</h1>
        </div>

        <button class="tmx-calendar-btn" type="button" @click="openDatePicker">
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

        <input
          ref="dateInput"
          v-model="selectedDate"
          class="tmx-date-input"
          type="date"
        />
      </section>

      <section class="tmx-date-strip">
        <button
          v-for="day in days"
          :key="day.id"
          type="button"
          :class="{ 'is-selected': selectedDate === day.value }"
          @click="selectedDate = day.value"
        >
          <span>{{ day.label }}</span>
          <strong>{{ day.date }}</strong>
        </button>
      </section>

      <section class="tmx-overview">
        <article>
          <strong>{{ selectedAppointments.length }}</strong>
          <span>termina</span>
        </article>

        <article>
          <strong>{{ totalRevenue }}</strong>
          <span>RSD</span>
        </article>

        <article>
          <strong>2</strong>
          <span>slobodna</span>
        </article>
      </section>

      <section class="tmx-filters">
        <button
          v-for="filter in filters"
          :key="filter.id"
          type="button"
          :class="{ 'is-selected': selectedFilter === filter.id }"
          @click="selectedFilter = filter.id"
        >
          {{ filter.label }}
        </button>
      </section>

      <section class="tmx-timeline">
        <div class="tmx-timeline__head">
          <span>Dnevni raspored</span>
          <p>{{ filteredAppointments.length }} prikazano</p>
        </div>

        <div class="tmx-timeline__list">
          <article
            v-for="appointment in filteredAppointments"
            :key="appointment.id"
            class="tmx-appointment"
            :class="`is-${appointment.status}`"
          >
            <div class="tmx-appointment__time">
              <strong>{{ appointment.time }}</strong>
              <span>{{ appointment.duration }}</span>
            </div>

            <div class="tmx-appointment__line">
              <i></i>
            </div>

            <div class="tmx-appointment__content">
              <div class="tmx-appointment__top">
                <div>
                  <h3>{{ appointment.name }}</h3>
                  <p>{{ appointment.service }}</p>
                </div>

                <strong>{{ appointment.price }}</strong>
              </div>

              <div class="tmx-appointment__bottom">
                <span>{{ appointment.barber }}</span>

                <button type="button">
                  {{ appointment.statusLabel }}
                </button>
              </div>
            </div>
          </article>

          <article v-if="!filteredAppointments.length" class="tmx-empty">
            <h3>Nema termina</h3>
            <p>Za izabrani filter nema zakazanih termina.</p>
          </article>
        </div>
      </section>

      <section class="tmx-quick">
        <article>
          <span>Sledeći slobodan slot</span>
          <strong>12:30</strong>
          <p>30 minuta između dva termina</p>
        </article>

        <article>
          <span>Najduži tretman</span>
          <strong>60min</strong>
          <p>Premium tretman · Luka Ilić</p>
        </article>
      </section>

      <footer class="tmx-bottom">
        <button type="button" aria-label="Home">
          <svg viewBox="0 0 24 24">
            <path d="M4 11.5 12 5l8 6.5V20H4V11.5Z" />
          </svg>
        </button>

        <button class="is-current" type="button" aria-label="Termini">
          <svg viewBox="0 0 24 24">
            <path d="M6.75 3v2.25M17.25 3v2.25M3.75 8.25h16.5M5.25 5.25h13.5A1.5 1.5 0 0 1 20.25 6.75v11.5a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V6.75a1.5 1.5 0 0 1 1.5-1.5Z" />
          </svg>
        </button>

        <button type="button" aria-label="Klijenti">
          <svg viewBox="0 0 24 24">
            <path d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0" />
          </svg>
        </button>

        <button type="button" aria-label="Salon">
          <svg viewBox="0 0 24 24">
            <path d="M4.5 6.75h15M4.5 12h15M4.5 17.25h15" />
          </svg>
        </button>

        <button type="button" aria-label="Podešavanja">
          <svg viewBox="0 0 24 24">
            <path d="M12 8.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm0-5v3m0 11v3m8.5-8.5h-3m-11 0h-3" />
          </svg>
        </button>
      </footer>

      <div v-if="isAddOpen" class="tmx-modal">
        <button class="tmx-modal__backdrop" type="button" aria-label="Zatvori" @click="isAddOpen = false"></button>

        <section class="tmx-popup">
          <header class="tmx-popup__head">
            <div>
              <span>Novi termin</span>
              <h2>Dodaj termin</h2>
            </div>

            <button type="button" aria-label="Zatvori" @click="isAddOpen = false">
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

          <div class="tmx-popup__section">
            <div class="tmx-popup__label">
              <span>01</span>
              <p>Dan</p>
            </div>

            <div class="tmx-popup-days">
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
          </div>

          <div class="tmx-popup__section">
            <div class="tmx-popup__label">
              <span>02</span>
              <p>Barber</p>
            </div>

            <div class="tmx-popup-barbers">
              <button
                v-for="barber in barbers"
                :key="barber.id"
                type="button"
                :class="{ 'is-selected': newAppointment.barber === barber.id }"
                @click="newAppointment.barber = barber.id"
              >
                <img :src="barber.image" :alt="barber.name" />
                <span>{{ barber.name }}</span>
              </button>
            </div>
          </div>

          <div class="tmx-popup__section">
            <div class="tmx-popup__label">
              <span>03</span>
              <p>Usluga</p>
            </div>

            <div class="tmx-popup-services">
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
          </div>

          <div class="tmx-popup__section">
            <div class="tmx-popup__label">
              <span>04</span>
              <p>Slot</p>
            </div>

            <div class="tmx-popup-slots">
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
          </div>

          <button class="tmx-popup__submit" type="button" @click="isAddOpen = false">
            Sačuvaj termin
          </button>
        </section>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import stefanLogo from '@/assets/img/stefan-logo2.png';


type DateInputElement = HTMLInputElement & {
  showPicker?: () => void
}

type AppointmentStatus = 'confirmed' | 'pending' | 'cancelled'

type Appointment = {
  id: number
  time: string
  duration: string
  name: string
  service: string
  barber: string
  price: string
  status: AppointmentStatus
  statusLabel: string
}

const dateInput = ref<HTMLInputElement | null>(null)
const selectedDate = ref('2026-06-12')
const selectedFilter = ref<'all' | AppointmentStatus>('all')
const isAddOpen = ref(false)

const newAppointment = reactive({
  day: '2026-06-12',
  barber: 1,
  service: 1,
  slot: '12:30',
})

const filters = [
  { id: 'all', label: 'Svi' },
  { id: 'confirmed', label: 'Potvrđeni' },
  { id: 'pending', label: 'Na čekanju' },
  { id: 'cancelled', label: 'Otkazani' },
] as const

const days = [
  { id: 1, label: 'PON', date: '09', value: '2026-06-09' },
  { id: 2, label: 'UTO', date: '10', value: '2026-06-10' },
  { id: 3, label: 'SRE', date: '11', value: '2026-06-11' },
  { id: 4, label: 'DANAS', date: '12', value: '2026-06-12' },
  { id: 5, label: 'PET', date: '13', value: '2026-06-13' },
  { id: 6, label: 'SUB', date: '14', value: '2026-06-14' },
]

const popupDays = [
  { label: 'Danas', date: '12', value: '2026-06-12' },
  { label: 'Pet', date: '13', value: '2026-06-13' },
  { label: 'Sub', date: '14', value: '2026-06-14' },
  { label: 'Ned', date: '15', value: '2026-06-15' },
]

const barbers = [
  {
    id: 1,
    name: 'Stefan',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=140&q=80',
  },
  {
    id: 2,
    name: 'Aleksa',
    image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=140&q=80',
  },
  {
    id: 3,
    name: 'Milan',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=140&q=80',
  },
]

const services = [
  { id: 1, name: 'Fade + brada', duration: '45min', price: '2.400 RSD' },
  { id: 2, name: 'Šišanje', duration: '30min', price: '1.500 RSD' },
  { id: 3, name: 'Premium tretman', duration: '60min', price: '3.200 RSD' },
]

const slots = ['09:30', '10:15', '11:00', '12:30', '13:15', '15:45', '17:30']

const appointments: Record<string, Appointment[]> = {
  '2026-06-12': [
    {
      id: 1,
      time: '09:30',
      duration: '45min',
      name: 'Marko Petrović',
      service: 'Fade + brada',
      barber: 'Stefan',
      price: '2.400',
      status: 'confirmed',
      statusLabel: 'Potvrđen',
    },
    {
      id: 2,
      time: '11:00',
      duration: '30min',
      name: 'Nikola Jović',
      service: 'Šišanje',
      barber: 'Stefan',
      price: '1.500',
      status: 'confirmed',
      statusLabel: 'Potvrđen',
    },
    {
      id: 3,
      time: '13:15',
      duration: '60min',
      name: 'Luka Ilić',
      service: 'Premium tretman',
      barber: 'Aleksa',
      price: '3.200',
      status: 'pending',
      statusLabel: 'Čeka',
    },
    {
      id: 4,
      time: '15:00',
      duration: '30min',
      name: 'Pavle Đorđević',
      service: 'Šišanje',
      barber: 'Milan',
      price: '1.500',
      status: 'cancelled',
      statusLabel: 'Otkazan',
    },
    {
      id: 5,
      time: '17:30',
      duration: '45min',
      name: 'Stefan Milić',
      service: 'Brada + konture',
      barber: 'Aleksa',
      price: '1.800',
      status: 'confirmed',
      statusLabel: 'Potvrđen',
    },
  ],
  '2026-06-13': [
    {
      id: 6,
      time: '10:00',
      duration: '45min',
      name: 'Vuk Stanić',
      service: 'Fade cut',
      barber: 'Milan',
      price: '2.000',
      status: 'confirmed',
      statusLabel: 'Potvrđen',
    },
    {
      id: 7,
      time: '15:45',
      duration: '30min',
      name: 'Milan Kostić',
      service: 'Šišanje',
      barber: 'Stefan',
      price: '1.500',
      status: 'pending',
      statusLabel: 'Čeka',
    },
  ],
  '2026-06-14': [
    {
      id: 8,
      time: '12:20',
      duration: '60min',
      name: 'Aleksa Todorović',
      service: 'Komplet tretman',
      barber: 'Aleksa',
      price: '3.500',
      status: 'confirmed',
      statusLabel: 'Potvrđen',
    },
  ],
}

const selectedAppointments = computed(() => {
  return appointments[selectedDate.value] ?? []
})

const filteredAppointments = computed(() => {
  if (selectedFilter.value === 'all') {
    return selectedAppointments.value
  }

  return selectedAppointments.value.filter((item) => item.status === selectedFilter.value)
})

const formattedSelectedDate = computed(() => {
  const date = new Date(`${selectedDate.value}T12:00:00`)

  return new Intl.DateTimeFormat('sr-Latn-RS', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  }).format(date)
})

const totalRevenue = computed(() => {
  return selectedAppointments.value
    .filter((item) => item.status !== 'cancelled')
    .reduce((sum, item) => {
      return sum + Number(item.price.replace('.', ''))
    }, 0)
    .toLocaleString('sr-RS')
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
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.tmx-shell {
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

.tmx-phone {
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

.tmx-nav {
  height: 40px;
  display: grid;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.tmx-nav p {
  margin: 0;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
}

.tmx-icon-btn,
.tmx-add-btn {
  width: 40px;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  background: rgba(255, 255, 255, 0.035);
  border-radius: 999px;
  display: grid;
  place-items: center;
  padding: 0;
  color: #ffffff;
}

.tmx-add-btn {
  justify-self: end;
  background: #d6b17a;
  color: #16110b;
  border: 0;
}

.tmx-icon-btn svg,
.tmx-add-btn svg {
  width: 20px;
  height: 20px;
}

.tmx-header {
  position: relative;
  min-height: 124px;
  border-radius: 30px;
  padding: 22px 18px;
  background:
    radial-gradient(circle at 75% 22%, rgba(214, 177, 122, 0.32), transparent 34%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.02)),
    #131313;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  overflow: hidden;
}

.tmx-header::after {
  content: "";
  position: absolute;
  right: -34px;
  bottom: -58px;
  width: 160px;
  height: 160px;
  border-radius: 999px;
  border: 1px solid rgba(214, 177, 122, 0.18);
}

.tmx-header span {
  display: block;
  margin-bottom: 9px;
  color: #d6b17a;
  font-size: 11px;
  font-weight: 760;
  text-transform: capitalize;
}

.tmx-header h1 {
  margin: 0;
  max-width: 230px;
  color: #ffffff;
  font-size: 38px;
  line-height: 0.9;
  letter-spacing: -0.03em;
  font-weight: 560;
}

.tmx-calendar-btn {
  width: 43px;
  height: 43px;
  position: relative;
  z-index: 2;
  border: 0;
  border-radius: 999px;
  background: rgba(214, 177, 122, 0.13);
  color: #d6b17a;
  display: grid;
  place-items: center;
  padding: 0;
}

.tmx-calendar-btn svg {
  width: 18px;
  height: 18px;
}

.tmx-date-input {
  position: absolute;
  right: 18px;
  top: 22px;
  width: 43px;
  height: 43px;
  opacity: 0;
  pointer-events: none;
}

.tmx-date-strip {
  margin-top: 14px;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 62px;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 2px;
  scrollbar-width: none;
}

.tmx-date-strip::-webkit-scrollbar,
.tmx-filters::-webkit-scrollbar,
.tmx-popup-days::-webkit-scrollbar,
.tmx-popup-barbers::-webkit-scrollbar,
.tmx-popup-slots::-webkit-scrollbar {
  display: none;
}

.tmx-date-strip button {
  height: 74px;
  border: 0;
  border-radius: 22px;
  background: #131313;
  color: #ffffff;
  padding: 0;
  display: grid;
  place-items: center;
  align-content: center;
}

.tmx-date-strip button span {
  display: block;
  margin-bottom: 9px;
  font-size: 8px;
  font-weight: 880;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.38);
}

.tmx-date-strip button strong {
  font-size: 24px;
  line-height: 0.9;
  letter-spacing: -0.06em;
  font-weight: 560;
}

.tmx-date-strip button.is-selected {
  background:
    radial-gradient(circle at 22% 18%, rgba(255, 255, 255, 0.18), transparent 42%),
    linear-gradient(135deg, #d6b17a 0%, #b98a55 100%);
  color: #16110b;
}

.tmx-date-strip button.is-selected span {
  color: rgba(22, 17, 11, 0.62);
}

.tmx-overview {
  margin-top: 14px;
  min-height: 78px;
  border-radius: 24px;
  background:
    radial-gradient(circle at 15% 30%, rgba(255, 255, 255, 0.15), transparent 38%),
    linear-gradient(135deg, #d6b17a 0%, #b98a55 100%);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  overflow: hidden;
}

.tmx-overview article {
  display: grid;
  place-items: center;
  align-content: center;
  text-align: center;
  position: relative;
}

.tmx-overview article + article::before {
  content: "";
  position: absolute;
  left: 0;
  top: 18px;
  bottom: 18px;
  width: 1px;
  background: rgba(22, 17, 11, 0.18);
}

.tmx-overview strong {
  display: block;
  max-width: 100%;
  font-size: 22px;
  line-height: 0.9;
  letter-spacing: -0.06em;
  font-weight: 620;
  color: #16110b;
}

.tmx-overview span {
  display: block;
  margin-top: 8px;
  font-size: 9px;
  font-weight: 850;
  color: rgba(22, 17, 11, 0.62);
}

.tmx-filters {
  margin-top: 14px;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 2px;
  scrollbar-width: none;
}

.tmx-filters button {
  height: 36px;
  border: 0;
  border-radius: 999px;
  background: #131313;
  color: rgba(255, 255, 255, 0.5);
  padding: 0 15px;
  font-size: 10px;
  font-weight: 820;
  white-space: nowrap;
}

.tmx-filters button.is-selected {
  background: rgba(214, 177, 122, 0.14);
  color: #d6b17a;
}

.tmx-timeline {
  margin-top: 14px;
  border-radius: 26px;
  background: #131313;
  padding: 18px 15px 14px;
  overflow: hidden;
}

.tmx-timeline__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 6px;
}

.tmx-timeline__head span {
  display: block;
  font-size: 9px;
  font-weight: 850;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  color: #d6b17a;
}

.tmx-timeline__head p {
  margin: 0;
  font-size: 9px;
  font-weight: 760;
  color: rgba(255, 255, 255, 0.38);
}

.tmx-timeline__list {
  display: grid;
}

.tmx-appointment {
  display: grid;
  grid-template-columns: 54px 16px minmax(0, 1fr);
  gap: 8px;
  padding: 14px 0;
  position: relative;
}

.tmx-appointment + .tmx-appointment {
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}

.tmx-appointment__time strong {
  display: block;
  font-size: 15px;
  line-height: 1;
  letter-spacing: -0.04em;
  font-weight: 850;
  color: #ffffff;
}

.tmx-appointment__time span {
  display: block;
  margin-top: 7px;
  font-size: 9px;
  font-weight: 760;
  color: rgba(255, 255, 255, 0.35);
}

.tmx-appointment__line {
  display: flex;
  justify-content: center;
  padding-top: 3px;
}

.tmx-appointment__line i {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #d6b17a;
  box-shadow: 0 0 0 5px rgba(214, 177, 122, 0.11);
}

.tmx-appointment.is-pending .tmx-appointment__line i {
  background: #f0d6a5;
}

.tmx-appointment.is-cancelled {
  opacity: 0.52;
}

.tmx-appointment.is-cancelled .tmx-appointment__line i {
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 0 0 0 5px rgba(255, 255, 255, 0.06);
}

.tmx-appointment__content {
  min-width: 0;
}

.tmx-appointment__top {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.tmx-appointment__top div {
  min-width: 0;
}

.tmx-appointment__top h3 {
  margin: 0;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 15px;
  line-height: 1.05;
  letter-spacing: -0.035em;
  font-weight: 740;
  color: #ffffff;
}

.tmx-appointment__top p {
  margin: 7px 0 0;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 10px;
  font-weight: 680;
  color: rgba(255, 255, 255, 0.42);
}

.tmx-appointment__top > strong {
  flex: 0 0 auto;
  font-size: 12px;
  font-weight: 900;
  color: #d6b17a;
  white-space: nowrap;
}

.tmx-appointment__bottom {
  margin-top: 13px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.tmx-appointment__bottom span {
  font-size: 9px;
  font-weight: 820;
  color: rgba(255, 255, 255, 0.36);
}

.tmx-appointment__bottom button {
  height: 25px;
  border: 0;
  border-radius: 999px;
  background: rgba(214, 177, 122, 0.11);
  color: #d6b17a;
  padding: 0 10px;
  font-size: 8px;
  font-weight: 900;
}

.tmx-appointment.is-cancelled .tmx-appointment__bottom button {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.56);
}

.tmx-empty {
  padding: 25px 0 10px;
}

.tmx-empty h3 {
  margin: 0;
  font-size: 15px;
  letter-spacing: -0.03em;
  color: #ffffff;
}

.tmx-empty p {
  margin: 7px 0 0;
  max-width: 220px;
  font-size: 10px;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.42);
}

.tmx-quick {
  margin-top: 14px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.tmx-quick article {
  min-height: 124px;
  border-radius: 23px;
  padding: 15px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.022)),
    #131313;
  display: flex;
  flex-direction: column;
}

.tmx-quick article:first-child {
  background:
    radial-gradient(circle at 20% 16%, rgba(255, 255, 255, 0.18), transparent 38%),
    linear-gradient(135deg, #d6b17a 0%, #b98a55 100%);
}

.tmx-quick span {
  display: block;
  font-size: 8px;
  font-weight: 850;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.42);
}

.tmx-quick article:first-child span {
  color: rgba(22, 17, 11, 0.58);
}

.tmx-quick strong {
  display: block;
  margin-top: auto;
  font-size: 25px;
  line-height: 0.9;
  letter-spacing: -0.065em;
  font-weight: 560;
  color: #ffffff;
}

.tmx-quick article:first-child strong {
  color: #16110b;
}

.tmx-quick p {
  margin: 9px 0 0;
  font-size: 9px;
  line-height: 1.3;
  font-weight: 720;
  color: rgba(255, 255, 255, 0.42);
}

.tmx-quick article:first-child p {
  color: rgba(22, 17, 11, 0.66);
}

.tmx-bottom {
  position: fixed;
  left: 50%;
  bottom: 11px;
  transform: translateX(-50%);
  width: min(calc(100% - 32px), 398px);
  height: 54px;
  z-index: 20;
  border-radius: 999px;
  background: rgba(28, 28, 28, 0.94);
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: center;
  padding: 0 12px;
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.tmx-bottom button {
  width: 42px;
  height: 42px;
  margin: 0 auto;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: rgba(255, 255, 255, 0.62);
  display: grid;
  place-items: center;
  padding: 0;
}

.tmx-bottom button.is-current {
  color: #d6b17a;
  background: rgba(214, 177, 122, 0.08);
}

.tmx-bottom svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.tmx-modal {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.tmx-modal__backdrop {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgba(0, 0, 0, 0.58);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.tmx-popup {
  width: min(100%, 430px);
  max-height: calc(100svh - 38px);
  position: relative;
  z-index: 2;
  border-radius: 30px 30px 0 0;
  background:
    radial-gradient(circle at 82% 5%, rgba(214, 177, 122, 0.18), transparent 32%),
    #131313;
  padding: 30px 20px 18px;
  overflow-y: auto;
  box-shadow: 0 -18px 60px rgba(0, 0, 0, 0.42);
}

.tmx-popup__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 20px;
}

.tmx-popup__head span {
  display: block;
  margin-bottom: 7px;
  font-size: 10px;
  font-weight: 850;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  color: #d6b17a;
}

.tmx-popup__head h2 {
  margin: 0;
  font-size: 34px;
  line-height: 0.92;
  letter-spacing: -0.075em;
  font-weight: 560;
  color: #ffffff;
}

.tmx-popup__head button {
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

.tmx-popup__head svg {
  width: 18px;
  height: 18px;
}

.tmx-popup__section {
  padding: 15px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.075);
}

.tmx-popup__label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.tmx-popup__label span {
  font-size: 9px;
  font-weight: 900;
  color: #d6b17a;
}

.tmx-popup__label p {
  margin: 0;
  font-size: 11px;
  font-weight: 850;
  color: rgba(255, 255, 255, 0.56);
}

.tmx-popup-days,
.tmx-popup-barbers,
.tmx-popup-slots {
  display: grid;
  grid-auto-flow: column;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
}

.tmx-popup-days {
  grid-auto-columns: 67px;
}

.tmx-popup-days button {
  height: 66px;
  border: 0;
  border-radius: 19px;
  background: rgba(255, 255, 255, 0.055);
  color: #ffffff;
  padding: 0;
  display: grid;
  place-items: center;
  align-content: center;
}

.tmx-popup-days button span {
  font-size: 8px;
  font-weight: 850;
  color: rgba(255, 255, 255, 0.42);
}

.tmx-popup-days button strong {
  margin-top: 8px;
  font-size: 22px;
  line-height: 0.9;
  letter-spacing: -0.06em;
  font-weight: 580;
}

.tmx-popup-days button.is-selected,
.tmx-popup-slots button.is-selected {
  background: #d6b17a;
  color: #16110b;
}

.tmx-popup-days button.is-selected span {
  color: rgba(22, 17, 11, 0.62);
}

.tmx-popup-barbers {
  grid-auto-columns: 94px;
}

.tmx-popup-barbers button {
  height: 92px;
  border: 0;
  border-radius: 21px;
  background: rgba(255, 255, 255, 0.055);
  color: #ffffff;
  padding: 10px;
  display: grid;
  justify-items: center;
  align-content: center;
}

.tmx-popup-barbers button.is-selected {
  background: rgba(214, 177, 122, 0.14);
  color: #d6b17a;
}

.tmx-popup-barbers img {
  width: 38px;
  height: 38px;
  object-fit: cover;
  border-radius: 999px;
  margin-bottom: 9px;
}

.tmx-popup-barbers span {
  font-size: 10px;
  font-weight: 850;
}

.tmx-popup-services {
  display: grid;
  gap: 8px;
}

.tmx-popup-services button {
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
}

.tmx-popup-services button.is-selected {
  background: rgba(214, 177, 122, 0.14);
}

.tmx-popup-services strong {
  display: block;
  font-size: 13px;
  line-height: 1.05;
  letter-spacing: -0.035em;
  font-weight: 780;
}

.tmx-popup-services span {
  display: block;
  margin-top: 6px;
  font-size: 9px;
  font-weight: 720;
  color: rgba(255, 255, 255, 0.42);
}

.tmx-popup-services p {
  margin: 0;
  flex: 0 0 auto;
  font-size: 10px;
  font-weight: 900;
  color: #d6b17a;
}

.tmx-popup-slots {
  grid-auto-columns: 72px;
}

.tmx-popup-slots button {
  height: 42px;
  border: 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.055);
  color: rgba(255, 255, 255, 0.68);
  font-size: 11px;
  font-weight: 850;
}

.tmx-popup__submit {
  width: 100%;
  height: 54px;
  border: 0;
  border-radius: 999px;
  background: #d6b17a;
  color: #16110b;
  font-size: 13px;
  font-weight: 950;
  margin-top: 8px;
}

@media (min-width: 431px) {
  .tmx-shell {
    padding: 20px 0;
  }

  .tmx-phone {
    min-height: 932px;
    border-radius: 36px;
  }

  .tmx-popup {
    border-radius: 30px;
    margin-bottom: 20px;
  }
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
</style>