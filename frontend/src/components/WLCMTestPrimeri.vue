<template>
  <section ref="sectionRef" class="trm-examples">
    <div class="trm-section-head">
      <span>Primeri dizajna</span>

      <h2>Funkcionalne DEMO verzije kao inspiracija za vaš salon.</h2>

      <p>
        Demo primeri za barber, hair, beauty i nail salone napravljeni da inspirišu.
      </p>

    </div>

    <div
      ref="carouselRef"
      class="trm-carousel"
      @scroll="handleCarouselScroll"
    >
      <article
        v-for="item in designs"
        :key="item.id"
        class="trm-design"
      >
        <div class="trm-design__image">
          <img :src="item.image" :alt="item.title" />
        </div>

        <div class="trm-design__body">
          <span>{{ item.type }}</span>

          <h3>{{ item.title }}</h3>

          <p>{{ item.text }}</p>

          <a
            class="trm-design__button"
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Probaj demo</span>

            <svg class="trm-arrow-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
            </svg>
          </a>
        </div>
      </article>
    </div>

    <div class="dots-more">
      <div class="trm-dots" aria-hidden="true">
      <button
        v-for="(_, index) in designs"
        :key="index"
        class="trm-dot"
        :class="{ 'trm-dot--active': activeIndex === index }"
        type="button"
        @click="scrollToDesign(index)"
      > </button>
      </div>

      <a class="trm-more-link" href="/demo">
        <span>Pogledaj više</span>

        <svg class="trm-arrow-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
        </svg>
      </a>
    </div>

    
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';

import testHomepage from '@/assets/img/mockup-test-studio.png';
import testZakazi from '@/assets/img/mockup-test-studio-zakazivanje.png';
import modernHomepage from '@/assets/img/mockup-modern-life.png';
import modernZakazi from '@/assets/img/mockup-modern-life-zakazivanje.png';
import nailWelcome from '@/assets/img/mockup-nail.png';
import nailZakazi from '@/assets/img/mockup-nail-zakazivanje.png';
import adminPanel from '@/assets/img/mockup-admin-panel.png';


const sectionRef = ref<HTMLElement | null>(null);
const carouselRef = ref<HTMLElement | null>(null);
const activeIndex = ref(0);

const designs = [
  {
    id: 1,
    type: 'Online zakazivanje',
    title: 'Barber Salon',
    text: 'Klijent bira uslugu, frizera, datum i termin bez dopisivanja preko poruka.',
    image: testZakazi,
    url: '/test-studio/zakazivanje',
  },
  {
    id: 2,
    type: 'web sajt',
    title: 'Barber Salon',
    text: 'Početna strana za Online zakazivanje sa uslugama, atmosferom i jasnim pozivom na zakazivanje.',
    image: testHomepage,
    url: '/test-studio',
  },
  {
    id: 3,
    type: 'Online zakazivanje',
    title: 'Beauty Salon',
    text: 'Klijent bira uslugu, frizera, datum i termin bez dopisivanja preko poruka',
    image: modernZakazi,
    url: '/modern-life/zakazivanje',
  },
  {
    id: 4,
    type: 'Web sajt',
    title: 'Beauty Salon',
    text: 'Svetao web sajt za hair i beauty salon sa uslugama, timom, radovima i zakazivanjem.',
    image: modernHomepage,
    url: '/modern-life',
  },

  {
    id: 5,
    type: 'online zakazivanje',
    title: 'Nail Salon',
    text: 'Online zakazivanje za nail salon sa jasnim izborom usluge, termina i nail artist-a.',
    image: nailZakazi,
    url: '/nail-studio/zakazivanje',
  },
  
  {
    id: 6,
    type: 'Web sajt',
    title: 'Nail Salon',
    text: 'Elegantan web sajt za nail salon sa radovima, uslugama, cenovnikom i direktnim zakazivanjem.',
    image: nailWelcome,
    url: '/nail-studio',
  },
  
  {
    id: 7,
    type: 'Admin panel',
    title: 'Kontrola salona',
    text: 'Administrator ima kontrolu nad zaposlenima, uslugama, cenama, terminima, klijentima. Takodje ima uvid u statistiku',
    image: adminPanel,
    url: '/admin-panel',
  },
];

function handleCarouselScroll() {
  const carousel = carouselRef.value;

  if (!carousel) return;

  const cards = Array.from(carousel.querySelectorAll<HTMLElement>('.trm-design'));

  if (!cards.length) return;

  const carouselCenter = carousel.scrollLeft + carousel.clientWidth / 2;

  const closestIndex = cards.reduce((closest, card, index) => {
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const closestCard = cards[closest];
    const closestCardCenter = closestCard.offsetLeft + closestCard.offsetWidth / 2;

    return Math.abs(cardCenter - carouselCenter) < Math.abs(closestCardCenter - carouselCenter)
      ? index
      : closest;
  }, 0);

  activeIndex.value = closestIndex;
}

function scrollToDesign(index: number) {
  const carousel = carouselRef.value;
  const cards = carousel?.querySelectorAll<HTMLElement>('.trm-design');

  if (!carousel || !cards || !cards[index]) return;

  const card = cards[index];

  carousel.scrollTo({
    left: card.offsetLeft - (carousel.clientWidth - card.offsetWidth) / 2,
    behavior: 'smooth',
  });

  activeIndex.value = index;
}

function scrollIntoView(options?: ScrollIntoViewOptions) {
  sectionRef.value?.scrollIntoView(options);
}

onMounted(async () => {
  await nextTick();
  scrollToDesign(0);
});

defineExpose({
  scrollIntoView,
  sectionRef,
});
</script>

<style scoped lang="scss">
$trm-bg: #f4f6f9;
$trm-card: #ffffff;
$trm-text: #101722;
$trm-muted: rgba(16, 23, 34, 0.56);
$trm-soft: rgba(16, 23, 34, 0.08);
$trm-blue: #2f6faf;

.trm-arrow-icon {
  width: 16px;
  height: 16px;
  flex: 0 0 16px;

  path {
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

.trm-examples {
  position: relative;
  z-index: 2;
  overflow: hidden;

  padding: 58px 0 46px;
  background:
    radial-gradient(circle at 92% 8%, rgba(47, 111, 175, 0.055), transparent 28%),
    linear-gradient(180deg, #fbfcfe 0%, #f5f7fa 48%, #eef2f6 100%);
}

.trm-section-head {
  padding: 0 22px;

  > span {
    display: block;

    color: rgba(47, 111, 175, 0.9);
    font-size: 10px;
    line-height: 1;
    font-weight: 800;
    letter-spacing: 0.31em;
    text-transform: uppercase;
  }

  h2 {
    max-width: 355px;
    margin: 17px 0 0;

    color: $trm-text;
    font-size: 24px;
    line-height: 1.2;
    font-weight: 650;
    letter-spacing: -0.025em;
  }

  p {
    max-width: 325px;
    margin: 13px 0 0;

    color: $trm-muted;
    font-size: 13px;
    line-height: 1.46;
    font-weight: 430;
    letter-spacing: -0.018em;
  }
}

.trm-more-link {
  // margin-top: 15px;

  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  width: 100%;

  color: $trm-blue;
  text-decoration: none;
  line-height: 1;

  span {
    font-size: 13px;
    font-weight: 760;
    letter-spacing: -0.018em;
  }

  svg {
    width: 16px;
    height: 16px;
    transition: transform 0.22s ease;
  }

  &:active {
    opacity: 0.72;
  }

  &:active svg {
    transform: translateX(2px);
  }
}

.trm-carousel {
  --trm-card-width: min(374px, calc(100vw - 66px));

  display: flex;
  gap: 14px;

  overflow-x: auto;
  overscroll-behavior-x: contain;

  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;

  margin: 22px 0 0;
  padding: 0 18px 6px 18px;

  &::-webkit-scrollbar {
    display: none;
  }
}

.trm-design {
  width: var(--trm-card-width);
  min-width: var(--trm-card-width);
  min-height: 252px;

  scroll-snap-align: center;
  scroll-snap-stop: always;

  display: grid;
  grid-template-columns: 41% 59%;
  align-items: center;

  padding: 15px 17px 15px 13px;

  border-radius: 24px;
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(16, 23, 34, 0.045);

  box-shadow:
  0 3px 8px rgba(15, 23, 42, 0.025);
}

.trm-design__image {
  position: relative;

  display: flex;
  align-items: flex-end;
  justify-content: center;

  overflow: visible;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 11px;

    width: 68px;
    height: 13px;

    border-radius: 50%;
    background: rgba(16, 23, 34, 0.055);
    filter: blur(7px);
    transform: translateX(-50%);
  }

  img {
    position: relative;
    z-index: 2;

    width: 106px !important;
    // height: 215px !important;

    display: block;
    // object-fit: contain;
    object-position: bottom center;

    filter:
      drop-shadow(0 7px 10px rgba(15, 23, 42, 0.08))
      drop-shadow(0 2px 3px rgba(15, 23, 42, 0.045));
  }
}

.trm-design__body {
  padding: 0 2px 0 13px;

  display: flex;
  flex-direction: column;
  justify-content: center;

  > span {
    display: block;

    color: $trm-blue;
    font-size: 9px;
    line-height: 1.25;
    font-weight: 820;
    letter-spacing: 0.25em;
    text-transform: uppercase;
  }

  h3 {
    max-width: 155px;
    margin: 13px 0 0;

    color: $trm-text;
    font-size: 19px;
    line-height: 1.08;
    font-weight: 650;
    letter-spacing: -0.032em;
  }

  p {
    max-width: 160px;
    margin: 11px 0 0;

    color: $trm-muted;
    font-size: 11.8px;
    line-height: 1.43;
    font-weight: 430;
    letter-spacing: -0.018em;
  }
}

.trm-design__button {
  width: fit-content;
  margin-top: 17px;
  padding: 11px 13px 12px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  border-radius: 12px;
  background: $trm-blue;
  color: #ffffff;
  text-decoration: none;

  box-shadow:
    0 6px 14px rgba(47, 111, 175, 0.13),
    0 1px 0 rgba(255, 255, 255, 0.18) inset;

  svg {
    width: 13px;
    height: 13px;
    transition: transform 0.22s ease;
  }

  span {
    font-size: 11.4px;
    font-weight: 760;
    letter-spacing: -0.014em;
    line-height: 1;
  }

  &:active {
    transform: scale(0.975);
  }

  &:active svg {
    transform: translateX(2px);
  }
}

.dots-more{
  display: flex;
  justify-content: space-between;
  align-items: center;
  // border: 1px solid red;
  margin: 23px 18px 0;

}

.trm-dots {

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
}

.trm-dot {
  width: 6px;
  height: 6px;
  padding: 0;

  border: 0;
  border-radius: 999px;
  background: rgba(47, 111, 175, 0.22);

  transition:
    width 0.24s ease,
    background 0.24s ease,
    opacity 0.24s ease,
    transform 0.24s ease;

  opacity: 0.36;
}

.trm-dot--active {
  width: 24px;
  background: $trm-blue;
  opacity: 1;
}
</style>