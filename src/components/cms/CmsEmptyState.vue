<script setup lang="ts">
withDefaults(
  defineProps<{
    /** 48px MDI glyph — mdi-inbox-outline for empty, mdi-cloud-off-outline for errors. */
    icon?: string;
    title: string;
    description?: string;
    /** "error" tints the glyph red; used by the failed-to-load state. */
    tone?: 'muted' | 'error';
  }>(),
  { icon: 'mdi-inbox-outline', tone: 'muted' }
);
</script>

<template>
  <div class="cms-state">
    <v-icon size="48" :color="tone === 'error' ? 'error' : 'lightText'">{{ icon }}</v-icon>
    <div class="cms-state__title">{{ title }}</div>
    <div v-if="description" class="cms-state__desc">{{ description }}</div>
    <div v-if="$slots.actions" class="d-flex ga-2 mt-1">
      <slot name="actions" />
    </div>
  </div>
</template>
