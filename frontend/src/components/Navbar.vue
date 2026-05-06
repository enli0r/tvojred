<template>
  <section class="navbar-hero">
    <nav class="navbar-top" aria-label="Navigacija">
      <button class="nav-back" type="button" @click="back" aria-label="Nazad na početnu">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <button class="nav-info" type="button" @click="openServices">
        Cenovnik
      </button>
    </nav>

    <div class="hero-intro">
      <h1>Rezervacija na klik.</h1>
      <p>Izaberi termin koji ti najviše odgovara.</p>
    </div>

    <button
      v-if="showQuickBooking || loadingQuickBooking"
      class="quick-card"
      :class="{ 'quick-card--loading': loadingQuickBooking }"
      type="button"
      aria-label="Rezerviši najraniji slobodan termin"
      :disabled="loadingQuickBooking"
      @click="!loadingQuickBooking && $emit('quick-book')"
    >
      <div class="quick-card-wrap">
        <template v-if="loadingQuickBooking">
          <div class="quick-card__top">
            <span>Najraniji slobodan termin</span>
          </div>

          <div class="quick-card__main">
            <div class="quick-card__loading-copy">
              <div class="quick-skeleton quick-skeleton--time"></div>

              <div class="quick-card__loading-meta">
                <div class="quick-skeleton quick-skeleton--meta"></div>
                <div class="quick-skeleton quick-skeleton--meta-small"></div>
              </div>
            </div>

            <span class="quick-card__button quick-card__button--loading">
              <div class="quick-skeleton quick-skeleton--button"></div>
            </span>
          </div>
        </template>

        <template v-else>
          <div class="quick-card__top">
            <span>Najraniji slobodan termin</span>
          </div>

          <div class="quick-card__main">
            <div>
              <strong>{{ quickBookingTime }}</strong>

              <p>
                <span class="quick-card__meta-item">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>

                  {{ quickBookingBarberName }}
                </span>

                <span class="quick-card__meta-item">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                    />
                  </svg>

                  {{ quickBookingDateLabel }}
                </span>
              </p>
            </div>

            <span class="quick-card__button">
              Zakaži

              <svg viewBox="0 0 24 24" fill="none">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                />
              </svg>
            </span>
          </div>
        </template>
      </div>
    </button>

    <Teleport to="body">
      <Transition name="services-fade">
        <div
          v-if="servicesOpen"
          class="services-overlay"
          @click="closeServices"
        ></div>
      </Transition>

      <Transition name="services-sheet">
        <section
          v-if="servicesOpen"
          class="services-popup"
          role="dialog"
          aria-modal="true"
          aria-label="Usluge studija"
        >
          <div class="services-popup__handle"></div>

          <header class="services-popup__head">
            <div>
              <span>Usluge studija</span>
              <h2>Cenovnik</h2>
            </div>

            <button
              type="button"
              class="services-popup__close"
              aria-label="Zatvori"
              @click="closeServices"
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6l12 12M18 6 6 18"
                  stroke="currentColor"
                  stroke-width="2.1"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </header>

          <div class="services-popup__accent"></div>

          <div class="services-list">
            <article class="service-row">
              <span class="service-row__icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path d="m7.848 8.25 1.536.887M7.848 8.25a3 3 0 1 1-5.196-3 3 3 0 0 1 5.196 3Zm1.536.887 2.077 1.199M7.848 15.75l1.536-.887M7.848 15.75a3 3 0 1 1-5.196 3 3 3 0 0 1 5.196-3Zm1.536-.887 2.077-1.199" />
                  <path d="M14.343 12 22.137 7.5l-.803-.215a4.5 4.5 0 0 0-2.48.044l-5.325 1.628a4.323 4.323 0 0 0-2.068 1.379M14.343 12l7.794 4.5-.802.215a4.5 4.5 0 0 1-2.48-.043l-5.326-1.629a4.324 4.324 0 0 1-2.068-1.379M14.343 12l-2.882-1.664M14.343 12l-2.882 1.664" />
                </svg>
              </span>

              <span class="service-row__name">Muško šišanje</span>
              <strong>800 RSD</strong>
            </article>

            <article class="service-row">
              <span class="service-row__icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path d="M4.5 19.5 19.5 4.5" />
                  <path d="M7 17h10" />
                  <path d="M8.5 14.5h7" />
                  <path d="M10 12h4" />
                  <path d="M5.5 8.5c2.4-2.1 5.3-3.1 8.7-3" />
                </svg>
              </span>

              <span class="service-row__name">Fade / Skin Fade</span>
              <strong>1000 RSD</strong>
            </article>

            <article class="service-row">
              <span class="service-row__icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path d="M7.5 4.5v6.75a4.5 4.5 0 0 0 9 0V4.5" />
                  <path d="M9.75 4.5v6.75a2.25 2.25 0 0 0 4.5 0V4.5" />
                  <path d="M12 15.75v3.75" />
                  <path d="M8.5 19.5h7" />
                </svg>
              </span>

              <span class="service-row__name">Sređivanje brade</span>
              <strong>500 RSD</strong>
            </article>

            <article class="service-row">
              <span class="service-row__icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path d="M6.5 7.5h11" />
                  <path d="M8 7.5v9a4 4 0 0 0 8 0v-9" />
                  <path d="M9.5 4.5h5" />
                  <path d="M12 4.5v-2" />
                  <path d="M7 20.5h10" />
                </svg>
              </span>

              <span class="service-row__name">Šišanje + brada</span>
              <strong>1200 RSD</strong>
            </article>
          </div>
        </section>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import { useRouter } from "vue-router";

defineProps<{
  showQuickBooking: boolean;
  loadingQuickBooking: boolean;
  quickBookingTime: string;
  quickBookingBarberName: string;
  quickBookingDateLabel: string;
}>();

defineEmits<{
  (e: "quick-book"): void;
}>();

const router = useRouter();
const servicesOpen = ref(false);

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

watch(servicesOpen, (isOpen) => {
  if (isOpen) {
    lockPageScroll();
  } else {
    unlockPageScroll();
  }
});

function back() {
  router.push({ name: "Welcome" });
}

function openServices() {
  servicesOpen.value = true;
}

function closeServices() {
  servicesOpen.value = false;
}

onBeforeUnmount(() => {
  unlockPageScroll();
});
</script>

<style scoped lang="scss">
@use "@/assets/scss/navbar.scss";
</style>