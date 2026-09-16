<script setup lang="ts">
/**
 * Confirmation dialog, 420px. Destructive use always names what is being
 * removed and says the action cannot be undone — see the dialog rules in
 * artboard 04.
 */
withDefaults(
  defineProps<{
    modelValue: boolean;
    title?: string;
    message?: string;
    confirmLabel?: string;
    /** Colour of the header icon and the tonal confirm button. */
    color?: 'error' | 'warning' | 'success' | 'primary';
    icon?: string;
    loading?: boolean;
  }>(),
  { title: 'Xác nhận xoá', confirmLabel: 'Xoá', color: 'error', icon: 'mdi-delete' }
);

const emit = defineEmits<{ 'update:modelValue': [value: boolean]; confirm: [] }>();
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="420"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card rounded="lg">
      <div class="pa-4 pb-2 d-flex align-center ga-3">
        <v-icon size="22" :color="color">{{ icon }}</v-icon>
        <span class="text-h5">{{ title }}</span>
      </div>
      <div class="px-4 pb-4 text-body-1 text-lightText">
        <slot>{{ message }}</slot>
      </div>
      <div class="pa-3 px-4 d-flex justify-end ga-2 border-t-thin">
        <v-btn variant="text" size="small" @click="emit('update:modelValue', false)">Huỷ</v-btn>
        <v-btn :color="color" variant="tonal" size="small" :loading="loading" @click="emit('confirm')">
          {{ confirmLabel }}
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>
