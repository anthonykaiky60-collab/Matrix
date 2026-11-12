/* =====================================================================
   ECO — interface da conversa por voz (minimalista e cinematográfica)
   Usa as mesmas variáveis/fontes do site (Space Grotesk, IBM Plex Mono).
   ===================================================================== */
.eco{ --g:#6dffb0; --gw:#eafff2; --gd:#0c5c2c;
  position:fixed; inset:0; z-index:100; display:none; background:#000; color:var(--gw);
  font-family:var(--font-mono,'IBM Plex Mono',monospace); overflow:hidden; touch-action:manipulation; -webkit-tap-highlight-color:transparent; }
.eco.open{ display:block; animation:ecoIn .5s ease both; }
@keyframes ecoIn{ from{opacity:0} to{opacity:1} }
.eco canvas{ position:absolute; inset:0; width:100%; height:100%; display:block; }
.eco-orb{ position:absolute; left:50%; top:44%; width:min(60vw,46vh); height:min(60vw,46vh); transform:translate(-50%,-50%) scale(calc(1 + var(--lvl,0)*.25));
  border-radius:50%; background:radial-gradient(circle,rgba(234,255,242,.55),rgba(109,255,176,.15) 45%,transparent 70%); filter:blur(6px); display:none; }
.eco.nogl .eco-orb{ display:block; }

.eco-top{ position:absolute; top:0; left:0; right:0; z-index:4; display:flex; justify-content:space-between; align-items:center; gap:12px;
  padding:max(14px,env(safe-area-inset-top)) clamp(14px,3vw,28px) 0; }
.eco-brand{ display:flex; align-items:center; gap:10px; font-size:.7rem; letter-spacing:.14em; color:rgba(234,255,242,.72); }
.eco-dot{ width:7px; height:7px; border-radius:50%; background:var(--g); box-shadow:0 0 8px var(--g); }
.eco-badge{ font-size:.62rem; letter-spacing:.08em; padding:3px 8px; border:1px solid rgba(109,255,176,.35); border-radius:99px; color:var(--g); }
.eco-badge[data-m="local"]{ color:#ffd479; border-color:rgba(255,212,121,.45); }

.eco-btn{ font:inherit; font-size:.72rem; letter-spacing:.08em; color:var(--g); background:rgba(3,10,6,.6); border:1px solid rgba(109,255,176,.35);
  border-radius:99px; padding:10px 16px; cursor:pointer; backdrop-filter:blur(6px); transition:border-color .25s, background .25s, color .25s; }
.eco-btn:hover{ border-color:var(--g); background:rgba(109,255,176,.1); }
.eco-btn:focus-visible, .eco-ic:focus-visible, .eco input:focus-visible, .eco select:focus-visible{ outline:2px solid var(--gw); outline-offset:2px; }

.eco-ui{ position:absolute; left:0; right:0; bottom:0; z-index:4; display:flex; flex-direction:column; align-items:center; gap:12px;
  padding:60px 14px max(16px,env(safe-area-inset-bottom)); background:linear-gradient(to top, rgba(0,0,0,.82) 20%, transparent); }
.eco-status{ display:flex; align-items:center; gap:10px; font-size:.68rem; letter-spacing:.18em; color:var(--g); min-height:18px; text-align:center; }
.eco-bars{ display:flex; gap:3px; height:16px; align-items:center; }
.eco-bars i{ width:3px; height:100%; background:currentColor; border-radius:2px; transform:scaleY(.15); transition:transform .07s linear; }
.eco-status[data-state="thinking"] .eco-bars i{ animation:ecoThink 1s ease-in-out infinite; animation-delay:calc(var(--i)*.12s); }
@keyframes ecoThink{ 0%,100%{transform:scaleY(.2);opacity:.5} 50%{transform:scaleY(.9);opacity:1} }
.eco-status[data-state="listening"] .eco-bars{ color:#bfe9ff; }

.eco-sub{ max-width:min(800px,92vw); text-align:center; min-height:5em; display:flex; flex-direction:column; justify-content:flex-end; gap:6px; }
.eco-you{ margin:0; font-size:.8rem; font-style:italic; color:rgba(234,255,242,.5); min-height:1.2em; }
.eco-ai{ margin:0; font-family:var(--font-display,'Space Grotesk',sans-serif); font-size:clamp(1.02rem,2.7vw,1.5rem); line-height:1.4; color:rgba(234,255,242,.4); transition:opacity 1s; }
.eco-ai .w.said{ color:var(--gw); text-shadow:0 0 12px rgba(109,255,176,.35); }
.eco-ai.fade{ opacity:.25; }
.eco-sub.hide{ opacity:0; transition:opacity 1s; }

.eco-controls{ display:flex; flex-wrap:wrap; justify-content:center; align-items:center; gap:10px; }
.eco-ic{ min-width:46px; height:46px; padding:0 14px; display:inline-flex; align-items:center; justify-content:center; gap:8px; font:inherit; font-size:.72rem; letter-spacing:.06em;
  color:var(--g); background:rgba(3,10,6,.65); border:1px solid rgba(109,255,176,.3); border-radius:99px; cursor:pointer; backdrop-filter:blur(6px); }
.eco-ic:hover{ border-color:var(--g); }
.eco-ic[aria-pressed="false"].mic{ color:#ff8a8a; border-color:rgba(255,138,138,.5); }
.eco-ic[aria-pressed="true"]{ background:rgba(109,255,176,.14); }
.eco-ic[hidden]{ display:none; }
.eco-vol{ display:flex; align-items:center; gap:8px; color:var(--g); font-size:.72rem; }
.eco-vol input{ width:84px; accent-color:var(--g); }

.eco-pop{ position:absolute; z-index:6; left:50%; bottom:clamp(120px,18vh,150px); transform:translateX(-50%); width:min(92vw,400px); max-height:60vh; overflow:auto;
  padding:18px; background:rgba(3,12,7,.94); border:1px solid rgba(109,255,176,.3); border-radius:10px; backdrop-filter:blur(10px); font-size:.78rem; line-height:1.5; }
.eco-pop[hidden]{ display:none; }
.eco-pop h3{ margin:0 0 12px; font-family:var(--font-display,sans-serif); font-size:.95rem; font-weight:500; color:var(--g); }
.eco-pop label{ display:block; margin:12px 0 6px; color:rgba(234,255,242,.75); }
.eco-pop select, .eco-pop input[type=range]{ width:100%; }
.eco select{ font:inherit; color:var(--gw); background:#020a05; border:1px solid rgba(109,255,176,.35); border-radius:6px; padding:8px; }
.eco input[type=range]{ accent-color:var(--g); }
.eco-row{ display:flex; align-items:center; gap:10px; margin-top:12px; }
.eco-row input{ accent-color:var(--g); }
.eco-note{ margin:10px 0 0; font-size:.7rem; color:rgba(234,255,242,.55); }

.eco-intro{ position:absolute; inset:0; z-index:7; display:flex; align-items:center; justify-content:center; padding:20px; overflow:auto;
  background:radial-gradient(circle at 50% 40%, rgba(12,92,44,.28), #000 70%); }
.eco-intro[hidden]{ display:none; }
.eco-card{ width:min(94vw,560px); text-align:left; }
.eco-card h2{ font-family:var(--font-display,sans-serif); font-weight:700; font-size:clamp(1.5rem,5vw,2.3rem); margin:0 0 10px; color:var(--g); }
.eco-card p{ margin:0 0 18px; font-size:.86rem; line-height:1.65; color:rgba(234,255,242,.8); }
.eco-card fieldset{ border:0; padding:0; margin:0 0 18px; }
.eco-card legend{ font-size:.72rem; letter-spacing:.1em; color:var(--gd); margin-bottom:10px; padding:0; }
.eco-opt{ display:flex; gap:10px; align-items:flex-start; padding:12px 14px; margin-bottom:8px; border:1px solid rgba(109,255,176,.22); border-radius:8px; cursor:pointer; }
.eco-opt:has(input:checked){ border-color:var(--g); background:rgba(109,255,176,.08); }
.eco-opt input{ accent-color:var(--g); margin-top:3px; }
.eco-opt b{ display:block; font-weight:500; color:var(--gw); font-size:.84rem; }
.eco-opt span{ display:block; font-size:.72rem; color:rgba(234,255,242,.6); margin-top:2px; }
.eco-go{ width:100%; padding:15px; font:inherit; font-size:.92rem; letter-spacing:.1em; background:var(--g); color:#041b0d; border:0; border-radius:4px; cursor:pointer; }
.eco-go:hover{ background:var(--gw); }
.eco-go:focus-visible{ outline:2px solid var(--gw); outline-offset:3px; }
.eco-small{ margin-top:14px; font-size:.7rem; color:rgba(234,255,242,.5); }

.eco-kbd{ display:flex; gap:8px; width:min(92vw,560px); }
.eco-kbd[hidden]{ display:none; }
.eco-kbd input{ flex:1; font:inherit; font-size:.85rem; color:var(--gw); background:rgba(3,10,6,.8); border:1px solid rgba(109,255,176,.35); border-radius:99px; padding:12px 16px; }

.eco-toast{ position:absolute; z-index:9; top:max(64px,calc(env(safe-area-inset-top) + 52px)); left:50%; transform:translateX(-50%); max-width:min(92vw,520px); text-align:center;
  padding:10px 16px; font-size:.76rem; color:var(--gw); background:rgba(20,40,28,.92); border:1px solid rgba(109,255,176,.4); border-radius:8px; opacity:0; pointer-events:none; transition:opacity .3s; }
.eco-toast.show{ opacity:1; }

.eco-final{ position:absolute; inset:0; z-index:8; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:18px; text-align:center; padding:20px; opacity:0; pointer-events:none; transition:opacity 1.2s; }
.eco-final.show{ opacity:1; pointer-events:auto; }
.eco-final h2{ margin:0; font-family:var(--font-display,sans-serif); font-weight:700; font-size:clamp(2rem,8vw,4.6rem); color:var(--g); text-shadow:0 0 30px rgba(109,255,176,.5); }
.eco-final p{ margin:0; max-width:46ch; color:rgba(234,255,242,.8); font-size:.9rem; }
.eco-final .row{ display:flex; gap:12px; flex-wrap:wrap; justify-content:center; }

.btn-eco{ background:transparent; color:#eafff2; border:1px solid rgba(234,255,242,.45); }
.btn-eco:hover{ border-color:#eafff2; background:rgba(234,255,242,.08); }

@media (max-width:560px){
  .eco-vol input{ width:64px; } .eco-ic .lbl{ display:none; } .eco-brand .full{ display:none; }
}
@media (prefers-reduced-motion:reduce){
  .eco.open{ animation:none; } .eco-status[data-state="thinking"] .eco-bars i{ animation:none; transform:scaleY(.6); }
}

