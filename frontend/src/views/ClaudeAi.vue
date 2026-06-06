<template>
  <div class="barber-app" :class="{ 'step-confirm': currentStep === 4 }">
    <!-- Background texture -->
    <div class="bg-texture" aria-hidden="true"></div>

    <!-- Header -->
    <header class="app-header">
      <div class="header-inner">
        <div class="logo">
          <span class="logo-mark">✦</span>
          <span class="logo-text">BLADE & CO.</span>
        </div>
        <nav class="header-nav">
          <a href="#" class="nav-link">Portfolio</a>
          <a href="#" class="nav-link">Pricing</a>
          <a href="#" class="nav-link nav-cta">Book Now</a>
        </nav>
      </div>
    </header>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-label">Est. 2018 · Beograd</div>
      <h1 class="hero-title">
        Precision.<br />
        <em>Redefined.</em>
      </h1>
      <p class="hero-sub">Reserve your appointment with one of our master barbers.</p>
    </section>

    <!-- Booking Container -->
    <main class="booking-container">
      <!-- Progress Steps -->
      <div class="progress-bar" role="progressbar" :aria-valuenow="currentStep" aria-valuemin="1" aria-valuemax="4">
        <div
          v-for="(step, i) in steps"
          :key="step.id"
          class="progress-step"
          :class="{
            'is-active': currentStep === i + 1,
            'is-done': currentStep > i + 1
          }"
        >
          <div class="step-dot">
            <span v-if="currentStep > i + 1" class="step-check">✓</span>
            <span v-else>{{ i + 1 }}</span>
          </div>
          <span class="step-label">{{ step.label }}</span>
        </div>
        <div class="progress-line">
          <div class="progress-line-fill" :style="{ width: progressWidth }"></div>
        </div>
      </div>

      <!-- Step 1: Choose Service -->
      <transition name="slide-fade" mode="out-in">
        <div v-if="currentStep === 1" key="step1" class="step-panel">
          <h2 class="panel-title">Choose a Service</h2>
          <p class="panel-sub">Select what you'd like done today.</p>
          <div class="services-grid">
            <button
              v-for="service in services"
              :key="service.id"
              class="service-card"
              :class="{ 'is-selected': selectedService?.id === service.id }"
              @click="selectService(service)"
            >
              <div class="service-icon" aria-hidden="true">{{ service.icon }}</div>
              <div class="service-info">
                <div class="service-name">{{ service.name }}</div>
                <div class="service-desc">{{ service.desc }}</div>
              </div>
              <div class="service-meta">
                <div class="service-price">{{ service.price }} RSD</div>
                <div class="service-duration">{{ service.duration }} min</div>
              </div>
              <div class="service-check" aria-hidden="true">✓</div>
            </button>
          </div>
          <div class="step-nav">
            <button class="btn-primary" :disabled="!selectedService" @click="nextStep">
              Continue
              <span class="btn-arrow">→</span>
            </button>
          </div>
        </div>

        <!-- Step 2: Choose Barber -->
        <div v-else-if="currentStep === 2" key="step2" class="step-panel">
          <h2 class="panel-title">Choose Your Barber</h2>
          <p class="panel-sub">Each cut tells a different story.</p>
          <div class="barbers-grid">
            <button
              v-for="barber in barbers"
              :key="barber.id"
              class="barber-card"
              :class="{ 'is-selected': selectedBarber?.id === barber.id }"
              @click="selectBarber(barber)"
            >
              <div class="barber-avatar" :style="{ background: barber.color }">
                {{ barber.initials }}
              </div>
              <div class="barber-info">
                <div class="barber-name">{{ barber.name }}</div>
                <div class="barber-title">{{ barber.title }}</div>
                <div class="barber-rating">
                  <span
                    v-for="n in 5"
                    :key="n"
                    class="star"
                    :class="{ 'is-filled': n <= barber.rating }"
                  >★</span>
                  <span class="rating-count">({{ barber.reviews }})</span>
                </div>
              </div>
              <div class="barber-tags">
                <span v-for="tag in barber.specialties" :key="tag" class="tag">{{ tag }}</span>
              </div>
              <div class="service-check" aria-hidden="true">✓</div>
            </button>
          </div>
          <div class="step-nav">
            <button class="btn-ghost" @click="prevStep">← Back</button>
            <button class="btn-primary" :disabled="!selectedBarber" @click="nextStep">
              Continue
              <span class="btn-arrow">→</span>
            </button>
          </div>
        </div>

        <!-- Step 3: Choose Date & Time -->
        <div v-else-if="currentStep === 3" key="step3" class="step-panel">
          <h2 class="panel-title">Pick a Date & Time</h2>
          <p class="panel-sub">Available slots for {{ selectedBarber?.name }}.</p>

          <div class="datetime-layout">
            <!-- Calendar -->
            <div class="calendar-section">
              <div class="calendar-header">
                <button class="cal-nav" @click="prevMonth" aria-label="Previous month">‹</button>
                <span class="cal-month">{{ calendarTitle }}</span>
                <button class="cal-nav" @click="nextMonth" aria-label="Next month">›</button>
              </div>
              <div class="calendar-weekdays">
                <span v-for="d in weekdays" :key="d">{{ d }}</span>
              </div>
              <div class="calendar-days">
                <button
                  v-for="day in calendarDays"
                  :key="day.date || 'empty-' + day.index"
                  class="cal-day"
                  :class="{
                    'is-empty': !day.date,
                    'is-today': day.isToday,
                    'is-selected': selectedDate === day.date,
                    'is-disabled': day.disabled,
                    'is-past': day.isPast
                  }"
                  :disabled="!day.date || day.disabled || day.isPast"
                  @click="day.date && !day.disabled && !day.isPast && selectDate(day.date)"
                >
                  {{ day.label }}
                </button>
              </div>
            </div>

            <!-- Time Slots -->
            <div class="timeslots-section">
              <div class="timeslots-title">
                {{ selectedDate ? formatDisplayDate(selectedDate) : 'Select a date' }}
              </div>
              <div v-if="selectedDate" class="timeslots-grid">
                <button
                  v-for="slot in timeSlots"
                  :key="slot.time"
                  class="time-slot"
                  :class="{
                    'is-selected': selectedTime === slot.time,
                    'is-unavailable': !slot.available
                  }"
                  :disabled="!slot.available"
                  @click="selectTime(slot.time)"
                >
                  {{ slot.time }}
                </button>
              </div>
              <div v-else class="timeslots-empty">
                <span>← Choose a date to see available times</span>
              </div>
            </div>
          </div>

          <div class="step-nav">
            <button class="btn-ghost" @click="prevStep">← Back</button>
            <button class="btn-primary" :disabled="!selectedDate || !selectedTime" @click="nextStep">
              Continue
              <span class="btn-arrow">→</span>
            </button>
          </div>
        </div>

        <!-- Step 4: Confirm -->
        <div v-else-if="currentStep === 4" key="step4" class="step-panel">
          <div v-if="!isBooked">
            <h2 class="panel-title">Confirm Booking</h2>
            <p class="panel-sub">Review your appointment details below.</p>

            <div class="confirm-card">
              <div class="confirm-row">
                <span class="confirm-label">Service</span>
                <span class="confirm-value">{{ selectedService?.name }}</span>
              </div>
              <div class="confirm-row">
                <span class="confirm-label">Barber</span>
                <span class="confirm-value">{{ selectedBarber?.name }}</span>
              </div>
              <div class="confirm-row">
                <span class="confirm-label">Date</span>
                <span class="confirm-value">{{ formatDisplayDate(selectedDate) }}</span>
              </div>
              <div class="confirm-row">
                <span class="confirm-label">Time</span>
                <span class="confirm-value">{{ selectedTime }}</span>
              </div>
              <div class="confirm-row">
                <span class="confirm-label">Duration</span>
                <span class="confirm-value">{{ selectedService?.duration }} min</span>
              </div>
              <div class="confirm-row confirm-total">
                <span class="confirm-label">Total</span>
                <span class="confirm-value confirm-price">{{ selectedService?.price }} RSD</span>
              </div>
            </div>

            <div class="client-form">
              <h3 class="form-title">Your Info</h3>
              <div class="form-row">
                <label for="client-name">Full Name</label>
                <input
                  id="client-name"
                  v-model="clientInfo.name"
                  type="text"
                  placeholder="Marko Petrović"
                  autocomplete="name"
                />
              </div>
              <div class="form-row">
                <label for="client-phone">Phone</label>
                <input
                  id="client-phone"
                  v-model="clientInfo.phone"
                  type="tel"
                  placeholder="+381 60 123 4567"
                  autocomplete="tel"
                />
              </div>
              <div class="form-row">
                <label for="client-email">Email (optional)</label>
                <input
                  id="client-email"
                  v-model="clientInfo.email"
                  type="email"
                  placeholder="marko@example.com"
                  autocomplete="email"
                />
              </div>
              <div class="form-row form-row--note">
                <label for="client-note">Note</label>
                <textarea
                  id="client-note"
                  v-model="clientInfo.note"
                  placeholder="Any special requests or notes..."
                  rows="3"
                ></textarea>
              </div>
            </div>

            <div v-if="formError" class="form-error" role="alert">{{ formError }}</div>

            <div class="step-nav">
              <button class="btn-ghost" @click="prevStep">← Back</button>
              <button class="btn-primary btn-book" :class="{ 'is-loading': isLoading }" @click="confirmBooking">
                <span v-if="!isLoading">Confirm Appointment</span>
                <span v-else class="loading-dots">
                  <span></span><span></span><span></span>
                </span>
              </button>
            </div>
          </div>

          <!-- Success State -->
          <div v-else class="success-state">
            <div class="success-icon" aria-hidden="true">✦</div>
            <h2 class="success-title">You're booked!</h2>
            <p class="success-sub">
              We'll see you on <strong>{{ formatDisplayDate(selectedDate) }}</strong>
              at <strong>{{ selectedTime }}</strong>.
            </p>
            <div class="success-ref">
              Confirmation ref: <strong>{{ bookingRef }}</strong>
            </div>
            <p class="success-sms">An SMS confirmation will be sent to {{ clientInfo.phone }}.</p>
            <button class="btn-primary btn-restart" @click="restart">Book Another Appointment</button>
          </div>
        </div>
      </transition>
    </main>

    <!-- Footer -->
    <footer class="app-footer">
      <div class="footer-inner">
        <div class="footer-logo">✦ BLADE & CO.</div>
        <div class="footer-links">
          <a href="#">Instagram</a>
          <a href="#">+381 11 123 456</a>
          <a href="#">Knez Mihailova 22, Beograd</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'BarberBooking',

  data() {
    const now = new Date()
    return {
      currentStep: 1,
      isLoading: false,
      isBooked: false,
      bookingRef: '',
      formError: '',

      steps: [
        { id: 1, label: 'Service' },
        { id: 2, label: 'Barber' },
        { id: 3, label: 'Date & Time' },
        { id: 4, label: 'Confirm' },
      ],

      services: [
        { id: 1, name: 'Classic Haircut', desc: 'Scissors & clippers, styled to perfection', price: 1800, duration: 45, icon: '✂' },
        { id: 2, name: 'Beard Trim', desc: 'Shape, line-up and hot towel finish', price: 1200, duration: 30, icon: '〰' },
        { id: 3, name: 'Cut & Beard Combo', desc: 'Full haircut plus beard grooming', price: 2800, duration: 75, icon: '◈' },
        { id: 4, name: 'Head Shave', desc: 'Smooth wet shave with straight razor', price: 2200, duration: 60, icon: '◯' },
        { id: 5, name: 'Kids Cut', desc: 'Gentle cut for children under 12', price: 1200, duration: 30, icon: '★' },
        { id: 6, name: 'Royal Treatment', desc: 'Cut + beard + scalp massage + eyebrow', price: 4500, duration: 120, icon: '♛' },
      ],

      barbers: [
        {
          id: 1,
          name: 'Nikola Jovanović',
          title: 'Master Barber · 9 years',
          initials: 'NJ',
          color: '#1a2a1a',
          rating: 5,
          reviews: 214,
          specialties: ['Fades', 'Designs', 'Classic'],
        },
        {
          id: 2,
          name: 'Stefan Milić',
          title: 'Senior Barber · 6 years',
          initials: 'SM',
          color: '#1a1a2a',
          rating: 5,
          reviews: 187,
          specialties: ['Textured', 'Beard', 'Razor'],
        },
        {
          id: 3,
          name: 'Aleksandar Đorđević',
          title: 'Barber · 4 years',
          initials: 'AĐ',
          color: '#2a1a1a',
          rating: 4,
          reviews: 98,
          specialties: ['Modern', 'Pompadour'],
        },
      ],

      selectedService: null,
      selectedBarber: null,
      selectedDate: '',
      selectedTime: '',

      clientInfo: {
        name: '',
        phone: '',
        email: '',
        note: '',
      },

      weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
      currentCalYear: now.getFullYear(),
      currentCalMonth: now.getMonth(),

      timeSlots: [
        { time: '09:00', available: true },
        { time: '09:30', available: false },
        { time: '10:00', available: true },
        { time: '10:30', available: true },
        { time: '11:00', available: false },
        { time: '11:30', available: true },
        { time: '12:00', available: true },
        { time: '14:00', available: true },
        { time: '14:30', available: false },
        { time: '15:00', available: true },
        { time: '15:30', available: true },
        { time: '16:00', available: true },
        { time: '16:30', available: false },
        { time: '17:00', available: true },
        { time: '17:30', available: true },
        { time: '18:00', available: true },
      ],
    }
  },

  computed: {
    progressWidth() {
      return `${((this.currentStep - 1) / (this.steps.length - 1)) * 100}%`
    },

    calendarTitle() {
      const d = new Date(this.currentCalYear, this.currentCalMonth, 1)
      return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    },

    calendarDays() {
      const year = this.currentCalYear
      const month = this.currentCalMonth
      const firstDay = new Date(year, month, 1).getDay()
      // Convert Sunday=0 to Monday-based
      const startOffset = (firstDay === 0 ? 6 : firstDay - 1)
      const daysInMonth = new Date(year, month + 1, 0).getDate()
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const days = []

      for (let i = 0; i < startOffset; i++) {
        days.push({ date: null, label: '', index: i })
      }

      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d)
        date.setHours(0, 0, 0, 0)
        const isPast = date < today
        const isToday = date.getTime() === today.getTime()
        const dayOfWeek = date.getDay()
        const isSunday = dayOfWeek === 0
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
        days.push({
          date: dateStr,
          label: d,
          isToday,
          isPast,
          disabled: isSunday,
        })
      }

      return days
    },
  },

  methods: {
    selectService(service) {
      this.selectedService = service
    },
    selectBarber(barber) {
      this.selectedBarber = barber
    },
    selectDate(date) {
      this.selectedDate = date
      this.selectedTime = ''
      // randomize availability for demo
      this.timeSlots = this.timeSlots.map(slot => ({
        ...slot,
        available: Math.random() > 0.3,
      }))
    },
    selectTime(time) {
      this.selectedTime = time
    },

    nextStep() {
      if (this.currentStep < 4) this.currentStep++
    },
    prevStep() {
      if (this.currentStep > 1) this.currentStep--
    },

    prevMonth() {
      if (this.currentCalMonth === 0) {
        this.currentCalMonth = 11
        this.currentCalYear--
      } else {
        this.currentCalMonth--
      }
    },
    nextMonth() {
      if (this.currentCalMonth === 11) {
        this.currentCalMonth = 0
        this.currentCalYear++
      } else {
        this.currentCalMonth++
      }
    },

    formatDisplayDate(dateStr) {
      if (!dateStr) return ''
      const [y, m, d] = dateStr.split('-')
      const date = new Date(Number(y), Number(m) - 1, Number(d))
      return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    },

    async confirmBooking() {
      this.formError = ''
      if (!this.clientInfo.name.trim()) {
        this.formError = 'Please enter your full name.'
        return
      }
      if (!this.clientInfo.phone.trim()) {
        this.formError = 'Please enter your phone number.'
        return
      }

      this.isLoading = true
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1800))
      this.isLoading = false
      this.bookingRef = 'BC-' + Math.random().toString(36).substr(2, 6).toUpperCase()
      this.isBooked = true
    },

    restart() {
      this.currentStep = 1
      this.isBooked = false
      this.selectedService = null
      this.selectedBarber = null
      this.selectedDate = ''
      this.selectedTime = ''
      this.clientInfo = { name: '', phone: '', email: '', note: '' }
      this.formError = ''
      this.bookingRef = ''
    },
  },
}
</script>

<style lang="scss">
// ─── Design Tokens ─────────────────────────────────────────────────────────────
$bg-base:         #0d0d0d;
$bg-surface:      #141414;
$bg-card:         #1a1a1a;
$bg-card-hover:   #202020;
$bg-input:        #161616;

$gold:            #c9a84c;
$gold-light:      #e0c07a;
$gold-dim:        #8a6e30;

$text-primary:    #f0ede6;
$text-secondary:  #8a8680;
$text-muted:      #4a4845;

$border:          rgba(255, 255, 255, 0.06);
$border-hover:    rgba(201, 168, 76, 0.25);
$border-gold:     rgba(201, 168, 76, 0.5);

$font-display:    'Playfair Display', Georgia, 'Times New Roman', serif;
$font-body:       'DM Sans', 'Helvetica Neue', Arial, sans-serif;
$font-mono:       'JetBrains Mono', 'Fira Code', monospace;

$radius-sm:       6px;
$radius-md:       10px;
$radius-lg:       16px;
$radius-xl:       24px;

$transition:      0.22s cubic-bezier(0.4, 0, 0.2, 1);

// ─── Google Fonts ──────────────────────────────────────────────────────────────
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400&display=swap');

// ─── Reset & Base ──────────────────────────────────────────────────────────────
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

// ─── App Shell ─────────────────────────────────────────────────────────────────
.barber-app {
  min-height: 100vh;
  background: $bg-base;
  color: $text-primary;
  font-family: $font-body;
  position: relative;
  overflow-x: hidden;
}

.bg-texture {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image:
    radial-gradient(ellipse 80% 60% at 50% -10%, rgba(201, 168, 76, 0.06) 0%, transparent 60%),
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
  background-size: 100%, 200px;
}

// ─── Header ────────────────────────────────────────────────────────────────────
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(13, 13, 13, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid $border;

  .header-inner {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 2rem;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;

  .logo-mark {
    color: $gold;
    font-size: 18px;
    line-height: 1;
  }

  .logo-text {
    font-family: $font-body;
    font-weight: 600;
    font-size: 14px;
    letter-spacing: 0.18em;
    color: $text-primary;
  }
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 2rem;

  .nav-link {
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 0.06em;
    color: $text-secondary;
    text-decoration: none;
    transition: color $transition;

    &:hover {
      color: $text-primary;
    }

    &.nav-cta {
      color: $gold;
      border: 1px solid $border-gold;
      padding: 6px 18px;
      border-radius: $radius-sm;
      transition: background $transition, color $transition;

      &:hover {
        background: $gold;
        color: $bg-base;
      }
    }
  }
}

// ─── Hero ──────────────────────────────────────────────────────────────────────
.hero {
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 0 auto;
  padding: 80px 2rem 56px;

  .hero-label {
    font-family: $font-mono;
    font-size: 11px;
    letter-spacing: 0.2em;
    color: $gold-dim;
    text-transform: uppercase;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 12px;

    &::before {
      content: '';
      display: block;
      width: 32px;
      height: 1px;
      background: $gold-dim;
    }
  }

  .hero-title {
    font-family: $font-display;
    font-size: clamp(48px, 7vw, 88px);
    font-weight: 400;
    line-height: 1.05;
    letter-spacing: -0.02em;
    color: $text-primary;
    margin-bottom: 20px;

    em {
      font-style: italic;
      color: $gold;
    }
  }

  .hero-sub {
    font-size: 16px;
    font-weight: 300;
    color: $text-secondary;
    max-width: 400px;
  }
}

// ─── Booking Container ─────────────────────────────────────────────────────────
.booking-container {
  position: relative;
  z-index: 1;
  max-width: 820px;
  margin: 0 auto 80px;
  padding: 0 2rem;
}

// ─── Progress Bar ──────────────────────────────────────────────────────────────
.progress-bar {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 48px;
  padding-top: 8px;
}

.progress-line {
  position: absolute;
  top: 20px;
  left: 10%;
  right: 10%;
  height: 1px;
  background: $border;
  z-index: 0;

  .progress-line-fill {
    height: 100%;
    background: linear-gradient(90deg, $gold-dim, $gold);
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

.progress-step {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  .step-dot {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: $bg-card;
    border: 1px solid $border;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 500;
    color: $text-muted;
    transition: all $transition;
  }

  .step-label {
    font-size: 11px;
    letter-spacing: 0.08em;
    color: $text-muted;
    text-transform: uppercase;
    font-weight: 500;
    transition: color $transition;
  }

  &.is-active {
    .step-dot {
      background: $gold;
      border-color: $gold;
      color: $bg-base;
    }
    .step-label {
      color: $gold;
    }
  }

  &.is-done {
    .step-dot {
      background: transparent;
      border-color: $gold-dim;
      color: $gold;

      .step-check {
        font-size: 14px;
      }
    }
    .step-label {
      color: $gold-dim;
    }
  }
}

// ─── Step Panel ────────────────────────────────────────────────────────────────
.step-panel {
  .panel-title {
    font-family: $font-display;
    font-size: 32px;
    font-weight: 400;
    color: $text-primary;
    margin-bottom: 8px;
    letter-spacing: -0.01em;
  }

  .panel-sub {
    font-size: 14px;
    color: $text-secondary;
    margin-bottom: 36px;
  }
}

// ─── Services Grid ─────────────────────────────────────────────────────────────
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 12px;
  margin-bottom: 36px;
}

.service-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-md;
  padding: 18px 20px;
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: background $transition, border-color $transition, transform $transition;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(201, 168, 76, 0.04), transparent);
    opacity: 0;
    transition: opacity $transition;
  }

  &:hover {
    background: $bg-card-hover;
    border-color: $border-hover;
    transform: translateY(-1px);

    &::before { opacity: 1; }
  }

  &.is-selected {
    border-color: $gold;
    background: rgba(201, 168, 76, 0.05);

    .service-check { opacity: 1; transform: scale(1); }
  }

  .service-icon {
    font-size: 22px;
    min-width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.04);
    border-radius: $radius-sm;
    color: $gold;
  }

  .service-info {
    flex: 1;

    .service-name {
      font-size: 14px;
      font-weight: 500;
      color: $text-primary;
      margin-bottom: 3px;
    }

    .service-desc {
      font-size: 12px;
      color: $text-secondary;
      line-height: 1.5;
    }
  }

  .service-meta {
    text-align: right;
    flex-shrink: 0;

    .service-price {
      font-size: 15px;
      font-weight: 600;
      color: $gold;
    }

    .service-duration {
      font-size: 11px;
      color: $text-muted;
      margin-top: 3px;
    }
  }

  .service-check {
    position: absolute;
    top: 10px;
    right: 12px;
    font-size: 10px;
    color: $gold;
    background: rgba(201, 168, 76, 0.15);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transform: scale(0.5);
    transition: all $transition;
  }
}

// ─── Barbers Grid ──────────────────────────────────────────────────────────────
.barbers-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 36px;
}

.barber-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 18px;
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-md;
  padding: 20px 24px;
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: background $transition, border-color $transition, transform $transition;

  &:hover {
    background: $bg-card-hover;
    border-color: $border-hover;
    transform: translateY(-1px);
  }

  &.is-selected {
    border-color: $gold;
    background: rgba(201, 168, 76, 0.04);
    .service-check { opacity: 1; transform: scale(1); }
  }

  .barber-avatar {
    width: 52px;
    height: 52px;
    border-radius: $radius-sm;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: $font-display;
    font-size: 16px;
    font-weight: 700;
    color: $gold-dim;
    border: 1px solid rgba(201, 168, 76, 0.15);
    flex-shrink: 0;
    letter-spacing: 0.05em;
  }

  .barber-info {
    flex: 1;

    .barber-name {
      font-size: 15px;
      font-weight: 500;
      color: $text-primary;
      margin-bottom: 3px;
    }

    .barber-title {
      font-size: 12px;
      color: $text-secondary;
      margin-bottom: 8px;
    }

    .barber-rating {
      display: flex;
      align-items: center;
      gap: 2px;

      .star {
        font-size: 12px;
        color: $text-muted;
        &.is-filled { color: $gold; }
      }

      .rating-count {
        font-size: 11px;
        color: $text-muted;
        margin-left: 6px;
      }
    }
  }

  .barber-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    justify-content: flex-end;
    max-width: 160px;

    .tag {
      font-size: 10px;
      letter-spacing: 0.06em;
      color: $text-secondary;
      border: 1px solid $border;
      padding: 3px 8px;
      border-radius: 4px;
      text-transform: uppercase;
    }
  }
}

// ─── Calendar ──────────────────────────────────────────────────────────────────
.datetime-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 36px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.calendar-section {
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: 20px;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  .cal-month {
    font-family: $font-display;
    font-size: 16px;
    color: $text-primary;
  }

  .cal-nav {
    width: 30px;
    height: 30px;
    background: none;
    border: 1px solid $border;
    color: $text-secondary;
    border-radius: $radius-sm;
    cursor: pointer;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color $transition, color $transition;

    &:hover {
      border-color: $gold-dim;
      color: $gold;
    }
  }
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 8px;

  span {
    text-align: center;
    font-size: 10px;
    letter-spacing: 0.08em;
    font-weight: 500;
    color: $text-muted;
    padding: 4px;
    text-transform: uppercase;
  }
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.cal-day {
  aspect-ratio: 1;
  background: none;
  border: 1px solid transparent;
  border-radius: $radius-sm;
  color: $text-primary;
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all $transition;
  font-family: $font-body;

  &.is-empty {
    pointer-events: none;
    visibility: hidden;
  }

  &.is-today {
    border-color: $gold-dim;
    color: $gold;
  }

  &.is-selected {
    background: $gold;
    color: $bg-base;
    font-weight: 600;
    border-color: $gold;
  }

  &.is-past,
  &.is-disabled {
    color: $text-muted;
    pointer-events: none;
    opacity: 0.4;
  }

  &:not(.is-past):not(.is-disabled):not(.is-empty):hover {
    background: rgba(201, 168, 76, 0.1);
    border-color: $border-hover;
  }
}

// ─── Time Slots ────────────────────────────────────────────────────────────────
.timeslots-section {
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.timeslots-title {
  font-size: 13px;
  font-weight: 500;
  color: $text-secondary;
  margin-bottom: 16px;
  min-height: 20px;
}

.timeslots-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.time-slot {
  background: $bg-surface;
  border: 1px solid $border;
  border-radius: $radius-sm;
  color: $text-primary;
  font-size: 12px;
  font-family: $font-mono;
  padding: 8px;
  cursor: pointer;
  transition: all $transition;
  letter-spacing: 0.04em;

  &:hover:not(:disabled) {
    border-color: $border-hover;
    background: rgba(201, 168, 76, 0.06);
  }

  &.is-selected {
    background: $gold;
    color: $bg-base;
    border-color: $gold;
    font-weight: 500;
  }

  &.is-unavailable {
    color: $text-muted;
    opacity: 0.3;
    cursor: not-allowed;
    text-decoration: line-through;
    text-decoration-color: $text-muted;
  }
}

.timeslots-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $text-muted;
  font-size: 13px;
  text-align: center;
  padding: 24px;
}

// ─── Confirm Card ──────────────────────────────────────────────────────────────
.confirm-card {
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: 24px;
  margin-bottom: 28px;

  .confirm-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid $border;

    &:first-child { padding-top: 0; }
    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .confirm-label {
      font-size: 12px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: $text-muted;
    }

    .confirm-value {
      font-size: 14px;
      color: $text-primary;
      font-weight: 400;
    }

    &.confirm-total {
      margin-top: 8px;
      padding-top: 16px;
      border-top: 1px solid $border;

      .confirm-label { font-size: 14px; font-weight: 500; color: $text-secondary; }
      .confirm-price {
        font-family: $font-display;
        font-size: 22px;
        color: $gold;
        font-weight: 700;
      }
    }
  }
}

// ─── Client Form ───────────────────────────────────────────────────────────────
.client-form {
  margin-bottom: 28px;

  .form-title {
    font-family: $font-display;
    font-size: 20px;
    font-weight: 400;
    color: $text-primary;
    margin-bottom: 20px;
    letter-spacing: -0.01em;
  }

  .form-row {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;

    label {
      font-size: 11px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: $text-muted;
      font-weight: 500;
    }

    input,
    textarea {
      background: $bg-input;
      border: 1px solid $border;
      border-radius: $radius-sm;
      color: $text-primary;
      font-family: $font-body;
      font-size: 14px;
      padding: 12px 16px;
      outline: none;
      transition: border-color $transition;
      width: 100%;
      resize: none;

      &::placeholder { color: $text-muted; }
      &:focus { border-color: $gold-dim; }
    }
  }
}

.form-error {
  background: rgba(220, 60, 60, 0.08);
  border: 1px solid rgba(220, 60, 60, 0.25);
  color: #ff7070;
  border-radius: $radius-sm;
  padding: 12px 16px;
  font-size: 13px;
  margin-bottom: 16px;
}

// ─── Buttons ───────────────────────────────────────────────────────────────────
.step-nav {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: $gold;
  color: $bg-base;
  border: none;
  border-radius: $radius-sm;
  font-family: $font-body;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.04em;
  padding: 14px 28px;
  cursor: pointer;
  transition: background $transition, transform $transition, opacity $transition;

  &:hover:not(:disabled) {
    background: $gold-light;
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .btn-arrow {
    transition: transform $transition;
  }

  &:hover:not(:disabled) .btn-arrow {
    transform: translateX(4px);
  }

  &.btn-book {
    min-width: 200px;
    justify-content: center;
  }

  &.btn-restart {
    margin-top: 24px;
  }

  &.is-loading {
    pointer-events: none;
  }
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: none;
  color: $text-secondary;
  border: 1px solid $border;
  border-radius: $radius-sm;
  font-family: $font-body;
  font-size: 13px;
  font-weight: 400;
  padding: 14px 20px;
  cursor: pointer;
  transition: color $transition, border-color $transition;

  &:hover {
    color: $text-primary;
    border-color: rgba(255, 255, 255, 0.15);
  }
}

// ─── Loading Dots ──────────────────────────────────────────────────────────────
.loading-dots {
  display: inline-flex;
  gap: 5px;
  align-items: center;

  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: $bg-base;
    animation: dot-bounce 1.2s ease-in-out infinite;

    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
}

@keyframes dot-bounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}

// ─── Success State ─────────────────────────────────────────────────────────────
.success-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 0;

  .success-icon {
    font-size: 48px;
    color: $gold;
    margin-bottom: 24px;
    animation: spin-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  .success-title {
    font-family: $font-display;
    font-size: 40px;
    font-weight: 400;
    color: $text-primary;
    margin-bottom: 16px;
    letter-spacing: -0.02em;
  }

  .success-sub {
    font-size: 15px;
    color: $text-secondary;
    max-width: 380px;
    line-height: 1.7;

    strong { color: $text-primary; font-weight: 500; }
  }

  .success-ref {
    margin-top: 24px;
    font-family: $font-mono;
    font-size: 12px;
    color: $text-muted;
    background: $bg-card;
    border: 1px solid $border;
    padding: 8px 18px;
    border-radius: $radius-sm;

    strong { color: $gold; letter-spacing: 0.08em; }
  }

  .success-sms {
    font-size: 12px;
    color: $text-muted;
    margin-top: 12px;
  }
}

@keyframes spin-in {
  from { transform: scale(0) rotate(-180deg); opacity: 0; }
  to   { transform: scale(1) rotate(0deg); opacity: 1; }
}

// ─── Transitions ───────────────────────────────────────────────────────────────
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(24px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}

// ─── Footer ────────────────────────────────────────────────────────────────────
.app-footer {
  position: relative;
  z-index: 1;
  border-top: 1px solid $border;
  padding: 32px 2rem;

  .footer-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .footer-logo {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.15em;
    color: $gold-dim;
  }

  .footer-links {
    display: flex;
    gap: 24px;

    a {
      font-size: 12px;
      color: $text-muted;
      text-decoration: none;
      transition: color $transition;

      &:hover { color: $text-secondary; }
    }
  }
}

// ─── Responsive ────────────────────────────────────────────────────────────────
@media (max-width: 768px) {
  .hero {
    padding: 48px 1.5rem 40px;
  }

  .hero-title { font-size: 42px; }

  .booking-container {
    padding: 0 1.5rem;
  }

  .services-grid {
    grid-template-columns: 1fr;
  }

  .barber-card .barber-tags {
    display: none;
  }

  .header-nav .nav-link:not(.nav-cta) {
    display: none;
  }

  .progress-step .step-label {
    display: none;
  }

  .app-footer .footer-links {
    display: none;
  }

  .step-nav {
    flex-direction: column-reverse;
    align-items: stretch;

    button { width: 100%; justify-content: center; }
  }
}
</style>