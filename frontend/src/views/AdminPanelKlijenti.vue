<template>
  <main class="clx-shell">
    <section class="clx-phone">
      <nav class="clx-nav">
        <div class="mxp-brand">
    <div class="mxp-brand__mark">
      <img :src="stefanLogo" alt="">
    </div>

    <!-- <div>
      <strong>Stefan Studio</strong>
      <small>Barber admin</small>
    </div> -->
  </div>

        <button class="clx-add-btn" type="button" aria-label="Dodaj klijenta" @click="isClientOpen = true">
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

      <section class="clx-hero">
        <div class="clx-hero__top">
          <span>Baza klijenata</span>

          <div class="clx-hero__badge">
            <strong>+38</strong>
            <small>novih</small>
          </div>
        </div>

        <h1>Klijenti</h1>

        <p>
          Pregled stalnih klijenata, poslednjih dolazaka i omiljenih usluga.
        </p>

        <div class="clx-hero__footer">
          <article>
            <strong>248</strong>
            <span>ukupno</span>
          </article>

          <article>
            <strong>71%</strong>
            <span>povratak</span>
          </article>

          <article>
            <strong>4.8</strong>
            <span>ocena</span>
          </article>
        </div>
      </section>

      <section class="clx-search">
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
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.197 5.197a7.5 7.5 0 0 0 10.606 10.606Z"
          />
        </svg>

        <input v-model="searchQuery" type="text" placeholder="Pretraži klijente" />
      </section>

      <section class="clx-filters">
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

      <section class="clx-featured">
        <div class="clx-featured__head">
          <span>Najverniji klijent</span>
          <p>ovog meseca</p>
        </div>

        <div class="clx-featured__body">
          <img :src="topClient.image" :alt="topClient.name" />

          <div>
            <h2>{{ topClient.name }}</h2>
            <p>{{ topClient.visits }} poseta · {{ topClient.favorite }}</p>
          </div>

          <strong>{{ topClient.spent }}</strong>
        </div>
      </section>

      <section class="clx-list">
        <div class="clx-list__head">
          <span>Lista klijenata</span>
          <p>{{ filteredClients.length }} prikazano</p>
        </div>

        <article
          v-for="client in filteredClients"
          :key="client.id"
          class="clx-client"
          @click="selectedClient = client"
        >
          <img :src="client.image" :alt="client.name" />

          <div class="clx-client__main">
            <div>
              <h3>{{ client.name }}</h3>
              <p>{{ client.lastVisit }}</p>
            </div>

            <span>{{ client.favorite }}</span>
          </div>

          <div class="clx-client__meta">
            <strong>{{ client.visits }}</strong>
            <span>poseta</span>
          </div>
        </article>

        <article v-if="!filteredClients.length" class="clx-empty">
          <h3>Nema rezultata</h3>
          <p>Promeni filter ili pretragu za prikaz klijenata.</p>
        </article>
      </section>

      <section class="clx-quick">
        <article>
          <span>Najčešća usluga</span>
          <strong>Fade + brada</strong>
          <p>42 zakazivanja u poslednjih 30 dana</p>
        </article>

        <article>
          <span>Neaktivni</span>
          <strong>18</strong>
          <p>klijenata bez termina 60+ dana</p>
        </article>
      </section>

      <footer class="clx-bottom">
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

        <button class="is-current" type="button" aria-label="Klijenti">
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

      <div v-if="selectedClient" class="clx-modal">
        <button class="clx-modal__backdrop" type="button" aria-label="Zatvori" @click="selectedClient = null"></button>

        <section class="clx-popup">
          <header class="clx-popup__head">
            <div>
              <span>Detalji klijenta</span>
              <h2>{{ selectedClient.name }}</h2>
            </div>

            <button type="button" aria-label="Zatvori" @click="selectedClient = null">
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

          <div class="clx-profile-card">
            <img :src="selectedClient.image" :alt="selectedClient.name" />

            <div>
              <strong>{{ selectedClient.phone }}</strong>
              <span>{{ selectedClient.note }}</span>
            </div>
          </div>

          <section class="clx-popup-stats">
            <article>
              <strong>{{ selectedClient.visits }}</strong>
              <span>poseta</span>
            </article>

            <article>
              <strong>{{ selectedClient.spent }}</strong>
              <span>potrošeno</span>
            </article>

            <article>
              <strong>{{ selectedClient.rating }}</strong>
              <span>ocena</span>
            </article>
          </section>

          <section class="clx-popup-section">
            <div class="clx-popup-label">
              <span>01</span>
              <p>Omiljena usluga</p>
            </div>

            <article class="clx-service-card">
              <div>
                <h3>{{ selectedClient.favorite }}</h3>
                <p>Najčešće zakazuje ovu uslugu</p>
              </div>

              <strong>{{ selectedClient.averagePrice }}</strong>
            </article>
          </section>

          <section class="clx-popup-section">
            <div class="clx-popup-label">
              <span>02</span>
              <p>Istorija</p>
            </div>

            <div class="clx-history">
              <article v-for="visit in selectedClient.history" :key="visit.id">
                <div>
                  <strong>{{ visit.date }}</strong>
                  <span>{{ visit.service }}</span>
                </div>

                <p>{{ visit.price }}</p>
              </article>
            </div>
          </section>

          <div class="clx-popup-actions">
            <button type="button">
              Pozovi
            </button>

            <button type="button">
              Poruka
            </button>
          </div>
        </section>
      </div>

      <div v-if="isClientOpen" class="clx-modal">
        <button class="clx-modal__backdrop" type="button" aria-label="Zatvori" @click="isClientOpen = false"></button>

        <section class="clx-popup">
          <header class="clx-popup__head">
            <div>
              <span>Novi klijent</span>
              <h2>Dodaj klijenta</h2>
            </div>

            <button type="button" aria-label="Zatvori" @click="isClientOpen = false">
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

          <section class="clx-popup-section">
            <div class="clx-popup-label">
              <span>01</span>
              <p>Podaci</p>
            </div>

            <div class="clx-form">
              <label>
                Ime i prezime
                <input v-model="newClient.name" type="text" placeholder="Marko Petrović" />
              </label>

              <label>
                Telefon
                <input v-model="newClient.phone" type="text" placeholder="+381 60 123 4567" />
              </label>

              <label>
                Napomena
                <textarea v-model="newClient.note" placeholder="Npr. voli kraći fade, dolazi uglavnom petkom"></textarea>
              </label>
            </div>
          </section>

          <button class="clx-submit" type="button" @click="isClientOpen = false">
            Sačuvaj klijenta
          </button>
        </section>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import stefanLogo from '@/assets/img/stefan-logo2.png';


type ClientType = 'all' | 'vip' | 'new' | 'inactive'

type Client = {
  id: number
  name: string
  phone: string
  image: string
  visits: number
  spent: string
  rating: string
  favorite: string
  averagePrice: string
  lastVisit: string
  note: string
  type: Exclude<ClientType, 'all'>
  history: {
    id: number
    date: string
    service: string
    price: string
  }[]
}

const selectedFilter = ref<ClientType>('all')
const searchQuery = ref('')
const selectedClient = ref<Client | null>(null)
const isClientOpen = ref(false)

const newClient = reactive({
  name: '',
  phone: '',
  note: '',
})

const filters = [
  { id: 'all', label: 'Svi' },
  { id: 'vip', label: 'VIP' },
  { id: 'new', label: 'Novi' },
  { id: 'inactive', label: 'Neaktivni' },
] as const

const clients: Client[] = [
  {
    id: 1,
    name: 'Marko Petrović',
    phone: '+381 60 123 4567',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=140&q=80',
    visits: 24,
    spent: '48.200',
    rating: '5.0',
    favorite: 'Fade + brada',
    averagePrice: '2.400 RSD',
    lastVisit: 'Poslednji termin · danas',
    note: 'Voli čist fade i kraću bradu.',
    type: 'vip',
    history: [
      { id: 1, date: '12 Jun', service: 'Fade + brada', price: '2.400' },
      { id: 2, date: '29 Maj', service: 'Šišanje', price: '1.500' },
      { id: 3, date: '14 Maj', service: 'Brada + konture', price: '1.800' },
    ],
  },
  {
    id: 2,
    name: 'Nikola Jović',
    phone: '+381 64 555 0198',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=140&q=80',
    visits: 12,
    spent: '22.500',
    rating: '4.9',
    favorite: 'Šišanje',
    averagePrice: '1.500 RSD',
    lastVisit: 'Poslednji termin · danas',
    note: 'Uvek bira jutarnje termine.',
    type: 'vip',
    history: [
      { id: 1, date: '12 Jun', service: 'Šišanje', price: '1.500' },
      { id: 2, date: '22 Maj', service: 'Šišanje', price: '1.500' },
    ],
  },
  {
    id: 3,
    name: 'Luka Ilić',
    phone: '+381 63 211 8821',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=140&q=80',
    visits: 5,
    spent: '13.400',
    rating: '4.8',
    favorite: 'Premium tretman',
    averagePrice: '3.200 RSD',
    lastVisit: 'Poslednji termin · pre 3 dana',
    note: 'Preferira Aleksu kao barbera.',
    type: 'new',
    history: [
      { id: 1, date: '09 Jun', service: 'Premium tretman', price: '3.200' },
      { id: 2, date: '01 Jun', service: 'Fade cut', price: '2.000' },
    ],
  },
  {
    id: 4,
    name: 'Stefan Milić',
    phone: '+381 65 900 7766',
    image: 'https://images.unsplash.com/photo-1530268729831-4b0b9e170218?auto=format&fit=crop&w=140&q=80',
    visits: 9,
    spent: '17.800',
    rating: '4.7',
    favorite: 'Brada + konture',
    averagePrice: '1.800 RSD',
    lastVisit: 'Poslednji termin · danas',
    note: 'Dolazi posle posla, uglavnom 17h+.',
    type: 'vip',
    history: [
      { id: 1, date: '12 Jun', service: 'Brada + konture', price: '1.800' },
      { id: 2, date: '18 Maj', service: 'Fade + brada', price: '2.400' },
    ],
  },
  {
    id: 5,
    name: 'Vuk Stanić',
    phone: '+381 61 342 8810',
    image: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=140&q=80',
    visits: 2,
    spent: '4.000',
    rating: '4.6',
    favorite: 'Fade cut',
    averagePrice: '2.000 RSD',
    lastVisit: 'Poslednji termin · pre 18 dana',
    note: 'Novi klijent iz Instagrama.',
    type: 'new',
    history: [
      { id: 1, date: '25 Maj', service: 'Fade cut', price: '2.000' },
      { id: 2, date: '11 Maj', service: 'Fade cut', price: '2.000' },
    ],
  },
  {
    id: 6,
    name: 'Milan Kostić',
    phone: '+381 69 480 3311',
    image: 'https://images.unsplash.com/photo-1590086782792-42dd2350140d?auto=format&fit=crop&w=140&q=80',
    visits: 7,
    spent: '10.500',
    rating: '4.8',
    favorite: 'Šišanje',
    averagePrice: '1.500 RSD',
    lastVisit: 'Poslednji termin · pre 72 dana',
    note: 'Dugo nije zakazao termin.',
    type: 'inactive',
    history: [
      { id: 1, date: '01 Apr', service: 'Šišanje', price: '1.500' },
      { id: 2, date: '19 Mar', service: 'Šišanje', price: '1.500' },
    ],
  },
]

const topClient = computed(() => clients[0])

const filteredClients = computed(() => {
  const normalizedQuery = searchQuery.value.trim().toLowerCase()

  return clients.filter((client) => {
    const matchesFilter = selectedFilter.value === 'all' || client.type === selectedFilter.value
    const matchesSearch =
      !normalizedQuery ||
      client.name.toLowerCase().includes(normalizedQuery) ||
      client.phone.toLowerCase().includes(normalizedQuery) ||
      client.favorite.toLowerCase().includes(normalizedQuery)

    return matchesFilter && matchesSearch
  })
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.clx-shell {
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

.clx-phone {
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

.clx-nav {
  height: 40px;
  display: grid;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.clx-nav p {
  margin: 0;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
}

.clx-icon-btn,
.clx-add-btn {
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

.clx-add-btn {
  justify-self: end;
  background: #d6b17a;
  color: #16110b;
  border: 0;
}

.clx-icon-btn svg,
.clx-add-btn svg {
  width: 20px;
  height: 20px;
}

.clx-hero {
  min-height: 214px;
  border-radius: 30px;
  padding: 20px 18px 16px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.052), rgba(255, 255, 255, 0.022)),
    #131313;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.clx-hero__top {
  display: flex;
  justify-content: space-between;
  /* align-items: flex-start; */
  align-items: center;
  gap: 16px;
}

.clx-hero__top > span {
  display: block;
  color: #d6b17a;
  font-size: 10px;
  font-weight: 850;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.clx-hero__badge {
  /* min-width: 80px; */
  /* height: 42px; */
  border-radius: 999px;
  background: rgba(214, 177, 122, 0.13);
  padding: 5px 8px;
  display: flex;
  gap: 5px;
  place-items: center;
  align-content: center;
  text-align: center;
  align-items: center;
}

.clx-hero__badge strong {
  display: block;
  font-size: 14px;
  line-height: 1;
  letter-spacing: -0.035em;
  font-weight: 750;
  color: #d6b17a;
}

.clx-hero__badge small {
  display: block;
  margin-top: 3px;
  font-size: 12px;
  line-height: 1;
  font-weight: 750;
  color: rgba(214, 177, 122, 0.62);
}

.clx-hero {
  min-height: 214px;
  border-radius: 30px;
  padding: 20px 18px 18px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.052), rgba(255, 255, 255, 0.022)),
    #131313;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.clx-hero h1 {
  margin: 22px 0 0;
  color: #ffffff;
  font-size: 38px;
  line-height: 0.9;
  letter-spacing: -0.045em;
  font-weight: 520;
}

.clx-hero > p {
  margin: 13px 0 22px;
  max-width: 285px;
  color: rgba(255, 255, 255, 0.42);
  font-size: 11px;
  line-height: 1.45;
  font-weight: 650;
}

.clx-hero__footer {
  margin-top: 0;
  min-height: 66px;
  border-radius: 22px;
  background:
    radial-gradient(circle at 15% 25%, rgba(255, 255, 255, 0.18), transparent 40%),
    linear-gradient(135deg, #d6b17a 0%, #b98a55 100%);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  overflow: hidden;
}

.clx-hero__footer article {
  display: grid;
  place-items: center;
  align-content: center;
  text-align: center;
  position: relative;
}

.clx-hero__footer article + article::before {
  content: "";
  position: absolute;
  left: 0;
  top: 16px;
  bottom: 16px;
  width: 1px;
  background: rgba(22, 17, 11, 0.18);
}

.clx-hero__footer strong {
  display: block;
  font-size: 20px;
  line-height: 0.9;
  letter-spacing: -0.055em;
  font-weight: 650;
  color: #16110b;
}

.clx-hero__footer span {
  display: block;
  margin-top: 7px;
  font-size: 8px;
  font-weight: 850;
  color: rgba(22, 17, 11, 0.62);
}

.clx-search {
  margin-top: 14px;
  height: 52px;
  border-radius: 999px;
  background: #131313;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 15px;
}

.clx-search svg {
  width: 17px;
  height: 17px;
  color: #d6b17a;
  flex: 0 0 auto;
}

.clx-search input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
}

.clx-search input::placeholder {
  color: rgba(255, 255, 255, 0.35);
}

.clx-filters {
  margin-top: 14px;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 2px;
  scrollbar-width: none;
}

.clx-filters::-webkit-scrollbar {
  display: none;
}

.clx-filters button {
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

.clx-filters button.is-selected {
  background: rgba(214, 177, 122, 0.14);
  color: #d6b17a;
}

.clx-featured {
  margin-top: 14px;
  border-radius: 26px;
  background: #131313;
  padding: 17px 15px;
}

.clx-featured__head {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: center;
  margin-bottom: 16px;
}

.clx-featured__head span {
  font-size: 9px;
  font-weight: 850;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  color: #d6b17a;
}

.clx-featured__head p {
  margin: 0;
  font-size: 9px;
  font-weight: 760;
  color: rgba(255, 255, 255, 0.38);
}

.clx-featured__body {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
}

.clx-featured__body img {
  width: 52px;
  height: 52px;
  border-radius: 999px;
  object-fit: cover;
}

.clx-featured__body h2 {
  margin: 0;
  font-size: 17px;
  line-height: 1;
  letter-spacing: -0.045em;
  font-weight: 780;
  color: #ffffff;
}

.clx-featured__body p {
  margin: 7px 0 0;
  font-size: 10px;
  font-weight: 680;
  color: rgba(255, 255, 255, 0.42);
}

.clx-featured__body > strong {
  font-size: 12px;
  font-weight: 900;
  color: #d6b17a;
}

.clx-list {
  margin-top: 14px;
  border-radius: 26px;
  background: #131313;
  padding: 18px 15px 14px;
  overflow: hidden;
}

.clx-list__head {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: center;
  margin-bottom: 6px;
}

.clx-list__head span {
  font-size: 9px;
  font-weight: 850;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  color: #d6b17a;
}

.clx-list__head p {
  margin: 0;
  font-size: 9px;
  font-weight: 760;
  color: rgba(255, 255, 255, 0.38);
}

.clx-client {
  display: grid;
  grid-template-columns: 46px minmax(0, 1fr) 44px;
  align-items: center;
  gap: 11px;
  padding: 14px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  cursor: pointer;
}

.clx-client:last-child {
  border-bottom: 0;
}

.clx-client img {
  width: 46px;
  height: 46px;
  border-radius: 999px;
  object-fit: cover;
}

.clx-client__main {
  min-width: 0;
}

.clx-client__main h3 {
  margin: 0;
  max-width: 165px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 15px;
  line-height: 1.05;
  letter-spacing: -0.035em;
  font-weight: 740;
  color: #ffffff;
}

.clx-client__main p {
  margin: 6px 0 0;
  font-size: 9px;
  font-weight: 680;
  color: rgba(255, 255, 255, 0.42);
}

.clx-client__main span {
  display: block;
  margin-top: 8px;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 9px;
  font-weight: 840;
  color: #d6b17a;
}

.clx-client__meta {
  text-align: right;
}

.clx-client__meta strong {
  display: block;
  font-size: 18px;
  line-height: 0.9;
  letter-spacing: -0.05em;
  font-weight: 600;
  color: #ffffff;
}

.clx-client__meta span {
  display: block;
  margin-top: 7px;
  font-size: 8px;
  font-weight: 780;
  color: rgba(255, 255, 255, 0.35);
}

.clx-empty {
  padding: 25px 0 10px;
}

.clx-empty h3 {
  margin: 0;
  font-size: 15px;
  letter-spacing: -0.03em;
  color: #ffffff;
}

.clx-empty p {
  margin: 7px 0 0;
  max-width: 220px;
  font-size: 10px;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.42);
}

.clx-quick {
  margin-top: 14px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.clx-quick article {
  min-height: 124px;
  border-radius: 23px;
  padding: 15px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.022)),
    #131313;
  display: flex;
  flex-direction: column;
}

.clx-quick article:first-child {
  background:
    radial-gradient(circle at 20% 16%, rgba(255, 255, 255, 0.18), transparent 38%),
    linear-gradient(135deg, #d6b17a 0%, #b98a55 100%);
}

.clx-quick span {
  display: block;
  font-size: 8px;
  font-weight: 850;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.42);
}

.clx-quick article:first-child span {
  color: rgba(22, 17, 11, 0.58);
}

.clx-quick strong {
  display: block;
  margin-top: auto;
  font-size: 20px;
  line-height: 0.94;
  letter-spacing: -0.055em;
  font-weight: 620;
  color: #ffffff;
}

.clx-quick article:first-child strong {
  color: #16110b;
}

.clx-quick p {
  margin: 9px 0 0;
  font-size: 9px;
  line-height: 1.3;
  font-weight: 720;
  color: rgba(255, 255, 255, 0.42);
}

.clx-quick article:first-child p {
  color: rgba(22, 17, 11, 0.66);
}

.clx-bottom {
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

.clx-bottom button {
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

.clx-bottom button.is-current {
  color: #d6b17a;
  background: rgba(214, 177, 122, 0.08);
}

.clx-bottom svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.clx-modal {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.clx-modal__backdrop {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgba(0, 0, 0, 0.58);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.clx-popup {
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

.clx-popup__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 20px;
}

.clx-popup__head span {
  display: block;
  margin-bottom: 7px;
  font-size: 10px;
  font-weight: 850;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  color: #d6b17a;
}

.clx-popup__head h2 {
  margin: 0;
  max-width: 260px;
  font-size: 34px;
  line-height: 0.92;
  letter-spacing: -0.075em;
  font-weight: 560;
  color: #ffffff;
}

.clx-popup__head button {
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

.clx-popup__head svg {
  width: 18px;
  height: 18px;
}

.clx-profile-card {
  min-height: 82px;
  border-radius: 23px;
  background:
    radial-gradient(circle at 16% 22%, rgba(255, 255, 255, 0.18), transparent 40%),
    linear-gradient(135deg, #d6b17a 0%, #b98a55 100%);
  padding: 14px;
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
}

.clx-profile-card img {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  object-fit: cover;
}

.clx-profile-card strong {
  display: block;
  color: #16110b;
  font-size: 13px;
  font-weight: 900;
}

.clx-profile-card span {
  display: block;
  margin-top: 6px;
  color: rgba(22, 17, 11, 0.68);
  font-size: 9px;
  line-height: 1.35;
  font-weight: 760;
}

.clx-popup-stats {
  margin-top: 12px;
  min-height: 74px;
  border-radius: 21px;
  background: rgba(255, 255, 255, 0.045);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  overflow: hidden;
}

.clx-popup-stats article {
  display: grid;
  place-items: center;
  align-content: center;
  position: relative;
}

.clx-popup-stats article + article::before {
  content: "";
  position: absolute;
  left: 0;
  top: 18px;
  bottom: 18px;
  width: 1px;
  background: rgba(255, 255, 255, 0.07);
}

.clx-popup-stats strong {
  font-size: 20px;
  line-height: 0.9;
  letter-spacing: -0.055em;
  color: #ffffff;
}

.clx-popup-stats span {
  margin-top: 8px;
  font-size: 8px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.38);
}

.clx-popup-section {
  padding: 18px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.075);
}

.clx-popup-section:first-of-type {
  margin-top: 16px;
}

.clx-popup-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.clx-popup-label span {
  font-size: 9px;
  font-weight: 900;
  color: #d6b17a;
}

.clx-popup-label p {
  margin: 0;
  font-size: 11px;
  font-weight: 850;
  color: rgba(255, 255, 255, 0.56);
}

.clx-service-card {
  min-height: 64px;
  border-radius: 20px;
  background: rgba(214, 177, 122, 0.12);
  padding: 13px;
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: center;
}

.clx-service-card h3 {
  margin: 0;
  font-size: 14px;
  letter-spacing: -0.035em;
  color: #ffffff;
}

.clx-service-card p {
  margin: 7px 0 0;
  font-size: 9px;
  color: rgba(255, 255, 255, 0.42);
}

.clx-service-card strong {
  color: #d6b17a;
  font-size: 10px;
  font-weight: 900;
  white-space: nowrap;
}

.clx-history {
  display: grid;
}

.clx-history article {
  min-height: 54px;
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.clx-history article:last-child {
  border-bottom: 0;
}

.clx-history strong {
  font-size: 12px;
  color: #ffffff;
}

.clx-history span {
  display: block;
  margin-top: 5px;
  font-size: 9px;
  color: rgba(255, 255, 255, 0.42);
}

.clx-history p {
  margin: 0;
  color: #d6b17a;
  font-size: 10px;
  font-weight: 900;
}

.clx-popup-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.clx-popup-actions button,
.clx-submit {
  height: 52px;
  border: 0;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 950;
}

.clx-popup-actions button:first-child,
.clx-submit {
  background: #d6b17a;
  color: #16110b;
}

.clx-popup-actions button:last-child {
  background: rgba(255, 255, 255, 0.065);
  color: #ffffff;
}

.clx-form {
  display: grid;
  gap: 10px;
}

.clx-form label {
  display: grid;
  gap: 8px;
  font-size: 10px;
  font-weight: 850;
  color: rgba(255, 255, 255, 0.54);
}

.clx-form input,
.clx-form textarea {
  width: 100%;
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

.clx-form input {
  height: 50px;
}

.clx-form textarea {
  min-height: 96px;
  padding-top: 14px;
  resize: none;
}

.clx-form input::placeholder,
.clx-form textarea::placeholder {
  color: rgba(255, 255, 255, 0.28);
}

.clx-submit {
  width: 100%;
  margin-top: 8px;
}

@media (min-width: 431px) {
  .clx-shell {
    padding: 20px 0;
  }

  .clx-phone {
    min-height: 932px;
    border-radius: 36px;
  }

  .clx-popup {
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