<template>
  <section ref="sectionRef" class="trm-examples">
    <div class="trm-section-head">
      <span>Dizajn sistema</span>

      <h2>Svaki salon dobija svoj stil.</h2>

      <p>
        Ovo su samo primeri dizajna. Dizajn za Vaš salon može biti kakav god poželite.
      </p>
    </div>

    <div class="trm-carousel">
      <article
        v-for="item in designs"
        :key="item.id"
        class="trm-design"
      >
        <img :src="item.image" :alt="item.title" />

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
            <span>Testiraj</span>

            <svg class="trm-arrow-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
            </svg>
          </a>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import testHomepage from '@/assets/img/test-homepage.png';
import testZakazi from '@/assets/img/test-zakazi.png';
import modernHomepage from '@/assets/img/modern-homepage.png';
import modernZakazi from '@/assets/img/modern-zakazi.png';
import nailWelcome from '@/assets/img/nail-welcome-mockup.png';
import nailZakazi from '@/assets/img/nail-zakaz-mockup.png';

const sectionRef = ref<HTMLElement | null>(null);

const designs = [
  {
    id: 1,
    type: 'Barber',
    title: 'Barber Welcome',
    text: 'Premium barber dizajn početne strane sa jakim kontrastom, odličnim flow-om i skupim osećajem.',
    image: testHomepage,
    url: '/test-studio',
  },
  
  {
    id: 2,
    type: 'Barber',
    title: 'Barber Booking',
    text: 'Čist, elegantan, premium izgled sa jakim kontrastom i ozbiljnim booking tokom.',
    image: testZakazi,
    url: '/test-studio/zakazi',
  },
  {
    id: 3,
    type: 'Hair Salon + Beauty',
    title: 'Modern Life',
    text: 'Pastelni vizuelni pravac za hair salon i nokte.',
    image: modernHomepage,
    url: '/modern-life',
  },

  {
    id: 4,
    type: 'Hair salon + Beauty',
    title: 'Modern Life Booking',
    text: 'Booking strana, elegantan stil, pastalni vizuelni pravac, brza selekcija.',
    image: modernZakazi,
    url: '/modern-life/zakazivanje',
  },

  {
    id: 5,
    type: 'Nail salon',
    title: 'Nail Welcome',
    text: 'Minimalan i čist stil za nail salon, elegantan i prefinjen.',
    image: nailWelcome,
    url: '/nail-studio',
  },

  {
    id: 6,
    type: 'Nail salon',
    title: 'Nail Booking',
    text: 'Booking stranica za nail salon, elegantnog i prefinjenog dizajna. Jasna i vizuelno čista selekcija.',
    image: nailZakazi,
    url: '/nail-studio/zakazivanje',
  },
];

function scrollIntoView(options?: ScrollIntoViewOptions) {
  sectionRef.value?.scrollIntoView(options);
}

defineExpose({
  scrollIntoView,
  sectionRef,
});
</script>

<style scoped lang="scss">
$trm-bg: #f4f6f9;
$trm-text: #111822;
$trm-muted: rgba(17, 24, 34, 0.58);

$trm-blue: #2f6faf;

.trm-arrow-icon {
  width: 21px;
  height: 21px;
  flex: 0 0 21px;

  path {
    stroke: currentColor;
    stroke-width: 1.75;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

.trm-examples {
  position: relative;
  z-index: 2;

  padding: 64px 14px 66px;
  background: $trm-bg;
//   background: black;
}

.trm-section-head {
  padding: 0 4px;

  > span {
    display: block;

    color: rgba(47, 111, 175, 0.82);
    font-size: 10px;
    line-height: 1;
    font-weight: 760;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  h2 {
    max-width: 335px;
    margin: 12px 0 0;

    color: $trm-text;
    font-size: 32px;
    line-height: 1.04;
    font-weight: 660;
    letter-spacing: -0.048em;
  }

  p {
    max-width: 325px;
    margin: 13px 0 0;

    color: $trm-muted;
    font-size: 14.5px;
    line-height: 1.48;
    font-weight: 420;
    letter-spacing: -0.012em;
  }
}

.trm-carousel {
  display: flex;
  gap: 12px;

  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;

  margin: 26px -14px 0 0;
  padding: 0 14px 8px;

  &::-webkit-scrollbar {
    display: none;
  }
}

.trm-design {
  min-width: 88%;
  scroll-snap-align: start;

  display: grid;
  grid-template-columns: 142px 1fr;
//   height: 286px;
  align-items: center;
  gap: 6px;
//   padding: 10px;

  overflow: hidden;
  // border-radius: 28px;


  img {
    width: 142px !important;
    height: 286px !important;
    // border: 1px solid red;
    display: block;
    // object-fit: contain;
    align-self: end;
    justify-self: center;
    // margin-top: 12px;
  }
}

.trm-design__body {
  min-height: 230px;
  padding: 22px 18px 22px 6px;
  height: 100%;

  display: flex;
  flex-direction: column;

  > span {
    display: block;

    color: $trm-blue;
    font-size: 9.5px;
    line-height: 1;
    font-weight: 760;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  h3 {
    margin: 9px 0 0;

    color: $trm-text;
    font-size: 21px;
    line-height: 1.08;
    font-weight: 750;
    letter-spacing: -0.034em;
  }

  p {
    margin: 9px 0 0;

    color: $trm-muted;
    font-size: 13px;
    line-height: 1.44;
    font-weight: 420;
    letter-spacing: -0.01em;
  }
}

.trm-design__button {
  width: fit-content;
  margin-top: auto;
  padding: 8px 0 0;

  display: inline-flex;
  align-items: center;
  gap: 8px;

  color: $trm-blue;
  background: transparent;
  text-decoration: none;

  font-size: 14px;
  line-height: 1;
  font-weight: 700 !important;
  letter-spacing: -0.012em;

  svg {
    width: 19px;
    height: 19px;
  }

  &:active {
    opacity: 0.7;
  }
}

</style>