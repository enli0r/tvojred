<template>
  <section ref="sectionRef" class="trm-compare">
    <div class="trm-section-head">
      <span>Pre / posle</span>

      <h2>Iz DM dopisivanja u jasan sistem zakazivanja.</h2>

      <p>
        Manje ponavljanja. Više vremena za rad. Klijent odmah vidi ono što ga zanima.
      </p>
    </div>

    <div class="trm-compare__flow">
      <article class="trm-compare__block trm-compare__block--before">
        <div class="trm-compare__media">
          <span class="trm-compare__orb">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5.5 17.5c-1.2-1.3-2-3-2-4.9C3.5 7.9 7.3 4 12 4s8.5 3.9 8.5 8.6-3.8 8.5-8.5 8.5c-1.4 0-2.7-.3-3.8-.9L4 21l1.5-3.5Z" />
            </svg>
          </span>

          <div class="trm-compare__copy">
            <small>Pre</small>
            <h3>Ponavljaju se ista pitanja.</h3>
            <p>Cena, trajanje, termin, lokacija i slike stalno idu kroz DM.</p>
          </div>

          <div class="trm-message-stack" aria-hidden="true">
            <em>Koliko košta?</em>
            <em>Ima li slobodno u petak?</em>
            <em>Gde se nalazite?</em>
          </div>
        </div>
      </article>

      <div class="trm-compare__bridge" aria-hidden="true">
        <span>
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </div>

      <article class="trm-compare__block trm-compare__block--after">
        <div class="trm-compare__media">
          <span class="trm-compare__orb trm-compare__orb--after">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M8 7.5h8M8 12h8M8 16.5h5" />
              <path d="M6.5 3.5h11A2.5 2.5 0 0 1 20 6v12a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 18V6a2.5 2.5 0 0 1 2.5-2.5Z" />
              <path d="m15.5 18.5 1.4 1.4L21 15.8" />
            </svg>
          </span>

          <div class="trm-compare__copy">
            <small>Posle</small>
            <h3>Klijent bira sam.</h3>
            <p>Usluga, osoba i termin su spojeni u jedan čist online tok.</p>
          </div>

          <div class="trm-mini-booking">
            <strong>Rezerviši termin</strong>

            <ul>
              <li>
                <span>Usluga</span>
                <b>Farbanje kose</b>
              </li>

              <li>
                <span>Specijalista</span>
                <b>Marija</b>
              </li>

              <li>
                <span>Termin</span>
                <b>Čet, 08. maj · 11:30</b>
              </li>
            </ul>

            <button type="button">Potvrdi termin</button>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const sectionRef = ref<HTMLElement | null>(null);

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
$trm-soft-ink: #17191da8;
$trm-muted: #17191d80;
$trm-blue: #2f6faf;
$trm-blue-soft: #eaf3ff;
$trm-white: #ffffff;

.trm-compare {
  position: relative;
  overflow: hidden;

  padding: 58px 18px 60px;

  background:
    radial-gradient(circle at 84% 10%, #8bb9f01f, transparent 34%),
    linear-gradient(180deg, #edf5ff 0%, $trm-bg 100%);
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
    max-width: 335px;
    margin: 12px 0 0;

    color: $trm-ink;
    font-size: 31px;
    line-height: 1.04;
    font-weight: 620;
    letter-spacing: -0.048em;
  }

  p {
    max-width: 325px;
    margin: 13px 0 0;

    color: $trm-soft-ink;
    font-size: 14.5px;
    line-height: 1.48;
    font-weight: 420;
    letter-spacing: -0.012em;
  }
}

.trm-compare__flow {
  position: relative;

  margin-top: 32px;
  display: grid;
  gap: 18px;
}

.trm-compare__block {
  position: relative;
}

.trm-compare__media {
  position: relative;

  display: grid;
  grid-template-columns: 50px 1fr;
  gap: 14px;
  align-items: start;
}

.trm-compare__orb {
  width: 48px;
  height: 48px;
  border-radius: 999px;

  display: grid;
  place-items: center;

  color: #6e7480;
  background: #ffffffc9;

  box-shadow:
    0 14px 30px #38689c1a,
    inset 0 1px 0 #ffffffd9,
    inset 0 0 0 1px #17191d0a;

  svg {
    width: 24px;
    height: 24px;

    path {
      stroke: currentColor;
      stroke-width: 1.75;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  }
}

.trm-compare__orb--after {
  color: $trm-blue;
  background: #ffffff;
}

.trm-compare__copy {
  min-width: 0;
  padding-top: 2px;

  small {
    display: block;

    color: $trm-muted;
    font-size: 10px;
    line-height: 1;
    font-weight: 760;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  h3 {
    margin: 8px 0 0;

    color: $trm-ink;
    font-size: 21px;
    line-height: 1.08;
    font-weight: 600;
    letter-spacing: -0.025em;
  }

  p {
    max-width: 260px;
    margin: 8px 0 0;

    color: $trm-soft-ink;
    font-size: 13.5px;
    line-height: 1.45;
    font-weight: 410;
    letter-spacing: -0.006em;
  }
}

.trm-message-stack {
  grid-column: 2;
  padding-top: 14px;

  display: grid;
  justify-items: end;
  gap: 8px;

  em {
    width: fit-content;
    max-width: 230px;
    padding: 10px 13px;
    border-radius: 18px 18px 4px 18px;

    color: #17191dcc;
    background: #ffffffd9;

    font-size: 12.5px;
    line-height: 1;
    font-weight: 500;
    font-style: normal;
    letter-spacing: -0.01em;

    box-shadow:
      0 10px 24px #1f2d4212,
      inset 0 0 0 1px #17191d0a;

    &:nth-child(2) {
      justify-self: start;
      border-radius: 18px 18px 18px 4px;
    }

    &:nth-child(3) {
      margin-right: 18px;
    }
  }
}

.trm-compare__bridge {
  height: 34px;

  display: grid;
  place-items: center;

  span {
    width: 34px;
    height: 34px;
    border-radius: 999px;

    display: grid;
    place-items: center;

    color: $trm-blue;
    background: #ffffffd9;

    box-shadow:
      0 12px 24px #1f2d4212,
      inset 0 0 0 1px #17191d0a;
  }

  svg {
    width: 19px;
    height: 19px;

    path {
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  }
}

.trm-mini-booking {
  grid-column: 1 / -1;

  margin-top: 16px;
  padding: 18px;
  border-radius: 28px;

  background:
    linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);

  box-shadow:
    0 18px 44px #1f2d4212,
    inset 0 0 0 1px #17191d0a;

  > strong {
    display: block;

    color: $trm-ink;
    font-size: 17px;
    line-height: 1;
    font-weight: 650;
    letter-spacing: -0.025em;
  }

  ul {
    list-style: none;
    margin: 16px 0 0;
    padding: 0;

    display: grid;
    gap: 0;

    border-top: 1px solid #17191d12;
  }

  li {
    min-height: 48px;
    border-bottom: 1px solid #17191d10;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
  }

  span {
    color: #17191d75;
    font-size: 12px;
    line-height: 1;
    font-weight: 460;
    letter-spacing: -0.006em;
  }

  b {
    color: $trm-ink;
    font-size: 13px;
    line-height: 1;
    font-weight: 620;
    letter-spacing: -0.012em;
    text-align: right;
  }

  button {
    width: 100%;
    height: 48px;
    margin-top: 16px;
    border: 0;
    border-radius: 999px;

    color: $trm-white;
    background: $trm-blue;

    font-size: 14px;
    line-height: 1;
    font-weight: 700;
    letter-spacing: -0.012em;

    box-shadow:
      0 14px 28px #2f6faf33,
      inset 0 1px 0 #ffffff26;
  }
}

@media (max-width: 385px) {
  .trm-compare {
    padding-left: 14px;
    padding-right: 14px;
  }

  .trm-section-head h2 {
    font-size: 29px;
  }

  .trm-compare__copy h3 {
    font-size: 20px;
  }

  .trm-message-stack em {
    max-width: 210px;
    font-size: 12px;
  }
}
</style>