  <template>
    <section class="booking-section booking-section--barbers">
      <header class="section-head-barber section-head--compact">
        <div class="section-head-barber__main">
          <div class="section-head-barber__icon" aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m7.848 8.25 1.536.887M7.848 8.25a3 3 0 1 1-5.196-3 3 3 0 0 1 5.196 3Zm1.536.887a2.165 2.165 0 0 1 1.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 1 1-5.196 3 3 3 0 0 1 5.196-3Zm1.536-.887a2.165 2.165 0 0 0 1.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863 2.077-1.199m0-3.328a4.323 4.323 0 0 1 2.068-1.379l5.325-1.628a4.5 4.5 0 0 1 2.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.33 4.33 0 0 0 10.607 12m3.736 0 7.794 4.5-.802.215a4.5 4.5 0 0 1-2.48-.043l-5.326-1.629a4.324 4.324 0 0 1-2.068-1.379M14.343 12l-2.882 1.664"
              />
            </svg>
          </div>

          <div>
            <h2>Frizer</h2>
            <p>Slobodni frizeri za ovaj dan</p>
          </div>
        </div>

        <span class="section-count">
          {{ loading ? "Učitavanje" : `${items.length} dostupna` }}
        </span>
      </header>

      <div v-if="loading" class="barber-list barber-list--skeleton">
        <div
          v-for="index in 4"
          :key="index"
          class="barber-row barber-row--skeleton"
        >
          <div class="barber-img skeleton-block"></div>

          <div class="barber-row__content">
            <div class="skeleton-line skeleton-line-title"></div>
            <div class="skeleton-line skeleton-line-meta"></div>
            <div class="skeleton-line skeleton-line-availability"></div>
          </div>
        </div>
      </div>

      <div v-else class="barber-list">
        <button
          v-for="barber in items"
          :key="barber.id"
          type="button"
          class="barber-row"
          :class="{ active: modelValue?.id === barber.id }"
          @click="selectBarber(barber)"
        >
          <div class="barber-img">
            <img :src="getBarberImage(barber.id)" :alt="barber.name" />
          </div>

          <div class="barber-row__content">
            <span class="barber-row__radio-dot"></span>

            <div class="barber-row__top">
              <strong>{{ barber.name }}</strong>
            </div>

            <div class="barber-row__tags">
              <span>Fade</span>
              <i></i>
              <span>Beard</span>
            </div>

            <div class="barber-row__availability">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 8v4l2.5 1.5M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0Z"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              {{ modelValue?.id === barber.id ? "Izabrano" : "Dostupan danas" }}
            </div>
          </div>
        </button>
      </div>
    </section>
  </template>

  <script setup lang="ts">
  type Barber = {
    id: number;
    name: string;
  };

  defineProps<{
    modelValue?: Barber | null;
    items: Barber[];
    loading?: boolean;
  }>();

  const emit = defineEmits<{
    (e: "update:modelValue", value: Barber | null): void;
    (e: "update:selectedBarber", value: Barber | null): void;
    (e: "next"): void;
  }>();

  function selectBarber(barber: Barber) {
    emit("update:modelValue", barber);
    emit("update:selectedBarber", barber);
    emit("next");
  }

  function getBarberImage(id: number) {
    const images = [
      "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80",
    ];

    return images[id % images.length];
  }
  </script>

  <style scoped lang="scss">
  @use "@/assets/scss/barbers.scss";
  </style>