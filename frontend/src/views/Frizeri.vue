<template>
    <div class="frizeri-page">
        <div class="frizeri-topbar">
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

        <section class="frizeri-hero">
            <div class="hero-badge">Frizeri</div>

            <div class="hero-text">
                <h1>Frizeri</h1>
                <p>Pregled frizera, osnovnih podataka i upravljanje statusom.</p>
            </div>
        </section>

        <div class="dark-card">
            <div class="dark-card-cont">
                <div class="card-top">
                    <div class="card-title-wrap">
                        <h2>Lista frizera</h2>
                        <p>Pregled aktivnih frizera u sistemu</p>
                    </div>

                    <button class="add-top-btn" @click="openAddSheet">
                        Dodaj
                    </button>
                </div>

                <div class="barbers-list">
                    <div
                        v-for="barber in barbers"
                        :key="barber.id"
                        class="barber-item"
                    >
                        <button class="barber-main" @click="toggleMenu(barber.id)">
                            <div class="barber-left">
                                <div class="barber-avatar">
                                    {{ getInitials(barber.name, barber.lastName) }}
                                </div>

                                <div class="barber-info">
                                    <span class="barber-name">{{ barber.name }} {{ barber.lastName }}</span>
                                    <span class="barber-phone">{{ barber.phone }}</span>
                                </div>
                            </div>

                            <div class="barber-right">
                                <span class="barber-status" :class="{ inactive: !barber.active }">
                                    {{ barber.active ? 'Aktivan' : 'Neaktivan' }}
                                </span>

                                <svg
                                    class="barber-chevron"
                                    :class="{ open: activeMenu === barber.id }"
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

                        <Transition name="barber-dropdown">
                            <div v-if="activeMenu === barber.id" class="barber-dropdown">
                                <button class="barber-action-btn" @click="openDetailsSheet(barber)">
                                    Detalji frizera
                                </button>

                                <button
                                    class="barber-action-btn barber-action-btn--danger"
                                    @click="openStatusDialog(barber)"
                                >
                                    {{ barber.active ? 'Deaktiviraj frizera' : 'Aktiviraj frizera' }}
                                </button>
                            </div>
                        </Transition>
                    </div>
                </div>
            </div>
        </div>

        <Teleport to="body">
            <Transition name="barber-add-sheet">
                <div
                    v-if="showAddSheet"
                    class="barber-add-sheet"
                    @click="closeAddSheet"
                >
                    <div class="barber-add-sheet__panel" @click.stop>
                        <div class="barber-add-sheet__handle"></div>

                        <div class="barber-add-sheet__header">
                            <div class="barber-add-sheet__title-wrap">
                                <h2>Dodaj frizera</h2>
                                <p>Unesite osnovne podatke o frizeru</p>
                            </div>

                            <button
                                class="barber-add-sheet__close"
                                @click="closeAddSheet"
                                aria-label="Zatvori"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path
                                        d="M6.225 4.811a.75.75 0 0 1 1.06 0L12 9.525l4.715-4.714a.75.75 0 1 1 1.06 1.06L13.06 10.586l4.714 4.714a.75.75 0 1 1-1.06 1.06L12 11.646l-4.715 4.714a.75.75 0 1 1-1.06-1.06l4.714-4.714-4.714-4.715a.75.75 0 0 1 0-1.06Z"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div class="barber-add-sheet__form">
                            <div class="barber-add-sheet__field">
                                <label>Ime</label>
                                <input v-model="newBarber.name" class="barber-add-sheet__input" type="text" placeholder="Unesite ime" />
                            </div>

                            <div class="barber-add-sheet__field">
                                <label>Prezime</label>
                                <input v-model="newBarber.lastName" class="barber-add-sheet__input" type="text" placeholder="Unesite prezime" />
                            </div>

                            <div class="barber-add-sheet__field">
                                <label>Telefon</label>
                                <input v-model="newBarber.phone" class="barber-add-sheet__input" type="text" placeholder="Unesite telefon" />
                            </div>

                            <div class="barber-add-sheet__field">
                                <label>Email</label>
                                <input v-model="newBarber.email" class="barber-add-sheet__input" type="text" placeholder="Unesite email" />
                            </div>

                            <button class="barber-add-sheet__save" @click="addBarber">
                                Dodaj frizera
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <Teleport to="body">
            <Transition name="barber-details-sheet">
                <div
                    v-if="showDetailsSheet"
                    class="barber-details-sheet"
                    @click="closeDetailsSheet"
                >
                    <div class="barber-details-sheet__panel" @click.stop>
                        <div class="barber-details-sheet__handle"></div>

                        <div class="barber-details-sheet__header">
                            <div class="barber-details-sheet__title-wrap">
                                <h2>{{ selectedBarber?.name }} {{ selectedBarber?.lastName }}</h2>
                                <p>Osnovni podaci o frizeru</p>
                            </div>

                            <button
                                class="barber-details-sheet__close"
                                @click="closeDetailsSheet"
                                aria-label="Zatvori"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path
                                        d="M6.225 4.811a.75.75 0 0 1 1.06 0L12 9.525l4.715-4.714a.75.75 0 1 1 1.06 1.06L13.06 10.586l4.714 4.714a.75.75 0 1 1-1.06 1.06L12 11.646l-4.715 4.714a.75.75 0 1 1-1.06-1.06l4.714-4.714-4.714-4.715a.75.75 0 0 1 0-1.06Z"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div class="barber-details-sheet__summary">
                            <div class="barber-details-sheet__summary-card">
                                <span>Status</span>
                                <strong>{{ selectedBarber?.active ? 'Aktivan' : 'Neaktivan' }}</strong>
                            </div>
                        </div>

                        <div class="barber-details-sheet__history">
                            <div class="barber-details-sheet__history-item">
                                <div class="barber-details-sheet__rows">
                                    <div class="barber-details-sheet__row">
                                        <span class="barber-details-sheet__label">Ime</span>
                                        <span class="barber-details-sheet__value">{{ selectedBarber?.name }}</span>
                                    </div>

                                    <div class="barber-details-sheet__row">
                                        <span class="barber-details-sheet__label">Prezime</span>
                                        <span class="barber-details-sheet__value">{{ selectedBarber?.lastName }}</span>
                                    </div>

                                    <div class="barber-details-sheet__row">
                                        <span class="barber-details-sheet__label">Telefon</span>
                                        <span class="barber-details-sheet__value">{{ selectedBarber?.phone }}</span>
                                    </div>

                                    <div class="barber-details-sheet__row">
                                        <span class="barber-details-sheet__label">Email</span>
                                        <span class="barber-details-sheet__value">{{ selectedBarber?.email }}</span>
                                    </div>

                                    <div class="barber-details-sheet__row">
                                        <span class="barber-details-sheet__label">Specijalnost</span>
                                        <span class="barber-details-sheet__value">{{ selectedBarber?.specialty }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <Teleport to="body">
            <Transition name="barber-status-dialog">
                <div
                    v-if="showStatusDialog"
                    class="barber-status-dialog"
                    @click="closeStatusDialog"
                >
                    <div class="barber-status-dialog__panel" @click.stop>
                        <div class="barber-status-dialog__icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    fill-rule="evenodd"
                                    d="M9.401 3.003c1.155-2 4.043-2 5.196 0l5.25 9.093c1.154 2-.29 4.5-2.598 4.5H6.75c-2.309 0-3.752-2.5-2.598-4.5l5.25-9.093ZM12 8.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 6a.938.938 0 1 0 0-1.876.938.938 0 0 0 0 1.876Z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </div>

                        <div class="barber-status-dialog__text">
                            <h3>
                                {{ selectedBarber?.active ? 'Deaktiviraj frizera?' : 'Aktiviraj frizera?' }}
                            </h3>
                            <p>
                                Da li ste sigurni da želite da
                                <strong>{{ selectedBarber?.active ? 'deaktivirate' : 'aktivirate' }}</strong>
                                frizera
                                <strong>{{ selectedBarber?.name }} {{ selectedBarber?.lastName }}</strong>?
                            </p>
                        </div>

                        <div class="barber-status-dialog__actions">
                            <button class="barber-status-dialog__btn" @click="closeStatusDialog">
                                Zatvori
                            </button>

                            <button
                                class="barber-status-dialog__btn barber-status-dialog__btn--danger"
                                @click="confirmStatusChange"
                            >
                                {{ selectedBarber?.active ? 'Deaktiviraj' : 'Aktiviraj' }}
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

type Barber = {
    id: number;
    name: string;
    lastName: string;
    phone: string;
    email: string;
    specialty: string;
    active: boolean;
};

const activeMenu = ref<number | null>(null);
const showAddSheet = ref(false);
const showDetailsSheet = ref(false);
const showStatusDialog = ref(false);
const selectedBarber = ref<Barber | null>(null);

const barbers = ref<Barber[]>([
    {
        id: 1,
        name: "Nikola",
        lastName: "Marković",
        phone: "063 / 111-222-3",
        email: "nikola@studio.rs",
        specialty: "Fade šišanje",
        active: true
    },
    {
        id: 2,
        name: "Stefan",
        lastName: "Petrović",
        phone: "064 / 333-444-5",
        email: "stefan@studio.rs",
        specialty: "Brada i styling",
        active: true
    },
    {
        id: 3,
        name: "Milan",
        lastName: "Jovanović",
        phone: "062 / 555-777-8",
        email: "milan@studio.rs",
        specialty: "Klasično šišanje",
        active: false
    }
]);

const newBarber = ref({
    name: "",
    lastName: "",
    phone: "",
    email: "",
    specialty: ""
});

const lockBody = () => {
    document.body.style.overflow = "hidden";
};

const unlockBody = () => {
    document.body.style.overflow = "";
};

const getInitials = (name: string, lastName: string) => `${name[0]}${lastName[0]}`;

const resetNewBarber = () => {
    newBarber.value = {
        name: "",
        lastName: "",
        phone: "",
        email: "",
        specialty: ""
    };
};

const toggleMenu = (id: number) => {
    activeMenu.value = activeMenu.value === id ? null : id;
};

const openAddSheet = () => {
    showAddSheet.value = true;
    showDetailsSheet.value = false;
    showStatusDialog.value = false;
    activeMenu.value = null;
    lockBody();
};

const closeAddSheet = () => {
    showAddSheet.value = false;
    unlockBody();
};

const addBarber = () => {
    if (!newBarber.value.name || !newBarber.value.lastName) return;

    barbers.value.unshift({
        id: Date.now(),
        name: newBarber.value.name,
        lastName: newBarber.value.lastName,
        phone: newBarber.value.phone,
        email: newBarber.value.email,
        specialty: newBarber.value.specialty,
        active: true
    });

    resetNewBarber();
    showAddSheet.value = false;
    unlockBody();
};

const openDetailsSheet = (barber: Barber) => {
    selectedBarber.value = barber;
    showDetailsSheet.value = true;
    showAddSheet.value = false;
    showStatusDialog.value = false;
    activeMenu.value = null;
    lockBody();
};

const closeDetailsSheet = () => {
    showDetailsSheet.value = false;
    unlockBody();
};

const openStatusDialog = (barber: Barber) => {
    selectedBarber.value = barber;
    showStatusDialog.value = true;
    showAddSheet.value = false;
    showDetailsSheet.value = false;
    activeMenu.value = null;
    lockBody();
};

const closeStatusDialog = () => {
    showStatusDialog.value = false;
    unlockBody();
};

const confirmStatusChange = () => {
    if (!selectedBarber.value) return;

    const found = barbers.value.find((b) => b.id === selectedBarber.value?.id);
    if (found) {
        found.active = !found.active;
        selectedBarber.value = { ...found };
    }

    showStatusDialog.value = false;
    unlockBody();
};

onBeforeUnmount(() => {
    unlockBody();
});
</script>