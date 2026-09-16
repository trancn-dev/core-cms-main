<script setup lang="ts">
import { computed, ref } from 'vue';

/**
 * Views-per-day line chart (artboard 06): current period as a solid primary
 * line over a 12% area, previous period as a dashed inputBorder line.
 * 3 horizontal grid lines, no vertical grid, filled dot on the last point.
 * Hover shows a crosshair and a tooltip for the nearest day.
 */
const props = withDefaults(
  defineProps<{
    labels: string[];
    current: number[];
    previous?: number[];
    currentLabel?: string;
    previousLabel?: string;
    height?: number;
  }>(),
  { currentLabel: 'Kỳ này', previousLabel: 'Kỳ trước', height: 220 }
);

const W = 700;
const PAD_TOP = 16;
const PAD_BOTTOM = 8;

const max = computed(() => Math.max(1, ...props.current, ...(props.previous ?? [])) * 1.1);
const x = (i: number) => (props.labels.length <= 1 ? 0 : (i / (props.labels.length - 1)) * W);
const y = (v: number) => PAD_TOP + (1 - v / max.value) * (props.height - PAD_TOP - PAD_BOTTOM);

const toPoints = (values: number[]) => values.map((v, i) => `${x(i)},${y(v)}`).join(' ');
const currentPoints = computed(() => toPoints(props.current));
const previousPoints = computed(() => (props.previous ? toPoints(props.previous) : ''));
const areaPoints = computed(
  () => `${currentPoints.value} ${x(props.current.length - 1)},${props.height} 0,${props.height}`
);
const gridY = computed(() => [0.25, 0.5, 0.75].map((f) => PAD_TOP + f * (props.height - PAD_TOP - PAD_BOTTOM)));
const last = computed(() => ({ x: x(props.current.length - 1), y: y(props.current[props.current.length - 1] ?? 0) }));

const fmt = (n: number) => n.toLocaleString('vi-VN');

// ─── Hover ──────────────────────────────────────────────────────────────────
const svgRef = ref<SVGSVGElement | null>(null);
const hover = ref<number | null>(null);

function onMove(e: PointerEvent) {
  const rect = svgRef.value?.getBoundingClientRect();
  if (!rect || props.labels.length < 2) return;
  const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
  hover.value = Math.round(ratio * (props.labels.length - 1));
}

const tipLeft = computed(() => (hover.value === null ? 0 : (x(hover.value) / W) * 100));
</script>

<template>
  <div class="cms-chart">
    <div class="d-flex ga-4 text-caption text-lightText mb-2 justify-end">
      <span class="d-flex align-center ga-2"><span class="cms-chart__dot bg-primary"></span>{{ currentLabel }}</span>
      <span v-if="previous" class="d-flex align-center ga-2"><span class="cms-chart__dot bg-inputBorder"></span>{{ previousLabel }}</span>
    </div>

    <div class="position-relative" @pointermove="onMove" @pointerleave="hover = null">
      <svg
        ref="svgRef"
        :viewBox="`0 0 ${W} ${height}`"
        preserveAspectRatio="none"
        :style="{ width: '100%', height: `${height}px`, display: 'block' }"
        role="img"
        :aria-label="`${currentLabel}: ${fmt(current[current.length - 1] ?? 0)} ở ngày cuối`"
      >
        <line v-for="gy in gridY" :key="gy" x1="0" :y1="gy" :x2="W" :y2="gy" class="cms-chart__grid" />
        <polyline
          v-if="previous"
          :points="previousPoints"
          fill="none"
          class="cms-chart__prev"
          vector-effect="non-scaling-stroke"
        />
        <polygon :points="areaPoints" class="cms-chart__area" />
        <polyline :points="currentPoints" fill="none" class="cms-chart__line" vector-effect="non-scaling-stroke" />
        <line
          v-if="hover !== null"
          :x1="x(hover)"
          :x2="x(hover)"
          y1="0"
          :y2="height"
          class="cms-chart__crosshair"
          vector-effect="non-scaling-stroke"
        />
      </svg>
      <!-- Dots live in HTML so they stay round when the SVG stretches -->
      <span class="cms-chart__end" :style="{ left: `${(last.x / W) * 100}%`, top: `${last.y}px` }"></span>
      <span
        v-if="hover !== null"
        class="cms-chart__end"
        :style="{ left: `${tipLeft}%`, top: `${y(current[hover])}px` }"
      ></span>

      <div
        v-if="hover !== null"
        class="cms-chart__tip"
        :class="{ 'is-flipped': tipLeft > 70 }"
        :style="{ left: `${tipLeft}%` }"
      >
        <div class="font-weight-medium mb-1">{{ labels[hover] }}</div>
        <div class="d-flex justify-space-between ga-4">
          <span class="text-lightText">{{ currentLabel }}</span><b>{{ fmt(current[hover]) }}</b>
        </div>
        <div v-if="previous" class="d-flex justify-space-between ga-4">
          <span class="text-lightText">{{ previousLabel }}</span><b>{{ fmt(previous[hover]) }}</b>
        </div>
      </div>
    </div>
  </div>
</template>
