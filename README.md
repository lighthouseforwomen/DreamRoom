:root {
  --ink: #271b1f;
  --muted: #7b6264;
  --cream: #fff7ea;
  --paper: rgba(255, 250, 239, 0.82);
  --paper-solid: #fffaf0;
  --rose: #d9979c;
  --rose-deep: #9d5663;
  --wine: #6b2b45;
  --gold: #d7ad67;
  --sage: #a8b99a;
  --sea: #8db7bb;
  --violet: #9878c9;
  --shadow: 0 28px 90px rgba(68, 36, 45, 0.22);
  --soft-shadow: 0 16px 45px rgba(68, 36, 45, 0.13);
  --radius-xl: 34px;
  --radius-lg: 24px;
  --radius-md: 16px;
  --max: 1180px;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  color: var(--ink);
  min-height: 100vh;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background:
    radial-gradient(circle at 15% 8%, rgba(215, 173, 103, 0.34), transparent 26rem),
    radial-gradient(circle at 86% 12%, rgba(152, 120, 201, 0.25), transparent 29rem),
    radial-gradient(circle at 50% 102%, rgba(141, 183, 187, 0.28), transparent 34rem),
    linear-gradient(135deg, #fff6e9 0%, #fde6df 34%, #f8e7f0 64%, #ecf1ed 100%);
  overflow-x: hidden;
}

body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.3;
  background-image:
    linear-gradient(rgba(255,255,255,0.32) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.24) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: linear-gradient(to bottom, black, transparent 78%);
  z-index: -1;
}

.ambient {
  position: fixed;
  width: 38rem;
  height: 38rem;
  border-radius: 999px;
  filter: blur(44px);
  opacity: 0.42;
  pointer-events: none;
  z-index: -2;
  animation: floatAmbient 15s ease-in-out infinite alternate;
}
.ambient-one { background: #ffd3aa; left: -18rem; top: 12vh; }
.ambient-two { background: #e8a0ba; right: -16rem; top: -5rem; animation-delay: 2s; }
.ambient-three { background: #9bd4d2; left: 36%; bottom: -18rem; animation-delay: 4s; }

@keyframes floatAmbient {
  from { transform: translate3d(0, 0, 0) scale(1); }
  to { transform: translate3d(3rem, -2rem, 0) scale(1.08); }
}

h1, h2, h3 {
  font-family: Georgia, "Times New Roman", serif;
  line-height: 0.96;
  letter-spacing: -0.045em;
  margin: 0;
}
h1 { font-size: clamp(4rem, 9vw, 8.8rem); max-width: 850px; }
h2 { font-size: clamp(2.5rem, 5.6vw, 5.2rem); }
h3 { font-size: clamp(1.45rem, 2.4vw, 2.1rem); }
p { line-height: 1.72; }
a { color: inherit; }

.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  width: min(var(--max), calc(100% - 32px));
  margin: 16px auto 0;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border: 1px solid rgba(255,255,255,0.6);
  background: rgba(255, 250, 239, 0.58);
  backdrop-filter: blur(24px);
  border-radius: 999px;
  box-shadow: 0 12px 35px rgba(68, 36, 45, 0.09);
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.brand-mark {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #fffaf0;
  background: linear-gradient(135deg, var(--wine), var(--rose), var(--gold));
  box-shadow: 0 12px 22px rgba(157, 86, 99, 0.26);
  font-family: Georgia, serif;
}
.top-nav { display: flex; gap: 24px; color: var(--muted); font-size: 0.95rem; }
.top-nav a { text-decoration: none; }
.top-nav a:hover { color: var(--wine); }

.section-shell {
  width: min(var(--max), calc(100% - 36px));
  margin: 0 auto;
}
.hero {
  min-height: calc(100vh - 90px);
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
  align-items: center;
  gap: 56px;
  padding: 72px 0 80px;
}
.eyebrow {
  margin: 0 0 18px;
  color: var(--wine);
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.78rem;
  font-weight: 850;
}
.hero-text {
  font-size: clamp(1.12rem, 1.6vw, 1.4rem);
  color: #5f484d;
  max-width: 720px;
  margin: 28px 0 0;
}
.hero-actions, .result-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 32px;
}
.primary-button, .secondary-button, .ghost-button {
  appearance: none;
  border: 0;
  border-radius: 999px;
  padding: 15px 24px;
  font-weight: 850;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease, border 180ms ease;
}
.primary-button {
  color: #fffaf0;
  background: linear-gradient(135deg, var(--wine), var(--rose-deep), #c18454);
  box-shadow: 0 18px 32px rgba(107, 43, 69, 0.26);
}
.secondary-button {
  color: var(--wine);
  background: rgba(255, 250, 239, 0.75);
  border: 1px solid rgba(107, 43, 69, 0.12);
}
.ghost-button {
  color: var(--wine);
  background: rgba(255, 250, 239, 0.44);
  border: 1px solid rgba(107, 43, 69, 0.14);
}
.small { padding: 10px 16px; font-size: 0.88rem; }
.primary-button:hover, .secondary-button:hover, .ghost-button:hover { transform: translateY(-2px); }
.primary-button:hover { box-shadow: 0 23px 44px rgba(107, 43, 69, 0.32); }
.trust-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 28px;
}
.trust-row span, .mode-pill {
  padding: 9px 13px;
  border-radius: 999px;
  background: rgba(255, 250, 239, 0.56);
  border: 1px solid rgba(255,255,255,0.58);
  color: var(--muted);
  font-size: 0.88rem;
}
.mode-pill { display: inline-flex; margin-top: 16px; }
.mode-pill.live { color: #2f6047; background: rgba(215, 241, 222, 0.62); }
.mode-pill.demo { color: #805545; background: rgba(255, 231, 197, 0.62); }

.hero-visual {
  min-height: 620px;
  position: relative;
  display: grid;
  place-items: center;
}
.moon {
  position: absolute;
  width: 115px;
  height: 115px;
  border-radius: 50%;
  top: 38px;
  right: 72px;
  background: radial-gradient(circle at 35% 30%, #fff9df, #f7d987 58%, #d19658 100%);
  box-shadow: 0 0 70px rgba(247, 217, 135, 0.8);
}
.dream-door {
  position: relative;
  width: min(380px, 78vw);
  height: 520px;
  display: grid;
  place-items: center;
}
.door-glow {
  position: absolute;
  inset: 7% 2% -2%;
  border-radius: 45% 45% 25px 25px;
  background: radial-gradient(circle at 50% 38%, rgba(255, 246, 190, 0.9), rgba(217,151,156,0.26) 42%, transparent 68%);
  filter: blur(16px);
  animation: breathe 3.8s ease-in-out infinite;
}
@keyframes breathe {
  0%,100% { transform: scale(0.96); opacity: 0.7; }
  50% { transform: scale(1.04); opacity: 1; }
}
.door-frame {
  position: relative;
  width: 305px;
  height: 470px;
  padding: 18px;
  border-radius: 170px 170px 22px 22px;
  background: linear-gradient(145deg, rgba(255,255,255,0.72), rgba(148,85,101,0.28));
  box-shadow: var(--shadow), inset 0 0 0 1px rgba(255,255,255,0.5);
}
.door-panel {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 150px 150px 14px 14px;
  background:
    linear-gradient(90deg, transparent 47%, rgba(255,255,255,0.14) 48%, rgba(255,255,255,0.14) 52%, transparent 53%),
    radial-gradient(circle at 50% 14%, rgba(255, 235, 170, 0.6), transparent 26%),
    linear-gradient(155deg, #7a3150, #b45f75 42%, #d29b73 100%);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.22), inset 0 -38px 80px rgba(54,20,40,0.35);
}
.door-window {
  position: absolute;
  top: 78px;
  left: 50%;
  transform: translateX(-50%);
  width: 112px;
  height: 112px;
  border-radius: 50% 50% 46% 46%;
  background: linear-gradient(145deg, #fff8d5, #efc8a1, #b96e81);
  box-shadow: 0 0 55px rgba(255, 230, 160, 0.86), inset 0 0 0 8px rgba(255,255,255,0.2);
}
.door-handle {
  position: absolute;
  right: 56px;
  top: 265px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #f5d28d;
  box-shadow: 0 0 18px rgba(245,210,141,0.88);
}
.floating-card {
  position: absolute;
  width: 235px;
  padding: 18px;
  border-radius: 20px;
  background: rgba(255, 250, 239, 0.68);
  border: 1px solid rgba(255,255,255,0.72);
  backdrop-filter: blur(22px);
  box-shadow: var(--soft-shadow);
  animation: floatCard 5.5s ease-in-out infinite alternate;
}
.floating-card span { display: block; color: var(--rose-deep); font-weight: 850; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 8px; }
.floating-card strong { font-family: Georgia, serif; font-size: 1.2rem; line-height: 1.2; }
.card-one { left: -12px; bottom: 95px; }
.card-two { right: -12px; bottom: 205px; animation-delay: 1.5s; }
@keyframes floatCard { to { transform: translateY(-12px) rotate(1deg); } }

.how, .creator, .preview { padding: 80px 0; }
.section-heading { max-width: 860px; margin-bottom: 30px; }
.centred { text-align: center; margin-left: auto; margin-right: auto; }
.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}
.steps-grid article, .preview-card, .room-card, .final-panel, .creator-panel, .result-hero {
  border: 1px solid rgba(255,255,255,0.58);
  background: rgba(255, 250, 239, 0.64);
  backdrop-filter: blur(22px);
  box-shadow: var(--soft-shadow);
}
.steps-grid article {
  border-radius: var(--radius-lg);
  padding: 26px;
}
.step-number {
  display: inline-flex;
  color: var(--rose-deep);
  font-weight: 900;
  margin-bottom: 30px;
}
.steps-grid p, .preview-card p, .creator-intro p { color: var(--muted); }

.creator-panel {
  border-radius: var(--radius-xl);
  padding: clamp(22px, 4vw, 44px);
  display: grid;
  grid-template-columns: 0.82fr 1.18fr;
  gap: 34px;
  overflow: hidden;
  position: relative;
}
.creator-panel::before {
  content: "";
  position: absolute;
  width: 380px;
  height: 380px;
  right: -120px;
  top: -160px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(215,173,103,0.34), transparent 72%);
  pointer-events: none;
}
.creator-intro { position: sticky; top: 110px; align-self: start; }
.dream-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 17px;
  position: relative;
}
.field-block { display: flex; flex-direction: column; gap: 9px; }
.field-block span {
  font-weight: 850;
  color: #4d363b;
}
.full { grid-column: 1 / -1; }
input, textarea, select {
  width: 100%;
  border: 1px solid rgba(107, 43, 69, 0.14);
  border-radius: 18px;
  padding: 15px 16px;
  background: rgba(255,255,255,0.58);
  color: var(--ink);
  outline: none;
  font: inherit;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.4);
}
textarea { min-height: 132px; resize: vertical; }
input:focus, textarea:focus, select:focus {
  border-color: rgba(157,86,99,0.56);
  box-shadow: 0 0 0 4px rgba(217,151,156,0.18);
}
.choice-grid { display: flex; flex-wrap: wrap; gap: 10px; }
.choice-grid button {
  appearance: none;
  border: 1px solid rgba(107,43,69,0.12);
  background: rgba(255,255,255,0.52);
  color: var(--muted);
  border-radius: 999px;
  padding: 10px 13px;
  cursor: pointer;
  transition: 160ms ease;
  font-weight: 760;
}
.choice-grid button.selected {
  color: #fffaf0;
  border-color: transparent;
  background: linear-gradient(135deg, var(--wine), var(--rose-deep));
  box-shadow: 0 10px 20px rgba(107,43,69,0.17);
}
.submit-button { width: 100%; margin-top: 5px; }
.button-sparkle { animation: twinkle 1.6s ease-in-out infinite; }
@keyframes twinkle { 50% { transform: scale(1.35) rotate(20deg); opacity: 0.72; } }

.loading-screen {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  background: rgba(39, 27, 31, 0.28);
  backdrop-filter: blur(18px);
}
.loading-card {
  width: min(520px, calc(100% - 38px));
  text-align: center;
  border-radius: 36px;
  padding: 46px 30px;
  color: var(--ink);
  background: rgba(255, 250, 239, 0.88);
  border: 1px solid rgba(255,255,255,0.68);
  box-shadow: var(--shadow);
}
.orbital {
  position: relative;
  width: 98px;
  height: 98px;
  border-radius: 50%;
  margin: 0 auto 22px;
  border: 1px solid rgba(107,43,69,0.15);
  animation: spin 2.8s linear infinite;
}
.orbital span {
  position: absolute;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--rose-deep);
  box-shadow: 0 0 22px rgba(157,86,99,0.5);
}
.orbital span:nth-child(1) { left: 4px; top: 38px; }
.orbital span:nth-child(2) { right: 12px; top: 14px; background: var(--gold); }
.orbital span:nth-child(3) { right: 28px; bottom: 0; background: var(--sea); }
@keyframes spin { to { transform: rotate(360deg); } }

.hidden { display: none !important; }
.result { padding: 76px 0; }
.result-hero {
  border-radius: var(--radius-xl);
  padding: clamp(26px, 5vw, 54px);
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
}
.result-hero::after {
  content: "";
  position: absolute;
  width: 260px;
  height: 260px;
  right: -72px;
  top: -72px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(215,173,103,0.34), transparent 70%);
}
.door-text {
  max-width: 860px;
  color: #5f484d;
  font-size: 1.14rem;
}
.result-layout {
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr);
  gap: 22px;
  align-items: start;
}
.room-nav {
  position: sticky;
  top: 92px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border-radius: 22px;
  background: rgba(255, 250, 239, 0.55);
  border: 1px solid rgba(255,255,255,0.58);
  backdrop-filter: blur(18px);
  box-shadow: var(--soft-shadow);
}
.room-nav a {
  text-decoration: none;
  padding: 11px 13px;
  border-radius: 14px;
  color: var(--muted);
  font-weight: 800;
  font-size: 0.92rem;
}
.room-nav a:hover { background: rgba(255,255,255,0.52); color: var(--wine); }
.room-stack { display: grid; gap: 18px; }
.room-card {
  border-radius: var(--radius-lg);
  padding: clamp(22px, 3vw, 34px);
  position: relative;
  overflow: hidden;
}
.room-card::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 5px;
  background: linear-gradient(90deg, var(--wine), var(--rose), var(--gold), var(--sea));
}
.room-card-top {
  display: flex;
  align-items: start;
  gap: 16px;
  margin-bottom: 18px;
}
.room-number {
  min-width: 42px;
  height: 42px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(107,43,69,0.08);
  color: var(--rose-deep);
  font-weight: 900;
}
.sensory { color: #594147; font-size: 1.07rem; }
.room-insight, .room-step {
  margin-top: 16px;
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(255,255,255,0.46);
  color: #604a4f;
  border: 1px solid rgba(107,43,69,0.08);
}
.room-insight strong, .room-step strong { color: var(--wine); }
.final-panel {
  margin-top: 22px;
  border-radius: var(--radius-xl);
  padding: clamp(24px, 4vw, 42px);
}
.final-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-top: 22px;
}
.final-mini {
  padding: 20px;
  border-radius: 22px;
  background: rgba(255,255,255,0.48);
  border: 1px solid rgba(107,43,69,0.08);
}
.final-mini h4 {
  margin: 0 0 8px;
  font-size: 0.88rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--rose-deep);
}
.final-mini p { margin: 0; color: #5f484d; }
.vision-tags { display: flex; flex-wrap: wrap; gap: 9px; margin-top: 12px; }
.vision-tags span {
  padding: 8px 11px;
  border-radius: 999px;
  background: rgba(107,43,69,0.08);
  color: var(--wine);
  font-weight: 760;
  font-size: 0.88rem;
}
.preview-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-auto-rows: 210px;
  gap: 16px;
}
.preview-card {
  border-radius: var(--radius-lg);
  padding: 24px;
  overflow: hidden;
  position: relative;
}
.preview-card::after {
  content: "";
  position: absolute;
  width: 160px;
  height: 160px;
  right: -50px;
  bottom: -60px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(215,173,103,0.26), transparent 72%);
}
.preview-card.tall { grid-row: span 2; }
.preview-card.wide { grid-column: span 2; }
.room-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  margin-bottom: 22px;
  color: #fffaf0;
  background: linear-gradient(135deg, var(--rose-deep), var(--gold));
  box-shadow: 0 15px 30px rgba(157,86,99,0.18);
}
.site-footer {
  width: min(var(--max), calc(100% - 36px));
  margin: 0 auto 34px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
  color: var(--muted);
  font-size: 0.92rem;
}
.reveal { opacity: 0; transform: translateY(18px); animation: reveal 700ms ease forwards; }
.delay-1 { animation-delay: 170ms; }
@keyframes reveal { to { opacity: 1; transform: translateY(0); } }

@media (max-width: 980px) {
  .hero, .creator-panel, .result-layout { grid-template-columns: 1fr; }
  .creator-intro, .room-nav { position: static; }
  .steps-grid, .final-grid { grid-template-columns: 1fr; }
  .preview-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .top-nav { display: none; }
  .hero-visual { min-height: 520px; }
}
@media (max-width: 620px) {
  .site-header { width: min(100% - 18px, var(--max)); }
  .site-header .small { display: none; }
  .section-shell { width: min(100% - 22px, var(--max)); }
  .hero { padding-top: 42px; }
  h1 { font-size: clamp(3.5rem, 15vw, 5rem); }
  .dream-form { grid-template-columns: 1fr; }
  .preview-grid { grid-template-columns: 1fr; grid-auto-rows: auto; }
  .preview-card.tall, .preview-card.wide { grid-row: auto; grid-column: auto; }
  .floating-card { display: none; }
  .door-frame { width: 255px; height: 410px; }
  .result-actions, .hero-actions { flex-direction: column; align-items: stretch; }
}

@media print {
  body { background: #fffaf0; }
  .site-header, .no-print, .preview, .how, .creator, .site-footer, .ambient { display: none !important; }
  .section-shell { width: 100%; }
  .result { padding: 0; }
  .result-layout { display: block; }
  .result-hero, .room-card, .final-panel { box-shadow: none; border: 1px solid #eadbc6; background: white; page-break-inside: avoid; }
}
