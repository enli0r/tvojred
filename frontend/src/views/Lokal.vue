<template>
    <div class="lokal">
        <div class="lokal-topbar">
            <router-link to="/admin/settings" class="back-btn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        fill-rule="evenodd"
                        d="M15.78 19.03a.75.75 0 0 1-1.06 0l-6.5-6.5a.75.75 0 0 1 0-1.06l6.5-6.5a.75.75 0 1 1 1.06 1.06L9.81 12l5.97 5.97a.75.75 0 0 1 0 1.06Z"
                        clip-rule="evenodd"
                    />
                </svg>

                <span>Podešavanja</span>
            </router-link>
        </div>

        <section class="lokal-hero">
            <div class="hero-badge">Lokal</div>

            <div class="hero-text">
                <h1>Podaci o lokalu</h1>
                <p>Osnovne informacije o salonu i kontakt detalji.</p>
            </div>
        </section>

        <div class="lokal-info">
            <div class="lokal-info-cont">
                <div class="card-top">
                    <div class="card-title-wrap">
                        <h2>Osnovne informacije</h2>
                        <p>Pregled podataka koji se koriste u sistemu</p>
                    </div>

                    <button class="edit-top-btn" @click="openSheet">
                        Izmeni
                    </button>
                </div>

                <div class="info-list">
                    <div class="info-row">
                        <span class="label">Naziv lokala</span>
                        <span class="value">{{ localData.name }}</span>
                    </div>

                    <div class="info-row">
                        <span class="label">Vlasnik</span>
                        <span class="value">{{ localData.owner }}</span>
                    </div>

                    <div class="info-row">
                        <span class="label">Adresa</span>
                        <span class="value">{{ localData.address }}</span>
                    </div>

                    <div class="info-row">
                        <span class="label">Mesto</span>
                        <span class="value">{{ localData.city }}</span>
                    </div>

                    <div class="info-row">
                        <span class="label">Kontakt</span>
                        <span class="value">{{ localData.phone }}</span>
                    </div>
                </div>
            </div>
        </div>

        <Teleport to="body">
    <Transition name="sheet-overlay3">
        <div v-if="showSheet" class="sheet-overlay3" @click="closeSheet">
            <div class="sheet-overlay3__panel" @click.stop>
                <div class="sheet-overlay3__handle"></div>

                <div class="sheet-overlay3__header">
                    <div class="sheet-overlay3__title-wrap">
                        <h2>Izmeni podatke</h2>
                        <p>Ažuriraj informacije o lokalu</p>
                    </div>

                    <button class="sheet-overlay3__close" @click="closeSheet" aria-label="Zatvori">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M6.225 4.811a.75.75 0 0 1 1.06 0L12 9.525l4.715-4.714a.75.75 0 1 1 1.06 1.06L13.06 10.586l4.714 4.714a.75.75 0 1 1-1.06 1.06L12 11.646l-4.715 4.714a.75.75 0 1 1-1.06-1.06l4.714-4.714-4.714-4.715a.75.75 0 0 1 0-1.06Z"
                            />
                        </svg>
                    </button>
                </div>

                <div class="sheet-overlay3__form">
                    <div class="sheet-overlay3__field">
                        <label for="name">Naziv</label>
                        <input
                            id="name"
                            class="sheet-overlay3__input"
                            v-model="form.name"
                            type="text"
                            placeholder="Unesite naziv"
                        />
                    </div>

                    <div class="sheet-overlay3__field">
                        <label for="owner">Vlasnik</label>
                        <input
                            id="owner"
                            class="sheet-overlay3__input"
                            v-model="form.owner"
                            type="text"
                            placeholder="Unesite vlasnika"
                        />
                    </div>

                    <div class="sheet-overlay3__field">
                        <label for="address">Adresa</label>
                        <input
                            id="address"
                            class="sheet-overlay3__input"
                            v-model="form.address"
                            type="text"
                            placeholder="Unesite adresu"
                        />
                    </div>

                    <div class="sheet-overlay3__field">
                        <label for="city">Mesto</label>
                        <input
                            id="city"
                            class="sheet-overlay3__input"
                            v-model="form.city"
                            type="text"
                            placeholder="Unesite mesto"
                        />
                    </div>

                    <div class="sheet-overlay3__field">
                        <label for="phone">Kontakt</label>
                        <input
                            id="phone"
                            class="sheet-overlay3__input"
                            v-model="form.phone"
                            type="text"
                            placeholder="Unesite kontakt"
                        />
                    </div>

                    <button class="sheet-overlay3__save" @click="saveChanges">
                        Sačuvaj izmene
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</Teleport>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";

type LocalData = {
    name: string;
    owner: string;
    address: string;
    city: string;
    phone: string;
};

const showSheet = ref(false);

const localData = ref<LocalData>({
    name: "Barber Studio",
    owner: "Pera Peric",
    address: "Ime Ulice 17",
    city: "Jagodina",
    phone: "0638457205"
});

const form = ref<LocalData>({
    ...localData.value
});

const openSheet = () => {
    form.value = { ...localData.value };
    showSheet.value = true;
    document.body.style.overflow = "hidden";
};

const closeSheet = () => {
    showSheet.value = false;
    document.body.style.overflow = "";
};

const saveChanges = () => {
    localData.value = { ...form.value };
    closeSheet();
};

onBeforeUnmount(() => {
    document.body.style.overflow = "";
});
</script>