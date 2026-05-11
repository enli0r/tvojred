<template>
  <main class="bl-booking">
    <header class="bl-header">
      <div class="bl-brand">
        <div class="bl-logo">
          <img class="bl-logo__img" :src="logoImage" alt="Beautiful Life logo" />
        </div>

        <div class="bl-brand__text">
          <h1>Beautiful Life</h1>
          <p>HAIR SALON</p>
        </div>
      </div>

      <button class="bl-menu" type="button" aria-label="Otvori meni">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>

    <section class="booking-hero">
      <div class="booking-hero__image">
        <Transition name="hero-image" mode="out-in">
          <img :key="activeHeroImage" :src="activeHeroImage" alt="Beautiful Life zakazivanje" />
        </Transition>
      </div>

      <div class="booking-hero__text">
        <Transition name="step-copy" mode="out-in">
          <div :key="activeStepId">
            <span>{{ activeStepNumber }}</span>
            <h2>{{ activeStepTitle }}</h2>
            <p>{{ activeStepSubtitle }}</p>
          </div>
        </Transition>
      </div>
    </section>

    <nav class="booking-steps" aria-label="Koraci rezervacije">
      <button
        v-for="step in visibleSteps"
        :key="step.id"
        class="booking-step-dot"
        :class="{
          'booking-step-dot--active': activeStepId === step.id,
          'booking-step-dot--done': isStepDone(step.id),
        }"
        type="button"
        @click="goToStep(step.id)"
      >
        <span>{{ step.short }}</span>
      </button>
    </nav>

    <Transition name="panel-slide" mode="out-in">
      <section v-if="activeStepId === 'salon'" key="salon" class="booking-panel">
        <div class="salon-stack">
          <button
            v-for="salon in salons"
            :key="salon.id"
            class="salon-card"
            :class="{ 'salon-card--active': selectedSalonId === salon.id }"
            type="button"
            @click="selectSalon(salon.id)"
          >
            <img :src="salon.image" :alt="salon.name" />

            <span class="salon-card__shade"></span>

            <span class="salon-card__content">
              <small>{{ salon.kicker }}</small>
              <strong>{{ salon.name }}</strong>
              <em>{{ salon.address }}</em>
            </span>

            <span class="salon-card__check">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M5 12.4 9.2 16.6 19 6.8"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.15"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </button>
        </div>
      </section>

      <section v-else-if="activeStepId === 'category'" key="category" class="booking-panel">
        <div class="category-board">
          <button
            v-for="category in categories"
            :key="category.id"
            class="category-tile"
            :class="{ 'category-tile--active': selectedCategoryId === category.id }"
            type="button"
            @click="selectCategory(category.id)"
          >
            <img :src="category.image" :alt="category.name" />

            <span>
              <strong>{{ category.name }}</strong>
              <small>{{ category.caption }}</small>
            </span>

            <em>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M5 12.4 9.2 16.6 19 6.8"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.15"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </em>
          </button>
        </div>
      </section>

      <section v-else-if="activeStepId === 'service'" key="service" class="booking-panel">
        <div class="service-board">
          <button
            v-for="service in visibleServices"
            :key="service.id"
            class="service-row"
            :class="{ 'service-row--active': selectedServiceId === service.id }"
            type="button"
            @click="selectService(service.id)"
          >
            <span>
              <strong>{{ service.name }}</strong>
              <small>{{ service.duration }} min</small>
            </span>

            <em>{{ service.price }}</em>
          </button>
        </div>
      </section>

      <section v-else-if="activeStepId === 'option'" key="option" class="booking-panel">
        <div class="option-board">
          <button
            v-for="option in selectedService?.options"
            :key="option.id"
            class="option-card"
            :class="{ 'option-card--active': selectedOptionId === option.id }"
            type="button"
            @click="selectOption(option.id)"
          >
            <strong>{{ option.name }}</strong>
            <small>{{ option.note }}</small>
          </button>
        </div>
      </section>

      <section v-else-if="activeStepId === 'date'" key="date" class="booking-panel">
        <div class="date-strip">
          <button
            v-for="day in days"
            :key="day.date"
            class="date-card"
            :class="{ 'date-card--active': selectedDate === day.date }"
            type="button"
            :disabled="day.disabled"
            @click="selectDate(day.date)"
          >
            <span>{{ day.weekday }}</span>
            <strong>{{ day.day }}</strong>
            <small>{{ day.month }}</small>
          </button>
        </div>
      </section>

      <section v-else-if="activeStepId === 'specialist'" key="specialist" class="booking-panel">
        <div class="specialist-board">
          <button
            v-for="specialist in filteredSpecialists"
            :key="specialist.id"
            class="specialist-card"
            :class="{ 'specialist-card--active': selectedSpecialistId === specialist.id }"
            type="button"
            @click="selectSpecialist(specialist.id)"
          >
            <img :src="specialist.image" :alt="specialist.name" />

            <span>
              <strong>{{ specialist.name }}</strong>
              <small>{{ specialist.role }}</small>
            </span>

            <em>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M5 12.4 9.2 16.6 19 6.8"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.15"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </em>
          </button>
        </div>
      </section>

      <section v-else key="time" class="booking-panel">
        <div class="time-tabs" :class="`time-tabs--${activePeriod}`">
          <span class="time-tabs__indicator"></span>

          <button
            class="time-tab"
            :class="{ 'time-tab--active': activePeriod === 'morning' }"
            type="button"
            @click="activePeriod = 'morning'"
          >
            Prepodne
          </button>

          <button
            class="time-tab"
            :class="{ 'time-tab--active': activePeriod === 'afternoon' }"
            type="button"
            @click="activePeriod = 'afternoon'"
          >
            Popodne
          </button>
        </div>

        <Transition name="time-switch" mode="out-in">
          <div :key="activePeriod" class="time-grid">
            <button
              v-for="slot in visibleTimeSlots"
              :key="slot"
              class="time-slot"
              :class="{ 'time-slot--active': selectedTime === slot }"
              type="button"
              @click="selectedTime = slot"
            >
              {{ slot }}
            </button>
          </div>
        </Transition>
      </section>
    </Transition>

    <Transition name="receipt-pop">
      <section v-if="isReadyToConfirm" class="booking-receipt">
        <span>Pregled termina</span>

        <h3>{{ selectedDateLabel }} · {{ selectedTime }}</h3>

        <p>
          {{ selectedSalon?.name }} · {{ selectedCategory?.name }}
          <template v-if="selectedService"> · {{ selectedService.name }}</template>
          <template v-if="selectedOption"> · {{ selectedOption.name }}</template>
        </p>

        <p>{{ selectedSpecialist?.name }}</p>
      </section>
    </Transition>

    <div class="booking-bottom">
      <div class="booking-bottom__summary">
        <span>{{ bottomLabel }}</span>
        <strong>{{ bottomValue }}</strong>
      </div>

      <button
        class="booking-bottom__next"
        type="button"
        :disabled="!canGoForward && !isReadyToConfirm"
        @click="handlePrimaryAction"
      >
        {{ isReadyToConfirm ? 'Potvrdi' : 'Dalje' }}
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type StepId = 'salon' | 'category' | 'service' | 'option' | 'date' | 'specialist' | 'time'
type Period = 'morning' | 'afternoon'

type Step = {
  id: StepId
  short: string
  title: string
  subtitle: string
}

type Salon = {
  id: string
  name: string
  address: string
  kicker: string
  image: string
}

type Category = {
  id: string
  name: string
  caption: string
  image: string
  requiresService: boolean
  title: string
  subtitle: string
}

type ServiceOption = {
  id: string
  name: string
  note: string
}

type Service = {
  id: string
  categoryId: string
  name: string
  duration: number
  price: string
  options?: ServiceOption[]
}

type DayItem = {
  date: string
  weekday: string
  day: string
  month: string
  disabled?: boolean
}

type Specialist = {
  id: string
  name: string
  role: string
  image: string
  categoryIds: string[]
}

const logoImage = '/src/assets/img/ninalogofinal.png'
const defaultSalonHeroImage = '/src/assets/img/salon1.jpg'

const activeStepId = ref<StepId>('salon')
const activePeriod = ref<Period>('morning')

const selectedSalonId = ref<string | null>(null)
const selectedCategoryId = ref<string | null>(null)
const selectedServiceId = ref<string | null>(null)
const selectedOptionId = ref<string | null>(null)
const selectedDate = ref<string | null>(null)
const selectedSpecialistId = ref<string | null>(null)
const selectedTime = ref<string | null>(null)

const salons: Salon[] = [
  {
    id: 'centar',
    name: 'Beautiful Life Centar',
    address: 'Vojvode Mišića 36a',
    kicker: 'Glavni salon',
    image: '/src/assets/img/salon2.jpg',
  },
  {
    id: 'lounge',
    name: 'Beauty Lounge',
    address: 'Kneza Miloša 18',
    kicker: 'Premium zona',
    image:
      'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'studio-plus',
    name: 'Studio Plus',
    address: 'Bulevar umetnosti 7',
    kicker: 'Novi salon',
    image:
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80',
  },
]

const categories: Category[] = [
  {
    id: 'male-hair',
    name: 'Muški deo',
    caption: 'Šišanje · fade · brada',
    requiresService: true,
    title: 'Izaberi mušku uslugu',
    subtitle: 'Klasično, fade ili skin fade.',
    image:
      'https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'female-hair',
    name: 'Ženski deo',
    caption: 'Šišanje · fen · nega',
    requiresService: false,
    title: 'Izaberi dan',
    subtitle: 'Za ženski frizerski deo uslugu biraš direktno u salonu.',
    image:
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'nails',
    name: 'Nokti',
    caption: 'Novi set · korekcija',
    requiresService: true,
    title: 'Izaberi tretman',
    subtitle: 'Novi set, korekcija ili pedikir.',
    image:
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'makeup',
    name: 'Šminkanje',
    caption: 'Dnevna · večernja',
    requiresService: true,
    title: 'Izaberi šminkanje',
    subtitle: 'Za dan, izlazak ili posebnu priliku.',
    image:
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=700&q=80',
  },
]

const services: Service[] = [
  {
    id: 'classic',
    categoryId: 'male-hair',
    name: 'Klasično šišanje',
    duration: 30,
    price: '1.200 RSD',
  },
  {
    id: 'fade',
    categoryId: 'male-hair',
    name: 'Fade šišanje',
    duration: 40,
    price: '1.500 RSD',
  },
  {
    id: 'skin-fade',
    categoryId: 'male-hair',
    name: 'Skin fade',
    duration: 45,
    price: '1.800 RSD',
  },
  {
    id: 'beard',
    categoryId: 'male-hair',
    name: 'Brada + konture',
    duration: 25,
    price: '900 RSD',
  },
  {
    id: 'new-set',
    categoryId: 'nails',
    name: 'Novi set',
    duration: 90,
    price: '3.000 RSD',
    options: [
      { id: 'square', name: 'Kocka', note: 'Ravan i čist oblik' },
      { id: 'almond', name: 'Badem', note: 'Nežan elegantan oblik' },
      { id: 'french', name: 'French', note: 'Svetao klasičan stil' },
      { id: 'coffin', name: 'Balerina', note: 'Moderan izdužen oblik' },
    ],
  },
  {
    id: 'correction',
    categoryId: 'nails',
    name: 'Korekcija',
    duration: 75,
    price: '2.200 RSD',
    options: [
      { id: 'natural', name: 'Prirodno', note: 'Diskretan izgled' },
      { id: 'color', name: 'Boja', note: 'Jedna boja' },
      { id: 'art', name: 'Nail art', note: 'Detalji po želji' },
    ],
  },
  {
    id: 'pedicure',
    categoryId: 'nails',
    name: 'Pedikir',
    duration: 60,
    price: '2.000 RSD',
    options: [
      { id: 'classic-pedicure', name: 'Klasičan', note: 'Osnovna nega' },
      { id: 'spa-pedicure', name: 'Spa', note: 'Nega i opuštanje' },
    ],
  },
  {
    id: 'daily',
    categoryId: 'makeup',
    name: 'Dnevna šminka',
    duration: 45,
    price: '2.500 RSD',
  },
  {
    id: 'evening',
    categoryId: 'makeup',
    name: 'Večernja šminka',
    duration: 60,
    price: '3.500 RSD',
  },
  {
    id: 'special',
    categoryId: 'makeup',
    name: 'Svečana šminka',
    duration: 75,
    price: '4.500 RSD',
  },
]

const days: DayItem[] = [
  { date: '2026-05-11', weekday: 'Pon', day: '11', month: 'Maj' },
  { date: '2026-05-12', weekday: 'Uto', day: '12', month: 'Maj' },
  { date: '2026-05-13', weekday: 'Sre', day: '13', month: 'Maj' },
  { date: '2026-05-14', weekday: 'Čet', day: '14', month: 'Maj' },
  { date: '2026-05-15', weekday: 'Pet', day: '15', month: 'Maj' },
  { date: '2026-05-16', weekday: 'Sub', day: '16', month: 'Maj' },
  { date: '2026-05-17', weekday: 'Ned', day: '17', month: 'Maj', disabled: true },
]

const specialists: Specialist[] = [
  {
    id: 'marko',
    name: 'Marko',
    role: 'Barber',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80',
    categoryIds: ['male-hair'],
  },
  {
    id: 'ana',
    name: 'Ana',
    role: 'Hair stylist',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=80',
    categoryIds: ['female-hair', 'makeup'],
  },
  {
    id: 'nina',
    name: 'Nina',
    role: 'Nail artist',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80',
    categoryIds: ['nails'],
  },
  {
    id: 'sara',
    name: 'Sara',
    role: 'Makeup artist',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80',
    categoryIds: ['makeup', 'female-hair'],
  },
]

const morningSlots = ['09:00', '09:30', '10:00', '10:30', '11:30']
const afternoonSlots = ['12:00', '13:00', '14:30', '15:00', '16:00', '17:30', '18:00']

const baseSteps: Step[] = [
  {
    id: 'salon',
    short: 'Salon',
    title: 'Izaberi salon',
    subtitle: 'Odaberi lokaciju koja ti najviše odgovara.',
  },
  {
    id: 'category',
    short: 'Usluga',
    title: 'Šta zakazuješ?',
    subtitle: 'Frizerski deo, nokti, pedikir ili šminka.',
  },
  {
    id: 'service',
    short: 'Tip',
    title: 'Izaberi tip',
    subtitle: 'Dodatno preciziraj uslugu.',
  },
  {
    id: 'option',
    short: 'Stil',
    title: 'Izaberi stil',
    subtitle: 'Odaberi oblik ili završni izgled.',
  },
  {
    id: 'date',
    short: 'Dan',
    title: 'Izaberi dan',
    subtitle: 'Dostupni dani za rezervaciju.',
  },
  {
    id: 'specialist',
    short: 'Osoba',
    title: 'Izaberi specijalistu',
    subtitle: 'Odaberi osobu kod koje želiš termin.',
  },
  {
    id: 'time',
    short: 'Termin',
    title: 'Izaberi termin',
    subtitle: 'Slobodni termini za izabrani dan.',
  },
]

const selectedSalon = computed(() => salons.find((salon) => salon.id === selectedSalonId.value))

const selectedCategory = computed(() =>
  categories.find((category) => category.id === selectedCategoryId.value),
)

const visibleServices = computed(() =>
  services.filter((service) => service.categoryId === selectedCategoryId.value),
)

const selectedService = computed(() =>
  services.find((service) => service.id === selectedServiceId.value),
)

const selectedOption = computed(() =>
  selectedService.value?.options?.find((option) => option.id === selectedOptionId.value),
)

const filteredSpecialists = computed(() => {
  if (!selectedCategoryId.value) return specialists

  return specialists.filter((specialist) =>
    specialist.categoryIds.includes(selectedCategoryId.value as string),
  )
})

const selectedSpecialist = computed(() =>
  specialists.find((specialist) => specialist.id === selectedSpecialistId.value),
)

const visibleSteps = computed(() => {
  const initialSteps: StepId[] = ['salon', 'category']
  const steps: Step[] = initialSteps.map(getStep)

  if (selectedCategory.value?.requiresService) {
    steps.push(getStep('service'))
  }

  if (selectedService.value?.options?.length) {
    steps.push(getStep('option'))
  }

  steps.push(getStep('date'), getStep('specialist'), getStep('time'))

  return steps
})

const activeStep = computed(() => getStep(activeStepId.value))

const activeStepTitle = computed(() => {
  if (activeStepId.value === 'service' && selectedCategory.value?.title) {
    return selectedCategory.value.title
  }

  if (activeStepId.value === 'service' && selectedCategory.value?.name) {
    return selectedCategory.value.name
  }

  return activeStep.value.title
})

const activeStepSubtitle = computed(() => {
  if (activeStepId.value === 'service' && selectedCategory.value?.subtitle) {
    return selectedCategory.value.subtitle
  }

  return activeStep.value.subtitle
})

const activeStepNumber = computed(() => {
  const index = visibleSteps.value.findIndex((step) => step.id === activeStepId.value)

  return String(index + 1).padStart(2, '0')
})

const activeHeroImage = computed(() => {
  if (activeStepId.value === 'salon') {
    return defaultSalonHeroImage
  }

  if (activeStepId.value === 'category' || activeStepId.value === 'service') {
    return selectedCategory.value?.image || categories[0].image
  }

  if (activeStepId.value === 'specialist') {
    return selectedSpecialist.value?.image || filteredSpecialists.value[0]?.image || categories[0].image
  }

  return selectedCategory.value?.image || defaultSalonHeroImage
})

const visibleTimeSlots = computed(() =>
  activePeriod.value === 'morning' ? morningSlots : afternoonSlots,
)

const canGoForward = computed(() => {
  if (activeStepId.value === 'salon') return Boolean(selectedSalon.value)
  if (activeStepId.value === 'category') return Boolean(selectedCategory.value)
  if (activeStepId.value === 'service') return Boolean(selectedService.value)
  if (activeStepId.value === 'option') return Boolean(selectedOption.value)
  if (activeStepId.value === 'date') return Boolean(selectedDate.value)
  if (activeStepId.value === 'specialist') return Boolean(selectedSpecialist.value)
  if (activeStepId.value === 'time') return Boolean(selectedTime.value)

  return false
})

const selectedDateLabel = computed(() => {
  const day = days.find((item) => item.date === selectedDate.value)

  if (!day) return ''

  return `${day.weekday}, ${day.day}. ${day.month}`
})

const isReadyToConfirm = computed(() => {
  return Boolean(
    selectedSalon.value &&
      selectedCategory.value &&
      (!selectedCategory.value.requiresService || selectedService.value) &&
      (!selectedService.value?.options?.length || selectedOption.value) &&
      selectedDate.value &&
      selectedSpecialist.value &&
      selectedTime.value,
  )
})

const bottomLabel = computed(() => {
  if (isReadyToConfirm.value) return 'Spremno'
  if (activeStepId.value === 'salon') return 'Prvi korak'
  if (activeStepId.value === 'category') return 'Izbor usluge'
  if (activeStepId.value === 'service') return 'Tip usluge'
  if (activeStepId.value === 'option') return 'Stil'
  if (activeStepId.value === 'date') return 'Dan'
  if (activeStepId.value === 'specialist') return 'Specijalista'
  return 'Termin'
})

const bottomValue = computed(() => {
  if (isReadyToConfirm.value) return `${selectedDateLabel.value} · ${selectedTime.value}`
  if (selectedTime.value) return selectedTime.value
  if (selectedSpecialist.value) return selectedSpecialist.value.name
  if (selectedDate.value) return selectedDateLabel.value
  if (selectedOption.value) return selectedOption.value.name
  if (selectedService.value) return selectedService.value.name
  if (selectedCategory.value) return selectedCategory.value.name
  if (selectedSalon.value) return selectedSalon.value.name

  return 'Izaberi salon'
})

function getStep(id: StepId) {
  return baseSteps.find((step) => step.id === id) as Step
}

function isStepDone(stepId: StepId) {
  if (stepId === 'salon') return Boolean(selectedSalon.value)
  if (stepId === 'category') return Boolean(selectedCategory.value)
  if (stepId === 'service') return Boolean(selectedService.value)
  if (stepId === 'option') return Boolean(selectedOption.value)
  if (stepId === 'date') return Boolean(selectedDate.value)
  if (stepId === 'specialist') return Boolean(selectedSpecialist.value)
  if (stepId === 'time') return Boolean(selectedTime.value)

  return false
}

function goToStep(stepId: StepId) {
  const targetIndex = visibleSteps.value.findIndex((step) => step.id === stepId)
  const currentUnlockedIndex = getUnlockedStepIndex()

  if (targetIndex <= currentUnlockedIndex) {
    activeStepId.value = stepId
  }
}

function getUnlockedStepIndex() {
  for (let i = 0; i < visibleSteps.value.length; i += 1) {
    const step = visibleSteps.value[i]

    if (!isStepDone(step.id)) {
      return i
    }
  }

  return visibleSteps.value.length - 1
}

function goNext() {
  const index = visibleSteps.value.findIndex((step) => step.id === activeStepId.value)
  const next = visibleSteps.value[index + 1]

  if (next) {
    activeStepId.value = next.id
  }
}

function selectSalon(id: string) {
  selectedSalonId.value = id
  selectedCategoryId.value = null
  selectedServiceId.value = null
  selectedOptionId.value = null
  selectedDate.value = null
  selectedSpecialistId.value = null
  selectedTime.value = null

  window.setTimeout(() => {
    activeStepId.value = 'category'
  }, 190)
}

function selectCategory(id: string) {
  selectedCategoryId.value = id
  selectedServiceId.value = null
  selectedOptionId.value = null
  selectedDate.value = null
  selectedSpecialistId.value = null
  selectedTime.value = null

  const category = categories.find((item) => item.id === id)

  window.setTimeout(() => {
    if (category?.requiresService) {
      activeStepId.value = 'service'
      return
    }

    activeStepId.value = 'date'
  }, 190)
}

function selectService(id: string) {
  selectedServiceId.value = id
  selectedOptionId.value = null
  selectedDate.value = null
  selectedSpecialistId.value = null
  selectedTime.value = null

  const service = services.find((item) => item.id === id)

  window.setTimeout(() => {
    if (service?.options?.length) {
      activeStepId.value = 'option'
      return
    }

    activeStepId.value = 'date'
  }, 190)
}

function selectOption(id: string) {
  selectedOptionId.value = id
  selectedDate.value = null
  selectedSpecialistId.value = null
  selectedTime.value = null

  window.setTimeout(() => {
    activeStepId.value = 'date'
  }, 190)
}

function selectDate(date: string) {
  selectedDate.value = date
  selectedSpecialistId.value = null
  selectedTime.value = null

  window.setTimeout(() => {
    activeStepId.value = 'specialist'
  }, 190)
}

function selectSpecialist(id: string) {
  selectedSpecialistId.value = id
  selectedTime.value = null

  window.setTimeout(() => {
    activeStepId.value = 'time'
  }, 190)
}

function handlePrimaryAction() {
  if (isReadyToConfirm.value) {
    return
  }

  if (canGoForward.value) {
    goNext()
  }
}
</script>

<style scoped lang="scss">
.bl-booking {
  min-height: 100svh;
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  padding: 0 18px 104px;
  overflow: hidden;

  color: #191813;
  background:
    radial-gradient(
      circle at 50% 0%,
      rgba(255, 255, 255, 0.95) 0%,
      rgba(250, 246, 238, 0.76) 38%,
      rgba(246, 241, 232, 0.92) 100%
    ),
    linear-gradient(180deg, #fbf7ef 0%, #f5efe4 100%);

  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;

  * {
    box-sizing: border-box;
  }

  button {
    font: inherit;
    border: 0;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    &:disabled {
      cursor: not-allowed;
    }
  }
}

.bl-header {
  position: relative;
  z-index: 10;
  margin: 0 -18px;
  padding: 20px 23px 14px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  background: #f6f1e8;
}

.bl-brand {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 9px;

  &__text {
    display: flex;
    flex-direction: column;
    min-width: 0;

    h1 {
      margin: 0;
      color: #11100d;
      font-family:
        Georgia,
        'Times New Roman',
        serif;
      font-size: 18px;
      font-weight: 500;
      line-height: 1;
      letter-spacing: -0.8px;
      white-space: nowrap;
    }

    p {
      margin: 4px 0 0;
      color: #303030;
      font-size: 10px;
      font-weight: 700;
      line-height: 1;
      letter-spacing: 3.6px;
      white-space: nowrap;
    }
  }
}

.bl-logo {
  width: 60px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &__img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }
}

.bl-menu {
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  border-radius: 999px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 3.5px;

  color: #171511;
  background: #e7ded2;

  span {
    width: 14px;
    height: 1.65px;
    border-radius: 99px;
    background: currentColor;
  }
}

.booking-hero {
  margin-top: 8px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
}

.booking-hero__image {
  height: 236px;
  border-radius: 28px 28px 8px 8px;
  overflow: hidden;
  background: #ddd2c5;

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }
}

.booking-hero__text {
  position: relative;
  z-index: 2;
  width: calc(100% - 28px);
  min-height: 146px;
  margin: -34px auto 0;
  padding: 16px 16px 15px;
  border-radius: 24px;

  background: #f1eadf;
  border: 1px solid rgba(72, 62, 48, 0.1);

  span {
    display: inline-flex;
    height: 25px;
    padding: 0 10px;
    border-radius: 999px;
    align-items: center;

    color: #6d775c;
    background: #dfe3ca;

    font-size: 10px;
    font-weight: 850;
    letter-spacing: 0.5px;
  }

  h2 {
    margin: 10px 0 0;
    color: #171511;
    font-family:
      Georgia,
      'Times New Roman',
      serif;
    font-size: 31px;
    font-weight: 500;
    line-height: 0.96;
    letter-spacing: -1.15px;
  }

  p {
    max-width: 280px;
    margin: 9px 0 0;
    color: rgba(38, 35, 29, 0.62);
    font-size: 13px;
    font-weight: 540;
    line-height: 1.35;
    letter-spacing: -0.1px;
  }
}

.booking-steps {
  display: flex;
  gap: 6px;
  margin: 16px -18px 0;
  padding: 0 18px 4px;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
}

.booking-step-dot {
  flex: 0 0 75px;
  width: 75px;
  height: 30px;
  padding: 0 6px;
  border-radius: 999px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  color: rgba(38, 35, 29, 0.56);
  background: #f3ede3;
  border: 1px solid rgba(72, 62, 48, 0.08);

  font-size: 9.2px;
  font-weight: 800;
  letter-spacing: -0.12px;
  white-space: nowrap;

  span{
      font-weight: 600;
font-size: 14px;
  }

  transition:
    transform 150ms ease,
    background 180ms ease,
    color 180ms ease,
    border-color 180ms ease;

  &:active {
    transform: scale(0.975);
  }

  &--active {
    color: #ffffff;
    background: #74835f;
    border-color: #74835f;
  }

  &--done:not(&--active) {
    color: #5f6c50;
    background: #dfe3ca;
  }
}

.booking-panel {
  margin-top: 20px;
}

.salon-stack {
  display: grid;
  gap: 11px;
}

.salon-card {
  position: relative;
  height: 152px;
  border-radius: 26px;
  overflow: hidden;
  padding: 0;

  text-align: left;
  background: #ddd2c5;
  border: 2px solid transparent;

  transition:
    transform 180ms ease,
    border-color 180ms ease,
    filter 180ms ease;

  &--active {
    border-color: #74835f;
    transform: scale(0.985);
    animation: select-pulse 360ms ease;

    .salon-card__check {
      opacity: 1;
      transform: scale(1);
    }
  }

  &:active {
    transform: scale(0.975);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  &--active img {
    transform: scale(1.035);
  }

  &__shade {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      rgba(18, 16, 12, 0.78) 0%,
      rgba(18, 16, 12, 0.44) 46%,
      rgba(18, 16, 12, 0.08) 100%
    );
  }

  &__content {
    position: absolute;
    left: 15px;
    right: 15px;
    bottom: 14px;
    z-index: 2;

    small {
      display: inline-flex;
      height: 24px;
      padding: 0 9px;
      border-radius: 999px;
      align-items: center;

      color: #171511;
      background: rgba(245, 240, 230, 0.9);

      font-size: 10px;
      font-weight: 820;
      letter-spacing: 0.2px;
    }

    strong {
      display: block;
      margin-top: 8px;
      color: #ffffff;
      font-family:
        Georgia,
        'Times New Roman',
        serif;
      font-size: 22px;
      font-weight: 500;
      line-height: 0.98;
      letter-spacing: -0.55px;
    }

    em {
      display: block;
      margin-top: 5px;
      color: rgba(255, 255, 255, 0.78);
      font-size: 12px;
      font-style: normal;
      font-weight: 570;
    }
  }

  &__check {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 3;

    width: 30px;
    height: 30px;
    border-radius: 999px;

    display: grid;
    place-items: center;

    color: #ffffff;
    background: #74835f;

    opacity: 0;
    transform: scale(0.72);
    transition:
      opacity 180ms ease,
      transform 220ms cubic-bezier(0.2, 1.35, 0.35, 1);

    svg {
      width: 17px;
      height: 17px;
    }
  }
}

.category-board {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.category-tile {
  position: relative;
  min-height: 186px;
  border-radius: 26px;
  overflow: hidden;
  padding: 0;

  display: flex;
  flex-direction: column;

  text-align: left;
  color: #171511;
  background: #f2ebe1;
  border: 1px solid rgba(72, 62, 48, 0.08);

  transition:
    transform 180ms ease,
    border-color 180ms ease,
    background 180ms ease;

  &--active {
    background: #dfe3ca;
    border-color: rgba(116, 131, 95, 0.55);
    transform: translateY(-2px);
    animation: select-pulse 360ms ease;

    em {
      opacity: 1;
      transform: scale(1);
    }
  }

  &:active {
    transform: scale(0.975);
  }

  img {
    width: 100%;
    height: 122px;
    display: block;
    object-fit: cover;
  }

  span {
    padding: 12px 12px 13px;
  }

  strong {
    display: block;
    font-family:
      Georgia,
      'Times New Roman',
      serif;
    font-size: 18px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: -0.38px;
  }

  small {
    display: block;
    margin-top: 6px;
    color: rgba(38, 35, 29, 0.6);
    font-size: 11.5px;
    font-weight: 550;
    line-height: 1.22;
  }

  em {
    position: absolute;
    top: 10px;
    right: 10px;

    width: 28px;
    height: 28px;
    border-radius: 999px;

    display: grid;
    place-items: center;

    color: #ffffff;
    background: #74835f;

    opacity: 0;
    transform: scale(0.72);
    transition:
      opacity 180ms ease,
      transform 220ms cubic-bezier(0.2, 1.35, 0.35, 1);

    svg {
      width: 16px;
      height: 16px;
    }
  }
}

.service-board {
  display: grid;
  gap: 9px;
}

.service-row {
  min-height: 70px;
  padding: 13px 14px;
  border-radius: 22px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  text-align: left;
  color: #171511;
  background: #f2ebe1;
  border: 1px solid rgba(72, 62, 48, 0.08);

  transition:
    transform 180ms ease,
    background 180ms ease,
    border-color 180ms ease;

  &--active {
    background: #dfe3ca;
    border-color: rgba(116, 131, 95, 0.55);
    transform: translateX(3px);
    animation: select-pulse 360ms ease;
  }

  &:active {
    transform: scale(0.985);
  }

  strong {
    display: block;
    font-size: 14px;
    font-weight: 820;
    letter-spacing: -0.14px;
  }

  small {
    display: block;
    margin-top: 5px;
    color: rgba(38, 35, 29, 0.56);
    font-size: 11.5px;
    font-weight: 570;
  }

  em {
    flex: 0 0 auto;
    color: #667456;
    font-size: 12px;
    font-style: normal;
    font-weight: 850;
  }
}

.option-board {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
}

.option-card {
  min-height: 94px;
  padding: 14px 12px;
  border-radius: 22px;

  text-align: left;
  color: #171511;
  background: #f2ebe1;
  border: 1px solid rgba(72, 62, 48, 0.08);

  transition:
    transform 180ms ease,
    background 180ms ease,
    border-color 180ms ease;

  &--active {
    background: #dfe3ca;
    border-color: rgba(116, 131, 95, 0.55);
    transform: translateY(-2px);
    animation: select-pulse 360ms ease;
  }

  strong {
    display: block;
    font-size: 14px;
    font-weight: 820;
    line-height: 1;
  }

  small {
    display: block;
    margin-top: 8px;
    color: rgba(38, 35, 29, 0.58);
    font-size: 11.5px;
    font-weight: 540;
    line-height: 1.26;
  }
}

.date-strip {
  display: flex;
  gap: 9px;
  margin: 0 -18px;
  padding: 0 18px 4px;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
}

.date-card {
  flex: 0 0 70px;
//   height: 80px;
  border-radius: 24px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  color: #171511;
  background: #f2ebe1;
  border: 1px solid rgba(72, 62, 48, 0.08);

  transition:
    transform 180ms ease,
    background 180ms ease,
    color 180ms ease,
    border-color 180ms ease;

  &--active {
    color: #ffffff;
    background: #74835f;
    border-color: #74835f;
    transform:  scale(0.975);
    animation: select-pulse 360ms ease;
  }

  &:active {
    transform: scale(0.96);
  }

  &:disabled {
    opacity: 0.35;
  }

  span {
    font-size: 11px;
    font-weight: 780;
    opacity: 0.72;
  }

  strong {
    margin-top: 3px;
    font-family:
      Georgia,
      'Times New Roman',
      serif;
    font-size: 27px;
    font-weight: 700;
    line-height: 1;
  }

  small {
    margin-top: 3px;
    font-size: 10.5px;
    font-weight: 680;
    opacity: 0.72;
  }
}

.specialist-board {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.specialist-card {
  position: relative;
  min-height: 200px;
  border-radius: 26px;
  overflow: hidden;
  padding: 0;

  display: flex;
  flex-direction: column;

  text-align: left;
  color: #171511;
  background: #f2ebe1;
  border: 1px solid rgba(72, 62, 48, 0.08);

  transition:
    transform 180ms ease,
    background 180ms ease,
    border-color 180ms ease;

  &--active {
    background: #dfe3ca;
    border-color: rgba(116, 131, 95, 0.55);
    transform: translateY(-2px);
    animation: select-pulse 360ms ease;

    em {
      opacity: 1;
      transform: scale(1);
    }
  }

  &:active {
    transform: scale(0.975);
  }

  img {
    width: 100%;
    height: 136px;
    display: block;
    object-fit: cover;
    object-position: center 18%;
  }

  span {
    padding: 12px;
  }

  strong {
    display: block;
    font-family:
      Georgia,
      'Times New Roman',
      serif;
    font-size: 18px;
    font-weight: 600;
    line-height: 1;
  }

  small {
    display: block;
    margin-top: 6px;
    color: rgba(38, 35, 29, 0.58);
    font-size: 11.5px;
    font-weight: 560;
  }

  em {
    position: absolute;
    top: 10px;
    right: 10px;

    width: 28px;
    height: 28px;
    border-radius: 999px;

    display: grid;
    place-items: center;

    color: #ffffff;
    background: #74835f;

    opacity: 0;
    transform: scale(0.72);
    transition:
      opacity 180ms ease,
      transform 220ms cubic-bezier(0.2, 1.35, 0.35, 1);

    svg {
      width: 16px;
      height: 16px;
    }
  }
}

.time-tabs {
  position: relative;
  isolation: isolate;

  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0;
  margin-bottom: 13px;
  padding: 4px;
  border-radius: 999px;
  overflow: hidden;

  background: #eee6dc;

  &__indicator {
    position: absolute;
    top: 4px;
    left: 4px;
    z-index: -1;

    width: calc((100% - 8px) / 2);
    height: calc(100% - 8px);
    border-radius: 999px;

    background: #74835f;

    transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  &--morning {
    .time-tabs__indicator {
      transform: translateX(0);
    }
  }

  &--afternoon {
    .time-tabs__indicator {
      transform: translateX(100%);
    }
  }
}

.time-tab {
  position: relative;
  z-index: 2;

  height: 38px;
  border-radius: 999px;

  color: rgba(38, 35, 29, 0.62);
  background: transparent;

  font-size: 14px !important;
  font-weight: 600 !important;
  letter-spacing: -0.12px;

  transition:
    transform 150ms ease,
    color 180ms ease;

  &:active {
    transform: scale(0.975);
  }

  &--active {
    color: #ffffff;
  }
}

.time-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 9px;
}

.time-slot {
  height: 40px;
  border-radius: 18px;

  color: #171511;
  background: #f2ebe1;
  border: 1px solid rgba(72, 62, 48, 0.08);

  font-size: 13.5px;
  letter-spacing: -0.12px;
    font-weight: 600 !important;


  transition:
    transform 170ms ease,
    background 180ms ease,
    color 180ms ease,
    border-color 180ms ease;

  &--active {
    color: #ffffff;
    background: #74835f;
    border-color: #74835f;
    transform: scale(0.975);
    animation: select-pulse 320ms ease;
  }

  &:active {
    transform: scale(0.96);
  }
}

.booking-receipt {
  margin-top: 24px;
  padding: 17px 16px;
  border-radius: 24px;

  background: #e9ecd9;
  border: 0;
  box-shadow: none;

  span {
    display: block;
    color: #74835f;
    font-size: 10px;
    font-weight: 850;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  h3 {
    margin: 8px 0 0;
    color: #171511;
    font-family:
      Georgia,
      'Times New Roman',
      serif;
    font-size: 21px;
    font-weight: 500;
    line-height: 1;
    letter-spacing: -0.55px;
  }

  p {
    margin: 8px 0 0;
    color: rgba(38, 35, 29, 0.64);
    font-size: 12.5px;
    font-weight: 560;
    line-height: 1.34;
  }
}

.booking-bottom {
  position: fixed;
  left: 50%;
  bottom: 0;
  z-index: 60;

  width: min(430px, 100%);
  padding: 12px 18px 16px;
  transform: translateX(-50%);

  display: grid;
  grid-template-columns: minmax(0, 1fr) 112px;
  align-items: center;
  gap: 12px;

  background:
    linear-gradient(180deg, rgba(245, 240, 230, 0) 0%, rgba(245, 240, 230, 0.94) 24%),
    rgb(245, 240, 230);

  box-shadow: 0 -8px 18px rgba(42, 36, 28, 0.035);

  &__summary {
    min-width: 0;

    span {
      display: block;
      color: rgba(38, 35, 29, 0.52);
      font-size: 10.5px;
      font-weight: 760;
    }

    strong {
      display: block;
      margin-top: 3px;
      overflow: hidden;

      color: #171511;
      font-size: 12.5px;
      font-weight: 820;
      line-height: 1.16;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &__next {
    height: 40px;
    border-radius: 999px;

    color: #ffffff;
    background: #74835f;

    font-size: 12.8px;
    font-weight: 850;

    transition:
      transform 170ms ease,
      opacity 170ms ease,
      background 170ms ease;

    &:active {
      transform: scale(0.97);
    }

    &:disabled {
      color: rgba(255, 255, 255, 0.72);
      background: #a9ad9b;
    }
  }
}

.panel-slide-enter-active,
.panel-slide-leave-active {
  transition:
    opacity 240ms ease,
    transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
    filter 240ms ease;
}

.panel-slide-enter-from {
  opacity: 0;
  transform: translateX(22px) scale(0.985);
  filter: blur(4px);
}

.panel-slide-leave-to {
  opacity: 0;
  transform: translateX(-18px) scale(0.985);
  filter: blur(4px);
}

.time-switch-enter-active,
.time-switch-leave-active {
  transition:
    opacity 200ms ease,
    transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.time-switch-enter-from {
  opacity: 0;
  transform: translateY(8px) scale(0.985);
}

.time-switch-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.985);
}

.hero-image-enter-active,
.hero-image-leave-active {
  transition:
    opacity 240ms ease,
    transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
}

.hero-image-enter-from {
  opacity: 0;
  transform: scale(1.04);
}

.hero-image-leave-to {
  opacity: 0;
  transform: scale(0.985);
}

.step-copy-enter-active,
.step-copy-leave-active {
  transition:
    opacity 220ms ease,
    transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
}

.step-copy-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.step-copy-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.receipt-pop-enter-active,
.receipt-pop-leave-active {
  transition:
    opacity 240ms ease,
    transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
}

.receipt-pop-enter-from,
.receipt-pop-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.985);
}

@keyframes select-pulse {
  0% {
    filter: brightness(1);
  }

  45% {
    filter: brightness(1.035);
  }

  100% {
    filter: brightness(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 1ms !important;
    scroll-behavior: auto !important;
    transition-duration: 1ms !important;
  }
}
</style>