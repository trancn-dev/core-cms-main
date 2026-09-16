<script setup lang="ts">
import { computed } from 'vue';
import { getStatusMeta, TONE_COLORS, type StatusMapName } from '@/utils/statusMaps';

const props = withDefaults(
  defineProps<{
    /** Which enum to read the label and tone from. */
    type: StatusMapName;
    value?: string | null;
    /** 24px instead of 20px — for detail pages, not table rows. */
    size?: 'sm' | 'md';
  }>(),
  { size: 'md' }
);

const meta = computed(() => getStatusMeta(props.type, props.value));
const colors = computed(() => TONE_COLORS[meta.value.tone]);
</script>

<template>
  <span
    class="cms-chip"
    :class="[`bg-${colors.bg}`, `text-${colors.fg}`, { 'cms-chip--sm': props.size === 'sm' }]"
    >{{ meta.label }}</span
  >
</template>
