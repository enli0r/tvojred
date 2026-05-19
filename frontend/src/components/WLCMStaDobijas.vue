<template>
  <section
    ref="sectionRef"
    class="trm-editorial"
    :style="{ '--editorial-bg': `url(${sectionBg})` }"
  >
    <div class="trm-section-head">
      <span>Šta dobijaš</span>

      <h2>Sajt koji izgleda kao deo brenda.</h2>

      <p>
        Čist prikaz salona, usluga i termina — bez prenatrpanih blokova,
        komplikovanog toka i izgleda gotovog template-a.
      </p>
    </div>

    <div class="trm-editorial__surface">
      <article
        v-for="item in editorialItems"
        :key="item.title"
      >
        <span class="trm-editorial__icon">
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

    <div class="trm-brand-note">
      <span>✦</span>
      <p>
        Vizuelni pravac se prilagođava salonu: barber, hair, beauty, nail ili studio.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import sectionBg from '@/assets/img/bg-sta-dobijas.png';

const sectionRef = ref<HTMLElement | null>(null);

const editorialItems = [
  {
    title: 'Prezentacija salona',
    text: 'Prostor, stil, usluge i atmosfera prikazani jasno, moderno i profesionalno.',
    icon: 'M7 20v-8.5M17 20v-8.5M5.5 11.5h13M7 4.5h10l1.5 5.5H5.5L7 4.5ZM8.5 20h7M9 14.5h6',
  },
  {
    title: 'Pregled usluga',
    text: 'Cene, trajanje i detalji usluga složeni tako da klijent brzo razume ponudu.',
    icon: 'M8 5h8M8 9h8M8 13h5M6.5 3.5h11A1.5 1.5 0 0 1 19 5v14a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19V5a1.5 1.5 0 0 1 1.5-1.5ZM9 17h6',
  },
  {
    title: 'Online zakazivanje',
    text: 'Klijent bira uslugu, osobu, dan i termin bez čekanja na odgovor u DM-u.',
    icon: 'M7 3.75v2.5M17 3.75v2.5M4.75 8.75h14.5M6.75 5.75h10.5a2 2 0 0 1 2 2v9.5a2 2 0 0 1-2 2H6.75a2 2 0 0 1-2-2v-9.5a2 2 0 0 1 2-2ZM8.5 12.75h3M8.5 15.75h5.5',
  },
  {
    title: 'Spremno za reklame',
    text: 'Instagram, story, post ili DM vode na stranicu koja odmah izgleda ozbiljno.',
    icon: 'M12 3.75 19.25 8v8L12 20.25 4.75 16V8L12 3.75ZM12 8.25v5.5M12 16.25h.01',
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
$trm-bg: #f4f6f9;
$trm-ink: #17191d;
$trm-soft-ink: #17191da3;
$trm-muted: #17191d78;
$trm-blue: #2f6faf;

.trm-editorial {
  position: relative;
  isolation: isolate;
  overflow: hidden;

  padding: 56px 18px 52px;

  background:
    linear-gradient(180deg, #ffffff 0%, #ffffff 58%, #f8fafc 100%);

  &::before {
    content: "";
    position: absolute;
    left: -18%;
    right: -18%;
    bottom: -8%;
    z-index: -2;

    height: 46%;

    background-image: var(--editorial-bg);
    background-size: cover;
    background-position: center bottom;
    background-repeat: no-repeat;

    opacity: 0.13;
    filter: saturate(0.96) contrast(1.02);
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;

    background:
      linear-gradient(
        180deg,
        #ffffff 0%,
        #ffffffd9 48%,
        #fffffff0 70%,
        #ffffff 100%
      );

    pointer-events: none;
  }
}

.trm-section-head {
  position: relative;
  z-index: 2;

  > span {
    display: block;

    color: #2f6fafcc;
    font-size: 10px;
    line-height: 1;
    font-weight: 760;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  h2 {
    max-width: 315px;
    margin: 12px 0 0;

    color: $trm-ink;
    font-size: 30px;
    line-height: 1.05;
    font-weight: 610;
    letter-spacing: -0.047em;
  }

  p {
    max-width: 325px;
    margin: 13px 0 0;

    color: $trm-soft-ink;
    font-size: 14.5px;
    line-height: 1.5;
    font-weight: 410;
    letter-spacing: -0.008em;
  }
}

.trm-editorial__surface {
  position: relative;
  z-index: 2;

  margin-top: 30px;

  display: grid;
  gap: 0;

  article {
    min-height: 82px;
    padding: 18px 0;

    display: grid;
    grid-template-columns: 44px 1fr;
    gap: 14px;
    align-items: start;

    &:not(:last-child) {
      border-bottom: 1px solid #17191d12;
    }
  }

  h3 {
    margin: 1px 0 0;

    color: $trm-ink;
    font-size: 18px;
    line-height: 1.12;
    font-weight: 590;
    letter-spacing: -0.022em;
  }

  p {
    max-width: 270px;
    margin: 7px 0 0;

    color: $trm-soft-ink;
    font-size: 13.5px;
    line-height: 1.45;
    font-weight: 400;
    letter-spacing: -0.004em;
  }
}

.trm-editorial__icon {
  width: 38px;
  height: 38px;
  border-radius: 999px;

  display: grid;
  place-items: center;

  color: $trm-blue;
  background: #eef5ff;

  box-shadow:
    inset 0 0 0 1px #2f6faf12,
    0 10px 22px #2f6faf14;

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

.trm-brand-note {
  position: relative;
  z-index: 2;

  margin-top: 24px;
  padding: 16px 0 0;
  border-top: 1px solid #17191d12;

  display: grid;
  grid-template-columns: 28px 1fr;
  gap: 12px;
  align-items: start;

  > span {
    width: 28px;
    height: 28px;
    border-radius: 999px;

    display: grid;
    place-items: center;

    color: $trm-blue;
    background: #eef5ff;

    font-size: 13px;
    line-height: 1;
  }

  p {
    margin: 0;

    color: $trm-muted;
    font-size: 13.5px;
    line-height: 1.45;
    font-weight: 410;
    letter-spacing: -0.004em;
  }
}

@media (max-width: 385px) {
  .trm-editorial {
    padding-left: 14px;
    padding-right: 14px;
  }

  .trm-section-head h2 {
    font-size: 28px;
  }

  .trm-editorial__surface {
    article {
      grid-template-columns: 40px 1fr;
      gap: 12px;
    }

    h3 {
      font-size: 17px;
    }

    p {
      font-size: 13px;
    }
  }

  .trm-editorial__icon {
    width: 36px;
    height: 36px;

    svg {
      width: 19px;
      height: 19px;
    }
  }
}
</style>