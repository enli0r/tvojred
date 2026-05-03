<template>
  <div class="services-section">
    <div class="booking-step-intro">
      <span class="booking-step-intro__kicker">Treći korak</span>
      <h1 class="booking-step-intro__title">Odaberi uslugu.</h1>
      <p class="booking-step-intro__description">
        Izaberi uslugu koja ti najviše odgovara.
      </p>
    </div>

    <div v-if="loading" class="service-list">
      <div
        v-for="index in 5"
        :key="index"
        class="service-card service-card--skeleton"
      >
        <div class="service-card__image skeleton-block"></div>

        <div class="service-card__content">
          <div class="service-card__copy">
            <div class="skeleton-line skeleton-line-title"></div>
            <div class="skeleton-line skeleton-line-description"></div>
          </div>

          <div class="service-card__meta">
            <div class="skeleton-pill"></div>
            <div class="skeleton-line skeleton-line-price"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="service-list">
      <button
        v-for="service in items"
        :key="service.id"
        type="button"
        class="service-card"
        :class="{ active: modelValue?.id === service.id }"
        @click="selectService(service)"
      >

        <div class="service-card__content">
          <div class="service-card__top">
            <div class="service-card__copy">
              <strong>{{ service.name }}</strong>
            </div>
          </div>

          <div class="service-card__meta">
            <span class="service-duration">{{ service.duration }} min</span>
            <b>{{ formatPrice(service.price) }} RSD</b>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import bradaImg from "../assets/img/brada.png";
import klasicnoImg from "../assets/img/klasicno.png";
import fadeImg from "../assets/img/fade.png";
import skinFadeImg from "../assets/img/skin-fade.png";
import celavoImg from "../assets/img/celavo.png";

type Barber = {
  id: number;
  name: string;
};

type BarberService = {
  id: number;
  barber_id: number;
  service_id: number;
  price: string;
  duration: number;
  is_active: number | boolean;
  name: string;
  description: string | null;
};

defineProps<{
  barber?: Barber | null;
  modelValue?: BarberService | null;
  items: BarberService[];
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: BarberService | null): void;
  (e: "update:selectedService", value: BarberService | null): void;
  (e: "next"): void;
}>();

function formatPrice(price: string | number) {
  return Math.floor(Number(price));
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getServiceImage(name: string) {
  const key = normalizeText(name);

  if (key.includes("skin-fade")) return skinFadeImg;
  if (key.includes("fade")) return fadeImg;
  if (key.includes("brada") || key.includes("beard")) return bradaImg;
  if (
    key.includes("celavo")
  ) return celavoImg;

  return klasicnoImg;
}

function getServiceDescription(service: BarberService) {
  if (service.description?.trim()) return service.description;

  const key = normalizeText(service.name);

  if (key.includes("skin fade")) {
    return "Precizan prelaz sa čistim i modernim finišem.";
  }

  if (key.includes("fade")) {
    return "Moderan fade sa pažljivo izvedenim prelazom.";
  }

  if (key.includes("brada") || key.includes("beard")) {
    return "Oblikovanje i sređivanje brade uz čist završetak.";
  }

  if (key.includes("celavo") || key.includes("brijanje glave") || key.includes("shave")) {
    return "Skroz čista varijanta sa urednim i glatkim izgledom.";
  }

  return "Klasično sređivanje uz uredan i prirodan izgled.";
}

function selectService(service: BarberService) {
  emit("update:modelValue", service);
  emit("update:selectedService", service);
  emit("next");
}
</script>

<style scoped lang="scss">
@use "@/assets/scss/services.scss";
</style>