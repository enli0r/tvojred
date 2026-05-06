import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue';
import PasskeyTest from '../views/PasskeyTest.vue';
import Admin from '../views/Admin.vue';
import Settings from '../views/Settings.vue';
import Lokal from '../views/Lokal.vue';
import Frizeri from '../views/Frizeri.vue';
import Klijenti from '../views/Klijenti.vue';
import Usluge from '../views/Usluge.vue';
import Book from '../views/Book.vue';
import Hehe from '../views/hehe.vue';
import RadnoVreme from '../views/RadnoVreme.vue';
import RadnoVremeFrizera from '../views/RadnoVremeFrizera.vue';
import FrizerPauze from '../views/FrizerPauze.vue';
import Test321 from '../views/test321.vue';
import Welcome from '../views/Welcome.vue';
import NotFound from '../views/NotFound.vue';

const routes = [
  { path: '/', redirect: '/test-studio' },
  { path: '/', name: 'Welcome', component: Welcome },
  { path: '/404', name: 'NotFound', component: NotFound },
  { path: '/:tenantSlug', name: 'Welcome', component: Welcome },
  { path: '/:tenantSlug/zakazi', name: 'Home', component: Home },
  { path: '/admin', name: 'Admin', component: Admin },
  { path: '/admin/settings', name: 'Settings', component: Settings },
  { path: '/admin/settings/lokal', name: 'Lokal', component: Lokal },
  { path: '/admin/settings/frizeri', name: 'Frizeri', component: Frizeri },
  { path: '/admin/settings/klijenti', name: 'Klijenti', component: Klijenti },
  { path: '/admin/settings/usluge', name: 'Usluge', component: Usluge },
  { path: '/admin/settings/radno-vreme', name: 'RadnoVreme', component: RadnoVreme },
  { path: '/admin/settings/frizer/8/pauze', name: 'Pauze', component: FrizerPauze },
  { path: '/admin/settings/radno-vreme-frizera', name: 'RadnoVremeFrizera', component: RadnoVremeFrizera },
  { path: '/test', name: 'test321', component: Test321 },

  { path: '/book', name: 'Book', component: Book },
  { path: '/h', name: 'Hehe', component: Hehe },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }

  // { path: '/passkey', name: 'passkey', component: PasskeyTest }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router