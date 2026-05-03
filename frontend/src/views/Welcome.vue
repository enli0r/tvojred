<template>
  <div v-if="tenantNotFound">
    Salon nije pronađen.
  </div>

  <main class="welcome">
    <section class="welcome__hero">
      <img
  class="welcome__hero-image"
  src="../assets/img/stolica55.png"
  alt="Vintage barber chair"
/>

      <div class="welcome__hero-wash"></div>

      <div class="welcome__brand">
        <!-- <div class="welcome__mark">DA</div> -->

        <div class="welcome__name">
          <span>DACA</span>
          <small>BARBER STUDIO</small>
        </div>
      </div>

      <div class="welcome__intro">
        <p>Dobrodošao </p>

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
      <div class="body-wrapper">
        <button class="welcome__booking" type="button" @click="goToBooking">
          <span class="welcome__booking-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M8 2v4M16 2v4M4 9h16M6 4h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
            </svg>
          </span>

          <span class="welcome__booking-text">
            <strong>Rezerviši termin</strong>
            <small>Izaberi dan i vreme.</small>
          </span>

          <span class="welcome__booking-arrow">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </button>
      

        <div class="welcome__features">
          <article class="welcome__feature">
            <span>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
              </svg>
            </span>
            <h3>Profesionalna usluga</h3>
            <p>Kvalitet u svakom rezu.</p>
          </article>

          <article class="welcome__feature">
            <span>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 7v5l3 2" />
                <path d="M21 12a9 9 0 1 1-18 0" />
              </svg>
            </span>
            <h3>Tačni i<br>pouzdani</h3>
            <p>Vreme je važno. Poštujemo rokove.</p>
          </article>

          <!-- <article class="welcome__feature">
            <span>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M20 21a8 8 0 0 0-16 0" />
                <path d="M12 11a4 4 0 1 0 0-8" />
              </svg>
            </span>
            <h3>Lični pristup</h3>
            <p>Svaki klijent je jedinstven.</p>
          </article> -->
        </div>
      </div>

      <Carousel />


      <section class="welcome__prices">
        <span class="welcome__prices-label">Cenovnik</span>

        <div class="welcome__price-item">
          <span>Muško šišanje</span>
          <strong>800 RSD</strong>
        </div>

        <div class="welcome__price-item">
          <span>Fade / Skin Fade</span>
          <strong>1000 RSD</strong>
        </div>

        <div class="welcome__price-item">
          <span>Sređivanje brade</span>
          <strong>500 RSD</strong>
        </div>

        <div class="welcome__price-item">
          <span>Šišanje + brada</span>
          <strong>1200 RSD</strong>
        </div>
      </section>


      <div class="working-hours">
  <span class="working-hours__label">Radno vreme</span>

  <div class="working-hours__table">

    <div class="working-hours__head">
      <span>Dan</span>
      <span>Vreme</span>
      <span>Zakazivanje</span>
    </div>

      <div class="working-hours__row">
        <span>Pon</span>
        <strong>09:00 – 19:00</strong>

        <div class="working-hours__status no">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18"/>
          </svg>
        </div>
      </div>

      <div class="working-hours__row">
        <span>Uto — Pet</span>
        <strong>09:00 – 19:00</strong>

        <div class="working-hours__status yes">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7"/>
          </svg>
        </div>
      </div>

      <div class="working-hours__row">
        <span>Sub</span>
        <strong>09:00–15:00</strong>

        <div class="working-hours__status no">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18"/>
          </svg>
        </div>
      </div>

    </div>
  </div>



      <div class="body-wrapper">
        <article class="welcome__location">
          <div class="welcome__location-row">
            <span class="welcome__location-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>

            </span>

            <div class="welcome__location-text">
              <strong>Naziv Ulice XX, Grad</strong>
              <small>Naziv Barber Studio </small>
            </div>
          </div>


          <a class="welcome__call" href="tel:+381600000000">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
            </svg>

            Pozovi nas
          </a>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Carousel from "../components/Carousel.vue";

const apiBase = import.meta.env.VITE_API_BASE || "/api";

const router = useRouter();
const route = useRoute();

const tenantSlug = computed(() => String(route.params.tenantSlug));

const tenantNotFound = ref(false);

function goToBooking() {
  router.push({
    name: "Home",
    params: {
      tenantSlug: tenantSlug.value
    }
  });
}

async function fetchTenant() {
  try {
    const res = await fetch(
      `${apiBase}/tenants/by-slug/${tenantSlug.value}`
    );

    if (res.status === 404) {
        router.replace('/404');
        return;
    }

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    await res.json();
  } catch (error) {
    console.error("Failed to fetch tenant:", error);
    router.replace('/404');
  }
}

onMounted(fetchTenant);
</script>

<style scoped lang="scss">
.welcome {
  min-height: 100vh;
  color: #102438;
  overflow-x: hidden;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif;
  background-color: rgb(251,252,254);

}

.welcome,
.welcome * {
  box-sizing: border-box;
}

.welcome svg {
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.welcome__hero {
  position: relative;
  z-index: 1;
  min-height: 370px;
  padding: 38px 24px 0;
  overflow: hidden;
}

.welcome__hero-image {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 370px;
  object-fit: cover;
  object-position: 70% center;
  opacity: 1;
  filter: saturate(0.9);
  margin-left: 80px;
  // padding-bottom: 60px;
}

.welcome__hero-wash {
  position: absolute;
  inset: 0;
  z-index: 2;
  background:
  linear-gradient(
  90deg,
  rgba(251,252,254, 1) 0%,
  rgba(251,252,254, 1) 40%,
  rgba(251,252,254, 0.8) 55%,
  rgba(251,252,254, 0) 65%,
  ),

  linear-gradient(0deg, rgba(251,252,254, 1) 0%,
  rgba(251,252,254, 0.6) 10%,
  rgba(251,252,254, 0.0) 13%,
  rgba(251,252,254, 0) 65%,
  );

}

.welcome__brand {
  position: relative;
  z-index: 3;
}

.welcome__mark {
  margin-left: 28px;
  color: #71889f;
  font-size: 32px;
  line-height: 1;
  font-weight: 950;
  letter-spacing: -0.18em;
}

.welcome__name {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 12px;

  span {
    color: #102438;
    font-size: 27px;
    line-height: 1;
    font-weight: 400;
    letter-spacing: 0.18em;
  }

  small {
    color: rgba(16, 36, 56, 0.62);
    font-size: 12px;
    line-height: 1;
    font-weight: 800;
    letter-spacing: 0.22em;
  }
}

.welcome__intro {
  position: relative;
  z-index: 3;
  margin-top: 40px;

  p {
    margin: 0 0 11px;
    color: #64809c;
    font-size: 15px;
    line-height: 1.2;
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  h1 {
    margin: 0;
    color: #0d2135;
    font-size: 35px;
    line-height: 0.94;
    font-weight: 950;
    letter-spacing: -1px;
  }

  span {
    display: block;
    margin-top: 11px;
    color: rgba(36, 53, 72, 0.56);
    font-size: 14px;
    line-height: 1.32;
    font-weight: 650;
    letter-spacing: -0.02em;
  }
}

.welcome__body {
  position: relative;
  z-index: 10;
  max-width: 520px;
  margin: -50px auto 0;
  padding: 0 0px 24px;

  .body-wrapper{
    padding: 0 16px;
  }
}

.welcome__booking,
.welcome__feature,
.welcome__location,
.welcome__nav {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.88));
  border: 1px solid rgba(255, 255, 255, 0.92);
  box-shadow:
    0 20px 40px rgba(38, 55, 78, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.96);
}

.welcome__booking {
  position: relative;
  z-index: 20;
  width: 100%;
  min-height: 96px;
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr) 48px;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border: 0;
  border-radius: 28px;

  background: linear-gradient(145deg, #111a26 0%, #182638 48%, #0d141f 100%);

  box-shadow:
    0 16px 28px rgba(5,8,12,.28),
    inset 0 1px 0 rgba(255,255,255,.105),
    inset 0 -1px 0 rgba(0,0,0,.22),
    inset 0 0 0 1px rgba(255,255,255,.055);

  transition:
    transform .14s ease,
    box-shadow .14s ease;

  -webkit-tap-highlight-color: transparent;
}

.welcome__booking:active{
  transform: scale(.975);
}

.welcome__booking-icon {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  color: #506c8c;
  border-radius: 16px;
  background: #f2f5f9;

  svg {
    width: 20px;
    height: 20px;
  }
}

.welcome__booking-text {
  min-width: 0;

  strong {
    display: block;
    color: #ffffff;;
    font-size: 18px;
    line-height: 1.08;
    font-weight: 900;
    letter-spacing: -0.04em;
    
  }

  small {
    display: block;
    margin-top: 5px;
    color: rgba(255,255,255,0.7);
    font-size: 13px;
    line-height: 1.25;
    font-weight: 650;
  }
}

.welcome__booking-arrow {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: linear-gradient(180deg, #6f87a3 0%, #506c8c 100%);
    color: #ffffff;
  background: linear-gradient(180deg, #6f87a3 0%, #506c8c 100%);
    color: #ffffff;

  svg {
    width: 22px;
    height: 22px;
  }
}

.welcome__features {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 24px;
  // border: 1px solid red;
}

.welcome__feature {
  min-width: 0;
  min-height: 150px;
  // padding: 16px 10px 14px;
  padding: 16px;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;

  span {
    width: 46px;
    height: 46px;
    display: grid;
    place-items: center;
    margin-bottom: 30px;
    color: #4d86e8;
    border-radius: 50%;
    background: #f2f5f9;
  }

  svg {
    width: 24px;
    height: 24px;
  }

  h3 {
    margin: 0 0 8px;
    color: #102438;
    font-size: 16px;
    line-height: 1.16;
    font-weight: 900;
    letter-spacing: -0.05em;
    text-align: center;
  }

  p {
    margin: 0;
    color: rgba(42, 58, 78, 0.6);
    font-size: 12px;
    line-height: 1.32;
    font-weight: 650;
    text-align: center;
  }
}

.welcome__location {
  margin-top: 20px;
  padding: 18px;
  border-radius: 28px;
}

.welcome__location-row {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr);
  align-items: center;
  gap: 14px;
}

.welcome__location-icon {
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  color: #59728e;
  border-radius: 50%;
  background: #f2f5f9;
  color: #4d86e8;


  svg {
    width: 26px;
    height: 26px;
  }
}

.welcome__location-text {
  min-width: 0;

  strong {
    display: block;
    overflow: hidden;
    color: #12263a;
    font-size: 16px;
    line-height: 1.12;
    font-weight: 900;
    letter-spacing: -0.05em;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  small {
    display: block;
    margin-top: 5px;
    color: rgba(42, 58, 78, 0.58);
    font-size: 14px;
    line-height: 1.1;
    font-weight: 650;
  }
}

.welcome__call {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
  color: #4d86e8;
  text-decoration: none;
  border-radius: 999px;
  background: #f3f6fa;
  font-size: 16px;
  font-weight: 800;

  svg {
    width: 20px;
    height: 20px;
  }
}

.welcome__nav {
  height: 82px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 22px;
  padding: 8px;
  border-radius: 26px;

  button {
    position: relative;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #8a919c;
    border: 0;
    background: none;
    font: inherit;
    font-size: 14px;
    font-weight: 700;
  }

  button.is-active {
    color: #4d86e8;
  }

  button i {
    position: absolute;
    top: -8px;
    width: 42px;
    height: 4px;
    border-radius: 999px;
    background: #4d86e8;
  }
}

.welcome__prices {
  margin: 24px 16px;
  padding: 22px 20px;
  border-radius: 28px;

  background:
    linear-gradient(180deg,#ffffff 0%,#f8fbfd 100%);

  box-shadow:
    0 18px 34px rgba(38,55,78,.08),
    inset 0 1px 0 rgba(255,255,255,.96);
}

.welcome__prices-label{
  display:block;
  margin-bottom:18px;

  color:#64809c;
  font-size:12px;
  font-weight:850;
  letter-spacing:.18em;
  text-transform:uppercase;
}

.welcome__price-item{
  display:flex;
  align-items:center;
  gap:12px;
  padding:14px 0;
}

.welcome__price-item + .welcome__price-item{
  border-top:1px solid rgba(80,108,140,.10);
}

.welcome__price-item span{
  color:#102438;
  font-size:15px;
  font-weight:720;
}

.welcome__price-item::after{
  content:"";
  flex:1;
  border-bottom:1px dashed rgba(80,108,140,.18);
}

.welcome__price-item strong{
  color:#102438;
  font-size:15px;
  font-weight:950;
  letter-spacing:-0.03em;
  color: #4d86e8;
}

.working-hours{
  margin: 24px 16px;
  padding: 22px 20px;
  border-radius: 28px;

  background:#162332;

  box-shadow:
    0 16px 28px rgba(5,8,12,.28),
    inset 0 1px 0 rgba(255,255,255,.08),
    inset 0 -1px 0 rgba(0,0,0,.18);
}

.working-hours__label{
  display:block;
  margin-bottom:18px;

  color:rgba(203,221,239,.62);
  font-size:12px;
  font-weight:850;
  letter-spacing:.18em;
  text-transform:uppercase;
}

.working-hours__head,
.working-hours__row{
  display:grid;
  grid-template-columns: .85fr 1fr .8fr;
  align-items:center;
}

.working-hours__head{
  padding-bottom:12px;
  border-bottom:1px solid rgba(255,255,255,.08);

  span{
    color:#dce8f5;
    font-size:13px;
    font-weight:900;
    letter-spacing:-.03em;
  }

  span:first-child{
    text-align:left;
  }

  span:nth-child(2),
  span:nth-child(3){
    text-align:center;
  }
}

.working-hours__row{
  padding:16px 0;
}

.working-hours__row + .working-hours__row{
  border-top:1px solid rgba(255,255,255,.06);
}

.working-hours__row span{
  color:#ffffff;
  font-size:15px;
  font-weight:780;
}

.working-hours__row span:first-child{
  text-align:left;
}

.working-hours__row strong{
  color:rgba(228,238,248,.88);
  font-size:14px;
  font-weight:900;
  text-align:center;
}

.working-hours__status{
  width:32px;
  height:32px;
  margin:0 auto;
  border-radius:50%;
  display:grid;
  place-items:center;

  svg{
    width:15px;
    height:15px;
    stroke-width:2.8;
  }
}

.working-hours__status.yes{
  background:#1f7a56;
  color:#fff;

  box-shadow:
    0 0 0 3px rgba(31,122,86,.20);
}

.working-hours__status.no{
  background:#b63c4a;
  color:#fff;

  box-shadow:
    0 0 0 3px rgba(182,60,74,.18);
}

</style>