<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<template>
  <v-card variant="outlined" rounded="lg" elevation="0" class="cms-form-card">
    <div class="cms-form-card__header">{{ title }}</div>
    <div class="cms-form-card__body d-flex flex-column ga-3">
      <slot />
    </div>
    <div v-if="$slots.actions" class="pa-4 border-t-thin d-flex justify-end ga-2">
      <slot name="actions" />
    </div>
  </v-card>
</template>
