<template>
  <section class="gallery-carousel">
    <div
      ref="trackRef"
      class="gallery-carousel__track"
      @scroll="handleScroll"
    >
      <article
        v-for="(image, index) in loopedImages"
        :key="`${image.id}-${index}`"
        class="gallery-carousel__slide"
        :class="{ 'is-active': activeIndex === index }"
      >
        <img :src="image.src" :alt="image.alt" />
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";

type GalleryImage = {
  id: number;
  src: string;
  alt: string;
};

const originalImages: GalleryImage[] = [
  { id: 1, src: "https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?auto=format&fit=crop&w=900&q=90", alt: "Fade frizura" },
  { id: 2, src: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=90", alt: "Barber šišanje" },
  { id: 3, src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=90", alt: "Barber studio" },
  { id: 4, src: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=90", alt: "Barber chair" },
  { id: 5, src: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=900&q=90", alt: "Muška frizura" },
  { id: 6, src: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=90", alt: "Barber enterijer" },
  { id: 7, src: "https://images.unsplash.com/photo-1622288432450-277d0fef5ed6?auto=format&fit=crop&w=900&q=90", alt: "Beard trim" },
  { id: 8, src: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=900&q=90", alt: "Haircut" },
  { id: 9, src: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=900&q=90", alt: "Barber tools" },
  { id: 10, src: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=900&q=90", alt: "Barber shop" },
];

const loopedImages = [
  ...originalImages,
  ...originalImages,
  ...originalImages,
];

const trackRef = ref<HTMLElement | null>(null);
const activeIndex = ref(originalImages.length + 4);

let scrollTimer: number | undefined;
let isLoopJumping = false;

function getSlides() {
  const track = trackRef.value;
  if (!track) return [];

  return Array.from(
    track.querySelectorAll<HTMLElement>(".gallery-carousel__slide")
  );
}

function getCenteredIndex() {
  const track = trackRef.value;
  const slides = getSlides();

  if (!track || !slides.length) return activeIndex.value;

  const trackCenter = track.scrollLeft + track.clientWidth / 2;

  let closestIndex = activeIndex.value;
  let closestDistance = Number.POSITIVE_INFINITY;

  slides.forEach((slide, index) => {
    const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
    const distance = Math.abs(trackCenter - slideCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  return closestIndex;
}

function scrollToIndex(index: number, behavior: ScrollBehavior = "smooth") {
  const track = trackRef.value;
  const slides = getSlides();

  if (!track || !slides[index]) return;

  activeIndex.value = index;

  const left =
    slides[index].offsetLeft -
    track.clientWidth / 2 +
    slides[index].offsetWidth / 2;

  track.scrollTo({
    left,
    behavior,
  });
}

function normalizeLoop(index: number) {
  const total = originalImages.length;
  let normalized = index;

  if (index < total) {
    normalized = index + total;
  }

  if (index >= total * 2) {
    normalized = index - total;
  }

  if (normalized === index) return;

  isLoopJumping = true;

  requestAnimationFrame(() => {
    scrollToIndex(normalized, "auto");

    requestAnimationFrame(() => {
      isLoopJumping = false;
    });
  });
}

function updateActiveIndex() {
  if (isLoopJumping) return;

  activeIndex.value = getCenteredIndex();
}

function snapToNearest() {
  if (isLoopJumping) return;

  const nextIndex = getCenteredIndex();

  scrollToIndex(nextIndex, "smooth");
  normalizeLoop(nextIndex);
}

function handleScroll() {
  updateActiveIndex();

  if (scrollTimer) {
    window.clearTimeout(scrollTimer);
  }

  scrollTimer = window.setTimeout(() => {
    snapToNearest();
  }, 110);
}

onMounted(async () => {
  await nextTick();
  scrollToIndex(originalImages.length + 4, "auto");
});
</script>

<style scoped lang="scss">
.gallery-carousel {
  width: 100%;
  overflow: hidden;
}

.gallery-carousel__track {
  --side-peek: 20px;
  --slide-gap: 0px;

  display: flex;
  gap: var(--slide-gap);
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: var(--side-peek);
  padding: 18px var(--side-peek) 24px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.gallery-carousel__slide {
  flex: 0 0 calc(100% - 70px);
  height: 250px;
  border-radius: 32px;
  overflow: hidden;
  scroll-snap-align: center;
  transform: scale(0.85);
  opacity: 0.8;
  transition:
    transform 0.28s ease,
    opacity 0.28s ease,
    box-shadow 0.28s ease;
  background: #eef2f6;
    box-shadow:
    0 8px 16px rgba(18,32,48,.08),
    0 2px 4px rgba(18,32,48,.04);
  &.is-active {
    transform: scale(1);
    opacity: 1;
   
  }

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }
}
</style>