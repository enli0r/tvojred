<template>
  <div class="header_hero">

    <header class="trm-nav">
    <button class="trm-brand" type="button" @click="goTo('top')">
      <span class="trm-brand__logo">
        <img :src="logoImage" alt="tvojred.rs logo" />
      </span>

      <span class="trm-brand__text">
        <strong>tvojred.rs</strong>
        <small>sajtovi za salone</small>
      </span>
    </button>

    <button
      class="trm-menu-btn"
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


    <section ref="heroSection" class="trm-hero">
    <div class="trm-hero__copy">
      <span>tvojred.rs</span>

      <h1>Salon ide online.</h1>

      <p>
        Web sajt i online zakazivanje za salone koji žele ozbiljniji nastup.
      </p>
    </div>

    <div class="trm-hero__visual">
      <div class="trm-hero__radial"></div>
      <div class="trm-hero__halo"></div>

      <img
        :src="heroMockup"
        alt="Tvojred booking aplikacija"
      />

      <div class="trm-hero__fade trm-hero__fade--top"></div>
      <div class="trm-hero__fade trm-hero__fade--bottom"></div>
      <div class="trm-hero__fade trm-hero__fade--left"></div>
      <div class="trm-hero__fade trm-hero__fade--right"></div>
    </div>

    <div class="trm-hero__actions">
      <button class="trm-hero__cta" type="button" @click="goTo('examples')">
        <span>Testirajte besplatno</span>

        <svg class="trm-arrow-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
        </svg>
      </button>
    </div>
  </section>
  </div>
  

  <Teleport to="body">
    <Transition name="trm-menu-fade">
      <div
        v-if="menuOpen"
        class="trm-menu-backdrop"
        @click="closeMenu"
      ></div>
    </Transition>

    <Transition name="trm-menu-slide">
      <aside v-if="menuOpen" class="trm-menu">
        <div class="trm-menu__head">
          <div class="trm-menu__brand">
            <div class="side-menu-logo">
              <img :src="logoImage" alt="tvojred.rs logo" />
            </div>

            <div>
              <strong>tvojred.rs</strong>
              <small>websites & booking</small>
            </div>
          </div>

          <button
            class="trm-menu__close"
            type="button"
            aria-label="Zatvori meni"
            @click="closeMenu"
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <nav class="trm-menu__nav">
          <button type="button" @click="goTo('top')">Početna</button>
          <button type="button" @click="goTo('examples')">Besplatni primeri</button>
          <button type="button" @click="goTo('compare')">Pre / posle</button>
          <button type="button" @click="goTo('benefits')">Šta dobijaš</button>
          <button type="button" @click="goTo('booking')">Booking sistem</button>
          <button type="button" @click="goTo('admin')">Admin panel</button>
          <button type="button" @click="goTo('audience')">Za koga je</button>
          <button type="button" @click="goTo('process')">Proces</button>

          <button class="trm-menu__cta" type="button" @click="goTo('contact')">
            <span>Pošalji salon</span>

            <svg class="trm-arrow-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
            </svg>
          </button>
        </nav>
      </aside>
    </Transition>
  </Teleport>

  
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';
import logoImage from '@/assets/img/logoo.png';
import heroMockup from '@/assets/img/mockup5.png';

type SectionName =
  | 'top'
  | 'examples'
  | 'compare'
  | 'benefits'
  | 'booking'
  | 'admin'
  | 'audience'
  | 'process'
  | 'contact';

const emit = defineEmits<{
  (event: 'scroll-to', section: SectionName): void;
}>();

const heroSection = ref<HTMLElement | null>(null);
const menuOpen = ref(false);

let savedScrollY = 0;

function lockPageScroll() {
  savedScrollY = window.scrollY;

  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${savedScrollY}px`;
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

  window.scrollTo(0, savedScrollY);
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

function closeMenu() {
  menuOpen.value = false;
}

function goTo(section: SectionName) {
  closeMenu();

  requestAnimationFrame(() => {
    emit('scroll-to', section);
  });
}

watch(menuOpen, (isOpen) => {
  if (isOpen) {
    lockPageScroll();
  } else {
    unlockPageScroll();
  }
});

onBeforeUnmount(() => {
  unlockPageScroll();
});

defineExpose({
  heroSection,
});
</script>

<style scoped lang="scss">
$trm-black: #050505;
$trm-white: #ffffff;
$trm-blue: #285f9f;
$trm-blue-bright: #4f8dff;

.header_hero{
  background-color: black;
}

.trm-arrow-icon {
  width: 21px;
  height: 21px;

  path {
    stroke: currentColor;
    stroke-width: 1.65;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

/* NAVBAR */

.trm-nav {
  z-index: 30;
  height: 72px;
  padding: 12px 14px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  background-color: #000000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.055);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.24);

  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.trm-brand {
  min-width: 0;
  border: 0;
  padding: 0;
  background: transparent;

  display: inline-flex;
  align-items: center;
  gap: 11px;

  color: $trm-white;
  text-align: left;
}

.trm-brand__logo {
  width: 32px;
  height: 32px;
  flex: 0 0 32px;

  display: grid;
  place-items: center;

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
  }
}

.trm-brand__text {
  min-width: 0;
  display: grid;
  gap: 5px;

  strong {
    color: $trm-white;
    font-size: 18px;
    line-height: 0.95;
    font-weight: 780;
    letter-spacing: -0.045em;
  }

  small {
    color: rgba(255, 255, 255, 0.46);
    font-size: 9px;
    line-height: 1;
    font-weight: 740;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    white-space: nowrap;
  }
}

.trm-menu-btn {
  width: 28px;
  height: 20px;
  border: 0;
  border-radius: 999px;
  padding: 0;
  background: transparent;

  display: grid;
  place-items: center;

  span {
    width: 22px;
    height: 2px;
    border-radius: 999px;
    background: $trm-white;
    display: block;

    transition:
      transform 0.24s ease,
      opacity 0.24s ease;
  }


  &.active {
    span:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }

    span:nth-child(2) {
      opacity: 0;
    }

    span:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }
  }
}

/* SIDE MENU */

.trm-menu-backdrop {
  position: fixed;
  inset: 0;
  z-index: 80;

  background: rgba(0, 0, 0, 0.62);

  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.trm-menu {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 90;

  width: 76vw;
  max-width: 330px;
  height: 100dvh;

  padding: 22px 18px calc(22px + env(safe-area-inset-bottom));

  background: #070707;
  color: $trm-white;

  display: flex;
  flex-direction: column;

  box-shadow: -24px 0 50px rgba(0, 0, 0, 0.45);
}

.trm-menu__head,
.trm-menu__brand {
  display: flex;
  align-items: center;
}

.trm-menu__head {
  justify-content: space-between;
  gap: 16px;
}

.trm-menu__brand {
  gap: 11px;

  .side-menu-logo {
    width: 34px;
    height: 34px;
    flex: 0 0 34px;

    img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: contain;
    }
  }

  strong,
  small {
    display: block;
  }

  strong {
    color: $trm-white;
    font-size: 18px;
    line-height: 1;
    font-weight: 780;
    letter-spacing: -0.04em;
  }

  small {
    margin-top: 5px;
    color: rgba(255, 255, 255, 0.44);
    font-size: 9px;
    line-height: 1;
    font-weight: 720;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }
}

.trm-menu__close {
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 999px;

  background: rgba(255, 255, 255, 0.06);
  color: $trm-white;

  display: grid;
  place-items: center;

  svg {
    width: 19px;
    height: 19px;

    path {
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
    }
  }
}

.trm-menu__nav {
  margin-top: 32px;
  display: grid;

  button {
    min-height: 54px;
    border: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    padding: 0;
    background: transparent;

    color: rgba(255, 255, 255, 0.86);
    text-align: left;

    font-size: 15px;
    line-height: 1;
    font-weight: 680;
    letter-spacing: -0.018em;
  }
}

.trm-menu__cta {
  margin-top: 24px;
  min-height: 54px !important;
  border: 0 !important;
  border-radius: 999px;
  padding: 0 18px !important;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background: $trm-blue !important;
  color: $trm-white !important;

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    0 16px 34px rgba(13, 53, 111, 0.3);
}

.trm-menu-fade-enter-active,
.trm-menu-fade-leave-active {
  transition: opacity 0.22s ease;
}

.trm-menu-slide-enter-active,
.trm-menu-slide-leave-active {
  transition: transform 0.34s cubic-bezier(0.22, 1, 0.36, 1);
}

.trm-menu-fade-enter-from,
.trm-menu-fade-leave-to {
  opacity: 0;
}

.trm-menu-slide-enter-from,
.trm-menu-slide-leave-to {
  transform: translateX(100%);
}

/* HERO */

.trm-hero {
  position: relative;
  isolation: isolate;
  min-height: calc(100svh - 72px);
  padding: 28px 0 24px;

  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;

  overflow: hidden;
  color: $trm-white;

  background:
    radial-gradient(circle at 50% 45%, rgba(45, 92, 157, 0.25) 0%, rgba(11, 23, 36, 0.27) 31%, rgba(5, 5, 5, 0) 58%),
    linear-gradient(180deg, #050505 0%, #030303 100%);
}

.trm-hero__copy {
  position: relative;
  z-index: 6;

  padding: 0 22px;
  text-align: center;

  span {
    display: block;

    color: #7ea7e8;
    font-size: 10px;
    line-height: 1;
    font-weight: 820;
    letter-spacing: 0.24em;
    text-transform: uppercase;
  }

  h1 {
    max-width: 320px;
    margin: 12px auto 0;

    color: $trm-white;
    font-size: clamp(39px, 11vw, 50px);
    line-height: 0.92;
    font-weight: 770;
    letter-spacing: -0.052em;
    text-wrap: balance;
  }

  p {
    max-width: 310px;
    margin: 14px auto 0;

    color: rgba(255, 255, 255, 0.62);
    font-size: 15px;
    line-height: 1.42;
    font-weight: 500;
    letter-spacing: -0.018em;
    text-wrap: balance;
  }
}

.trm-hero__visual {
  position: relative;
  z-index: 1;

  width: 100%;
  height: 100%;
  min-height: 360px;

  display: grid;
  place-items: center;

  overflow: hidden;

  img {
    position: relative;
    z-index: 3;

    width: 220px;
    max-width: none;
    max-height: 58dvh;

    display: block;
    object-fit: contain;

    filter:
      brightness(1.02)
      contrast(1.04)
      saturate(0.96);

    -webkit-mask-image:
      radial-gradient(
        ellipse at center,
        #000000 0%,
        #000000 58%,
        rgba(0, 0, 0, 0.8) 70%,
        rgba(0, 0, 0, 0.32) 84%,
        transparent 100%
      );
    mask-image:
      radial-gradient(
        ellipse at center,
        #000000 0%,
        #000000 58%,
        rgba(0, 0, 0, 0.8) 70%,
        rgba(0, 0, 0, 0.32) 84%,
        transparent 100%
      );
  }
}

.trm-hero__radial,
.trm-hero__halo {
  position: absolute;
  pointer-events: none;
}

.trm-hero__radial {
  left: 50%;
  top: 50%;
  z-index: 1;

  width: 120%;
  height: 72%;
  border-radius: 999px;

  transform: translate(-50%, -50%);

  background: radial-gradient(circle at center, rgba(50, 109, 173, 0.24) 0%, rgba(29, 53, 89, 0.15) 34%, rgba(5, 5, 5, 0) 72%);
  filter: blur(28px);
}

.trm-hero__halo {
  left: 50%;
  top: 53%;
  z-index: 2;

  width: 82%;
  height: 54%;
  border-radius: 999px;

  transform: translate(-50%, -50%);

  background: radial-gradient(circle at center, rgba(79, 141, 255, 0.18), transparent 68%);
  filter: blur(34px);
}

.trm-hero__fade {
  position: absolute;
  z-index: 4;
  pointer-events: none;
}

.trm-hero__fade--top {
  left: 0;
  right: 0;
  top: 0;
  height: 18%;
  background: linear-gradient(180deg, #050505 0%, rgba(5, 5, 5, 0) 100%);
}

.trm-hero__fade--bottom {
  left: 0;
  right: 0;
  bottom: -2px;
  height: 24%;
  background: linear-gradient(0deg, #050505 0%, rgba(5, 5, 5, 0) 100%);
}

.trm-hero__fade--left {
  left: 0;
  top: 0;
  bottom: 0;
  width: 15%;
  background: linear-gradient(90deg, #050505 0%, rgba(5, 5, 5, 0) 100%);
}

.trm-hero__fade--right {
  right: 0;
  top: 0;
  bottom: 0;
  width: 15%;
  background: linear-gradient(270deg, #050505 0%, rgba(5, 5, 5, 0) 100%);
}

.trm-hero__actions {
  position: relative;
  z-index: 7;

  padding: 0 18px;

  display: grid;
  justify-items: center;
}

.trm-hero__cta {
  width: min(100%, 360px);
  min-height: 54px;

  border: 1px solid #3f6f9f;
  border-radius: 999px;
  padding: 0 18px 0 24px;

  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;

  color: #ffffff;
  background: linear-gradient(180deg, #3477bd 0%, #2f68a6 100%);

  box-shadow:
    inset 0 1px 0 #5b91ca,
    // inset 0 -1px 0 #214b79,
    0 14px 34px #06131f;

  transition:
    transform 0.18s ease,
    background 0.18s ease,
    box-shadow 0.18s ease;

  span {
    font-size: 16px;
    line-height: 1;
    font-weight: 760;
    letter-spacing: -0.02em;
  }

  svg {
    width: 24px;
    height: 24px;
    flex: 0 0 24px;

    path {
      stroke: currentColor;
      stroke-width: 2.1;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  }

  &:active {
    transform: scale(0.985);
    background: linear-gradient(180deg, #2f6daa 0%, #285b8f 100%);

    box-shadow:
      inset 0 1px 0 #477fb8,
      inset 0 2px 8px #1d4168,
      0 8px 22px #050d15;
  }
}
</style>