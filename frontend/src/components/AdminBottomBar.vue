<template>
  <footer class="admin-bottom">
    <RouterLink
      v-for="item in routeItems"
      :key="item.name"
      :to="item.to"
      class="admin-bottom__item"
      :aria-label="item.label"
    >
      <span class="admin-bottom__icon" v-html="item.icon"></span>
    </RouterLink>

    <button
      class="admin-bottom__item admin-bottom__more"
      type="button"
      aria-label="Podešavanja"
      :class="{ 'is-open': isMoreOpen }"
      @click="isMoreOpen = true"
    >
      <span class="admin-bottom__icon" v-html="moreIcon"></span>
    </button>
  </footer>

  <div v-if="isMoreOpen" class="admin-more">
    <button class="admin-more__backdrop" type="button" aria-label="Zatvori" @click="isMoreOpen = false"></button>

    <section class="admin-more__panel">
      <header class="admin-more__head">
        <div>
          <span>More</span>
          <h3>Podešavanja</h3>
        </div>

        <button type="button" aria-label="Zatvori" @click="isMoreOpen = false">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      <div class="admin-more__list">
        <button v-for="option in moreOptions" :key="option.title" type="button">
          <span class="admin-more__option-icon" v-html="option.icon"></span>

          <div>
            <strong>{{ option.title }}</strong>
            <small>{{ option.text }}</small>
          </div>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isMoreOpen = ref(false)

const routeItems = [
  {
    name: 'statistika',
    label: 'Statistika',
    to: '/admin-panel/statistika',
    icon: `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    `,
  },
  {
    name: 'termini',
    label: 'Termini',
    to: '/admin-panel/termini',
    icon: `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
    `,
  },
  {
    name: 'klijenti',
    label: 'Klijenti',
    to: '/admin-panel/klijenti',
    icon: `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    `,
  },
  {
    name: 'lokal',
    label: 'Lokal',
    to: '/admin-panel/lokal',
    icon: `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
      </svg>
    `,
  },
]

const moreIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
  </svg>
`

const moreOptions = [
  {
    title: 'Profil lokala',
    text: 'Ime, adresa i kontakt podaci',
    icon: `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15l-.75 18H5.25L4.5 3Zm3.75 4.5h7.5M8.25 12h7.5" />
      </svg>
    `,
  },
  {
    title: 'Notifikacije',
    text: 'Poruke za nove i otkazane termine',
    icon: `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022 23.848 23.848 0 0 0 5.455 1.31m5.714 0a3 3 0 0 1-5.714 0" />
      </svg>
    `,
  },
  {
    title: 'Pravila zakazivanja',
    text: 'Otkazivanje, kašnjenje i minimalni razmak',
    icon: `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    `,
  },
  {
    title: 'Izgled aplikacije',
    text: 'Boje, tema i prikaz admin panela',
    icon: `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 0 0 4.94 0m-5.896-6.304a3 3 0 0 1 6.852 0M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      </svg>
    `,
  },
  {
    title: 'Odjavi se',
    text: 'Izlazak iz admin panela',
    icon: `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
      </svg>
    `,
  },
]
</script>

<style scoped>
.admin-bottom {
  position: fixed;
  left: 50%;
  bottom: 11px;
  transform: translateX(-50%);
  width: min(calc(100% - 22px), 398px);
  height: 64px;
  z-index: 20;
  border-radius: 20px;
  background: rgba(28, 28, 28, 0.94);
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.admin-bottom__item {
  width: 42px;
  height: 42px;
  border: 0;
  border-radius: 16px;
  background: transparent;
  color: rgba(255, 255, 255, 0.58);
  display: grid;
  place-items: center;
  text-decoration: none;
  padding: 0;
  transition:
    color 0.22s ease,
    background 0.22s ease,
    transform 0.22s ease;
}

.admin-bottom__more.is-open,
.admin-bottom__item.router-link-active,
.admin-bottom__item.router-link-exact-active {
  color: #16110b;
  background: #d6b17a;
  transform: scale(1.04);
}

.admin-bottom__icon {
  width: 20px;
  height: 20px;
  display: grid;
  place-items: center;
  transition: transform 0.22s ease;
}

.admin-bottom__icon :deep(svg) {
  width: 20px;
  height: 20px;
  display: block;
}

.admin-bottom__more.is-open .admin-bottom__icon,
.admin-bottom__item.router-link-active .admin-bottom__icon,
.admin-bottom__item.router-link-exact-active .admin-bottom__icon {
  transform: translateY(-1px);
}

.admin-more {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.admin-more__backdrop {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.admin-more__panel {
  width: min(calc(100% - 22px), 398px);
  position: relative;
  z-index: 2;
  margin-bottom: 86px;
  border-radius: 24px;
  background:
    radial-gradient(circle at 82% 8%, rgba(214, 177, 122, 0.15), transparent 34%),
    #131313;
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 18px 16px 14px;
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.42);
}

.admin-more__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 12px;
}

.admin-more__head span {
  display: block;
  margin-bottom: 6px;
  color: #d6b17a;
  font-size: 9px;
  font-weight: 850;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.admin-more__head h3 {
  margin: 0;
  color: #ffffff;
  font-size: 25px;
  line-height: 0.95;
  letter-spacing: -0.055em;
  font-weight: 560;
}

.admin-more__head button {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.055);
  color: #ffffff;
  display: grid;
  place-items: center;
  padding: 0;
}

.admin-more__head svg {
  width: 17px;
  height: 17px;
}

.admin-more__list {
  display: grid;
}

.admin-more__list > button {
  min-height: 62px;
  border: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  background: transparent;
  color: #ffffff;
  padding: 11px 0;
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr);
  gap: 11px;
  align-items: center;
  text-align: left;
}

.admin-more__list > button:last-child {
  border-bottom: 0;
}

.admin-more__option-icon {
  width: 38px;
  height: 38px;
  border-radius: 15px;
  background: rgba(214, 177, 122, 0.12);
  color: #d6b17a;
  display: grid;
  place-items: center;
}

.admin-more__option-icon :deep(svg) {
  width: 18px;
  height: 18px;
}

.admin-more__list strong {
  display: block;
  color: #ffffff;
  font-size: 13px;
  line-height: 1.05;
  letter-spacing: -0.025em;
  font-weight: 780;
}

.admin-more__list small {
  display: block;
  margin-top: 6px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 9px;
  line-height: 1.25;
  font-weight: 650;
}
</style>