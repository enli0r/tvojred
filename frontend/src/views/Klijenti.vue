<template>
    <div class="klijenti">
        <div class="klijenti-topbar">
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

        <section class="klijenti-hero">
            <div class="hero-badge">Klijenti</div>

            <div class="hero-text">
                <h1>Klijenti</h1>
                <p>Pregled klijenata, istorije dolazaka i upravljanje pristupom.</p>
            </div>
        </section>

        <div class="klijenti-info">
            <div class="klijenti-info-cont">
                <div class="card-top">
                    <div class="card-title-wrap">
                        <h2>Lista klijenata</h2>
                        <p>Pregled registrovanih klijenata u sistemu</p>
                    </div>
                </div>

                <div class="clients-list">
                    <div
                        v-for="client in clients"
                        :key="client.id"
                        class="client-item"
                    >
                        <button class="client-main" @click="toggleMenu(client.id)">
                            <div class="client-left">
                                <div class="client-avatar">
                                    {{ getInitials(client.name, client.lastName) }}
                                </div>

                                <div class="client-info">
                                    <span class="client-name">{{ client.name }} {{ client.lastName }}</span>
                                    <span class="client-phone">{{ client.phone }}</span>
                                </div>
                            </div>

                            <div class="client-right">
                                <span class="client-visits">{{ client.history.length }}</span>

                                <svg
                                    class="client-chevron"
                                    :class="{ open: activeMenu === client.id }"
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

                        <Transition name="client-dropdown">
                            <div v-if="activeMenu === client.id" class="client-dropdown">
                                <button class="client-action-btn" @click="openSheet(client)">
                                    Istorija termina
                                </button>

                                <button
                                    class="client-action-btn client-action-btn--danger"
                                    @click="openBlockModal(client)"
                                >
                                    Blokiraj klijenta
                                </button>
                            </div>
                        </Transition>
                    </div>
                </div>
            </div>
        </div>

        <Teleport to="body">
            <Transition name="sheet-overlay4">
                <div v-if="showSheet" class="sheet-overlay4" @click="closeSheet">
                    <div class="sheet-overlay4__panel" @click.stop>
                        <div class="sheet-overlay4__handle"></div>

                        <div class="sheet-overlay4__header">
                            <div class="sheet-overlay4__title-wrap">
                                <h2>{{ selectedClient?.name }} {{ selectedClient?.lastName }}</h2>
                                <p>Istorija termina klijenta</p>
                            </div>

                            <button class="sheet-overlay4__close" @click="closeSheet" aria-label="Zatvori">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path
                                        d="M6.225 4.811a.75.75 0 0 1 1.06 0L12 9.525l4.715-4.714a.75.75 0 1 1 1.06 1.06L13.06 10.586l4.714 4.714a.75.75 0 1 1-1.06 1.06L12 11.646l-4.715 4.714a.75.75 0 1 1-1.06-1.06l4.714-4.714-4.714-4.715a.75.75 0 0 1 0-1.06Z"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div class="sheet-overlay4__summary">
                            <div class="sheet-overlay4__summary-card">
                                <span>Ukupno dolazaka</span>
                                <strong>{{ selectedClient?.history.length ?? 0 }}</strong>
                            </div>
                        </div>

                        <div class="sheet-overlay4__history">
                            <div
                                v-for="(appointment, index) in selectedClient?.history ?? []"
                                :key="index"
                                class="sheet-overlay4__history-item"
                            >
                                <div class="sheet-overlay4__history-top">
                                    <span class="sheet-overlay4__date">{{ appointment.date }}</span>
                                    <span class="sheet-overlay4__price">{{ appointment.price }} RSD</span>
                                </div>

                                <div class="sheet-overlay4__rows">
                                    <div class="sheet-overlay4__row">
                                        <span class="sheet-overlay4__label">Barber</span>
                                        <span class="sheet-overlay4__value">{{ appointment.barber }}</span>
                                    </div>

                                    <div class="sheet-overlay4__row">
                                        <span class="sheet-overlay4__label">Usluga</span>
                                        <span class="sheet-overlay4__value">{{ appointment.service }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <Teleport to="body">
            <Transition name="block-overlay">
                <div v-if="showBlockModal" class="block-overlay" @click="closeBlockModal">
                    <div class="block-overlay__panel" @click.stop>
                        <div class="block-overlay__icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    fill-rule="evenodd"
                                    d="M9.401 3.003c1.155-2 4.043-2 5.196 0l5.25 9.093c1.154 2-.29 4.5-2.598 4.5H6.75c-2.309 0-3.752-2.5-2.598-4.5l5.25-9.093ZM12 8.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 6a.938.938 0 1 0 0-1.876.938.938 0 0 0 0 1.876Z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </div>

                        <div class="block-overlay__text">
                            <h3>Blokiraj klijenta?</h3>
                            <p>
                                Da li ste sigurni da želite da blokirate klijenta
                                <strong>{{ selectedClient?.name }} {{ selectedClient?.lastName }}</strong>?
                            </p>
                        </div>

                        <div class="block-overlay__actions">
                            <button class="block-overlay__btn" @click="closeBlockModal">
                                Zatvori
                            </button>

                            <button class="block-overlay__btn block-overlay__btn--danger" @click="confirmBlock">
                                Blokiraj
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

type Appointment = {
    date: string;
    barber: string;
    service: string;
    price: number;
};

type Client = {
    id: number;
    name: string;
    lastName: string;
    phone: string;
    history: Appointment[];
};

const activeMenu = ref<number | null>(null);
const showSheet = ref(false);
const showBlockModal = ref(false);
const selectedClient = ref<Client | null>(null);

const clients = ref<Client[]>([
    {
        id: 1,
        name: "Marko",
        lastName: "Petrović",
        phone: "063 / 845-720-5",
        history: [
            {
                date: "12. mart 2026.",
                barber: "Nikola Marković",
                service: "Fade šišanje",
                price: 1200
            },
            {
                date: "28. februar 2026.",
                barber: "Stefan Petrović",
                service: "Brada + šišanje",
                price: 1800
            },
            {
                date: "15. januar 2026.",
                barber: "Nikola Marković",
                service: "Klasično šišanje",
                price: 1000
            }
        ]
    },
    {
        id: 2,
        name: "Nikola",
        lastName: "Jovanović",
        phone: "064 / 221-334-5",
        history: [
            {
                date: "20. mart 2026.",
                barber: "Stefan Petrović",
                service: "Brada",
                price: 700
            },
            {
                date: "01. mart 2026.",
                barber: "Nikola Marković",
                service: "Fade šišanje",
                price: 1200
            }
        ]
    },
    {
        id: 3,
        name: "Stefan",
        lastName: "Ilić",
        phone: "062 / 778-992-1",
        history: [
            {
                date: "10. mart 2026.",
                barber: "Nikola Marković",
                service: "Šišanje + pranje",
                price: 1400
            }
        ]
    }
]);

const lockBody = () => {
    document.body.style.overflow = "hidden";
};

const unlockBody = () => {
    document.body.style.overflow = "";
};

const getInitials = (name: string, lastName: string) => {
    return `${name[0]}${lastName[0]}`;
};

const toggleMenu = (id: number) => {
    activeMenu.value = activeMenu.value === id ? null : id;
};

const openSheet = (client: Client) => {
    selectedClient.value = client;
    showSheet.value = true;
    showBlockModal.value = false;
    activeMenu.value = null;
    lockBody();
};

const closeSheet = () => {
    showSheet.value = false;
    unlockBody();
};

const openBlockModal = (client: Client) => {
    selectedClient.value = client;
    showBlockModal.value = true;
    showSheet.value = false;
    activeMenu.value = null;
    lockBody();
};

const closeBlockModal = () => {
    showBlockModal.value = false;
    unlockBody();
};

const confirmBlock = () => {
    showBlockModal.value = false;
    unlockBody();
};

onBeforeUnmount(() => {
    unlockBody();
});
</script>