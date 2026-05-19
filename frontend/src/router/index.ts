import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue';
import PasskeyTest from '../views/PasskeyTest.vue';
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
import NotFound from '../views/NotFound.vue';
import Nina from '../views/Nina.vue';
import NinaZakazi from '../views/NinaZakazi.vue';
import NinaZakazi2 from '../views/NinaZakazi2.vue';
import NinaZakazi3 from '../views/NinaZakazi3.vue';
import TestStudio from '../views/TestStudio.vue';
import NailSalonTest from '../views/NailSalonTest.vue';
import NailSalonTestZakazivanje from '../views/NailSalonTestZakazivanje.vue';

const routes = [
  { path: '/', name: 'Welcome', component: Welcome },
  { path: '/modern-life', name: 'Nina', component: Nina },
  { path: '/modern-life/zakazivanje', name: 'NinaZakazi3', component: NinaZakazi3 },
  { path: '/modern-life/zakazivanje2', name: 'NinaZakazi', component: NinaZakazi },
  { path: '/modern-life/zakazivanje3', name: 'NinaZakazi2', component: NinaZakazi2 },
  { path: '/nail-studio', name: 'NailStudio', component: NailSalonTest },
  { path: '/nail-studio/zakazivanje', name: 'NailSalonZakazivanje', component: NailSalonTestZakazivanje },

  { path: '/:tenantSlug', name: 'TestStudio', component: TestStudio },
  { path: '/:tenantSlug/zakazi', name: 'Home', component: Home },

  { path: '/:tenantSlug/admin', name: 'AdminLogin', component: Admin },

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
  routes
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