<template>
  <main class="slx-shell">
    <section class="slx-phone">
      <nav class="slx-nav">
        <div class="mxp-brand">
        <div class="mxp-brand__mark">
          <img :src="stefanLogo" alt="">
        </div>

        <!-- <div>
          <strong>Stefan Studio</strong>
          <small>Barber admin</small>
        </div> -->
      </div>

        <span class="slx-nav-spacer"></span>
      </nav>

      <section class="slx-hero">
        <span>Upravljanje lokalom</span>

        <h1>Salon</h1>

        <p>
          Usluge, barber tim, radno vreme i pauze za svaki radni dan.
        </p>

        <div class="slx-hero__footer">
          <article>
            <strong>12</strong>
            <span>usluga</span>
          </article>

          <article>
            <strong>4</strong>
            <span>barbera</span>
          </article>

          <article>
            <strong>09–20</strong>
            <span>danas</span>
          </article>
        </div>
      </section>

      <section class="slx-quick-pills">
        <button class="is-service" type="button" @click="activeModal = 'service'">
          <span>
            <svg viewBox="0 0 24 24">
              <path d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </span>
          Dodaj uslugu
        </button>

        <button class="is-break" type="button" @click="activeModal = 'break'">
          <span>
            <svg viewBox="0 0 24 24">
              <path d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </span>
          Dodaj pauzu
        </button>

        <button class="is-barber" type="button" @click="activeModal = 'barber'">
          <span>
            <svg viewBox="0 0 24 24">
              <path d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </span>
          Dodaj barbera
        </button>
      </section>

      <section class="slx-services">
        <div class="slx-section-head">
          <div>
            <span>Usluge</span>
            <h2>Cenovnik</h2>
          </div>

          <button type="button" @click="activeModal = 'service'">Dodaj</button>
        </div>

        <article
          v-for="service in services"
          :key="service.id"
          class="slx-service"
          @click="selectedService = service; activeModal = 'service'"
        >
          <div>
            <h3>{{ service.name }}</h3>
            <p>{{ service.duration }} · {{ service.category }}</p>
          </div>

          <div class="slx-service__meta">
            <strong>{{ service.price }}</strong>
            <span :class="{ 'is-live': service.active }">
              {{ service.active ? 'Aktivna' : 'Pauzirana' }}
            </span>
          </div>
        </article>
      </section>

      <section class="slx-barbers">
        <div class="slx-section-head">
          <div>
            <span>Tim</span>
            <h2>Barberi</h2>
          </div>

          <button type="button" @click="activeModal = 'barber'">Dodaj</button>
        </div>

        <div class="slx-barber-list">
          <article
            v-for="barber in barbers"
            :key="barber.id"
            class="slx-barber"
          >
            <div class="slx-barber__top">
              <img :src="barber.image" :alt="barber.name" />

              <div>
                <h3>{{ barber.name }}</h3>
                <p>{{ barber.role }}</p>
              </div>

              <span :class="{ 'is-live': barber.active }">
                {{ barber.active ? 'Aktivan' : 'Off' }}
              </span>
            </div>

            <div class="slx-barber__info">
              <article>
                <strong>{{ barber.services }}</strong>
                <span>usluga</span>
              </article>

              <article>
                <strong>{{ barber.hours }}</strong>
                <span>radno vreme</span>
              </article>
            </div>

            <button type="button" @click="selectedBarber = barber; activeModal = 'barberHours'">
              Izmeni radno vreme
            </button>
          </article>
        </div>
      </section>

      <section class="slx-hours">
        <div class="slx-section-head">
          <div>
            <span>Lokal</span>
            <h2>Radno vreme</h2>
          </div>

          <button type="button" @click="activeModal = 'hours'">Edit</button>
        </div>

        <div class="slx-hours__list">
          <article
            v-for="day in workingHours"
            :key="day.id"
            :class="{ 'is-closed': !day.open }"
          >
            <span>{{ day.label }}</span>

            <strong>
              {{ day.open ? `${day.from} — ${day.to}` : 'Zatvoreno' }}
            </strong>
          </article>
        </div>
      </section>

      <section class="slx-breaks">
        <div class="slx-section-head">
          <div>
            <span>Pauze</span>
            <h2>Pauze</h2>
          </div>

          <button type="button" @click="activeModal = 'break'">Dodaj</button>
        </div>

        <article
          v-for="breakItem in breaks"
          :key="breakItem.id"
          class="slx-break"
        >
          <div>
            <h3>{{ breakItem.title }}</h3>
            <p>{{ breakItem.day }} · {{ breakItem.from }} — {{ breakItem.to }}</p>
          </div>

          <span>{{ breakItem.type }}</span>
        </article>
      </section>

      <footer class="slx-bottom">
        <button type="button" aria-label="Home">
          <svg viewBox="0 0 24 24">
            <path d="M4 11.5 12 5l8 6.5V20H4V11.5Z" />
          </svg>
        </button>

        <button type="button" aria-label="Termini">
          <svg viewBox="0 0 24 24">
            <path d="M6.75 3v2.25M17.25 3v2.25M3.75 8.25h16.5M5.25 5.25h13.5A1.5 1.5 0 0 1 20.25 6.75v11.5a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V6.75a1.5 1.5 0 0 1 1.5-1.5Z" />
          </svg>
        </button>

        <button type="button" aria-label="Klijenti">
          <svg viewBox="0 0 24 24">
            <path d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0" />
          </svg>
        </button>

        <button class="is-current" type="button" aria-label="Salon">
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

      <div v-if="activeModal" class="slx-modal">
        <button class="slx-modal__backdrop" type="button" aria-label="Zatvori" @click="closeModal"></button>

        <section class="slx-popup">
          <header class="slx-popup__head">
            <div>
              <span>{{ modalEyebrow }}</span>
              <h2>{{ modalTitle }}</h2>
            </div>

            <button type="button" aria-label="Zatvori" @click="closeModal">
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

          <template v-if="activeModal === 'service'">
            <section class="slx-popup-section">
              <div class="slx-popup-label">
                <span>01</span>
                <p>Podaci o usluzi</p>
              </div>

              <div class="slx-form">
                <label>
                  Naziv usluge
                  <input v-model="serviceForm.name" type="text" placeholder="Fade + brada" />
                </label>

                <div class="slx-form-grid">
                  <label>
                    Trajanje
                    <input v-model="serviceForm.duration" type="text" placeholder="45min" />
                  </label>

                  <label>
                    Cena
                    <input v-model="serviceForm.price" type="text" placeholder="2.400 RSD" />
                  </label>
                </div>

                <label>
                  Kategorija
                  <input v-model="serviceForm.category" type="text" placeholder="Haircut" />
                </label>
              </div>
            </section>

            <button class="slx-submit" type="button" @click="closeModal">
              Sačuvaj uslugu
            </button>
          </template>

          <template v-if="activeModal === 'barber'">
            <section class="slx-popup-section">
              <div class="slx-popup-label">
                <span>01</span>
                <p>Podaci o barberu</p>
              </div>

              <div class="slx-form">
                <label>
                  Ime
                  <input v-model="barberForm.name" type="text" placeholder="Stefan" />
                </label>

                <label>
                  Uloga
                  <input v-model="barberForm.role" type="text" placeholder="Senior barber" />
                </label>

                <label>
                  Slika
                  <input v-model="barberForm.image" type="text" placeholder="https://..." />
                </label>
              </div>
            </section>

            <section class="slx-popup-section">
              <div class="slx-popup-label">
                <span>02</span>
                <p>Usluge koje radi</p>
              </div>

              <div class="slx-chip-grid">
                <button
                  v-for="service in services"
                  :key="service.id"
                  type="button"
                  :class="{ 'is-selected': barberForm.services.includes(service.id) }"
                  @click="toggleBarberService(service.id)"
                >
                  {{ service.name }}
                </button>
              </div>
            </section>

            <button class="slx-submit" type="button" @click="closeModal">
              Dodaj barbera
            </button>
          </template>

          <template v-if="activeModal === 'hours'">
            <section class="slx-popup-section">
              <div class="slx-popup-label">
                <span>01</span>
                <p>Radno vreme lokala</p>
              </div>

              <div class="slx-edit-hours">
                <article
                  v-for="day in workingHours"
                  :key="day.id"
                >
                  <div>
                    <strong>{{ day.label }}</strong>
                    <span>{{ day.open ? 'Otvoreno' : 'Zatvoreno' }}</span>
                  </div>

                  <input v-model="day.from" type="time" :disabled="!day.open" />
                  <input v-model="day.to" type="time" :disabled="!day.open" />

                  <button
                    type="button"
                    :class="{ 'is-off': !day.open }"
                    @click="day.open = !day.open"
                  >
                    {{ day.open ? 'ON' : 'OFF' }}
                  </button>
                </article>
              </div>
            </section>

            <button class="slx-submit" type="button" @click="closeModal">
              Sačuvaj radno vreme
            </button>
          </template>

          <template v-if="activeModal === 'break'">
            <section class="slx-popup-section">
              <div class="slx-popup-label">
                <span>01</span>
                <p>Nova pauza</p>
              </div>

              <div class="slx-form">
                <label>
                  Naziv pauze
                  <input v-model="breakForm.title" type="text" placeholder="Pauza za ručak" />
                </label>

                <label>
                  Dan
                  <select v-model="breakForm.day">
                    <option value="Danas">Danas</option>
                    <option value="Ponedeljak">Ponedeljak</option>
                    <option value="Utorak">Utorak</option>
                    <option value="Sreda">Sreda</option>
                    <option value="Četvrtak">Četvrtak</option>
                    <option value="Petak">Petak</option>
                    <option value="Subota">Subota</option>
                  </select>
                </label>

                <div class="slx-form-grid">
                  <label>
                    Od
                    <input v-model="breakForm.from" type="time" />
                  </label>

                  <label>
                    Do
                    <input v-model="breakForm.to" type="time" />
                  </label>
                </div>
              </div>
            </section>

            <section class="slx-popup-section">
              <div class="slx-popup-label">
                <span>02</span>
                <p>Tip pauze</p>
              </div>

              <div class="slx-chip-grid">
                <button
                  type="button"
                  :class="{ 'is-selected': breakForm.type === 'Jednokratna' }"
                  @click="breakForm.type = 'Jednokratna'"
                >
                  Jednokratna
                </button>

                <button
                  type="button"
                  :class="{ 'is-selected': breakForm.type === 'Ponavljajuća' }"
                  @click="breakForm.type = 'Ponavljajuća'"
                >
                  Ponavljajuća
                </button>
              </div>
            </section>

            <button class="slx-submit" type="button" @click="closeModal">
              Dodaj pauzu
            </button>
          </template>

          <template v-if="activeModal === 'barberHours'">
            <section class="slx-selected-barber">
              <img :src="selectedBarber?.image" :alt="selectedBarber?.name" />

              <div>
                <strong>{{ selectedBarber?.name }}</strong>
                <span>{{ selectedBarber?.role }}</span>
              </div>
            </section>

            <section class="slx-popup-section">
              <div class="slx-popup-label">
                <span>01</span>
                <p>Radno vreme barbera</p>
              </div>

              <div class="slx-edit-hours">
                <article
                  v-for="day in barberHours"
                  :key="day.id"
                >
                  <div>
                    <strong>{{ day.label }}</strong>
                    <span>{{ day.open ? 'Radi' : 'Slobodan' }}</span>
                  </div>

                  <input v-model="day.from" type="time" :disabled="!day.open" />
                  <input v-model="day.to" type="time" :disabled="!day.open" />

                  <button
                    type="button"
                    :class="{ 'is-off': !day.open }"
                    @click="day.open = !day.open"
                  >
                    {{ day.open ? 'ON' : 'OFF' }}
                  </button>
                </article>
              </div>
            </section>

            <button class="slx-submit" type="button" @click="closeModal">
              Sačuvaj vreme barbera
            </button>
          </template>
        </section>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import stefanLogo from '@/assets/img/stefan-logo2.png';


type ModalType = 'service' | 'barber' | 'hours' | 'break' | 'barberHours' | null

type Service = {
  id: number
  name: string
  duration: string
  price: string
  category: string
  active: boolean
}

type Barber = {
  id: number
  name: string
  role: string
  image: string
  active: boolean
  services: number
  hours: string
}

const activeModal = ref<ModalType>(null)
const selectedService = ref<Service | null>(null)
const selectedBarber = ref<Barber | null>(null)

const services = ref<Service[]>([
  {
    id: 1,
    name: 'Fade + brada',
    duration: '45min',
    price: '2.400',
    category: 'Haircut',
    active: true,
  },
  {
    id: 2,
    name: 'Šišanje',
    duration: '30min',
    price: '1.500',
    category: 'Haircut',
    active: true,
  },
  {
    id: 3,
    name: 'Premium tretman',
    duration: '60min',
    price: '3.200',
    category: 'Premium',
    active: true,
  },
  {
    id: 4,
    name: 'Brada + konture',
    duration: '30min',
    price: '1.800',
    category: 'Beard',
    active: false,
  },
])

const barbers = ref<Barber[]>([
  {
    id: 1,
    name: 'Stefan',
    role: 'Senior barber',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=160&q=80',
    active: true,
    services: 8,
    hours: '09—17',
  },
  {
    id: 2,
    name: 'Aleksa',
    role: 'Fade specialist',
    image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=160&q=80',
    active: true,
    services: 6,
    hours: '12—20',
  },
  {
    id: 3,
    name: 'Milan',
    role: 'Barber',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=160&q=80',
    active: false,
    services: 5,
    hours: 'Off',
  },
])

const workingHours = ref([
  { id: 1, label: 'Ponedeljak', from: '09:00', to: '20:00', open: true },
  { id: 2, label: 'Utorak', from: '09:00', to: '20:00', open: true },
  { id: 3, label: 'Sreda', from: '09:00', to: '20:00', open: true },
  { id: 4, label: 'Četvrtak', from: '09:00', to: '20:00', open: true },
  { id: 5, label: 'Petak', from: '09:00', to: '20:00', open: true },
  { id: 6, label: 'Subota', from: '10:00', to: '18:00', open: true },
  { id: 7, label: 'Nedelja', from: '00:00', to: '00:00', open: false },
])

const barberHours = ref([
  { id: 1, label: 'Ponedeljak', from: '09:00', to: '17:00', open: true },
  { id: 2, label: 'Utorak', from: '09:00', to: '17:00', open: true },
  { id: 3, label: 'Sreda', from: '12:00', to: '20:00', open: true },
  { id: 4, label: 'Četvrtak', from: '12:00', to: '20:00', open: true },
  { id: 5, label: 'Petak', from: '09:00', to: '17:00', open: true },
  { id: 6, label: 'Subota', from: '10:00', to: '16:00', open: true },
  { id: 7, label: 'Nedelja', from: '00:00', to: '00:00', open: false },
])

const breaks = ref([
  {
    id: 1,
    title: 'Pauza za ručak',
    day: 'Danas',
    from: '14:00',
    to: '14:30',
    type: 'Jednokratna',
  },
  {
    id: 2,
    title: 'Jutarnja pauza',
    day: 'Ponedeljak',
    from: '09:00',
    to: '10:00',
    type: 'Ponavljajuća',
  },
])

const serviceForm = reactive({
  name: 'Fade + brada',
  duration: '45min',
  price: '2.400 RSD',
  category: 'Haircut',
})

const barberForm = reactive({
  name: '',
  role: '',
  image: '',
  services: [1, 2],
})

const breakForm = reactive({
  title: '',
  day: 'Danas',
  from: '14:00',
  to: '14:30',
  type: 'Jednokratna',
})

const modalTitle = computed(() => {
  if (activeModal.value === 'service') return selectedService.value ? 'Izmeni uslugu' : 'Dodaj uslugu'
  if (activeModal.value === 'barber') return 'Dodaj barbera'
  if (activeModal.value === 'hours') return 'Radno vreme'
  if (activeModal.value === 'break') return 'Dodaj pauzu'
  if (activeModal.value === 'barberHours') return 'Radno vreme'
  return ''
})

const modalEyebrow = computed(() => {
  if (activeModal.value === 'service') return 'Cenovnik'
  if (activeModal.value === 'barber') return 'Novi član tima'
  if (activeModal.value === 'hours') return 'Lokal'
  if (activeModal.value === 'break') return 'Pauza'
  if (activeModal.value === 'barberHours') return 'Barber'
  return ''
})

const toggleBarberService = (serviceId: number) => {
  if (barberForm.services.includes(serviceId)) {
    barberForm.services = barberForm.services.filter((id) => id !== serviceId)
    return
  }

  barberForm.services.push(serviceId)
}

const closeModal = () => {
  activeModal.value = null
  selectedService.value = null
  selectedBarber.value = null
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.slx-shell {
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

.slx-phone {
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

.slx-nav {
  height: 40px;
  display: grid;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.slx-nav p {
  margin: 0;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
}

.slx-nav-spacer {
  width: 40px;
  height: 40px;
  display: block;
}

.slx-icon-btn {
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

.slx-icon-btn svg {
  width: 20px;
  height: 20px;
}

.slx-hero {
  min-height: 212px;
  border-radius: 30px;
  padding: 22px 18px 16px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.052), rgba(255, 255, 255, 0.022)),
    #131313;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.slx-hero > span {
  color: #d6b17a;
  font-size: 10px;
  font-weight: 850;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.slx-hero h1 {
  margin: 24px 0 0;
  color: #ffffff;
  font-size: 38px;
  line-height: 0.9;
  letter-spacing: -0.045em;
  font-weight: 520;
}

.slx-hero > p {
  margin: 14px 0 22px;
  max-width: 282px;
  color: rgba(255, 255, 255, 0.42);
  font-size: 11px;
  line-height: 1.45;
  font-weight: 650;
}

.slx-hero__footer {
  margin-top: auto;
  min-height: 66px;
  border-radius: 22px;
  background:
    radial-gradient(circle at 15% 25%, rgba(255, 255, 255, 0.18), transparent 40%),
    linear-gradient(135deg, #d6b17a 0%, #b98a55 100%);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  overflow: hidden;
}

.slx-hero__footer article {
  display: grid;
  place-items: center;
  align-content: center;
  text-align: center;
  position: relative;
}

.slx-hero__footer article + article::before {
  content: "";
  position: absolute;
  left: 0;
  top: 16px;
  bottom: 16px;
  width: 1px;
  background: rgba(22, 17, 11, 0.18);
}

.slx-hero__footer strong {
  font-size: 19px;
  line-height: 0.9;
  letter-spacing: -0.055em;
  font-weight: 650;
  color: #16110b;
}

.slx-hero__footer span {
  margin-top: 7px;
  font-size: 8px;
  font-weight: 850;
  color: rgba(22, 17, 11, 0.62);
}

.slx-quick-pills {
  margin-top: 14px;
  display: grid;
  gap: 8px;
}

.slx-quick-pills button {
  width: 100%;
  min-height: 50px;
  border: 0;
  border-radius: 999px;
  background: #131313;
  color: #ffffff;
  padding: 0 13px 0 8px;
  display: flex;
  align-items: center;
  gap: 11px;
  font-size: 12px;
  font-weight: 850;
  letter-spacing: -0.01em;
  text-align: left;
}

.slx-quick-pills span {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
}

.slx-quick-pills svg {
  width: 17px;
  height: 17px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.slx-quick-pills .is-service span {
  background: rgba(214, 177, 122, 0.16);
  color: #d6b17a;
}

.slx-quick-pills .is-break span {
  background: rgba(134, 173, 210, 0.16);
  color: #86add2;
}

.slx-quick-pills .is-barber span {
  background: rgba(198, 126, 103, 0.16);
  color: #c67e67;
}

.slx-services,
.slx-barbers,
.slx-hours,
.slx-breaks {
  margin-top: 14px;
  border-radius: 26px;
  background: #131313;
  padding: 18px 15px 14px;
  overflow: hidden;
}

.slx-section-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 12px;
}

.slx-section-head span {
  display: block;
  margin-bottom: 7px;
  font-size: 9px;
  font-weight: 850;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  color: #d6b17a;
}

.slx-section-head h2 {
  margin: 0;
  font-size: 26px;
  line-height: 0.94;
  letter-spacing: -0.065em;
  font-weight: 560;
  color: #ffffff;
}

.slx-section-head button {
  height: 33px;
  border: 0;
  border-radius: 999px;
  background: rgba(214, 177, 122, 0.13);
  color: #d6b17a;
  padding: 0 13px;
  font-size: 9px;
  font-weight: 900;
}

.slx-service,
.slx-break {
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 13px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  cursor: pointer;
}

.slx-service:last-child,
.slx-break:last-child {
  border-bottom: 0;
}

.slx-service h3,
.slx-break h3 {
  margin: 0;
  font-size: 15px;
  line-height: 1.05;
  letter-spacing: -0.035em;
  font-weight: 740;
  color: #ffffff;
}

.slx-service p,
.slx-break p {
  margin: 7px 0 0;
  font-size: 10px;
  font-weight: 680;
  color: rgba(255, 255, 255, 0.42);
}

.slx-service__meta {
  text-align: right;
  flex: 0 0 auto;
}

.slx-service__meta strong {
  display: block;
  font-size: 12px;
  font-weight: 900;
  color: #d6b17a;
}

.slx-service__meta span,
.slx-break > span,
.slx-barber__top > span {
  display: inline-flex;
  margin-top: 8px;
  height: 23px;
  align-items: center;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.055);
  color: rgba(255, 255, 255, 0.45);
  padding: 0 9px;
  font-size: 8px;
  font-weight: 900;
  white-space: nowrap;
}

.slx-service__meta span.is-live,
.slx-barber__top > span.is-live {
  background: rgba(214, 177, 122, 0.13);
  color: #d6b17a;
}

.slx-barber-list {
  display: grid;
  gap: 10px;
}

.slx-barber {
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.045);
  padding: 13px;
}

.slx-barber__top {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) auto;
  gap: 11px;
  align-items: center;
}

.slx-barber__top img {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  object-fit: cover;
}

.slx-barber__top h3 {
  margin: 0;
  font-size: 16px;
  letter-spacing: -0.04em;
  color: #ffffff;
}

.slx-barber__top p {
  margin: 6px 0 0;
  font-size: 9px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.4);
}

.slx-barber__info {
  margin-top: 13px;
  min-height: 58px;
  border-radius: 18px;
  background: rgba(0, 0, 0, 0.16);
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
}

.slx-barber__info article {
  display: grid;
  place-items: center;
  align-content: center;
  position: relative;
}

.slx-barber__info article + article::before {
  content: "";
  position: absolute;
  left: 0;
  top: 14px;
  bottom: 14px;
  width: 1px;
  background: rgba(255, 255, 255, 0.07);
}

.slx-barber__info strong {
  font-size: 16px;
  color: #ffffff;
}

.slx-barber__info span {
  margin-top: 6px;
  font-size: 8px;
  color: rgba(255, 255, 255, 0.36);
  font-weight: 800;
}

.slx-barber > button {
  width: 100%;
  height: 36px;
  border: 0;
  border-radius: 999px;
  background: rgba(214, 177, 122, 0.12);
  color: #d6b17a;
  margin-top: 10px;
  font-size: 10px;
  font-weight: 900;
}

.slx-hours__list {
  display: grid;
}

.slx-hours__list article {
  min-height: 52px;
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.slx-hours__list article:last-child {
  border-bottom: 0;
}

.slx-hours__list span {
  font-size: 12px;
  font-weight: 760;
  color: #ffffff;
}

.slx-hours__list strong {
  font-size: 11px;
  font-weight: 850;
  color: #d6b17a;
}

.slx-hours__list article.is-closed {
  opacity: 0.45;
}

.slx-break > span {
  margin-top: 0;
  color: #d6b17a;
  background: rgba(214, 177, 122, 0.12);
}

.slx-bottom {
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

.slx-bottom button {
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

.slx-bottom button.is-current {
  color: #d6b17a;
  background: rgba(214, 177, 122, 0.08);
}

.slx-bottom svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.slx-modal {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.slx-modal__backdrop {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgba(0, 0, 0, 0.58);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.slx-popup {
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

.slx-popup__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 20px;
}

.slx-popup__head span {
  display: block;
  margin-bottom: 7px;
  font-size: 10px;
  font-weight: 850;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  color: #d6b17a;
}

.slx-popup__head h2 {
  margin: 0;
  max-width: 260px;
  font-size: 34px;
  line-height: 0.92;
  letter-spacing: -0.075em;
  font-weight: 560;
  color: #ffffff;
}

.slx-popup__head button {
  width: 42px;
  height: 42px;
  border: 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.055);
  color: #ffffff;
  display: grid;
  place-items: center;
  padding: 0;
  flex: 0 0 auto;
}

.slx-popup__head svg {
  width: 18px;
  height: 18px;
}

.slx-popup-section {
  padding: 18px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.075);
}

.slx-popup-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.slx-popup-label span {
  font-size: 9px;
  font-weight: 900;
  color: #d6b17a;
}

.slx-popup-label p {
  margin: 0;
  font-size: 11px;
  font-weight: 850;
  color: rgba(255, 255, 255, 0.56);
}

.slx-form {
  display: grid;
  gap: 10px;
}

.slx-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.slx-form label {
  display: grid;
  gap: 8px;
  font-size: 10px;
  font-weight: 850;
  color: rgba(255, 255, 255, 0.54);
}

.slx-form input,
.slx-form select {
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
}

.slx-form input::placeholder {
  color: rgba(255, 255, 255, 0.28);
}

.slx-form select {
  appearance: none;
}

.slx-chip-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.slx-chip-grid button {
  min-height: 38px;
  border: 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.055);
  color: rgba(255, 255, 255, 0.62);
  padding: 0 13px;
  font-size: 10px;
  font-weight: 850;
}

.slx-chip-grid button.is-selected {
  background: #d6b17a;
  color: #16110b;
}

.slx-edit-hours {
  display: grid;
  gap: 8px;
}

.slx-edit-hours article {
  min-height: 64px;
  border-radius: 19px;
  background: rgba(255, 255, 255, 0.045);
  padding: 10px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 72px 72px 43px;
  align-items: center;
  gap: 7px;
}

.slx-edit-hours strong {
  display: block;
  font-size: 11px;
  color: #ffffff;
}

.slx-edit-hours span {
  display: block;
  margin-top: 5px;
  font-size: 8px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.36);
}

.slx-edit-hours input {
  width: 100%;
  height: 38px;
  border: 0;
  outline: 0;
  border-radius: 13px;
  background: rgba(0, 0, 0, 0.18);
  color: #ffffff;
  padding: 0 6px;
  font-size: 10px;
  font-weight: 800;
}

.slx-edit-hours button {
  height: 38px;
  border: 0;
  border-radius: 13px;
  background: #d6b17a;
  color: #16110b;
  font-size: 8px;
  font-weight: 950;
}

.slx-edit-hours button.is-off {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.5);
}

.slx-selected-barber {
  min-height: 76px;
  border-radius: 22px;
  background:
    radial-gradient(circle at 16% 22%, rgba(255, 255, 255, 0.18), transparent 40%),
    linear-gradient(135deg, #d6b17a 0%, #b98a55 100%);
  padding: 14px;
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

.slx-selected-barber img {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  object-fit: cover;
}

.slx-selected-barber strong {
  display: block;
  color: #16110b;
  font-size: 14px;
  font-weight: 900;
}

.slx-selected-barber span {
  display: block;
  margin-top: 5px;
  color: rgba(22, 17, 11, 0.68);
  font-size: 9px;
  font-weight: 760;
}

.slx-submit {
  width: 100%;
  height: 52px;
  border: 0;
  border-radius: 999px;
  background: #d6b17a;
  color: #16110b;
  font-size: 12px;
  font-weight: 950;
  margin-top: 8px;
}

@media (min-width: 431px) {
  .slx-shell {
    padding: 20px 0;
  }

  .slx-phone {
    min-height: 932px;
    border-radius: 36px;
  }

  .slx-popup {
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