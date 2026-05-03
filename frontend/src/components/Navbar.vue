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

      <img
        class="hero-logo"
        src="@/assets/img/logoslika.png"
        alt="Studio logo"
      />

      <button class="nav-info" type="button">
        Info
      </button>
    </nav>

    <div class="hero-intro">
      <h1>Rezervacija na klik.</h1>
      <p>Izaberi termin koji ti najviše odgovara.</p>
    </div>

    <button
      v-if="showQuickBooking"
      class="quick-card"
      type="button"
      aria-label="Rezerviši najraniji slobodan termin"
      @click="$emit('quick-book')"
    >
      <div class="quick-card-wrap">
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
            Rezerviši

            <svg viewBox="0 0 24 24" fill="none">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
              />
            </svg>
          </span>
        </div>
      </div>
    </button>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

defineProps<{
  showQuickBooking: boolean;
  quickBookingTime: string;
  quickBookingBarberName: string;
  quickBookingDateLabel: string;
}>();

defineEmits<{
  (e: "quick-book"): void;
}>();

const router = useRouter();

function back() {
  router.push({ name: "Welcome" });
}
</script>

<style scoped lang="scss">

</style>