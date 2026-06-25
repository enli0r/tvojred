<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import zenaProp from '@/assets/img/zena-prop2.png'
import logoS2 from '@/assets/img/logo-s2.png'
import zid1 from '@/assets/img/zid1.png'
import zid2 from '@/assets/img/zid2.png'
import zid3 from '@/assets/img/zid3.png'

import slika1 from '@/assets/img/slika54.png'
import slika2 from '@/assets/img/slika59.png'
import slika3 from '@/assets/img/slika58.png'
import slika4 from '@/assets/img/slika57.png'
import slika5 from '@/assets/img/slika55.png'
import slika6 from '@/assets/img/slika60.png'

/* ------------------------------------------------------------------ */
/*  STATE                                                              */
/* ------------------------------------------------------------------ */
const scrolled = ref(false)
const menuOpen = ref(false)
const activeGalleryIndex = ref<number | null>(null)

function syncBodyLock() {
  document.body.style.overflow = menuOpen.value || activeGalleryIndex.value !== null ? 'hidden' : ''
}

function onScroll() {
  scrolled.value = window.scrollY > 24
}

function toggleMenu(state?: boolean) {
  menuOpen.value = typeof state === 'boolean' ? state : !menuOpen.value
  syncBodyLock()
}

function goTo(id: string) {
  toggleMenu(false)
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function goToBooking() {
  toggleMenu(false)
  window.location.href = '/s2-vracar/zakazivanje'
}

function openGallery(idx: number) {
  activeGalleryIndex.value = idx
  syncBodyLock()
}

function closeGallery() {
  activeGalleryIndex.value = null
  syncBodyLock()
}

function showPrevImage() {
  if (activeGalleryIndex.value === null) return
  activeGalleryIndex.value = (activeGalleryIndex.value - 1 + gallery.length) % gallery.length
}

function showNextImage() {
  if (activeGalleryIndex.value === null) return
  activeGalleryIndex.value = (activeGalleryIndex.value + 1) % gallery.length
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    if (activeGalleryIndex.value !== null) closeGallery()
    else toggleMenu(false)
  }

  if (activeGalleryIndex.value !== null && e.key === 'ArrowLeft') showPrevImage()
  if (activeGalleryIndex.value !== null && e.key === 'ArrowRight') showNextImage()
}

/* ------------------------------------------------------------------ */
/*  SCROLL REVEAL (IntersectionObserver)                               */
/* ------------------------------------------------------------------ */
let io: IntersectionObserver | null = null

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
  onScroll()

  io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible')
          io?.unobserve(e.target)
        }
      })
    },
    { threshold: 0.08, rootMargin: '0px 0px -8% 0px' }
  )

  document.querySelectorAll('[data-reveal]').forEach((n) => io?.observe(n))
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
  io?.disconnect()
  document.body.style.overflow = ''
})

/* ------------------------------------------------------------------ */
/*  CONTENT                                                            */
/* ------------------------------------------------------------------ */
const nav = [
  { label: 'Početna', id: 'home' },
  { label: 'Usluge', id: 'usluge' },
  { label: 'Naš tim', id: 'tim' },
  { label: 'Galerija', id: 'galerija' },
  { label: 'Kontakt', id: 'kontakt' }
]

import balayage from '@/assets/img/s2usluga1.png'
import tretmani from '@/assets/img/s2usluga2.png'
import svecane from '@/assets/img/s2usluga3.png'

const services = [
  {
    n: '01',
    title: 'Balayage / pramenovi',
    desc: 'Prirodni prelivi, mekani tonovi i pramenovi prilagođeni tenu i stilu kose.',
    img: balayage
  },
  {
    n: '02',
    title: 'Make-up / Air touch / color korekcije',
    desc: 'Precizne kolor korekcije, Air touch tehnika i profesionalni make-up za svaku priliku.',
    img: svecane
  },
  {
    n: '03',
    title: 'Mini val',
    desc: 'Volumen, tekstura i definisan oblik kose uz nežan, moderan i dugotrajan rezultat.',
    img: tretmani
  }
]

import girl11 from '@/assets/img/girl11.jpg'
import girl12 from '@/assets/img/girl12.jpg'
import girl13 from '@/assets/img/girl13.jpg'
import girl14 from '@/assets/img/girl14.jpg'

const team = [
  { name: 'Ana Marić', role: 'Art direktor', img: girl11 },
  { name: 'Mila Jović', role: 'Senior kolorista', img: girl12 },
  { name: 'Teodora Pavić', role: 'Stilista', img: girl13 },
  { name: 'Nina Lukić', role: 'Tretmani & nega', img: girl14 }
]

import friz1 from '@/assets/img/friz1.png'
import friz2 from '@/assets/img/friz2.png'
import friz3 from '@/assets/img/friz3.png'
import friz4 from '@/assets/img/friz4.png'
import friz5 from '@/assets/img/friz5.png'
import friz6 from '@/assets/img/friz6.png'

const gallery = [
  slika1,
  slika2,
  slika3,
  slika4,
  slika5,
  slika6
]

const pricing = [
  { name: 'Šišanje (žensko)', price: '2.500' },
  { name: 'Šišanje (muško)', price: '1.500' },
  { name: 'Pranje + feniranje', price: '1.800' },
  { name: 'Farbanje (od)', price: '4.500' },
  { name: 'Balayage (od)', price: '7.000' },
  { name: 'Keratin tretman', price: '9.000' },
  { name: 'Svečana frizura', price: '5.500' }
]

const reviews = [
  {
    text: 'Najbolji salon u koji sam ikada ušla. Boja je ispala tačno kao na slici koju sam donela.',
    name: 'Jovana S.',
    img: 'https://i.pravatar.cc/200?img=20'
  },
  {
    text: 'Atmosfera je mirna, osoblje pažljivo, a rezultat svaki put preko očekivanja.',
    name: 'Marija T.',
    img: 'https://i.pravatar.cc/200?img=24'
  },
  {
    text: 'Dolazim već dve godine i nikada nisam razočarana. Vrhunska usluga.',
    name: 'Ivana P.',
    img: 'https://i.pravatar.cc/200?img=16'
  }
]
</script>

<template>
  <div class="aur" id="home">
    <!-- ====================== HEADER ====================== -->
    <header class="aur-head" :class="{ 'aur-head--solid': scrolled, 'aur-head--hidden': menuOpen }">
      <div class="aur-wrap aur-head__inner">
        <nav class="aur-nav aur-nav--left">
          <button v-for="i in nav.slice(0, 2)" :key="i.id" @click="goTo(i.id)">
            {{ i.label }}
          </button>
        </nav>

        <button class="aur-logo aur-logo--image" @click="goTo('home')" aria-label="S2 Vračar početna">
          <img class="aur-logo__img" :src="logoS2" alt="S2 Vračar" />
        </button>

        <nav class="aur-nav aur-nav--right">
          <button v-for="i in nav.slice(2)" :key="i.id" @click="goTo(i.id)">
            {{ i.label }}
          </button>
          <button class="aur-btn aur-btn--pill" @click="goToBooking">Zakaži termin</button>
        </nav>

        <button class="aur-burger" @click="toggleMenu(true)" aria-label="Otvori meni">
          <span></span>
          <span></span>
        </button>
      </div>
    </header>

    <!-- ====================== MOBILE MENU (fullscreen) ====================== -->
    <aside class="aur-drawer" :class="{ 'is-open': menuOpen }">
      <div class="aur-drawer__top">
        <button class="aur-logo aur-logo--image aur-logo--drawer" type="button" @click="goTo('home')" aria-label="S2 Vračar početna">
          <img class="aur-logo__img aur-logo__img--drawer" :src="logoS2" alt="S2 Vračar" />
        </button>
        <button class="aur-drawer__close" @click="toggleMenu(false)" aria-label="Zatvori meni">
          <span></span>
          <span></span>
        </button>
      </div>

      <nav class="aur-drawer__nav">
        <button v-for="(i, idx) in nav" :key="i.id" @click="goTo(i.id)">
          <span class="aur-drawer__idx">0{{ idx + 1 }}</span>
          {{ i.label }}
        </button>
      </nav>

      <div class="aur-drawer__foot">
        <button class="aur-btn aur-btn--cream aur-drawer__cta" @click="goToBooking">
          Zakaži termin
        </button>

        <div class="aur-drawer__contact">
          <a href="tel:+381600000000">+381 60 000 0000</a>
          <a href="#">@s2.vracar</a>
        </div>
      </div>
    </aside>

    <!-- ====================== HERO ====================== -->
    <section class="aur-hero">
      <div class="aur-wrap aur-hero__inner">
        <div class="aur-hero__copy">
          <p class="aur-kicker">
            <span class="aur-kicker__line"></span>
            Vračar, Beograd, Srbija
          </p>

          <h1 class="aur-hero__title2">
            Sve u službi<br />
            vaše <em>lepote</em>
          </h1>

          <div class="aur-hero__actions">
            <button class="aur-btn aur-btn--dark" @click="goToBooking">
              Zakaži termin
            </button>

            <button class="aur-play" @click="goTo('galerija')">
              <span class="aur-play__ico"></span>
              <span class="aur-play__txt">Pogledaj atmosferu</span>
            </button>
          </div>
        </div>

        <div class="aur-hero__media">
          <div class="aur-hero__arch"></div>
          <img :src="zenaProp" alt="Frizerski salon S2 Vračar" />
        </div>
      </div>
    </section>

    <!-- ====================== ABOUT ====================== -->
    <section class="aur-about" id="onama">
      <div class="aur-wrap aur-about__inner">
        <div class="aur-about__text" data-reveal>
          <h2 class="aur-h2">
            <span class="aur-num">01</span><span class="aur-slash">/</span> O nama
          </h2>

          <p>
            S2 Vračar je studio lepote u srcu Beograda u kome se klasična elegancija sreće sa savremenom
            tehnikom. Svaki tretman počinje razgovorom — slušamo šta želite, a zatim kreiramo izgled
            koji vam stvarno pripada.
          </p>

          <p>
            Radimo isključivo sa premium proizvodima i tehnikama koje čuvaju zdravlje kose. Naš cilj
            nije samo frizura za danas, već poverenje koje se vraća.
          </p>

          <div class="aur-stats">
            <div>
              <strong>+100</strong>
              <span>zadovoljnih klijenata</span>
            </div>

            <span class="aur-stats__div"></span>

            <div>
              <strong>+500</strong>
              <span>tretmana godišnje</span>
            </div>
          </div>
        </div>

        <div class="aur-about__media" data-reveal>
          <img class="aur-pill" :src="zid1" alt="Enterijer salona S2 Vračar" />
          <img class="aur-pill aur-pill--mid" :src="zid2" alt="Enterijer salona S2 Vračar" />
          <img class="aur-pill" :src="zid3" alt="Enterijer salona S2 Vračar" />
        </div>
      </div>
    </section>

    <!-- ====================== SERVICES ====================== -->
    <section class="aur-sec" id="usluge">
      <div class="aur-wrap">
        <div class="aur-sec__head" data-reveal>
          <h2 class="aur-h2 aur-h2--ink">
            <span class="aur-num aur-num--ink">02</span><span class="aur-slash">/</span> Usluge
          </h2>

          <p class="aur-sec__lead">
            Pažljivo osmišljen meni tretmana — od svakodnevnog stylinga do potpune transformacije.
          </p>
        </div>

        <div class="aur-serv">
          <article v-for="s in services" :key="s.n" class="aur-serv__card">
            <img :src="s.img" :alt="s.title" />

            <div class="aur-serv__overlay">
              <span class="aur-serv__n">{{ s.n }}</span>
              <h3>{{ s.title }}</h3>
              <p>{{ s.desc }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ====================== TEAM ====================== -->
    <section class="aur-sec aur-sec--dark" id="tim">
      <div class="aur-wrap">
        <div class="aur-sec__head" data-reveal>
          <h2 class="aur-h2">
            <span class="aur-num">03</span><span class="aur-slash">/</span> Naš tim
          </h2>

          <p class="aur-sec__lead aur-sec__lead--light">
            Ljudi iza svake transformacije — iskusni, posvećeni i uvek korak ispred trendova.
          </p>
        </div>

        <div class="aur-team">
          <article v-for="m in team" :key="m.name" class="aur-member" data-reveal>
            <div class="aur-member__img">
              <img :src="m.img" :alt="m.name" />
            </div>

            <h3>{{ m.name }}</h3>
            <span>{{ m.role }}</span>
          </article>
        </div>
      </div>
    </section>

    <!-- ====================== GALLERY ====================== -->
    <section class="aur-sec" id="galerija">
      <div class="aur-wrap">
        <div class="aur-sec__head" data-reveal>
          <h2 class="aur-h2 aur-h2--ink">
            <span class="aur-num aur-num--ink">04</span><span class="aur-slash">/</span> Galerija
          </h2>

          <p class="aur-sec__lead">Delić atmosfere i radova iz našeg studija.</p>
        </div>

        <div class="aur-gal">
          <button
            v-for="(g, idx) in gallery"
            :key="idx"
            class="aur-gal__item"
            data-reveal
            type="button"
            :aria-label="`Otvori sliku ${idx + 1} iz galerije`"
            @click="openGallery(idx)"
          >
            <img :src="g" alt="Rad salona S2 Vračar" />
          </button>
        </div>
      </div>
    </section>

    <!-- ====================== LIGHTBOX ====================== -->
    <Teleport to="body">
      <div v-if="activeGalleryIndex !== null" class="aur-lightbox" @click.self="closeGallery">
        <button class="aur-lightbox__close" type="button" aria-label="Zatvori galeriju" @click="closeGallery">
          <span></span>
          <span></span>
        </button>

        <button class="aur-lightbox__nav aur-lightbox__nav--prev" type="button" aria-label="Prethodna slika" @click="showPrevImage">
          ‹
        </button>

        <img :src="gallery[activeGalleryIndex]" alt="Rad salona S2 Vračar" />

        <button class="aur-lightbox__nav aur-lightbox__nav--next" type="button" aria-label="Sledeća slika" @click="showNextImage">
          ›
        </button>
      </div>
    </Teleport>

    <!-- ====================== PRICING ====================== -->
    <section class="aur-sec aur-sec--cream" id="cenovnik">
      <div class="aur-wrap aur-price__grid">
        <div class="aur-price__intro" data-reveal>
          <h2 class="aur-h2 aur-h2--ink">
            <span class="aur-num aur-num--ink">05</span><span class="aur-slash">/</span> Cenovnik
          </h2>

          <p class="aur-sec__lead">
            Transparentne cene, bez skrivenih troškova. Za složenije tretmane cenu potvrđujemo na
            konsultaciji.
          </p>

          <button class="aur-btn aur-btn--dark" @click="goToBooking">
            Rezerviši termin
          </button>
        </div>

        <ul class="aur-price__list" data-reveal>
          <li v-for="p in pricing" :key="p.name">
            <span class="aur-price__name">{{ p.name }}</span>
            <span class="aur-price__dots"></span>
            <span class="aur-price__val">{{ p.price }} <small>RSD</small></span>
          </li>
        </ul>
      </div>
    </section>

    <!-- ====================== REVIEWS ====================== -->
    <section class="aur-sec aur-sec--dark">
      <div class="aur-wrap">
        <div class="aur-sec__head" data-reveal>
          <h2 class="aur-h2">
            <span class="aur-num">06</span><span class="aur-slash">/</span> Utisci
          </h2>

          <p class="aur-sec__lead aur-sec__lead--light">
            Ono što naši klijenti kažu posle posete.
          </p>
        </div>

        <div class="aur-rev">
          <figure v-for="r in reviews" :key="r.name" class="aur-rev__card" data-reveal>
            <blockquote>„{{ r.text }}"</blockquote>

            <figcaption>
              <img :src="r.img" :alt="r.name" />
              <span>{{ r.name }}</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- ====================== CONTACT / BOOKING ====================== -->
    <section class="aur-sec" id="kontakt">
      <div class="aur-wrap aur-contact">
        <div class="aur-contact__info" data-reveal>
          <h2 class="aur-h2 aur-h2--ink">
            <span class="aur-num aur-num--ink">07</span><span class="aur-slash">/</span> Zakaži termin
          </h2>

          <p class="aur-sec__lead">
            Ostavite par detalja i javljamo vam se u najkraćem roku radi potvrde termina.
          </p>

          <ul class="aur-contact__meta">
            <li><span>Adresa</span> Knez Mihailova 1, Beograd</li>
            <li><span>Telefon</span> <a href="tel:+381600000000">+381 60 000 0000</a></li>
            <li><span>Radno vreme</span> Pon–Sub · 09–20h</li>
            <li><span>Instagram</span> <a href="#">@s2.vracar</a></li>
          </ul>
        </div>

        <form class="aur-form" data-reveal @submit.prevent>
          <label>
            <span>Ime i prezime</span>
            <input type="text" placeholder="Vaše ime" required />
          </label>

          <label>
            <span>Telefon</span>
            <input type="tel" placeholder="06x xxx xxxx" required />
          </label>

          <label>
            <span>Usluga</span>
            <select>
              <option v-for="s in services" :key="s.n">{{ s.title }}</option>
              <option>Drugo / konsultacija</option>
            </select>
          </label>

          <label>
            <span>Poruka</span>
            <textarea rows="3" placeholder="Željeni dan i vreme, dodatne napomene…"></textarea>
          </label>

          <button class="aur-btn aur-btn--dark aur-form__submit" type="submit">
            Pošalji zahtev
          </button>
        </form>
      </div>
    </section>

    <!-- ====================== FOOTER ====================== -->
    <footer class="aur-foot">
      <div class="aur-wrap aur-foot__inner">
        <div class="aur-foot__brand">
          <span class="aur-logo aur-logo--image aur-logo--foot" aria-label="S2 Vračar">
            <img class="aur-logo__img aur-logo__img--foot" :src="logoS2" alt="S2 Vračar" />
          </span>
          <p>Studio lepote · Beograd</p>
        </div>

        <nav class="aur-foot__nav">
          <button v-for="i in nav" :key="i.id" @click="goTo(i.id)">
            {{ i.label }}
          </button>
        </nav>

        <div class="aur-foot__copy">
          © {{ new Date().getFullYear() }} S2 Vračar. Sva prava zadržana.
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap');

/* ---------- TOKENS ---------- */
.aur {
  --ink: #080808;
  --ink-soft: #161616;
  --cream: #f5f1e8;
  --blush: #eee5d4;
  --accent: #d4af5c;
  --lav: #2c2c2c;
  --muted: #746b5d;
  --line: rgba(8, 8, 8, 0.12);
  --line-light: rgba(255, 255, 255, 0.14);

  --gold: #d4af5c;
  --gold-strong: #e6b85d;
  --gold-hover: #bf9442;
  --gold-soft: #dfbd67;
  --gold-soft-hover: #e8c978;
  --hero-black: #050505;
  --hero-arch-top: #1b1b1b;
  --hero-arch-bottom: #000000;

  font-family: 'Inter', system-ui, sans-serif;
  color: var(--ink);
  background: var(--cream);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;

  * {
    box-sizing: border-box;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    background: none;
    border: 0;
    color: inherit;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  ::selection {
    background: var(--gold);
    color: var(--ink);
  }
}

.aur-wrap {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 32px;
}

/* ---------- TYPE ---------- */
.aur-logo {
  font-family: 'Fraunces', serif;
  font-weight: 600;
  font-size: 26px;
  letter-spacing: -0.01em;

  &--image {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    line-height: 0;
  }

  &__img {
    width: auto !important;
    height: 30px !important;
    max-width: none !important;
    object-fit: contain !important;
  }

  &__img--drawer,
  &__img--foot {
    width: auto !important;
    height: 30px !important;
    max-width: none !important;
    object-fit: contain !important;
  }

  &--drawer {
    flex: none;
  }

  &--light {
    color: var(--cream);
  }
}

.aur-kicker {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 14px;
  letter-spacing: 0.01em;
  font-weight: 500;
  color: rgba(245, 241, 232, 0.84);
  margin: 0 0 22px;

  &__line {
    width: 46px;
    height: 1px;
    background: var(--gold);
    opacity: 1;
  }
}

.aur-h2 {
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  font-size: clamp(30px, 4vw, 46px);
  letter-spacing: -0.03em;
  line-height: 1;
  margin: 0 0 18px;
  color: var(--cream);
  display: flex;
  align-items: baseline;
  gap: 12px;

  &--ink {
    color: var(--ink);
  }
}

.aur-num {
  font-family: 'Fraunces', serif;
  font-weight: 400;
  font-size: clamp(34px, 4.4vw, 52px);
  color: var(--gold-strong);

  &--ink {
    color: #c8942e;
  }
}

.aur-slash {
  font-family: 'Fraunces', serif;
  color: var(--gold);
  font-weight: 400;
}

/* ---------- BUTTONS ---------- */
.aur-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 15px;
  border-radius: 100px;
  padding: 14px 30px;
  white-space: nowrap;
  transition:
    transform 0.25s ease,
    background 0.25s ease,
    color 0.25s ease,
    box-shadow 0.25s ease;

  &.aur-btn--dark {
    background: var(--gold);
    color: var(--ink);
    box-shadow: 0 10px 26px rgba(198, 161, 91, 0.24);

    &:hover {
      transform: translateY(-2px);
      background: var(--gold-hover);
      box-shadow: 0 16px 34px rgba(198, 161, 91, 0.30);
    }
  }

  &.aur-btn--pill {
    background: var(--gold);
    color: var(--ink);
    padding: 11px 24px;
    font-size: 14px;
    box-shadow: 0 10px 24px rgba(198, 161, 91, 0.20);

    &:hover {
      background: var(--gold-hover);
    }
  }

  &.aur-btn--cream {
    background: var(--cream);
    color: var(--ink);

    &:hover {
      background: #fff;
      transform: translateY(-2px);
    }
  }
}

/* ---------- PLAY BUTTON ---------- */
.aur-play {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 0;
  color: var(--cream);
  padding-left: 6px;

  &__ico {
    position: relative;
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    flex: none;
    border-radius: 50%;
    background: var(--gold-soft);
    box-shadow:
      0 0 0 7px rgba(223, 189, 103, 0.20),
      0 0 0 1px rgba(212, 175, 92, 0.42),
      0 10px 24px rgba(0, 0, 0, 0.26);
    transition:
      transform 0.25s ease,
      box-shadow 0.25s ease,
      background 0.25s ease;

    &::before {
      content: '';
      width: 0;
      height: 0;
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
      border-left: 9px solid var(--ink);
      transform: translateX(2px);
    }
  }

  &__txt {
    font-weight: 600;
    font-size: 13.5px;
    line-height: 1;
    color: var(--cream);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 5px;
    text-decoration-color: rgba(223, 189, 103, 0.82);
  }

  &:hover &__ico {
    transform: scale(1.04);
    background: var(--gold-soft-hover);
    box-shadow:
      0 0 0 8px rgba(223, 189, 103, 0.26),
      0 0 0 1px rgba(212, 175, 92, 0.52),
      0 14px 30px rgba(0, 0, 0, 0.32);
  }
}

/* ---------- HEADER ---------- */
.aur-head {
  position: fixed;
  inset: 0 0 auto;
  z-index: 50;
  color: var(--cream);
  transition:
    background 0.35s ease,
    box-shadow 0.35s ease,
    opacity 0.3s ease;
  padding: 14px 0;

  &--solid {
    background: rgba(5, 5, 5, 0.84);
    backdrop-filter: blur(16px) saturate(1.2);
    box-shadow: 0 1px 0 rgba(255, 255, 255, 0.07);
  }

  &--hidden {
    opacity: 0;
    pointer-events: none;
  }

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.aur-nav {
  display: flex;
  align-items: center;
  gap: 30px;
  flex: 1;

  &--right {
    justify-content: flex-end;
  }

  button {
    font-size: 15px;
    font-weight: 500;
    color: var(--cream);
    position: relative;
    padding: 4px 0;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 0;
      height: 1px;
      background: currentColor;
      transition: width 0.25s ease;
    }

    &:hover::after {
      width: 100%;
    }
  }

  .aur-btn--pill {
    background: var(--gold);
    color: var(--ink);
    padding: 11px 24px;
    box-shadow: 0 10px 24px rgba(212, 175, 92, 0.22);

    &:hover {
      background: var(--gold-hover);
      color: var(--ink);
    }
  }

  .aur-btn--pill::after {
    display: none;
  }
}

.aur-burger {
  display: none;
  flex-direction: column;
  gap: 7px;
  width: 40px;
  height: 40px;
  align-items: flex-end;
  justify-content: center;

  span {
    height: 2px;
    width: 26px;
    background: var(--cream);
    transition: width 0.3s ease;
  }

  span:last-child {
    width: 18px;
  }

  &:hover span:last-child {
    width: 26px;
  }
}

/* ---------- FULLSCREEN MENU ---------- */
.aur-drawer {
  position: fixed;
  inset: 0;
  z-index: 80;
  background: radial-gradient(130% 90% at 100% 0%, #191919 0%, #050505 58%);
  color: var(--cream);
  display: flex;
  flex-direction: column;
  padding: 18px 28px 42px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-22px);
  transition:
    opacity 0.4s ease,
    transform 0.55s cubic-bezier(0.16, 1, 0.3, 1),
    visibility 0.55s;

  &.is-open {
    opacity: 1;
    visibility: visible;
    transform: none;
  }

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
  }

  &__close {
    width: 44px;
    height: 44px;
    position: relative;
    flex: none;

    span {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 24px;
      height: 2px;
      background: var(--cream);
    }

    span:first-child {
      transform: translate(-50%, -50%) rotate(45deg);
    }

    span:last-child {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
  }

  &__nav {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: auto 0;

    button {
      display: flex;
      align-items: baseline;
      gap: 18px;
      text-align: left;
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      font-size: clamp(36px, 12vw, 56px);
      letter-spacing: -0.02em;
      line-height: 1.04;
      color: var(--cream);
      padding: 8px 0;
      opacity: 0;
      transform: translateY(16px);
      transition:
        opacity 0.5s ease,
        transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
        color 0.25s ease;

      &:hover {
        color: var(--gold);
      }
    }
  }

  &.is-open &__nav button {
    opacity: 1;
    transform: none;
  }

  &.is-open &__nav button:nth-child(1) {
    transition-delay: 0.16s;
  }

  &.is-open &__nav button:nth-child(2) {
    transition-delay: 0.22s;
  }

  &.is-open &__nav button:nth-child(3) {
    transition-delay: 0.28s;
  }

  &.is-open &__nav button:nth-child(4) {
    transition-delay: 0.34s;
  }

  &.is-open &__nav button:nth-child(5) {
    transition-delay: 0.40s;
  }

  &__idx {
    font-family: 'Fraunces', serif;
    font-weight: 400;
    font-size: 15px;
    color: var(--gold);
    width: 26px;
    flex: none;
    transform: translateY(-0.35em);
  }

  &__foot {
    display: flex;
    flex-direction: column;
    gap: 22px;
    opacity: 0;
    transition: opacity 0.5s ease 0.42s;
  }

  &.is-open &__foot {
    opacity: 1;
  }

  &__cta {
    width: 100%;
  }

  &__contact {
    display: flex;
    flex-direction: column;
    gap: 6px;

    a {
      color: rgba(245, 239, 233, 0.62);
      text-decoration: none;
      font-size: 15px;
    }
  }
}

/* ---------- HERO ---------- */
@keyframes aurUp {
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

.aur-hero {
  position: relative;
  padding-top: 100px;
  background: var(--hero-black);

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background: rgba(212, 175, 92, 0.10);
    pointer-events: none;
  }

  &__inner {
    display: grid;
    grid-template-columns: 1.12fr 1fr;
    align-items: end;
    gap: 24px;
  }

  &__copy {
    padding-bottom: clamp(40px, 6vw, 84px);
  }

  &__copy > * {
    animation: aurUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  &__copy > *:nth-child(2) {
    animation-delay: 0.1s;
  }

  &__copy > *:nth-child(3) {
    animation-delay: 0.22s;
  }

  &__title2 {
    font-family: 'Poppins', sans-serif;
    font-weight: 400;
    font-size: clamp(40px, 6.4vw, 80px) !important;
    line-height: 0.98;
    letter-spacing: -0.02em;
    margin: 0 0 36px;
    color: var(--cream);

    em {
      font-family: 'Poppins', sans-serif;
      font-style: normal;
      font-weight: 400;
      color: var(--gold);
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 26px;
    flex-wrap: wrap;
  }

  &__media {
    position: relative;
    align-self: end;
    width: 100%;
    height: clamp(380px, 42vw, 540px);
    animation: aurUp 1s cubic-bezier(0.16, 1, 0.3, 1) both 0.12s;
  }

  &__arch {
    position: absolute;
    inset: auto 0 0;
    height: 100%;
    width: 94%;
    margin: 0 auto;
    background: linear-gradient(180deg, var(--hero-arch-top) 0%, #0e0e0e 42%, var(--hero-arch-bottom) 100%);
    border-radius: 50% 50% 0 0;
    opacity: 1;
  }

  &__media img {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 92%;
    height: 106%;
    object-fit: contain;
    object-position: bottom center;
    filter: drop-shadow(0 30px 50px rgba(0, 0, 0, 0.35));
  }
}

/* ---------- ABOUT ---------- */
.aur-about {
  background: var(--ink);
  color: var(--cream);
  padding: 110px 0;

  &__inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 70px;
    align-items: center;
  }

  &__text p {
    color: rgba(245, 239, 233, 0.74);
    font-size: 16px;
    max-width: 460px;
    margin: 0 0 18px;
  }

  &__media {
    display: flex;
    gap: 18px;
    justify-content: flex-end;
  }
}

.aur-pill {
    margin-top: 10px;
  width: 30%;
  aspect-ratio: 5 / 10;
  border-radius: 200px;
  overflow: hidden;

  &--mid {
    margin-top: -24px;
  }
}

.aur-stats {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 26px;
  margin-top: 40px;
  background: var(--gold);
  color: var(--ink);
  border-radius: 100px;
  padding: 22px 40px;
  width: fit-content;

  div {
    min-width: 132px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  strong {
    font-family: 'Fraunces', serif;
    font-weight: 600;
    font-size: 28px;
    line-height: 1;
  }

  span {
    font-size: 12.5px;
    color: rgba(8, 8, 8, 0.62);
    margin-top: 5px;
  }

  &__div {
    width: 1px;
    height: 42px;
    background: rgba(8, 8, 8, 0.14);
  }
}

/* ---------- SECTION SHELL ---------- */
.aur-sec {
  padding: 110px 0;

  &--dark {
    background: var(--ink);
    color: var(--cream);
  }

  &--cream {
    background: var(--blush);
  }

  &__head {
    max-width: 620px;
    margin-bottom: 56px;
  }

  &__lead {
    font-size: 17px;
    color: rgba(14, 12, 11, 0.62);
    margin: 0;
  }

  &__lead--light {
    color: rgba(245, 239, 233, 0.68);
  }
}

/* ---------- SERVICES ---------- */
.aur-serv {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.aur-serv__card {
  position: relative;
  aspect-ratio: 3 / 4;
  border-radius: 20px;
  overflow: hidden;
  background: var(--ink);

  img {
    transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(14, 12, 11, 0) 36%, rgba(14, 12, 11, 0.88) 100%);
  }

  &:hover img {
    transform: scale(1.06);
  }
}

.aur-serv__overlay {
  position: absolute;
  inset: auto 0 0;
  z-index: 1;
  padding: 24px;
  color: var(--cream);
}

.aur-serv__n {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-weight: 400;
  font-size: 15px;
  color: var(--gold);
}

.aur-serv__overlay h3 {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 21px;
  letter-spacing: -0.01em;
  margin: 8px 0;
}

.aur-serv__overlay p {
  font-size: 13.5px;
  line-height: 1.45;
  color: rgba(245, 239, 233, 0.82);
  margin: 0;
}

/* ---------- TEAM ---------- */
.aur-team {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px;
}

.aur-member {
  text-align: left;

  &__img {
    aspect-ratio: 3 / 4;
    border-radius: 18px;
    overflow: hidden;
    margin-bottom: 16px;

    img {
      transition:
        transform 0.6s ease,
        filter 0.6s ease;
      filter: grayscale(0.2);
    }
  }

  &:hover &__img img {
    transform: scale(1.04);
    filter: grayscale(0);
  }

  h3 {
    font-size: 18px;
    font-weight: 700;
    margin: 0 0 2px;
  }

  span {
    font-size: 13.5px;
    color: rgba(245, 239, 233, 0.64);
  }
}

/* ---------- GALLERY ---------- */
.aur-gal {
  columns: 3;
  column-gap: 18px;
}

.aur-gal__item {
  display: block;
  width: 100%;
  break-inside: avoid;
  margin-bottom: 18px;
  border-radius: 16px;
  overflow: hidden;
  padding: 0;
  text-align: left;
  background: var(--ink);

  img {
    transition: transform 0.6s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
}

/* ---------- LIGHTBOX ---------- */
.aur-lightbox {
  position: fixed;
  inset: 0;
  z-index: 120;
  display: grid;
  place-items: center;
  padding: 70px 88px;
  background: rgba(0, 0, 0, 0.88);
  backdrop-filter: blur(14px);

  img {
    max-width: min(1120px, 100%);
    max-height: 84vh;
    width: auto;
    height: auto;
    object-fit: contain;
    border-radius: 18px;
    box-shadow: 0 30px 90px rgba(0, 0, 0, 0.55);
  }

  &__close {
    position: absolute;
    top: 24px;
    right: 28px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(245, 241, 232, 0.14);
    border: 1px solid rgba(234, 215, 170, 0.52);
    transition: background 0.25s ease, transform 0.25s ease;

    span {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 24px;
      height: 2px;
      background: #fff;
      border-radius: 999px;
      box-shadow: 0 0 10px rgba(234, 215, 170, 0.38);
    }

    span:first-child {
      transform: translate(-50%, -50%) rotate(45deg);
    }

    span:last-child {
      transform: translate(-50%, -50%) rotate(-45deg);
    }

    &:hover {
      background: rgba(212, 175, 92, 0.18);
      transform: scale(1.04);
    }
  }

  &__nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 54px;
    height: 54px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: rgba(245, 241, 232, 0.10);
    border: 1px solid rgba(212, 175, 92, 0.34);
    color: var(--gold-strong);
    font-size: 42px;
    line-height: 1;
    transition: background 0.25s ease, transform 0.25s ease;

    &:hover {
      background: rgba(212, 175, 92, 0.18);
      transform: translateY(-50%) scale(1.04);
    }

    &--prev {
      left: 28px;
    }

    &--next {
      right: 28px;
    }
  }
}

/* ---------- PRICING ---------- */
.aur-price__grid {
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: 70px;
  align-items: start;
}

.aur-price__intro .aur-sec__lead {
  margin: 0 0 28px;
}

.aur-price__list {
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    display: flex;
    align-items: baseline;
    gap: 12px;
    padding: 18px 0;
    border-bottom: 1px solid var(--line);
  }
}

.aur-price__name {
  font-weight: 500;
  font-size: 16px;
  white-space: nowrap;
}

.aur-price__dots {
  flex: 1;
  border-bottom: 1px dotted rgba(14, 12, 11, 0.3);
  transform: translateY(-3px);
}

.aur-price__val {
  font-family: 'Fraunces', serif;
  font-weight: 600;
  color: var(--gold);
  font-size: 20px;
  white-space: nowrap;

  small {
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    font-size: 12px;
    color: black;
  }
}

/* ---------- REVIEWS ---------- */
.aur-rev {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.aur-rev__card {
  background: rgba(245, 239, 233, 0.05);
  border: 1px solid var(--line-light);
  border-radius: 20px;
  padding: 30px;

  blockquote {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 19px;
    line-height: 1.5;
    margin: 0 0 24px;
    color: rgba(245, 239, 233, 0.92);
  }

  figcaption {
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 600;
    font-size: 15px;

    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }
}

/* ---------- CONTACT ---------- */
.aur-contact {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 64px;
  align-items: start;
}

.aur-contact__meta {
  list-style: none;
  margin: 30px 0 0;
  padding: 0;

  li {
    padding: 16px 0;
    border-bottom: 1px solid var(--line);
    font-size: 16px;

    span {
      display: block;
      font-size: 12px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 4px;
    }

    a {
      color: var(--ink);
      text-decoration: none;
    }
  }
}

.aur-form {
  background: #fff;
  border-radius: 24px;
  padding: 34px;
  display: grid;
  gap: 18px;
  box-shadow: 0 24px 60px rgba(14, 12, 11, 0.06);

  label {
    display: grid;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
  }

  input,
  select,
  textarea {
    font-family: inherit;
    font-size: 15px;
    padding: 13px 15px;
    border-radius: 12px;
    border: 1px solid var(--line);
    background: var(--cream);
    color: var(--ink);
    resize: vertical;

    &:focus {
      outline: 2px solid var(--gold);
      outline-offset: 1px;
      border-color: transparent;
    }
  }

  &__submit {
    margin-top: 6px;
    justify-self: start;
  }
}

/* ---------- FOOTER ---------- */
.aur-foot {
  background: var(--ink);
  color: var(--cream);
  padding: 56px 0;

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 24px;
  }

  &__brand p {
    color: rgba(245, 239, 233, 0.55);
    font-size: 13px;
    margin: 4px 0 0;
  }

  &__nav {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;

    button {
      color: rgba(245, 239, 233, 0.72);
      font-size: 14px;

      &:hover {
        color: var(--gold);
      }
    }
  }

  &__copy {
    color: rgba(245, 239, 233, 0.42);
    font-size: 13px;
  }
}


/* ---------- LOGO IMAGE OVERRIDE ---------- */
.aur-logo.aur-logo--image > img.aur-logo__img,
.aur-logo.aur-logo--image > img.aur-logo__img--drawer,
.aur-logo.aur-logo--image > img.aur-logo__img--foot {
  width: auto !important;
  height: 30px !important;
  max-width: none !important;
  max-height: none !important;
  object-fit: contain !important;
}

/* ---------- REVEAL ---------- */
[data-reveal] {
  opacity: 0;
  transform: translateY(22px);
  transition:
    opacity 0.7s ease,
    transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

[data-reveal].is-visible {
  opacity: 1;
  transform: none;
}

/* ---------- RESPONSIVE ---------- */
@media (max-width: 980px) {
  .aur-nav {
    display: none;
  }

  .aur-burger {
    display: flex;
  }

  .aur-head {
    padding: 12px 0;
  }

  .aur-logo__img {
    width: auto !important;
    height: 30px !important;
    max-width: none !important;
    object-fit: contain !important;
  }

  .aur-logo__img--drawer,
  .aur-logo__img--foot {
    width: auto !important;
    height: 30px !important;
    max-width: none !important;
    object-fit: contain !important;
  }

  .aur-hero {
    padding-top: 80px;
  }

  .aur-hero__inner {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .aur-hero__media {
    order: -1;
    height: clamp(320px, 82vw, 460px);
    animation-delay: 0s;
  }

  .aur-hero__media img {
    width: 86%;
    height: 104%;
  }

  .aur-hero__copy {
    padding-bottom: 64px;
  }

  .aur-hero__title2 {
    font-size: clamp(28px, 12.5vw, 62px) !important;
    margin-bottom: 26px;
  }

  .aur-hero__actions {
    gap: 20px;
  }

  .aur-about {
    padding: 84px 0;
  }

  .aur-about__inner {
    grid-template-columns: 1fr;
    gap: 44px;
  }

  .aur-about__media {
    justify-content: flex-start;
  }

  .aur-serv {
    display: flex;
    grid-template-columns: none;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 14px;
    padding-bottom: 6px;
    scrollbar-width: none;
  }

  .aur-serv::-webkit-scrollbar {
    display: none;
  }

  .aur-serv__card {
    flex: 0 0 64%;
    scroll-snap-align: center;
  }

  .aur-team {
    grid-template-columns: repeat(2, 1fr);
  }

  .aur-gal {
    columns: 2;
  }

  .aur-rev {
    grid-template-columns: 1fr;
  }

  .aur-price__grid {
    grid-template-columns: 1fr;
    gap: 36px;
  }

  .aur-contact {
    grid-template-columns: 1fr;
    gap: 36px;
  }
}

@media (max-width: 560px) {
  .aur-wrap {
    padding: 0 20px;
  }

  .aur-logo__img {
    width: auto !important;
    height: 30px !important;
    max-width: none !important;
    object-fit: contain !important;
  }

  .aur-logo__img--drawer,
  .aur-logo__img--foot {
    width: auto !important;
    height: 30px !important;
    max-width: none !important;
    object-fit: contain !important;
  }

  .aur-sec {
    padding: 66px 0;
  }

  .aur-about {
    padding: 66px 0;
  }

  .aur-sec__head {
    margin-bottom: 40px;
  }

  .aur-hero__media {
    height: clamp(300px, 88vw, 420px);
  }

  .aur-stats {
    width: 100%;
    padding: 10px 22px;
    gap: 14px;
  }

  .aur-stats div {
    min-width: 0;
  }

  .aur-lightbox {
    padding: 68px 18px 34px;
  }

  .aur-lightbox__nav {
    width: 44px;
    height: 44px;
    font-size: 34px;
  }

  .aur-lightbox__nav--prev {
    left: 14px;
  }

  .aur-lightbox__nav--next {
    right: 14px;
  }

  .aur-stats strong {
    font-size: 22px;
  }

  .aur-stats span {
    font-size: 11.5px;
  }

  .aur-serv__card {
    flex: 0 0 78%;
  }

  .aur-team {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .aur-form {
    padding: 26px 22px;
  }

  .aur-foot__inner {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (prefers-reduced-motion: reduce) {
  [data-reveal] {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .aur-hero__copy > *,
  .aur-hero__media {
    animation: none;
  }

  .aur-drawer__nav button,
  .aur-drawer__foot {
    opacity: 1;
    transform: none;
    transition: none;
  }

  * {
    scroll-behavior: auto;
  }
}
</style>