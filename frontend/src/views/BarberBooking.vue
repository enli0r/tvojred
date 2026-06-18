<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import maleBarber1 from '@/assets/img/male-barber1.jpg'
import maleBarber2 from '@/assets/img/male-barber2.jpg'
import maleBarber3 from '@/assets/img/male-barber3.jpg'
import maleBarber4 from '@/assets/img/male-barber4.jpg'



/* ---------- Tipovi ---------- */
interface Service { id: string; name: string; desc: string; duration: number; price: number }
interface Barber { id: string; name: string; role: string; exp: string; rating: number; photo: string; any?: boolean }
interface DayOption { iso: string; dayName: string; dayNum: number; monthName: string; isWeekend: boolean }

/* Zameni ovo pravom fotkom salona kad je budeš imao */
const HERO_IMAGE = 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1920&q=80'

/* ---------- Dummy podaci ---------- */
const services: Service[] = [
  { id: 'sis',     name: 'Klasično šišanje',       desc: 'Makaze i mašinica, finiš na suvo', duration: 30, price: 1200 },
  { id: 'fade',    name: 'Fade',                   desc: 'Precizan prelaz — skin ili taper',  duration: 40, price: 1500 },
  { id: 'brada',   name: 'Oblikovanje brade',      desc: 'Linija, mašinica i topli peškir',   duration: 25, price: 900 },
  { id: 'britva',  name: 'Brijanje britvom',       desc: 'Klasično mokro brijanje',           duration: 30, price: 1100 },
  { id: 'komplet', name: 'Komplet — kosa i brada', desc: 'Šišanje, brada i stajling',         duration: 60, price: 2200 },
  { id: 'pranje',  name: 'Pranje i stajling',      desc: 'Šampon, masaža i finiš',            duration: 20, price: 700 },
]

const barbers: Barber[] = [
  { id: 'milos',  name: 'Miloš',  role: 'Master barber',     exp: '12 god.', rating: 4.9, photo: maleBarber1 },
  { id: 'stefan', name: 'Stefan', role: 'Fade specijalista', exp: '7 god.',  rating: 4.8, photo: maleBarber2 },
  { id: 'nikola', name: 'Nikola', role: 'Brada i britva',    exp: '9 god.',  rating: 5.0, photo: maleBarber3 },
  { id: 'vuk',    name: 'Vuk',    role: 'Klasični rez',      exp: '5 god.',  rating: 4.9, photo: maleBarber4 },
  { id: 'any',    name: 'Bilo ko', role: 'Najraniji termin', exp: '',        rating: 0,   photo: '', any: true },
]

const dayNames = ['Ned', 'Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub']
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec']

const days: DayOption[] = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() + i)
  return {
    iso: d.toISOString().slice(0, 10),
    dayName: i === 0 ? 'Danas' : dayNames[d.getDay()],
    dayNum: d.getDate(),
    monthName: monthNames[d.getMonth()],
    isWeekend: d.getDay() === 0 || d.getDay() === 6,
  }
})

const allTimes: string[] = (() => {
  const out: string[] = []
  for (let h = 9; h < 19; h++) { out.push(`${String(h).padStart(2, '0')}:00`); out.push(`${String(h).padStart(2, '0')}:30`) }
  return out
})()

const bookedFor = (iso: string): Set<string> => {
  const seed = iso.split('-').reduce((a, p) => a + Number(p), 0)
  const s = new Set<string>()
  allTimes.forEach((t, idx) => { if ((idx * 7 + seed) % 5 === 0) s.add(t) })
  return s
}

/* ---------- Stanje ---------- */
const selectedServices = ref<Set<string>>(new Set())
const selectedBarber = ref<string | null>(null)
const selectedDay = ref<string | null>(null)
const selectedTime = ref<string | null>(null)
const form = reactive({ name: '', phone: '', email: '', note: '' })
const touched = reactive({ name: false, phone: false })
const confirmed = ref(false)
const bookingCode = ref('')
const mobileSummaryOpen = ref(false)

/* ---------- Derivati ---------- */
const chosenServices = computed(() => services.filter(s => selectedServices.value.has(s.id)))
const totalPrice = computed(() => chosenServices.value.reduce((a, s) => a + s.price, 0))
const totalDuration = computed(() => chosenServices.value.reduce((a, s) => a + s.duration, 0))
const chosenBarber = computed(() => barbers.find(b => b.id === selectedBarber.value) || null)
const chosenDay = computed(() => days.find(d => d.iso === selectedDay.value) || null)
const currentBooked = computed(() => selectedDay.value ? bookedFor(selectedDay.value) : new Set<string>())
const nameValid = computed(() => form.name.trim().length >= 2)
const phoneValid = computed(() => /^[0-9+\s/-]{6,}$/.test(form.phone.trim()))
const canConfirm = computed(() =>
  selectedServices.value.size > 0 && !!selectedBarber.value && !!selectedDay.value &&
  !!selectedTime.value && nameValid.value && phoneValid.value)

const fmtPrice = (n: number) => `${n.toLocaleString('sr-RS')} din`
const fmtDuration = (m: number) => m < 60 ? `${m} min` : (m % 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${Math.floor(m / 60)} h`)

/* ---------- Akcije ---------- */
const toggleService = (id: string) => { const n = new Set(selectedServices.value); n.has(id) ? n.delete(id) : n.add(id); selectedServices.value = n }
const pickBarber = (id: string) => { if (barbersRef.value?.dataset.dragged === '1') return; selectedBarber.value = id }
const pickDay = (iso: string) => { if (daysRef.value?.dataset.dragged === '1') return; selectedDay.value = iso; if (selectedTime.value && bookedFor(iso).has(selectedTime.value)) selectedTime.value = null }
const pickTime = (t: string) => { if (!currentBooked.value.has(t)) selectedTime.value = t }

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

const submit = () => {
  touched.name = true; touched.phone = true
  if (!canConfirm.value) { scrollTo('booking'); return }
  bookingCode.value = 'BB-' + Math.floor(1000 + Math.random() * 9000)
  confirmed.value = true; mobileSummaryOpen.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
const reset = () => {
  selectedServices.value = new Set(); selectedBarber.value = null; selectedDay.value = null; selectedTime.value = null
  Object.assign(form, { name: '', phone: '', email: '', note: '' }); Object.assign(touched, { name: false, phone: false })
  confirmed.value = false; bookingCode.value = ''
}

/* ---------- Slajderi (drag) ---------- */
const daysRef = ref<HTMLElement | null>(null)
const barbersRef = ref<HTMLElement | null>(null)
function enableDrag(el: HTMLElement | null) {
  if (!el) return
  let down = false, sx = 0, sl = 0
  el.addEventListener('pointerdown', e => { down = true; sx = e.clientX; sl = el.scrollLeft; el.dataset.dragged = '0' })
  el.addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) el.dataset.dragged = '1'; el.scrollLeft = sl - dx })
  const end = () => { down = false; setTimeout(() => { el.dataset.dragged = '0' }, 60) }
  el.addEventListener('pointerup', end); el.addEventListener('pointerleave', end); el.addEventListener('pointercancel', end)
}
onMounted(() => { enableDrag(daysRef.value); enableDrag(barbersRef.value) })
</script>

<template>
  <div class="wq3p" id="top">
    <!-- ============ HERO ============ -->
    <header class="he5d">
      <div class="hb8r"><img :src="HERO_IMAGE" alt="Enterijer salona" /></div>
      <div class="hs2c"></div>
      <div class="hi6w">
        <span class="eb0q"><span class="do2v"></span>Otvoreno danas · 09–19h</span>
        <h1 class="ht3n">Šišanje vredno tvog vremena.</h1>
        <p class="hu7j">Rezerviši termin za nekoliko sekundi — izaberi datum, uslugu i majstora. Potvrda stiže odmah.</p>
        <div class="ha1z"><button class="bt5k bp1n" @click="scrollTo('booking')">Zakaži termin</button></div>
      </div>
      <div class="hstrip">
        <span>★ 4.9 · 1.200+ recenzija</span>
        <span class="hsep"></span>
        <span>Cara Dušana 24, Beograd</span>
      </div>
    </header>

    <!-- ============ BOOKING ============ -->
    <main class="la4t" id="booking">
      <div class="fl0g" v-show="!confirmed">

        <!-- 01 DATUM -->
        <section class="sp6y" style="--d:0">
          <div class="sh8f">
            <span class="sn1d">01</span>
            <div><h2 class="st2k">Datum</h2><p class="sn5b">Narednih 14 dana — prevuci levo/desno.</p></div>
          </div>
          <div class="ds3a" ref="daysRef">
            <button v-for="d in days" :key="d.iso" type="button" class="da9m"
              :class="{ 'is-active': selectedDay === d.iso }" @click="pickDay(d.iso)">
              <span class="dn2p">{{ d.dayName }}</span>
              <span class="du7x">{{ d.dayNum }}</span>
              <span class="dm5k">{{ d.monthName }}</span>
            </button>
          </div>
        </section>

        <!-- 02 USLUGE -->
        <section class="sp6y" style="--d:1" id="usluge">
          <div class="sh8f">
            <span class="sn1d">02</span>
            <div><h2 class="st2k">Usluge</h2><p class="sn5b">Izaberi jednu ili više — cena se sabira.</p></div>
          </div>
          <div class="sv3w">
            <button v-for="s in services" :key="s.id" type="button" class="se9p"
              :class="{ 'is-active': selectedServices.has(s.id) }" @click="toggleService(s.id)">
              <span class="sm7c">
                <span class="na4x">{{ s.name }}</span>
                <span class="de1q">{{ s.desc }}</span>
              </span>
              <span class="ss8v">
                <span class="du3r">{{ fmtDuration(s.duration) }}</span>
                <span class="pr6k">{{ fmtPrice(s.price) }}</span>
              </span>
              <span class="ck0z">
                <svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </span>
            </button>
          </div>
        </section>

        <!-- 03 MAJSTOR -->
        <section class="sp6y" style="--d:2" id="frizeri">
          <div class="sh8f">
            <span class="sn1d">03</span>
            <div><h2 class="st2k">Specijalista</h2><p class="sn5b">Izaberi svog frizera ili prvi slobodan termin.</p></div>
          </div>
          <div class="ba2j" ref="barbersRef">
            <button v-for="b in barbers" :key="b.id" type="button" class="bc7n"
              :class="{ 'is-active': selectedBarber === b.id, 'is-any': b.any }" @click="pickBarber(b.id)">
              <span class="bm9t">
                <img v-if="!b.any" :src="b.photo" :alt="b.name" loading="lazy" />
                <svg v-else viewBox="0 0 24 24"><path d="M12 3l2.5 6.5L21 11l-5 4 1.6 6.5L12 18l-5.6 3.5L8 15 3 11l6.5-1.5z" fill="currentColor" /></svg>
              </span>
              <span v-if="!b.any" class="bg8q">★ {{ b.rating.toFixed(1) }}</span>
              <span class="bk2u"><svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" /></svg></span>
              <span class="bo3e">
                <span class="bn1w">{{ b.name }}</span>
                <span class="br4y">{{ b.role }}</span>
                <span class="bav"><span class="bdv"></span>{{ b.any ? 'Najraniji slobodan' : 'Slobodan danas · ' + b.exp }}</span>
              </span>
            </button>
          </div>
        </section>

        <!-- 04 VREME -->
        <section class="sp6y" style="--d:3">
          <div class="sh8f">
            <span class="sn1d">04</span>
            <div><h2 class="st2k">Vreme</h2><p class="sn5b">{{ selectedDay ? 'Precrtani termini su zauzeti.' : 'Prvo izaberi datum.' }}</p></div>
          </div>
          <div class="ti4v" :class="{ 'is-locked': !selectedDay }">
            <button v-for="t in allTimes" :key="t" type="button" class="tm8b"
              :class="{ 'is-active': selectedTime === t, 'is-booked': currentBooked.has(t) }"
              :disabled="!selectedDay || currentBooked.has(t)" @click="pickTime(t)">{{ t }}</button>
          </div>
        </section>

        <!-- 05 PODACI -->
        <section class="sp6y fo2s" style="--d:4">
          <div class="sh8f">
            <span class="sn1d">05</span>
            <div><h2 class="st2k">Tvoji podaci</h2><p class="sn5b">Da znamo koga čekamo.</p></div>
          </div>
          <div class="fi9d">
            <label class="fd3l" :class="{ 'is-error': touched.name && !nameValid }">
              <span class="fl7e">Ime i prezime</span>
              <input v-model="form.name" type="text" placeholder="npr. Marko Marković" @blur="touched.name = true" />
              <span v-if="touched.name && !nameValid" class="fe1g">Unesi ime (min. 2 slova).</span>
            </label>
            <label class="fd3l" :class="{ 'is-error': touched.phone && !phoneValid }">
              <span class="fl7e">Telefon</span>
              <input v-model="form.phone" type="tel" placeholder="06x xxx xxxx" @blur="touched.phone = true" />
              <span v-if="touched.phone && !phoneValid" class="fe1g">Unesi ispravan broj telefona.</span>
            </label>
            <label class="fd3l">
              <span class="fl7e">Email <em>(opciono)</em></span>
              <input v-model="form.email" type="email" placeholder="ime@email.com" />
            </label>
            <label class="fd3l fw4n">
              <span class="fl7e">Napomena <em>(opciono)</em></span>
              <textarea v-model="form.note" rows="2" placeholder="Posebne želje, alergije na proizvode…"></textarea>
            </label>
          </div>
        </section>
      </div>

      <!-- POTVRDA -->
      <div class="sc2q" v-if="confirmed">
        <div class="si5r">
          <svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24" fill="none" stroke="currentColor" stroke-width="2" opacity="0.35" /><path class="tick" d="M14 27l8 8 16-18" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </div>
        <h2 class="su7t">Termin je zakazan</h2>
        <p class="su3b">Poslali smo potvrdu na {{ form.phone }}. Vidimo se, {{ form.name.split(' ')[0] }}.</p>
        <div class="sd9k"><span>Kod rezervacije</span><strong>{{ bookingCode }}</strong></div>
        <div class="sr4m">
          <div class="rr1x" v-if="chosenDay"><span>Termin</span><strong>{{ chosenDay.dayName }}, {{ chosenDay.dayNum }}. {{ chosenDay.monthName }} · {{ selectedTime }}</strong></div>
          <div class="rr1x" v-if="chosenBarber"><span>Majstor</span><strong>{{ chosenBarber.name }}</strong></div>
          <div class="rr1x"><span>Usluge</span><strong>{{ chosenServices.map(s => s.name).join(', ') }}</strong></div>
          <div class="rr1x rr1x--t"><span>Ukupno</span><strong>{{ fmtPrice(totalPrice) }}</strong></div>
        </div>
        <button type="button" class="bt5k bh8w" @click="reset">Nova rezervacija</button>
      </div>

      <!-- PASS / SUMMARY -->
      <aside class="as0r" v-show="!confirmed">
        <div class="pa6m">
          <div class="pt9k"><span class="pb2x">Pregled</span><span class="pg5c">{{ chosenServices.length }} {{ chosenServices.length === 1 ? 'usluga' : 'usluge' }}</span></div>
          <div class="pd8w">
            <transition-group name="pop" tag="div" class="pl3z">
              <div v-for="s in chosenServices" :key="s.id" class="pi7q"><span class="ln1a">{{ s.name }}</span><span class="lp4b">{{ fmtPrice(s.price) }}</span></div>
            </transition-group>
            <p v-if="!chosenServices.length" class="pe2v">Još ništa nije izabrano. Kreni od datuma.</p>
            <div class="pm6h">
              <div class="mr9j"><span>Datum</span><strong v-if="chosenDay">{{ chosenDay.dayName }}, {{ chosenDay.dayNum }}. {{ chosenDay.monthName }}</strong><strong v-else>—</strong></div>
              <div class="mr9j"><span>Vreme</span><strong>{{ selectedTime || '—' }}</strong></div>
              <div class="mr9j"><span>Majstor</span><strong>{{ chosenBarber?.name || '—' }}</strong></div>
              <div class="mr9j" v-if="totalDuration"><span>Trajanje</span><strong>~ {{ fmtDuration(totalDuration) }}</strong></div>
            </div>
          </div>
          <div class="po3d"><span>Ukupno</span><strong>{{ fmtPrice(totalPrice) }}</strong></div>
          <button type="button" class="bt5k bp1n" :disabled="!canConfirm" @click="submit">Rezerviši termin</button>
          <p class="pe2v" style="text-align:center;padding:0 4px 4px">Bez plaćanja unapred · otkazivanje do 2h ranije</p>
        </div>
      </aside>
    </main>

    <!-- MOBILNI STICKY -->
    <div class="mo6f" v-show="!confirmed" :class="{ 'is-open': mobileSummaryOpen }">
      <div class="ms3p" v-if="mobileSummaryOpen">
        <div class="pm6h">
          <div class="mr9j"><span>Datum</span><strong v-if="chosenDay">{{ chosenDay.dayNum }}. {{ chosenDay.monthName }}</strong><strong v-else>—</strong></div>
          <div class="mr9j"><span>Vreme</span><strong>{{ selectedTime || '—' }}</strong></div>
          <div class="mr9j"><span>Majstor</span><strong>{{ chosenBarber?.name || '—' }}</strong></div>
          <div class="mr9j"><span>Usluge</span><strong>{{ chosenServices.length }}</strong></div>
        </div>
      </div>
      <div class="mb8c">
        <button type="button" class="mt2v" @click="mobileSummaryOpen = !mobileSummaryOpen">
          <span>{{ fmtPrice(totalPrice) }}</span><em>{{ mobileSummaryOpen ? 'Sakrij' : 'Detalji' }}</em>
        </button>
        <button type="button" class="bt5k bp1n" :disabled="!canConfirm" @click="submit">Rezerviši</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&display=swap');

$bg: #0a0a0b; $bg2: #131316; $bg3: #1b1b1f;
$line: rgba(255,255,255,.08); $line2: rgba(255,255,255,.14);
$tx: #f5f5f7; $tx2: #a1a1a6; $tx3: #68686d;
$gold: #c9a26b; $goldsoft: rgba(201,162,107,.13); $goldline: rgba(201,162,107,.45); $golddark: #1a1300;
$r: 16px; $rs: 11px;
$ease: cubic-bezier(.22,1,.36,1);
$f: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
$serif: 'Cormorant Garamond', Georgia, serif;

.wq3p { background:$bg; color:$tx; font-family:$f; -webkit-font-smoothing:antialiased; min-height:100vh;
  letter-spacing:-.011em; overflow-x:hidden;
  *, *::before, *::after { box-sizing:border-box; } }

/* ---- Dugmad (Apple stil) ---- */
.bt5k { font-family:inherit; font-size:15px; font-weight:600; cursor:pointer; border:1px solid transparent;
  border-radius:100px; padding:13px 26px; transition:opacity .2s, transform .15s, background .2s, border-color .2s; }
.bp1n { background:$tx; color:#0a0a0b;
  &:hover{ opacity:.9; } &:active{ transform:scale(.98); }
  &:disabled{ background:$bg3; color:$tx3; cursor:not-allowed; } }
.bh8w { background:rgba(255,255,255,.06); color:$tx; border-color:$line2; backdrop-filter:blur(8px);
  &:hover{ background:rgba(255,255,255,.12); } }

/* ---- Hero (centriran) ---- */
.he5d { position:relative; min-height:82vh; display:flex; flex-direction:column; align-items:center; justify-content:center;
  text-align:center; overflow:hidden; border-bottom:1px solid $line; padding:72px 24px 86px; }
.hb8r { position:absolute; inset:0; img{ width:100%; height:100%; object-fit:cover; filter:grayscale(.25) contrast(1.04) brightness(.5); } }
.hs2c { position:absolute; inset:0; background:
  radial-gradient(120% 85% at 50% 22%, rgba(10,10,11,.32), rgba(10,10,11,.84) 76%),
  linear-gradient(0deg, $bg 1%, transparent 26%); }
.hi6w { position:relative; max-width:680px; width:100%; }
.eb0q { display:inline-flex; align-items:center; gap:9px; font-size:12px; font-weight:600; letter-spacing:.18em;
  text-transform:uppercase; color:$gold; margin-bottom:22px; }
.do2v { width:7px; height:7px; border-radius:50%; background:#34c759; box-shadow:0 0 0 4px rgba(52,199,89,.16); }
.ht3n { font-size:clamp(32px,5.2vw,56px); font-weight:800; line-height:1.05; letter-spacing:-.035em; margin:0 0 18px; }
.hu7j { max-width:480px; margin:0 auto 30px; font-size:16px; line-height:1.55; color:$tx2; }
.ha1z { display:flex; justify-content:center; }
.hstrip { position:absolute; left:0; right:0; bottom:0; z-index:2; display:flex; justify-content:center; align-items:center;
  flex-wrap:wrap; gap:14px; padding:13px 20px; font-size:13px; color:$tx2;
  border-top:1px solid $line; background:rgba(10,10,11,.45); backdrop-filter:blur(12px); }
.hsep { width:4px; height:4px; border-radius:50%; background:$tx3; }

/* ---- Layout ---- */
.la4t { max-width:1180px; margin:0 auto; padding:56px 24px 0; display:grid;
  grid-template-columns:minmax(0,1fr) 340px; gap:44px; align-items:start; }
.fl0g { display:flex; flex-direction:column; gap:52px; min-width:0; }

@keyframes up { from{ opacity:0; transform:translateY(16px);} to{ opacity:1; transform:none;} }
.sp6y { animation:up .65s $ease both; animation-delay:calc(var(--d)*80ms); min-width:0; }

/* ---- Section header ---- */
.sh8f { display:flex; gap:16px; align-items:flex-start; margin-bottom:22px; }
.sn1d { font-family:$serif; font-size:22px; color:$gold; line-height:1.2; min-width:34px; border-bottom:1px solid $goldline; padding-bottom:2px; }
.st2k { font-size:23px; font-weight:600; letter-spacing:-.02em; margin:0 0 3px; }
.sn5b { font-size:14px; color:$tx3; margin:0; }

/* ---- Usluge (editorial, bez ikonica) ---- */
.sv3w { border-top:1px solid $line; }
.se9p { width:100%; display:flex; align-items:center; gap:18px; text-align:left; background:none; border:none;
  border-bottom:1px solid $line; padding:18px 8px 18px 16px; cursor:pointer; font-family:inherit; color:inherit;
  transition:background .25s; position:relative;
  &:hover{ background:rgba(255,255,255,.025); }
  &::before{ content:''; position:absolute; left:0; top:0; bottom:0; width:2px; background:$gold; transform:scaleY(0); transition:transform .3s $ease; }
  &.is-active::before{ transform:scaleY(1); } }
.sm7c { flex:1; min-width:0; display:flex; flex-direction:column; gap:3px; }
.na4x { font-size:16px; font-weight:600; }
.de1q { font-size:13px; color:$tx3; }
.ss8v { flex:0 0 auto; display:flex; flex-direction:column; align-items:flex-end; gap:3px; }
.du3r { font-size:12px; color:$tx3; }
.pr6k { font-size:15px; font-weight:600; font-variant-numeric:tabular-nums; }
.ck0z { flex:0 0 auto; width:24px; height:24px; border-radius:50%; border:1.5px solid $line2; display:grid; place-items:center;
  color:transparent; transition:all .25s $ease; svg{ width:14px; height:14px; } }
.se9p.is-active { .pr6k{ color:$gold; } .ck0z{ background:$gold; border-color:$gold; color:#0a0a0b; } }

/* ---- Frizeri (slider) ---- */
.ba2j { display:flex; gap:14px; overflow-x:auto; padding:16px 2px 14px; scroll-snap-type:x proximity; cursor:grab;
  scrollbar-width:none; &::-webkit-scrollbar{ display:none; } &:active{ cursor:grabbing; } }
.bc7n { flex:0 0 184px; scroll-snap-align:start; position:relative; aspect-ratio:3/4; border-radius:$r; overflow:hidden;
  border:1px solid $line; background:$bg2; cursor:pointer; padding:0; font-family:inherit; color:inherit;
  transition:transform .4s $ease, border-color .3s, box-shadow .3s;
  &:hover{ transform:translateY(-4px); border-color:$line2; box-shadow:0 18px 40px -22px rgba(0,0,0,.9); } }
.bm9t { position:absolute; inset:0; display:grid; place-items:center; color:$gold;
  img{ width:100%; height:100%; object-fit:cover; filter:grayscale(.4) brightness(.82); transition:filter .4s, transform .7s $ease; }
  svg{ width:48px; height:48px; opacity:.55; } }
.bc7n:hover .bm9t img{ transform:scale(1.06); }
.bc7n.is-any .bm9t{ background:radial-gradient(120% 90% at 50% 25%, $goldsoft, $bg2 70%); }
.bo3e { position:absolute; left:0; right:0; bottom:0; padding:46px 14px 14px; text-align:left;
  background:linear-gradient(0deg, rgba(7,7,8,.95) 14%, rgba(7,7,8,.55) 55%, transparent); display:flex; flex-direction:column; gap:2px; }
.bn1w { font-size:17px; font-weight:700; letter-spacing:-.02em; }
.br4y { font-size:12px; color:$gold; font-weight:500; }
.bav { display:flex; align-items:center; gap:6px; margin-top:5px; font-size:11px; color:$tx2; }
.bdv { width:6px; height:6px; border-radius:50%; background:#34c759; box-shadow:0 0 0 3px rgba(52,199,89,.18); }
.bg8q { position:absolute; top:11px; left:11px; z-index:2; font-size:12px; font-weight:600; color:$gold;
  background:rgba(7,7,8,.6); backdrop-filter:blur(6px); border:1px solid $goldline; border-radius:100px; padding:3px 9px; }
.bk2u { position:absolute; top:10px; right:10px; z-index:2; width:26px; height:26px; border-radius:50%; background:$gold; color:#0a0a0b;
  display:grid; place-items:center; opacity:0; transform:scale(.6); transition:all .25s $ease; svg{ width:15px; height:15px; } }
.bc7n.is-active { border-color:$gold; box-shadow:0 0 0 1px rgba(201,162,107,.22) inset, 0 2px 8px rgba(0,0,0,.12);
  .bm9t img{ filter:grayscale(0) brightness(.95); } .bk2u{ opacity:1; transform:scale(1); } }

/* ---- Dani (slider, bez strelica, veći razmaci) ---- */
.ds3a { display:flex; gap:10px; overflow-x:auto; padding:2px; scroll-snap-type:x proximity; cursor:grab;
  scrollbar-width:none; &::-webkit-scrollbar{ display:none; } &:active{ cursor:grabbing; } }
.da9m { flex:0 0 auto; width:66px; scroll-snap-align:start; background:$bg2; border:1px solid $line; border-radius:$rs;
  padding:14px 0; cursor:pointer; font-family:inherit; color:inherit; display:flex; flex-direction:column; align-items:center; gap:8px;
  transition:all .25s $ease; &:hover{ border-color:$goldline; } }
.dn2p { font-size:10px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:$tx3; }
.du7x { font-size:18px; font-weight:700; line-height:1; }
.dm5k { font-size:10px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:$tx3; }
.da9m.is-active { background:$gold; border-color:$gold; color:$golddark; .dn2p, .dm5k{ color:rgba(26,19,0,.65); } }

/* ---- Vreme (zlatna selekcija, crn tekst) ---- */
.ti4v { display:grid; grid-template-columns:repeat(auto-fill,minmax(74px,1fr)); gap:9px; transition:opacity .3s;
  &.is-locked{ opacity:.4; pointer-events:none; } }
.tm8b { background:$bg2; border:1px solid $line; border-radius:$rs; padding:11px 0; font-size:14px; font-weight:500;
  font-variant-numeric:tabular-nums; cursor:pointer; font-family:inherit; color:$tx; transition:all .2s $ease;
  &:hover:not(:disabled):not(.is-active){ border-color:$goldline; color:$gold; }
  &.is-active{ background:$gold; border-color:$gold; color:$golddark; }
  &.is-booked, &:disabled{ color:$tx3; cursor:not-allowed; background:transparent; text-decoration:line-through; opacity:.5; } }

/* ---- Forma ---- */
.fi9d { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.fd3l { display:flex; flex-direction:column; gap:7px; min-width:0; &.fw4n{ grid-column:1/-1; } }
.fl7e { font-size:13px; color:$tx2; em{ color:$tx3; font-style:normal; } }
.fe1g { font-size:12px; color:#ff6b6b; }
.fd3l input, .fd3l textarea { width:100%; max-width:100%; background:$bg2; border:1px solid $line; border-radius:$rs;
  padding:13px 14px; color:$tx; font-size:15px; font-family:inherit; transition:border-color .2s, background .2s; resize:vertical;
  &::placeholder{ color:$tx3; } &:focus{ outline:none; border-color:$goldline; background:$bg3; } }
.fd3l.is-error input{ border-color:rgba(255,107,107,.6); }

/* ---- Pass ---- */
.as0r { position:sticky; top:28px; }
.pa6m { background:$bg2; border:1px solid $line2; border-radius:18px; overflow:hidden;
  box-shadow:0 24px 50px -28px rgba(0,0,0,.8); animation:up .65s $ease both; animation-delay:.2s; }
.pt9k { display:flex; justify-content:space-between; align-items:center; padding:16px 18px; border-bottom:1px solid $line; }
.pb2x { font-size:13px; font-weight:600; letter-spacing:.06em; text-transform:uppercase; color:$tx2; }
.pg5c { font-size:12px; color:$gold; border:1px solid $goldline; border-radius:100px; padding:3px 10px; }
.pd8w { padding:16px 18px; }
.pl3z { display:flex; flex-direction:column; gap:9px; }
.pi7q { display:flex; justify-content:space-between; font-size:14px; .lp4b{ color:$tx2; font-variant-numeric:tabular-nums; } }
.pe2v { font-size:13px; color:$tx3; line-height:1.5; margin:4px 0; }
.pm6h { margin-top:16px; padding-top:14px; border-top:1px solid $line; display:flex; flex-direction:column; gap:10px; }
.mr9j { display:flex; justify-content:space-between; font-size:14px; span{ color:$tx3; } strong{ font-weight:600; } }
.po3d { display:flex; justify-content:space-between; align-items:baseline; padding:15px 18px; border-top:1px solid $line;
  span{ color:$tx2; font-size:14px; } strong{ font-size:24px; font-weight:700; font-variant-numeric:tabular-nums; } }
.pa6m .bt5k { width:calc(100% - 36px); margin:0 18px 12px; border-radius:13px; padding:14px; }

.pop-enter-active{ transition:all .3s $ease; } .pop-leave-active{ transition:all .2s $ease; }
.pop-enter-from{ opacity:0; transform:translateX(-6px); } .pop-leave-to{ opacity:0; transform:translateX(6px); }

/* ---- Success ---- */
.sc2q { grid-column:1/-1; max-width:440px; margin:24px auto 64px; text-align:center; animation:up .6s $ease both; }
.si5r { color:$gold; display:inline-block; margin-bottom:16px; svg{ width:62px; height:62px; }
  .tick{ stroke-dasharray:60; stroke-dashoffset:60; animation:draw .55s $ease .2s forwards; } }
@keyframes draw{ to{ stroke-dashoffset:0; } }
.su7t { font-size:30px; font-weight:700; letter-spacing:-.03em; margin:0 0 8px; }
.su3b { color:$tx2; font-size:15px; line-height:1.5; margin:0 0 22px; }
.sd9k { display:inline-flex; flex-direction:column; gap:3px; background:$goldsoft; border:1px solid $goldline;
  border-radius:13px; padding:11px 26px; margin-bottom:22px;
  span{ font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:$gold; } strong{ font-size:22px; font-weight:700; } }
.sr4m { text-align:left; background:$bg2; border:1px solid $line; border-radius:$r; padding:6px 18px; margin-bottom:18px; }
.rr1x { display:flex; justify-content:space-between; gap:16px; padding:12px 0; border-bottom:1px solid $line; font-size:14px;
  &:last-child{ border-bottom:none; } span{ color:$tx3; flex:0 0 auto; } strong{ font-weight:600; text-align:right; } &--t strong{ color:$gold; } }

/* ---- Mobilni bar ---- */
.mo6f { display:none; }

/* ---- Responsive ---- */
@media (max-width:920px){
  .la4t { grid-template-columns:1fr; padding:40px 20px 0; gap:40px; }
  .as0r { display:none; }
  .mo6f { display:block; position:fixed; left:0; right:0; bottom:0; z-index:55;
    background:rgba(14,14,16,.92); backdrop-filter:blur(20px); border-top:1px solid $line2; }
  .ms3p { padding:14px 18px 4px; border-bottom:1px solid $line; }
  .mb8c { display:flex; align-items:center; gap:12px; padding:11px 16px calc(11px + env(safe-area-inset-bottom)); }
  .mt2v { flex:1; text-align:left; background:none; border:none; cursor:pointer; font-family:inherit; color:inherit; display:flex; flex-direction:column;
    span{ font-size:20px; font-weight:700; font-variant-numeric:tabular-nums; } em{ font-style:normal; font-size:12px; color:$tx3; } }
  .mb8c .bt5k{ flex:0 0 auto; padding:13px 26px; }
  .wq3p{ padding-bottom:90px; }
}
@media (max-width:560px){
  .fi9d { grid-template-columns:1fr; }
  .he5d { min-height:78vh; padding:60px 20px 90px; }
  .ht3n { font-size:clamp(30px,8vw,46px); }
  .ti4v { grid-template-columns:repeat(auto-fill,minmax(66px,1fr)); }
  .se9p { gap:13px; padding:16px 4px 16px 14px; }
}

/* ---- Reduced motion ---- */
@media (prefers-reduced-motion:reduce){
  .sp6y, .pa6m, .sc2q{ animation:none; } .tick{ animation:none; stroke-dashoffset:0; }
  *, *::before, *::after{ transition-duration:.01ms !important; }
}
</style>