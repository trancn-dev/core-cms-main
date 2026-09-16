<script setup lang="ts">
/** One "label — value" line inside a detail card. */
defineProps<{ label: string; value?: string | number }>();
</script>

<template>
  <div class="cms-info-row">
    <span class="cms-info-row__label">{{ label }}</span>
    <span class="cms-info-row__value">
      <slot>{{ value ?? '—' }}</slot>
    </span>
  </div>
</template>
