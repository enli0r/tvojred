<template>
  <section ref="sectionRef" class="trm-contact">
    <div class="trm-contact__head">
      <span>Kontakt</span>

      <h2>Imaš salon za demo?</h2>

      <p>
        Pošalji Instagram profil, usluge i slike. Napravimo prvi pravac koji može odmah da se pokaže.
      </p>
    </div>

    <div class="trm-contact__actions">
      <a
        class="trm-contact__primary"
        href="https://www.instagram.com/tvojred.rs/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>Pošalji Instagram profil</span>

        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      </a>

      <a
        class="trm-contact__secondary"
        href="mailto:kontakt@tvojred.rs"
      >
        <span>Email</span>
        <strong>kontakt@tvojred.rs</strong>
      </a>
    </div>

    <div class="trm-contact__details">
      <article
        v-for="item in contactItems"
        :key="item.title"
      >
        <span class="trm-contact__icon">
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

    <footer class="trm-footer">
      <div class="trm-footer__brand">
        <strong>tvojred.rs</strong>
        <span></span>
        <p>Sajtovi i online sistemi zakazivanja za salone.</p>
      </div>

      <div class="trm-footer__links">
        <a
          href="https://www.instagram.com/tvojred.rs/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram
        </a>

        <a href="mailto:kontakt@tvojred.rs">
          Email
        </a>

        <button type="button" @click="goToTop">
          Na vrh
        </button>
      </div>

      <div class="trm-footer__bottom">
        <span>© 2026 tvojred.rs</span>
      </div>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  (event: 'scroll-to', section: 'top'): void;
}>();

const sectionRef = ref<HTMLElement | null>(null);

const contactItems = [
  {
    title: 'Šta šalješ?',
    text: 'Instagram profil, slike salona, usluge i kratak opis šta želiš da klijent vidi.',
    icon: 'M5.75 5.75h12.5v12.5H5.75V5.75ZM8.75 9.25h6.5M8.75 12h6.5M8.75 14.75h3.5',
  },
  {
    title: 'Šta dobijaš?',
    text: 'Prvi vizuelni pravac sajta i sistema zakazivanja, prilagođen tvom salonu.',
    icon: 'M12 3.75 19.25 8v8L12 20.25 4.75 16V8L12 3.75ZM12 8.25v5.5M12 16.25h.01',
  },
  {
    title: 'Bez komplikovanja',
    text: 'Ne moraš odmah imati gotov tekst, savršen materijal ili jasnu ideju. Krećemo od osnove.',
    icon: 'M12 3.75 18.25 6v5.2c0 4.05-2.55 7.65-6.25 9.05-3.7-1.4-6.25-5-6.25-9.05V6L12 3.75ZM9.25 12.1l1.8 1.8 3.7-4',
  },
];

function goToTop() {
  emit('scroll-to', 'top');
}

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
$trm-white: #ffffff;
$trm-muted: #a9b0ba;
$trm-soft: #737c88;
$trm-blue: #2f6faf;
$trm-blue-light: #7fb0ff;

.trm-contact {
  position: relative;
  overflow: hidden;
  isolation: isolate;

  padding: 58px 18px calc(28px + env(safe-area-inset-bottom));

  color: $trm-white;
  background:
    radial-gradient(circle at 88% 4%, #2f6faf30, transparent 32%),
    linear-gradient(180deg, #050607 0%, #020303 100%);
}

.trm-contact__head {
  position: relative;
  z-index: 2;

  > span {
    display: block;

    color: $trm-blue-light;
    font-size: 10px;
    line-height: 1;
    font-weight: 760;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  h2 {
    max-width: 315px;
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

.trm-contact__actions {
  position: relative;
  z-index: 2;

  margin-top: 28px;
  display: grid;
  gap: 12px;
}

.trm-contact__primary {
  width: 100%;
  min-height: 56px;
  border-radius: 999px;
  padding: 0 18px 0 22px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;

  color: $trm-white;
  background: $trm-blue;
  text-decoration: none;

  box-shadow:
    0 18px 38px #2f6faf33,
    inset 0 1px 0 #ffffff24;

  span {
    font-size: 15px;
    line-height: 1;
    font-weight: 720;
    letter-spacing: -0.014em;
  }

  svg {
    width: 21px;
    height: 21px;
    flex: 0 0 21px;

    path {
      stroke: currentColor;
      stroke-width: 1.9;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  }

  &:active {
    transform: scale(0.985);
  }
}

.trm-contact__secondary {
  min-height: 54px;
  padding: 0 2px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;

  color: inherit;
  text-decoration: none;
  border-bottom: 1px solid #ffffff14;

  span {
    color: $trm-soft;
    font-size: 12px;
    line-height: 1;
    font-weight: 520;
    letter-spacing: -0.006em;
  }

  strong {
    color: $trm-white;
    font-size: 14px;
    line-height: 1;
    font-weight: 560;
    letter-spacing: -0.012em;
  }
}

.trm-contact__details {
  position: relative;
  z-index: 2;

  margin-top: 30px;
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

.trm-contact__icon {
  width: 36px;
  height: 36px;
  border-radius: 999px;

  display: grid;
  place-items: center;

  color: $trm-blue-light;
  background: #7fb0ff1c;

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

/* FOOTER */

.trm-footer {
  position: relative;
  z-index: 2;

  margin-top: 44px;
  padding-top: 30px;
  border-top: 1px solid #ffffff14;
}

.trm-footer__brand {
  strong {
    display: block;

    color: $trm-white;
    font-size: 36px;
    line-height: 0.95;
    font-weight: 600;
    letter-spacing: -0.058em;
  }

  > span {
    display: block;
    width: 30px;
    height: 2px;
    margin-top: 16px;
    border-radius: 999px;
    background: $trm-blue-light;
  }

  p {
    max-width: 285px;
    margin: 18px 0 0;

    color: $trm-muted;
    font-size: 14.5px;
    line-height: 1.45;
    font-weight: 410;
    letter-spacing: -0.01em;
  }
}

.trm-footer__links {
  margin-top: 30px;

  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 18px;

  a,
  button {
    border: 0;
    padding: 0;
    background: transparent;

    color: $trm-white;
    text-decoration: none;

    font: inherit;
    font-size: 14px;
    line-height: 1;
    font-weight: 560;
    letter-spacing: -0.01em;
  }

  button {
    color: $trm-blue-light;
  }
}

.trm-footer__bottom {
  margin-top: 24px;

  span {
    display: block;

    color: #ffffff61;
    font-size: 11.5px;
    line-height: 1;
    font-weight: 410;
    letter-spacing: -0.004em;
  }
}

@media (max-width: 385px) {
  .trm-contact {
    padding-left: 14px;
    padding-right: 14px;
  }

  .trm-contact__head h2 {
    font-size: 29px;
  }

  .trm-contact__details {
    h3 {
      font-size: 17px;
    }

    p {
      font-size: 13px;
    }
  }

  .trm-footer__brand strong {
    font-size: 34px;
  }
}
</style>