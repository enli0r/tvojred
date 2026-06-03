<template>
  <main class="luna-page">
    <section class="luna-hero">
      <div class="luna-hero__image">
        <img :src="heroImage" alt="Studio Luna Nails" />
      </div>

      <header class="luna-header">
        <button class="luna-brand" type="button">
          <span class="luna-brand__logo">
            <span class="luna-brand__moon">◐</span>
            <span class="luna-brand__initial">L</span>
            <span class="luna-brand__spark luna-brand__spark--one">✦</span>
            <span class="luna-brand__spark luna-brand__spark--two">✦</span>
          </span>

          <span class="luna-brand__text">
            <strong>Studio Luna Nails</strong>
            <small>Nail studio</small>
          </span>
        </button>

        <button class="luna-menu" type="button" aria-label="Otvori meni">
          <span></span>
        </button>
      </header>

      <div class="luna-hero__content">
        <h1>
          Elegantni<br />
          nokti, pažljivo<br />
          urađeni.
        </h1>

        <span class="luna-hero__line"></span>

        <p>
          Gel lak, izlivanje i manikir<br />
          u mirnoj, premium atmosferi.
        </p>

        <div class="luna-hero__actions">
          <button class="luna-btn luna-btn--primary" type="button" @click="goToBooking">
            <svg viewBox="0 0 24 24">
              <rect x="5" y="6" width="14" height="13" rx="3" />
              <path d="M8 4v4M16 4v4M5 10h14" />
              <path d="M10 14h4M12 12v4" />
            </svg>
            Zakaži termin
          </button>

          <button class="luna-btn luna-btn--secondary" type="button">
            Pogledaj radove
            <span>→</span>
          </button>
        </div>
      </div>
    </section>

    <section class="luna-section luna-section--services">
      <div class="luna-title">
        <span></span>
        <h2>Usluge</h2>
        <span></span>
      </div>

      <div class="luna-services">
        <article
          v-for="service in services"
          :key="service.title"
          class="luna-service"
        >
          <div class="luna-service__shine"></div>

          <div class="luna-service__icon" v-html="service.icon"></div>

          <div class="luna-service__copy">
            <h3>{{ service.title }}</h3>
            <p>{{ service.time }}</p>
          </div>
        </article>
      </div>
    </section>

    <section class="luna-nail-types">
      <div class="luna-nail-types__head">
        <span>STILOVI NOKTIJU</span>
        <h2>Izaberi svoj izgled</h2>
        <p>Od nežnog i prirodnog do sjajnog i efektnog završetka.</p>
      </div>

      <div class="luna-nail-types__rail">
        <button
          v-for="(type, index) in nailTypes"
          :key="type.title"
          type="button"
          class="luna-nail-types__pill"
          :class="{ active: activeNailType === index }"
          @click="activeNailType = index"
        >
          {{ type.title }}
        </button>
      </div>

      <div class="luna-nail-types__preview">
        <div class="luna-nail-types__photo">
          <img
            :src="nailTypes[activeNailType].image"
            :alt="nailTypes[activeNailType].title"
          />
        </div>

        <div class="luna-nail-types__copy">
          <span>{{ nailTypes[activeNailType].label }}</span>
          <h3>{{ nailTypes[activeNailType].title }}</h3>
          <p>{{ nailTypes[activeNailType].text }}</p>
        </div>
      </div>
    </section>

    <section class="luna-section luna-section--works">
      <div class="luna-title">
        <span></span>
        <h2>Naši radovi</h2>
        <span></span>
      </div>

      <div class="luna-works-head">
        <p>Od nežnog nude izgleda do elegantnih detalja.</p>

        <button type="button">
          Pogledaj sve
          <i>→</i>
        </button>
      </div>

      <div class="luna-works">
        <article
          v-for="work in works"
          :key="work.alt"
          class="luna-work"
        >
          <img :src="work.image" :alt="work.alt" />
        </article>
      </div>
    </section>

    <section class="luna-section--prices">
      <div class="cenovnik-slika">
        <img :src="priceBoardImage" alt="" />
      </div>

      <div class="luna-price-board">
        <div class="luna-price-board__top">
          <span>Salon menu</span>
          <h2>Cenovnik</h2>
          <p>Odaberi tretman koji ti odgovara.</p>
        </div>

        <div class="luna-price-board__list">
          <article
            v-for="price in prices"
            :key="price.title"
            class="luna-price-line"
          >
            <div class="luna-price-line__left">
              <h3>{{ price.title }}</h3>
              <p>{{ price.time }}</p>
            </div>

            <span class="luna-price-line__dots"></span>

            <strong>{{ price.price }}</strong>
          </article>
        </div>

        <div class="luna-price-board__note">
          <span>✦</span>
          <p>Cena može zavisiti od dužine, oblika i dodatnih detalja.</p>
        </div>
      </div>
    </section>

    <section class="luna-section luna-section--trust">
      <div class="luna-title">
        <span></span>
        <h2>Zašto nas biraju</h2>
        <span></span>
      </div>

      <div class="luna-trust">
        <article
          v-for="item in trustItems"
          :key="item.title"
          class="luna-trust__item"
        >
          <div class="luna-trust__icon" v-html="item.icon"></div>

          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </article>
      </div>
    </section>

    <section class="luna-faq">
      <div class="luna-faq__inner">
        <div class="luna-faq__head">
          <span>FAQ</span>
          <h2>Česta pitanja</h2>
          <p>Najbitnije informacije pre zakazivanja termina.</p>
        </div>

        <div class="luna-faq__list">
          <article
            v-for="(faq, index) in faqs"
            :key="faq.question"
            class="luna-faq__item"
            :class="{ active: activeFaq === index }"
          >
            <button
              type="button"
              :aria-expanded="activeFaq === index"
              @click="toggleFaq(index)"
            >
              <span>{{ faq.question }}</span>
              <i>{{ activeFaq === index ? '−' : '+' }}</i>
            </button>

            <Transition
              @before-enter="beforeFaqEnter"
              @enter="faqEnter"
              @after-enter="afterFaqEnter"
              @before-leave="beforeFaqLeave"
              @leave="faqLeave"
            >
              <div
                v-if="activeFaq === index"
                class="luna-faq__answer"
              >
                <p>{{ faq.answer }}</p>
              </div>
            </Transition>
          </article>
        </div>
      </div>
    </section>

    <footer class="luna-footer">
      <div class="luna-footer__brand">
        <span>Studio Luna Nails</span>
        <strong>Vidimo se u salonu.</strong>
        <p>Za termine, radove i brze informacije — piši nam direktno.</p>
      </div>

      <div class="luna-footer__info">
        <a href="#" class="luna-footer__item">
          <svg viewBox="0 0 24 24">
            <rect x="5" y="5" width="14" height="14" rx="4" />
            <circle cx="12" cy="12" r="3.2" />
            <circle cx="16.4" cy="7.6" r=".7" />
          </svg>

          <span>@studiolunanails</span>
        </a>

        <a href="#" class="luna-footer__item">
          <svg viewBox="0 0 24 24">
            <path d="M12 21s7-5.2 7-12a7 7 0 0 0-14 0c0 6.8 7 12 7 12Z" />
            <circle cx="12" cy="9" r="2.3" />
          </svg>

          <span>Cara Dušana 45</span>
        </a>

        <div class="luna-footer__item">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8" />
            <path d="M12 7v5l3 2" />
          </svg>

          <span>Pon–Sub 09–20h</span>
        </div>
      </div>

      <button class="luna-footer__cta" type="button">
        Zakaži termin
        <span>→</span>
      </button>

      <p class="luna-footer__bottom">© Studio Luna Nails</p>
    </footer>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import heroImage from '@/assets/img/nail-hero5.png'
import priceBoardImage from '@/assets/img/nail-cenovnik3.png'


const activeFaq = ref<number | null>(0)
const activeNailType = ref(0)


const router = useRouter()

const goToBooking = () => {
  router.push({name: 'NailSalonBooking'});
}

const toggleFaq = (index: number) => {
  activeFaq.value = activeFaq.value === index ? null : index
}

const beforeFaqEnter = (el: Element) => {
  const element = el as HTMLElement

  element.style.height = '0'
  element.style.opacity = '0'
  element.style.overflow = 'hidden'
}

const faqEnter = (el: Element, done: () => void) => {
  const element = el as HTMLElement
  const height = element.scrollHeight

  element.style.transition =
    'height 0.32s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.22s ease'

  requestAnimationFrame(() => {
    element.style.height = `${height}px`
    element.style.opacity = '1'
  })

  window.setTimeout(done, 330)
}

const afterFaqEnter = (el: Element) => {
  const element = el as HTMLElement

  element.style.height = 'auto'
  element.style.overflow = 'visible'
  element.style.transition = ''
}

const beforeFaqLeave = (el: Element) => {
  const element = el as HTMLElement

  element.style.height = `${element.scrollHeight}px`
  element.style.opacity = '1'
  element.style.overflow = 'hidden'
}

const faqLeave = (el: Element, done: () => void) => {
  const element = el as HTMLElement

  element.style.transition =
    'height 0.26s cubic-bezier(0.55, 0, 0.1, 1), opacity 0.18s ease'

  requestAnimationFrame(() => {
    element.style.height = '0'
    element.style.opacity = '0'
  })

  window.setTimeout(done, 270)
}

const services = [
  {
    title: 'Gel lak',
    time: '60 min',
    icon: `
      <svg viewBox="0 0 32 32">
        <path d="M13 4h6l1 8h-8l1-8Z" />
        <path d="M11 12h10l2 14a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2l2-14Z" />
      </svg>
    `,
  },
  {
    title: 'Izlivanje',
    time: '120 min',
    icon: `
      <svg viewBox="0 0 32 32">
        <path d="M16 5c4.1 0 6.8 4 6.8 10.4V28H9.2V15.4C9.2 9 11.9 5 16 5Z" />
        <path d="M12.2 18c1.8-1.4 5.8-1.4 7.6 0" />
      </svg>
    `,
  },
  {
    title: 'Korekcija',
    time: '90 min',
    icon: `
      <svg viewBox="0 0 32 32">
        <path d="M16 5c4.1 0 6.8 4 6.8 10.4V28H9.2V15.4C9.2 9 11.9 5 16 5Z" />
        <path d="M12 18.5c2.2 1.1 5.8 1.1 8 0" />
      </svg>
    `,
  },
  {
    title: 'Manikir',
    time: '45 min',
    icon: `
      <svg viewBox="0 0 32 32">
        <path d="M10 18V9a2 2 0 0 1 4 0v8" />
        <path d="M14 17V6.5a2 2 0 0 1 4 0V17" />
        <path d="M18 17V8a2 2 0 0 1 4 0v10" />
        <path d="M22 19v-6a2 2 0 0 1 4 0v8c0 5-3.5 8-8.5 8H15c-3.4 0-6.4-2.4-8-6l-1-2.4a2 2 0 0 1 3.6-1.8l2 2.8" />
      </svg>
    `,
  },
]

const nailTypes = [
  {
    title: 'French',
    label: 'Klasičan stil',
    image: 'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=600',
    text: 'Čist i uredan izgled sa nežno naglašenim vrhom. Idealan za elegantan i bezvremenski finiš.',
  },
  {
    title: 'Milky',
    label: 'Nežan izgled',
    image: 'https://images.pexels.com/photos/3997391/pexels-photo-3997391.jpeg?auto=compress&cs=tinysrgb&w=600',
    text: 'Mlečni tonovi daju mekan, čist i luksuzan efekat. Jedan od najtraženijih izbora za suptilan izgled.',
  },
  {
    title: 'Baby boomer',
    label: 'Soft ombré',
    image: 'https://images.pexels.com/photos/939834/pexels-photo-939834.jpeg?auto=compress&cs=tinysrgb&w=600',
    text: 'Blag prelaz između prirodne baze i svetlijeg vrha. Sofisticiran stil koji izgleda nežno i uredno.',
  },
  {
    title: 'Nude',
    label: 'Prirodan ton',
    image: 'https://images.pexels.com/photos/3997386/pexels-photo-3997386.jpeg?auto=compress&cs=tinysrgb&w=600',
    text: 'Topli i prirodni tonovi koji se lako uklapaju uz svaki stil. Minimalno, uredno i elegantno.',
  },
  {
    title: 'Chrome',
    label: 'Sjajni efekat',
    image: 'https://images.pexels.com/photos/3997377/pexels-photo-3997377.jpeg?auto=compress&cs=tinysrgb&w=600',
    text: 'Reflektujući finiš sa modernim glow efektom. Za malo upečatljiviji, ali i dalje elegantan izgled.',
  },
  {
    title: 'Cat eye',
    label: 'Magnetni efekat',
    image: 'https://images.pexels.com/photos/3997397/pexels-photo-3997397.jpeg?auto=compress&cs=tinysrgb&w=600',
    text: 'Svetlucavi dubinski efekat koji daje posebnu dimenziju boji. Odličan izbor za glam detalj.',
  },
  {
    title: 'Minimal art',
    label: 'Diskretan detalj',
    image: 'https://images.pexels.com/photos/3997392/pexels-photo-3997392.jpeg?auto=compress&cs=tinysrgb&w=600',
    text: 'Fine linije, sitni akcenti i nežni detalji za moderan, čist i pažljivo stilizovan izgled.',
  },
]

const works = [
  {
    image: 'https://images.pexels.com/photos/17280274/pexels-photo-17280274.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Nude glitter almond nokti',
  },
  {
    image: 'https://images.pexels.com/photos/14396082/pexels-photo-14396082.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Pink nail art nokti',
  },
  {
    image: 'https://images.pexels.com/photos/28968363/pexels-photo-28968363.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Sparkly nude nail art',
  },
  {
    image: 'https://images.pexels.com/photos/939834/pexels-photo-939834.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Soft pink manikir',
  },
]

const prices = [
  {
    title: 'Gel lak',
    time: '60 min',
    price: '2.000',
  },
  {
    title: 'Ojačavanje',
    time: '75 min',
    price: '2.500',
  },
  {
    title: 'Izlivanje',
    time: '120 min',
    price: '3.500',
  },
  {
    title: 'Korekcija',
    time: '90 min',
    price: '2.800',
  },
  {
    title: 'Manikir',
    time: '45 min',
    price: '1.500',
  },
]

const trustItems = [
  {
    title: 'Sterilan alat',
    text: 'zdravlje na prvom mestu',
    icon: `
      <svg viewBox="0 0 24 24">
        <path d="M12 3 19 6v5c0 4.5-2.8 8.2-7 10-4.2-1.8-7-5.5-7-10V6l7-3Z" />
        <path d="m9 12 2 2 4-5" />
      </svg>
    `,
  },
  {
    title: 'Precizna izrada',
    text: 'pažnja u svakom detalju',
    icon: `
      <svg viewBox="0 0 24 24">
        <path d="M12 3 20 9l-8 12L4 9l8-6Z" />
        <path d="M4 9h16M9 9l3 12 3-12M8 3l4 6 4-6" />
      </svg>
    `,
  },
  {
    title: 'Prijatan ambijent',
    text: 'miran kutak za tretman',
    icon: `
      <svg viewBox="0 0 24 24">
        <path d="M7 11V8a5 5 0 0 1 10 0v3" />
        <path d="M5 12h14a2 2 0 0 1 2 2v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2a2 2 0 0 1 2-2Z" />
        <path d="M7 20v2M17 20v2" />
      </svg>
    `,
  },
]

const faqs = [
  {
    question: 'Koliko traje gel lak?',
    answer: 'U proseku oko 60 minuta, u zavisnosti od pripreme nokta i dodatnih detalja.',
  },
  {
    question: 'Da li radite korekciju tuđeg rada?',
    answer: 'Da, ali je najbolje da pošalješ sliku trenutnog stanja noktiju pre zakazivanja.',
  },
  {
    question: 'Da li treba da pošaljem inspiraciju?',
    answer: 'Ako želiš nail art ili poseban oblik, pošalji sliku unapred kako bismo odvojili dovoljno vremena.',
  },
  {
    question: 'Kako se zakazuje termin?',
    answer: 'Termin možeš zakazati online ili porukom preko Instagrama.',
  },
]
</script>

<style scoped lang="scss">
.luna-page {
  min-height: 100dvh;
  overflow-x: hidden;
  color: #3b302d;
  background:
    radial-gradient(circle at 82% 2%, rgba(217, 169, 155, 0.2) 0%, transparent 32%),
    linear-gradient(180deg, #fbf6ef 0%, #f8f0e9 52%, #fbf8f4 100%);
  padding-bottom: 0;
}

.luna-hero {
  position: relative;
  min-height: 500px;
  overflow: hidden;
  padding: 18px 16px 0;
}

.luna-hero__image {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: #fbf6ef;

  &::before {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: 68%;
    z-index: 2;
    background: linear-gradient(
      90deg,
      rgba(250, 244, 237, 0.99) 0%,
      rgba(250, 244, 237, 0.93) 36%,
      rgba(250, 244, 237, 0.62) 68%,
      transparent 100%
    );
  }

  &::after {
    content: '';
    position: absolute;
    inset: auto 0 0;
    height: 145px;
    z-index: 3;
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(250, 244, 237, 0.6) 45%,
      #fbf6ef 100%
    );
  }

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: calc(50% + 30px) top;
  }
}

.luna-header {
  position: relative;
  z-index: 5;
  min-height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.luna-brand {
  border: 0;
  background: transparent;
  padding: 0;
  color: inherit;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  text-align: left;
  min-width: 0;
}

.luna-brand__logo {
  position: relative;
  width: 50px;
  height: 50px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  color: #9a6a60;
}

.luna-brand__moon {
  position: absolute;
  inset: 0;
  font-size: 46px;
  line-height: 1;
  transform: rotate(-18deg);
  color: rgba(156, 107, 96, 0.82);
}

.luna-brand__initial {
  position: relative;
  z-index: 2;
  font-family: 'Brush Script MT', 'Segoe Script', cursive;
  font-size: 28px;
  line-height: 1;
  color: #6d453f;
}

.luna-brand__spark {
  position: absolute;
  z-index: 3;
  color: #b9897d;
  font-size: 7px;
}

.luna-brand__spark--one {
  top: 8px;
  right: 5px;
}

.luna-brand__spark--two {
  top: 19px;
  right: 0;
  font-size: 6px;
}

.luna-brand__text {
  display: grid;
  gap: 3px;
  min-width: 0;

  strong {
    color: #392d2a;
    font-family: 'Brush Script MT', 'Segoe Script', 'Snell Roundhand', cursive;
    font-size: 28px;
    font-weight: 400;
    line-height: 0.9;
    letter-spacing: -0.055em;
  }

  small {
    color: #b47e74;
    font-size: 13px;
    font-style: italic;
    line-height: 1;
  }
}

.luna-menu {
  width: 45px;
  height: 45px;
  flex: 0 0 auto;
  border: 1px solid rgba(150, 104, 91, 0.25);
  border-radius: 50%;
  background: rgba(255, 250, 246, 0.62);
  box-shadow:
    0 10px 24px rgba(93, 62, 53, 0.07),
    inset 0 1px 0 rgba(255, 255, 255, 0.88);
  color: #6c4c45;
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    position: relative;
    width: 18px;
    height: 1.4px;
    border-radius: 99px;
    background: #9f6e64;

    &::before,
    &::after {
      content: '';
      position: absolute;
      left: 0;
      width: 18px;
      height: 1.4px;
      border-radius: 99px;
      background: #9f6e64;
    }

    &::before {
      top: -5px;
    }

    &::after {
      top: 5px;
    }
  }
}

.luna-hero__content {
  position: relative;
  z-index: 5;
  width: 58%;
  max-width: 235px;
  padding-top: 76px;
}

.luna-hero h1 {
  margin: 0;
  color: #3a302d;
  font-family: 'Brush Script MT', 'Segoe Script', 'Snell Roundhand', cursive;
  font-size: clamp(42px, 11.5vw, 55px);
  font-weight: 400;
  line-height: 0.86;
  letter-spacing: -0.055em;
}

.luna-hero__line {
  display: block;
  width: 48px;
  height: 1px;
  margin-top: 18px;
  background: rgba(158, 105, 94, 0.42);
}

.luna-hero p {
  margin: 15px 0 0;
  color: #4f4440;
  font-size: 14px;
  line-height: 1.42;
  letter-spacing: -0.02em;
}

.luna-hero__actions {
  display: grid;
  justify-items: start;
  gap: 10px;
  margin-top: 26px;
}

.luna-btn {
  border-radius: 999px;
  min-height: 44px;
  padding: 0 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;

  svg {
    width: 17px;
    height: 17px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.65;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

.luna-btn--primary {
  border: 0;
  color: #fff8f3;
  background: linear-gradient(135deg, #c58c80 0%, #ad756c 100%);
  box-shadow:
    0 14px 28px rgba(142, 82, 72, 0.17),
    inset 0 1px 0 rgba(255, 255, 255, 0.22);
}

.luna-btn--secondary {
  min-width: 216px;
  border: 1px solid rgba(158, 105, 94, 0.34);
  color: #8a5f55;
  background: rgba(255, 250, 246, 0.42);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.76);
}

.luna-section {
  position: relative;
  z-index: 6;
  padding: 0 16px;
}

.luna-section--services {
  margin-top: 34px;
}

.luna-section--works {
  margin-top: 38px;
}

.luna-section--trust {
  margin-top: 34px;
}

.luna-title {
  display: grid;
  grid-template-columns: minmax(42px, 1fr) auto minmax(42px, 1fr);
  align-items: center;
  gap: 13px;
  margin-bottom: 23px;

  > span {
    position: relative;
    height: 18px;
    overflow: visible;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 9px;
      height: 12px;
      border-top: 1px solid rgba(166, 112, 101, 0.34);
      border-radius: 50%;
    }

    &::after {
      content: '';
      position: absolute;
      top: 5px;
      width: 7px;
      height: 7px;
      border: 1px solid rgba(166, 112, 101, 0.32);
      border-radius: 50%;
      background: rgba(251, 246, 239, 0.85);
    }

    &:first-child {
      &::before {
        transform: rotate(-3deg);
        transform-origin: right center;
      }

      &::after {
        right: -3px;
      }
    }

    &:last-child {
      &::before {
        transform: rotate(3deg);
        transform-origin: left center;
      }

      &::after {
        left: -3px;
      }
    }
  }

  h2 {
    margin: 0;
    color: #3b302d;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 22px;
    font-weight: 400;
    line-height: 1;
    letter-spacing: 0.035em;
    white-space: nowrap;
  }
}

.luna-services {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 11px;
}

.luna-service {
  position: relative;
  min-height: 106px;
  overflow: hidden;
  border: 1px solid rgba(145, 96, 85, 0.13);
  border-radius: 20px;
  background:
    linear-gradient(145deg, rgba(255, 253, 249, 0.9) 0%, rgba(250, 239, 231, 0.76) 100%);
  box-shadow:
    0 12px 26px rgba(86, 57, 49, 0.07),
    inset 0 1px 0 rgba(255, 255, 255, 0.96);
  display: grid;
  grid-template-columns: 42px 1fr;
  align-items: center;
  gap: 11px;
  padding: 13px 12px;
}

.luna-service__shine {
  position: absolute;
  inset: -40px -40px auto auto;
  width: 82px;
  height: 82px;
  border-radius: 50%;
  background: rgba(205, 147, 134, 0.16);
  filter: blur(9px);
  pointer-events: none;
}

.luna-service__icon {
  position: relative;
  z-index: 2;
  width: 42px;
  height: 42px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  color: #a96f65;
  background:
    linear-gradient(145deg, rgba(255, 251, 247, 0.96) 0%, rgba(245, 229, 220, 0.9) 100%);
  border: 1px solid rgba(174, 117, 105, 0.15);
  box-shadow:
    0 8px 16px rgba(89, 58, 51, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.96);

  :deep(svg) {
    width: 25px;
    height: 25px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.35;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

.luna-service__copy {
  position: relative;
  z-index: 2;
  min-width: 0;

  h3 {
    margin: 0;
    color: #3e302d;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.05;
    letter-spacing: -0.035em;
  }

  p {
    margin: 7px 0 0;
    width: fit-content;
    border-radius: 999px;
    padding: 4px 8px;
    color: #94665d;
    background: rgba(255, 250, 246, 0.72);
    border: 1px solid rgba(166, 112, 101, 0.14);
    font-size: 10px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: 0.04em;
  }
}

.luna-nail-types {
  position: relative;
  z-index: 6;
  margin-top: 32px;
  padding: 30px 16px 34px;
  background-color: rgb(250, 234, 225);
}

.luna-nail-types__head {
  text-align: center;

  span {
    display: block;
    color: rgba(70, 42, 37, 0.52);
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  h2 {
    margin: 8px 0 0;
    color: #382b28;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 25px;
    font-weight: 400;
    line-height: 1;
    letter-spacing: -0.045em;
  }

  p {
    max-width: 270px;
    margin: 12px auto 0;
    color: rgba(58, 45, 42, 0.65);
    font-size: 13px;
    line-height: 1.42;
    letter-spacing: -0.02em;
  }
}

.luna-nail-types__rail {
  margin-top: 22px;
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
}

.luna-nail-types__pill {
  flex: 0 0 auto;
  min-height: 38px;
  border: 1px solid rgba(145, 96, 85, 0.16);
  border-radius: 999px;
  padding: 0 16px;
  color: rgba(66, 44, 39, 0.72);
  background: rgba(255, 248, 244, 0.42);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.58);
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1;
  white-space: nowrap;
  transition:
    background 0.22s ease,
    color 0.22s ease,
    border-color 0.22s ease,
    transform 0.22s ease;

  &.active {
    color: #fff8f3;
    background: #b98176;
    border-color: #b98176;
    transform: translateY(-1px);
  }
}

.luna-nail-types__preview {
  margin-top: 18px;
  min-height: 126px;
  display: grid;
  grid-template-columns: 104px 1fr;
  align-items: center;
  gap: 15px;
  text-align: left;
}

.luna-nail-types__photo {
  width: 104px;
  height: 112px;
  overflow: hidden;
  border-radius: 24px;
  background: rgba(255, 248, 244, 0.46);
  box-shadow:
    0 14px 28px rgba(91, 55, 49, 0.07),
    inset 0 1px 0 rgba(255, 255, 255, 0.66);

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }
}

.luna-nail-types__copy {
  min-width: 0;

  span {
    display: block;
    color: rgba(79, 49, 43, 0.5);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  h3 {
    margin: 7px 0 0;
    color: #3b302d;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 23px;
    font-weight: 400;
    line-height: 1;
    letter-spacing: -0.04em;
  }

  p {
    margin: 9px 0 0;
    color: rgba(58, 45, 42, 0.66);
    font-size: 12.5px;
    line-height: 1.43;
    letter-spacing: -0.015em;
  }
}

.luna-works-head {
  margin: -10px 0 16px;
  display: grid;
  gap: 10px;

  p {
    margin: 0 auto;
    max-width: 260px;
    color: #6b5751;
    font-size: 13px;
    line-height: 1.42;
    letter-spacing: -0.02em;
    text-align: center;
  }

  button {
    justify-self: end;
    border: 0;
    background: transparent;
    padding: 0 0 2px;
    color: #9e6d63;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    font-style: italic;
    white-space: nowrap;

    i {
      font-style: normal;
      font-size: 15px;
    }
  }
}

.luna-works {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 72%;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: 16px;
  margin: 0 -16px;
  padding: 0 16px 8px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.luna-work {
  position: relative;
  height: 190px;
  overflow: hidden;
  border-radius: 22px;
  background: #eadbd2;
  scroll-snap-align: start;
  border: 1px solid rgba(145, 96, 85, 0.11);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.42);

  &::after {
    content: '';
    position: absolute;
    inset: auto 0 0;
    height: 42%;
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(43, 29, 25, 0.22) 100%
    );
    pointer-events: none;
  }

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }
}

.luna-trust {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.luna-trust__item {
  min-height: 108px;
  text-align: center;
  display: grid;
  justify-items: center;
  align-content: start;
  padding: 0 8px;

  &:not(:last-child) {
    border-right: 1px solid rgba(145, 96, 85, 0.2);
  }

  h3 {
    margin: 9px 0 0;
    color: #3f312e;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 13px;
    font-weight: 400;
    line-height: 1.1;
  }

  p {
    margin: 4px 0 0;
    max-width: 100px;
    color: #5d4d48;
    font-size: 10px;
    line-height: 1.25;
  }
}

.luna-trust__icon {
  width: 34px;
  height: 34px;
  color: #aa7167;

  :deep(svg) {
    width: 100%;
    height: 100%;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.45;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

.luna-faq {
  position: relative;
  z-index: 6;
  margin-top: 44px;
  padding: 38px 16px 40px;
  background-color: rgb(250, 234, 225);
}

.luna-faq__head {
  text-align: center;
  margin-bottom: 24px;

  span {
    display: block;
    margin-bottom: 8px;
    color: rgba(70, 42, 37, 0.54);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  h2 {
    margin: 0;
    color: #382b28;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 28px;
    font-weight: 400;
    line-height: 1;
    letter-spacing: -0.045em;
  }

  p {
    max-width: 270px;
    margin: 16px auto 0;
    color: rgba(58, 45, 42, 0.68);
    font-size: 13px;
    line-height: 1.48;
    letter-spacing: -0.02em;
  }
}

.luna-faq__list {
  display: grid;
}

.luna-faq__item {
  border-bottom: 1px solid rgba(89, 55, 49, 0.13);

  &:first-child {
    border-top: 1px solid rgba(89, 55, 49, 0.13);
  }

  button {
    width: 100%;
    min-height: 58px;
    border: 0;
    background: transparent;
    padding: 15px 0;
    color: #3b302d;
    display: grid;
    grid-template-columns: 1fr 28px;
    align-items: center;
    gap: 14px;
    text-align: left;
    -webkit-tap-highlight-color: transparent;

    span {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 17px;
      font-weight: 400;
      line-height: 1.18;
      letter-spacing: -0.035em;
    }

    i {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      color: rgba(79, 48, 43, 0.72);
      background: rgba(255, 248, 244, 0.38);
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 20px;
      font-style: normal;
      line-height: 1;
      transition:
        transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
        background 0.22s ease;
    }
  }

  &.active button i {
    transform: rotate(180deg);
    background: rgba(255, 248, 244, 0.58);
  }
}

.luna-faq__answer {
  will-change: height, opacity;
  transform: translateZ(0);

  p {
    margin: 0;
    padding: 0 36px 16px 0;
    color: rgba(58, 45, 42, 0.67);
    font-size: 13px;
    line-height: 1.48;
    letter-spacing: -0.015em;
  }
}

.luna-footer {
  position: relative;
  z-index: 6;
  padding: 38px 20px 24px;
  color: #3b302d;
  background:
    radial-gradient(circle at 82% 2%, rgba(217, 169, 155, 0.11) 0%, transparent 32%),
    linear-gradient(180deg, #fbf8f4 0%, #fbf6ef 100%);
}

.luna-footer__brand {
  text-align: center;

  span {
    display: block;
    margin-bottom: 10px;
    color: rgba(66, 42, 38, 0.5);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  strong {
    display: block;
    color: #382b28;
    font-family: 'Brush Script MT', 'Segoe Script', 'Snell Roundhand', cursive;
    font-size: 47px;
    font-weight: 400;
    line-height: 0.86;
    letter-spacing: -0.06em;
  }

  p {
    max-width: 265px;
    margin: 16px auto 0;
    color: rgba(58, 45, 42, 0.64);
    font-size: 13px;
    line-height: 1.48;
    letter-spacing: -0.02em;
  }
}

.luna-footer__info {
  margin-top: 30px;
  display: grid;
  gap: 15px;
}

.luna-footer__item {
  color: #3b302d;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  svg {
    width: 18px;
    height: 18px;
    flex: 0 0 auto;
    color: rgba(93, 58, 51, 0.58);
    fill: none;
    stroke: currentColor;
    stroke-width: 1.65;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  span {
    color: rgba(55, 40, 37, 0.68);
    font-size: 13px;
    line-height: 1;
    letter-spacing: -0.015em;
  }
}

.luna-footer__cta {
  width: fit-content;
  min-width: 190px;
  min-height: 50px;
  margin: 30px auto 0;
  border: 0;
  border-radius: 999px;
  padding: 0 18px 0 24px;
  color: #fff8f3;
  background: #81534b;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 17px;
  font-weight: 400;
  letter-spacing: -0.025em;

  span {
    font-size: 18px;
    line-height: 1;
  }
}

.luna-footer__bottom {
  margin: 22px 0 0;
  color: rgba(61, 43, 39, 0.42);
  font-size: 10px;
  text-align: center;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.luna-section--prices {
  margin-top: 48px;
  position: relative;
  margin-bottom: 120px;
}

.cenovnik-slika {
  position: absolute;
  margin: 0 auto;
  width: 100%;
  inset: 1;

  img {
    width: 100%;
    height: 100%;
  }
}

.luna-price-board {
  position: relative;
  overflow: hidden;
  padding: 90px 22px 18px 24px;
  color: #3b302d;

  &::after {
    content: '';
    position: absolute;
    right: -46px;
    top: -54px;
    width: 145px;
    height: 145px;
    border-radius: 50%;
    background: rgba(255, 248, 244, 0.28);
    pointer-events: none;
  }
}

.luna-price-board__top {
  position: relative;
  z-index: 2;
  text-align: center;
  margin-bottom: 0;

  span {
    display: block;
    color: rgba(70, 42, 37, 0.62);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  h2 {
    margin: 8px 0 0;
    color: #3b2d2a;
    font-family: 'Brush Script MT', 'Segoe Script', 'Snell Roundhand', cursive;
    font-size: 48px;
    font-weight: 400;
    line-height: 0.85;
    letter-spacing: -0.06em;
  }

  p {
    margin: 11px auto 0;
    max-width: 230px;
    color: rgba(59, 45, 42, 0.68);
    font-size: 13px;
    line-height: 1.38;
  }
}

.luna-price-board__list {
  position: relative;
  z-index: 2;
  display: grid;
  gap: 0;
  padding: 10px 0 0;
  margin: 0 50px;
  border-bottom: 1px solid rgba(255, 248, 244, 0.42);
}

.luna-price-line {
  min-height: 58px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: end;
  gap: 10px;
  padding: 12px 0;

  strong {
    color: #3b2d2a;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 18px;
    font-weight: 400;
    line-height: 1;

    &::after {
      content: ' RSD';
      color: rgba(59, 45, 42, 0.56);
      font-size: 10px;
      letter-spacing: 0.04em;
    }
  }
}

.luna-price-line__left {
  min-width: 0;

  h3 {
    margin: 0;
    color: #3e302d;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 1;
    letter-spacing: -0.035em;
  }

  p {
    margin: 6px 0 0;
    color: rgba(65, 45, 41, 0.56);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
}

.luna-price-line__dots {
  height: 1px;
  margin-bottom: 4px;
  background-image: linear-gradient(
    90deg,
    rgba(81, 50, 45, 0.28) 35%,
    transparent 0%
  );
  background-size: 7px 1px;
  background-repeat: repeat-x;
}

.luna-price-board__note {
  position: relative;
  z-index: 2;
  margin: 16px 50px 0;
  display: grid;
  grid-template-columns: 24px 1fr;
  align-items: start;
  gap: 9px;

  span {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    color: #fff8f3;
    background: rgba(107, 63, 56, 0.62);
    font-size: 10px;
  }

  p {
    margin: 0;
    color: rgba(59, 45, 42, 0.66);
    font-size: 11px;
    line-height: 1.4;
    letter-spacing: -0.01em;
  }
}
</style>