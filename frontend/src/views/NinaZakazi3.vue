<template>
  <main class="bkx-page">
    <header class="bkx-navbar">
      <!-- <button class="bkx-nav-btn" type="button" aria-label="Nazad">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button> -->

      <div class="bkx-brand">
        <img :src="logoImage" alt="Beautiful Life" />
        <div>
          <h1>Beautiful Life</h1>
          <p>Hair Salon</p>
        </div>
      </div>

      <button class="bkx-nav-btn bkx-notification-btn" type="button" aria-label="Notifikacije">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
        </svg>
        </button>
    </header>

    <section class="bkx-hero">
        <button @click="goToWelcome" class="bkx-hero-back" type="button" aria-label="Nazad">
        <svg viewBox="0 0 24 24" fill="none">
            <path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            stroke-width="2.35"
            stroke-linecap="round"
            stroke-linejoin="round"
            />
        </svg>
        </button>
      <div class="bkx-hero__bg">
        <img
          src="../assets/img/hero-zakaz.png"
          alt="Salon"
        />
      </div>

      <div class="bkx-hero__overlay"></div>

      <div class="bkx-hero__content">
        <div class="bkx-hero__eyebrow">
          <span></span>
          Online rezervacija
        </div>

        <h2>Zakaži svoj tretman</h2>
        <p>Izaberi salon, oblast, dan, specijalistu i slobodan termin.</p>
      </div>
    </section>

    <section
    ref="statusRef"
    class="bkx-status"
    >
        <div class="bkx-status__ring">
  <svg viewBox="0 0 42 42">
    <circle
      class="bkx-status__ring-bg"
      cx="21"
      cy="21"
      r="18"
    />

    <circle
      class="bkx-status__ring-fill"
      :class="{ 'is-zero': progressPercent === 0 }"
      cx="21"
      cy="21"
      r="18"
      pathLength="100"
      stroke-dasharray="100"
      :stroke-dashoffset="100 - progressPercent"
    />
  </svg>

  <strong>{{ progressPercent }}%</strong>
</div>

        <div class="bkx-status__content">
            <span>Trenutni korak</span>
            <h3>{{ statusTitle }}</h3>
            <p>{{ statusText }}</p>
        </div>
        </section>



<section class="bkx-salon-section">
  <div class="bkx-salon-section-head">
    <div class="bkx-step-badge">01</div>
    <div>
      <h3>Izaberi salon</h3>
      <p>Tri Beautiful Life lokacije</p>
    </div>
  </div>

  <div class="bkx-salon-scroll">
    <button
      v-for="salon in salons"
      :key="salon.id"
      class="bkx-salon-card"
      :class="{ 'is-active': selectedSalonId === salon.id }"
      type="button"
      @click="selectSalon(salon.id)"
    >
      <img :src="salon.image" :alt="salon.name" />

      <div class="bkx-salon-card__shade"></div>

      <div class="bkx-salon-card__content">
        <span>{{ salon.tag }}</span>
        <h4>{{ salon.name }}</h4>
        <p>{{ salon.address }}</p>

        <div>
          <small>{{ salon.hours }}</small>
          <strong>{{ salon.distance }}</strong>
        </div>
      </div>

      <div class="bkx-salon-card__mark">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M20 6L9 17L4 12"
            stroke="currentColor"
            stroke-width="2.7"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </button>
  </div>
</section>

    <section class="bkx-area-section" :class="{ 'is-muted': !selectedSalon }">
      <div class="bkx-section-head">
        <div class="bkx-step-badge">02</div>
        <div>
          <h3>Izaberi oblast</h3>
          <p>Frizer, nokti, pedikir ili šminkanje</p>
        </div>
      </div>

      <div class="bkx-area-grid">
        <button
          v-for="category in categories"
          :key="category.id"
          class="bkx-area-card"
          :class="{ 'is-active': selectedCategoryId === category.id }"
          type="button"
          :disabled="!selectedSalon"
          @click="selectCategory(category.id)"
        >
          <img :src="category.image" :alt="category.name" />

          <div class="bkx-area-card__shade"></div>

          <div class="bkx-area-card__content">
            <span>{{ category.kicker }}</span>
            <h4>{{ category.name }}</h4>
            <p>{{ category.description }}</p>
            </div>

            <div class="bkx-area-card__mark">
            <svg viewBox="0 0 24 24" fill="none">
                <path
                d="M20 6L9 17L4 12"
                stroke="currentColor"
                stroke-width="2.7"
                stroke-linecap="round"
                stroke-linejoin="round"
                />
            </svg>
            </div>
        </button>
      </div>
    </section>

    <section v-if="selectedCategory && needsServiceChoice" class="bkx-wide-service">
      <div class="bkx-wide-head">
        <div class="bkx-step-badge">03</div>
        <div>
          <h3>{{ serviceTitle }}</h3>
          <p>{{ serviceSubtitle }}</p>
        </div>
      </div>

      <div class="bkx-service-list">
<button
  v-for="service in visibleServices"
  :key="service.id"
  class="bkx-service-row"
  :class="{ 'is-active': selectedServiceId === service.id }"
  type="button"
  @click="selectService(service.id)"
>
  <div class="bkx-service-row__rail"></div>

  <div class="bkx-service-row__content">
    <h4>{{ service.name }}</h4>
    <p>{{ service.text }}</p>
    <span>{{ service.duration }} min</span>
  </div>

  <div class="bkx-service-row__check">
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M20 6L9 17L4 12"
        stroke="currentColor"
        stroke-width="2.7"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</button>
      </div>

      <div v-if="selectedCategoryId === 'nails' && selectedServiceId" class="bkx-nails">
        <div class="bkx-nails__head">
            <h4>Oblik / završnica</h4>
            <p>Izaberi završni stil noktiju</p>
        </div>

        <div class="bkx-nails__grid">
            <button
            v-for="shape in nailShapes"
            :key="shape.id"
            class="bkx-nail"
            :class="{ 'is-active': selectedNailShapeId === shape.id }"
            type="button"
            @click="selectedNailShapeId = shape.id"
            >
            <img :src="shape.image" :alt="shape.name" />

            <div class="bkx-nail__shade"></div>

            <div class="bkx-nail__content">
                <h5>{{ shape.name }}</h5>
                <p>{{ shape.text }}</p>
            </div>

            <div class="bkx-nail__mark">
                <svg viewBox="0 0 24 24" fill="none">
                <path
                    d="M20 6L9 17L4 12"
                    stroke="currentColor"
                    stroke-width="2.7"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
                </svg>
            </div>
            </button>
        </div>
        </div>
    </section>

    <section class="bkx-date-strip-section" :class="{ 'is-muted': !canChooseDay }">
  <div class="bkx-section-head">
    <div class="bkx-step-badge">{{ needsServiceChoice ? '04' : '03' }}</div>
    <div>
      <h3>Izaberi dan</h3>
      <p>Narednih 14 dostupnih dana</p>
    </div>
  </div>

  <div class="bkx-date-strip">
    <button
      v-for="day in nextAvailableDays"
      :key="day.id"
      class="bkx-date-pill"
      :class="{ 'is-active': selectedDayId === day.id }"
      type="button"
      :disabled="!canChooseDay || !day.available"
      @click="selectDay(day.id)"
    >
      <span>{{ day.weekday }}</span>
      <strong>{{ day.day }}</strong>
      <small>{{ day.month }}</small>

      <em>{{ day.slots }} termina</em>
    </button>
  </div>
</section>

    <section class="bkx-specialist-section" :class="{ 'is-muted': !selectedDay }">
  <div class="bkx-section-head">
    <div class="bkx-step-badge">{{ needsServiceChoice ? '05' : '04' }}</div>
    <div>
      <h3>Specijalista</h3>
      <p>{{ specialistInfo }}</p>
    </div>
  </div>

  <div class="bkx-specialist-grid">
    <button
      v-for="person in filteredSpecialists"
      :key="person.id"
      class="bkx-specialist"
      :class="{ 'is-active': selectedSpecialistId === person.id }"
      type="button"
      :disabled="!selectedDay"
      @click="selectSpecialist(person.id)"
    >
      <div class="bkx-specialist__image">
        <img :src="person.image" :alt="person.name" />

        <div class="bkx-specialist__check">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M20 6L9 17L4 12"
              stroke="currentColor"
              stroke-width="2.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>

      <div class="bkx-specialist__body">
        <h4>{{ person.name }}</h4>
        <p>{{ person.role }}</p>

<div class="bkx-specialist__rating">
  <div class="bkx-specialist__stars" aria-hidden="true">
    <span
      v-for="(star, index) in getRatingStars(person.rating)"
      :key="index"
      class="bkx-specialist__star"
      :class="`is-${star}`"
    >
      ★
    </span>
  </div>

  <strong>{{ person.rating }}</strong>
</div>
      </div>
    </button>
  </div>
</section>

<section class="bkx-time-section" :class="{ 'is-muted': !selectedSpecialist }">
  <div class="bkx-section-head">
    <div class="bkx-step-badge">{{ needsServiceChoice ? '06' : '05' }}</div>
    <div>
      <h3>Termin</h3>
      <p>Slobodni termini</p>
    </div>
  </div>

  <div class="bkx-time-tabs">
    <div
      class="bkx-time-tabs__thumb"
      :class="{ 'is-afternoon': activePeriod === 'afternoon' }"
    ></div>

    <button
      type="button"
      :class="{ 'is-active': activePeriod === 'morning' }"
      :disabled="!selectedSpecialist"
      @click="activePeriod = 'morning'"
    >
      Prepodne
      <span>{{ morningTimes.length }}</span>
    </button>

    <button
      type="button"
      :class="{ 'is-active': activePeriod === 'afternoon' }"
      :disabled="!selectedSpecialist"
      @click="activePeriod = 'afternoon'"
    >
      Popodne
      <span>{{ afternoonTimes.length }}</span>
    </button>
  </div>

  <div class="bkx-time-grid">
    <button
      v-for="time in visibleTimes"
      :key="time"
      class="bkx-time"
      :class="{ 'is-active': selectedTime === time }"
      type="button"
      :disabled="!selectedSpecialist"
      @click="selectedTime = time"
    >
      {{ time }}
    </button>
  </div>
</section>
    <div class="bkx-safe"></div>

    <footer class="bkx-bottom">
    <div class="bkx-bottom__step">
        <p>Trenutni korak</p>
        <span>{{ bottomTitle }}</span>
    </div>

    <button type="button" :disabled="!canConfirm" @click="showConfirm = true">
        Potvrdi
    </button>
    </footer>

    <div v-if="showConfirm" class="bkx-overlay" @click.self="showConfirm = false">
      <div class="bkx-sheet">
        <div class="bkx-sheet__icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>

        <h3>Termin je spreman</h3>
        <p>{{ bottomText }}</p>

        <button type="button" @click="showConfirm = false">Zatvori</button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';

import { useRouter } from 'vue-router';

const router = useRouter();

function goToWelcome() {
  router.push('/beautiful-life');
}

type StarState = 'full' | 'half' | 'empty';

function getRatingStars(rating: string | number): StarState[] {
  const value = Number(rating);
  const stars: StarState[] = [];

  for (let i = 1; i <= 5; i += 1) {
    if (value >= i) {
      stars.push('full');
    } else if (value >= i - 0.5) {
      stars.push('half');
    } else {
      stars.push('empty');
    }
  }

  return stars;
}

type CategoryId = 'male_hair' | 'female_hair' | 'nails' | 'pedicure' | 'makeup';

type Salon = {
  id: number;
  name: string;
  address: string;
  hours: string;
  distance: string;
  tag: string;
  image: string;
};

type Category = {
  id: CategoryId;
  name: string;
  kicker: string;
  description: string;
  image: string;
  needsService: boolean;
};

type Service = {
  id: string;
  categoryId: CategoryId;
  name: string;
  text: string;
  duration: number;
};

type CalendarDay = {
  id: string;
  day: string;
  weekday: string;
  month: string;
  available: boolean;
  slots: number;
  isToday?: boolean;
};

type Specialist = {
  id: number;
  name: string;
  role: string;
  rating: string;
  experience: string;
  categoryIds: CategoryId[];
  image: string;
};

import logoImage from '@/assets/img/ninalogofinal.png';

const selectedSalonId = ref<number | null>(null);
const selectedCategoryId = ref<CategoryId | null>(null);
const selectedServiceId = ref<string | null>(null);
const selectedNailShapeId = ref<string | null>(null);
const selectedDayId = ref<string | null>(null);
const selectedSpecialistId = ref<number | null>(null);
const selectedTime = ref<string | null>(null);
const activePeriod = ref<'morning' | 'afternoon'>('morning');
const showConfirm = ref(false);

const salons: Salon[] = [
  {
    id: 1,
    name: 'BL Centar',
    address: 'Kolubarska 12',
    hours: '09:00 — 20:00',
    distance: '0.6 km',
    tag: 'Najbliži',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'BL Studio',
    address: 'Urosa Mladenovica 33',
    hours: '10:00 — 21:00',
    distance: '1.4 km',
    tag: 'Popularno',
    image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'BL Premium',
    address: '5. Oktobra 28',
    hours: '08:00 — 19:00',
    distance: '2.1 km',
    tag: 'Premium',
    image: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?q=80&w=900&auto=format&fit=crop',
  },
];

const categories: Category[] = [
  {
    id: 'male_hair',
    name: 'Muški deo',
    kicker: 'Hair',
    description: 'Šišanje, fade, skin fade i brada',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=900&auto=format&fit=crop',
    needsService: true,
  },
  {
    id: 'female_hair',
    name: 'Ženski deo',
    kicker: 'Style',
    description: 'Žensko šišanje bez dodatnog izbora',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=900&auto=format&fit=crop',
    needsService: false,
  },
  {
    id: 'nails',
    name: 'Nokti',
    kicker: 'Nails',
    description: 'Korekcija, novi set, oblik i french',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=900&auto=format&fit=crop',
    needsService: true,
  },
  {
    id: 'pedicure',
    name: 'Pedikir',
    kicker: 'Care',
    description: 'Klasičan, spa ili gel pedikir',
    image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=900&auto=format&fit=crop',
    needsService: true,
  },
  {
    id: 'makeup',
    name: 'Šminkanje',
    kicker: 'Makeup',
    description: 'Dnevna, večernja i svečana šminka',
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=900&auto=format&fit=crop',
    needsService: true,
  },
];

const services: Service[] = [
  {
    id: 'classic_cut',
    categoryId: 'male_hair',
    name: 'Klasično šišanje',
    text: 'Uredna forma i završno stilizovanje',
    duration: 30,
  },
  {
    id: 'fade',
    categoryId: 'male_hair',
    name: 'Fade',
    text: 'Precizan prelaz i moderno oblikovanje',
    duration: 40,
  },
  {
    id: 'skin_fade',
    categoryId: 'male_hair',
    name: 'Skin fade',
    text: 'Najčistiji prelaz sa detaljima',
    duration: 45,
  },
  {
    id: 'beard',
    categoryId: 'male_hair',
    name: 'Brada + konture',
    text: 'Oblikovanje brade i linija',
    duration: 25,
  },
  {
    id: 'new_set',
    categoryId: 'nails',
    name: 'Novi set',
    text: 'Kompletan novi set noktiju',
    duration: 90,
  },
  {
    id: 'correction',
    categoryId: 'nails',
    name: 'Korekcija',
    text: 'Dopuna i sređivanje postojećeg seta',
    duration: 70,
  },
  {
    id: 'gel',
    categoryId: 'nails',
    name: 'Gel lak',
    text: 'Prirodan izgled sa trajnim sjajem',
    duration: 50,
  },
  {
    id: 'classic_pedicure',
    categoryId: 'pedicure',
    name: 'Klasičan pedikir',
    text: 'Osnovna nega stopala i noktiju',
    duration: 45,
  },
  {
    id: 'spa_pedicure',
    categoryId: 'pedicure',
    name: 'Spa pedikir',
    text: 'Dubinska nega i relaks tretman',
    duration: 60,
  },
  {
    id: 'gel_pedicure',
    categoryId: 'pedicure',
    name: 'Pedikir + gel lak',
    text: 'Nega stopala uz završni gel lak',
    duration: 70,
  },
  {
    id: 'daily_makeup',
    categoryId: 'makeup',
    name: 'Dnevna šminka',
    text: 'Prirodno, čisto i elegantno',
    duration: 45,
  },
  {
    id: 'evening_makeup',
    categoryId: 'makeup',
    name: 'Večernja šminka',
    text: 'Naglašeniji look za izlazak',
    duration: 60,
  },
  {
    id: 'formal_makeup',
    categoryId: 'makeup',
    name: 'Svečana šminka',
    text: 'Za proslave, mature i događaje',
    duration: 75,
  },
  {
    id: 'bridal_makeup',
    categoryId: 'makeup',
    name: 'Bridal makeup',
    text: 'Premium šminka za venčanje',
    duration: 90,
  },
];

const nailShapes = [
  {
    id: 'square',
    name: 'Kocka',
    text: 'Ravan i elegantan oblik',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'almond',
    name: 'Badem',
    text: 'Nežan izdužen oblik',
    image: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'french',
    name: 'French',
    text: 'Klasičan čist završetak',
    image: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?q=80&w=900&auto=format&fit=crop',
  },
   {
  id: 'coffin',
  name: 'Coffin',
  text: 'Moderan premium oblik',
  image: 'https://images.unsplash.com/photo-1604902396830-aca29e19b067?q=80&w=900&auto=format&fit=crop',
},
];



const monthShortLabels = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Maj',
  'Jun',
  'Jul',
  'Avg',
  'Sep',
  'Okt',
  'Nov',
  'Dec',
];

const weekdayShortLabels = ['Ned', 'Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub'];

function formatDateId(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function isToday(date: Date) {
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

const nextAvailableDays = computed<CalendarDay[]>(() => {
  const today = new Date();

  return Array.from({ length: 14 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);

    return {
      id: formatDateId(date),
      day: String(date.getDate()),
      weekday: weekdayShortLabels[date.getDay()],
      month: monthShortLabels[date.getMonth()],
      available: true,
      slots: Math.floor(Math.random() * 7) + 2,
      isToday: isToday(date),
    };
  });
});

const specialists: Specialist[] = [
  {
  id: 1,
  name: 'Marko',
  role: 'Muški frizer',
  rating: '4.5',
  experience: '6 god.',
  categoryIds: ['male_hair'],
  image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop',
},
  {
    id: 2,
    name: 'Nikola',
    role: 'Fade specijalista',
    rating: '4.8',
    experience: '5 god.',
    categoryIds: ['male_hair'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
  },

  {
    id: 3,
    name: 'Nina',
    role: 'Hair stylist',
    rating: '5.0',
    experience: '8 god.',
    categoryIds: ['female_hair'],
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 4,
    name: 'Milica',
    role: 'Ženski frizer',
    rating: '4.7',
    experience: '6 god.',
    categoryIds: ['female_hair'],
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=600&auto=format&fit=crop',
  },

  {
    id: 5,
    name: 'Sara',
    role: 'Nail artist',
    rating: '4.9',
    experience: '5 god.',
    categoryIds: ['nails'],
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 6,
    name: 'Teodora',
    role: 'Manikir specijalista',
    rating: '4.6',
    experience: '4 god.',
    categoryIds: ['nails'],
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop',
  },

  {
    id: 7,
    name: 'Jelena',
    role: 'Pedikir specijalista',
    rating: '4.8',
    experience: '7 god.',
    categoryIds: ['pedicure'],
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 8,
    name: 'Ana',
    role: 'Spa pedikir',
    rating: '4.5',
    experience: '3 god.',
    categoryIds: ['pedicure'],
    image: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=600&auto=format&fit=crop',
  },

  {
    id: 9,
    name: 'Jovana',
    role: 'Makeup artist',
    rating: '5.0',
    experience: '7 god.',
    categoryIds: ['makeup'],
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 10,
    name: 'Tamara',
    role: 'Bridal makeup',
    rating: '4.9',
    experience: '6 god.',
    categoryIds: ['makeup'],
    image: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?q=80&w=600&auto=format&fit=crop',
  },
];

const morningTimes = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
const afternoonTimes = ['12:30', '13:00', '14:00', '15:30', '16:00', '17:30', '18:00'];

const selectedSalon = computed(() => salons.find((salon) => salon.id === selectedSalonId.value) ?? null);
const selectedCategory = computed(() => categories.find((category) => category.id === selectedCategoryId.value) ?? null);
const selectedService = computed(() => services.find((service) => service.id === selectedServiceId.value) ?? null);
const selectedDay = computed(() => {
  return nextAvailableDays.value.find((day) => day.id === selectedDayId.value) ?? null;
});
const selectedSpecialist = computed(() => specialists.find((person) => person.id === selectedSpecialistId.value) ?? null);

const needsServiceChoice = computed(() => selectedCategory.value?.needsService === true);

const visibleServices = computed(() => {
  if (!selectedCategoryId.value) return [];
  return services.filter((service) => service.categoryId === selectedCategoryId.value);
});

const filteredSpecialists = computed(() => {
  if (!selectedCategoryId.value) return [];
  return specialists.filter((person) => person.categoryIds.includes(selectedCategoryId.value as CategoryId));
});

const canChooseDay = computed(() => {
  if (!selectedCategory.value) return false;

  if (!selectedCategory.value.needsService) {
    return true;
  }

  if (selectedCategory.value.id === 'nails') {
    return Boolean(selectedService.value && selectedNailShapeId.value);
  }

  return Boolean(selectedService.value);
});

const visibleTimes = computed(() => {
  return activePeriod.value === 'morning' ? morningTimes : afternoonTimes;
});

const canConfirm = computed(() => {
  return Boolean(
    selectedSalon.value &&
    selectedCategory.value &&
    canChooseDay.value &&
    selectedDay.value &&
    selectedSpecialist.value &&
    selectedTime.value,
  );
});

const completedCount = computed(() => {
  let count = 0;

  if (selectedSalon.value) count += 1;
  if (selectedCategory.value) count += 1;
  if (canChooseDay.value) count += 1;
  if (selectedDay.value) count += 1;
  if (selectedSpecialist.value && selectedTime.value) count += 1;

  return count;
});

const progressPercent = computed(() => Math.round((completedCount.value / 5) * 100));

const statusTitle = computed(() => {
  if (!selectedSalon.value) return 'Izaberi salon';
  if (!selectedCategory.value) return 'Izaberi oblast';
  if (!canChooseDay.value) return 'Izaberi detalje usluge';
  if (!selectedDay.value) return 'Izaberi dan';
  if (!selectedSpecialist.value) return 'Izaberi specijalistu';
  if (!selectedTime.value) return 'Izaberi termin';
  return 'Možete potvrditi termin';
});

const statusText = computed(() => {
  if (canConfirm.value) {
    return 'Sve je izabrano. Možete da potvrdite svoj termin.';
  }

  return 'Pratimo tvoj trenutni korak i vodimo te kroz rezervaciju.';
});

const serviceTitle = computed(() => {
  if (selectedCategoryId.value === 'male_hair') return 'Usluga šišanja';
  if (selectedCategoryId.value === 'nails') return 'Tip noktiju';
  if (selectedCategoryId.value === 'pedicure') return 'Tip pedikira';
  if (selectedCategoryId.value === 'makeup') return 'Vrsta šminkanja';
  return 'Usluga';
});

const serviceSubtitle = computed(() => {
  if (selectedCategoryId.value === 'male_hair') return 'Klasično, fade, skin fade ili brada';
  if (selectedCategoryId.value === 'nails') return 'Korekcija, novi set, gel lak i oblik';
  if (selectedCategoryId.value === 'pedicure') return 'Klasičan, spa ili gel pedikir';
  if (selectedCategoryId.value === 'makeup') return 'Dnevna, večernja, svečana ili bridal';
  return 'Izaberi detalje usluge';
});

const specialistInfo = computed(() => {
  if (!selectedCategory.value) return 'Prvo izaberi oblast';
  return `Za: ${selectedCategory.value.name}`;
});

const bottomTitle = computed(() => {
  if (!selectedSalon.value) return 'Izaberi salon';
  if (!selectedCategory.value) return 'Izaberi oblast';
  if (!canChooseDay.value) return 'Izaberi detalje';
  if (!selectedDay.value) return 'Izaberi dan';
  if (!selectedSpecialist.value) return 'Izaberi specijalistu';
  if (!selectedTime.value) return 'Izaberi termin';
  return 'Spremno za potvrdu';
});

const bottomText = computed(() => {
  const items = [
    selectedSalon.value?.name,
    selectedCategory.value?.name,
    selectedService.value?.name,
    selectedDay.value ? `${selectedDay.value.day}. april` : null,
    selectedSpecialist.value?.name,
    selectedTime.value,
  ].filter(Boolean);

  return items.length ? items.join(' · ') : 'Beautiful Life online rezervacija';
});

function selectSalon(id: number) {
  selectedSalonId.value = id;
  selectedCategoryId.value = null;
  selectedServiceId.value = null;
  selectedNailShapeId.value = null;
  selectedDayId.value = null;
  selectedSpecialistId.value = null;
  selectedTime.value = null;
}

function selectCategory(id: CategoryId) {
  selectedCategoryId.value = id;
  selectedServiceId.value = null;
  selectedNailShapeId.value = null;
  selectedDayId.value = null;
  selectedSpecialistId.value = null;
  selectedTime.value = null;
  activePeriod.value = 'morning';
}

function selectService(id: string) {
  selectedServiceId.value = id;
  selectedDayId.value = null;
  selectedSpecialistId.value = null;
  selectedTime.value = null;
}

function selectDay(id: string) {
  selectedDayId.value = id;
  selectedSpecialistId.value = null;
  selectedTime.value = null;
}

function selectSpecialist(id: number) {
  selectedSpecialistId.value = id;
  selectedTime.value = null;
}


</script>

<style scoped lang="scss">
.bkx-page {
  min-height: 100vh;
  padding: 22px 12px 0;
  color: #191814;
  background:
    radial-gradient(circle at 50% -10%, rgba(158, 176, 136, 0.22), transparent 34%),
    linear-gradient(180deg, #fbf7ef 0%, #f7f0e5 46%, #efe5d6 100%);
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

button {
  font: inherit;
  -webkit-tap-highlight-color: transparent;
}

.bkx-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 5px;
}

.bkx-nav-btn {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  flex: 0 0 42px;
  border: 0;
  border-radius: 50%;
  color: #191814;
  background: rgba(230, 221, 205, 0.8);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.74),
    0 10px 24px rgba(55, 47, 34, 0.07);

  svg {
    width: 23px;
    height: 23px;
  }

}

.bkx-brand {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;

  img {
    width: 60px;
    height: 46px;
    object-fit: contain;
  }

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

.bkx-hero {
  position: relative;
  overflow: hidden;
  min-height: 390px;
  margin-top: 22px;
  border-radius: 38px;
  box-shadow: 0 24px 58px rgba(67, 72, 49, 0.2);
  z-index: 1;
}

.bkx-hero-back {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 5;

  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;

  border: 0;
  border-radius: 50%;

  color: #fff8ea;
  background: rgba(18, 16, 12, 0.22);

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    0 12px 24px rgba(18, 16, 12, 0.18);

  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);

  transition:
    transform 0.16s ease,
    background 0.18s ease,
    box-shadow 0.18s ease;

  svg {
    width: 23px;
    height: 23px;
  }

  &:active {
    transform: scale(0.94);
    background: rgba(18, 16, 12, 0.32);
  }
}

.bkx-hero__bg {
  position: absolute;
  inset: 0;

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }
}

.bkx-hero__overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(12, 14, 10, 0.08) 0%, rgba(12, 14, 10, 0.34) 44%, rgba(12, 14, 10, 0.78) 100%),
    radial-gradient(circle at 18% 12%, rgba(255, 255, 255, 0.22), transparent 24%);
}

.bkx-hero__content {
  position: absolute;
  left: 22px;
  right: 22px;
  bottom: 24px;
  color: #fff8ea;
  margin-bottom: 80px;
  
//   border: 1px solid red;

  h2 {
    max-width: 320px;
    margin: 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 48px;
    line-height: 0.92;
    font-weight: 500;
    letter-spacing: -0.085em;
  }

  p {
    max-width: 310px;
    margin: 15px 0 0;
    color: rgba(255, 248, 234, 0.72);
    font-size: 15px;
    line-height: 1.42;
    font-weight: 650;
    width: 70%;
  }
}

.bkx-hero__eyebrow {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 16px;
  color: rgba(255, 248, 234, 0.76);
  font-size: 11px;
  font-weight: 950;
  letter-spacing: 0.2em;
  text-transform: uppercase;

  span {
    width: 34px;
    height: 1px;
    background: rgba(255, 248, 234, 0.6);
  }
}

.bkx-status {
    position: relative;
    margin-top: 14px;
    padding: 17px;
    border-radius: 29px;
    background: rgba(255, 252, 246, 1);
    box-shadow:
        0 16px 34px rgba(55, 47, 34, 0.07),
        inset 0 1px 0 rgba(255, 255, 255, 0.76);
        // border: 1px solid red;
    // margin-top: -70px;
    z-index: 130;
    width: 80%;
    margin: -70px auto 0 auto;
}

.bkx-status {
  position: relative;
  z-index: 130;

  width: 84%;
  min-height: 86px;
  display: grid;
  grid-template-columns: 62px 1fr;
  align-items: center;
  gap: 13px;

  margin: -70px auto 0;
  padding: 12px;

  border-radius: 26px;
  background: rgba(255, 250, 241, 0.96);

  box-shadow:
    0 18px 42px rgba(52, 43, 28, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.76);

  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);

}

.bkx-status__ring {
  position: relative;
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  flex: 0 0 58px;

  svg {
    width: 58px;
    height: 58px;
    transform: rotate(-90deg);
  }

  circle {
    fill: none;
    stroke-width: 4;
    stroke-linecap: round;
  }

  .bkx-status__ring-bg {
    stroke: #eee4d6;
  }

  .bkx-status__ring-fill {
    stroke: #6b8159;
    opacity: 1;
    transition:
      stroke-dashoffset 0.35s cubic-bezier(0.22, 1, 0.36, 1),
      opacity 0.15s ease;
  }

  .bkx-status__ring-fill.is-zero {
    opacity: 0;
  }

  strong {
    position: absolute;
    color: #171410;
    font-size: 12px;
    font-weight: 950;
    letter-spacing: -0.03em;
  }
}

.bkx-status__content {
  min-width: 0;

  span {
    display: block;
    color: #7b8f66;
    font-size: 10px;
    font-weight: 950;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  h3 {
    margin: 5px 0 0;
    color: #191814;
    font-size: 17px;
    line-height: 1.05;
    font-weight: 950;
    letter-spacing: -0.045em;
  }

  p {
    margin: 6px 0 0;
    color: rgba(25, 24, 20, 0.58);
    font-size: 12px;
    line-height: 1.28;
    font-weight: 700;
  }
}

.bkx-status p {
  margin: 11px 0 0;
  color: rgba(25, 24, 20, 0.58);
  font-size: 13px;
  line-height: 1.35;
  font-weight: 700;
}

.bkx-status {
  transition:
    width 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    margin 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    border-radius 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    padding 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    min-height 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.24s ease,
    background 0.24s ease;
}



.bkx-section {
  margin-top: 50px;
//   border: 1px solid red;
  padding: 17px;
  border-radius: 31px;
  background: rgba(255, 252, 246, 0.82);
  box-shadow:
    0 14px 34px rgba(55, 47, 34, 0.055),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);
  transition: opacity 0.2s ease;

  &.is-muted {
    opacity: 0.46;
  }
}


.bkx-area-section {
  margin-top: 40px;
  padding: 0 5px;
  background: transparent;
  box-shadow: none;
  border-radius: 0;
  transition: opacity 0.2s ease;

  &.is-muted {
    opacity: 0.46;
  }

  .bkx-section-head {
    margin-bottom: 15px;
  }
}

.bkx-salon-section{
    margin-top: 36px;
    padding: 0;
    background: transparent;
    box-shadow: none;
    border-radius: 0;
    padding: 0 20px;
}

.bkx-salon-section-head{
    display: grid;
  grid-template-columns: 42px 1fr;
  gap: 12px;
  align-items: center;
  margin-bottom: 15px;
//   border: 1px solid red;
  margin-inline: -17px;

  h3 {
    margin: 0;
    color: #191814;
    font-size: 18px;
    line-height: 1;
    font-weight: 750;
    letter-spacing: -0.055em;
  }

  p {
    margin: 5px 0 0;
    color: rgba(25, 24, 20, 0.55);
    font-size: 12px;
    font-weight: 700;
  }
}

.bkx-step-badge {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 17px;
  color: #fff8ea;
  background: linear-gradient(180deg, #8ea476 0%, #667d52 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.22),
    0 10px 22px rgba(102, 125, 82, 0.18);
  font-size: 12px;
  font-weight: 950;
}

.bkx-section-head,
.bkx-wide-head {
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 12px;
  align-items: center;
  margin-bottom: 15px;

  h3 {
    margin: 0;
    color: #191814;
    font-size: 18px;
    line-height: 1;
    font-weight: 750;
    letter-spacing: -0.055em;
  }

  p {
    margin: 5px 0 0;
    color: rgba(25, 24, 20, 0.55);
    font-size: 12px;
    font-weight: 700;
  }
}

.bkx-step-badge {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 17px;
  color: #fff8ea;
  background: linear-gradient(180deg, #8ea476 0%, #667d52 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.22),
    0 10px 22px rgba(102, 125, 82, 0.18);
  font-size: 12px;
  font-weight: 950;
}

.bkx-salon-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  margin-inline: -17px;
  padding: 0 17px 4px;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.bkx-salon-card {
  position: relative;
  width: 245px;
  min-width: 245px;
  height: 280px;
  overflow: hidden;
  border: 0;
  border-radius: 32px;
  text-align: left;
  background: #d8cbb8;
  scroll-snap-align: start;
//   box-shadow: 0 16px 32px rgba(47, 41, 30, 0.11);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:active {
    transform: scale(0.985);
  }

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.bkx-salon-card__shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      180deg,
      rgba(18, 16, 12, 0.04) 0%,
      rgba(18, 16, 12, 0.35) 48%,
      rgba(18, 16, 12, 0.86) 100%
    ),
    radial-gradient(circle at 20% 15%, rgba(255, 255, 255, 0.22), transparent 28%);
}

.bkx-salon-card__content {
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 16px;
  color: #fff8ec;

  > span {
    display: inline-flex;
    margin-bottom: 10px;
    padding: 7px 10px;
    border-radius: 999px;
    color: #1c2116;
    background: #fff3d9;
    font-size: 10px;
    font-weight: 950;
    letter-spacing: 0.13em;
    text-transform: uppercase;
  }

  h4 {
    margin: 0;
    color: #fff8ec;
    font-size: 25px;
    line-height: 0.96;
    font-weight: 800;
    letter-spacing: -0.06em;
  }

  p {
    margin: 8px 0 0;
    color: rgba(255, 248, 236, 0.74);
    font-size: 13px;
    font-weight: 700;
  }

  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 14px;
    gap: 10px;
  }

  small,
  strong {
    font-size: 11px;
    font-weight: 950;
  }

  small {
    color: rgba(255, 248, 236, 0.72);
  }

  strong {
    color: #fff8ec;
  }
}

.bkx-salon-card__mark {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: transparent;
  background: rgba(255, 248, 236, 0.18);
  box-shadow: inset 0 0 0 1px rgba(255, 248, 236, 0.24);
  transition:
    color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;

  svg {
    width: 19px;
    height: 19px;
  }

  .bkx-salon-card.is-active & {
    color: #26311f;
    background: #fff3d9;
    transform: scale(1.04);
  }
}

.bkx-area-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 11px;
}

.bkx-area-card {
  position: relative;
  min-height: 184px;
  overflow: hidden;
  border: 0;
  border-radius: 31px;
  text-align: left;
  background: #dfd5c5;
  box-shadow: 0 14px 30px rgba(55, 47, 34, 0.08);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;

  &:nth-child(1) {
    grid-column: span 2;
    min-height: 162px;
  }

  &:active {
    transform: scale(0.985);
  }

  &:disabled {
    pointer-events: none;
  }

  &.is-active {
    box-shadow:
      0 18px 38px rgba(97, 117, 79, 0.22),
      inset 0 0 0 2px rgba(255, 248, 236, 0.72);
  }

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.bkx-area-card__shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(12, 14, 10, 0.06), rgba(12, 14, 10, 0.74)),
    radial-gradient(circle at 18% 14%, rgba(255, 255, 255, 0.25), transparent 26%);
}

.bkx-area-card__content {
  position: absolute;
  left: 15px;
  right: 15px;
  bottom: 15px;
  color: #fff8ea;

  span {
    display: inline-flex;
    margin-bottom: 8px;
    padding: 6px 9px;
    border-radius: 999px;
    color: #24301f;
    background: #fff2d8;
    font-size: 10px;
    font-weight: 950;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  h4 {
    margin: 0;
    font-size: 23px;
    font-size: 23px;
    line-height: 0.96;
    font-weight: 800;
    letter-spacing: -0.05em;
  }

  p {
    margin: 7px 0 0;
    color: rgba(255, 248, 234, 0.76);
    font-size: 12px;
    line-height: 1.25;
    font-weight: 700;
  }
}
.bkx-area-card__mark {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: transparent;
  background: rgba(255, 248, 236, 0.18);
  box-shadow: inset 0 0 0 1px rgba(255, 248, 236, 0.24);
  transition:
    color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;

  svg {
    width: 19px;
    height: 19px;
  }

  .bkx-area-card.is-active & {
    color: #26311f;
    background: #fff3d9;
    transform: scale(1.04);
  }
}



.bkx-wide-head {
  padding: 0 5px;
}

.bkx-wide-service {
  width: calc(100% + 24px);
  margin: 40px -12px 0;
  padding: 4px 12px 0;
  background: transparent;
  border-radius: 0;
}

.bkx-wide-head {
  padding: 0 5px;
  margin-bottom: 15px;
}

.bkx-service-list {
  display: grid;
  gap: 10px;
}

.bkx-service-row {
  position: relative;
  width: 100%;
  min-height: 82px;

  display: grid;
  grid-template-columns: 8px 1fr 25px;
  align-items: center;
  gap: 13px;

  border: 0;
  padding: 13px 13px 13px 0;
  overflow: hidden;
  border-radius: 24px;
  text-align: left;

  background: rgba(255, 252, 246, 0.92);

  box-shadow:
    0 10px 22px rgba(55, 47, 34, 0.045),
    inset 0 1px 0 rgba(255, 255, 255, 0.78),
    inset 0 0 0 1px rgba(40, 36, 28, 0.045);

  transition: box-shadow 0.18s ease;

  &.is-active {
    background: rgba(255, 252, 246, 0.92);

    box-shadow:
      0 13px 28px rgba(55, 47, 34, 0.065),
      inset 0 1px 0 rgba(255, 255, 255, 0.78),
      inset 0 0 0 1px rgba(102, 125, 82, 0.2);

    .bkx-service-row__content {
      transform: translateX(2px);
    }
  }
}

.bkx-service-row__rail {
  width: 4px;
  height: 46px;
  margin-left: 8px;
  border-radius: 999px;
  background: transparent;

  transition:
    height 0.18s ease,
    background 0.18s ease,
    box-shadow 0.18s ease;

  .bkx-service-row.is-active & {
    height: 54px;
    background: linear-gradient(180deg, #9bad86 0%, #667d52 100%);
    box-shadow: 0 8px 16px rgba(102, 125, 82, 0.22);
  }
}

.bkx-service-row__content {
  min-width: 0;
  transition: transform 0.18s ease;

  h4 {
    margin: 0;
    color: #191814;
    font-size: 15px;
    line-height: 1.05;
    font-weight: 750;
    letter-spacing: -0.035em;
  }

  p {
    margin: 6px 0 0;
    color: rgba(25, 24, 20, 0.55);
    font-size: 12px;
    line-height: 1.28;
    font-weight: 600;
  }

  span {
    display: block;
    margin-top: 7px;
    color: rgba(25, 24, 20, 0.48);
    font-size: 11px;
    font-weight: 950;
  }

  .bkx-service-row.is-active & span {
    color: #667d52;
  }
}

.bkx-service-row__check {
  width: 20px;
  height: 20px;
  display: grid;
  place-items: center;
  border-radius: 50%;

  color: transparent;
  background: rgba(25, 24, 20, 0.06);
  box-shadow: inset 0 0 0 1px rgba(25, 24, 20, 0.08);

  transition:
    color 0.18s ease,
    background 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;

  svg {
    width: 10px;
    height: 10px;
  }

  .bkx-service-row.is-active & {
    color: #fff8ea;
    background: #667d52;
    box-shadow:
      0 8px 16px rgba(102, 125, 82, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.22);
    transform: scale(1.04);
  }
}

.bkx-nails {
  margin-top: 18px;
  padding: 0;
  background: transparent;
  border-radius: 0;
}

.bkx-nails__head {
  margin: 0 5px 12px;

  h4 {
    margin: 0;
    color: #191814;
    font-size: 16px;
    line-height: 1;
    font-weight: 750;
    letter-spacing: -0.055em;
  }

  p {
    margin: 5px 0 0;
    color: rgba(25, 24, 20, 0.55);
    font-size: 12px;
    font-weight: 700;
  }
}

.bkx-nails__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 11px;
}

.bkx-nail {
  position: relative;
  min-height: 162px;
  overflow: hidden;
  border: 0;
  border-radius: 31px;
  padding: 0;
  text-align: left;
  background: #dfd5c5;
  box-shadow: 0 14px 30px rgba(55, 47, 34, 0.08);

  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;

  &:active {
    transform: scale(0.985);
  }

  &.is-active {
    box-shadow:
      0 18px 38px rgba(97, 117, 79, 0.22),
      inset 0 0 0 2px rgba(255, 248, 236, 0.72);
  }

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.bkx-nail__shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      180deg,
      rgba(18, 16, 12, 0.05) 0%,
      rgba(18, 16, 12, 0.28) 42%,
      rgba(18, 16, 12, 0.82) 100%
    ),
    radial-gradient(circle at 18% 14%, rgba(255, 255, 255, 0.24), transparent 28%);
}

.bkx-nail__content {
  position: absolute;
  left: 15px;
  right: 15px;
  bottom: 15px;
  color: #fff8ea;

  h5 {
    margin: 0;
    color: #fff8ea;
    font-size: 22px;
    line-height: 0.98;
    font-weight: 950;
    letter-spacing: -0.065em;
  }

  p {
    margin: 7px 0 0;
    color: rgba(255, 248, 234, 0.74);
    font-size: 12px;
    line-height: 1.24;
    font-weight: 700;
  }
}

.bkx-nail__mark {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 50%;

  color: transparent;
  background: rgba(255, 248, 236, 0.18);
  box-shadow: inset 0 0 0 1px rgba(255, 248, 236, 0.24);

  transition:
    color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;

  svg {
    width: 19px;
    height: 19px;
  }

  .bkx-nail.is-active & {
    color: #26311f;
    background: #fff3d9;
    transform: scale(1.04);
  }
}

.bkx-date-strip-section {
  margin-top: 36px;
  padding: 0 5px;
  background: transparent;
  box-shadow: none;
  border-radius: 0;
  transition: opacity 0.2s ease;

  &.is-muted {
    opacity: 0.46;
  }

  .bkx-section-head {
    margin-bottom: 15px;
  }
}

.bkx-date-strip {
  display: flex;
  gap: 10px;
  overflow-x: auto;

  padding: 2px 2px 8px;
    margin: 0px !important;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.bkx-date-pill {
  position: relative;

  width: 78px;
  min-width: 78px;
  height: 112px;

  display: flex;
  flex-direction: column;
  align-items: center;

  border: 0;
  border-radius: 26px;
  padding: 11px 8px 9px;

  color: #191814;
  background: rgba(255, 252, 246, 0.86);

//   box-shadow:
//     0 10px 22px rgba(55, 47, 34, 0.045),
//     inset 0 1px 0 rgba(255, 255, 255, 0.76),
//     inset 0 0 0 1px rgba(40, 36, 28, 0.045);

  scroll-snap-align: start;

  transition:
    transform 0.16s ease,
    background 0.18s ease,
    box-shadow 0.18s ease,
    color 0.18s ease;

  &:active {
    transform: scale(0.975);
  }

  span {
    color: rgba(25, 24, 20, 0.42);
    font-size: 10px;
    line-height: 1;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }

  strong {
    margin-top: 11px;
    color: #191814;
    font-size: 30px;
    line-height: 0.9;
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  small {
    margin-top: 7px;
    color: rgba(25, 24, 20, 0.44);
    font-size: 10px;
    line-height: 1;
    font-weight: 850;
    text-transform: uppercase;
  }

  em {
    margin-top: 7px;

    min-width: 58px;
    height: 24px;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    border-radius: 999px;

    color: #667d52;
    background: rgba(232, 239, 220, 0.74);

    font-size: 9px;
    line-height: 1;
    font-weight: 950;
    font-style: normal;
    white-space: nowrap;
  }

  &:active{
        transform: scale(0.975);

  }

  &.is-active {
    color: #fff8ea;
    background: linear-gradient(180deg, #9bad86 0%, #667d52 100%);

    // box-shadow:
    //   0 16px 30px rgba(102, 125, 82, 0.22),
    //   inset 0 1px 0 rgba(255, 255, 255, 0.22),
    //   inset 0 0 0 1px rgba(255, 255, 255, 0.08);


    span,
    small {
      color: rgba(255, 248, 234, 0.72);
    }

    strong {
      color: #fff8ea;
    }

    em {
      color: #26311f;
      background: rgba(255, 248, 234, 0.86);
    }
  }

  &:disabled {
    opacity: 0.4;
    pointer-events: none;
  }
}

.bkx-specialist-section {
  margin-top: 40px;
  padding: 0;
  background: transparent;
  box-shadow: none;
  border-radius: 0;
  transition: opacity 0.2s ease;

  &.is-muted {
    opacity: 0.46;
  }

  .bkx-section-head {
    padding: 0 5px;
    margin-bottom: 15px;
  }
}

.bkx-specialist-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 11px;
}

.bkx-specialist {
  position: relative;
  overflow: hidden;
  min-height: 218px;
  border: 0;
  padding: 0;
  border-radius: 28px;
  text-align: center;

  background: rgba(255, 252, 246, 0.94);

  box-shadow:
    0 12px 26px rgba(55, 47, 34, 0.055),
    inset 0 1px 0 rgba(255, 255, 255, 0.78),
    inset 0 0 0 1px rgba(40, 36, 28, 0.045);

  transition:
    transform 0.16s ease,
    box-shadow 0.18s ease;

  &:disabled {
    pointer-events: none;
  }

  &:active {
    transform: translateY(1px);
  }

  &.is-active {
    box-shadow:
      0 14px 30px rgba(55, 47, 34, 0.075),
      inset 0 1px 0 rgba(255, 255, 255, 0.78),
      inset 0 0 0 2px rgba(102, 125, 82, 0.26);
  }
}

.bkx-specialist__image {
  position: relative;
  width: 100%;
  height: 126px;
  overflow: hidden;
  border-radius: 0;

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, rgba(18, 16, 12, 0.02) 0%, rgba(18, 16, 12, 0.16) 100%),
      radial-gradient(circle at 18% 12%, rgba(255, 255, 255, 0.18), transparent 28%);
    pointer-events: none;
  }
}

.bkx-specialist__body {
  display: grid;
  justify-items: center;
  padding: 13px 9px 14px;

  h4 {
    margin: 0;
    color: #191814;
    font-size: 17px;
    line-height: 1;
    font-weight: 950;
    letter-spacing: -0.045em;
  }

  p {
    margin: 6px 0 0;
    color: rgba(25, 24, 20, 0.52);
    font-size: 11px;
    line-height: 1.2;
    font-weight: 750;
  }
}

.bkx-specialist__rating {
  display: grid;
  justify-items: center;
  gap: 4px;
  margin-top: 10px;
  padding: 0;
  background: transparent;

  strong {
    color: #191814;
    font-size: 12px;
    line-height: 1;
    font-weight: 950;
  }
}

.bkx-specialist__stars {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.bkx-specialist__star {
  position: relative;
  display: inline-block;
  color: rgba(25, 24, 20, 0.18);
  font-size: 17px;
  line-height: 1;

  &.is-full {
    color: #f4b400;
  }

  &.is-half {
    color: rgba(25, 24, 20, 0.18);

    &::before {
      content: "★";
      position: absolute;
      left: 0;
      top: 0;
      width: 50%;
      overflow: hidden;
      color: #f4b400;
    }
  }

  &.is-empty {
    color: rgba(25, 24, 20, 0.18);
  }
}
.bkx-specialist__check {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;

  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 50%;

  color: transparent;
  background: rgba(255, 248, 236, 0.2);
  box-shadow: inset 0 0 0 1px rgba(255, 248, 236, 0.26);

  transition:
    color 0.18s ease,
    background 0.18s ease,
    transform 0.18s ease,
    box-shadow 0.18s ease;

  svg {
    width: 17px;
    height: 17px;
  }

  .bkx-specialist.is-active & {
    color: #fff8ea;
    background: #667d52;
    transform: scale(1.04);
    box-shadow:
      0 8px 16px rgba(102, 125, 82, 0.22),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
}

.bkx-time-section {
  margin-top: 40px;
  padding: 0;
  background: transparent;
  box-shadow: none;
  border-radius: 0;
  transition: opacity 0.2s ease;

  &.is-muted {
    opacity: 0.46;
  }

  .bkx-section-head {
    padding: 0 5px;
    margin-bottom: 15px;
  }
}

.bkx-time-tabs {
  position: relative;
  height: 46px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;

  margin: 0 0 14px;
  padding: 4px;

  border-radius: 999px;
  background: rgba(230, 221, 205, 0.72);

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.56),
    inset 0 0 0 1px rgba(40, 36, 28, 0.045);

  overflow: hidden;

  button {
    position: relative;
    z-index: 2;

    height: 38px;
    border: 0;
    border-radius: 999px;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;

    color: rgba(25, 24, 20, 0.48);
    background: transparent;

    font-size: 12px;
    font-weight: 700;
    letter-spacing: -0.025em;

    transition:
      color 0.2s ease,
      transform 0.16s ease;

    &:disabled {
      pointer-events: none;
    }

    &.is-active {
      color: #fff8ea;
    }

    &:active {
      transform: scale(0.975);
    }

    span {
      min-width: 21px;
      height: 21px;
      display: inline-grid;
      place-items: center;

      border-radius: 999px;
      color: inherit;
      background: rgba(255, 255, 255, 0.16);

      font-size: 10px;
      font-weight: 700;
    }
  }
}

.bkx-time-tabs__thumb {
  position: absolute;
  z-index: 1;
  left: 4px;
  top: 4px;

  width: calc(50% - 4px);
  height: 38px;

  border-radius: 999px;
  background: linear-gradient(180deg, #9bad86 0%, #667d52 100%);

  box-shadow:
    0 10px 20px rgba(102, 125, 82, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.22);

  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);

  &.is-afternoon {
    transform: translateX(100%);
  }
}

.bkx-time-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9px;
  padding: 0 16px;
}

.bkx-time {
  height: 44px;
  border: 0;
  border-radius: 999px;

  color: #191814;
  background: rgba(255, 252, 246, 0.9);

  box-shadow:
    0 9px 18px rgba(55, 47, 34, 0.045),
    inset 0 1px 0 rgba(255, 255, 255, 0.72),
    inset 0 0 0 1px rgba(40, 36, 28, 0.045);

  font-size: 14px;
  font-weight: 700 !important;
  letter-spacing: -0.025em;

  transition:
    transform 0.16s ease,
    color 0.18s ease,
    background 0.18s ease,
    box-shadow 0.18s ease;

  &:disabled {
    pointer-events: none;
  }

  &:active {
    transform: scale(0.975);
  }

  &.is-active {
    color: #fff8ea;
    background: linear-gradient(180deg, #9bad86 0%, #667d52 100%);

    box-shadow:
      0 12px 24px rgba(102, 125, 82, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.22);

    transform: scale(0.975);
  }
}

.bkx-safe {
  height: 120px;
}

.bkx-bottom {
  position: fixed;
  left: 8px;
  right: 8px;
  bottom: 12px;
  z-index: 30;

  display: grid;
  grid-template-columns: 1fr 104px;
  gap: 10px;
  align-items: center;

  padding: 16px 10px 16px 14px;
  border-radius: 28px;

  background: rgba(255, 250, 241, 0.95);

  box-shadow:
    0 18px 44px rgba(45, 39, 29, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.78);

  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);

  button {
    height: 44px;
    border: 0;
    border-radius: 999px;

    color: #fff8ea;
    background: linear-gradient(180deg, #8ea476 0%, #667d52 100%);

    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.18),
      0 10px 20px rgba(102, 125, 82, 0.18);

    font-size: 13px;
    font-weight: 950;
    letter-spacing: -0.02em;

    transition:
      transform 0.16s ease,
      opacity 0.18s ease,
      box-shadow 0.18s ease;

    &:active {
      transform: scale(0.975);
    }

    &:disabled {
      color: rgba(25, 24, 20, 0.34);
      background: rgba(222, 213, 199, 0.9);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.42),
        inset 0 0 0 1px rgba(40, 36, 28, 0.04);
      transform: none;
    }
  }
}

.bkx-bottom__step {
  min-width: 0;

  p {
    margin: 0;
    color: rgba(25, 24, 20, 0.42);
    font-size: 10px;
    line-height: 1;
    font-weight: 950;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  span {
    display: block;
    margin-top: 6px;

    color: #191814;
    font-size: 15px;
    line-height: 1.05;
    font-weight: 950;
    letter-spacing: -0.045em;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.bkx-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: flex-end;
  padding: 12px;
  background: rgba(21, 18, 13, 0.34);
}

.bkx-sheet {
  width: 100%;
  padding: 25px;
  text-align: center;
  border-radius: 34px;
  background: #fffaf1;
  box-shadow: 0 24px 60px rgba(21, 18, 13, 0.25);

  h3 {
    margin: 14px 0 0;
    color: #191814;
    font-size: 26px;
    line-height: 1;
    font-weight: 950;
    letter-spacing: -0.065em;
  }

  p {
    margin: 12px 0 22px;
    color: rgba(25, 24, 20, 0.6);
    font-size: 14px;
    line-height: 1.45;
    font-weight: 700;
  }

  button {
    width: 100%;
    height: 54px;
    border: 0;
    border-radius: 21px;
    color: #fff8ea;
    background: linear-gradient(180deg, #8ea476 0%, #667d52 100%);
    font-size: 14px;
    font-weight: 950;
  }
}

.bkx-sheet__icon {
  width: 62px;
  height: 62px;
  display: grid;
  place-items: center;
  margin: 0 auto;
  border-radius: 23px;
  color: #fff8ea;
  background: linear-gradient(180deg, #8ea476 0%, #667d52 100%);

  svg {
    width: 31px;
    height: 31px;
  }
}

</style>