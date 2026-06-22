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
          <li><RouterLink to="/demo">Primeri</RouterLink></li>
          <li><a href="#funkcije">Funkcije</a></li>
          <li><a href="#kontakt-cta">Kontakt</a></li>
        </ul>
        <div class="navbar__cta">
          <a href="#kontakt-cta" class="btn btn--primary">Hoću svoj salon online</a>
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
        <a href="#kontakt-cta" @click="menuOpen = false"><span class="navbar__drawer-dot"></span> Kontakt</a>
      </nav>

      <div class="navbar__drawer-extra">
        <a
          href="#kontakt-cta"
          class="btn btn--primary btn--lg"
          @click="menuOpen = false"
        >
          <span>Hoću svoj salon online</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>

        <RouterLink
          to="/demo"
          class="btn btn--ghost btn--lg"
          @click="menuOpen = false"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
          Pogledaj primere
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
            Tvoj salon ide<br />
            <span class="hero__title-gradient">online.</span>
          </h1>
          <p class="hero__subtitle">
            Profesionalni sajt i pametni sistem za online zakazivanje — sve na jednom mestu. Bez poziva, bez papira, bez glavobolje.
          </p>
          <div class="hero__actions">
            <a href="#kontakt-cta" class="btn btn--primary btn--lg">
              <span>Hoću svoj salon online</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>

            <RouterLink to="/demo" class="btn btn--ghost btn--lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              Pogledaj primere
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
            <span>🔔</span> Novo zakazivanje
          </div>
          <div class="hero__floating hero__floating--2">
            <span>✅</span> Termin potvrđen
          </div>
          <div class="hero__floating hero__floating--3">
            <span>⏰</span> Podsetnik poslat
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
          <p class="section-sub">Saradnja od prve ideje do lansiranja. Dizajn pravimo po tvojoj meri, vodimo te kroz svaki korak — bez tehničkih komplikacija.</p>
        </div>
        <div class="how__steps">
          <div class="how__step" v-for="(step, index) in steps" :key="step.title">
            <div class="how__step-marker">
              <span class="how__step-icon" v-html="step.icon"></span>
            </div>
            <div class="how__step-content">
              <span class="how__step-num">Korak {{ String(index + 1).padStart(2, '0') }}</span>
              <h3 class="how__step-title">{{ step.title }}</h3>
              <p class="how__step-desc">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PRIMERI DIZAJNA -->
    <section class="examples" id="primeri">
      <div class="examples__container">
        <div class="examples__header">
          <div class="section-tag">Primeri dizajna</div>
          <h2 class="section-title">Ovako bi mogao da izgleda tvoj salon online</h2>
          <p class="section-sub">Funkcionalni primeri za barber, hair, beauty i nail salone — napravljeni da inspirišu.</p>
        </div>

        <div class="examples__viewport" ref="viewportRef">
          <div class="examples__track">
            <a
              class="examples__card"
              v-for="item in designs"
              :key="item.id"
              :href="item.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div class="examples__card-stage">
                <span class="examples__card-chip">{{ item.type }}</span>
                <span class="examples__card-live"><i></i> uživo</span>
                <img :src="item.image" :alt="item.title" loading="lazy" draggable="false" />
              </div>
              <div class="examples__card-body">
                <h3 class="examples__card-title">{{ item.title }}</h3>
                <p class="examples__card-desc">{{ item.text }}</p>
                <span class="examples__card-cta">
                  Probaj primer
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </span>
              </div>
            </a>
          </div>
        </div>

        <div class="examples__controls">
          <div class="examples__dots" role="tablist" aria-label="Navigacija primera">
            <button
              v-for="(_, index) in designs"
              :key="index"
              class="examples__dot"
              :class="{ 'examples__dot--active': activeIndex === index }"
              type="button"
              :aria-label="`Primer ${index + 1}`"
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

    <!-- MID CTA BAND -->
    <section class="cta-band">
      <div class="cta-band__inner">
        <div class="cta-band__text">
          <h2>Sviđa ti se neki od primera?</h2>
          <p>Napravimo ti besplatan primer tvog salona — kreni od onog koji ti se najviše dopada.</p>
        </div>
        <a href="#kontakt-cta" class="btn btn--primary btn--lg cta-band__cta">
          Hoću svoj salon online
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
    </section>

    <!-- FUNKCIJE -->
    <section class="features" id="funkcije">
      <div class="features__container">
        <div class="features__header">
          <div class="section-tag">Funkcije</div>
          <h2 class="section-title">Sve što ti treba,<br/>ništa što ti ne treba</h2>
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
        <div class="benefits__header">
          <div class="section-tag">Zašto mi?</div>
          <h2 class="section-title">Manje poziva.<br/>Više zadovoljnih klijenata.</h2>
          <p class="section-sub">Salonima koji pređu na online zakazivanje sistem oslobađa vreme i smanjuje propuštene termine — manje telefoniranja, više popunjenih termina.</p>
        </div>
        <div class="benefits__grid">
          <div class="benefits__item" v-for="benefit in benefits" :key="benefit.title">
            <div class="benefits__item-icon" v-html="benefit.icon"></div>
            <div class="benefits__item-body">
              <h4>{{ benefit.title }}</h4>
              <p>{{ benefit.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CENE -->
    <section class="pricing" id="cene">
      <div class="pricing__container">
        <div class="pricing__header">
          <div class="section-tag">Cena</div>
          <h2 class="section-title">Jasna cena.<br/>Bez skrivenih troškova.</h2>
          <p class="section-sub" style="margin: 0 auto;">Kompletan sajt sa sistemom za online zakazivanje i admin panelom — jednokratno, bez mesečnih troškova.</p>
        </div>

        <div class="offer">
          <div class="offer__panel">
            <span class="offer__founder">Osnivačka ponuda · prvih 5 salona</span>
            <div class="offer__price">
              <span class="offer__price-old">399€</span>
              <span class="offer__price-now">250€</span>
              <span class="offer__price-note">jednokratno</span>
            </div>
            <p class="offer__desc">
              Prvih 5 salona dobija punu izradu po osnivačkoj ceni — u zamenu za kratku recenziju i mogućnost da tvoj salon prikažemo kao primer.
            </p>
            <ul class="offer__list">
              <li v-for="item in offerIncludes" :key="item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                {{ item }}
              </li>
            </ul>
            <a href="#kontakt-cta" class="btn btn--primary btn--lg offer__cta">
              Hoću svoj salon online
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <p class="offer__small">Plaćanje odjednom ili na rate · 2 meseca besplatne podrške</p>
          </div>
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
          <h2 class="section-title">Zaviri u naš svet<br/>na Instagramu</h2>
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

    <!-- CTA / KONTAKT -->
    <section class="final-cta" id="kontakt-cta">
      <div class="final-cta__container">
        <div class="final-cta__pitch">
          <span class="final-cta__offerbadge">
            <span class="final-cta__offerbadge-dot"></span>
            Osnivačka ponuda · prvih 5 salona 250€
          </span>

          <h2 class="final-cta__title">Tvoj salon zaslužuje<br/>da bude <span class="final-cta__accent">online.</span></h2>

          <p class="final-cta__sub">
            Pošalji nam ime salona i napravimo ti besplatan funkcionalni primer baš za njega. Vidiš tačno kako izgleda online — pre nego što platiš dinar.
          </p>

          <ol class="final-cta__steps">
            <li class="final-cta__step">
              <span class="final-cta__step-num">01</span>
              <span class="final-cta__step-label">Pošalji instagram ili slike salona</span>
            </li>
            <li class="final-cta__step">
              <span class="final-cta__step-num">02</span>
              <span class="final-cta__step-label">Pravimo ti primer, besplatno</span>
            </li>
            <li class="final-cta__step">
              <span class="final-cta__step-num">03</span>
              <span class="final-cta__step-label">Vidiš svoj salon online</span>
            </li>
          </ol>

          <a
            href="https://ig.me/m/tvojred.rs"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn--primary btn--lg final-cta__primary"
            @click="trackLead"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
            Piši nam na Instagramu
          </a>

          <p class="final-cta__or">ili</p>

          <div class="final-cta__contacts">
            <a href="https://wa.me/381653089240?text=Zdravo!%20Zanima%20me%20besplatan%20prikaz%20za%20moj%20salon." target="_blank" rel="noopener noreferrer" class="btn btn--ghost" @click="trackLead">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/></svg>
              WhatsApp
            </a>
            <a href="viber://chat?number=%2B381653089240" class="btn btn--ghost" @click="trackLead">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Viber
            </a>
            <a href="tel:+381653089240" class="btn btn--ghost" @click="trackLead">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Pozovi
            </a>
          </div>

          <p class="final-cta__note">Napiši ime salona kad se javiš — odgovaramo obično u toku dana.</p>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
      <div class="footer__container">
        <div class="footer__top">
          <div class="footer__brand">
            <div class="footer__logo">
              <span class="navbar__logo-text">tvojred<span>.rs</span></span>
            </div>
            <p class="footer__brand-desc">Sajtovi i online zakazivanje po meri za frizerske, beauty i nail salone u Srbiji.</p>
            <div class="footer__socials">
              <a href="https://instagram.com/tvojred.rs" target="_blank" rel="noopener noreferrer" class="footer__social" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </a>
            </div>
          </div>

          <div class="footer__links-group">
            <h4>Sajt</h4>
            <ul>
              <li><a href="#kako-radi">Kako radi</a></li>
              <li><a href="#funkcije">Funkcije</a></li>
              <li><a href="#cene">Cena</a></li>
              <li><RouterLink to="/demo">Primeri</RouterLink></li>
            </ul>
          </div>

          <div class="footer__links-group">
            <h4>Kontakt</h4>
            <ul>
              <li><a href="https://ig.me/m/tvojred.rs" target="_blank" rel="noopener noreferrer" @click="trackLead">Instagram DM</a></li>
              <li><a href="https://wa.me/381653089240?text=Zdravo!%20Zanima%20me%20besplatan%20prikaz%20za%20moj%20salon." target="_blank" rel="noopener noreferrer" @click="trackLead">WhatsApp</a></li>
              <li><a href="viber://chat?number=%2B381653089240" @click="trackLead">Viber</a></li>
              <li><a href="tel:+381653089240" @click="trackLead">065 308 9240</a></li>
            </ul>
          </div>
        </div>
        <div class="footer__bottom">
          <p>© {{ new Date().getFullYear() }} tvojred.rs. Sva prava zadržana.</p>
          <a href="#kontakt-cta" class="footer__cta-link">Hoću svoj salon online →</a>
        </div>
      </div>
    </footer>

    <!-- STICKY MOBILE CTA -->
    <a
      href="#kontakt-cta"
      class="sticky-cta"
      :class="{ 'sticky-cta--hidden': !showStickyCta }"
      aria-label="Hoću svoj salon online"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <span>Hoću svoj salon online</span>
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, watch } from 'vue'
import { RouterLink } from 'vue-router'

import instaPlaceholder1 from '@/assets/img/za-sajt1.png'
import instaPlaceholder2 from '@/assets/img/za-sajt2.png'
import instaPlaceholder3 from '@/assets/img/za-sajt3.png'
import instaPlaceholder4 from '@/assets/img/za-sajt4.png'
import instaPlaceholder5 from '@/assets/img/za-sajt5.png'
import instaPlaceholder6 from '@/assets/img/za-sajt6.png'

import testHomepage from '@/assets/img/mockup-test-studio.png'
import testZakazi from '@/assets/img/mockup-test-studio-zakazivanje.png'
import modernHomepage from '@/assets/img/mockup-modern-life.png'
import modernZakazi from '@/assets/img/mockup-modern-life-zakazivanje.png'
import nailWelcome from '@/assets/img/mockup-nail.png'
import nailZakazi from '@/assets/img/mockup-nail-zakazivanje.png'
import adminPanel from '@/assets/img/mockup-admin-panel.png'
import barberBookingSlajder from '@/assets/img/barber-booking2-mockup.png'
import barberBookingMinimalistic from '@/assets/img/barber-booking1-mockup.png'
import BarberBooking3 from './BarberBooking3.vue'
import BarberBooking from '@/assets/img/barber-booking3-mockup.png'



const designs = [
  { id: 1, type: 'Online zakazivanje', title: 'Barber Salon', text: 'Minimalisticki i elegantan dizajn za zakazivanje termina.', image: BarberBooking, url: '/barber-booking3' },

  { id: 2, type: 'Online zakazivanje', title: 'Barber Salon', text: 'Klijent bira uslugu, frizera, datum i termin bez dopisivanja preko poruka.', image: testZakazi, url: '/test-studio/zakazivanje' },
  { id: 3, type: 'Web sajt', title: 'Barber Salon', text: 'Početna strana sa uslugama, atmosferom i jasnim pozivom na zakazivanje.', image: testHomepage, url: '/test-studio' },

  { id: 4, type: 'Online zakazivanje', title: 'Barber Salon', text: 'Moderna minimalisticka stranica za zakazivanje, personalizovana u bojama brenda.', image: barberBookingMinimalistic, url: '/barber-booking' },

  { id: 5, type: 'Online zakazivanje', title: 'Barber Salon', text: 'Stranica za zakazivanje sa premium narandzastom bojom i slajderom.', image: barberBookingSlajder, url: '/barber-booking2' },

  { id: 6, type: 'Online zakazivanje', title: 'Beauty Salon', text: 'Klijent bira uslugu, osobu, datum i termin bez dopisivanja preko poruka.', image: modernZakazi, url: '/modern-life/zakazivanje' },
  { id: 7, type: 'Web sajt', title: 'Beauty Salon', text: 'Svetao sajt za hair i beauty salon sa uslugama, timom i zakazivanjem.', image: modernHomepage, url: '/modern-life' },
  { id: 8, type: 'Online zakazivanje', title: 'Nail Salon', text: 'Zakazivanje za nail salon sa jasnim izborom usluge, termina i nail artist-a.', image: nailZakazi, url: '/nail-studio/zakazivanje' },
  { id: 9, type: 'Web sajt', title: 'Nail Salon', text: 'Elegantan sajt za nail salon sa radovima, cenovnikom i direktnim zakazivanjem.', image: nailWelcome, url: '/nail-studio' },
  { id: 10, type: 'Admin panel', title: 'Kontrola salona', text: 'Pregled termina, zaposlenih, usluga, klijenata, cena i statistike poslovanja.', image: adminPanel, url: '/admin-panel' },
]

const instagramPosts = [
  { id: 1, image: instaPlaceholder1, url: 'https://www.instagram.com/p/DZaLqkaN7KZ/' },
  { id: 2, image: instaPlaceholder2, url: 'https://www.instagram.com/reel/DZxDCNGtfZ1/' },
  { id: 3, image: instaPlaceholder3, url: 'https://www.instagram.com/p/DZvOA-CNaQs/' },
  { id: 4, image: instaPlaceholder4, url: 'https://www.instagram.com/p/DZaLYAwNKN5/' },
  { id: 5, image: instaPlaceholder5, url: 'https://www.instagram.com/p/DZaL5wWNROJ/' },
  { id: 6, image: instaPlaceholder6, url: 'https://www.instagram.com/p/DZr1QapN4hH/' },
]

export default defineComponent({
  name: 'TvojRedLanding',
  components: { RouterLink },
  setup() {
    const scrolled = ref(false)
    const menuOpen = ref(false)
    const openFaq = ref<number | null>(null)
    const showStickyCta = ref(false)

    const handleScroll = () => {
      scrolled.value = window.scrollY > 60

      const y = window.scrollY

      // Sticky nestaje čim kontakt sekcija počne da ulazi u ekran,
      // a ne tek kad se stigne do njenog dna.
      let reachedContact = false
      const contact = document.getElementById('kontakt-cta')
      if (contact) {
        const top = contact.getBoundingClientRect().top
        reachedContact = top < window.innerHeight - 80
      }

      showStickyCta.value = y > 600 && !reachedContact
    }

    // ── Carousel: native smooth scroll-snap, auto-advance, pauza na interakciju, idle resume ──
    const viewportRef = ref<HTMLElement | null>(null)
    const activeIndex = ref(0)

    const AUTO_MS = 3800
    const IDLE_MS = 5000

    let autoTimer: number | undefined
    let idleTimer: number | undefined
    let scrollRaf = 0
    let reduceMotion = false

    const stepSize = () => {
      const vp = viewportRef.value
      if (!vp) return 0
      const track = vp.firstElementChild as HTMLElement | null
      if (!track || track.children.length < 2) return vp.clientWidth
      const a = track.children[0] as HTMLElement
      const b = track.children[1] as HTMLElement
      return b.offsetLeft - a.offsetLeft
    }

    const updateActiveIndex = () => {
      const vp = viewportRef.value
      if (!vp) return
      const step = stepSize()
      if (step > 0) {
        const i = Math.round(vp.scrollLeft / step)
        activeIndex.value = Math.max(0, Math.min(i, designs.length - 1))
      }
    }

    const scrollToIndex = (index: number, smooth = true) => {
      const vp = viewportRef.value
      if (!vp) return
      const step = stepSize()
      const i = Math.max(0, Math.min(index, designs.length - 1))
      vp.scrollTo({ left: i * step, behavior: smooth && !reduceMotion ? 'smooth' : 'auto' })
    }

    const stopAuto = () => {
      if (autoTimer) {
        window.clearInterval(autoTimer)
        autoTimer = undefined
      }
    }

    const startAuto = () => {
      if (reduceMotion) return
      stopAuto()
      autoTimer = window.setInterval(() => {
        const next = activeIndex.value >= designs.length - 1 ? 0 : activeIndex.value + 1
        scrollToIndex(next)
      }, AUTO_MS)
    }

    // Na svaku ručnu interakciju pauziramo auto i ponovo ga palimo nakon mirovanja.
    const pauseAndScheduleResume = () => {
      stopAuto()
      if (idleTimer) window.clearTimeout(idleTimer)
      idleTimer = window.setTimeout(() => { startAuto() }, IDLE_MS)
    }

    const goToSlide = (index: number) => {
      scrollToIndex(index)
      pauseAndScheduleResume()
    }

    const onViewportScroll = () => {
      if (scrollRaf) return
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0
        updateActiveIndex()
      })
    }

    const interactionEvents: Array<keyof HTMLElementEventMap> = ['pointerdown', 'wheel', 'touchstart']

    onMounted(() => {
      window.addEventListener('scroll', handleScroll, { passive: true })
      handleScroll()

      reduceMotion = typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false

      const vp = viewportRef.value
      if (vp) {
        vp.addEventListener('scroll', onViewportScroll, { passive: true })
        interactionEvents.forEach((e) => vp.addEventListener(e, pauseAndScheduleResume, { passive: true }))
      }

      if (!reduceMotion) startAuto()
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
      stopAuto()
      if (idleTimer) window.clearTimeout(idleTimer)
      if (scrollRaf) cancelAnimationFrame(scrollRaf)

      const vp = viewportRef.value
      if (vp) {
        vp.removeEventListener('scroll', onViewportScroll)
        interactionEvents.forEach((e) => vp.removeEventListener(e, pauseAndScheduleResume))
      }

      document.body.style.overflow = ''
    })

    // Zaključaj scroll dok je bočni meni otvoren
    watch(menuOpen, (open) => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = open ? 'hidden' : ''
      }
    })

    // Kontakt akcija → otvara Instagram DM / WhatsApp / Viber / poziv
    // Meta Pixel: javi konverziju (kontakt) ako je piksel učitan
    const trackLead = () => {
      if (typeof window !== 'undefined' && (window as any).fbq) {
        ;(window as any).fbq('track', 'Lead')
      }
    }

    const stats = [
      { value: '24/7', label: 'Online zakazivanje' },
      { value: 'Po meri', label: 'Dizajn tvog brenda' },
      { value: '2 mes.', label: 'Besplatne podrške' },
    ]

    const steps = [
      {
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/></svg>',
        title: 'Konsultacija i analiza',
        desc: 'Upoznajemo tvoj salon, usluge i želje. Zajedno definišemo kako tvoj sajt i sistem za zakazivanje treba da izgledaju i funkcionišu.',
      },
      {
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>',
        title: 'Dizajn po tvojoj želji',
        desc: 'Kreiramo jedinstven dizajn prilagođen tvom brendu. Svaki detalj usklađujemo sa tvojom vizijom — dok ne budeš potpuno zadovoljan.',
      },
      {
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',
        title: 'Lansiranje i podrška',
        desc: 'Postavljamo tvoj sajt i sistem online. Tu smo i nakon lansiranja, sa besplatnom podrškom od 2 meseca.',
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
        desc: 'Profesionalan, responzivan sajt koji predstavlja tvoj salon u najboljem svetlu.',
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
        desc: 'Da te novi klijenti lako pronađu kada pretražuju salone u tvom gradu.',
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
        desc: 'Sve o tvom salonu na jednom mestu — pregledno, brzo i jednostavno.',
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
        desc: 'Definiši ponudu i vodi urednu evidenciju svojih klijenata.',
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
        desc: 'Prihvataj depozite i pune isplate online i smanji broj no-show termina.',
        featured: false,
        badge: 'Napredna opcija',
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
        title: 'Uštedi sate svake nedelje',
        desc: 'Bez beskonačnih poziva i poruka za zakazivanje — sistem radi umesto tebe.',
      },
      {
        icon: '📉',
        desc: 'Automatski podsetnici smanjuju broj klijenata koji ne dođu.',
      },
      {
        icon: '💰',
        title: 'Povećaj prihode',
        desc: 'Online prisutnost i lakše zakazivanje donose nove klijente koji te pronađu na internetu.',
      },
      {
        icon: '😊',
        desc: 'Klijenti cene modernost i jednostavnost — veće ocene, više preporuka.',
      },
    ]

    const offerIncludes = [
      'Moderan websajt po meri',
      'Online zakazivanje 24/7',
      'Admin panel za salon',
      'Usluge, cene i klijenti',
      'Podešavanje i lansiranje',
    ]

    const faqs = [
      {
        q: 'Šta tačno dobijam?',
        a: 'Kompletan sajt po meri tvog salona, sistem za online zakazivanje i admin panel iz kog vodiš termine, usluge i klijente. Sve je jednokratno — bez mesečne pretplate.',
      },
      {
        q: 'Koliko košta i kako se plaća?',
        a: 'Redovna cena je 399€ jednokratno, a za prvih 5 salona važi osnivačka cena od 250€. Plaćaš odjednom ili na rate: pola na početku izrade, pola po završetku. Nema skrivenih ni mesečnih troškova.',
      },
      {
        q: 'Da li mi treba tehničko znanje?',
        a: 'Ne. Ceo tehnički deo radimo mi, a ti dobiješ gotovo rešenje. Admin panel je napravljen tako da ga koristiš bez muke — kao bilo koju aplikaciju na telefonu.',
      },
      {
        q: 'Koliko traje izrada?',
        a: 'Zavisi od obima, ali okvirno do 30 dana. Pre toga zajedno prođemo dizajn i sadržaj, dok ne budeš zadovoljan.',
      },
      {
        q: 'Mogu li da vidim kako izgleda pre nego što platim?',
        a: 'Možeš. Na sajtu imaš funkcionalne primere koje odmah isprobaš, a možemo i besplatno da napravimo prikaz baš za tvoj salon — bez ikakve obaveze.',
      },
      {
        q: 'Šta ako klijent otkaže termin?',
        a: 'Sistem automatski oslobađa termin i tebi stiže obaveštenje u realnom vremenu, pa to vreme može da popuni neko drugi.',
      },
      {
        q: 'Da li sistem prima online plaćanje?',
        a: 'Po dogovoru — depoziti i pune isplate online, da smanjiš broj klijenata koji ne dođu. Tu ide i SMS potvrda termina i bolja vidljivost na Google-u.',
      },
    ]

    return {
      scrolled,
      menuOpen,
      openFaq,
      showStickyCta,
      trackLead,
      stats,
      steps,
      features,
      benefits,
      offerIncludes,
      faqs,
      designs,
      viewportRef,
      activeIndex,
      goToSlide,
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
  display: block;
  overflow-x: hidden;
}

// Omogućava full-width sekcije čak i kada projekat još ima
// podrazumevani Vite #app max-width stil.
html,
body {
  width: 100%;
  margin: 0;
  padding: 0;
}

#app,
.landing {
  width: 100%;
  max-width: none !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: visible !important;
  text-align: initial;
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
  display: flex;
  align-items: center;
  isolation: isolate;

  // Ne sme biti hidden, jer bi full-viewport background bio isečen
  // na širinu spoljnog containera.
  overflow: visible;
  background: transparent;

  // Sivi hero background ide punom širinom browsera.
  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 100vw;
    width: 100dvw;
    transform: translateX(-50%);
    z-index: -2;
    pointer-events: none;
    background:
      radial-gradient(120% 115% at 50% -10%, $tr-bg-soft 0%, $tr-bg 58%, $tr-bg-deep 100%);
  }

  // Tačkasti overlay takođe ide punom širinom browsera.
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 100vw;
    width: 100dvw;
    transform: translateX(-50%);
    z-index: -1;
    pointer-events: none;
    background-image:
      radial-gradient(rgba($tr-blue,.28) 1px, transparent 1px);
    background-size: 64px 64px;
  }

  // Stari unutrašnji background više nije potreban,
  // jer je bio vezan za širinu hero elementa/containera.
  &__bg {
    display: none;
  }

  &__blob { display: none; }

  &__grid {
    display: none;
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
    max-width: 1080px;
    margin: 0 auto;
    padding: 0 24px;
  }

  &__header {
    text-align: center;
    margin-bottom: 56px;

    .section-sub { margin: 0 auto; }
  }

  // ── Mobilni / default: vertikalni timeline ──
  &__steps {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;

    // Linija koja povezuje korake
    &::before {
      content: '';
      position: absolute;
      top: 30px;
      bottom: 30px;
      left: 27px;
      width: 2px;
      background: linear-gradient(180deg, rgba($primary,.35), rgba($primary,.12));
    }
  }

  &__step {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: flex-start;
    gap: 20px;
    padding: 14px 0;
  }

  &__step-marker {
    flex-shrink: 0;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: $white;
    border: 1px solid $border;
    box-shadow: 0 6px 18px rgba(15,23,42,.06);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: $transition;
  }

  &__step-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 24px;
      height: 24px;
      stroke: $primary;
      fill: none;
    }
  }

  &__step-content {
    padding-top: 5px;
  }

  &__step-num {
    display: block;
    font-size: .72rem;
    font-weight: 800;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: $primary;
    margin-bottom: 7px;
  }

  &__step-title {
    font-size: 1.15rem;
    font-weight: 700;
    letter-spacing: -.01em;
    margin-bottom: 8px;
    color: $dark;
  }

  &__step-desc {
    font-size: .92rem;
    color: $mid;
    line-height: 1.7;
  }

  &__step:hover .how__step-marker {
    border-color: rgba($primary,.55);
    box-shadow: 0 8px 22px rgba($primary,.16);
    transform: translateY(-2px);
  }

  // ── Desktop: tri kolone, horizontalna linija iznad markera ──
  @media (min-width: 769px) {
    &__steps {
      flex-direction: row;
      gap: 36px;

      &::before {
        top: 28px;
        bottom: auto;
        left: 16.66%;
        right: 16.66%;
        width: auto;
        height: 2px;
        background: linear-gradient(90deg, rgba($primary,.12), rgba($primary,.35), rgba($primary,.12));
      }
    }

    &__step {
      flex: 1;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 22px;
      padding: 0;
    }

    &__step-content { padding-top: 0; max-width: 300px; }
    &__step-desc { font-size: .9rem; }
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
    overflow-x: auto;
    overflow-y: hidden;
    padding: 8px 0 14px;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    scroll-padding-left: 0;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
  }

  &__track {
    display: flex;
    gap: var(--card-gap);
  }

  &__card {
    flex: 0 0 var(--card-w);
    width: var(--card-w);
    scroll-snap-align: start;
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
    gap: 18px;
    margin-top: 28px;
  }

  &__dots {
    display: flex;
    align-items: center;
    gap: 9px;
  }

  &__dot {
    width: 9px;
    height: 9px;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: rgba($primary, .22);
    cursor: pointer;
    transition: $transition;

    &:hover { background: rgba($primary, .45); }

    &--active {
      width: 30px;
      background: $primary;
    }
  }

  &__more {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    padding: 11px 20px;
    border-radius: 999px;
    border: 1.5px solid rgba($primary, .35);
    background: $white;
    font-size: .9rem;
    font-weight: 700;
    color: $primary;
    white-space: nowrap;
    transition: $transition;

    svg { transition: transform .22s ease; }

    &:hover {
      background: $primary;
      border-color: $primary;
      color: $white;
      box-shadow: 0 8px 20px rgba($primary, .3);
      transform: translateY(-1px);
    }
    &:hover svg { transform: translateX(3px); }
  }

  @media (max-width: 560px) {
    padding: 72px 0;
    &__viewport { --card-w: min(300px, 82vw); }
    &__card-title { font-size: 1rem; }

    &__controls {
      flex-direction: column;
      gap: 22px;
    }
    &__more { width: 100%; justify-content: center; }
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
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 24px;
  }

  &__header {
    text-align: center;
    margin-bottom: 56px;

    .section-sub { margin: 0 auto; }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  &__item {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 20px;
    padding: 30px 28px;
    border-radius: $radius-lg;
    background: $white;
    border: 1px solid $border;
    overflow: hidden;
    transition: $transition;

    // tanka gradijent linija na vrhu, pojavljuje se na hover
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
      border-color: rgba($primary,.35);
      box-shadow: $shadow-lg;
      transform: translateY(-4px);

      &::before { opacity: 1; }

      .benefits__item-icon {
        transform: scale(1.06) rotate(-3deg);
      }
    }
  }

  &__item-icon {
  flex: 0 0 54px;
  width: 54px;
  height: 54px;
  border-radius: 16px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 24px;
  line-height: 1;
  border: 1px solid rgba(0,0,0,0.05);

  transition: $transition;

  svg {
    width: 30px !important;
    height: 30px !important;
    display: block;
    stroke: currentColor;
    fill: none;
  }
}

  &__item-body {
    h4 {
      font-size: 1.06rem;
      font-weight: 700;
      letter-spacing: -.01em;
      color: $dark;
      margin-bottom: 6px;
    }

    p {
      font-size: .92rem;
      color: $mid;
      line-height: 1.65;
    }
  }

  @media (max-width: 640px) {
    &__grid { grid-template-columns: 1fr; }
    &__item { padding: 26px 22px; gap: 18px; }
  }
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

// ─── FOUNDING OFFER ──────────────────────────────────────
.offer {
  max-width: 560px;
  margin: 0 auto;

  &__panel {
    background: $dark;
    color: $white;
    border: 1px solid rgba($tr-blue, .4);
    border-radius: $radius-xl;
    padding: 40px 32px;
    text-align: center;
    box-shadow: $shadow-xl;
  }

  &__founder {
    display: inline-block;
    font-size: .72rem;
    font-weight: 800;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: $accent;
    background: rgba($accent, .12);
    border: 1px solid rgba($accent, .25);
    padding: 6px 14px;
    border-radius: 999px;
    margin-bottom: 24px;
  }

  &__price {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 10px;
    margin-bottom: 18px;
    flex-wrap: wrap;
  }

  &__price-old {
    font-size: 1.4rem;
    font-weight: 700;
    color: rgba($white, .4);
    text-decoration: line-through;
  }

  &__price-now {
    font-size: 3.2rem;
    font-weight: 900;
    letter-spacing: -.04em;
    color: $white;
    line-height: 1;
  }

  &__price-note {
    font-size: .9rem;
    color: rgba($white, .5);
  }

  &__desc {
    font-size: .92rem;
    color: rgba($white, .62);
    line-height: 1.7;
    max-width: 420px;
    margin: 0 auto 24px;
  }

  &__list {
    display: inline-flex;
    flex-direction: column;
    gap: 11px;
    text-align: left;
    margin: 0 auto 28px;

    li {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: .92rem;
      color: rgba($white, .82);

      svg { stroke: $accent; flex-shrink: 0; }
    }
  }

  &__cta {
    width: 100%;
    justify-content: center;
    background: $tr-blue;
    border-color: $tr-blue;
    color: $tr-white;
    box-shadow: 0 6px 22px rgba($tr-blue, .3);

    &:hover {
      background: $tr-blue-hover;
      border-color: $tr-blue-hover;
      box-shadow: 0 8px 26px rgba($tr-blue, .38);
      transform: translateY(-1px);
    }
  }

  &__small {
    margin-top: 16px;
    font-size: .8rem;
    color: rgba($white, .42);
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
.final-cta {
  position: relative;
  z-index: 0;
  isolation: isolate;
  display: block;
  width: 100%;
  clear: both;
  margin: 0;
  padding: 110px 0;
  overflow: hidden;
  background:
    radial-gradient(120% 115% at 50% -10%, $tr-bg-soft 0%, $tr-bg 58%, $tr-bg-deep 100%);

  // Isti tačkasti overlay kao u hero sekciji.
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    background-image: radial-gradient(rgba($tr-blue,.28) 1px, transparent 1px);
    background-size: 64px 64px;
    pointer-events: none;
  }

  &__blob { display: none; }

  &__container {
    max-width: 760px;
    margin: 0 auto;
    padding: 0 24px;
    position: relative;
    z-index: 1;
  }

  &__pitch { text-align: center; }

  &__offerbadge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 14px 7px 11px;
    border-radius: 999px;
    background: rgba($accent, .1);
    border: 1px solid rgba($accent, .26);
    color: #9fe8de;
    font-size: .76rem;
    font-weight: 700;
    margin-bottom: 26px;
  }

  &__offerbadge-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: $accent;
    box-shadow: 0 0 0 3px rgba($accent,.22);
  }

  &__title {
    font-size: clamp(2.4rem, 5.5vw, 4rem);
    font-weight: 900;
    color: $tr-white;
    letter-spacing: -.04em;
    line-height: 1.04;
    margin-bottom: 22px;
  }

  &__accent {
    background: linear-gradient(135deg, $tr-blue 0%, $tr-blue-hover 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  &__sub {
    font-size: 1.1rem;
    color: rgba($tr-white, .64);
    line-height: 1.65;
    max-width: 540px;
    margin: 0 auto 40px;
  }

  &__steps {
    list-style: none;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 14px 30px;
    margin: 0 0 44px;
    padding: 0;
  }

  &__step {
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  &__step-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid rgba($tr-blue,.4);
    background: rgba($tr-blue,.12);
    color: $tr-blue-hover;
    font-size: .76rem;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    flex-shrink: 0;
  }

  &__step-label {
    font-size: .96rem;
    font-weight: 600;
    color: rgba($tr-white,.82);
  }

  .btn--primary {
    background: $tr-blue;
    color: $tr-white;
    border-color: $tr-blue;
    box-shadow: 0 6px 22px rgba($tr-blue,.34);

    &:hover {
      background: $tr-blue-hover;
      border-color: $tr-blue-hover;
      box-shadow: 0 8px 26px rgba($tr-blue,.42);
      transform: translateY(-1px);
    }
  }

  &__or {
    margin: 18px 0 12px;
    font-size: .8rem;
    color: rgba($tr-white, .4);
    text-transform: uppercase;
    letter-spacing: .1em;
  }

  &__contacts {
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;

    .btn--ghost {
      background: rgba($tr-white, .07);
      color: $tr-white;
      border-color: rgba($tr-white, .16);
      backdrop-filter: blur(8px);

      &:hover {
        background: rgba($tr-white, .13);
        border-color: rgba($tr-white, .3);
        color: $tr-white;
        transform: translateY(-1px);
      }
    }
  }

  &__note {
    margin: 22px auto 0;
    font-size: .85rem;
    color: rgba($tr-white, .46);
    max-width: 460px;
  }

  @media (max-width: 600px) {
    padding: 84px 0;

    &__steps {
      flex-direction: column;
      align-items: center;
      gap: 14px;
    }

    &__primary { width: 100%; justify-content: center; }
    &__contacts .btn { flex: 1; justify-content: center; }
  }
}

// ─── FOOTER ──────────────────────────────────────────────
.footer {
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  clear: both;
  margin: 0;
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
    grid-template-columns: 1.6fr 1fr 1fr;
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

  &__cta-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 700;
    color: rgba($white,.7);
    transition: $transition;
    &:hover { color: $white; }
  }

  @media (max-width: 900px) {
    &__top { grid-template-columns: 1fr 1fr; gap: 36px; }
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
  .how, .features, .benefits, .pricing, .faq, .final-cta, .instagram { padding: 64px 0; }
}

@media (prefers-reduced-motion: reduce) {
  .examples__card:hover { transform: none; }
  .examples__card:hover .examples__card-stage img { transform: none; }
}

// ─── MID CTA BAND ────────────────────────────────────────
.cta-band {
  background: $light;
  padding: 8px 24px 48px;

  &__inner {
    max-width: 1040px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    flex-wrap: wrap;
    padding: 34px 32px;
    border-radius: $radius-xl;
    background: radial-gradient(120% 150% at 0% 0%, $tr-bg-soft 0%, $tr-bg 60%, $tr-bg-deep 100%);
    border: 1px solid rgba($tr-blue,.3);
    box-shadow: $shadow-lg;
  }

  &__text {
    h2 {
      margin: 0;
      font-size: clamp(1.25rem, 2.6vw, 1.7rem);
      font-weight: 800;
      letter-spacing: -.02em;
      color: $tr-white;
    }
    p {
      margin: 8px 0 0;
      font-size: .95rem;
      line-height: 1.6;
      color: rgba($tr-white,.62);
      max-width: 460px;
    }
  }

  &__cta {
    flex-shrink: 0;
    background: $tr-blue;
    border-color: $tr-blue;
    color: $tr-white;
    box-shadow: 0 6px 22px rgba($tr-blue,.34);

    &:hover {
      background: $tr-blue-hover;
      border-color: $tr-blue-hover;
      box-shadow: 0 8px 26px rgba($tr-blue,.42);
      transform: translateY(-1px);
    }
  }

  @media (max-width: 720px) {
    &__inner { padding: 26px 22px; }
    &__cta { width: 100%; justify-content: center; }
  }
}

// ─── STICKY MOBILE CTA ───────────────────────────────────
.sticky-cta {
  position: fixed;
  z-index: 1080;
  right: 16px;
  bottom: 16px;
  display: none;
  align-items: center;
  gap: 8px;
  padding: 13px 18px;
  border-radius: 999px;
  background: $tr-blue;
  color: $tr-white;
  font-size: .92rem;
  font-weight: 700;
  border: 1px solid rgba($tr-white,.14);
  box-shadow: 0 10px 28px rgba(0,0,0,.34), 0 4px 12px rgba($tr-blue,.4);
  transition: transform .3s cubic-bezier(.4,0,.2,1), opacity .3s ease;

  svg { flex-shrink: 0; }

  &--hidden {
    opacity: 0;
    transform: translateY(140%);
    pointer-events: none;
  }

  @media (max-width: 900px) {
    display: inline-flex;
  }
}

.logo32{
  width: 32px;
  height: 32px;
}
</style>