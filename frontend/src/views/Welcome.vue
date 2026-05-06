<template>
  <div v-if="tenantNotFound">
    Salon nije pronađen.
  </div>

  <main ref="topSection" class="welcome">
    <section class="welcome__hero">
      <img
        class="welcome__hero-image"
        src="../assets/img/stolica55.png"
        alt="Vintage barber chair"
      />

      <div class="welcome__hero-wash"></div>

      <header class="welcome__navbar">
        <button class="welcome-logo" type="button" @click="scrollToSection('top')">
          <span class="welcome-logo__mark">
            <svg viewBox="0 0 64 64" fill="none">
              <rect x="10" y="10" width="44" height="44" rx="16" />
              <path d="M20 42V23.5L32 35.5L44 23.5V42" />
              <path d="M24 46H40" />
            </svg>
          </span>

          <span class="welcome-logo__text">
            <strong>Test Studio</strong>
            <small>Premium Barber</small>
          </span>
        </button>

        <button
          class="welcome-menu-button"
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
        <Transition name="menu-fade">
          <div
            v-if="menuOpen"
            class="welcome-menu-backdrop"
            @click="closeMenu"
          ></div>
        </Transition>

        <Transition name="menu-slide">
          <aside v-if="menuOpen" class="welcome-menu">
            <div class="welcome-menu__head">
              <div class="welcome-menu__logo">
                <span class="welcome-menu__logo-mark">
                  <svg viewBox="0 0 64 64" fill="none">
                    <rect x="10" y="10" width="44" height="44" rx="16" />
                    <path d="M20 42V23.5L32 35.5L44 23.5V42" />
                    <path d="M24 46H40" />
                  </svg>
                </span>

                <div>
                  <strong>Milan Studio</strong>
                  <small>Premium Barber</small>
                </div>
              </div>

              <button
                type="button"
                class="welcome-menu__close"
                aria-label="Zatvori meni"
                @click="closeMenu"
              >
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <nav class="welcome-menu__nav">
              <button type="button" @click="scrollToSection('top')">
                Početna
              </button>

              <button type="button" @click="scrollToSection('studio')">
                Studio prostor
              </button>

              <button type="button" @click="scrollToSection('prices')">
                Cenovnik
              </button>

              <button type="button" @click="scrollToSection('team')">
                Naš tim
              </button>

              <button type="button" @click="scrollToSection('hours')">
                Radno vreme
              </button>

              <button type="button" class="welcome-menu__cta" @click="goToBooking">
                Zakaži termin
              </button>
            </nav>
          </aside>
        </Transition>
      </Teleport>

      <div class="welcome__intro">
        <p>Dobrodošli!</p>

        <h1>
          Tvoj termin,<br />
          tvoj stil.
        </h1>

        <span>
          Kvalitetna usluga. Lični pristup.<br />
          Uvek na vreme.
        </span>
      </div>
    </section>

    <section class="welcome__body">
      <div class="welcome__content-wrap">
        <div class="welcome-booking-wrapper">
          <button class="welcome__booking" type="button" @click="goToBooking">
            <span class="welcome__booking-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path d="M6.75 3v2.25M17.25 3v2.25M3.75 8.25h16.5M5.25 5.25h13.5A1.5 1.5 0 0 1 20.25 6.75v12A1.5 1.5 0 0 1 18.75 20.25H5.25A1.5 1.5 0 0 1 3.75 18.75v-12A1.5 1.5 0 0 1 5.25 5.25Z" />
                <path d="m9.25 14.25 1.75 1.75 3.75-4.25" />
              </svg>
            </span>

            <span class="welcome__booking-text">
              <strong>Rezerviši termin</strong>
              <small>Online zakazivanje</small>
            </span>

            <span class="welcome__booking-arrow">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </button>
        </div>

        <div class="welcome__features">
          <article class="welcome__feature">
            <span class="welcome__feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path d="M6.75 3v2.25M17.25 3v2.25M3.75 8.25h16.5M5.25 5.25h13.5A1.5 1.5 0 0 1 20.25 6.75v12A1.5 1.5 0 0 1 18.75 20.25H5.25A1.5 1.5 0 0 1 3.75 18.75v-12A1.5 1.5 0 0 1 5.25 5.25Z" />
                <path d="m9.25 14.25 1.75 1.75 3.75-4.25" />
              </svg>
            </span>

            <div class="welcome__feature-copy">
              <h3>Online zakazivanje</h3>
              <p>Rezerviši termin brzo i jednostavno.</p>
            </div>
          </article>

          <article class="welcome__feature">
            <span class="welcome__feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path d="M12 6v6h4.5" />
                <path d="M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0Z" />
              </svg>
            </span>

            <div class="welcome__feature-copy">
              <h3>Bez čekanja</h3>
              <p>Dolaziš tačno u svom terminu.</p>
            </div>
          </article>
        </div>
      </div>

      <div ref="studioSection" class="carousel-section">
        <div class="welcome__content-wrap">
          <div class="carousel-section__head">
            <span>Studio prostor</span>
            <p>Atmosfera studija pre dolaska.</p>
          </div>
        </div>

        <Carousel />
      </div>

      <div class="separation-bg">
        <div class="welcome__content-wrap">
          <section ref="pricesSection" class="welcome__prices">
            <div class="welcome__prices-head">
              <span class="welcome__prices-label">Cenovnik</span>
            </div>

            <div class="welcome__prices-accent"></div>

            <div class="welcome__prices-list">
              <div class="welcome__price-item">
                <span class="welcome__price-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path d="m7.848 8.25 1.536.887M7.848 8.25a3 3 0 1 1-5.196-3 3 3 0 0 1 5.196 3Zm1.536.887 2.077 1.199M7.848 15.75l1.536-.887M7.848 15.75a3 3 0 1 1-5.196 3 3 3 0 0 1 5.196-3Zm1.536-.887 2.077-1.199" />
                    <path d="M14.343 12 22.137 7.5l-.803-.215a4.5 4.5 0 0 0-2.48.044l-5.325 1.628a4.323 4.323 0 0 0-2.068 1.379M14.343 12l7.794 4.5-.802.215a4.5 4.5 0 0 1-2.48-.043l-5.326-1.629a4.324 4.324 0 0 1-2.068-1.379M14.343 12l-2.882-1.664M14.343 12l-2.882 1.664" />
                  </svg>
                </span>

                <span class="welcome__price-name">Muško šišanje</span>
                <strong>800 RSD</strong>
              </div>

              <div class="welcome__price-item">
                <span class="welcome__price-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path d="M4.5 19.5 19.5 4.5" />
                    <path d="M7 17h10" />
                    <path d="M8.5 14.5h7" />
                    <path d="M10 12h4" />
                    <path d="M5.5 8.5c2.4-2.1 5.3-3.1 8.7-3" />
                  </svg>
                </span>

                <span class="welcome__price-name">Fade / Skin Fade</span>
                <strong>1000 RSD</strong>
              </div>

              <div class="welcome__price-item">
                <span class="welcome__price-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path d="M7.5 4.5v6.75a4.5 4.5 0 0 0 9 0V4.5" />
                    <path d="M9.75 4.5v6.75a2.25 2.25 0 0 0 4.5 0V4.5" />
                    <path d="M12 15.75v3.75" />
                    <path d="M8.5 19.5h7" />
                  </svg>
                </span>

                <span class="welcome__price-name">Sređivanje brade</span>
                <strong>500 RSD</strong>
              </div>

              <div class="welcome__price-item">
                <span class="welcome__price-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path d="M6.5 7.5h11" />
                    <path d="M8 7.5v9a4 4 0 0 0 8 0v-9" />
                    <path d="M9.5 4.5h5" />
                    <path d="M12 4.5v-2" />
                    <path d="M7 20.5h10" />
                  </svg>
                </span>

                <span class="welcome__price-name">Šišanje + brada</span>
                <strong>1200 RSD</strong>
              </div>
            </div>
          </section>
        </div>

        <section ref="teamSection" class="studio-team">
          <div class="studio-team__separator">
            <span class="studio-team__kicker">Frizeri studija</span>
            <h2>Naš tim</h2>
            <p>Četiri stila, jedan standard rada.</p>
          </div>

          <div class="welcome__content-wrap">
            <div class="studio-team__grid">
              <article class="team-card">
                <div class="team-card__image">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=85"
                    alt="Milan Petrović"
                  />
                </div>

                <div class="team-card__body">
                  <h3>Milan Petrović</h3>
                  <p>Senior frizer</p>

                  <div class="team-card__tags">
                    <span>Fade</span>
                    <span>Brada</span>
                  </div>
                </div>
              </article>

              <article class="team-card">
                <div class="team-card__image">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=85"
                    alt="Nikola Jovanović"
                  />
                </div>

                <div class="team-card__body">
                  <h3>Nikola Jovanović</h3>
                  <p>Fade specijalista</p>

                  <div class="team-card__tags">
                    <span>Skin fade</span>
                    <span>Taper</span>
                  </div>
                </div>
              </article>

              <article class="team-card">
                <div class="team-card__image">
                  <img
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=85"
                    alt="Stefan Ilić"
                  />
                </div>

                <div class="team-card__body">
                  <h3>Stefan Ilić</h3>
                  <p>Muški stilista</p>

                  <div class="team-card__tags">
                    <span>Stilizovanje</span>
                    <span>Tekstura</span>
                  </div>
                </div>
              </article>

              <article class="team-card">
                <div class="team-card__image">
                  <img
                    src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=700&q=85"
                    alt="Marko Savić"
                  />
                </div>

                <div class="team-card__body">
                  <h3>Marko Savić</h3>
                  <p>Klasični barber</p>

                  <div class="team-card__tags">
                    <span>Makaze</span>
                    <span>Brijanje</span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <div ref="hoursSection" class="welcome__content-wrap">
          <section class="visit-info">
            <div class="visit-info__head">
              <span class="visit-info__label">Radno vreme</span>
            </div>

            <div class="visit-info__accent"></div>

            <div class="visit-info__list">
              <div class="visit-row">
                <span>Ponedeljak</span>
                <strong>09:00 - 19:00</strong>
              </div>

              <div class="visit-row">
                <span>Utorak - Petak</span>
                <strong>09:00 - 19:00</strong>
              </div>

              <div class="visit-row">
                <span>Subota</span>
                <strong>09:00 - 15:00</strong>
              </div>

              <div class="visit-row visit-row--muted">
                <span>Nedelja</span>
                <strong>Zatvoreno</strong>
              </div>
            </div>
          </section>

          <section class="visit-contact">
            <span class="visit-contact__icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path d="M15 10.5a3 3 0 1 1-6 0a3 3 0 0 1 6 0Z" />
                <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
            </span>

            <div class="visit-contact__copy">
              <strong>Naziv ulice 17, Jagodina</strong>
              <small>Dača Barber Studio</small>
            </div>

            <a class="visit-contact__button" href="tel:+381600000000">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>

              Pozovi nas
            </a>
          </section>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Carousel from "../components/Carousel.vue";

const apiBase = import.meta.env.VITE_API_BASE || "/api";

const router = useRouter();
const route = useRoute();

const tenantSlug = computed(() => String(route.params.tenantSlug));

const tenantNotFound = ref(false);
const menuOpen = ref(false);

const topSection = ref<HTMLElement | null>(null);
const studioSection = ref<HTMLElement | null>(null);
const pricesSection = ref<HTMLElement | null>(null);
const teamSection = ref<HTMLElement | null>(null);
const hoursSection = ref<HTMLElement | null>(null);

let scrollY = 0;

function lockPageScroll() {
  scrollY = window.scrollY;

  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
}

function unlockPageScroll() {
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";

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

function scrollToSection(section: "top" | "studio" | "prices" | "team" | "hours") {
  const sectionMap = {
    top: topSection.value,
    studio: studioSection.value,
    prices: pricesSection.value,
    team: teamSection.value,
    hours: hoursSection.value,
  };

  closeMenu();

  requestAnimationFrame(() => {
    sectionMap[section]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

function goToBooking() {
  closeMenu();

  router.push({
    name: "Home",
    params: {
      tenantSlug: tenantSlug.value,
    },
  });
}

async function fetchTenant() {
  try {
    const res = await fetch(`${apiBase}/tenants/by-slug/${tenantSlug.value}`);

    if (res.status === 404) {
      router.replace("/404");
      return;
    }

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    await res.json();
  } catch (error) {
    console.error("Failed to fetch tenant:", error);
    router.replace("/404");
  }
}

onMounted(fetchTenant);

onBeforeUnmount(() => {
  unlockPageScroll();
});
</script>

<style scoped lang="scss">
.welcome {
  min-height: 100vh;
  color: #102438;
  overflow-x: hidden;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif;
  background-color: rgb(251, 252, 254);
  scroll-behavior: smooth;
}

.welcome,
.welcome * {
  box-sizing: border-box;
}

.welcome svg,
.welcome-menu svg,
.welcome-menu-backdrop svg {
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.welcome__content-wrap {
  padding: 0 16px;
}

.welcome__hero {
  position: relative;
  z-index: 1;
  min-height: 380px;
  padding: 14px 16px 0;
  overflow: hidden;
}

.welcome__hero-image {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 420px;
  object-fit: cover;
  object-position: 70% center;
  opacity: 1;
  filter: saturate(0.9);
  margin-left: 80px;
}

.welcome__hero-wash {
  position: absolute;
  inset: 0;
  z-index: 2;
  background:
    linear-gradient(
      90deg,
      rgba(251, 252, 254, 1) 0%,
      rgba(251, 252, 254, 1) 40%,
      rgba(251, 252, 254, 0.82) 55%,
      rgba(251, 252, 254, 0) 65%
    ),
    linear-gradient(
      0deg,
      rgba(251, 252, 254, 1) 0%,
      rgba(251, 252, 254, 0.62) 10%,
      rgba(251, 252, 254, 0) 13%,
      rgba(251, 252, 254, 0) 65%
    );
}

/* NAVBAR + MENU */

.welcome__navbar {
  position: relative;
  z-index: 50;

  min-height: 60px;
  padding: 10px 20px;
  // border-radius: 22px;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 11px;

  background: #f4f6f9;

  box-shadow:
    0 8px 22px rgba(22, 34, 52, 0.055),
    0 1px 2px rgba(22, 34, 52, 0.03),
    inset 0 1px 0 rgba(255, 255, 255, 0.92),
    inset 0 0 0 1px rgba(64, 93, 122, 0.045);
}

.welcome-menu-button {
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 15px;
  padding: 0;
  flex: 0 0 44px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;

  color: #102438;
  background: #ffffff;

  box-shadow:
    inset 0 0 0 1px rgba(64, 93, 122, 0.055),
    inset 0 1px 0 rgba(255, 255, 255, 0.94);

  -webkit-tap-highlight-color: transparent;

  span {
    width: 18px;
    height: 2px;
    border-radius: 999px;
    background: #102438;
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

.welcome-logo {
  min-width: 0;
  border: 0;
  padding: 0;
  background: transparent;

  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 9px;

  -webkit-tap-highlight-color: transparent;
}

.welcome-logo__mark {
  width: 40px;
  height: 40px;
  border-radius: 16px;
  flex: 0 0 40px;

  display: grid;
  place-items: center;

  color: #86add2;
  background: linear-gradient(180deg, #2a2f3a 0%, #171b24 100%);

  box-shadow:
    0 3px 8px rgba(23, 27, 36, 0.13),
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    inset 0 0 0 1px rgba(255, 255, 255, 0.06);

  svg {
    width: 25px;
    height: 25px;
    display: block;
    stroke: currentColor;
    stroke-width: 2.6;
  }
}

.welcome-logo__text {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;

  strong {
    color: #102438;
    font-size: 15px;
    line-height: 1;
    font-weight: 860;
    letter-spacing: -0.055em;
    white-space: nowrap;
  }

  small {
    margin-top: 5px;
    color: rgba(16, 36, 56, 0.58);
    font-size: 8.5px;
    line-height: 1;
    font-weight: 850;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    white-space: nowrap;
  }
}

.welcome-menu-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2147483600;
  background: rgba(11, 15, 21, 0.7);
}

.welcome-menu {
  position: fixed;
  z-index: 2147483601;
  top: 0;
  right: 0;
  width: min(100vw, 350px);
  height: 100dvh;
  padding: 22px 18px calc(22px + env(safe-area-inset-bottom));

  background:
    radial-gradient(circle at 100% 0%, rgba(134, 173, 210, 0.14) 0%, transparent 34%),
    linear-gradient(180deg, #ffffff 0%, #f5f8fb 100%);

  box-shadow:
    -22px 0 44px rgba(12, 18, 28, 0.18),
    inset 1px 0 0 rgba(64, 93, 122, 0.06);

  display: flex;
  flex-direction: column;
}

.welcome-menu__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 30px;
}

.welcome-menu__logo {
  display: flex;
  align-items: center;
  gap: 11px;
}

.welcome-menu__logo-mark {
  width: 46px;
  height: 46px;
  border-radius: 17px;

  display: grid;
  place-items: center;

  color: #86add2;
  background: linear-gradient(180deg, #2a2f3a 0%, #171b24 100%);

  box-shadow:
    0 4px 10px rgba(23, 27, 36, 0.14),
    0 1px 3px rgba(23, 27, 36, 0.07),
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    inset 0 0 0 1px rgba(255, 255, 255, 0.06);

  svg {
    width: 28px;
    height: 28px;
    display: block;
    stroke: currentColor;
    stroke-width: 2.6;
  }
}

.welcome-menu__logo {
  strong {
    display: block;
    color: #102438;
    font-size: 20px;
    line-height: 1;
    font-weight: 860;
    letter-spacing: -0.06em;
  }

  small {
    display: block;
    margin-top: 6px;
    color: rgba(16, 36, 56, 0.58);
    font-size: 10px;
    line-height: 1;
    font-weight: 850;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }
}

.welcome-menu__close {
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 50%;
  padding: 0;
  flex: 0 0 40px;

  display: grid;
  place-items: center;

  color: #405d7a;
  background: #f1f4f7;

  svg {
    width: 20px;
    height: 20px;
    display: block;
    stroke: currentColor;
    stroke-width: 2.4;
  }
}

.welcome-menu__nav {
  display: grid;
  gap: 9px;

  button {
    width: 100%;
    min-height: 50px;
    border: 0;
    border-radius: 18px;
    padding: 0 14px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    color: #102438;
    background: rgba(255, 255, 255, 0.7);

    font-size: 15px;
    font-weight: 760;
    letter-spacing: -0.035em;
    text-align: left;

    box-shadow:
      inset 0 0 0 1px rgba(64, 93, 122, 0.055),
      inset 0 1px 0 rgba(255, 255, 255, 0.94);
  }

  .welcome-menu__cta {
    margin-top: 8px;
    color: #ffffff;
    background:
      radial-gradient(circle at 16% 0%, rgba(255, 255, 255, 0.075), transparent 34%),
      linear-gradient(180deg, #171d25 0%, #111821 100%);

    box-shadow:
      0 9px 16px rgba(5, 8, 12, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.12),
      inset 0 0 0 1px rgba(255, 255, 255, 0.055);
  }
}

.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.22s ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
}

.menu-slide-enter-active,
.menu-slide-leave-active {
  transition: transform 0.34s cubic-bezier(0.22, 1, 0.36, 1);
}

.menu-slide-enter-from,
.menu-slide-leave-to {
  transform: translateX(100%);
}

/* HERO COPY */

.welcome__intro {
  position: relative;
  z-index: 3;
  margin-top: 120px;
  padding-left: 4px;

  p {
    margin: 0 0 10px;
    color: #64809c;
    font-size: 16px;
    line-height: 1.2;
    font-weight: 720;
    letter-spacing: -0.03em;
  }

  h1 {
    max-width: 260px;
    margin: 0;
    color: #0d2135;
    font-size: 31px;
    line-height: 0.98;
    font-weight: 880;
    letter-spacing: -0.055em;
  }

  span {
    display: block;
    margin-top: 12px;
    color: rgba(36, 53, 72, 0.56);
    font-size: 13px;
    line-height: 1.36;
    font-weight: 620;
    letter-spacing: -0.02em;
  }
}

.welcome__body {
  position: relative;
  z-index: 10;
  max-width: 520px;
  margin: -45px auto 0;
  padding: 0 0 38px;
}

/* QUICK BOOK */

.welcome-booking-wrapper {
  border-radius: 30px;
  padding: 10px;

  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.34), rgba(255, 255, 255, 0.12));

  box-shadow:
    0 14px 24px rgba(12, 18, 28, 0.12),
    0 4px 10px rgba(12, 18, 28, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.44),
    inset 0 -1px 0 rgba(255, 255, 255, 0.16),
    inset 0 0 0 1px rgba(255, 255, 255, 0.2);

  backdrop-filter: blur(14px) saturate(130%);

  margin: 0 20px;
}

.welcome__booking {
  position: relative;
  z-index: 20;
  width: 100%;
  min-height: 78px;
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  border: 0;
  border-radius: 23px;
  padding: 14px 14px 14px 15px;

  background:
    radial-gradient(circle at 16% 0%, rgba(255, 255, 255, 0.075), transparent 34%),
    linear-gradient(180deg, #171d25 0%, #111821 100%);

  box-shadow:
    0 9px 16px rgba(5, 8, 12, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    inset 0 -1px 0 rgba(0, 0, 0, 0.22),
    inset 0 0 0 1px rgba(255, 255, 255, 0.055);

  transition:
    transform 0.14s ease,
    box-shadow 0.14s ease;

  -webkit-tap-highlight-color: transparent;
}

.welcome__booking:active {
  transform: scale(0.975);
}

.welcome__booking-icon {
  width: 42px;
  height: 42px;
  border-radius: 16px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #9fc2e2;
  background: rgba(255, 255, 255, 0.07);

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.105),
    inset 0 0 0 1px rgba(255, 255, 255, 0.055);

  svg {
    width: 26px;
    height: 26px;
    stroke-width: 2.2;
  }
}

.welcome__booking-text {
  min-width: 0;
  text-align: left;

  strong {
    display: block;
    color: #ffffff;
    font-size: 17px;
    line-height: 1.08;
    font-weight: 740;
    letter-spacing: -0.045em;
  }

  small {
    display: block;
    margin-top: 5px;
    color: rgba(255, 255, 255, 0.62);
    font-size: 12px;
    line-height: 1.2;
    font-weight: 520;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.welcome__booking-arrow {
  min-height: 42px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 99px;
  padding: 0 14px;

  background: linear-gradient(180deg, #6f87a3 0%, #506c8c 100%);
  color: #ffffff;

  font-size: 13px;
  font-weight: 720;
  letter-spacing: -0.015em;
  white-space: nowrap;

  svg {
    width: 17px;
    height: 17px;
    stroke-width: 2.2;
  }
}

/* FEATURES */

.welcome__features {
  position: relative;
  width: 100%;
  margin-top: 34px;
  padding: 20px 0;

  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  background: transparent;
  border-top: 1px solid rgba(80, 108, 140, 0.08);
  border-bottom: 1px solid rgba(80, 108, 140, 0.08);

  &::before {
    content: "";
    position: absolute;
    top: 20px;
    bottom: 20px;
    left: 50%;
    width: 1px;
    transform: translateX(-0.5px);

    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(80, 108, 140, 0.13) 18%,
      rgba(80, 108, 140, 0.16) 50%,
      rgba(80, 108, 140, 0.13) 82%,
      transparent 100%
    );
  }
}

.welcome__feature {
  min-width: 0;
  min-height: 104px;
  padding: 4px 14px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background: transparent;
  border: 0;
  box-shadow: none;
}

.welcome__feature-icon {
  width: 42px;
  height: 42px;
  margin-bottom: 13px;
  border-radius: 50%;

  display: grid;
  place-items: center;

  color: #4f78a3;
  background: #f1f4f7;

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.92),
    inset 0 0 0 1px rgba(64, 93, 122, 0.055);

  svg {
    width: 22px;
    height: 22px;
    display: block;
    stroke-width: 2.15;
  }
}

.welcome__feature-copy {
  text-align: center;

  h3 {
    max-width: 128px;
    margin: 0 auto 6px;
    color: #102438;
    font-size: 14px;
    line-height: 1.12;
    font-weight: 820;
    letter-spacing: -0.045em;
  }

  p {
    max-width: 134px;
    margin: 0 auto;
    color: rgba(42, 58, 78, 0.52);
    font-size: 11px;
    line-height: 1.32;
    font-weight: 600;
    letter-spacing: -0.018em;
  }
}

/* CAROUSEL */

.carousel-section {
  margin-top: 34px;
  scroll-margin-top: 18px;
}

.carousel-section__head {
  padding-bottom: 12px;
  text-align: center;

  span {
    display: block;
    color: #64809c;
    font-size: 11px;
    line-height: 1;
    font-weight: 820;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  p {
    margin: 7px auto 0;
    color: rgba(16, 36, 56, 0.48);
    font-size: 13px;
    line-height: 1.35;
    font-weight: 600;
    letter-spacing: -0.02em;
  }
}

/* WHITE CONTENT AREA */

.separation-bg {
  margin-top: 16px;
  background: #ffffff;
}

/* PRICES */

.welcome__prices {
  padding: 30px 0 42px;
  scroll-margin-top: 18px;
  background: #ffffff;
}

.welcome__prices-head,
.visit-info__head {
  margin-bottom: 14px;
}

.welcome__prices-label,
.visit-info__label {
  display: block;

  color: #64809c;
  font-size: 13px;
  line-height: 1;
  font-weight: 850;
  letter-spacing: 0.21em;
  text-transform: uppercase;
}

.welcome__prices-accent,
.visit-info__accent {
  width: 42px;
  height: 3px;
  margin: 0 0 20px;
  border-radius: 99px;

  background: linear-gradient(90deg, #405d7a 0%, #86add2 100%);
}

.welcome__prices-list,
.visit-info__list {
  padding: 2px 0;
  background: #ffffff;
}

.welcome__price-item {
  position: relative;
  min-height: 68px;
  display: grid;
  grid-template-columns: 42px minmax(0, auto) 1fr auto;
  align-items: center;
  gap: 11px;
  padding: 14px 0;
}

.welcome__price-item::before {
  content: "";
  position: absolute;
  left: 53px;
  right: 0;
  bottom: 0;
  height: 1px;

  background: repeating-linear-gradient(
    90deg,
    rgba(80, 108, 140, 0.13) 0 4px,
    transparent 4px 9px
  );
}

.welcome__price-icon {
  order: 1;
  width: 42px;
  height: 42px;
  border-radius: 15px;

  display: grid;
  place-items: center;

  color: #4f78a3;
  background: linear-gradient(180deg, #f4f7fa 0%, #edf3f7 100%);

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.94),
    inset 0 0 0 1px rgba(64, 93, 122, 0.065);

  svg {
    width: 21px;
    height: 21px;
    display: block;
    stroke-width: 1.8;
  }
}

.welcome__price-name {
  order: 2;
  min-width: 0;
  color: #102438;
  font-size: 15px;
  line-height: 1.15;
  font-weight: 760;
  letter-spacing: -0.045em;
  white-space: nowrap;
}

.welcome__price-item::after {
  order: 3;
  content: "";
  width: 100%;
  min-width: 16px;
  height: 1px;
  transform: translateY(3px);

  background: repeating-linear-gradient(
    90deg,
    rgba(80, 108, 140, 0.2) 0 4px,
    transparent 4px 9px
  );
}

.welcome__price-item strong {
  order: 4;
  color: #4f78a3;
  font-size: 15px;
  line-height: 1;
  font-weight: 900;
  letter-spacing: -0.045em;
  text-align: right;
  white-space: nowrap;
}

.visit-row {
  position: relative;
  min-height: 58px;
  display: grid;
  grid-template-columns: minmax(0, auto) 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
}

.visit-row::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;

  background: repeating-linear-gradient(
    90deg,
    rgba(80, 108, 140, 0.13) 0 4px,
    transparent 4px 9px
  );
}

.visit-row span {
  order: 1;
  color: #102438;
  font-size: 15px;
  font-weight: 760;
  letter-spacing: -0.045em;
  white-space: nowrap;
}

.visit-row::after {
  order: 2;
  content: "";
  width: 100%;
  min-width: 16px;
  height: 1px;
  transform: translateY(3px);

  background: repeating-linear-gradient(
    90deg,
    rgba(80, 108, 140, 0.2) 0 4px,
    transparent 4px 9px
  );
}

.visit-row strong {
  order: 3;
  color: #4f78a3;
  font-size: 15px;
  line-height: 1;
  font-weight: 900;
  letter-spacing: -0.045em;
  text-align: right;
  white-space: nowrap;
}

.visit-row--muted span {
  color: rgba(16, 36, 56, 0.46);
}

.visit-row--muted strong {
  color: rgba(16, 36, 56, 0.42);
}

/* STUDIO TIM */

.studio-team {
  padding: 30px 0 80px;
  scroll-margin-top: 18px;
}

.studio-team__separator {
  position: relative;
  overflow: hidden;
  text-align: center;
  padding: 22px 20px 24px;
  margin-bottom: 28px;

  background:
    radial-gradient(circle at 92% 10%, rgba(134, 173, 210, 0.14) 0%, transparent 32%),
    linear-gradient(180deg, #f3f7fa 0%, #e8eff5 100%);

  border: 0;
  box-shadow: none;
}

.studio-team__kicker {
  display: block;
  margin-bottom: 8px;

  color: #64809c;
  font-size: 10px;
  line-height: 1;
  font-weight: 820;
  letter-spacing: 0.25em;
  text-transform: uppercase;
}

.studio-team__separator h2 {
  margin: 0;
  color: #102438;
  font-size: 23px;
  line-height: 1;
  font-weight: 820;
  letter-spacing: 0.035em;
}

.studio-team__separator p {
  margin: 8px auto 0;
  color: rgba(16, 36, 56, 0.52);
  font-size: 13px;
  line-height: 1.35;
  font-weight: 620;
  letter-spacing: -0.02em;
}

.studio-team__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px 12px;
}

.team-card {
  overflow: hidden;
  border-radius: 24px;
  background: #ffffff;

  box-shadow:
    0 8px 22px rgba(22, 34, 52, 0.055),
    0 1px 2px rgba(22, 34, 52, 0.035),
    inset 0 1px 0 rgba(255, 255, 255, 0.94);

  border: 1px solid rgba(64, 93, 122, 0.055);
}

.team-card__image {
  height: 138px;
  overflow: hidden;
  border-radius: 24px 24px 16px 16px;
  background: #edf2f6;

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center top;
  }
}

.team-card__body {
  padding: 12px 11px 13px;

  h3 {
    margin: 0;
    color: #102438;
    font-size: 14px;
    line-height: 1.05;
    font-weight: 820;
    letter-spacing: -0.055em;
  }

  p {
    margin: 5px 0 0;
    color: rgba(16, 36, 56, 0.48);
    font-size: 11px;
    line-height: 1.2;
    font-weight: 620;
    letter-spacing: -0.015em;
  }
}

.team-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 11px;

  span {
    min-height: 24px;
    padding: 0 8px;
    border-radius: 999px;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    color: rgba(16, 36, 56, 0.62);
    background: linear-gradient(180deg, #f5f8fb 0%, #edf3f7 100%);

    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.92),
      inset 0 0 0 1px rgba(64, 93, 122, 0.07);

    font-size: 10px;
    font-weight: 720;
    letter-spacing: -0.02em;
  }
}

/* VISIT INFO */

.visit-info {
  padding: 2px 0 4px;
  scroll-margin-top: 18px;
  background: #ffffff;
}

/* CONTACT HORIZONTAL CARD */

.visit-contact {
  margin-top: 20px;
  margin-bottom: 38px;
  min-height: 76px;
  padding: 13px;
  border-radius: 25px;

  display: grid;
  grid-template-columns: 46px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;

  background:
    radial-gradient(circle at 92% 0%, rgba(134, 173, 210, 0.13) 0%, transparent 34%),
    linear-gradient(180deg, #f5f8fb 0%, #eef4f8 100%);

  border: 1px solid rgba(64, 93, 122, 0.075);

  box-shadow:
    0 8px 20px rgba(22, 34, 52, 0.045),
    0 1px 2px rgba(22, 34, 52, 0.025),
    inset 0 1px 0 rgba(255, 255, 255, 0.96);
}

.visit-contact__icon {
  width: 46px;
  height: 46px;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #4f78a3;
  background: #ffffff;
  box-shadow:
    inset 0 0 0 1px rgba(64, 93, 122, 0.055);

  svg {
    width: 22px;
    height: 22px;
    stroke-width: 2.2;
  }
}

.visit-contact__copy {
  min-width: 0;

  strong {
    display: block;
    color: #102438;
    font-size: 14px;
    line-height: 1.15;
    font-weight: 780;
    letter-spacing: -0.04em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  small {
    display: block;
    margin-top: 5px;
    color: rgba(16, 36, 56, 0.48);
    font-size: 12px;
    line-height: 1;
    font-weight: 620;
    letter-spacing: -0.02em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.visit-contact__button {
  min-height: 40px;
  padding: 0 12px;
  border-radius: 999px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  color: #405d7a;
  text-decoration: none;
  background: #ffffff;
  box-shadow:
    inset 0 0 0 1px rgba(64, 93, 122, 0.06);

  font-size: 13px;
  font-weight: 760;
  letter-spacing: -0.02em;
  white-space: nowrap;

  svg {
    width: 16px;
    height: 16px;
    stroke-width: 2.2;
  }
}

.welcome__prices-list .welcome__price-item:last-child::before,
.visit-info__list .visit-row:last-child::before {
  display: none !important;
  content: none !important;
  background: none !important;
}
</style>