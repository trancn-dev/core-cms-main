<script setup lang="ts">
import { computed, ref } from 'vue';

/**
 * Small donut with a labelled legend. The legend always carries the name and
 * percentage, so a segment is never identified by colour alone.
 */
const props = withDefaults(
  defineProps<{
    /** `color` is a theme colour name: primary, info, warning… */
    segments: { label: string; value: number; color: string }[];
    size?: number;
  }>(),
  { size: 90 }
);

const R = 34;
const C = 2 * Math.PI * R;
// 2px surface gap between segments
const GAP = 2;

const total = computed(() => props.segments.reduce((s, x) => s + x.value, 0) || 1);

const arcs = computed(() => {
  let offset = 0;
  return props.segments.map((s) => {
    const len = (s.value / total.value) * C;
    const arc = { ...s, dash: `${Math.max(0, len - GAP)} ${C}`, offset: -offset, pct: Math.round((s.value / total.value) * 100) };
    offset += len;
    return arc;
  });
});

const active = ref<number | null>(null);
</script>

<template>
  <div class="d-flex align-center ga-4">
    <svg viewBox="0 0 90 90" :width="size" :height="size" class="flex-shrink-0" role="img" :aria-label="arcs.map((a) => `${a.label} ${a.pct}%`).join(', ')">
      <circle cx="45" cy="45" :r="R" fill="none" class="cms-chart__track" stroke-width="16" />
      <circle
        v-for="(a, i) in arcs"
        :key="a.label"
        cx="45"
        cy="45"
        :r="R"
        fill="none"
        :stroke="`rgb(var(--v-theme-${a.color}))`"
        :stroke-width="active === i ? 18 : 16"
        :stroke-dasharray="a.dash"
        :stroke-dashoffset="a.offset"
        :opacity="active === null || active === i ? 1 : 0.45"
        transform="rotate(-90 45 45)"
        style="transition: opacity 0.15s ease, stroke-width 0.15s ease; cursor: pointer"
        @pointerenter="active = i"
        @pointerleave="active = null"
      >
        <title>{{ a.label }}: {{ a.pct }}%</title>
      </circle>
    </svg>

    <div class="d-flex flex-column ga-2 text-caption">
      <div
        v-for="(a, i) in arcs"
        :key="a.label"
        class="d-flex align-center ga-2"
        @pointerenter="active = i"
        @pointerleave="active = null"
      >
        <span class="cms-chart__dot" :class="`bg-${a.color}`"></span>
        <span class="text-lightText">{{ a.label }}</span>
        <b>{{ a.pct }}%</b>
      </div>
    </div>
  </div>
</template>
