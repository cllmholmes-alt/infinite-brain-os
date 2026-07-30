export const appStyles = String.raw`
:root {
  color-scheme: light;
  --paper: #f2efe8;
  --paper-2: #faf8f3;
  --surface: rgba(255, 253, 248, 0.94);
  --surface-strong: #fffdf8;
  --ink: #1d211f;
  --ink-2: #565d58;
  --ink-3: #5b635e;
  --line: rgba(29, 33, 31, 0.12);
  --line-strong: rgba(29, 33, 31, 0.2);
  --ember: #9e3d21;
  --ember-soft: rgba(217, 97, 53, 0.12);
  --fresh: #21756b;
  --aging: #b7791f;
  --stale: #b54a3f;
  --unknown: #5b635e;
  --conflict: #765f9e;
  --shadow-sm: 0 1px 1px rgba(29, 33, 31, 0.05), 0 7px 20px rgba(29, 33, 31, 0.05);
  --shadow-md: 0 2px 2px rgba(29, 33, 31, 0.05), 0 18px 48px rgba(29, 33, 31, 0.08);
  --radius: 10px;
  --radius-lg: 14px;
}

* { box-sizing: border-box; }
html, body { width: 100%; height: 100%; margin: 0; overflow: hidden; }
body {
  background: var(--paper);
  color: var(--ink);
  font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 13px;
  text-rendering: optimizeLegibility;
}
button, input, select { font: inherit; color: inherit; }
button { min-width:44px; min-height:44px; cursor:pointer; }
button:focus-visible, input:focus-visible, select:focus-visible, [tabindex]:focus-visible {
  outline: 2px solid var(--ember);
  outline-offset: 2px;
}
.sr-only { position: absolute !important; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

.app-shell { display: grid; grid-template-rows: 64px minmax(0, 1fr); width: 100vw; height: 100vh; background: var(--paper); color: var(--ink); }
.topbar {
  display: grid;
  grid-template-columns: minmax(230px, 1fr) auto minmax(230px, 1fr);
  align-items: center;
  gap: 20px;
  padding: 0 18px;
  border-bottom: 1px solid var(--line);
  background: color-mix(in srgb, var(--surface-strong) 92%, transparent);
  backdrop-filter: blur(18px);
  z-index: 20;
}
.brand { display: flex; align-items: center; gap: 11px; min-width: 0; }
.brand-mark { position: relative; width: 32px; height: 32px; border: 1px solid var(--line-strong); border-radius: 10px; background: var(--surface-strong); box-shadow: var(--shadow-sm); }
.brand-mark::before, .brand-mark::after { content: ""; position: absolute; border: 1px solid var(--ember); border-radius: 50%; }
.brand-mark::before { width: 13px; height: 13px; left: 8px; top: 8px; }
.brand-mark::after { width: 3px; height: 3px; left: 14px; top: 14px; background: var(--ember); }
.brand-copy { min-width: 0; }
.eyebrow { font-size: 9px; font-weight: 800; letter-spacing: .13em; text-transform: uppercase; color: var(--ink-3); }
.brand h1 { margin: 2px 0 0; font-family: ui-serif, Georgia, serif; font-size: 17px; font-weight: 620; letter-spacing: -.02em; white-space: nowrap; }
.mode-switch { display: flex; padding: 3px; background: rgba(29,33,31,.055); border-radius: 10px; border: 1px solid rgba(29,33,31,.05); }
.mode-switch button { min-width: 82px; border: 0; background: transparent; color: var(--ink-2); border-radius: 7px; padding: 7px 12px; font-size: 11px; font-weight: 720; letter-spacing: .03em; }
.mode-switch button[aria-pressed="true"] { background: var(--surface-strong); color: var(--ink); box-shadow: 0 1px 3px rgba(29,33,31,.11); }
.top-actions { justify-self: end; display: flex; align-items: center; gap: 8px; }
.snapshot-chip { display: flex; align-items: center; gap: 7px; padding: 6px 9px; border: 1px solid var(--line); border-radius: 999px; color: var(--ink-2); font-size: 10px; background: var(--surface); }
.snapshot-chip .pulse { width: 6px; height: 6px; border-radius: 50%; background: var(--aging); box-shadow: 0 0 0 3px rgba(183,121,31,.13); }
.icon-button { width:44px; height:44px; display:grid; place-items:center; border:1px solid var(--line); border-radius:10px; background:var(--surface); color:var(--ink-2); font-size:10px; font-weight:800; }
.icon-button:hover { border-color: var(--line-strong); color: var(--ink); }

.workspace { min-height: 0; display: grid; grid-template-columns: 66px minmax(0, 1fr) 360px; gap: 0; }
.lens-rail { padding: 14px 10px; border-right: 1px solid var(--line); background: color-mix(in srgb, var(--paper-2) 86%, transparent); display: flex; flex-direction: column; align-items: center; gap: 7px; }
.lens-button { position: relative; width: 44px; height: 44px; border: 1px solid transparent; border-radius: 10px; background: transparent; color: var(--ink-3); font-size: 10px; font-weight: 800; letter-spacing: .06em; }
.lens-button:hover { color: var(--ink); background: var(--surface); }
.lens-button[aria-pressed="true"] { color: var(--ember); background: var(--surface-strong); border-color: var(--line); box-shadow: var(--shadow-sm); }
.lens-button[aria-pressed="true"]::before { content: ""; position: absolute; left: -11px; top: 13px; width: 3px; height: 18px; background: var(--ember); border-radius: 0 4px 4px 0; }
.lens-spacer { flex: 1; }

.graph-stage { min-width: 0; min-height: 0; display: grid; grid-template-rows: 70px minmax(0, 1fr) 86px; padding: 0 14px; }
.stage-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 12px 2px 10px; }
.stage-title { min-width: 0; }
.stage-title-row { display: flex; align-items: center; gap: 9px; }
.stage-title h2 { margin: 0; font-family: ui-serif, Georgia, serif; font-size: 20px; font-weight: 620; letter-spacing: -.025em; }
.lens-chip { padding: 4px 7px; border-radius: 6px; background: var(--ember-soft); color: var(--ember); font-size: 9px; font-weight: 820; letter-spacing: .08em; text-transform: uppercase; }
.stage-title p { margin: 4px 0 0; color: var(--ink-3); font-size: 11px; }
.stage-tools { display: flex; gap: 8px; align-items: center; }
.search-box { position: relative; width: 210px; }
.search-box input { width:100%; height:44px; border:1px solid var(--line); background:var(--surface); border-radius:10px; padding:0 12px 0 30px; outline:none; }
.search-box::before { content: "⌕"; position: absolute; left: 10px; top: 7px; color: var(--ink-3); font-size: 16px; }
.zoom-switch { display: flex; gap: 2px; padding: 3px; border: 1px solid var(--line); background: var(--surface); border-radius: 10px; }
.zoom-switch button { border: 0; background: transparent; border-radius: 6px; padding: 6px 8px; color: var(--ink-3); font-size: 10px; }
.zoom-switch button[aria-pressed="true"] { color: var(--ink); background: rgba(29,33,31,.07); }

.canvas-shell { position: relative; min-height: 0; overflow: hidden; border: 1px solid var(--line); border-radius: 14px; background: var(--paper-2); box-shadow: var(--shadow-md); }
#main-canvas { display: block; width: 100%; height: 100%; min-height: 360px; }
.canvas-grid { pointer-events: none; position: absolute; inset: 0; opacity: .26; background-image: linear-gradient(rgba(29,33,31,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(29,33,31,.035) 1px, transparent 1px); background-size: 40px 40px; mask-image: radial-gradient(circle at center, #000, transparent 88%); }
.canvas-kpis { position: absolute; left: 14px; top: 14px; display: flex; gap: 6px; }
.kpi { padding: 7px 9px; border: 1px solid var(--line); background: color-mix(in srgb, var(--surface-strong) 90%, transparent); backdrop-filter: blur(10px); border-radius: 8px; box-shadow: var(--shadow-sm); }
.kpi b { display: block; font-family: ui-serif, Georgia, serif; font-size: 15px; font-weight: 650; }
.kpi span { display: block; margin-top: 1px; font-size: 8px; font-weight: 800; color: var(--ink-3); letter-spacing: .08em; text-transform: uppercase; }
.state-banner { position: absolute; left: 50%; top: 14px; transform: translateX(-50%); padding: 7px 10px; border: 1px solid var(--line); background: var(--surface); border-radius: 8px; box-shadow: var(--shadow-sm); color: var(--ink-2); font-size: 10px; }
.state-banner strong { color: var(--ink); }
.map-controls { position: absolute; left: 14px; bottom: 14px; display: grid; gap: 5px; }
.map-controls button { width:44px; height:44px; border:1px solid var(--line); background:var(--surface); border-radius:8px; color:var(--ink-2); box-shadow:var(--shadow-sm); }
.legend { position: absolute; right: 14px; bottom: 14px; display: flex; gap: 10px; align-items: center; padding: 7px 9px; border: 1px solid var(--line); border-radius: 8px; background: color-mix(in srgb, var(--surface) 90%, transparent); backdrop-filter: blur(10px); font-size: 9px; color: var(--ink-2); }
.legend-item { display: flex; align-items: center; gap: 5px; }
.legend-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--unknown); }
.legend-dot.stale { background: var(--stale); }
.legend-dot.conflict { background: var(--conflict); }
.legend-dot.aging { background: var(--aging); }
.minimap-card { position: absolute; right: 14px; top: 14px; width: 146px; padding: 6px; border: 1px solid var(--line); border-radius: 10px; background: color-mix(in srgb, var(--surface) 92%, transparent); box-shadow: var(--shadow-sm); }
.minimap-label { padding: 1px 3px 5px; display: flex; justify-content: space-between; font-size: 8px; font-weight: 800; color: var(--ink-3); letter-spacing: .08em; text-transform: uppercase; }
#mini-canvas { display: block; width: 132px; height: 76px; border-radius: 6px; }
.command-queue { position: absolute; left: 14px; bottom: 58px; width: 260px; padding: 10px; border: 1px solid var(--line); border-radius: 10px; background: color-mix(in srgb, var(--surface-strong) 94%, transparent); backdrop-filter: blur(14px); box-shadow: var(--shadow-md); }
.command-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.command-head b { font-family: ui-serif, Georgia, serif; font-size: 12px; }
.count-chip { padding: 2px 6px; border-radius: 999px; background: var(--ember-soft); color: var(--ember); font-size: 9px; font-weight: 800; }
.command-item { display: grid; grid-template-columns: 4px 1fr auto; gap: 8px; align-items: start; padding: 8px 0; border-top: 1px solid var(--line); }
.command-item:first-of-type { border-top: 0; }
.command-severity { width: 4px; min-height: 30px; border-radius: 4px; background: var(--stale); }
.command-item b { display: block; font-size: 10px; }
.command-item small { display: block; margin-top: 2px; color: var(--ink-3); font-size: 9px; line-height: 1.35; }
.command-state { font-size: 8px; font-weight: 800; color: var(--stale); letter-spacing: .05em; text-transform: uppercase; }

.timeline-strip { display: grid; grid-template-columns: 145px 1fr auto; align-items: center; gap: 14px; border-top: 1px solid var(--line); }
.timeline-title b { display: block; font-family: ui-serif, Georgia, serif; font-size: 12px; }
.timeline-title span { color: var(--ink-3); font-size: 9px; }
.timeline-track { position: relative; display: grid; grid-template-columns: repeat(4, 1fr); align-items: center; }
.timeline-track::before { content: ""; position: absolute; left: 4px; right: 4px; top: 11px; height: 1px; background: var(--line-strong); }
.timeline-event { position: relative; padding-top: 22px; color: var(--ink-3); font-size: 9px; white-space: nowrap; }
.timeline-event::before { content: ""; position: absolute; top: 7px; left: 0; width: 7px; height: 7px; border-radius: 50%; background: var(--surface-strong); border: 2px solid var(--unknown); }
.timeline-event.alert::before { border-color: var(--stale); }
.timeline-event b { display: block; color: var(--ink-2); font-size: 9px; }
.timeline-actions { display: flex; gap: 5px; }

.inspector { min-height: 0; border-left: 1px solid var(--line); background: var(--paper-2); display: grid; grid-template-rows: auto auto minmax(0, 1fr); overflow: hidden; }
.inspector-head { padding: 17px 17px 13px; border-bottom: 1px solid var(--line); }
.inspector-kicker { display: flex; justify-content: space-between; color: var(--ink-3); font-size: 9px; font-weight: 800; letter-spacing: .09em; text-transform: uppercase; }
.inspector-title { display: flex; gap: 11px; align-items: center; margin-top: 10px; }
.node-glyph { width: 34px; height: 34px; display: grid; place-items: center; border: 1px solid var(--line-strong); border-radius: 10px; background: var(--surface-strong); color: var(--ember); font-family: ui-serif, Georgia, serif; font-weight: 700; }
.inspector-title h3 { margin: 0; font-family: ui-serif, Georgia, serif; font-size: 18px; font-weight: 640; }
.inspector-title p { margin: 3px 0 0; color: var(--ink-3); font-size: 10px; }
.inspector-tabs { display: grid; grid-template-columns: repeat(3, 1fr); padding: 0 12px; border-bottom: 1px solid var(--line); }
.inspector-tabs button { border: 0; border-bottom: 2px solid transparent; background: transparent; padding: 11px 4px 9px; color: var(--ink-3); font-size: 10px; font-weight: 720; }
.inspector-tabs button[aria-selected="true"] { color: var(--ink); border-bottom-color: var(--ember); }
.inspector-body { overflow: auto; padding: 14px 16px 22px; }
.panel-section { margin-bottom: 18px; }
.panel-label { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 9px; font-weight: 820; letter-spacing: .09em; text-transform: uppercase; color: var(--ink-3); }
.panel-card { border: 1px solid var(--line); border-radius: 10px; background: var(--surface-strong); padding: 11px; box-shadow: var(--shadow-sm); }
.truth-row { display: grid; grid-template-columns: 8px 1fr auto; gap: 8px; align-items: center; padding: 8px 0; border-top: 1px solid var(--line); }
.truth-row:first-child { border-top: 0; }
.truth-marker { width: 7px; height: 7px; border-radius: 50%; background: var(--unknown); }
.truth-row b { display: block; font-size: 10px; }
.truth-row small { color: var(--ink-3); font-size: 9px; }
.truth-state { font-size: 8px; font-weight: 820; text-transform: uppercase; color: var(--unknown); }
.metric-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
.metric { padding: 9px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); }
.metric b { display: block; font-family: ui-serif, Georgia, serif; font-size: 16px; }
.metric span { color: var(--ink-3); font-size: 8px; font-weight: 750; text-transform: uppercase; }
.blocked-action { border: 1px solid rgba(181,74,63,.28); background: rgba(181,74,63,.055); border-radius: 10px; padding: 11px; }
.blocked-action strong { color: var(--stale); font-size: 10px; }
.blocked-action p { margin: 5px 0 9px; color: var(--ink-2); font-size: 10px; line-height: 1.45; }
.primary-action { width: 100%; border: 0; border-radius: 9px; padding: 10px 12px; background: var(--ember); color: white; font-weight: 760; font-size: 11px; box-shadow: 0 7px 20px rgba(217,97,53,.18); }
.primary-action:disabled { cursor: not-allowed; background: var(--ink-3); box-shadow: none; opacity: .66; }
.secondary-action { border: 1px solid var(--line); border-radius: 8px; padding: 7px 9px; background: var(--surface); color: var(--ink-2); font-size: 9px; font-weight: 700; }
.provenance-line { display: flex; gap: 7px; align-items: flex-start; padding: 7px 0; border-top: 1px solid var(--line); }
.provenance-line:first-child { border-top: 0; }
.provenance-line code { font-size: 9px; color: var(--ember); }
.provenance-line p { margin: 1px 0 0; color: var(--ink-3); font-size: 9px; line-height: 1.4; }

.mobile-projection { display: none; }
.modal-backdrop { position: fixed; inset: 0; z-index: 100; display: none; place-items: center; background: rgba(20,24,22,.45); backdrop-filter: blur(8px); }
.modal-backdrop.open { display: grid; }
.capability-modal { width: min(940px, calc(100vw - 40px)); max-height: calc(100vh - 50px); display: grid; grid-template-rows: auto minmax(0,1fr); border: 1px solid var(--line); border-radius: 14px; background: var(--surface-strong); box-shadow: 0 30px 90px rgba(15,20,18,.25); overflow: hidden; }
.modal-head { display: flex; justify-content: space-between; padding: 16px 18px; border-bottom: 1px solid var(--line); }
.modal-head h2 { margin: 0; font-family: ui-serif, Georgia, serif; font-size: 18px; }
.capability-list { overflow: auto; padding: 10px 18px 18px; }
.capability-row { display: grid; grid-template-columns: 32px 1.2fr 1fr 70px; gap: 12px; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--line); }
.capability-row code { font-size: 9px; color: var(--ink-3); }
.capability-row .pass { color: var(--fresh); font-size: 9px; font-weight: 800; }
.workbench-modal { width:min(1080px, calc(100vw - 40px)); }
.workbench-modal #workbench-body { min-height:0; overflow:auto; padding:14px 18px 20px; }
.workbench-tabs { display:flex; gap:6px; overflow:auto; padding-bottom:10px; border-bottom:1px solid var(--line); }
.workbench-tabs button { border:1px solid var(--line); border-radius:10px; padding:8px 12px; background:var(--surface); color:var(--ink-2); font-size:10px; font-weight:750; text-transform:capitalize; }
.workbench-tabs button[aria-selected="true"] { border-color:var(--ember); color:var(--ink); background:var(--ember-soft); }
.workbench-quick { display:flex; align-items:center; flex-wrap:wrap; gap:8px; padding:10px 0; }
.workbench-quick [data-testid] { min-width:34px; padding:4px 7px; border:1px solid var(--line); border-radius:999px; color:var(--ink-2); font:700 10px ui-monospace,SFMono-Regular,Menlo,monospace; }
.workbench-body { padding-top:4px; }
.workbench-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; }
.workbench-card { min-width:0; border:1px solid var(--line); border-radius:10px; background:var(--surface); padding:14px; box-shadow:var(--shadow-sm); }
.workbench-card h3 { margin:2px 0 10px; font-family:ui-serif,Georgia,serif; font-size:18px; }
.workbench-card p { color:var(--ink-2); line-height:1.5; }
.workbench-card code { display:block; overflow-wrap:anywhere; color:var(--ember); font-size:9px; }
.workbench-row { width:100%; display:grid; grid-template-columns:minmax(0,1fr) auto auto; align-items:center; gap:9px; min-height:44px; padding:8px 0; border:0; border-top:1px solid var(--line); background:transparent; text-align:left; }
.workbench-row:first-of-type { border-top:0; }
.workbench-row b { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:10px; }
.workbench-row span { color:var(--ink-3); font-size:9px; }
.workbench-row code { color:var(--ink-2); }

.app-shell[data-theme="dark"] { color-scheme: dark; --paper:#151816; --paper-2:#1a1e1b; --surface:rgba(34,39,35,.92); --surface-strong:#222723; --ink:#f2efe8; --ink-2:#c8cec9; --ink-3:#aeb6af; --ember:#ff9b75; --ember-soft:rgba(255,155,117,.14); --fresh:#5eead4; --aging:#fbbf24; --stale:#fca5a5; --unknown:#aeb6af; --conflict:#c4b5fd; --line:rgba(242,239,232,.1); --line-strong:rgba(242,239,232,.18); --shadow-sm:0 1px 1px rgba(0,0,0,.2),0 8px 22px rgba(0,0,0,.2); --shadow-md:0 2px 2px rgba(0,0,0,.2),0 24px 60px rgba(0,0,0,.28); }
.app-shell[data-theme="dark"] .canvas-grid { opacity:.12; }
.app-shell[data-theme="dark"] .search-box::before { color:var(--ink-3); }
.app-shell[data-theme="low-stimulation"] { --ember:#8a624c; --ember-soft:rgba(138,98,76,.1); --stale:#8c5c55; }
.app-shell[data-theme="high-contrast"] { --line:rgba(0,0,0,.35); --line-strong:rgba(0,0,0,.65); --ink:#000; --ink-2:#242424; --unknown:#4a4a4a; }
.app-shell[data-preset="loading"] .canvas-shell::after { content:"Collecting reference evidence"; position:absolute; inset:0; display:grid; place-items:center; background:var(--paper-2); color:var(--ink-2); font-family:ui-serif,Georgia,serif; font-size:18px; }
.app-shell[data-preset="error"] .canvas-shell::after { content:"Collector failed. Existing evidence remains visible as unavailable."; position:absolute; inset:0; display:grid; place-items:center; padding:40px; text-align:center; background:var(--paper-2); color:var(--stale); font-family:ui-serif,Georgia,serif; font-size:17px; }
.app-shell[data-preset="empty"] .canvas-shell::after { content:"No entities match this view. Clear filters or choose another lens."; position:absolute; inset:0; display:grid; place-items:center; padding:40px; text-align:center; color:var(--ink-3); font-family:ui-serif,Georgia,serif; font-size:17px; }

@media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior:auto !important; animation-duration:.001ms !important; transition-duration:.001ms !important; } }
@media (forced-colors: active) { button, input, select, .canvas-shell, .panel-card, .workbench-card { border:1px solid CanvasText; } button:focus-visible, input:focus-visible, select:focus-visible, [tabindex]:focus-visible { outline:3px solid Highlight; } .legend-dot, .truth-marker, .pulse { forced-color-adjust:none; } }
@media (max-width: 1040px) { .workspace { grid-template-columns: 58px minmax(0,1fr) 320px; } .search-box { width:150px; } .command-queue { width:230px; } }
@media (max-width: 780px) {
  html, body { overflow:auto; }
  .app-shell { height:auto; min-height:100vh; grid-template-rows:56px auto; }
  .topbar { grid-template-columns:1fr auto; padding:0 12px; }
  .mode-switch { display:none; }
  .snapshot-chip { display:none; }
  .workspace { display:block; }
  .lens-rail, .graph-stage, .inspector { display:none; }
  .mobile-projection { display:block; padding:14px; }
  .mobile-head { margin-bottom:12px; }
  .mobile-head h2 { margin:0; font-family:ui-serif,Georgia,serif; font-size:22px; }
  .mobile-head p { color:var(--ink-3); }
  .mobile-node { width:100%; display:grid; grid-template-columns:10px 1fr auto; gap:10px; align-items:center; padding:13px 12px; border:1px solid var(--line); border-radius:10px; background:var(--surface-strong); margin-bottom:7px; text-align:left; box-shadow:var(--shadow-sm); }
  .mobile-node .dot { width:8px; height:8px; border-radius:50%; background:var(--unknown); }
  .mobile-node b { display:block; font-size:12px; }
  .mobile-node small { display:block; margin-top:2px; color:var(--ink-3); }
  .mobile-node span { color:var(--ink-3); font-size:9px; text-transform:uppercase; }
  .projection-window-note { margin:0 0 10px; padding:10px 12px; border:1px solid var(--line); border-radius:10px; background:var(--surface); color:var(--ink-2); font-size:11px; line-height:1.45; }
  .mobile-detail { margin: 0 0 12px; padding: 12px; border:1px solid var(--line); border-radius:10px; background:var(--surface-strong); box-shadow:var(--shadow-sm); }
  .mobile-detail[hidden] { display:none; }
  .mobile-detail-head { display:flex; align-items:flex-start; justify-content:space-between; gap:10px; margin-bottom:10px; }
  .mobile-detail-head h3 { margin:0; font-family:ui-serif,Georgia,serif; font-size:18px; }
  .mobile-detail .inspector-tabs { display:grid; grid-template-columns:repeat(3,1fr); margin:0 -12px 10px; }
  .mobile-detail .panel-section { margin-top:12px; }
  .capability-modal, .workbench-modal { width:calc(100vw - 20px); max-height:calc(100vh - 20px); }
  .workbench-grid { grid-template-columns:1fr; }
}
`;
