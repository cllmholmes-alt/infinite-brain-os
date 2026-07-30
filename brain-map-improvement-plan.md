# Brain Map 100x Improvement Plan

**Current state**: v2 (2,116 lines) - force-directed physics, particle edges, convex hull clusters, minimap, search, keyboard nav, dark mode, 26 nodes / 36 edges / 7 clusters.

**Goal**: Transform from "great visualization" into a world-class interactive system observatory - the definitive visual interface for the Infinite Brain ecosystem, carrying forward to ADHD-OS Constellation/Brain Mirror.

**Organized in 10 tiers, 100 improvements. Each tier builds on the last.**

---

## TIER 1: LIVING DATA (1-10)
*Make the graph breathe with real system state instead of static JSON.*

1. **Live JSON ingestion** - Replace hardcoded node data with `fetch('/system-map.json')` so the graph regenerates from `system-map.md` automatically
2. **WebSocket health pulse** - Nodes ping their real endpoints every 30s; green = healthy, amber = degraded, red = down, grey = unknown
3. **Auto-discovery** - Scan repos directory on load; new repos appear as nodes automatically without manual data entry
4. **Real edge weights** - Derive connection strength from actual dependency analysis (import counts, API call frequency, shared types)
5. **Node sizing by activity** - Node radius scales with real metrics: commit frequency in last 30 days, star count, lines of code
6. **Git graph overlay** - Edge particle density reflects real commit activity between repos (more commits = faster particles)
7. **Anomaly detection** - Nodes with failing health checks pulse red with an expanding alert ring; detail panel shows the error
8. **Deploy event stream** - When a service deploys, a shockwave ripple emanates from that node across the graph
9. **Time-travel scrubber** - Timeline slider at bottom; scrub to see the graph state at any past date (what existed, what was healthy)
10. **Live log tail** - Detail panel streams the last 20 log lines from the selected node's service in real-time via SSE

## TIER 2: VISUAL MASTERY (11-20)
*Film-grade rendering quality - make every frame a screenshot worth keeping.*

11. **WebGL2 renderer** - Migrate canvas2D to WebGL2 for GPU-accelerated rendering; unlocks 1000+ nodes at 60fps, bloom, DOF, motion blur
12. **Bloom post-processing** - Bright node glows bleed into surrounding space with Gaussian blur - gives the graph a cinematic, alive quality
13. **Depth-of-field** - Nodes far from the focal point (hovered/selected) blur slightly, creating natural visual hierarchy
14. **Motion blur** - During pan/zoom, edges and particles trail; physics movement gets subtle streaks
15. **Edge gradient flow** - Each edge is a multi-stop gradient (source color -> target color), making data direction immediately readable
16. **Cluster ambient glow** - Convex hull regions emit a soft colored aura that pulses gently, like nebulae
17. **Node surface texture** - Procedural noise texture on node fill (not flat circles) - subtle grain that catches light differently per node
18. **Particle light trails** - Data particles leave a fading trail behind them (additive blending), creating rivers of light along edges
19. **Screen-space ambient occlusion** - Overlapping nodes darken each other slightly at contact, adding tactile depth
20. **Vignette breathing** - Edge vignette subtly contracts/expands at 0.5Hz, giving the whole canvas a slow heartbeat rhythm

## TIER 3: INTERACTION & UX REFINEMENT (21-30)
*Make every action feel inevitable and effortless.*

21. **Command palette** (Cmd+K) - Fuzzy-searchable action menu: "zoom to Aurora", "filter by cluster X", "export PNG", "toggle dark mode"
22. **Right-click context menu** - Per-node: Inspect, Focus, Pin/Unpin, Hide, Expand Dependencies, Copy Path, Open in Browser, Open Repo
23. **Multi-select + bulk ops** - Shift-click or lasso to select multiple nodes; bulk pin, hide, recluster, or export
24. **Lasso selection** - Click-drag on empty space draws a free-form selection polygon
25. **Edge creation mode** - Hold Shift + drag from node to node to create a new visual dependency link (stored locally)
26. **View presets** - Save named camera + filter states ("Fusion focus", "Infrastructure only", "Critical path"); one-click restore
27. **Undo/redo** - Z-stack for all layout changes (drag, pin, hide, filter) - Ctrl+Z / Ctrl+Shift+Z
28. **Smart zoom** - Double-click empty space zooms to fit all visible nodes with padding; double-click node zooms to its dependency subtree
29. **Follow mode** - Camera locks onto a node, tracking it through physics movement - useful during live reorganization
30. **Sticky annotations** - Click anywhere on canvas to place a note; anchored to world coordinates, persists in localStorage

## TIER 4: LAYOUT INTELLIGENCE (31-40)
*Multiple ways to arrange the same data - each revealing different truths.*

31. **Radial tree layout** - Root node at center; dependencies fan outward in concentric rings by depth
32. **Hierarchical (DAG) layout** - Top-to-bottom layered layout showing dependency direction explicitly (Sugiyama algorithm)
33. **Circular layout** - Nodes arranged in concentric circles by cluster; edges drawn as arcs - clean for presentations
34. **Timeline layout** - X-axis = creation date; Y-axis = cluster; shows ecosystem growth over time
35. **Importance-rank layout** - Vertical sort by criticality score (PageRank-derived); most important nodes at top
36. **Edge bundling** - Group parallel edges into bundled channels (Hierarchical Edge Bundling) to reduce visual clutter at scale
37. **Simulated annealing optimizer** - Run layout optimization to minimize edge crossings and maximize readability automatically
38. **3D mode (Three.js)** - Toggle to 3D space; orbit camera; nodes float in volumetric space; edges are 3D curves
39. **Custom force profiles** - User-adjustable sliders for repulsion, link strength, gravity, centering - see layout change in real-time
40. **Cluster-as-container mode** - Collapse entire clusters into single mega-nodes (and expand back) for high-level overview

## TIER 5: ANALYTICS & INTELLIGENCE (41-50)
*The graph doesn't just show - it thinks. It tells you what matters.*

41. **Critical path highlighting** - Compute betweenness centrality; nodes on the most paths pulse with a golden ring
42. **Bottleneck detection** - Identify nodes whose removal would fragment the graph most; flag with warning icon
43. **Dead service detection** - Nodes with zero incoming dependencies get a "potentially unused" indicator and dimmed appearance
44. **Circular dependency detector** - Algorithmically find cycles; render them with a distinctive red dashed style and alert badge
45. **Impact simulation** - Click a node, press "What if removed?" - graph simulates cascade failure, orphaning affected nodes
46. **Health heatmap** - Toggle to overlay where node fill = health score (green to red gradient) across the entire system
47. **Cost overlay** - Toggle to show monthly cost per service (from config); cluster totals in sidebar
48. **Uptime sparkline per node** - Mini 30-day uptime graph rendered inside each node at high zoom levels
49. **Error rate badge** - Nodes with >0.1% error rate in last hour get a pulsing red corner badge
50. **Dependency depth scoring** - Color-code nodes by how deep their dependency chain goes (shallow = stable blue, deep = risky amber)

## TIER 6: EXPORT & SHARING (51-60)
*The graph is a communication tool - make it trivial to share any view.*

51. **High-res PNG export** - Export current view at 2x/4x/8x resolution with transparent background option
52. **SVG vector export** - Export as scalable SVG for embedding in docs, slides, wikis without quality loss
53. **Animated WebM/GIF export** - Record 5-10s of the physics animation as a looping video for social/docs
54. **Mermaid auto-generation** - Generate a Mermaid graph diagram from current node/edge state for markdown embedding
55. **JSON state export/import** - Full graph state (layout, pins, annotations, filters) as portable JSON
56. **Shareable URL** - Encode current view state (camera, filter, selection) into URL hash; recipient sees identical view
57. **Embeddable iframe** - `<iframe>` snippet with configurable size, theme, and initial view for external sites
58. **PDF report generator** - One-click: graph screenshot + node inventory table + health summary = polished PDF
59. **Markdown table export** - Copy all visible nodes as a formatted markdown table to clipboard
60. **Dot/Graphviz export** - For integration with external graph tools and CI pipelines

## TIER 7: ACCESSIBILITY & INCLUSION (61-70)
*The graph works for everyone, regardless of ability or device.*

61. **Screen reader support** - ARIA live regions announce node name, cluster, status, and connection count on selection
62. **Full keyboard navigation** - Arrow keys move focus between adjacent nodes (following edges); Enter selects; Tab cycles
63. **High contrast mode** - Black/white palette with thick borders and large text for visual impairment
64. **Reduced motion** - Detect `prefers-reduced-motion`; disable particles, ripples, camera animations; static layout only
65. **Color-blind palette** - Toggle to Okabe-Ito colorblind-safe palette (blue, orange, sky, green, yellow, vermillion, purple)
66. **Font size scaling** - Ctrl+Plus/Minus to scale all labels and detail text; persists in localStorage
67. **Focus-visible rings** - CSS `:focus-visible` outlines on all interactive elements for keyboard users
68. **Voice navigation** - Web Speech API: "select Hermes", "zoom to Aurora", "filter infrastructure" - hands-free control
69. **Text-based alternative view** - Press T to switch to an accessible tree/list view (nested `<ul>`) that screen readers handle natively
70. **Touch gesture refinement** - Long-press for context menu, two-finger drag to pan, three-finger pinch to zoom (iPad-optimized)

## TIER 8: SCALE & PERFORMANCE (71-80)
*Engineered for 10,000 nodes without dropping a frame.*

71. **Quadtree spatial index** - O(log n) hit-testing instead of O(n) linear scan; makes node detection instant at any scale
72. **Level-of-detail (LOD)** - Distant nodes render as 2px dots (no glow, no label); zoom in progressively reveals detail
73. **Web Worker physics** - Move force simulation to a dedicated worker thread; main thread only renders, never blocks
74. **Virtualized edge rendering** - Only draw edges where at least one endpoint is visible in viewport; skip occluded edges
75. **GPU compute shaders** - WebGL2 transform feedback or WebGPU compute pass for physics; CPU does zero math per frame
76. **Typed array data** - Store node positions/velocities in `Float32Array` (SoA layout) for cache-efficient physics iteration
77. **RAF budget manager** - Configurable frame budget (e.g., 12ms render + 4ms physics); adaptive quality reduction if over budget
78. **Particle pooling** - Pre-allocated particle object pool; zero garbage collection during animation
79. **Offscreen canvas** - Render minimap on `OffscreenCanvas` in a worker; main canvas never waits on minimap
80. **Connection culling** - Edges below a certain screen-size threshold (when zoomed out) stop spawning particles to save draw calls

## TIER 9: DATA MODEL ENRICHMENT (81-90)
*Every node tells a complete story.*

81. **Rich metadata panel** - Per node: tech stack, language, license, owner, team, repository URL, live URL, docs URL
82. **Dependency version matrix** - Show which versions of shared dependencies each node uses; flag version drift
83. **Activity timeline** - Last commit, last deploy, last incident - rendered as a mini timeline sparkline in detail panel
84. **Severity classification** - Critical / Important / Supporting / Experimental - encoded as node border style (solid, thick, dashed, dotted)
85. **Compliance tags** - GDPR, DPIA status, data classification - badge system in detail panel
86. **Environment mapping** - Which nodes run in: local, VPS, cloud, edge - filterable environment overlay
87. **Documentation links** - Direct links to relevant docs, runbooks, architecture decisions per node
88. **Owner avatars** - GitHub avatar for each repo's primary maintainer; click to filter by owner
89. **Dependency direction labels** - Edge labels: "imports", "calls", "deploys to", "depends on", "extends" - each with distinct line style
90. **Node status history** - Store last 100 health checks per node; show trend in detail panel as sparkline

## TIER 10: INNOVATION & WOW FACTOR (91-100)
*Features that make people say "I need this."*

91. **Natural language queries** - Type "show me everything that depends on Aurora and is unhealthy" - graph filters and highlights automatically (powered by LLM)
92. **Audio sonification** - Each cluster plays a musical note when its nodes are active; the system "hums" - turn on for ambient awareness of activity patterns
93. **WebXR / VR mode** - Put on a headset and walk through the graph in 3D space; grab nodes physically; see data flow at human scale
94. **Live collaboration** - Multiplayer cursors; see other operators' selections in real-time; shared annotations (Yjs/CRDT sync)
95. **Diff mode** - Load two snapshots; graph highlights what changed (new nodes glow green, removed nodes fade red, moved edges flash)
96. **AI layout suggestion** - "Arrange this for a investor presentation" - LLM picks the layout, filter, and camera angle that tells the best story
97. **Ecosystem health score** - Single number (0-100) computed from graph topology + node health; displayed prominently; trend arrow
98. **Predictive failure cascade** - ML model predicts which nodes are likely to fail next based on dependency chain stress; preemptive warning
99. **Constellation mode** - Astrophotography aesthetic: nodes as stars with diffraction spikes, edges as light beams, clusters as galaxies, background nebula - the system as a living cosmos
100. **Mobile companion** - Responsive design that works as an ADHD-OS Brain Mirror feature: pinch-zoom the same graph on iPhone, see your mind as a constellation

---

## Implementation Priority Matrix

| Priority | Tiers | Why |
|----------|-------|-----|
| **Immediate** | 1, 2, 3 | Living data + visual polish + UX = transforms from demo to daily-use tool |
| **Next Sprint** | 4, 5 | Layout algorithms + analytics = makes it a decision-making instrument |
| **Medium** | 6, 8, 9 | Export/sharing + performance + data enrichment = production-ready platform |
| **Strategic** | 7, 10 | Accessibility + innovation = makes it category-defining |

## Estimated Effort

| Tier | Effort | Dependencies |
|------|--------|-------------|
| 1. Living Data | M | system-map.json ingestion pipeline |
| 2. Visual Mastery | L | WebGL2 migration (foundation for 3, 5, 8) |
| 3. Interaction & UX | M | None (can be done on canvas2D) |
| 4. Layout Intelligence | M | None |
| 5. Analytics | M | Tier 1 (real data) for full value |
| 6. Export & Sharing | S-M | None |
| 7. Accessibility | S-M | None |
| 8. Scale & Performance | L | WebGL2 (Tier 2) |
| 9. Data Model | S-M | Tier 1 (real metadata) |
| 10. Innovation | L | Multiple tiers; some are R&D |

**Key architectural decision**: Tier 2 (WebGL2 migration) is the highest-leverage early investment. It unblocks Tiers 2, 5 (analytics overlays), 8 (performance), and 10 (VR/Constellation mode). Everything built on canvas2D is portable to WebGL2, but deferring it means rewriting later.

---

*This plan is designed to carry forward identically to ADHD-OS Constellation/Brain Mirror - the same physics-particle-hull aesthetic, the same interaction model, adapted for neural/cognitive state data instead of infrastructure nodes.*
