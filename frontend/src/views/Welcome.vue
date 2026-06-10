<template>
  <div class="landing">
    <!-- NAVBAR -->
    <nav class="navbar" :class="{ 'navbar--scrolled': scrolled }">
      <div class="navbar__container">
        <div class="navbar__logo">
          <img src="@/assets/img/logo33.png" alt="" class="logo32">
          <span class="navbar__logo-text">tvojred<span>.rs</span></span>
        </div>
        <ul class="navbar__links">
          <li><a href="#kako-radi">Kako radi</a></li>
          <li><a href="#funkcije">Funkcije</a></li>
          <li><a href="#cene">Cene</a></li>
          <li><a href="#kontakt">Kontakt</a></li>
        </ul>
        <div class="navbar__cta">
          <RouterLink to="/paketi-i-cene" class="btn btn--outline">Paketi i cene</RouterLink>
          <RouterLink to="/demo" class="btn btn--primary">Probajte besplatno</RouterLink>
        </div>
        <button
          class="navbar__hamburger"
          :class="{ 'navbar__hamburger--open': menuOpen }"
          @click="menuOpen = !menuOpen"
          aria-label="Otvori meni"
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>

    <!-- MODERN SIDE DRAWER -->
    <transition name="overlay">
      <div class="navbar__overlay" v-if="menuOpen" @click="menuOpen = false"></div>
    </transition>
    <aside class="navbar__drawer" :class="{ 'navbar__drawer--open': menuOpen }">
      <div class="navbar__drawer-head">
        <div class="navbar__logo">
          <img src="@/assets/img/logo33.png" alt="" class="logo32">
          <span class="navbar__logo-text">tvojred<span>.rs</span></span>
        </div>
        <button class="navbar__drawer-close" @click="menuOpen = false" aria-label="Zatvori meni">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <nav class="navbar__drawer-links">
        <a href="#kako-radi" @click="menuOpen = false"><span class="navbar__drawer-dot"></span> Kako radi</a>
        <RouterLink to="/demo" @click="menuOpen = false"><span class="navbar__drawer-dot"></span> Primeri</RouterLink>
        <a href="#funkcije" @click="menuOpen = false"><span class="navbar__drawer-dot"></span> Funkcije</a>
        <a href="#instagram" @click="menuOpen = false"><span class="navbar__drawer-dot"></span> Kontakt</a>
      </nav>

      <div class="navbar__drawer-extra">
        <RouterLink
          to="/demo"
          class="btn btn--primary btn--lg"
          @click="menuOpen = false"
        >
          <span>Probajte besplatno</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </RouterLink>

        <RouterLink
          to="/paketi-i-cene"
          class="btn btn--ghost btn--lg"
          @click="menuOpen = false"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
          Paketi i cene
        </RouterLink>
      </div>

      <div class="navbar__drawer-foot">
        <p>Pametno zakazivanje za salone.</p>
        <div class="navbar__drawer-socials">
          <a href="https://instagram.com/tvojred.rs" target="_blank" rel="noopener noreferrer" class="footer__social" aria-label="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
            </svg>
          </a>
        </div>
      </div>
    </aside>

    <!-- HERO -->
    <section class="hero" id="hero">
      <div class="hero__bg">
        <div class="hero__blob hero__blob--1"></div>
        <div class="hero__blob hero__blob--2"></div>
        <div class="hero__blob hero__blob--3"></div>
        <div class="hero__grid"></div>
      </div>
      <div class="hero__container">
        <div class="hero__content">
          <div class="hero__badge">
            <span class="hero__badge-dot"></span>
            Online zakazivanje za salone
          </div>
          <h1 class="hero__title">
            Vaš salon ide<br />
            <span class="hero__title-gradient">online.</span>
          </h1>
          <p class="hero__subtitle">
            Profesionalni sajt i pametni sistem za online zakazivanje — sve na jednom mestu. Bez poziva, bez papira, bez glavobolje.
          </p>
          <div class="hero__actions">
            <RouterLink to="/demo" class="btn btn--primary btn--lg">
              <span>Probajte besplatno</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </RouterLink>

            <RouterLink to="/paketi-i-cene" class="btn btn--ghost btn--lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              Paketi i cene
            </RouterLink>
          </div>
          <div class="hero__stats">
            <div class="hero__stat" v-for="stat in stats" :key="stat.label">
              <span class="hero__stat-value">{{ stat.value }}</span>
              <span class="hero__stat-label">{{ stat.label }}</span>
            </div>
          </div>
        </div>
        <div class="hero__mockup">
          <div class="hero__mockup-frame">
            <img
              src="@/assets/img/mockup-admin-panel.png"
              alt="Studio zakazivanje — prikaz aplikacije"
              class="hero__mockup-img"
            />
          </div>
          <div class="hero__floating hero__floating--1">
            <span>✅</span> Termin zakazan!
          </div>
          <div class="hero__floating hero__floating--2">
            <span>📅</span> +127 termina danas
          </div>
          <div class="hero__floating hero__floating--3">
            <span>⭐</span> 4.9 prosečna ocena
          </div>
        </div>
      </div>
    </section>

    <!-- KAKO RADI -->
    <section class="how" id="kako-radi">
      <div class="how__container">
        <div class="how__header">
          <div class="section-tag">Kako radi</div>
          <h2 class="section-title">Od ideje do gotovog sajta<br/>u tri jednostavna koraka</h2>
          <p class="section-sub">Saradnja od prve ideje do lansiranja. Dizajn pravimo po vašoj meri, vodimo vas kroz svaki korak — bez tehničkih komplikacija.</p>
        </div>
        <div class="how__steps">
          <div class="how__step" v-for="(step, index) in steps" :key="step.title">
            <div class="how__step-number">{{ String(index + 1).padStart(2, '0') }}</div>
            <div class="how__step-icon">{{ step.icon }}</div>
            <h3 class="how__step-title">{{ step.title }}</h3>
            <p class="how__step-desc">{{ step.desc }}</p>
            <div class="how__step-connector" v-if="index < steps.length - 1"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- PRIMERI DIZAJNA -->
    <section class="examples" id="primeri">
      <div class="examples__container">
        <div class="examples__header">
          <div class="section-tag">Primeri dizajna</div>
          <h2 class="section-title">Ovako bi mogao da izgleda vaš salon online</h2>
          <p class="section-sub">Funkcionalni DEMO primeri za barber, hair, beauty i nail salone — napravljeni da inspirišu.</p>
        </div>

        <div class="examples__viewport" @mouseenter="pauseAuto" @mouseleave="resumeAuto">
          <div class="examples__track" :style="trackStyle">
            <a
              class="examples__card"
              v-for="(item, i) in loopDesigns"
              :key="i"
              :href="item.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div class="examples__card-stage">
                <span class="examples__card-chip">{{ item.type }}</span>
                <span class="examples__card-live"><i></i> uživo</span>
                <img :src="item.image" :alt="item.title" loading="lazy" />
              </div>
              <div class="examples__card-body">
                <h3 class="examples__card-title">{{ item.title }}</h3>
                <p class="examples__card-desc">{{ item.text }}</p>
                <span class="examples__card-cta">
                  Otvori demo
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </span>
              </div>
            </a>
          </div>
        </div>

        <div class="examples__controls">
          <div class="examples__dots" aria-hidden="true">
            <button
              v-for="(_, index) in designs"
              :key="index"
              class="examples__dot"
              :class="{ 'examples__dot--active': activeDot === index }"
              type="button"
              @click="goToSlide(index)"
            ></button>
          </div>
          <RouterLink to="/demo" class="examples__more">
            Pogledaj sve primere
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- FUNKCIJE -->
    <section class="features" id="funkcije">
      <div class="features__container">
        <div class="features__header">
          <div class="section-tag">Funkcije</div>
          <h2 class="section-title">Sve što vam treba,<br/>ništa što vam ne treba</h2>
        </div>
        <div class="features__grid">
          <div
            class="features__card"
            v-for="feature in features"
            :key="feature.title"
            :class="{ 'features__card--featured': feature.featured }"
          >
            <div class="features__card-icon">{{ feature.icon }}</div>
            <div class="features__card-badge" v-if="feature.badge">{{ feature.badge }}</div>
            <h3 class="features__card-title">{{ feature.title }}</h3>
            <p class="features__card-desc">{{ feature.desc }}</p>
            <ul class="features__card-list" v-if="feature.items">
              <li v-for="item in feature.items" :key="item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- PREDNOSTI -->
    <section class="benefits">
      <div class="benefits__container">
        <div class="benefits__content">
          <div class="section-tag">Zašto mi?</div>
          <h2 class="section-title">Manje poziva.<br/>Više zadovoljnih klijenata.</h2>
          <p class="section-sub">Salonima koji pređu na online zakazivanje sistem oslobađa vreme i smanjuje propuštene termine — manje telefoniranja, više popunjenih termina.</p>
          <div class="benefits__list">
            <div class="benefits__item" v-for="benefit in benefits" :key="benefit.title">
              <div class="benefits__item-icon">{{ benefit.icon }}</div>
              <div>
                <h4>{{ benefit.title }}</h4>
                <p>{{ benefit.desc }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="benefits__visual">
          <div class="benefits__chart">
            <div class="benefits__chart-title">Procena efekta nakon prelaska online</div>
            <div class="benefits__chart-bars">
              <div class="benefits__chart-bar-group" v-for="bar in chartBars" :key="bar.label">
                <div class="benefits__chart-bar-wrap">
                  <div class="benefits__chart-bar" :style="{ height: bar.before + '%' }">
                    <span>{{ bar.before }}%</span>
                  </div>
                  <div class="benefits__chart-bar benefits__chart-bar--after" :style="{ height: bar.after + '%' }">
                    <span>{{ bar.after }}%</span>
                  </div>
                </div>
                <div class="benefits__chart-label">{{ bar.label }}</div>
              </div>
            </div>
            <div class="benefits__chart-legend">
              <span><i class="legend-dot legend-dot--before"></i> Pre</span>
              <span><i class="legend-dot legend-dot--after"></i> Posle</span>
            </div>
          </div>
          <div class="benefits__note">
            <div class="benefits__note-icon">💡</div>
            <p>Procene su okvirne i zavise od tipa salona, broja termina i navika klijenata.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CENE -->
    <section class="pricing" id="cene">
      <div class="pricing__container">
        <div class="pricing__header">
          <div class="section-tag">Cene</div>
          <h2 class="section-title">Transparentne cene.<br/>Bez skrivenih troškova.</h2>
          <div class="pricing__toggle">
            <span :class="{ active: !installments }">Odjednom</span>
            <button class="pricing__toggle-btn" @click="installments = !installments" :class="{ active: installments }">
              <span class="pricing__toggle-circle"></span>
            </button>
            <span :class="{ active: installments }">Na 6 rata</span>
          </div>
        </div>
        <div class="pricing__cards">
          <div
            class="pricing__card"
            v-for="plan in plans"
            :key="plan.name"
            :class="{ 'pricing__card--popular': plan.popular }"
          >
            <div class="pricing__card-badge" v-if="plan.popular">Najpopularniji</div>
            <div class="pricing__card-icon">{{ plan.icon }}</div>
            <h3 class="pricing__card-name">{{ plan.name }}</h3>
            <p class="pricing__card-desc">{{ plan.desc }}</p>

            <div class="pricing__card-price" v-if="!plan.custom">
              <span class="pricing__card-currency">€</span>
              <span class="pricing__card-amount">{{ displayPlanPrice(plan.price) }}</span>
              <span class="pricing__card-period">{{ installments ? '/ mes × 6' : 'jednokratno' }}</span>
            </div>
            <div class="pricing__card-price pricing__card-price--custom" v-else>
              <span class="pricing__card-amount-custom">Custom</span>
              <span class="pricing__card-period-custom">po dogovoru</span>
            </div>

            <button
              type="button"
              class="btn"
              :class="plan.popular ? 'btn--primary' : 'btn--outline'"
              @click="choosePlan(plan.name)"
            >
              {{ plan.cta }}
            </button>
            <ul class="pricing__card-features">
              <li v-for="feature in plan.features" :key="feature" class="pricing__card-feature">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                {{ feature }}
              </li>
            </ul>
          </div>
        </div>

        <div class="pricing__more">
          <RouterLink to="/paketi-i-cene" class="pricing__more-link">
            Pogledajte sve detalje na stranici Paketi i cene
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="faq">
      <div class="faq__container">
        <div class="faq__header">
          <div class="section-tag">FAQ</div>
          <h2 class="section-title">Često postavljana pitanja</h2>
        </div>
        <div class="faq__list">
          <div
            class="faq__item"
            v-for="(item, index) in faqs"
            :key="item.q"
            :class="{ 'faq__item--open': openFaq === index }"
            @click="openFaq = openFaq === index ? null : index"
          >
            <div class="faq__question">
              {{ item.q }}
              <svg class="faq__arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
            </div>
            <div class="faq__answer">{{ item.a }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- INSTAGRAM -->
    <section class="instagram" id="instagram">
      <div class="instagram__container">
        <div class="instagram__header">
          <div class="section-tag">Instagram</div>
          <h2 class="section-title">Zavirite u naš svet<br/>na Instagramu</h2>
          <p class="section-sub">
            Primere radova, savete i novosti objavljujemo na
            <a href="https://instagram.com/tvojred.rs" target="_blank" rel="noopener noreferrer">@tvojred.rs</a>.
          </p>
          <div class="instagram__actions">
            <a href="https://instagram.com/tvojred.rs" target="_blank" rel="noopener noreferrer" class="btn btn--primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
              Zaprati @tvojred.rs
            </a>
            <a href="https://ig.me/m/tvojred.rs" target="_blank" rel="noopener noreferrer" class="btn btn--outline">
              Piši nam u DM
            </a>
          </div>
        </div>

        <div class="instagram__grid">
          <a
            v-for="post in instagramPosts"
            :key="post.id"
            class="instagram__item"
            :href="post.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img :src="post.image" alt="tvojred.rs na Instagramu" loading="lazy" />
            <span class="instagram__overlay">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta" id="demo">
      <div class="cta__container">
        <div class="cta__blob cta__blob--1"></div>
        <div class="cta__blob cta__blob--2"></div>
        <div class="cta__content">
          <h2 class="cta__title">Spremni da vaš salon<br/>pređe na sledeći nivo?</h2>
          <p class="cta__sub">Isprobajte besplatno. Bez kreditne kartice. Bez obaveza.</p>
          <form class="cta__form" @submit.prevent="submitForm">
            <input
              v-model="email"
              type="email"
              placeholder="Unesite vaš email..."
              class="cta__input"
              required
            />
            <button type="submit" class="btn btn--primary btn--lg">
              Počnite besplatno
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </form>
          <div class="cta__success" v-if="formSubmitted">
            ✅ Hvala! Kontaktiraćemo vas uskoro.
          </div>
          <p class="cta__note">Bez skrivenih troškova. Uz svaki paket — 2 meseca besplatnog održavanja.</p>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer" id="kontakt">
      <div class="footer__container">
        <div class="footer__top">
          <div class="footer__brand">
            <div class="footer__logo">
              <span class="navbar__logo-text">tvojred<span>.rs</span></span>
            </div>
            <p class="footer__brand-desc">Pametno rešenje za online zakazivanje i digitalni nastup frizerskih i kozmetičkih salona u Srbiji.</p>
            <div class="footer__socials">
              <a href="https://instagram.com/tvojred.rs" target="_blank" rel="noopener noreferrer" class="footer__social" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </a>
            </div>
          </div>
          <div class="footer__links-group" v-for="group in footerLinks" :key="group.title">
            <h4>{{ group.title }}</h4>
            <ul>
              <li v-for="link in group.links" :key="link.label">
                <component :is="link.to ? 'RouterLink' : 'a'" v-bind="link.to ? { to: link.to } : { href: link.href }">{{ link.label }}</component>
              </li>
            </ul>
          </div>
        </div>
        <div class="footer__bottom">
          <p>© {{ new Date().getFullYear() }} tvojred.rs. Sva prava zadržana.</p>
          <div class="footer__bottom-links">
            <a href="#">Politika privatnosti</a>
            <a href="#">Uslovi korišćenja</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { RouterLink } from 'vue-router'

import instaPlaceholder1 from '@/assets/img/ig-post1.png'
import instaPlaceholder2 from '@/assets/img/ig-post2.png'
import instaPlaceholder3 from '@/assets/img/ig-post3.png'
import instaPlaceholder4 from '@/assets/img/ig-post4.png'
import instaPlaceholder5 from '@/assets/img/ig-post5.png'
import instaPlaceholder6 from '@/assets/img/ig-post6.png'

import testHomepage from '@/assets/img/mockup-test-studio.png'
import testZakazi from '@/assets/img/mockup-test-studio-zakazivanje.png'
import modernHomepage from '@/assets/img/mockup-modern-life.png'
import modernZakazi from '@/assets/img/mockup-modern-life-zakazivanje.png'
import nailWelcome from '@/assets/img/mockup-nail.png'
import nailZakazi from '@/assets/img/mockup-nail-zakazivanje.png'
import adminPanel from '@/assets/img/mockup-admin-panel.png'

const designs = [
  { id: 1, type: 'Online zakazivanje', title: 'Barber Salon', text: 'Klijent bira uslugu, frizera, datum i termin bez dopisivanja preko poruka.', image: testZakazi, url: '/test-studio/zakazivanje' },
  { id: 2, type: 'Web sajt', title: 'Barber Salon', text: 'Početna strana sa uslugama, atmosferom i jasnim pozivom na zakazivanje.', image: testHomepage, url: '/test-studio' },
  { id: 3, type: 'Online zakazivanje', title: 'Beauty Salon', text: 'Klijent bira uslugu, osobu, datum i termin bez dopisivanja preko poruka.', image: modernZakazi, url: '/modern-life/zakazivanje' },
  { id: 4, type: 'Web sajt', title: 'Beauty Salon', text: 'Svetao sajt za hair i beauty salon sa uslugama, timom i zakazivanjem.', image: modernHomepage, url: '/modern-life' },
  { id: 5, type: 'Online zakazivanje', title: 'Nail Salon', text: 'Zakazivanje za nail salon sa jasnim izborom usluge, termina i nail artist-a.', image: nailZakazi, url: '/nail-studio/zakazivanje' },
  { id: 6, type: 'Web sajt', title: 'Nail Salon', text: 'Elegantan sajt za nail salon sa radovima, cenovnikom i direktnim zakazivanjem.', image: nailWelcome, url: '/nail-studio' },
  { id: 7, type: 'Admin panel', title: 'Kontrola salona', text: 'Pregled termina, zaposlenih, usluga, klijenata, cena i statistike poslovanja.', image: adminPanel, url: '/admin-panel' },
]

// Duplirana lista za beskonačni (infinite) loop carousela
const loopDesigns = [...designs, ...designs]

const instagramPosts = [
  { id: 1, image: instaPlaceholder1, url: 'https://www.instagram.com/p/DYN4HRlMvdP/' },
  { id: 2, image: instaPlaceholder2, url: 'https://www.instagram.com/p/DZS4T5pNL4Z/' },
  { id: 3, image: instaPlaceholder3, url: 'https://www.instagram.com/p/DYN4106s3jg/' },
  { id: 4, image: instaPlaceholder4, url: 'https://www.instagram.com/p/DZN3UHNtAz5/' },
  { id: 5, image: instaPlaceholder5, url: 'https://www.instagram.com/p/DX-RibcjUPy/' },
  { id: 6, image: instaPlaceholder6, url: 'https://www.instagram.com/p/DY2EuNMNxNt/' },
]

export default defineComponent({
  name: 'TvojRedLanding',
  components: { RouterLink },
  setup() {
    const scrolled = ref(false)
    const menuOpen = ref(false)
    const installments = ref(false)
    const openFaq = ref<number | null>(null)
    const email = ref('')
    const formSubmitted = ref(false)

    const handleScroll = () => {
      scrolled.value = window.scrollY > 60
    }

    // ── Infinite auto carousel ──
    const SLIDE_MS = 3500
    const TRANSITION_MS = 600
    const slide = ref(0)
    const noTransition = ref(false)
    let timer: number | undefined
    let reduceMotion = false

    const trackStyle = computed(() => ({
      transform: `translateX(calc(${slide.value} * (var(--card-w) + var(--card-gap)) * -1))`,
      transition: noTransition.value ? 'none' : `transform ${TRANSITION_MS}ms cubic-bezier(.4,0,.2,1)`,
    }))

    const activeDot = computed(() => ((slide.value % designs.length) + designs.length) % designs.length)

    const goNext = () => {
      slide.value += 1
      if (slide.value >= designs.length) {
        window.setTimeout(() => {
          noTransition.value = true
          slide.value = 0
          requestAnimationFrame(() => requestAnimationFrame(() => { noTransition.value = false }))
        }, TRANSITION_MS + 40)
      }
    }

    const startAuto = () => {
      stopAuto()
      timer = window.setInterval(goNext, SLIDE_MS)
    }
    const stopAuto = () => {
      if (timer) { window.clearInterval(timer); timer = undefined }
    }
    const pauseAuto = () => stopAuto()
    const resumeAuto = () => { if (!reduceMotion) startAuto() }

    const goToSlide = (index: number) => {
      stopAuto()
      noTransition.value = false
      slide.value = index
      resumeAuto()
    }

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
      reduceMotion = typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false
      if (!reduceMotion) startAuto()
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
      stopAuto()
      document.body.style.overflow = ''
    })

    // Zaključaj scroll dok je bočni meni otvoren
    watch(menuOpen, (open) => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = open ? 'hidden' : ''
      }
    })

    // Formatiranje cene (srpski separator, bez nepotrebnih nula)
    const fmt = (n: number) => {
      const v = Math.round(n * 100) / 100
      return v.toLocaleString('sr-RS', { maximumFractionDigits: 2 })
    }

    const displayPlanPrice = (price: number | null) => {
      if (price === null) return ''
      return installments.value ? fmt(price / 6) : fmt(price)
    }

    // Klik na paket → kopira poruku u clipboard i otvara Instagram DM
    const choosePlan = async (planName: string) => {
      const message = `Zainteresovan/na sam za ${planName} paket.`
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(message)
        }
      } catch {
        /* clipboard nedostupan — samo otvaramo DM */
      }
      window.open('https://ig.me/m/tvojred.rs', '_blank', 'noopener')
    }

    const submitForm = () => {
      if (email.value) {
        formSubmitted.value = true
        email.value = ''
        setTimeout(() => { formSubmitted.value = false }, 5000)
      }
    }

    const stats = [
      { value: '30+', label: 'Aktivnih salona' },
      { value: '10k+', label: 'Zakazanih termina' },
      { value: '4.9★', label: 'Prosečna ocena' },
    ]

    const steps = [
      {
        icon: '💬',
        title: 'Konsultacija i analiza',
        desc: 'Upoznajemo vaš salon, usluge i želje. Zajedno definišemo kako vaš sajt i sistem za zakazivanje treba da izgledaju i funkcionišu.',
      },
      {
        icon: '🎨',
        title: 'Dizajn po vašoj želji',
        desc: 'Kreiramo jedinstven dizajn prilagođen vašem brendu. Svaki detalj usklađujemo sa vašom vizijom — dok ne budete potpuno zadovoljni.',
      },
      {
        icon: '🚀',
        title: 'Lansiranje i podrška',
        desc: 'Postavljamo vaš sajt i sistem online. Tu smo i nakon lansiranja, sa besplatnom podrškom od 2 meseca.',
      },
    ]

    const features = [
      {
        icon: '📅',
        title: 'Online zakazivanje',
        desc: 'Klijenti rezervišu termine sami, 24/7, bez ijednog poziva ili poruke.',
        featured: true,
        items: [
          'Online zakazivanje 24/7',
          'Pregled slobodnih termina',
          'SMS potvrda termina',
          'Dostupnost u realnom vremenu',
        ],
      },
      {
        icon: '🌐',
        title: 'Moderan websajt',
        desc: 'Profesionalan, responzivan sajt koji predstavlja vaš salon u najboljem svetlu.',
        featured: false,
        items: [
          'Prilagodljiv dizajn',
          'Galerija radova',
          'Responzivan prikaz',
          'Brzo učitavanje',
        ],
      },
      {
        icon: '🔎',
        title: 'Bolja vidljivost na Google-u',
        desc: 'Da vas novi klijenti lako pronađu kada pretražuju salone u vašem gradu.',
        featured: false,
        items: [
          'SEO optimizacija',
          'Google Maps lokacija',
          'Lakše pronalaženje',
          'Više organskih poseta',
        ],
      },
      {
        icon: '🧩',
        title: 'Admin panel',
        desc: 'Sve o vašem salonu na jednom mestu — pregledno, brzo i jednostavno.',
        featured: false,
        items: [
          'Konfiguracija admin panela',
          'Centralni pregled',
          'Upravljanje nalozima',
          'Brz pristup podacima',
        ],
      },
      {
        icon: '📋',
        title: 'Usluge, cene i klijenti',
        desc: 'Definišite ponudu i vodite urednu evidenciju svojih klijenata.',
        featured: false,
        items: [
          'Usluge i cene',
          'Pregled klijenata i usluga',
          'Klijentska baza',
          'Istorija poseta',
        ],
      },
      {
        icon: '💳',
        title: 'Online plaćanje',
        desc: 'Prihvatajte depozite i pune isplate online i smanjite broj no-show termina.',
        featured: false,
        badge: 'Dostupno uz Enterprise paket',
        items: [
          'Sigurna online naplata',
          'Depoziti pri zakazivanju',
          'Manje otkazanih termina',
          'Automatske potvrde',
        ],
      },
    ]

    const benefits = [
      {
        icon: '⏰',
        title: 'Uštedite sate svake nedelje',
        desc: 'Bez beskonačnih poziva i poruka za zakazivanje — sistem radi umesto vas.',
      },
      {
        icon: '📉',
        title: 'Manje propuštenih termina',
        desc: 'Automatski podsetnici smanjuju broj klijenata koji ne dođu.',
      },
      {
        icon: '💰',
        title: 'Povećajte prihode',
        desc: 'Online prisutnost i lakše zakazivanje donose nove klijente koji vas pronađu na internetu.',
      },
      {
        icon: '😊',
        title: 'Zadovoljniji klijenti',
        desc: 'Klijenti cene modernost i jednostavnost — veće ocene, više preporuka.',
      },
    ]

    const chartBars = [
      { label: 'Popunjenost termina', before: 61, after: 82 },
      { label: 'Otkazani termini', before: 23, after: 9 },
      { label: 'Online rezervacije', before: 14, after: 68 },
    ]

    const plans = [
      {
        icon: '🌱',
        name: 'Starter',
        desc: 'Osnovno digitalno prisustvo i online zakazivanje za vaš salon.',
        price: 399,
        custom: false,
        cta: 'Izaberite Starter',
        popular: false,
        features: [
          'Online zakazivanje',
          'Admin panel',
          'Usluge i cene',
          'Pregled termina',
          'Pregled klijenata i usluga',
        ],
      },
      {
        icon: '🚀',
        name: 'Pro',
        desc: 'Kompletno rešenje sa modernim sajtom i naprednim admin panelom.',
        price: 599,
        custom: false,
        cta: 'Izaberite Pro',
        popular: true,
        features: [
          'Online zakazivanje',
          'Moderan websajt',
          'Admin panel',
          'Usluge i cene',
          'Pregled termina',
          'Pregled klijenata i usluga',
          'Konfiguracija admin panela',
        ],
      },
      {
        icon: '👑',
        name: 'Enterprise',
        desc: 'Sve iz Pro paketa, plus online plaćanje i maksimalna vidljivost.',
        price: null as number | null,
        custom: true,
        cta: 'Kontaktirajte nas',
        popular: false,
        features: [
          'Online zakazivanje',
          'Moderan websajt',
          'Admin panel',
          'Usluge i cene',
          'Pregled termina',
          'Pregled klijenata i usluga',
          'Konfiguracija admin panela',
          'Bolja vidljivost na Google-u',
          'Online plaćanje',
          'SMS potvrda termina',
        ],
      },
    ]

    const faqs = [
      {
        q: 'Koliko dugo traje izrada sajta?',
        a: 'U zavisnosti od obima, izrada obično traje 30 dana a krajnji rok isporuke je 60 dana.',
      },
      {
        q: 'Da li mi je potrebno tehničko znanje?',
        a: 'Apsolutno ne! Mi se brinemo o tehničkom delu, a vi dobijate gotovo rešenje. Admin panel je dizajniran tako da ga može koristiti svako.',
      },
      {
        q: 'Mogu li probati pre plaćanja?',
        a: 'Da! Nudimo besplatne test verzije koje možete pronaći na našem web sajtu.',
      },
      {
        q: 'Šta se dešava ako klijent otkaže termin?',
        a: 'Sistem automatski oslobađa termin i može poslati obaveštenja klijentima koji čekaju slobodan termin. Vi dobijate obaveštenje u realnom vremenu.',
      },
      {
        q: 'Da li podržavate online plaćanje?',
        a: 'Online plaćanje (depoziti i pune isplate) dostupno je uz Enterprise paket, zajedno sa boljom vidljivošću na Google-u i SMS potvrdom termina.',
      },
      {
        q: 'Koje načine plaćanja paketa nudite?',
        a: 'Paket možete platiti odjednom ili na 6 rata. Kod plaćanja odjednom, na početku izrade plaća se 50% dogovorene cene, a preostalih 50% po završetku.',
      },
    ]

    const footerLinks = [
      {
        title: 'Proizvod',
        links: [
          { label: 'Funkcije', href: '#funkcije' },
          { label: 'Primeri', to: '/demo' },
          { label: 'Paketi i cene', to: '/paketi-i-cene' },
        ],
      },
      {
        title: 'Kompanija',
        links: [
          { label: 'O nama', href: '#' },
          { label: 'Blog', href: '#' },
        ],
      },
      {
        title: 'Podrška',
        links: [
          { label: 'Kontakt', href: '#kontakt' },
          { label: 'Instagram', href: 'https://instagram.com/tvojred.rs' },
        ],
      },
    ]

    return {
      scrolled,
      menuOpen,
      installments,
      openFaq,
      email,
      formSubmitted,
      submitForm,
      fmt,
      displayPlanPrice,
      choosePlan,
      stats,
      steps,
      features,
      benefits,
      chartBars,
      plans,
      faqs,
      footerLinks,
      designs,
      loopDesigns,
      trackStyle,
      activeDot,
      goToSlide,
      pauseAuto,
      resumeAuto,
      instagramPosts,
    }
  },
})
</script>

<style lang="scss">
@use 'sass:color';

// ─── TOKENS ──────────────────────────────────────────────
$primary:        #2563eb;
$primary-dark:   #1d4ed8;
$primary-light:  #eff6ff;
$accent:         #06b6d4;
$dark:           #0f172a;
$dark-2:         #1e293b;
$dark-3:         #334155;
$mid:            #64748b;
$light:          #f8fafc;
$white:          #ffffff;
$border:         #e2e8f0;

$font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

$radius-sm:   8px;
$radius-md:   12px;
$radius-lg:   20px;
$radius-xl:   32px;

$shadow-sm:  0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.06);
$shadow-md:  0 4px 16px rgba(0,0,0,.10);
$shadow-lg:  0 16px 48px rgba(0,0,0,.14);
$shadow-xl:  0 32px 80px rgba(0,0,0,.18);

$transition: all .25s cubic-bezier(.4,0,.2,1);

$tr-bg:          #15191F;
$tr-bg-deep:     #0F1318;
$tr-bg-soft:     #1B2027;
$tr-blue:        #3D6695;
$tr-blue-dark:   #395F8C;
$tr-blue-hover:  #4B6F95;
$tr-white:       #F9F9F9;

// ─── RESET ───────────────────────────────────────────────
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html {
  scroll-behavior: smooth;
  font-size: 16px;
}

body {
  font-family: $font-sans;
  color: $dark;
  background: $white;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

a { text-decoration: none; color: inherit; }
ul { list-style: none; }
img { max-width: 100%; display: block; }

// ─── UTILITIES ───────────────────────────────────────────
.section-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: .75rem;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: $primary;
  background: $primary-light;
  border: 1px solid color.adjust($primary-light, $lightness: -6%);
  padding: 6px 14px;
  border-radius: 999px;
  margin-bottom: 20px;
}

.section-title {
  font-size: clamp(1.75rem, 3.5vw, 2.75rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -.02em;
  color: $dark;
  margin-bottom: 16px;
}

.section-sub {
  font-size: 1.05rem;
  color: $mid;
  max-width: 520px;
  line-height: 1.7;
}

// ─── BUTTONS ─────────────────────────────────────────────
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 22px;
  border-radius: $radius-md;
  font-size: .9rem;
  font-weight: 600;
  cursor: pointer;
  border: 2px solid transparent;
  transition: $transition;
  white-space: nowrap;
  font-family: inherit;

  &--primary {
    background: $primary;
    color: $white;
    border-color: $primary;
    box-shadow: 0 4px 14px rgba($primary,.35);
    &:hover {
      background: $primary-dark;
      border-color: $primary-dark;
      box-shadow: 0 6px 20px rgba($primary,.45);
      transform: translateY(-1px);
    }
  }

  &--outline {
    background: transparent;
    color: $dark;
    border-color: $border;
    &:hover {
      border-color: $primary;
      color: $primary;
      background: $primary-light;
    }
  }

  &--ghost {
    background: rgba($white,.12);
    color: $white;
    border-color: rgba($white,.2);
    backdrop-filter: blur(8px);
    &:hover {
      background: rgba($white,.22);
      border-color: rgba($white,.35);
    }
  }

  &--lg {
    padding: 14px 28px;
    font-size: 1rem;
    border-radius: $radius-md + 4px;
  }
}

// ─── NAVBAR ──────────────────────────────────────────────
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 18px 0;
  transition: $transition;

  &--scrolled {
    background: $tr-bg;
    padding: 12px 0;
    border-bottom: 1px solid rgba($tr-white,.08);
    // box-shadow: 0 12px 34px rgba(0,0,0,.26);

    .navbar__logo-text { color: $tr-white; }
    .navbar__logo-text span { color: $tr-blue; }
    .navbar__links a { color: rgba($tr-white,.76); }
    .navbar__links a:hover { color: $tr-white; }
    .navbar__hamburger span { background: $tr-white; }
  }

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    align-items: center;
    gap: 40px;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.2rem;
    font-weight: 800;
    cursor: pointer;
    margin-right: auto;
  }

  &__logo-text {
    color: $tr-white;
    transition: $transition;
    span { color: $tr-blue; }
  }

  &__links {
    display: flex;
    align-items: center;
    gap: 32px;

    a {
      font-size: .9rem;
      font-weight: 500;
      color: rgba($tr-white,.78);
      transition: $transition;
      &:hover { color: $tr-white; }
    }
  }

  &__cta {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  // ── Animirani hamburger ──
  &__hamburger {
    display: none;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    width: 30px;
    height: 30px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    margin-left: auto;
    z-index: 1120;

    span {
      display: block;
      width: 24px;
      height: 2px;
      background: $white;
      border-radius: 999px;
      transition: transform .35s cubic-bezier(.4,0,.2,1), opacity .25s ease, background .25s ease;
      transform-origin: center;
    }

    &--open span {
      background: $white;
      &:nth-child(1) { transform: translateY(7px) rotate(45deg); }
      &:nth-child(2) { opacity: 0; transform: scaleX(0); }
      &:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
    }
  }

  // ── Overlay ──
  &__overlay {
    position: fixed;
    inset: 0;
    background: rgba($tr-bg,.68);
    backdrop-filter: blur(4px);
    z-index: 1090;
  }

  // ── Bočni (side) drawer ──
  &__drawer {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: min(360px, 86vw);
    z-index: 1100;
    background: linear-gradient(165deg, $tr-bg 0%, $tr-bg-deep 100%);
    border-left: 1px solid rgba($tr-blue,.16);
    // box-shadow: -24px 0 64px rgba(0,0,0,.52);
    transform: translateX(105%);
    transition: transform .42s cubic-bezier(.4,0,.2,1);
    display: flex;
    flex-direction: column;
    padding: 24px;
    overflow-y: auto;

    &::before { display: none; }

    &--open { transform: translateX(0); }
  }

  &__drawer-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 40px;
    position: relative;
    z-index: 1;

    .navbar__logo-text { color: $tr-white; span { color: $tr-blue; } }
  }

  &__drawer-close {
    width: 38px;
    height: 38px;
    border-radius: $radius-sm;
    border: 1px solid rgba($tr-blue,.22);
    background: rgba($tr-white,.05);
    color: $tr-white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: $transition;
    &:hover { background: rgba($tr-blue,.14); border-color: rgba($tr-blue,.36); }
  }

  &__drawer-links {
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 1;

    a {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 17px 4px;
      font-size: 1.4rem;
      font-weight: 700;
      letter-spacing: -.01em;
      color: rgba($tr-white,.86);
      border-bottom: 1px solid rgba($tr-blue,.12);
      transition: $transition;

      .navbar__drawer-dot {
        width: 7px;
        height: 7px;
        border-radius: 999px;
        background: $tr-blue;
        flex-shrink: 0;
        transition: $transition;
      }

      &:hover {
        color: $white;
        padding-left: 12px;
        .navbar__drawer-dot { width: 18px; }
      }
    }
  }

&__drawer-extra {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: fit-content;
  margin: 28px auto 0;
  gap: 12px;
  position: relative;
  z-index: 1;

  .btn {
    width: 100%;
    justify-content: center;
    white-space: nowrap;
  }

  .btn--primary {
    background: #3D6695;
    color: #F9F9F9;
    border-color: #3D6695;
    box-shadow: 0 4px 14px rgba(61, 102, 149, .28);

    &:hover {
      background: #4B6F95;
      border-color: #4B6F95;
      box-shadow: 0 6px 20px rgba(61, 102, 149, .36);
      transform: translateY(-1px);
    }
  }

  .btn--ghost {
    background: rgba(249, 249, 249, .08);
    color: #F9F9F9;
    border-color: rgba(249, 249, 249, .18);
    box-shadow: none;
    backdrop-filter: blur(8px);

    &:hover {
      background: rgba(249, 249, 249, .14);
      border-color: rgba(249, 249, 249, .28);
      color: #F9F9F9;
      transform: translateY(-1px);
    }
  }
}

  &__drawer-foot {
    margin-top: auto;
    padding-top: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 14px;
    position: relative;
    z-index: 1;

    p { font-size: .82rem; color: rgba($tr-white,.48); line-height: 1.6; }
  }

  &__drawer-socials {
    display: flex;
    gap: 10px;
    justify-content: center;
  }


  &__cta .btn--primary {
    background: $tr-blue;
    border-color: $tr-blue;
    color: $tr-white;
    box-shadow: 0 4px 14px rgba($tr-blue,.28);

    &:hover {
      background: $tr-blue-hover;
      border-color: $tr-blue-hover;
      box-shadow: 0 6px 20px rgba($tr-blue,.34);
    }
  }

  &__cta .btn--outline {
    color: $tr-white;
    border-color: rgba($tr-blue,.34);
    background: rgba($tr-white,.04);

    &:hover {
      color: $tr-white;
      border-color: rgba($tr-blue,.58);
      background: rgba($tr-blue,.14);
    }
  }

  @media (max-width: 900px) {
    &__links,
    &__cta { display: none; }
    &__hamburger { display: flex; }
    &__logo { margin-right: 0; }

    &--scrolled .navbar__hamburger span { background: $tr-white; }
  }
}

// Overlay fade tranzicija
.overlay-enter-active,
.overlay-leave-active { transition: opacity .3s ease; }
.overlay-enter-from,
.overlay-leave-to { opacity: 0; }

// ─── HERO ────────────────────────────────────────────────
.hero {
  position: relative;
  min-height: 100vh;
  background:
    radial-gradient(120% 115% at 50% -10%, $tr-bg-soft 0%, $tr-bg 58%, $tr-bg-deep 100%);
  overflow: hidden;
  display: flex;
  align-items: center;

  &__bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  &__blob { display: none; }

  &__grid {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba($tr-blue,.28) 1px, transparent 1px);
    background-size: 28px 28px;
    background-size: 64px 64px;
    // mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, #000 40%, transparent 100%);
    // -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, #000 40%, transparent 100%);
  }

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 120px 24px 80px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
    width: 100%;
    position: relative;
    z-index: 1;
  }

  &__content { color: $tr-white; }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: .8rem;
    font-weight: 600;
    color: rgba($tr-white,.85);
    background: rgba($tr-white,.06);
    border: 1px solid rgba($tr-white,.12);
    padding: 8px 16px;
    border-radius: 999px;
    margin-bottom: 28px;
    letter-spacing: .02em;
    backdrop-filter: blur(8px);
  }

  &__badge-dot {
    width: 8px;
    height: 8px;
    background: #4ade80;
    border-radius: 50%;
    box-shadow: 0 0 0 3px rgba(#4ade80, .3);
    animation: pulse 2s infinite;
  }

  &__title {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 900;
    line-height: 1.05;
    letter-spacing: -.035em;
    margin-bottom: 24px;
    color: $tr-white;
  }

  &__title-gradient {
    background: linear-gradient(135deg, $tr-blue 0%, $tr-blue-hover 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  &__subtitle {
    font-size: 1.1rem;
    color: rgba($tr-white,.6);
    line-height: 1.7;
    margin-bottom: 36px;
    max-width: 460px;
  }

&__actions {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 48px;
  flex-wrap: wrap;

  .btn--ghost {
    background: rgba(249, 249, 249, .08);
    color: #F9F9F9;
    border-color: rgba(249, 249, 249, .18);
    box-shadow: none;
    backdrop-filter: blur(8px);

    &:hover {
      background: rgba(249, 249, 249, .14);
      border-color: rgba(249, 249, 249, .28);
      color: #F9F9F9;
      transform: translateY(-1px);
    }
  }
}

  &__stats {
    display: flex;
    gap: 36px;
    padding-top: 36px;
    border-top: 1px solid rgba($tr-white,.1);
    flex-wrap: wrap;
  }

  &__stat {
    display: flex;
    flex-direction: column;
  }

  &__stat-value {
    font-size: 1.8rem;
    font-weight: 800;
    color: $tr-white;
    letter-spacing: -.03em;
  }

  &__stat-label {
    font-size: .8rem;
    color: rgba($tr-white,.5);
    font-weight: 500;
  }

  &__mockup {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__mockup-frame {
    position: relative;
    max-width: 440px;
    width: 100%;
    padding: 20px;
    border-radius: $radius-xl;
  }

  &__mockup-img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: $radius-lg;
  }

  &__floating {
    position: absolute;
    background: rgba($tr-bg-soft,.94);
    border: 1px solid rgba($tr-blue,.20);
    border-radius: $radius-md;
    padding: 11px 16px;
    font-size: .82rem;
    font-weight: 600;
    color: $tr-blue;
    box-shadow: 0 14px 36px rgba(0,0,0,.28);
    display: flex;
    align-items: center;
    gap: 9px;
    animation: float 4s ease-in-out infinite;
    white-space: nowrap;
    backdrop-filter: blur(4px);

    span { font-size: 1rem; }

    &--1 { top: 8%; right: -30px; animation-delay: 0s; }
    &--2 { bottom: 32%; left: -40px; animation-delay: 1.3s; }
    &--3 { bottom: 8%; right: -20px; animation-delay: 2.6s; }
  }


  .btn--primary {
    background: $tr-blue;
    border-color: $tr-blue;
    color: $tr-white;
    box-shadow: 0 6px 22px rgba($tr-blue,.30);

    &:hover {
      background: $tr-blue-hover;
      border-color: $tr-blue-hover;
      box-shadow: 0 8px 26px rgba($tr-blue,.38);
    }
  }

  .btn--ghost {
    background: rgba(249, 249, 249, .08);
    color: #F9F9F9;
    border-color: rgba(249, 249, 249, .18);
    box-shadow: none;
    backdrop-filter: blur(8px);

    &:hover {
      background: rgba(249, 249, 249, .14);
      border-color: rgba(249, 249, 249, .28);
      color: #F9F9F9;
      transform: translateY(-1px);
    }
  }

  @media (max-width: 900px) {
    &__container {
      grid-template-columns: 1fr;
      padding-top: 60px;
      text-align: center;
      gap: 56px;
    }

    &__subtitle { max-width: 100%; }
    &__actions { justify-content: center; }
    &__stats { justify-content: center; }
    &__mockup { justify-content: center; }

    &__floating {
      &--2 { left: 0; }
      &--1 { right: -10px; }
      &--3 { right: -10px; }
    }
  }
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 3px rgba(#4ade80, .3); }
  50% { box-shadow: 0 0 0 6px rgba(#4ade80, .1); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

// ─── HOW ─────────────────────────────────────────────────
.how {
  padding: 100px 0;
  background: $white;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  &__header {
    text-align: center;
    margin-bottom: 64px;

    .section-sub { margin: 0 auto; }
  }

  &__steps {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 48px;
    position: relative;
  }

  &__step {
    text-align: center;
    position: relative;
  }

  &__step-number {
    font-size: .75rem;
    font-weight: 800;
    letter-spacing: .1em;
    color: $primary;
    margin-bottom: 16px;
  }

  &__step-icon {
    width: 72px;
    height: 72px;
    background: $primary-light;
    border-radius: $radius-lg;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    margin: 0 auto 20px;
    border: 2px solid color.adjust($primary-light, $lightness: -5%);
    transition: $transition;

    &:hover {
      transform: scale(1.05);
      border-color: $primary;
    }
  }

  &__step-title {
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 10px;
    color: $dark;
  }

  &__step-desc {
    font-size: .9rem;
    color: $mid;
    line-height: 1.7;
  }

  &__step-connector {
    position: absolute;
    top: 36px;
    right: -24px;
    width: 48px;
    height: 2px;
    background: linear-gradient(90deg, $border, $primary);
    z-index: 1;

    &::after {
      content: '→';
      position: absolute;
      right: -8px;
      top: -10px;
      color: $primary;
      font-size: .85rem;
    }
  }

  @media (max-width: 768px) {
    &__steps { grid-template-columns: 1fr; gap: 32px; }
    &__step-connector { display: none; }
  }
}

// ─── EXAMPLES / PRIMERI DIZAJNA (infinite carousel) ──────
.examples {
  padding: 110px 0;
  background: linear-gradient(180deg, $white 0%, $light 100%);
  overflow: hidden;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  &__header {
    text-align: center;
    margin-bottom: 52px;
    .section-sub { margin: 0 auto; }
  }

  &__viewport {
    --card-w: 300px;
    --card-gap: 24px;
    overflow: hidden;
    padding: 8px 0 6px;
  }

  &__track {
    display: flex;
    gap: var(--card-gap);
    will-change: transform;
  }

  &__card {
    flex: 0 0 var(--card-w);
    width: var(--card-w);
    display: flex;
    flex-direction: column;
    background: $white;
    border: 1px solid $border;
    border-radius: $radius-lg;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    box-shadow: $shadow-sm;
    transition: transform .28s cubic-bezier(.4,0,.2,1), box-shadow .28s ease, border-color .28s ease;

    &:hover {
      transform: translateY(-6px);
      box-shadow: $shadow-lg;
      border-color: rgba($primary,.4);

      .examples__card-stage img { transform: translateY(-6px) scale(1.03); }
      .examples__card-cta svg { transform: translateX(4px); }
    }
  }

  &__card-stage {
    position: relative;
    height: 240px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 44px 16px 14px;
    overflow: hidden;
    background: $white;

    img {
      width: auto;
      height: auto;
      max-width: 76%;
      max-height: 100%;
      object-fit: contain;
      filter:
        drop-shadow(0 12px 22px rgba(15,23,42,.16))
        drop-shadow(0 3px 6px rgba(15,23,42,.08));
      transition: transform .35s cubic-bezier(.4,0,.2,1);
    }
  }

  &__card-chip {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 2;
    padding: 5px 11px;
    border-radius: 999px;
    background: $white;
    border: 1px solid $border;
    box-shadow: $shadow-sm;
    color: $primary;
    font-size: .62rem;
    font-weight: 800;
    letter-spacing: .08em;
    text-transform: uppercase;
  }

  &__card-live {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 9px;
    border-radius: 999px;
    background: rgba($dark,.72);
    backdrop-filter: blur(6px);
    color: $white;
    font-size: .6rem;
    font-weight: 700;
    letter-spacing: .04em;

    i {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #4ade80;
      box-shadow: 0 0 0 3px rgba(#4ade80,.3);
    }
  }

  &__card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 16px 18px 18px;
  }

  &__card-title {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 800;
    letter-spacing: -.02em;
    color: $dark;
  }

  &__card-desc {
    margin: 7px 0 0;
    font-size: .82rem;
    line-height: 1.5;
    color: $mid;
  }

  &__card-cta {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    margin-top: 14px;
    color: $primary;
    font-size: .82rem;
    font-weight: 700;

    svg { transition: transform .25s ease; }
  }

  &__controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-top: 32px;
  }

  &__dots {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__dot {
    width: 7px;
    height: 7px;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: rgba($primary, .25);
    cursor: pointer;
    transition: $transition;

    &--active {
      width: 26px;
      background: $primary;
    }
  }

  &__more {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: .9rem;
    font-weight: 700;
    color: $primary;
    transition: $transition;

    svg { transition: transform .22s ease; }
    &:hover { color: $primary-dark; }
    &:hover svg { transform: translateX(3px); }
  }

  @media (max-width: 560px) {
    padding: 72px 0;
    &__viewport { --card-w: min(300px, 82vw); }
    &__card-title { font-size: 1rem; }
  }
}

// ─── FEATURES ────────────────────────────────────────────
.features {
  padding: 100px 0;
  background: $light;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  &__header {
    margin-bottom: 56px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  &__card {
    background: $white;
    border-radius: $radius-lg;
    padding: 32px;
    border: 1px solid $border;
    transition: $transition;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, $primary, $accent);
      opacity: 0;
      transition: $transition;
    }

    &:hover {
      border-color: $primary;
      box-shadow: $shadow-md;
      transform: translateY(-4px);

      &::before { opacity: 1; }
    }

    &--featured {
      background: $dark;
      border-color: $dark;
      color: $white;

      .features__card-title { color: $white; }
      .features__card-desc { color: rgba($white,.6); }

      .features__card-list li {
        color: rgba($white,.75);
        svg { stroke: $accent; }
      }

      &::before { opacity: 1; }
    }
  }

  &__card-icon {
    font-size: 2rem;
    margin-bottom: 16px;
  }

  &__card-badge {
    display: inline-block;
    font-size: .68rem;
    font-weight: 700;
    letter-spacing: .04em;
    text-transform: uppercase;
    color: $primary;
    background: $primary-light;
    border: 1px solid color.adjust($primary-light, $lightness: -6%);
    padding: 4px 10px;
    border-radius: 999px;
    margin-bottom: 14px;
  }

  &__card-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: $dark;
    margin-bottom: 10px;
  }

  &__card-desc {
    font-size: .9rem;
    color: $mid;
    line-height: 1.7;
    margin-bottom: 20px;
  }

  &__card-list {
    display: flex;
    flex-direction: column;
    gap: 8px;

    li {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: .85rem;
      color: $dark-3;

      svg { stroke: $primary; flex-shrink: 0; }
    }
  }

  @media (max-width: 1024px) {
    &__grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 640px) {
    &__grid { grid-template-columns: 1fr; }
  }
}

// ─── BENEFITS ────────────────────────────────────────────
.benefits {
  padding: 100px 0;
  background: $white;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-top: 36px;
  }

  &__item {
    display: flex;
    align-items: flex-start;
    gap: 16px;

    &-icon {
      width: 48px;
      height: 48px;
      background: $primary-light;
      border-radius: $radius-md;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      flex-shrink: 0;
    }

    h4 {
      font-size: 1rem;
      font-weight: 700;
      color: $dark;
      margin-bottom: 4px;
    }

    p {
      font-size: .9rem;
      color: $mid;
      line-height: 1.6;
    }
  }

  &__visual {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__chart {
    background: $dark;
    border-radius: $radius-lg;
    padding: 28px;
    color: $white;

    &-title {
      font-size: .85rem;
      font-weight: 600;
      color: rgba($white,.6);
      margin-bottom: 24px;
    }

    &-bars {
      display: flex;
      gap: 32px;
      align-items: flex-end;
      height: 140px;
      margin-bottom: 16px;
    }

    &-bar-group {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      flex: 1;
    }

    &-bar-wrap {
      display: flex;
      gap: 6px;
      align-items: flex-end;
      height: 120px;
    }

    &-bar {
      width: 24px;
      background: rgba($white,.2);
      border-radius: 4px 4px 0 0;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      min-height: 20px;
      transition: height .8s cubic-bezier(.4,0,.2,1);

      span {
        font-size: .55rem;
        font-weight: 700;
        color: rgba($white,.6);
        padding-top: 3px;
      }

      &--after {
        background: linear-gradient(180deg, $primary, $accent);
        span { color: $white; }
      }
    }

    &-label {
      font-size: .7rem;
      color: rgba($white,.5);
      text-align: center;
    }

    &-legend {
      display: flex;
      gap: 16px;
      font-size: .75rem;
      color: rgba($white,.6);
    }
  }

  &__note {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 18px;
    border-radius: $radius-lg;
    background: $light;
    border: 1px solid $border;

    &-icon { font-size: 1.3rem; flex-shrink: 0; }

    p { font-size: .85rem; color: $mid; line-height: 1.55; }
  }

  @media (max-width: 900px) {
    &__container { grid-template-columns: 1fr; gap: 48px; }
  }
}

.legend-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  margin-right: 4px;

  &--before { background: rgba($white,.2); }
  &--after { background: $primary; }
}

// ─── PRICING ─────────────────────────────────────────────
.pricing {
  padding: 100px 0;
  background: $light;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  &__header {
    text-align: center;
    margin-bottom: 56px;
  }

  &__toggle {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-size: .9rem;
    font-weight: 500;
    color: $mid;
    margin-top: 24px;

    span { transition: $transition; }
    span.active { color: $dark; font-weight: 700; }
  }

  &__toggle-btn {
    width: 52px;
    height: 28px;
    background: $border;
    border: none;
    border-radius: 999px;
    cursor: pointer;
    position: relative;
    transition: $transition;

    &.active {
      background: $primary;
      .pricing__toggle-circle { transform: translateX(24px); }
    }
  }

  &__toggle-circle {
    position: absolute;
    top: 4px;
    left: 4px;
    width: 20px;
    height: 20px;
    background: $white;
    border-radius: 50%;
    transition: $transition;
    box-shadow: $shadow-sm;
  }

  &__cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    align-items: start;
  }

  &__card {
    background: $white;
    border-radius: $radius-lg;
    padding: 36px;
    border: 2px solid $border;
    transition: $transition;
    position: relative;

    &--popular {
      border-color: $primary;
      background: $dark;
      color: $white;
      transform: scale(1.04);
      box-shadow: $shadow-xl;

      .pricing__card-name { color: $white; }
      .pricing__card-desc { color: rgba($white,.6); }
      .pricing__card-currency,
      .pricing__card-amount { color: $white; }
      .pricing__card-period { color: rgba($white,.5); }

      .pricing__card-feature {
        color: rgba($white,.75);
        svg { stroke: $accent; }
      }
    }
  }

  &__card-badge {
    position: absolute;
    top: -14px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, $primary, $accent);
    color: $white;
    font-size: .75rem;
    font-weight: 700;
    padding: 5px 16px;
    border-radius: 999px;
    white-space: nowrap;
  }

  &__card-icon { font-size: 2rem; margin-bottom: 12px; }

  &__card-name {
    font-size: 1.2rem;
    font-weight: 800;
    color: $dark;
    margin-bottom: 6px;
  }

  &__card-desc {
    font-size: .88rem;
    color: $mid;
    margin-bottom: 24px;
    line-height: 1.6;
  }

  &__card-price {
    display: flex;
    align-items: flex-start;
    gap: 4px;
    margin-bottom: 24px;
    min-height: 52px;

    &--custom {
      flex-direction: column;
      gap: 2px;
      align-items: flex-start;
    }
  }

  &__card-currency {
    font-size: .85rem;
    font-weight: 700;
    color: $mid;
    padding-top: 10px;
  }

  &__card-amount {
    font-size: 2.4rem;
    font-weight: 900;
    letter-spacing: -.04em;
    color: $dark;
  }

  &__card-period {
    font-size: .85rem;
    color: $mid;
    padding-top: 20px;
  }

  &__card-amount-custom {
    font-size: 2.4rem;
    font-weight: 900;
    letter-spacing: -.04em;
    color: $dark;
    line-height: 1.1;
  }

  &__card-period-custom {
    font-size: .85rem;
    color: $mid;
  }

  .btn {
    width: 100%;
    justify-content: center;
    margin-bottom: 28px;
  }

  &__card-features {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__card-feature {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: .88rem;
    color: $dark-3;

    svg {
      stroke: $primary;
      flex-shrink: 0;
    }
  }

  &__more {
    text-align: center;
    margin-top: 44px;
  }

  &__more-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: .92rem;
    font-weight: 700;
    color: $primary;
    transition: $transition;

    svg { transition: transform .22s ease; }
    &:hover { color: $primary-dark; }
    &:hover svg { transform: translateX(3px); }
  }

  @media (max-width: 900px) {
    &__cards {
      grid-template-columns: 1fr;
      max-width: 440px;
      margin: 0 auto;
    }

    &__card--popular { transform: none; }
  }
}

// ─── FAQ ─────────────────────────────────────────────────
.faq {
  padding: 100px 0;
  background: $white;

  &__container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 24px;
  }

  &__header {
    text-align: center;
    margin-bottom: 56px;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__item {
    border: 1px solid $border;
    border-radius: $radius-md;
    overflow: hidden;
    cursor: pointer;
    transition: $transition;

    &--open {
      border-color: $primary;
      box-shadow: 0 0 0 3px rgba($primary,.08);

      .faq__arrow {
        transform: rotate(180deg);
        stroke: $primary;
      }

      .faq__answer {
        max-height: 200px;
        padding: 0 24px 20px;
      }
    }

    &:hover:not(.faq__item--open) {
      border-color: color.adjust($border, $lightness: -8%);
    }
  }

  &__question {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 20px 24px;
    font-size: .95rem;
    font-weight: 600;
    color: $dark;
    user-select: none;
  }

  &__arrow {
    flex-shrink: 0;
    transition: transform .25s ease;
  }

  &__answer {
    max-height: 0;
    overflow: hidden;
    font-size: .9rem;
    color: $mid;
    line-height: 1.7;
    transition: max-height .3s ease, padding .25s ease;
    padding: 0 24px;
  }
}

// ─── INSTAGRAM ───────────────────────────────────────────
.instagram {
  padding: 100px 0;
  background: $light;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  &__header {
    text-align: center;
    margin-bottom: 48px;

    .section-sub {
      margin: 0 auto;
      a { color: $primary; font-weight: 700; }
    }
  }

  &__actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 24px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 12px;
  }

  &__item {
    position: relative;
    display: block;
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: $radius-md;
    border: 1px solid $border;
    background: $white;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform .4s cubic-bezier(.4,0,.2,1);
    }

    &:hover img { transform: scale(1.06); }
    &:hover .instagram__overlay { opacity: 1; }
    &:focus-visible { outline: 2px solid $accent; outline-offset: 2px; }
  }

  &__overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $white;
    background: linear-gradient(135deg, rgba($primary,.55), rgba($accent,.55));
    opacity: 0;
    transition: opacity .25s ease;
  }

  @media (max-width: 900px) {
    &__grid { grid-template-columns: repeat(3, 1fr); }
  }

  @media (max-width: 480px) {
    &__grid { grid-template-columns: repeat(3, 1fr); gap: 8px; }
  }
}

// ─── CTA ─────────────────────────────────────────────────
.cta {
  padding: 100px 0;
  background: #15191F;
  position: relative;
  overflow: hidden;
  text-align: center;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(61, 102, 149, .18) 1px, transparent 1px);
    background-size: 64px 64px;
    opacity: .75;
    pointer-events: none;
  }

  &__blob {
    display: none;
  }

  &__container {
    max-width: 680px;
    margin: 0 auto;
    padding: 0 24px;
    position: relative;
    z-index: 1;
  }

  &__content {
    position: relative;
    z-index: 1;
  }

  &__title {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 900;
    color: #F9F9F9;
    letter-spacing: -.03em;
    margin-bottom: 16px;
    line-height: 1.1;
  }

  &__sub {
    font-size: 1.05rem;
    color: rgba(249, 249, 249, .62);
    margin-bottom: 32px;
    line-height: 1.7;
  }

  &__form {
    display: flex;
    gap: 12px;
    max-width: 560px;
    margin: 0 auto 20px;
  }

  &__input {
    flex: 1;
    min-width: 0;
    padding: 14px 18px;
    border-radius: $radius-md + 4px;
    border: 1px solid rgba(249, 249, 249, .14);
    background: rgba(249, 249, 249, .08);
    color: #F9F9F9;
    font-family: inherit;
    font-size: .95rem;
    outline: none;
    transition: $transition;

    &::placeholder {
      color: rgba(249, 249, 249, .45);
    }

    &:focus {
      border-color: rgba(61, 102, 149, .75);
      background: rgba(249, 249, 249, .11);
      box-shadow: 0 0 0 4px rgba(61, 102, 149, .18);
    }
  }

  .btn--primary {
    background: #3D6695;
    color: #F9F9F9;
    border-color: #3D6695;
    box-shadow: 0 4px 14px rgba(61, 102, 149, .28);

    &:hover {
      background: #4B6F95;
      border-color: #4B6F95;
      box-shadow: 0 6px 20px rgba(61, 102, 149, .36);
      transform: translateY(-1px);
    }
  }

  &__success {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-top: 12px;
    padding: 10px 16px;
    border-radius: 999px;
    background: rgba(74, 222, 128, .12);
    border: 1px solid rgba(74, 222, 128, .22);
    color: #F9F9F9;
    font-size: .9rem;
    font-weight: 600;
  }

  &__note {
    margin-top: 18px;
    font-size: .85rem;
    color: rgba(249, 249, 249, .48);
  }

  @media (max-width: 640px) {
    padding: 80px 0;

    &__form {
      flex-direction: column;
    }

    .btn {
      justify-content: center;
      width: 100%;
    }
  }
}

// ─── FOOTER ──────────────────────────────────────────────
.footer {
  background: $dark-2;
  color: $white;
  padding: 64px 0 0;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  &__top {
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr 1fr;
    gap: 48px;
    padding-bottom: 48px;
    border-bottom: 1px solid rgba($white,.08);
  }

  &__brand {
    .navbar__logo-text { color: $white; span { color: $accent; } }
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.2rem;
    font-weight: 800;
    margin-bottom: 16px;
  }

  &__brand-desc {
    font-size: .88rem;
    color: rgba($white,.5);
    line-height: 1.7;
    margin-bottom: 20px;
  }

  &__socials {
    display: flex;
    gap: 10px;
  }

  &__social {
    width: 36px;
    height: 36px;
    border: 1px solid rgba($white,.12);
    border-radius: $radius-sm;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba($white,.6);
    transition: $transition;

    &:hover {
      border-color: $primary;
      color: $white;
      background: rgba($primary,.2);
    }
  }

  &__links-group {
    h4 {
      font-size: .85rem;
      font-weight: 700;
      color: rgba($white,.4);
      text-transform: uppercase;
      letter-spacing: .08em;
      margin-bottom: 16px;
    }

    ul {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    a {
      font-size: .9rem;
      color: rgba($white,.6);
      transition: $transition;

      &:hover { color: $white; }
    }
  }

  &__bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 0;
    font-size: .85rem;
    color: rgba($white,.35);
    flex-wrap: wrap;
    gap: 12px;
  }

  &__bottom-links {
    display: flex;
    gap: 24px;

    a {
      color: rgba($white,.35);
      transition: $transition;
      &:hover { color: rgba($white,.7); }
    }
  }

  @media (max-width: 900px) {
    &__top { grid-template-columns: 1fr 1fr; }
    &__brand { grid-column: 1 / -1; }
  }

  @media (max-width: 560px) {
    &__top { grid-template-columns: 1fr; }
    &__bottom { flex-direction: column; text-align: center; }
  }
}

// ─── RESPONSIVE ──────────────────────────────────────────
@media (max-width: 640px) {
  .section-title { font-size: 1.75rem; }
  .how, .features, .benefits, .pricing, .faq, .cta, .instagram { padding: 64px 0; }
}

@media (prefers-reduced-motion: reduce) {
  .examples__card:hover { transform: none; }
  .examples__card:hover .examples__card-stage img { transform: none; }
}

.logo32{
  width: 32px;
  height: 32px;
}
</style>