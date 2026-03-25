<template>
  <div class="bg">
    <div class="sun-wrap">
      <div class="sun-halo3"></div>
      <div class="sun-halo2"></div>
      <div class="sun-halo1"></div>
      <svg class="sun-rays" viewBox="0 0 320 320" fill="none">
        <g stroke="#F5B027" stroke-width="3" stroke-linecap="round" opacity="0.5">
          <line x1="160" y1="8"   x2="160" y2="40"/>
          <line x1="160" y1="280" x2="160" y2="312"/>
          <line x1="8"   y1="160" x2="40"  y2="160"/>
          <line x1="280" y1="160" x2="312" y2="160"/>
          <line x1="52"  y1="52"  x2="74"  y2="74"/>
          <line x1="246" y1="246" x2="268" y2="268"/>
          <line x1="268" y1="52"  x2="246" y2="74"/>
          <line x1="74"  y1="246" x2="52"  y2="268"/>
          <line x1="107" y1="18"  x2="114" y2="46"/>
          <line x1="213" y1="274" x2="206" y2="302"/>
          <line x1="18"  y1="107" x2="46"  y2="114"/>
          <line x1="274" y1="213" x2="302" y2="206"/>
          <line x1="213" y1="18"  x2="206" y2="46"/>
          <line x1="107" y1="274" x2="114" y2="302"/>
          <line x1="302" y1="107" x2="274" y2="114"/>
          <line x1="46"  y1="213" x2="18"  y2="206"/>
        </g>
      </svg>
      <div class="sun-core"></div>
    </div>

    <div class="cloud cloud1"></div>
    <div class="cloud cloud2"></div>
    <div class="cloud cloud3"></div>

    <div class="landscape">
      <div class="hill hill2"></div>
      <div class="hill hill1"></div>
      <div class="panels-scene">
        <div class="panel-3d" v-for="n in 6" :key="n"></div>
      </div>
    </div>
  </div>

  <div class="page">
    <div class="card" :class="{ shake: isShaking }">

      <div class="success-overlay" :class="{ show: loginSuccess }">
        <div class="success-circle">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="success-text">¡Bienvenido!</div>
        <div class="success-sub">Cargando el sistema…</div>
      </div>

      <div class="logo-area">
        <div class="logo-icon">
          <svg viewBox="0 0 30 30" fill="none">
            <circle cx="15" cy="15" r="4.5" fill="white" stroke="rgba(255,255,255,0.5)" stroke-width="1"/>
            <line x1="15" y1="2"  x2="15" y2="6"  stroke="white" stroke-width="2" stroke-linecap="round"/>
            <line x1="15" y1="24" x2="15" y2="28" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <line x1="2"  y1="15" x2="6"  y2="15" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <line x1="24" y1="15" x2="28" y2="15" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <line x1="5.8"  y1="5.8"  x2="8.6"  y2="8.6"  stroke="white" stroke-width="2" stroke-linecap="round"/>
            <line x1="21.4" y1="21.4" x2="24.2" y2="24.2" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <line x1="24.2" y1="5.8"  x2="21.4" y2="8.6"  stroke="white" stroke-width="2" stroke-linecap="round"/>
            <line x1="8.6"  y1="21.4" x2="5.8"  y2="24.2" stroke="white" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="brand-name">Soin<span>solar</span></div>
        <div class="brand-tag">Portal de Cotizaciones</div>
      </div>

      <div class="form-title">Ingresa tus credenciales para continuar</div>

      <form @submit.prevent="handleLogin" novalidate>

        <div class="field" :class="{ error: errors.user }">
          <label>Usuario</label>
          <div class="input-wrap">
            <span class="input-icon">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </span>
            <input v-model="form.user" type="text" placeholder="Ej: soinsolar"
              autocomplete="username" @input="errors.user = false"/>
          </div>
          <div class="field-error">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Ingresa un usuario válido
          </div>
        </div>

        <div class="field" :class="{ error: errors.pass }">
          <label>Contraseña</label>
          <div class="input-wrap">
            <span class="input-icon">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </span>
            <input v-model="form.pass" :type="showPass ? 'text' : 'password'" placeholder="••••••••"
              autocomplete="current-password" @input="errors.pass = false"/>
            <button type="button" class="toggle-pw" @click="showPass = !showPass">
              <svg v-if="!showPass" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            </button>
          </div>
          <div class="field-error">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Ingresa tu contraseña
          </div>
        </div>

        <div class="options-row">
          <label class="remember">
            <input type="checkbox" v-model="form.remember"/>
            <span class="checkmark" :class="{ checked: form.remember }"></span>
            <span>Recordarme</span>
          </label>
          <a href="#" class="forgot" @click.prevent>¿Olvidaste tu clave?</a>
        </div>

        <button type="submit" class="submit-btn" :disabled="loading">
          <template v-if="!loading">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Ingresar al sistema
          </template>
          <template v-else>
            <div class="spinner-ring"></div>
            Verificando…
          </template>
        </button>

        <div class="divider">
          <div class="divider-line"></div>
          <span>acceso seguro</span>
          <div class="divider-line"></div>
        </div>

        <div class="hint">
          ¿Necesitas acceso? Contacta a<br/>
          <strong>admin@soinsolar.com</strong>
        </div>
      </form>
    </div>
  </div>

  <div class="toast" :class="{ show: toastVisible }">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    {{ toastMsg }}
  </div>

  <div class="footer-note">© 2025 Soinsolar S.A.S — Todos los derechos reservados</div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const emit = defineEmits(['login-success'])

const CREDENTIALS = [
  { user: 'aldair',         pass: 'aldair2025'         },
  { user: 'mauricio',       pass: 'mauricio2025'       },
  { user: 'juansebastian',  pass: 'juansebastian2025'  },
  { user: 'santiago',       pass: 'santiago2025'       },
  { user: 'mario',          pass: 'mario2025'          },
  { user: 'wilson',         pass: 'wilson2025'         },
  { user: 'juan',           pass: 'juan2025'           },
]

const form = reactive({ user: '', pass: '', remember: false })
const errors = reactive({ user: false, pass: false })
const showPass     = ref(false)
const loading      = ref(false)
const loginSuccess = ref(false)
const isShaking    = ref(false)
const toastVisible = ref(false)
const toastMsg     = ref('')

const showToast = (msg) => {
  toastMsg.value = msg
  toastVisible.value = true
  setTimeout(() => { toastVisible.value = false }, 3500)
}
const shake = () => {
  isShaking.value = true
  setTimeout(() => { isShaking.value = false }, 500)
}
const handleLogin = async () => {
  let valid = true
  if (!form.user.trim()) { errors.user = true; valid = false }
  if (!form.pass)        { errors.pass = true; valid = false }
  if (!valid) return
  loading.value = true
  await new Promise(r => setTimeout(r, 1200))
  const ok = CREDENTIALS.some(c => c.user === form.user.trim() && c.pass === form.pass)
  if (ok) {
    loginSuccess.value = true
    sessionStorage.setItem('soinsolar_auth', '1')
    sessionStorage.setItem('soinsolar_user', form.user.trim())
    setTimeout(() => { emit('login-success') }, 1800)
  } else {
    loading.value = false
    errors.user = true
    errors.pass = true
    shake()
    showToast('Usuario o contraseña incorrectos')
  }
}
</script>

<style scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }

.bg {
  position: fixed; inset: 0; z-index: 0; overflow: hidden;
  background: linear-gradient(160deg, #0d1630 0%, #1f2c51 40%, #162040 65%, #0d1630 100%);
}

/* Destellos dorados de fondo */
.bg::before {
  content: '';
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 60% 40% at 50% 20%, rgba(245,176,39,0.18) 0%, transparent 70%),
    radial-gradient(ellipse 80% 30% at 50% 100%, rgba(245,176,39,0.12) 0%, transparent 60%);
  pointer-events: none;
}

/* SOL */
.sun-wrap {
  position: absolute; top: 5%; left: 50%; transform: translateX(-50%);
  display: flex; align-items: center; justify-content: center;
}
.sun-halo1, .sun-halo2, .sun-halo3 { position: absolute; border-radius: 50%; pointer-events: none; }
.sun-halo1 { width: 190px; height: 190px; background: radial-gradient(circle, rgba(255,218,40,0.30) 0%, transparent 70%); animation: halo 4s ease-in-out infinite; }
.sun-halo2 { width: 280px; height: 280px; background: radial-gradient(circle, rgba(255,200,20,0.15) 0%, transparent 70%); animation: halo 4s ease-in-out infinite 0.6s; }
.sun-halo3 { width: 380px; height: 380px; background: radial-gradient(circle, rgba(255,180,0,0.07) 0%, transparent 70%); animation: halo 4s ease-in-out infinite 1.2s; }
@keyframes halo { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.08);opacity:0.75} }

.sun-core {
  width: 108px; height: 108px; border-radius: 50%; position: relative; z-index: 2;
  background: radial-gradient(circle at 36% 30%, #fffbcc 0%, #ffe345 28%, #F5B027 62%, #d97706 100%);
  box-shadow: 0 0 0 8px rgba(255,220,50,0.18), 0 0 35px rgba(245,176,39,0.60), 0 0 80px rgba(245,176,39,0.25), 0 6px 24px rgba(180,120,0,0.18);
  animation: sun-pulse 4s ease-in-out infinite;
}
@keyframes sun-pulse {
  0%,100%{box-shadow:0 0 0 8px rgba(255,220,50,0.18),0 0 35px rgba(245,176,39,0.60),0 0 80px rgba(245,176,39,0.25)}
  50%{box-shadow:0 0 0 14px rgba(255,220,50,0.24),0 0 55px rgba(245,176,39,0.78),0 0 120px rgba(245,176,39,0.36)}
}

.sun-rays {
  position: absolute; width: 320px; height: 320px;
  top: 50%; left: 50%; transform: translate(-50%,-50%);
  animation: spin-rays 28s linear infinite; z-index: 1;
}
@keyframes spin-rays { to{transform:translate(-50%,-50%) rotate(360deg)} }

/* NUBES */
.cloud { position: absolute; background: rgba(245,176,39,0.08); border-radius: 50px; opacity: 1; box-shadow: 0 0 20px rgba(245,176,39,0.06); }
.cloud::before, .cloud::after { content:''; position:absolute; background:rgba(245,176,39,0.08); border-radius:50%; }
.cloud1 { width:130px; height:42px; top:13%; left:7%; animation:drift 20s linear infinite; }
.cloud1::before { width:58px; height:58px; top:-24px; left:14px; }
.cloud1::after  { width:42px; height:42px; top:-16px; left:60px; }
.cloud2 { width:96px; height:30px; top:20%; right:10%; animation:drift 26s linear infinite reverse; opacity:0.75; }
.cloud2::before { width:42px; height:42px; top:-18px; left:12px; }
.cloud2::after  { width:30px; height:30px; top:-11px; left:46px; }
.cloud3 { width:76px; height:24px; top:9%; left:58%; animation:drift 32s linear infinite; opacity:0.65; }
.cloud3::before { width:32px; height:32px; top:-14px; left:10px; }
.cloud3::after  { width:24px; height:24px; top:-9px; left:38px; }
@keyframes drift { 0%{transform:translateX(0)} 50%{transform:translateX(40px)} 100%{transform:translateX(0)} }

/* PAISAJE */
.landscape { position:absolute; bottom:0; left:0; right:0; height:42%; }
.hill { position:absolute; bottom:0; border-radius:50% 50% 0 0; }
.hill1 { width:120%; height:72%; left:-10%; background:linear-gradient(180deg,#162444 0%,#1f2c51 60%,#0d1630 100%); }
.hill2 { width:90%; height:52%; right:-5%; background:linear-gradient(180deg,#1a2d5a 0%,#162444 60%,#0d1630 100%); z-index:1; }

.panels-scene {
  position:absolute; bottom:30%; left:50%; transform:translateX(-50%);
  display:flex; gap:12px; align-items:flex-end; z-index:2;
}
.panel-3d {
  width:56px; height:40px;
  background:linear-gradient(145deg,#1e3a8a 0%,#1d4ed8 45%,#3b82f6 100%);
  border:1.5px solid rgba(147,197,253,0.65); border-radius:3px;
  transform:perspective(280px) rotateX(18deg);
  box-shadow:0 6px 18px rgba(0,0,0,0.22),0 0 16px rgba(59,130,246,0.28),inset 0 1px 0 rgba(255,255,255,0.12);
  position:relative; animation:panel-glow 3s ease-in-out infinite;
}
.panel-3d::before { content:''; position:absolute; top:50%; left:0; right:0; height:1px; background:rgba(147,197,253,0.5); }
.panel-3d::after  { content:''; position:absolute; left:50%; top:0; bottom:0; width:1px; background:rgba(147,197,253,0.3); }
.panel-3d:nth-child(1){animation-delay:0s;height:34px}
.panel-3d:nth-child(2){animation-delay:.3s;height:40px}
.panel-3d:nth-child(3){animation-delay:.6s;height:42px}
.panel-3d:nth-child(4){animation-delay:.9s;height:42px}
.panel-3d:nth-child(5){animation-delay:1.2s;height:40px}
.panel-3d:nth-child(6){animation-delay:1.5s;height:34px}
@keyframes panel-glow {
  0%,100%{box-shadow:0 6px 18px rgba(0,0,0,0.22),0 0 16px rgba(59,130,246,0.28)}
  50%{box-shadow:0 6px 18px rgba(0,0,0,0.22),0 0 24px rgba(245,176,39,0.60)}
}

/* PÁGINA */
.page {
  position:relative; z-index:10; width:100%; min-height:100vh;
  display:flex; align-items:center; justify-content:center; padding:20px;
}

/* TARJETA BLANCA */
.card {
  width:100%; max-width:432px; background:#ffffff; border-radius:24px;
  padding:46px 44px 42px;
  box-shadow:0 2px 4px rgba(0,0,0,0.04),0 8px 24px rgba(0,0,0,0.08),0 24px 64px rgba(0,0,0,0.10),0 0 0 1px rgba(0,0,0,0.04);
  animation:card-in 0.8s cubic-bezier(0.34,1.3,0.64,1) both;
  position:relative; overflow:hidden;
}
.card::before {
  content:''; position:absolute; top:0; left:0; right:0; height:5px;
  background:linear-gradient(90deg,#1f2c51 0%,#F5B027 50%,#1f2c51 100%);
  background-size:200% 100%; animation:bar-move 4s linear infinite;
}
@keyframes bar-move { 0%{background-position:0% 0%} 100%{background-position:200% 0%} }
.card.shake { animation:card-shake 0.45s ease; }
@keyframes card-in { from{opacity:0;transform:translateY(28px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
@keyframes card-shake {
  0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)}
  40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)}
}

/* OVERLAY ÉXITO */
.success-overlay {
  position:absolute; inset:0; border-radius:24px; background:rgba(255,255,255,0.97);
  display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px;
  opacity:0; pointer-events:none; transition:opacity 0.4s ease; z-index:20;
}
.success-overlay.show { opacity:1; pointer-events:all; }
.success-circle {
  width:78px; height:78px; border-radius:50%;
  background:linear-gradient(135deg,#10b981,#059669);
  display:flex; align-items:center; justify-content:center;
  box-shadow:0 0 0 14px rgba(16,185,129,0.10),0 8px 32px rgba(16,185,129,0.35);
  animation:pop 0.5s cubic-bezier(0.34,1.6,0.64,1) both;
}
@keyframes pop { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
.success-text { font-size:22px; font-weight:800; color:#1f2c51; font-family:'Montserrat',sans-serif; }
.success-sub  { font-size:13px; color:#64748b; }

/* LOGO */
.logo-area {
  display:flex; flex-direction:column; align-items:center;
  margin-bottom:28px; animation:fade-down 0.6s ease both 0.1s;
}
@keyframes fade-down { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
.logo-icon {
  width:66px; height:66px; border-radius:18px;
  background:linear-gradient(135deg,#1f2c51 0%,#2d4080 55%,#F5B027 100%);
  display:flex; align-items:center; justify-content:center;
  margin-bottom:14px;
  box-shadow:0 8px 24px rgba(31,44,81,0.28),0 2px 6px rgba(0,0,0,0.10);
  position:relative; overflow:hidden;
}
.logo-icon::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,0.22) 0%,transparent 55%); }
.logo-icon svg { width:32px; height:32px; position:relative; z-index:1; }
.brand-name { font-family:'Montserrat',sans-serif; font-size:30px; font-weight:800; color:#1e293b; letter-spacing:-0.5px; line-height:1; }
.brand-name span { color:#F5B027; }
.brand-tag { font-size:11px; font-weight:600; color:#94a3b8; letter-spacing:2.5px; text-transform:uppercase; margin-top:6px; }

/* FORM */
.form-title { font-size:14px; font-weight:500; color:#475569; text-align:center; margin-bottom:26px; line-height:1.6; animation:fade-down 0.6s ease both 0.2s; }
.field { margin-bottom:18px; animation:fade-up 0.5s ease both; }
.field:nth-child(1){animation-delay:.25s}
.field:nth-child(2){animation-delay:.35s}
@keyframes fade-up { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }

.field label { display:block; font-size:12px; font-weight:700; letter-spacing:0.8px; text-transform:uppercase; color:#1e293b; margin-bottom:7px; padding-left:1px; }
.input-wrap { position:relative; display:flex; align-items:center; }
.input-icon { position:absolute; left:14px; color:#94a3b8; transition:color 0.25s; pointer-events:none; display:flex; }
.input-wrap:focus-within .input-icon { color:#F5B027; }

.field input {
  width:100%; height:52px; padding:0 46px;
  background:#f8fafc; border:2px solid #e2e8f0; border-radius:12px;
  color:#1e293b; font-size:15px; outline:none; transition:all 0.25s ease; font-family:inherit;
}
.field input::placeholder { color:#b8c5d4; }
.field input:focus { background:#ffffff; border-color:#F5B027; box-shadow:0 0 0 4px rgba(245,176,39,0.14); }
.field.error input { border-color:#ef4444; background:#fff8f8; box-shadow:0 0 0 4px rgba(239,68,68,0.09); }

.field-error { display:none; align-items:center; gap:5px; font-size:12px; color:#ef4444; font-weight:600; margin-top:6px; padding-left:1px; }
.field.error .field-error { display:flex; }

.toggle-pw { position:absolute; right:12px; background:none; border:none; cursor:pointer; color:#94a3b8; display:flex; padding:5px; border-radius:7px; transition:all 0.2s; }
.toggle-pw:hover { color:#F5B027; background:rgba(245,176,39,0.09); }

/* OPCIONES */
.options-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:22px; animation:fade-up 0.5s ease both 0.4s; }
.remember { display:flex; align-items:center; gap:8px; cursor:pointer; user-select:none; }
.checkmark { width:19px; height:19px; border:2px solid #cbd5e1; border-radius:5px; background:#f8fafc; display:flex; align-items:center; justify-content:center; transition:all 0.2s; flex-shrink:0; position:relative; }
.checkmark.checked { background:#F5B027; border-color:#F5B027; }
.checkmark.checked::after { content:''; width:5px; height:9px; border:2px solid white; border-top:none; border-left:none; transform:rotate(45deg) translateY(-1px); display:block; }
.remember span:last-child { font-size:13px; color:#475569; font-weight:500; }
.forgot { font-size:13px; color:#E89B1C; text-decoration:none; font-weight:600; transition:color 0.2s; }
.forgot:hover { color:#d97706; text-decoration:underline; }

/* BOTÓN */
.submit-btn {
  width:100%; height:54px;
  background:linear-gradient(135deg,#1f2c51 0%,#2d3f70 100%);
  border:none; border-radius:13px; color:white; font-size:15px; font-weight:700;
  cursor:pointer; transition:all 0.3s ease;
  box-shadow:0 6px 20px rgba(31,44,81,0.30),0 2px 6px rgba(0,0,0,0.12);
  animation:fade-up 0.5s ease both 0.45s;
  display:flex; align-items:center; justify-content:center; gap:9px;
  font-family:'Montserrat',sans-serif; position:relative; overflow:hidden;
}
.submit-btn::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,0.08) 0%,transparent 60%); }
.submit-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 10px 30px rgba(31,44,81,0.38); background:linear-gradient(135deg,#243367 0%,#344a84 100%); }
.submit-btn:active:not(:disabled) { transform:translateY(0); }
.submit-btn:disabled { opacity:0.65; cursor:not-allowed; }

.spinner-ring { width:18px; height:18px; border:2.5px solid rgba(255,255,255,0.30); border-top-color:white; border-radius:50%; animation:spin 0.7s linear infinite; flex-shrink:0; }
@keyframes spin { to{transform:rotate(360deg)} }

/* DIVIDER */
.divider { display:flex; align-items:center; gap:12px; margin:22px 0; animation:fade-up 0.5s ease both 0.5s; }
.divider-line { flex:1; height:1px; background:#e2e8f0; }
.divider span { font-size:11px; font-weight:600; color:#94a3b8; letter-spacing:1.2px; text-transform:uppercase; }

/* HINT */
.hint { text-align:center; font-size:13px; color:#64748b; animation:fade-up 0.5s ease both 0.55s; line-height:1.75; }
.hint strong { color:#1f2c51; font-weight:700; }

/* TOAST */
.toast {
  position:fixed; bottom:28px; left:50%;
  transform:translateX(-50%) translateY(16px);
  background:#fff5f5; border:1.5px solid #fca5a5; border-radius:12px;
  padding:11px 20px; color:#dc2626; font-size:13px; font-weight:600;
  box-shadow:0 4px 20px rgba(220,38,38,0.15);
  opacity:0; transition:all 0.3s ease; pointer-events:none;
  white-space:nowrap; z-index:200; display:flex; align-items:center; gap:7px;
}
.toast.show { opacity:1; transform:translateX(-50%) translateY(0); }

/* FOOTER */
.footer-note { position:fixed; bottom:12px; left:0; right:0; text-align:center; font-size:11.5px; color:rgba(255,255,255,0.30); letter-spacing:0.3px; z-index:10; animation:fade-up 1s ease both 1s; }

/* RESPONSIVE */
@media (max-width: 480px) {
  .card { padding:36px 24px 32px; }
  .brand-name { font-size:26px; }
  .panels-scene { gap:9px; }
  .panel-3d { width:44px; height:32px; }
  .sun-core { width:82px; height:82px; }
  .sun-halo1 { width:150px; height:150px; }
  .sun-halo2 { width:220px; height:220px; }
  .sun-halo3 { width:300px; height:300px; }
}
</style>