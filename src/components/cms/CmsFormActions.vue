<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';

/**
 * Cancel + submit pair. Sits outside any card, at the end of the right-hand
 * column; on mobile it becomes a bar stuck to the bottom of the screen.
 * Never put form buttons in v-card-actions.
 */
withDefaults(
  defineProps<{
    submitLabel: string;
    cancelTo?: RouteLocationRaw;
    loading?: boolean;
    disabled?: boolean;
  }>(),
  { cancelTo: undefined }
);

defineEmits<{ cancel: [] }>();
</script>

<template>
  <div class="cms-form-actions">
    <v-btn variant="outlined" height="38" class="cms-form-actions__cancel" :to="cancelTo" @click="$emit('cancel')">
      Huỷ
    </v-btn>
    <v-btn
      color="primary"
      height="38"
      type="submit"
      class="cms-form-actions__submit"
      :loading="loading"
      :disabled="disabled"
    >
      {{ submitLabel }}
    </v-btn>
  </div>
</template>
