<script setup lang="ts">
/** Settings toggle: label + short note on the left, switch on the right. */
defineProps<{ label: string; note?: string; color?: string }>();
const model = defineModel<boolean>({ default: false });
</script>

<template>
  <label class="cms-switch-row">
    <span class="d-flex flex-column">
      <span class="text-body-1">{{ label }}</span>
      <span v-if="note" class="text-caption text-lightText">{{ note }}</span>
    </span>
    <v-switch v-model="model" :color="color ?? 'primary'" density="compact" hide-details inset class="flex-grow-0" />
  </label>
</template>
