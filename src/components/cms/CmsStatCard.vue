<script setup lang="ts">
import { computed } from 'vue';
import { TONE_COLORS, type StatusTone } from '@/utils/statusMaps';

const props = withDefaults(
  defineProps<{
    icon: string;
    label: string;
    value: string;
    /** e.g. "+12,4%" — rendered next to a trending arrow. */
    delta?: string;
    /** "up" is green, "down" is red. */
    direction?: 'up' | 'down';
    note?: string;
    tone?: StatusTone;
  }>(),
  { direction: 'up', tone: 'primary' }
);

const colors = computed(() => TONE_COLORS[props.tone]);
const deltaColor = computed(() => (props.direction === 'up' ? 'success' : 'error'));
</script>

<template>
  <v-card variant="outlined" rounded="lg" elevation="0">
    <v-card-text class="d-flex flex-column ga-3">
      <div class="d-flex align-center ga-3">
        <div class="cms-stat__icon" :class="[`bg-${colors.bg}`, `text-${colors.fg}`]">
          <v-icon size="20">{{ icon }}</v-icon>
        </div>
        <span class="text-body-2 text-lightText">{{ label }}</span>
      </div>

      <div class="d-flex align-baseline ga-3">
        <span class="text-h4">{{ value }}</span>
        <span v-if="delta" class="cms-stat__delta" :class="`text-${deltaColor}`">
          <v-icon size="14">{{ direction === 'up' ? 'mdi-trending-up' : 'mdi-trending-down' }}</v-icon>
          {{ delta }}
        </span>
      </div>

      <span v-if="note" class="text-caption text-lightText">{{ note }}</span>
    </v-card-text>
  </v-card>
</template>
