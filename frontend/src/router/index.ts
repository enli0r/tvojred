import { createRouter, createWebHistory } from 'vue-router'
import TestStudioBooking from '../views/Barber/TestStudioBooking.vue';
import Admin from '../views/Admin.vue';
import Settings from '../views/Settings.vue';
import Lokal from '../views/Lokal.vue';
import Frizeri from '../views/Frizeri.vue';
import Klijenti from '../views/Klijenti.vue';
import Usluge from '../views/Usluge.vue';
import RadnoVreme from '../views/RadnoVreme.vue';
import RadnoVremeFrizera from '../views/RadnoVremeFrizera.vue';
import FrizerPauze from '../views/FrizerPauze.vue';
import Welcome from '../views/Welcome.vue';
import TestStudio from '../views/Barber/TestStudio.vue';
import ModernLife from '../views/ModernLife/ModernLife.vue';
import ModernLifeBooking from '../views/ModernLife/ModernLifeBooking.vue';
import NailSalonBooking from '../views/Nail/NailSalonBooking.vue';
import NailSalon from '../views/Nail/NailSalon.vue';
import ClaudeAi from '../views/ClaudeAi.vue';
import AdminPanel from '../views/AdminPanel.vue';
import AdminPanelKlijenti from '../views/AdminPanelKlijenti.vue';
import AdminPanelTermini from '../views/AdminPanelTermini.vue';
import AdminPanelLokal from '../views/AdminPanelLokal.vue';
import AdminPanelStatistika from '../views/AdminPanelStatistika.vue';
import Demo from '../views/Demo.vue';
import Test123 from '../views/Test123.vue';
import PaketiCene from '../views/PaketiCene.vue';
import BarberBooking from '../views/BarberBooking.vue';
import BarberBooking2 from '../views/BarberBooking2.vue';
import BarberBooking3 from '../views/BarberBooking3.vue';
import BarberBooking4 from '../views/BarberBooking4.vue';
import NikisHouse from '../views/NikisHouse.vue';
import BeautySalon1 from '../views/BeautySalon1.vue';



const routes = [
  { path: '/', name: 'Welcome', component: Welcome },
  { path: '/demo', name: 'Demo', component: Demo },
  { path: '/paketi-i-cene', name: 'PaketiCene', component: PaketiCene },
  // { path: '/test123', name: 'Test123', component: Test123 },

  { path: '/barber-booking', name: 'BarberBooking', component: BarberBooking },
  { path: '/barber-booking2', name: 'BarberBooking2', component: BarberBooking2 },
  { path: '/barber-booking3', name: 'BarberBooking3', component: BarberBooking3 },
  { path: '/barber-booking4', name: 'BarberBooking4', component: BarberBooking4 },
  { path: '/nikishouse', name: 'NikisHouse', component: NikisHouse },

  { path: '/beauty-salon', name: 'BeautySalon1', component: BeautySalon1 },




  { path: '/claude', name: 'ClaudeAi', component: ClaudeAi },

  //Modern Life
  { path: '/modern-life', name: 'ModernLife', component: ModernLife },
  { path: '/modern-life/zakazivanje', name: 'ModernLifeBooking', component: ModernLifeBooking },

  //Nail studio
  { path: '/nail-studio', name: 'NailSalon', component: NailSalon },
  { path: '/nail-studio/zakazivanje', name: 'NailSalonBooking', component: NailSalonBooking },

  //Test Studio
  { path: '/:tenantSlug', name: 'TestStudio', component: TestStudio },
  { path: '/:tenantSlug/zakazivanje', name: 'TestStudioBooking', component: TestStudioBooking },

  { path: '/:tenantSlug/admin', name: 'AdminLogin', component: Admin },

  {
    path: '/admin-panel',
    component: AdminPanel,
    redirect: '/admin-panel/statistika',
    children: [
      {
        path: 'statistika',
        name: 'AdminPanelStatistika',
        component: AdminPanelStatistika,
        meta: { title: 'Home' },
      },
      {
        path: 'termini',
        name: 'AdminPanelTermini',
        component: AdminPanelTermini,
        meta: { title: 'Termini' },
      },
      {
        path: 'klijenti',
        name: 'AdminPanelKlijenti',
        component: AdminPanelKlijenti,
        meta: { title: 'Klijenti' },
      },
      {
        path: 'lokal',
        name: 'AdminPanelLokal',
        component: AdminPanelLokal,
        meta: { title: 'Salon' },
      },
    ],
  },
  //Admin
  { path: '/:tenantSlug/admin/settings', name: 'Settings', component: Settings, meta: { requiresAdmin: true } },
  { path: '/:tenantSlug/admin/settings/lokal', name: 'Lokal', component: Lokal, meta: { requiresAdmin: true, roles: ['owner'] } },

  { path: '/:tenantSlug/admin/settings/frizeri', name: 'Frizeri', component: Frizeri, meta: { requiresAdmin: true, roles: ['owner', 'admin'] } },

  { path: '/:tenantSlug/admin/settings/usluge', name: 'Usluge', component: Usluge, meta: { requiresAdmin: true, roles: ['owner', 'admin'] } },

  { path: '/:tenantSlug/admin/settings/radno-vreme', name: 'RadnoVreme', component: RadnoVreme, meta: { requiresAdmin: true, roles: ['owner'] } },

  { path: '/:tenantSlug/admin/settings/klijenti', name: 'Klijenti', component: Klijenti, meta: { requiresAdmin: true } },
  { path: '/:tenantSlug/admin/settings/frizer/:barberId/pauze', name: 'Pauze', component: FrizerPauze, meta: { requiresAdmin: true } },
  { path: '/:tenantSlug/admin/settings/radno-vreme-frizera', name: 'RadnoVremeFrizera', component: RadnoVremeFrizera, meta: { requiresAdmin: true } },

  // { path: '/:pathMatch(.*)*', redirect: '/404' }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // back/forward dugme → vrati na zapamćenu poziciju
    if (savedPosition) return savedPosition
    // link ka #sekciji → skroluj do nje
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    // svaka nova stranica → vrh
    return { top: 0 }
  },
})

router.beforeEach(async (to) => {
  if (!to.meta.requiresAdmin) {
    return true;
  }

  const tenantSlug = String(to.params.tenantSlug || "");


  try {
    const res = await fetch(`/api/auth/admin/me?tenantSlug=${tenantSlug}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.isAdmin) {
      return {
        name: "AdminLogin",
        params: {
          tenantSlug,
        },
      };
    }

    const allowedRoles = to.meta.roles as string[] | undefined;

    if (allowedRoles && !allowedRoles.includes(data.role)) {
      return {
        name: "Settings",
        params: {
          tenantSlug,
        },
      };
    }

    return true;
  } catch (err) {
    return {
      name: "AdminLogin",
      params: {
        tenantSlug,
      },
    };
  }
});

export default router