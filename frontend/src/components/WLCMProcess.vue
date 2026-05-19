<template>
  <section ref="sectionRef" class="trm-process">
    <div class="trm-section-head">
      <span>Proces</span>

      <h2>Prvo demo. Onda odluka.</h2>

      <p>
        Bez dugog dogovaranja na početku. Pošalješ osnovne stvari, dobiješ prvi pravac,
        pa tek onda odlučuješ dalje.
      </p>
    </div>

    <div class="trm-process__timeline">
      <article
        v-for="item in processItems"
        :key="item.number"
      >
        <div class="trm-process__number">
          {{ item.number }}
        </div>

        <div class="trm-process__content">
          <span>{{ item.label }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </div>
      </article>
    </div>

    <div class="trm-process__summary">
      <span>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 3.75 19.25 8v8L12 20.25 4.75 16V8L12 3.75Z" />
          <path d="M12 8.25v5.5M12 16.25h.01" />
        </svg>
      </span>

      <p>
        Poenta je jednostavna: prvo vidiš smer, izgled i logiku sistema — bez obaveze da odmah ulaziš u finalnu izradu.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const sectionRef = ref<HTMLElement | null>(null);

const processItems = [
  {
    number: '01',
    label: 'Materijal',
    title: 'Pošalješ salon',
    text: 'Instagram profil, usluge, slike i kratak opis šta želiš da klijent vidi.',
  },
  {
    number: '02',
    label: 'Demo',
    title: 'Dobiješ prvi pravac',
    text: 'Prikažemo kako bi izgledao sajt, zakazivanje i osnovni tok za klijenta.',
  },
  {
    number: '03',
    label: 'Final',
    title: 'Sređujemo do kraja',
    text: 'Ako ti se sviđa pravac, poliramo dizajn, tekstove, usluge i sistem zakazivanja.',
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
$trm-muted: #17191da3;
$trm-soft: #17191d78;
$trm-line: #17191d14;
$trm-blue: #2f6faf;

.trm-process {
  position: relative;
  overflow: hidden;

  padding: 54px 18px 56px;

  background:
    linear-gradient(180deg, $trm-bg 0%, #eef3f8 100%);
}

.trm-section-head {
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

    color: $trm-muted;
    font-size: 14.5px;
    line-height: 1.5;
    font-weight: 410;
    letter-spacing: -0.008em;
  }
}

.trm-process__timeline {
  margin-top: 32px;

  display: grid;
  gap: 0;

  article {
    position: relative;

    padding: 0 0 24px;

    display: grid;
    grid-template-columns: 52px 1fr;
    gap: 16px;
    align-items: start;

    &:not(:last-child) {
      margin-bottom: 24px;

      &::after {
        content: "";
        position: absolute;
        left: 25px;
        top: 48px;
        bottom: -24px;
        width: 1px;

        background-image: linear-gradient(
          180deg,
          $trm-line 0,
          $trm-line 8px,
          transparent 8px,
          transparent 16px
        );
        background-size: 1px 16px;
        background-repeat: repeat-y;
      }
    }
  }
}

.trm-process__number {
  position: relative;
  z-index: 2;

  width: 52px;
  height: 52px;
  border-radius: 999px;

  display: grid;
  place-items: center;

  color: $trm-blue;
  background: #ffffff;

  font-size: 12px;
  line-height: 1;
  font-weight: 720;
  letter-spacing: -0.01em;

  box-shadow:
    0 12px 26px #17191d0a,
    inset 0 0 0 1px #17191d0a;
}

.trm-process__content {
  padding-top: 3px;

  > span {
    display: block;

    color: $trm-soft;
    font-size: 10px;
    line-height: 1;
    font-weight: 720;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  h3 {
    margin: 8px 0 0;

    color: $trm-ink;
    font-size: 20px;
    line-height: 1.1;
    font-weight: 600;
    letter-spacing: -0.026em;
  }

  p {
    max-width: 270px;
    margin: 8px 0 0;

    color: $trm-muted;
    font-size: 13.5px;
    line-height: 1.46;
    font-weight: 400;
    letter-spacing: -0.004em;
  }
}

.trm-process__summary {
  margin-top: 4px;
  padding: 18px 0 0;
  border-top: 1px solid $trm-line;

  display: grid;
  grid-template-columns: 38px 1fr;
  gap: 13px;
  align-items: start;

  > span {
    width: 36px;
    height: 36px;
    border-radius: 999px;

    display: grid;
    place-items: center;

    color: $trm-blue;
    background: #ffffff;

    box-shadow:
      0 10px 22px #17191d0a,
      inset 0 0 0 1px #17191d0a;

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

  p {
    margin: 0;

    color: $trm-muted;
    font-size: 13.5px;
    line-height: 1.46;
    font-weight: 410;
    letter-spacing: -0.004em;
  }
}

@media (max-width: 385px) {
  .trm-process {
    padding-left: 14px;
    padding-right: 14px;
  }

  .trm-section-head h2 {
    font-size: 28px;
  }

  .trm-process__timeline {
    article {
      grid-template-columns: 48px 1fr;
      gap: 14px;

      &:not(:last-child)::after {
        left: 23px;
      }
    }
  }

  .trm-process__number {
    width: 48px;
    height: 48px;
  }

  .trm-process__content {
    h3 {
      font-size: 19px;
    }

    p {
      font-size: 13px;
    }
  }
}
</style>