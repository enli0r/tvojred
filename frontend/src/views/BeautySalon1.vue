<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import zenaProp from '@/assets/img/zena-prop.png'
import zid1 from '@/assets/img/zid1.png'
import zid2 from '@/assets/img/zid2.png'
import zid3 from '@/assets/img/zid3.png'

/* ------------------------------------------------------------------ */
/*  STATE                                                              */
/* ------------------------------------------------------------------ */
const scrolled = ref(false)
const menuOpen = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 24
}

function toggleMenu(state?: boolean) {
  menuOpen.value = typeof state === 'boolean' ? state : !menuOpen.value
  document.body.style.overflow = menuOpen.value ? 'hidden' : ''
}

function goTo(id: string) {
  toggleMenu(false)
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') toggleMenu(false)
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

import sisanje from '@/assets/img/sisanje-stajling.png'
import balayage from '@/assets/img/balayage.png'
import tretmani from '@/assets/img/tretmani.png'
import svecane from '@/assets/img/svecane.png'

const services = [
  {
    n: '01',
    title: 'Šišanje & styling',
    desc: 'Precizan rez prilagođen obliku lica i finiš koji traje danima.',
    img: sisanje
  },
  {
    n: '02',
    title: 'Boja & balayage',
    desc: 'Prirodni prelivi i tonovi rađeni po koži, bez oštrih granica.',
    img: balayage
  },
  {
    n: '03',
    title: 'Tretmani kose',
    desc: 'Dubinska nega, keratin i obnavljanje za sjaj i mekoću.',
    img: tretmani
  },
  {
    n: '04',
    title: 'Svečane frizure',
    desc: 'Punđe i lokne za venčanja, proslave i posebne prilike.',
    img: svecane
  }
]

import girl11 from '@/assets/img/girl11.jpg'
import girl12 from '@/assets/img/girl12.jpg'
import girl13 from '@/assets/img/girl13.jpg'
import girl14 from '@/assets/img/girl14.jpg'

const team = [
  { name: 'Ana Marić', role: 'Art direktor', img: girl11 },
  { name: 'Mila Jović', role: 'Senior kolorista', img: girl12},
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
  friz1,
  friz2,
  friz3,
  friz4,
  friz5,
  friz6
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
          <button v-for="i in nav.slice(0, 2)" :key="i.id" @click="goTo(i.id)">{{ i.label }}</button>
        </nav>

        <button class="aur-logo" @click="goTo('home')">Aurélie</button>

        <nav class="aur-nav aur-nav--right">
          <button v-for="i in nav.slice(2)" :key="i.id" @click="goTo(i.id)">{{ i.label }}</button>
          <button class="aur-btn aur-btn--pill" @click="goTo('kontakt')">Zakaži termin</button>
        </nav>

        <button class="aur-burger" @click="toggleMenu(true)" aria-label="Otvori meni">
          <span></span><span></span>
        </button>
      </div>
    </header>

    <!-- ====================== MOBILE MENU (fullscreen) ====================== -->
    <aside class="aur-drawer" :class="{ 'is-open': menuOpen }">
      <div class="aur-drawer__top">
        <span class="aur-logo aur-logo--light">Aurélie</span>
        <button class="aur-drawer__close" @click="toggleMenu(false)" aria-label="Zatvori meni">
          <span></span><span></span>
        </button>
      </div>

      <nav class="aur-drawer__nav">
        <button v-for="(i, idx) in nav" :key="i.id" @click="goTo(i.id)">
          <span class="aur-drawer__idx">0{{ idx + 1 }}</span>
          {{ i.label }}
        </button>
      </nav>

      <div class="aur-drawer__foot">
        <button class="aur-btn aur-btn--cream aur-drawer__cta" @click="goTo('kontakt')">Zakaži termin</button>
        <div class="aur-drawer__contact">
          <a href="tel:+381600000000">+381 60 000 0000</a>
          <a href="#">@aurelie.studio</a>
        </div>
      </div>
    </aside>

    <!-- ====================== HERO ====================== -->
    <section class="aur-hero">
      <div class="aur-wrap aur-hero__inner">
        <div class="aur-hero__copy">
          <p class="aur-kicker"><span class="aur-kicker__line"></span> Beograd, Srbija</p>
          <h1 class="aur-hero__title">
            Sve u službi<br />
            vaše <em>lepote</em>
          </h1>
          <div class="aur-hero__actions">
            <button class="aur-btn aur-btn--dark" @click="goTo('kontakt')">Zakaži termin</button>
            <button class="aur-play" @click="goTo('galerija')">
              <span class="aur-play__ico">▶</span>
              <span class="aur-play__txt">Pogledaj atmosferu</span>
            </button>
          </div>
        </div>
        <div class="aur-hero__media">
          <div class="aur-hero__arch"></div>
          <img :src="zenaProp" alt="Frizerski salon Aurélie" />
        </div>
      </div>
    </section>

    <!-- ====================== ABOUT ====================== -->
    <section class="aur-about" id="onama">
      <div class="aur-wrap aur-about__inner">
        <div class="aur-about__text" data-reveal>
          <h2 class="aur-h2"><span class="aur-num">01</span><span class="aur-slash">/</span> O nama</h2>
          <p>
            Aurélie je studio lepote u srcu Beograda u kome se klasična elegancija sreće sa savremenom
            tehnikom. Svaki tretman počinje razgovorom — slušamo šta želite, a zatim kreiramo izgled
            koji vam stvarno pripada.
          </p>
          <p>
            Radimo isključivo sa premium proizvodima i tehnikama koje čuvaju zdravlje kose. Naš cilj
            nije samo frizura za danas, već poverenje koje se vraća.
          </p>
          <div class="aur-stats">
            <div><strong>+100</strong><span>zadovoljnih klijenata</span></div>
            <span class="aur-stats__div"></span>
            <div><strong>+500</strong><span>tretmana godišnje</span></div>
          </div>
        </div>
        <div class="aur-about__media" data-reveal>
          <img class="aur-pill" :src="zid1" alt="Enterijer salona Aurélie" />
          <img class="aur-pill aur-pill--mid" :src="zid2" alt="Enterijer salona Aurélie" />
          <img class="aur-pill" :src="zid3" alt="Enterijer salona Aurélie" />
        </div>
      </div>
    </section>

    <!-- ====================== SERVICES ====================== -->
    <section class="aur-sec" id="usluge">
      <div class="aur-wrap">
        <div class="aur-sec__head" data-reveal>
          <h2 class="aur-h2 aur-h2--ink"><span class="aur-num aur-num--ink">02</span><span class="aur-slash">/</span> Usluge</h2>
          <p class="aur-sec__lead">Pažljivo osmišljen meni tretmana — od svakodnevnog stylinga do potpune transformacije.</p>
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
          <h2 class="aur-h2"><span class="aur-num">03</span><span class="aur-slash">/</span> Naš tim</h2>
          <p class="aur-sec__lead aur-sec__lead--light">Ljudi iza svake transformacije — iskusni, posvećeni i uvek korak ispred trendova.</p>
        </div>
        <div class="aur-team">
          <article v-for="m in team" :key="m.name" class="aur-member" data-reveal>
            <div class="aur-member__img"><img :src="m.img" :alt="m.name" /></div>
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
          <h2 class="aur-h2 aur-h2--ink"><span class="aur-num aur-num--ink">04</span><span class="aur-slash">/</span> Galerija</h2>
          <p class="aur-sec__lead">Delić atmosfere i radova iz našeg studija.</p>
        </div>
        <div class="aur-gal">
          <div v-for="(g, idx) in gallery" :key="idx" class="aur-gal__item" data-reveal>
            <img :src="g" alt="Rad salona Aurélie" />
          </div>
        </div>
      </div>
    </section>

    <!-- ====================== PRICING ====================== -->
    <section class="aur-sec aur-sec--cream" id="cenovnik">
      <div class="aur-wrap aur-price__grid">
        <div class="aur-price__intro" data-reveal>
          <h2 class="aur-h2 aur-h2--ink"><span class="aur-num aur-num--ink">05</span><span class="aur-slash">/</span> Cenovnik</h2>
          <p class="aur-sec__lead">Transparentne cene, bez skrivenih troškova. Za složenije tretmane cenu potvrđujemo na konsultaciji.</p>
          <button class="aur-btn aur-btn--dark" @click="goTo('kontakt')">Rezerviši termin</button>
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
          <h2 class="aur-h2"><span class="aur-num">06</span><span class="aur-slash">/</span> Utisci</h2>
          <p class="aur-sec__lead aur-sec__lead--light">Ono što naši klijenti kažu posle posete.</p>
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
          <h2 class="aur-h2 aur-h2--ink"><span class="aur-num aur-num--ink">07</span><span class="aur-slash">/</span> Zakaži termin</h2>
          <p class="aur-sec__lead">Ostavite par detalja i javljamo vam se u najkraćem roku radi potvrde termina.</p>
          <ul class="aur-contact__meta">
            <li><span>Adresa</span> Knez Mihailova 1, Beograd</li>
            <li><span>Telefon</span> <a href="tel:+381600000000">+381 60 000 0000</a></li>
            <li><span>Radno vreme</span> Pon–Sub · 09–20h</li>
            <li><span>Instagram</span> <a href="#">@aurelie.studio</a></li>
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
          <button class="aur-btn aur-btn--dark aur-form__submit" type="submit">Pošalji zahtev</button>
        </form>
      </div>
    </section>

    <!-- ====================== FOOTER ====================== -->
    <footer class="aur-foot">
      <div class="aur-wrap aur-foot__inner">
        <div class="aur-foot__brand">
          <span class="aur-logo aur-logo--light">Aurélie</span>
          <p>Studio lepote · Beograd</p>
        </div>
        <nav class="aur-foot__nav">
          <button v-for="i in nav" :key="i.id" @click="goTo(i.id)">{{ i.label }}</button>
        </nav>
        <div class="aur-foot__copy">© {{ new Date().getFullYear() }} Aurélie. Sva prava zadržana.</div>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap');

/* ---------- TOKENS ---------- */
.aur {
  --ink: #0e0c0b;
  --ink-soft: #1b1612;
  --cream: #f5efe9;
  --blush: #ead9d0;
  --rose: #d9b7ab;
  --lav: #c4c1cb;
  --muted: #6f655a;
  --line: rgba(14, 12, 11, 0.12);
  --line-light: rgba(255, 255, 255, 0.14);

  font-family: 'Inter', system-ui, sans-serif;
  color: var(--ink);
  background: var(--cream);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;

  * { box-sizing: border-box; }
  button { font-family: inherit; cursor: pointer; background: none; border: 0; color: inherit; }
  img { display: block; width: 100%; height: 100%; object-fit: cover; }
  ::selection { background: var(--ink); color: var(--cream); }
}

.aur-wrap { width: 100%; max-width: 1240px; margin: 0 auto; padding: 0 32px; }

/* ---------- TYPE ---------- */
.aur-logo {
  font-family: 'Fraunces', serif;
  font-weight: 600;
  font-size: 26px;
  letter-spacing: -0.01em;
  &--light { color: var(--cream); }
}

.aur-kicker {
  display: flex; align-items: center; gap: 14px;
  font-size: 14px; letter-spacing: 0.01em;
  font-weight: 500; color: var(--ink); margin: 0 0 22px;
  &__line { width: 46px; height: 1px; background: currentColor; opacity: 0.8; }
}

.aur-h2 {
  font-family: 'Inter', sans-serif;
  font-weight: 800; font-size: clamp(30px, 4vw, 46px);
  letter-spacing: -0.03em; line-height: 1; margin: 0 0 18px;
  color: var(--cream);
  display: flex; align-items: baseline; gap: 12px;
  &--ink { color: var(--ink); }
}
.aur-num {
  font-family: 'Fraunces', serif; font-weight: 400;
  font-size: clamp(34px, 4.4vw, 52px); color: rgba(245, 239, 233, 0.34);
  &--ink { color: rgba(14, 12, 11, 0.22); }
}
.aur-slash { font-family: 'Fraunces', serif; color: var(--rose); font-weight: 400; }

/* ---------- BUTTONS ---------- */
/* compound selectors (.aur-btn.aur-btn--x) so the filled bg always beats the base button reset */
.aur-btn {
  display: inline-flex; align-items: center; justify-content: center;
  font-weight: 600; font-size: 15px; border-radius: 100px;
  padding: 14px 30px; white-space: nowrap;
  transition: transform 0.25s ease, background 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;

  &.aur-btn--dark {
    background: var(--ink); color: var(--cream);
    box-shadow: 0 10px 26px rgba(14, 12, 11, 0.16);
    &:hover { transform: translateY(-2px); background: var(--ink-soft); box-shadow: 0 16px 34px rgba(14, 12, 11, 0.22); }
  }
  &.aur-btn--pill {
    background: var(--ink); color: var(--cream); padding: 11px 24px; font-size: 14px;
    &:hover { background: var(--ink-soft); }
  }
  &.aur-btn--cream {
    background: var(--cream); color: var(--ink);
    &:hover { background: #fff; transform: translateY(-2px); }
  }
}

.aur-play {
  display: inline-flex; align-items: center; gap: 14px;
  &__ico {
    display: grid; place-items: center; width: 50px; height: 50px; flex: none;
    border-radius: 50%; background: #fff; color: var(--ink); font-size: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12); transition: transform 0.25s ease;
  }
  &__txt { font-weight: 600; font-size: 15px; text-decoration: underline; text-underline-offset: 4px; }
  &:hover &__ico { transform: scale(1.08); }
}

/* ---------- HEADER ---------- */
.aur-head {
  position: fixed; inset: 0 0 auto; z-index: 50;
  transition: background 0.35s ease, box-shadow 0.35s ease, opacity 0.3s ease;
  padding: 14px 0;
  &--solid {
    background: rgba(245, 239, 233, 0.82);
    backdrop-filter: blur(16px) saturate(1.2);
    box-shadow: 0 1px 0 var(--line);
  }
  &--hidden { opacity: 0; pointer-events: none; }
  &__inner { display: flex; align-items: center; justify-content: space-between; }
}
.aur-nav {
  display: flex; align-items: center; gap: 30px; flex: 1;
  &--right { justify-content: flex-end; }
  button {
    font-size: 15px; font-weight: 500; color: var(--ink); position: relative; padding: 4px 0;
    &::after { content: ''; position: absolute; left: 0; bottom: 0; width: 0; height: 1px; background: var(--ink); transition: width 0.25s ease; }
    &:hover::after { width: 100%; }
  }
  .aur-btn--pill::after { display: none; }
}

.aur-burger {
  display: none; flex-direction: column; gap: 7px; width: 40px; height: 40px;
  align-items: flex-end; justify-content: center;
  span { height: 2px; width: 26px; background: var(--ink); transition: width 0.3s ease; }
  span:last-child { width: 18px; }
  &:hover span:last-child { width: 26px; }
}

/* ---------- FULLSCREEN MENU ---------- */
.aur-drawer {
  position: fixed; inset: 0; z-index: 80;
  background: radial-gradient(130% 90% at 100% 0%, var(--ink-soft) 0%, var(--ink) 58%);
  color: var(--cream);
  display: flex; flex-direction: column;
  padding: 18px 28px 42px;
  opacity: 0; visibility: hidden; transform: translateY(-22px);
  transition: opacity 0.4s ease, transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.55s;
  &.is-open { opacity: 1; visibility: visible; transform: none; }

  &__top { display: flex; align-items: center; justify-content: space-between; height: 56px; }
  &__close {
    width: 44px; height: 44px; position: relative; flex: none;
    span { position: absolute; top: 50%; left: 50%; width: 24px; height: 2px; background: var(--cream); }
    span:first-child { transform: translate(-50%, -50%) rotate(45deg); }
    span:last-child { transform: translate(-50%, -50%) rotate(-45deg); }
  }

  &__nav {
    display: flex; flex-direction: column; gap: 2px; margin: auto 0;
    button {
      display: flex; align-items: baseline; gap: 18px; text-align: left;
      font-family: 'Poppins', sans-serif; font-weight: 600;
      font-size: clamp(36px, 12vw, 56px); letter-spacing: -0.02em; line-height: 1.04;
      color: var(--cream); padding: 8px 0;
      opacity: 0; transform: translateY(16px);
      transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), color 0.25s ease;
      &:hover { color: var(--rose); }
    }
  }
  &.is-open &__nav button { opacity: 1; transform: none; }
  &.is-open &__nav button:nth-child(1) { transition-delay: 0.16s; }
  &.is-open &__nav button:nth-child(2) { transition-delay: 0.22s; }
  &.is-open &__nav button:nth-child(3) { transition-delay: 0.28s; }
  &.is-open &__nav button:nth-child(4) { transition-delay: 0.34s; }
  &.is-open &__nav button:nth-child(5) { transition-delay: 0.40s; }

  &__idx {
    font-family: 'Fraunces', serif; font-weight: 400; font-size: 15px;
    color: var(--rose); width: 26px; flex: none; transform: translateY(-0.35em);
  }

  &__foot {
    display: flex; flex-direction: column; gap: 22px;
    opacity: 0; transition: opacity 0.5s ease 0.42s;
  }
  &.is-open &__foot { opacity: 1; }
  &__cta { width: 100%; }
  &__contact {
    display: flex; flex-direction: column; gap: 6px;
    a { color: rgba(245, 239, 233, 0.62); text-decoration: none; font-size: 15px; }
  }
}

/* ---------- HERO ---------- */
@keyframes aurUp {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: none; }
}

.aur-hero {
  position: relative; padding-top: 100px;
  background: linear-gradient(180deg, var(--blush) 0%, #ddd2cf 44%, var(--lav) 100%);
  &__inner { display: grid; grid-template-columns: 1.12fr 1fr; align-items: end; gap: 24px; }
  &__copy { padding-bottom: clamp(40px, 6vw, 84px); }
  &__copy > * { animation: aurUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
  &__copy > *:nth-child(2) { animation-delay: 0.1s; }
  &__copy > *:nth-child(3) { animation-delay: 0.22s; }
  &__title {
    font-family: 'Poppins', sans-serif;
    font-weight: 600; font-size: clamp(44px, 6.4vw, 80px); line-height: 0.98;
    letter-spacing: -0.02em; margin: 0 0 36px;
    em { font-family: 'Poppins', sans-serif; font-style: normal; font-weight: 600; color: #fff; }
  }
  &__actions { display: flex; align-items: center; gap: 26px; flex-wrap: wrap; }
  &__media {
    position: relative; align-self: end; width: 100%;
    height: clamp(380px, 42vw, 540px);
    animation: aurUp 1s cubic-bezier(0.16, 1, 0.3, 1) both 0.12s;
  }
  &__arch {
    position: absolute; inset: auto 0 0; height: 100%; width: 94%; margin: 0 auto;
    background: var(--rose); border-radius: 50% 50% 0 0; opacity: 0.5;
  }
  &__media img {
    position: absolute; bottom: 0; left: 0; right: 0; margin: 0 auto;
    width: 92%; height: 106%; object-fit: contain; object-position: bottom center;
    filter: drop-shadow(0 30px 50px rgba(14, 12, 11, 0.18));
  }
}

/* ---------- ABOUT ---------- */
.aur-about {
  background: var(--ink); color: var(--cream); padding: 110px 0;
  &__inner { display: grid; grid-template-columns: 1fr 1fr; gap: 70px; align-items: center; }
  &__text p { color: rgba(245, 239, 233, 0.74); font-size: 16px; max-width: 460px; margin: 0 0 18px; }
  &__media { display: flex; gap: 18px; justify-content: flex-end; }
}
.aur-pill {
  width: 30%; aspect-ratio: 5 / 8; border-radius: 200px; overflow: hidden;
  &--mid { margin-top: -34px; }
}
.aur-stats {
  display: flex; align-items: center; gap: 30px; margin-top: 40px;
  background: var(--cream); color: var(--ink); border-radius: 100px;
  padding: 22px 40px; width: fit-content;
  div { display: flex; flex-direction: column; }
  strong { font-family: 'Fraunces', serif; font-weight: 600; font-size: 28px; line-height: 1; }
  span { font-size: 12.5px; color: rgba(14, 12, 11, 0.6); margin-top: 5px; }
  &__div { width: 1px; height: 42px; background: var(--line); }
}

/* ---------- SECTION SHELL ---------- */
.aur-sec {
  padding: 110px 0;
  &--dark { background: var(--ink); color: var(--cream); }
  &--cream { background: var(--blush); }
  &__head { max-width: 620px; margin-bottom: 56px; }
  &__lead { font-size: 17px; color: rgba(14, 12, 11, 0.62); margin: 0; }
  &__lead--light { color: rgba(245, 239, 233, 0.68); }
}

/* ---------- SERVICES (image-overlay cards) ---------- */
.aur-serv { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
.aur-serv__card {
  position: relative; aspect-ratio: 3 / 4; border-radius: 20px; overflow: hidden;
  background: var(--ink);
  img { transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
  &::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(180deg, rgba(14, 12, 11, 0) 36%, rgba(14, 12, 11, 0.88) 100%);
  }
  &:hover img { transform: scale(1.06); }
}
.aur-serv__overlay {
  position: absolute; inset: auto 0 0; z-index: 1; padding: 24px; color: var(--cream);
}
.aur-serv__n { font-family: 'Fraunces', serif; font-style: italic; font-weight: 400; font-size: 15px; color: var(--rose); }
.aur-serv__overlay h3 { font-family: 'Inter', sans-serif; font-weight: 700; font-size: 21px; letter-spacing: -0.01em; margin: 8px 0; }
.aur-serv__overlay p { font-size: 13.5px; line-height: 1.45; color: rgba(245, 239, 233, 0.82); margin: 0; }

/* ---------- TEAM ---------- */
.aur-team { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; }
.aur-member {
  text-align: left;
  &__img { aspect-ratio: 3 / 4; border-radius: 18px; overflow: hidden; margin-bottom: 16px;
    img { transition: transform 0.6s ease, filter 0.6s ease; filter: grayscale(0.2); }
  }
  &:hover &__img img { transform: scale(1.04); filter: grayscale(0); }
  h3 { font-size: 18px; font-weight: 700; margin: 0 0 2px; }
  span { font-size: 13.5px; color: rgba(245, 239, 233, 0.64); }
}

/* ---------- GALLERY ---------- */
.aur-gal { columns: 3; column-gap: 18px; }
.aur-gal__item {
  break-inside: avoid; margin-bottom: 18px; border-radius: 16px; overflow: hidden;
  img { transition: transform 0.6s ease; }
  &:hover img { transform: scale(1.05); }
}

/* ---------- PRICING ---------- */
.aur-price__grid { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: 70px; align-items: start; }
.aur-price__intro .aur-sec__lead { margin: 0 0 28px; }
.aur-price__list {
  list-style: none; margin: 0; padding: 0;
  li { display: flex; align-items: baseline; gap: 12px; padding: 18px 0; border-bottom: 1px solid var(--line); }
}
.aur-price__name { font-weight: 500; font-size: 16px; white-space: nowrap; }
.aur-price__dots { flex: 1; border-bottom: 1px dotted rgba(14, 12, 11, 0.3); transform: translateY(-3px); }
.aur-price__val { font-family: 'Fraunces', serif; font-weight: 600; font-size: 20px; white-space: nowrap;
  small { font-family: 'Inter', sans-serif; font-weight: 500; font-size: 12px; color: var(--muted); }
}

/* ---------- REVIEWS ---------- */
.aur-rev { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
.aur-rev__card {
  background: rgba(245, 239, 233, 0.05); border: 1px solid var(--line-light);
  border-radius: 20px; padding: 30px;
  blockquote { font-family: 'Fraunces', serif; font-style: italic; font-size: 19px; line-height: 1.5; margin: 0 0 24px; color: rgba(245, 239, 233, 0.92); }
  figcaption { display: flex; align-items: center; gap: 12px; font-weight: 600; font-size: 15px;
    img { width: 40px; height: 40px; border-radius: 50%; }
  }
}

/* ---------- CONTACT ---------- */
.aur-contact { display: grid; grid-template-columns: 1fr 1.1fr; gap: 64px; align-items: start; }
.aur-contact__meta {
  list-style: none; margin: 30px 0 0; padding: 0;
  li { padding: 16px 0; border-bottom: 1px solid var(--line); font-size: 16px;
    span { display: block; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-bottom: 4px; }
    a { color: var(--ink); text-decoration: none; }
  }
}
.aur-form {
  background: #fff; border-radius: 24px; padding: 34px; display: grid; gap: 18px;
  box-shadow: 0 24px 60px rgba(14, 12, 11, 0.06);
  label { display: grid; gap: 8px; font-size: 13px; font-weight: 600; color: var(--ink); }
  input, select, textarea {
    font-family: inherit; font-size: 15px; padding: 13px 15px; border-radius: 12px;
    border: 1px solid var(--line); background: var(--cream); color: var(--ink); resize: vertical;
    &:focus { outline: 2px solid var(--ink); outline-offset: 1px; border-color: transparent; }
  }
  &__submit { margin-top: 6px; justify-self: start; }
}

/* ---------- FOOTER ---------- */
.aur-foot {
  background: var(--ink); color: var(--cream); padding: 56px 0;
  &__inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 24px; }
  &__brand p { color: rgba(245, 239, 233, 0.55); font-size: 13px; margin: 4px 0 0; }
  &__nav { display: flex; gap: 24px; flex-wrap: wrap;
    button { color: rgba(245, 239, 233, 0.72); font-size: 14px; &:hover { color: var(--cream); } }
  }
  &__copy { color: rgba(245, 239, 233, 0.42); font-size: 13px; }
}

/* ---------- REVEAL ---------- */
[data-reveal] { opacity: 0; transform: translateY(22px); transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
[data-reveal].is-visible { opacity: 1; transform: none; }

/* ---------- RESPONSIVE ---------- */
@media (max-width: 980px) {
  .aur-nav { display: none; }
  .aur-burger { display: flex; }
  .aur-head { padding: 12px 0; }

  .aur-hero { padding-top: 80px; }
  .aur-hero__inner { grid-template-columns: 1fr; gap: 10px; }
  .aur-hero__media { order: -1; height: clamp(320px, 82vw, 460px); animation-delay: 0s; }
  .aur-hero__media img { width: 86%; height: 104%; }
  .aur-hero__copy { padding-bottom: 64px; }
  .aur-hero__title { font-size: clamp(40px, 12.5vw, 62px); margin-bottom: 26px; }
  .aur-hero__actions { gap: 20px; }

  .aur-about { padding: 84px 0; }
  .aur-about__inner { grid-template-columns: 1fr; gap: 44px; }
  .aur-about__media { justify-content: flex-start; }

  .aur-serv {
    display: flex; grid-template-columns: none;
    overflow-x: auto; scroll-snap-type: x mandatory;
    gap: 14px; padding-bottom: 6px;
    scrollbar-width: none;
  }
  .aur-serv::-webkit-scrollbar { display: none; }
  .aur-serv__card { flex: 0 0 64%; scroll-snap-align: center; }
  .aur-team { grid-template-columns: repeat(2, 1fr); }
  .aur-gal { columns: 2; }
  .aur-rev { grid-template-columns: 1fr; }
  .aur-price__grid { grid-template-columns: 1fr; gap: 36px; }
  .aur-contact { grid-template-columns: 1fr; gap: 36px; }
}

@media (max-width: 560px) {
  .aur-wrap { padding: 0 20px; }
  .aur-sec { padding: 66px 0; }
  .aur-about { padding: 66px 0; }
  .aur-sec__head { margin-bottom: 40px; }
  .aur-hero__media { height: clamp(300px, 88vw, 420px); }
  .aur-stats { width: 100%; justify-content: space-between; padding: 14px 22px; gap: 14px; }
  .aur-stats strong { font-size: 22px; }
  .aur-stats span { font-size: 11.5px; }
  .aur-serv__card { flex: 0 0 78%; }
  .aur-team { grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .aur-form { padding: 26px 22px; }
  .aur-foot__inner { flex-direction: column; align-items: flex-start; }
}

@media (prefers-reduced-motion: reduce) {
  [data-reveal] { opacity: 1; transform: none; transition: none; }
  .aur-hero__copy > *, .aur-hero__media { animation: none; }
  .aur-drawer__nav button, .aur-drawer__foot { opacity: 1; transform: none; transition: none; }
  * { scroll-behavior: auto; }
}
</style>