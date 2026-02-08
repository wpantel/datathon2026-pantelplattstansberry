# Implementation Plan: Planet Drop & Settle Animation

## Overview

Add a load-time animation to the home page where planet-like elements drop from above, appear to interact (bounce/overlap), and settle into their final positions. The animation should be quick (~1.5–2 seconds) and feel playful without distracting from the content.

---

## Current State

- **AnimatedBackground**: Static floating orbs, gradient overlay, grid, and twinkle particles. No load-time choreography.
- **Home page**: Renders `AnimatedBackground` behind hero content. `ScrollSection` handles scroll-triggered fade-in for hero/stats.
- **Stack**: Next.js 16, React 19, Tailwind v4. No animation library (e.g. Framer Motion) currently installed.

---

## Animation Concept

| Phase | Duration | Behavior |
|-------|----------|----------|
| **1. Drop** | ~0.4s | 4–6 orb/planet elements start above viewport (`translateY(-120%)`), fall with gravity-like easing |
| **2. Bounce / Interact** | ~0.5s | On “landing,” elements bounce slightly (scale + translate) and overlap, suggesting interaction |
| **3. Settle** | ~0.6s | Elements ease into final positions with gentle float or fade to match current ambient motion |

**Visual design**: Planet-like circles of varying sizes (e.g. 48px–120px), using theme colors (`accent-start`, `accent-end`) with gradients or soft shadows. Positioned around the hero area.

---

## Implementation Options

### Option A: Pure CSS (No New Dependencies)

**Pros:** Zero bundle size, no JS, works everywhere  
**Cons:** No real physics; “interaction” is simulated via staggered timing and bounce keyframes

**Approach:**
1. Add a new component `PlanetDropAnimation` with 4–6 absolutely positioned `<div>` circles.
2. Define `@keyframes planet-drop` (translateY from -120% → 0, with cubic-bezier for gravity-like ease).
3. Define `@keyframes planet-bounce` (small scale/translate overshoot then settle).
4. Chain animations: `planet-drop` → `planet-bounce` via `animation` and `animation-delay` for stagger.
5. After animation completes, optionally transition to current subtle float behavior or keep static.

**Limitation:** Elements can’t truly “collide” or react. Interaction is implied by staggered landings and overlapping final positions.

---

### Option B: Framer Motion (Recommended)

**Pros:** Spring physics, orchestration, staggerChildren, easy “settle” feel  
**Cons:** Adds ~30–40kb gzipped

**Approach:**
1. `npm install framer-motion`
2. Create `PlanetDropAnimation` with `motion.div` elements.
3. Use `initial` / `animate` with `y`, `scale`, `opacity`. Spring transition for natural bounce.
4. Use `staggerChildren` and `delayChildren` in a parent `motion.div` with `variants` to orchestrate drop order.
5. On mount, animate from `y: -200` (or -100vh) to final `y` positions. Add slight `scale` overshoot (e.g. 1.1) then settle to 1.
6. After main animation, optionally switch to gentle floating via `animate` with `y` oscillation.

**Example structure:**
```tsx
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};
const planet = {
  hidden: { y: -200, opacity: 0 },
  visible: {
    y: 0,
    opacity: 0.8,
    transition: { type: "spring", stiffness: 120, damping: 14 }
  }
};
```

---

### Option C: CSS + Lightweight JS

**Pros:** No Framer dependency; still allows dynamic timing  
**Cons:** More manual work for choreography

**Approach:**
1. Use `useEffect` to add/remove animation classes on mount.
2. CSS handles the motion; JS controls when each planet gets its class (e.g. `setTimeout` with stagger).
3. Similar keyframes to Option A but triggered by `data-animate` or class toggles.

---

## Recommended Approach: Option B (Framer Motion)

**Rationale:** Best balance of “interact and settle” feel with minimal code. Spring physics gives convincing bounce; stagger gives the sense of elements arriving in sequence. Framer is widely used and well-maintained.

---

## Implementation Checklist

### Phase 1: Setup

- [ ] **1.1** Install Framer Motion: `npm install framer-motion`
- [ ] **1.2** Verify `AnimatedBackground` is a client component (`'use client'`) — it already is.

### Phase 2: Planet Component

- [ ] **2.1** Create `src/components/PlanetDropAnimation.tsx` (client component).
- [ ] **2.2** Define 4–6 planet elements with:
  - Size: mix of `w-12 h-12`, `w-16 h-16`, `w-20 h-20`, `w-24 h-24` (or similar).
  - Style: `rounded-full`, gradient `from-accent-start to-accent-end`, or `bg-accent-start/30` with `backdrop-blur`.
  - Position: varied `top`/`left`/`right` (e.g. 10%, 25%, 60%, 85% horizontally) in the hero area.
- [ ] **2.3** Implement Framer `variants`:
  - `hidden`: `y: -150`, `opacity: 0`, `scale: 0.8`
  - `visible`: `y: 0`, `opacity: 0.6–0.8`, `scale: 1`, with `type: "spring", stiffness: 100–150, damping: 12–18` for bounce
- [ ] **2.4** Add `staggerChildren: 0.06–0.1` so planets drop in sequence.
- [ ] **2.5** Optional: Add slight `x` variation in `visible` so planets drift a few pixels horizontally on settle (simulates “interaction”).

### Phase 3: Integration

- [ ] **3.1** In `page.tsx`, render `PlanetDropAnimation` inside the hero section (or in `AnimatedBackground`).
- [ ] **3.2** Layer order: Planets should be behind hero text (`z-10` on hero, planets at `z-0` or `z-[1]`).
- [ ] **3.3** Ensure `overflow-hidden` on the hero/main container so planets don’t overflow during drop.
- [ ] **3.4** Add `pointer-events-none` to planets so they don’t block clicks.

### Phase 4: Timing & Polish

- [ ] **4.1** Total animation duration: target ~1.2–1.8s (drop + bounce).
- [ ] **4.2** Consider reducing motion for `prefers-reduced-motion: media` (Framer supports `useReducedMotion()`).
- [ ] **4.3** Optional: After settle, fade planets to lower opacity or transition into the existing floating orb aesthetic so the background feels cohesive.

### Phase 5: Decisions

- [ ] **5.1** **Replace vs. augment:** Decide whether `PlanetDropAnimation` replaces the current floating orbs in the hero, or adds a new layer. Recommend: augment — keep gradient/grid, add planets as a new drop layer.
- [ ] **5.2** **One-time vs. loop:** Load animation runs once. Post-settle, planets can either stay static or start a subtle float loop. Recommend: stay static or very subtle pulse to avoid competing with content.

---

## File Changes Summary

| File | Action |
|------|--------|
| `package.json` | Add `framer-motion` dependency |
| `src/components/PlanetDropAnimation.tsx` | **Create** — planet drop + settle animation |
| `src/app/page.tsx` | Import and render `PlanetDropAnimation` in hero/main |
| `src/components/AnimatedBackground.tsx` | Optional: minor tweaks if planets should mesh with existing orbs |

---

## Alternative: CSS-Only (If Avoiding Framer)

If you prefer no new dependencies:

1. Create `PlanetDropAnimation.tsx` with static `<div>` elements.
2. Add to `globals.css`:
   ```css
   @keyframes planet-drop {
     0% { transform: translateY(-120%) scale(0.8); opacity: 0; }
     70% { transform: translateY(5%) scale(1.05); opacity: 0.8; }
     100% { transform: translateY(0) scale(1); opacity: 0.7; }
   }
   ```
3. Apply `animation: planet-drop 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards` with staggered `animation-delay` (0s, 0.1s, 0.2s, …) per planet.

This achieves drop + bounce without Framer, but with less natural “settle” feel.
