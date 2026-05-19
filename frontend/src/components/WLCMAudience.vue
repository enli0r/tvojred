<template>
  <section ref="sectionRef" class="trm-audience">
    <div class="trm-section-head">
      <span>Za koga je</span>

      <h2>Za salone koji rade na termin.</h2>

      <p>
        Nije bitno da li je barber, beauty, hair ili nail studio — ako klijent bira vreme,
        sistem treba da radi za tebe.
      </p>
    </div>

    <div class="trm-audience__list">
      <article
        v-for="item in audiences"
        :key="item.title"
      >
        <span class="trm-audience__icon">
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

    <div class="trm-audience__tags">
      <span>barber</span>
      <span>hair salon</span>
      <span>beauty</span>
      <span>nail studio</span>
      <span>makeup</span>
      <span>pedikir</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const sectionRef = ref<HTMLElement | null>(null);

const audiences = [
  {
    title: 'Saloni koji žele bolji prvi utisak',
    text: 'Da klijent odmah vidi stil, usluge, radove i način zakazivanja.',
    icon: 'M12 3.75 19.25 8v8L12 20.25 4.75 16V8L12 3.75ZM12 8.25v5.5M12 16.25h.01',
  },
  {
    title: 'Timovi koji gube vreme u porukama',
    text: 'Manje odgovaranja na ista pitanja, više jasnih rezervacija.',
    icon: 'M5.5 17.5c-1.2-1.3-2-3-2-4.9C3.5 7.9 7.3 4 12 4s8.5 3.9 8.5 8.6-3.8 8.5-8.5 8.5c-1.4 0-2.7-.3-3.8-.9L4 21l1.5-3.5Z',
  },
  {
    title: 'Lokali koji žele kontrolu nad terminima',
    text: 'Usluge, radno vreme, pauze i zauzeti slotovi ostaju pregledni.',
    icon: 'M7 3.75v2.5M17 3.75v2.5M4.75 8.75h14.5M6.75 5.75h10.5a2 2 0 0 1 2 2v9.5a2 2 0 0 1-2 2H6.75a2 2 0 0 1-2-2v-9.5a2 2 0 0 1 2-2Z',
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
$trm-bg: #ffffff;
$trm-ink: #17191d;
$trm-muted: #17191da3;
$trm-soft: #17191d78;
$trm-blue: #2f6faf;

.trm-audience {
  position: relative;
  overflow: hidden;

  padding: 54px 18px 52px;

  background:
    linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
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

.trm-audience__list {
  margin-top: 30px;

  display: grid;
  gap: 0;

  article {
    min-height: 82px;
    padding: 18px 0;

    display: grid;
    grid-template-columns: 42px 1fr;
    gap: 14px;
    align-items: start;

    &:not(:last-child) {
      border-bottom: 1px solid #17191d12;
    }
  }

  h3 {
    margin: 0;

    color: $trm-ink;
    font-size: 18px;
    line-height: 1.12;
    font-weight: 590;
    letter-spacing: -0.022em;
  }

  p {
    max-width: 275px;
    margin: 7px 0 0;

    color: $trm-muted;
    font-size: 13.5px;
    line-height: 1.45;
    font-weight: 400;
    letter-spacing: -0.004em;
  }
}

.trm-audience__icon {
  width: 36px;
  height: 36px;
  border-radius: 999px;

  display: grid;
  place-items: center;

  color: $trm-blue;
  background: #eef5ff;

  box-shadow:
    inset 0 0 0 1px #2f6faf12,
    0 10px 22px #2f6faf12;

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

.trm-audience__tags {
  margin-top: 24px;

  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  span {
    flex: 0 0 auto;
    height: 34px;
    padding: 0 13px;
    border-radius: 999px;

    display: inline-flex;
    align-items: center;

    color: $trm-soft;
    background: #f2f5f8;

    font-size: 12.5px;
    line-height: 1;
    font-weight: 520;
    letter-spacing: -0.006em;
    white-space: nowrap;
  }
}

@media (max-width: 385px) {
  .trm-audience {
    padding-left: 14px;
    padding-right: 14px;
  }

  .trm-section-head h2 {
    font-size: 28px;
  }

  .trm-audience__list {
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
}
</style>