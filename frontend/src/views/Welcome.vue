<template>
  <main ref="pageRef" class="trm-page">
    <WLCMHero
      ref="topSection"
      @scroll-to="scrollTo"
    />

    <WLCMTestPrimeri ref="examplesSection" />

    <WLCMPrePosle ref="compareSection" />

    <WLCMStaDobijas ref="benefitsSection" />

    <WLCMBookingSistem ref="bookingSection" />

    <WLCMAdminPreview ref="adminSection" />

    <WLCMAudience ref="audienceSection" />

    <WLCMProcess ref="processSection" />

    <WLCMKontakt
      ref="contactSection"
      @scroll-to="scrollTo"
    />
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import WLCMHero from '../components/WLCMHero.vue';
import WLCMTestPrimeri from '../components/WLCMTestPrimeri.vue';
import WLCMPrePosle from '../components/WLCMPrePosle.vue';
import WLCMStaDobijas from '../components/WLCMStaDobijas.vue';
import WLCMBookingSistem from '../components/WLCMBookingSistem.vue';
import WLCMAdminPreview from '../components/WLCMAdminPreview.vue';
import WLCMAudience from '../components/WLCMAudience.vue';
import WLCMProcess from '../components/WLCMProcess.vue';
import WLCMKontakt from '../components/WLCMKontakt.vue';

type ScrollSection =
  | 'top'
  | 'examples'
  | 'compare'
  | 'benefits'
  | 'booking'
  | 'admin'
  | 'audience'
  | 'process'
  | 'contact'
  | 'links'
  | 'why';

type ScrollableComponent = {
  scrollIntoView?: (options?: ScrollIntoViewOptions) => void;
  sectionRef?: HTMLElement | null;
  heroSection?: HTMLElement | null;
};

const pageRef = ref<HTMLElement | null>(null);

const topSection = ref<ScrollableComponent | null>(null);
const examplesSection = ref<ScrollableComponent | null>(null);
const compareSection = ref<ScrollableComponent | null>(null);
const benefitsSection = ref<ScrollableComponent | null>(null);
const bookingSection = ref<ScrollableComponent | null>(null);
const adminSection = ref<ScrollableComponent | null>(null);
const audienceSection = ref<ScrollableComponent | null>(null);
const processSection = ref<ScrollableComponent | null>(null);
const contactSection = ref<ScrollableComponent | null>(null);

function scrollTo(section: ScrollSection) {
  const targetMap: Record<ScrollSection, ScrollableComponent | null> = {
    top: topSection.value,

    examples: examplesSection.value,
    compare: compareSection.value,
    benefits: benefitsSection.value,
    booking: bookingSection.value,
    admin: adminSection.value,
    audience: audienceSection.value,
    process: processSection.value,
    contact: contactSection.value,

    // stari aliasi da ne pukne ako negde još postoji goTo('links') ili goTo('why')
    links: examplesSection.value,
    why: bookingSection.value,
  };

  requestAnimationFrame(() => {
    if (section === 'top') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      return;
    }

    const target = targetMap[section];

    if (target?.scrollIntoView) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      return;
    }

    const element = target?.sectionRef ?? target?.heroSection;

    element?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  });
}
</script>

<style scoped lang="scss">
$trm-ink: #17191d;
$trm-bg: #f4f6f9;

.trm-page {
  width: 100%;
  min-height: 100dvh;
  overflow-x: hidden;
  background: $trm-bg;
  color: $trm-ink;

  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;

  -webkit-font-smoothing: antialiased;
  text-rendering: geometricPrecision;
}

.trm-page,
.trm-page :deep(*) {
  box-sizing: border-box;
}

.trm-page :deep(button),
.trm-page :deep(a) {
  font: inherit;
  -webkit-tap-highlight-color: transparent;
}

.trm-page :deep(button) {
  cursor: pointer;
}

.trm-page :deep(svg) {
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.trm-page :deep(img) {
  max-width: 100%;
}
</style>