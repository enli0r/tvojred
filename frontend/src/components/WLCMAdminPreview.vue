<template>
  <section ref="sectionRef" class="trm-admin-preview">
    <div class="trm-admin-preview__head">
      <span>Admin pregled</span>

      <h2>Kontrola salona, bez nagađanja.</h2>

      <p>
        Vlasnik vidi rezervacije, prihod, popunjenost i najvažnije usluge u jednom čistom pregledu.
      </p>
    </div>

    <div class="trm-admin-preview__panel">
      <div class="trm-admin-preview__panel-top">
        <div class="trm-admin-preview__brand">
          <span class="trm-admin-preview__logo">
            <img :src="logoImage" alt="tvojred.rs logo" />
          </span>

          <div>
            <strong>tvojred.rs</strong>
            <small>Pregled salona</small>
          </div>
        </div>

        <span class="trm-admin-preview__period">30 dana</span>
      </div>

      <div class="trm-admin-preview__hero-metric">
        <div>
          <small>Rezervacije</small>
          <strong>248</strong>
          <span>+18% u odnosu na prethodni period</span>
        </div>

        <div class="trm-admin-preview__ring" aria-hidden="true">
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="46" />
            <circle cx="60" cy="60" r="46" />
          </svg>

          <div>
            <strong>82%</strong>
            <small>popunjenost</small>
          </div>
        </div>
      </div>

      <div class="trm-admin-preview__metrics">
        <article>
          <span class="trm-admin-preview__metric-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5.25 18.75V11.5M12 18.75V5.25M18.75 18.75v-9.5" />
            </svg>
          </span>

          <div>
            <small>Prihod</small>
            <strong>312k RSD</strong>
          </div>
        </article>

        <article>
          <span class="trm-admin-preview__metric-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M8.25 10.25a3.75 3.75 0 1 0 7.5 0 3.75 3.75 0 0 0-7.5 0Z" />
              <path d="M4.75 20.25c1.1-3.05 3.75-4.75 7.25-4.75s6.15 1.7 7.25 4.75" />
            </svg>
          </span>

          <div>
            <small>Klijenti</small>
            <strong>96 novih</strong>
          </div>
        </article>

        <article>
          <span class="trm-admin-preview__metric-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4.75 7.75h14.5M4.75 12h14.5M4.75 16.25h9.5" />
            </svg>
          </span>

          <div>
            <small>Najisplativija usluga</small>
            <strong>Skin fade</strong>
          </div>
        </article>
      </div>

      <div class="trm-admin-preview__chart">
        <div class="trm-admin-preview__chart-head">
          <div>
            <small>Aktivnost</small>
            <strong>Zakazivanja po danima</strong>
          </div>

          <span>+24%</span>
        </div>

        <div class="trm-admin-preview__bars" aria-hidden="true">
          <i style="height: 38%"></i>
          <i style="height: 54%"></i>
          <i style="height: 46%"></i>
          <i style="height: 72%"></i>
          <i style="height: 66%"></i>
          <i style="height: 92%"></i>
          <i style="height: 70%"></i>
        </div>

        <div class="trm-admin-preview__days">
          <span>Po</span>
          <span>Ut</span>
          <span>Sr</span>
          <span>Če</span>
          <span>Pe</span>
          <span>Su</span>
          <span>Ne</span>
        </div>
      </div>
    </div>

    <div class="trm-admin-preview__rows">
      <article
        v-for="item in adminItems"
        :key="item.title"
      >
        <span class="trm-admin-preview__row-icon">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path :d="item.icon" />
          </svg>
        </span>

        <div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import logoImage from '@/assets/img/logoo.png';

const sectionRef = ref<HTMLElement | null>(null);

const adminItems = [
  {
    title: 'Pregled termina',
    text: 'Rezervacije, otkazivanja i zauzeti slotovi jasno prikazani po danima.',
    icon: 'M7 3.75v2.5M17 3.75v2.5M4.75 8.75h14.5M6.75 5.75h10.5a2 2 0 0 1 2 2v9.5a2 2 0 0 1-2 2H6.75a2 2 0 0 1-2-2v-9.5a2 2 0 0 1 2-2Z',
  },
  {
    title: 'Statistika usluga',
    text: 'Vidi se šta se najviše zakazuje i šta salonu donosi najbolji rezultat.',
    icon: 'M5.25 18.75V11.5M12 18.75V5.25M18.75 18.75v-9.5',
  },
  {
    title: 'Kontrola rada',
    text: 'Radno vreme, pauze, tim i pravila zakazivanja ostaju pod kontrolom.',
    icon: 'M12 3.75 18.25 6v5.2c0 4.05-2.55 7.65-6.25 9.05-3.7-1.4-6.25-5-6.25-9.05V6L12 3.75ZM9.25 12.1l1.8 1.8 3.7-4',
  },
];

function scrollIntoView(options?: ScrollIntoViewOptions) {
  sectionRef.value?.scrollIntoView(options);
}

defineExpose({
  sectionRef,
  scrollIntoView,
});
</script>

<style scoped lang="scss">
$trm-black: #050607;
$trm-panel: #12151b;
$trm-panel-soft: #191d25;
$trm-white: #ffffff;
$trm-muted: #a9b0ba;
$trm-muted-soft: #727b88;
$trm-blue: #6fa7ff;
$trm-blue-deep: #2f6faf;

.trm-admin-preview {
  position: relative;
  overflow: hidden;
  isolation: isolate;

  padding: 56px 18px 58px;
  color: $trm-white;
  background:
    radial-gradient(circle at 86% 8%, #2f6faf30, transparent 32%),
    radial-gradient(circle at 12% 90%, #2f6faf1c, transparent 30%),
    $trm-black;
}

.trm-admin-preview__head {
  position: relative;
  z-index: 2;

  > span {
    display: block;
    color: $trm-blue;
    font-size: 10px;
    line-height: 1;
    font-weight: 760;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  h2 {
    max-width: 320px;
    margin: 12px 0 0;
    color: $trm-white;
    font-size: 31px;
    line-height: 1.04;
    font-weight: 620;
    letter-spacing: -0.048em;
  }

  p {
    max-width: 320px;
    margin: 13px 0 0;
    color: $trm-muted;
    font-size: 14.5px;
    line-height: 1.48;
    font-weight: 410;
    letter-spacing: -0.01em;
  }
}

.trm-admin-preview__panel {
  position: relative;
  z-index: 2;

  margin-top: 30px;
  padding: 16px;
  border-radius: 32px;

  background:
    linear-gradient(180deg, $trm-panel-soft 0%, #0d1015 100%);

  box-shadow:
    0 28px 80px #00000073,
    inset 0 1px 0 #ffffff14,
    inset 0 0 0 1px #ffffff0d;
}

.trm-admin-preview__panel-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.trm-admin-preview__brand {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;

  strong {
    display: block;
    color: $trm-white;
    font-size: 15.5px;
    line-height: 1;
    font-weight: 660;
    letter-spacing: -0.026em;
  }

  small {
    display: block;
    margin-top: 5px;
    color: $trm-muted-soft;
    font-size: 10.5px;
    line-height: 1;
    font-weight: 430;
  }
}

.trm-admin-preview__logo {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  flex: 0 0 38px;

  display: grid;
  place-items: center;

  background: #ffffff0d;
  box-shadow:
    inset 0 0 0 1px #ffffff10,
    0 12px 24px #00000042;

  img {
    width: 27px;
    height: 27px;
    object-fit: contain;
    display: block;
  }
}

.trm-admin-preview__period {
  height: 30px;
  padding: 0 12px;
  border-radius: 999px;

  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;

  color: #d8e8ff;
  background: #2f6faf2e;

  font-size: 11px;
  line-height: 1;
  font-weight: 650;
}

.trm-admin-preview__hero-metric {
  margin-top: 20px;

  display: grid;
  grid-template-columns: 1fr 112px;
  gap: 12px;
  align-items: center;

  > div:first-child {
    min-width: 0;
  }

  small {
    display: block;
    color: $trm-muted-soft;
    font-size: 11px;
    line-height: 1;
    font-weight: 520;
  }

  strong {
    display: block;
    margin-top: 9px;
    color: $trm-white;
    font-size: 44px;
    line-height: 0.88;
    font-weight: 680;
    letter-spacing: -0.07em;
  }

  span {
    display: block;
    max-width: 155px;
    margin-top: 10px;
    color: $trm-muted;
    font-size: 11.5px;
    line-height: 1.28;
    font-weight: 410;
    letter-spacing: -0.006em;
  }
}

.trm-admin-preview__ring {
  position: relative;
  width: 112px;
  height: 112px;

  svg {
    width: 112px;
    height: 112px;
    transform: rotate(-90deg);

    circle {
      fill: none;
      stroke-width: 10;
      stroke-linecap: round;

      &:first-child {
        stroke: #ffffff12;
      }

      &:last-child {
        stroke: $trm-blue;
        stroke-dasharray: 289;
        stroke-dashoffset: 52;
        filter: drop-shadow(0 0 12px #6fa7ff4d);
      }
    }
  }

  > div {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    align-content: center;

    strong {
      margin: 0;
      font-size: 24px;
      line-height: 1;
      font-weight: 680;
      letter-spacing: -0.045em;
    }

    small {
      margin-top: 5px;
      font-size: 9.5px;
      color: $trm-muted-soft;
    }
  }
}

.trm-admin-preview__metrics {
  margin-top: 16px;

  display: grid;
  gap: 8px;

  article {
    min-height: 58px;
    padding: 10px 12px;
    border-radius: 18px;

    display: grid;
    grid-template-columns: 36px 1fr;
    gap: 10px;
    align-items: center;

    background: #ffffff0b;
    box-shadow: inset 0 0 0 1px #ffffff0a;
  }

  small {
    display: block;
    color: $trm-muted-soft;
    font-size: 10.5px;
    line-height: 1;
    font-weight: 510;
  }

  strong {
    display: block;
    margin-top: 6px;
    color: $trm-white;
    font-size: 15px;
    line-height: 1;
    font-weight: 640;
    letter-spacing: -0.018em;
  }
}

.trm-admin-preview__metric-icon {
  width: 34px;
  height: 34px;
  border-radius: 999px;

  display: grid;
  place-items: center;

  color: $trm-blue;
  background: #6fa7ff1c;

  svg {
    width: 19px;
    height: 19px;

    path {
      stroke: currentColor;
      stroke-width: 1.75;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  }
}

.trm-admin-preview__chart {
  margin-top: 10px;
  padding: 15px 14px 13px;
  border-radius: 22px;

  background: #ffffff0a;
  box-shadow: inset 0 0 0 1px #ffffff0a;
}

.trm-admin-preview__chart-head {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 14px;

  small {
    display: block;
    color: $trm-muted-soft;
    font-size: 10.5px;
    line-height: 1;
    font-weight: 520;
  }

  strong {
    display: block;
    margin-top: 6px;
    color: $trm-white;
    font-size: 13px;
    line-height: 1;
    font-weight: 610;
    letter-spacing: -0.014em;
  }

  > span {
    color: $trm-blue;
    font-size: 11px;
    line-height: 1;
    font-weight: 700;
  }
}

.trm-admin-preview__bars {
  height: 104px;
  margin-top: 16px;

  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  align-items: end;

  i {
    display: block;
    min-height: 18px;
    border-radius: 999px 999px 8px 8px;

    background:
      linear-gradient(180deg, $trm-blue 0%, $trm-blue-deep 100%);

    box-shadow: 0 10px 24px #4582ff38;
  }
}

.trm-admin-preview__days {
  margin-top: 10px;

  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;

  span {
    text-align: center;
    color: $trm-muted-soft;
    font-size: 10px;
    line-height: 1;
    font-weight: 520;
  }
}

.trm-admin-preview__rows {
  position: relative;
  z-index: 2;

  margin-top: 26px;
  display: grid;
  gap: 0;

  article {
    padding: 18px 0;

    display: grid;
    grid-template-columns: 42px 1fr;
    gap: 14px;
    align-items: start;

    &:not(:last-child) {
      border-bottom: 1px solid #ffffff14;
    }
  }

  h3 {
    margin: 0;
    color: $trm-white;
    font-size: 18px;
    line-height: 1.1;
    font-weight: 610;
    letter-spacing: -0.028em;
  }

  p {
    max-width: 278px;
    margin: 7px 0 0;
    color: $trm-muted;
    font-size: 13.5px;
    line-height: 1.42;
    font-weight: 400;
    letter-spacing: -0.006em;
  }
}

.trm-admin-preview__row-icon {
  width: 36px;
  height: 36px;
  border-radius: 999px;

  display: grid;
  place-items: center;

  color: $trm-blue;
  background: #6fa7ff1c;

  svg {
    width: 20px;
    height: 20px;

    path {
      stroke: currentColor;
      stroke-width: 1.75;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  }
}

@media (max-width: 385px) {
  .trm-admin-preview {
    padding-left: 14px;
    padding-right: 14px;
  }

  .trm-admin-preview__head h2 {
    font-size: 29px;
  }

  .trm-admin-preview__panel {
    padding: 14px;
    border-radius: 28px;
  }

  .trm-admin-preview__hero-metric {
    grid-template-columns: 1fr 102px;

    strong {
      font-size: 40px;
    }
  }

  .trm-admin-preview__ring,
  .trm-admin-preview__ring svg {
    width: 102px;
    height: 102px;
  }

  .trm-admin-preview__rows {
    h3 {
      font-size: 17px;
    }

    p {
      font-size: 13px;
    }
  }
}
</style>