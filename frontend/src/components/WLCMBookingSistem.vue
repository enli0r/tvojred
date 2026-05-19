<template>
  <section ref="sectionRef" class="trm-booking-system">
    <div class="trm-booking-system__head">
      <span>Booking sistem</span>

      <h2>Termini bez dopisivanja.</h2>

      <p>
        Klijent vidi slobodne termine, bira uslugu i zakazuje sam. Salon kontroliše radno vreme,
        pauze i zauzete slotove.
      </p>
    </div>

    <div class="trm-booking-system__screen">
      <div class="trm-booking-system__screen-top">
        <div>
          <span>Pregled termina</span>
          <strong>Danas</strong>
        </div>

        <span class="trm-booking-system__date">06. maj</span>
      </div>

      <div class="trm-booking-system__slot trm-booking-system__slot--active">
        <div>
          <span>09:30</span>
          <strong>Marko · Fade</strong>
        </div>

        <em>Zakazano</em>
      </div>

      <div class="trm-booking-system__slot">
        <div>
          <span>10:00</span>
          <strong>Slobodan termin</strong>
        </div>

        <em>Slobodno</em>
      </div>

      <div class="trm-booking-system__slot trm-booking-system__slot--muted">
        <div>
          <span>12:00</span>
          <strong>Pauza</strong>
        </div>

        <em>Blokirano</em>
      </div>
    </div>

    <div class="trm-booking-system__list">
      <article
        v-for="item in bookingItems"
        :key="item.title"
      >
        <span class="trm-booking-system__icon">
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

const sectionRef = ref<HTMLElement | null>(null);

const bookingItems = [
  {
    title: 'Slobodni termini',
    text: 'Klijent odmah vidi kada može da zakaže, bez pitanja u DM-u.',
    icon: 'M7 3.75v2.5M17 3.75v2.5M4.75 8.75h14.5M6.75 5.75h10.5a2 2 0 0 1 2 2v9.5a2 2 0 0 1-2 2H6.75a2 2 0 0 1-2-2v-9.5a2 2 0 0 1 2-2Z',
  },
  {
    title: 'Radno vreme i pauze',
    text: 'Salon podešava kada radi, kada ne radi i koji termini nisu dostupni.',
    icon: 'M12 6.25V12l3.25 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z',
  },
  {
    title: 'Usluge i frizeri',
    text: 'Svaka usluga može imati cenu, trajanje i osobu koja je radi.',
    icon: 'M5.75 6.75h12.5M5.75 12h12.5M5.75 17.25h8.5',
  },
  {
    title: 'Manje grešaka',
    text: 'Zauzeti termini se blokiraju automatski, bez duplog zakazivanja.',
    icon: 'M9.25 12.25l2 2 4.5-5M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z',
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
$trm-surface: #ffffff;
$trm-surface-soft: #f9fafc;
$trm-text: #17191d;
$trm-muted: rgba(23, 25, 29, 0.58);
$trm-muted-strong: rgba(23, 25, 29, 0.74);
$trm-line: rgba(23, 25, 29, 0.09);
$trm-blue: #2f6faf;

.trm-booking-system {
  padding: 52px 18px 54px;

  color: $trm-text;
  background:
    radial-gradient(circle at 80% 0%, rgba(47, 111, 175, 0.07), transparent 32%),
    linear-gradient(180deg, #ffffff 0%, $trm-bg 100%);
}

.trm-booking-system__head {
  span {
    display: block;

    color: $trm-blue;
    font-size: 10px;
    line-height: 1;
    font-weight: 760;
    letter-spacing: 0.22em;
    text-transform: uppercase;
  }

  h2 {
    margin: 12px 0 0;
    max-width: 310px;

    color: $trm-text;
    font-size: 33px;
    line-height: 1.02;
    font-weight: 690;
    letter-spacing: -0.055em;
  }

  p {
    margin: 14px 0 0;
    max-width: 330px;

    color: $trm-muted;
    font-size: 15px;
    line-height: 1.48;
    font-weight: 420;
    letter-spacing: -0.012em;
  }
}

.trm-booking-system__screen {
  margin-top: 30px;
  padding: 16px;
  border-radius: 30px;

  background: rgba(255, 255, 255, 0.84);
  border: 1px solid rgba(23, 25, 29, 0.075);

  box-shadow:
    0 22px 55px rgba(20, 31, 47, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

.trm-booking-system__screen-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
  padding: 2px 2px 14px;

  border-bottom: 1px solid $trm-line;

  span {
    display: block;

    color: $trm-muted;
    font-size: 12px;
    line-height: 1;
    font-weight: 520;
    letter-spacing: -0.006em;
  }

  strong {
    display: block;
    margin-top: 7px;

    color: $trm-text;
    font-size: 21px;
    line-height: 1;
    font-weight: 690;
    letter-spacing: -0.045em;
  }
}

.trm-booking-system__date {
  padding: 9px 12px;
  border-radius: 999px;

  color: $trm-muted-strong !important;
  background: #f1f3f6;

  font-size: 12px !important;
  font-weight: 650 !important;
}

.trm-booking-system__slot {
  min-height: 62px;
  padding: 0 2px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  border-bottom: 1px solid $trm-line;

  div {
    min-width: 0;
  }

  span {
    display: block;

    color: $trm-muted;
    font-size: 13px;
    line-height: 1;
    font-weight: 520;
    letter-spacing: -0.01em;
  }

  strong {
    display: block;
    margin-top: 6px;

    color: $trm-text;
    font-size: 16px;
    line-height: 1.1;
    font-weight: 670;
    letter-spacing: -0.026em;
  }

  em {
    flex: 0 0 auto;
    font-style: normal;

    color: $trm-muted;
    font-size: 12px;
    line-height: 1;
    font-weight: 650;
    letter-spacing: -0.008em;
  }

  &:last-child {
    border-bottom: 0;
  }
}

.trm-booking-system__slot--active {
  strong {
    color: $trm-text;
  }

  em {
    color: $trm-blue;
  }
}

.trm-booking-system__slot--muted {
  strong,
  span,
  em {
    color: rgba(23, 25, 29, 0.38);
  }
}

.trm-booking-system__list {
  margin-top: 28px;
}

.trm-booking-system__list article {
  padding: 18px 0;

  display: grid;
  grid-template-columns: 38px 1fr;
  gap: 14px;
  align-items: start;

  border-bottom: 1px solid $trm-line;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    border-bottom: 0;
    padding-bottom: 0;
  }

  h3 {
    margin: 0;

    color: $trm-text;
    font-size: 18px;
    line-height: 1.1;
    font-weight: 660;
    letter-spacing: -0.034em;
  }

  p {
    margin: 6px 0 0;
    max-width: 290px;

    color: $trm-muted;
    font-size: 13.5px;
    line-height: 1.42;
    font-weight: 410;
    letter-spacing: -0.008em;
  }
}

.trm-booking-system__icon {
  width: 36px;
  height: 36px;
  border-radius: 999px;

  display: grid;
  place-items: center;

  color: $trm-blue;
  background: $trm-surface;
  border: 1px solid rgba(23, 25, 29, 0.075);

  box-shadow:
    0 10px 22px rgba(20, 31, 47, 0.07),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);

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

@media (max-width: 385px) {
  .trm-booking-system {
    padding: 48px 14px 50px;
  }

  .trm-booking-system__head h2 {
    font-size: 30px;
  }

  .trm-booking-system__screen {
    padding: 14px;
    border-radius: 26px;
  }

  .trm-booking-system__slot {
    min-height: 60px;

    strong {
      font-size: 15.5px;
    }
  }

  .trm-booking-system__list article {
    h3 {
      font-size: 17px;
    }

    p {
      font-size: 13px;
    }
  }
}
</style>