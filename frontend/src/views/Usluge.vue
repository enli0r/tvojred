<template>
    <div class="usluge-page">
        <div class="usluge-topbar">
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

        <section class="usluge-hero">
            <div class="hero-badge">Usluge</div>

            <div class="hero-text">
                <h1>Usluge</h1>
                <p>Pregled usluga, cena i trajanja, uz jednostavno dodavanje i izmenu.</p>
            </div>
        </section>

        <div class="dark-card">
            <div class="dark-card-cont">
                <div class="card-top">
                    <div class="card-title-wrap">
                        <h2>Lista usluga</h2>
                        <p>Dodajte, menjajte i upravljajte uslugama u lokalu</p>
                    </div>

                    <button class="add-top-btn" @click="openAddSheet">
                        Dodaj
                    </button>
                </div>

                <div class="usluga-lista">
                    <div
                        v-for="usluga in usluge"
                        :key="usluga.id"
                        class="usluga-item"
                    >
                        <button
                            type="button"
                            class="usluga-main"
                            @click="toggleMenu(usluga.id)"
                        >
                            <div class="usluga-left">
                                <div class="usluga-info">
                                    <span class="usluga-name">{{ usluga.name }}</span>
                                    <span class="usluga-duration">{{ usluga.duration }} min</span>
                                </div>
                            </div>

                            <div class="usluga-right">
                                <span class="usluga-price">{{ usluga.price }} RSD</span>

                                <svg
                                    class="usluga-chevron"
                                    :class="{ open: activeMenu === usluga.id }"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 1 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                            </div>
                        </button>

                        <Transition name="usluga-dropdown">
                            <div v-if="activeMenu === usluga.id" class="usluga-dropdown">
                                <button
                                    type="button"
                                    class="usluga-action-btn"
                                    @click.stop="openEditSheet(usluga)"
                                >
                                    Izmeni uslugu
                                </button>

                                <button
                                    type="button"
                                    class="usluga-action-btn usluga-action-btn--danger"
                                    @click.stop="openDeleteDialog(usluga)"
                                >
                                    Ukloni uslugu
                                </button>
                            </div>
                        </Transition>
                    </div>
                </div>
            </div>
        </div>

        <Teleport to="body">
            <Transition name="usluga-sheet">
                <div
                    v-if="showSheet"
                    class="usluga-sheet"
                    @click="closeSheet"
                >
                    <div class="usluga-sheet__panel" @click.stop>
                        <div class="usluga-sheet__handle"></div>

                        <div class="usluga-sheet__header">
                            <div class="usluga-sheet__title-wrap">
                                <h2>{{ isEditMode ? 'Izmeni uslugu' : 'Dodaj uslugu' }}</h2>
                                <p class="title-wrap-small">
                                    {{
                                        isEditMode
                                            ? 'Ažurirajte podatke o usluzi'
                                            : 'Unesite podatke za novu uslugu'
                                    }}
                                </p>
                            </div>

                            <button
                                class="usluga-sheet__close"
                                @click="closeSheet"
                                aria-label="Zatvori"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path
                                        d="M6.225 4.811a.75.75 0 0 1 1.06 0L12 9.525l4.715-4.714a.75.75 0 1 1 1.06 1.06L13.06 10.586l4.714 4.714a.75.75 0 1 1-1.06 1.06L12 11.646l-4.715 4.714a.75.75 0 1 1-1.06-1.06l4.714-4.714-4.714-4.715a.75.75 0 0 1 0-1.06Z"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div class="usluga-sheet__form">
                            <div class="usluga-sheet__field">
                                <label>Naziv usluge</label>
                                <input
                                    v-model="form.name"
                                    class="usluga-sheet__input"
                                    type="text"
                                    placeholder="Unesite naziv usluge"
                                />
                            </div>

                            <div class="usluga-sheet__field">
                                <label>Cena</label>
                                <input
                                    v-model="form.price"
                                    class="usluga-sheet__input"
                                    type="number"
                                    placeholder="Unesite cenu"
                                />
                            </div>

                            <div class="usluga-sheet__field">
                                <label>Trajanje (min)</label>
                                <input
                                    v-model="form.duration"
                                    class="usluga-sheet__input"
                                    type="number"
                                    placeholder="Unesite trajanje"
                                />
                            </div>

                            <button class="usluga-sheet__save" @click="saveUsluga">
                                {{ isEditMode ? 'Sačuvaj izmene' : 'Dodaj uslugu' }}
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <Teleport to="body">
            <Transition name="usluga-delete-dialog">
                <div
                    v-if="showDeleteDialog"
                    class="usluga-delete-dialog"
                    @click="closeDeleteDialog"
                >
                    <div class="usluga-delete-dialog__panel" @click.stop>
                        <div class="usluga-delete-dialog__icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    fill-rule="evenodd"
                                    d="M9.401 3.003c1.155-2 4.043-2 5.196 0l5.25 9.093c1.154 2-.29 4.5-2.598 4.5H6.75c-2.309 0-3.752-2.5-2.598-4.5l5.25-9.093ZM12 8.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 6a.938.938 0 1 0 0-1.876.938.938 0 0 0 0 1.876Z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </div>

                        <div class="usluga-delete-dialog__text">
                            <h3>Ukloni uslugu?</h3>
                            <p>
                                Da li ste sigurni da želite da uklonite uslugu
                                <strong>{{ selectedUsluga?.name }}</strong>?
                            </p>
                        </div>

                        <div class="usluga-delete-dialog__actions">
                            <button class="usluga-delete-dialog__btn" @click="closeDeleteDialog">
                                Zatvori
                            </button>

                            <button
                                class="usluga-delete-dialog__btn usluga-delete-dialog__btn--danger"
                                @click="confirmDelete"
                            >
                                Ukloni
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

type Usluga = {
    id: number;
    name: string;
    price: number;
    duration: number;
};

const activeMenu = ref<number | null>(null);
const showSheet = ref(false);
const showDeleteDialog = ref(false);
const isEditMode = ref(false);
const selectedUsluga = ref<Usluga | null>(null);

const usluge = ref<Usluga[]>([
    { id: 1, name: "Klasično šišanje", price: 1000, duration: 30 },
    { id: 2, name: "Fade šišanje", price: 1200, duration: 40 },
    { id: 3, name: "Brada", price: 700, duration: 20 },
    { id: 4, name: "Brada + šišanje", price: 1800, duration: 55 },
    { id: 5, name: "Šišanje + pranje", price: 1400, duration: 45 }
]);

const form = ref({
    name: "",
    price: "",
    duration: ""
});

const lockBody = () => {
    document.body.style.overflow = "hidden";
};

const unlockBody = () => {
    document.body.style.overflow = "";
};

const resetForm = () => {
    form.value = {
        name: "",
        price: "",
        duration: ""
    };
};

const toggleMenu = (id: number) => {
    activeMenu.value = activeMenu.value === id ? null : id;
};

const openAddSheet = () => {
    isEditMode.value = false;
    selectedUsluga.value = null;
    activeMenu.value = null;
    resetForm();
    showSheet.value = true;
    lockBody();
};

const openEditSheet = (usluga: Usluga) => {
    isEditMode.value = true;
    selectedUsluga.value = usluga;
    activeMenu.value = null;

    form.value = {
        name: usluga.name,
        price: String(usluga.price),
        duration: String(usluga.duration)
    };

    showSheet.value = true;
    lockBody();
};

const closeSheet = () => {
    showSheet.value = false;
    unlockBody();
};

const saveUsluga = () => {
    if (!form.value.name || !form.value.price || !form.value.duration) return;

    if (isEditMode.value && selectedUsluga.value) {
        const found = usluge.value.find(item => item.id === selectedUsluga.value?.id);

        if (found) {
            found.name = form.value.name;
            found.price = Number(form.value.price);
            found.duration = Number(form.value.duration);
        }
    } else {
        usluge.value.unshift({
            id: Date.now(),
            name: form.value.name,
            price: Number(form.value.price),
            duration: Number(form.value.duration)
        });
    }

    closeSheet();
    resetForm();
    selectedUsluga.value = null;
};

const openDeleteDialog = (usluga: Usluga) => {
    selectedUsluga.value = usluga;
    activeMenu.value = null;
    showDeleteDialog.value = true;
    lockBody();
};

const closeDeleteDialog = () => {
    showDeleteDialog.value = false;
    unlockBody();
};

const confirmDelete = () => {
    if (!selectedUsluga.value) return;

    usluge.value = usluge.value.filter(item => item.id !== selectedUsluga.value?.id);
    showDeleteDialog.value = false;
    selectedUsluga.value = null;
    unlockBody();
};

onBeforeUnmount(() => {
    unlockBody();
});
</script>