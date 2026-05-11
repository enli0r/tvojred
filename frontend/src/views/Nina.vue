<template>
  <main class="bl-welcome">
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

      <button
        class="bkx-menu-button"
        type="button"
        :class="{ active: menuOpen }"
        aria-label="Otvori meni"
        @click="toggleMenu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>

    <Teleport to="body">
  <Transition name="bkx-menu-fade">
    <div
      v-if="menuOpen"
      class="bkx-menu-backdrop"
      @click="closeMenu"
    ></div>
  </Transition>

    <Transition name="bkx-menu-slide">
      <aside v-if="menuOpen" class="bkx-menu">
        <div class="bkx-menu__head">
          <div class="bkx-menu__brand">
            <img :src="introImage" alt="Beautiful Life" />

            <!-- <div>
              <strong>Beautiful Life</strong>
              <small>Hair Salon</small>
            </div> -->
          </div>

          <button
            type="button"
            class="bkx-menu__close"
            aria-label="Zatvori meni"
            @click="closeMenu"
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <nav class="bkx-menu__nav">
          <button type="button" @click="goToWelcome">
            Početna strana
          </button>

          <button type="button" @click="scrollToBookingPart('.bkx-salon-section')">
            Izbor salona
          </button>

          <button type="button" @click="scrollToBookingPart('.bkx-area-section')">
            Oblast usluge
          </button>

          <button type="button" @click="scrollToBookingPart('.bkx-date-strip-section')">
            Izbor dana
          </button>

          <button type="button" @click="scrollToBookingPart('.bkx-specialist-section')">
            Specijalista
          </button>

          <button type="button" @click="scrollToBookingPart('.bkx-time-section')">
            Slobodni termini
          </button>

          <button
            type="button"
            class="bkx-menu__cta"
            @click="scrollToBookingPart('.bkx-salon-section')"
          >
            Nastavi zakazivanje
          </button>
        </nav>
      </aside>
    </Transition>
  </Teleport>

    <section class="bl-hero">
      <div class="bl-hero__single">
        <img :src="heroSingle" alt="">

        <div class="bl-hero__fade"></div>
      </div>

      <div class="bl-hero__content">
        <img class="bl-hero-intro" :src="heroIntro" alt="Beautiful Life Hair Salon" />

        <!-- <p>Frizerski salon za žene i muškarce</p> -->
      </div>
    </section>

    <section class="bl-actions">
      <button class="bl-primary" type="button" @click="goZakazivanje">
        <span class="bl-primary__icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M8 2.75v3M16 2.75v3M4.75 9.25h14.5M7.7 13.2h.01M12 13.2h.01M16.3 13.2h.01M7.7 17h.01M12 17h.01M16.3 17h.01M6.8 21.25h10.4a3.55 3.55 0 0 0 3.55-3.55V7.8a3.55 3.55 0 0 0-3.55-3.55H6.8A3.55 3.55 0 0 0 3.25 7.8v9.9a3.55 3.55 0 0 0 3.55 3.55Z"
              fill="none"
              stroke="currentColor"
              stroke-width="1.9"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>

        <span class="bl-primary__text">
          <strong>Zakaži termin</strong>
          <small>Online rezervacija</small>
        </span>

        <span class="bl-primary__arrow">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M5 12h14M13 6l6 6-6 6"
              fill="none"
              stroke="currentColor"
              stroke-width="1.9"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </button>

      <button class="bl-secondary" type="button" @click="scrollToServices">
        <span>Pogledaj usluge</span>

        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M5 12h14M13 6l6 6-6 6"
            fill="none"
            stroke="currentColor"
            stroke-width="1.9"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </section>

    <section class="bl-intro">
      <span class="bl-intro__kicker">Beautiful Life experience</span>

      <p>
        Spojili smo negu kose, noktiju i šminke sa pažljivim pristupom, kako bi svaka
        poseta donela negovan i elegantan izgled.
      </p>
    </section>

    <section class="bl-works">
      <div class="bl-works__head">
        <div>
          <span>Galerija</span>
          <h2>Naši radovi</h2>
        </div>

        <button type="button">
          Pogledaj više
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M5 12h14M13 6l6 6-6 6"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>

      <div
        ref="worksCarouselRef"
        class="bl-works__carousel"
        aria-label="Naši radovi"
        @scroll.passive="normalizeWorksCarouselPosition"
        @pointerdown="pauseWorksAutoScroll"
        @pointerup="resumeWorksAutoScroll"
        @pointercancel="resumeWorksAutoScroll"
        @pointerleave="resumeWorksAutoScroll"
      >
        <article v-for="work in repeatedWorks" :key="work.loopId" class="bl-work">
          <img :src="work.src" :alt="work.alt" draggable="false" />
        </article>
      </div>
    </section>

    <article class="bl-location-panel">
      <div class="bl-location-panel__top">
        <span class="bl-location-panel__eyebrow">Lokacija salona</span>

        <div class="bl-location-panel__icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 21s6.25-5.4 6.25-11.15A6.25 6.25 0 1 0 5.75 9.85C5.75 15.6 12 21 12 21Z"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle
              cx="12"
              cy="9.85"
              r="2.05"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
            />
          </svg>
        </div>
      </div>

      <h2>Vojvode Mišića 36a</h2>
      <p>Salon se nalazi u prijatnom i lako dostupnom delu Beograda.</p>

      <button type="button">
        Otvori mapu
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M5 12h14M13 6l6 6-6 6"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </article>

    <section id="services" class="bl-services">
      <div class="bl-section-title-wrap">
         <div class="bl-section-title">
          <div class="bl-section-title__line"></div>
          <span>Naše usluge</span>
          <div class="bl-section-title__line"></div>
        </div>

        <h2>Odaberi svoj stil</h2>
      </div>
     


      <div class="bl-service-grid">
        <article v-for="service in services" :key="service.title" class="bl-service-card">
          <div class="bl-service-card__image">
            <img :src="service.image" :alt="service.title" />
          </div>

          <div class="bl-service-card__icon" v-html="service.icon"></div>

          <h3>{{ service.title }}</h3>
          <p>{{ service.description }}</p>

          <button type="button" aria-label="Pogledaj uslugu">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </article>
      </div>
    </section>



    <section class="bl-salon-info" aria-label="Informacije o salonu">
      <article class="bl-care-menu">
        <div class="bl-care-menu__head">
          <span>Usluge salona</span>
          <h2>Nega za svaki stil</h2>
          <p>Od svakodnevnog sređivanja do pripreme za posebne trenutke.</p>
        </div>

        <div class="bl-care-list">
          <div class="bl-care-item">
            <div class="bl-care-item__dot"></div>

            <div>
              <strong>Kosa</strong>
              <p>Šišanje, feniranje, pramenovi i tretmani.</p>
            </div>
          </div>

          <div class="bl-care-item">
            <div class="bl-care-item__dot"></div>

            <div>
              <strong>Nokti</strong>
              <p>Manikir, pedikir i nežna nega ruku.</p>
            </div>
          </div>

          <div class="bl-care-item">
            <div class="bl-care-item__dot"></div>

            <div>
              <strong>Makeup</strong>
              <p>Šminka za izlazak, proslavu ili važan dan.</p>
            </div>
          </div>
        </div>
      </article>
    </section>

    

    <footer class="bl-footer">
      <img class="bl-footer-leaf" :src="leafImage" alt="" aria-hidden="true" />

      <p>
        Tvoj stil, tvoja priča.<br />
        Mi smo tu da je istaknemo.
      </p>

      <span>♡</span>
    </footer>
  </main>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter();

const menuOpen = ref(false);
let scrollY = 0;

function lockPageScroll() {
  scrollY = window.scrollY;

  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
}

function unlockPageScroll() {
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';

  window.scrollTo(0, scrollY);
}

watch(menuOpen, (isOpen) => {
  if (isOpen) {
    lockPageScroll();
  } else {
    unlockPageScroll();
  }
});

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

function closeMenu() {
  menuOpen.value = false;
}

function goToWelcome() {
  closeMenu();
  router.push('/beautiful-life');
}

function scrollToBookingPart(selector: string) {
  closeMenu();

  requestAnimationFrame(() => {
    document.querySelector(selector)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  });
}

onBeforeUnmount(() => {
  unlockPageScroll();
});

function goZakazivanje() {
  router.push({
    name: "NinaZakazi3",
  });
}

type ImageItem = {
  id: string
  src: string
  alt: string
}

type InfoCard = {
  title: string
  kicker: string
  description: string
  items: string[]
  icon: string
}

type ServiceCard = {
  title: string
  description: string
  image: string
  icon: string
}


import logoImage from '@/assets/img/ninalogofinal.png'
import leafImage from '@/assets/img/list.png'
import introImage from '@/assets/img/intro-slika.png'
import img1 from '@/assets/img/img1.png'
import img2 from '@/assets/img/img2.png'
import img3 from '@/assets/img/img3.png'
import img4 from '@/assets/img/img4.png'
import img5 from '@/assets/img/img5.png'
import img6 from '@/assets/img/img6.png'

import hero1 from '@/assets/img/hero1.png'
import hero2 from '@/assets/img/hero2.png'
import hero3 from '@/assets/img/hero3.png'
import hero4 from '@/assets/img/hero4.png'

import heroSingle from '@/assets/img/hero-nina4.png'
import heroIntro from '@/assets/img/intro-slika.png'






const images = {
  img1: '@/assets/img/img1.png',
  img2: '@/assets/img/img2.png',
  img3: '@/assets/img/img3.png',
  img4: '@/assets/img/img4.png',
  img5: '@/assets/img/img5.png',
  img6: '@/assets/img/img6.png',

  hero1: '@/assets/img/hero1.png',
  hero2: '@/assets/img/hero2.png',
  hero3: '@/assets/img/hero3.png',
  hero4: '@/assets/img/hero4.png',
}

const heroImages: ImageItem[] = [
  {
    id: 'one',
    src: hero1,
    alt: 'Beautiful Life salon hero slika 1',
  },
  {
    id: 'two',
    src: hero2,
    alt: 'Beautiful Life salon hero slika 2',
  },
  {
    id: 'three',
    src: hero3,
    alt: 'Beautiful Life salon hero slika 3',
  },
  {
    id: 'four',
    src: hero4,
    alt: 'Beautiful Life salon hero slika 4',
  },
]

const infoCards: InfoCard[] = [
  {
    title: 'Lokacija',
    kicker: 'Salon',
    description: 'Sve što ti treba da brzo pronađeš salon i dođeš bez lutanja.',
    items: ['Vojvode Mišića 36a', 'Beograd', 'Parking u blizini'],
    icon: `
      <svg viewBox="0 0 24 24">
        <path d="M5.2 10.45c0-4.25 3.2-7.2 6.8-7.2s6.8 2.95 6.8 7.2c0 5.05-6.8 10.3-6.8 10.3s-6.8-5.25-6.8-10.3Z" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M9.55 10.1a2.45 2.45 0 1 0 4.9 0 2.45 2.45 0 0 0-4.9 0Z" fill="none" stroke="currentColor" stroke-width="1.65"/>
        <path d="M8.6 20.2h6.8" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round"/>
      </svg>
    `,
  },
  {
    title: 'Radno vreme',
    kicker: 'Termini',
    description: 'Rezervacije su dostupne online, a slobodni termini se brzo popunjavaju.',
    items: ['Pon — Pet: 09–20h', 'Subota: 10–18h', 'Nedelja: zatvoreno'],
    icon: `
      <svg viewBox="0 0 24 24">
        <path d="M7.2 4.8h9.6a3.4 3.4 0 0 1 3.4 3.4v8.6a3.4 3.4 0 0 1-3.4 3.4H7.2a3.4 3.4 0 0 1-3.4-3.4V8.2a3.4 3.4 0 0 1 3.4-3.4Z" fill="none" stroke="currentColor" stroke-width="1.65"/>
        <path d="M8 3.25v3M16 3.25v3M4.6 9.1h14.8" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round"/>
        <path d="M9 13h.01M12 13h.01M15 13h.01M9 16h.01M12 16h.01" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round"/>
      </svg>
    `,
  },
  {
    title: 'Usluge',
    kicker: 'Beauty',
    description: 'Nega kose, noktiju i šminka u jednom mirnom, elegantnom prostoru.',
    items: ['Kosa i feniranje', 'Nokti i pedikir', 'Šminka i nega'],
    icon: `
      <svg viewBox="0 0 24 24">
        <path d="M12 3.6c2.25 2.05 3.45 4.05 3.45 5.95A3.45 3.45 0 0 1 12 13a3.45 3.45 0 0 1-3.45-3.45c0-1.9 1.2-3.9 3.45-5.95Z" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linejoin="round"/>
        <path d="M5.7 14.15c1.55 3.3 3.65 5.25 6.3 5.95 2.65-.7 4.75-2.65 6.3-5.95" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8.35 17.05h7.3" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round"/>
      </svg>
    `,
  },
]

const services: ServiceCard[] = [
  {
    title: 'Žensko šišanje',
    description: 'Šišanje, fen i tretmani',
    image: img5,
    icon: `
      <svg viewBox="0 0 24 24">
        <path d="M7.1 19.4c1.2-2.1 1.05-4.3.45-6.15-.65-2-.35-4.35 1.1-5.9 2.1-2.25 5.85-1.55 6.7 1.4.45 1.55.1 3.1 1.8 4.35 1 .75 1.7 1.95 1.7 3.25 0 2.25-1.85 4.05-4.1 4.05H7.1Z" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round"/>
        <path d="M11.15 7.4c2.8.15 3.55 2 3.45 3.85-.1 1.65.95 2.2 2.05 2.75" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round"/>
      </svg>
    `,
  },
  {
    title: 'Muško šišanje',
    description: 'Fade, brada i stilske frizure',
    image: img6,
    icon: `
      <svg viewBox="0 0 24 24">
        <path d="M7.2 20.2v-4.1c0-3.6 2.3-6.25 5.5-6.25 2.55 0 4.35 1.7 4.35 4.2 0 2.9-2.25 5.4-6.25 6.15" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round"/>
        <path d="M7.2 12.7C6 8.65 8.6 4.35 13.1 4.35c2.65 0 4.65 1.45 5.45 3.65" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round"/>
        <path d="M10.3 15.95c1.6.4 3.25.15 4.7-.7" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round"/>
      </svg>
    `,
  },
  {
    title: 'Koloracija i Pramenovi',
    description: 'Pramenovi i balayage',
    image: img4,
    icon: `
      <svg viewBox="0 0 24 24">
        <path d="M12 3.5v17M8.25 5.25 12 8.2l3.75-2.95M8.25 10.2 12 13.15l3.75-2.95M8.25 15.15 12 18.1l3.75-2.95" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
  },
  {
    title: 'Nokti i šminka',
    description: 'Manikir, pedikir i makeup',
    image: img3,
    icon: `
      <svg viewBox="0 0 24 24">
        <path d="M12 3.6c2.25 2.05 3.45 4.05 3.45 5.95A3.45 3.45 0 0 1 12 13a3.45 3.45 0 0 1-3.45-3.45c0-1.9 1.2-3.9 3.45-5.95Z" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linejoin="round"/>
        <path d="M5.7 14.15c1.55 3.3 3.65 5.25 6.3 5.95 2.65-.7 4.75-2.65 6.3-5.95" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
  },
]

const works: ImageItem[] = [
  {
    id: 'work-1',
    src: img5,
    alt: 'Tamni talasi',
  },
  {
    id: 'work-2',
    src: img1,
    alt: 'Plavi talasi',
  },
  {
    id: 'work-3',
    src: img6,
    alt: 'Muško šišanje sa pletenicama',
  },
  {
    id: 'work-4',
    src: img3,
    alt: 'Plava frizura',
  },
  {
    id: 'work-5',
    src: img2,
    alt: 'Muško šišanje profil',
  },
]

const worksCarouselRef = ref<HTMLElement | null>(null)

const repeatedWorks = computed(() => {
  return [...works, ...works, ...works].map((work, index) => ({
    ...work,
    loopId: `${work.id}-${index}`,
  }))
})

let autoScrollRaf = 0
let lastAutoScrollTime = 0
let resumeAutoScrollTimer = 0

const isUserInteractingWithWorks = ref(false)
const WORKS_AUTO_SCROLL_SPEED = 0.028

function getWorkCardWidth() {
  const carousel = worksCarouselRef.value
  const firstCard = carousel?.querySelector<HTMLElement>('.bl-work')

  if (!carousel || !firstCard) {
    return 0
  }

  const styles = window.getComputedStyle(carousel)
  const gap = Number.parseFloat(styles.columnGap || styles.gap || '0')

  return firstCard.offsetWidth + gap
}

function normalizeWorksCarouselPosition() {
  const carousel = worksCarouselRef.value
  const cardWidth = getWorkCardWidth()

  if (!carousel || !cardWidth || !works.length) {
    return
  }

  const singleSetWidth = works.length * cardWidth
  const middleStart = singleSetWidth
  const middleEnd = singleSetWidth * 2

  if (carousel.scrollLeft < middleStart - cardWidth) {
    carousel.scrollLeft += singleSetWidth
  }

  if (carousel.scrollLeft > middleEnd + cardWidth) {
    carousel.scrollLeft -= singleSetWidth
  }
}

function setupWorksCarousel() {
  const carousel = worksCarouselRef.value
  const cardWidth = getWorkCardWidth()

  if (!carousel || !cardWidth || !works.length) {
    return
  }

  carousel.scrollLeft = works.length * cardWidth
}

function autoScrollWorks(timestamp: number) {
  const carousel = worksCarouselRef.value

  if (!carousel) {
    autoScrollRaf = requestAnimationFrame(autoScrollWorks)
    return
  }

  if (!lastAutoScrollTime) {
    lastAutoScrollTime = timestamp
  }

  const delta = timestamp - lastAutoScrollTime
  lastAutoScrollTime = timestamp

  if (!isUserInteractingWithWorks.value) {
    carousel.scrollLeft += delta * WORKS_AUTO_SCROLL_SPEED
    normalizeWorksCarouselPosition()
  }

  autoScrollRaf = requestAnimationFrame(autoScrollWorks)
}

function pauseWorksAutoScroll() {
  isUserInteractingWithWorks.value = true

  if (resumeAutoScrollTimer) {
    window.clearTimeout(resumeAutoScrollTimer)
  }
}

function resumeWorksAutoScroll() {
  if (resumeAutoScrollTimer) {
    window.clearTimeout(resumeAutoScrollTimer)
  }

  resumeAutoScrollTimer = window.setTimeout(() => {
    normalizeWorksCarouselPosition()
    isUserInteractingWithWorks.value = false
  }, 650)
}

function goToBooking() {
  router.push('/beautiful-life/zakazi')
}

function scrollToServices() {
  document.querySelector('#services')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

onMounted(() => {
  nextTick(() => {
    setupWorksCarousel()
    autoScrollRaf = requestAnimationFrame(autoScrollWorks)
  })
})

onBeforeUnmount(() => {
  cancelAnimationFrame(autoScrollRaf)

  if (resumeAutoScrollTimer) {
    window.clearTimeout(resumeAutoScrollTimer)
  }
})
</script>

<style scoped lang="scss">
.bl-welcome {
  min-height: 100svh;
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  padding: 0 18px 0px;
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

.bl-hero {
  position: relative;
  width: calc(100% + 36px);
  min-height: 362px;
  margin: 0 -18px;
  overflow: hidden;

  background: linear-gradient(
    180deg,
    #f6f1e8 0%,
    #f6f1e8 72%,
    #f7f1e7 88%,
    rgb(250, 246, 237) 100%
  );
  // border-radius: 8px 8px 18px 18px;

  .bl-hero__single{
    position: relative;
    width: 100%;
    img{
      width: 100%;
      height: 270px;
    }
  }

  &__fade {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    // height: 300px;
    z-index: 3;
    pointer-events: none;
    // border: 1px solid red;
    inset: 0;
    // border: 1px solid red;

    background: linear-gradient(
      180deg,
      rgba(247, 241, 231, 0) 0%,
      rgba(247, 241, 231, 0) 55%,
      rgba(252, 250, 245, 0) 75%,
      rgb(247, 241, 233, 1) 90%,
      rgba(247, 241, 233, 1) 100% 
    );

    // border: 1px solid red; 
  }

  &__content {
    position: absolute;
    left: 18px;
    right: 18px;
    bottom: 0px;
    z-index: 4;
    text-align: center;

    p {
      margin: 4px 0 0;
      color: rgba(47, 44, 36, 0.72);
      font-size: 15px;
      font-weight: 500;
      line-height: 1.35;
    }
  }
}

.bl-hero-intro {
  width: min(100%, 300px);
  height: auto;
  margin: 0 auto;
  display: block;
  object-fit: contain;
  mix-blend-mode: multiply;
}

.bl-actions {
  display: grid;
  gap: 9px;
  width: min(100%, 274px);
  margin: 5px auto 0;

  .bl-primary,
  .bl-secondary {
    width: 100%;
  }
}

.bl-primary {
  position: relative;
  min-height: 50px;
  padding: 12px;
  border-radius: 16px;

  display: grid;
  grid-template-columns: 37px minmax(0, 1fr) 26px;
  align-items: center;
  gap: 9px;

  color: #fff;
  background: linear-gradient(180deg, #7e8d6b 0%, #6c7d5d 100%);
  overflow: hidden;

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    inset 0 -1px 0 rgba(24, 31, 19, 0.14),
    0 10px 18px rgba(92, 104, 75, 0.14);

  &::before {
    content: '';
    position: absolute;
    inset: 1px;
    border-radius: 11px;
    pointer-events: none;
    background:
      linear-gradient(
        120deg,
        rgba(255, 255, 255, 0.18) 0%,
        rgba(255, 255, 255, 0.05) 38%,
        rgba(255, 255, 255, 0) 62%
      );
  }

  &:active {
    transform: translateY(1px);
  }

  &__icon {
    position: relative;
    z-index: 1;
    width: 37px;
    height: 37px;
    border-radius: 10px;

    display: grid;
    place-items: center;

    color: #ffffff;
    background: rgba(255, 255, 255, 0.15);

    svg {
      width: 20px;
      height: 20px;
    }
  }

  &__text {
    position: relative;
    z-index: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;

    strong {
      color: #ffffff;
      font-size: 15.8px;
      font-weight: 720;
      line-height: 1.05;
      letter-spacing: -0.25px;
    }

    small {
      margin-top: 3px;
      color: rgba(255, 255, 255, 0.76);
      font-size: 10.4px;
      font-weight: 600;
      line-height: 1;
      letter-spacing: 0.15px;
    }
  }

  &__arrow {
    position: relative;
    right: 12px;
    z-index: 1;
    width: 40px;
    height: 40px;
    border-radius: 999px;

    display: grid;
    place-items: center;

    color: #ffffff;
    background: rgba(255, 255, 255, 0.13);

    svg {
      width: 17px;
      height: 17px;
    }
  }
}

.bl-secondary {
  min-height: 46px;
  border-radius: 12px;
  padding: 0 15px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  color: #171511;
  background: transparent;
  box-shadow: none;

  span {
    font-size: 15.6px;
    font-weight: 650;
    letter-spacing: -0.18px;
  }

  svg {
    width: 20px;
    height: 20px;
  }

  &:active {
    transform: translateY(1px);
  }
}

.bl-intro {
  position: relative;
  max-width: 332px;
  margin: 18px auto 0;
  padding: 0 8px;
  text-align: center;

  &::before {
    content: '';
    display: block;
    width: 34px;
    height: 1px;
    margin: 0 auto 10px;
    background: rgba(123, 130, 100, 0.42);
  }

  &__kicker {
    display: block;
    margin-bottom: 6px;

    color: #8b9271;
    font-family:
      'Brush Script MT',
      'Segoe Script',
      cursive;
    font-size: 21px;
    font-weight: 400;
    line-height: 1;
    letter-spacing: 0.6px;
    transform: rotate(-2deg);
  }

  p {
    margin: 0;
    color: rgba(25, 24, 19, 0.82);
    font-size: 14px;
    font-weight: 520;
    line-height: 1.45;
    letter-spacing: -0.16px;
  }
}

.bl-salon-info {
  margin-top: 32px;
  display: grid;
  gap: 34px;
}

.bl-location-panel {
  position: relative;
  padding: 16px 16px 15px;
  border-radius: 18px;
  margin-top: 24px;

  background: rgba(255, 255, 255, 0.46);
  border: none;
  box-shadow: none;

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
  }

  &__eyebrow {
    color: #7b8464;
    font-size: 11px;
    font-weight: 820;
    line-height: 1;
    letter-spacing: 1.1px;
    text-transform: uppercase;
  }

  &__icon {
    width: 38px;
    height: 38px;
    flex: 0 0 38px;
    border-radius: 999px;

    display: grid;
    place-items: center;

    color: #171511;
    background: #dce0c5;

    svg {
      width: 19px;
      height: 19px;
      display: block;
    }
  }

  h2 {
    max-width: 235px;
    margin: 0;

    color: #171511;
    font-family:
      Georgia,
      'Times New Roman',
      serif;
    font-size: 25px;
    font-weight: 500;
    line-height: 0.98;
    letter-spacing: -0.9px;
  }

  p {
    max-width: 275px;
    margin: 8px 0 0;

    color: rgba(38, 35, 29, 0.68);
    font-size: 13px;
    font-weight: 520;
    line-height: 1.38;
    letter-spacing: -0.12px;
  }

  button {
    height: 34px;
    margin-top: 14px;
    padding: 0 12px;
    border-radius: 999px;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;

    color: #ffffff;
    background: #738461;

    font-size: 12px;
    font-weight: 750;
    letter-spacing: -0.08px;

    svg {
      width: 15px;
      height: 15px;
    }

    &:active {
      transform: translateY(1px);
    }
  }
}

.bl-care-menu {
  padding: 0 2px;
}

.bl-care-menu__head {
  max-width: 295px;
  margin: 0 auto 16px;
  text-align: center;

  span {
    display: block;
    margin-bottom: 7px;

    color: #7b8464;
    font-size: 10.5px;
    font-weight: 820;
    line-height: 1;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  h2 {
    margin: 0;
    color: #191813;
    font-family:
      Georgia,
      'Times New Roman',
      serif;
    font-size: 26px;
    font-weight: 500;
    line-height: 0.98;
    letter-spacing: -1px;
  }

  p {
    margin: 9px 0 0;
    color: rgba(38, 35, 29, 0.63);
    font-size: 13px;
    font-weight: 520;
    line-height: 1.38;
    letter-spacing: -0.12px;
  }
}

.bl-care-list {
  display: grid;
  gap: 0;
  border: none;
}

.bl-care-item {
  min-height: 64px;
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  padding: 12px 2px;

  &__dot {
    width: 9px;
    height: 9px;
    margin-left: 4px;
    border-radius: 999px;
    background: #8b9271;
  }

  > div:last-child {
    min-width: 0;
    padding-bottom: 12px;
  }

  &:not(:last-child) {
    > div:last-child {
      border-bottom: 1px solid rgba(71, 62, 48, 0.11);
    }
  }

  strong {
    display: block;
    color: #191813;
    font-family:
      Georgia,
      'Times New Roman',
      serif;
    font-size: 17px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: -0.35px;
  }

  p {
    margin: 5px 0 0;
    color: rgba(38, 35, 29, 0.62);
    font-size: 12.3px;
    font-weight: 520;
    line-height: 1.25;
    letter-spacing: -0.1px;
  }
}

.bl-services {
  margin-top: 30px;
  padding: 8px 16px 12px;
  // border-radius: 13px;
  // background: rgba(239, 232, 222, 0.76);
  margin: 30px -18px 0 -18px;

  > h2 {
    margin: 3px 0 13px;
    text-align: center;
    color: #191813;
    font-family:
      Georgia,
      'Times New Roman',
      serif;
    font-size: 30px !important;
    font-weight: 500;
    line-height: 0.95;
    letter-spacing: -0.9px;
  }
}

.bl-section-title-wrap{
  // border: 1px solid red;
  padding: 10px 0;

  h2{
    text-align: center;
    margin: 5px 0 13px;
    text-align: center;
    color: #191813;
    font-family:
      Georgia,
      'Times New Roman',
      serif;
    font-size: 25px;
    font-weight: 500;
    line-height: 0.95;
    letter-spacing: -0.9px;
    // margin-top: 3px;
  }
}

.bl-section-title {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;
  width: 255px;
  max-width: 100%;
  margin: 0 auto;

  &__line {
    height: 1px;
    background: rgba(90, 84, 69, 0.22);
  }

  span {
    color: #888e70;
    font-family:
      'Brush Script MT',
      'Segoe Script',
      cursive;
    font-size: 20px;
    line-height: 1;
    transform: rotate(-5deg);
  }
}

.bl-service-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  row-gap: 20px;
}

.bl-service-card {
  position: relative;
  min-width: 0;
  min-height: 198px;
  padding: 0 9px 10px;
  border-radius: 12px;
  overflow: hidden;
  text-align: center;
  background: rgba(255, 255, 255, 0.46);

  display: flex;
  flex-direction: column;

  &__image {
    height: 96px;
    margin: 0 -9px 0;
    flex: 0 0 96px;
    overflow: hidden;
    background: #ded5ca;

    img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    }
  }

  &__icon {
    width: 34px;
    height: 34px;
    margin: -18px auto 7px;
    position: relative;
    z-index: 2;
    flex: 0 0 34px;
    border-radius: 999px;

    display: grid;
    place-items: center;

    color: #15130f;
    background: #efd5cb;
    border: 1px solid rgba(82, 59, 44, 0.12);

    :deep(svg) {
      width: 18px;
      height: 18px;
      display: block;
    }
  }

  h3 {
    margin: 0;
    color: #191813;
    font-family:
      Georgia,
      'Times New Roman',
      serif;
    font-size: 15px;
    font-weight: 600;
    line-height: 1.04;
    letter-spacing: -0.28px;
  }

  p {
    margin: 6px 0 9px;
    color: #27241e;
    font-size: 11.2px;
    font-weight: 500;
    line-height: 1.24;
    letter-spacing: -0.12px;
  }

  button {
    width: 24px;
    height: 18px;
    margin: auto auto 0;

    display: grid;
    place-items: center;

    color: #15130f;
    background: transparent;

    svg {
      width: 20px;
      height: 20px;
    }
  }
}

.bl-works {
  margin-top: 36px;
  margin-bottom: 40px;
  padding: 0;

  &__head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 14px;
    padding: 0 2px;
    margin-bottom: 10px;

    div {
      min-width: 0;
    }

    span {
      display: block;
      margin-bottom: 3px;

      color: #8b9271;
      font-family:
        'Brush Script MT',
        'Segoe Script',
        cursive;
      font-size: 19px;
      font-weight: 400;
      line-height: 1;
      letter-spacing: 0.5px;
      transform: rotate(-3deg);
    }

    h2 {
      margin: 0;
      color: #191813;
      font-family:
        Georgia,
        'Times New Roman',
        serif;
      font-size: 24px;
      font-weight: 500;
      line-height: 0.98;
      letter-spacing: -0.7px;
    }

    button {
      flex: 0 0 auto;
      height: 31px;
      padding: 0 10px;
      border-radius: 999px;

      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;

      color: #171511;
      background: transparent;
      border: 1px solid rgba(42, 36, 28, 0.18);

      font-size: 11.5px;
      font-weight: 650;
      letter-spacing: -0.12px;

      svg {
        width: 15px;
        height: 15px;
      }
    }
  }

  &__carousel {
    display: flex;
    align-items: center;
    gap: 7px;

    width: 100%;
    margin: 0;
    padding: 2px 20px 6px;

    overflow-x: auto;
    overflow-y: hidden;

    scroll-behavior: auto;
    scroll-snap-type: none;
    overscroll-behavior-x: contain;
    -webkit-overflow-scrolling: touch;

    scrollbar-width: none;
    touch-action: pan-x;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}

.bl-work {
  position: relative;
  flex: 0 0 72px;
  height: 96px;
  border-radius: 12px;
  overflow: hidden;

  background: #e2d9ce;
  border: 1px solid rgba(42, 36, 28, 0.1);

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;

    pointer-events: none;
    user-select: none;
    -webkit-user-drag: none;
  }
}

.bl-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding-top: 30px;
  padding-bottom: 40px;
  color: #8e9675;
  text-align: center;
  // background: rgba(239, 232, 222, 0.76);
  margin: 0 -18px;
}

.bl-footer-leaf {
  width: 35px;
  height: 27px;
  flex: 0 0 auto;
  object-fit: contain;
  display: block;
  transform: rotate(-10deg);
}

.bl-footer {
  p {
    margin: 0;
    font-family:
      'Brush Script MT',
      'Segoe Script',
      cursive;
    font-size: 17px;
    line-height: 0.88;
    letter-spacing: 1px;
    transform: rotate(-3deg);
  }

  span {
    color: #e7a3ad;
    font-size: 18px;
    line-height: 1;
    transform: rotate(12deg);
  }
}

.bkx-menu-button {
  width: 42px;
  height: 42px;
  border: 0;
  border-radius: 99px;
  padding: 0;
  flex: 0 0 42px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;

  color: #191814;
  background: rgba(255, 250, 241, 0.88);

  box-shadow:
    0 10px 24px rgba(55, 47, 34, 0.075),
    inset 0 1px 0 rgba(255, 255, 255, 0.78),
    inset 0 0 0 1px rgba(40, 36, 28, 0.045);

  -webkit-tap-highlight-color: transparent;

  span {
    width: 16px;
    height: 2px;
    border-radius: 999px;
    background: #191814;
    transition:
      transform 0.24s ease,
      opacity 0.2s ease;
  }

  &.active {
    span:first-child {
      transform: translateY(7px) rotate(45deg);
    }

    span:nth-child(2) {
      opacity: 0;
    }

    span:last-child {
      transform: translateY(-7px) rotate(-45deg);
    }
  }
}

.bkx-menu-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2147483600;
  background: rgba(18, 16, 12, 0.58);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.bkx-menu {
  position: fixed;
  z-index: 2147483601;
  top: 0;
  right: 0;

  width: min(100vw, 350px);
  height: 100dvh;

  padding: 10px 18px calc(22px + env(safe-area-inset-bottom));

  // background:
  //   radial-gradient(circle at 100% 0%, rgba(142, 164, 118, 0.22) 0%, transparent 34%),
  //   linear-gradient(180deg, #fffaf1 0%, #f4eadb 100%);

  background-color: rgb(247, 242, 233);
  

  box-shadow:
    -22px 0 44px rgba(55, 47, 34, 0.2),
    inset 1px 0 0 rgba(255, 255, 255, 0.5);

  display: flex;
  flex-direction: column;
}

.bkx-menu__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 30px;
}

.bkx-menu__brand {
  display: flex;
  align-items: center;
  gap: 12px;

  img {
    width: 220px;
    height: 120px;
    border-radius: 18px;
    object-fit: cover;
    // background: #eadfce;
  }

  strong {
    display: block;
    color: #191814;
    font-size: 20px;
    line-height: 1;
    font-weight: 950;
    letter-spacing: -0.06em;
  }

  small {
    display: block;
    margin-top: 6px;
    color: rgba(25, 24, 20, 0.52);
    font-size: 10px;
    line-height: 1;
    font-weight: 900;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }
}

.bkx-menu__close {
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 50%;
  padding: 0;
  flex: 0 0 40px;
  margin-top: 30px;

  display: grid;
  place-items: center;

  color: #667d52;
  background: rgba(255, 252, 246, 0.72);

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.74),
    inset 0 0 0 1px rgba(40, 36, 28, 0.045);

  svg {
    width: 20px;
    height: 20px;
    stroke: currentColor;
    stroke-width: 2.4;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

.bkx-menu__nav {
  display: grid;
  gap: 9px;

  button {
    width: 100%;
    min-height: 52px;
    border: 0;
    // border-radius: 19px;
    padding: 0 15px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    color: #191814;
    // background: rgba(255, 252, 246, 0.72);
    // border: 1px solid red;
    border-bottom: 1px solid rgba(0,0,0,0.08);
    background: none;

    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.035em;
    text-align: left;

    &:nth-last-child(2) {
      border-bottom: none;
    }

    &:last-child{
      border-bottom: none;
      border-radius: 19px;
    }

    // box-shadow:
    //   inset 0 1px 0 rgba(255, 255, 255, 0.78),
    //   inset 0 0 0 1px rgba(40, 36, 28, 0.045);

    &:active {
      transform: scale(0.985);
    }
  }

  .bkx-menu__cta {
    margin-top: 8px;
    color: #fff8ea;
    background:
      radial-gradient(circle at 16% 0%, rgba(255, 255, 255, 0.14), transparent 34%),
      linear-gradient(180deg, #8ea476 0%, #667d52 100%);

    box-shadow:
      0 12px 24px rgba(102, 125, 82, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.22);
  }
}

.bkx-menu-fade-enter-active,
.bkx-menu-fade-leave-active {
  transition: opacity 0.22s ease;
}

.bkx-menu-fade-enter-from,
.bkx-menu-fade-leave-to {
  opacity: 0;
}

.bkx-menu-slide-enter-active,
.bkx-menu-slide-leave-active {
  transition: transform 0.34s cubic-bezier(0.22, 1, 0.36, 1);
}

.bkx-menu-slide-enter-from,
.bkx-menu-slide-leave-to {
  transform: translateX(100%);
}
</style>